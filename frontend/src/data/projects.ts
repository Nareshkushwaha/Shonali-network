export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Web" | "App" | "Marketing" | "Design";
  image: string;
  tags: string[];
}

export const projects: Project[] = [
  { id: "1", title: "TechFlow SaaS Dashboard", description: "A comprehensive analytics dashboard with real-time data visualization and team collaboration features.", category: "Web", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", tags: ["React", "Dashboard", "SaaS"] },
  { id: "2", title: "FoodieApp Delivery", description: "Cross-platform food delivery app with real-time tracking, payments, and restaurant management.", category: "App", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80", tags: ["React Native", "Mobile", "E-commerce"] },
  { id: "3", title: "GreenLeaf Brand Identity", description: "Complete brand identity for an eco-friendly startup including logo, guidelines, and collateral.", category: "Design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80", tags: ["Branding", "Logo", "Identity"] },
  { id: "4", title: "CloudSync E-commerce", description: "High-performance e-commerce platform handling 10K+ daily orders with multi-vendor support.", category: "Web", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", tags: ["E-commerce", "Next.js", "Stripe"] },
  { id: "5", title: "UrbanFit Campaign", description: "360° digital marketing campaign generating 5x ROAS across Google and Meta platforms.", category: "Marketing", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80", tags: ["Google Ads", "Meta Ads", "SEO"] },
  { id: "6", title: "MediCare Health App", description: "Telemedicine app connecting patients with doctors featuring video calls and prescriptions.", category: "App", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", tags: ["Flutter", "Health", "Video"] },
  { id: "7", title: "Luxe Interiors Website", description: "Stunning portfolio website for a luxury interior design firm with 3D gallery showcase.", category: "Web", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80", tags: ["Portfolio", "3D", "Luxury"] },
  { id: "8", title: "FinGrow Social Campaign", description: "Viral social media campaign that grew followers from 2K to 150K in 3 months.", category: "Marketing", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80", tags: ["Social Media", "Growth", "Content"] },
  { id: "9", title: "ArtStudio Design System", description: "Comprehensive design system with 200+ components for a creative agency.", category: "Design", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80", tags: ["Design System", "UI Kit", "Figma"] },
];

export const categories = ["All", "Web", "App", "Marketing", "Design"] as const;
