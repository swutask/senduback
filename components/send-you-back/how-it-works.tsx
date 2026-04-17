import { Search, Package, Truck } from "lucide-react";

const steps = [
  {
    step: "Step 01",
    icon: Search,
    title: "Report Your Item",
    description:
      "Visit senduback.com and tell us what you left behind and which hotel you stayed at.",
  },
  {
    step: "Step 02",
    icon: Package,
    title: "We Coordinate",
    description:
      "Send You Back works directly with the hotel to locate, pack, and prepare your item for shipping.",
  },
  {
    step: "Step 03",
    icon: Truck,
    title: "Receive It Back",
    description:
      "Track your shipment in real-time and receive your belongings at your door — hassle-free.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      className="px-6 py-20 md:py-28"
      style={{ backgroundColor: "rgb(248, 250, 252)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "rgb(59, 130, 246)" }}
          >
            Simple Process
          </p>

          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "rgb(15, 23, 42)" }}
          >
            How <span style={{ color: "rgb(59, 130, 246)" }}>Send U Back</span>{" "}
            Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map(({ step, icon: Icon, title, description }) => (
            <div
              key={step}
              className="relative rounded-2xl p-8 lg:p-10 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{
                backgroundColor: "#fff",
                border: "1px solid rgb(226, 232, 240)",
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))",
                  }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "rgb(203, 213, 225)" }}
                >
                  {step}
                </span>
              </div>

              <h3
                className="text-xl font-bold mb-3"
                style={{ color: "rgb(15, 23, 42)" }}
              >
                {title}
              </h3>

              <p
                className="leading-relaxed"
                style={{ color: "rgb(100, 116, 139)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
