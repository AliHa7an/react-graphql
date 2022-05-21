interface Note {
  id: string;
  content: string;
}

interface Call {
  id: string;
  direction: string;
  from: string;
  to: String;
  duration: number;
  via: string;
  is_archived: boolean;
  call_type: string;
  created_at: string;
  notes: [Note];
}

interface PaginatedCalls {
  nodes: [Call];
  totalCount: number;
  hasNextPage: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}
interface LoginInput {
  input: LoginCredentials;
}
