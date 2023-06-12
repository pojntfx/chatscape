import { render } from "@testing-library/react";
import { AboutModal } from "./about-modal";

describe("AboutModal", () => {
  it("renders in the closed state", () => {
    expect(
      render(<AboutModal aboutModalOpen={false} closeAboutModal={jest.fn()} />)
    ).toMatchSnapshot();
  });

  it("renders in the open state", () => {
    expect(
      render(<AboutModal aboutModalOpen={true} closeAboutModal={jest.fn()} />)
    ).toMatchSnapshot();
  });
});
