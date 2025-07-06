import NavBarMain from "@/components/NavBarMain";
// app/layout.tsx
import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Homepage",
  description: "Classify's Login Page",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBarMain></NavBarMain>
      <main>{children}</main>
    </>
  );
}
