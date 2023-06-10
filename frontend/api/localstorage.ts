import { v4 } from "uuid";
import { IAPI, IContact, IMessage } from "./models";

export class LocalStorageAPI implements IAPI {
  private simulatedRTT: number;

  constructor(simulatedRTT: number) {
    this.simulatedRTT = simulatedRTT;
  }

  private async sleep(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.simulatedRTT));
  }

  async addContact(name: string, email: string): Promise<IContact> {
    await this.sleep();

    const newContact: IContact = {
      id: v4(),
      name,
      email,
      intro: "Optio, voluptate accus",
      avatar: "https://i.pravatar.cc/300?u=" + email,
    };

    const contacts = await this.getContacts();

    contacts.push(newContact);

    localStorage.setItem("contacts", JSON.stringify(contacts));

    return newContact;
  }

  async getContacts(): Promise<IContact[]> {
    await this.sleep();

    const contacts = localStorage.getItem("contacts");
    return contacts ? JSON.parse(contacts) : [];
  }

  async blockContact(contactID: string): Promise<void> {
    await this.sleep();

    const contacts = await this.getContacts();
    const index = contacts.findIndex((contact) => contact.id === contactID);

    if (index !== -1) {
      contacts.splice(index, 1);
    }

    localStorage.setItem("contacts", JSON.stringify(contacts));
  }

  async reportContact(contactID: string, context: string): Promise<void> {
    await this.sleep();
  }

  async addMessage(contactID: string, body: string): Promise<void> {
    await this.sleep();

    const messages = await this.getMessages(contactID);

    messages.push({
      them: false,
      body,
      date: new Date(),
    });

    localStorage.setItem("messages-" + contactID, JSON.stringify(messages));
  }

  async getMessages(contactID: string): Promise<IMessage[]> {
    await this.sleep();

    const storedMessages = localStorage.getItem("messages-" + contactID);
    return storedMessages
      ? JSON.parse(storedMessages).map((message: IMessage) => ({
          ...message,
          date: new Date(message.date),
        }))
      : [];
  }
}
