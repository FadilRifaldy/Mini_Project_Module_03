"use client";

import Link from "next/link";
import Image from "next/image";
import SignInDropdown from "./signindropdown";
import { useEffect } from "react";
import axios from "axios";
import useAuthStore from "@/app/stores/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { username, role } = useAuthStore((s) => s);
  const setUser = useAuthStore((s) => s.setUser);
  const readCookie = useAuthStore((s) => s.readCookie);
  const router = useRouter();

  useEffect(() => {
    readCookie();
  }, [readCookie]);

  async function logout() {
    try {
      await axios.post(
        "http://localhost:8500/auth/logout",
        {},
        { withCredentials: true }
      );
      alert("Berhasil Logout");
      setUser("", "");
      router.push("/");
    } catch (error) {
      alert(error);
    }
  }
  return (
    <nav className="top-0 w-full bg-[#000000] z-50 shadow-md text-[#F5F5F5] font-audiowide">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-3 sm:px-5 lg:px-8 py-1 pb-4 sm:py-2 lg:py-2.5 space-y-2 md:space-y-0">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={170}
              height={50}
              className="hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] transition-all hover:scale-105 duration-300"
            />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 sm:gap-5 md:gap-6 lg:gap-8 font-medium text-sm sm:text-base md:text-[1rem]">
          <Link
            href="/discover-events"
            className="hover:underline hover:text-[#ff00ff] transition-all hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] hover:scale-110 duration-300"
          >
            Discover
          </Link>
          {/* <Link
            href="/categories"
            className="hover:hover:text-[#00FFFF] transition-colors"
          >
            Categories
          </Link> */}
          <Link
            href="/pricing"
            className="hover:underline hover:text-[#FFD700]  transition-all hover:brightness-150 hover:drop-shadow-[0_0_6px_#FFD700] hover:scale-110 duration-300"
          >
            Pricing
          </Link>
          <Link
            href="/promotions"
            className="hover:underline hover:text-[#FF6E00] transition-all hover:brightness-150 hover:drop-shadow-[0_0_6px_#FF6E00] hover:scale-110 duration-300"
          >
            Promotions
          </Link>
          <Link
            href="/my-tickets"
            className="hover:underline hover:text-[#00FFFF] transition-all hover:brightness-150 hover:drop-shadow-[0_0_6px_#00FFFF] hover:scale-110 duration-300"
          >
            My Tickets
          </Link>

          {role === "EventOrganizer" ? (
            <Link
              href="/my-events"
              className="hover:underline hover:text-[#4D4DFF] transition-all hover:brightness-150 hover:drop-shadow-[0_0_6px_#4D4DFF] hover:scale-110 duration-300"
            >
              My Events
            </Link>
          ) : (
            ""
          )}

          <Link
            href="/create-event"
            className="hover:scale-105 duration-300 text-shadow-lg gap-2 flex justify-center items-center bg-[#9400FF] text-white font-semibold px-2 sm:px-2 lg:px-3 py-1.5 sm:py-1.5 rounded-lg hover:opacity-90 transition"
          >
            <Image src="/images/stage.png" alt="arrow" width={25} height={0} />
            Create Event
          </Link>

          {username ? (
            <div className="flex gap-2 justify-center items-center">
              <Link
                href="/profile"
                className="hover:scale-105 duration-300 text-shadow-lg gap-2 flex justify-center items-center bg-[#1F51FF] text-white font-semibold px-2 sm:px-2 lg:px-3 py-1.5 sm:py-1.5 rounded-lg hover:opacity-90 transition"
              >
                {username}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hover:scale-105 duration-300 text-shadow-lg gap-2 flex justify-center items-center bg-red-600 text-white font-semibold px-2 sm:px-2 lg:px-3 py-1.5 sm:py-1.5 rounded-lg hover:opacity-90 transition hover:cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <SignInDropdown />
          )}
        </div>
      </div>
    </nav>
  );
}
