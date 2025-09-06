import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Detoseto.",
    rating: 5,
    text: "Kopi enak, suasana nyaman. Baristanya ramah, recommended!",
  },
  {
    id: 2,
    name: "Irdan Alfaridz.",
    rating: 4,
    text: "Harga terjangkau, porsi pas. Suka banget sama cappuccinonya.",
  },
  {
    id: 3,
    name: "Dini Aprilia.",
    rating: 5,
    text: "Tempat cozy buat kerja — wifi kencang dan colokan banyak.",
  },
];

export default function Reviews() {
  const avgRating =
    Math.round(
      (reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)) * 10
    ) / 10;

  return (
    <section id="reviews" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold">What Our Visitors Say</h3>
          <div className="flex justify-center items-center mt-3 gap-2">
            <span className="text-2xl font-bold">{avgRating}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < Math.round(avgRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: r.id * 0.05 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white dark:bg-[#0b0b0b] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
