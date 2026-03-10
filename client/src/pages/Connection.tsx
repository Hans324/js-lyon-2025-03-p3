import LoginForm from "../components/LoginForm";
import CreateUser from "../components/createUser";
import "./Connection.css";

function Connection() {
  return (
    <section className="connection-register">
      <h1>Connexion et création de compte</h1>
      <p className="connection-description">
        Connectez-vous pour accéder à vos réservations et gérer votre compte
        utilisateur
      </p>
      <h2>Connectez-vous</h2>
      <LoginForm />
      <h2>Ou bien créez un compte</h2>
      <CreateUser />
    </section>
  );
}
export default Connection;
