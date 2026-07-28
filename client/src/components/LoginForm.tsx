// src/components/LoginForm.tsx
import { useOutletContext } from "react-router";
import "./LoginForm.css";
import { BASE_URL } from "../config";

type User = {
  id: number;
  email: string;
  is_admin: boolean;
};

type Auth = {
  user: User;
  token: string;
};

function LoginForm() {
  const { setAuth } = useOutletContext() as {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const formData = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          user: User;
          message?: string;
        };
        setAuth({ user: data.user, token: "" });
        window.location.replace("/ships"); // ✅ Redirection après setAuth
      } else {
        throw new Error("Identifiants invalides");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion"); // Optionnel : peut être remplacé par un message DOM
    }
  };

  return (
    <section className="section-login">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="credentials-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Votre email"
            required
          />
        </div>
        <div className="credentials-input">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Votre mot de passe"
            required
            minLength={8}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}

export default LoginForm;
