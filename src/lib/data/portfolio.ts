import { ContactInfo, Experience, Skill, Project } from "@/types/portfolio";
import DefaultResumeData from "@/components/resume-builder/utility/DefaultResumeData";

// Derive contact info from DefaultResumeData
const linkedInProfile = DefaultResumeData.socialMedia.find(s => s.socialMedia === "LinkedIn");
const githubProfile = DefaultResumeData.socialMedia.find(s => s.socialMedia === "Github");
const websiteProfile = DefaultResumeData.socialMedia.find(s => s.socialMedia === "Website");

// Extract location from address (e.g., "24-242 John Garland Blvd, Toronto, ON M9V 1N8" -> "Toronto, ON 🇨🇦")
const extractLocation = (address: string): string => {
  const match = address.match(/,\s*([^,]+),\s*([A-Z]{2})/);
  if (match) {
    const city = match[1].trim();
    const province = match[2].trim();
    return `${city}, ${province} 🇨🇦`;
  }
  return "Toronto, ON 🇨🇦"; // Fallback
};

export const contactInfo: ContactInfo = {
  name: DefaultResumeData.name,
  title: DefaultResumeData.position,
  location: extractLocation(DefaultResumeData.address),
  phone: DefaultResumeData.contactInformation,
  email: DefaultResumeData.email,
  github: githubProfile?.link || "",
  linkedin: linkedInProfile?.link || "",
  website: websiteProfile?.link || "",
  calendar: DefaultResumeData.calendarLink || ""
};

// Use summary from DefaultResumeData
export const summary = DefaultResumeData.summary;

// Convert skills from DefaultResumeData format to portfolio format
export const skills: Skill[] = DefaultResumeData.skills.map(skillGroup => ({
  category: skillGroup.title,
  items: skillGroup.skills.map(s => s.text)
}));

// Helper function to format date range
function formatDateRange(startDate: string, endDate: string): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "Present") return dateStr;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const start = formatDate(startDate);
  const end = endDate === "Present" ? "Present" : formatDate(endDate);
  return `${start} - ${end}`;
}

// Convert work experience from DefaultResumeData
export const experience: Experience[] = DefaultResumeData.workExperience.map(job => ({
  title: job.position,
  company: job.company,
  location: "", // Not displayed on main website
  duration: formatDateRange(job.startYear, job.endYear),
  summary: job.description, // Company/role description
  description: job.keyAchievements.split('\n').filter(h => h.trim()),
  technologies: job.technologies || []
}));

export const projects: Project[] = [
  {
    name: "AI Infrastructure & Model Deployment Platform",
    description: "Micro-SaaS platform providing image and video manipulation services through optimized AI model inference APIs",
    technologies: ["Google Vertex AI", "Kubernetes", "Docker", "StableDiffusion", "FLUX", "OAuth2.0"],
    highlights: [
      "Deployed production-ready inference APIs for multiple AI models",
      "Achieved reduced computational overhead with improved response times",
      "Implemented secure MCP Server Gateways with OAuth2.0 authentication"
    ]
  },
  {
    name: "Homeweb.ca Portal",
    description: "Employee and Family Assistance Program portal for corporations, built with MEAN stack and migrated to React",
    technologies: ["ReactJS", "NextJS", "Node.js", "MongoDB", "SAML2", "OAuth2.0"],
    highlights: [
      "Successfully migrated from AngularJS to ReactJS",
      "Integrated with multiple identity providers using SAML2",
      "Scaled MongoDB infrastructure to Atlas with high availability"
    ]
  },
  {
    name: "Brilliant Rewards Platform",
    description: "Comprehensive hospitality business software suite with digital loyalty program and marketing tools",
    technologies: ["AngularJS", "Node.js", "Express", "LoopBack", "Ionic", "OAuth2.0"],
    highlights: [
      "Led development of 4 cross-platform applications and 7 web portals",
      "Implemented RESTful API backend with microservices architecture",
      "Built native and cross-platform mobile applications"
    ]
  }
];