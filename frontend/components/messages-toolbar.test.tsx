import { render } from "@testing-library/react";
import { MessagesToolbar } from "./messages-toolbar";

describe("MessagesToolbar", () => {
  const contacts = [
    {
      id: "1",
      name: "John Doe",
      email: "johndoe@example.com",
    },
  ];
  const activeContactID = "1";
  const setShowContactEmailOpen = jest.fn();
  const setUserActionsOpen = jest.fn();
  const setBlockModalOpen = jest.fn();
  const setReportModalOpen = jest.fn();

  it("renders with drawer expanded", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={true}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={true}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with drawer not expanded", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={false}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={false}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with contact email visible", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={true}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={true}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with contact email not visible", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={false}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={false}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with user actions open", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={true}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={true}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with user actions not open", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={false}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={false}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with block modal open", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={true}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={true}
          setBlockModalOpen={() => true}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with block modal not open", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={false}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={false}
          setBlockModalOpen={() => false}
          setReportModalOpen={setReportModalOpen}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with report modal open", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={true}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={true}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={() => true}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with report modal not open", () => {
    expect(
      render(
        <MessagesToolbar
          setDrawerExpanded={() => {}}
          contacts={contacts}
          activeContactID={activeContactID}
          setShowContactEmailOpen={setShowContactEmailOpen}
          showContactEmailOpen={false}
          setUserActionsOpen={setUserActionsOpen}
          userActionsOpen={false}
          setBlockModalOpen={setBlockModalOpen}
          setReportModalOpen={() => false}
        />
      )
    ).toMatchSnapshot();
  });
});
