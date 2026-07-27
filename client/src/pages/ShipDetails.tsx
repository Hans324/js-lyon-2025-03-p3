import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiBaseUrl } from "../apiBaseUrl";
import { apiAssetUrl } from "../apiAssetUrl";
import "./ShipDetails.css";

type Ship = {
  id: number;
  name: string;
  image: string;
  catchphrase: string;
  quantity: number;
};

function ShipDetails() {
  const baseURL = apiBaseUrl();
  const { id } = useParams();
  const parsedId = id ? Number.parseInt(id, 10) : null;

  const [ship, setShip] = useState<Ship | null>(null);

  useEffect(() => {
    if (!parsedId) return;

    fetch(`${baseURL}/api/ships/${parsedId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setShip)
      .catch(console.error);
  }, [parsedId, baseURL]);

  if (!parsedId) return <p>ID invalide</p>;
  if (!ship) return <p>Chargement...</p>;

  return (
    <article className="ship-details-page">
      <section className="ship-details-hero">
        <img
          className="ship-details-main-img"
          src={apiAssetUrl(baseURL, ship.image)}
          alt={ship.name}
        />
      </section>
      <div className="ship-details-body">
        <h1>{ship.name}</h1>
        <p className="ship-details-catchphrase">{ship.catchphrase}</p>
        <p className="ship-details-stock">
          Quantité en stock : {ship.quantity}
        </p>
      </div>
    </article>
  );
}

export default ShipDetails;
