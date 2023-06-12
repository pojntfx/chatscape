import { render } from "@testing-library/react";
import { UpdateModal } from "./update-modal";

describe("UpdateModal", () => {
  it("renders correctly", () => {
    expect(
      render(<UpdateModal applyUpdate={jest.fn()} dismissUpdate={jest.fn()} />)
    ).toMatchSnapshot();
  });
});
