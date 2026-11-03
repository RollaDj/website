/**
 * Textes du site — FRANÇAIS (dictionnaire de référence).
 * La version anglaise (en.ts) doit contenir exactement les mêmes clés :
 * une clé oubliée fait échouer la vérification TypeScript.
 */
const fr = {
  meta: {
    home: {
      title: "ROLLA — DJ × Trompette · Performance DJ live, Lyon",
      description:
        "ROLLA, DJ et trompettiste basé à Lyon. Une performance live où la musique électronique rencontre l’improvisation à la trompette : clubs, festivals, événements de marques, hôtels et événements privés, en France et à l’international.",
    },
    weddings: {
      title: "DJ mariage Lyon — DJ & trompette live | ROLLA",
      description:
        "DJ de mariage à Lyon et partout en France : ROLLA accompagne votre cérémonie, votre cocktail et votre soirée, avec la trompette en live. Avis vérifiés sur Mariages.net.",
    },
    legal: {
      title: "Mentions légales & confidentialité | ROLLA",
      description: "Mentions légales, hébergement et politique de confidentialité du site de ROLLA.",
    },
    ogAlt: "ROLLA — DJ × Trompette, expérience live",
  },

  a11y: {
    skipToContent: "Aller au contenu",
    mainNav: "Navigation principale",
    openMenu: "Menu",
    closeMenu: "Fermer",
    languageSwitch: "Read this page in English",
    newTab: "(nouvel onglet)",
    home: "ROLLA — accueil",
  },

  mediaTag: {
    placeholder: "Média provisoire",
    temporary: "Média à remplacer (HD)",
  },

  nav: {
    experience: "Expérience",
    artist: "Artiste",
    formats: "Formats",
    performances: "Performances",
    bookings: "Événements",
    contact: "Contact",
    book: "Réserver",
  },

  hero: {
    kicker: "Lyon — France & international",
    subtitleA: "DJ × Trompette",
    subtitleB: "Expérience live",
    line: "Quand la musique électronique rencontre l’improvisation live.",
    discover: "Découvrir l’expérience",
    book: "Réserver ROLLA",
  },

  experience: {
    label: "L’expérience",
    intro: "Un DJ set. Une trompette. Une seule performance.",
    hint: "Faites défiler",
    loading: "Chargement",
    chapters: [
      {
        word: "Le rythme.",
        text: "Le DJ set pose les fondations : house, groove et lecture du public, construits en temps réel.",
      },
      {
        word: "La trompette.",
        text: "Au-dessus des machines, la trompette improvise. Des phrases jouées en direct, jamais deux fois les mêmes.",
      },
      {
        word: "L’énergie.",
        text: "Entre la cabine et la piste, la frontière s’efface : le live devient une expérience partagée.",
      },
    ],
    description:
      "Séquence visuelle synchronisée au défilement, en trois temps : le rythme, la trompette, l’énergie.",
  },

  artist: {
    label: "L’artiste",
    titleA: "Pas seulement DJ.",
    titleB: "Pas seulement musicien.",
    bio: [
      "Trompettiste de formation, ROLLA découvre la house music en 2006 et passe derrière les platines. Dès 2012, il joue dans les bars et clubs d’Amiens, avant de devenir résident du Carré Rouge en 2013.",
      "Fin 2018, il fonde avec la saxophoniste Elisa un duo DJ/Sax entre électro, jazz et live. Installé à Lyon depuis 2022, il reprend sa trompette en 2025 : ses sets deviennent un dialogue en direct entre les machines et le cuivre.",
    ],
    facts: [
      { value: "300+", label: "Concerts live" },
      { value: "5+", label: "Pays" },
      { value: "2012", label: "Premiers DJ sets" },
    ],
  },

  gallery: {
    label: "En images",
    title: "Chaque scène, une autre énergie.",
    intro: "Sur scène, au milieu des invités ou face aux sommets : quelques moments en live, en photos.",
    hintScroll: "Faites défiler",
    hintSwipe: "Faites glisser",
    scrollerLabel: "Photos de ROLLA en live (défilement horizontal)",
    endTitle: "La prochaine, à votre événement ?",
    endCta: "Réserver ROLLA",
  },

  formats: {
    label: "Formats live",
    title: "Trois formats. Une même énergie.",
    signature: "Format signature",
    cta: "Parler de ce format",
    items: [
      {
        id: "dj-set",
        name: "DJ set",
        text: "Performance DJ, house music et programmation musicale adaptée à l’événement.",
      },
      {
        id: "dj-trumpet",
        name: "DJ × Trompette",
        text: "Le format signature : un DJ set traversé d’interventions live à la trompette.",
      },
      {
        id: "dj-live",
        name: "DJ × Musiciens live",
        text: "DJ, trompette, saxophone et autres collaborations artistiques, selon le projet.",
      },
    ] as { id: "dj-set" | "dj-trumpet" | "dj-live"; name: string; text: string }[],
  },

  performances: {
    label: "Performances",
    title: "Performances choisies.",
    intro: "Extraits de sets et de lives. Ouvrez une vidéo en grand : le son ne s’active que si vous le décidez.",
    play: "Voir la vidéo",
    soundOn: "Activer le son",
    soundOff: "Couper le son",
    close: "Fermer la vidéo",
    upcoming: "Vidéo à venir",
  },

  trusted: {
    label: "Trusted by",
    title: "Ils m’ont fait confiance.",
    text: "Clubs, hôtels, marques et lieux qui ont accueilli ROLLA.",
  },

  bookings: {
    label: "Événements & réservations",
    title: "Une scène, une expérience sur mesure.",
    cta: "Réserver",
    items: [
      {
        id: "club",
        name: "Clubs & Festivals",
        text: "Des sets pensés pour la piste, avec la trompette en live pour faire basculer la nuit.",
      },
      {
        id: "corporate",
        name: "Événements de marques & luxe",
        text: "Lancements, galas, soirées en hôtel ou en rooftop : une présence élégante, calibrée pour votre public.",
      },
      {
        id: "private",
        name: "Événements privés",
        text: "Anniversaires, soirées privées, célébrations : une programmation construite avec vous, du premier verre au dernier titre.",
      },
    ] as { id: "club" | "corporate" | "private"; name: string; text: string }[],
    weddings: {
      label: "Mariages",
      text: "ROLLA accompagne aussi des mariages : cérémonie, cocktail et soirée, avec la trompette en live.",
      link: "Découvrir l’offre mariage",
    },
  },

  contact: {
    label: "Contact",
    title: "Créons une expérience.",
    text: "Club, festival, événement de marque ou célébration privée : décrivez votre projet, sa date, son lieu et l’ambiance que vous imaginez.",
    direct: "Ou écrivez directement à",
    follow: "Suivre ROLLA",
  },

  form: {
    name: "Nom",
    email: "E-mail",
    eventType: "Type d’événement",
    eventTypePlaceholder: "Choisir…",
    eventTypes: {
      club: "Club / Festival",
      corporate: "Événement de marque / Luxe",
      private: "Événement privé",
      wedding: "Mariage",
      other: "Autre",
    },
    date: "Date",
    location: "Lieu",
    locationPlaceholder: "Ville, salle…",
    message: "Message",
    messagePlaceholder: "Votre projet, le nombre d’invités, l’ambiance recherchée…",
    optional: "facultatif",
    submit: "Envoyer la demande",
    sending: "Envoi en cours…",
    privacy: "Vos informations servent uniquement à répondre à votre demande.",
    privacyLink: "Confidentialité",
    errors: {
      name: "Indiquez votre nom.",
      email: "Indiquez une adresse e-mail valide.",
      eventType: "Choisissez un type d’événement.",
      date: "Indiquez une date valide.",
      location: "Le lieu est trop long.",
      message: "Votre message doit contenir au moins 10 caractères.",
      tooLong: "Ce champ est trop long.",
    },
    status: {
      successTitle: "Message envoyé.",
      successText: "Merci, votre demande a bien été transmise. La réponse vous parviendra à l’adresse indiquée.",
      sendAnother: "Envoyer un autre message",
      invalid: "Certains champs sont à corriger.",
      unavailable:
        "Le formulaire n’est pas encore relié à une messagerie : votre message n’a pas été envoyé. Écrivez directement à",
      error: "L’envoi a échoué et votre message n’a pas été transmis. Réessayez ou écrivez directement à",
      rateLimited: "Trop de tentatives en peu de temps. Réessayez dans quelques minutes.",
      spam: "Votre message n’a pas pu être envoyé. Réessayez dans quelques secondes.",
    },
  },

  footer: {
    tagline: "DJ × Trompette — Expérience live",
    basedIn: "Basé à Lyon — France & international",
    rights: "Tous droits réservés",
    legal: "Mentions légales",
    backToTop: "Haut de page",
    navigation: "Navigation",
    contact: "Contact",
    follow: "Réseaux",
  },

  weddings: {
    kicker: "Mariages",
    title: "Votre mariage, en live.",
    intro:
      "De la cérémonie à la dernière danse, ROLLA accompagne votre mariage à Lyon et partout en France : un DJ set construit avec vous, et la trompette en live pour les moments qui comptent.",
    momentsTitle: "Le déroulé",
    moments: [
      {
        name: "Cérémonie",
        text: "Sonorisation de la cérémonie laïque et musiques des moments clés, préparées avec vous en amont.",
      },
      {
        name: "Cocktail",
        text: "Une ambiance live élégante pour accueillir vos invités : trompette, ou duo avec saxophone.",
      },
      {
        name: "Soirée",
        text: "Un DJ set construit autour de vos envies, porté par la trompette en live jusqu’au bout de la nuit.",
      },
    ],
    photosTitle: "Mariages en images",
    formatsTitle: "Les formules",
    formats: [
      { name: "DJ", text: "Programmation sur mesure et DJ set pour la soirée." },
      { name: "DJ × Trompette", text: "Le DJ set et les interventions live à la trompette." },
      { name: "DJ × Saxophone", text: "En duo avec la saxophoniste Elisa, pour un live à deux voix." },
    ],
    reviewsTitle: "Ils l’ont vécu",
    reviewsSource: "Avis vérifiés publiés sur",
    weddingOn: "Mariage du",
    originalLanguage: "",
    ctaTitle: "Parlons de votre date.",
    ctaText: "Indiquez la date et le lieu de votre mariage : ROLLA vous répond avec une proposition adaptée.",
    back: "Retour à l’accueil",
  },

  legal: {
    title: "Mentions légales",
    todo: "À compléter",
    sections: {
      publisher: "Éditeur du site",
      publisherFields: ["Nom ou raison sociale", "Statut et numéro SIRET", "Adresse", "Directeur de la publication"],
      contact: "Contact",
      host: "Hébergement",
      hostText: "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis — vercel.com",
      ip: "Propriété intellectuelle",
      ipText:
        "Les textes, photographies, vidéos et éléments graphiques de ce site sont la propriété de ROLLA ou de leurs auteurs respectifs. Toute reproduction sans autorisation est interdite.",
      privacy: "Données personnelles",
      privacyText: [
        "Les informations envoyées via le formulaire de contact (nom, e-mail, type d’événement, date, lieu, message) servent uniquement à répondre à votre demande. Elles ne sont ni revendues ni utilisées à des fins publicitaires.",
        "Elles sont transmises par e-mail via un prestataire d’envoi et conservées le temps nécessaire au traitement de votre demande.",
        "Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à",
      ],
      cookies: "Cookies",
      cookiesText:
        "Ce site n’utilise aucun cookie publicitaire ni de mesure d’audience. Un seul cookie fonctionnel mémorise la langue choisie (FR / EN).",
    },
  },

  notFound: {
    kicker: "Erreur 404",
    title: "Page introuvable.",
    text: "Cette page n’existe pas, ou plus.",
    cta: "Retour à l’accueil",
  },
};

export default fr;
export type Dictionary = typeof fr;
