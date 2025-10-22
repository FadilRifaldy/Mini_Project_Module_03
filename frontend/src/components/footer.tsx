import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#000000] text-gray-300 font-audiowide border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 flex flex-col md:flex-row md:justify-between md:items-start gap-y-12 md:gap-y-0 md:gap-x-10 lg:gap-x-16">
        <div className="w-full md:w-[28%] lg:w-[26%]">
          <div>
            <Image
              src="/images/logo.svg"
              alt="Logo Footer"
              width={300}
              height={0}
              className="hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] transition-all duration-300"
            />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Empowering your creativity — plan, manage, and celebrate events that
            inspire the future.
          </p>
        </div>

        {/* F&F Events */}
        <div className="w-[10%] min-w-[160px] pt-5">
          <h3 className="text-lg font-semibold text-white mb-5">F&F Events</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[#FF00FF] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                className="hover:text-[#FF00FF] transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/sign-up"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="/sign-in"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="w-[10%] min-w-[160px] pt-5">
          <h3 className="text-lg font-semibold text-white mb-5">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/discover-events"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Discover Events
              </Link>
            </li>
            <li>
              <Link
                href="/create-events"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Create Event
              </Link>
            </li>
            <li>
              <Link
                href="/my-tickets"
                className="hover:text-[#FF00FF] transition-colors"
              >
                My Tickets
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="w-[10%] min-w-[160px] pt-5">
          <h3 className="text-lg font-semibold text-white mb-5">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/faq"
                className="hover:text-[#FF00FF] transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-[#FF00FF] transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div className="w-[10%] min-w-[200px] pt-5">
          <h3 className="text-lg font-semibold text-white mb-5">Follow Us</h3>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/images/social-facebook.svg"
                alt="Facebook"
                width={45}
                height={0}
                className="hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] transition-all duration-300"
              />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/images/social-twitter.svg"
                alt="Twitter"
                width={45}
                height={0}
                className="hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] transition-all duration-300"
              />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/images/social-instagram.svg"
                alt="Instagram"
                width={45}
                height={0}
                className="hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] transition-all duration-300"
              />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/images/social-youtube.svg"
                alt="Youtube"
                width={45}
                height={0}
                className="hover:brightness-150 hover:drop-shadow-[0_0_6px_#ff00ff] transition-all duration-300"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500 tracking-wide">
        © {new Date().getFullYear()} F&F Event. All rights reserved.
      </div>
    </footer>
  );
}
