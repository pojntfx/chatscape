import { render } from "@testing-library/react";
import { LoginPage } from "./login-page";

describe("LoginPage", () => {
  it("renders with installPWA set", () => {
    expect(
      render(<LoginPage installPWA={jest.fn()} logIn={jest.fn()} />)
    ).toMatchSnapshot();
  });

  it("renders without installPWA set", () => {
    expect(
      render(<LoginPage installPWA={jest.fn()} logIn={jest.fn()} />)
    ).toMatchSnapshot();
  });
});
