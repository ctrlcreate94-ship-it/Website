import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Footer, Header, useScrollReveal } from "./App.jsx";
import "./styles.css";

const BASE_URL = import.meta.env.BASE_URL;
const packages = [
  {
    image: `${BASE_URL}images/Packages/Package1-photos.jpeg`,
    alt: "Event photography collage with portraits, mehndi and a celebration.",
    category: "Photography + videography",
    title: "Event Bundle",
    coverage: "Up to 4 hours",
    description: "A highlight-filled package for birthdays, celebrations and special events.",
    features: [
      "Unlimited photos with edited photographs",
      "Edited 4K video and a highlights video",
      "Online gallery and all photos on USB",
      "Lighting supplied",
      "Three-week turnaround",
    ],
  },
  {
    image: `${BASE_URL}images/Packages/Package4-photos.jpeg`,
    alt: "Wedding celebration collage with a couple, ceremony and family moments.",
    category: "Photography + videography",
    title: "Wedding Package",
    coverage: "Wedding coverage",
    description: "A fuller wedding story, including time for portraits and the celebrations around the day.",
    features: [
      "Unlimited photos covering the entire function",
      "Edited photographs, edited 4K video and a highlights video",
      "Guest and family portraits",
      "One-hour dedicated couple shoot",
      "Pre- and post-wedding functions (up to two)",
      "Online gallery, USB delivery and lighting supplied",
      "Four-week turnaround",
    ],
  },
  {
    image: `${BASE_URL}images/Packages/Package3-photos.jpeg`,
    alt: "Engagement photography collage with a couple celebrating together.",
    category: "Photography + videography",
    title: "Hourly Coverage",
    coverage: "Hourly coverage",
    description: "Flexible coverage when you need photography and video for a shorter part of your event.",
    features: [
      "Unlimited photos with edited photographs",
      "Edited 4K video and a highlights video",
      "Online gallery and all photos on USB",
      "Lighting supplied",
      "Three-week turnaround",
    ],
  },
  {
    image: `${BASE_URL}images/Packages/Package2.jpeg`,
    alt: "Parivaar Events flyer describing photography, event design and catering.",
    category: "Events + custom services",
    title: "Parivaar Events",
    coverage: "Tailored to your event",
    description: "Photography and videography, event design and catering for weddings, functions and more.",
    features: [
      "Unlimited photos, 4K videography and edited highlights",
      "Printed or digital invitations and welcome boards",
      "Gifting, trays, albums, photobooks, canvas and custom printing",
      "Bulk catering for weddings, functions and corporate events",
      "Dietary requirements catered for",
      "Custom packages available",
    ],
  },
  {
    image: `${BASE_URL}images/Packages/trousseaus-photos.jpeg`,
    alt: "Trousseau presentation collage with wedding boxes, gifts and accessories.",
    category: "Wedding details",
    title: "Trousseau Presentations",
    coverage: "Basic and premium presentation",
    description: "Thoughtfully arranged wedding items in trays or boxes, styled to suit your colours and preferences.",
    features: [
      "Basic presentation for small to medium arrangements",
      "Premium presentation for medium to large arrangements",
      "Choose minimal or high-end decor and customise the colours",
      "Premium designs can include arches, bangle holders and tiered acrylic boxes",
      "Allow at least two to three weeks for planning and preparation",
    ],
  },
];

function PackageCard({ item, index }) {
  const [contactOptionsOpen, setContactOptionsOpen] = useState(false);
  const message = encodeURIComponent(
    `Hi Parivaar Photography, I'm interested in the ${item.title} package. Could you please send me more information?`,
  );
  const emailSubject = encodeURIComponent(`Information about the ${item.title} package`);
  const emailBody = encodeURIComponent(
    `Hi Parivaar Photography,\n\nI'm interested in the ${item.title} package. Could you please send me more information?\n\nThank you.`,
  );

  return (
    <article className={`package-card${index % 2 ? " package-card--reverse" : ""}`}>
      <div className="package-card__art">
        <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
      </div>
      <div className="package-card__details">
        <p className="eyebrow"><span className="eyebrow__line" /> 0{index + 1} · {item.category}</p>
        <h2>{item.title}</h2>
        <p className="package-card__coverage">{item.coverage}</p>
        <p className="package-card__description">{item.description}</p>
        <ul>
          {item.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <button
          className="button button--outline package-card__ask"
          type="button"
          aria-expanded={contactOptionsOpen}
          aria-controls={`package-contact-${index + 1}`}
          onClick={() => setContactOptionsOpen((open) => !open)}
        >
          Ask about {item.title}
        </button>
        {contactOptionsOpen && (
          <div className="package-card__contact-options" id={`package-contact-${index + 1}`}>
            <p>
              Your message will ask about the <strong>{item.title}</strong> package.
              Choose WhatsApp or email to send your enquiry.
            </p>
            <div>
              <a href={`https://wa.me/27814868063?text=${message}`} target="_blank" rel="noreferrer">
                Send via WhatsApp
              </a>
              <a href={`mailto:photography@parivaar.co.za?subject=${emailSubject}&body=${emailBody}`}>
                Send via email
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function PackagesPage() {
  useScrollReveal();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header packagesPage />
      <main id="main-content">
        <section className="packages-page-intro section-wrap" id="packages" aria-labelledby="packages-title">
          <p className="eyebrow"><span className="eyebrow__line" /> Packages &amp; services</p>
          <h1 id="packages-title">Made for your<br /><em>kind of celebration.</em></h1>
          <p>Explore our photography, videography, event design, catering and trousseau options. Get in touch to check availability or tailor a package to your plans.</p>
        </section>
        <section className="packages-list section-wrap" aria-label="Packages and services">
          {packages.map((item, index) => <PackageCard item={item} index={index} key={item.title} />)}
        </section>
        <section className="packages-contact section-space" aria-labelledby="packages-contact-title">
          <div className="section-wrap">
            <p className="eyebrow"><span className="eyebrow__line" /> Let’s plan together</p>
            <h2 id="packages-contact-title">Have something different<br /><em>in mind?</em></h2>
            <p>Contact us about custom coverage, dates and package details.</p>
            <a className="button" href={`${BASE_URL}#contact`}>Make an enquiry</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<PackagesPage />);
