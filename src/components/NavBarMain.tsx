import Link from "next/link";
import Image from "next/image";
export default function NavBarMain() {
  return (
    <>
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
              <li>
                <Link href="/" className="text-2xl">
                  Learn More
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
