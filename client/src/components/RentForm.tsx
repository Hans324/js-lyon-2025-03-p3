import { useState } from "react";
import { useNavigate } from "react-router";
import "./RentForm.css";
import { BASE_URL } from "../config";

interface ShipProps {
  id: number;
}

function RentForm({ id }: ShipProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/rent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipId: id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la location");
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
    <form onSubmit={handleSubmit} className="rent-form">
      <input placeholder="Votre email" type="email" name="email" required />

      <button type="submit">Confirmez votre location</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default RentForm;
