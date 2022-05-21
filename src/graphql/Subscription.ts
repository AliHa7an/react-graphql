import { gql } from "@apollo/client";

export const ON_UPDATE_CALL = gql`
  subscription onUpdatedCall {
    onUpdatedCall {
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
