import { Link } from "react-router";
import { apiBaseUrl } from "../apiBaseUrl";

type Props = {
  onLogout: () => void;
};

function LogoutButton({ onLogout }: Props) {
  const handleLogout = async () => {
    await fetch(`${apiBaseUrl()}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important pour envoyer les cookies
    });

    // Optionnel : redirection ou message
    console.info("Déconnecté");
    onLogout();
  };

  return (
    <Link to="/" onClick={handleLogout} className="login-out-button">
      Déconnexion
    </Link>
  );
}

export default LogoutButton;
