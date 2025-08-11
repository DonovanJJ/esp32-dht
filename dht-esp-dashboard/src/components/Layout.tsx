// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./TopNavbar.tsx";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
