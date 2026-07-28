import "./CheckoutButton.css";
import { apiBaseUrl } from "../apiBaseUrl";

type CheckoutButtonProps = {
  shipId: number;
};

function CheckoutButton({ shipId }: CheckoutButtonProps) {
  const baseURL = apiBaseUrl();
  const handleClick = async () => {
    const res = await fetch(`${baseURL}/api/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ shipId }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    } else {
      console.error("URL de redirection Stripe non reçue");
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      Payer maintenant
    </button>
  );
}

export default CheckoutButton;
