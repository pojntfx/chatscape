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

export interface IAPI {
  addContact(name: string, email: string): Promise<IContact>;
  getContacts(): Promise<IContact[]>;
  blockContact(contactID: string): Promise<void>;
  reportContact(contactID: string, context: string): Promise<void>;
  addMessage(contactID: string, body: string): Promise<void>;
  getMessages(contactID: string): Promise<IMessage[]>;
}
