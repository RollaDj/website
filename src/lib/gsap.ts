/**
 * GSAP centralisé : plugins enregistrés une seule fois, côté navigateur.
 * Importer gsap / ScrollTrigger / SplitText / useGSAP depuis ce module.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
