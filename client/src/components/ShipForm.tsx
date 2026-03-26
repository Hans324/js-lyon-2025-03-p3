import "./ShipForm.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../config";

function ShipForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${BASE_URL}/api/ships`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création");
      }

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur réseau inconnue");
      }
    }
  };

  return (
    <form className="ship-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Nom" required />
      <input name="catchphrase" placeholder="Phrase" required />
      <input type="file" name="image" required />
      <input type="number" name="quantity" required />

      <button type="submit">Créer</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default ShipForm;
