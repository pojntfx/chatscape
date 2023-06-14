import { render } from "@testing-library/react";
import { LandingPage } from "./landing-page";

describe("LandingPage", () => {
  it("renders with installPWA set and with login set", () => {
    expect(
      render(<LandingPage installPWA={jest.fn()} login={jest.fn()} />)
    ).toMatchSnapshot();
  });

  it("renders without installPWA and with login set", () => {
    expect(render(<LandingPage login={jest.fn()} />)).toMatchSnapshot();
  });

  it("renders with installPWA set and without login set", () => {
    expect(render(<LandingPage installPWA={jest.fn()} />)).toMatchSnapshot();
  });

  it("renders without installPWA and without login set", () => {
    expect(render(<LandingPage />)).toMatchSnapshot();
  });
});
