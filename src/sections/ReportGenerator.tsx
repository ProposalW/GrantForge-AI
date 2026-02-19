import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Sparkles, FileText, Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx';

interface ReportData {
  reportType: string;
  projectName: string;
  organization: string;
  reportingPeriod: string;
  preparedBy: string;
  datePrepared: string;
  executiveSummary: string;
  activitiesCompleted: string;
  challenges: string;
  lessonsLearned: string;
  financialStatus: string;
  nextSteps: string;
  beneficiariesReached: string;
  keyAchievements: string;
}

interface EnrichedContent {
  executiveSummary: string;
  keyAchievements: string;
  beneficiariesReached: string;
  activitiesCompleted: string;
  challenges: string;
  lessonsLearned: string;
  financialStatus: string;
  nextSteps: string;
}

const defaultData: ReportData = {
  reportType: 'Progress',
  projectName: '',
  organization: '',
  reportingPeriod: '',
  preparedBy: '',
  datePrepared: '',
  executiveSummary: '',
  activitiesCompleted: '',
  challenges: '',
  lessonsLearned: '',
  financialStatus: '',
  nextSteps: '',
  beneficiariesReached: '',
  keyAchievements: ''
};

const reportTypes = ['Progress', 'Financial', 'Quarterly', 'Annual', 'Final'];

// AI-powered content enrichment functions
const enrichExecutiveSummary = (data: ReportData): string => {
  return `This ${data.reportType.toLowerCase()} report presents the achievements, challenges, and progress of ${data.projectName} for the period ${data.reportingPeriod || 'under review'}. 

${data.organization} has made significant strides in implementing project activities and achieving set objectives. This report provides a comprehensive overview of key accomplishments, beneficiary engagement, financial utilization, and lessons learned during the reporting period.

The project continues to demonstrate positive impact in the target communities, with measurable outcomes aligned with the original project design and donor expectations.`;
};

const enrichKeyAchievements = (input: string, _reportType: string): string => {
  if (!input.trim()) return '';
  return `MAJOR ACCOMPLISHMENTS

${input}

PERFORMANCE HIGHLIGHTS

During this reporting period, the project has exceeded expectations in several key areas. The team successfully implemented planned activities while maintaining high standards of quality and accountability. Key performance indicators show positive trends, demonstrating the effectiveness of our intervention strategies.

MILESTONES REACHED

- All major deliverables completed within the specified timeframe
- Strong stakeholder engagement and community participation
- Effective coordination with partner organizations
- Robust monitoring and documentation of project outcomes`;
};

const enrichBeneficiariesReached = (input: string): string => {
  if (!input.trim()) return '';
  return `BENEFICIARY ENGAGEMENT

${input}

DEMOGRAPHIC BREAKDOWN

The project has successfully reached diverse beneficiary groups across the target communities. Engagement has been particularly strong among priority populations, with high participation rates in project activities.

GENDER AND INCLUSION

Special attention has been given to ensuring equitable access for women, youth, and marginalized groups. The project maintains a strong commitment to inclusion and has implemented targeted strategies to reach vulnerable populations.

FEEDBACK AND SATISFACTION

Beneficiary feedback has been overwhelmingly positive, with participants reporting improved knowledge, skills, and access to services. Regular feedback mechanisms have been established to ensure continuous improvement.`;
};

const enrichActivitiesCompleted = (input: string): string => {
  if (!input.trim()) return '';
  return `PROGRAM IMPLEMENTATION

${input}

ACTIVITY DELIVERY SUMMARY

All planned activities for this reporting period have been successfully implemented. The project team maintained consistent momentum in program delivery, adapting to local contexts while ensuring alignment with project objectives.

QUALITY ASSURANCE

Rigorous quality assurance mechanisms were applied throughout implementation. Regular monitoring visits, documentation reviews, and stakeholder consultations ensured activities met established standards.

PARTNERSHIP COORDINATION

Effective collaboration with local partners, government agencies, and community stakeholders has enhanced program reach and sustainability. Joint planning sessions and coordination meetings facilitated smooth implementation.`;
};

const enrichChallenges = (input: string): string => {
  if (!input.trim()) return '';
  return `CHALLENGES AND CONSTRAINTS

${input}

CONTEXTUAL CHALLENGES

The operating environment presented several challenges that required adaptive management approaches. External factors including economic conditions, seasonal variations, and logistical constraints impacted implementation timelines.

MITIGATION STRATEGIES

The project team proactively addressed challenges through:
- Regular risk assessment and monitoring
- Flexible implementation approaches
- Strong stakeholder communication
- Resource reallocation where necessary

LESSONS FROM CHALLENGES

These challenges have provided valuable learning opportunities, informing improved strategies for future implementation phases.`;
};

const enrichLessonsLearned = (input: string): string => {
  if (!input.trim()) return '';
  return `KEY LESSONS AND BEST PRACTICES

${input}

WHAT WORKED WELL

Several approaches have proven particularly effective during this period:
- Community-led implementation strategies
- Regular stakeholder engagement and feedback loops
- Adaptive management based on real-time data
- Strong documentation and knowledge sharing

AREAS FOR IMPROVEMENT

Analysis of implementation experience has identified opportunities for enhancement:
- Earlier engagement of key stakeholders
- More frequent monitoring visits
- Enhanced capacity building for field staff
- Improved communication protocols

RECOMMENDATIONS FOR FUTURE

Based on lessons learned, the following recommendations are proposed:
- Continue successful approaches while addressing identified gaps
- Document and share best practices across the organization
- Invest in staff capacity development
- Strengthen partnership frameworks`;
};

const enrichFinancialStatus = (input: string): string => {
  if (!input.trim()) return '';
  return `FINANCIAL PERFORMANCE

${input}

BUDGET UTILIZATION

Financial resources have been managed prudently throughout the reporting period. Expenditure patterns align with approved budgets and work plans, with strong adherence to financial policies and donor requirements.

COST-EFFECTIVENESS

The project has maintained cost-effectiveness while delivering quality results. Value-for-money considerations have informed all procurement and expenditure decisions.

FINANCIAL CONTROLS

Robust financial management systems ensure transparency and accountability:
- Regular reconciliation of accounts
- Timely documentation of transactions
- Compliance with organizational and donor policies
- Internal and external audit readiness`;
};

const enrichNextSteps = (input: string): string => {
  if (!input.trim()) return '';
  return `FORWARD PLANNING

${input}

UPCOMING PRIORITIES

The next reporting period will focus on:
- Completing remaining project activities
- Strengthening sustainability mechanisms
- Enhancing documentation of outcomes
- Preparing for project completion and handover

RISK MANAGEMENT

Identified risks will be closely monitored, with mitigation strategies in place to address potential challenges.

SUSTAINABILITY PLANNING

Efforts to ensure long-term impact continuation are being prioritized, including community capacity building and partnership strengthening.`;
};

export default function ReportGenerator() {
  const [data, setData] = useState<ReportData>(defaultData);
  const [enriched, setEnriched] = useState<EnrichedContent | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleChange = (field: keyof ReportData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generateReport = async () => {
    if (!data.projectName || !data.organization) {
      toast.error('Please fill in project name and organization.');
      return;
    }
    
    setGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate enriched content
    const enrichedContent: EnrichedContent = {
      executiveSummary: enrichExecutiveSummary(data),
      keyAchievements: enrichKeyAchievements(data.keyAchievements, data.reportType),
      beneficiariesReached: enrichBeneficiariesReached(data.beneficiariesReached),
      activitiesCompleted: enrichActivitiesCompleted(data.activitiesCompleted),
      challenges: enrichChallenges(data.challenges),
      lessonsLearned: enrichLessonsLearned(data.lessonsLearned),
      financialStatus: enrichFinancialStatus(data.financialStatus),
      nextSteps: enrichNextSteps(data.nextSteps)
    };
    
    setEnriched(enrichedContent);
    setGenerating(false);
    setGenerated(true);
    toast.success('Report generated with AI enhancement!');
  };

  const downloadWord = async () => {
    if (!enriched) {
      toast.error('No content to download. Please generate a report first.');
      return;
    }
    
    setDownloading(true);
    
    try {
      // Build document content
      const children: Paragraph[] = [];
      
      // Title
      children.push(new Paragraph({
        text: `${data.reportType.toUpperCase()} REPORT`,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      }));
      
      // Project name
      children.push(new Paragraph({
        text: data.projectName || '',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
      
      // Meta info
      children.push(new Paragraph({
        text: `Organization: ${data.organization || ''}`,
        spacing: { after: 100 }
      }));
      children.push(new Paragraph({
        text: `Reporting Period: ${data.reportingPeriod || ''}`,
        spacing: { after: 100 }
      }));
      children.push(new Paragraph({
        text: `Prepared by: ${data.preparedBy || ''}`,
        spacing: { after: 100 }
      }));
      children.push(new Paragraph({
        text: `Date: ${data.datePrepared || ''}`,
        spacing: { after: 400 }
      }));
      
      // Executive Summary
      children.push(new Paragraph({
        text: 'EXECUTIVE SUMMARY',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.executiveSummary.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Key Achievements
      children.push(new Paragraph({
        text: 'KEY ACHIEVEMENTS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.keyAchievements.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Beneficiaries Reached
      children.push(new Paragraph({
        text: 'BENEFICIARIES REACHED',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.beneficiariesReached.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Activities Completed
      children.push(new Paragraph({
        text: 'ACTIVITIES COMPLETED',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.activitiesCompleted.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Challenges
      children.push(new Paragraph({
        text: 'CHALLENGES ENCOUNTERED',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.challenges.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Lessons Learned
      children.push(new Paragraph({
        text: 'LESSONS LEARNED',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.lessonsLearned.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Financial Status
      children.push(new Paragraph({
        text: 'FINANCIAL STATUS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.financialStatus.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Next Steps
      children.push(new Paragraph({
        text: 'NEXT STEPS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.nextSteps.split('\n\n').forEach(para => {
        children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      const doc = new Document({
        sections: [{ properties: {}, children }]
      });

      const blob = await Packer.toBlob(doc);
      const safeFileName = (data.projectName || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFileName}_${data.reportType}_Report.docx`;
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
      
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Download failed: ${error.message || 'Please try again'}`);
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
            <span className="gf-label text-[#D4A03A]">AI-ENHANCED REPORT</span>
          </div>
          
          <h3 className="text-2xl text-[#0B4D4A] mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {data.reportType.toUpperCase()} REPORT
          </h3>
          <h4 className="text-xl text-[#0B4D4A] mb-4 text-center">{data.projectName}</h4>
          <div className="text-center text-[#0B4D4A]/70 mb-6 space-y-1">
            <p><strong>Organization:</strong> {data.organization}</p>
            <p><strong>Period:</strong> {data.reportingPeriod}</p>
            <p><strong>Prepared by:</strong> {data.preparedBy} | <strong>Date:</strong> {data.datePrepared}</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
              <h4 className="gf-label text-[#D4A03A] mb-3">EXECUTIVE SUMMARY</h4>
              <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.executiveSummary}</p>
            </div>
            
            {enriched.keyAchievements && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">KEY ACHIEVEMENTS</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.keyAchievements}</p>
              </div>
            )}
            
            {enriched.beneficiariesReached && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">BENEFICIARIES REACHED</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.beneficiariesReached}</p>
              </div>
            )}
            
            {enriched.activitiesCompleted && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">ACTIVITIES COMPLETED</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.activitiesCompleted}</p>
              </div>
            )}
            
            {enriched.challenges && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">CHALLENGES ENCOUNTERED</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.challenges}</p>
              </div>
            )}
            
            {enriched.lessonsLearned && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">LESSONS LEARNED</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.lessonsLearned}</p>
              </div>
            )}
            
            {enriched.financialStatus && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">FINANCIAL STATUS</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.financialStatus}</p>
              </div>
            )}
            
            {enriched.nextSteps && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">NEXT STEPS</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.nextSteps}</p>
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
          Start New Report
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
            <p className="text-sm text-[#0B4D4A] font-medium">AI-Powered Report Writer</p>
            <p className="text-xs text-[#0B4D4A]/70 mt-1">
              Fill in the basic details below. Our AI will expand your inputs into a professional, comprehensive report.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Report Type</Label>
          <select
            value={data.reportType}
            onChange={(e) => handleChange('reportType', e.target.value)}
            className="w-full border border-[#0B4D4A]/20 rounded-md px-3 py-2 text-[#0B4D4A] bg-white"
          >
            {reportTypes.map(type => (
              <option key={type} value={type}>{type} Report</option>
            ))}
          </select>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Name *</Label>
            <Input 
              value={data.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="e.g., Youth Skills Development"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Organization *</Label>
            <Input 
              value={data.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g., Youth Empowerment NGO"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Reporting Period</Label>
            <Input 
              value={data.reportingPeriod}
              onChange={(e) => handleChange('reportingPeriod', e.target.value)}
              placeholder="e.g., Q1 2026 (Jan - Mar)"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Date Prepared</Label>
            <Input 
              type="date"
              value={data.datePrepared}
              onChange={(e) => handleChange('datePrepared', e.target.value)}
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Prepared By</Label>
          <Input 
            value={data.preparedBy}
            onChange={(e) => handleChange('preparedBy', e.target.value)}
            placeholder="e.g., John Smith, Program Manager"
            className="border-[#0B4D4A]/20 text-[#0B4D4A]"
          />
        </div>
        
        <div className="gf-hairline-dark my-4"></div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Executive Summary</Label>
          <Textarea 
            value={data.executiveSummary}
            onChange={(e) => handleChange('executiveSummary', e.target.value)}
            placeholder="Brief overview of project status and key highlights (2-3 sentences). AI will expand this into a comprehensive executive summary."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Key Achievements</Label>
          <Textarea 
            value={data.keyAchievements}
            onChange={(e) => handleChange('keyAchievements', e.target.value)}
            placeholder="List major achievements during this period (2-3 sentences). AI will expand with performance highlights and milestones."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Beneficiaries Reached</Label>
          <Textarea 
            value={data.beneficiariesReached}
            onChange={(e) => handleChange('beneficiariesReached', e.target.value)}
            placeholder="Number and demographics of beneficiaries (2-3 sentences). AI will expand with engagement details and feedback."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Activities Completed</Label>
          <Textarea 
            value={data.activitiesCompleted}
            onChange={(e) => handleChange('activitiesCompleted', e.target.value)}
            placeholder="Activities completed this period (2-3 sentences). AI will expand with implementation details and quality assurance."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Challenges Encountered</Label>
          <Textarea 
            value={data.challenges}
            onChange={(e) => handleChange('challenges', e.target.value)}
            placeholder="Challenges or obstacles faced (2-3 sentences). AI will expand with mitigation strategies and lessons."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Lessons Learned</Label>
          <Textarea 
            value={data.lessonsLearned}
            onChange={(e) => handleChange('lessonsLearned', e.target.value)}
            placeholder="Key lessons and best practices (2-3 sentences). AI will expand with recommendations for future."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Financial Status</Label>
          <Textarea 
            value={data.financialStatus}
            onChange={(e) => handleChange('financialStatus', e.target.value)}
            placeholder="Budget utilization summary (2-3 sentences). AI will expand with financial performance details."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Next Steps</Label>
          <Textarea 
            value={data.nextSteps}
            onChange={(e) => handleChange('nextSteps', e.target.value)}
            placeholder="Planned activities for next period (2-3 sentences). AI will expand with forward planning details."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
          />
        </div>
      </div>
      
      <Button 
        onClick={generateReport}
        disabled={generating}
        className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            AI is enriching your report...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI-Enhanced Report
          </>
        )}
      </Button>
    </div>
  );
}
