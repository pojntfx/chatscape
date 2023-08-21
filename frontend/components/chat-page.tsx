import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  InputGroup,
  TextInput,
  Title,
} from "@patternfly/react-core";
import { AddressBookIcon, PlusIcon } from "@patternfly/react-icons";
import Image from "next/image";
import { RefObject } from "react";
import logo from "../public/logo-light.png";
import { AvatarMenu } from "./avatar-menu";

export const ChatPage = ({
  accountActionsOpen,
  avatarURL,
  logOut,
  initialNameInputValue,
  setInitialNameInputValue,
  initialNameInputValueRef,
  initialEmailInputValue,
  setInitialEmailInputValue,
  initialEmailInputValueRef,
  submitInitialEmailInput,
  openAboutModal,
  toggleAccountActions,
}: {
  accountActionsOpen: boolean;
  avatarURL: string;
  logOut: () => void;
  initialNameInputValue: string;
  setInitialNameInputValue: React.Dispatch<React.SetStateAction<string>>;
  initialNameInputValueRef: RefObject<HTMLInputElement>;
  initialEmailInputValue: string;
  setInitialEmailInputValue: React.Dispatch<React.SetStateAction<string>>;
  initialEmailInputValueRef: RefObject<HTMLInputElement>;
  submitInitialEmailInput: () => void;
  openAboutModal: () => void;
  toggleAccountActions: () => void;
}) => (
  <div className="pf-x-login-page pf-u-h-100 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-lg">
    <div className="pf-u-w-100 pf-u-pt">
      <div className="pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center pf-x-footer">
        <Image
          src={logo}
          alt="ChatScape logo"
          className="pf-x-logo pf-x-logo--empty pf-u-mr-sm"
        />
        <AvatarMenu
          right
          toggleAccountActions={toggleAccountActions}
          accountActionsOpen={accountActionsOpen}
          avatarURL={avatarURL}
          logOut={logOut}
          openAboutModal={openAboutModal}
        />
      </div>
    </div>

    <div className="pf-u-flex-1 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-p-md">
      <EmptyState>
        <EmptyStateIcon icon={AddressBookIcon} className="pf-x-text--intro" />

        <Title headingLevel="h1" size="lg">
          No contacts yet
        </Title>

        <EmptyStateBody className="pf-x-text--intro--subtitle">
          Add a friend&apos;s name and email address to chat with them!
        </EmptyStateBody>

        <InputGroup className="pf-u-mt-md pf-x-add-contact">
          <TextInput
            aria-label="Name of the account to add"
            type="text"
            placeholder="Jean Doe"
            value={initialNameInputValue}
            onChange={(v) => setInitialNameInputValue(v)}
            ref={initialNameInputValueRef}
            required
            onKeyDown={(k) =>
              k.key === "Enter" && initialEmailInputValueRef?.current?.focus()
            }
            className="pf-u-mr-md"
          />

          <TextInput
            aria-label="Email of the account to add"
            type="email"
            placeholder="jean.doe@example.com"
            value={initialEmailInputValue}
            onChange={(v) => setInitialEmailInputValue(v)}
            ref={initialEmailInputValueRef}
            required
            onKeyDown={(k) => k.key === "Enter" && submitInitialEmailInput()}
          />

          <Button variant="control" onClick={submitInitialEmailInput}>
            <PlusIcon />
          </Button>
        </InputGroup>
      </EmptyState>
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
