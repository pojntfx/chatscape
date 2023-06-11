import { Modal, ModalVariant } from "@patternfly/react-core";
import Image from "next/image";
import logo from "../public/logo-light.png";

export const AboutModal = ({
  aboutModalOpen,
  closeAboutModal,
}: {
  aboutModalOpen: boolean;
  closeAboutModal: () => void;
}) => (
  <Modal
    bodyAriaLabel="About modal"
    tabIndex={0}
    variant={ModalVariant.small}
    title="About"
    isOpen={aboutModalOpen}
    onClose={closeAboutModal}
  >
    <div className="pf-u-text-align-center">
      <Image
        src={logo}
        alt="ChatScape logo"
        className="pf-x-logo--about pf-u-mt-md pf-u-mb-lg"
      />

      <p>© AGPL-3.0 2023 Felicitas Pojtinger</p>

      <p>
        Find the source code here:{" "}
        <a href="https://github.com/pojntfx/chatscape" target="_blank">
          pojntfx/chatscape
        </a>{" "}
        (
        <a href="https://felicitas.pojtinger.com/imprint" target="_blank">
          Imprint
        </a>
        )
      </p>
    </div>
  </Modal>
);
