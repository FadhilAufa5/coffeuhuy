"use client";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-[#080808] dark:to-[#0b0b0b]"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Gambar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }} // animasi aktif saat discroll
          className="rounded-3xl overflow-hidden shadow-xl"
        >
          <img
            src="/CoffeeUhuyPlace.png"
            alt="Barista making coffee"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Teks */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">Tentang CoffeeUhuy</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed" >
            Coffee Uhuy hadir untuk menemani setiap momen kamu dengan cita rasa kopi yang nikmat tanpa harus merogoh kocek dalam-dalam. Dengan racikan biji kopi pilihan dan harga yang ramah di kantong. <br />
            Di setiap cangkirnya, tersimpan semangat kebersamaan, kehangatan, dan keceriaan—karena bagi kami, kopi bukan hanya minuman, tapi juga cara untuk menyapa dan berbagi cerita.
            <br />
             <b>Coffee Uhuy, kopi murah dengan rasa yang bersahabat.</b>

                      </p>

          {/* Card kelebihan */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white dark:bg-[#0f0f0f] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <h3 className="font-semibold text-lg">Kualitas Premium</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kopi diseleksi dari petani pilihan, disangrai untuk aroma
                optimal.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white dark:bg-[#0f0f0f] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <h3 className="font-semibold text-lg">Suasana Nyaman</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interior hangat & cocok untuk kerja maupun nongkrong.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
