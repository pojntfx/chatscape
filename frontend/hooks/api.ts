import { RESTAPI } from "@/api/rest";
import { useAuth } from "oidc-react";
import { useEffect, useState } from "react";
import { IAPI, IContact, IMessage } from "../api/models";

export const useAPI = (apiURL: string) => {
  const auth = useAuth();

  const [api, setAPI] = useState<IAPI>();

  const [avatarURL] = useState("https://i.pravatar.cc/300?u=raina");

  const [contacts, setContacts] = useState<IContact[]>();
  const [messages, setMessages] = useState<IMessage[]>();

  const [activeContactID, setActiveContactID] = useState("");

  useEffect(() => {
    if (!auth.userData?.id_token) {
      return;
    }

    // setAPI(new InMemoryAPI(500));
    // setAPI(new LocalStorageAPI(500));
    setAPI(new RESTAPI(apiURL, auth.userData.id_token));
  }, [apiURL, auth]);

  useEffect(() => {
    if (!api || !auth.userData) {
      return;
    }

    let id = activeContactID;
    if (id === "") {
      api
        .getContacts()
        .then((contacts) => setActiveContactID(contacts[0]?.id || ""))
        .catch((e) => console.error(e));
    }

    if (id === "") {
      return;
    }

    setMessages(undefined);

    api
      .getMessages(activeContactID)
      .then((messages) => setMessages(messages))
      .catch((e) => console.error(e));
  }, [api, contacts, activeContactID, api, auth.userData]);

  useEffect(() => {
    if (!api || !auth.userData) {
      return;
    }

    api
      .getContacts()
      .then((contacts) =>
        setContacts(contacts.length > 0 ? contacts : undefined)
      )
      .catch((e) => console.error(e));
  }, [api, auth.userData]);

  return {
    loggedIn: auth.userData ? true : false,
    avatarURL,
    logIn: auth.signIn,
    logOut: auth.signOut,

    contacts,
    addContact: (name: string, email: string) => {
      if (!api) return;

      // Local
      setContacts([]);

      // Remote
      api
        .addContact(name, email)
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
      if (!api) return;

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
      if (!api) return;

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
    reportContact: (context: string) => {
      if (!api) return;

      return api
        .reportContact(activeContactID, context)
        .catch((e) => console.error(e));
    },
  };
};
