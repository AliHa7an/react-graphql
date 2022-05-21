import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import CallDetailModal from "../pages/CallDetailsModal";
import "../style/listgroup.scss";

function Items({ currentItems, setShowModal, setId, isGropuBy }: any) {
  if (isGropuBy) {
    return (
      <>
        {Object.entries(currentItems).map(([k, v]) => (
          <>
            <title>Current_Date: {k}</title>

            <Items
              currentItems={v}
              setShowModal={setShowModal}
              setId={setId}
              isGropuBy={false}
            />
          </>
        ))}
      </>
    );
  }
  return (
    <>
      <ul className="list-group">
        {currentItems &&
          currentItems.map((item: any, index: number) => (
            <li
              key={`${item.id}_index_${index}`}
              className="list-group-item"
              onClick={() => {
                setId(item.id);
                setShowModal(true);
              }}
            >
              <div className="d-flex w-100 justify-content-between">
                <h6 style={{ marginRight: 10 }} className="mb-1 mr-5">
                  From: {item.from}{" "}
                </h6>
                <h6 className="mb-1 ml-5">To: {item.to}</h6>
              </div>
              <small>Call Type: {item.call_type}</small>
            </li>
          ))}
      </ul>
    </>
  );
}

export function PaginatedItems({
  itemsPerPage,
  items,
  isGroupBy = false,
}: {
  itemsPerPage: number;
  items: any;
  isGroupBy: boolean;
}) {
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setId] = useState("");
  console.log({ isGroupBy, items });
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    if (!isGroupBy) {
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
    } else {
      setCurrentItems(items);
      setPageCount(
        Math.ceil((items[0].length + items[1].length) / itemsPerPage)
      );
    }
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };
  return (
    <>
      <Items
        currentItems={currentItems}
        setShowModal={setShowModal}
        setId={setId}
        isGroupBy={isGroupBy}
      />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={undefined}
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />
      <CallDetailModal
        showModal={showModal}
        id={selectedId}
        closeModal={(t) => setShowModal(t)}
      />
    </>
  );
}
