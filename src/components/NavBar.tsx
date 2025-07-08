import Link from "next/link";
import Image from "next/image";
import myicon from "../../public/icon.jpg";
export default function NavBar() {
  return (
    <div data-theme="winter">
      <div className="navbar bg-base-100 shadow-sm sticky-top">
        <div>
          <Image src={myicon} alt="My logo" height={50} width={50}></Image>
        </div>
        <div className="flex-1">
          <Link href="/homepage" className="btn btn-ghost text-4xl">
            Classify
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/login" className="text-2xl">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="text-2xl">
                Signup
              </Link>
            </li>
            <li>
              <Link href="/" className="text-2xl">
                Learn More
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
