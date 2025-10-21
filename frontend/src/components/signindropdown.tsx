"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignInDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#3cb826] text-shadow-lg text-white font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition cursor-pointer"
      >
        Sign In
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-5 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href="/signin"
            className="text-shadow-lg block w-full text-center bg-[#20B2AA] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Sign in
          </Link>
          <p className="text-center text-gray-600 mt-4 text-sm">
            New here?{" "}
            <Link href="/signup" className="text-[#20B2AA] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
