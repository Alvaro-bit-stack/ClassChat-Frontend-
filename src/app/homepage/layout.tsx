import NavBar from "@/components/NavBar";
// app/layout.tsx
import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Homepage",
  description: "Classify's Homepage",
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex-grow">{children}</main>
    </>
  );
}
