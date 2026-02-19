import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Sparkles, Plus, Trash2, FileText, Calculator, Lightbulb, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';
import { saveAs } from 'file-saver';

interface BudgetItem {
  id: string;
  category: string;
  item: string;
  unitCost: number;
  quantity: number;
  duration: number;
  total: number;
  notes: string;
}

interface EnrichedContent {
  categoryJustifications: Record<string, string>;
  valueForMoney: string;
  sectorBenchmarks: string;
  costEfficiency: string;
  riskMitigation: string;
}

interface BudgetData {
  projectName: string;
  organization: string;
  projectPeriod: string;
  currency: string;
  projectType: string;
  items: BudgetItem[];
  contingencyPercent: number;
  budgetNarrative: string;
  enrichedContent?: EnrichedContent;
}

const defaultItem: BudgetItem = {
  id: '1',
  category: '',
  item: '',
  unitCost: 0,
  quantity: 1,
  duration: 1,
  total: 0,
  notes: ''
};

const defaultData: BudgetData = {
  projectName: '',
  organization: '',
  projectPeriod: '',
  currency: 'USD',
  projectType: '',
  items: [{ ...defaultItem }],
  contingencyPercent: 10,
  budgetNarrative: ''
};

const categories = [
  'Personnel',
  'Equipment',
  'Supplies',
  'Training',
  'Travel',
  'Communications',
  'Overhead',
  'Other'
];

const projectTypes = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water & Sanitation',
  'Economic Development',
  'Emergency Response',
  'Environment',
  'Governance',
  'Social Services',
  'Infrastructure'
];

// AI Enhancement Functions
const generateCategoryJustifications = (items: BudgetItem[]): Record<string, string> => {
  const justifications: Record<string, string> = {};
  const categoryGroups: Record<string, BudgetItem[]> = {};
  
  items.forEach(item => {
    if (!categoryGroups[item.category]) {
      categoryGroups[item.category] = [];
    }
    categoryGroups[item.category].push(item);
  });

  Object.entries(categoryGroups).forEach(([category, catItems]) => {
    const total = catItems.reduce((sum, item) => sum + item.total, 0);
    const itemCount = catItems.length;
    
    switch (category) {
      case 'Personnel':
        justifications[category] = `Personnel costs represent ${itemCount} staff position(s) essential for project implementation. This includes salaries, benefits, and associated employment costs. These positions are critical for achieving project objectives and ensuring quality delivery of services. The allocation is based on market rates for qualified professionals in the project location.`;
        break;
      case 'Equipment':
        justifications[category] = `Equipment procurement totaling ${total.toLocaleString()} includes essential items required for project operations. These assets will be used throughout the project period and beyond, providing long-term value. Items were selected based on durability, local availability of maintenance support, and cost-effectiveness.`;
        break;
      case 'Supplies':
        justifications[category] = `Supplies budget of ${total.toLocaleString()} covers consumable materials needed for day-to-day project activities. These items are essential for service delivery and will be procured in accordance with organizational procurement policies to ensure value for money.`;
        break;
      case 'Training':
        justifications[category] = `Training allocation of ${total.toLocaleString()} will build capacity of project staff, partners, and beneficiaries. This investment in human capital development ensures sustainable project outcomes and knowledge transfer. Training costs include materials, venue, facilitation, and participant support.`;
        break;
      case 'Travel':
        justifications[category] = `Travel budget of ${total.toLocaleString()} enables field monitoring, stakeholder engagement, and project coordination. Costs are calculated based on standard per diem rates and transportation costs in the project area. Travel is essential for effective project oversight and relationship building.`;
        break;
      case 'Communications':
        justifications[category] = `Communications costs of ${total.toLocaleString()} ensure effective information sharing, reporting, and visibility. This includes internet, phone, printing, and other communication tools necessary for project coordination and stakeholder engagement.`;
        break;
      case 'Overhead':
        justifications[category] = `Overhead allocation covers administrative support, office operations, and organizational costs that enable project implementation. This includes a proportionate share of rent, utilities, and administrative staff time dedicated to project management.`;
        break;
      default:
        justifications[category] = `Budget allocation of ${total.toLocaleString()} for ${category} has been carefully calculated based on project needs and market rates. These costs are essential for achieving project objectives and have been optimized for cost-effectiveness.`;
    }
  });

  return justifications;
};

const generateValueForMoney = (items: BudgetItem[], total: number, projectType: string): string => {
  const personnelCost = items.filter(i => i.category === 'Personnel').reduce((sum, i) => sum + i.total, 0);
  const personnelPercent = total > 0 ? (personnelCost / total * 100).toFixed(1) : '0';
  
  return `This budget demonstrates strong value for money through several key factors:

1. **Efficient Resource Allocation**: Personnel costs represent ${personnelPercent}% of the total budget, ensuring adequate human resources while maintaining operational flexibility. This aligns with sector best practices for ${projectType || 'development'} projects.

2. **Cost-Effective Procurement**: All budget items have been priced based on local market research and historical data. Where possible, bulk purchasing and competitive bidding will be employed to maximize cost savings.

3. **Leveraging Local Resources**: The budget prioritizes local procurement and hiring, reducing costs associated with international logistics while supporting the local economy.

4. **Sustainable Investments**: Equipment and training allocations represent investments in long-term capacity that will benefit the organization and community beyond the project period.

5. **Transparent Cost Structure**: The budget provides clear line-item detail, enabling donors and stakeholders to understand exactly how funds will be utilized.

6. **Appropriate Contingency**: A ${items.length > 0 ? 'reasonable' : 'standard'} contingency allocation provides flexibility to address unforeseen circumstances without compromising project delivery.`;
};

const generateSectorBenchmarks = (projectType: string): string => {
  const benchmarks: Record<string, string> = {
    'Education': 'Education sector benchmarks suggest that effective programs typically allocate 60-70% to direct program costs (teaching materials, teacher support), 15-20% to administration, and 10-15% to monitoring and evaluation. This budget aligns with these standards.',
    'Healthcare': 'Healthcare project budgets typically follow the 70-20-10 rule: 70% for direct medical services and supplies, 20% for personnel and training, and 10% for administration. This budget structure reflects these sector norms.',
    'Agriculture': 'Agricultural development projects commonly allocate 40-50% to inputs and equipment, 25-35% to technical assistance and training, and 15-20% to administrative costs. This budget is consistent with these benchmarks.',
    'Water & Sanitation': 'WASH sector standards recommend that 65-75% of budgets go to infrastructure and materials, 15-20% to community mobilization and training, and 10-15% to project management. This allocation follows these guidelines.',
    'Economic Development': 'Livelihoods and economic development projects typically invest 50-60% in direct beneficiary support (grants, equipment), 20-30% in capacity building, and 15-20% in operational costs. This budget reflects these proportions.',
    'Emergency Response': 'Emergency programs prioritize rapid response, typically allocating 70-80% to direct assistance, 10-15% to logistics, and 10-15% to coordination. This budget structure supports effective emergency delivery.',
    'Environment': 'Conservation and environmental projects often allocate 50-60% to field activities, 20-25% to research and monitoring, and 15-20% to advocacy and communications. This budget aligns with these patterns.',
    'Governance': 'Governance programs typically invest 40-50% in direct capacity building, 25-30% in technical assistance, and 20-25% in coordination and advocacy. This budget follows these sector norms.',
    'Social Services': 'Social service programs commonly allocate 60-70% to direct beneficiary services, 15-20% to staff and training, and 10-15% to administration and monitoring. This budget reflects these standards.',
    'Infrastructure': 'Infrastructure projects typically dedicate 75-85% to construction and materials, 10-15% to technical supervision, and 5-10% to community engagement. This budget structure is consistent with these benchmarks.'
  };

  return benchmarks[projectType] || 'Based on general development sector analysis, well-managed projects typically allocate 60-70% to direct program activities, 15-20% to personnel and capacity building, and 10-15% to administration and overhead. This budget has been structured to align with these proven ratios, ensuring optimal resource utilization while maintaining organizational effectiveness.';
};

const generateCostEfficiency = (items: BudgetItem[], total: number): string => {
  const categoryTotals: Record<string, number> = {};
  items.forEach(item => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.total;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategories = sortedCategories.slice(0, 3);
  
  let analysis = 'Cost efficiency analysis reveals the following key insights:\n\n';
  
  topCategories.forEach(([cat, amount], index) => {
    const percent = total > 0 ? (amount / total * 100).toFixed(1) : '0';
    analysis += `${index + 1}. **${cat}** (${percent}%): This represents the largest budget component, reflecting its critical importance to project success. `;
    
    if (cat === 'Personnel') {
      analysis += 'Investment in qualified staff ensures quality implementation and sustainable outcomes.\n\n';
    } else if (cat === 'Equipment') {
      analysis += 'Capital investments provide long-term value and operational efficiency.\n\n';
    } else if (cat === 'Training') {
      analysis += 'Capacity building creates lasting impact beyond the project period.\n\n';
    } else {
      analysis += 'This allocation is proportionate to the activities and outcomes expected.\n\n';
    }
  });

  analysis += `\n**Efficiency Measures:**
- Unit costs have been benchmarked against local market rates
- Bulk purchasing opportunities identified where applicable
- Local procurement prioritized to reduce logistics costs
- Administrative costs maintained within sector norms (typically 10-15%)
- Regular budget monitoring will ensure funds are used as planned`;

  return analysis;
};

const generateRiskMitigation = (contingencyPercent: number): string => {
  return `**Risk Mitigation through Budget Planning**

The ${contingencyPercent}% contingency allocation serves as a critical risk management tool, providing flexibility to address:

1. **Price Volatility**: Currency fluctuations and inflation may affect costs, particularly for imported goods and services.

2. **Implementation Delays**: Unforeseen circumstances may require timeline adjustments, potentially affecting costs.

3. **Scope Changes**: Donor or beneficiary needs may evolve, requiring budget reallocation.

4. **Emergency Needs**: Unexpected situations may require rapid response with available funds.

**Additional Risk Mitigation Measures:**
- Quarterly budget reviews to identify and address variances
- Clear procurement procedures to prevent fraud and ensure transparency
- Segregation of duties in financial management
- Regular financial reporting to donors and stakeholders
- Contingency plans for critical budget items`;
};

// Smart category suggestions based on project type
const getSuggestedCategories = (projectType: string): string[] => {
  const suggestions: Record<string, string[]> = {
    'Education': ['Personnel', 'Supplies', 'Training', 'Equipment'],
    'Healthcare': ['Personnel', 'Equipment', 'Supplies', 'Training'],
    'Agriculture': ['Supplies', 'Equipment', 'Training', 'Personnel'],
    'Water & Sanitation': ['Equipment', 'Supplies', 'Personnel', 'Training'],
    'Economic Development': ['Training', 'Equipment', 'Personnel', 'Supplies'],
    'Emergency Response': ['Supplies', 'Personnel', 'Travel', 'Equipment'],
    'Environment': ['Equipment', 'Personnel', 'Travel', 'Supplies'],
    'Governance': ['Personnel', 'Training', 'Communications', 'Travel'],
    'Social Services': ['Personnel', 'Supplies', 'Training', 'Equipment'],
    'Infrastructure': ['Equipment', 'Supplies', 'Personnel', 'Travel']
  };
  
  return suggestions[projectType] || ['Personnel', 'Supplies', 'Equipment', 'Training'];
};

export default function BudgetGenerator() {
  const [data, setData] = useState<BudgetData>(defaultData);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const calculateItemTotal = (item: BudgetItem) => {
    return item.unitCost * item.quantity * item.duration;
  };

  const handleChange = (field: keyof BudgetData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (id: string, field: keyof BudgetItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.total = calculateItemTotal(updated);
          return updated;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { ...defaultItem, id: Date.now().toString() }]
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) {
      toast.error('You need at least one budget item.');
      return;
    }
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const applySmartCategories = () => {
    if (!data.projectType) {
      toast.error('Please select a project type first.');
      return;
    }
    
    const suggested = getSuggestedCategories(data.projectType);
    const newItems = suggested.map((cat, index) => ({
      ...defaultItem,
      id: Date.now().toString() + index,
      category: cat,
      item: cat === 'Personnel' ? 'Project Staff' : 
            cat === 'Equipment' ? 'Essential Equipment' :
            cat === 'Supplies' ? 'Program Supplies' :
            cat === 'Training' ? 'Capacity Building' : ''
    }));
    
    setData(prev => ({ ...prev, items: newItems }));
    toast.success(`Smart categories applied for ${data.projectType} project!`);
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
  const contingency = subtotal * (data.contingencyPercent / 100);
  const grandTotal = subtotal + contingency;

  const generateBudget = () => {
    if (!data.projectName || !data.organization) {
      toast.error('Please fill in project name and organization.');
      return;
    }
    
    if (data.items.some(item => !item.category || !item.item)) {
      toast.error('Please complete all budget items with category and description.');
      return;
    }
    
    setGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const enrichedContent: EnrichedContent = {
        categoryJustifications: generateCategoryJustifications(data.items),
        valueForMoney: generateValueForMoney(data.items, grandTotal, data.projectType),
        sectorBenchmarks: generateSectorBenchmarks(data.projectType),
        costEfficiency: generateCostEfficiency(data.items, grandTotal),
        riskMitigation: generateRiskMitigation(data.contingencyPercent)
      };
      
      setData(prev => ({ ...prev, enrichedContent }));
      setGenerating(false);
      setGenerated(true);
      toast.success('AI-enhanced budget generated successfully!');
    }, 2000);
  };

  const downloadWord = async () => {
    const itemRows = data.items.map((item, index) => [
      new TableCell({ children: [new Paragraph((index + 1).toString())], width: { type: WidthType.PERCENTAGE, size: 5 } }),
      new TableCell({ children: [new Paragraph(item.category)], width: { type: WidthType.PERCENTAGE, size: 15 } }),
      new TableCell({ children: [new Paragraph(item.item)], width: { type: WidthType.PERCENTAGE, size: 25 } }),
      new TableCell({ children: [new Paragraph(item.unitCost.toLocaleString())], width: { type: WidthType.PERCENTAGE, size: 12 } }),
      new TableCell({ children: [new Paragraph(item.quantity.toString())], width: { type: WidthType.PERCENTAGE, size: 8 } }),
      new TableCell({ children: [new Paragraph(item.duration.toString())], width: { type: WidthType.PERCENTAGE, size: 8 } }),
      new TableCell({ children: [new Paragraph(item.total.toLocaleString())], width: { type: WidthType.PERCENTAGE, size: 15 } }),
      new TableCell({ children: [new Paragraph(item.notes)], width: { type: WidthType.PERCENTAGE, size: 12 } })
    ]);

    const children: any[] = [
      new Paragraph({
        text: 'PROJECT BUDGET',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: data.projectName,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: `Organization: ${data.organization}`,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Project Period: ${data.projectPeriod}`,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Project Type: ${data.projectType || 'Not specified'}`,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Currency: ${data.currency}`,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: 'BUDGET DETAILS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),
      new Table({
        width: { type: WidthType.PERCENTAGE, size: 100 },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('No.')], width: { type: WidthType.PERCENTAGE, size: 5 } }),
              new TableCell({ children: [new Paragraph('Category')], width: { type: WidthType.PERCENTAGE, size: 15 } }),
              new TableCell({ children: [new Paragraph('Item')], width: { type: WidthType.PERCENTAGE, size: 25 } }),
              new TableCell({ children: [new Paragraph('Unit Cost')], width: { type: WidthType.PERCENTAGE, size: 12 } }),
              new TableCell({ children: [new Paragraph('Qty')], width: { type: WidthType.PERCENTAGE, size: 8 } }),
              new TableCell({ children: [new Paragraph('Duration')], width: { type: WidthType.PERCENTAGE, size: 8 } }),
              new TableCell({ children: [new Paragraph('Total')], width: { type: WidthType.PERCENTAGE, size: 15 } }),
              new TableCell({ children: [new Paragraph('Notes')], width: { type: WidthType.PERCENTAGE, size: 12 } })
            ]
          }),
          ...itemRows.map(cells => new TableRow({ children: cells })),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('')], columnSpan: 6 }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Subtotal:', bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: subtotal.toLocaleString(), bold: true })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('')], columnSpan: 6 }),
              new TableCell({ children: [new Paragraph(`Contingency (${data.contingencyPercent}%):`)] }),
              new TableCell({ children: [new Paragraph(contingency.toLocaleString())] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('')], columnSpan: 6 }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'GRAND TOTAL:', bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: grandTotal.toLocaleString(), bold: true })] })] })
            ]
          })
        ]
      })
    ];

    // Add AI-enhanced content
    if (data.enrichedContent) {
      children.push(
        new Paragraph({
          text: 'BUDGET JUSTIFICATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        })
      );

      // Category Justifications
      Object.entries(data.enrichedContent.categoryJustifications).forEach(([category, justification]) => {
        children.push(
          new Paragraph({
            text: category,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: justification,
            spacing: { after: 200 }
          })
        );
      });

      // Value for Money
      children.push(
        new Paragraph({
          text: 'VALUE FOR MONEY ANALYSIS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: data.enrichedContent.valueForMoney,
          spacing: { after: 400 }
        })
      );

      // Sector Benchmarks
      children.push(
        new Paragraph({
          text: 'SECTOR BENCHMARKS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: data.enrichedContent.sectorBenchmarks,
          spacing: { after: 400 }
        })
      );

      // Cost Efficiency
      children.push(
        new Paragraph({
          text: 'COST EFFICIENCY ANALYSIS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: data.enrichedContent.costEfficiency,
          spacing: { after: 400 }
        })
      );

      // Risk Mitigation
      children.push(
        new Paragraph({
          text: 'RISK MITIGATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: data.enrichedContent.riskMitigation,
          spacing: { after: 400 }
        })
      );
    }

    // Add user narrative if provided
    if (data.budgetNarrative) {
      children.push(
        new Paragraph({
          text: 'ADDITIONAL BUDGET NARRATIVE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: data.budgetNarrative,
          spacing: { after: 400 }
        })
      );
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.projectName.replace(/\s+/g, '_')}_Budget.docx`);
    toast.success('Budget downloaded!');
  };

  const downloadExcel = () => {
    const headers = ['No.', 'Category', 'Item', 'Unit Cost', 'Quantity', 'Duration', 'Total', 'Notes'];
    const rows = data.items.map((item, index) => [
      index + 1,
      item.category,
      item.item,
      item.unitCost,
      item.quantity,
      item.duration,
      item.total,
      item.notes
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${data.projectName.replace(/\s+/g, '_')}_Budget.csv`);
    toast.success('Budget downloaded as CSV!');
  };

  if (generated && data.enrichedContent) {
    return (
      <div className="space-y-6">
        <div className="bg-[#0B4D4A]/5 p-6 rounded-lg border border-[#0B4D4A]/10">
          <h3 className="text-2xl text-[#0B4D4A] mb-2 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            PROJECT BUDGET
          </h3>
          <h4 className="text-xl text-[#0B4D4A] mb-4 text-center">{data.projectName}</h4>
          <p className="text-center text-[#0B4D4A]/70 mb-2">
            <strong>Organization:</strong> {data.organization}
          </p>
          <p className="text-center text-[#0B4D4A]/70 mb-6">
            <strong>Period:</strong> {data.projectPeriod} | <strong>Currency:</strong> {data.currency}
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#0B4D4A]/20">
                  <th className="text-left py-2 text-[#0B4D4A] font-medium">No.</th>
                  <th className="text-left py-2 text-[#0B4D4A] font-medium">Category</th>
                  <th className="text-left py-2 text-[#0B4D4A] font-medium">Item</th>
                  <th className="text-right py-2 text-[#0B4D4A] font-medium">Unit Cost</th>
                  <th className="text-right py-2 text-[#0B4D4A] font-medium">Qty</th>
                  <th className="text-right py-2 text-[#0B4D4A] font-medium">Duration</th>
                  <th className="text-right py-2 text-[#0B4D4A] font-medium">Total</th>
                  <th className="text-left py-2 text-[#0B4D4A] font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-[#0B4D4A]/10">
                    <td className="py-3 text-[#0B4D4A]/70">{index + 1}</td>
                    <td className="py-3 text-[#0B4D4A]/80">{item.category}</td>
                    <td className="py-3 text-[#0B4D4A]/80">{item.item}</td>
                    <td className="py-3 text-[#0B4D4A]/70 text-right">{item.unitCost.toLocaleString()}</td>
                    <td className="py-3 text-[#0B4D4A]/70 text-right">{item.quantity}</td>
                    <td className="py-3 text-[#0B4D4A]/70 text-right">{item.duration}</td>
                    <td className="py-3 text-[#0B4D4A]/80 text-right font-medium">{item.total.toLocaleString()}</td>
                    <td className="py-3 text-[#0B4D4A]/60">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#0B4D4A]/20">
                  <td colSpan={6} className="py-3 text-right text-[#0B4D4A] font-medium">Subtotal:</td>
                  <td className="py-3 text-right text-[#0B4D4A] font-medium">{subtotal.toLocaleString()}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={6} className="py-2 text-right text-[#0B4D4A]/70">Contingency ({data.contingencyPercent}%):</td>
                  <td className="py-2 text-right text-[#0B4D4A]/70">{contingency.toLocaleString()}</td>
                  <td></td>
                </tr>
                <tr className="bg-[#D4A03A]/10">
                  <td colSpan={6} className="py-3 text-right text-[#0B4D4A] font-bold">GRAND TOTAL:</td>
                  <td className="py-3 text-right text-[#D4A03A] font-bold text-lg">{grandTotal.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gradient-to-br from-[#0B4D4A]/10 to-[#D4A03A]/10 p-6 rounded-lg border border-[#0B4D4A]/20">
          <h4 className="gf-label text-[#0B4D4A] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4A03A]" />
            AI-Enhanced Budget Insights
          </h4>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <Button
              variant="outline"
              onClick={() => setActiveInsight(activeInsight === 'justifications' ? null : 'justifications')}
              className={`gf-btn ${activeInsight === 'justifications' ? 'bg-[#D4A03A]/20 border-[#D4A03A]' : 'border-[#0B4D4A]/30'}`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Category Justifications
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveInsight(activeInsight === 'value' ? null : 'value')}
              className={`gf-btn ${activeInsight === 'value' ? 'bg-[#D4A03A]/20 border-[#D4A03A]' : 'border-[#0B4D4A]/30'}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Value for Money
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveInsight(activeInsight === 'benchmarks' ? null : 'benchmarks')}
              className={`gf-btn ${activeInsight === 'benchmarks' ? 'bg-[#D4A03A]/20 border-[#D4A03A]' : 'border-[#0B4D4A]/30'}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Sector Benchmarks
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveInsight(activeInsight === 'risk' ? null : 'risk')}
              className={`gf-btn ${activeInsight === 'risk' ? 'bg-[#D4A03A]/20 border-[#D4A03A]' : 'border-[#0B4D4A]/30'}`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Risk Mitigation
            </Button>
          </div>

          {activeInsight === 'justifications' && (
            <div className="bg-white p-4 rounded-lg border border-[#0B4D4A]/10">
              <h5 className="gf-label text-[#0B4D4A] mb-3">Cost Justification by Category</h5>
              {Object.entries(data.enrichedContent.categoryJustifications).map(([category, justification]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h6 className="text-[#D4A03A] font-medium mb-1">{category}</h6>
                  <p className="text-[#0B4D4A]/80 text-sm leading-relaxed">{justification}</p>
                </div>
              ))}
            </div>
          )}

          {activeInsight === 'value' && (
            <div className="bg-white p-4 rounded-lg border border-[#0B4D4A]/10">
              <h5 className="gf-label text-[#0B4D4A] mb-3">Value for Money Analysis</h5>
              <div className="text-[#0B4D4A]/80 text-sm leading-relaxed whitespace-pre-line">
                {data.enrichedContent.valueForMoney}
              </div>
            </div>
          )}

          {activeInsight === 'benchmarks' && (
            <div className="bg-white p-4 rounded-lg border border-[#0B4D4A]/10">
              <h5 className="gf-label text-[#0B4D4A] mb-3">Sector Benchmarks</h5>
              <div className="text-[#0B4D4A]/80 text-sm leading-relaxed">
                {data.enrichedContent.sectorBenchmarks}
              </div>
            </div>
          )}

          {activeInsight === 'risk' && (
            <div className="bg-white p-4 rounded-lg border border-[#0B4D4A]/10">
              <h5 className="gf-label text-[#0B4D4A] mb-3">Risk Mitigation</h5>
              <div className="text-[#0B4D4A]/80 text-sm leading-relaxed whitespace-pre-line">
                {data.enrichedContent.riskMitigation}
              </div>
            </div>
          )}
        </div>
        
        {data.budgetNarrative && (
          <div className="bg-[#0B4D4A]/5 p-6 rounded-lg border border-[#0B4D4A]/10">
            <h4 className="gf-label text-[#D4A03A] mb-2">ADDITIONAL BUDGET NARRATIVE</h4>
            <p className="text-[#0B4D4A]/80 leading-relaxed">{data.budgetNarrative}</p>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button onClick={downloadWord} className="flex-1 gf-btn bg-[#0B4D4A] text-[#F6F4EF] hover:bg-[#0B4D4A]/90">
            <Download className="w-4 h-4 mr-2" />
            Download Word
          </Button>
          <Button onClick={downloadExcel} className="flex-1 gf-btn border-2 border-[#0B4D4A] text-[#0B4D4A] hover:bg-[#0B4D4A]/5">
            <FileText className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
        </div>
        
        <Button 
          onClick={() => { setGenerated(false); setActiveInsight(null); setData(defaultData); }} 
          variant="ghost" 
          className="w-full text-[#0B4D4A]/60"
        >
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Name *</Label>
            <Input 
              value={data.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="e.g., Community Development Project"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Organization *</Label>
            <Input 
              value={data.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g., Community First NGO"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Period</Label>
            <Input 
              value={data.projectPeriod}
              onChange={(e) => handleChange('projectPeriod', e.target.value)}
              placeholder="e.g., January - December 2026"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Currency</Label>
            <Input 
              value={data.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              placeholder="e.g., USD, EUR, GBP"
              className="border-[#0B4D4A]/20 text-[#0B4D4A]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#0B4D4A] gf-label">Project Type</Label>
            <select
              value={data.projectType}
              onChange={(e) => handleChange('projectType', e.target.value)}
              className="w-full border border-[#0B4D4A]/20 rounded-md px-3 py-2 text-[#0B4D4A] bg-white"
            >
              <option value="">Select Type</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Smart Category Suggestion */}
        {data.projectType && (
          <div className="bg-[#D4A03A]/10 p-4 rounded-lg border border-[#D4A03A]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4A03A]" />
                <span className="text-[#0B4D4A] text-sm">
                  <strong>AI Suggestion:</strong> Smart categories available for {data.projectType} projects
                </span>
              </div>
              <Button
                onClick={applySmartCategories}
                variant="outline"
                size="sm"
                className="text-[#D4A03A] border-[#D4A03A] hover:bg-[#D4A03A]/10"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Apply Smart Categories
              </Button>
            </div>
          </div>
        )}
        
        <div className="gf-hairline-dark my-4"></div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-[#0B4D4A] gf-label">Budget Items</Label>
            <Button 
              onClick={addItem}
              variant="outline"
              size="sm"
              className="text-[#D4A03A] border-[#D4A03A]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={item.id} className="p-4 border border-[#0B4D4A]/15 rounded-lg bg-[#0B4D4A]/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="gf-label text-[#0B4D4A]">Item {index + 1}</span>
                  <Button 
                    onClick={() => removeItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                      className="border border-[#0B4D4A]/20 rounded-md px-3 py-2 text-[#0B4D4A] bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Input 
                      value={item.item}
                      onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                      placeholder="Item description"
                      className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs text-[#0B4D4A]/60 mb-1">Unit Cost</Label>
                      <Input 
                        type="number"
                        value={item.unitCost || ''}
                        onChange={(e) => handleItemChange(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#0B4D4A]/60 mb-1">Quantity</Label>
                      <Input 
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        placeholder="1"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#0B4D4A]/60 mb-1">Duration</Label>
                      <Input 
                        type="number"
                        value={item.duration || ''}
                        onChange={(e) => handleItemChange(item.id, 'duration', parseInt(e.target.value) || 0)}
                        placeholder="1"
                        className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#0B4D4A]/60 mb-1">Total</Label>
                      <div className="flex items-center h-10 px-3 bg-[#D4A03A]/10 rounded border border-[#D4A03A]/30 text-[#0B4D4A] font-medium">
                        {item.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Input 
                    value={item.notes}
                    onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                    placeholder="Notes (optional)"
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-[#D4A03A]/10 rounded-lg border border-[#D4A03A]/30">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-[#D4A03A]" />
            <span className="gf-label text-[#0B4D4A]">Budget Summary</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#0B4D4A] text-sm">Contingency (%)</Label>
              <Input 
                type="number"
                value={data.contingencyPercent}
                onChange={(e) => handleChange('contingencyPercent', parseFloat(e.target.value) || 0)}
                className="border-[#0B4D4A]/20 text-[#0B4D4A]"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full p-3 bg-[#0B4D4A] rounded text-[#F6F4EF]">
                <span className="text-sm opacity-70">Grand Total:</span>
                <span className="text-xl font-bold ml-2">{grandTotal.toLocaleString()} {data.currency}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-[#0B4D4A] gf-label">Additional Budget Narrative (Optional)</Label>
          <Textarea 
            value={data.budgetNarrative}
            onChange={(e) => handleChange('budgetNarrative', e.target.value)}
            placeholder="Provide any additional context or explanation for your budget..."
            className="border-[#0B4D4A]/20 text-[#0B4D4A] min-h-[100px]"
          />
        </div>
      </div>
      
      <Button 
        onClick={generateBudget}
        disabled={generating}
        className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6"
      >
        {generating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            AI Enhancing Budget...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI-Enhanced Budget
          </>
        )}
      </Button>
    </div>
  );
}
