import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Bolt, HeartPulse, Flame, Trophy, Play, ChevronRight, ArrowRight, Clock, ShieldCheck, Star, Facebook, Instagram, Twitter, Youtube, Check } from "lucide-react";
import { Link } from "react-router-dom";


export default function GymLandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Hero email={email} setEmail={setEmail} />
      <TrustBar />
      <FeatureGrid />
      <VideoTeaser />
      <Classes />
      <Stats />
      <Trainers />
      <Pricing />
      <Testimonials />
      <Cta />
    </div>
  );
}

function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</div>
  );
}

function Hero({ email, setEmail }) {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 blur-3xl opacity-40" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-300 to-cyan-200 blur-3xl opacity-40" />

      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16 md:py-24">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl/tight md:text-6xl/tight font-extrabold"
          >
            Train harder. <span className="bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent">Recover faster.</span> Live stronger.
          </motion.h1>
          <p className="mt-4 max-w-xl text-neutral-600 md:text-lg">
            Premium equipment, elite coaching, and data-driven programs. Everything you need to hit your next PR.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-white font-semibold hover:bg-black"
            >
              Start free week <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 font-semibold hover:shadow"
            >
              Explore features
            </a>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex w-full max-w-md items-center gap-2 rounded-2xl border border-black/10 bg-white p-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-11 flex-1 rounded-xl px-3 outline-none"
            />
            <button className="h-11 shrink-0 rounded-xl bg-neutral-900 px-4 text-white font-semibold hover:bg-black">
              Get updates
            </button>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-6 max-w-lg text-sm">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> No contracts</div>
            <div className="flex items-center gap-2"><Clock className="h-5 w-5" /> 24/7 access</div>
            <div className="flex items-center gap-2"><Star className="h-5 w-5" /> 1k+ 5-star reviews</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop"
            alt="Athlete lifting barbell"
            className="w-full rounded-3xl shadow-2xl border border-black/10"
          />
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-black/5 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white grid place-items-center"><Bolt className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold">Power Program</p>
              <p className="text-xs text-neutral-500">12-week strength phase</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="py-6 border-y border-black/5 bg-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70 text-sm">
        <span>AS FEATURED IN</span>
        <div className="flex items-center gap-6">
          <span className="font-semibold">Men's Health</span>
          <span className="font-semibold">Runner's World</span>
          <span className="font-semibold">FitLife</span>
          <span className="font-semibold">Well+Good</span>
        </div>
      </Container>
    </section>
  );
}

function FeatureGrid() {
  const items = [
    { icon: <HeartPulse className="h-6 w-6" />, title: "Smart Coaching", desc: "Personalized plans adapted to your data and progress." },
    { icon: <Flame className="h-6 w-6" />, title: "Metabolic Tracking", desc: "Monitor calories, HR zones, and recovery in real time." },
    { icon: <Dumbbell className="h-6 w-6" />, title: "Elite Equipment", desc: "Platform racks, calibrated plates, assault runners & more." },
    { icon: <Trophy className="h-6 w-6" />, title: "Community & Events", desc: "Weekly comps, workshops, and member challenges." },
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Everything you need to win</h2>
          <p className="mt-3 text-neutral-600">We blend science, software, and sweat to deliver results that stick.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm hover:shadow"
            >
              <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white grid place-items-center">{f.icon}</div>
              <h3 className="mt-4 font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{f.desc}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Learn more <ArrowRight className="h-4 w-4"/></a>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function VideoTeaser() {
  return (
    <section id="video" className="py-12">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-neutral-900 text-white">
          <img
            src="https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1920&auto=format&fit=crop"
            alt="Gym ambience"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative p-8 md:p-14">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-extrabold">Tour the club in 60 seconds</h3>
              <p className="mt-2 text-neutral-200">Go behind the scenes and see why athletes switch to PulseFit.</p>
              <Link to ="/videos" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-neutral-900">
                <Play className="h-4 w-4" /> Watch video
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Classes() {
  const items = [
    {
      title: "Strength & Conditioning",
      img: "https://cdn4.sportngin.com/attachments/photo/9705/7262/MVA_7-24-15-1044_large.jpg",
      desc: "Compound lifts + accessory work for raw power.",
    },
    {
      title: "HIIT & MetCon",
      img: "https://www.pmotionhealth.com/wp-content/uploads/2024/02/Benefits-and-Risks-of-Metcon-Workouts-1024x585.jpg",
      desc: "Intervals that torch fat and build capacity.",
    },
    {
      title: "Mobility & Recovery",
      img: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1920&auto=format&fit=crop",
      desc: "Move better, reduce pain, and bulletproof joints.",
    },
  ];

  return (
    <section id="classes" className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Coached classes, real results</h2>
          <p className="mt-3 text-neutral-600">Pick your path or mix and match. New blocks start monthly.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((c, i) => (
            <motion.article key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={c.img} alt={c.title} className="h-56 w-full object-cover transition group-hover:scale-105" />
              <div className="p-5">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{c.desc}</p>
                <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">View schedule <ArrowRight className="h-4 w-4"/></a>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: "Sq / DL / BP PRs", value: "420 / 520 / 315" },
    { label: "Avg. time to goal", value: "8.5 weeks" },
    { label: "Member community", value: "12,000+" },
    { label: "Locations", value: "6 worldwide" },
  ];
  return (
    <section className="py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl border border-black/10 bg-white p-6 md:p-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold">{s.value}</div>
              <div className="mt-1 text-xs md:text-sm text-neutral-600">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Trainers() {
  const people = [
    {
      name: "Ava Morgan",
      role: "Strength Coach",
      img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Leo Carter",
      role: "Performance Specialist",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Maya Khan",
      role: "Mobility Expert",
      img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <section id="trainers" className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Meet the coaches</h2>
          <p className="mt-3 text-neutral-600">Certified pros who program with purpose and coach with care.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {people.map((p, i) => (
            <motion.figure key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={p.img} alt={p.name} className="h-72 w-full object-cover" />
              <figcaption className="p-5">
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-neutral-600">{p.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: 29,
      desc: "Gym access + open floor",
      perks: ["24/7 key access", "Locker + showers", "App tracking"],
    },
    {
      name: "Performance",
      price: 59,
      desc: "Everything in Starter + classes",
      perks: ["Unlimited classes", "Coached sessions", "Monthly check-ins"],
      featured: true,
    },
    {
      name: "Elite",
      price: 99,
      desc: "1:1 coaching + programming",
      perks: ["Weekly 1:1", "Custom program", "Priority booking"],
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Memberships for every goal</h2>
          <p className="mt-3 text-neutral-600">Start with a free week. Cancel anytime.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className={`rounded-3xl border bg-white p-6 md:p-8 ${t.featured ? "border-neutral-900 shadow-xl" : "border-black/10 shadow-sm"}`}>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-extrabold">{t.name}</h3>
                {t.featured && (<span className="rounded-full border border-neutral-900 px-2 py-0.5 text-xs">Most popular</span>)}
              </div>
              <div className="mt-3 text-4xl font-extrabold">
                ${t.price}<span className="text-sm font-semibold text-neutral-500">/mo</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{t.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2"><Check className="h-4 w-4" /> {p}</li>
                ))}
              </ul>
              <a href="#" className={`mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold ${t.featured ? "bg-neutral-900 text-white hover:bg-black" : "border border-black/10 hover:shadow"}`}>
                Choose {t.name}
              </a>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      body: "I added 60lbs to my deadlift in 10 weeks. The programming is gold.",
      name: "Sam R.",
    },
    {
      body: "Coaches actually care. I feel stronger and pain-free for the first time.",
      name: "Priya D.",
    },
    {
      body: "The vibe is immaculate. Community keeps me consistent.",
      name: "Luca M.",
    },
  ];
  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Members love us</h2>
          <p className="mt-3 text-neutral-600">Real stories from our community.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.blockquote key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="rounded-3xl border border-black/10 bg-white p-6">
              <p className="text-neutral-700">“{q.body}”</p>
              <footer className="mt-4 text-sm font-semibold">{q.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Cta() {
  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-neutral-900 text-white p-8 md:p-14">
          <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1920&auto=format&fit=crop" alt="Weights rack" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="relative max-w-xl">
            <h3 className="text-2xl md:text-3xl font-extrabold">Ready to transform?</h3>
            <p className="mt-2 text-neutral-200">Book a free consult and get a personalized plan.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#pricing" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-neutral-900">Start free week</a>
              <a href="#" className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-5 py-3 font-semibold">Talk to a coach</a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

