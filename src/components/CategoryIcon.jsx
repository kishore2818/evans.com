import React from 'react';

/**
 * Premium Luxury Skincare Category Icons
 * High-precision 2-color vector line art illustrations matching modern luxury cosmetics.
 */
export const CategoryIcon = ({ category, className = "w-12 h-12" }) => {
  const norm = (category || '').toLowerCase().trim();

  // SERUM / FACE SERUM / DROPPER BOTTLE
  if (norm.includes('serum') || norm.includes('dropper') || norm.includes('essence') || norm.includes('elixir')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="serumGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF0E6" />
            <stop offset="50%" stopColor="#F5E4C3" />
            <stop offset="100%" stopColor="#E2C17D" />
          </linearGradient>
        </defs>
        {/* Rubber Bulb */}
        <path d="M26 5C26 3.5 28.5 2 32 2C35.5 2 38 3.5 38 5V10H26V5Z" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="2" strokeLinejoin="round" />
        {/* Gold Cap Ring */}
        <rect x="23" y="10" width="18" height="6" rx="1.5" fill="url(#serumGoldGrad)" stroke="#3e1d4a" strokeWidth="2" />
        {/* Bottle Body Liquid Fill */}
        <path d="M19 25C19 22 23 18 27 18H37C41 18 45 22 45 25V52C45 57 41 61 36 61H28C23 61 19 57 19 52V25Z" fill="url(#serumGoldGrad)" fillOpacity="0.5" />
        {/* Bottle Body Outline */}
        <path d="M27 16H37V19C41 19 45 22 45 25V52C45 57 41 61 36 61H28C23 61 19 57 19 52V25C19 22 23 19 27 19V16Z" stroke="#3e1d4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Pipette Tube inside */}
        <path d="M29 16V42L32 46L35 42V16" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        {/* Dripping Liquid Drop */}
        <path d="M32 49C30 52 29 54 32 58C35 54 34 52 32 49Z" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Bottle Gloss Highlight */}
        <path d="M23 28V48" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
      </svg>
    );
  }

  // SCRUB / EXFOLIATOR / FACE SCRUB
  if (norm.includes('scrub') || norm.includes('exfoliat') || norm.includes('polish')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scrubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2DC" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Wide Jar Body */}
        <path d="M12 28C12 24 16 22 22 22H42C48 22 52 24 52 28V49C52 55 47 59 40 59H24C17 59 12 55 12 49V28Z" fill="url(#scrubGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
        {/* Jar Lid Ring */}
        <rect x="15" y="16" width="34" height="6" rx="2" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="1.5" />
        {/* Gold Accent Band */}
        <rect x="18" y="22" width="28" height="3" fill="#D4AF37" />
        {/* Exfoliating Scrub Granules */}
        <circle cx="24" cy="34" r="2.5" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.2" />
        <circle cx="32" cy="31" r="2" fill="#3e1d4a" />
        <circle cx="40" cy="35" r="2.8" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.2" />
        <circle cx="28" cy="43" r="2.2" fill="#3e1d4a" />
        <circle cx="36" cy="42" r="2.5" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.2" />
        <circle cx="44" cy="44" r="1.8" fill="#D4AF37" />
        {/* Gloss line */}
        <path d="M16 32V46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // CONDITIONER / HAIR CONDITIONER
  if (norm.includes('conditioner')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="condGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5E8" />
            <stop offset="100%" stopColor="#E9CCA0" />
          </linearGradient>
        </defs>
        {/* Top Disc Cap */}
        <rect x="25" y="6" width="14" height="6" rx="2" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="2" />
        {/* Bottle Body */}
        <path d="M22 14C17 21 16 46 20 54C22 58 26 60 32 60C38 60 42 58 44 54C48 46 47 21 42 14H22Z" fill="url(#condGrad)" stroke="#3e1d4a" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Silky Wave Texture */}
        <path d="M20 33C24 37 38 29 44 34" stroke="#3e1d4a" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 41C26 44 36 38 42 42" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
        {/* Nourishing Gold Droplet */}
        <circle cx="32" cy="24" r="3" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.5" />
        {/* Shine highlight */}
        <path d="M22 22C20 28 20 40 22 46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // SOAPS / BAR SOAP / CLEANSER BAR
  if (norm.includes('soap') || norm.includes('bar') || norm.includes('bath')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="soapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF0E6" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Water Ripple / Dish Base */}
        <path d="M10 52C22 57 42 57 54 52" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 3" />
        {/* Rounded Soap Bar */}
        <rect x="13" y="24" width="38" height="24" rx="12" fill="url(#soapGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
        {/* Embossed Luxury Oval */}
        <rect x="19" y="30" width="26" height="12" rx="6" stroke="#D4AF37" strokeWidth="1.8" strokeDasharray="2 2" />
        {/* Soap Bubbles */}
        <circle cx="15" cy="17" r="5" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.8" />
        <circle cx="13" cy="15" r="1.8" fill="#ffffff" />
        <circle cx="24" cy="13" r="3.5" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.8" />
        <circle cx="49" cy="16" r="4.5" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.8" />
        <circle cx="47.5" cy="14" r="1.5" fill="#ffffff" />
        <circle cx="55" cy="23" r="3" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.8" />
        {/* Botanical Leaf Stamp */}
        <path d="M30 34C33 31 37 33 36 37C33 38 31 36 30 34Z" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1" />
      </svg>
    );
  }

  // FACE WASH / CLEANSER / PUMP BOTTLE
  if (norm.includes('wash') || norm.includes('cleanse') || norm.includes('face wash') || norm.includes('foam')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="washGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF0E4" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Pump Head */}
        <path d="M25 8H39V12H44V15H36V12H25V8Z" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Pump Shaft */}
        <rect x="30" y="15" width="4" height="6" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.8" />
        {/* Collar Ring */}
        <rect x="24" y="21" width="16" height="4" rx="1.5" fill="#3e1d4a" />
        {/* Bottle Body */}
        <path d="M22 25H42C44.5 25 46 27 46 30V53C46 57 43 60 39 60H25C21 60 18 57 18 53V30C18 27 19.5 25 22 25Z" fill="url(#washGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
        {/* Front Label Frame */}
        <rect x="23" y="33" width="18" height="20" rx="3" fill="#ffffff" fillOpacity="0.85" stroke="#D4AF37" strokeWidth="1.8" />
        {/* Botanical Droplet Graphic */}
        <circle cx="32" cy="40" r="3" fill="#D4AF37" />
        <path d="M32 46L34.5 50H29.5L32 46Z" fill="#3e1d4a" />
        {/* Droplet from Nozzle */}
        <circle cx="45" cy="19" r="1.8" fill="#D4AF37" />
      </svg>
    );
  }

  // SUNSCREEN / SUN CARE / SPF / TUBE
  if (norm.includes('sun') || norm.includes('spf') || norm.includes('tube') || norm.includes('lotion')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8ED" />
            <stop offset="100%" stopColor="#E8C98B" />
          </linearGradient>
        </defs>
        {/* Cap at Bottom */}
        <rect x="25" y="49" width="14" height="11" rx="2" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="2" />
        {/* Tube Body */}
        <path d="M19 11C19 9.5 20.5 8 22 8H42C43.5 8 45 9.5 45 11L40 49H24L19 11Z" fill="url(#sunGrad)" stroke="#3e1d4a" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Crimp Top Seal */}
        <line x1="19" y1="12" x2="45" y2="12" stroke="#3e1d4a" strokeWidth="2" />
        {/* Radiating Sun Center */}
        <circle cx="32" cy="27" r="5.5" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.8" />
        {/* Sun Rays */}
        <line x1="32" y1="17" x2="32" y2="19.5" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="34.5" x2="32" y2="37" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="27" x2="24.5" y2="27" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="39.5" y1="27" x2="42" y2="27" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="25" y1="20" x2="27" y2="22" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="37" y1="32" x2="39" y2="34" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="25" y1="34" x2="27" y2="32" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="37" y1="22" x2="39" y2="20" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // LIP BALM / LIPSTICK / LIP CARE
  if (norm.includes('lip') || norm.includes('balm') || norm.includes('stick') || norm.includes('tint')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9D7DC" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Base Outer Casing */}
        <rect x="22" y="35" width="20" height="24" rx="3" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="2" />
        <rect x="22" y="42" width="20" height="3.5" fill="#D4AF37" />
        {/* Inner Gold Metal Cylinder */}
        <rect x="24" y="22" width="16" height="13" fill="url(#lipGrad)" stroke="#3e1d4a" strokeWidth="1.8" />
        {/* Slanted Lipstick / Balm Bullet */}
        <path d="M25.5 22V12C25.5 12 25.5 7.5 32 4.5C38 8.5 38 16 38 22H25.5Z" fill="#E6C687" stroke="#3e1d4a" strokeWidth="2" strokeLinejoin="round" />
        <path d="M26 12L37.5 18" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        {/* Bullet Shine */}
        <path d="M28 14C28 14 30 10 34 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // CREAM / MOISTURIZER / COSMETIC JAR
  if (norm.includes('cream') || norm.includes('moisturizer') || norm.includes('jar') || norm.includes('butter') || norm.includes('night')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="creamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF0E6" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Main Jar Base Body */}
        <path d="M13 29C13 25 17 23.5 23 23.5H41C47 23.5 51 25 51 29V48C51 54 46 58 39 58H25C18 58 13 54 13 48V29Z" fill="url(#creamGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
        {/* Jar Neck / Rim */}
        <rect x="17" y="19" width="30" height="5" rx="2" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="1.5" />
        {/* Open Propped Lid behind */}
        <path d="M37 9L56 24L51 28.5L32 13.5L37 9Z" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Cream Swirl Surface Inside */}
        <ellipse cx="32" cy="29" rx="16" ry="4.5" fill="#ffffff" stroke="#3e1d4a" strokeWidth="1.8" />
        <path d="M23 29C27 31.5 35 31.5 39 28" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
        {/* Front Luxury Label */}
        <rect x="21" y="37" width="22" height="13" rx="2.5" fill="#ffffff" fillOpacity="0.9" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="25" y1="42" x2="39" y2="42" stroke="#3e1d4a" strokeWidth="1.2" />
        <line x1="27" y1="46" x2="37" y2="46" stroke="#D4AF37" strokeWidth="1.2" />
      </svg>
    );
  }

  // HAIR OIL / OIL / ESSENTIAL OIL
  if (norm.includes('oil') || norm.includes('hair oil') || norm.includes('argan') || norm.includes('growth')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="oilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4DB" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Wooden Cork Stopper */}
        <path d="M26 5H38L36 11H28L26 5Z" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.8" />
        {/* Bottle Neck */}
        <rect x="27" y="11" width="10" height="7" fill="#F8E8D8" stroke="#3e1d4a" strokeWidth="1.8" />
        {/* Glass Flask Body */}
        <path d="M27 18L21 25C17 30 15 38 17 46C19 55 24 59 32 59C40 59 45 55 47 46C49 38 47 30 43 25L37 18H27Z" fill="url(#oilGrad)" stroke="#3e1d4a" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Botanical Leaf Motif inside */}
        <path d="M32 29C32 29 39 33 37 42C35 48 28 48 28 41C28 35 32 29 32 29Z" fill="#3e1d4a" fillOpacity="0.12" stroke="#3e1d4a" strokeWidth="1.8" />
        <path d="M32 32V45" stroke="#3e1d4a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 37C34.5 35 38 36 38 36" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M32 41C29.5 39.5 27 40.5 27 40.5" stroke="#D4AF37" strokeWidth="1.5" />
      </svg>
    );
  }

  // SHAMPOO / HAIR CARE / CLEANSER
  if (norm.includes('shampoo') || norm.includes('hair')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shampooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8E8D8" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Flip-Top Cap */}
        <path d="M25 6H39C40.5 6 41.5 7 41.5 8.5V14H22.5V8.5C22.5 7 23.5 6 25 6Z" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="1.8" />
        <line x1="23" y1="11" x2="41" y2="11" stroke="#D4AF37" strokeWidth="1.8" />
        {/* Contoured Shampoo Bottle Body */}
        <path d="M23 14C19 21 19 44 22 53C24 58 28 60 32 60C36 60 40 58 42 53C45 44 45 21 41 14H23Z" fill="url(#shampooGrad)" stroke="#3e1d4a" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Wave / Bubbles graphic */}
        <path d="M22 34C26 37 38 31 42 35" stroke="#3e1d4a" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="27" cy="26" r="2.5" fill="#D4AF37" />
        <circle cx="34" cy="23" r="1.8" fill="#3e1d4a" />
        <circle cx="37" cy="27" r="3" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.5" />
      </svg>
    );
  }

  // TONER / MIST / SPRAY
  if (norm.includes('toner') || norm.includes('mist') || norm.includes('spray')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tonerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5E8" />
            <stop offset="100%" stopColor="#E8CBA3" />
          </linearGradient>
        </defs>
        {/* Spray Cap */}
        <path d="M28 6H36V11H39V15H25V11H28V6Z" fill="#3e1d4a" stroke="#3e1d4a" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="41.5" cy="13" r="1.5" fill="#D4AF37" />
        {/* Spray Droplets */}
        <circle cx="48" cy="9" r="1.2" fill="#D4AF37" />
        <circle cx="53" cy="12" r="1.5" fill="#3e1d4a" />
        <circle cx="50" cy="17" r="1" fill="#D4AF37" />
        {/* Tall Bottle Body */}
        <rect x="22" y="15" width="20" height="44" rx="6" fill="url(#tonerGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
        {/* Label and Liquid level */}
        <rect x="26" y="26" width="12" height="20" rx="2" fill="#ffffff" fillOpacity="0.8" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="32" cy="36" r="2.5" fill="#D4AF37" />
      </svg>
    );
  }

  // FACE MASK / SHEET MASK / PACK
  if (norm.includes('mask') || norm.includes('pack')) {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="maskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF0E6" />
            <stop offset="100%" stopColor="#E6C687" />
          </linearGradient>
        </defs>
        {/* Sheet Mask Pouch / Outline */}
        <path d="M16 12C16 8 20 6 24 6H40C44 6 48 8 48 12V52C48 56 44 58 40 58H24C20 58 16 56 16 52V12Z" fill="url(#maskGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
        {/* Top Notch Crimp */}
        <path d="M16 16H20M44 16H48" stroke="#3e1d4a" strokeWidth="2" strokeLinecap="round" />
        {/* Mask Face Graphic inside */}
        <ellipse cx="32" cy="34" rx="10" ry="12" fill="#ffffff" stroke="#D4AF37" strokeWidth="1.8" />
        <ellipse cx="28" cy="31" rx="2" ry="1.2" fill="#3e1d4a" />
        <ellipse cx="36" cy="31" rx="2" ry="1.2" fill="#3e1d4a" />
        <ellipse cx="32" cy="39" rx="3" ry="1.5" fill="#3e1d4a" />
      </svg>
    );
  }

  // DEFAULT / BOTANICAL LUXURY FLASK
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF0E6" />
          <stop offset="100%" stopColor="#E6C687" />
        </linearGradient>
      </defs>
      {/* Luxury Bottle Shape */}
      <rect x="20" y="20" width="24" height="38" rx="10" fill="url(#defaultGrad)" stroke="#3e1d4a" strokeWidth="2.2" />
      <rect x="26" y="12" width="12" height="8" rx="2.5" fill="#3e1d4a" />
      <circle cx="32" cy="8" r="4" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.8" />
      {/* Leaves Motif */}
      <path d="M32 32C37 27 42 33 37 40C32 44 26 38 32 32Z" fill="#D4AF37" stroke="#3e1d4a" strokeWidth="1.5" />
      <path d="M32 32C27 27 22 33 27 40C32 44 38 38 32 32Z" fill="#FAF0E6" stroke="#3e1d4a" strokeWidth="1.5" />
    </svg>
  );
};

export default CategoryIcon;
