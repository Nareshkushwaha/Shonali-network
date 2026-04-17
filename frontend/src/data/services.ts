import {
  Globe, Smartphone, Code2, Zap, Search, TrendingUp,
  Palette, Share2, Users, GraduationCap, ArrowRight,
  Layout, Database, ShoppingCart, FileText, Briefcase,
  BookOpen, Newspaper, Monitor, Server, Cpu,
  Bot, Workflow, BarChart3, Target, PenTool,
  Image, Video, Instagram, Youtube, MessageCircle,
  Megaphone, Award, School, Presentation
} from "lucide-react";

export interface SubService {
  id: string;
  title: string;
  description: string;
  features: string[];
  useCases: string[];
  pricingHint?: string;
  icon: any;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: any;
  gradient: string;
  subServices: SubService[];
}

export const services: Service[] = [
  {
    id: "1",
    slug: "website-development",
    title: "Website Development",
    shortDescription: "Custom, responsive websites that convert visitors into customers.",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-400",
    subServices: [
      { id: "ws1", title: "Static Website", description: "Fast, lightweight websites perfect for showcasing your brand with clean design and optimal performance.", features: ["Lightning fast load times", "SEO optimized", "Mobile responsive", "Custom design"], useCases: ["Portfolio sites", "Landing pages", "Company brochures"], pricingHint: "Starting from ₹15,000", icon: Layout },
      { id: "ws2", title: "Dynamic Website", description: "Interactive websites with real-time content updates and user-driven features.", features: ["CMS integration", "User authentication", "Real-time updates", "API integration"], useCases: ["News portals", "Community platforms", "Directory listings"], pricingHint: "Starting from ₹30,000", icon: Database },
      { id: "ws3", title: "E-commerce Website", description: "Full-featured online stores with payment integration and inventory management.", features: ["Payment gateway", "Inventory management", "Order tracking", "Multi-vendor support"], useCases: ["Online retail", "D2C brands", "Marketplace"], pricingHint: "Starting from ₹50,000", icon: ShoppingCart },
      { id: "ws4", title: "Blog Website", description: "Content-focused platforms with powerful publishing tools and SEO features.", features: ["Rich text editor", "Category management", "Comment system", "Social sharing"], useCases: ["Personal blogs", "Corporate blogs", "Magazine sites"], pricingHint: "Starting from ₹12,000", icon: FileText },
      { id: "ws5", title: "Portfolio Website", description: "Stunning showcase websites to highlight your work and attract clients.", features: ["Gallery layouts", "Case studies", "Testimonials", "Contact forms"], useCases: ["Photographers", "Designers", "Freelancers"], pricingHint: "Starting from ₹10,000", icon: Briefcase },
      { id: "ws6", title: "Business Website", description: "Professional corporate websites that establish credibility and drive growth.", features: ["Multi-page layout", "Team section", "Service showcase", "Lead generation"], useCases: ["Startups", "SMEs", "Enterprises"], pricingHint: "Starting from ₹25,000", icon: Monitor },
      { id: "ws7", title: "Education Website", description: "Learning management systems and educational platforms for institutions.", features: ["Course management", "Student portal", "Quiz system", "Certificate generation"], useCases: ["Schools", "Coaching centers", "Online courses"], pricingHint: "Starting from ₹40,000", icon: BookOpen },
      { id: "ws8", title: "News & Magazine Website", description: "High-traffic news portals with real-time publishing and multimedia support.", features: ["Breaking news ticker", "Category navigation", "Author profiles", "Ad management"], useCases: ["News agencies", "Digital magazines", "Media houses"], pricingHint: "Starting from ₹35,000", icon: Newspaper },
    ],
  },
  {
    id: "2",
    slug: "app-development",
    title: "App Development",
    shortDescription: "Native and cross-platform mobile apps that users love.",
    icon: Smartphone,
    gradient: "from-violet-500 to-purple-400",
    subServices: [
      { id: "ap1", title: "Android App", description: "Native Android applications built with Kotlin for optimal performance.", features: ["Material Design", "Push notifications", "Offline mode", "Play Store ready"], useCases: ["Business apps", "Social apps", "Utility apps"], pricingHint: "Starting from ₹60,000", icon: Smartphone },
      { id: "ap2", title: "iOS App", description: "Premium iOS applications designed for the Apple ecosystem.", features: ["Swift/SwiftUI", "Apple guidelines", "App Store ready", "iCloud sync"], useCases: ["Consumer apps", "Enterprise apps", "Health apps"], pricingHint: "Starting from ₹70,000", icon: Smartphone },
      { id: "ap3", title: "Cross-Platform App", description: "Build once, deploy everywhere with React Native or Flutter.", features: ["Single codebase", "Native performance", "Hot reload", "Cost effective"], useCases: ["Startups", "MVPs", "Multi-platform products"], pricingHint: "Starting from ₹80,000", icon: Code2 },
    ],
  },
  {
    id: "3",
    slug: "software-development",
    title: "Software Development",
    shortDescription: "Enterprise-grade software solutions tailored to your business.",
    icon: Code2,
    gradient: "from-emerald-500 to-teal-400",
    subServices: [
      { id: "sd1", title: "Custom CRM", description: "Customer relationship management systems built for your workflow.", features: ["Lead tracking", "Pipeline management", "Reporting", "Email integration"], useCases: ["Sales teams", "Real estate", "Agencies"], pricingHint: "Starting from ₹1,00,000", icon: Users },
      { id: "sd2", title: "ERP System", description: "Comprehensive enterprise resource planning for operational efficiency.", features: ["Inventory", "HR module", "Finance", "Multi-branch"], useCases: ["Manufacturing", "Retail chains", "Enterprises"], pricingHint: "Starting from ₹2,00,000", icon: Server },
      { id: "sd3", title: "SaaS Product", description: "Scalable software-as-a-service products ready for market.", features: ["Multi-tenancy", "Subscription billing", "API first", "Analytics"], useCases: ["Tech startups", "B2B products", "Platform businesses"], pricingHint: "Starting from ₹1,50,000", icon: Cpu },
    ],
  },
  {
    id: "4",
    slug: "automation",
    title: "Automation",
    shortDescription: "Streamline workflows and eliminate repetitive tasks with smart automation.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-400",
    subServices: [
      { id: "au1", title: "Workflow Automation", description: "Automate business processes to save time and reduce errors.", features: ["Process mapping", "Tool integration", "Trigger-based flows", "Monitoring"], useCases: ["Operations", "HR processes", "Sales pipelines"], pricingHint: "Starting from ₹25,000", icon: Workflow },
      { id: "au2", title: "Chatbot Development", description: "AI-powered chatbots for customer support and lead generation.", features: ["NLP powered", "Multi-channel", "Analytics", "Human handoff"], useCases: ["Customer support", "E-commerce", "Lead qualification"], pricingHint: "Starting from ₹30,000", icon: Bot },
      { id: "au3", title: "Email Automation", description: "Automated email sequences that nurture leads and drive conversions.", features: ["Drip campaigns", "Segmentation", "A/B testing", "Analytics"], useCases: ["Marketing teams", "E-commerce", "SaaS"], pricingHint: "Starting from ₹15,000", icon: MessageCircle },
    ],
  },
  {
    id: "5",
    slug: "seo",
    title: "SEO",
    shortDescription: "Dominate search rankings and drive organic traffic that converts.",
    icon: Search,
    gradient: "from-green-500 to-emerald-400",
    subServices: [
      { id: "se1", title: "On-Page SEO", description: "Optimize your website content and structure for search engines.", features: ["Keyword research", "Meta optimization", "Content strategy", "Schema markup"], useCases: ["All websites", "E-commerce", "Blogs"], pricingHint: "Starting from ₹10,000/mo", icon: FileText },
      { id: "se2", title: "Technical SEO", description: "Fix technical issues that prevent search engines from ranking your site.", features: ["Site audit", "Speed optimization", "Mobile-first", "Crawl fixes"], useCases: ["Large sites", "E-commerce", "News portals"], pricingHint: "Starting from ₹15,000/mo", icon: Code2 },
      { id: "se3", title: "Local SEO", description: "Dominate local search results and attract nearby customers.", features: ["GMB optimization", "Local citations", "Review management", "Local content"], useCases: ["Restaurants", "Clinics", "Retail stores"], pricingHint: "Starting from ₹8,000/mo", icon: Target },
    ],
  },
  {
    id: "6",
    slug: "performance-marketing",
    title: "Performance Marketing",
    shortDescription: "Data-driven campaigns that maximize ROI across all channels.",
    icon: TrendingUp,
    gradient: "from-rose-500 to-pink-400",
    subServices: [
      { id: "pm1", title: "Google Ads", description: "High-converting Google Ads campaigns that drive qualified traffic.", features: ["Search ads", "Display ads", "Shopping ads", "Remarketing"], useCases: ["E-commerce", "Lead gen", "Brand awareness"], pricingHint: "Starting from ₹20,000/mo + ad spend", icon: BarChart3 },
      { id: "pm2", title: "Meta Ads", description: "Facebook and Instagram advertising that reaches your ideal audience.", features: ["Audience targeting", "Creative testing", "Pixel tracking", "Lookalike audiences"], useCases: ["D2C brands", "Local business", "App installs"], pricingHint: "Starting from ₹15,000/mo + ad spend", icon: Target },
      { id: "pm3", title: "LinkedIn Ads", description: "B2B advertising on the world's largest professional network.", features: ["Account targeting", "InMail campaigns", "Lead forms", "ABM"], useCases: ["B2B companies", "SaaS", "Recruitment"], pricingHint: "Starting from ₹25,000/mo + ad spend", icon: Megaphone },
    ],
  },
  {
    id: "7",
    slug: "graphic-design",
    title: "Graphic Design",
    shortDescription: "Visual storytelling that captures attention and builds brands.",
    icon: Palette,
    gradient: "from-fuchsia-500 to-pink-400",
    subServices: [
      { id: "gd1", title: "Brand Identity", description: "Complete brand identity systems that make you unforgettable.", features: ["Logo design", "Brand guidelines", "Color palette", "Typography"], useCases: ["Startups", "Rebranding", "New products"], pricingHint: "Starting from ₹25,000", icon: PenTool },
      { id: "gd2", title: "Social Media Graphics", description: "Scroll-stopping social media creatives that drive engagement.", features: ["Post designs", "Story templates", "Carousel designs", "Ad creatives"], useCases: ["Brands", "Influencers", "Agencies"], pricingHint: "Starting from ₹8,000/mo", icon: Image },
      { id: "gd3", title: "Video Editing", description: "Professional video editing that tells your story compellingly.", features: ["Reels/Shorts", "Explainer videos", "Motion graphics", "Color grading"], useCases: ["YouTube creators", "Brands", "Education"], pricingHint: "Starting from ₹5,000/video", icon: Video },
    ],
  },
  {
    id: "8",
    slug: "social-media",
    title: "Social Media",
    shortDescription: "Strategic social media management that grows your community.",
    icon: Share2,
    gradient: "from-sky-500 to-blue-400",
    subServices: [
      { id: "sm1", title: "Instagram Management", description: "Full Instagram management including content, engagement, and growth.", features: ["Content calendar", "Hashtag strategy", "Community management", "Analytics"], useCases: ["Brands", "Personal brands", "E-commerce"], pricingHint: "Starting from ₹15,000/mo", icon: Instagram },
      { id: "sm2", title: "YouTube Management", description: "YouTube channel management from content strategy to optimization.", features: ["SEO titles", "Thumbnail design", "Publishing schedule", "Analytics"], useCases: ["Creators", "Brands", "Education"], pricingHint: "Starting from ₹20,000/mo", icon: Youtube },
      { id: "sm3", title: "LinkedIn Management", description: "Professional LinkedIn presence that establishes thought leadership.", features: ["Content strategy", "Engagement pods", "Profile optimization", "Newsletter"], useCases: ["CEOs", "B2B companies", "Coaches"], pricingHint: "Starting from ₹12,000/mo", icon: Briefcase },
    ],
  },
  {
    id: "9",
    slug: "influencer-marketing",
    title: "Influencer Marketing",
    shortDescription: "Connect with the right influencers to amplify your brand's reach.",
    icon: Users,
    gradient: "from-indigo-500 to-violet-400",
    subServices: [
      { id: "im1", title: "Micro Influencer Campaigns", description: "Targeted campaigns with niche micro-influencers for authentic engagement.", features: ["Influencer sourcing", "Campaign brief", "Content review", "Performance tracking"], useCases: ["D2C brands", "Local businesses", "App launches"], pricingHint: "Starting from ₹30,000/campaign", icon: Users },
      { id: "im2", title: "Celebrity Campaigns", description: "Large-scale campaigns with top-tier influencers and celebrities.", features: ["Talent negotiation", "Content production", "Multi-platform", "PR amplification"], useCases: ["National brands", "Product launches", "Events"], pricingHint: "Custom pricing", icon: Award },
      { id: "im3", title: "UGC Campaigns", description: "User-generated content campaigns that build trust and social proof.", features: ["Creator network", "Content guidelines", "Rights management", "Distribution"], useCases: ["E-commerce", "Food brands", "Fashion"], pricingHint: "Starting from ₹20,000/campaign", icon: Video },
    ],
  },
  {
    id: "10",
    slug: "education-services",
    title: "Education Services",
    shortDescription: "Digital learning solutions and training programs for growth.",
    icon: GraduationCap,
    gradient: "from-teal-500 to-cyan-400",
    subServices: [
      { id: "ed1", title: "LMS Development", description: "Custom learning management systems for educational institutions.", features: ["Course builder", "Assessment engine", "Progress tracking", "Certificates"], useCases: ["Schools", "Corporate training", "Online academies"], pricingHint: "Starting from ₹80,000", icon: School },
      { id: "ed2", title: "Digital Marketing Training", description: "Comprehensive digital marketing training programs for teams.", features: ["Live sessions", "Hands-on projects", "Certification", "Mentorship"], useCases: ["Marketing teams", "Students", "Career changers"], pricingHint: "Starting from ₹15,000/person", icon: Presentation },
      { id: "ed3", title: "Corporate Training", description: "Custom training programs tailored to your organization's needs.", features: ["Needs assessment", "Custom curriculum", "Workshop format", "Follow-up support"], useCases: ["Enterprises", "Startups", "NGOs"], pricingHint: "Custom pricing", icon: GraduationCap },
    ],
  },
];

export const getServiceBySlug = (slug: string) => services.find(s => s.slug === slug);
