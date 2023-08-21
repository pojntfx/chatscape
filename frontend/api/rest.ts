import md5 from "js-md5";
import { IAPI, IContact, IMessage } from "./models";

export class RESTAPI implements IAPI {
  private apiURL: string;
  private token: string;

  constructor(apiURL: string, token: string) {
    this.apiURL = apiURL;
    this.token = token;
  }

  async addContact(name: string, email: string): Promise<IContact> {
    const response = await fetch(`${this.apiURL}/add-contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        email,
        name,
      }),
    });

    const newContact = await response.json();

    return {
      id: newContact.id,
      name: newContact.name,
      email: newContact.email,
      intro: "Optio, voluptate accus",
      avatar: `https://www.gravatar.com/avatar/${md5(
        email.toLowerCase().trim()
      )}?s=300`,
    };
  }

  async getContacts(): Promise<IContact[]> {
    const response = await fetch(`${this.apiURL}/get-contacts`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    const contacts = (await response.json()) as any[];

    return contacts
      .filter((contact) => !contact.blocked)
      .map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        intro: "Optio, voluptate accus",
        avatar: `https://www.gravatar.com/avatar/${md5(
          contact.email.toLowerCase().trim()
        )}?s=300`,
      }));
  }

  async blockContact(contactID: string): Promise<void> {
    await fetch(`${this.apiURL}/block-contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        id: contactID,
      }),
    });
  }

  async reportContact(contactID: string, context: string): Promise<void> {
    await fetch(`${this.apiURL}/report-contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        id: contactID,
        report: context,
      }),
    });
  }

  async addMessage(contactID: string, body: string): Promise<void> {
    await fetch(`${this.apiURL}/add-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        recipientNamespace: contactID,
        message: body,
      }),
    });
  }

  async getMessages(contactID: string): Promise<IMessage[]> {
    const response = await fetch(
      `${this.apiURL}/get-messages?recipientNamespace=${contactID}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    const messages = (await response.json()) as any[];

    return messages
      .map((message) => ({
        them: message.them,
        body: message.message,
        date: new Date(message.date),
      }))
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
