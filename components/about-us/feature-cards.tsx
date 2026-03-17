import Image, { StaticImageData } from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import feature from "@/assets/FeatureCards-1.png";
import feature2 from "@/assets/FeatureCards-2.png";
import feature3 from "@/assets/FeatureCards-3.png";
import { BlueUnderline } from "../shared/blue-underline";

type Feature = {
  title: string;
  description: string;
  image: StaticImageData;
};

const features: Feature[] = [
  {
    title: "Zero liability for hotels",
    description:
      "Once an item is handed over, SendUBack fully manages delivery, insurance, and claims, ensuring hotels have zero risk.",
    image: feature,
  },
  {
    title: "Simple, structured process",
    description:
      "Replaces emails, phone calls, and spreadsheets with a single, clear workflow that saves staff time and reduces errors.",
    image: feature2,
  },
  {
    title: "Secure, insured delivery",
    description:
      "Every shipment is fully insured, tracked end-to-end, and managed professionally to ensure items are returned safely and reliably.",
    image: feature3,
  },
];

export default function FeatureCards() {
  return (
    <section className="bg-secondary py-20 pt-5">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="mb-16 ">
          <h2 className=" text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
            Why it’s works
          </h2>
          <BlueUnderline />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-14">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-none bg-transparent shadow-none p-0"
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={500}
                    height={500}
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Content */}
                <div className="text-center py-6">
                  <h3 className="text-black text-2xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-black text-lg leading-tight">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
