import type { Dictionary } from "./fr";

/** Site copy — ENGLISH. Same keys as fr.ts (checked by TypeScript). */
const en: Dictionary = {
  meta: {
    home: {
      title: "ROLLA — DJ × Trumpet · Live DJ performance, Lyon, France",
      description:
        "ROLLA is a DJ and trumpet player based in Lyon, France. A live performance where electronic music meets trumpet improvisation: clubs, festivals, brand events, hotels and private events, in France and worldwide.",
    },
    weddings: {
      title: "Wedding DJ in Lyon & France — DJ with live trumpet | ROLLA",
      description:
        "Wedding DJ in Lyon and across France: ROLLA accompanies your ceremony, cocktail hour and party, with live trumpet. Verified reviews on Mariages.net.",
    },
    legal: {
      title: "Legal notice & privacy | ROLLA",
      description: "Legal notice, hosting information and privacy policy of the ROLLA website.",
    },
    ogAlt: "ROLLA — DJ × Trumpet, live experience",
  },

  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main navigation",
    openMenu: "Menu",
    closeMenu: "Close",
    languageSwitch: "Lire cette page en français",
    newTab: "(opens in a new tab)",
    home: "ROLLA — home",
  },

  mediaTag: {
    placeholder: "Placeholder media",
    temporary: "Media to replace (HD)",
  },

  nav: {
    experience: "Experience",
    artist: "Artist",
    formats: "Formats",
    performances: "Performances",
    bookings: "Events",
    contact: "Contact",
    book: "Book",
  },

  hero: {
    kicker: "Lyon — France & worldwide",
    subtitleA: "DJ × Trumpet",
    subtitleB: "Live experience",
    line: "Where electronic music meets live improvisation.",
    discover: "Discover the experience",
    book: "Book ROLLA",
  },

  experience: {
    label: "The experience",
    intro: "One DJ set. One trumpet. One performance.",
    hint: "Keep scrolling",
    loading: "Loading",
    chapters: [
      {
        word: "The rhythm.",
        text: "The DJ set lays the foundation: house, groove and a constant reading of the crowd, built in real time.",
      },
      {
        word: "The trumpet.",
        text: "Above the machines, the trumpet improvises. Lines played live, never the same way twice.",
      },
      {
        word: "The energy.",
        text: "Between the booth and the dancefloor, the line disappears: the live set becomes a shared experience.",
      },
    ],
    description: "Scroll-driven visual sequence in three parts: the rhythm, the trumpet, the energy.",
  },

  artist: {
    label: "The artist",
    titleA: "Not just a DJ.",
    titleB: "Not just a musician.",
    bio: [
      "A trumpeter by training, ROLLA discovered house music in 2006 and stepped behind the decks. From 2012 he played the bars and clubs of Amiens, before becoming a resident at Carré Rouge in 2013.",
      "In late 2018 he formed a DJ/Sax duo with saxophonist Elisa, between electro, jazz and live music. Based in Lyon since 2022, he picked his trumpet back up in 2025: his sets became a live dialogue between machines and brass.",
    ],
    facts: [
      { value: "300+", label: "Live shows" },
      { value: "5+", label: "Countries" },
      { value: "2012", label: "First DJ sets" },
    ],
  },

  gallery: {
    label: "In pictures",
    title: "Every stage, a different energy.",
    intro: "On stage, among the guests or facing the peaks: a few live moments, in pictures.",
    hintScroll: "Keep scrolling",
    hintSwipe: "Swipe",
    scrollerLabel: "Photos of ROLLA live (horizontal scroll)",
    endTitle: "The next one, at your event?",
    endCta: "Book ROLLA",
  },

  formats: {
    label: "Live formats",
    title: "Three formats. One energy.",
    signature: "Signature format",
    cta: "Ask about this format",
    items: [
      {
        id: "dj-set",
        name: "DJ set",
        text: "DJ performance, house music and a musical programme tailored to the event.",
      },
      {
        id: "dj-trumpet",
        name: "DJ × Trumpet",
        text: "The signature format: a DJ set woven with live trumpet improvisations.",
      },
      {
        id: "dj-live",
        name: "DJ × Live musicians",
        text: "DJ, trumpet, saxophone and other artistic collaborations, depending on the project.",
      },
    ],
  },

  performances: {
    label: "Performances",
    title: "Selected performances.",
    intro: "Excerpts from sets and live shows. Open a video full screen: sound only plays if you choose to turn it on.",
    play: "Watch video",
    soundOn: "Turn sound on",
    soundOff: "Mute",
    close: "Close video",
    upcoming: "Video coming soon",
  },

  trusted: {
    label: "Trusted by",
    title: "Trusted by.",
    text: "Clubs, hotels, brands and venues that have hosted ROLLA.",
  },

  bookings: {
    label: "Events & bookings",
    title: "Every stage, a tailored experience.",
    cta: "Book",
    items: [
      {
        id: "club",
        name: "Clubs & Festivals",
        text: "Sets built for the dancefloor, with live trumpet to tip the night over.",
      },
      {
        id: "corporate",
        name: "Corporate & Luxury Events",
        text: "Launches, galas, hotel and rooftop evenings: an elegant presence, tuned to your audience.",
      },
      {
        id: "private",
        name: "Private Events",
        text: "Birthdays, private parties, celebrations: a musical programme built with you, from the first drink to the last track.",
      },
    ],
    weddings: {
      label: "Weddings",
      text: "ROLLA also plays a selection of weddings: ceremony, cocktail hour and party, with live trumpet.",
      link: "Discover the wedding offer",
    },
  },

  contact: {
    label: "Contact",
    title: "Let’s create an experience.",
    text: "Club, festival, brand event or private celebration: tell us about your project, its date, its venue and the atmosphere you have in mind.",
    direct: "Or write directly to",
    follow: "Follow ROLLA",
  },

  form: {
    name: "Name",
    email: "Email",
    eventType: "Event type",
    eventTypePlaceholder: "Choose…",
    eventTypes: {
      club: "Club / Festival",
      corporate: "Brand / Luxury event",
      private: "Private event",
      wedding: "Wedding",
      other: "Other",
    },
    date: "Date",
    location: "Venue",
    locationPlaceholder: "City, venue…",
    message: "Message",
    messagePlaceholder: "Your project, number of guests, the atmosphere you are looking for…",
    optional: "optional",
    submit: "Send request",
    sending: "Sending…",
    privacy: "Your details are only used to answer your request.",
    privacyLink: "Privacy",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      eventType: "Please choose an event type.",
      date: "Please enter a valid date.",
      location: "The venue is too long.",
      message: "Your message must be at least 10 characters long.",
      tooLong: "This field is too long.",
    },
    status: {
      successTitle: "Message sent.",
      successText: "Thank you, your request has been delivered. You will receive a reply at the address you provided.",
      sendAnother: "Send another message",
      invalid: "Some fields need your attention.",
      unavailable:
        "The form is not connected to a mail service yet: your message was not sent. Please write directly to",
      error: "Sending failed and your message was not delivered. Please try again or write directly to",
      rateLimited: "Too many attempts in a short time. Please try again in a few minutes.",
      spam: "Your message could not be sent. Please try again in a few seconds.",
    },
  },

  footer: {
    tagline: "DJ × Trumpet — Live experience",
    basedIn: "Based in Lyon — France & worldwide",
    rights: "All rights reserved",
    legal: "Legal notice",
    backToTop: "Back to top",
    navigation: "Navigation",
    contact: "Contact",
    follow: "Social",
  },

  weddings: {
    kicker: "Weddings",
    title: "Your wedding, live.",
    intro:
      "From the ceremony to the last dance, ROLLA accompanies your wedding in Lyon and across France: a DJ set built with you, and live trumpet for the moments that matter.",
    momentsTitle: "The day",
    moments: [
      {
        name: "Ceremony",
        text: "Sound for your secular ceremony and music for the key moments, prepared together beforehand.",
      },
      {
        name: "Cocktail hour",
        text: "An elegant live atmosphere to welcome your guests: trumpet, or a duo with saxophone.",
      },
      {
        name: "Party",
        text: "A DJ set built around your wishes, lifted by live trumpet until the end of the night.",
      },
    ],
    photosTitle: "Weddings in pictures",
    formatsTitle: "Formats",
    formats: [
      { name: "DJ", text: "Tailored programming and a DJ set for the party." },
      { name: "DJ × Trumpet", text: "The DJ set with live trumpet improvisations." },
      { name: "DJ × Saxophone", text: "As a duo with saxophonist Elisa, for a two-voice live set." },
    ],
    reviewsTitle: "In their words",
    reviewsSource: "Verified reviews published on",
    weddingOn: "Wedding on",
    originalLanguage: "Reviews are shown in their original language.",
    ctaTitle: "Let’s talk about your date.",
    ctaText: "Tell us the date and venue of your wedding: ROLLA will reply with a tailored proposal.",
    back: "Back to home",
  },

  legal: {
    title: "Legal notice",
    todo: "To be completed",
    sections: {
      publisher: "Publisher",
      publisherFields: ["Name or company name", "Legal status and SIRET number", "Address", "Publication director"],
      contact: "Contact",
      host: "Hosting",
      hostText: "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States — vercel.com",
      ip: "Intellectual property",
      ipText:
        "The texts, photographs, videos and graphic elements of this website belong to ROLLA or their respective authors. Any reproduction without permission is prohibited.",
      privacy: "Personal data",
      privacyText: [
        "Information sent through the contact form (name, email, event type, date, venue, message) is only used to answer your request. It is never sold or used for advertising.",
        "It is delivered by email through a mail delivery provider and kept only as long as needed to handle your request.",
        "Under the GDPR, you can request access to, correction or deletion of your data by writing to",
      ],
      cookies: "Cookies",
      cookiesText:
        "This website uses no advertising or analytics cookies. A single functional cookie remembers your language choice (FR / EN).",
    },
  },

  notFound: {
    kicker: "Error 404",
    title: "Page not found.",
    text: "This page doesn’t exist, or no longer does.",
    cta: "Back to home",
  },
};

export default en;
