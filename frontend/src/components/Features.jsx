function Features() {
  const features = [
    {
      icon: "🎥",
      title: "HD Video Calls",
      desc: "Crystal clear meetings with high quality video.",
    },
    {
      icon: "💬",
      title: "Real-Time Chat",
      desc: "Collaborate instantly during meetings.",
    },
    {
      icon: "🖥️",
      title: "Screen Sharing",
      desc: "Present ideas and workflows with ease.",
    },
    {
      icon: "🔒",
      title: "Secure Meetings",
      desc: "JWT protected authentication and access.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      {/* Heading */}
      <div className="text-center mb-10">

        <h2 className="text-4xl font-bold text-white">
          Why MeetSphere?
        </h2>

        <p className="text-slate-300 mt-3 text-lg">
          Everything you need for modern collaboration.
        </p>

      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {features.map((feature, index) => (
          <div
            key={index}
            className="
              bg-slate-700
              rounded-2xl
              p-6
              border border-slate-600
              hover:border-purple-500
              hover:-translate-y-1
              transition-all
              duration-300
              text-center
            "
          >
            {/* Icon */}
            <div className="text-4xl mb-4">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-slate-300 mt-3 text-sm leading-6">
              {feature.desc}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Features;