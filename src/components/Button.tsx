"use client";
import { useRouter } from "next/navigation";
export default function Button() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
  return (
    <div className="pt-12">
      <button onClick={handleClick} className="btn btn-primary">
        Get Started
      </button>
    </div>
  );
}
