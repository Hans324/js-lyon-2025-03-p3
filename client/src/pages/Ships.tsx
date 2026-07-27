import { useEffect, useState } from "react";
import { apiBaseUrl } from "../apiBaseUrl";
import Filter from "../components/Filter";
import ShipCard from "../components/ShipCard";
import "./Ships.css";
import BetterUnderstand from "../components/BetterUnderstand";
interface ShipsProps {
  id: number;
  name: string;
  image: string;
}
function Ships() {
  const [ships, setShips] = useState<ShipsProps[]>([]);
  const baseURL = apiBaseUrl();
  useEffect(() => {
    fetch(`${baseURL}/api/ships`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setShips(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erreur chargement vaisseaux:", err));
  }, [baseURL]);

  return (
    <>
      <section className="shipsPage-wrapper">
        <h1>Catalogue de vaisseaux spatiaux</h1>
        <p className="ships-description">
          Découvrez notre catalogue de vaisseaux à la location. Filtrez selon le
          type, la capacité, les services et les dates de voyage.
        </p>

        <Filter />
        <div className="shipCards-wrapper" id="ships-catalog">
          {ships.map((ship) => (
            <ShipCard
              key={ship.id}
              name={ship.name}
              image={ship.image}
              id={ship.id}
            />
          ))}
        </div>
      </section>
      <BetterUnderstand />
    </>
  );
}

export default Ships;
