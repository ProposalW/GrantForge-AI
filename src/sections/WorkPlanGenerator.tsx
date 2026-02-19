import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Sparkles, Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';

interface Activity {
  id: string;
  name: string;
  responsible: string;
  startDate: string;
  endDate: string;
  processReport: string;
  activityReport: string;
  supervisorRemark: string;
}

interface WorkPlanData {
  projectName: string;
  organization: string;
  projectPeriod: string;
  overallObjective: string;
  activities: Activity[];
}

const defaultActivity: Activity = {
  id: '1',
  name: '',
  responsible: '',
  startDate: '',
  endDate: '',
  processReport: '',
  activityReport: '',
  supervisorRemark: ''
};

const defaultData: WorkPlanData = {
  projectName: '',
  organization: '',
  projectPeriod: '',
  overallObjective: '',
  activities: [{ ...defaultActivity }]
};

export default function WorkPlanGenerator() {
  const [data, setData] = useState<WorkPlanData>(defaultData);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleChange = (field: keyof WorkPlanData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleActivityChange = (id: string, field: keyof Activity, value: string) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const addActivity = () => {
    setData(prev => ({
      ...prev,
      activities: [...prev.activities, { ...defaultActivity, id: Date.now().toString() }]
    }));
  };

  const removeActivity = (id: string) => {
    if (data.activities.length <= 1) {
      toast.error('You need at least one activity.');
      return;
    }
    setData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id)
    }));
  };

  const generateWorkPlan = () => {
    if (!data.projectName || !data.organization) {
      toast.error('Please fill in project name and organization.');
      return;
    }
    
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success('Work plan generated successfully!');
    }, 1500);
  };

  const downloadWord = async () => {
    setDownloading(true);
    
    try {
      // Build table rows
      const headerRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No.', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 4 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Activity', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 18 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Person Responsible', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 14 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Start Date', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 10 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'End Date', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 10 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Process Report', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 14 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Activity Report', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 14 } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Remark by Supervisor', bold: true })] })], width: { type: WidthType.PERCENTAGE, size: 16 } })
        ]
      });

      const dataRows = data.activities.map((a, index) => 
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph((index + 1).toString())], width: { type: WidthType.PERCENTAGE, size: 4 } }),
            new TableCell({ children: [new Paragraph(a.name || '')], width: { type: WidthType.PERCENTAGE, size: 18 } }),
            new TableCell({ children: [new Paragraph(a.responsible || '')], width: { type: WidthType.PERCENTAGE, size: 14 } }),
            new TableCell({ children: [new Paragraph(a.startDate || '')], width: { type: WidthType.PERCENTAGE, size: 10 } }),
            new TableCell({ children: [new Paragraph(a.endDate || '')], width: { type: WidthType.PERCENTAGE, size: 10 } }),
            new TableCell({ children: [new Paragraph(a.processReport || '')], width: { type: WidthType.PERCENTAGE, size: 14 } }),
            new TableCell({ children: [new Paragraph(a.activityReport || '')], width: { type: WidthType.PERCENTAGE, size: 14 } }),
            new TableCell({ children: [new Paragraph(a.supervisorRemark || '')], width: { type: WidthType.PERCENTAGE, size: 16 } })
          ]
        })
      );

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: 'WORK PLAN',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),
            new Paragraph({
              text: data.projectName || '',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: `Organization: ${data.organization || ''}`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `Project Period: ${data.projectPeriod || ''}`,
              spacing: { after: 300 }
            }),
            new Paragraph({
              text: 'OVERALL OBJECTIVE',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            }),
            new Paragraph({
              text: data.overallObjective || '',
              spacing: { after: 300 }
            }),
            new Paragraph({
              text: 'ACTIVITIES AND TIMELINE',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            }),
            new Table({
              width: { type: WidthType.PERCENTAGE, size: 100 },
              rows: [headerRow, ...dataRows]
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const safeFileName = (data.projectName || 'Work_Plan').replace(/[^a-zA-Z0-9]/g, '_');
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFileName}.docx`;
      document.body.appendChild(link);
      
      // Use click() with a small delay
      requestAnimationFrame(() => {
        link.click();
        
        // Cleanup after download starts
        setTimeout(() => {
          if (link.parentNode) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
        }, 500);
      });
      
      toast.success('Work plan downloaded successfully!');
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

  if (generated) {
    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="bg-[#0B4D4A]/5 p-6 rounded-lg border border-[#0B4D4A]/10">
          <h3 className="text-2xl text-[#0B4D4A] mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            WORK PLAN
          </h3>
          <h4 className="text-xl text-[#0B4D4A] mb-4 text-center">{data.projectName}</h4>
          <p className="text-center text-[#0B4D4A]/70 mb-6">
            <strong>Organization:</strong> {data.organization} | <strong>Period:</strong> {data.projectPeriod}
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="gf-label text-[#D4A03A] mb-2">OVERALL OBJECTIVE</h4>
              <p className="text-[#0B4D4A]/80 leading-relaxed">{data.overallObjective}</p>
            </div>
            
            <div>
              <h4 className="gf-label text-[#D4A03A] mb-4">ACTIVITIES AND TIMELINE</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#0B4D4A]/20 bg-[#0B4D4A]/10">
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">No.</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">Activity</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">Person Responsible</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">Start Date</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">End Date</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">Process Report</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">Activity Report</th>
                      <th className="text-left py-2 px-2 text-[#0B4D4A] font-medium">Remark by Supervisor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.activities.map((activity, index) => (
                      <tr key={activity.id} className="border-b border-[#0B4D4A]/10">
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{index + 1}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/80">{activity.name}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{activity.responsible}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{activity.startDate}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{activity.endDate}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{activity.processReport}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{activity.activityReport}</td>
                        <td className="py-3 px-2 text-[#0B4D4A]/70">{activity.supervisorRemark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
          onClick={() => { setGenerated(false); setData(defaultData); }} 
          variant="ghost" 
          className="w-full text-[#0B4D4A]/60"
        >
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Project Name *</Label>
          <Input 
            value={data.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="e.g., Community Health Improvement Project"
            className="border-[#0B4D4A]/20 text-[#0B4D4A]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Organization *</Label>
          <Input 
            value={data.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            placeholder="e.g., Health For All NGO"
            className="border-[#0B4D4A]/20 text-[#0B4D4A]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Project Period</Label>
          <Input 
            value={data.projectPeriod}
            onChange={(e) => handleChange('projectPeriod', e.target.value)}
            placeholder="e.g., January 2026 - December 2026"
            className="border-[#0B4D4A]/20 text-[#0B4D4A]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Overall Objective</Label>
          <Textarea 
            value={data.overallObjective}
            onChange={(e) => handleChange('overallObjective', e.target.value)}
            placeholder="What is the main objective of this project?"
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
          />
        </div>
        
        <div className="gf-hairline-dark my-4"></div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-[#0B4D4A] gf-label">Activities</Label>
            <Button 
              onClick={addActivity}
              variant="outline"
              size="sm"
              className="text-[#D4A03A] border-[#D4A03A]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Activity
            </Button>
          </div>
          
          <div className="space-y-4">
            {data.activities.map((activity, index) => (
              <div key={activity.id} className="p-4 border border-[#0B4D4A]/15 rounded-lg bg-[#0B4D4A]/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="gf-label text-[#0B4D4A]">Activity {index + 1}</span>
                  <Button 
                    onClick={() => removeActivity(activity.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input 
                    value={activity.name}
                    onChange={(e) => handleActivityChange(activity.id, 'name', e.target.value)}
                    placeholder="Activity name"
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  />
                  <Input 
                    value={activity.responsible}
                    onChange={(e) => handleActivityChange(activity.id, 'responsible', e.target.value)}
                    placeholder="Person Responsible"
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input 
                      value={activity.startDate}
                      onChange={(e) => handleActivityChange(activity.id, 'startDate', e.target.value)}
                      placeholder="Start Date (e.g., Jan 2026)"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    />
                    <Input 
                      value={activity.endDate}
                      onChange={(e) => handleActivityChange(activity.id, 'endDate', e.target.value)}
                      placeholder="End Date (e.g., Mar 2026)"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    />
                  </div>
                  <Input 
                    value={activity.processReport}
                    onChange={(e) => handleActivityChange(activity.id, 'processReport', e.target.value)}
                    placeholder="Process Report"
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  />
                  <Input 
                    value={activity.activityReport}
                    onChange={(e) => handleActivityChange(activity.id, 'activityReport', e.target.value)}
                    placeholder="Activity Report"
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  />
                  <Input 
                    value={activity.supervisorRemark}
                    onChange={(e) => handleActivityChange(activity.id, 'supervisorRemark', e.target.value)}
                    placeholder="Remark by Activity Supervisor"
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={generateWorkPlan}
        disabled={generating}
        className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Work Plan
          </>
        )}
      </Button>
    </div>
  );
}
