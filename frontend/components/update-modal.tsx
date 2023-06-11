import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
} from "@patternfly/react-core";

export const UpdateModal = ({
  applyUpdate,
  dismissUpdate,
}: {
  applyUpdate: () => void;
  dismissUpdate: () => void;
}) => (
  <div className="pf-x-global-alerts-container pf-u-p-lg">
    <Alert
      variant="info"
      title="Update available"
      actionClose={<AlertActionCloseButton onClose={dismissUpdate} />}
      actionLinks={
        <>
          <AlertActionLink onClick={applyUpdate}>Update now</AlertActionLink>
          <AlertActionLink onClick={dismissUpdate}>Ignore</AlertActionLink>
        </>
      }
    >
      <p>A new version of ChatScape is available.</p>
    </Alert>
  </div>
);
