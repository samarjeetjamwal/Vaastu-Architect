import { Unit, VastuResult, ZoneData } from '../types';

export const calculateAayadi = (
  length: number, 
  breadth: number, 
  height: number, 
  unit: Unit,
  entrance: string
): VastuResult => {
  
  const factor = unit === Unit.METERS ? 3.28084 : 1;
  const L = length * factor;
  const B = breadth * factor;
  const H = height * factor;
  const perimeter = 2 * (L + B);

  // Traditional Formulas
  const aaya = ((perimeter * 8) / 12) % 12;
  const vyaya = ((perimeter * 3) / 10) % 12;
  const yoni = Math.floor((perimeter * 3) / 8) % 8 + 1;
  const vara = Math.floor((H * 8) / 7) % 7 + 1;
  const tithi = Math.floor(H * 9 / 30) % 30 + 1;
  const nakshatra = Math.floor(perimeter * 3 / 27) % 27 + 1;

  // Scoring Logic
  let score = 50; // Base score
  const goodYoni = [1, 3, 5, 7];
  const auspiciousEntrances = ['N', 'NE', 'E', 'NNE'];

  if (aaya > vyaya) score += 20;
  if (goodYoni.includes(yoni)) score += 15;
  if (auspiciousEntrances.includes(entrance)) score += 15;

  const recommendations: string[] = [];
  if (aaya <= vyaya) recommendations.push("Income (Aaya) is less than Expenditure (Vyaya). Consider adjusting dimensions slightly.");
  if (!goodYoni.includes(yoni)) recommendations.push("Yoni index is not optimal. This affects the energy flow of the structure.");
  if (auspiciousEntrances.includes(entrance)) {
    recommendations.push("Excellent Main Entrance direction chosen.");
  } else {
    recommendations.push("Entrance direction is neutral or requires remedies (pyramids/yantras).");
  }

  return {
    aaya,
    vyaya,
    yoni,
    vara,
    tithi,
    nakshatra,
    score,
    recommendations
  };
};

export const ZONES: ZoneData[] = [
  {
    name: 'N', deg: 0, ideal: 'Wealth, Treasury', color: '#80deea', 
    description: 'Kuber Stan (Wealth). Keep light & open.',
    element: 'Water',
    dos: ['Place Money Locker/Safe', 'Use Blue/Green colors', 'Open spaces, Mirrors'],
    donts: ['Heavy furniture', 'Kitchen', 'Toilet', 'Red/Yellow colors']
  },
  {
    name: 'NNE', deg: 22.5, ideal: 'Health', color: '#a5d6a7', 
    description: 'Health & Immunity zone.',
    element: 'Water',
    dos: ['Medicine storage', 'Healing activities', 'Keep very clean'],
    donts: ['Toilet', 'Dustbin', 'Clutter']
  },
  {
    name: 'NE', deg: 45, ideal: 'Pooja, Water', color: '#81c784', 
    description: 'Ishanya (God). Best for Meditation & Underground Water tank.',
    element: 'Water/Space',
    dos: ['Pooja Room', 'Meditation', 'Underground Water Tank', 'Entrance'],
    donts: ['Toilet', 'Kitchen', 'Septic Tank', 'Heavy Storage', 'Master Bedroom']
  },
  {
    name: 'ENE', deg: 67.5, ideal: 'Fun, Recreation', color: '#c8e6c9', 
    description: 'Rejuvenation zone.',
    element: 'Air/Space',
    dos: ['Living Room area', 'Play area', 'Bathrooms (no WC)'],
    donts: ['Heavy storage', 'Toilet seat']
  },
  {
    name: 'E', deg: 90, ideal: 'Social Connections', color: '#fff59d', 
    description: 'Indra Stan. Good for Living room.',
    element: 'Air/Sun',
    dos: ['Main Entrance', 'Living Room', 'Guest Room', 'Greenery'],
    donts: ['Toilet', 'Store room', 'Kitchen (partial ok but avoid)']
  },
  {
    name: 'ESE', deg: 112.5, ideal: 'Churning, Anxiety', color: '#ffccbc', 
    description: 'Avoid Bedroom here. Good for Mixer/Grinder.',
    element: 'Air',
    dos: ['Washing Machine', 'Mixer/Grinder', 'Toilet (Acceptable)'],
    donts: ['Bedroom (Causes anxiety)', 'Study table']
  },
  {
    name: 'SE', deg: 135, ideal: 'Kitchen (Fire)', color: '#ff8a65', 
    description: 'Agneya (Fire). Best for Kitchen.',
    element: 'Fire',
    dos: ['Kitchen (Burner)', 'Electric Meter', 'Inverters/Generators'],
    donts: ['Water tank', 'Toilet', 'Bedroom (Causes aggression)', 'Blue color']
  },
  {
    name: 'SSE', deg: 157.5, ideal: 'Strength, Confidence', color: '#ffab91', 
    description: 'Power & Confidence zone.',
    element: 'Fire',
    dos: ['Gym', 'Yoga', 'Bedroom (for confidence)'],
    donts: ['Water features', 'Toilet']
  },
  {
    name: 'S', deg: 180, ideal: 'Fame, Relaxation', color: '#ffccbc', 
    description: 'Yama Stan. Good for Bedroom.',
    element: 'Fire/Earth',
    dos: ['Bedroom', 'Office cabin (for fame)'],
    donts: ['Water', 'Mirrors', 'Main Entrance (needs remedy)']
  },
  {
    name: 'SSW', deg: 202.5, ideal: 'Disposal, Wastage', color: '#ef9a9a', 
    description: 'Best for Toilet/Dustbin. Avoid sleeping here.',
    element: 'Earth',
    dos: ['Toilet', 'Dustbin', 'Septic Tank', 'Broom storage'],
    donts: ['Bedroom', 'Kitchen', 'Entrance', 'Pooja']
  },
  {
    name: 'SW', deg: 225, ideal: 'Master Bedroom', color: '#f48fb1', 
    description: 'Nairitya (Stability). Head of family should sleep here.',
    element: 'Earth',
    dos: ['Master Bedroom', 'Heavy Wardrobes', 'Safe/Locker (opening North)', 'Family Photos'],
    donts: ['Toilet', 'Kitchen', 'Water tank (underground)', 'Entrance', 'Cut/Extension']
  },
  {
    name: 'WSW', deg: 247.5, ideal: 'Education', color: '#ce93d8', 
    description: 'Vidya Stan. Good for Study table.',
    element: 'Space',
    dos: ['Study Room', 'Library', 'Children Bedroom'],
    donts: ['Toilet', 'Kitchen', 'TV']
  },
  {
    name: 'W', deg: 270, ideal: 'Gains, Profits', color: '#b39ddb', 
    description: 'Varuna Stan. Dining or Bedroom.',
    element: 'Space',
    dos: ['Dining Room', 'Bedroom', 'Safe/Locker', 'Living Room'],
    donts: ['Toilet', 'Entrance (check pada)', 'Kitchen']
  },
  {
    name: 'WNW', deg: 292.5, ideal: 'Depression, Detox', color: '#9fa8da', 
    description: 'Rodana (Crying). Good for washing machine/detox.',
    element: 'Space',
    dos: ['Toilet', 'Washing Machine', 'Guest Room (short stay)'],
    donts: ['Master Bedroom', 'Study', 'Pooja']
  },
  {
    name: 'NW', deg: 315, ideal: 'Support, Banking', color: '#90caf9', 
    description: 'Vayu Stan. Guest room or Finished Goods.',
    element: 'Air',
    dos: ['Guest Room', 'Finished Goods Store', 'Parking', 'Pets'],
    donts: ['Master Bedroom', 'Kitchen (secondary option)', 'Heavy construction']
  },
  {
    name: 'NNW', deg: 337.5, ideal: 'Attraction, Sex', color: '#a5d6a7', 
    description: 'Rati Stan. Avoid for children.',
    element: 'Water/Air',
    dos: ['Bedroom for couples', 'Dressing room'],
    donts: ['Study', 'Pooja', 'Kitchen']
  }
];