"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { getEventById } from "@/lib/backend";
import Pricing from "@/components/popup-transaction";
import { IEvent } from "@/lib/backend";

interface EventDetailProps {
  params: Promise<{ id: string }>;
}

export default function EventDetail({ params }: EventDetailProps) {
  const { id } = use(params);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getEventById(id);
      setEvent(data);
    })();
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading event...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative w-full h-100 rounded-xl overflow-hidden shadow-lg border border-[#333]">
          <Image
            src={event.imgUrl || "/placeholder.jpg"}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-orbitron font-bold text-[#b400ff]">
            {event.title}
          </h1>
          <div className="flex gap-3">
            <Image
              src="/images/location.png"
              alt="icon"
              width={20}
              height={20}
              className="object-contain invert brightness-150"
            />
            <p className="text-gray-300 font-orbitron">{event.location}</p>
          </div>
          <p className="text-gray-400 text-sm font-audiowide">
            {new Date(event.startDate).toLocaleDateString("id-ID")} –{" "}
            {new Date(event.endDate).toLocaleDateString("id-ID")}
          </p>
        </div>

        <div className="bg-[#181818] p-4 rounded-lg border border-[#2D2D2D]">
          <h2 className="font-semibold font-audiowide mb-2">Description</h2>
          <p className="text-gray-200 font-exo2">
            {event.content || "No description available."}
          </p>
        </div>

        <div className="bg-[#181818] p-4 rounded-lg border border-[#2D2D2D] flex flex-wrap items-center justify-between gap-4">
          <span className="bg-[#6f00ff] text-white px-3 py-1 rounded-lg font-medium font-orbitron">
            {event.price === 0
              ? "Free"
              : `Rp ${event.price.toLocaleString("id-ID")}`}
          </span>
          <span className="bg-[#007B83] text-white px-3 py-1 rounded-lg font-medium font-audiowide">
            Available Ticket: {event.availableTickets} / {event.totalTickets}
          </span>
          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer font-audiowide bg-amber-300 text-black font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            See Pricing
          </button>
        </div>
      </div>

      <Pricing
        event={event}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </main>
  );
}
