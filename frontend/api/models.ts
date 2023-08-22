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
  blockContact(email: string): Promise<void>;
  reportContact(email: string, context: string): Promise<void>;
  addMessage(email: string, body: string): Promise<void>;
  getMessages(email: string): Promise<IMessage[]>;
}
