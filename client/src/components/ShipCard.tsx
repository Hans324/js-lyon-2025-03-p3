import "./ShipCard.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import BtnBooked from "../UI/UX/btnBooked";
import BtnMoreInformations from "../UI/UX/btnMoreInformations";
import { apiAssetUrl } from "../apiAssetUrl";
import { apiBaseUrl } from "../apiBaseUrl";
import tucanaYellow from "../assets/images/iconCard/Tucana_Yellow.webp";
import battery from "../assets/images/iconCard/battery.svg";
import capacity from "../assets/images/iconCard/capacity.svg";
import bed from "../assets/images/iconCard/hotel.svg";
import person from "../assets/images/iconCard/person.svg";
import speed from "../assets/images/iconCard/speed.svg";

interface ShipProps {
  name: string;
  image: string;
  id: number;
}
function ShipCard({ name, image, id }: ShipProps) {
  const [availability, setAvailability] = useState<number | null>(null);
  const location = useLocation();
  const baseURL = apiBaseUrl();
  useEffect(() => {
    fetch(`${baseURL}/api/ships/${id}/availability`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: { ship_available?: number }) => {
        setAvailability(Number(data.ship_available ?? 0));
      })
      .catch(() => setAvailability(0));
  }, [id, baseURL]);
  const availabilityLabel = availability === null ? "…" : String(availability);
  return (
    <figure className="ship-card">
      <section className="infos-top">
        <div className="logo-name-wrapper">
          <img
            className="logo-manufacturer"
            src={tucanaYellow}
            alt="logo manufacturer"
          />
          <h2 className="ship-name">{name}</h2>
        </div>
        <div className="wrapper-logos">
          <section className="ship-infos">
            <div className="icon-info">
              <img src={capacity} alt="capacity" /> <p>2</p>
            </div>
            <div className="icon-info">
              <img src={bed} alt="bed" /> <p>1</p>
            </div>
            <div className="icon-info">
              <img src={person} alt="person" /> <p>1</p>
            </div>
            <div className="icon-info">
              <img src={battery} alt="battery" /> <p>2 UA</p>
            </div>
          </section>
          <div className="icon-info large">
            <img src={speed} alt="speed" /> <p>Supraluminique type 4</p>
          </div>
        </div>
      </section>
      <img src={apiAssetUrl(baseURL, image)} alt={name} loading="lazy" />
      <div className="quantity-wrapper">
        <p className="ship-quantity">
          Quantité disponible : {availabilityLabel}
        </p>
      </div>
      <div className="btn-wrapper">
        {location.pathname === `/locationreservation/${id}` ? (
          ""
        ) : (
          <BtnBooked id={id} />
        )}
        <BtnMoreInformations id={id} />
      </div>
      <div className="prices-info">
        <p>5000 k€ / jours terra</p> <p> 40000 k€ / 8jours terra</p>
      </div>
    </figure>
  );
}

export default ShipCard;
