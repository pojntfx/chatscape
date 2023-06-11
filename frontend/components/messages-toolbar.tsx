import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Popover,
  ClipboardCopy,
  Skeleton,
  Dropdown,
  DropdownPosition,
  KebabToggle,
  DropdownItem,
} from "@patternfly/react-core";
import { ChevronLeftIcon, InfoCircleIcon } from "@patternfly/react-icons";

export const MessagesToolbar = ({
  setDrawerExpanded,
  contacts,
  activeContactID,
  setShowContactEmailOpen,
  showContactEmailOpen,
  setUserActionsOpen,
  userActionsOpen,
  setBlockModalOpen,
  setReportModalOpen,
}: {
  setDrawerExpanded: (value: boolean) => void;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  activeContactID: string;
  setShowContactEmailOpen: (value: boolean) => void;
  showContactEmailOpen: boolean;
  setUserActionsOpen: (value: (prevState: boolean) => boolean) => void;
  userActionsOpen: boolean;
  setBlockModalOpen: (value: boolean) => void;
  setReportModalOpen: (value: boolean) => void;
}) => (
  <Toolbar className="pf-u-m-0" isSticky>
    <ToolbarContent>
      <ToolbarGroup>
        <ToolbarItem className="pf-u-display-none-on-md">
          <Button
            variant="plain"
            aria-label="Back"
            onClick={() => setDrawerExpanded(true)}
          >
            <ChevronLeftIcon />
          </Button>
        </ToolbarItem>

        <ToolbarItem className="pf-u-display-flex">
          <span className="pf-u-icon-color-light pf-u-mr-xs">To:</span>{" "}
          {contacts.length > 0 ? (
            <div className="pf-u-display-flex pf-u-align-items-center">
              {contacts.find((c) => c.id === activeContactID)?.name}{" "}
              <Popover
                aria-label="Show contact email"
                hasAutoWidth
                showClose={false}
                isVisible={showContactEmailOpen}
                shouldOpen={() => setShowContactEmailOpen(true)}
                shouldClose={() => setShowContactEmailOpen(false)}
                bodyContent={() => (
                  <ClipboardCopy
                    isReadOnly
                    hoverTip="Copy email"
                    clickTip="Copied"
                  >
                    {contacts.find((c) => c.id === activeContactID)?.email}
                  </ClipboardCopy>
                )}
              >
                <Button
                  variant="plain"
                  aria-label="Show contact email"
                  className="pf-u-ml-xs pf-u-p-0 pf-u-display-flex"
                >
                  <InfoCircleIcon className="pf-u-icon-color-light pf-x-popover--extra" />
                </Button>
              </Popover>
            </div>
          ) : (
            <Skeleton screenreaderText="Loading contact info" width="100px" />
          )}
        </ToolbarItem>
      </ToolbarGroup>

      <ToolbarGroup
        alignment={{
          default: "alignRight",
        }}
      >
        {contacts.length > 0 ? (
          <Dropdown
            position={DropdownPosition.right}
            onSelect={() => setUserActionsOpen((v) => !v)}
            toggle={
              <KebabToggle
                aria-label="Toggle user actions"
                onToggle={() => setUserActionsOpen((v) => !v)}
              />
            }
            isOpen={userActionsOpen}
            isPlain
            dropdownItems={[
              <DropdownItem
                key="1"
                component="button"
                onClick={() => setBlockModalOpen(true)}
              >
                Block
              </DropdownItem>,
              <DropdownItem
                key="2"
                component="button"
                onClick={() => setReportModalOpen(true)}
              >
                Report
              </DropdownItem>,
            ]}
          />
        ) : (
          <Skeleton
            screenreaderText="Loading actions"
            height="36px"
            width="48px"
          />
        )}
      </ToolbarGroup>
    </ToolbarContent>
  </Toolbar>
);
