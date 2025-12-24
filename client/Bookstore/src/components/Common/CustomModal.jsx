// Modal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, onClose, title, children, onConfirm, confirmText }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      {title && <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>}

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {onConfirm && (
          <Button variant="primary" onClick={onConfirm}>
            {confirmText || "Confirm"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
