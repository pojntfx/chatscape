import { Button, Title, Tooltip } from "@patternfly/react-core";
import { DownloadIcon, GlobeIcon } from "@patternfly/react-icons";
import Image from "next/image";
import logo from "../public/logo-light.png";

export const LoginPage = ({
  installPWA,
  logIn,
}: {
  installPWA?: Function;
  logIn: () => void;
}) => (
  <div className="pf-x-login-page pf-u-h-100 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-lg">
    <div className="pf-u-flex-1 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-md">
      <Image src={logo} alt="ChatScape logo" className="pf-x-logo" priority />

      <Title headingLevel="h3" className="pf-u-mt-sm pf-u-mb-lg pf-x-subtitle">
        Scalable Serverless Chat
      </Title>

      <div className="pf-x-ctas">
        <Tooltip
          trigger={installPWA ? "manual" : undefined}
          isVisible={installPWA ? false : undefined}
          content={
            <div>
              Your browser doesn&apos;t support PWAs, please use Chrome, Edge or
              another compatible browser to install the app or add it to your
              homescreen manually.
            </div>
          }
        >
          <Button
            variant="primary"
            icon={<DownloadIcon />}
            className={
              "pf-u-mr-0 pf-u-mr-sm-on-sm pf-u-mb-sm pf-u-mb-0-on-sm " +
              (installPWA ? "" : "pf-m-unusable")
            }
            onClick={async () => installPWA?.()}
          >
            Install the app
          </Button>
        </Tooltip>{" "}
        <Button
          variant="link"
          className="pf-u-mb-sm pf-u-mb-0-on-sm"
          onClick={logIn}
        >
          Open in browser <GlobeIcon />
        </Button>
      </div>
    </div>

    <div className="pf-u-w-100 pf-u-pt">
      <div className="pf-l-flex pf-m-justify-content-space-between pf-x-footer">
        <div className="pf-l-flex__item">
          <a href="https://github.com/pojntfx/chatscape" target="_blank">
            © AGPL-3.0 2023 Felicitas Pojtinger
          </a>
        </div>
        <div className="pf-l-flex__item">
          <a href="https://felicitas.pojtinger.com/imprint" target="_blank">
            Imprint
          </a>
        </div>
      </div>
    </div>
  </div>
);
