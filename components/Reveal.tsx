"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Délai avant l'apparition, en ms — utile pour faire apparaître une grille en cascade. */
  delay?: number;
  className?: string;
};

/**
 * Fait apparaître son contenu en fondu avec une légère translation vers le
 * haut, une fois qu'il entre dans la zone visible au scroll. Discret par
 * conception : petit déplacement, transition douce, et désactivé
 * automatiquement si l'utilisateur préfère moins d'animations
 * (prefers-reduced-motion).
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Lecture ponctuelle d'une préférence navigateur au montage : ce
      // n'est pas un abonnement à une source externe qui change, donc pas
      // adapté à useSyncExternalStore (même cas que la lecture de
      // sessionStorage dans la page de confirmation).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={
        "transition-all duration-700 ease-out will-change-transform " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3") +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </div>
  );
}
