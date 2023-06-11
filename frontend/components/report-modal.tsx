import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextArea,
} from "@patternfly/react-core";
import { useState } from "react";

export const ReportModal = ({
  name,
  modalOpen,
  closeModal,
  reportContact,
}: {
  name: string;
  modalOpen: boolean;
  closeModal: () => void;
  reportContact: (comment: string) => void;
}) => {
  const [reportFormComment, setReportFormComment] = useState("");

  return (
    <Modal
      bodyAriaLabel="Report modal"
      variant={ModalVariant.small}
      title={`Report ${name}`}
      isOpen={modalOpen}
      onClose={closeModal}
      actions={[
        <Button key="report" variant="danger" type="submit" form="report-form">
          Report
        </Button>,
        <Button key="cancel" variant="link" onClick={() => closeModal}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        id="report-form"
        onSubmit={() => {
          reportContact(reportFormComment);
          closeModal();
        }}
        noValidate={false}
      >
        <FormGroup
          label="Your comment and the messages in violations of our policy"
          isRequired
          fieldId="report-form-comment"
        >
          <TextArea
            isRequired
            required
            id="report-form-comment"
            name="report-form-comment"
            value={reportFormComment}
            onChange={(v) => setReportFormComment(v)}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
