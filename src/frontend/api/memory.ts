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

export class InMemoryAPI {
  private contacts: IContact[] = [];
  private messages: Map<string, IMessage[]> = new Map<string, IMessage[]>();
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

    this.contacts.push(newContact);

    return newContact;
  }

  async getContacts(): Promise<IContact[]> {
    await this.sleep();

    return this.contacts;
  }

  async blockContact(contactID: string): Promise<void> {
    await this.sleep();

    const index = this.contacts.findIndex(
      (contact) => contact.id === contactID
    );

    if (index !== -1) {
      this.contacts.splice(index, 1);
    }
  }

  async reportContact(contactID: string, context: string): Promise<void> {
    await this.sleep();
  }

  async addMessage(contactID: string, body: string): Promise<void> {
    await this.sleep();

    this.messages.set(contactID, [
      ...(this.messages.get(contactID) || []),
      {
        them: false,
        body,
        date: new Date(),
      },
    ]);
  }

  async getMessages(contactID: string): Promise<IMessage[]> {
    await this.sleep();

    return this.messages.get(contactID) || [];
  }
}
