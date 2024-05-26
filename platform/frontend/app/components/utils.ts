import { IconMail } from "@tabler/icons-react";
import { AuthenticationOption } from "./types";

export const BASE_URL_API = "http://127.0.0.1:8000";
export const NO_HEADER_PAGES = ["/login", "/register"]; // pages where the header should be hidden
export const NO_FOOTER_PAGES = ["/login", "/register"]; // pages where the footer should be hidden
export const AUTHENTICATION_OPTIONS: Array<AuthenticationOption> = [
  { name: "Email", icon: IconMail },
];
