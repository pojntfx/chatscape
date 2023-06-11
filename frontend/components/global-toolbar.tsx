import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Popover,
  InputGroup,
  TextInput,
  Button,
} from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";
import { Ref } from "react";
import { AvatarMenu } from "./avatar-menu";

export const GlobalToolbar = ({
  toggleAccountActions,
  accountActionsOpen,
  avatarURL,
  logOut,
  openAboutModal,
  searchInputValue,
  setSearchInputValue,
  addContactPopoverOpen,
  setContactPopoverOpen,
  addContactEmailInputValue,
  setAddContactEmailInputValue,
  addContactEmailInputValueRef,
  submitAddContactEmailInput,
}: {
  toggleAccountActions: () => void;
  accountActionsOpen: boolean;
  avatarURL: string;
  logOut: () => void;
  openAboutModal: () => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  addContactPopoverOpen: boolean;
  setContactPopoverOpen: (isOpen: boolean) => void;
  addContactEmailInputValue: string;
  setAddContactEmailInputValue: (email: string) => void;
  addContactEmailInputValueRef: Ref<any>;
  submitAddContactEmailInput: () => void;
}) => (
  <Toolbar className="pf-u-m-0" isSticky>
    <ToolbarContent>
      <ToolbarItem className="pf-u-display-flex">
        <AvatarMenu
          toggleAccountActions={toggleAccountActions}
          accountActionsOpen={accountActionsOpen}
          avatarURL={avatarURL}
          logOut={logOut}
          openAboutModal={openAboutModal}
        />
      </ToolbarItem>

      <ToolbarItem className="pf-u-flex-1">
        <SearchInput
          aria-label="Search"
          placeholder="Search"
          className="pf-c-search--main"
          value={searchInputValue}
          onChange={(_, v) => setSearchInputValue(v)}
        />
      </ToolbarItem>

      <ToolbarItem>
        <Popover
          aria-label="Add a contact"
          hasAutoWidth
          showClose={false}
          isVisible={addContactPopoverOpen}
          shouldOpen={() => setContactPopoverOpen(true)}
          shouldClose={() => setContactPopoverOpen(false)}
          bodyContent={() => (
            <div>
              <div className="pf-c-title pf-m-md">Add a contact</div>

              <InputGroup className="pf-u-mt-md">
                <TextInput
                  aria-label="Email of the account to add"
                  type="email"
                  placeholder="jean.doe@example.com"
                  value={addContactEmailInputValue}
                  onChange={(v) => setAddContactEmailInputValue(v)}
                  ref={addContactEmailInputValueRef}
                  required
                  onKeyDown={(k) =>
                    k.key === "Enter" && submitAddContactEmailInput()
                  }
                />

                <Button variant="control" onClick={submitAddContactEmailInput}>
                  <PlusIcon />
                </Button>
              </InputGroup>
            </div>
          )}
        >
          <Button variant="plain" aria-label="Add a contact">
            <PlusIcon />
          </Button>
        </Popover>
      </ToolbarItem>
    </ToolbarContent>
  </Toolbar>
);
