import dbConnect from '@/lib/db';
import HeritageSite from './src/models/HeritageSite';
import { SiteType, SiteScale, SiteStatus } from './src/types/heritage';

const sites = [
  {
    name: "Taj Mahal",
    type: SiteType.TOMB,
    scale: SiteScale.MAJOR,
    position: [27.1751, 78.0421],
    description: "An ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Hampi Ruins",
    type: SiteType.RUIN,
    scale: SiteScale.MAJOR,
    position: [15.3350, 76.4600],
    description: "The capital of the Vijayanagara Empire in the 14th century. Hampi is a UNESCO World Heritage Site located in east-central Karnataka, India.",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Chand Baori",
    type: SiteType.STEPWELL,
    scale: SiteScale.MINOR,
    position: [27.0071, 76.6063],
    description: "A stepwell built over a thousand years ago in the Abhaneri village of Rajasthan. It is one of the largest and deepest stepwells in the world.",
    image: "https://images.unsplash.com/photo-1596395819057-e37f55a85199?q=80&w=1974&auto=format&fit=crop",
    category: "Hidden Gem"
  },
  {
    name: "Gwalior Fort",
    type: SiteType.FORT,
    scale: SiteScale.REGIONAL,
    position: [26.2313, 78.1695],
    description: "A hill fort near Gwalior, Madhya Pradesh, central India. The fort has existed at least since the 10th century, and the inscriptions and monuments found within what is now the fort campus indicate that it may have existed as early as the beginning of the 6th century.",
    image: "https://images.unsplash.com/photo-1621245844839-23469a93077e?q=80&w=2070&auto=format&fit=crop",
    category: "Regional Pride"
  },
  {
    name: "Bhimbetka Caves",
    type: SiteType.CAVE,
    scale: SiteScale.REGIONAL,
    position: [22.9372, 77.5833],
    description: "An archaeological site in central India that spans the prehistoric Paleolithic and Mesolithic periods, as well as the historic period. It exhibits the earliest traces of human life on the Indian subcontinent.",
    image: "https://images.unsplash.com/photo-1616149176161-460d3d523616?q=80&w=1974&auto=format&fit=crop",
    category: "Pre-historic Site"
  },
  {
    name: "Adalaj Stepwell",
    type: SiteType.STEPWELL,
    scale: SiteScale.MINOR,
    position: [23.1667, 72.5851],
    description: "A stepwell in the village of Adalaj, close to Ahmedabad in Gandhinagar district in the Indian state of Gujarat, and considered a fine example of Indian architecture.",
    image: "https://images.unsplash.com/photo-1596395819057-e37f55a85199?q=80&w=1974&auto=format&fit=crop",
    category: "Architectural Marvel"
  },
  // Adding more to reach ~50
  {
    name: "Qutub Minar",
    type: SiteType.OTHER,
    scale: SiteScale.MAJOR,
    position: [28.5244, 77.1855],
    description: "A minaret and 'victory tower' that forms part of the Qutb complex, a UNESCO World Heritage Site in the Mehrauli area of New Delhi, India.",
    image: "https://images.unsplash.com/photo-1585506942812-e72b29cef752?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Amer Fort",
    type: SiteType.FORT,
    scale: SiteScale.MAJOR,
    position: [26.9855, 75.8513],
    description: "A fort located in Amer, Rajasthan, India. Amer is a town with an area of 4 square kilometres located 11 kilometres from Jaipur, the capital of Rajasthan.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop",
    category: "Fortress"
  },
  {
    name: "Ajanta Caves",
    type: SiteType.CAVE,
    scale: SiteScale.MAJOR,
    position: [20.5519, 75.7489],
    description: "Approximately 30 rock-cut Buddhist cave monuments which date from the 2nd century BCE to about 480 CE in Aurangabad district of Maharashtra state of India.",
    image: "https://images.unsplash.com/photo-1612115327224-759217855aa7?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Ellora Caves",
    type: SiteType.CAVE,
    scale: SiteScale.MAJOR,
    position: [20.0258, 75.1780],
    description: "A UNESCO World Heritage Site located in the Aurangabad district of Maharashtra, India. It is one of the largest rock-cut monastery-temple cave complexes in the world.",
    image: "https://images.unsplash.com/photo-1612115327224-759217855aa7?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Sun Temple, Konark",
    type: SiteType.TEMPLE,
    scale: SiteScale.MAJOR,
    position: [19.8876, 86.0945],
    description: "A 13th-century CE Sun Temple at Konark about 35 kilometres northeast from Puri on the coastline of Odisha, India.",
    image: "https://images.unsplash.com/photo-1615594056157-e61298cc6c9d?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Khajuraho Group of Monuments",
    type: SiteType.TEMPLE,
    scale: SiteScale.MAJOR,
    position: [24.8318, 79.9199],
    description: "A group of Hindu and Jain temples in Chhatarpur district, Madhya Pradesh, India, about 175 kilometres southeast of Jhansi.",
    image: "https://images.unsplash.com/photo-1621245844839-23469a93077e?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Humayun's Tomb",
    type: SiteType.TOMB,
    scale: SiteScale.MAJOR,
    position: [28.5933, 77.2507],
    description: "The tomb of the Mughal Emperor Humayun in Delhi, India. The tomb was commissioned by Humayun's first wife and chief consort, Empress Bega Begum, in 1558.",
    image: "https://images.unsplash.com/photo-1599661046289-e31887846eac?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Meenakshi Temple",
    type: SiteType.TEMPLE,
    scale: SiteScale.MAJOR,
    position: [9.9195, 78.1193],
    description: "A historic Hindu temple located on the southern bank of the Vaigai River in the temple city of Madurai, Tamil Nadu, India.",
    image: "https://images.unsplash.com/photo-1615594056157-e61298cc6c9d?q=80&w=2070&auto=format&fit=crop",
    category: "Religious Center"
  },
  {
    name: "Fatehpur Sikri",
    type: SiteType.OTHER,
    scale: SiteScale.MAJOR,
    position: [27.0945, 77.6679],
    description: "A town in the Agra District of Uttar Pradesh, India. Previously the city's name was Vijaypur Sikari, of the Sikarwar Rajput clan; the later city was founded by Mughal Emperor Akbar.",
    image: "https://images.unsplash.com/photo-1599661046289-e31887846eac?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Gateway of India",
    type: SiteType.OTHER,
    scale: SiteScale.REGIONAL,
    position: [18.9220, 72.8347],
    description: "An arch-monument built during the 20th century in Bombay, India. The monument was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder.",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1935&auto=format&fit=crop",
    category: "Colonial Heritage"
  },
  {
    name: "Sanchi Stupa",
    type: SiteType.OTHER,
    scale: SiteScale.MAJOR,
    position: [23.4807, 77.7363],
    description: "A Buddhist complex, famous for its Great Stupa, on a hilltop at Sanchi Town in Raisen District of the State of Madhya Pradesh, India.",
    image: "https://images.unsplash.com/photo-1616149176161-460d3d523616?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Gol Gumbaz",
    type: SiteType.TOMB,
    scale: SiteScale.REGIONAL,
    position: [16.8302, 75.7362],
    description: "The mausoleum of king Mohammed Adil Shah, Sultan of Bijapur. Completed in 1656 by the architect Yaqut of Dabul.",
    image: "https://images.unsplash.com/photo-1599661046289-e31887846eac?q=80&w=2070&auto=format&fit=crop",
    category: "Indo-Islamic Architecture"
  },
  {
    name: "Chittorgarh Fort",
    type: SiteType.FORT,
    scale: SiteScale.MAJOR,
    position: [24.8879, 74.6451],
    description: "The largest fort in India. It is a UNESCO World Heritage Site. The fort was the capital of Mewar and is located in the present-day town of Chittorgarh.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop",
    category: "Fortress"
  },
  {
    name: "Brihadisvara Temple",
    type: SiteType.TEMPLE,
    scale: SiteScale.MAJOR,
    position: [10.7828, 79.1318],
    description: "A Hindu temple dedicated to Shiva located in Thanjavur, Tamil Nadu, India. It is one of the largest South Indian temples and an exemplary example of fully realized Dravidian architecture.",
    image: "https://images.unsplash.com/photo-1615594056157-e61298cc6c9d?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Shore Temple",
    type: SiteType.TEMPLE,
    scale: SiteScale.REGIONAL,
    position: [12.6164, 80.1921],
    description: "Built with blocks of granite, dating from the 8th century AD. It is located on the shore of the Bay of Bengal in Mahabalipuram, Tamil Nadu.",
    image: "https://images.unsplash.com/photo-1615594056157-e61298cc6c9d?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Rani ki Vav",
    type: SiteType.STEPWELL,
    scale: SiteScale.MAJOR,
    position: [23.8584, 72.1022],
    description: "A stepwell situated in the town of Patan in Gujarat state of India. It is located on the banks of Saraswati River.",
    image: "https://images.unsplash.com/photo-1596395819057-e37f55a85199?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Jaisalmer Fort",
    type: SiteType.FORT,
    scale: SiteScale.MAJOR,
    position: [26.9124, 70.9123],
    description: "Situated in the city of Jaisalmer, in the Indian state of Rajasthan. It is believed to be one of the very few 'living forts' in the world.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Elephanta Caves",
    type: SiteType.CAVE,
    scale: SiteScale.REGIONAL,
    position: [18.9633, 72.9315],
    description: "A UNESCO World Heritage Site and a collection of cave temples predominantly dedicated to the Hindu god Shiva.",
    image: "https://images.unsplash.com/photo-1612115327224-759217855aa7?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  },
  {
    name: "Red Fort",
    type: SiteType.FORT,
    scale: SiteScale.MAJOR,
    position: [28.6562, 77.2410],
    description: "A historic fort in the city of Delhi in India that served as the main residence of the Mughal Emperors.",
    image: "https://images.unsplash.com/photo-1585506942812-e72b29cef752?q=80&w=1974&auto=format&fit=crop",
    category: "UNESCO World Heritage"
  }
];

async function seed() {
  console.log("Connecting to DB...");
  await dbConnect();
  
  for (const siteData of sites) {
    const exists = await HeritageSite.findOne({ name: siteData.name });
    if (!exists) {
      console.log(`Adding ${siteData.name}...`);
      await HeritageSite.create({
        ...siteData,
        status: SiteStatus.APPROVED
      });
    } else {
      console.log(`${siteData.name} already exists. Skipping.`);
    }
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
