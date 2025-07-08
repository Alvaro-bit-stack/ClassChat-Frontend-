import SideBar from "@/components/SideBar";
import DashNav from "@/components/DashNav";
// app/layout.tsx
import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Homepage",
  description: "Classify's dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashNav />
      <main className="flex-grow">{children}</main>
    </>
  );
}
