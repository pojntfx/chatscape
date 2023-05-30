import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  Avatar,
  Button,
  Card,
  CardBody,
  ClipboardCopy,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Form,
  FormGroup,
  InputGroup,
  KebabToggle,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Page,
  PageSection,
  Popover,
  SearchInput,
  Skeleton,
  SkipToContent,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import {
  AddressBookIcon,
  ChevronLeftIcon,
  DownloadIcon,
  GlobeIcon,
  InfoCircleIcon,
  PlusIcon,
} from "@patternfly/react-icons";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import logo from "../public/logo-light.png";
import { v4 } from "uuid";

declare global {
  interface Window {
    workbox: {
      messageSkipWaiting(): void;
      register(): void;
      addEventListener(name: string, callback: () => unknown): void;
    };
  }
}

const useWindowWidth = () => {
  const [windowSize, setWindowSize] = useState<number | undefined>();

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const useAPI = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [avatarURL] = useState("https://i.pravatar.cc/300?u=raina");

  const [contacts, setContacts] = useState<IContact[]>();
  const [messages, setMessages] = useState<IMessage[]>();

  const [activeContactID, setActiveContactID] = useState("");

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      let id = activeContactID;
      if (id === "") {
        id = apiData[0].id;

        setActiveContactID(id);
      }

      setMessages(apiData.find((c) => c.id === id)?.messages || []);
    }
  }, [contacts, activeContactID]);

  return {
    loggedIn,
    avatarURL,
    logIn: () => setLoggedIn(true),
    logOut: () => setLoggedIn(false),

    contacts,
    addContact: (email: string) => {
      setContacts((oldContacts) => {
        if (!oldContacts) oldContacts = apiData;

        const newID = v4();

        setActiveContactID(newID);

        return [
          ...oldContacts,
          {
            id: newID,
            name: email.split("@")[0] + " " + email.split("@")[1],
            email: email,
            intro: "Optio, voluptate accus",
            avatar: "https://i.pravatar.cc/300",
          },
        ];
      });
    },

    messages,
    addMessage: (body: string) =>
      setMessages((old) =>
        old
          ? [
              ...old,
              {
                them: false,
                body,
                date: new Date(),
              },
            ]
          : []
      ),

    activeContactID,
    setActiveContactID,

    blockContact: (id: string) => {
      setContacts((contacts) => {
        const newContacts = contacts?.filter((c) => c.id !== id);

        setActiveContactID(newContacts?.at(0)?.id || "");

        return newContacts;
      });
    },
    reportContact: (id: string, context: string) => {},
  };
};

let readyToInstallPWA: Event | undefined;
window.addEventListener("beforeinstallprompt", (e) => {
  localStorage.removeItem("pwa.isInstalled");

  readyToInstallPWA = e;
});

let pwaInstalled = false;
window.addEventListener("appinstalled", () => {
  localStorage.setItem("pwa.isInstalled", "true");

  readyToInstallPWA = undefined;

  pwaInstalled = true;
});

const usePWAInstaller = (
  onUpdateAvailable: () => void,
  afterInstall: () => void
) => {
  const [pwaInstallEvent, setPWAInstallEvent] = useState<Event | undefined>(
    undefined
  );

  useEffect(() => {
    const installHandler = (e: Event) => setPWAInstallEvent(() => e);
    window.addEventListener("beforeinstallprompt", installHandler);
    if (readyToInstallPWA) {
      installHandler(readyToInstallPWA);
    }

    const afterInstallHandler = () => afterInstall();
    window.addEventListener("appinstalled", afterInstallHandler);
    if (pwaInstalled || localStorage.getItem("pwa.isInstalled") === "true") {
      afterInstallHandler();
    }

    window.workbox?.addEventListener("waiting", () => onUpdateAvailable());

    window.workbox?.register();

    return () => {
      window.removeEventListener("appinstalled", afterInstallHandler);
      window.removeEventListener("beforeinstallprompt", installHandler);
    };
  }, [afterInstall, onUpdateAvailable]);

  const [installPWA, setInstallPWA] = useState<Function | undefined>(undefined);
  useEffect(() => {
    if (pwaInstallEvent)
      setInstallPWA(() => () => (pwaInstallEvent as any)?.prompt?.());
  }, [pwaInstallEvent]);

  return {
    installPWA,
    updatePWA: () => {
      window.workbox?.addEventListener("controlling", () =>
        window.location.reload()
      );

      window.workbox?.messageSkipWaiting();
    },
  };
};

interface IContact {
  id: string;
  name: string;
  email: string;
  intro: string;
  avatar: string;
}

interface IMessage {
  them: boolean;
  body: string;
  date: Date;
}

const apiData = [
  {
    id: "827bb564-fe22-11ed-b4fe-98fc84efb5c8",
    name: "Jane Doe",
    email: "jane@doe.com",
    intro: "Optio, voluptate accus",
    avatar: "https://i.pravatar.cc/300?u=jane",
    messages: [
      {
        them: true,
        body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis dolor hic temporibus nesciunt enim optio, voluptate accusamus, sit eum cumque suscipit rerum, vel quae quas iste doloribus modi ipsa fugit.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 5);
          return now;
        })(),
      },
      {
        them: false,
        body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis dolor hic temporibus nesciunt enim optio.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 2);
          return now;
        })(),
      },
      {
        them: false,
        body: "Lorem!",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 2);
          return now;
        })(),
      },
      {
        them: true,
        body: "Optio, voluptate accusamus, sit eum cumque suscipit rerum, vel quae quas iste doloribus modi ipsa fugit.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 1);
          return now;
        })(),
      },
    ],
  },
  {
    id: "ad2916b8-fe21-11ed-b903-98fc84efb5c8",
    name: "Jean Doe",
    email: "jean@doe.com",
    intro: "Quas iste doloribus",
    avatar: "https://i.pravatar.cc/300?u=jean",
    messages: [
      {
        them: false,
        body: "Pharetra sit amet magna. Sed sollicitudin quam eu malesuada dapibus. Nullam risus nibh, aliquet vitae faucibus sit amet, pretium ac mi. Vivamus vulputate gravida enim, non finibus justo pretium commodo.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 5);
          return now;
        })(),
      },
      {
        them: true,
        body: "Fusce vestibulum porttitor nibh, non pellentesque lacus lobortis non. Pellentesque tincidunt et ipsum quis iaculis. Sed vulputate imperdiet facilisis.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 5);
          return now;
        })(),
      },
    ],
  },
  {
    id: "b57bae3e-fe21-11ed-b1c9-98fc84efb5c8",
    name: "Luo Wenzao",
    email: "luo@wenzao.com",
    intro: "Dolor sit amet",
    avatar: "https://i.pravatar.cc/300?u=luo",
    messages: [
      {
        them: true,
        body: "Suspendisse vulputate, ipsum consectetur lacinia rhoncus, ante lacus pharetra quam, eget accumsan felis justo eget leo.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 5);
          return now;
        })(),
      },
      {
        them: true,
        body: "Interdum et malesuada fames ac ante ipsum primis in faucibus.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 5);
          return now;
        })(),
      },
      {
        them: true,
        body: "Donec aliquam nibh eu risus sollicitudin",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours() - 3);
          return now;
        })(),
      },
      {
        them: false,
        body: "Maecenas rhoncus sapien et varius pulvinar.",
        date: (() => {
          const now = new Date();
          now.setHours(now.getHours());
          return now;
        })(),
      },
    ],
  },
];

export default function Home() {
  const [addContactPopoverOpen, setContactPopoverOpen] = useState(false);
  const [accountActionsOpen, setAccountActionsOpen] = useState(false);
  const [userActionsOpen, setUserActionsOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showContactEmailOpen, setShowContactEmailOpen] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [reportFormCommentContent, setReportFormCommentContent] = useState("");

  const width = useWindowWidth();

  const {
    loggedIn,
    avatarURL,
    logIn,
    logOut,

    contacts,
    addContact,

    messages,
    addMessage,

    activeContactID,
    setActiveContactID,

    blockContact,
    reportContact,
  } = useAPI();

  const { installPWA, updatePWA } = usePWAInstaller(
    () => setUpdateAvailable(true),
    logIn
  );

  const [initialEmailInputValue, setInitialEmailInputValue] = useState("");
  const initialEmailInputValueRef = useRef<HTMLInputElement>(null);
  const submitInitialEmailInput = useCallback(() => {
    if (
      initialEmailInputValueRef?.current?.reportValidity() &&
      initialEmailInputValue.trim() !== ""
    ) {
      addContact(initialEmailInputValue);
      setInitialEmailInputValue("");
    } else {
      initialEmailInputValueRef.current?.focus();
    }
  }, [addContact, initialEmailInputValue]);

  const [addContactEmailInputValue, setAddContactEmailInputValue] =
    useState("");
  const addContactEmailInputValueRef = useRef<HTMLInputElement>(null);
  const submitAddContactEmailInput = useCallback(() => {
    if (
      addContactEmailInputValueRef?.current?.reportValidity() &&
      addContactEmailInputValue.trim() !== ""
    ) {
      addContact(addContactEmailInputValue);
      setAddContactEmailInputValue("");
      setContactPopoverOpen(false);
    } else {
      addContactEmailInputValueRef.current?.focus();
    }
  }, [addContact, addContactEmailInputValue]);

  const [addMessageInputValue, setAddMessageInputValue] = useState("");
  const addMessageInputValueRef = useRef<HTMLInputElement>(null);
  const submitAddMessageInput = useCallback(() => {
    if (addMessageInputValue.trim() !== "") {
      addMessage(addMessageInputValue);
      setAddMessageInputValue("");
    } else {
      addMessageInputValueRef.current?.focus();
    }
  }, [addMessage, addMessageInputValue]);

  const contactList = contacts?.filter((c) =>
    c.name.includes(searchInputValue)
  );

  useEffect(() => {
    if (!width || width >= 768) {
      setDrawerExpanded(true);
    }
  }, [width]);

  const lastMessageRef = useRef<HTMLSpanElement>(null);

  useEffect(
    () => lastMessageRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  const AvatarMenu = ({ right }: { right?: boolean }) => (
    <Dropdown
      position={right ? DropdownPosition.right : undefined}
      onSelect={() => setAccountActionsOpen((v) => !v)}
      className="pf-u-display-flex"
      toggle={
        <DropdownToggle
          toggleIndicator={null}
          onToggle={() => setAccountActionsOpen((v) => !v)}
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
        <DropdownItem
          key="2"
          component="button"
          onClick={() => setAboutModalOpen(true)}
        >
          About
        </DropdownItem>,
      ]}
    />
  );

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
          contacts ? (
            <>
              <Drawer isExpanded={drawerExpanded} isInline position="left">
                <DrawerContent
                  panelContent={
                    <DrawerPanelContent
                      className="pf-c-drawer__panel--transparent"
                      widths={{ default: "width_33" }}
                    >
                      <Toolbar className="pf-u-m-0" isSticky>
                        <ToolbarContent>
                          <ToolbarItem className="pf-u-display-flex">
                            <AvatarMenu />
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
                                  <div className="pf-c-title pf-m-md">
                                    Add a contact
                                  </div>

                                  <InputGroup className="pf-u-mt-md">
                                    <TextInput
                                      aria-label="Email of the account to add"
                                      type="email"
                                      placeholder="jean.doe@example.com"
                                      value={addContactEmailInputValue}
                                      onChange={(v) =>
                                        setAddContactEmailInputValue(v)
                                      }
                                      ref={addContactEmailInputValueRef}
                                      required
                                      onKeyDown={(k) =>
                                        k.key === "Enter" &&
                                        submitAddContactEmailInput()
                                      }
                                    />

                                    <Button
                                      variant="control"
                                      onClick={submitAddContactEmailInput}
                                    >
                                      <PlusIcon />
                                    </Button>
                                  </InputGroup>
                                </div>
                              )}
                            >
                              <Button
                                variant="plain"
                                aria-label="Add a contact"
                              >
                                <PlusIcon />
                              </Button>
                            </Popover>
                          </ToolbarItem>
                        </ToolbarContent>
                      </Toolbar>

                      <DrawerPanelBody className="pf-c-overflow-y pf-u-p-0 pf-x-contact-list">
                        <List isPlain>
                          {contacts.length > 0 ? (
                            contactList && contactList.length > 0 ? (
                              contactList.map((contact, i) => (
                                <ListItem key={i}>
                                  <Button
                                    variant="plain"
                                    className="pf-u-display-flex pf-u-align-items-center pf-u-p-md pf-u-contact-selector pf-u-w-100"
                                    isActive={contact.id === activeContactID}
                                    onClick={() => {
                                      setActiveContactID(contact.id);

                                      if (!(!width || width >= 768)) {
                                        setDrawerExpanded(false);
                                      }
                                    }}
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
                              ))
                            ) : (
                              <ListItem>
                                <EmptyState variant={EmptyStateVariant.xs}>
                                  <EmptyStateBody>
                                    No contacts found
                                  </EmptyStateBody>
                                </EmptyState>
                              </ListItem>
                            )
                          ) : (
                            [0, 1, 2].map((_, i) => (
                              <ListItem key={i}>
                                <Button
                                  variant="plain"
                                  className="pf-u-display-flex pf-u-align-items-center pf-u-p-md pf-u-contact-selector pf-u-w-100"
                                  disabled
                                >
                                  <Skeleton
                                    shape="circle"
                                    width="36px"
                                    height="36px"
                                    screenreaderText="Loading avatar"
                                    className="pf-u-mr-md"
                                  />

                                  <div className="pf-u-display-flex pf-u-flex-direction-column pf-u-align-items-flex-start pf-u-justify-content-center pf-u-flex-1">
                                    <div className="pf-u-font-family-heading-sans-serif pf-u-w-100 pf-u-pb-sm">
                                      <Skeleton
                                        screenreaderText="Loading contact info"
                                        width={
                                          (i % 2 != 0 ? 33 : 66) +
                                          (i % 2) * 10 +
                                          "%"
                                        }
                                      />
                                    </div>

                                    <div className="pf-u-icon-color-light pf-u-w-100">
                                      <Skeleton
                                        screenreaderText="Loading contact info"
                                        width={
                                          (i % 2 == 0 ? 33 : 66) +
                                          (i % 2) * 10 +
                                          "%"
                                        }
                                      />
                                    </div>
                                  </div>
                                </Button>
                              </ListItem>
                            ))
                          )}
                        </List>
                      </DrawerPanelBody>
                    </DrawerPanelContent>
                  }
                >
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
                          <span className="pf-u-icon-color-light pf-u-mr-xs">
                            To:
                          </span>{" "}
                          {contacts.length > 0 ? (
                            <div className="pf-u-display-flex pf-u-align-items-center">
                              {
                                contacts.find((c) => c.id === activeContactID)
                                  ?.name
                              }{" "}
                              <Popover
                                aria-label="Show contact email"
                                hasAutoWidth
                                showClose={false}
                                isVisible={showContactEmailOpen}
                                shouldOpen={() => setShowContactEmailOpen(true)}
                                shouldClose={() =>
                                  setShowContactEmailOpen(false)
                                }
                                bodyContent={() => (
                                  <ClipboardCopy
                                    isReadOnly
                                    hoverTip="Copy email"
                                    clickTip="Copied"
                                  >
                                    {
                                      contacts.find(
                                        (c) => c.id === activeContactID
                                      )?.email
                                    }
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
                            <Skeleton
                              screenreaderText="Loading contact info"
                              width="100px"
                            />
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

                  <DrawerContentBody className="pf-u-p-lg pf-c-overflow-y">
                    <List isPlain>
                      {messages ? (
                        messages.length > 0 ? (
                          messages.map((message, i) => (
                            <Fragment key={i}>
                              <ListItem>
                                <Card
                                  isCompact
                                  isRounded
                                  className={
                                    "pf-c-card--message " +
                                    (message.them
                                      ? "pf-c-card--them"
                                      : "pf-c-card--us")
                                  }
                                >
                                  <CardBody>{message.body}</CardBody>
                                </Card>
                              </ListItem>

                              {(messages[i + 1] &&
                                Math.abs(
                                  message.date.getTime() -
                                    messages[i + 1].date.getTime()
                                ) /
                                  (1000 * 60 * 60) >
                                  2) ||
                              i === messages.length - 1 ? (
                                <ListItem>
                                  <span
                                    ref={
                                      i === messages.length - 1
                                        ? lastMessageRef
                                        : undefined
                                    }
                                    className="pf-c-date"
                                  >
                                    {`Today ${message.date
                                      .getHours()
                                      .toString()
                                      .padStart(2, "0")}:${message.date
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0")}`}
                                  </span>
                                </ListItem>
                              ) : null}
                            </Fragment>
                          ))
                        ) : (
                          <ListItem>
                            <EmptyState variant={EmptyStateVariant.xs}>
                              <EmptyStateBody className="pf-u-mt-0">
                                No messages yet
                              </EmptyStateBody>
                            </EmptyState>
                          </ListItem>
                        )
                      ) : (
                        <>
                          <ListItem>
                            <Skeleton
                              screenreaderText="Loading messages"
                              width="90%"
                            />
                          </ListItem>

                          <ListItem>
                            <Skeleton
                              screenreaderText="Loading messages"
                              width="66%"
                            />
                          </ListItem>

                          <ListItem>
                            <Skeleton
                              screenreaderText="Loading messages"
                              width="77%"
                            />
                          </ListItem>

                          <ListItem>
                            <Skeleton
                              screenreaderText="Loading messages"
                              width="33%"
                            />
                          </ListItem>

                          <ListItem className="pf-u-mt-3xl">
                            <Skeleton
                              screenreaderText="Loading messages"
                              width="66%"
                              className="pf-u-ml-auto"
                            />
                          </ListItem>

                          <ListItem>
                            <Skeleton
                              screenreaderText="Loading messages"
                              width="33%"
                              className="pf-u-ml-auto"
                            />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </DrawerContentBody>

                  <Toolbar className="pf-u-m-0 pf-u-pt-md pf-u-box-shadow-sm-top pf-u-box-shadow-none-bottom pf-c-toolbar--sticky-bottom">
                    <ToolbarContent>
                      <ToolbarItem className="pf-u-flex-1">
                        {contacts.length > 0 ? (
                          <TextInput
                            type="text"
                            aria-label="Message to send"
                            placeholder="Your message"
                            required
                            value={addMessageInputValue}
                            onChange={(v) => setAddMessageInputValue(v)}
                            ref={addMessageInputValueRef}
                            onKeyDown={(e) =>
                              e.key === "Enter" && submitAddMessageInput()
                            }
                          />
                        ) : (
                          <Skeleton
                            screenreaderText="Loading message input"
                            width="100%"
                            height="36px"
                          />
                        )}
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                </DrawerContent>
              </Drawer>

              {contacts.length > 0 && (
                <Modal
                  bodyAriaLabel="Block modal"
                  tabIndex={0}
                  variant={ModalVariant.small}
                  title={`Block ${
                    contacts.find((c) => c.id === activeContactID)?.name
                  }`}
                  isOpen={blockModalOpen}
                  onClose={() => setBlockModalOpen(false)}
                  actions={[
                    <Button
                      key="confirm"
                      variant="danger"
                      onClick={() => {
                        blockContact(activeContactID);
                        setBlockModalOpen(false);
                      }}
                    >
                      Block
                    </Button>,
                    <Button
                      key="cancel"
                      variant="link"
                      onClick={() => setBlockModalOpen(false)}
                    >
                      Cancel
                    </Button>,
                  ]}
                >
                  Are you sure you want to block{" "}
                  {contacts.find((c) => c.id === activeContactID)?.name}? You
                  will have to manually add them as a contact if you want to
                  contact them again.
                </Modal>
              )}

              {contacts.length > 0 && (
                <Modal
                  bodyAriaLabel="Report modal"
                  variant={ModalVariant.small}
                  title={`Report ${
                    contacts.find((c) => c.id === activeContactID)?.name
                  }`}
                  isOpen={reportModalOpen}
                  onClose={() => setReportModalOpen(false)}
                  actions={[
                    <Button
                      key="report"
                      variant="danger"
                      type="submit"
                      form="report-form"
                    >
                      Report
                    </Button>,
                    <Button
                      key="cancel"
                      variant="link"
                      onClick={() => setReportModalOpen(false)}
                    >
                      Cancel
                    </Button>,
                  ]}
                >
                  <Form
                    id="report-form"
                    onSubmit={() => {
                      reportContact(activeContactID, reportFormCommentContent);
                      setReportModalOpen(false);
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
                        value={reportFormCommentContent}
                        onChange={(v) => setReportFormCommentContent(v)}
                      />
                    </FormGroup>
                  </Form>
                </Modal>
              )}
            </>
          ) : (
            <div className="pf-x-login-page pf-u-h-100 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-lg">
              <div className="pf-u-w-100 pf-u-pt">
                <div className="pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center pf-x-footer">
                  <Image
                    src={logo}
                    alt="ChatScape logo"
                    className="pf-x-logo pf-x-logo--empty pf-u-mr-sm"
                  />
                  <AvatarMenu right />
                </div>
              </div>

              <div className="pf-u-flex-1 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-p-md">
                <EmptyState>
                  <EmptyStateIcon
                    icon={AddressBookIcon}
                    className="pf-x-text--intro"
                  />

                  <Title headingLevel="h1" size="lg">
                    No contacts yet
                  </Title>

                  <EmptyStateBody className="pf-x-text--intro--subtitle">
                    Add a friend&apos;s email address to chat with them!
                  </EmptyStateBody>

                  <InputGroup className="pf-u-mt-md">
                    <TextInput
                      aria-label="Email of the account to add"
                      type="email"
                      placeholder="jean.doe@example.com"
                      value={initialEmailInputValue}
                      onChange={(v) => setInitialEmailInputValue(v)}
                      ref={initialEmailInputValueRef}
                      required
                      onKeyDown={(k) =>
                        k.key === "Enter" && submitInitialEmailInput()
                      }
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
                    <a
                      href="https://github.com/pojntfx/chatscape"
                      target="_blank"
                    >
                      © AGPL-3.0 2023 Felicitas Pojtinger
                    </a>
                  </div>
                  <div className="pf-l-flex__item">
                    <a
                      href="https://felicitas.pojtinger.com/imprint"
                      target="_blank"
                    >
                      Imprint
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="pf-x-login-page pf-u-h-100 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-lg">
            <div className="pf-u-flex-1 pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center pf-u-flex-direction-column pf-u-p-md">
              <Image
                src={logo}
                alt="ChatScape logo"
                className="pf-x-logo"
                priority
              />

              <Title
                headingLevel="h3"
                className="pf-u-mt-sm pf-u-mb-lg pf-x-subtitle"
              >
                Scalable Serverless Chat
              </Title>

              <div className="pf-x-ctas">
                <Tooltip
                  trigger={installPWA ? "manual" : undefined}
                  isVisible={installPWA ? false : undefined}
                  content={
                    <div>
                      Your browser doesn&apos;t support PWAs, please use Chrome,
                      Edge or another compatible browser to install the app or
                      add it to your homescreen manually.
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
                  <a
                    href="https://github.com/pojntfx/chatscape"
                    target="_blank"
                  >
                    © AGPL-3.0 2023 Felicitas Pojtinger
                  </a>
                </div>
                <div className="pf-l-flex__item">
                  <a
                    href="https://felicitas.pojtinger.com/imprint"
                    target="_blank"
                  >
                    Imprint
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <Modal
          bodyAriaLabel="About modal"
          tabIndex={0}
          variant={ModalVariant.small}
          title="About"
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
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
      </PageSection>

      {updateAvailable && (
        <div className="pf-x-global-alerts-container pf-u-p-lg">
          <Alert
            variant="info"
            title="Update available"
            actionClose={
              <AlertActionCloseButton
                onClose={() => setUpdateAvailable(false)}
              />
            }
            actionLinks={
              <>
                <AlertActionLink onClick={updatePWA}>
                  Update now
                </AlertActionLink>
                <AlertActionLink onClick={() => setUpdateAvailable(false)}>
                  Ignore
                </AlertActionLink>
              </>
            }
          >
            <p>A new version of ChatScape is available.</p>
          </Alert>
        </div>
      )}
    </Page>
  );
}
