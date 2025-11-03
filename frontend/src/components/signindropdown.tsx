"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignInDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hover:scale-105 duration-300 bg-[#3cb826] text-shadow-lg text-white font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition cursor-pointer"
      >
        Sign In
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-64 bg-[#111111] shadow-[0_0_10px_#ffffff] rounded-lg p-5 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href="/signin"
            className="duration-300 hover:scale-102 text-shadow-lg block w-full text-center bg-[#3cb826] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Sign in
          </Link>
          <p className="text-center text-gray-400 mt-4 text-sm">
            New here?{" "}
            <Link
              href="/signup"
              className="hover:scale-105 text-blue-500 hover:underline duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
