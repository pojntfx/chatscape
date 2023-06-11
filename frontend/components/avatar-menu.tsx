import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
} from "@patternfly/react-core";

export const AvatarMenu = ({
  right,
  toggleAccountActions,
  accountActionsOpen,
  avatarURL,
  logOut,
  openAboutModal,
}: {
  right?: boolean;
  toggleAccountActions: () => void;
  accountActionsOpen: boolean;
  avatarURL: string;
  logOut: () => void;
  openAboutModal: () => void;
}) => (
  <Dropdown
    position={right ? DropdownPosition.right : undefined}
    onSelect={() => toggleAccountActions()}
    className="pf-u-display-flex"
    toggle={
      <DropdownToggle
        toggleIndicator={null}
        onToggle={() => toggleAccountActions()}
        aria-label="Toggle account actions"
        className="pf-u-p-0 pf-x-account-actions pf-x-avatar"
      >
        <Avatar src={avatarURL} alt="avatar" />
      </DropdownToggle>
    }
    isOpen={accountActionsOpen}
    isPlain
    dropdownItems={[
      <DropdownItem key="1" component="button" onClick={logOut}>
        Logout
      </DropdownItem>,
      <DropdownItem key="2" component="button" onClick={openAboutModal}>
        About
      </DropdownItem>,
    ]}
  />
);
