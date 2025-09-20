import logo from "../assets/GymLogo.jpg";

export default function HomeFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-0">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Gettz Fitness Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-xl font-bold text-red-600 tracking-tight">Gettz Fitness</span>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm text-gray-600">
          <a href="/" className="hover:text-red-500 transition">Home</a>
          <a href="/about" className="hover:text-red-500 transition">About</a>
          <a href="/membership" className="hover:text-red-500 transition">Membership</a>
          <a href="/trainers" className="hover:text-red-500 transition">Trainers</a>
          <a href="/video-portal" className="hover:text-red-500 transition">Video Portal</a>
          <a href="/contact" className="hover:text-red-500 transition">Contact</a>
        </nav>

        <div className="flex gap-4">
          <a href="#" aria-label="Instagram" className="hover:text-red-500 transition">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect width="18" height="18" x="3" y="3" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.5" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-red-500 transition">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 2.5h-2.5A4.5 4.5 0 0 0 10 7v2H7v3h3v7h3v-7h2.5l.5-3H13V7a1.5 1.5 0 0 1 1.5-1.5H17V2.5z" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-red-500 transition">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M22 5.92a8.38 8.38 0 0 1-2.36.65A4.13 4.13 0 0 0 21.4 4.1a8.19 8.19 0 0 1-2.6.99A4.11 4.11 0 0 0 11.5 9.03c0 .32.04.64.1.94A11.65 11.65 0 0 1 3 4.89a4.11 4.11 0 0 0 1.27 5.48A4.07 4.07 0 0 1 2.8 9.5v.05a4.11 4.11 0 0 0 3.3 4.03c-.3.08-.62.13-.95.13-.23 0-.45-.02-.67-.06a4.13 4.13 0 0 0 3.84 2.85A8.24 8.24 0 0 1 2 19.54a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22 5.92z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        &copy; {new Date().getFullYear()} Gettz Fitness. All rights reserved.
      </div>
    </footer>
  );
}
