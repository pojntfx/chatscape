import { Modal, ModalVariant, Button } from "@patternfly/react-core";

export const BlockModal = ({
  name,
  modalOpen,
  closeModal,
  blockContact,
}: {
  name: string;
  modalOpen: boolean;
  closeModal: () => void;
  blockContact: () => void;
}) => (
  <Modal
    bodyAriaLabel="Block modal"
    tabIndex={0}
    variant={ModalVariant.small}
    title={`Block ${name}`}
    isOpen={modalOpen}
    onClose={closeModal}
    actions={[
      <Button
        key="confirm"
        variant="danger"
        onClick={() => {
          blockContact();
          closeModal();
        }}
      >
        Block
      </Button>,
      <Button key="cancel" variant="link" onClick={closeModal}>
        Cancel
      </Button>,
    ]}
  >
    Are you sure you want to block {name}? You will have to manually add them as
    a contact if you want to contact them again.
  </Modal>
);
