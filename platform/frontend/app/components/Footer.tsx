"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NO_FOOTER_PAGES, NO_HEADER_PAGES } from "./utils";
import { Text } from "@mantine/core";

const Footer = () => {
  const pathname = usePathname();

  if (NO_FOOTER_PAGES.includes(pathname)) {
    return <></>;
  }

  return (
    <footer className="w-full bg-gray-800 text-white text-center">
      <Text size="md" my="xs">
        © 2024 TUB Project - Programming Lab: Quality Data Science
      </Text>
    </footer>
  );
};

export default Footer;
