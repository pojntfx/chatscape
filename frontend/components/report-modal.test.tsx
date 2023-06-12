import { render } from "@testing-library/react";
import { ReportModal } from "./report-modal";

describe("ReportModal", () => {
  it("renders with modal open", () => {
    const mockCloseModal = jest.fn();
    const mockReportContact = jest.fn();

    expect(
      render(
        <ReportModal
          name="Contact Name"
          modalOpen={true}
          closeModal={mockCloseModal}
          reportContact={mockReportContact}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with modal closed", () => {
    const mockCloseModal = jest.fn();
    const mockReportContact = jest.fn();

    expect(
      render(
        <ReportModal
          name="Contact Name"
          modalOpen={false}
          closeModal={mockCloseModal}
          reportContact={mockReportContact}
        />
      )
    ).toMatchSnapshot();
  });
});
