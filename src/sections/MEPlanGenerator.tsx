import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Sparkles, Plus, Trash2, FileText, Loader2, Wand2, Activity, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';

interface Indicator {
  id: string;
  name: string;
  definition: string;
  target: string;
  dataSource: string;
  frequency: string;
  responsible: string;
}

interface ProcessMonitoring {
  id: string;
  activity: string;
  processes: string;
  lessons: string;
  suggestions: string;
  knowledgeGained: string;
}

interface MEPlanData {
  projectName: string;
  organization: string;
  projectGoal: string;
  theoryOfChange: string;
  baselineData: string;
  outputsAndOutcomes: string;
  indicators: Indicator[];
  reportingSchedule: string;
  evaluationMethod: string;
  processMonitoring: ProcessMonitoring[];
}

interface EnrichedContent {
  executiveSummary: string;
  theoryOfChange: string;
  baselineData: string;
  outputsAndOutcomes: string;
  indicatorsFramework: string;
  reportingSchedule: string;
  evaluationMethodology: string;
  processMonitoring: string;
}

const defaultIndicator: Indicator = {
  id: '1',
  name: '',
  definition: '',
  target: '',
  dataSource: '',
  frequency: '',
  responsible: ''
};

const defaultProcessMonitoring: ProcessMonitoring = {
  id: '1',
  activity: '',
  processes: '',
  lessons: '',
  suggestions: '',
  knowledgeGained: ''
};

const defaultData: MEPlanData = {
  projectName: '',
  organization: '',
  projectGoal: '',
  theoryOfChange: '',
  baselineData: '',
  outputsAndOutcomes: '',
  indicators: [{ ...defaultIndicator }],
  reportingSchedule: '',
  evaluationMethod: '',
  processMonitoring: [{ ...defaultProcessMonitoring }]
};

// AI-powered content enrichment functions
const enrichExecutiveSummary = (data: MEPlanData): string => {
  return `This Monitoring and Evaluation (M&E) Plan provides a comprehensive framework for tracking progress, measuring outcomes, and ensuring accountability for ${data.projectName}. 

The plan integrates both project activity monitoring and process monitoring to ensure not only that activities are completed as planned, but also that they are implemented with high quality standards and contribute to organizational learning and improvement.

${data.organization} is committed to evidence-based decision-making and continuous improvement. This M&E plan has been designed to provide timely, relevant, and actionable information to project managers, implementers, and stakeholders.`;
};

const enrichTheoryOfChange = (input: string): string => {
  if (!input.trim()) return '';
  return `THEORY OF CHANGE

${input}

LOGIC MODEL OVERVIEW

Our Theory of Change articulates the causal pathways through which project activities lead to desired outcomes. It identifies the key assumptions that underpin our intervention and the preconditions necessary for success.

KEY ASSUMPTIONS

1. The target population has the capacity and motivation to engage with project activities
2. External factors (political, economic, social) will remain relatively stable
3. Partner organizations will maintain their commitment and capacity
4. Resources will be available as planned throughout the project period
5. The intervention approach is appropriate for the local context

CRITICAL PATHWAY

Inputs → Activities → Outputs → Outcomes → Impact

This framework guides our indicator selection and helps ensure we measure what matters most for achieving our project goal.`;
};

const enrichBaselineData = (input: string): string => {
  if (!input.trim()) return '';
  return `BASELINE DATA AND SITUATION ANALYSIS

${input}

BASELINE METHODOLOGY

Baseline data was collected using a mixed-methods approach, combining quantitative surveys with qualitative interviews and focus group discussions. This ensures a comprehensive understanding of the starting point against which progress will be measured.

DATA QUALITY CONSIDERATIONS

All baseline data has been validated through triangulation of sources and methods. Data collection tools were pre-tested and refined to ensure reliability and validity. Sampling was conducted to ensure representativeness of the target population.

USE OF BASELINE DATA

This baseline serves as the reference point for:
- Setting realistic and achievable targets
- Measuring progress and change over time
- Adjusting implementation strategies based on initial findings
- Demonstrating project impact to stakeholders and donors`;
};

const enrichOutputsAndOutcomes = (input: string): string => {
  if (!input.trim()) return '';
  return `OUTPUTS AND OUTCOMES FRAMEWORK

${input}

OUTPUTS (DIRECT PRODUCTS OF ACTIVITIES)

Outputs are the tangible products, goods, and services that result from project activities. These are within the direct control of the project team and can be measured through routine monitoring systems.

OUTCOMES (CHANGES RESULTING FROM OUTPUTS)

Outcomes represent the changes in knowledge, attitudes, skills, behaviors, or conditions that occur as a result of project outputs. These may be influenced by external factors and require more rigorous evaluation approaches.

IMPACT (LONG-TERM CHANGES)

Impact refers to the long-term, sustainable changes in conditions or well-being that can be attributed, at least in part, to the project intervention. Impact assessment typically requires longer timeframes and more sophisticated evaluation designs.

RESULTS CHAIN

Activities → Outputs → Short-term Outcomes → Medium-term Outcomes → Long-term Impact

Each level of the results chain has corresponding indicators to track progress and demonstrate contribution.`;
};

const enrichIndicatorsFramework = (indicators: Indicator[]): string => {
  if (indicators.length === 0 || !indicators[0].name) return '';
  
  return `INDICATORS FRAMEWORK

The following indicators have been selected to measure progress toward project objectives. Each indicator meets the SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound) and is aligned with the Theory of Change.

${indicators.map((ind, i) => `
INDICATOR ${i + 1}: ${ind.name}
Definition: ${ind.definition || 'To be defined'}
Target: ${ind.target || 'To be set'}
Data Source: ${ind.dataSource || 'To be determined'}
Frequency: ${ind.frequency || 'To be specified'}
Responsible: ${ind.responsible || 'To be assigned'}
`).join('\n')}

DATA COLLECTION METHODS

A combination of quantitative and qualitative methods will be used:
- Surveys and questionnaires for standardized data
- Key informant interviews for in-depth insights
- Focus group discussions for community perspectives
- Direct observation for verification
- Document review for secondary data

DATA QUALITY ASSURANCE

To ensure data quality, we will:
- Train data collectors on standardized procedures
- Use validated data collection tools
- Implement regular data verification checks
- Conduct periodic data quality audits
- Document all data collection processes`;
};

const enrichReportingSchedule = (input: string): string => {
  if (!input.trim()) return '';
  return `REPORTING SCHEDULE AND DISSEMINATION

${input}

REPORTING FRAMEWORK

Regular reporting ensures that information flows to the right people at the right time to inform decision-making. Our reporting schedule includes:

INTERNAL REPORTING
- Weekly team meetings for activity updates
- Monthly progress reviews against work plans
- Quarterly performance assessments
- Annual comprehensive evaluation

EXTERNAL REPORTING
- Monthly updates to key stakeholders
- Quarterly reports to funding partners
- Semi-annual learning briefs
- Annual impact reports

INFORMATION PRODUCTS

Different audiences require different types of information:
- Dashboards for quick status updates
- Detailed reports for comprehensive analysis
- Briefing notes for decision-makers
- Case studies for learning and advocacy

DISSEMINATION STRATEGY

M&E findings will be shared through:
- Stakeholder meetings and workshops
- Email updates and newsletters
- Project website and social media
- Community feedback sessions`;
};

const enrichEvaluationMethodology = (input: string): string => {
  if (!input.trim()) return '';
  return `EVALUATION METHODOLOGY

${input}

EVALUATION APPROACH

Our evaluation approach is designed to generate credible, useful, and ethical findings that can inform both project improvement and broader sector learning.

EVALUATION TYPES

1. PROCESS EVALUATION
   - Assesses how activities are implemented
   - Identifies barriers and facilitators
   - Informs real-time adjustments

2. OUTCOME EVALUATION
   - Measures changes in knowledge, attitudes, behaviors
   - Assesses achievement of short and medium-term outcomes
   - Uses comparison groups where appropriate

3. IMPACT EVALUATION
   - Measures long-term changes in conditions
   - Attempts to attribute changes to the project
   - Uses rigorous designs where feasible

EVALUATION CRITERIA

All evaluations will assess:
- Relevance: Is the project addressing real needs?
- Effectiveness: Are objectives being achieved?
- Efficiency: Are resources being used well?
- Impact: What difference is being made?
- Sustainability: Will benefits continue?

ETHICAL CONSIDERATIONS

All M&E activities will adhere to ethical principles:
- Informed consent from participants
- Confidentiality and data protection
- Do no harm to participants or communities
- Transparency about data use`;
};

const enrichProcessMonitoring = (processes: ProcessMonitoring[]): string => {
  if (processes.length === 0 || !processes[0].activity) return '';
  
  return `PROCESS MONITORING FRAMEWORK

Process monitoring focuses on HOW activities are implemented, not just WHAT is delivered. It ensures quality standards, promotes organizational learning, and drives continuous improvement.

${processes.map((proc, i) => `
PROCESS MONITORING ENTRY ${i + 1}

Activity Carried Out: ${proc.activity}

Processes and Steps Taken: ${proc.processes}

Lessons Learnt: ${proc.lessons}

Ideas and Suggestions for Process Improvement: ${proc.suggestions}

Knowledge and Skills Gained: ${proc.knowledgeGained}
`).join('\n')}

PURPOSE OF PROCESS MONITORING

1. QUALITY ASSURANCE
   - Ensure activities meet established standards
   - Identify and address implementation challenges
   - Maintain consistency across different contexts

2. ORGANIZATIONAL LEARNING
   - Capture lessons from implementation experience
   - Document best practices and innovations
   - Build institutional knowledge

3. CONTINUOUS IMPROVEMENT
   - Identify opportunities for process optimization
   - Test and refine implementation approaches
   - Adapt to changing circumstances

PROCESS MONITORING METHODS

- Regular field observations and supervision visits
- Staff reflection meetings and debriefs
- Participant feedback and satisfaction surveys
- Review of implementation records and documentation
- Learning events and after-action reviews`;
};

export default function MEPlanGenerator() {
  const [data, setData] = useState<MEPlanData>(defaultData);
  const [enriched, setEnriched] = useState<EnrichedContent | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'framework' | 'activity' | 'process'>('framework');

  const handleChange = (field: keyof MEPlanData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleIndicatorChange = (id: string, field: keyof Indicator, value: string) => {
    setData(prev => ({
      ...prev,
      indicators: prev.indicators.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const addIndicator = () => {
    setData(prev => ({
      ...prev,
      indicators: [...prev.indicators, { ...defaultIndicator, id: Date.now().toString() }]
    }));
  };

  const removeIndicator = (id: string) => {
    if (data.indicators.length <= 1) {
      toast.error('You need at least one indicator.');
      return;
    }
    setData(prev => ({
      ...prev,
      indicators: prev.indicators.filter(i => i.id !== id)
    }));
  };

  const handleProcessChange = (id: string, field: keyof ProcessMonitoring, value: string) => {
    setData(prev => ({
      ...prev,
      processMonitoring: prev.processMonitoring.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addProcessMonitoring = () => {
    setData(prev => ({
      ...prev,
      processMonitoring: [...prev.processMonitoring, { ...defaultProcessMonitoring, id: Date.now().toString() }]
    }));
  };

  const removeProcessMonitoring = (id: string) => {
    if (data.processMonitoring.length <= 1) {
      toast.error('You need at least one process monitoring entry.');
      return;
    }
    setData(prev => ({
      ...prev,
      processMonitoring: prev.processMonitoring.filter(p => p.id !== id)
    }));
  };

  const generateMEPlan = async () => {
    if (!data.projectName || !data.organization) {
      toast.error('Please fill in project name and organization.');
      return;
    }
    
    setGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate enriched content
    const enrichedContent: EnrichedContent = {
      executiveSummary: enrichExecutiveSummary(data),
      theoryOfChange: enrichTheoryOfChange(data.theoryOfChange),
      baselineData: enrichBaselineData(data.baselineData),
      outputsAndOutcomes: enrichOutputsAndOutcomes(data.outputsAndOutcomes),
      indicatorsFramework: enrichIndicatorsFramework(data.indicators),
      reportingSchedule: enrichReportingSchedule(data.reportingSchedule),
      evaluationMethodology: enrichEvaluationMethodology(data.evaluationMethod),
      processMonitoring: enrichProcessMonitoring(data.processMonitoring)
    };
    
    setEnriched(enrichedContent);
    setGenerating(false);
    setGenerated(true);
    toast.success('M&E Plan generated with AI enhancement!');
  };

  const downloadWord = async () => {
    if (!enriched) {
      toast.error('No content to download. Please generate a plan first.');
      return;
    }
    
    setDownloading(true);
    
    try {
      // Build indicator table rows
      const indicatorRows = data.indicators.map((ind, index) => 
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph((index + 1).toString())], width: { type: WidthType.PERCENTAGE, size: 5 } }),
            new TableCell({ children: [new Paragraph(ind.name || '')], width: { type: WidthType.PERCENTAGE, size: 20 } }),
            new TableCell({ children: [new Paragraph(ind.definition || '')], width: { type: WidthType.PERCENTAGE, size: 20 } }),
            new TableCell({ children: [new Paragraph(ind.target || '')], width: { type: WidthType.PERCENTAGE, size: 15 } }),
            new TableCell({ children: [new Paragraph(ind.dataSource || '')], width: { type: WidthType.PERCENTAGE, size: 15 } }),
            new TableCell({ children: [new Paragraph(ind.frequency || '')], width: { type: WidthType.PERCENTAGE, size: 10 } }),
            new TableCell({ children: [new Paragraph(ind.responsible || '')], width: { type: WidthType.PERCENTAGE, size: 15 } })
          ]
        })
      );

      // Build process monitoring table rows
      const processRows = data.processMonitoring.map((proc, index) => 
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph((index + 1).toString())], width: { type: WidthType.PERCENTAGE, size: 5 } }),
            new TableCell({ children: [new Paragraph(proc.activity || '')], width: { type: WidthType.PERCENTAGE, size: 20 } }),
            new TableCell({ children: [new Paragraph(proc.processes || '')], width: { type: WidthType.PERCENTAGE, size: 20 } }),
            new TableCell({ children: [new Paragraph(proc.lessons || '')], width: { type: WidthType.PERCENTAGE, size: 15 } }),
            new TableCell({ children: [new Paragraph(proc.suggestions || '')], width: { type: WidthType.PERCENTAGE, size: 20 } }),
            new TableCell({ children: [new Paragraph(proc.knowledgeGained || '')], width: { type: WidthType.PERCENTAGE, size: 20 } })
          ]
        })
      );

      const children: (Paragraph | Table)[] = [];
      
      // Title
      children.push(new Paragraph({
        text: 'MONITORING AND EVALUATION PLAN',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      }));
      
      children.push(new Paragraph({
        text: data.projectName || '',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
      
      children.push(new Paragraph({
        text: `Organization: ${data.organization || ''}`,
        spacing: { after: 100 }
      }));
      
      children.push(new Paragraph({
        text: `Project Goal: ${data.projectGoal || ''}`,
        spacing: { after: 400 }
      }));
      
      // Executive Summary
      children.push(new Paragraph({
        text: 'EXECUTIVE SUMMARY',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }));
      enriched.executiveSummary.split('\n\n').forEach(para => {
        if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
      });
      
      // Theory of Change
      if (enriched.theoryOfChange) {
        children.push(new Paragraph({
          text: 'THEORY OF CHANGE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        enriched.theoryOfChange.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Baseline Data
      if (enriched.baselineData) {
        children.push(new Paragraph({
          text: 'BASELINE DATA',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        enriched.baselineData.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Outputs and Outcomes
      if (enriched.outputsAndOutcomes) {
        children.push(new Paragraph({
          text: 'OUTPUTS AND OUTCOMES FRAMEWORK',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        enriched.outputsAndOutcomes.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Indicators Table
      if (data.indicators.length > 0 && data.indicators[0].name) {
        children.push(new Paragraph({
          text: 'INDICATORS FRAMEWORK',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        
        children.push(new Table({
          width: { type: WidthType.PERCENTAGE, size: 100 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No.', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 5 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Indicator', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 20 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Definition', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 20 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Target', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 15 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Data Source', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 15 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Frequency', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 10 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Responsible', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 15 } })
              ]
            }),
            ...indicatorRows
          ]
        }));
      }
      
      // Reporting Schedule
      if (enriched.reportingSchedule) {
        children.push(new Paragraph({
          text: 'REPORTING SCHEDULE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        enriched.reportingSchedule.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Evaluation Methodology
      if (enriched.evaluationMethodology) {
        children.push(new Paragraph({
          text: 'EVALUATION METHODOLOGY',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        enriched.evaluationMethodology.split('\n\n').forEach(para => {
          if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
        });
      }
      
      // Process Monitoring
      if (data.processMonitoring.length > 0 && data.processMonitoring[0].activity) {
        children.push(new Paragraph({
          text: 'PROCESS MONITORING',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));
        
        if (enriched.processMonitoring) {
          enriched.processMonitoring.split('\n\n').forEach(para => {
            if (para.trim()) children.push(new Paragraph({ text: para, spacing: { after: 200 } }));
          });
        }
        
        children.push(new Table({
          width: { type: WidthType.PERCENTAGE, size: 100 },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No.', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 5 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Activity', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 20 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Processes & Steps', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 20 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Lessons', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 15 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Suggestions', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 20 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Knowledge Gained', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 20 } })
              ]
            }),
            ...processRows
          ]
        }));
      }
      
      const doc = new Document({
        sections: [{ properties: {}, children }]
      });

      const blob = await Packer.toBlob(doc);
      const safeFileName = (data.projectName || 'ME_Plan').replace(/[^a-zA-Z0-9]/g, '_');
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFileName}_ME_Plan.docx`;
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
      
      toast.success('M&E Plan downloaded successfully!');
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
            <span className="gf-label text-[#D4A03A]">AI-ENHANCED M&E PLAN</span>
          </div>
          
          <h3 className="text-2xl text-[#0B4D4A] mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            MONITORING AND EVALUATION PLAN
          </h3>
          <h4 className="text-xl text-[#0B4D4A] mb-4 text-center">{data.projectName}</h4>
          <p className="text-center text-[#0B4D4A]/70 mb-6">
            <strong>Organization:</strong> {data.organization}
          </p>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
              <h4 className="gf-label text-[#D4A03A] mb-3">EXECUTIVE SUMMARY</h4>
              <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.executiveSummary}</p>
            </div>
            
            {enriched.theoryOfChange && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">THEORY OF CHANGE</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.theoryOfChange}</p>
              </div>
            )}
            
            {enriched.baselineData && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">BASELINE DATA</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.baselineData}</p>
              </div>
            )}
            
            {enriched.outputsAndOutcomes && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">OUTPUTS AND OUTCOMES FRAMEWORK</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.outputsAndOutcomes}</p>
              </div>
            )}
            
            {data.indicators.length > 0 && data.indicators[0].name && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-4">INDICATORS FRAMEWORK</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#0B4D4A]/20 bg-[#0B4D4A]/10">
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">No.</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Indicator</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Definition</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Target</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Data Source</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Freq.</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Responsible</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.indicators.map((indicator, index) => (
                        <tr key={indicator.id} className="border-b border-[#0B4D4A]/10">
                          <td className="py-3 text-[#0B4D4A]/70">{index + 1}</td>
                          <td className="py-3 text-[#0B4D4A]/80">{indicator.name}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{indicator.definition}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{indicator.target}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{indicator.dataSource}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{indicator.frequency}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{indicator.responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {enriched.reportingSchedule && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">REPORTING SCHEDULE</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.reportingSchedule}</p>
              </div>
            )}
            
            {enriched.evaluationMethodology && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-3">EVALUATION METHODOLOGY</h4>
                <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line">{enriched.evaluationMethodology}</p>
              </div>
            )}
            
            {data.processMonitoring.length > 0 && data.processMonitoring[0].activity && (
              <div className="bg-white p-4 rounded border border-[#0B4D4A]/10">
                <h4 className="gf-label text-[#D4A03A] mb-4">PROCESS MONITORING</h4>
                {enriched.processMonitoring && (
                  <p className="text-[#0B4D4A]/80 leading-relaxed whitespace-pre-line mb-4">{enriched.processMonitoring}</p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#0B4D4A]/20 bg-[#0B4D4A]/10">
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">No.</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Activity</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Processes & Steps</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Lessons</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Suggestions</th>
                        <th className="text-left py-2 text-[#0B4D4A] font-medium">Knowledge Gained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.processMonitoring.map((proc, index) => (
                        <tr key={proc.id} className="border-b border-[#0B4D4A]/10">
                          <td className="py-3 text-[#0B4D4A]/70">{index + 1}</td>
                          <td className="py-3 text-[#0B4D4A]/80">{proc.activity}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{proc.processes}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{proc.lessons}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{proc.suggestions}</td>
                          <td className="py-3 text-[#0B4D4A]/70">{proc.knowledgeGained}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          Start New M&E Plan
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
            <p className="text-sm text-[#0B4D4A] font-medium">AI-Powered M&E Plan Builder</p>
            <p className="text-xs text-[#0B4D4A]/70 mt-1">
              Create comprehensive monitoring and evaluation plans with both project activity and process monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('framework')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'framework' 
              ? 'bg-[#0B4D4A] text-[#F6F4EF]' 
              : 'bg-[#0B4D4A]/10 text-[#0B4D4A] hover:bg-[#0B4D4A]/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            M&E Framework
          </div>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'activity' 
              ? 'bg-[#0B4D4A] text-[#F6F4EF]' 
              : 'bg-[#0B4D4A]/10 text-[#0B4D4A] hover:bg-[#0B4D4A]/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Activity Monitoring
          </div>
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'process' 
              ? 'bg-[#0B4D4A] text-[#F6F4EF]' 
              : 'bg-[#0B4D4A]/10 text-[#0B4D4A] hover:bg-[#0B4D4A]/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Wand2 className="w-4 h-4" />
            Process Monitoring
          </div>
        </button>
      </div>

      {activeTab === 'framework' && (
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Name *</Label>
            <Input 
              value={data.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="e.g., Education for All Initiative"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Organization *</Label>
            <Input 
              value={data.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g., Education Empowerment NGO"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Goal</Label>
            <Textarea 
              value={data.projectGoal}
              onChange={(e) => handleChange('projectGoal', e.target.value)}
              placeholder="What is the overall goal you want to achieve and measure?"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Theory of Change / Programme Logic
            </Label>
            <Textarea 
              value={data.theoryOfChange}
              onChange={(e) => handleChange('theoryOfChange', e.target.value)}
              placeholder="Describe the important things that need to happen for the project goal and objectives to be achieved. What are the causal pathways? What are your key assumptions?"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
            />
            <p className="text-xs text-[#0B4D4A]/60">
              This helps identify what needs to be monitored to ensure you're on track.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Baseline Data</Label>
            <Textarea 
              value={data.baselineData}
              onChange={(e) => handleChange('baselineData', e.target.value)}
              placeholder="Enter current baseline data - the starting point measurements before the project began. This is essential for measuring change and impact."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Outputs and Outcomes</Label>
            <Textarea 
              value={data.outputsAndOutcomes}
              onChange={(e) => handleChange('outputsAndOutcomes', e.target.value)}
              placeholder="List the expected outputs (direct products of activities) and outcomes (changes resulting from outputs). AI will expand this into a comprehensive results framework."
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
            />
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="grid gap-5">
          <div className="bg-[#0B4D4A]/5 p-4 rounded-lg border border-[#0B4D4A]/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#D4A03A]" />
              <span className="text-sm font-medium text-[#0B4D4A]">Project Activity Monitoring</span>
            </div>
            <p className="text-xs text-[#0B4D4A]/70">
              Track WHAT activities are being implemented, their targets, and progress.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-[#0B4D4A] gf-label">Indicators</Label>
              <Button 
                onClick={addIndicator}
                variant="outline"
                size="sm"
                className="text-[#D4A03A] border-[#D4A03A]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Indicator
              </Button>
            </div>
            
            <div className="space-y-4">
              {data.indicators.map((indicator, index) => (
                <div key={indicator.id} className="p-4 border border-[#0B4D4A]/15 rounded-lg bg-[#0B4D4A]/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="gf-label text-[#0B4D4A]">Indicator {index + 1}</span>
                    <Button 
                      onClick={() => removeIndicator(indicator.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <Input 
                      value={indicator.name}
                      onChange={(e) => handleIndicatorChange(indicator.id, 'name', e.target.value)}
                      placeholder="Indicator name (e.g., Number of students enrolled)"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    />
                    <Input 
                      value={indicator.definition}
                      onChange={(e) => handleIndicatorChange(indicator.id, 'definition', e.target.value)}
                      placeholder="Definition (how is this measured?)"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input 
                        value={indicator.target}
                        onChange={(e) => handleIndicatorChange(indicator.id, 'target', e.target.value)}
                        placeholder="Target (e.g., 500 students)"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                      <Input 
                        value={indicator.dataSource}
                        onChange={(e) => handleIndicatorChange(indicator.id, 'dataSource', e.target.value)}
                        placeholder="Data source (e.g., Registration records)"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input 
                        value={indicator.frequency}
                        onChange={(e) => handleIndicatorChange(indicator.id, 'frequency', e.target.value)}
                        placeholder="Frequency (e.g., Monthly, Quarterly)"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                      <Input 
                        value={indicator.responsible}
                        onChange={(e) => handleIndicatorChange(indicator.id, 'responsible', e.target.value)}
                        placeholder="Person responsible"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Reporting Schedule</Label>
            <Textarea 
              value={data.reportingSchedule}
              onChange={(e) => handleChange('reportingSchedule', e.target.value)}
              placeholder="Describe your reporting schedule (e.g., Monthly progress reports, Quarterly reviews, Annual evaluation...)"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Evaluation Methodology</Label>
            <Textarea 
              value={data.evaluationMethod}
              onChange={(e) => handleChange('evaluationMethod', e.target.value)}
              placeholder="Describe how you will evaluate the project (e.g., surveys, focus groups, data analysis...)"
              className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
            />
          </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div className="grid gap-5">
          <div className="bg-[#0B4D4A]/5 p-4 rounded-lg border border-[#0B4D4A]/10">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-[#D4A03A]" />
              <span className="text-sm font-medium text-[#0B4D4A]">Process Monitoring</span>
            </div>
            <p className="text-xs text-[#0B4D4A]/70">
              Monitor HOW activities are implemented to ensure quality standards, organizational learning, and continuous improvement.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-[#0B4D4A] gf-label">Process Monitoring Entries</Label>
              <Button 
                onClick={addProcessMonitoring}
                variant="outline"
                size="sm"
                className="text-[#D4A03A] border-[#D4A03A]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Entry
              </Button>
            </div>
            
            <div className="space-y-4">
              {data.processMonitoring.map((proc, index) => (
                <div key={proc.id} className="p-4 border border-[#0B4D4A]/15 rounded-lg bg-[#0B4D4A]/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="gf-label text-[#0B4D4A]">Process Entry {index + 1}</span>
                    <Button 
                      onClick={() => removeProcessMonitoring(proc.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <Input 
                      value={proc.activity}
                      onChange={(e) => handleProcessChange(proc.id, 'activity', e.target.value)}
                      placeholder="1. Activity Carried Out"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    />
                    <Textarea 
                      value={proc.processes}
                      onChange={(e) => handleProcessChange(proc.id, 'processes', e.target.value)}
                      placeholder="2. Processes and Steps Taken"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[60px]"
                    />
                    <Textarea 
                      value={proc.lessons}
                      onChange={(e) => handleProcessChange(proc.id, 'lessons', e.target.value)}
                      placeholder="3. Lesson Learnt"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[60px]"
                    />
                    <Textarea 
                      value={proc.suggestions}
                      onChange={(e) => handleProcessChange(proc.id, 'suggestions', e.target.value)}
                      placeholder="4. Ideas and Suggestions for Process Improvement"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[60px]"
                    />
                    <Textarea 
                      value={proc.knowledgeGained}
                      onChange={(e) => handleProcessChange(proc.id, 'knowledgeGained', e.target.value)}
                      placeholder="5. Knowledge and Skills Gained"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[60px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Button 
        onClick={generateMEPlan}
        disabled={generating}
        className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            AI is enriching your M&E plan...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI-Enhanced M&E Plan
          </>
        )}
      </Button>
    </div>
  );
}
