
import React from "react";
import Header from "../components/header";
import HomeFooter from "../components/homeFooter";
import { Link } from "react-router-dom";

const heroImages = [
  "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=600&q=80",
];
const trainers = [
  { name: "Sam Cole", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Michael Harris", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "John Anderson", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/65.jpg" },
  { name: "Tom Blake", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/76.jpg" },
];
const blogPosts = [
  { title: "5 Essential Exercises For Building Muscle", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80", date: "August 14" },
  { title: "The Ultimate Guide to a Balanced Diet", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", date: "August 11" },
  { title: "The Benefits of HIIT Training", img: "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=400&q=80", date: "August 8" },
  { title: "Home Workout For Busy People", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", date: "August 4" },
  { title: "How To Always Stay Motivated", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", date: "August 2" },
];

export default function Homepage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative flex flex-col md:flex-row items-center justify-between px-8 pt-24 pb-10 max-w-7xl mx-auto">
          <div className="flex-1 flex flex-col gap-6 z-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              Achive Your <span className="text-red-500">FITNESS GOALS</span><br />With FitMaker
            </h1>
            <p className="text-lg text-gray-200 max-w-xl backdrop-blur-md bg-white/10 rounded-xl p-4 shadow-lg">
              Join the Premier Community and Transform Your Fitness Journey. Our Expert Coaches and Personalized Programs Are Designed to Help You Achieve Your Goals, Build Confidence, and Exceed Your Expectations. Ready to Make a Change?
            </p>
            <div className="flex gap-4 mt-2">
              <Link to="/register" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition-transform hover:scale-105">Start Your Journey</Link>
              <Link to="/programs" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white border border-gray-600 transition-transform hover:scale-105">Explore Programs</Link>
            </div>
            <div className="flex gap-6 mt-8 text-center">
              <div className="transition-transform hover:scale-110">
                <div className="text-2xl font-bold text-red-400">+80</div>
                <div className="text-xs text-gray-300">Coaches</div>
              </div>
              <div className="transition-transform hover:scale-110">
                <div className="text-2xl font-bold text-red-400">+1300</div>
                <div className="text-xs text-gray-300">Positive Reviews</div>
              </div>
              <div className="transition-transform hover:scale-110">
                <div className="text-2xl font-bold text-red-400">+1000</div>
                <div className="text-xs text-gray-300">Reliable Members</div>
              </div>
              <div className="transition-transform hover:scale-110">
                <div className="text-2xl font-bold text-red-400">+1500</div>
                <div className="text-xs text-gray-300">Total Users</div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center relative mt-10 md:mt-0 animate-fade-in">
            <div className="rounded-full w-80 h-80 bg-gradient-to-br from-red-600/80 to-orange-400/60 shadow-2xl flex items-center justify-center relative">
              <img src={heroImages[0]} alt="Fitness Hero" className="rounded-full w-72 h-72 object-cover border-4 border-white/30 shadow-xl" />
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-6 py-8 px-4">
          <div className="flex-1 min-w-[180px] text-center">
            <div className="text-3xl font-bold text-red-500">96%</div>
            <div className="text-sm text-gray-300">Client Satisfaction</div>
          </div>
          <div className="flex-1 min-w-[180px] text-center">
            <div className="text-3xl font-bold text-red-500">+5</div>
            <div className="text-sm text-gray-300">Years of Experience</div>
          </div>
          <div className="flex-1 min-w-[180px] text-center">
            <div className="text-3xl font-bold text-red-500">+800</div>
            <div className="text-sm text-gray-300">Active Members</div>
          </div>
          <div className="flex-1 min-w-[180px] text-center">
            <div className="text-3xl font-bold text-red-500">24/7</div>
            <div className="text-sm text-gray-300">Support Available</div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Our <span className="text-red-500">Services</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Losing Weight",
                img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
                desc: "Get a custom plan to lose weight safely and effectively with our expert trainers.",
                link: "/services/weight-loss",
                color: "from-red-700/80 to-gray-900"
              },
              {
                title: "Building Muscle",
                img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                desc: "Personalized muscle-building programs and nutrition guidance for all levels.",
                link: "/services/muscle-building",
                color: "from-orange-700/80 to-gray-900"
              },
              {
                title: "Training in Home",
                img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
                desc: "Flexible home workout plans and virtual coaching to fit your busy schedule.",
                link: "/services/home-training",
                color: "from-yellow-700/80 to-gray-900"
              },
              {
                title: "Gym Plan",
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                desc: "Access to all gym facilities, group classes, and expert support for your goals.",
                link: "/services/gym-plan",
                color: "from-blue-700/80 to-gray-900"
              }
            ].map((s, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${s.color} rounded-xl p-6 shadow-lg flex flex-col items-center glass-card transition-transform hover:scale-105 hover:shadow-2xl`}
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,30,40,0.7)' }}
              >
                <img src={s.img} alt={s.title} className="w-32 h-32 object-cover rounded-lg mb-4 shadow-lg" />
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-300 text-sm mb-4 text-center">{s.desc}</p>
                <Link to={s.link} className="text-red-400 hover:underline">Learn More</Link>
              </div>
            ))}
          </div>
        </section>

        {/* PLANS SECTION */}
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Our <span className="text-red-500">Plans</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-900/80 to-gray-900 rounded-xl p-8 shadow-lg flex flex-col items-center border-2 border-yellow-500">
              <h3 className="text-xl font-bold mb-2">PRO PLAN</h3>
              <ul className="text-gray-200 text-sm mb-6 list-disc list-inside">
                <li>All Access to Gym & Virtual</li>
                <li>Personalized Diet & Workout</li>
                <li>Weekly Progress Tracking</li>
                <li>1-on-1 Coaching</li>
                <li>Using Cutting-edge Science</li>
              </ul>
              <div className="text-2xl font-bold mb-2">99$ <span className="text-sm font-normal">/ month</span></div>
              <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition">Choose This Plan</button>
            </div>
            <div className="bg-gradient-to-br from-red-900/80 to-gray-900 rounded-xl p-8 shadow-lg flex flex-col items-center border-2 border-red-500 scale-105">
              <h3 className="text-xl font-bold mb-2">CUSTOM PLAN</h3>
              <ul className="text-gray-200 text-sm mb-6 list-disc list-inside">
                <li>Auto Tailored Fitness Routine</li>
                <li>Exclusive Exercise Videos</li>
                <li>Nutrition & Supplement Guide</li>
                <li>Direct Trainer Access</li>
                <li>Progress Analytics</li>
              </ul>
              <div className="text-2xl font-bold mb-2">149$ <span className="text-sm font-normal">/ month</span></div>
              <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition">Choose This Plan</button>
            </div>
            <div className="bg-gradient-to-br from-orange-900/80 to-gray-900 rounded-xl p-8 shadow-lg flex flex-col items-center border-2 border-orange-500">
              <h3 className="text-xl font-bold mb-2">BEGINNER PLAN</h3>
              <ul className="text-gray-200 text-sm mb-6 list-disc list-inside">
                <li>Personal Plan With Our Beginner Pack</li>
                <li>Group Classes & Community</li>
                <li>Access to All Gym Facilities</li>
                <li>Weekly Check-ins</li>
                <li>Trainer Support</li>
              </ul>
              <div className="text-2xl font-bold mb-2">49$ <span className="text-sm font-normal">/ month</span></div>
              <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition">Choose This Plan</button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="max-w-5xl mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">What Our <span className="text-red-500">Customers Say</span></h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Customer" className="w-32 h-32 rounded-full object-cover border-4 border-red-600 shadow-lg" />
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex-1">
              <div className="text-lg font-semibold text-red-400 mb-2">Steven Howard</div>
              <p className="text-gray-200 text-sm mb-2">"FitMaker has changed my life! The trainers are amazing, and the community is so supportive. I've never felt better or more motivated to reach my goals."</p>
              <div className="text-xs text-gray-400">Pro Athlete</div>
            </div>
          </div>
        </section>

        {/* TRAINERS SECTION */}
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Meet Our <span className="text-red-500">Trainers</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {trainers.map((t, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl glass-card"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,30,40,0.7)' }}
              >
                <img src={t.img} alt={t.name} className="w-32 h-32 object-cover rounded-full border-4 border-red-600 mb-4 shadow-lg" />
                <div className="text-lg font-bold mb-1">{t.name}</div>
                <div className="text-sm text-gray-400 mb-2">{t.role}</div>
                <Link to="/trainers" className="text-red-400 hover:underline">Learn More</Link>
              </div>
            ))}
          </div>
        </section>

        {/* BLOG POSTS SECTION */}
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Fitmaker <span className="text-red-500">Blog Posts</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((b, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl glass-card"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,30,40,0.7)' }}
              >
                <img src={b.img} alt={b.title} className="w-full h-48 object-cover" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="text-sm text-gray-400">{b.date}</div>
                  <div className="text-lg font-bold text-white">{b.title}</div>
                  <Link to="/blog" className="text-red-400 hover:underline">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
