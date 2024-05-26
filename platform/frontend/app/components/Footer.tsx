"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NO_FOOTER_PAGES, NO_HEADER_PAGES } from "./utils";

const Footer = () => {
  const pathname = usePathname();

  if (NO_FOOTER_PAGES.includes(pathname)) {
    return <></>;
  }

  return (
    <footer className="w-full bg-gray-800 text-white text-center p-4">
      <p>© 2024 A TUB Project - Explainable AI Project.</p>
    </footer>
  );
};

export default Footer;
