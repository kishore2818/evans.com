export const products = [
  {
    id: 1,
    name: "Lavender Serenity Soap",
    category: "Soaps",
    price: 299.00,
    rating: 4.8,
    reviews: 124,
    image: "/images/lavender_soap_1775973283549.png",
    description: "Our signature artisanal soap infused with pure French lavender essential oil and dried botanicals.",
    benefits: ["Calming and soothing", "Gentle on sensitive skin", "Rich lathering"],
    isBestSeller: true
  },
  {
    id: 2,
    name: "Rosehip Radiance Face Wash",
    category: "Face Wash",
    price: 149.00,
    rating: 4.9,
    reviews: 89,
    image: "/images/rosehip_facewash_1775973316982.png",
    description: "A gentle daily cleanser rich in antioxidants and vitamin C, leaving skin bright and refreshed.",
    benefits: ["Removes impurities gently", "Brightens complexion", "Maintains pH balance"],
    isBestSeller: true
  },
  {
    id: 3,
    name: "Golden Nectar Lip Balm",
    category: "Lip Balm",
    price: 49.00,
    rating: 4.7,
    reviews: 210,
    image: "/images/golden_lipbalm_1775973333184.png",
    description: "Intensive moisturizing lip treatment with raw organic honey and shea butter.",
    benefits: ["Deep hydration", "Protects against wind chapping", "Subtle natural gloss"],
    isBestSeller: false
  },
  {
    id: 4,
    name: "Mineral Bloom Sunscreen SPF 50",
    category: "Sunscreen",
    price: 199.00,
    rating: 4.6,
    reviews: 156,
    image: "/images/mineral_sunscreen_1775973350994.png",
    description: "Sheer, lightweight mineral sunscreen that provides broad-spectrum protection without white cast.",
    benefits: ["Broad spectrum UVA/UVB", "Reef safe", "Non-greasy finish"],
    isBestSeller: true
  },
  {
    id: 5,
    name: "Rosemary Mint Shampoo",
    category: "Shampoo",
    price: 399.00,
    rating: 4.8,
    reviews: 95,
    image: "/images/rosemary_shampoo_1775973400591.png",
    description: "Invigorating botanical shampoo that stimulates the scalp and strengthens hair follicles.",
    benefits: ["Promotes hair growth", "Clarifying formula", "Refreshing scent"],
    isBestSeller: false
  },
  {
    id: 6,
    name: "Argan Silk Hair Oil",
    category: "Hair Oil",
    price: 499.00,
    rating: 4.9,
    reviews: 178,
    image: "/images/serum_aura.png",
    description: "Luxurious blend of pure Moroccan argan oil and jojoba to tame frizz and add glorious shine.",
    benefits: ["Tames frizz", "Heat protection", "Deeply nourishing"],
    isBestSeller: true
  },
  {
    id: 7,
    name: "Vitamin C Glow Serum",
    category: "Serum",
    price: 199.00,
    rating: 4.9,
    reviews: 52,
    image: "/images/serum_product.png",
    description: "A lightweight, brightening serum packed with high-potency Vitamin C and Hyaluronic Acid for a radiant, youthful glow.",
    benefits: ["Brightens skin tone", "Deeply hydrates", "Reduces fine lines"],
    isBestSeller: true
  }
];

export const categories = [
  { name: "Soaps", icon: "Soap" },
  { name: "Face Wash", icon: "Droplets" },
  { name: "Lip Balm", icon: "Smile" },
  { name: "Sunscreen", icon: "Sun" },
  { name: "Shampoo", icon: "Wind" },
  { name: "Hair Oil", icon: "Sparkles" },
  { name: "Serum", icon: "Droplet" }
];
