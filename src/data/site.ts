export const company = {
  name: 'JOHNKEANS UK LTD',
  brand: 'JOHNKEANS',
  domain: 'www.johnkeans.co.uk',
  email: 'support@johnkeans.co.uk',
  privacyEmail: 'privacy@johnkeans.co.uk',
  phone: '+44 7444 906 225',
  phoneHref: '+44744906225',
  whatsapp: 'https://wa.me/44744906225',
  registeredIn: 'Registered in England and Wales',
  companyNo: 'Company Registration No: 14820963',
  registeredOffice: 'Registered Office: 27–31 Barkers Lane, Kidderminster, Worcestershire, DY9 7SW',
  currency: 'USD',
  copyright: '© 2026 JOHNKEANS UK LTD. All rights reserved.',
  shortDescription:
    'JOHNKEANS is a British professional tools brand delivering dependable equipment for construction, automotive, industrial, workshop and maintenance applications.',
  footerDescription:
    'Professional tools and equipment engineered for demanding applications. JOHNKEANS serves trade professionals, businesses and serious DIY users.',
};

export const nav = [
  { label: 'Power Tools', slug: 'power-tools', icon: 'bolt' },
  { label: 'Hand Tools', slug: 'hand-tools', icon: 'wrenchTool' },
  { label: 'Workshop & Automotive', slug: 'workshop-automotive', icon: 'wrench' },
  { label: 'Industrial Equipment', slug: 'industrial-equipment', icon: 'factory' },
  { label: 'Maintenance & Testing', slug: 'maintenance-testing', icon: 'gauge' },
  { label: 'Outdoor Equipment', slug: 'outdoor-equipment', icon: 'leaf' },
];

export const mainNav = [
  { label: 'Power Tools', slug: 'power-tools' },
  { label: 'Hand Tools', slug: 'hand-tools' },
  { label: 'Workshop & Automotive', slug: 'workshop-automotive' },
  { label: 'Industrial Equipment', slug: 'industrial-equipment' },
  { label: 'Outdoor Equipment', slug: 'outdoor-equipment' },
  { label: 'Best Sellers', slug: 'best-sellers' },
  { label: 'New Arrivals', slug: 'new-arrivals' },
  { label: 'About JOHNKEANS', slug: 'about' },
  { label: 'Contact Us', slug: 'contact' },
];

/** Kept deliberately short so the desktop bar never overflows; all six
 *  categories live in the Shop mega menu and the mobile drawer. */
export const topNav = [
  { label: 'Best Sellers', slug: 'best-sellers' },
  { label: 'New Arrivals', slug: 'new-arrivals' },
  { label: 'About JOHNKEANS', slug: 'about' },
  { label: 'Contact Us', slug: 'contact' },
];

export type Benefit = { icon: string; title: string; text: string };

/** Five benefits with the wording approved in the brief. */
export const benefits: Benefit[] = [
  { icon: 'ruler', title: 'British Design & Engineering', text: 'Developed for professional performance' },
  { icon: 'shield', title: 'Quality-Controlled Products', text: 'Inspected to JOHNKEANS standards' },
  { icon: 'card', title: 'Secure Checkout', text: 'Safe and encrypted payments' },
  { icon: 'globe', title: 'International Delivery', text: 'Shipping to selected global markets' },
  { icon: 'headset', title: 'Dedicated Support', text: 'Assistance before and after purchase' },
];

export type Category = {
  name: string;
  slug: string;
  art: string;
  count: number;
  blurb: string;
};

export const categories: Category[] = [
  { name: 'Power Tools', slug: 'power-tools', art: 'drill', count: 148, blurb: 'Cordless, corded and heavy-duty' },
  { name: 'Hand Tools', slug: 'hand-tools', art: 'wrench', count: 212, blurb: 'Spanners, hammers, pliers & more' },
  { name: 'Workshop & Automotive', slug: 'workshop-automotive', art: 'impact', count: 96, blurb: 'Sockets, ratchets & torque tools' },
  { name: 'Industrial Equipment', slug: 'industrial-equipment', art: 'compressor', count: 74, blurb: 'Power units for site and plant' },
  { name: 'Maintenance & Testing', slug: 'maintenance-testing', art: 'multimeter', count: 63, blurb: 'Meters, lighting & measurement' },
  { name: 'Outdoor Equipment', slug: 'outdoor-equipment', art: 'mower', count: 81, blurb: 'Grounds, garden and landscaping' },
];

export type Product = {
  name: string;
  model: string;
  sku: string;
  price: number;
  was?: number;
  art: string;
  blurb: string;
  badge?: string;
  stock?: 'In stock' | 'Low stock' | 'Pre-order';
};

/**
 * Brief: order must be HEADING → MODEL (blue) → SKU → REVIEWS.
 * Reviews render as "0" with an unselected star row, never a pre-selected rating.
 */
export const bestSellers: Product[] = [
  {
    name: '18V Brushless Combi Drill',
    model: 'JKD-18BL',
    sku: 'JK-100418',
    price: 89.0,
    was: 109.0,
    art: 'drill',
    badge: 'Best Seller',
    stock: 'In stock',
    blurb: 'Two-speed brushless combi drill with 13 mm keyless chuck, LED work light and side handle for masonry and timber.',
  },
  {
    name: '115 mm Angle Grinder',
    model: 'JKA-115',
    sku: 'JK-100225',
    price: 64.5,
    art: 'grinder',
    badge: 'Best Seller',
    stock: 'In stock',
    blurb: '900 W professional grinder with paddle switch, safety guard and auxiliary handle for cutting, grinding and finishing.',
  },
  {
    name: '3/8" Ratchet & Socket Set',
    model: 'JKR-38S',
    sku: 'JK-100733',
    price: 119.0,
    art: 'ratchet',
    stock: 'In stock',
    blurb: '72-piece metric and imperial set in a latching steel case, with 3/8" swivel ratchet, extenders and deep sockets.',
  },
  {
    name: '16 oz Claw Hammer',
    model: 'JKH-16C',
    sku: 'JK-100110',
    price: 21.9,
    art: 'hammer',
    stock: 'In stock',
    blurb: 'Forged drop-forged head with anti-slip hickory handle and polished striking face for site and workshop use.',
  },
  {
    name: '5 m Auto-Lock Tape Measure',
    model: 'JKT-5A',
    sku: 'JK-100902',
    price: 14.75,
    art: 'tape',
    stock: 'In stock',
    blurb: 'Class II blade with auto-lock, magnetic hook end and impact-resistant rubberised housing for daily measuring.',
  },
];

export const newArrivals: Product[] = [
  {
    name: '18V Brushless Impact Wrench',
    model: 'JKI-18BL',
    sku: 'JK-101001',
    price: 149.0,
    badge: 'New',
    art: 'impact',
    stock: 'In stock',
    blurb: '300 Nm breakaway torque in a compact 1/2" drive unit with three speed modes for assembly and repair work.',
  },
  {
    name: 'True Grip Digital Multimeter',
    model: 'JKM-820',
    sku: 'JK-101148',
    price: 38.4,
    badge: 'New',
    art: 'multimeter',
    stock: 'In stock',
    blurb: 'Auto-ranging True RMS meter with backlit display, thermocouple and clamp accessory for electrical fault-finding.',
  },
  {
    name: '2,000 lumen LED Work Light',
    model: 'JKW-2000',
    sku: 'JK-101206',
    price: 45.0,
    art: 'worklight',
    badge: 'New',
    stock: 'Low stock',
    blurb: 'Rechargeable site light with three brightness modes, magnetic base, power-bank output and IP65 body.',
  },
  {
    name: '16 Line Cross-Line Laser Level',
    model: 'JKF-16XL',
    sku: 'JK-101330',
    price: 132.0,
    art: 'laser',
    badge: 'New',
    stock: 'In stock',
    blurb: 'Self-levelling 16-line laser with 30 m working range, wall mount and dust-and-shower protected casing.',
  },
  {
    name: '18" 1500W Circular Saw',
    model: 'JKC-18C',
    sku: 'JK-101412',
    price: 96.5,
    art: 'saw',
    badge: 'New',
    stock: 'Pre-order',
    blurb: '165 mm blade circular saw with laser cut guide, 55 mm depth of cut at 90° and soft-start motor.',
  },
];

export type Collection = {
  title: string;
  slug: string;
  text: string;
  art: string;
  meta: string;
  tone: 'light' | 'blue' | 'dark';
};

export const collections: Collection[] = [
  {
    title: 'Trade Bundles',
    slug: 'trade-bundles',
    text: 'Kitted sets for electricians, joiners and general trades — built around the tools each job actually needs.',
    art: 'toolbox',
    meta: '12 bundles from $129',
    tone: 'blue',
  },
  {
    title: 'Workshop Essentials',
    slug: 'workshop-essentials',
    text: 'Ratchets, sockets, torque and storage for mechanics and service technicians working to manufacturer specs.',
    art: 'sockets',
    meta: '38 products',
    tone: 'light',
  },
  {
    title: 'Site Power & Air',
    slug: 'site-power-air',
    text: 'Compressors and power units for construction and plant work, specified for continuous duty in harsh conditions.',
    art: 'compressor',
    meta: '9 products',
    tone: 'dark',
  },
];

export const perks = [
  { icon: 'check', title: '100% Genuine Products', text: 'Quality you can trust' },
  { icon: 'tag', title: 'Competitive Pricing', text: 'Excellent value, every day' },
  { icon: 'refresh', title: 'Easy Returns', text: 'Simple, hassle-free returns' },
  { icon: 'headset', title: 'Expert Support', text: 'Help from our specialist team' },
];

export const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'Power Tools', href: '/power-tools' },
      { label: 'Hand Tools', href: '/hand-tools' },
      { label: 'Workshop & Automotive', href: '/workshop-automotive' },
      { label: 'Industrial Equipment', href: '/industrial-equipment' },
      { label: 'Maintenance & Testing', href: '/maintenance-testing' },
      { label: 'Outdoor Equipment', href: '/outdoor-equipment' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'About JOHNKEANS', href: '/about' },
      { label: 'Request a Quote', href: '/request-a-quote' },
      { label: 'Track Your Order', href: '/track-order' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Return & Refund Policy', href: '/return-refund-policy' },
      { label: 'Warranty Policy', href: '/warranty-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Product Enquiries', href: '/contact?type=product' },
      { label: 'Technical Support', href: '/contact?type=technical' },
      { label: 'Returns & Refunds', href: '/contact?type=returns' },
      { label: 'Shipping & Delivery', href: '/contact?type=shipping' },
      { label: 'Warranty Claims', href: '/contact?type=warranty' },
    ],
  },
];

export const socials = [
  { label: 'Facebook', short: 'f', href: 'https://facebook.com/johnkeans' },
  { label: 'Instagram', short: 'ig', href: 'https://instagram.com/johnkeans' },
  { label: 'LinkedIn', short: 'in', href: 'https://linkedin.com/company/johnkeans' },
  { label: 'YouTube', short: 'yt', href: 'https://youtube.com/@johnkeans' },
  { label: 'WhatsApp', short: 'wa', href: 'https://wa.me/44744906225' },
];
