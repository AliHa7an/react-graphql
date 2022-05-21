import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        username
      }
      access_token
      refresh_token
    }
  }
`;

export const ADD_NOTE_MUTATION = gql`
  mutation addNote($input: AddNoteInput!) {
    addNote(input: $input) {
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

export const ADD_ARCHIVE = gql`
  mutation archiveCall($id: ID!) {
    archiveCall(id: $id) {
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
