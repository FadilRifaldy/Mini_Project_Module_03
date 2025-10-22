"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import { getNewsHeadline, IEvent } from "@/lib/backend";

export default function DiscoverEvents() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await getNewsHeadline(searchQuery);
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, [searchQuery]);

  return (
    <main className="min-h-screen">
      {/* Banner */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/banner-event.jpg"
          alt="banner event"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold font-orbitron text-white drop-shadow-lg max-w-5xl">
              Discover & Create Unforgettable Events
            </h1>
            <p className="max-w-4xl mx-auto text-lg sm:text-2xl text-gray-200 font-orbitron">
              Browse, search, and create experiences that inspire the future.
            </p>
          </div>

          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-4xl shadow-lg">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Event List */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-7">
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-transform hover:scale-102 duration-500"
                >
                  <article className="flex flex-col h-full">
                    <div className="relative h-60 w-full overflow-hidden">
                      <img
                        src={event.imgUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-5 pt-4 space-y-3 flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 leading-tight pb-3 hover:text-blue-600">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {event.content || "No description available."}
                      </p>
                      <div className="pt-3 pb-3 flex flex-col text-xs text-gray-500 space-y-1 border-t border-gray-300">
                        <span>
                          📅 {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>📍 {event.location}</span>
                        <span>
                          💸 {event.price === 0 ? "Free" : `Rp ${event.price.toLocaleString("id-ID")}`}
                        </span>
                        <span>
                          🎟️ {event.availableTickets} / {event.totalTickets}
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
