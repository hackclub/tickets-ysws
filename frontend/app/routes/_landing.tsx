import { Outlet, useLocation } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export default function layout() {
  const isHome = useLocation().pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <Outlet />
      <Footer />
    </>
  );
}
