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
  Toolbar as Toolbar,
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
import {
  Fragment,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LocalStorageAPI } from "../api/localstorage";
import { usePWAInstaller } from "../hooks/pwa";
import logo from "../public/logo-light.png";
import { useAPI } from "../hooks/api";
import { useWindowWidth } from "../hooks/window";

// const api = new InMemoryAPI(500);
const api = new LocalStorageAPI(500);

const AvatarMenu = ({
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

const LoginPage = ({
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

const ChatPage = ({
  accountActionsOpen,
  avatarURL,
  logOut,
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

const AboutModal = ({
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

const UpdateModal = ({
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

const ReportModal = ({
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

const BlockModal = ({
  name,
  modalOpen,
  closeModal,
  blockContact,
}: {
  name: string;
  modalOpen: boolean;
  closeModal: () => void;
  blockContact: () => void;
}) => (
  <Modal
    bodyAriaLabel="Block modal"
    tabIndex={0}
    variant={ModalVariant.small}
    title={`Block ${name}`}
    isOpen={modalOpen}
    onClose={closeModal}
    actions={[
      <Button
        key="confirm"
        variant="danger"
        onClick={() => {
          blockContact();
          closeModal();
        }}
      >
        Block
      </Button>,
      <Button key="cancel" variant="link" onClick={closeModal}>
        Cancel
      </Button>,
    ]}
  >
    Are you sure you want to block {name}? You will have to manually add them as
    a contact if you want to contact them again.
  </Modal>
);

const GlobalToolbar = ({
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

const MessagesToolbar = ({
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

const ContactList = ({
  contacts,
  contactList,
  width,
  activeContactID,
  setActiveContactID,
  setDrawerExpanded,
}: {
  contacts: {
    id: string;
    avatar: string;
    name: string;
    intro: string;
  }[];
  contactList: {
    id: string;
    avatar: string;
    name: string;
    intro: string;
  }[];
  width?: number;
  activeContactID: string | null;
  setActiveContactID: (id: string) => void;
  setDrawerExpanded: (expanded: boolean) => void;
}) => (
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

                <div className="pf-u-icon-color-light">{contact.intro} ...</div>
              </div>
            </Button>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateBody>No contacts found</EmptyStateBody>
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
                  width={(i % 2 !== 0 ? 33 : 66) + (i % 2) * 10 + "%"}
                />
              </div>
              <div className="pf-u-icon-color-light pf-u-w-100">
                <Skeleton
                  screenreaderText="Loading contact info"
                  width={(i % 2 === 0 ? 33 : 66) + (i % 2) * 10 + "%"}
                />
              </div>
            </div>
          </Button>
        </ListItem>
      ))
    )}
  </List>
);

const MessagesList = ({
  messages,
  lastMessageRef,
}: {
  messages?: {
    them?: boolean;
    body: string;
    date: Date;
  }[];
  lastMessageRef: RefObject<HTMLSpanElement> | undefined;
}) => (
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
                  (message.them ? "pf-c-card--them" : "pf-c-card--us")
                }
              >
                <CardBody>{message.body}</CardBody>
              </Card>
            </ListItem>

            {(messages[i + 1] &&
              Math.abs(
                message.date.getTime() - messages[i + 1].date.getTime()
              ) /
                (1000 * 60 * 60) >
                2) ||
            i === messages.length - 1 ? (
              <ListItem>
                <span
                  ref={i === messages.length - 1 ? lastMessageRef : undefined}
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
          <Skeleton screenreaderText="Loading messages" width="90%" />
        </ListItem>

        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="66%" />
        </ListItem>

        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="77%" />
        </ListItem>

        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="33%" />
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
);

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
  } = useAPI(api);

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
                      <GlobalToolbar
                        accountActionsOpen={accountActionsOpen}
                        avatarURL={avatarURL}
                        logOut={logOut}
                        openAboutModal={() => setAboutModalOpen(true)}
                        toggleAccountActions={() =>
                          setAccountActionsOpen((v) => !v)
                        }
                        searchInputValue={searchInputValue}
                        setSearchInputValue={setSearchInputValue}
                        addContactPopoverOpen={addContactPopoverOpen}
                        setContactPopoverOpen={setContactPopoverOpen}
                        addContactEmailInputValue={addContactEmailInputValue}
                        setAddContactEmailInputValue={
                          setAddContactEmailInputValue
                        }
                        addContactEmailInputValueRef={
                          addContactEmailInputValueRef
                        }
                        submitAddContactEmailInput={submitAddContactEmailInput}
                      />

                      <DrawerPanelBody className="pf-c-overflow-y pf-u-p-0 pf-x-contact-list">
                        <ContactList
                          contacts={contacts}
                          contactList={contacts.filter((c) =>
                            c.name.includes(searchInputValue)
                          )}
                          width={width}
                          activeContactID={activeContactID}
                          setActiveContactID={setActiveContactID}
                          setDrawerExpanded={setDrawerExpanded}
                        />
                      </DrawerPanelBody>
                    </DrawerPanelContent>
                  }
                >
                  <MessagesToolbar
                    setDrawerExpanded={setDrawerExpanded}
                    contacts={contacts}
                    activeContactID={activeContactID}
                    setShowContactEmailOpen={setShowContactEmailOpen}
                    showContactEmailOpen={showContactEmailOpen}
                    setUserActionsOpen={setUserActionsOpen}
                    userActionsOpen={userActionsOpen}
                    setBlockModalOpen={setBlockModalOpen}
                    setReportModalOpen={setReportModalOpen}
                  />

                  <DrawerContentBody className="pf-u-p-lg pf-c-overflow-y">
                    <MessagesList
                      messages={messages}
                      lastMessageRef={lastMessageRef}
                    />
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
                <BlockModal
                  name={
                    contacts.find((c) => c.id === activeContactID)?.name || ""
                  }
                  modalOpen={reportModalOpen}
                  closeModal={() => setReportModalOpen(false)}
                  blockContact={blockContact}
                />
              )}

              {contacts.length > 0 && (
                <ReportModal
                  name={
                    contacts.find((c) => c.id === activeContactID)?.name || ""
                  }
                  modalOpen={reportModalOpen}
                  closeModal={() => setReportModalOpen(false)}
                  reportContact={reportContact}
                />
              )}
            </>
          ) : (
            <ChatPage
              accountActionsOpen={accountActionsOpen}
              avatarURL={avatarURL}
              logOut={logOut}
              initialEmailInputValue={initialEmailInputValue}
              setInitialEmailInputValue={setInitialEmailInputValue}
              initialEmailInputValueRef={initialEmailInputValueRef}
              submitInitialEmailInput={submitInitialEmailInput}
              openAboutModal={() => setAboutModalOpen(true)}
              toggleAccountActions={() => setAccountActionsOpen((v) => !v)}
            />
          )
        ) : (
          <LoginPage installPWA={installPWA} logIn={logIn} />
        )}

        <AboutModal
          aboutModalOpen={aboutModalOpen}
          closeAboutModal={() => setAboutModalOpen(false)}
        />
      </PageSection>

      {updateAvailable && (
        <UpdateModal
          applyUpdate={updatePWA}
          dismissUpdate={() => setUpdateAvailable(false)}
        />
      )}
    </Page>
  );
}