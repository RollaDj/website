/**
 * Avis Mariages.net, cités dans leur langue d’origine
 * (non traduits, pour rester fidèles aux auteurs).
 */
export type Review = {
  id: string;
  title: string;
  quote: string;
  author: string;
  /** Date de l’événement, format ISO (AAAA-MM-JJ). */
  date: string;
  lang: "fr" | "en";
};

export const REVIEWS: Review[] = [
  {
    id: "gabriel",
    title: "DJ Rolla a mis le feu",
    quote:
      "Romain (DJ Rolla) a été exceptionnel du début à la fin ! Il s’est occupé du son de notre cérémonie laïque, ce qui nous a enlevé un gros stress le jour J. Il a su capter l’ambiance que nous voulions et faire danser tout le monde jusqu’au bout de la nuit. Une playlist parfaite, une énergie incroyable — nos invités en parlent encore.",
    author: "Gabriel",
    date: "2025-09-13",
    lang: "fr",
  },
  {
    id: "antony-monica",
    title: "Un sans-faute !",
    quote:
      "Romain alias Rolla DJ a su mettre une ambiance de dingue du début à la fin de notre mariage, tous les invités ont adoré sa prestation. Le rapport prix/prestation est plus que correct, on le recommande 1000 fois ! Nous avions opté pour le duo Rolla DJ + Elisa et l’harmonie était parfaite.",
    author: "Antony & Monica",
    date: "2025-09-27",
    lang: "fr",
  },
  {
    id: "ilyana",
    title: "Excellent!",
    quote:
      "We had the pleasure of hiring DJ Rolla for our wedding and it was absolutely the best decision! From the very first song, he brought the energy to a whole new level. His choice of music was perfectly tailored, and DJ Rolla has an incredible feeling for the crowd. Everyone was thrilled — we highly recommend DJ Rolla!",
    author: "Ilyana",
    date: "2024-05-18",
    lang: "en",
  },
  {
    id: "helene",
    title: "Un très grand merci",
    quote:
      "Un immense merci à Romain et Elisa qui ont littéralement mis le feu à notre mariage ! Vous avez su créer une ambiance de folie du début à la fin, et grâce à vous la piste de danse n’a jamais désempli. Votre énergie, votre complicité et votre passion ont fait de cette soirée un moment magique et inoubliable.",
    author: "Hélène",
    date: "2025-09-06",
    lang: "fr",
  },
  {
    id: "jordan",
    title: "Un super DJ",
    quote:
      "Nous recommandons Romain, les yeux fermés ! Il a su être à notre écoute dès le début, comprenant parfaitement nos envies. Toujours disponible pour répondre à nos questions. L’ambiance de notre mariage a été au top, exactement comme nous l’imaginions. Tous nos invités ont passé un moment inoubliable !",
    author: "Jordan",
    date: "2024-06-29",
    lang: "fr",
  },
];
