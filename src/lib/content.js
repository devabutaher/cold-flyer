import about from "@/content/about.json";
import contact from "@/content/contact.json";
import privacy from "@/content/privacy.json";
import terms from "@/content/terms.json";
import shipping from "@/content/shipping.json";
import faq from "@/content/faq.json";
import careers from "@/content/careers.json";
import homeHero from "@/content/home-hero.json";
import homeServices from "@/content/home-services.json";
import homeProjects from "@/content/home-projects.json";
import homeReviews from "@/content/home-reviews.json";
import homeAbout from "@/content/home-about.json";
import navLinks from "@/content/nav-links.json";
import footerLinks from "@/content/footer-links.json";
import productFormConstants from "@/content/product-form-constants.json";

const allContent = {
  about,
  contact,
  privacy,
  terms,
  shipping,
  faq,
  careers,
  "home-hero": homeHero,
  "home-services": homeServices,
  "home-projects": homeProjects,
  "home-reviews": homeReviews,
  "home-about": homeAbout,
  "nav-links": navLinks,
  "footer-links": footerLinks,
  "product-form-constants": productFormConstants,
};

export function getPageContent(page, locale = "en") {
  return allContent[page]?.[locale] ?? {};
}
