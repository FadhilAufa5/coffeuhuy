export default function Footer() {
return (
<footer className="border-t border-gray-200 dark:border-gray-800 py-10">
<div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
<div className="space-y-3">
<h3 className="text-lg font-semibold">CoffeeShop</h3>
<p className="text-gray-600 dark:text-gray-400">Kopi enak, harga bersahabat. Nikmati pengalaman ngopi modern dan nyaman.</p>
</div>
<div>
<h4 className="font-semibold mb-3">Store</h4>
<ul className="space-y-2 text-gray-600 dark:text-gray-400">
<li>Jakarta Pusat</li>
<li>Bogor</li>
<li>Bandung</li>
</ul>
</div>
<div>
<h4 className="font-semibold mb-3">Links</h4>
<ul className="space-y-2">
<li><a href="#menu" className="hover:underline">Menu</a></li>
<li><a href="#gallery" className="hover:underline">Gallery</a></li>
<li><a href="#contact" className="hover:underline">Contact</a></li>
</ul>
</div>
<div>
<h4 className="font-semibold mb-3">Contact</h4>
<p className="text-gray-600 dark:text-gray-400">hello@coffeeshop.id<br/>+62 812-0000-0000</p>
</div>
</div>
<div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
<p>© {new Date().getFullYear()} CoffeeShop Uhuy. All rights reserved.</p>
<div className="flex gap-4">
<a href="#" className="hover:underline">Privacy</a>
<a href="#" className="hover:underline">Terms</a>
</div>
</div>
</footer>
);
}