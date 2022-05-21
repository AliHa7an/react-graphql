import { gql } from "@apollo/client";

export const PAGINATED_CALLS = gql`
  query {
    paginatedCalls {
      totalCount
      hasNextPage
      nodes {
        duration
        direction
        id
        via
        from
        call_type
        created_at
        is_archived
        to
        notes {
          content
          id
        }
      }
    }
  }
`;

export const CALL = gql`
  query call($id: ID!) {
    call(id: $id) {
      duration
      direction
      id
      via
      from
      call_type
      created_at
      is_archived
      to
      notes {
        content
        id
      }
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      username
    }
  }
`;
