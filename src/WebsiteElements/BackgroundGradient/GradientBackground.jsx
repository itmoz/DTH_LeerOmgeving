import React, { useEffect } from "react";

export default function GradientBackground({ children }) {
  // useEffect helpt ons om buiten onze component te communiceren (met de body van de pagina)
  useEffect(() => {
    // 1. Zodra de pagina laadt, zetten we de gradiënt op de <body> van de website
    document.body.style.background =
      "linear-gradient(135deg, var(--bs-primary), #ffffff 100%)";
    document.body.style.margin = "0"; // Zeker weten dat er nergens een witrandje is
    document.body.style.minHeight = "100vh"; // Zorg dat de body altijd het hele scherm vult

    // 2. De 'return' hieronder is de schoonmaakploeg.
    // Als je naar een andere pagina gaat, halen we de gradiënt weer weg
    // zodat niet opeens je hele website blauw is!
    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.minHeight = "";
    };
  }, []); // De lege haakjes [] betekenen: doe dit alleen één keer bij het laden.

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        // We hebben hier nu veel minder styling nodig, omdat de body de kleur al heeft!
        width: "100%",
        padding: "2rem",
        // Optioneel: als je kaart niet mooi in het midden staat,
        // kun je hier nog een minHeight toevoegen, bijvoorbeeld:
        // minHeight: "calc(100vh - 100px)" // (100px is ongeveer de hoogte van je navbar)
      }}
    >
      {/* Hier wordt jouw les-content (de witte kaart) ingeladen */}
      {children}
    </div>
  );
}
