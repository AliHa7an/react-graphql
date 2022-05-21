import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  NormalizedCacheObject,
  gql,
  Observable,
  FetchResult,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLError } from "graphql";
import decode from "jwt-decode";
import { setContext } from "@apollo/client/link/context";

export function getTokenState(token?: string | null) {
  if (!token) {
    return { valid: false, needRefresh: true };
  }
  const decoded: any = decode(token);
  if (!decoded) {
    return { valid: false, needRefresh: true };
  } else if (decoded.exp && Date.now() + 1 >= decoded.exp * 1000) {
    return { valid: true, needRefresh: true };
  } else {
    return { valid: true, needRefresh: false };
  }
}

export let client: ApolloClient<NormalizedCacheObject>;

const refreshAuthToken = async () => {
  return client
    .mutate({
      mutation: gql`
        mutation refreshTokenV2 {
          refreshTokenV2 {
            access_token
            refresh_token
            user {
              id
              username
            }
          }
        }
      `,
    })
    .then((res) => {
      const newAccessToken = res.data?.refreshTokenV2?.access_token;
      const refreshToken = res.data?.refreshTokenV2?.refresh_token;
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return newAccessToken;
    })
    .catch((err) => {
      localStorage.clear();
      throw err;
    });
};

const apolloAuthLink = setContext(async (request, { headers }) => {
  if (request.operationName === "refreshTokenV2") {
    let refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${refreshToken}`,
        },
      };
    } else {
      return { headers };
    }
  }

  let token = localStorage.getItem("accessToken");
  const tokenState = getTokenState(token);
  if (token && tokenState.needRefresh) {
    const refreshPromise = refreshAuthToken();

    if (tokenState.valid === false) {
      token = await refreshPromise;
    }
  }

  if (token) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
  } else {
    return { headers };
  }
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log("graphql error", err);
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
          case "INTERNAL_SERVER_ERROR":
            if (operation.operationName === "refreshTokenV2") return;

            const observable = new Observable<FetchResult<Record<string, any>>>(
              (observer) => {
                (async () => {
                  try {
                    const accessToken = await refreshAuthToken();

                    if (!accessToken) {
                      throw new GraphQLError("Empty AccessToken");
                    }
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                  } catch (err) {
                    observer.error(err);
                  }
                })();
              }
            );

            return observable;
        }
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const link = from([
  errorLink,
  apolloAuthLink,
  new HttpLink({ uri: "https://frontend-test-api.aircall.io/graphql" }),
]);

client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});
