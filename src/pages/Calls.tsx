import { useQuery } from "@apollo/client";
import { Button } from "react-bootstrap";
import { PaginatedItems } from "../components/PaginatedView";
import { PAGINATED_CALLS } from "../graphql/Queries";
import { groupBy } from "lodash";
import "../style/login.scss";
import { useState } from "react";

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

export const Calls = () => {
  const { data } = useQuery<PaginatedCalls>(PAGINATED_CALLS);
  const [isGroupBy, setGroupBy] = useState(false);
  let groupByDate;
  const handleGroupBy = () => {
    //@ts-ignore
    groupByDate = groupBy(data?.paginatedCalls?.nodes, (d) => d.created_at);
    setGroupBy(true);
    console.log({ groupByDate });
  };
  return (
    <>
      {data && (
        <PaginatedItems
          itemsPerPage={5}
          //@ts-ignore
          items={data?.paginatedCalls.nodes}
          isGroupBy={false}
        />
      )}
      <Button onClick={handleGroupBy} size="sm">
        Group By Date
      </Button>
    </>
  );
};
