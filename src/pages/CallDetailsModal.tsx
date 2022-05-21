//@ts-nocheck
import { useQuery } from "@apollo/client";
import { Row, Col, Button, Modal, Spinner, Form } from "react-bootstrap";
import { CALL } from "../graphql/Queries";
import { ON_UPDATE_CALL } from "../graphql/Subscription";
import { ADD_ARCHIVE, ADD_NOTE_MUTATION } from "../graphql/Mutations";
import React, { useState } from "react";
import { useSubscription, useMutation } from "@apollo/client";
const CallDetailModal = ({
  id,
  showModal,
  closeModal,
}: {
  id: string;
  closeModal: (flag: boolean) => void;
  showModal: boolean;
}) => {
  const [content, setContent] = useState();
  const [isAddNote, setIsAddNote] = useState(false);
  const { data, loading } = useQuery<Call>(CALL, { variables: { id } });
  const [archiveCall, { error, data: addArchiData }] =
    useMutation<Call>(ADD_ARCHIVE);
  const [addNote, { error: noteErrors, data: noteData }] =
    useMutation<Call>(ADD_NOTE_MUTATION);
  //   const { data: updatedCallData } = useSubscription<Call>(ON_UPDATE_CALL, {
  //     variables: { id },
  //   });
  return (
    <Modal key={id} centered show={showModal} onHide={() => closeModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Call Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner size={3} />
        ) : (
          <Row>
            <Col>Duration: {data?.call?.duration} sec</Col>
            <Col>Direction: {data?.call?.direction}</Col>
            <Col>Call_Type: {data?.call?.call_type}</Col>
            <Col>
              Is_Archived: {data?.call?.is_archived === true ? "true" : "false"}
            </Col>
            <Col>Via: {data?.call?.via}</Col>
            <Row>
              &nbsp; Notes:
              {data?.call?.notes?.length === 0
                ? "  No note found"
                : data?.call?.notes?.map((note, i) => (
                    <small key={`note_` + i}>{note.content}</small>
                  ))}
            </Row>
          </Row>
        )}
        {isAddNote && (
          <Row>
            <Form.Control
              onChange={(e) => setContent(e.target.value)}
              className="mb-3 mt-3"
              type="text"
              placeholder="Enter Content here"
            />
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        {isAddNote && (
          <span style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{ justifySelf: "flex-end" }}
              variant="primary"
              size="sm"
              onClick={() => {
                addNote({
                  variables: {
                    input: {
                      content,
                      activityId: id,
                    },
                  },
                });
              }}
            >
              Add
            </Button>
          </span>
        )}
        {!isAddNote && (
          <span>
            <Button
              style={{ justifySelf: "flex-end" }}
              variant="primary"
              size="sm"
              onClick={() => {
                setIsAddNote(true);
              }}
            >
              Add Note
            </Button>
          </span>
        )}
        <span style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ justifySelf: "flex-end" }}
            variant="primary"
            size="sm"
            onClick={() => {
              archiveCall({
                variables: {
                  id,
                },
              });
            }}
          >
            {!data?.call?.is_archived ? "Archive" : "unArchive"}
          </Button>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default CallDetailModal;
