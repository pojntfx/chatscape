import { v4 } from "uuid";

export interface IContact {
  id: string;
  name: string;
  email: string;
  intro: string;
  avatar: string;
}

export interface IMessage {
  them: boolean;
  body: string;
  date: Date;
}

const contacts: IContact[] = [];
const messages: Map<string, IMessage[]> = new Map<string, IMessage[]>();

export const addContact = async (name: string, email: string) => {
  const newContact: IContact = {
    id: v4(),
    name,
    email,
    intro: "Optio, voluptate accus",
    avatar: "https://i.pravatar.cc/300?u=" + email,
  };

  contacts.push(newContact);

  return newContact;
};

export const getContacts = async () => contacts;

export const blockContact = async (contactID: string) => {
  const index = contacts.findIndex((contact) => contact.id === contactID);

  if (index !== -1) {
    contacts.splice(index, 1);
  }
};

export const reportContact = async (contactID: string, context: string) => {};

export const addMessage = async (contactID: string, body: string) => {
  messages.set(contactID, [
    ...(messages.get(contactID) || []),
    {
      them: false,
      body,
      date: new Date(),
    },
  ]);
};

export const getMessages = async (contactID: string) =>
  messages.get(contactID) || [];
