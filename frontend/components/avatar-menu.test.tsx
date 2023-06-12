import { render } from "@testing-library/react";
import { AvatarMenu } from "./avatar-menu";

describe("AvatarMenu", () => {
  it("renders in the closed and left state", () => {
    expect(
      render(
        <AvatarMenu
          accountActionsOpen={false}
          toggleAccountActions={jest.fn()}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders in the open and left state", () => {
    expect(
      render(
        <AvatarMenu
          accountActionsOpen={true}
          toggleAccountActions={jest.fn()}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders in the closed and right state", () => {
    expect(
      render(
        <AvatarMenu
          right
          accountActionsOpen={false}
          toggleAccountActions={jest.fn()}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders in the open and right state", () => {
    expect(
      render(
        <AvatarMenu
          right
          accountActionsOpen={true}
          toggleAccountActions={jest.fn()}
          avatarURL=""
          logOut={jest.fn()}
          openAboutModal={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });
});
