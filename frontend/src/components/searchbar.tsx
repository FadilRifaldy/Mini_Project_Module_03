"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IEvent } from "@/lib/backend";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // loading saat user mulai mengetik
  useEffect(() => {
    if (query.trim() !== "") {
      setLoading(true);
    }
  }, [query]);

  // Fetch suggestions berdasarkan debounce
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8500/event/all?search=${encodeURIComponent(
            debouncedQuery
          )}`
        );
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Klik suggestion → update query params
  const handleSelect = (title: string) => {
    setQuery(title);
    setShowDropdown(false);

    const params = new URLSearchParams(window.location.search);
    params.set("search", title);
    router.replace(`?${params.toString()}`);
  };

  // Submit enter
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (query) params.set("search", query);
    else params.delete("search");
    router.replace(`?${params.toString()}`);
    setShowDropdown(false);
  };

  // Kosongkan pencarian → tampilkan semua event
  useEffect(() => {
    if (query === "") {
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      router.replace(`?${params.toString()}`);
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  // Tutup dropdown saat klik di luar input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex-1 w-full max-w-3xl"
      autoComplete="off"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search events..."
        className="w-full bg-white text-black placeholder-gray-400 border border-gray-300 rounded-lg px-4 pr-14 py-3 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition"
      />

      <button
        type="submit"
        onClick={(e) => handleSubmit(e)}
        className="absolute top-0 right-0 h-full px-4 bg-[#00FFFF] hover:bg-[#00e0e0] rounded-r-lg flex items-center justify-center transition"
      >
        <Image
          src="/images/icon-search.svg"
          alt="search icon"
          width={34}
          height={18}
        />
      </button>

      {/* Dropdown hasil pencarian */}
      {showDropdown && (loading || results.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-50"
        >
          {loading ? (
            <div className="p-3 text-gray-500 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            results.map((event) => (
              <div
                key={event.id}
                onClick={() => handleSelect(event.title)}
                className="p-3 hover:bg-gray-100 cursor-pointer text-left"
              >
                {event.title}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </form>
  );
}
