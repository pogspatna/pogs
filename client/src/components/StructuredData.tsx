'use client';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'medicalOrganization' | 'event' | 'person';
  data?: Record<string, unknown>;
}

const StructuredData = ({ type = 'organization', data }: StructuredDataProps) => {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'organization':
      case 'medicalOrganization':
        return {
          ...baseData,
          '@type': 'MedicalOrganization',
          name: 'Patna Obstetrics & Gynaecological Society',
          alternateName: 'POGS',
          description: 'Official website of Patna Obstetrics & Gynaecological Society. Connecting medical professionals and advancing obstetrics and gynaecology in Bihar, India.',
          url: 'https://pogspatna.org',
          logo: 'https://pogspatna.org/icon.png',
          image: 'https://pogspatna.org/web-app-manifest-512x512.png',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'IMA Building, Dr. A. K. N. Sinha Path',
            addressLocality: 'Patna',
            addressRegion: 'Bihar',
            postalCode: '800004',
            addressCountry: 'IN'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-612-2321542',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi']
          },
          email: 'patnabogs@gmail.com',
          foundingDate: '1970',
          memberOf: {
            '@type': 'Organization',
            name: 'Federation of Obstetric and Gynaecological Societies of India',
            alternateName: 'FOGSI'
          },
          medicalSpecialty: ['Obstetrics', 'Gynaecology'],
          areaServed: {
            '@type': 'State',
            name: 'Bihar'
          },
          sameAs: [
            // Add social media URLs when available
          ]
        };

      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          name: 'POGS - Patna Obstetrics & Gynaecological Society',
          alternateName: 'POGS Patna',
          url: 'https://pogspatna.org',
          description: 'Official website of Patna Obstetrics & Gynaecological Society',
          inLanguage: 'en-US',
          isPartOf: {
            '@type': 'Organization',
            name: 'Patna Obstetrics & Gynaecological Society'
          },
          about: {
            '@type': 'MedicalOrganization',
            name: 'Patna Obstetrics & Gynaecological Society'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://pogspatna.org/members?search={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };

      case 'event':
        return {
          ...baseData,
          '@type': 'Event',
          ...data,
          organizer: {
            '@type': 'MedicalOrganization',
            name: 'Patna Obstetrics & Gynaecological Society',
            url: 'https://pogspatna.org'
          }
        };

      case 'person':
        return {
          ...baseData,
          '@type': 'Person',
          ...data,
          memberOf: {
            '@type': 'MedicalOrganization',
            name: 'Patna Obstetrics & Gynaecological Society'
          }
        };

      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

export default StructuredData; 