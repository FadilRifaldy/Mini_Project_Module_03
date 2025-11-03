import Link from "next/link";
import { getUpcomingEvents } from "@/lib/backend";

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  return (
    <div className="max-w-7xl mx-auto px-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/discover-events/${event.id}`}
            className="group bg-black rounded-xl
                           transition-all duration-300 hover:scale-103
                           hover:shadow-[0_0_15px_#C000FF60] overflow-hidden flex flex-col relative"
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

              {/* Konten */}
              <div className="p-5 flex flex-col justify-between grow relative">
                <div>
                  <h3 className="font-audiowide text-md font-semibold text-[#F5F5F5] mb-2 group-hover:text-[#C000FF] transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="font-exo2 text-gray-400 text-sm line-clamp-2">
                    {event.content || "No description available."}
                  </p>
                </div>

                {/* Info Harga & Tiket */}
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
                  <span className="text-[10px] font-exo2 text-[#F5F5F5] bg-black border border-[#2D2D2D] px-3 py-1 rounded-full">
                    {new Date(event.startDate).toLocaleDateString("id-ID")}
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
    </div>
  );
}
