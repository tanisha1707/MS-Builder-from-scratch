import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative h-[450px] lg:h-[600px] w-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/About1.webp"
              alt="MSBUILDER's Office"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-[#FFD700]">
              About MSBUILDER's
            </h2>
            <p className="text-white/80 mb-6">
              MSBUILDER's is a premier real estate company with over 15 years of
              experience. We specialize in helping clients find the perfect
              properties—be it a new home, investment, or commercial space.
            </p>
            <p className="text-white/70 mb-8">
              Our team of experts offers outstanding service and guidance
              throughout every step of your real estate journey.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Expert team with years of industry experience",
                "Personalized service tailored to your needs",
                "Extensive portfolio of premium properties",
                "Transparent and hassle-free process",
              ].map((point, index) => (
                <div className="flex items-start" key={index}>
                  <Check className="h-5 w-5 text-[#FFD700] mr-3 mt-1" />
                  <p className="text-white">{point}</p>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-block bg-[#FFD700] text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
