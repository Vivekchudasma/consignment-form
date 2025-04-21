import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConsignmentForm from "../components/ConsignmentForm";
import * as api from "../api/mockApi";

jest.mock("../api/mockApi");

const mockedFetchLocations = api.fetchLocations as jest.Mock;
const mockedSubmitConsignment = api.submitConsignment as jest.Mock;

describe("ConsignmentForm", () => {
  beforeEach(() => {
    mockedFetchLocations.mockResolvedValue({
      data: {
        locations: [
          "Perth",
          "Sydney",
          "Melbourne",
          "Brisbane",
          "Adelaide",
          "Darwin",
          "Hobart",
          "Canberra",
        ],
      },
    });

    mockedSubmitConsignment.mockResolvedValue({
      data: {
        consignmentId: "CNS-1234567890-1234",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields correctly", async () => {
    render(<ConsignmentForm />);

    expect(await screen.findByLabelText(/source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/depth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/units/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("API data is fetched and displayed in dropdowns", async () => {
    render(<ConsignmentForm />);

    const sourceSelect = await screen.findByLabelText(/source/i);
    expect(within(sourceSelect).getByText("Sydney")).toBeInTheDocument();
  });

  test("Form renders with all fields", () => {
    render(<ConsignmentForm />);

    expect(screen.getByLabelText(/source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/depth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/units/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("Validation errors trigger when inputs are invalid", async () => {
    render(<ConsignmentForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/source is required/i)).toBeInTheDocument();
      expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
      expect(screen.getByText(/weight is required/i)).toBeInTheDocument();
      expect(screen.getByText(/width is required/i)).toBeInTheDocument();
      expect(screen.getByText(/height is required/i)).toBeInTheDocument();
      expect(screen.getByText(/depth is required/i)).toBeInTheDocument();
    });
  });
});
