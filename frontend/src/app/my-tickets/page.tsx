"use client";
import { useEffect, useState } from "react";
import { getMyTickets, ITicket } from "@/lib/backend";
import { statusColors } from "@/lib/statuses";
import { Statuses } from "@/lib/statuses";

export default function MyTickets() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        console.log("Response tiket:", data);

        if (data.success) {
          const mappedTickets = data.tickets.map((t) => ({
            ...t,
            status: t.status as Statuses,
          }));
          setTickets(mappedTickets);
        } else {
          setError("Gagal mengambil tiket");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan tidak diketahui");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Memuat tiket...</p>;
  if (error) return <p>{error}</p>;
  if (tickets.length === 0) return <p>Belum ada tiket.</p>;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-white mb-4 font-audiowide">My Tickets</h1>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-[#181818] p-4 rounded-xl border border-[#333] shadow-md hover:scale-102 transition-all duration-300 hover:shadow-[0_0_20px_#C000FF60]"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-[#b891f9] font-audiowide">
                {ticket.eventTitle}
              </h2>
              <span
                className={`${
                  statusColors[ticket.status]
                } px-2 py-1 rounded-full text-sm font-semibold font-audiowide`}
              >
                {ticket.status}
              </span>
            </div>
            <p className="text-gray-300 font-exo2">
              Tanggal Event:{" "}
              {new Date(ticket.startDate).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-300 font-exo2">
              Dibeli: {new Date(ticket.purchasedAt).toLocaleString("id-ID")}
            </p>
            <p className="text-green-500 font-semibold">
              <span className="text-shadow-[0_0_3px_#00FF00]">Total: Rp {ticket.totalPrice.toLocaleString("id-ID")}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
