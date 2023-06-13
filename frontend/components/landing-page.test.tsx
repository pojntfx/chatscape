import { render } from "@testing-library/react";
import { LandingPage } from "./landing-page";

describe("LandingPage", () => {
  it("renders with installPWA set", () => {
    expect(
      render(<LandingPage installPWA={jest.fn()} login={jest.fn()} />)
    ).toMatchSnapshot();
  });

  it("renders without installPWA set", () => {
    expect(
      render(<LandingPage installPWA={jest.fn()} login={jest.fn()} />)
    ).toMatchSnapshot();
  });
});
