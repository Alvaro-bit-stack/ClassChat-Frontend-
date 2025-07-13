import React, { Suspense } from "react";
import FilesClient from "./FilesClient";

export const revalidate = 0; // Optional: to disable static prerendering

export default function Files() {
  return (
    <Suspense fallback={<div>Loading files...</div>}>
      <FilesClient />
    </Suspense>
  );
}
