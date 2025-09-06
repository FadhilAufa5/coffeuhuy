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
            src="https://images.unsplash.com/photo-1599898330165-6c3b93296d60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGNvZmZlc2hvcHxlbnwwfHwwfHx8MA%3D%3D"
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
          <h2 className="text-3xl font-bold">Tentang Coffeshop Uhuy</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. At nobis voluptatum ea
            maiores veniam. Blanditiis quis accusantium sit et harum. Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Hic, iusto? Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Ab ad amet illum nulla incidunt error dolor est
            quam deleniti nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Asperiores, dolorem.
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
