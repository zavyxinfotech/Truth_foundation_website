import { Campaign, DonationOption, FAQItem, GalleryItem, MonthlyGivingOptions, Testimonial } from '../types';
import heroChildLongingMeal from '../assets/images/hero_child_longing_meal.jpg?w=800&format=webp';
import heroRedhillsOrphanage from '../assets/images/hero_redhills_orphanage.jpg?w=800&format=webp';
import heroSpecialNeedsCare from '../assets/images/hero_special_needs_care.jpg?w=800&format=webp';
import heroTuitionSchoolMeals from '../assets/images/hero_tuition_school_meals.jpg?w=800&format=webp';
import elderlyFoodCareDrive from '../assets/images/elderly_food_care_drive.jpg?w=800&format=webp';

import HealthCampsImg from '../assets/images/img293.jpg?w=400;800&format=webp;jpg&as=picture';
import covidCampsImg from '../assets/images/img299.jpg?w=400;800&format=webp;jpg&as=picture';
import servingMealsImg from '../assets/images/img155.jpg?w=400;800&format=webp;jpg&as=picture';
import culturalFestivalImg from '../assets/images/img191.jpg?w=400;800&format=webp;jpg&as=picture';
import schoolKitsImg from '../assets/images/img125.jpg?w=400;800&format=webp;jpg&as=picture';
import happyChildrenMealsImg from '../assets/images/img71.jpg?w=400;800&format=webp;jpg&as=picture';
import sandhiyaAvatar from '../assets/images/sandhiya_avatar.jpg?w=96&format=webp';

export const DEFAULT_MONTHLY_GIVING: MonthlyGivingOptions = {
  enabled: true,
  suggestedAmounts: [300, 500, 1000, 2500],
  defaultAmount: 500,
  perks: [
    'Automated monthly donation receipts',
    'Quarterly photo & video progress reports on WhatsApp',
    'Cancel, pause, or adjust your recurring amount anytime'
  ],
  impactDescription: 'Sustained monthly support helps Truth Foundation plan long-term kitchen operations and guarantee wholesome meals for children every single day.'
};

export const CURRENT_CAMPAIGN: Campaign = {
  id: 'truth-foundation-drive',
  title: 'Truth Foundation Comprehensive Care Drive',
  subtitle: 'Your support empowers 45 orphaned children, 20 abandoned elders, 23 special-needs children, and 346 tuition students.',
  tagline: 'Public Charitable Trust (Est. 5th July 2010)',
  heroImage: heroChildLongingMeal,
  targetMeals: 100000,
  mealsServed: 58420,
  donorsCount: 12480,
  minAmount: 100,
  suggestedAmounts: [100, 500, 1000, 2500, 5000],
  badge: 'Registered Public Charitable Trust (Est. 2010)',
  description: 'Launched on 5th July 2010, Truth Foundation (A Public Charitable Trust) operates an Orphanage in rural Redhills Chennai, an Old Age Day Care Home, a Special School for mentally retarded children in Thiruvallur, and 8 Free Evening Tuition Centers serving 346+ children with education, food, and hygiene supplies.',
  monthlyOptions: DEFAULT_MONTHLY_GIVING
};

export const FUTURE_CAMPAIGNS: Campaign[] = [
  {
    id: 'orphanage-home-redhills',
    title: 'Redhills Orphanage & Child Care',
    subtitle: 'Provide food, shelter, dormitories, education, and love to 45 resident boys and girls in Redhills.',
    tagline: 'Our Campus in Redhills, Chennai',
    heroImage: heroRedhillsOrphanage,
    targetMeals: 50000,
    mealsServed: 32400,
    donorsCount: 6840,
    minAmount: 500,
    suggestedAmounts: [500, 1000, 2500, 5000, 10000],
    badge: '15+ Years Orphanage Home',
    description: 'Our Redhills campus features separate dormitories, study halls, playgrounds, and dining facilities for 45 children managed by 16 committed staff members.',
    monthlyOptions: DEFAULT_MONTHLY_GIVING
  },
  {
    id: 'rural-education-center',
    title: 'Rural Learning & Educational Support',
    subtitle: 'Providing educational resources, learning aids, and transport for children across Thiruvallur.',
    tagline: 'Thiruvallur District',
    heroImage: heroSpecialNeedsCare,
    targetMeals: 30000,
    mealsServed: 14200,
    donorsCount: 3120,
    minAmount: 300,
    suggestedAmounts: [300, 600, 1200, 2500, 5000],
    badge: 'Educational Support & Care',
    description: 'Dedicated educators and volunteers provide tailored learning support and doorstep transport for underprivileged children across rural communities.',
    monthlyOptions: {
      ...DEFAULT_MONTHLY_GIVING,
      suggestedAmounts: [300, 600, 1200, 2500],
      defaultAmount: 600,
      impactDescription: 'Sustained monthly support fuels educational materials, learning tools, and transport support for rural children.'
    }
  },
  {
    id: 'old-age-care-center',
    title: 'Old Age Home & Senior Care Center',
    subtitle: 'Nourishment, shelter, daily medication, and dignity for 20 abandoned street seniors in Redhills.',
    tagline: 'Care for Abandoned Elders',
    heroImage: elderlyFoodCareDrive,
    targetMeals: 40000,
    mealsServed: 19800,
    donorsCount: 4120,
    minAmount: 500,
    suggestedAmounts: [500, 1500, 3000, 7500],
    badge: 'Senior Day Care & Shelter',
    description: 'Providing food, shelter, periodic medical checkups, and loving care to 20 elderly citizens left destitute on streets by family members.',
    monthlyOptions: DEFAULT_MONTHLY_GIVING
  },
  {
    id: 'evening-tuition-centers',
    title: 'Child Care & Evening Tuition Centers',
    subtitle: 'Free tuition, daily nutrition, notebooks, bags, and hygiene kits for 346 children across 8 centers.',
    tagline: 'Chennai & Thiruvallur Districts',
    heroImage: heroTuitionSchoolMeals,
    targetMeals: 60000,
    mealsServed: 34100,
    donorsCount: 5210,
    minAmount: 300,
    suggestedAmounts: [300, 1000, 2000, 5000],
    badge: '346 Enrolled Children',
    description: 'Operating in Vyasarpadi, Pulianthope, Surapattu, Periyapalem, Vichoor, Perungavoor, Athipattu, and Thirumullaivoyal with dedicated volunteer educators.',
    monthlyOptions: DEFAULT_MONTHLY_GIVING
  }
];

export const DONATION_PRESETS: DonationOption[] = [
  {
    amount: 100,
    meals: 1,
    label: '₹100',
    description: 'Provides 1 warm, protein-rich meal to a child in need.'
  },
  {
    amount: 500,
    meals: 5,
    label: '₹500',
    description: 'Provides 5 warm nutritious meals to children.',
    popular: true
  },
  {
    amount: 1000,
    meals: 10,
    label: '₹1,000',
    description: 'Provides 10 nutritious meals to underprivileged kids.'
  },
  {
    amount: 2500,
    meals: 25,
    label: '₹2,500',
    description: 'Provides 25 warm meals + essential classroom learning support.'
  },
  {
    amount: 5000,
    meals: 50,
    label: '₹5,000',
    description: 'Sponsors 50 warm meals + hygiene kits for an entire classroom.'
  }
];

export const FAQS: FAQItem[] = [
  {
    category: 'About Truth Foundation',
    question: 'When was Truth Foundation established and what is its objective?',
    answer: 'TRUTH FOUNDATION was launched on 5th July 2010 as a Public Charitable Trust. Our primary mission is creating a new social order by educating marginalized rural women, men, children, and youth from Dalit and Tribal communities on their rights, decision-making, skill development, and human dignity.'
  },
  {
    category: 'Centers & Locations',
    question: 'Where are Truth Foundation centers and projects located?',
    answer: 'Our Orphanage Home (for 45 boys & girls) and Old Age Home (for 20 elders) operate on an acre of land in rural Redhills, Northern Chennai (#244 Mallima Nagar, Vilagadupakkam). Our rural education initiatives support children across Thiruvallur District with dedicated educational materials and transport. Our 8 Evening Tuition Centers serve 346 children across Vyasarpadi, Pulianthope, Surapattu, Periyapalem, Vichoor, Perungavoor, Athipattu, and Thirumullaivoyal.'
  },
  {
    category: 'Donations & Utilization',
    question: 'Where does my donation go?',
    answer: '100% of your donation directly supports 45 orphaned children, 20 abandoned elders, rural students, and 346 evening tuition children. Funds cover fresh grain, cooked meals, school supplies (bags, notebooks, pens), hygiene kits (soap, shampoo, toothbrush, footwear), medical care, and van transportation.'
  },
  {
    category: 'Security & Receipts',
    question: 'Is payment secure and will I receive a donation receipt?',
    answer: 'Yes! All transactions are processed through Razorpay\'s secure encrypted payment gateway. You will receive an instant official donation receipt on your email and WhatsApp immediately after contribution.'
  },
  {
    category: 'Volunteering & Visits',
    question: 'Can I visit the Redhills campus or centers to volunteer?',
    answer: 'Yes! We warmly welcome donors and volunteers to visit our Redhills Orphanage campus, Old Age Home, or Thiruvallur centers. You can volunteer for teaching, spending time with elders, or distributing evening tuition kits. Call 044-26511661 or WhatsApp +91 63827 21178 to schedule a visit.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sandhiya',
    role: 'Donor',
    location: 'Chennai',
    avatar: sandhiyaAvatar,
    comment: 'I have donated one day food for the children\'s and old ages peoples.... They are very happie when they are seeing foods... Im really blessed with these people\'s... Thanks for this opportunity.... Especially meera was so kind and dedicated person... Thank u so much 🙏😌🙏',
    rating: 5,
    date: '10 months ago',
    verified: true,
    donatedAmount: '1 Day Meals'
  },
  {
    id: 't2',
    name: 'Rosey D\'Souza',
    role: 'Donor',
    location: 'Chennai',
    avatar: 'https://ui-avatars.com/api/?name=Rosey+D&background=5a4fcb&color=fff&size=150',
    comment: 'Happy to c the children and have a great time with these kids . May god bless those kids and best service...... Thanks u volunteer give a such a wonderful opportunity.....',
    rating: 5,
    date: '4 years ago',
    verified: true
  },
  {
    id: 't3',
    name: 'B Leema',
    role: 'Volunteer',
    location: 'Chennai',
    avatar: 'https://ui-avatars.com/api/?name=B+Leema&background=5a9d44&color=fff&size=150',
    comment: 'The place were so peaceful and happy to see the children. Its was good time to spending with those children. They are going good service.had a great time',
    rating: 5,
    date: '4 years ago',
    verified: true
  },
  {
    id: 't4',
    name: 'Vedesh Vedesh',
    role: 'Donor',
    location: 'Chennai',
    avatar: 'https://ui-avatars.com/api/?name=Vedesh+Vedesh&background=f59e0b&color=fff&size=150',
    comment: 'On my birthday I spent time with these God childrens..Very happy to see this children\'s.. good place and good response..',
    rating: 5,
    date: '4 years ago',
    verified: true
  },
  {
    id: 't5',
    name: 'Narayani karthik',
    role: 'Donor',
    location: 'Chennai',
    avatar: 'https://ui-avatars.com/api/?name=Narayani+karthik&background=0288d1&color=fff&size=150',
    comment: 'I love this place and children\'s.... I have wondering experience.... I spend time to children\'s...... Thank u for giving a biggest opportunity......',
    rating: 5,
    date: '4 years ago',
    verified: true
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Truth Foundation Orphanage Home Campus',
    category: 'Meals',
    image: servingMealsImg,
    location: 'Redhills, Northern Chennai',
    date: 'Est. 15+ Years (Active)',
    description: 'Dedicated campus on an acre of land providing separate dormitories, study halls, playgrounds, and nutritious dining for 45 boys and girls.',
    quote: '“Let decisions of the people be based on values of social justice, equality, truth, freedom and dignity.”',
    aspectRatio: 'tall',
    impactStat: { label: 'Residents', value: '45 Children' },
    beneficiaries: '16 Staff Members',
    readTime: '3 min read',
    storyDetails: 'Functioning for over 15 years in rural Redhills, Chennai, TRUTH FOUNDATION operates on about an acre of land equipped with separate dormitories, hygienic bathrooms, dining halls, and playgrounds for boys and girls. Cared for by 16 committed full-time and part-time staff members, the orphanage is sustained through compassionate philanthropists.'
  },
  {
    id: 'g3',
    title: 'Rural Learning & Educational Support',
    category: 'Education',
    image: schoolKitsImg,
    location: 'Thiruvallur District',
    date: 'Ongoing Initiative',
    description: 'Tailored educational programs, learning aids, and free door-step van transportation for rural children.',
    quote: '“Bringing hope and educational opportunities to children across rural Thiruvallur households.”',
    aspectRatio: 'square',
    impactStat: { label: 'Rural Students', value: 'Over 100 Children' },
    beneficiaries: 'Free Transportation',
    readTime: '3 min read',
    storyDetails: 'Truth Foundation stepped forward to establish specialized educational support for rural children in Thiruvallur. Dedicated transport picks up children from their rural homes and brings them to learning centers safely, where educators provide continuous learning, skill development, and guidance.'
  },
  {
    id: 'g4',
    title: 'Free Evening Tuition & Child Care Centers',
    category: 'Volunteers',
    image: happyChildrenMealsImg,
    location: 'Vyasarpadi, Surapattu, Perungavoor & 5 Centers',
    date: 'Daily Evening Support',
    description: 'Free evening tuition, wholesome meals, stationery kits, and hygiene supplies for 346 underprivileged children across 8 centers.',
    quote: '“Nourishing young minds with free tuition, textbooks, backpacks, stationeries, and personal hygiene kits.”',
    aspectRatio: 'tall',
    impactStat: { label: 'Tuition Students', value: '346 Children' },
    beneficiaries: '8 Rural & Slum Centers',
    readTime: '2 min read',
    storyDetails: 'Truth Foundation conducts free evening child care centers across Vyasarpadi, Pulianthope, and Surapattu in Chennai, as well as Periyapalem, Vichoor, Perungavoor, Athipattu, and Thirumullaivoyal in Thiruvallur. 346 children receive free tuition, nutritious meals, school bags, notebooks, textbooks, pens, and hygiene supplies like soap, shampoo, and footwear.'
  },
  {
    id: 'g5',
    title: 'Annual Cultural Festival & Government Dignitaries',
    category: 'Events',
    image: culturalFestivalImg,
    location: 'Perungavoor Village, Redhills, Chennai',
    date: 'December 25 (Annual)',
    description: 'Grand cultural program celebrated with community members, state ministers, MPs, MLAs, and TV coverage.',
    quote: '“Celebrating community harmony, talent growth, and equal opportunities for rural youth.”',
    aspectRatio: 'wide',
    impactStat: { label: 'TV Broadcast', value: 'Makkal & Thanthi TV' },
    beneficiaries: '1,000+ Villagers',
    readTime: '2 min read',
    storyDetails: 'Our annual Christmas & Cultural Festival at Perungavoor Village Redhills brings together hundreds of children and elders. Esteemed chief guests include Hon’ble Minister Thiru. B.V. Ramana (Minister for Dairy Development), Thiru. M. Prakash (Chairman, Minority Commission), M.P. Thiru. P. Venugopal, and M.L.A. Mr. V. Moorthy. The event was broadcast on Makkal TV and Thanthi TV.'
  },
  {
    id: 'g6',
    title: 'HIV/AIDS & Rural Health Awareness Drives',
    category: 'Medical',
    image: HealthCampsImg,
    location: 'Redhills Bypass & Rural Thiruvallur',
    date: 'Weekly Women SHG Meetings',
    description: 'Public health demonstrations, AIDS awareness rallies at Redhills Bypass, medical camps, and environmental sanitation education.',
    quote: '“Empowering rural women and youth to break social stigmas and maintain disease-free households.”',
    aspectRatio: 'square',
    impactStat: { label: 'Health Camps', value: 'Weekly SHGs' },
    beneficiaries: 'Rural Women & Youth',
    readTime: '2 min read',
    storyDetails: 'Truth Foundation conducts weekly health input sessions in rural women self-help groups. We invite medical experts and social advocates to conduct HIV/AIDS awareness rallies at Redhills Bypass, organize free health screening camps, and educate families on mosquito and vector control to eliminate malaria and dengue.'
  },
  {
    id: 'g7',
    title: 'COVID-19 Relief Across 4 Districts',
    category: 'Events',
    image: covidCampsImg,
    location: 'Thiruvallur, Kanchipuram, Chengalpattu & Chennai',
    date: '25,000+ People Served',
    description: 'Distributing food packets, dry ration kits, sanitation items, and clothing to blind, elderly, leprosy, gypsy, and transgender communities.',
    quote: '“Reaching the most vulnerable marginalized communities during crisis without hesitation.”',
    aspectRatio: 'tall',
    impactStat: { label: 'Relief Served', value: '25,000+ People' },
    beneficiaries: '4 Districts in TN',
    readTime: '3 min read',
    storyDetails: 'During COVID-19 lockdowns, Truth Foundation deployed emergency teams across Thiruvallur, Kanchipuram, Chengalpattu, and Chennai. We supplied food packets, water bottles, sanitation kits, rice bags, provision kits, and clothing specifically prioritizing visually impaired individuals, elderly persons, leprosy-affected families, gypsy communities, and transgender persons.'
  }
];

export const LIVE_DONATION_TICKER = [
  { name: 'Rajesh K.', location: 'Chennai', amount: '₹1,000', time: '2 mins ago' },
  { name: 'Dr. Smita V.', location: 'Coimbatore', amount: '₹2,500', time: '4 mins ago' },
  { name: 'Karan M.', location: 'Madurai', amount: '₹500', time: '6 mins ago' },
  { name: 'Neha P.', location: 'Chennai', amount: '₹5,000', time: '11 mins ago' },
  { name: 'Sunil G.', location: 'Thiruvallur', amount: '₹100', time: '14 mins ago' }
];
