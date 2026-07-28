import { useEffect, useState } from "react";
import { AdminDashboard } from "../components/AdminDashboard";
import "./Admin.css";
import { apiBaseUrl } from "../apiBaseUrl";

interface User {
  email: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
}
function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const baseURL = apiBaseUrl();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseURL}/api/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = (await res.json()) as {
          email?: string;
          firstname?: string;
          lastname?: string;
          is_admin?: boolean;
        };
        setUser({
          email: data.email ?? "",
          firstname: data.firstname ?? "",
          lastname: data.lastname ?? "",
          isAdmin: Boolean(data.is_admin),
        });
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, [baseURL]);
  if (user === undefined) {
    return (
      <section className="admin-page">
        <p>Chargement…</p>
      </section>
    );
  }
  return user?.isAdmin ? (
    <section className="admin-page">
      <div className="admin-page-infos">
        {" "}
        <AdminDashboard
          email={user?.email}
          firstname={user?.firstname}
          lastname={user?.lastname}
          isAdmin={user?.isAdmin}
        />{" "}
      </div>
    </section>
  ) : (
    <section className="admin-page">
      <div className="admin-page-infos">
        {" "}
        Vous n'avez pas les droits d'accès à cette page.
      </div>
    </section>
  );
}

export default Admin;
