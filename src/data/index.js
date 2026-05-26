import { aboutData as aboutDataEn } from "./en/about-data";
import { blogs as blogsEn } from "./en/blogs-data";
import { benefits as benefitsEn, departments as departmentsEn, culture as cultureEn } from "./en/careers-data";
import {
  quickHelpItems as quickHelpItemsEn,
  contactInfo as contactInfoEn,
  categories as categoriesEn,
} from "./en/faq-data";
import { footerLinks as footerLinksEn, footerColumns as footerColumnsEn } from "./en/footer-links";
import { heroSliderData as heroSliderDataEn } from "./en/hero-slider-data";
import {
  productLinks as productLinksEn,
  serviceLinks as serviceLinksEn,
  primaryLinks as primaryLinksEn,
  moreLinks as moreLinksEn,
  mainNavLinks as mainNavLinksEn,
} from "./en/nav-links";
import { principles as principlesEn, dataTypes as dataTypesEn, timeline as timelineEn } from "./en/privacy-data";
import {
  CATEGORIES as CATEGORIESEn,
  BRANDS as BRANDSEn,
  TAGS as TAGSEn,
  WARRANTIES as WARRANTIESEn,
  DEFAULT_FORM_VALUES as DEFAULT_FORM_VALUESEn,
} from "./en/product-form-constants";
import { promoCardData as promoCardDataEn } from "./en/promo-card-data";
import { projects as projectsEn } from "./en/projects-data";
import { reviews as reviewsEn } from "./en/reviews-data";
import { services as servicesEn } from "./en/services-carousel-data";
import { servicesData as servicesDataEn } from "./en/services-data";
import {
  shippingOptions as shippingOptionsEn,
  process as processEn,
  returns as returnsEn,
  restrictions as restrictionsEn,
} from "./en/shipping-data";
import { sections as sectionsEn, lastUpdated as lastUpdatedEn, version as versionEn } from "./en/terms-data";

import { aboutData as aboutDataBn } from "./bn/about-data";
import { blogs as blogsBn } from "./bn/blogs-data";
import { benefits as benefitsBn, departments as departmentsBn, culture as cultureBn } from "./bn/careers-data";
import {
  quickHelpItems as quickHelpItemsBn,
  contactInfo as contactInfoBn,
  categories as categoriesBn,
} from "./bn/faq-data";
import { footerLinks as footerLinksBn, footerColumns as footerColumnsBn } from "./bn/footer-links";
import { heroSliderData as heroSliderDataBn } from "./bn/hero-slider-data";
import {
  productLinks as productLinksBn,
  serviceLinks as serviceLinksBn,
  primaryLinks as primaryLinksBn,
  moreLinks as moreLinksBn,
  mainNavLinks as mainNavLinksBn,
} from "./bn/nav-links";
import { principles as principlesBn, dataTypes as dataTypesBn, timeline as timelineBn } from "./bn/privacy-data";
import {
  CATEGORIES as CATEGORIESBn,
  BRANDS as BRANDSBn,
  TAGS as TAGSBn,
  WARRANTIES as WARRANTIESBn,
  DEFAULT_FORM_VALUES as DEFAULT_FORM_VALUESBn,
} from "./bn/product-form-constants";
import { promoCardData as promoCardDataBn } from "./bn/promo-card-data";
import { projects as projectsBn } from "./bn/projects-data";
import { reviews as reviewsBn } from "./bn/reviews-data";
import { services as servicesBn } from "./bn/services-carousel-data";
import { servicesData as servicesDataBn } from "./bn/services-data";
import {
  shippingOptions as shippingOptionsBn,
  process as processBn,
  returns as returnsBn,
  restrictions as restrictionsBn,
} from "./bn/shipping-data";
import { sections as sectionsBn, lastUpdated as lastUpdatedBn, version as versionBn } from "./bn/terms-data";

const en = {
  aboutData: aboutDataEn,
  blogs: blogsEn,
  benefits: benefitsEn,
  departments: departmentsEn,
  culture: cultureEn,
  quickHelpItems: quickHelpItemsEn,
  contactInfo: contactInfoEn,
  categories: categoriesEn,
  footerLinks: footerLinksEn,
  footerColumns: footerColumnsEn,
  heroSliderData: heroSliderDataEn,
  productLinks: productLinksEn,
  serviceLinks: serviceLinksEn,
  primaryLinks: primaryLinksEn,
  moreLinks: moreLinksEn,
  mainNavLinks: mainNavLinksEn,
  principles: principlesEn,
  dataTypes: dataTypesEn,
  timeline: timelineEn,
  CATEGORIES: CATEGORIESEn,
  BRANDS: BRANDSEn,
  TAGS: TAGSEn,
  WARRANTIES: WARRANTIESEn,
  DEFAULT_FORM_VALUES: DEFAULT_FORM_VALUESEn,
  promoCardData: promoCardDataEn,
  projects: projectsEn,
  reviews: reviewsEn,
  services: servicesEn,
  servicesData: servicesDataEn,
  shippingOptions: shippingOptionsEn,
  process: processEn,
  returns: returnsEn,
  restrictions: restrictionsEn,
  sections: sectionsEn,
  lastUpdated: lastUpdatedEn,
  version: versionEn,
};

const bn = {
  aboutData: aboutDataBn,
  blogs: blogsBn,
  benefits: benefitsBn,
  departments: departmentsBn,
  culture: cultureBn,
  quickHelpItems: quickHelpItemsBn,
  contactInfo: contactInfoBn,
  categories: categoriesBn,
  footerLinks: footerLinksBn,
  footerColumns: footerColumnsBn,
  heroSliderData: heroSliderDataBn,
  productLinks: productLinksBn,
  serviceLinks: serviceLinksBn,
  primaryLinks: primaryLinksBn,
  moreLinks: moreLinksBn,
  mainNavLinks: mainNavLinksBn,
  principles: principlesBn,
  dataTypes: dataTypesBn,
  timeline: timelineBn,
  CATEGORIES: CATEGORIESBn,
  BRANDS: BRANDSBn,
  TAGS: TAGSBn,
  WARRANTIES: WARRANTIESBn,
  DEFAULT_FORM_VALUES: DEFAULT_FORM_VALUESBn,
  promoCardData: promoCardDataBn,
  projects: projectsBn,
  reviews: reviewsBn,
  services: servicesBn,
  servicesData: servicesDataBn,
  shippingOptions: shippingOptionsBn,
  process: processBn,
  returns: returnsBn,
  restrictions: restrictionsBn,
  sections: sectionsBn,
  lastUpdated: lastUpdatedBn,
  version: versionBn,
};

export function getData(name, locale = "en") {
  return locale === "bn" ? bn[name] : en[name];
}

export { aboutDataEn as aboutData };
export { blogsEn as blogs };
export { benefitsEn as benefits, departmentsEn as departments, cultureEn as culture };
export { quickHelpItemsEn as quickHelpItems, contactInfoEn as contactInfo, categoriesEn as categories };
export { footerLinksEn as footerLinks, footerColumnsEn as footerColumns };
export { heroSliderDataEn as heroSliderData };
export {
  productLinksEn as productLinks,
  serviceLinksEn as serviceLinks,
  primaryLinksEn as primaryLinks,
  moreLinksEn as moreLinks,
  mainNavLinksEn as mainNavLinks,
};
export { principlesEn as principles, dataTypesEn as dataTypes, timelineEn as timeline };
export {
  CATEGORIESEn as CATEGORIES,
  BRANDSEn as BRANDS,
  TAGSEn as TAGS,
  WARRANTIESEn as WARRANTIES,
  DEFAULT_FORM_VALUESEn as DEFAULT_FORM_VALUES,
};
export { promoCardDataEn as promoCardData };
export { projectsEn as projects };
export { reviewsEn as reviews };
export { servicesEn as services };
export { servicesDataEn as servicesData };
export {
  shippingOptionsEn as shippingOptions,
  processEn as process,
  returnsEn as returns,
  restrictionsEn as restrictions,
};
export { sectionsEn as sections, lastUpdatedEn as lastUpdated, versionEn as version };
