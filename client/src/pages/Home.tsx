import { useEffect, useState } from "react";
import "./Home.css";
import BtnBooked from "../UI/UX/btnBooked";
import BtnMoreInformations from "../UI/UX/btnMoreInformations";
import { apiBaseUrl } from "../apiBaseUrl";
import { apiAssetUrl } from "../apiAssetUrl";

interface ShipsProps {
  id: number;
  name: string;
  image: string;
  catchphrase: string;
}

function Home() {
  const baseURL = apiBaseUrl();
  const [ships, setShips] = useState<ShipsProps[]>([]);

  useEffect(() => {
    fetch(`${baseURL}/api/ships`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setShips(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erreur chargement vaisseaux:", err));
  }, [baseURL]);

  return (
    <section>
      <section className="home-intro">
        <p>
          Application de location de vaisseaux pour voyages interstellaires.
        </p>
      </section>

      {ships.map((ship) => (
        <figure key={ship.id} className="ship-highlight">
          <img
            src={apiAssetUrl(baseURL, ship.image)}
            alt={ship.name}
            className="ship-img"
          />
          <figcaption className="ship-txt">
            <h2>{ship.name}</h2>
            <p>{ship.catchphrase}</p>
          </figcaption>
          <div className="button-group">
            <BtnBooked id={ship.id} />
            <BtnMoreInformations id={ship.id} />
          </div>
        </figure>
      ))}
    </section>
  );
}

export default Home;
