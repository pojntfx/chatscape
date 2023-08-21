import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  Page,
  PageSection,
  Skeleton,
  SkipToContent,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { AuthProvider } from "oidc-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAPI } from "../hooks/api";
import { usePWAInstaller } from "../hooks/pwa";
import { useWindowWidth } from "../hooks/window";
import { AboutModal } from "./about-modal";
import { BlockModal } from "./block-modal";
import { ChatPage } from "./chat-page";
import { ContactList } from "./contact-list";
import { GlobalToolbar } from "./global-toolbar";
import { LandingPage } from "./landing-page";
import { MessagesList } from "./messages-list";
import { MessagesToolbar } from "./messages-toolbar";
import { ReportModal } from "./report-modal";
import { UpdateModal } from "./update-modal";

const HomePagePlaceholder = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const { installPWA, updatePWA } = usePWAInstaller(
    () => setUpdateAvailable(true),
    () => setUpdateAvailable(false)
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
        <LandingPage installPWA={installPWA} />
      </PageSection>

      {updateAvailable && (
        <UpdateModal
          applyUpdate={updatePWA}
          dismissUpdate={() => setUpdateAvailable(false)}
        />
      )}
    </Page>
  );
};

const HomePage = ({ apiURL }: { apiURL: string }) => {
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
  } = useAPI(apiURL);

  const { installPWA, updatePWA } = usePWAInstaller(
    () => setUpdateAvailable(true),
    () => {
      setUpdateAvailable(false);
      logIn();
    }
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
                  modalOpen={blockModalOpen}
                  closeModal={() => setBlockModalOpen(false)}
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
          <LandingPage installPWA={installPWA} login={logIn} />
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
};

export default function Home() {
  const [apiURL, setApiURL] = useState("");
  const [authority, setAuthority] = useState("");
  const [clientID, setClientID] = useState("");

  useEffect(() => {
    fetch("config.json")
      .then((res) => res.json())
      .then((res) => {
        setApiURL(res.apiURL);
        setAuthority(res.authority);
        setClientID(res.clientID);
      })
      .catch((e) => console.error(e));
  }, []);

  return apiURL === "" || authority === "" || clientID === "" ? (
    <HomePagePlaceholder />
  ) : (
    <AuthProvider
      authority={authority}
      clientId={clientID}
      redirectUri={window.location.origin}
      autoSignIn={false}
      scope="email openid profile"
    >
      <HomePage apiURL={apiURL} />
    </AuthProvider>
  );
}
