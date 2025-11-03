import Image from "next/image";
import Link from "next/link";
import UpcomingEvents from "@/components/upcoming";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] sm:h-[85vh] md:h-[87.5vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/banner.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/45 to-black/100 flex flex-col justify-center items-center text-center space-y-4 sm:space-y-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron text-white leading-snug">
            Start Creating Your Event
          </h1>
          <div className="max-w-4xl text-base sm:text-xl md:text-2xl font-bold text-gray-200 font-orbitron leading-relaxed">
            Your event. Your rules. Build experiences that inspire the future
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/create-event"
              className="hover:shadow-[0_0_20px_#FF00FF] text-shadow-lg bg-[#f009f0] font-orbitron text-black font-semibold px-5 sm:px-8 py-3 sm:py-3.5 rounded-lg hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Create Event
            </Link>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-20 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F5F5] text-center sm:text-left">
              Upcoming Events
            </h2>
            <Link
              href="/discover-events"
              className="font-audiowide hover:brightness-150 hover:drop-shadow-[0_0_6px_#00FFFF] text-[#C000FF] hover:text-blue-500 font-medium text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              See All Events
            </Link>
          </div>

          <div className="w-full">
            <UpcomingEvents />
          </div>
        </div>
      </section>

      {/* EXPLORE BY CATEGORY */}
      <section className="relative py-16 md:py-18 sm:py-45 bg-[#111111] overflow-hidden h-auto sm:h-[60vh] md:h-[60vh]">
        <Image
          src="/images/banner-event.jpg"
          alt="banner event"
          fill
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/50 to-black/100"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-orbitron text-2xl sm:text-3xl text-white mb-6 sm:mb-10 drop-shadow-[0_0_10px_#000]">
            Explore by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { name: "Music", icon: "🎵" },
              { name: "Technology", icon: "💻" },
              { name: "Business", icon: "💼" },
              { name: "Art & Culture", icon: "🎨" },
              { name: "Sports", icon: "⚽" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/discover-events?category=${cat.name}`}
                className="bg-gradient-to-b from-[#1f1f1f]/80 to-[#2a2a2a]/80 border border-[#444] rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform hover:shadow-[0_0_15px_#8f00ff] flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <div className="text-2xl sm:text-3xl mb-2">{cat.icon}</div>
                <p className="font-orbitron text-white text-xs sm:text-sm md:text-base">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20 sm:py-24 lg:pb-35 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <h2 className="font-orbitron text-2xl sm:text-3xl text-white mb-12 sm:mb-16 tracking-wide">
            How It Works
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 top-[4%] bottom-[6%] w-1 bg-[#FF00FF] rounded-full shadow-[0_0_20px_#FF00FF80] z-0"></div>

            <div className="space-y-14 sm:space-y-20 relative z-10">
              {[
                {
                  title: "Create Your Event",
                  desc: "Set up your event details, upload images, and set ticket prices easily.",
                },
                {
                  title: "Promote & Share",
                  desc: "Share your event page with the world through social media and email.",
                },
                {
                  title: "Manage & Track",
                  desc: "Monitor ticket sales, check-in attendees, and analyze performance in real-time.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`flex flex-col md:flex-row items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8 sm:gap-10`}
                >
                  <div className="flex-1 text-right md:text-left px-2 sm:px-0">
                    <h3 className="font-orbitron text-[#FF00FF] text-base sm:text-lg z-10 relative">
                      Step {i + 1}: {item.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base relative z-10">
                      {item.desc}
                    </p>
                  </div>

                  <div className="relative z-20 flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#111] border-2 border-[#FF00FF] shadow-[0_0_25px_#FF00FF80] font-orbitron text-[#FF00FF] text-sm sm:text-lg">
                    {i + 1}
                  </div>

                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative py-20 md:py-16 sm:py-45 overflow-hidden h-auto sm:h-[60vh] md:h-[60vh]">
        {/* Background image */}
        <Image
          src="/images/banner-event.jpg"
          alt="banner event"
          fill
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          priority
        />

        {/* Overlay agar teks tetap terbaca */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/50 to-black/100" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6">
          <h2 className="font-orbitron text-2xl sm:text-3xl text-white mb-10 sm:mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 text-gray-300">
            {[
              {
                title: "Real-Time Analytics",
                desc: "Track event sales and attendance instantly with detailed reports.",
              },
              {
                title: "Custom Vouchers",
                desc: "Create and manage discounts to boost ticket sales.",
              },
              {
                title: "Secure Payments",
                desc: "Multiple payment methods with encrypted transactions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#1f1f1f]/90 border border-[#333] rounded-xl p-6 sm:p-8 hover:shadow-[0_0_20px_#00ffff80] transition-shadow backdrop-blur-sm"
              >
                <h3 className="font-orbitron text-[#00FFFF] mb-2 text-base sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* NEWSLETTER */}
      <section className="py-16 sm:py-20 bg-black">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
          <h2 className="font-orbitron text-xl sm:text-2xl md:text-3xl text-white mb-4 sm:mb-6">
            Stay Updated with Our Latest Events
          </h2>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Subscribe to our newsletter and never miss the hottest events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-2/3 p-2.5 sm:p-3 rounded-lg border border-[#333] bg-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base"
            />
            <button className="hover:shadow-[0_0_20px_#FF00FF] font-audiowide cursor-pointer bg-[#f009f0] text-black font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:scale-105 transition-transform text-sm sm:text-base">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
