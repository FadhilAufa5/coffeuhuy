import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import React from "react";
import EventModal from "./EventModal"; // Pastikan path EventModal benar

interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  image: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Cek apakah event baru (misalnya <= 7 hari dari sekarang)
function isNewEvent(dateString: string) {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diffInDays =
    (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
}

export default function EventPage({ events }: { events: Event[] }) {
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
          Ikuti acara terbaru, promo spesial, dan update menarik dari CoffeeShop
          Uhuy.
        </p>
      </motion.div>

      {events && events.length > 0 ? (
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
              {/* Label NEW dengan animasi pulse */}
              {isNewEvent(event.date) && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.9, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow"
                >
                  NEW
                </motion.span>
              )}

              <img
                src={`/storage/${event.image}`}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {formatDate(event.date)}
                </p>
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
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 italic">
            Saat ini belum ada event yang akan datang.
          </p>
        </div>
      )}

      {selectedEvent && (
        <EventModal
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.name}
          date={formatDate(selectedEvent.date)}
          description={selectedEvent.description}
          image={`/storage/${selectedEvent.image}`}
        />
      )}
    </section>
  );
}
