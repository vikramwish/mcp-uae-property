export interface DubaiDistrict {
  id: string;
  name: string;
  avgPricePerSqFtAED: number;
  medianRent1BedAED: number;
  typicalGrossYieldPercent: number;
  historicalAppreciation5YrPercent: number;
  popularFor: string[];
  metroConnected: boolean;
}

export interface OffPlanDevelopment {
  id: string;
  title: string;
  developer: string;
  districtId: string;
  districtName: string;
  propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse';
  startingPriceAED: number;
  completionYear: number;
  paymentPlan: string;
  goldenVisaEligible: boolean;
  amenities: string[];
}

export const DUBAI_DISTRICTS: DubaiDistrict[] = [
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    avgPricePerSqFtAED: 2450,
    medianRent1BedAED: 130000,
    typicalGrossYieldPercent: 6.2,
    historicalAppreciation5YrPercent: 48,
    popularFor: ['Luxury living', 'Burj Khalifa views', 'Short-term holiday lets'],
    metroConnected: true,
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    avgPricePerSqFtAED: 1850,
    medianRent1BedAED: 105000,
    typicalGrossYieldPercent: 6.8,
    historicalAppreciation5YrPercent: 42,
    popularFor: ['Waterfront lifestyle', 'High tenant demand', 'Walkable amenities'],
    metroConnected: true,
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    avgPricePerSqFtAED: 3200,
    medianRent1BedAED: 175000,
    typicalGrossYieldPercent: 5.5,
    historicalAppreciation5YrPercent: 85,
    popularFor: ['Ultra-luxury', 'Beachfront', 'HNWI capital preservation'],
    metroConnected: false,
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    avgPricePerSqFtAED: 1950,
    medianRent1BedAED: 95000,
    typicalGrossYieldPercent: 7.4,
    historicalAppreciation5YrPercent: 52,
    popularFor: ['Corporate professionals', 'High yields', 'Canal views'],
    metroConnected: true,
  },
  {
    id: 'dubai-creek-harbour',
    name: 'Dubai Creek Harbour',
    avgPricePerSqFtAED: 1800,
    medianRent1BedAED: 88000,
    typicalGrossYieldPercent: 6.9,
    historicalAppreciation5YrPercent: 55,
    popularFor: ['Master-planned green community', 'Emaar development', 'Future Creek Tower'],
    metroConnected: true,
  },
  {
    id: 'dubai-hills-estate',
    name: 'Dubai Hills Estate',
    avgPricePerSqFtAED: 1900,
    medianRent1BedAED: 92000,
    typicalGrossYieldPercent: 6.7,
    historicalAppreciation5YrPercent: 60,
    popularFor: ['Families', 'Championship golf course', 'Dubai Hills Mall'],
    metroConnected: false,
  },
  {
    id: 'jumeirah-village-circle',
    name: 'Jumeirah Village Circle (JVC)',
    avgPricePerSqFtAED: 1200,
    medianRent1BedAED: 65000,
    typicalGrossYieldPercent: 8.5,
    historicalAppreciation5YrPercent: 58,
    popularFor: ['Maximum rental yields', 'Affordable entry', 'Cash flow investors'],
    metroConnected: false,
  },
  {
    id: 'difc',
    name: 'Dubai International Financial Centre (DIFC)',
    avgPricePerSqFtAED: 2600,
    medianRent1BedAED: 140000,
    typicalGrossYieldPercent: 5.9,
    historicalAppreciation5YrPercent: 38,
    popularFor: ['Financial hub', 'Fine dining', 'Institutional grade assets'],
    metroConnected: true,
  },
];

export const OFF_PLAN_DEVELOPMENTS: OffPlanDevelopment[] = [
  {
    id: 'emaar-creek-waters',
    title: 'Creek Waters 2',
    developer: 'Emaar Properties',
    districtId: 'dubai-creek-harbour',
    districtName: 'Dubai Creek Harbour',
    propertyType: 'apartment',
    startingPriceAED: 1750000,
    completionYear: 2027,
    paymentPlan: '90/10 (10% on handover)',
    goldenVisaEligible: false,
    amenities: ['Infinity pool', 'Direct promenade access', 'Gym & yoga deck'],
  },
  {
    id: 'emaar-hills-park',
    title: 'Hills Park',
    developer: 'Emaar Properties',
    districtId: 'dubai-hills-estate',
    districtName: 'Dubai Hills Estate',
    propertyType: 'apartment',
    startingPriceAED: 2100000,
    completionYear: 2026,
    paymentPlan: '80/20 (20% on handover)',
    goldenVisaEligible: true,
    amenities: ['Dubai Hills Park views', 'Padel tennis courts', 'Kids splash pad'],
  },
  {
    id: 'nakheel-como-residences',
    title: 'Como Residences',
    developer: 'Nakheel',
    districtId: 'palm-jumeirah',
    districtName: 'Palm Jumeirah',
    propertyType: 'penthouse',
    startingPriceAED: 21000000,
    completionYear: 2027,
    paymentPlan: '80/20',
    goldenVisaEligible: true,
    amenities: ['Private sandy beach', 'Rooftop infinity pool 75 floors up', 'Private lift access'],
  },
  {
    id: 'sobha-hartland-waves',
    title: 'Sobha Waves Opulence',
    developer: 'Sobha Realty',
    districtId: 'business-bay',
    districtName: 'Business Bay',
    propertyType: 'apartment',
    startingPriceAED: 1650000,
    completionYear: 2026,
    paymentPlan: '60/40',
    goldenVisaEligible: false,
    amenities: ['Waterfront boardwalk', 'Zen garden', 'Outdoor cinema'],
  },
  {
    id: 'damac-bay-cavalli',
    title: 'DAMAC Bay by Cavalli',
    developer: 'DAMAC Properties',
    districtId: 'dubai-marina',
    districtName: 'Dubai Marina',
    propertyType: 'apartment',
    startingPriceAED: 2900000,
    completionYear: 2027,
    paymentPlan: '80/20',
    goldenVisaEligible: true,
    amenities: ['Private beach access', 'Cavalli branded interiors', 'Sky gardens'],
  },
  {
    id: 'ellington-oxford-gardens',
    title: 'Ellington Berkeley Place',
    developer: 'Ellington Properties',
    districtId: 'jumeirah-village-circle',
    districtName: 'Jumeirah Village Circle (JVC)',
    propertyType: 'apartment',
    startingPriceAED: 1100000,
    completionYear: 2025,
    paymentPlan: '70/30',
    goldenVisaEligible: false,
    amenities: ['Boutique hotel aesthetic', 'Infinity lap pool', 'Fitness studio'],
  },
];
