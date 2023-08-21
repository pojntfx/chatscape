import { render } from "@testing-library/react";
import React, { createRef } from "react";
import { ChatPage } from "./chat-page";

describe("ChatPage", () => {
  it("renders in the closed state", () => {
    expect(
      render(
        <ChatPage
          accountActionsOpen={false}
          toggleAccountActions={jest.fn()}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
          initialNameInputValue=""
          initialNameInputValueRef={createRef()}
          setInitialNameInputValue={jest.fn()}
          initialEmailInputValue=""
          initialEmailInputValueRef={createRef()}
          setInitialEmailInputValue={jest.fn()}
          submitInitialEmailInput={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders in the opened state", () => {
    expect(
      render(
        <ChatPage
          accountActionsOpen={true}
          toggleAccountActions={jest.fn()}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
          initialNameInputValue=""
          initialNameInputValueRef={createRef()}
          setInitialNameInputValue={jest.fn()}
          initialEmailInputValue=""
          initialEmailInputValueRef={createRef()}
          setInitialEmailInputValue={jest.fn()}
          submitInitialEmailInput={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });
});
