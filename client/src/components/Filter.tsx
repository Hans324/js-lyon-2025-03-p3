import { useState } from "react";
import "./Filter.css";

const SHIP_TYPES = [
  { id: "corvette" as const, label: "Corvette" },
  { id: "fregate" as const, label: "Frégate" },
  { id: "manowar" as const, label: "Man'o'war" },
];

const SERVICES = [
  { id: "premium" as const, label: "Premium" },
  { id: "gold" as const, label: "Gold" },
  { id: "platine" as const, label: "Platine" },
];

function Filter() {
  const [activeShip, setActiveShip] = useState<
    (typeof SHIP_TYPES)[number]["id"] | null
  >(null);
  const [activeService, setActiveService] = useState<
    (typeof SERVICES)[number]["id"] | null
  >(null);

  const scrollToCatalog = () => {
    document.getElementById("ships-catalog")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
      <section
        className="filter-col filter-col--left"
        aria-label="Type de vaisseau"
      >
        <div id="ships">
          {SHIP_TYPES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`btn-ship ${activeShip === id ? "is-active" : ""}`}
              onClick={() => setActiveShip((prev) => (prev === id ? null : id))}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="withdrawal-block">
          <section id="withdrawal-return">
            <section id="withdrawal-return-text-select">
              <p id="withdrawalAndReturnText">Retrait et retour</p>
              <select name="withdrawalAndReturn" id="select-withdrawal-return">
                <option value="withdrawal">Laguna Vista - Texas - US</option>
                <option value="return">Flamingo - Floride -US</option>
                <option value="return">Mana - Guyane - FR</option>
                <option value="return">Ras el Khaïmah - AE</option>
                <option value="return">Zhangzhou - Fujian - CN</option>
              </select>
            </section>

            <button type="button" id="btn-withdrawal-return">
              + lieu de retour différent
            </button>
          </section>
        </div>
      </section>

      <section className="filter-col filter-col--center" aria-label="Services">
        <h2>Services</h2>
        <div id="btn-group-services">
          {SERVICES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`btn-service ${activeService === id ? "is-active" : ""}`}
              onClick={() =>
                setActiveService((prev) => (prev === id ? null : id))
              }
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-col" id="group-date" aria-label="Dates">
        <div id="btn-group-date">
          <label htmlFor="start" className="label-date">
            Date de départ
            <input type="date" id="start" name="trip-start" />
          </label>

          <label htmlFor="end" className="label-date">
            Date de retour
            <input type="date" id="end" name="trip-end" />
          </label>
        </div>
        <button type="button" id="btn-seeships" onClick={scrollToCatalog}>
          Voir les vaisseaux
        </button>
      </section>
    </form>
  );
}

export default Filter;
