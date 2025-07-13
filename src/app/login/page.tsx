"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginPhoto from "../../../public/loginphoto.jpg";

interface FormData {
  username: string;
  password: string;
}

interface User {
  username: string;
}

interface ClassroomData {
  length: number;
}

export default function Login(): React.ReactElement {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const res = await fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const text = await res.text();

    if (res.ok) {
      // Save username to local storage
      localStorage.setItem("user", JSON.stringify({ username: form.username }));

      // Get userId by making a request (you can change this if you return the ID directly from login)
      const userRes = await fetch(
        `${apiUrl}/api/users/username/${form.username}`
      );
      if (!userRes.ok) {
        setMessage("❌ Failed to fetch user data.");
        return;
      }
      const user: string = await userRes.json();
      const userId: string = user;
      localStorage.setItem("userId", userId);
      console.log(localStorage);

      // Check if the user has any classrooms
      const classRes = await fetch(`${apiUrl}/api/user/${userId}/classrooms`);
      console.log(classRes);
      if (!classRes.ok) {
        setMessage("❌ Failed to verify class enrollment.");
        return;
      }
      const classData: ClassroomData = await classRes.json();

      setMessage("✅ Login successful!");
      setTimeout(() => {
        if (classData.length === 0) {
          router.push("/ChooseClasses");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } else {
      setMessage(`❌ ${text}`);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center backdrop-blur-md bg-white text-gray-800 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-5 rounded shadow-md w-[40%] h-[100vh] flex flex-col justify-center "
        >
          <div className="flex items-center mb-[50px] justify-center">
            <h1 className="text-4xl font-bold">Welcome Back</h1>
          </div>

          <h2 className="text-2xl font-lightweight mb-6 text-center">Login</h2>

          {(["username", "password"] as const).map((field) => (
            <div key={field} className="mb-4">
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full px-4 py-2 rounded bg-white text-black border border-gray-600 focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-800"
          >
            Log In
          </button>

          {message && (
            <p className="mt-4 text-sm text-center text-red-400">{message}</p>
          )}
        </form>
        <div className="w-[60%] h-[100vh] relative  ">
          <Image
            src={LoginPhoto}
            alt="Login Photo"
            className="object-cover p-5"
            fill
            priority
          ></Image>
        </div>
      </div>
    </>
  );
}
