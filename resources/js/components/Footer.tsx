
import { Mail, Phone, MapPin } from "lucide-react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-10 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
        {/* Brand */}
        <div>
          <img
            src="/logouhuy3.png"
            alt="CoffeeShop Uhuy"
            className="h-12 w-auto mb-3"
          />
          <h3 className="text-lg font-semibold">CoffeeShop Uhuy</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Pelopor kopi modern & bersahabat
          </p>
        </div>

        {/* Follow Us */}
        <div className="text-center">
          <h4 className="font-semibold mb-3">Follow us</h4>
          <div className="flex justify-center gap-5">
            <a href="#" className="text-blue-600 hover:opacity-75">
              <Facebook size={22} />
            </a>
            <a href="#" className="text-pink-600 hover:opacity-75">
              <Instagram size={22} />
            </a>
            <a href="#" className="text-sky-500 hover:opacity-75">
              <Twitter size={22} />
            </a>
            <a href="#" className="text-black hover:opacity-75">
              <SiTiktok size={22} />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="md:text-right">
          <h4 className="font-semibold mb-3">Kontak & Lokasi</h4>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-center md:justify-end gap-2">
              <MapPin size={16} className="text-red-500" />
              Jl. Sudirman No. 45, Jakarta
            </li>
            <li className="flex items-center md:justify-end gap-2">
              <Mail size={16} className="text-red-500" />
              coffeuhuyidn@example.com
            </li>
            <li className="flex items-center md:justify-end gap-2">
              <Phone size={16} className="text-red-500" />
              +62 812-2344-792
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center">
        © {new Date().getFullYear()} CoffeeShop Uhuy. Semua Hak Dilindungi.
      </div>
    </footer>
  );
}

