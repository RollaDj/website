import type { Dictionary } from "./fr";

const en: Dictionary = {
  meta: {
    title: "ROLLA — DJ & Live Trumpet · Lyon, France",
    description:
      "ROLLA is a DJ and trumpet player based in Lyon, France. A live experience where the trumpet electrifies the dancefloor: weddings, corporate events, clubs and festivals.",
    ogAlt: "ROLLA — DJ & Trumpet, live experience",
  },

  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSwitch: "Lire ce site en français",
    newTab: "(opens in a new tab)",
  },

  nav: {
    film: "The film",
    artist: "The artist",
    services: "Services",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    book: "Book",
  },

  hero: {
    kicker: "DJ × Trumpet — Live experience",
    taglineA: "Not just a DJ.",
    taglineB: "Not just a musician.",
    lede: "When the trumpet electrifies the dancefloor: a one-of-a-kind performance where improvisation redefines the electronic set.",
    ctaPrimary: "Book a date",
    ctaSecondary: "Play the film",
    location: "Based in Lyon",
    availability: "France & worldwide",
    scroll: "Scroll",
    imageAlt: "ROLLA playing the trumpet in an ivory fur coat",
  },

  film: {
    label: "The film",
    hint: "Scroll to roll the film",
    scene: "Scene",
    description:
      "Black-and-white excerpts of ROLLA performing: a club DJ set, the trumpet at an upscale evening event, then on an open-air stage. The video advances as you scroll.",
    chapters: [
      {
        numeral: "I",
        title: "The DJ",
        text: "From the clubs of Amiens to the nights of Lyon: fifteen years of reading crowds and building house sets tailored to every dancefloor.",
      },
      {
        numeral: "II",
        title: "The Trumpet",
        text: "A trumpeter by training, ROLLA picked his horn back up in 2025. Brass takes over the dancefloor, improvised live.",
      },
      {
        numeral: "III",
        title: "The Live Experience",
        text: "Not quite a DJ set, not quite a concert: a hybrid performance, electronic and organic, that is never played the same way twice.",
      },
    ],
  },

  artist: {
    index: "01",
    label: "The artist",
    titleA: "A trumpeter turned DJ.",
    titleB: "A DJ turned trumpeter again.",
    paragraphs: [
      "A lifelong music lover, ROLLA trained as a trumpeter before discovering house music in 2006. He then dedicated himself fully to DJing, playing his first sets in the bars and clubs of Amiens from 2012.",
      "A resident at Carré Rouge in 2013, he worked alongside the best DJs in the region. In late 2018, he formed a DJ/Sax duo with saxophonist Elisa, blending electro, jazz and live music. Based in Lyon since 2022, he performs at private events and corporate parties across France. In 2025, he picked up his trumpet again to offer a unique Live DJ & Trumpet experience.",
    ],
    stats: [
      { value: "300+", label: "Live shows" },
      { value: "5+", label: "Countries" },
      { value: "15", label: "Years on stage" },
      { value: "∞", label: "Genre fusions" },
    ],
    portrait: "trompetteScene",
  },

  services: {
    index: "02",
    label: "Services",
    title: "Bespoke, always.",
    intro: "Every performance is unique, every note unexpected.",
    items: [
      {
        id: "weddings",
        title: "Weddings",
        text: "From the ceremony to the last dance: sound, cocktail hour and party, with live trumpet for the moments that matter.",
        tags: ["Ceremony", "Cocktail hour", "Party"],
        photo: "duoSaxTrompette",
      },
      {
        id: "corporate",
        title: "Corporate events",
        text: "Sophisticated live music experiences for brand launches, galas, rooftop parties and prestigious venues.",
        tags: ["Galas", "Launches", "Rooftops"],
        photo: "trompetteGala",
      },
      {
        id: "clubs-festivals",
        title: "Clubs & Festivals",
        text: "High-energy DJ sets laced with live trumpet solos, and a stage presence that holds its own on the biggest stages.",
        tags: ["Clubs", "Festivals", "Main stages"],
        photo: "sceneFestival",
      },
    ],
  },

  gallery: {
    index: "03",
    label: "Gallery",
    title: "In action",
    hint: "Drag the film strip",
    previous: "Previous images",
    next: "Next images",
    frame: "Frame",
  },

  photos: {
    trompetteScene: "ROLLA playing the trumpet on stage under the spotlights",
    djPlatines: "ROLLA at the decks, wearing sunglasses",
    trompetteGala: "ROLLA playing the trumpet in front of an event screen",
    sceneFestival: "Festival main stage lit up in front of the crowd",
    duoSaxTrompette: "ROLLA and saxophonist Elisa holding their instruments",
    djLounge: "ROLLA in a suit at the decks in a lounge",
    trioPleinAir: "Trio dressed in white with trumpet, saxophone and percussion outdoors",
    djMontagne: "ROLLA playing a DJ set high in the mountains",
    trioCour: "Live trio with saxophone, keys and percussion in a courtyard",
    djNeon: "ROLLA at the decks under neon lights",
    portraitApplique: "Portrait of ROLLA leaning against a wall under a lamp",
    djPleinAir: "ROLLA at the decks outdoors, with stage smoke",
  },

  credits: {
    index: "04",
    label: "Credits",
    title: "They trusted me",
    lead: "With the trust of",
  },

  reviews: {
    index: "05",
    label: "Reviews",
    title: "What they say",
    intro: "Verified reviews from newlyweds, published on Mariages.net.",
    originalLanguage: "Reviews are shown in their original language.",
    verified: "Verified review",
    weddingOn: "Wedding on",
    source: "Mariages.net",
  },

  contact: {
    index: "06",
    label: "Contact",
    titleA: "Let’s create",
    titleB: "something.",
    text: "Wedding, corporate party, club or festival: tell me about your date. Available for bookings in France and worldwide.",
    cta: "Book a date",
    emailLabel: "Write to",
    mailSubject: "Booking request — ROLLA",
    follow: "Follow ROLLA",
  },

  footer: {
    end: "The End",
    tagline: "DJ × Trumpet × Live experience",
    rights: "All rights reserved",
    city: "Lyon, France",
    backToTop: "Back to top",
  },

  notFound: {
    kicker: "Error 404",
    title: "End of reel.",
    text: "This page doesn’t exist, or no longer does.",
    cta: "Back to home",
  },
};

export default en;
