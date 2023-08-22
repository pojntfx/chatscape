import { render } from "@testing-library/react";
import { createRef } from "react";
import { GlobalToolbar } from "./global-toolbar";

describe("GlobalToolbar", () => {
  it("renders with account options open", () => {
    expect(
      render(
        <GlobalToolbar
          toggleAccountActions={jest.fn()}
          accountActionsOpen={true}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
          searchInputValue=""
          setSearchInputValue={jest.fn()}
          addContactPopoverOpen={false}
          setContactPopoverOpen={jest.fn()}
          addContactNameInputValue=""
          setAddContactNameInputValue={jest.fn()}
          addContactNameInputValueRef={createRef()}
          addContactEmailInputValue=""
          setAddContactEmailInputValue={jest.fn()}
          addContactEmailInputValueRef={createRef()}
          submitAddContactEmailInput={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with account options closed", () => {
    expect(
      render(
        <GlobalToolbar
          toggleAccountActions={jest.fn()}
          accountActionsOpen={false}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
          searchInputValue=""
          setSearchInputValue={jest.fn()}
          addContactPopoverOpen={false}
          setContactPopoverOpen={jest.fn()}
          addContactNameInputValue=""
          setAddContactNameInputValue={jest.fn()}
          addContactNameInputValueRef={createRef()}
          addContactEmailInputValue=""
          setAddContactEmailInputValue={jest.fn()}
          addContactEmailInputValueRef={createRef()}
          submitAddContactEmailInput={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with add contact modal open", () => {
    expect(
      render(
        <GlobalToolbar
          toggleAccountActions={jest.fn()}
          accountActionsOpen={false}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
          searchInputValue=""
          setSearchInputValue={jest.fn()}
          addContactPopoverOpen={true}
          setContactPopoverOpen={jest.fn()}
          addContactNameInputValue=""
          setAddContactNameInputValue={jest.fn()}
          addContactNameInputValueRef={createRef()}
          addContactEmailInputValue=""
          setAddContactEmailInputValue={jest.fn()}
          addContactEmailInputValueRef={createRef()}
          submitAddContactEmailInput={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with add contact modal closed", () => {
    expect(
      render(
        <GlobalToolbar
          toggleAccountActions={jest.fn()}
          accountActionsOpen={false}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
          searchInputValue=""
          setSearchInputValue={jest.fn()}
          addContactPopoverOpen={false}
          setContactPopoverOpen={jest.fn()}
          addContactNameInputValue=""
          setAddContactNameInputValue={jest.fn()}
          addContactNameInputValueRef={createRef()}
          addContactEmailInputValue=""
          setAddContactEmailInputValue={jest.fn()}
          addContactEmailInputValueRef={createRef()}
          submitAddContactEmailInput={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });
});
