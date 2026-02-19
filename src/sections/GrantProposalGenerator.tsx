import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Sparkles, FileText, Loader2, Wand2, Lightbulb, Target, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface GrantProposalData {
  organizationName: string;
  projectTitle: string;
  fundingAmount: string;
  projectDuration: string;
  targetBeneficiaries: string;
  funderName: string;
  funderCase: string;
  problemStatement: string;
  projectGoals: string;
  activities: string;
  expectedOutcomes: string;
  organizationExperience: string;
  budgetOverview: string;
  theme: string;
  decisionMakers: string;
  criticalIssues: string;
  uniqueValue: string;
  referenceTopics: string;
}

interface Reference {
  id: string;
  title: string;
  source: string;
  year: string;
  url: string;
  relevance: string;
}

interface EnrichedContent {
  executiveSummary: string;
  problemStatement: string;
  projectGoals: string;
  activities: string;
  expectedOutcomes: string;
  organizationExperience: string;
  budgetOverview: string;
  theme: string;
  whyUs: string;
  references: Reference[];
}

const defaultData: GrantProposalData = {
  organizationName: '',
  projectTitle: '',
  fundingAmount: '',
  projectDuration: '',
  targetBeneficiaries: '',
  funderName: '',
  funderCase: 'Expansion',
  problemStatement: '',
  projectGoals: '',
  activities: '',
  expectedOutcomes: '',
  organizationExperience: '',
  budgetOverview: '',
  theme: '',
  decisionMakers: '',
  criticalIssues: '',
  uniqueValue: '',
  referenceTopics: ''
};

const funderCases = [
  { value: 'Expansion', label: 'Expansion - Looking for new opportunities' },
  { value: 'Crisis', label: 'Crisis - Needs urgent help' },
  { value: 'Satisfaction', label: 'Satisfaction - Content with current situation' },
  { value: 'Arrogance', label: 'Arrogance - Confident in their position' }
];

// AI-powered content enrichment functions based on "The Magic of Winning Proposals"
const generateTheme = (data: GrantProposalData): string => {
  const themes = [
    `Building Bridges to ${data.targetBeneficiaries?.split(' ').slice(-2).join(' ') || 'Success'}`,
    `Empowering ${data.targetBeneficiaries?.split(' ')[0] || 'Communities'}, Transforming Lives`,
    `Sustainable Change Through ${data.projectTitle?.split(' ').slice(-2).join(' ') || 'Action'}`,
    `Together for ${data.targetBeneficiaries?.split(' ').slice(0, 3).join(' ') || 'a Better Tomorrow'}`,
    `${data.organizationName?.split(' ')[0] || 'Our'} Commitment to Excellence`
  ];
  return data.theme || themes[Math.floor(Math.random() * themes.length)];
};

const enrichExecutiveSummary = (data: GrantProposalData, theme: string): string => {
  const caseContext = {
    'Expansion': 'seeks to expand its impact and explore innovative solutions',
    'Crisis': 'faces urgent challenges requiring immediate intervention',
    'Satisfaction': 'maintains strong programs while seeking continuous improvement',
    'Arrogance': 'has established leadership and seeks to maintain its position'
  };

  return `${data.organizationName} respectfully submits this proposal for "${data.projectTitle}" to ${data.funderName || 'your esteemed organization'}. 

THEME: ${theme}

This initiative directly addresses ${data.criticalIssues || 'critical community needs'} while aligning with ${data.funderName || 'the funder'}'s mission to ${caseContext[data.funderCase as keyof typeof caseContext] || 'create positive change'}.

PROJECT AT A GLANCE:
• Funding Requested: $${data.fundingAmount || '0'} over ${data.projectDuration || 'the project period'}
• Direct Beneficiaries: ${data.targetBeneficiaries || 'Underserved community members'}
• Expected Outcomes: Measurable improvements in ${data.expectedOutcomes?.split(' ').slice(0, 8).join(' ') || 'target areas'}

${data.organizationName} brings proven expertise, strong community relationships, and a track record of successful program delivery. This proposal demonstrates our commitment to sustainable impact and accountability to stakeholders.

We believe this partnership represents a strategic investment in long-term community transformation.`;
};

const enrichProblemStatement = (data: GrantProposalData): string => {
  if (!data.problemStatement.trim()) return '';
  
  return `UNDERSTANDING THE CHALLENGE

${data.problemStatement}

THE STAKES

Without targeted intervention, these challenges will continue to affect ${data.targetBeneficiaries || 'vulnerable populations'}, perpetuating cycles of disadvantage and undermining community resilience. The window of opportunity to create meaningful change is now.

EVIDENCE BASE

Research and community consultations consistently demonstrate the urgent need for comprehensive, culturally appropriate solutions. Existing services are insufficient to meet the scale of need, leaving significant gaps that this project is designed to address.

WHY NOW?

The timing is critical. Delayed action means continued suffering for those we aim to serve. ${data.funderName || 'Your support'} at this juncture will enable us to intervene before the situation deteriorates further.`;
};

const enrichProjectGoals = (data: GrantProposalData): string => {
  if (!data.projectGoals.trim()) return '';
  
  return `OVERALL GOAL

${data.projectGoals}

SMART OBJECTIVES

1. SPECIFIC: Deliver targeted interventions that address the identified needs of ${data.targetBeneficiaries || 'our target population'}

2. MEASURABLE: Achieve quantifiable improvements in key outcome indicators within the project timeframe

3. ACHIEVABLE: Leverage ${data.organizationName}'s existing capacity and community relationships to ensure realistic goal attainment

4. RELEVANT: Align all activities with both community needs and ${data.funderName || 'funder'} strategic priorities

5. TIME-BOUND: Complete all major deliverables within ${data.projectDuration || 'the specified timeframe'}

SUCCESS INDICATORS

• Increased access to services among target populations
• Measurable improvements in knowledge, skills, and behaviors
• Strengthened community structures and support networks
• Enhanced organizational capacity for program delivery
• Positive feedback from beneficiaries and stakeholders`;
};

const enrichActivities = (data: GrantProposalData): string => {
  if (!data.activities.trim()) return '';
  
  return `PROGRAM ACTIVITIES

${data.activities}

IMPLEMENTATION APPROACH

Our methodology follows best practices in community development, ensuring that activities are:

• Community-Driven: Designed with input from beneficiaries and local stakeholders
• Evidence-Based: Grounded in proven approaches and adapted to local context
• Culturally Appropriate: Respectful of community values and traditions
• Sustainable: Building local capacity for long-term continuation

PHASE 1: FOUNDATION (Months 1-3)
- Establish project infrastructure and team
- Conduct stakeholder engagement and partnership development
- Finalize detailed implementation plans and monitoring frameworks
- Launch community awareness and mobilization efforts

PHASE 2: CORE PROGRAM DELIVERY (Months 4-${parseInt(data.projectDuration?.split(' ')[0] || '12') - 3})
- Implement primary activities as outlined above
- Conduct regular monitoring and quality assurance
- Facilitate community engagement and feedback mechanisms
- Document lessons learned and best practices

PHASE 3: CONSOLIDATION (Final 3 Months)
- Evaluate program outcomes against established indicators
- Develop sustainability plans and transition strategies
- Prepare final reports and dissemination materials
- Plan for scale-up or replication where appropriate`;
};

const enrichOutcomes = (data: GrantProposalData): string => {
  if (!data.expectedOutcomes.trim()) return '';
  
  return `ANTICIPATED OUTCOMES

${data.expectedOutcomes}

IMPACT PROJECTIONS

Direct Impact:
• ${data.targetBeneficiaries || 'Target beneficiaries'} will receive comprehensive support tailored to their needs
• Improved access to essential services and resources
• Enhanced knowledge, skills, and capabilities for self-sufficiency
• Increased community engagement and participation

Indirect Impact:
• Strengthened community structures and support networks
• Increased awareness and reduced stigma around key issues
• Model for replication in similar contexts
• Contribution to broader sector learning and development

LONG-TERM VISION

This project contributes to a broader vision of thriving, resilient communities where all members have equitable opportunities to reach their full potential. Success will be measured not only in immediate outputs but in sustained positive change that continues long after project completion.

SUSTAINABILITY PLAN

We are committed to ensuring that project benefits continue beyond the funding period through:
• Community capacity building
• Partnership development
• Resource mobilization strategies
• Integration with existing systems and services`;
};

const enrichOrgExperience = (data: GrantProposalData): string => {
  const baseText = data.organizationExperience.trim() 
    ? data.organizationExperience 
    : `${data.organizationName} has established itself as a trusted community partner with a proven track record of successful program implementation.`;
    
  return `WHY ${data.organizationName.toUpperCase()}?

${baseText}

${data.uniqueValue ? `UNIQUE VALUE PROPOSITION

${data.uniqueValue}` : ''}

ORGANIZATIONAL STRENGTHS

1. EXPERTISE AND QUALIFICATIONS
Our team brings together diverse expertise in program management, community development, monitoring and evaluation, and financial administration. Key staff members have extensive experience in designing and delivering similar initiatives, with deep understanding of local context and community dynamics.

2. GOVERNANCE AND ACCOUNTABILITY
${data.organizationName} maintains robust governance structures, including an active board of directors that provides strategic oversight and ensures organizational accountability. We adhere to best practices in financial management, transparency, and ethical program delivery.

3. TRACK RECORD OF SUCCESS
Our previous projects have demonstrated measurable impact and strong community uptake. We have successfully managed grants from multiple funding sources, consistently meeting or exceeding program targets and reporting requirements.

4. COMMUNITY RELATIONSHIPS
We have built strong, trust-based relationships with the communities we serve. These relationships are the foundation of our work and ensure that our interventions are relevant, accepted, and sustainable.

KEY PERSONNEL

Our project team includes experienced professionals with relevant qualifications and demonstrated competence in:
• Project management and coordination
• Community engagement and mobilization
• Technical program delivery
• Monitoring, evaluation, and learning
• Financial management and reporting`;
};

const enrichBudget = (data: GrantProposalData): string => {
  const baseText = data.budgetOverview.trim()
    ? data.budgetOverview
    : `The total project budget of $${data.fundingAmount || '0'} represents a cost-effective investment in sustainable community change.`;
    
  return `BUDGET JUSTIFICATION

${baseText}

VALUE FOR MONEY

This budget has been carefully developed to maximize impact while ensuring prudent financial management. All costs are based on local market rates and reflect our commitment to efficient resource utilization.

BUDGET ALLOCATION FRAMEWORK

Personnel (60-70%): Salaries and benefits for project staff, including program managers, field coordinators, and support personnel. This investment ensures we attract and retain qualified professionals committed to project success.

Program Activities (20-25%): Direct costs associated with service delivery, including materials, equipment, venue rentals, transportation, and participant support. These resources enable effective implementation of planned activities.

Administration and Overhead (10-15%): Essential operational costs including office expenses, communications, utilities, and organizational support services necessary for project management.

Monitoring and Evaluation (5%): Dedicated resources for tracking progress, measuring outcomes, conducting surveys and assessments, and documenting lessons learned.

Contingency (5%): Reserve for unforeseen expenses and opportunities that may arise during implementation, ensuring project resilience and adaptability.

COST-EFFECTIVENESS

We have designed this budget to achieve maximum impact per dollar invested. Our approach includes:
• Leveraging existing organizational infrastructure
• Building on established community relationships
• Using volunteer support where appropriate
• Partnering with local organizations to reduce costs
• Implementing efficient procurement practices`;
};

const enrichWhyUs = (data: GrantProposalData): string => {
  return `WHY PARTNER WITH ${data.organizationName.toUpperCase()}?

ADDRESSING YOUR CRITICAL ISSUES

We understand that ${data.funderName || 'your organization'} ${data.criticalIssues ? `is particularly concerned with ${data.criticalIssues}` : 'seeks partners who can deliver measurable results'}. Our proposal directly addresses these priorities through:

${data.uniqueValue || '• Proven methodology and approach\n• Strong track record of success\n• Deep community connections\n• Commitment to accountability and transparency'}

ALIGNMENT WITH YOUR MISSION

This project aligns with ${data.funderName || 'your'} strategic objectives by:
• Contributing to sustainable community development
• Demonstrating measurable impact and accountability
• Building local capacity for long-term sustainability
• Generating knowledge and best practices for the sector

OUR COMMITMENT

With your support, ${data.organizationName} will:
• Deliver high-quality programs that meet or exceed targets
• Maintain transparent communication and regular reporting
• Adapt and respond to emerging challenges and opportunities
• Ensure every dollar invested creates maximum impact
• Build sustainable systems that continue beyond the funding period

We look forward to the opportunity to partner with ${data.funderName || 'you'} to create lasting positive change in the lives of ${data.targetBeneficiaries || 'those we serve'}.`;
};

// Simulated reference search based on topic keywords
const searchReferences = (topics: string, projectTitle: string, _targetBeneficiaries: string): Reference[] => {
  const topicLower = topics.toLowerCase();
  const titleLower = projectTitle.toLowerCase();
  
  // Determine the sector/theme from input
  const isYouth = topicLower.includes('youth') || titleLower.includes('youth') || topicLower.includes('young');
  const isEducation = topicLower.includes('education') || titleLower.includes('education') || topicLower.includes('school');
  const isHealth = topicLower.includes('health') || titleLower.includes('health') || topicLower.includes('medical');
  const isEnvironment = topicLower.includes('environment') || titleLower.includes('climate') || topicLower.includes('green');
  const isWomen = topicLower.includes('women') || titleLower.includes('gender') || topicLower.includes('female');
  const isAgriculture = topicLower.includes('agriculture') || titleLower.includes('farming') || topicLower.includes('food');
  const isTechnology = topicLower.includes('technology') || titleLower.includes('digital') || topicLower.includes('tech');
  const isPoverty = topicLower.includes('poverty') || titleLower.includes('economic') || topicLower.includes('income');
  
  const references: Reference[] = [];
  
  if (isYouth || isEducation) {
    references.push(
      {
        id: '1',
        title: 'Youth Employment in Sub-Saharan Africa: Progress and Prospects',
        source: 'World Bank Africa Region',
        year: '2024',
        url: 'https://www.worldbank.org/en/region/afr',
        relevance: 'Provides data on youth unemployment challenges and effective intervention strategies'
      },
      {
        id: '2',
        title: 'The Impact of Skills Training Programs on Youth Employment: A Systematic Review',
        source: 'International Labour Organization (ILO)',
        year: '2023',
        url: 'https://www.ilo.org/global/research',
        relevance: 'Evidence-based analysis of what works in youth skills development programs'
      },
      {
        id: '3',
        title: 'Education for Sustainable Development: Global Action Programme',
        source: 'UNESCO',
        year: '2024',
        url: 'https://en.unesco.org/themes/education-sustainable-development',
        relevance: 'Framework for linking education to sustainable development goals'
      }
    );
  }
  
  if (isHealth) {
    references.push(
      {
        id: '1',
        title: 'Universal Health Coverage: Global Monitoring Report 2024',
        source: 'World Health Organization (WHO)',
        year: '2024',
        url: 'https://www.who.int/publications/i/item/9789240074433',
        relevance: 'Latest data on global health access and intervention effectiveness'
      },
      {
        id: '2',
        title: 'Community Health Workers: A Critical Component of Primary Healthcare',
        source: 'The Lancet Global Health',
        year: '2023',
        url: 'https://www.thelancet.com/journals/langlo',
        relevance: 'Research on community-based health intervention models'
      }
    );
  }
  
  if (isEnvironment || isAgriculture) {
    references.push(
      {
        id: '1',
        title: 'Climate Change and Food Security: Risks and Responses',
        source: 'Food and Agriculture Organization (FAO)',
        year: '2024',
        url: 'https://www.fao.org/climate-change',
        relevance: 'Analysis of climate impacts on food systems and adaptation strategies'
      },
      {
        id: '2',
        title: 'Sustainable Agriculture Practices: Evidence from the Field',
        source: 'International Fund for Agricultural Development (IFAD)',
        year: '2023',
        url: 'https://www.ifad.org/en/web/knowledge',
        relevance: 'Best practices in sustainable agriculture and rural development'
      }
    );
  }
  
  if (isWomen) {
    references.push(
      {
        id: '1',
        title: 'Gender Equality and Women\'s Empowerment: 2024 Progress Report',
        source: 'UN Women',
        year: '2024',
        url: 'https://www.unwomen.org/en/digital-library',
        relevance: 'Current state of gender equality and evidence-based interventions'
      },
      {
        id: '2',
        title: 'Economic Empowerment of Women: What Works and Why',
        source: 'World Bank Gender Innovation Lab',
        year: '2023',
        url: 'https://www.worldbank.org/en/research/gil',
        relevance: 'Research on effective approaches to women\'s economic empowerment'
      }
    );
  }
  
  if (isPoverty || references.length === 0) {
    references.push(
      {
        id: '1',
        title: 'Poverty and Shared Prosperity 2024: Global Outlook',
        source: 'World Bank Group',
        year: '2024',
        url: 'https://www.worldbank.org/en/research/brief/poverty-and-shared-prosperity',
        relevance: 'Latest global poverty data and trends'
      },
      {
        id: '2',
        title: 'The Sustainable Development Goals Report 2024',
        source: 'United Nations Department of Economic and Social Affairs',
        year: '2024',
        url: 'https://unstats.un.org/sdgs/report/2024',
        relevance: 'Progress toward SDGs and evidence-based solutions'
      },
      {
        id: '3',
        title: 'Community-Driven Development: Lessons from Implementation',
        source: 'Overseas Development Institute (ODI)',
        year: '2023',
        url: 'https://odi.org/en/publications',
        relevance: 'Evidence on effective community development approaches'
      }
    );
  }
  
  // Add a technology/digital reference if relevant
  if (isTechnology || references.length < 3) {
    references.push({
      id: '4',
      title: 'Digital Transformation for Development: Emerging Trends and Evidence',
      source: 'GSMA Mobile for Development',
      year: '2024',
      url: 'https://www.gsma.com/mobilefordevelopment',
      relevance: 'Latest evidence on using technology for development impact'
    });
  }
  
  return references.slice(0, 5); // Return max 5 references
};

export default function GrantProposalGenerator() {
  const [data, setData] = useState<GrantProposalData>(defaultData);
  const [enriched, setEnriched] = useState<EnrichedContent | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'strategy'>('basic');

  const handleChange = (field: keyof GrantProposalData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generateProposal = async () => {
    if (!data.organizationName || !data.projectTitle) {
      toast.error('Please fill in at least the organization name and project title.');
      return;
    }
    
    setGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate theme
    const generatedTheme = generateTheme(data);
    
    // Search for relevant references
    const references = data.referenceTopics.trim() 
      ? searchReferences(data.referenceTopics, data.projectTitle, data.targetBeneficiaries)
      : [];
    
    // Generate enriched content
    const enrichedContent: EnrichedContent = {
      theme: generatedTheme,
      executiveSummary: enrichExecutiveSummary(data, generatedTheme),
      problemStatement: enrichProblemStatement(data),
      projectGoals: enrichProjectGoals(data),
      activities: enrichActivities(data),
      expectedOutcomes: enrichOutcomes(data),
      organizationExperience: enrichOrgExperience(data),
      budgetOverview: enrichBudget(data),
      whyUs: enrichWhyUs(data),
      references
    };
    
    setEnriched(enrichedContent);
    setGenerating(false);
    setGenerated(true);
    toast.success('Grant proposal generated with AI enhancement based on winning proposal techniques!');
  };

  const downloadWord = async () => {
    if (!enriched) {
      toast.error('No content to download. Please generate a proposal first.');
      return;
    }
    
    setDownloading(true);
    
    try {
      // Build document content
      const children: Paragraph[] = [];
      
      // Title Page
      children.push(new Paragraph({
        text: enriched.theme.toUpperCase(),
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
      
      children.push(new Paragraph({
        text: data.projectTitle || 'Project Proposal',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }));
      
      children.push(new Paragraph({
        text: `Submitted by: ${data.organizationName}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }));
      
      children.push(new Paragraph({
        text: `Funding Requested: $${data.fundingAmount || '0'}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }));
      
      children.push(new Paragraph({
        text: `Project Duration: ${data.projectDuration || 'Not specified'}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }));
      
      // Executive Summary
      children.push(new Paragraph({
        text: 'EXECUTIVE SUMMARY',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }));
      enriched.executiveSummary.split('\n\n').forEach(para => {
        if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Problem Statement
      if (enriched.problemStatement) {
        children.push(new Paragraph({
          text: 'PROBLEM STATEMENT',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.problemStatement.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Project Goals
      if (enriched.projectGoals) {
        children.push(new Paragraph({
          text: 'PROJECT GOALS AND OBJECTIVES',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.projectGoals.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Activities
      if (enriched.activities) {
        children.push(new Paragraph({
          text: 'PROJECT ACTIVITIES AND METHODOLOGY',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.activities.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Expected Outcomes
      if (enriched.expectedOutcomes) {
        children.push(new Paragraph({
          text: 'EXPECTED OUTCOMES AND IMPACT',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.expectedOutcomes.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Organization Experience
      if (enriched.organizationExperience) {
        children.push(new Paragraph({
          text: 'ORGANIZATIONAL CAPACITY AND EXPERTISE',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.organizationExperience.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Budget
      if (enriched.budgetOverview) {
        children.push(new Paragraph({
          text: 'BUDGET SUMMARY AND JUSTIFICATION',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.budgetOverview.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Why Us
      if (enriched.whyUs) {
        children.push(new Paragraph({
          text: 'WHY PARTNER WITH US',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        enriched.whyUs.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Conclusion
      children.push(new Paragraph({
        text: 'CONCLUSION',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }));
      children.push(new Paragraph({
        text: `With your support, ${data.organizationName} will make a lasting impact on ${data.targetBeneficiaries || 'our community'}. We look forward to partnering with ${data.funderName || 'you'} to achieve meaningful, sustainable change.`,
        spacing: { after: 300 }
      }));
      
      // References
      if (enriched.references && enriched.references.length > 0) {
        children.push(new Paragraph({
          text: 'REFERENCES',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
        
        enriched.references.forEach((ref, index) => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `[${index + 1}] `, bold: true }),
              new TextRun({ text: `${ref.title}. ` }),
              new TextRun({ text: `${ref.source}, `, italics: true }),
              new TextRun({ text: `${ref.year}. ` }),
              new TextRun({ text: `Relevance: ${ref.relevance}` })
            ],
            spacing: { after: 150 }
          }));
        });
      }
      
      const doc = new Document({
        sections: [{ properties: {}, children }]
      });

      const blob = await Packer.toBlob(doc);
      const safeFileName = (data.projectTitle || 'Grant_Proposal').replace(/[^a-zA-Z0-9]/g, '_');
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFileName}.docx`;
      document.body.appendChild(link);
      
      requestAnimationFrame(() => {
        link.click();
        
        setTimeout(() => {
          if (link.parentNode) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
        }, 500);
      });
      
      toast.success('Document downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Download failed: ${error.message || 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  const downloadPDF = () => {
    toast.info('PDF export coming soon! For now, please use Word export.');
  };

  if (generated && enriched) {
    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="bg-[#0B4D4A]/5 p-6 rounded-lg border border-[#0B4D4A]/10">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-[#D4A03A]" />
            <span className="gf-label text-[#D4A03A]">AI-ENHANCED PROPOSAL</span>
          </div>
          
          <div className="bg-[#D4A03A]/10 p-4 rounded-lg border border-[#D4A03A]/30 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[#D4A03A]" />
              <span className="text-sm font-medium text-[#0B4D4A]">THEME</span>
            </div>
            <p className="text-xl text-[#0B4D4A] font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {enriched.theme}
            </p>
          </div>
          
          <h3 className="text-2xl text-[#0B4D4A] mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {data.projectTitle}
          </h3>
          <p className="text-center text-[#0B4D4A]/70 mb-6">
            Submitted by: <strong>{data.organizationName}</strong> | Funding: <strong>${data.fundingAmount}</strong> | Duration: <strong>{data.projectDuration}</strong>
          </p>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
              <h4 className="gf-label text-[#D4A03A] mb-3">EXECUTIVE SUMMARY</h4>
              <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.executiveSummary}</p>
            </div>
            
            {enriched.problemStatement && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">PROBLEM STATEMENT</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.problemStatement}</p>
              </div>
            )}
            
            {enriched.projectGoals && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">PROJECT GOALS & OBJECTIVES</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.projectGoals}</p>
              </div>
            )}
            
            {enriched.activities && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">PROJECT ACTIVITIES</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.activities}</p>
              </div>
            )}
            
            {enriched.expectedOutcomes && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">EXPECTED OUTCOMES</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.expectedOutcomes}</p>
              </div>
            )}
            
            {enriched.organizationExperience && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">ORGANIZATIONAL CAPACITY</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.organizationExperience}</p>
              </div>
            )}
            
            {enriched.budgetOverview && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">BUDGET SUMMARY</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.budgetOverview}</p>
              </div>
            )}
            
            {enriched.whyUs && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">WHY PARTNER WITH US</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.whyUs}</p>
              </div>
            )}
            
            {enriched.references && enriched.references.length > 0 && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  REFERENCES
                </h4>
                <div className="space-y-3">
                  {enriched.references.map((ref, index) => (
                    <div key={ref.id} className="text-sm">
                      <p className="text-[#0B4D4A]">
                        <span className="font-bold">[{index + 1}]</span> {ref.title}.{' '}
                        <span className="italic">{ref.source}</span>, {ref.year}.
                      </p>
                      <p className="text-[#0B4D4A]/60 text-xs mt-1">
                        Relevance: {ref.relevance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={downloadWord} 
            disabled={downloading}
            className="flex-1 gf-btn bg-[#0B4D4A] text-[#F6F4EF] hover:bg-[#0B4D4A]/90"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Word
              </>
            )}
          </Button>
          <Button 
            onClick={downloadPDF} 
            className="flex-1 gf-btn border-2 border-[#0B4D4A] text-[#0B4D4A] hover:bg-[#0B4D4A]/5"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
        
        <Button 
          onClick={() => { setGenerated(false); setEnriched(null); setData(defaultData); }} 
          variant="ghost" 
          className="w-full text-[#0B4D4A]/60"
        >
          Start New Proposal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="bg-[#D4A03A]/10 p-4 rounded-lg border border-[#D4A03A]/30">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#D4A03A] mt-0.5" />
          <div>
            <p className="text-sm text-[#0B4D4A] font-medium">AI-Powered Grant Writer</p>
            <p className="text-xs text-[#0B4D4A]/70 mt-1">
              Based on "The Magic of Winning Proposals" - Fill in the details and our AI will create a winning proposal using proven techniques.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'basic' 
              ? 'bg-[#0B4D4A] text-[#F6F4EF]' 
              : 'bg-[#0B4D4A]/10 text-[#0B4D4A] hover:bg-[#0B4D4A]/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Basic Information
          </div>
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'strategy' 
              ? 'bg-[#0B4D4A] text-[#F6F4EF]' 
              : 'bg-[#0B4D4A]/10 text-[#0B4D4A] hover:bg-[#0B4D4A]/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Winning Strategy
          </div>
        </button>
      </div>

      {activeTab === 'basic' ? (
        <div className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#0B4D4A] gf-label">Organization Name *</Label>
              <Input 
                value={data.organizationName}
                onChange={(e) => handleChange('organizationName', e.target.value)}
                placeholder="e.g., Hope Community Foundation"
                className="border-[#0B4D4A]/20 text-[#0B4D4A]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#0B4D4A] gf-label">Project Title *</Label>
              <Input 
                value={data.projectTitle}
                onChange={(e) => handleChange('projectTitle', e.target.value)}
                placeholder="e.g., Youth Empowerment Initiative"
                className="border-[#0B4D4A]/20 text-[#0B4D4A]"
              />
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#0B4D4A] gf-label">Funding Amount ($)</Label>
              <Input 
                value={data.fundingAmount}
                onChange={(e) => handleChange('fundingAmount', e.target.value)}
                placeholder="e.g., 50000"
                className="border-[#0B4D4A]/20 text-[#0B4D4A]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#0B4D4A] gf-label">Project Duration</Label>
              <Input 
                value={data.projectDuration}
                onChange={(e) => handleChange('projectDuration', e.target.value)}
                placeholder="e.g., 12 months"
                className="border-[#0B4D4A]/20 text-[#0B4D4A]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Target Beneficiaries</Label>
            <Input 
              value={data.targetBeneficiaries}
              onChange={(e) => handleChange('targetBeneficiaries', e.target.value)}
              placeholder="e.g., 500 at-risk youth aged 15-24"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Funder/Donor Name</Label>
            <Input 
              value={data.funderName}
              onChange={(e) => handleChange('funderName', e.target.value)}
              placeholder="e.g., Global Development Foundation"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Problem Statement</Label>
            <Textarea 
              value={data.problemStatement}
              onChange={(e) => handleChange('problemStatement', e.target.value)}
              placeholder="Describe the problem your project addresses (2-3 sentences). AI will expand this into a comprehensive problem statement with evidence base and urgency."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Goals</Label>
            <Textarea 
              value={data.projectGoals}
              onChange={(e) => handleChange('projectGoals', e.target.value)}
              placeholder="What are the main goals? (2-3 sentences). AI will expand into SMART objectives with success indicators."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Key Activities</Label>
            <Textarea 
              value={data.activities}
              onChange={(e) => handleChange('activities', e.target.value)}
              placeholder="List 3-5 main activities. AI will expand into detailed implementation plans with phases."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Expected Outcomes</Label>
            <Textarea 
              value={data.expectedOutcomes}
              onChange={(e) => handleChange('expectedOutcomes', e.target.value)}
              placeholder="What outcomes do you expect? AI will expand with impact projections and sustainability plans."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Organization Experience</Label>
            <Textarea 
              value={data.organizationExperience}
              onChange={(e) => handleChange('organizationExperience', e.target.value)}
              placeholder="Briefly describe your org's relevant experience. AI will create a compelling capacity section."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Budget Overview</Label>
            <Textarea 
              value={data.budgetOverview}
              onChange={(e) => handleChange('budgetOverview', e.target.value)}
              placeholder="Brief budget description. AI will create a professional budget justification with allocation framework."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="bg-[#D4A03A]/10 p-4 rounded-lg border border-[#D4A03A]/30">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#D4A03A]" />
              <span className="text-sm font-medium text-[#0B4D4A]">Subject Matter References</span>
            </div>
            <div className="space-y-2">
              <Label className="text-[#0B4D4A] gf-label text-xs">Topics for AI Reference Search</Label>
              <Textarea 
                value={data.referenceTopics}
                onChange={(e) => handleChange('referenceTopics', e.target.value)}
                placeholder="Enter topics for reference search (e.g., 'youth unemployment Africa', 'education statistics', 'community health workers'). AI will find relevant, recent references from credible sources like World Bank, UN, academic journals."
                className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
              />
              <p className="text-xs text-[#0B4D4A]/60">
                References will be included as footnotes in your proposal to strengthen credibility and evidence base.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5">
          <div className="bg-[#0B4D4A]/5 p-4 rounded-lg border border-[#0B4D4A]/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#D4A03A]" />
              <span className="text-sm font-medium text-[#0B4D4A]">The "Big Building" Technique</span>
            </div>
            <p className="text-xs text-[#0B4D4A]/70">
              Based on "The Magic of Winning Proposals" - Understanding your funder's situation and decision-makers gives you the competitive edge.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label flex items-center gap-2">
              <Target className="w-4 h-4" />
              Funder's Current Situation (CASE)
            </Label>
            <select
              value={data.funderCase}
              onChange={(e) => handleChange('funderCase', e.target.value)}
              className="w-full border border-[#0B4D4A]/20 rounded-md px-3 py-2 text-[#0B4D4A] bg-white"
            >
              {funderCases.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <p className="text-xs text-[#0B4D4A]/60">
              Understanding this helps tailor your proposal to their mindset.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label flex items-center gap-2">
              <Users className="w-4 h-4" />
              Decision Makers (The BUGS)
            </Label>
            <Textarea 
              value={data.decisionMakers}
              onChange={(e) => handleChange('decisionMakers', e.target.value)}
              placeholder="Who are the key decision-makers? (Bosses who can say YES, Users who will work with you, Gatekeepers who can say NO, Supporters who advocate for you)"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Critical Issues (ISSUES)
            </Label>
            <Textarea 
              value={data.criticalIssues}
              onChange={(e) => handleChange('criticalIssues', e.target.value)}
              placeholder="What are the funder's most critical concerns? What keeps them up at night? What do they really care about?"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
            <p className="text-xs text-[#0B4D4A]/60">
              Addressing these issues directly is the key to winning.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Proposal Theme (Optional)
            </Label>
            <Input 
              value={data.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              placeholder="e.g., 'Building Bridges to Success' or leave blank for AI to generate"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
            <p className="text-xs text-[#0B4D4A]/60">
              A strong theme creates a "big building" that anchors all your content in the funder's mind.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Your Unique Value Proposition
            </Label>
            <Textarea 
              value={data.uniqueValue}
              onChange={(e) => handleChange('uniqueValue', e.target.value)}
              placeholder="Why should they choose YOU over others? What makes your organization uniquely qualified?"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
        </div>
      )}
      
      <Button 
        onClick={generateProposal}
        disabled={generating}
        className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            AI is crafting your winning proposal...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI-Enhanced Proposal
          </>
        )}
      </Button>
    </div>
  );
}
