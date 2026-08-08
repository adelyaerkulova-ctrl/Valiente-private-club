import React, { useState, useMemo, useRef, useEffect } from "react";

/* ============================================================
   VALIENTE — data layer
   Edit CONTACT and product prices below. price* = null means
   "on request" until you fill in a real number.
   ============================================================ */

const CONTACT = {
  telegram: "https://t.me/YOUR_TELEGRAM",
  whatsapp: "https://wa.me/YOUR_WHATSAPP_NUMBER",
  instagram: "https://instagram.com/YOUR_INSTAGRAM",
  phone: "tel:+7XXXXXXXXXX",
  phoneDisplay: "+7 (XXX) XXX-XX-XX",
};

const SOCIALS = {
  instagram: "https://instagram.com/YOUR_INSTAGRAM",
  tiktok: "https://tiktok.com/@YOUR_TIKTOK",
  telegram: "https://t.me/YOUR_TELEGRAM",
};

// category: "designer" | "niche" | "women"
// family / season / intensity are best-effort classic classifications for
// well known releases; left as "—" where genuinely unclear. Prices are
// intentionally null (on request) — fill in later.
const RAW = [
  ["Hugo Boss","Boss Bottled","designer","Men","Woody","All year","Medium"],
  ["Calvin Klein","Eternity","designer","Men","Fresh","Spring","Soft"],
  ["Paco Rabanne","1 Million","designer","Men","Oriental","Autumn","Strong"],
  ["Versace","Man Eau Fraîche","designer","Men","Citrus","Summer","Soft"],
  ["Dior","Sauvage EDT","designer","Men","Fresh Spicy","All year","Strong"],
  ["Dior","Sauvage Elixir","designer","Men","Spicy","Autumn","Beast"],
  ["Emporio Armani","Stronger With You","designer","Men","Oriental","Autumn","Medium"],
  ["Emporio Armani","Stronger With You Intensely","designer","Men","Oriental","Autumn","Strong"],
  ["Emporio Armani","Stronger With You Absolutely","designer","Men","Amber","Winter","Strong"],
  ["Chanel","Bleu de Chanel","designer","Men","Woody Aromatic","All year","Medium"],
  ["Chanel","Allure Homme Sport","designer","Men","Citrus","Summer","Medium"],
  ["Chanel","Égoïste","designer","Men","Woody","Autumn","Medium"],
  ["Givenchy","Gentleman","designer","Men","Woody","Autumn","Medium"],
  ["Versace","Eros EDT","designer","Men","Fresh","All year","Strong"],
  ["Armani","Code Parfum","designer","Men","Oriental","Autumn","Strong"],
  ["Yves Saint Laurent","Y","designer","Men","Aromatic","Spring","Medium"],
  ["Paco Rabanne","Invictus","designer","Men","Fresh","Summer","Medium"],
  ["Jimmy Choo","Intense Man","designer","Men","Woody","Autumn","Medium"],
  ["Clinique","Happy for Men","designer","Men","Citrus","Spring","Soft"],
  ["Jean Paul Gaultier","Le Beau","designer","Men","Woody","Summer","Medium"],
  ["Jean Paul Gaultier","Le Beau Paradise Garden","designer","Men","Tropical","Summer","Medium"],
  ["Jean Paul Gaultier","Le Male Elixir","designer","Men","Oriental","Winter","Beast"],
  ["Tom Ford","Ombré Leather","niche","Unisex","Leather","Autumn","Strong"],
  ["Tom Ford","Oud Wood","niche","Unisex","Oud","Winter","Strong"],
  ["Tom Ford","Fucking Fabulous","niche","Unisex","Leather","Night","Beast"],
  ["Tom Ford","Bitter Peach","niche","Unisex","Fruity Gourmand","All year","Strong"],
  ["Dolce & Gabbana","Light Blue","designer","Men","Citrus","Summer","Soft"],
  ["Dior","Homme Sport","designer","Men","Fresh","Summer","Medium"],
  ["Armaf","Club de Nuit Intense","designer","Men","Woody Aromatic","All year","Strong"],
  ["Louis Vuitton","L'Immensité","niche","Men","Woody","All year","Medium"],
  ["Louis Vuitton","Imagination","niche","Men","Citrus Woody","All year","Medium"],
  ["Louis Vuitton","Ombré Nomade","niche","Unisex","Oud","Winter","Strong"],
  ["Louis Vuitton","Symphony","niche","Unisex","Floral","All year","Medium"],
  ["Escentric Molecules","Molecule 02","niche","Unisex","Musk","All year","Soft"],
  ["Maison Francis Kurkdjian","Baccarat Rouge 540","niche","Unisex","Amber Floral","All year","Strong"],
  ["Creed","Aventus","niche","Men","Fruity Chypre","All year","Strong"],
  ["Creed","Silver Mountain Water","niche","Men","Fresh","Spring","Soft"],
  ["Orto Parisi","Megamare","niche","Unisex","Aquatic","Summer","Strong"],
  ["Tiziana Terenzi","Kirke","niche","Unisex","Gourmand","Winter","Strong"],
  ["Tiziana Terenzi","Andromeda","niche","Unisex","Oud Floral","Winter","Strong"],
  ["Mancera","Sicily","niche","Unisex","Citrus","Summer","Medium"],
  ["Mancera","Cedrat Boise","niche","Unisex","Woody Citrus","All year","Strong"],
  ["Bvlgari","Tygar","niche","Men","Woody","Autumn","Medium"],
  ["Attar Collection","Musk Kashmir","niche","Unisex","Musk","Winter","Strong"],
  ["Attar Collection","Azora","niche","Unisex","Amber","Winter","Strong"],
  ["Attar Collection","Queen of Sheba","niche","Women","Oriental","Winter","Strong"],
  ["Attar Collection","Hayati","niche","Unisex","Floral Musk","All year","Strong"],
  ["Maison Crivelli","Oud Maracuja","niche","Unisex","Oud Fruity","All year","Strong"],
  ["Nasomatto","Black Afgano","niche","Unisex","Cannabis Oud","Night","Beast"],
  ["Kilian","Angels' Share","niche","Unisex","Gourmand","Autumn","Strong"],
  ["Kilian","Black Phantom","niche","Unisex","Gourmand","Night","Strong"],
  ["Chopard","Vetiver","niche","Men","Woody","All year","Medium"],
  ["Ex Nihilo","Blue Talisman","niche","Unisex","Aromatic","All year","Medium"],
  ["Thomas Kosmala","No. 4","niche","Unisex","—","All year","Medium"],
  ["Roja Parfums","Elysium","niche","Men","Aromatic","All year","Strong"],
  ["Parfums de Marly","Greenley","niche","Men","Green Aromatic","Spring","Medium"],
  ["—","Ganymede","niche","Unisex","—","All year","Medium"],
  ["—","Tillia","niche","Unisex","—","All year","Medium"],
  ["—","Bois Imperial","niche","Unisex","Woody","All year","Medium"],
  ["Jo Malone","Cypress & Grapevine","niche","Unisex","Green","Autumn","Soft"],
  ["HFC","Devil's Intrigue","niche","Unisex","—","Night","Strong"],
  ["Amouage","Guidance","niche","Unisex","Woody","Winter","Strong"],
  ["Byredo","Blanche","niche","Women","Musk Floral","All year","Soft"],
  ["Byredo","Bibliothèque","niche","Unisex","Woody","All year","Medium"],
  ["Initio","Side Effect","niche","Unisex","Gourmand","Night","Strong"],
  ["Initio","Oud for Greatness","niche","Unisex","Oud","Winter","Strong"],
  ["Juliette Has a Gun","Not a Perfume","niche","Women","Musk","All year","Soft"],
  ["Juliette Has a Gun","Vanilla Vibes","niche","Women","Gourmand","Winter","Medium"],
  ["Parfums de Marly","Delina","niche","Women","Floral","Spring","Medium"],
  ["Christian Dior","Miss Dior","women","Women","Floral","Spring","Medium"],
  ["Chanel","Chance","women","Women","Floral","Spring","Medium"],
  ["Chanel","Chance Eau Tendre","women","Women","Floral","Spring","Soft"],
  ["Chanel","Chance Eau Fraîche","women","Women","Citrus Floral","Summer","Soft"],
  ["Versace","Bright Crystal","women","Women","Floral Fruity","Summer","Soft"],
  ["Givenchy","Irresistible","women","Women","Floral","Spring","Medium"],
  ["Louis Vuitton","Pacific Chill","niche","Unisex","Aquatic","Summer","Medium"],
  ["Tom Ford","Vanilla Sex","niche","Women","Gourmand","Winter","Strong"],
  ["Tom Ford","White Suede","niche","Unisex","Suede Musk","All year","Medium"],
].map(([brand, name, category, gender, family, season, intensity], i) => ({
  id: `v-${i + 1}`,
  brand,
  name,
  category,
  gender,
  family,
  season,
  intensity,
  description: "",
  price5: null,
  price10: null,
  price20: null,
  price30: null,
  featured: [4, 9, 33, 34, 66].includes(i),
}));

const FAMILIES = [...new Set(RAW.map((p) => p.family))].filter((f) => f !== "—").sort();
const GENDERS = ["Men", "Women", "Unisex"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "All year", "Night"];
const INTENSITIES = ["Soft", "Medium", "Strong", "Beast"];

const CLUB_TIERS = [
  {
    id: "bronze",
    name: "BRONZE",
    seats: 50,
    grad: "linear-gradient(135deg,#7a4a2c 0%,#c98a55 45%,#7a4a2c 100%)",
    text: "#2a1608",
    perks: ["Early access to new arrivals", "Birthday gift on your anniversary month", "Member-only decant sizes"],
  },
  {
    id: "silver",
    name: "SILVER",
    seats: 30,
    grad: "linear-gradient(135deg,#8b8b8b 0%,#e6e6e6 45%,#8b8b8b 100%)",
    text: "#1a1a1a",
    perks: ["Everything in Bronze", "Priority restock notifications", "Complimentary sample with every order"],
  },
  {
    id: "gold",
    name: "GOLD",
    seats: 20,
    grad: "linear-gradient(135deg,#8a6a2a 0%,#e9c877 45%,#8a6a2a 100%)",
    text: "#231800",
    perks: ["Everything in Silver", "Personal fragrance consultations", "First access to niche & limited drops"],
  },
];

const REVIEWS = [
  "Smells expensive.",
  "Finally found my signature.",
  "Packaging is insane.",
  "Feels like opening a luxury brand.",
  "Ordered twice already — this is the one.",
  "Never going back to full bottles.",
];

const FAQS = [
  ["Что такое распив?", "Распив — это возможность приобрести аромат в меньшем объёме, а не покупать целый флакон. Так вы пробуете больше и выбираете то, что действительно ваше."],
  ["Какие объёмы доступны?", "5 мл, 10 мл, 20 мл и 30 мл — для каждого аромата в каталоге."],
  ["Как заказать?", "Выберите аромат и объём на сайте, нажмите «BUY NOW» и напишите нам в удобном канале связи — мы оформим заказ лично."],
  ["Как происходит оплата?", "Способы оплаты обсуждаются индивидуально при оформлении заказа в переписке."],
  ["Как осуществляется доставка?", "Условия доставки уточняются при заказе — свяжитесь с нами для деталей."],
  ["Как выбрать аромат?", "Используйте DISCOVER — интерактивный подбор по настроению, сезону и интенсивности, либо фильтры в THE COLLECTION."],
  ["Есть ли оригинальные флаконы?", "Да, все ароматы разливаются из оригинальных флаконов."],
  ["Как работает VALIENTE CLUB?", "Три уровня членства — Bronze, Silver и Gold — с ограниченным числом карт и растущими привилегиями."],
  ["Можно ли оформить несколько ароматов?", "Да, просто укажите это при обращении в выбранном канале связи."],
];

const MOODS = ["Clean", "Dark", "Seductive", "Fresh", "Powerful", "Elegant", "Sweet", "Mysterious"];

/* ============================================================
   Small presentational helpers
   ============================================================ */

const Label = ({ children, className = "" }) => (
  <span className={`text-[11px] tracking-[0.28em] uppercase text-[#B4915A] font-medium ${className}`}>
    {children}
  </span>
);

const SectionHeading = ({ eyebrow, title, sub, light }) => (
  <div className="mb-14">
    {eyebrow && <Label>{eyebrow}</Label>}
    <h2
      className={`mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] ${light ? "text-[#F2EEE6]" : "text-[#111]"}`}
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {title}
    </h2>
    {sub && (
      <p className={`mt-4 max-w-xl text-[15px] leading-relaxed ${light ? "text-[#a8a29a]" : "text-[#6b6659]"}`}>
        {sub}
      </p>
    )}
  </div>
);

const VMark = ({ size = 28, color = "#B4915A" }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 40 36" fill="none">
    <path d="M2 2L20 34L38 2" stroke={color} strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

const money = (v) => (v === null || v === undefined ? "On request" : `${v.toLocaleString("ru-RU")} ₸`);

/* ============================================================
   Bottle placeholder visual (no external images — abstract glass)
   ============================================================ */

const BottleArt = ({ variant = 0, className = "" }) => {
  const grads = [
    "radial-gradient(120% 120% at 30% 10%, #3a3630 0%, #14130f 55%, #050504 100%)",
    "radial-gradient(120% 120% at 70% 15%, #262019 0%, #0c0a08 60%, #030302 100%)",
    "radial-gradient(120% 120% at 50% 0%, #332b1c 0%, #100d09 55%, #050403 100%)",
  ];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: grads[variant % grads.length] }}>
      <div className="absolute inset-0 opacity-[0.14]" style={{
        backgroundImage: "repeating-linear-gradient(115deg, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px, transparent 3px 40px)"
      }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[46%] rounded-[2px]"
        style={{
          background: "linear-gradient(180deg, rgba(230,220,200,0.22), rgba(180,145,90,0.10) 40%, rgba(0,0,0,0.35))",
          boxShadow: "0 0 60px 10px rgba(180,145,90,0.08), inset 0 0 20px rgba(255,255,255,0.08)",
          border: "1px solid rgba(212,192,150,0.25)"
        }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-[24%] w-[9%] h-[10%] bg-[#0a0908] border border-[#B4915A]/30" />
    </div>
  );
};

/* ============================================================
   Contact / "Make it Yours" modal
   ============================================================ */

const ContactModal = ({ open, onClose, product, size, price }) => {
  if (!open) return null;
  const msg = product
    ? `Здравствуйте! Хочу заказать ${product.brand} ${product.name}, ${size} мл.`
    : "Здравствуйте! Хочу узнать больше про VALIENTE.";
  const encoded = encodeURIComponent(msg);

  const options = [
    { key: "Telegram", href: `${CONTACT.telegram}?text=${encoded}` },
    { key: "WhatsApp", href: `${CONTACT.whatsapp}?text=${encoded}` },
    { key: "Instagram", href: CONTACT.instagram },
    { key: "Phone", href: CONTACT.phone, sub: CONTACT.phoneDisplay },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_.25s_ease]"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-[440px] sm:mx-4 bg-[#0d0c0a] border border-[#2a2620] sm:rounded-none rounded-t-2xl px-7 pt-7 pb-9 animate-[slideUp_.35s_cubic-bezier(.16,1,.3,1)]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8a8578] hover:text-[#F2EEE6] transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
        <Label>Make It Yours</Label>
        <h3 className="mt-2 text-[28px] text-[#F2EEE6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Choose your preferred way to contact us.
        </h3>
        {product && (
          <div className="mt-5 border border-[#2a2620] px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-[#F2EEE6] text-[15px]">{product.brand} {product.name}</div>
              <div className="text-[#8a8578] text-[12px] tracking-wide mt-0.5">{size} ML · {price === null ? "On request" : money(price)}</div>
            </div>
            <VMark size={20} />
          </div>
        )}
        <div className="mt-7 flex flex-col gap-2.5">
          {options.map((o) => (
            <a
              key={o.key}
              href={o.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border border-[#3a352c] px-5 py-4 hover:border-[#B4915A] hover:bg-[#B4915A]/5 transition-all duration-300"
            >
              <span className="text-[13px] tracking-[0.18em] uppercase text-[#F2EEE6]">{o.key}</span>
              <span className="text-[#B4915A] opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Product card + product detail
   ============================================================ */

const ProductCard = ({ p, onOpen, onBuy }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(p)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0c0a] border border-[#221f1a]">
        <BottleArt
          variant={p.id.length}
          className={`absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${hover ? "scale-[1.06]" : "scale-100"}`}
        />
        {p.featured && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.22em] uppercase text-[#B4915A] border border-[#B4915A]/40 px-2 py-1 bg-black/40 backdrop-blur-sm">
            Featured
          </span>
        )}
        <div className={`absolute inset-x-0 bottom-0 p-3 flex justify-center transition-all duration-300 ${hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(p); }}
            className="text-[11px] tracking-[0.2em] uppercase bg-[#F2EEE6] text-[#0b0b0a] px-4 py-2.5 w-full hover:bg-[#B4915A] hover:text-[#0b0b0a] transition-colors"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a8578]">{p.brand}</div>
        <div className="mt-1 text-[19px] text-[#F2EEE6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</div>
        <div className="mt-1 text-[12px] text-[#656054]">{p.family !== "—" ? p.family : p.gender} · {p.gender}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] text-[#B4915A]">{money(p.price5)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(p, 5); }}
            className="text-[11px] tracking-[0.15em] uppercase text-[#F2EEE6] border-b border-transparent hover:border-[#B4915A] transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const SizePicker = ({ product, size, setSize }) => {
  const sizes = [5, 10, 20, 30];
  const priceOf = (s) => product[`price${s}`];
  return (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => setSize(s)}
          className={`border px-2 py-3 text-center transition-all duration-200 ${
            size === s ? "border-[#B4915A] bg-[#B4915A]/10" : "border-[#2a2620] hover:border-[#4a453a]"
          }`}
        >
          <div className={`text-[13px] ${size === s ? "text-[#B4915A]" : "text-[#F2EEE6]"}`}>{s} ML</div>
          <div className="text-[10px] mt-1 text-[#77725f]">{money(priceOf(s))}</div>
        </button>
      ))}
    </div>
  );
};

const ProductDetail = ({ product, onClose, onBuy }) => {
  const [size, setSize] = useState(5);
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#0b0b0a]">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-10 py-5 bg-[#0b0b0a]/90 backdrop-blur-sm border-b border-[#1c1a15]">
        <button onClick={onClose} className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#a8a29a] hover:text-[#F2EEE6] transition-colors">
          ← Back to collection
        </button>
        <VMark size={18} />
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0 md:gap-16 px-6 sm:px-10 py-10 md:py-16">
        <BottleArt variant={product.id.length} className="aspect-[3/4] w-full border border-[#221f1a]" />
        <div className="mt-10 md:mt-0">
          <div className="text-[12px] tracking-[0.22em] uppercase text-[#8a8578]">{product.brand}</div>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] text-[#F2EEE6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {product.name}
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-[#a8a29a] max-w-md">
            {product.description || "A distinct presence — full olfactive profile to be added."}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 text-[12px]">
            <div>
              <Label>Family</Label>
              <div className="mt-1 text-[#F2EEE6]">{product.family}</div>
            </div>
            <div>
              <Label>Season</Label>
              <div className="mt-1 text-[#F2EEE6]">{product.season}</div>
            </div>
            <div>
              <Label>Intensity</Label>
              <div className="mt-1 text-[#F2EEE6]">{product.intensity}</div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#1c1a15] pt-8">
            <Label>Your Fragrance. Your Size.</Label>
            <p className="mt-2 text-[13px] text-[#77725f] leading-relaxed">
              No need to commit to a full bottle — choose the volume that fits you.
            </p>
            <div className="mt-4">
              <SizePicker product={product} size={size} setSize={setSize} />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <div className="text-[11px] tracking-[0.15em] uppercase text-[#77725f]">Total</div>
              <div className="text-[22px] text-[#B4915A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {money(product[`price${size}`])}
              </div>
            </div>
            <button
              onClick={() => onBuy(product, size)}
              className="px-8 py-4 bg-[#F2EEE6] text-[#0b0b0a] text-[12px] tracking-[0.2em] uppercase hover:bg-[#B4915A] transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Club card with pointer tilt
   ============================================================ */

const ClubCard = ({ tier }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  };

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative aspect-[16/10] w-full transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          background: tier.grad,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
        }}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
          backgroundImage: "repeating-linear-gradient(100deg, transparent 0 6px, rgba(255,255,255,0.5) 6px 7px, transparent 7px 60px)"
        }} />
        <div className="absolute inset-0 p-6 flex flex-col justify-between" style={{ color: tier.text }}>
          <div className="flex items-start justify-between">
            <VMark size={26} color={tier.text} />
            <div className="text-right">
              <div className="text-[16px] tracking-[0.14em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{tier.name}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase opacity-70">Member</div>
            </div>
          </div>
          <div>
            <div className="text-[22px] tracking-[0.06em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>VALIENTE</div>
            <div className="text-[9px] tracking-[0.28em] uppercase opacity-70">Club</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Discover (fragrance finder)
   ============================================================ */

const Discover = ({ products, onOpen }) => {
  const [mood, setMood] = useState(null);
  const [season, setSeason] = useState(null);
  const [intensity, setIntensity] = useState(null);

  const results = useMemo(() => {
    if (!mood && !season && !intensity) return [];
    return products
      .filter((p) => (season ? p.season === season : true))
      .filter((p) => (intensity ? p.intensity === intensity : true))
      .slice(0, 6);
  }, [mood, season, intensity, products]);

  const Pill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[11px] tracking-[0.14em] uppercase border transition-colors ${
        active ? "border-[#B4915A] text-[#B4915A] bg-[#B4915A]/10" : "border-[#2a2620] text-[#a8a29a] hover:border-[#4a453a]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="space-y-6">
        <div>
          <Label>Mood</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <Pill key={m} active={mood === m} onClick={() => setMood(mood === m ? null : m)}>{m}</Pill>
            ))}
          </div>
        </div>
        <div>
          <Label>Season</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEASONS.filter((s) => s !== "Night").map((s) => (
              <Pill key={s} active={season === s} onClick={() => setSeason(season === s ? null : s)}>{s}</Pill>
            ))}
          </div>
        </div>
        <div>
          <Label>Intensity</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTENSITIES.map((i) => (
              <Pill key={i} active={intensity === i} onClick={() => setIntensity(intensity === i ? null : i)}>{i}</Pill>
            ))}
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-14">
          <Label>Suggested for you</Label>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((p) => (
              <div key={p.id} onClick={() => onOpen(p)} className="cursor-pointer group">
                <BottleArt variant={p.id.length} className="aspect-[3/4] border border-[#221f1a] group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="mt-3 text-[10px] tracking-[0.16em] uppercase text-[#8a8578]">{p.brand}</div>
                <div className="text-[15px] text-[#F2EEE6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   Main App
   ============================================================ */

export default function Valiente() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home"); // home | collection | club | about | faq
  const [product, setProduct] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [buy, setBuy] = useState({ open: false, product: null, size: 5 });

  const [search, setSearch] = useState("");
  const [fGender, setFGender] = useState("All");
  const [fFamily, setFFamily] = useState("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    return RAW.filter((p) => {
      if (fGender !== "All" && p.gender !== fGender) return false;
      if (fFamily !== "All" && p.family !== fFamily) return false;
      if (search && !(`${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [fGender, fFamily, search]);

  const goto = (v) => {
    setView(v);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  const openBuy = (p, size) => setBuy({ open: true, product: p, size });

  const NavLink = ({ id, children }) => (
    <button
      onClick={() => goto(id)}
      className={`text-[11px] tracking-[0.18em] uppercase transition-colors ${
        view === id ? "text-[#B4915A]" : "text-[#d8d3c8] hover:text-[#B4915A]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0a] text-[#F2EEE6] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: #B4915A; color: #0b0b0a; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes reveal { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        .reveal { animation: reveal .7s cubic-bezier(.16,1,.3,1) both; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #2a2620; }
        ::-webkit-scrollbar-track { background: #0b0b0a; }
      `}</style>

      {/* ===== Loading screen ===== */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-[#0b0b0a] flex flex-col items-center justify-center">
          <div className="text-[13px] tracking-[0.5em] uppercase text-[#F2EEE6] animate-[fadeIn_1s_ease]">VALIENTE</div>
          <div className="mt-4 text-[10px] tracking-[0.35em] uppercase text-[#B4915A] opacity-0" style={{ animation: "fadeIn 1s ease .9s forwards" }}>
            More than a fragrance.
          </div>
        </div>
      )}

      {/* ===== Nav ===== */}
      <header className={`fixed top-0 inset-x-0 z-[80] transition-all duration-500 ${scrolled ? "bg-[#0b0b0a]/85 backdrop-blur-md border-b border-[#1c1a15]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[76px] flex items-center justify-between">
          <button onClick={() => goto("home")} className="flex items-center gap-2.5">
            <VMark size={18} />
            <span className="text-[16px] tracking-[0.28em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>VALIENTE</span>
          </button>

          <nav className="hidden md:flex items-center gap-10">
            <NavLink id="collection">Collection</NavLink>
            <NavLink id="discover">Discover</NavLink>
            <NavLink id="club">Valiente Club</NavLink>
            <NavLink id="about">About</NavLink>
            <NavLink id="faq">FAQ</NavLink>
          </nav>

          <div className="flex items-center gap-5">
            <button onClick={() => setBuy({ open: true, product: null, size: 5 })} className="hidden sm:block text-[11px] tracking-[0.18em] uppercase text-[#d8d3c8] hover:text-[#B4915A] transition-colors">
              Contact
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5">
              <span className={`h-px bg-[#F2EEE6] transition-transform ${mobileMenu ? "rotate-45 translate-y-[3px]" : ""}`} />
              <span className={`h-px bg-[#F2EEE6] transition-transform ${mobileMenu ? "-rotate-45 -translate-y-[3px]" : ""}`} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-[#0b0b0a] border-t border-[#1c1a15] px-6 py-8 flex flex-col gap-6">
            {["collection", "discover", "club", "about", "faq"].map((id) => (
              <button key={id} onClick={() => goto(id)} className="text-left text-[15px] tracking-[0.1em] uppercase text-[#F2EEE6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {id}
              </button>
            ))}
            <button onClick={() => setBuy({ open: true, product: null, size: 5 })} className="mt-2 text-[12px] tracking-[0.18em] uppercase text-[#B4915A] text-left">
              Contact VALIENTE
            </button>
          </div>
        )}
      </header>

      {/* ===== HOME ===== */}
      {view === "home" && (
        <main>
          <section className="relative h-[100svh] min-h-[640px] flex items-end overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0" style={{
                background: "radial-gradient(120% 90% at 50% 0%, #26221a 0%, #0e0c09 55%, #050403 100%)"
              }} />
              <div className="absolute inset-0 opacity-[0.1]" style={{
                backgroundImage: "repeating-linear-gradient(120deg, transparent 0 3px, rgba(255,255,255,0.5) 3px 4px, transparent 4px 70px)"
              }} />
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[240px] h-[340px] sm:h-[440px] opacity-90" style={{
                background: "linear-gradient(180deg, rgba(230,220,200,0.16), rgba(180,145,90,0.08) 45%, rgba(0,0,0,0.4))",
                boxShadow: "0 0 120px 30px rgba(180,145,90,0.10)",
                border: "1px solid rgba(212,192,150,0.18)",
              }} />
            </div>

            <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 pb-16 sm:pb-24 reveal">
              <Label>Est. Digital Fragrance House</Label>
              <h1 className="mt-4 text-[clamp(3rem,10vw,7.5rem)] leading-[0.95] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                VALIENTE
              </h1>
              <p className="mt-3 text-[clamp(1rem,2vw,1.35rem)] text-[#d8d3c8]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                More than a fragrance. A statement.
              </p>
              <p className="mt-5 max-w-md text-[14px] text-[#a8a29a] leading-relaxed">
                Discover iconic fragrances in a format made for you.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button onClick={() => goto("collection")} className="px-7 py-4 bg-[#F2EEE6] text-[#0b0b0a] text-[11px] tracking-[0.2em] uppercase hover:bg-[#B4915A] transition-colors">
                  Explore Collection
                </button>
                <button onClick={() => goto("club")} className="px-7 py-4 border border-[#4a453a] text-[#F2EEE6] text-[11px] tracking-[0.2em] uppercase hover:border-[#B4915A] hover:text-[#B4915A] transition-colors">
                  Join Valiente Club
                </button>
              </div>
            </div>
          </section>

          {/* Featured collections */}
          <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
            <SectionHeading eyebrow="Editorial" title="Featured Collections" light
              sub="Curated edits from the VALIENTE catalog — start where your instinct leads." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ["Iconic", "designer"], ["Niche", "niche"], ["Dark", "niche"], ["Fresh", "designer"],
              ].map(([label, cat]) => (
                <button
                  key={label}
                  onClick={() => { setFGender("All"); setFFamily("All"); goto("collection"); }}
                  className="group relative aspect-[3/4] overflow-hidden border border-[#221f1a]"
                >
                  <BottleArt variant={label.length} className="absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[13px] tracking-[0.18em] uppercase">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Decant explainer */}
          <section className="border-y border-[#1c1a15] bg-[#0e0d0a]">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32 grid md:grid-cols-2 gap-14 items-center">
              <div>
                <Label>The Format</Label>
                <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Your fragrance. Your size.
                </h2>
                <p className="mt-6 text-[14px] leading-relaxed text-[#a8a29a] max-w-md">
                  You don't need to commit to a full bottle. At VALIENTE, you choose the volume
                  that fits you — 5, 10, 20 or 30 ml — decanted from original bottles, so you can
                  explore more and commit to what's truly yours.
                </p>
                <button onClick={() => goto("collection")} className="mt-8 text-[11px] tracking-[0.2em] uppercase text-[#B4915A] border-b border-[#B4915A]/40 hover:border-[#B4915A] transition-colors pb-1">
                  Browse the collection →
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 20, 30].map((s, i) => (
                  <div key={s} className="border border-[#2a2620] aspect-[3/5] flex items-end justify-center pb-4" style={{ opacity: 0.5 + i * 0.15 }}>
                    <span className="text-[13px] tracking-[0.1em]">{s}ML</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Club teaser */}
          <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
            <SectionHeading eyebrow="Membership" title="Valiente Club" light sub="Not everyone gets access." />
            <div className="grid md:grid-cols-3 gap-6">
              {CLUB_TIERS.map((t) => <ClubCard key={t.id} tier={t} />)}
            </div>
            <button onClick={() => goto("club")} className="mt-10 text-[11px] tracking-[0.2em] uppercase text-[#B4915A] border-b border-[#B4915A]/40 hover:border-[#B4915A] transition-colors pb-1">
              Discover the Club →
            </button>
          </section>

          {/* Reviews */}
          <section className="border-t border-[#1c1a15] bg-[#0e0d0a] py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
              <Label>Voices</Label>
              <div className="mt-8 grid md:grid-cols-3 gap-x-10 gap-y-10">
                {REVIEWS.map((r, i) => (
                  <p key={i} className="text-[22px] leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                    "{r}"
                  </p>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ===== COLLECTION ===== */}
      {view === "collection" && (
        <main className="pt-[76px]">
          <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-10">
            <SectionHeading eyebrow="The Collection" title="Iconic fragrances. Decanted for your journey." light />

            <div className="flex flex-col gap-5">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fragrance or brand…"
                className="w-full bg-transparent border-b border-[#2a2620] focus:border-[#B4915A] outline-none py-3 text-[14px] placeholder:text-[#5c584c] transition-colors"
              />
              <div className="flex flex-wrap gap-2">
                {["All", ...GENDERS].map((g) => (
                  <button key={g} onClick={() => setFGender(g)} className={`px-3.5 py-1.5 text-[10px] tracking-[0.14em] uppercase border transition-colors ${fGender === g ? "border-[#B4915A] text-[#B4915A]" : "border-[#2a2620] text-[#a8a29a] hover:border-[#4a453a]"}`}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["All", ...FAMILIES].map((f) => (
                  <button key={f} onClick={() => setFFamily(f)} className={`px-3.5 py-1.5 text-[10px] tracking-[0.14em] uppercase border transition-colors ${fFamily === f ? "border-[#B4915A] text-[#B4915A]" : "border-[#2a2620] text-[#a8a29a] hover:border-[#4a453a]"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-28">
            <div className="mb-6 text-[12px] text-[#656054]">{filtered.length} fragrances</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} onOpen={setProduct} onBuy={openBuy} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-24 text-center text-[#656054] text-[14px]">No fragrances match these filters.</div>
            )}
          </section>
        </main>
      )}

      {/* ===== DISCOVER ===== */}
      {view === "discover" && (
        <main className="pt-[76px]">
          <section className="max-w-4xl mx-auto px-6 sm:px-10 pt-16 pb-28">
            <SectionHeading eyebrow="Discover" title="What are you looking for?" light
              sub="Answer a few questions and we'll point you toward your next signature scent." />
            <Discover products={RAW} onOpen={setProduct} />
          </section>
        </main>
      )}

      {/* ===== CLUB ===== */}
      {view === "club" && (
        <main className="pt-[76px]">
          <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-16">
            <SectionHeading eyebrow="Valiente Club" title="Not everyone gets access." light
              sub="VALIENTE CLUB isn't a discount. It's access to the brand — an editorial idea of membership, built for those who already know what they want." />

            <div className="grid md:grid-cols-3 gap-8">
              {CLUB_TIERS.map((t) => (
                <div key={t.id}>
                  <ClubCard tier={t} />
                  <div className="mt-6">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[20px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h3>
                      <span className="text-[11px] tracking-[0.1em] text-[#77725f]">{t.seats} cards</span>
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {t.perks.map((p, i) => (
                        <li key={i} className="text-[13px] text-[#a8a29a] flex gap-2">
                          <span className="text-[#B4915A]">—</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 flex flex-col items-center text-center border-t border-[#1c1a15] pt-16">
              <div className="text-[13px] tracking-[0.16em] uppercase text-[#77725f]">100 Total Memberships</div>
              <div className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                50 · 30 · 20
              </div>
              <p className="mt-2 text-[12px] tracking-[0.1em] uppercase text-[#656054]">Bronze · Silver · Gold</p>
              <button onClick={() => setBuy({ open: true, product: null, size: 5 })} className="mt-8 px-8 py-4 bg-[#F2EEE6] text-[#0b0b0a] text-[11px] tracking-[0.2em] uppercase hover:bg-[#B4915A] transition-colors">
                Request Your Card
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ===== ABOUT ===== */}
      {view === "about" && (
        <main className="pt-[76px]">
          <section className="max-w-3xl mx-auto px-6 sm:px-10 pt-24 pb-32">
            <Label>About Valiente</Label>
            <h1 className="mt-4 text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              A fragrance is never just a scent.
            </h1>
            <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-[#c9c4b8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <p>It is part of the image you carry into a room before you've said a word.</p>
              <p>It doesn't just smell — it leaves an impression. It stays in memory long after you've left.</p>
              <p>VALIENTE exists to help you choose a fragrance the way you choose everything that matters — as a part of who you are, not what you own.</p>
              <p className="text-[#B4915A]">More than a fragrance. A statement.</p>
            </div>
          </section>
        </main>
      )}

      {/* ===== FAQ ===== */}
      {view === "faq" && (
        <main className="pt-[76px]">
          <section className="max-w-3xl mx-auto px-6 sm:px-10 pt-24 pb-32">
            <SectionHeading eyebrow="Support" title="Frequently Asked" light />
            <div className="divide-y divide-[#1c1a15]">
              {FAQS.map(([q, a], i) => <FaqItem key={i} q={q} a={a} />)}
            </div>
          </section>
        </main>
      )}

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#1c1a15] bg-[#0b0b0a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <VMark size={16} />
              <span className="text-[14px] tracking-[0.24em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>VALIENTE</span>
            </div>
            <p className="mt-3 text-[12px] text-[#656054] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              More than a fragrance. A statement.
            </p>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#656054] mb-4">Explore</div>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#c9c4b8]">
              <button className="text-left hover:text-[#B4915A] transition-colors" onClick={() => goto("collection")}>Collection</button>
              <button className="text-left hover:text-[#B4915A] transition-colors" onClick={() => goto("club")}>Valiente Club</button>
              <button className="text-left hover:text-[#B4915A] transition-colors" onClick={() => goto("about")}>About</button>
              <button className="text-left hover:text-[#B4915A] transition-colors" onClick={() => goto("faq")}>FAQ</button>
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#656054] mb-4">Follow</div>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#c9c4b8]">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-[#B4915A] transition-colors">Instagram</a>
              <a href={SOCIALS.tiktok} target="_blank" rel="noreferrer" className="hover:text-[#B4915A] transition-colors">TikTok</a>
              <a href={SOCIALS.telegram} target="_blank" rel="noreferrer" className="hover:text-[#B4915A] transition-colors">Telegram</a>
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#656054] mb-4">Contact</div>
            <button onClick={() => setBuy({ open: true, product: null, size: 5 })} className="text-[13px] text-[#c9c4b8] hover:text-[#B4915A] transition-colors text-left">
              Get in touch →
            </button>
          </div>
        </div>
        <div className="border-t border-[#1c1a15] px-6 sm:px-10 py-6 text-[11px] text-[#4a463c]">
          © {new Date().getFullYear()} VALIENTE. All rights reserved.
        </div>
      </footer>

      {/* ===== Overlays ===== */}
      {product && (
        <ProductDetail product={product} onClose={() => setProduct(null)} onBuy={(p, s) => { setProduct(null); openBuy(p, s); }} />
      )}
      <ContactModal
        open={buy.open}
        onClose={() => setBuy({ ...buy, open: false })}
        product={buy.product}
        size={buy.size}
        price={buy.product ? buy.product[`price${buy.size}`] : null}
      />
    </div>
  );
}

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-6">
        <span className="text-[17px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{q}</span>
        <span className={`text-[#B4915A] text-lg transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="mt-4 text-[13px] leading-relaxed text-[#a8a29a] max-w-xl">{a}</p>}
    </div>
  );
};
