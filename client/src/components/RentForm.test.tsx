import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import RentForm from "./RentForm";

jest.mock("../config", () => ({
  BASE_URL: "http://localhost:3000",
}));

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("RentForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("affiche le formulaire", () => {
    render(
      <MemoryRouter>
        <RentForm id={1} />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirmez votre location/i }),
    ).toBeInTheDocument();
  });

  test("submit appelle fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <RentForm id={1} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /confirmez votre location/i }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
