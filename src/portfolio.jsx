import React from "react";
import { createRoot } from "react-dom/client";
import { Footer, Header, Portfolio, useScrollReveal } from "./App.jsx";
import "./styles.css";

function PortfolioPage() {
  useScrollReveal();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header portfolioPage />
      <main id="main-content">
        <section className="portfolio-page-intro section-wrap" aria-labelledby="portfolio-page-title">
          <p className="eyebrow"><span className="eyebrow__line" /> Portfolio · Engagements</p>
          <h1 id="portfolio-page-title">Engagements,<br /><em>remembered.</em></h1>
          <p>Explore the celebrations, the people and the moments that make every story your own.</p>
        </section>
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<PortfolioPage />);
