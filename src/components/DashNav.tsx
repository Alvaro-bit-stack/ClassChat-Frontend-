"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SideBar from "./SideBar";
export default function DashNav({
  hiddenCourseBt = false,
}: {
  hiddenCourseBt?: boolean;
}) {
  const router = useRouter();
  return (
    <div data-theme="winter">
      <div className="navbar bg-base-100 shadow-sm">
        <div>
          <Image src="/icon.jpg" alt="My logo" height={50} width={50}></Image>
        </div>
        <div className="flex-1">
          <Link href="/homepage" className="btn btn-ghost text-4xl">
            Classify
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {!hiddenCourseBt && (
              <li>
                <SideBar></SideBar>
              </li>
            )}
            <li className="justify-center">
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("userId");
                  router.push("/login");
                }}
                className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
