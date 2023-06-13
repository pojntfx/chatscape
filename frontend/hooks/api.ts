import { useEffect, useState } from "react";
import { IAPI, IContact, IMessage } from "../api/models";
import { useAuth } from "oidc-react";

export const useAPI = (api: IAPI) => {
  const auth = useAuth();

  const [avatarURL] = useState("https://i.pravatar.cc/300?u=raina");

  const [contacts, setContacts] = useState<IContact[]>();
  const [messages, setMessages] = useState<IMessage[]>();

  const [activeContactID, setActiveContactID] = useState("");

  useEffect(() => {
    if (!auth.userData) {
      return;
    }

    let id = activeContactID;
    if (id === "") {
      api
        .getContacts()
        .then((contacts) => setActiveContactID(contacts[0]?.id || ""))
        .catch((e) => console.error(e));
    }

    setMessages(undefined);

    api
      .getMessages(activeContactID)
      .then((messages) => setMessages(messages))
      .catch((e) => console.error(e));
  }, [contacts, activeContactID, api, auth.userData]);

  useEffect(() => {
    if (!auth.userData) {
      return;
    }

    api
      .getContacts()
      .then((contacts) =>
        setContacts(contacts.length > 0 ? contacts : undefined)
      )
      .catch((e) => console.error(e));
  }, [api, auth.userData]);

  useEffect(() => {
    if (!auth.userData) {
      return;
    }

    // Clean the URL after signin
    const url = new URL(window.location.href);
    if (url.searchParams.get("code") || url.searchParams.get("state")) {
      url.searchParams.delete("code");
      url.searchParams.delete("state");

      window.history.replaceState({}, document.title, url.toString());
    }
  }, [auth.userData]);

  return {
    loggedIn: auth.userData ? true : false,
    avatarURL,
    logIn: auth.signIn,
    logOut: auth.signOut,

    contacts,
    addContact: (email: string) => {
      // Local
      setContacts([]);

      // Remote
      api
        .addContact(email.split("@")[0] + " " + email.split("@")[1], email)
        .then((newContact) => {
          setActiveContactID(newContact.id);

          api
            .getContacts()
            .then((contacts) =>
              setContacts(contacts.length > 0 ? contacts : undefined)
            )
            .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
    },

    messages,
    addMessage: (body: string) => {
      // Local
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
      );

      // Remote
      api
        .addMessage(activeContactID, body)
        .then(() =>
          api
            .getMessages(activeContactID)
            .then((messages) => setMessages(messages))
            .catch((e) => console.error(e))
        )
        .catch((e) => console.error(e));
    },
    activeContactID,
    setActiveContactID,

    blockContact: () => {
      // Local
      setContacts((contacts) => {
        const newContacts = contacts?.filter((c) => c.id !== activeContactID);

        setActiveContactID(newContacts?.at(0)?.id || "");

        return (newContacts?.length || 0) > 0 ? newContacts : undefined;
      });

      // Remote
      api
        .blockContact(activeContactID)
        .then(() =>
          api
            .getContacts()
            .then((contacts) =>
              setContacts(contacts.length > 0 ? contacts : undefined)
            )
            .catch((e) => console.error(e))
        )
        .catch((e) => console.error(e));
    },
    reportContact: (context: string) =>
      api
        .reportContact(activeContactID, context)
        .catch((e) => console.error(e)),
  };
};
