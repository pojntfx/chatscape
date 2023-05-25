import {
  Avatar,
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  InputGroup,
  KebabToggle,
  List,
  ListItem,
  Page,
  PageSection,
  Popover,
  SearchInput,
  SkipToContent,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  DownloadIcon,
  EllipsisVIcon,
  GlobeIcon,
  PlusIcon,
} from "@patternfly/react-icons";
import Image from "next/image";
import { useState } from "react";
import logo from "../public/logo-light.png";

const contacts = [
  {
    name: "Jane Doe",
    intro: "Optio, voluptate accus",
    avatar: "/avatar.svg",
  },
  {
    name: "Jean Doe",
    intro: "Quas iste doloribus",
    avatar: "/avatar.svg",
  },
  {
    name: "Luo Wenzao",
    intro: "Dolor sit amet",
    avatar: "/avatar.svg",
  },
];

const activeContactID = 0;

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isUserActionsOpen, setIsUserActionsOpen] = useState(false);

  return (
    <Page
      className="pf-c-page--background"
      skipToContent={
        <SkipToContent href="#main">Skip to content</SkipToContent>
      }
      mainContainerId="main"
    >
      <PageSection
        className="pf-u-p-0 pf-c-page__main-section--transparent"
        id="main"
      >
        {loggedIn ? (
          <Drawer isExpanded isInline position="left">
            <DrawerContent
              panelContent={
                <DrawerPanelContent
                  className="pf-c-drawer__panel--transparent"
                  widths={{ default: "width_33" }}
                >
                  <Toolbar className="pf-u-m-0" isSticky>
                    <ToolbarContent className="pf-u-px-lg">
                      <ToolbarItem className="pf-u-display-flex">
                        <Avatar src="/avatar.svg" alt="avatar" />
                      </ToolbarItem>

                      <ToolbarItem className="pf-u-flex-1">
                        <SearchInput
                          aria-label="Search"
                          placeholder="Search"
                          className="pf-c-search--main"
                        />
                      </ToolbarItem>

                      <ToolbarItem>
                        <Popover
                          aria-label="Add a content"
                          hasAutoWidth
                          showClose={false}
                          isVisible={isPopoverOpen}
                          shouldOpen={() => setIsPopoverOpen(true)}
                          shouldClose={() => setIsPopoverOpen(false)}
                          bodyContent={() => (
                            <div>
                              <div className="pf-c-title pf-m-md">
                                Add a contact
                              </div>

                              <InputGroup className="pf-u-mt-md">
                                <TextInput
                                  aria-label="Email of the account to add"
                                  type="email"
                                  placeholder="jean.doe@example.com"
                                />
                                <Button variant="control">
                                  <PlusIcon />
                                </Button>
                              </InputGroup>
                            </div>
                          )}
                        >
                          <Button variant="plain" aria-label="edit">
                            <PlusIcon />
                          </Button>
                        </Popover>
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>

                  <DrawerPanelBody className="pf-c-overflow-y pf-u-p-0">
                    <List isPlain>
                      {contacts.map((contact, id) => (
                        <ListItem key={id}>
                          <Button
                            variant="plain"
                            className="pf-u-display-flex pf-u-align-items-center pf-u-p-md pf-u-m-sm pf-u-contact-selector"
                            isActive={id === activeContactID}
                          >
                            <Avatar
                              src={contact.avatar}
                              alt="avatar"
                              className="pf-u-mr-md"
                            />

                            <div className="pf-u-display-flex pf-u-flex-direction-column pf-u-align-items-flex-start pf-u-justify-content-center">
                              <div className="pf-u-font-family-heading-sans-serif">
                                {contact.name}
                              </div>

                              <div className="pf-u-icon-color-light">
                                {contact.intro} ...
                              </div>
                            </div>
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </DrawerPanelBody>
                </DrawerPanelContent>
              }
            >
              <Toolbar className="pf-u-m-0" isSticky>
                <ToolbarContent className="pf-u-px-lg">
                  <ToolbarGroup>
                    <ToolbarItem className="pf-u-display-flex">
                      <span className="pf-u-icon-color-light pf-u-mr-xs">
                        To:
                      </span>{" "}
                      Jane Doe
                    </ToolbarItem>
                  </ToolbarGroup>

                  <ToolbarGroup
                    alignment={{
                      default: "alignRight",
                    }}
                  >
                    <Dropdown
                      position={DropdownPosition.right}
                      onSelect={() => setIsUserActionsOpen((v) => !v)}
                      toggle={
                        <KebabToggle
                          id="toggle-kebab"
                          onToggle={() => setIsUserActionsOpen((v) => !v)}
                        />
                      }
                      isOpen={isUserActionsOpen}
                      isPlain
                      dropdownItems={[
                        <DropdownItem
                          key="1"
                          component="button"
                          onClick={() =>
                            confirm(
                              "Are you sure you want to block this user? You will have to manually add them as a contact if you want to contact them again."
                            )
                          }
                        >
                          Block
                        </DropdownItem>,
                        <DropdownItem key="2" component="button">
                          Report
                        </DropdownItem>,
                      ]}
                    />
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>

              <DrawerContentBody className="pf-u-p-lg pf-c-overflow-y">
                <List isPlain>
                  <ListItem>
                    <Card
                      isCompact
                      isFlat
                      isRounded
                      className="pf-c-card--them"
                    >
                      <CardBody>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Blanditiis dolor hic temporibus nesciunt enim
                        optio, voluptate accusamus, sit eum cumque suscipit
                        rerum, vel quae quas iste doloribus modi ipsa fugit.
                      </CardBody>
                    </Card>
                  </ListItem>
                  <ListItem>
                    <span className="pf-c-date">Today 16:02</span>
                  </ListItem>
                  <ListItem>
                    <Card isCompact isFlat isRounded className="pf-c-card--us">
                      <CardBody>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Blanditiis dolor hic temporibus nesciunt enim
                        optio.
                      </CardBody>
                    </Card>
                  </ListItem>
                  <ListItem>
                    <Card isCompact isFlat isRounded className="pf-c-card--us">
                      <CardBody>Lorem!</CardBody>
                    </Card>
                  </ListItem>
                  <ListItem>
                    <Card
                      isCompact
                      isFlat
                      isRounded
                      className="pf-c-card--them"
                    >
                      <CardBody>
                        Optio, voluptate accusamus, sit eum cumque suscipit
                        rerum, vel quae quas iste doloribus modi ipsa fugit.
                      </CardBody>
                    </Card>
                  </ListItem>
                  <ListItem>
                    <span className="pf-c-date">Today 16:10</span>
                  </ListItem>
                </List>
              </DrawerContentBody>

              <Toolbar className="pf-u-m-0 pf-u-pt-md pf-u-box-shadow-sm-top pf-u-box-shadow-none-bottom pf-c-toolbar--sticky-bottom">
                <ToolbarContent className="pf-u-px-lg">
                  <ToolbarItem className="pf-u-flex-1">
                    <TextInput
                      type="text"
                      aria-label="Message to send"
                      placeholder="Your message"
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </DrawerContent>
          </Drawer>
        ) : (
          <div className="pf-x-login-page pf-u-h-100 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-md">
            <Image src={logo} alt="ChatScape logo" className="pf-x-logo" />

            <Title
              headingLevel="h3"
              className="pf-u-mt-sm pf-u-mb-lg pf-x-subtitle"
            >
              Scalable Serverless Chat
            </Title>

            <div className="pf-x-ctas">
              <Button
                variant="primary"
                icon={<DownloadIcon />}
                className="pf-u-mr-0 pf-u-mr-sm-on-sm pf-u-mb-sm pf-u-mb-0-on-sm"
                onClick={() => setLoggedIn(true)}
              >
                Download the app
              </Button>{" "}
              <Button
                variant="link"
                className="pf-u-mb-sm pf-u-mb-0-on-sm"
                onClick={() => setLoggedIn(true)}
              >
                Open in browser <GlobeIcon />
              </Button>
            </div>
          </div>
        )}
      </PageSection>
    </Page>
  );
}
