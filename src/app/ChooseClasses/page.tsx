"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface ClassData {
  id: string;
  courseCode: string;
  courseName: string;
  semester: string;
}

export default function ChooseClasses(): React.ReactElement {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Load user ID from localStorage or other method
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/login");
    } else {
      setUserId(id);
    }

    // Fetch all available classes
    fetch(`${apiUrl}/api/classrooms`)
      .then((res) => res.json())
      .then((data: ClassData[]) => setClasses(data))
      .catch((err) => console.error("Failed to load classes", err));
  }, [router]);

  const toggleSelection = (id: string): void => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    for (let classId of selectedIds) {
      await fetch(`${apiUrl}/api/user/${userId}/classrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: classId }),
      });
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Choose Your Classes</h1>
      <hr
        style={{
          background: "blue",
          color: "blue",
          borderColor: "blue",
          height: "2px",
          width: "100%",
        }}
      />
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col-reverse bg-gray-800 text-white text-2xl border-2 border-black rounded-md"
          >
            <input
              type="checkbox"
              id={`class-${cls.id}`}
              checked={selectedIds.includes(cls.id)}
              onChange={() => toggleSelection(cls.id)}
              className="mr-2 mt-40 checkbox"
            />
            <label htmlFor={`class-${cls.id}`}>
              {cls.courseCode} - {cls.courseName} ({cls.semester})
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Submit Classes
        </button>
      </form>
    </div>
  );
}
