"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchFromUrl = params.get("search") || "";
    setQuery(searchFromUrl);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const currentSearch = params.get("search") || "";

      if (query.trim() === "") {
        params.delete("search");
      } else if (query !== currentSearch) {
        params.set("search", query);
      }

      const newUrl = `?${params.toString()}`;
      if (newUrl !== window.location.search) {
        router.replace(newUrl);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, router]);

  return (
    <div className="font-audiowide shadow-[0_0_3px_#6f00ff] relative flex-1 w-full max-w-3xl rounded-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
        className="w-full bg-[#1A1A1A] text-[#F5F5F5] placeholder-[#9CA3AF] border border-[#2D2D2D] rounded-lg px-4 pr-14 py-3
        focus:outline-none focus:border-[#6f00ff] focus:ring-2 focus:ring-[#6f00ff] transition-all duration-200
        hover:border-[#6f00ff]/60"
      />

      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams(window.location.search);
          if (query.trim() === "") params.delete("search");
          else params.set("search", query);
          router.replace(`?${params.toString()}`);
        }}
        className="cursor-pointer absolute top-0 right-0 h-full px-5 bg-[#6f00ff] hover:bg-[#6f00ff] rounded-r-lg flex items-center justify-center transition-all duration-200"
      >
        <img
          src="/images/icon-search.svg"
          alt="search icon"
          width={22}
          height={22}
          className="invert brightness-0"
        />
      </button>
    </div>
  );
}
