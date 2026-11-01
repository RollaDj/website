import type { PhotoId } from "@/lib/media";

/**
 * Dictionnaire de référence (français). Sa forme définit le type
 * `Dictionary` : la version anglaise doit contenir exactement les mêmes clés.
 */
const fr = {
  meta: {
    title: "ROLLA — DJ & Trompette live · Lyon",
    description:
      "ROLLA, DJ et trompettiste basé à Lyon. Une expérience live où la trompette électrise le dancefloor : mariages, événements d’entreprise, clubs et festivals.",
    ogAlt: "ROLLA — DJ & Trompette, expérience live",
  },

  a11y: {
    skipToContent: "Aller au contenu",
    mainNav: "Navigation principale",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    languageSwitch: "Read this site in English",
    newTab: "(nouvel onglet)",
  },

  nav: {
    film: "Le film",
    artist: "L’artiste",
    services: "Prestations",
    gallery: "Galerie",
    reviews: "Avis",
    contact: "Contact",
    book: "Réserver",
  },

  hero: {
    kicker: "DJ × Trompette — Expérience live",
    taglineA: "Pas seulement DJ.",
    taglineB: "Pas seulement musicien.",
    lede: "Quand la trompette électrise le dancefloor : une performance unique où l’improvisation redéfinit le set électronique.",
    ctaPrimary: "Réserver une date",
    ctaSecondary: "Lancer le film",
    location: "Basé à Lyon",
    availability: "France & international",
    scroll: "Défilez",
    imageAlt: "ROLLA jouant de la trompette, en manteau de fourrure ivoire",
  },

  film: {
    label: "Le film",
    hint: "Faites défiler pour lancer la projection",
    scene: "Scène",
    description:
      "Extraits de performances de ROLLA, en noir et blanc : un DJ set en club, la trompette lors d’une soirée de prestige, puis sur une scène en plein air. La vidéo avance au rythme du défilement.",
    chapters: [
      {
        numeral: "I",
        title: "Le DJ",
        text: "Des clubs d’Amiens aux soirées lyonnaises : quinze ans à lire les foules et à construire des sets house taillés pour chaque piste.",
      },
      {
        numeral: "II",
        title: "La Trompette",
        text: "Trompettiste de formation, ROLLA reprend son instrument en 2025. Les cuivres s’invitent sur le dancefloor, improvisés en direct.",
      },
      {
        numeral: "III",
        title: "L’Expérience Live",
        text: "Ni tout à fait un DJ set, ni tout à fait un concert : une performance hybride, électronique et organique, qui ne se joue jamais deux fois.",
      },
    ],
  },

  artist: {
    index: "01",
    label: "L’artiste",
    titleA: "Un trompettiste devenu DJ.",
    titleB: "Un DJ redevenu trompettiste.",
    paragraphs: [
      "Passionné de musique depuis toujours, ROLLA débute par une formation de trompettiste avant de découvrir la house music en 2006. Il se consacre alors pleinement au DJing et enchaîne ses premiers sets dans les bars et clubs d’Amiens dès 2012.",
      "Résident du Carré Rouge en 2013, il collabore avec les meilleurs DJs de la région. Fin 2018, il crée avec la saxophoniste Elisa un duo DJ/Sax mêlant électro, jazz et live music. Installé à Lyon depuis 2022, il se produit lors d’événements privés et de soirées d’entreprise partout en France. En 2025, il reprend sa trompette pour proposer une expérience Live DJ & Trompette unique.",
    ],
    stats: [
      { value: "300+", label: "Concerts live" },
      { value: "5+", label: "Pays" },
      { value: "15", label: "Années de scène" },
      { value: "∞", label: "Fusions de genres" },
    ],
    portrait: "trompetteScene" as PhotoId,
  },

  services: {
    index: "02",
    label: "Prestations",
    title: "Sur mesure, toujours.",
    intro: "Chaque performance est unique, chaque note inattendue.",
    items: [
      {
        id: "mariages",
        title: "Mariages",
        text: "De la cérémonie à la dernière danse : sonorisation, cocktail et soirée, avec la trompette en live pour les moments qui comptent.",
        tags: ["Cérémonie", "Cocktail", "Soirée"],
        photo: "duoSaxTrompette" as PhotoId,
      },
      {
        id: "entreprises",
        title: "Événements d’entreprise",
        text: "Des expériences musicales live sophistiquées pour les lancements de marque, galas, soirées rooftop et lieux de prestige.",
        tags: ["Galas", "Lancements", "Rooftops"],
        photo: "trompetteGala" as PhotoId,
      },
      {
        id: "clubs-festivals",
        title: "Clubs & Festivals",
        text: "Des sets DJ haute énergie traversés de solos de trompette live, et une présence scénique qui s’impose sur les grandes scènes.",
        tags: ["Clubs", "Festivals", "Grandes scènes"],
        photo: "sceneFestival" as PhotoId,
      },
    ],
  },

  gallery: {
    index: "03",
    label: "Galerie",
    title: "En action",
    hint: "Faites glisser la pellicule",
    previous: "Images précédentes",
    next: "Images suivantes",
    frame: "Image",
  },

  photos: {
    trompetteScene: "ROLLA à la trompette sur scène, sous les projecteurs",
    djPlatines: "ROLLA aux platines, lunettes de soleil",
    trompetteGala: "ROLLA à la trompette devant un écran de soirée",
    sceneFestival: "Grande scène de festival illuminée devant le public",
    duoSaxTrompette: "ROLLA et la saxophoniste Elisa, instruments en main",
    djLounge: "ROLLA en costume aux platines dans un lounge",
    trioPleinAir: "Trio en blanc avec trompette, saxophone et percussions en plein air",
    djMontagne: "ROLLA en DJ set en haute montagne",
    trioCour: "Trio live avec saxophone, claviers et percussions dans une cour",
    djNeon: "ROLLA aux platines sous des néons",
    portraitApplique: "Portrait de ROLLA adossé à un mur, sous une applique",
    djPleinAir: "ROLLA aux platines en plein air, fumée de scène",
  } satisfies Record<PhotoId, string>,

  credits: {
    index: "04",
    label: "Générique",
    title: "Ils m’ont fait confiance",
    lead: "Avec la confiance de",
  },

  reviews: {
    index: "05",
    label: "Avis",
    title: "Ce qu’ils en disent",
    intro: "Avis vérifiés de jeunes mariés, publiés sur Mariages.net.",
    originalLanguage: "",
    verified: "Avis vérifié",
    weddingOn: "Mariage du",
    source: "Mariages.net",
  },

  contact: {
    index: "06",
    label: "Contact",
    titleA: "Créons quelque chose",
    titleB: "ensemble.",
    text: "Mariage, soirée d’entreprise, club ou festival : parlez-moi de votre date. Disponible pour des réservations en France et à l’international.",
    cta: "Réserver une date",
    emailLabel: "Écrire à",
    mailSubject: "Demande de réservation — ROLLA",
    follow: "Suivre ROLLA",
  },

  footer: {
    end: "Fin",
    tagline: "DJ × Trompette × Expérience live",
    rights: "Tous droits réservés",
    city: "Lyon, France",
    backToTop: "Revenir en haut",
  },

  notFound: {
    kicker: "Erreur 404",
    title: "Fin de bobine.",
    text: "Cette page n’existe pas, ou plus.",
    cta: "Retour à l’accueil",
  },
};

export default fr;
export type Dictionary = typeof fr;
