// Fallback suggested products for "You might also need" carousel
export const suggestedProductsFallback = [
  {
    code: '85138270',
    name: 'Air Dryer Kit',
    price: { value: 245.99 },
    priceFormatted: '$245.99',
    image: '/assets/products/mack-products/85138270-Air-Dryer-Kit.png',
    description: 'Complete air dryer kit for Mack trucks'
  },
  {
    code: '85142795',
    name: 'ULTRASHIFT DM Clutch Assembly',
    price: { value: 1249.99 },
    priceFormatted: '$1,249.99',
    image: '/assets/products/mack-products/85142795-ULTRASHIFT-DM-CLUTCH.jpg',
    description: 'OEM ULTRASHIFT DM clutch assembly'
  },
  {
    code: '85153001',
    name: 'Electronic Control Unit ESP ECU',
    price: { value: 892.50 },
    priceFormatted: '$892.50',
    image: '/assets/products/mack-products/85153001-Electronic-Control-Unit-ESP-ECU.png',
    description: 'Electronic Stability Program control unit'
  },
  {
    code: '3041-40014SP',
    name: 'Service Parts Kit',
    price: { value: 89.99 },
    priceFormatted: '$89.99',
    image: '/assets/products/mack-products/3041-40014SP.jpg',
    description: 'Essential service parts kit for maintenance'
  },
  {
    code: '24019026',
    name: 'Genuine Mack Component',
    price: { value: 156.50 },
    priceFormatted: '$156.50',
    image: '/assets/products/mack-products/24019026.jpg',
    description: 'Genuine Mack replacement component'
  },
  {
    code: 'LBFL2007F',
    name: 'Mack Filter Assembly',
    price: { value: 67.99 },
    priceFormatted: '$67.99',
    image: '/assets/products/mack-products/LBFL2007F.png',
    description: 'Mack filter assembly for optimal performance'
  }
];

// Complementary products by category
export const complementaryProducts = {
  'filter': [
    { code: 'KIT8046', name: 'Installation Kit', type: 'accessory' },
    { code: 'TF21-555', name: 'Drain Cock', type: 'accessory' }
  ],
  'suspension': [
    { code: '2141-2048', name: 'Pivot Bushing', type: 'accessory' },
    { code: '334-345', name: 'Torque Rod Bolt', type: 'hardware' }
  ],
  'engine': [
    { code: '22618326', name: 'Multi-Purpose Sealant', type: 'maintenance' },
    { code: 'KIT8046', name: 'Camshaft Repair Kit', type: 'kit' }
  ]
};
