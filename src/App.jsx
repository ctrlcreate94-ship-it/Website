import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.BASE_URL;
const INSTAGRAM_URL = "https://www.instagram.com/parivaarphotography/";
const FACEBOOK_URL = "https://www.facebook.com/ParivaarPhotography";
const ENGAGEMENT_GALLERY_URL = "https://parivaarphotography01.pixieset.com/yashlynengagement/";
const PHONE_NUMBER = "081 486 8063";
const PHONE_LINK = "tel:+27814868063";
const WHATSAPP_LINK = "https://wa.me/27814868063";
const EMAIL_ADDRESS = "photography@parivaar.co.za";
const EMAIL_LINK = `mailto:${EMAIL_ADDRESS}`;

const portfolioProjects = [
  {
    id: "yashlyn-danielle-engagement",
    title: "Yashlyn & Danielle’s engagement",
    category: "Engagement",
    date: "May 12, 2025",
    description: "A collection of moments from a day worth remembering.",
    galleryUrl: ENGAGEMENT_GALLERY_URL,
    images: [
      {
        id: "park",
        label: "A moment in the park",
        alt: "Yashlyn and Danielle embracing beneath the trees in a park.",
        image: `${BASE_URL}images/portfolio/engagement-01.jpg`,
      },
      {
        id: "together",
        label: "Love in full bloom",
        alt: "Yashlyn and Danielle sharing a close moment over a bouquet of red roses.",
        image: `${BASE_URL}images/portfolio/engagement-02.jpg`,
      },
      {
        id: "walk",
        label: "A quiet walk together",
        alt: "Yashlyn and Danielle holding hands in a park.",
        image: `${BASE_URL}images/portfolio/engagement-03.jpg`,
      },
      {
        id: "close",
        label: "Close to you",
        alt: "Yashlyn and Danielle smiling together.",
        image: `${BASE_URL}images/portfolio/engagement-04.jpg`,
      },
      {
        id: "before",
        label: "Before the big question",
        alt: "Yashlyn holding a red rose outside at golden hour.",
        image: `${BASE_URL}images/portfolio/engagement-05.jpg`,
      },
      {
        id: "question",
        label: "The big question",
        alt: "One partner kneels to propose beneath an illuminated Marry Me sign.",
        image: `${BASE_URL}images/portfolio/engagement-06.jpg`,
      },
      {
        id: "together-always",
        label: "The moment, together",
        alt: "The couple sitting together on a red carpet beneath a Marry Me sign.",
        image: `${BASE_URL}images/portfolio/engagement-07.jpg`,
      },
      {
        id: "yes",
        label: "A joyful yes",
        alt: "A joyful reaction as one partner kneels with a red rose.",
        image: `${BASE_URL}images/portfolio/engagement-08.jpg`,
      },
      {
        id: "ring",
        label: "A promise to keep",
        alt: "One partner shows the engagement ring while embracing the other.",
        image: `${BASE_URL}images/portfolio/engagement-09.jpg`,
      },
    ],
  },
];

const services = [
  {
    number: "01",
    title: "Event photography",
    description:
      "Thoughtful images of the people, atmosphere and details that make your event yours.",
    audience: "For people planning a celebration or gathering.",
    planning: "Discuss timing, coverage and final deliverables before booking.",
  },
  {
    number: "02",
    title: "Event videography",
    description:
      "Moving images to help you revisit the feeling and story of your event.",
    audience: "For people who want to remember more than a still frame can hold.",
    planning: "Talk through the moments you want captured and the finished film.",
  },
];

function ArrowIcon({ diagonal = false }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon--diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? " brand--footer" : ""}`} href={BASE_URL} aria-label="Parivaar Photography, home">
      <img className="brand__logo" src={`${BASE_URL}images/ParivaarLogo-transparent.png`} alt="" fetchpriority="high" />
    </a>
  );
}

function SplashScreen() {
  return (
    <div className="splash-screen" role="status" aria-label="Loading Parivaar Photography">
      <div className="splash-screen__mark">
        <span className="splash-screen__ring" aria-hidden="true" />
        <img className="splash-screen__logo" src={`${BASE_URL}images/ParivaarLogo-transparent.png`} alt="" />
      </div>
    </div>
  );
}

function Header({ portfolioPage = false, packagesPage = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" id="site-top">
      <div className="header-inner">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className={`menu-toggle__icon${menuOpen ? " is-open" : ""}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        <nav
          className={`main-nav${menuOpen ? " main-nav--open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <a href={portfolioPage || packagesPage ? `${BASE_URL}#home` : "#home"} onClick={closeMenu}>Home</a>
          <a href={portfolioPage ? "#portfolio" : `${BASE_URL}portfolio.html`} onClick={closeMenu}>Portfolio</a>
          <a href={packagesPage ? "#packages" : `${BASE_URL}packages.html`} onClick={closeMenu}>Packages</a>
          <a href={portfolioPage || packagesPage ? `${BASE_URL}#about` : "#about"} onClick={closeMenu}>About</a>
          <a href={portfolioPage || packagesPage ? `${BASE_URL}#services` : "#services"} onClick={closeMenu}>Services</a>
          <a href={portfolioPage || packagesPage ? `${BASE_URL}#contact` : "#contact"} onClick={closeMenu}>Contact</a>
        </nav>
        <a className="button button--small header-cta" href={portfolioPage || packagesPage ? `${BASE_URL}#contact` : "#contact"}>
          Enquire now <ArrowIcon diagonal />
        </a>
      </div>
    </header>
  );
}

function PhotoPlaceholder({ item, hero = false }) {
  return (
    <div
      className={`photo-placeholder photo-placeholder--${item.tone} photo-placeholder--${item.shape}${hero ? " photo-placeholder--hero" : ""}`}
      role={item.image ? undefined : "img"}
      aria-label={item.image ? undefined : `Portfolio image placeholder: ${item.label}`}
    >
      <span className="photo-placeholder__sun" aria-hidden="true" />
      <span className="photo-placeholder__landscape" aria-hidden="true" />
      <span className="photo-placeholder__caption">
        <span className="photo-placeholder__caption-title">{item.label}</span>
        <span className="photo-placeholder__caption-note">Approved photo goes here</span>
      </span>
    </div>
  );
}

function PortfolioCard({ item, index, project }) {
  return (
    <figure className={`portfolio-card portfolio-card--${index + 1}`}>
      <a
        className="portfolio-card__link"
        href={item.galleryUrl || ENGAGEMENT_GALLERY_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={item.galleryUrl ? `View ${item.label}` : `View the full ${project.title} gallery: ${item.label}`}
      >
        <img
          className="portfolio-card__image"
          src={item.image}
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption className="portfolio-card__caption">
        <span>{item.label}</span>
        <span className="portfolio-card__index">0{index + 1}</span>
      </figcaption>
    </figure>
  );
}

function Hero() {
  const heroImage = `${BASE_URL}images/hero-indian-wedding-pexels-18361996.jpg`;
  const heroItem = {
    label: "Newlyweds in traditional Indian attire",
    alt: "Newlyweds in traditional Indian attire beneath a decorated pavilion at night.",
    image: heroImage,
    tone: "olive",
    shape: "arch",
  };

  return (
    <section className="hero section-wrap" id="home" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow"><span className="eyebrow__line" />Family celebrations</p>
        <h1 id="hero-title">Every celebration,<br /><em>a living heirloom.</em></h1>
        <p className="hero__intro">
          From the first ceremony to the final dance, we preserve the colour, warmth and togetherness of your story.
        </p>
        <a className="button" href="#contact">
          Plan your celebration <ArrowIcon />
        </a>
        <span className="hero__note">Rooted in tradition. Yours in every frame.</span>
      </div>
      <div className="hero__visual">
        {heroItem.image ? (
          <img
            className="hero__image"
            src={heroItem.image}
            alt={heroItem.alt}
            fetchpriority="high"
            decoding="async"
          />
        ) : (
          <PhotoPlaceholder item={heroItem} hero />
        )}
        <div className="hero__stamp" aria-hidden="true">
          <span>Stories</span>
          <span>in every</span>
          <span>frame</span>
        </div>
        <span className="hero__visual-index" aria-hidden="true">01 / 09</span>
      </div>
      <a className="hero__scroll" href="#portfolio">
        <span>Scroll to explore</span><span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}

function Portfolio({ compact = false }) {
  const [publishedImages, setPublishedImages] = useState([]);

  useEffect(() => {
    let active = true;

    fetch("/api/portfolio")
      .then((response) => (response.ok ? response.json() : []))
      .then((images) => {
        if (active && Array.isArray(images)) setPublishedImages(images);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const projects = portfolioProjects.map((project) => ({
    ...project,
    images: [...publishedImages, ...project.images],
  }));

  return (
    <>
      {(compact ? projects.slice(0, 1) : projects).map((project, projectIndex) => {
        const items = compact ? project.images.slice(0, 3) : project.images;

        return (
          <section
            className="portfolio section-wrap section-space"
            id={projectIndex === 0 ? "portfolio" : undefined}
            aria-labelledby={`${project.id}-title`}
            key={project.id}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow"><span className="eyebrow__line" /> Previous work · {project.category}</p>
                <h2 id={`${project.id}-title`}>{project.title}</h2>
              </div>
              <p className="section-heading__aside">
                {project.description}
                <span>{project.date}</span>
              </p>
            </div>
            <div className="portfolio-grid">
              {items.map((item, index) => (
                <PortfolioCard item={item} index={index} key={item.id} project={project} />
              ))}
            </div>
            <div className="portfolio__bottom">
              <span>01 — {String(items.length).padStart(2, "0")}</span>
              <a
                className="text-link"
                href={compact ? `${BASE_URL}portfolio.html` : project.galleryUrl}
                target={compact ? undefined : "_blank"}
                rel={compact ? undefined : "noreferrer"}
              >
                {compact ? "Explore the full portfolio" : `View the full ${project.category.toLowerCase()} gallery`}
                <ArrowIcon diagonal />
              </a>
            </div>
          </section>
        );
      })}
    </>
  );
}

function About() {
  return (
    <section className="about section-space" id="about" aria-labelledby="about-title">
      <div className="about__inner section-wrap">
        <div className="about__eyebrow">
          <p className="eyebrow"><span className="eyebrow__line" /> A little about us</p>
        </div>
        <div className="about__portrait">
          <img src={`${BASE_URL}images/portfolio/engagement-02.jpg`} alt="A couple sharing a close moment in the garden" loading="lazy" />
        </div>
        <div className="about__body">
          <h2 id="about-title">Celebrations with<br />soul, captured with <em>care.</em></h2>
          <p>
            Parivaar Photography tells South African celebrations with an eye for
            Indian colour, intergenerational connection and the beautiful in-between moments.
          </p>
          <p className="about__placeholder">
            We photograph the quiet aarti, a burst of laughter, the embrace after the vows
            and every detail you put your heart into.
          </p>
          <a className="text-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            Get to know our work <ArrowIcon diagonal />
          </a>
        </div>
        <div className="about__ornament" aria-hidden="true">
          <span>present</span>
          <span>in the</span>
          <span>moment</span>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services section-wrap section-space" id="services" aria-labelledby="services-title">
      <div className="services__intro">
        <p className="eyebrow"><span className="eyebrow__line" /> Our craft</p>
        <h2 id="services-title">Every ritual.<br /><em>Every emotion.</em></h2>
        <p>
          Ceremony coverage, family portraits and celebration films, thoughtfully planned
          around the rhythm of your occasion.
        </p>
      </div>
      <div className="services-list">
        {services.map((service) => (
          <article className="service-item" key={service.number}>
            <span className="service-item__number">{service.number}</span>
            <div className="service-item__content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p className="service-item__detail"><strong>A good fit:</strong> {service.audience}</p>
              <p className="service-item__detail"><strong>Planning:</strong> {service.planning}</p>
            </div>
            <a className="service-item__link" href="#contact" aria-label={`Enquire about ${service.title}`}>
              <ArrowIcon diagonal />
            </a>
          </article>
        ))}
        <p className="services-list__note">Contact us to discuss your photography needs.</p>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { number: "01", title: "Share your story", text: "Tell us about the families, traditions and moments that matter most." },
    { number: "02", title: "Shape the day", text: "We map the ceremonies and timeframes so nothing meaningful gets missed." },
    { number: "03", title: "Treasure the memory", text: "Receive your finished photographs and film, ready to share across generations." },
  ];

  return (
    <section className="process section-space" aria-labelledby="process-title">
      <div className="process__inner section-wrap">
        <div className="process__heading">
          <p className="eyebrow"><span className="eyebrow__line" /> From hello to keepsake</p>
          <h2 id="process-title">A simple way<br />to <em>begin.</em></h2>
        </div>
        <div className="process__steps">
          {steps.map((step) => (
            <article className="process-step" key={step.number}>
              <span className="process-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instagram() {
  return (
    <section className="instagram section-wrap section-space" aria-labelledby="instagram-title">
      <div className="instagram__mark" aria-hidden="true">ig</div>
      <div className="instagram__copy">
        <p className="eyebrow"><span className="eyebrow__line" /> Follow along</p>
        <h2 id="instagram-title">More moments,<br /><em>over on Instagram.</em></h2>
      </div>
      <a className="button button--outline" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
        @parivaarphotography <ArrowIcon diagonal />
      </a>
    </section>
  );
}

function KindWords() {
  return (
    <section className="kind-words section-space" aria-label="Our approach">
      <div className="kind-words__inner section-wrap">
        <p className="eyebrow"><span className="eyebrow__line" /> Our approach</p>
        <blockquote>
          “Not only how the celebration looked,
          but how its blessings felt to carry.”
        </blockquote>
        <p className="kind-words__client">Parivaar Photography <span>Honest stories, thoughtfully told</span></p>
      </div>
    </section>
  );
}

function ContactForm() {
  const [submissionStatus, setSubmissionStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("_subject", `Photography enquiry from ${formData.get("name")}`);
    setSubmissionStatus("sending");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL_ADDRESS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = await response.json();

      if (typeof result.message === "string" && result.message.toLowerCase().includes("activation")) {
        setSubmissionStatus("activation");
        return;
      }

      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("FormSubmit could not send the enquiry.");
      }

      form.reset();
      setSubmissionStatus("success");
    } catch {
      setSubmissionStatus("error");
    }
  }

  return (
    <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__heading">
        <span>01 / Enquiry</span>
        <p>Tell us what you’re planning. Sending an enquiry does not confirm a booking.</p>
      </div>
      <div className="form-grid">
        <label className="form-field">
          <span>Name <i>*</i></span>
          <input autoComplete="name" name="name" placeholder="Your name" required />
        </label>
        <label className="form-field">
          <span>Email <i>*</i></span>
          <input autoComplete="email" name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label className="form-field">
          <span>Phone <small>(optional)</small></span>
          <input autoComplete="tel" name="phone" type="tel" placeholder="Your number" />
        </label>
        <label className="form-field">
          <span>Photography needs <i>*</i></span>
          <select name="needs" defaultValue="" required>
            <option value="" disabled>Select one</option>
            <option>Event photography</option>
            <option>Event videography</option>
            <option>Photography and videography</option>
            <option>Something else — please ask</option>
          </select>
        </label>
        <label className="form-field form-field--wide">
          <span>Your message <i>*</i></span>
          <textarea name="message" rows="3" placeholder="A little about the occasion and what you have in mind..." required />
        </label>
      </div>
      <div className="contact-form__footer">
        <p className={`contact-form__status contact-form__status--${submissionStatus}`} aria-live="polite" role="status">
          {(submissionStatus === "success" || submissionStatus === "error" || submissionStatus === "activation") && (
            <svg className="contact-form__status-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {submissionStatus === "success" ? (
                <path className="contact-form__status-mark contact-form__status-mark--check" d="m5 12 4 4L19 6" />
              ) : (
                <path className="contact-form__status-mark contact-form__status-mark--cross" d="m7 7 10 10M17 7 7 17" />
              )}
            </svg>
          )}
          <span>
            {submissionStatus === "sending" && "Sending your enquiry..."}
            {submissionStatus === "success" && "Thanks, your enquiry has been submitted. We’ll be in touch soon."}
            {submissionStatus === "activation" && `Check ${EMAIL_ADDRESS} for FormSubmit’s activation email. Click its link, then submit your enquiry again.`}
            {submissionStatus === "error" && `We couldn’t send your enquiry. Please try again or email ${EMAIL_ADDRESS}.`}
            {submissionStatus === "idle" && "Your enquiry will be sent directly from this form."}
          </span>
        </p>
        <button className="button" type="submit" disabled={submissionStatus === "sending"}>
          {submissionStatus === "sending" ? "Sending..." : "Send an enquiry"} <ArrowIcon />
        </button>
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section className="contact section-space" id="contact" aria-labelledby="contact-title">
      <div className="contact__inner section-wrap">
        <div className="contact__intro" id="contact-intro">
          <p className="eyebrow"><span className="eyebrow__line" /> Begin your celebration</p>
          <h2 id="contact-title">A day to honour.<br />A story to <em>keep.</em></h2>
          <p className="contact__lead">Planning a wedding, engagement or family celebration? Tell us where the story begins.</p>
          <div className="contact-details">
            <a href={PHONE_LINK} aria-label={`Call Parivaar Photography at ${PHONE_NUMBER}`}>
              <span>Call us</span>
              <strong>{PHONE_NUMBER}</strong>
              <ArrowIcon diagonal />
            </a>
            <a href={EMAIL_LINK}>
              <span>Email us</span>
              <strong>{EMAIL_ADDRESS}</strong>
              <ArrowIcon diagonal />
            </a>
          </div>
          <div className="contact-service-area">
            <span>Location &amp; service area</span>
            <p>Available across South Africa, with travel arrangements available by request.</p>
          </div>
          <div className="contact__social">
            <p>A message can also be sent on Facebook or Instagram.</p>
            <a className="contact__instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram <ArrowIcon diagonal />
            </a>
            <a className="contact__instagram" href={FACEBOOK_URL} target="_blank" rel="noreferrer">
              Facebook <ArrowIcon diagonal />
            </a>
          </div>
          <a className="contact__whatsapp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            WhatsApp us <span>Start a conversation</span> <ArrowIcon diagonal />
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner section-wrap">
        <Brand footer />
        <p className="site-footer__tagline">Tradition. Family. Forever.</p>
        <nav className="footer-links" aria-label="Footer links">
          <a href={PHONE_LINK} aria-label={`Call Parivaar Photography at ${PHONE_NUMBER}`}>Call {PHONE_NUMBER}</a>
          <a href={EMAIL_LINK}>Email</a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">WhatsApp <ArrowIcon diagonal /></a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram <ArrowIcon diagonal /></a>
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook <ArrowIcon diagonal /></a>
        </nav>
        <p className="site-footer__copyright">© {new Date().getFullYear()} Parivaar Photography</p>
      </div>
      <a className="back-to-top" href="#site-top" aria-label="Back to top">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </footer>
  );
}

export function useScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    let previousScrollY = window.scrollY;
    let scrollDirection = "down";
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY !== previousScrollY) {
        scrollDirection = currentScrollY > previousScrollY ? "down" : "up";
        previousScrollY = currentScrollY;
      }
    };

    const targets = document.querySelectorAll(
      "main > section > *, main > section .service-item, main > section .process-step, main > section .portfolio-card, main > section .package-card",
    );
    const sectionTargetCounts = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.scrollDirection = scrollDirection;
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    window.addEventListener("scroll", handleScroll, { passive: true });
    targets.forEach((target) => {
      const section = target.closest("main > section");
      const index = sectionTargetCounts.get(section) ?? 0;
      sectionTargetCounts.set(section, index + 1);
      target.classList.add("scroll-reveal");
      target.dataset.scrollSide = index % 2 === 0 ? "left" : "right";
      target.style.setProperty("--scroll-reveal-delay", `${(index % 2) * 120}ms`);
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      targets.forEach((target) => {
        target.classList.remove("scroll-reveal", "is-visible");
        delete target.dataset.scrollDirection;
        delete target.dataset.scrollSide;
        target.style.removeProperty("--scroll-reveal-delay");
      });
    };
  }, []);
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useScrollReveal();

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    document.getElementById(decodeURIComponent(targetId))?.scrollIntoView();
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      <div aria-hidden={showSplash}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">
          <Hero />
          <About />
          <KindWords />
          <section className="portfolio-invite section-space" aria-labelledby="portfolio-invite-title">
            <div className="portfolio-invite__inner section-wrap">
              <p className="eyebrow"><span className="eyebrow__line" /> Selected celebrations</p>
              <h2 id="portfolio-invite-title">A glimpse of the<br /><em>moments we keep.</em></h2>
              <a className="button" href={`${BASE_URL}portfolio.html`}>
                Explore the portfolio <ArrowIcon diagonal />
              </a>
            </div>
          </section>
          <Services />
          <Process />
          <Instagram />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export { Footer, Header, Portfolio };
