import { render } from "@testing-library/react";
import { BlockModal } from "./block-modal";

describe("BlockModal", () => {
  it("renders in the closed state", () => {
    expect(
      render(
        <BlockModal
          name=""
          modalOpen={false}
          closeModal={jest.fn()}
          blockContact={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders in the opened state", () => {
    expect(
      render(
        <BlockModal
          name=""
          modalOpen={true}
          closeModal={jest.fn()}
          blockContact={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });
});
