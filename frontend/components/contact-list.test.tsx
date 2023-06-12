import { render } from "@testing-library/react";
import { ContactList } from "./contact-list";

const mockContacts = [
  { id: "1", avatar: "avatar1.png", name: "Contact 1", intro: "Intro 1" },
  { id: "2", avatar: "avatar2.png", name: "Contact 2", intro: "Intro 2" },
];

describe("ContactList", () => {
  it("renders with empty contacts list", () => {
    expect(
      render(
        <ContactList
          contacts={[]}
          contactList={[]}
          activeContactID={null}
          setActiveContactID={jest.fn()}
          setDrawerExpanded={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with full contacts list", () => {
    expect(
      render(
        <ContactList
          contacts={mockContacts}
          contactList={[]}
          activeContactID={null}
          setActiveContactID={jest.fn()}
          setDrawerExpanded={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with full contacts and contactList", () => {
    expect(
      render(
        <ContactList
          contacts={mockContacts}
          contactList={mockContacts}
          activeContactID={null}
          setActiveContactID={jest.fn()}
          setDrawerExpanded={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with a set activeContactID", () => {
    expect(
      render(
        <ContactList
          contacts={mockContacts}
          contactList={mockContacts}
          activeContactID={mockContacts[0].id}
          setActiveContactID={jest.fn()}
          setDrawerExpanded={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });
});
