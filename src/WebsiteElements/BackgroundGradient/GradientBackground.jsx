import React from "react";

// De "children" parameter is erg belangrijk hier. Dit zorgt ervoor dat 
// alles wat we TUSSEN <GradientBackground> en </GradientBackground> zetten,
// in deze div wordt weergegeven.
export default function GradientBackground({ children }) {
  return (
    <div
      // Bootstrap classes: 
      // d-flex = maakt het een flexbox container
      // justify-content-center = centreert de inhoud horizontaal
      // align-items-center = centreert de inhoud verticaal
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh", // Zorgt ervoor dat het minstens 100% van de schermhoogte pakt
        width: "100%",      // Pakt 100% van de breedte
        background: "linear-gradient(135deg, var(--bs-primary), #ffffff 100%)",
        padding: "2rem",    // Geeft een beetje ruimte aan de zijkanten op kleine schermen
      }}
    >
      {/* Hier wordt jouw les-content (de witte kaart) ingeladen */}
      {children}
    </div>
  );
}