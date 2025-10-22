import Image from "next/image";
import Link from "next/link";
import UpcomingEvents from "@/components/upcoming";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative h-[87.5vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/banner.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center space-y-6 px-4">
          <h1 className="text-3xl sm:text-6xl font-bold font-orbitron text-white">
            Start Creating Your Event
          </h1>
          <div className="max-w-7xl text-xl sm:text-2xl font-bold text-white font-orbitron">
            Your event. Your rules. Build experiences that inspire the future
          </div>
          <Link
            href="/create-event"
            className="bg-[#FF00FF] font-orbitron text-black font-semibold px-6 sm:px-8 py-3 rounded-lg hover:opacity-90 hover:scale-105 transition-transform duration-300"
          >
            Create Event
          </Link>
        </div>
      </section>
      <section className="py-10 sm:py-14 md:py-20 lg:py-24 border-8 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center sm:text-left">
              Upcoming Events
            </h2>

            <Link
              href="/discover-events"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-500"
            >
              See All Events
            </Link>
          </div>

          {/* Content */}
          <div>
            <UpcomingEvents />
          </div>
        </div>
      </section>
    </main>
  );
}
