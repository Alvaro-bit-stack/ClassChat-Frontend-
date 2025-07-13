import DashNav from "@/components/DashNav";
// app/layout.tsx
import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Homepage",
  description: "Classify's Learn More",
};

export default function LearnMoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashNav hiddenDashBoardBt />
      <main className="flex-grow">{children}</main>
    </>
  );
}
