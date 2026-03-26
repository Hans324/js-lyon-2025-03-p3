import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import CreateUser from "./createUser";

jest.mock("../config", () => ({
  BASE_URL: "http://localhost:3000",
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("CreateUser", () => {
  test("affiche le formulaire CreateUser", () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom de famille/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Créer le compte/i }),
    ).toBeInTheDocument();
  });

  test("submit succès API", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    });

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Prénom/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Nom de famille/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: "Password123!" },
    });

    // ✅ IMPORTANT : cocher la case
    fireEvent.click(screen.getByLabelText(/J'accepte les CGU/i));

    fireEvent.click(screen.getByRole("button", { name: /Créer le compte/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Compte créé avec succès");
  });

  test("submit erreur API", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email déjà utilisé" }),
    });

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Prénom/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Nom de famille/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: "Password123!" },
    });

    // ✅ IMPORTANT : cocher la case
    fireEvent.click(screen.getByLabelText(/J'accepte les CGU/i));

    fireEvent.click(screen.getByRole("button", { name: /Créer le compte/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/Erreur/i);
  });
});
