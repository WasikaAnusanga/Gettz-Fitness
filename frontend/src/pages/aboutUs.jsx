export default function AboutUs() {
  return (
    <div className="bg-white text-[#111] min-h-screen pb-10">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden mt-[-60px]">
        <div className="max-w-7xl mx-auto px-5 py-20 md:py-28  items-center">
          <center>
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                About Us
              </h1>
              <h1 className="mt-6 text-4xl md:text-3xl font-bold">
                Tailored training & strategies for your{" "}
                <span className="text-[#FF0000]">fitness growth</span>
              </h1>
              <p className="mt-3 text-gray-700 max-w-xl">
                Personalized coaching tailored to your goals, smart nutrition
                aligned with your lifestyle, and data-backed progress plans with
                weekly check-ins and habit tracking—crafted to help you move
                better, build real strength, improve mobility, accelerate fat
                loss, and boost energy so you can train confidently, recover
                faster, and feel amazing every single day.
              </p>
            </div>
          </center>
        </div>
      </section>

      {/* ===== MISSION / VISION (two colored cards) ===== */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-6 mt-[-60px]"
      >
        <div className="rounded-2xl p-6 md:p-8 bg-white border border-red-600/20 shadow-sm">
          <h3 className="text-xl font-bold">Mission</h3>
          <p className="text-gray-700 mt-3">
            Empower people with personalized, science-based training that
            delivers real results and builds lifelong healthy habits by
            combining structured programs, technique-focused coaching, and clear
            progress tracking with practical nutrition guidance, recovery
            protocols, and mindset support.
          </p>
        </div>

        {/* Keep this card RED (#FF0000) */}
        <div className="rounded-2xl p-6 md:p-8 bg-white border border-red-600/20 shadow-sm">
          <h3 className="text-xl font-bold">Vision</h3>
          <p className="text-gray-700 mt-3">
            inclusive community into one seamless experience—delivering
            personalized programs, real-time progress tracking, and supportive
            accountability. Our vision is to empower every member to build
            lasting strength, energy, and confidence, so they thrive in the gym
            and carry that momentum into work, family, and everyday life.
          </p>
        </div>
      </section>

      {/* ===== COACH CARDS ===== */}
      <section id="coaches" className="max-w-7xl mx-auto px-5 mt-12">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Let’s get to know our <span className="text-[#FF0000]">coaches</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            {
              name: "Ava Carter",
              role: "Strength Coach",
              img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Noah Bennett",
              role: "Performance Trainer",
              img: "https://images.unsplash.com/photo-1554298063-9c5d4f09b6a1?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Maya Lopez",
              role: "Mobility & Yoga",
              img: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Liam Chen",
              role: "Nutrition Specialist",
              img: "https://images.unsplash.com/photo-1553531384-411a0c2b3c50?q=80&w=1200&auto=format&fit=crop",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-white border border-red-600/20 shadow-sm hover:border-[#FF0000]/60 transition"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold">{c.name}</h4>
                <p className="text-gray-600 text-sm">{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* secondary row to mirror template */}
        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          {[
            {
              name: "Ethan Park",
              role: "HIIT Coach",
              img: "https://images.unsplash.com/photo-1596357395104-5b5d5d0b8d5f?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Sofia Martins",
              role: "Endurance",
              img: "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Jake Turner",
              role: "Powerlifting",
              img: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1200&auto=format&fit=crop",
            },
          ].map((c, i) => (
            <div
              key={`row2-${i}`}
              className="rounded-2xl overflow-hidden bg-white border border-red-600/20 shadow-sm hover:border-[#FF0000]/60 transition"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold">{c.name}</h4>
                <p className="text-gray-600 text-sm">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SUCCESS STORIES (image + stats) ===== */}
      <section
        id="results"
        className="max-w-7xl mx-auto px-5 mt-16 grid md:grid-cols-2 gap-10 items-center"
      >
        <div className="rounded-2xl overflow-hidden border border-red-600/20 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1552196567-5c01f3f2c2b6?q=80&w=1600&auto=format&fit=crop"
            alt="Happy members celebrating results"
            className="w-full h-[340px] object-cover"
          />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold">
            Turning ambitions into{" "}
            <span className="text-[#FF0000]">success stories</span>
          </h3>
          <p className="text-gray-700 mt-4">
            Real people, real progress. From first pull-ups to marathon PRs, our
            members consistently hit milestones with structured plans and
            consistent coaching.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <Stat value="12+" label="Expert Coaches" />
            <Stat value="18k+" label="Sessions Completed" />
            <Stat value="135+" label="Classes Monthly" />
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="max-w-7xl mx-auto px-5 mt-16">
        <h3 className="text-xl font-bold">
          Why choose <span className="text-[#FF0000]">Getzz Fitness</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Coaching-First",
              desc: "1:1 guidance, form checks, and habit tracking so you stay consistent.",
            },
            {
              title: "Science-Driven",
              desc: "Programs crafted from proven strength & conditioning principles.",
            },
            {
              title: "Community",
              desc: "Train with people who push you and celebrate your wins.",
            },
          ].map((i, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 bg-white border border-red-600/20 shadow-sm"
            >
              <div className="text-[#FF0000] font-extrabold text-2xl">
                0{idx + 1}
              </div>
              <h4 className="mt-2 font-bold">{i.title}</h4>
              <p className="text-gray-600 mt-2 text-sm">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* Small stat component */
function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-[#FF0000]">
        {value}
      </div>
      <div className="text-gray-600 text-sm mt-1">{label}</div>
    </div>
  );
}
