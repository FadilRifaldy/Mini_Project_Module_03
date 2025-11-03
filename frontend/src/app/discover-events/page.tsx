"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import {
  getNewsHeadline,
  getAllCategories,
  getEventsByCategory,
  getAllLocations,
  getEventsByLocation,
  getEventsByCategoryAndLocation,
  IEvent,
} from "@/lib/backend";
import { useSearchParams } from "next/navigation";
import { LocationSelect } from "@/components/locationfilter";

export default function DiscoverEvents() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All");

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchLocations = async () => {
      const fetchedLocations = await getAllLocations();
      setLocations(["All", ...fetchedLocations]);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const Categories = async () => {
      const fetchedCategories = await getAllCategories();
      setCategories(["All", ...fetchedCategories]);
    };
    Categories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let data: IEvent[] = [];

      if (selectedCategory !== "All" && selectedLocation !== "All") {
        data = await getEventsByCategoryAndLocation(
          selectedCategory,
          selectedLocation,
          search
        );
      } else if (selectedCategory !== "All") {
        data = await getEventsByCategory(selectedCategory, search);
      } else if (selectedLocation !== "All") {
        data = await getEventsByLocation(selectedLocation, search);
      } else {
        data = await getNewsHeadline(search);
      }

      setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, [selectedCategory, selectedLocation, search]);

  return (
    <main className="min-h-screen bg-black">
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/banner-event.jpg"
          alt="banner event"
          fill
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/45 to-black/100 flex flex-col justify-center items-center text-center px-4 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold font-orbitron text-white drop-shadow-lg max-w-5xl">
              Discover & Create Unforgettable Events
            </h1>
            <p className="max-w-4xl mx-auto text-lg sm:text-2xl text-gray-200 font-orbitron">
              Browse, search, and create experiences that inspire the future.
            </p>
          </div>

          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-4xl">
            <SearchBar />
            <LocationSelect
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 font-audiowide">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? "All" : cat)
              }
              className={`cursor-pointer px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#C000FF] text-white font-semibold border-[#C000FF] shadow-[0_0_13px_#C000FF]"
                  : "bg-[black] text-gray-400 border-[#2D2D2D] hover:text-[#C000FF] hover:border-[#C000FF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-7">
          {loading ? (
            <p className="text-center text-gray-400 pb-2 md:pt-10">
              Loading events...
            </p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-400 pb-2 md:pt-10">
              No events found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/discover-events/${event.id}`}
                  className="group bg-black rounded-xl
                           transition-all duration-300 hover:scale-103
                           hover:shadow-[0_0_20px_#C000FF60] overflow-hidden flex flex-col relative"
                >
                  <article className="flex flex-col h-full">
                    <div className="relative w-full h-48 overflow-hidden font-audiowide">
                      <img
                        src={event.imgUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {event.category && (
                        <div className="absolute top-3 left-3 bg-[#F5F5F5] text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          {event.category}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between grow relative">
                      <div>
                        <h3 className="font-audiowide text-md font-semibold text-[#F5F5F5] mb-2 group-hover:text-[#C000FF] transition-colors duration-300">
                          {event.title}
                        </h3>
                        <p className="font-exo2 text-gray-400 text-sm line-clamp-2">
                          {event.content || "No description available."}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#2D2D2D] text-[#F5F5F5] space-y-1">
                        <div className="flex items-center gap-2 font-audiowide">
                          <span>
                            {event.price === 0
                              ? "Free"
                              : `Rp ${event.price.toLocaleString("id-ID")}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-orbitron">
                          <span>
                            {event.availableTickets} / {event.totalTickets}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-3">
                        <span className="text-[11px] font-exo2 text-[#F5F5F5] bg-black border border-[#2D2D2D] px-3 py-1 rounded-full">
                          {new Date(event.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                          {event.endDate && event.startDate !== event.endDate
                            ? ` – ${new Date(event.endDate).toLocaleDateString(
                                "id-ID"
                              )}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
