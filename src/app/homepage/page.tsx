"use client";

import Button from "@/components/Button";

export default function Homepage() {
  return (
    <div data-theme="winter">
      {/* Outer full-screen container */}
      <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4">
        {/* Inner responsive flex layout */}
        <div className="flex flex-col xl:flex-row-reverse items-center justify-between w-full max-w-6xl gap-12">
          {/* Image */}
          <img
            src="/homepageprop.png"
            alt="Classify landing illustration"
            className="w-full max-w-[350px] xl:max-w-[600px] rounded-lg shadow-2xl"
          />

          {/* Text block */}
          <div className="text-center xl:text-left w-full">
            <h1 className="text-3xl xl:text-6xl font-bold whitespace-nowrap xl:whitespace-normal">
              <span className="text-nowrap">Skip the small talk</span>
            </h1>
            <h2 className="py-4 xl:py-6 text-lg xl:text-2xl">
              Connect. Collaborate. Classify.
            </h2>
            <p className="mb-6">Join classmates who want to collaborate!</p>
            <div className="flex justify-center xl:justify-start">
              <Button />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
