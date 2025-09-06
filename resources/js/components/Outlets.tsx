import { motion } from "framer-motion";

const outlets = [
  {
    id: 1,
    city: "Bogor",
    addr: "Jl. Kumbang No.12, Bogor",
    img: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29mZmVlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
    hours: "08:00 - 22:00",
  },
  {
    id: 2,
    city: "Jakarta",
    addr: "Jl. Sudirman No.10, Jakarta",
    img: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29mZmVlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
    hours: "07:00 - 23:00",
  },
  {
    id: 3,
    city: "Bandung",
    addr: "Jl. Riau No.21, Bandung",
    img: "https://images.unsplash.com/photo-1541475074124-af32f4cb0dbb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNvZmZlZSUyMHNob3B8ZW58MHx8MHx8fDA%3D",
    hours: "09:00 - 21:00",
  },
];

export default function Outlets() {
  return (
    <section id="locations" className="py-16 px-6 bg-gray-50 dark:bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Outlets</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {outlets.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: o.id * 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-[#0b0b0b] border border-gray-100 dark:border-gray-800"
            >
              <img src={o.img} alt={o.city} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{o.city}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {o.addr}
                </p>
                <p className="text-sm text-gray-500 mt-2">{o.hours}</p>
                <div className="mt-4 flex gap-2">
                  <a href="#" className="px-3 py-1.5 rounded-md border text-sm">
                    Directions
                  </a>
                  <a
                    href="#"
                    className="px-3 py-1.5 rounded-md bg-[#1b1b18] text-white text-sm"
                  >
                    Order
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
