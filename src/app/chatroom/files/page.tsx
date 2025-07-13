"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Files {
  id: number;
  filename: string;
  fileUrl: string;
  category: string;
}

export default function Files() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [files, setFiles] = useState<Files[]>([]);
  const categories = ["Homework", "Notes", "Exams", "Programming"];

  // Get classroomId from search params once on mount
  useEffect(() => {
    const urlClassroomId = searchParams.get("classId");
    setClassroomId(urlClassroomId);
  }, [searchParams]);

  // Fetch files when classroomId changes and is not null
  useEffect(() => {
    if (!classroomId) return; // don't fetch if no classroomId yet

    fetch(`${apiUrl}/api/classroom/${classroomId}/files`)
      .then((res) => res.json())
      .then((files: Files[]) => setFiles(files))
      .catch((err) => console.error("Failed to fetch files", err));
  }, [classroomId]);

  return (
    <div>
      {categories.map((category) => {
        const filesInCategory = files.filter(
          (file) => file.category === category
        );
        return (
          <div key={category} className="m-2">
            <h1 className="text-3xl pb-2">{category}</h1>
            <ul>
              {filesInCategory.length > 0 ? (
                filesInCategory.map((file) => (
                  <li key={file.id} className="pt-2 pb-2">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-l text-blue-500 hover:underline"
                    >
                      {file.filename}
                    </a>
                  </li>
                ))
              ) : (
                <li>No files in this category</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
