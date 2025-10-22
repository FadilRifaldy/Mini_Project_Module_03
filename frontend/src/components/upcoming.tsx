import Link from "next/link";
import { getUpcomingEvents } from "@/lib/backend"; 

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents(); 

  return (
    <div className="max-w-7xl mx-auto px-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event, idx) => (
          <Link
            key={idx}
            href={`/events/${event.id}`}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-transform hover:scale-102 duration-500"
          >
            <article className="flex flex-col h-full">
              {/* Event image */}
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={event.imgUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event content */}
              <div className="px-5 pt-4 space-y-3 flex-1">
                {/* Event title */}
                <h3 className="text-xl font-semibold text-gray-800 leading-tight pb-3 hover:text-blue-600">
                  {event.title}
                </h3>

                {/* Event description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {event.content || "No description available."}
                </p>

                {/* Event details */}
                <div className="pt-3 pb-3 flex flex-col text-xs text-gray-500 space-y-1 border-t border-gray-300">
                  <span>
                    📅 Date:{" "}
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>📍 Location: {event.location}</span>
                  <span>
                    💸 Price:{" "}
                    {event.price === 0
                      ? "Free"
                      : `Rp ${event.price.toLocaleString("id-ID")}`}
                  </span>
                  <span>
                    🎟️ Available: {event.availableTickets} / {event.totalTickets}
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
