// src/data/trails.ts
// Mock data representing public travel trails shared by TravelTrace users

export interface Waypoint {
  id: string;
  name: string;
  note: string;
  lat: number;
  lng: number;
  imageUrl: string;
  timestamp: string;
}

export interface Trail {
  id: string;
  title: string;
  username: string;
  userAvatar: string;
  description: string;
  status: 'COMPLETED' | 'ONGOING' | 'PLANNED';
  location: string;
  distance: string;
  duration: string;
  waypoints: Waypoint[];
  routeCoordinates: [number, number][]; // [lat, lng]
  coverImage: string;
  createdAt: string;
  tags: string[];
}

export const trails: Trail[] = [
  {
    id: '1',
    title: 'Colombo to Sigiriya Adventure',
    username: 'Chaminda Silva',
    userAvatar: 'CS',
    description: 'An incredible journey from the bustling capital Colombo through the cultural heartland of Sri Lanka, reaching the ancient rock fortress of Sigiriya. Experienced the contrast of city life, tea plantations, and ancient ruins.',
    status: 'COMPLETED',
    location: 'Western & North Central Province',
    distance: '187 km',
    duration: '3 days',
    coverImage: '',
    createdAt: '2024-03-15',
    tags: ['Heritage', 'Culture', 'Adventure'],
    waypoints: [
      { id: 'w1', name: 'Colombo Fort', note: 'Starting point - vibrant city centre with colonial architecture', lat: 6.9344, lng: 79.8428, imageUrl: '', timestamp: '2024-03-15T07:00:00Z' },
      { id: 'w2', name: 'Dambulla Cave Temple', note: 'UNESCO World Heritage site - stunning Buddhist cave murals from 1st century BC', lat: 7.8567, lng: 80.6497, imageUrl: '', timestamp: '2024-03-15T14:00:00Z' },
      { id: 'w3', name: 'Sigiriya Rock Fortress', note: 'Breathtaking climb to the top — 360° views of the jungle and reservoirs', lat: 7.9570, lng: 80.7603, imageUrl: '', timestamp: '2024-03-16T09:00:00Z' },
    ],
    routeCoordinates: [
      [6.9344, 79.8428], [7.0, 80.1], [7.2, 80.3], [7.5, 80.5], [7.8567, 80.6497], [7.9570, 80.7603]
    ]
  },
  {
    id: '2',
    title: 'Ella Sunrise Hike & Nine Arch Bridge',
    username: 'Priya Jayawardena',
    userAvatar: 'PJ',
    description: 'Woke up before dawn to catch the magical sunrise at Little Adams Peak, then explored the iconic Nine Arch Bridge in the lush hill country of Ella. The train through tea plantations was unforgettable.',
    status: 'COMPLETED',
    location: 'Uva Province',
    distance: '42 km',
    duration: '2 days',
    coverImage: '',
    createdAt: '2024-04-02',
    tags: ['Hiking', 'Scenic', 'Tea Country'],
    waypoints: [
      { id: 'w1', name: 'Ella Town', note: 'Cosy little town with amazing views, cafes with mountain vistas', lat: 6.8667, lng: 81.0466, imageUrl: '', timestamp: '2024-04-02T06:00:00Z' },
      { id: 'w2', name: 'Little Adams Peak', note: 'Sunrise was absolutely magical — clouds below us, pure bliss', lat: 6.8506, lng: 81.0650, imageUrl: '', timestamp: '2024-04-02T05:45:00Z' },
      { id: 'w3', name: 'Nine Arch Bridge', note: 'The colonial-era bridge in full jungle greenery — perfect when the train passes!', lat: 6.8791, lng: 81.0590, imageUrl: '', timestamp: '2024-04-02T10:30:00Z' },
      { id: 'w4', name: 'Ella Gap Viewpoint', note: 'Panoramic view of the plains below — worth every step', lat: 6.8747, lng: 81.0459, imageUrl: '', timestamp: '2024-04-02T15:00:00Z' },
    ],
    routeCoordinates: [
      [6.8667, 81.0466], [6.8506, 81.0650], [6.8600, 81.0580], [6.8791, 81.0590], [6.8747, 81.0459]
    ]
  },
  {
    id: '3',
    title: 'Ambuluwawa Tower Trek',
    username: 'Nuwan Perera',
    userAvatar: 'NP',
    description: 'Trekked through the misty forests surrounding the multi-religious complex at Ambuluwawa. The spiral tower offers one of the most unique views in Sri Lanka — seeing four provinces at once on a clear day.',
    status: 'ONGOING',
    location: 'Kandy District',
    distance: '28 km',
    duration: '1 day',
    coverImage: '',
    createdAt: '2024-05-10',
    tags: ['Trekking', 'Nature', 'Photography'],
    waypoints: [
      { id: 'w1', name: 'Gampola Town', note: 'Historic ancient capital, starting point for the trek', lat: 7.1667, lng: 80.5667, imageUrl: '', timestamp: '2024-05-10T08:00:00Z' },
      { id: 'w2', name: 'Ambuluwawa Tower', note: 'Unique spiral staircase tower — foggy views at peak, magical!', lat: 7.1831, lng: 80.5898, imageUrl: '', timestamp: '2024-05-10T11:00:00Z' },
      { id: 'w3', name: 'Ambuluwawa Lake', note: 'Serene lake below the tower, perfect for rest and photography', lat: 7.1800, lng: 80.5875, imageUrl: '', timestamp: '2024-05-10T13:00:00Z' },
    ],
    routeCoordinates: [
      [7.1667, 80.5667], [7.1720, 80.5780], [7.1831, 80.5898], [7.1800, 80.5875]
    ]
  },
  {
    id: '4',
    title: 'Colombo Coast Walk',
    username: 'Sasha Fernando',
    userAvatar: 'SF',
    description: "Explored Colombo's stunning coastline from the iconic Galle Face Green to Mount Lavinia. Walked through Pettah market, sampled street food, and watched the sunset over the Indian Ocean.",
    status: 'COMPLETED',
    location: 'Western Province',
    distance: '18 km',
    duration: '1 day',
    coverImage: '',
    createdAt: '2024-06-01',
    tags: ['City', 'Coastal', 'Food'],
    waypoints: [
      { id: 'w1', name: 'Galle Face Green', note: 'Massive oceanfront park — kite flying and street food everywhere', lat: 6.9120, lng: 79.8450, imageUrl: '', timestamp: '2024-06-01T09:00:00Z' },
      { id: 'w2', name: 'Pettah Market', note: 'Sensory overload in the best way — spices, colors, sounds', lat: 6.9356, lng: 79.8488, imageUrl: '', timestamp: '2024-06-01T11:00:00Z' },
      { id: 'w3', name: 'Colombo Lotus Tower', note: 'South Asia\'s tallest tower glowing at sunset', lat: 6.9217, lng: 79.8636, imageUrl: '', timestamp: '2024-06-01T17:00:00Z' },
      { id: 'w4', name: 'Mount Lavinia Beach', note: 'Golden sand, warm waves, fresh seafood', lat: 6.8297, lng: 79.8697, imageUrl: '', timestamp: '2024-06-01T19:00:00Z' },
    ],
    routeCoordinates: [
      [6.9120, 79.8450], [6.9300, 79.8470], [6.9356, 79.8488], [6.9217, 79.8636], [6.8700, 79.8650], [6.8297, 79.8697]
    ]
  },
  {
    id: '5',
    title: "Horton Plains & World's End",
    username: 'Anika Rajapaksa',
    userAvatar: 'AR',
    description: 'Hiked across the unique cloud forest plateau of Horton Plains National Park to reach World\'s End — an 880-meter sheer cliff drop. Early morning fog creates an otherworldly experience.',
    status: 'PLANNED',
    location: 'Nuwara Eliya District',
    distance: '54 km',
    duration: '2 days',
    coverImage: '',
    createdAt: '2024-07-20',
    tags: ['National Park', 'Wildlife', 'Cliffs'],
    waypoints: [
      { id: 'w1', name: 'Nuwara Eliya Town', note: 'Sri Lanka\'s "Little England" - charming colonial hill station', lat: 6.9497, lng: 80.7891, imageUrl: '', timestamp: '2024-07-20T06:00:00Z' },
      { id: 'w2', name: 'Horton Plains Entrance', note: 'Mist-covered moorland, sambar deer grazing peacefully', lat: 6.8012, lng: 80.8058, imageUrl: '', timestamp: '2024-07-20T09:00:00Z' },
      { id: 'w3', name: "World's End", note: '880m vertical drop — absolutely terrifying and breathtaking', lat: 6.7914, lng: 80.8009, imageUrl: '', timestamp: '2024-07-20T11:00:00Z' },
    ],
    routeCoordinates: [
      [6.9497, 80.7891], [6.8500, 80.8000], [6.8012, 80.8058], [6.7914, 80.8009]
    ]
  },
  {
    id: '6',
    title: 'Mirissa Whale Watching & Beach',
    username: 'Lakshan Mendis',
    userAvatar: 'LM',
    description: 'From the southern coast of Mirissa, set out early morning whale watching to spot blue whales — the world\'s largest animals — in their natural habitat off Sri Lanka\'s coast.',
    status: 'COMPLETED',
    location: 'Southern Province',
    distance: '65 km',
    duration: '2 days',
    coverImage: '',
    createdAt: '2024-02-10',
    tags: ['Wildlife', 'Ocean', 'Beach'],
    waypoints: [
      { id: 'w1', name: 'Galle Fort', note: 'UNESCO-listed Dutch colonial fort with ramparts over the ocean', lat: 6.0267, lng: 80.2170, imageUrl: '', timestamp: '2024-02-10T10:00:00Z' },
      { id: 'w2', name: 'Mirissa Beach', note: 'Crescent-shaped paradise beach with coconut trees', lat: 5.9483, lng: 80.4552, imageUrl: '', timestamp: '2024-02-10T15:00:00Z' },
      { id: 'w3', name: 'Whale Watching Point', note: 'Spotted 3 blue whales and 2 spinner dolphin pods!', lat: 5.8, lng: 80.4, imageUrl: '', timestamp: '2024-02-11T06:30:00Z' },
    ],
    routeCoordinates: [
      [6.0267, 80.2170], [5.9800, 80.3500], [5.9483, 80.4552], [5.8, 80.4]
    ]
  }
];
