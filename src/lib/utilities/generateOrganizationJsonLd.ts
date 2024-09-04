import SiteDataModel from "../types/SiteDataModel";

export default function generateOrganizationJsonLd(siteData: SiteDataModel) {
  return {
    __html: `{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "${siteData.title}",
          "url": "${siteData.url}",
          "logo": "${siteData.logoSrc}",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "${siteData.contact_details.state}, ${siteData.contact_details.country}",
            "postalCode": "${siteData.contact_details.PIN}",
            "streetAddress": "${siteData.contact_details.flat_house}, ${siteData.contact_details.address1}, ${siteData.contact_details.address2}"
          },
          "email": "${siteData.contact_details.email.replace('@','(at)')}",
          "telephone": "${siteData.contact_details.phone.split(',')[0]}",
          "sameAs": [${(siteData.profiles ?? []).map(profile=>{
            return `"${profile}"`
          })}]
        }
  `,
  };
}