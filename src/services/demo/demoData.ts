// Centralized demo data for all personas

export interface PersonaData {
  id: string;
  name: string;
  role: string;
  department: string;
  company?: string;
  workSchedule?: string;
  yearsOfService?: string;
  healthScore: number;
  pointsEarned?: number;
  roiSavings: number;
  nextAppointment?: string;
  overdueCare?: string[];
  upcomingShifts?: string[];
  benefitsUsed?: string;
  lastPhysical?: string;
  // HR Admin specific
  employeeCount?: number;
  unrealizedBenefits?: number;
  avgHealthScore?: number;
  totalSavings?: number;
  participationRate?: string;
  avgSavingsPerEmployee?: number;
  absenteeismReduction?: number;
  costReduction?: number;
}

export const personaData: Record<string, PersonaData> = {
  nurse: {
    id: 'nurse-jessica',
    name: 'Jessica Martinez',
    role: 'ICU Nurse',
    department: 'Critical Care',
    workSchedule: '3x12 hour shifts (7am-7pm)',
    yearsOfService: '4 years',
    healthScore: 76,
    pointsEarned: 420,
    lastPhysical: 'March 2024',
    overdueCare: ['Eye Exam', 'Dental Cleaning'],
    upcomingShifts: ['Tue 7a-7p', 'Wed 7a-7p', 'Thu 7a-7p'],
    benefitsUsed: '$850 of $2,500 annual allowance',
    roiSavings: 1840,
    nextAppointment: 'Annual Physical - May 28, 2025, 10:30 AM'
  },
  
  doctor: {
    id: 'doctor-chen',
    name: 'Dr. Michael Chen',
    role: 'Emergency Physician',
    department: 'Emergency Medicine',
    workSchedule: 'Variable shifts (7a-7p / 7p-7a)',
    yearsOfService: '8 years',
    healthScore: 68,
    pointsEarned: 290,
    lastPhysical: 'January 2024',
    overdueCare: ['Colonoscopy', 'Cardiac Stress Test'],
    upcomingShifts: ['Mon 7p-7a', 'Thu 7p-7a', 'Sat 7a-7p'],
    benefitsUsed: '$1,240 of $3,200 annual allowance',
    roiSavings: 3150,
    nextAppointment: 'Dermatology Check - June 12, 2025, 2:00 PM'
  },
  
  hrAdmin: {
    id: 'hr-sarah',
    name: 'Sarah Williams',
    role: 'Benefits Director',
    department: 'Human Resources',
    company: 'Acme Corporation',
    employeeCount: 412,
    unrealizedBenefits: 182500,
    avgHealthScore: 78,
    totalSavings: 406720,
    participationRate: '328/412 employees',
    avgSavingsPerEmployee: 1240,
    absenteeismReduction: 27,
    costReduction: 16,
    healthScore: 78,
    roiSavings: 406720
  }
};

export interface DemoStep {
  title: string;
  description: string;
  feature?: string;
  insights?: string[];
}

export const demoSteps: Record<string, DemoStep[]> = {
  nurse: [
    { 
      title: "Meet Jessica", 
      description: "ICU Nurse with typical healthcare worker challenges",
      insights: ["Healthcare workers often delay their own care", "Shift schedules conflict with medical appointments"]
    },
    { 
      title: "Health Score", 
      description: "Personalized health tracking designed for shift workers",
      feature: "health_score",
      insights: ["Gamification increases engagement by 40%", "Visual progress tracking motivates continued use"]
    },
    { 
      title: "Next Action", 
      description: "AI-powered recommendations for optimal care timing",
      feature: "next_action",
      insights: ["AI considers work schedule, benefits, and health priorities", "Reduces decision fatigue for busy workers"]
    },
    { 
      title: "ROI Tracking", 
      description: "Personal savings from preventative care",
      feature: "roi_tracker",
      insights: ["Personal financial impact drives engagement", "Average savings: $1,800 per healthcare worker"]
    },
    { 
      title: "Smart Timeline", 
      description: "Care coordination that fits work schedules",
      feature: "care_timeline",
      insights: ["Reduces appointment scheduling time by 65%", "Integrates with shift schedules automatically"]
    }
  ],
  
  doctor: [
    { 
      title: "Meet Dr. Chen", 
      description: "Emergency physician with demanding schedule and health challenges",
      insights: ["Physicians have 40% higher rates of delayed preventative care", "ER doctors work unpredictable schedules"]
    },
    { 
      title: "Health Score Alert", 
      description: "Score showing impact of missed preventative care",
      feature: "health_score",
      insights: ["Red alerts for urgent overdue care", "Professional accountability increases compliance"]
    },
    { 
      title: "ROI Impact", 
      description: "Significant savings potential for high earners",
      feature: "roi_tracker",
      insights: ["Higher earners have greater potential savings", "Early detection can save $50K+ in serious conditions"]
    },
    { 
      title: "Urgent Action", 
      description: "High-priority recommendations for busy physicians",
      feature: "urgent_action",
      insights: ["Age and risk-factor based prioritization", "Clear escalation for overdue screenings"]
    },
    { 
      title: "Schedule Integration", 
      description: "Smart coordination around unpredictable ER shifts",
      feature: "care_timeline",
      insights: ["Accounts for on-call schedules", "Flexible rescheduling for emergency situations"]
    }
  ],
  
  hrAdmin: [
    { 
      title: "Meet Sarah", 
      description: "HR Benefits Director managing 412 employees at Acme Corporation",
      insights: ["HR leaders need clear ROI metrics", "Benefits utilization averages only 63%"]
    },
    { 
      title: "Full Dashboard View", 
      description: "All three key features expanded to show complete capabilities",
      insights: ["Comprehensive view enables strategic decision making", "Real-time data supports executive reporting"]
    },
    { 
      title: "Benefits Optimization", 
      description: "$182,500 in unrealized benefits value - here's how to capture it",
      feature: "benefits_optimization",
      insights: ["37% of benefits budget goes unused", "Targeted interventions can recapture 40% of unrealized value"]
    },
    { 
      title: "Health Metrics", 
      description: "Department performance gaps reveal targeted intervention opportunities",
      feature: "health_metrics",
      insights: ["18-point gap between departments indicates intervention needs", "Role-specific programs show 3x better results"]
    },
    { 
      title: "ROI Analysis", 
      description: "Proven $406,720 savings with specific performance metrics",
      feature: "roi_analysis",
      insights: ["3.2:1 ROI on preventative care investment", "Full participation could increase savings to $515K annually"]
    },
    { 
      title: "Preventative Care", 
      description: "28% skin check completion represents largest improvement opportunity",
      feature: "preventative_care",
      insights: ["Dermatology screenings have highest early detection value", "Bringing to 65% completion would save $95K annually"]
    }
  ]
};

export const competitorData = [
  {
    name: 'Virgin Pulse',
    category: 'Corporate Wellness',
    strengths: ['Large enterprise base', 'Comprehensive platform'],
    weaknesses: ['Not healthcare-specific', 'Complex implementation'],
    pricing: '$5-12/employee/month',
    marketShare: 15,
    rating: 3.2
  },
  {
    name: 'WebMD Health Services', 
    category: 'Health Engagement',
    strengths: ['Medical content expertise', 'Healthcare brand'],
    weaknesses: ['Expensive', 'Limited mobile'],
    pricing: '$8-15/employee/month',
    marketShare: 12,
    rating: 3.5
  },
  {
    name: 'Thrive Global',
    category: 'Wellness & Behavior',
    strengths: ['Behavior change focus', 'Modern UX'],
    weaknesses: ['No healthcare specificity', 'Limited analytics'],
    pricing: '$6-10/employee/month',
    marketShare: 5,
    rating: 4.1
  }
];

export const industryBenchmarks = {
  healthcare: {
    avgHealthcareCost: 14500,
    absenteeismDays: 9.2,
    turnoverRate: 18,
    preventativeCareCompliance: 64
  },
  manufacturing: {
    avgHealthcareCost: 13200,
    absenteeismDays: 8.1,
    turnoverRate: 12,
    preventativeCareCompliance: 58
  },
  technology: {
    avgHealthcareCost: 11800,
    absenteeismDays: 5.4,
    turnoverRate: 22,
    preventativeCareCompliance: 71
  }
};

export function getPersonaData(personaId: string): PersonaData | null {
  return personaData[personaId] || null;
}

export function getDemoSteps(personaId: string): DemoStep[] {
  return demoSteps[personaId] || [];
}

export function calculateROI(employeeCount: number, industry: string = 'healthcare'): {
  healthcareSavings: number;
  productivityGains: number;
  totalSavings: number;
  roi: number;
} {
  const benchmark = industryBenchmarks[industry as keyof typeof industryBenchmarks] || industryBenchmarks.healthcare;
  const programCost = employeeCount * 40; // $40 per employee annually
  
  const healthcareSavings = benchmark.avgHealthcareCost * employeeCount * 0.18; // 18% reduction
  const productivityGains = employeeCount * 65000 * 0.11 / 260 * 260; // 11% productivity improvement
  const totalSavings = healthcareSavings + productivityGains;
  const roi = ((totalSavings - programCost) / programCost) * 100;
  
  return {
    healthcareSavings,
    productivityGains,
    totalSavings,
    roi
  };
}