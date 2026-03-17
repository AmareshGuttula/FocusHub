"use client";

import { useState, useEffect } from "react";
import MobileNav from "./MobileNav";
import MobileDrawer from "./MobileDrawer";

export default function MobileShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Listen for hamburger button event from Navbar
  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    window.addEventListener("open-mobile-drawer", handler);
    return () => window.removeEventListener("open-mobile-drawer", handler);
  }, []);

  return (
    <>
      <MobileNav onMoreClick={() => setDrawerOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
