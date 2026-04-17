import {
  Smartphone,
  Laptop,
  Watch,
  Shirt,
  KeyRound,
  BriefcaseBusiness,
  Headphones,
  Package,
} from "lucide-react";

const items = [
  {
    icon: Smartphone,
    title: "Phones & Chargers",
    description:
      "Left your phone charger at a hotel? We return electronics safely and quickly.",
  },
  {
    icon: Laptop,
    title: "Laptops & Tablets",
    description:
      "Forgot your laptop at a hotel? We handle fragile tech with extra care.",
  },
  {
    icon: Watch,
    title: "Watches & Jewelry",
    description:
      "Left jewelry at a hotel? Every shipment is insured for peace of mind.",
  },
  {
    icon: Shirt,
    title: "Clothing & Shoes",
    description:
      "Left clothes at a hotel? From jackets to shoes, we'll send them back.",
  },
  {
    icon: KeyRound,
    title: "Keys & Wallets",
    description:
      "Forgot your keys or wallet at a hotel? We prioritize urgent essentials.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Bags & Documents",
    description:
      "Left your passport or bag at a hotel? We handle documents with care.",
  },
  {
    icon: Headphones,
    title: "Headphones & Accessories",
    description:
      "Left AirPods at a hotel? Small items are just as important to us.",
  },
  {
    icon: Package,
    title: "Toiletries & Misc",
    description:
      "Left toiletries or personal items at a hotel? Nothing is too small to return.",
  },
];

export default function ItemTypesSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "rgb(59, 130, 246)" }}
          >
            What We Return
          </p>

          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "rgb(15, 23, 42)" }}
          >
            Types of Items We{" "}
            <span style={{ color: "rgb(59, 130, 246)" }}>Send Back</span>
          </h2>

          <p
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: "rgb(100, 116, 139)" }}
          >
            From electronics to clothing, SendUBack handles all types of{" "}
            <strong style={{ color: "rgb(71, 85, 105)" }}>
              lost hotel items
            </strong>
            . No item is too big or too small.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              style={{
                backgroundColor: "#fff",
                border: "1px solid rgb(226, 232, 240)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgb(239, 246, 255)" }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: "rgb(59, 130, 246)" }}
                />
              </div>

              <h3
                className="font-bold mb-2 text-sm"
                style={{ color: "rgb(15, 23, 42)" }}
              >
                {title}
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgb(148, 163, 184)" }}
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
