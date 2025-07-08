import SideBar from "@/components/SideBar";
import DashNav from "@/components/DashNav";
// app/layout.tsx
import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Homepage",
  description: "Classify's dashboard",
};

export default function ChooseClassesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <DashNav hiddenCourseBt />
      <main className="flex-grow">{children}</main>
    </>
  );
}
