"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getEventById,
  getTransactionById,
  updateTransactionStatus,
  IEvent,
} from "@/lib/backend";

interface ITransaction {
  id: string;
  transactionStatuses: string;
  paymentMethod: string;
  transactionDate: string;
  totalPrice: number;
}

interface EventDetailProps {
  id: string;
}

export default function EventDetail({ id }: EventDetailProps) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const [availablePct, setAvailablePct] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [income, setIncome] = useState(0);

  const [animatedAvailable, setAnimatedAvailable] = useState(0);
  const [animatedSold, setAnimatedSold] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getEventById(id);
      if (!data) return;

      const availablePercentage =
        (data.availableTickets / data.totalTickets) * 100;
      const sold = data.totalTickets - data.availableTickets;
      const totalIncome = data.price * sold;

      setEvent(data);
      setAvailablePct(availablePercentage);
      setSoldCount(sold);
      setIncome(totalIncome);

      setTimeout(() => {
        setAnimatedAvailable(availablePercentage);
        setAnimatedSold((sold / data.totalTickets) * 100);
        setAnimatedIncome(totalIncome);
      }, 100);
    })();

    (async () => {
      const tx = await getTransactionById(id);
      setTransactions(tx || []);
    })();
  }, [id]);

  // 💡 Handle Accept / Reject actions
  const handleUpdateStatus = async (
    transactionId: string,
    newStatus: string
  ) => {
    try {
      // Optimistic UI update
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId ? { ...t, transactionStatuses: newStatus } : t
        )
      );

      // Call backend API
      await updateTransactionStatus(transactionId, newStatus);
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

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
        {/* Event Image */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-[#333]">
          <Image
            src={event.imgUrl || "/placeholder.jpg"}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Event Info */}
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

        {/* Description */}
        <div className="bg-[#181818] p-4 rounded-lg border border-[#2D2D2D]">
          <h2 className="font-semibold font-audiowide mb-2">Description</h2>
          <p className="text-gray-200 font-exo2">
            {event.content || "No description available."}
          </p>
        </div>

        {/* Ticket Info */}
        <div className="bg-[#181818] p-4 rounded-lg border border-[#2D2D2D] flex flex-col justify-center gap-4">
          <div className="bg-[#6f00ff] text-white px-3 py-1 rounded-lg font-medium font-orbitron w-fit">
            {event.price === 0
              ? "Free"
              : `Rp ${event.price.toLocaleString("id-ID")} / ticket`}
          </div>

          <div className="flex gap-5">
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-medium font-orbitron w-fit">
              Available: {event.availableTickets}
            </div>
            <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-medium font-orbitron w-fit">
              Sold: {soldCount}
            </div>
          </div>

          <div className="flex w-full h-6 rounded-lg overflow-hidden border border-[#2D2D2D] bg-[#111]">
            <div
              className="bg-green-600 text-white text-center text-xs flex items-center justify-center transition-all duration-700 ease-out"
              style={{ width: `${animatedAvailable}%` }}
            >
              {event.availableTickets}
            </div>
            <div
              className="bg-red-600 text-white text-center text-xs flex items-center justify-center transition-all duration-700 ease-out"
              style={{ width: `${animatedSold}%` }}
            >
              {soldCount}
            </div>
          </div>

          <div className="bg-[#6f00ff] text-white px-3 py-1 rounded-lg font-medium font-orbitron w-fit transition-all duration-700 ease-out">
            {event.price === 0
              ? "Free"
              : `Total Income : Rp ${animatedIncome.toLocaleString("id-ID")}`}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-[#181818] p-4 rounded-lg border border-[#2D2D2D] flex flex-col gap-3">
          <h2 className="font-audiowide text-lg mb-2 text-[#b400ff]">
            Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 font-exo2">No transactions yet.</p>
          ) : (
            transactions.map((t) => (
              <div
                key={t.id}
                className="bg-[#222] border border-[#333] p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors space-y-2"
              >
                <div className="font-orbitron text-sm text-gray-300">
                  <span className="text-[#04D9FF]">Status:</span>{" "}
                  {t.transactionStatuses}
                </div>
                <div className="font-orbitron text-sm text-gray-300">
                  <span className="text-[#04D9FF]">Payment:</span>{" "}
                  {t.paymentMethod}
                </div>
                <div className="font-orbitron text-sm text-gray-300">
                  <span className="text-[#04D9FF]">Date:</span>{" "}
                  {new Date(t.transactionDate).toLocaleDateString("id-ID")}
                </div>
                <div className="font-orbitron text-sm text-gray-300">
                  <span className="text-[#04D9FF]">Total:</span> Rp{" "}
                  {t.totalPrice.toLocaleString("id-ID")}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleUpdateStatus(t.id, "SUCCESS")}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md font-orbitron text-sm transition-all hover:cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(t.id, "CANCELLED")}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md font-orbitron text-sm transition-all hover:cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
