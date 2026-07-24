import { getOrganizationSchema } from "./OrganizationSchema";
import { getWebPageSchema } from "./webpageSchema";
import { getWebsiteSchema } from "./websiteSchema";

export const getMainGraphSchema = (companyInfo = {}) => {
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(companyInfo),
      getWebsiteSchema(companyInfo),
      getWebPageSchema(companyInfo)
    ]
  };
};