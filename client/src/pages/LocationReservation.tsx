import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ShipCard from "../components/ShipCard";
import "./LocationReservation.css";
import { apiBaseUrl } from "../apiBaseUrl";
import CheckoutButton from "../components/CheckoutButton";
import NotAuth from "../components/NotAuth";

interface ShipProps {
  id: number;
  name: string;
  image: string;
}
export default function LocationReservation() {
  const params = useParams();
  const shipID = params.id;
  const baseURL = apiBaseUrl();
  const [availability, setAvailability] = useState<number>(0);
  const [isAuth, setIsAuth] = useState(Boolean);
  const [ship, setShip] = useState<ShipProps | null>(null);

  useEffect(() => {
    if (!shipID) return;
    fetch(`${baseURL}/api/ships/${shipID}/availability`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data: { ship_available?: number }) => {
        setAvailability(Number(data.ship_available ?? 0));
      })
      .catch(() => setAvailability(0));
  }, [shipID, baseURL]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseURL}/api/me`, {
          credentials: "include", // send the cookie to the server to verify the credentials
        });

        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [baseURL]);

  useEffect(() => {
    if (!shipID) return;
    fetch(`${baseURL}/api/ships/${shipID}`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setShip(data));
  }, [shipID, baseURL]);

  if (!isAuth) return <NotAuth />;
  if (!ship) return <p aria-live="polite">Chargement des informations...</p>;

  return (
    <section className="reservation-recap" key={ship.id}>
      {availability > 0 ? (
        <>
          <h1>Vous allez louer le vaisseau suivant :</h1>
          <ShipCard name={ship.name} image={ship.image} id={ship.id} />
          <CheckoutButton shipId={ship.id} />
        </>
      ) : (
        <section
          className="not-available-wrapper"
          role="alert"
          aria-live="polite"
        >
          <div className="not-available">
            <h1>Ce vaisseau n'est pas disponible pour le moment.</h1>
          </div>
          <Link to="/ships" className="return-to-ship-button">
            {" "}
            Retour au choix des vaisseaux
          </Link>
        </section>
      )}
    </section>
  );
}
