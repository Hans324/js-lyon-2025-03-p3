import { useState } from "react";
import { Link } from "react-router";
import "../components/CreateUser.css";
import { BASE_URL } from "../config.ts";

function CreateUser() {
  const baseURL = BASE_URL;

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [strengthColor, setStrengthColor] = useState("black");

  function evaluatePasswordAndStrength(password: string) {
    let score = 0;

    if (!password) return "";

    if (password.length > 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
      case 2:
        setStrengthColor("red");
        return "faible";

      case 3:
        setStrengthColor("orange");
        return "moyen";

      case 4:
      case 5:
        setStrengthColor("green");
        return "fort";

      default:
        return "";
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setPassword(value);
    setStrength(evaluatePasswordAndStrength(value));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const formData = {
      email: form.get("email") as string,
      password: form.get("password") as string,
      firstname: form.get("firstname") as string,
      lastname: form.get("lastname") as string,
    };

    const response = await fetch(`${baseURL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Compte créé avec succès !");
      setMessageType("success");
    } else {
      setMessage(`Erreur : ${data.message}`);
      setMessageType("error");
    }
  };

  return (
    <section className="section-register">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="credentials-input">
          <label htmlFor="input-email">Email</label>
          <input
            placeholder="Votre email"
            type="email"
            id="input-email"
            name="email"
            required
          />
        </div>

        <div className="credentials-input">
          <label htmlFor="input-firstname">Prénom</label>
          <input
            placeholder="Votre prénom"
            type="text"
            id="input-firstname"
            name="firstname"
            required
            maxLength={50}
          />
        </div>

        <div className="credentials-input">
          <label htmlFor="input-lastname">Nom de famille</label>
          <input
            placeholder="Votre nom"
            type="text"
            id="input-lastname"
            name="lastname"
            required
            maxLength={50}
          />
        </div>

        <div className="credentials-input">
          <label htmlFor="input-password">Mot de passe</label>

          <input
            placeholder="Votre mot de passe"
            type="password"
            id="input-password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            minLength={8}
          />

          {/* ⭐ PASSWORD STRENGTH ACCESSIBILITY */}
          <small aria-live="polite">
            Votre mot de passe est{" "}
            <span
              style={{
                fontWeight: "bold",
                color: strengthColor,
              }}
            >
              {strength}
            </span>
          </small>
        </div>

        <div className="validate-checkbox">
          <label htmlFor="accept_cgu">
            <Link to="/Modality" target="_blank">
              J'accepte les CGU
            </Link>
          </label>

          <input type="checkbox" id="accept_cgu" name="accept_cgu" required />
        </div>

        <button type="submit">Créer le compte</button>

        {/* ⭐ MESSAGE SUCCESS / ERROR */}
        {message && (
          <div
            role="alert"
            style={{
              color: messageType === "success" ? "green" : "red",
              marginTop: "1rem",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </section>
  );
}

export default CreateUser;
