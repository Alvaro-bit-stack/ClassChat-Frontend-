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
    fetch("http://localhost:8080/api/classrooms")
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
      await fetch(`http://localhost:8080/api/user/${userId}/classrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: classId }),
      });
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Choose Your Classes</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {classes.map((cls) => (
          <div key={cls.id} className="flex items-center">
            <input
              type="checkbox"
              id={`class-${cls.id}`}
              checked={selectedIds.includes(cls.id)}
              onChange={() => toggleSelection(cls.id)}
              className="mr-2"
            />
            <label htmlFor={`class-${cls.id}`}>
              {cls.courseCode} - {cls.courseName} ({cls.semester})
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Submit Classes
        </button>
      </form>
    </div>
  );
}