import { render } from "@testing-library/react";
import { createRef } from "react";
import { MessagesList } from "./messages-list";

describe("MessagesList", () => {
  it("renders with messages set", () => {
    const messages = [
      {
        them: true,
        body: "Hello there!",
        date: new Date(2023, 6, 13, 8, 30),
      },
      {
        them: false,
        body: "Hi, how can I help you?",
        date: new Date(2023, 6, 13, 8, 35),
      },
    ];
    expect(
      render(<MessagesList messages={messages} lastMessageRef={createRef()} />)
    ).toMatchSnapshot();
  });

  it("renders without messages set", () => {
    expect(
      render(<MessagesList lastMessageRef={createRef()} />)
    ).toMatchSnapshot();
  });
});
