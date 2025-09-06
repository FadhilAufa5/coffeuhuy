import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import React from "react";
import EventModal from "./EventModal";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  isNew?: boolean;
  discount?: string; // properti untuk diskon
}

const events: Event[] = [
  {
    id: 1,
    title: "Grand Opening Promo",
    date: "10 September 2025",
    description: "Nikmati diskon spesial 50% untuk semua menu coffee selama 3 hari pertama pembukaan toko baru kami.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    isNew: true,
    discount: "50%",
  },
  {
    id: 2,
    title: "Live Music Night",
    date: "15 September 2025",
    description: "Acara live music setiap Jumat malam dengan band lokal favorit. Suasana cozy dan hangat untuk menemani ngopi.",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Latte Art Workshop",
    date: "20 September 2025",
    description: "Belajar langsung membuat latte art dari barista profesional kami. Tempat terbatas, segera daftar sekarang!",
    image: "https://images.unsplash.com/photo-1587135394684-d56a2f0b3caa?auto=format&fit=crop&w=800&q=80",
    isNew: true,
  },
];

export default function EventPage() {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  return (
    <section id="events" className="py-16 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Event & Update</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Ikuti acara terbaru, promo spesial, dan update menarik dari CoffeeShop Uhuy.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden flex flex-col relative"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col flex-grow relative">
              {/* Badge New dengan animasi */}
              {event.isNew && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                >
                  New
                </motion.span>
              )}

              
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{event.date}</p>
              <p className="text-gray-700 dark:text-gray-300 flex-grow line-clamp-3">
                {event.description}
              </p>
              <Button
                onClick={() => setSelectedEvent(event)}
                className="mt-6 bg-red-500 hover:bg-red-700 text-white rounded-xl"
              >
                Lihat Detail
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          date={selectedEvent.date}
          description={selectedEvent.description}
          image={selectedEvent.image}
        />
      )}
    </section>
  );
}
