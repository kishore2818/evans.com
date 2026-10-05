export const products = [
  {
    id: 1,
    name: "Lavender Serenity Artisan Bar",
    category: "Soaps",
    price: 299.00,
    rating: 4.8,
    reviews: 124,
    image: "/images/skin_polishing_soap.jpg",
    images: ["/images/skin_polishing_soap.jpg", "/images/sweet_orange_scrub.jpg"],
    description: "Our signature cold-pressed artisanal soap infused with pure French lavender essential oil and soothing botanicals to calm irritated skin and relax senses.",
    benefits: ["Calming and soothing", "Gentle on sensitive skin", "Rich creamy lather"],
    isBestSeller: true,
    stock: 24,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Paraben-Free", "Clean Beauty"],
    skinTypes: ["Sensitive", "Dry", "All Skin Types"],
    skinConcerns: ["Redness", "Hydration", "Dullness"],
    shades: [
      { name: "French Lavender", hex: "#9F86C0", image: "/images/skin_polishing_soap.jpg", stock: 12 },
      { name: "Wild Chamomile", hex: "#E8D3A2", image: "/images/sweet_orange_scrub.jpg", stock: 8 },
      { name: "Rose Blush", hex: "#E5989B", image: "/images/skin_polishing_soap.jpg", stock: 4 }
    ],
    ingredients: [
      { name: "French Lavender Oil", percentage: "3%", benefit: "Soothes inflammation & reduces redness" },
      { name: "Shea Butter (Raw)", percentage: "15%", benefit: "Deep lipid hydration & skin elasticity" },
      { name: "Organic Coconut Oil", percentage: "20%", benefit: "Creates rich moisture barrier" }
    ],
    fullIngredientsList: "Saponified Coconut Oil, Shea Butter, French Lavender Essential Oil, Olive Fruit Oil, Dried Lavender Buds, Vegetable Glycerin, Vitamin E Tocopherol.",
    beforeAfter: {
      beforeImage: "/images/skin_polishing_soap.jpg",
      afterImage: "/images/aloevera_gel.jpg",
      timeframe: "3 Weeks",
      resultPercentage: "96%",
      resultText: "Clinically tested: 96% noticed reduced skin redness & barrier relief"
    },
    flashSale: {
      isActive: true,
      discountPercentage: 20,
      endDate: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
      bannerText: "Flash Deal: 20% OFF Limited Batch"
    }
  },
  {
    id: 2,
    name: "Rosehip Radiance Gentle Cleanser",
    category: "Face Wash",
    price: 349.00,
    rating: 4.9,
    reviews: 89,
    image: "/images/saffron_face_wash.jpg",
    images: ["/images/saffron_face_wash.jpg", "/images/aloevera_gel.jpg"],
    description: "A gentle daily pH-balanced cleanser rich in rosehip seed oil and vitamin C, dissolving impurities while enhancing natural radiance.",
    benefits: ["Removes impurities gently", "Brightens complexion", "Maintains pH balance 5.5"],
    isBestSeller: true,
    stock: 6,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Sulfate-Free", "Dermatologist-Tested"],
    skinTypes: ["Combination", "Oily", "All Skin Types"],
    skinConcerns: ["Dark Spots", "Acne & Blemishes", "Brightening"],
    shades: [
      { name: "Gentle Gel", hex: "#F7CAD0", image: "/images/saffron_face_wash.jpg", stock: 4 },
      { name: "Deep Foam", hex: "#F3A7BA", image: "/images/saffron_face_wash.jpg", stock: 2 }
    ],
    ingredients: [
      { name: "Organic Rosehip Seed Oil", percentage: "5%", benefit: "Rich in Vitamin A & C to fade dark spots" },
      { name: "Niacinamide (Vitamin B3)", percentage: "2%", benefit: "Refines pore texture & balances sebum" },
      { name: "Centella Asiatica (Cica)", percentage: "3%", benefit: "Calms active blemishes and sensitivity" }
    ],
    fullIngredientsList: "Rosa Canina (Rosehip) Seed Extract, Aqua, Decyl Glucoside, Niacinamide, Centella Asiatica Extract, Citric Acid, Phenoxyethanol, Ethylhexylglycerin.",
    beforeAfter: {
      beforeImage: "/images/saffron_face_wash.jpg",
      afterImage: "/images/saffron_day_cream.jpg",
      timeframe: "4 Weeks",
      resultPercentage: "92%",
      resultText: "Users experienced visibly clearer, luminous skin tone"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 3,
    name: "Golden Nectar Tinted Lip Treatment",
    category: "Lip Balm",
    price: 199.00,
    rating: 4.7,
    reviews: 210,
    image: "/images/herbal_wax_powder.jpg",
    images: ["/images/herbal_wax_powder.jpg"],
    description: "Intensive moisturizing lip therapy with honey nectar, peptide complex, and buildable sheer pigments for juicy, plump lips.",
    benefits: ["24-Hour deep hydration", "Repairs chapped lips", "Glass-like natural shine"],
    isBestSeller: false,
    stock: 18,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Paraben-Free", "Clean Beauty"],
    skinTypes: ["All Skin Types", "Dry"],
    skinConcerns: ["Hydration", "Fine Lines"],
    shades: [
      { name: "Golden Honey Sheer", hex: "#D4AF37", image: "/images/herbal_wax_powder.jpg", stock: 8 },
      { name: "Berry Velvet", hex: "#9E2A2B", image: "/images/herbal_wax_powder.jpg", stock: 5 },
      { name: "Nude Rose Petal", hex: "#C08081", image: "/images/herbal_wax_powder.jpg", stock: 5 }
    ],
    ingredients: [
      { name: "Raw Honey Peptide Complex", percentage: "8%", benefit: "Instant plumping & lip barrier repair" },
      { name: "Cold-Pressed Jojoba Oil", percentage: "12%", benefit: "Locks in moisture without stickiness" },
      { name: "Vitamin E", percentage: "1%", benefit: "Protects against UV environmental drying" }
    ],
    fullIngredientsList: "Ricinus Communis (Castor) Seed Oil, Butyrospermum Parkii (Shea Butter), Simmondsia Chinensis (Jojoba) Oil, Honey Extract, Palmitoyl Tripeptide-1, Tocopherol, Natural Mica Pigment.",
    beforeAfter: {
      beforeImage: "/images/herbal_wax_powder.jpg",
      afterImage: "/images/herbal_wax_powder.jpg",
      timeframe: "Instant",
      resultPercentage: "98%",
      resultText: "Instant +140% moisture surge & smooth plump finish"
    },
    flashSale: {
      isActive: true,
      discountPercentage: 15,
      endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      bannerText: "Flash Price: 15% OFF"
    }
  },
  {
    id: 4,
    name: "Mineral Bloom Invisible Sunscreen SPF 50+ PA++++",
    category: "Sunscreen",
    price: 499.00,
    rating: 4.6,
    reviews: 156,
    image: "/images/saffron_day_cream.jpg",
    images: ["/images/saffron_day_cream.jpg", "/images/aloevera_gel.jpg"],
    description: "Ultra-sheer, lightweight mineral sunscreen with non-nano Zinc Oxide that provides broad-spectrum UV and blue light shield with zero white cast.",
    benefits: ["Broad spectrum UVA/UVB PA++++", "Reef safe & non-comedogenic", "Velvet matte finish"],
    isBestSeller: true,
    stock: 35,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Reef-Safe", "Dermatologist-Tested", "Clean Beauty"],
    skinTypes: ["All Skin Types", "Sensitive", "Oily"],
    skinConcerns: ["Anti-Aging", "Dark Spots", "Redness"],
    shades: [
      { name: "Universal Sheer", hex: "#FFF8F0", image: "/images/saffron_day_cream.jpg", stock: 20 },
      { name: "Warm Tint SPF", hex: "#D8A47F", image: "/images/saffron_day_cream.jpg", stock: 15 }
    ],
    ingredients: [
      { name: "Non-Nano Zinc Oxide", percentage: "18.5%", benefit: "Broad spectrum physical sun barrier" },
      { name: "Ectoin & Blue Light Filter", percentage: "1.5%", benefit: "Shields against digital screen pollution" },
      { name: "Hyaluronic Acid Multi-Weight", percentage: "2%", benefit: "Deep cellular hydration" }
    ],
    fullIngredientsList: "Zinc Oxide, Aqua, Caprylic/Capric Triglyceride, Squalane, Ectoin, Sodium Hyaluronate, Camellia Sinensis (Green Tea) Extract, Silica.",
    beforeAfter: {
      beforeImage: "/images/saffron_day_cream.jpg",
      afterImage: "/images/saffron_day_cream.jpg",
      timeframe: "Daily Wear",
      resultPercentage: "95%",
      resultText: "Zero white-cast, 100% breathable daily shield"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 5,
    name: "Rosemary Peppermint Scalp Clarifying Elixir",
    category: "Shampoo",
    price: 449.00,
    rating: 4.8,
    reviews: 95,
    image: "/images/rosemary_hair_oil.jpg",
    images: ["/images/rosemary_hair_oil.jpg"],
    description: "Invigorating botanical shampoo with cold-distilled rosemary and biotin to stimulate hair follicles, control scalp oiliness, and boost volume.",
    benefits: ["Stimulates hair root growth", "Clarifying & anti-dandruff", "Volumizing finish"],
    isBestSeller: false,
    stock: 5,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Sulfate-Free", "Silicone-Free"],
    skinTypes: ["All Skin Types", "Oily"],
    skinConcerns: ["Acne & Blemishes", "Dullness"],
    shades: [
      { name: "Herbal Green", hex: "#70A288", image: "/images/rosemary_hair_oil.jpg", stock: 5 }
    ],
    ingredients: [
      { name: "Rosemary Leaf Extract", percentage: "4%", benefit: "Clinically proven to improve follicle strength" },
      { name: "Biotin + Tripeptide", percentage: "1%", benefit: "Thickens hair strands and reduces shedding" },
      { name: "Peppermint Essential Oil", percentage: "0.5%", benefit: "Cooling scalp micro-circulation stimulation" }
    ],
    fullIngredientsList: "Aqua, Rosmarinus Officinalis (Rosemary) Leaf Extract, Sodium Lauroyl Methyl Isethionate, Cocamidopropyl Betaine, Biotinoyl Tripeptide-1, Mentha Piperita (Peppermint) Oil, Panthenol (Pro-Vitamin B5).",
    beforeAfter: {
      beforeImage: "/images/rosemary_hair_oil.jpg",
      afterImage: "/images/keratin_hair_care.jpg",
      timeframe: "6 Weeks",
      resultPercentage: "89%",
      resultText: "89% users observed visible hair density and reduced scalp buildup"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 6,
    name: "Argan Silk Botanical Hair Gloss Oil",
    category: "Hair Oil",
    price: 599.00,
    rating: 4.9,
    reviews: 178,
    image: "/images/keratin_hair_care.jpg",
    images: ["/images/keratin_hair_care.jpg", "/images/rosemary_hair_oil.jpg"],
    description: "Pure Moroccan cold-pressed argan oil blended with camellia seed and golden jojoba for weightless glass shine and 450°F heat protection.",
    benefits: ["Tames frizz for 72 hours", "450°F Heat protection", "Silky mirror shine"],
    isBestSeller: true,
    stock: 14,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Silicone-Free", "Clean Beauty"],
    skinTypes: ["All Skin Types", "Dry"],
    skinConcerns: ["Hydration", "Dullness"],
    shades: [
      { name: "Golden Lustre", hex: "#E9C46A", image: "/images/keratin_hair_care.jpg", stock: 14 }
    ],
    ingredients: [
      { name: "100% Moroccan Argan Oil", percentage: "60%", benefit: "High fatty acid profile for cuticle smoothing" },
      { name: "Japanese Camellia Oil", percentage: "25%", benefit: "Deep lightweight lipid nourishment" },
      { name: "Rose Hip Seed Oil", percentage: "15%", benefit: "Adds radiant luster without heaviness" }
    ],
    fullIngredientsList: "Argania Spinosa Kernel Oil, Camellia Japonica Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Rosa Canina Fruit Oil, Natural Fragrance, Tocopherol.",
    beforeAfter: {
      beforeImage: "/images/keratin_hair_care.jpg",
      afterImage: "/images/keratin_hair_care.jpg",
      timeframe: "Instant",
      resultPercentage: "97%",
      resultText: "97% noticed immediate frizz reduction & mirror gloss"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 7,
    name: "Vitamin C 15% Brightening Aura Serum",
    category: "Serum",
    price: 699.00,
    rating: 4.9,
    reviews: 215,
    image: "/images/24kt_gold_serum.jpg",
    images: ["/images/24kt_gold_serum.jpg", "/images/glow_fusion_gel.jpg"],
    description: "Clinical-grade 15% Ethyl Ascorbic Acid combined with Ferulic Acid and Multi-molecular Hyaluronic Acid to fade hyperpigmentation, smooth texture, and stimulate collagen.",
    benefits: ["Fades dark spots & discoloration", "Plumps skin with 24H hydration", "Boosts collagen synthesis"],
    isBestSeller: true,
    stock: 22,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Fragrance-Free", "Dermatologist-Tested", "Clean Beauty"],
    skinTypes: ["All Skin Types", "Combination", "Dry", "Oily"],
    skinConcerns: ["Dark Spots", "Anti-Aging", "Dullness", "Hydration", "Fine Lines"],
    shades: [
      { name: "Standard 30ml", hex: "#F4A261", image: "/images/24kt_gold_serum.jpg", stock: 16 },
      { name: "Luxe 50ml", hex: "#E76F51", image: "/images/glow_fusion_gel.jpg", stock: 6 }
    ],
    ingredients: [
      { name: "3-O-Ethyl Ascorbic Acid (Vit C)", percentage: "15%", benefit: "High-stability active to dramatically reduce hyperpigmentation" },
      { name: "Ferulic Acid", percentage: "1%", benefit: "Supercharges Vitamin C efficacy & fights oxidative damage" },
      { name: "Multi-Weight Hyaluronic Complex", percentage: "2%", benefit: "Multi-depth moisture reservoir" }
    ],
    fullIngredientsList: "Aqua, 3-O-Ethyl Ascorbic Acid, Propanediol, Sodium Hyaluronate, Ferulic Acid, Panthenol, Glycerin, Sodium Hydroxide, Sodium Citrate, Phenoxyethanol.",
    beforeAfter: {
      beforeImage: "/images/24kt_gold_serum.jpg",
      afterImage: "/images/glow_fusion_gel.jpg",
      timeframe: "4 Weeks",
      resultPercentage: "94%",
      resultText: "Clinically proven: 94% showed visible dark spot reduction in 28 days"
    },
    flashSale: {
      isActive: true,
      discountPercentage: 25,
      endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      bannerText: "Flash Deal: 25% OFF Golden Serum"
    }
  },
  {
    id: 8,
    name: "Chandan Glow Night Repair Cream",
    category: "Moisturizer",
    price: 549.00,
    rating: 4.8,
    reviews: 143,
    image: "/images/chandan_glow_night_cream.jpg",
    images: ["/images/chandan_glow_night_cream.jpg", "/images/saffron_day_cream.jpg"],
    description: "Overnight repair cream with Sandalwood extract, Bakuchiol (natural retinol), and Ceramide Complex to deeply nourish, rejuvenate and restore skin glow while you sleep.",
    benefits: ["Deep overnight repair", "Natural retinol alternative", "Restores skin barrier"],
    isBestSeller: true,
    stock: 9,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Retinol-Free", "Clean Beauty"],
    skinTypes: ["Dry", "Sensitive", "All Skin Types"],
    skinConcerns: ["Anti-Aging", "Fine Lines", "Hydration", "Dullness"],
    shades: [
      { name: "Classic 50ml", hex: "#D4A574", image: "/images/chandan_glow_night_cream.jpg", stock: 9 }
    ],
    ingredients: [
      { name: "Sandalwood (Chandan) Extract", percentage: "5%", benefit: "Brightens tone & reduces inflammation" },
      { name: "Bakuchiol", percentage: "1%", benefit: "Plant-based retinol alternative for cell renewal" },
      { name: "Ceramide NP", percentage: "2%", benefit: "Strengthens moisture barrier overnight" }
    ],
    fullIngredientsList: "Aqua, Santalum Album (Sandalwood) Extract, Bakuchiol, Ceramide NP, Shea Butter, Glycerin, Squalane, Niacinamide, Panthenol, Tocopherol, Phenoxyethanol.",
    beforeAfter: {
      beforeImage: "/images/chandan_glow_night_cream.jpg",
      afterImage: "/images/saffron_day_cream.jpg",
      timeframe: "2 Weeks",
      resultPercentage: "91%",
      resultText: "91% noticed visibly plumper, glowing skin after 2 weeks of nightly use"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 9,
    name: "Detox Charcoal Deep Pore Scrub",
    category: "Scrub",
    price: 379.00,
    rating: 4.7,
    reviews: 88,
    image: "/images/detox_charcoal_scrub.jpg",
    images: ["/images/detox_charcoal_scrub.jpg", "/images/sweet_orange_scrub.jpg"],
    description: "Activated charcoal and walnut shell micro-exfoliant with Tea Tree oil to deeply cleanse pores, control excess sebum and eliminate blackheads.",
    benefits: ["Deep pore cleansing", "Controls blackheads", "Reduces oiliness"],
    isBestSeller: false,
    stock: 3,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Paraben-Free"],
    skinTypes: ["Oily", "Combination"],
    skinConcerns: ["Acne & Blemishes", "Dark Spots", "Redness"],
    shades: [
      { name: "Original", hex: "#2D2D2D", image: "/images/detox_charcoal_scrub.jpg", stock: 3 }
    ],
    ingredients: [
      { name: "Activated Bamboo Charcoal", percentage: "5%", benefit: "Magnetic pore-drawing detox" },
      { name: "Tea Tree Essential Oil", percentage: "1%", benefit: "Antimicrobial blemish control" },
      { name: "Walnut Shell Powder", percentage: "10%", benefit: "Physical exfoliation of dead skin cells" }
    ],
    fullIngredientsList: "Aqua, Charcoal Powder, Walnut Shell Powder, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Glycerin, Kaolin Clay, Sodium Lauroyl Methyl Isethionate.",
    beforeAfter: {
      beforeImage: "/images/detox_charcoal_scrub.jpg",
      afterImage: "/images/sweet_orange_scrub.jpg",
      timeframe: "3 Weeks",
      resultPercentage: "88%",
      resultText: "88% noticed visibly cleaner, tighter pores after 3 weeks"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 10,
    name: "Sweet Orange Brightening Body Scrub",
    category: "Scrub",
    price: 329.00,
    rating: 4.6,
    reviews: 67,
    image: "/images/sweet_orange_scrub.jpg",
    images: ["/images/sweet_orange_scrub.jpg", "/images/aloevera_gel.jpg"],
    description: "Sugar-based body scrub infused with cold-pressed Sweet Orange oil and Vitamin C to exfoliate dull skin, boost radiance, and leave a citrusy glow.",
    benefits: ["Brightens dull skin", "Removes dead cells", "Boosts radiance"],
    isBestSeller: false,
    stock: 20,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Natural"],
    skinTypes: ["All Skin Types", "Combination"],
    skinConcerns: ["Brightening", "Dullness", "Hydration"],
    shades: [
      { name: "Citrus Burst", hex: "#F4A261", image: "/images/sweet_orange_scrub.jpg", stock: 20 }
    ],
    ingredients: [
      { name: "Cold-Pressed Sweet Orange Oil", percentage: "3%", benefit: "Vitamin C rich brightening agent" },
      { name: "Brown Sugar Crystals", percentage: "30%", benefit: "Gentle natural exfoliant" },
      { name: "Jojoba Beads", percentage: "5%", benefit: "Smooth texture polishing" }
    ],
    fullIngredientsList: "Sucrose, Citrus Sinensis (Sweet Orange) Peel Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Glycerin, Tocopherol, Citric Acid.",
    beforeAfter: {
      beforeImage: "/images/sweet_orange_scrub.jpg",
      afterImage: "/images/aloevera_gel.jpg",
      timeframe: "2 Weeks",
      resultPercentage: "90%",
      resultText: "90% reported visibly smoother, brighter skin in 2 weeks"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 11,
    name: "Aloe Vera Soothing Hydra Gel",
    category: "Moisturizer",
    price: 279.00,
    rating: 4.7,
    reviews: 112,
    image: "/images/aloevera_gel.jpg",
    images: ["/images/aloevera_gel.jpg", "/images/glow_fusion_gel.jpg"],
    description: "Pure 98% Aloe Vera gel enriched with Hyaluronic Acid and Niacinamide. Instantly calms, cools, and floods skin with intense hydration — no white residue.",
    benefits: ["Instant cooling relief", "Deep skin hydration", "Calms sunburn & redness"],
    isBestSeller: false,
    stock: 30,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Fragrance-Free", "Clean Beauty"],
    skinTypes: ["All Skin Types", "Sensitive", "Oily"],
    skinConcerns: ["Redness", "Hydration", "Acne & Blemishes"],
    shades: [
      { name: "Pure Gel", hex: "#B5E5CF", image: "/images/aloevera_gel.jpg", stock: 30 }
    ],
    ingredients: [
      { name: "Aloe Barbadensis Leaf Juice (98%)", percentage: "98%", benefit: "Cooling hydration & barrier repair" },
      { name: "Sodium Hyaluronate", percentage: "1%", benefit: "Deep skin plumping & moisture locking" },
      { name: "Niacinamide", percentage: "3%", benefit: "Pore minimising & sebum control" }
    ],
    fullIngredientsList: "Aloe Barbadensis Leaf Juice, Aqua, Sodium Hyaluronate, Niacinamide, Glycerin, Carbomer, Triethanolamine, Phenoxyethanol.",
    beforeAfter: {
      beforeImage: "/images/aloevera_gel.jpg",
      afterImage: "/images/aloevera_gel.jpg",
      timeframe: "1 Week",
      resultPercentage: "93%",
      resultText: "93% reported calmer, more hydrated skin after one week"
    },
    flashSale: { isActive: false, discountPercentage: 0 }
  },
  {
    id: 12,
    name: "Glow Fusion Radiance Serum",
    category: "Serum",
    price: 749.00,
    rating: 4.8,
    reviews: 98,
    image: "/images/glow_fusion_gel.jpg",
    images: ["/images/glow_fusion_gel.jpg", "/images/24kt_gold_serum.jpg"],
    description: "Luxurious multi-active serum blending 24K Gold flakes, Tranexamic Acid, and Peptide Complex to visibly even skin tone and restore youthful luminosity.",
    benefits: ["Visibly evens skin tone", "24K Gold radiance boost", "Reduces hyperpigmentation"],
    isBestSeller: true,
    stock: 8,
    lowStockThreshold: 10,
    cleanBadges: ["Cruelty-Free", "Vegan", "Dermatologist-Tested", "Clean Beauty"],
    skinTypes: ["Dry", "Combination", "All Skin Types"],
    skinConcerns: ["Dark Spots", "Anti-Aging", "Brightening", "Dullness"],
    shades: [
      { name: "Gold Edition 30ml", hex: "#D4AF37", image: "/images/glow_fusion_gel.jpg", stock: 8 }
    ],
    ingredients: [
      { name: "Tranexamic Acid", percentage: "3%", benefit: "Clinically proven spot-fading agent" },
      { name: "24K Gold Nano Particles", percentage: "0.1%", benefit: "Skin-radiance amplifier & antioxidant" },
      { name: "Matrixyl 3000 Peptide", percentage: "2%", benefit: "Collagen synthesis stimulation" }
    ],
    fullIngredientsList: "Aqua, Tranexamic Acid, Niacinamide, Gold (24K), Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate, Glycerin, Squalane, Phenoxyethanol.",
    beforeAfter: {
      beforeImage: "/images/glow_fusion_gel.jpg",
      afterImage: "/images/24kt_gold_serum.jpg",
      timeframe: "4 Weeks",
      resultPercentage: "95%",
      resultText: "95% users saw visibly brighter, more even skin tone in 4 weeks"
    },
    flashSale: {
      isActive: true,
      discountPercentage: 10,
      endDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      bannerText: "Flash: 10% OFF Glow Fusion"
    }
  }
];

export const categories = [
  { name: "Soaps", icon: "Soap" },
  { name: "Face Wash", icon: "Droplets" },
  { name: "Lip Balm", icon: "Smile" },
  { name: "Sunscreen", icon: "Sun" },
  { name: "Shampoo", icon: "Wind" },
  { name: "Hair Oil", icon: "Sparkles" },
  { name: "Serum", icon: "Droplet" },
  { name: "Moisturizer", icon: "Heart" },
  { name: "Scrub", icon: "Star" }
];

export const skinTypeOptions = [
  "All Skin Types",
  "Sensitive",
  "Dry",
  "Oily",
  "Combination"
];

export const skinConcernOptions = [
  "Acne & Blemishes",
  "Anti-Aging",
  "Dark Spots",
  "Hydration",
  "Brightening",
  "Redness",
  "Fine Lines",
  "Dullness"
];
