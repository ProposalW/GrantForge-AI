import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FileText, 
  Calendar, 
  BarChart3, 
  DollarSign, 
  ClipboardList,
  ChevronRight,
  Sparkles,
  Shield,
  Lock,
  Eye,
  CheckCircle,
  Menu,
  X,
  Users,
  Briefcase,
  PiggyBank,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import GrantProposalGenerator from './sections/GrantProposalGenerator';
import WorkPlanGenerator from './sections/WorkPlanGenerator';
import MEPlanGenerator from './sections/MEPlanGenerator';
import BudgetGenerator from './sections/BudgetGenerator';
import ReportGenerator from './sections/ReportGenerator';
import PaymentModal from './sections/PaymentModal';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [activeGenerator, setActiveGenerator] = useState<string>('Grant Proposal');
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Hero entrance animation
    try {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        
        tl.fromTo('.hero-headline-word', 
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, duration: 0.6 }
        )
        .fromTo('.hero-subheadline',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo('.hero-cta',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo('.hero-trust',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.2'
        )
        .fromTo('.hero-preview',
          { x: '10vw', rotateZ: 2, opacity: 0 },
          { x: 0, rotateZ: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        );
      }, heroRef);

      return () => ctx.revert();
    } catch (error) {
      console.error('GSAP animation error:', error);
    }
  }, []);

  useEffect(() => {
    // Scroll animations for sections
    try {
      const ctx = gsap.context(() => {
        // Section 2 - What You Can Create
        gsap.fromTo('.capability-card',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: '.capabilities-section',
              start: 'top 80%',
              end: 'top 55%',
              scrub: 0.4
            }
          }
        );

        // Section 3 - How It Works
        gsap.fromTo('.step-block',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.how-it-works-section',
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4
          }
        }
      );

      gsap.fromTo('.step-connector',
        { scaleX: 0 },
        {
          scaleX: 1,
          scrollTrigger: {
            trigger: '.how-it-works-section',
            start: 'top 70%',
            end: 'top 50%',
            scrub: 0.4
          }
        }
      );

      // Section 9 - Built for Your Team
      gsap.fromTo('.team-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.team-section',
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4
          }
        }
      );

      // Section 10 - Security
      gsap.fromTo('.trust-item',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.security-section',
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4
          }
        }
      );

      // Section 11 - Pricing
      gsap.fromTo('.pricing-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.pricing-section',
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4
          }
        }
      );

      // Section 13 - Final CTA
      gsap.fromTo('.final-cta',
        { scale: 0.98, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: '.final-cta-section',
            start: 'top 80%',
            end: 'top 60%',
            scrub: 0.4
          }
        }
      );
      });

      return () => ctx.revert();
    } catch (error) {
      console.error('Scroll animation error:', error);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const openGenerator = (type: string) => {
    setActiveGenerator(type);
    setDialogOpen(true);
    toast.info(`${type} generator opened! Fill in the template to generate your document.`);
  };

  const openPayment = (plan: 'monthly' | 'yearly') => {
    setPaymentPlan(plan);
    setPaymentOpen(true);
  };

  const capabilities = [
    {
      icon: FileText,
      title: 'Grant Proposal',
      description: 'Narrative, logic model, and budget justification.',
      color: 'text-[#D4A03A]'
    },
    {
      icon: Calendar,
      title: 'Work Plan',
      description: 'Activities, timelines, and deliverables.',
      color: 'text-[#0B4D4A]'
    },
    {
      icon: BarChart3,
      title: 'M&E Plan',
      description: 'Indicators, data sources, and reporting schedules.',
      color: 'text-[#D4A03A]'
    },
    {
      icon: DollarSign,
      title: 'Project Budget',
      description: 'Line items, notes, and summary tables.',
      color: 'text-[#0B4D4A]'
    },
    {
      icon: ClipboardList,
      title: 'Reports',
      description: 'Progress, financial, and impact summaries.',
      color: 'text-[#D4A03A]'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Pick a document',
      description: 'Choose from proposals, budgets, work plans, M&E plans, or reports.'
    },
    {
      number: '02',
      title: 'Fill the template',
      description: 'Answer plain-language prompts. Add your project details.'
    },
    {
      number: '03',
      title: 'Generate & export',
      description: 'Review, edit, and download in Word, PDF, or Excel.'
    }
  ];

  const teamCards = [
    {
      icon: FileText,
      title: 'Grant writers',
      description: 'Turn notes into full proposals faster.'
    },
    {
      icon: Briefcase,
      title: 'Program managers',
      description: 'Build work plans and M&E plans in one sitting.'
    },
    {
      icon: PiggyBank,
      title: 'Finance officers',
      description: 'Generate structured budgets with clear justifications.'
    }
  ];

  const faqs = [
    {
      question: 'What documents can I create?',
      answer: 'You can create Grant Proposals, Work Plans, Monitoring & Evaluation Plans, Project Budgets, and Progress/Impact Reports. Each template is designed specifically for non-profit organizations and funding requirements.'
    },
    {
      question: 'Is it free to use?',
      answer: 'Yes! The free plan allows you to generate up to 5 documents per month. For unlimited documents and priority support, you can upgrade to our Pro plan.'
    },
    {
      question: 'Can I edit the generated document?',
      answer: 'Absolutely. All generated documents can be reviewed and edited before export. You can modify any section to match your specific needs and organizational voice.'
    },
    {
      question: 'What formats can I export?',
      answer: 'You can export documents in Microsoft Word (.docx), PDF, and Excel (.xlsx) formats for budgets. This ensures compatibility with all major funding platforms and email systems.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use encryption in transit, we do not train our AI on your documents, and you have full control over exports, edits, and sharing. Your data privacy is our top priority.'
    },
    {
      question: 'Can I use this offline?',
      answer: 'GrantForge is a Progressive Web App (PWA). Once installed, many features work offline. You can fill templates offline and generate documents when you reconnect.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B4D4A] gf-grain">
      <Toaster position="top-center" richColors />
      
      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-[#0B4D4A]/95 backdrop-blur-sm border-b border-[#F6F4EF]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#F6F4EF] rounded flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0B4D4A]" />
              </div>
              <span className="text-xl font-semibold text-[#F6F4EF]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                GrantForge
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('capabilities')} className="gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] transition-colors">
                What You Can Create
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('pricing')} className="gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className="gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] transition-colors">
                FAQ
              </button>
            </div>
            
            <div className="hidden md:block">
              <Button 
                onClick={() => openGenerator('Grant Proposal')}
                className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-6"
              >
                Start Free
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#F6F4EF]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B4D4A] border-t border-[#F6F4EF]/10">
            <div className="px-6 py-4 space-y-4">
              <button onClick={() => scrollToSection('capabilities')} className="block w-full text-left gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] py-2">
                What You Can Create
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] py-2">
                How It Works
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] py-2">
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left gf-label text-[#F6F4EF]/70 hover:text-[#F6F4EF] py-2">
                FAQ
              </button>
              <Button 
                onClick={() => openGenerator('Grant Proposal')}
                className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90"
              >
                Start Free
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Hero */}
      <section ref={heroRef} className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#F6F4EF] leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {'AI-powered documents for non-profits that win funding.'.split(' ').map((word, i) => (
                  <span key={i} className="hero-headline-word inline-block mr-[0.3em]">{word}</span>
                ))}
              </h1>
              
              <p className="hero-subheadline text-lg sm:text-xl text-[#F6F4EF]/70 max-w-xl leading-relaxed">
                Grant proposals, work plans, budgets, M&E plans, and reports—generated from simple templates.
              </p>
              
              <div className="hero-cta flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => openGenerator('Grant Proposal')}
                  className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-8 py-6 text-base"
                >
                  Create Your First Proposal
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="gf-btn text-[#F6F4EF] hover:text-[#D4A03A] px-8 py-3 flex items-center justify-center gap-2"
                >
                  See how it works
                </button>
              </div>
              
              <p className="hero-trust text-sm text-[#F6F4EF]/50">
                No credit card • Export to Word/PDF/Excel
              </p>
            </div>
            
            {/* Right Preview Card */}
            <div className="hero-preview hidden lg:block">
              <div className="bg-[#F6F4EF] rounded-lg shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="h-3 bg-[#D4A03A] rounded-full w-24 mb-6"></div>
                <h3 className="text-2xl text-[#0B4D4A] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Grant Proposal
                </h3>
                <div className="space-y-3">
                  <div className="h-2 bg-[#0B4D4A]/20 rounded w-full"></div>
                  <div className="h-2 bg-[#0B4D4A]/20 rounded w-5/6"></div>
                  <div className="h-2 bg-[#0B4D4A]/20 rounded w-4/5"></div>
                  <div className="h-2 bg-[#0B4D4A]/20 rounded w-full"></div>
                </div>
                <div className="mt-6 p-4 bg-[#D4A03A]/10 rounded border-l-4 border-[#D4A03A]">
                  <p className="text-sm text-[#0B4D4A]/70">Executive Summary</p>
                  <div className="mt-2 h-2 bg-[#D4A03A]/30 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What You Can Create */}
      <section id="capabilities" className="capabilities-section py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[#F6F4EF] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Five documents. One simple flow.
            </h2>
            <p className="text-lg text-[#F6F4EF]/70 max-w-2xl mx-auto">
              Choose a template, answer a few questions, and export a complete, funder-ready document.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {capabilities.map((cap, index) => (
              <div 
                key={index}
                className="capability-card gf-card p-6 cursor-pointer group"
                onClick={() => openGenerator(cap.title)}
              >
                <cap.icon className={`w-10 h-10 ${cap.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl text-[#0B4D4A] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {cap.title}
                </h3>
                <p className="text-sm text-[#0B4D4A]/70 leading-relaxed">
                  {cap.description}
                </p>
                <span className="gf-label text-[#D4A03A] mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
          
          {/* Single Dialog for all generators */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F6F4EF]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#0B4D4A]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {activeGenerator} Generator
                </DialogTitle>
              </DialogHeader>
              {activeGenerator === 'Grant Proposal' && <GrantProposalGenerator />}
              {activeGenerator === 'Work Plan' && <WorkPlanGenerator />}
              {activeGenerator === 'M&E Plan' && <MEPlanGenerator />}
              {activeGenerator === 'Project Budget' && <BudgetGenerator />}
              {activeGenerator === 'Reports' && <ReportGenerator />}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="how-it-works-section py-24 px-6 lg:px-8 bg-[#F6F4EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[#0B4D4A] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              How it works
            </h2>
            <p className="text-lg text-[#0B4D4A]/70">
              From idea to document in minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connectors */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-[#0B4D4A]/20 step-connector origin-left"></div>
            <div className="hidden md:block absolute top-1/2 left-2/3 right-1/6 h-px bg-[#0B4D4A]/20 step-connector origin-left"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="step-block text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#D4A03A] flex items-center justify-center bg-[#F6F4EF]">
                  <span className="text-2xl text-[#D4A03A] font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl text-[#0B4D4A] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {step.title}
                </h3>
                <p className="text-[#0B4D4A]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4-8: Tool Sections (Simplified Previews) */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Grant Proposal */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="gf-label text-[#D4A03A]">Template</span>
              <h3 className="text-3xl sm:text-4xl text-[#F6F4EF]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Grant Proposal Generator
              </h3>
              <p className="text-[#F6F4EF]/70 leading-relaxed">
                Answer simple questions about your project, target beneficiaries, and expected outcomes. 
                Our AI generates a compelling narrative with problem statement, methodology, and budget justification.
              </p>
              <ul className="space-y-3">
                {['Executive summary', 'Problem statement', 'Project methodology', 'Budget justification', 'Organizational capacity'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#F6F4EF]/80">
                    <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => openGenerator('Grant Proposal')}
                className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-8"
              >
                Generate Proposal
              </Button>
            </div>
            <div className="bg-[#F6F4EF] rounded-lg p-8 shadow-xl">
              <div className="h-3 bg-[#D4A03A] rounded-full w-32 mb-6"></div>
              <h4 className="text-xl text-[#0B4D4A] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Generated Proposal</h4>
              <div className="space-y-3">
                <div className="h-3 bg-[#0B4D4A]/15 rounded w-full"></div>
                <div className="h-3 bg-[#0B4D4A]/15 rounded w-5/6"></div>
                <div className="h-3 bg-[#0B4D4A]/15 rounded w-full"></div>
                <div className="h-3 bg-[#0B4D4A]/15 rounded w-4/5"></div>
              </div>
              <div className="mt-6 p-4 bg-[#D4A03A]/10 rounded border-l-4 border-[#D4A03A]">
                <p className="text-sm font-medium text-[#0B4D4A]">Executive Summary</p>
                <div className="mt-2 space-y-2">
                  <div className="h-2 bg-[#D4A03A]/20 rounded w-full"></div>
                  <div className="h-2 bg-[#D4A03A]/20 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Plan */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-[#F6F4EF] rounded-lg p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-[#D4A03A]"></div>
                  <div className="flex-1 h-8 bg-[#0B4D4A]/10 rounded"></div>
                  <span className="text-sm text-[#0B4D4A]/60">Month 1-3</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-[#D4A03A]"></div>
                  <div className="flex-1 h-8 bg-[#0B4D4A]/10 rounded"></div>
                  <span className="text-sm text-[#0B4D4A]/60">Month 4-6</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-[#D4A03A]"></div>
                  <div className="flex-1 h-8 bg-[#0B4D4A]/10 rounded"></div>
                  <span className="text-sm text-[#0B4D4A]/60">Month 7-12</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#0B4D4A]/10">
                <p className="text-sm font-medium text-[#0B4D4A] mb-2">Key Deliverables</p>
                <div className="space-y-2">
                  <div className="h-2 bg-[#0B4D4A]/10 rounded w-full"></div>
                  <div className="h-2 bg-[#0B4D4A]/10 rounded w-5/6"></div>
                  <div className="h-2 bg-[#0B4D4A]/10 rounded w-4/5"></div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <span className="gf-label text-[#D4A03A]">Template</span>
              <h3 className="text-3xl sm:text-4xl text-[#F6F4EF]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Work Plan Builder
              </h3>
              <p className="text-[#F6F4EF]/70 leading-relaxed">
                Define your project activities, assign responsibilities, and set timelines. 
                Generate a comprehensive work plan with Gantt-style visualization and milestone tracking.
              </p>
              <Button 
                onClick={() => openGenerator('Work Plan')}
                className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-8"
              >
                Generate Work Plan
              </Button>
            </div>
          </div>

          {/* M&E Plan */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="gf-label text-[#D4A03A]">Template</span>
              <h3 className="text-3xl sm:text-4xl text-[#F6F4EF]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                M&E Plan Builder
              </h3>
              <p className="text-[#F6F4EF]/70 leading-relaxed">
                Define indicators, data collection methods, and reporting schedules. 
                Create a robust monitoring and evaluation framework that satisfies donor requirements.
              </p>
              <Button 
                onClick={() => openGenerator('M&E Plan')}
                className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-8"
              >
                Generate M&E Plan
              </Button>
            </div>
            <div className="bg-[#F6F4EF] rounded-lg p-8 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#0B4D4A]/20">
                      <th className="text-left py-2 text-[#0B4D4A] font-medium">Indicator</th>
                      <th className="text-left py-2 text-[#0B4D4A] font-medium">Target</th>
                      <th className="text-left py-2 text-[#0B4D4A] font-medium">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#0B4D4A]/10">
                      <td className="py-3 text-[#0B4D4A]/70">Beneficiaries reached</td>
                      <td className="py-3 text-[#0B4D4A]/70">1,000</td>
                      <td className="py-3 text-[#0B4D4A]/70">Quarterly</td>
                    </tr>
                    <tr className="border-b border-[#0B4D4A]/10">
                      <td className="py-3 text-[#0B4D4A]/70">Training sessions</td>
                      <td className="py-3 text-[#0B4D4A]/70">24</td>
                      <td className="py-3 text-[#0B4D4A]/70">Monthly</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-[#0B4D4A]/70">Satisfaction rate</td>
                      <td className="py-3 text-[#0B4D4A]/70">85%</td>
                      <td className="py-3 text-[#0B4D4A]/70">Bi-annual</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-[#F6F4EF] rounded-lg p-8 shadow-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#0B4D4A]/10">
                  <span className="text-[#0B4D4A]/70">Personnel</span>
                  <span className="text-[#0B4D4A] font-medium">$45,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#0B4D4A]/10">
                  <span className="text-[#0B4D4A]/70">Equipment</span>
                  <span className="text-[#0B4D4A] font-medium">$12,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#0B4D4A]/10">
                  <span className="text-[#0B4D4A]/70">Training</span>
                  <span className="text-[#0B4D4A] font-medium">$8,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#0B4D4A]/10">
                  <span className="text-[#0B4D4A]/70">Operations</span>
                  <span className="text-[#0B4D4A] font-medium">$15,000</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#D4A03A]/10 px-4 rounded">
                  <span className="text-[#0B4D4A] font-semibold">Total</span>
                  <span className="text-[#D4A03A] font-bold text-lg">$80,000</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <span className="gf-label text-[#D4A03A]">Template</span>
              <h3 className="text-3xl sm:text-4xl text-[#F6F4EF]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Project Budget Builder
              </h3>
              <p className="text-[#F6F4EF]/70 leading-relaxed">
                Input your line items with costs and justifications. 
                Automatically calculate totals, add contingency, and generate a donor-ready budget table.
              </p>
              <Button 
                onClick={() => openGenerator('Project Budget')}
                className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-8"
              >
                Generate Budget
              </Button>
            </div>
          </div>

          {/* Report */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="gf-label text-[#D4A03A]">Template</span>
              <h3 className="text-3xl sm:text-4xl text-[#F6F4EF]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Report Writer
              </h3>
              <p className="text-[#F6F4EF]/70 leading-relaxed">
                Compile progress updates, financial summaries, and impact stories. 
                Generate professional reports that keep stakeholders informed and engaged.
              </p>
              <Button 
                onClick={() => openGenerator('Reports')}
                className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-8"
              >
                Generate Report
              </Button>
            </div>
            <div className="bg-[#F6F4EF] rounded-lg p-8 shadow-xl">
              <div className="h-3 bg-[#D4A03A] rounded-full w-24 mb-6"></div>
              <h4 className="text-xl text-[#0B4D4A] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Quarterly Progress Report</h4>
              <div className="space-y-3 mb-6">
                <div className="h-2 bg-[#0B4D4A]/15 rounded w-full"></div>
                <div className="h-2 bg-[#0B4D4A]/15 rounded w-5/6"></div>
                <div className="h-2 bg-[#0B4D4A]/15 rounded w-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0B4D4A]/5 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-[#D4A03A]">847</p>
                  <p className="text-xs text-[#0B4D4A]/60">Beneficiaries</p>
                </div>
                <div className="bg-[#0B4D4A]/5 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-[#D4A03A]">18</p>
                  <p className="text-xs text-[#0B4D4A]/60">Activities</p>
                </div>
                <div className="bg-[#0B4D4A]/5 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-[#D4A03A]">92%</p>
                  <p className="text-xs text-[#0B4D4A]/60">On Track</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Built for Your Team */}
      <section className="team-section py-24 px-6 lg:px-8 bg-[#F6F4EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[#0B4D4A] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Built for your team
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {teamCards.map((card, index) => (
              <div key={index} className="team-card gf-card p-8">
                <card.icon className="w-12 h-12 text-[#D4A03A] mb-6" />
                <h3 className="text-2xl text-[#0B4D4A] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {card.title}
                </h3>
                <p className="text-[#0B4D4A]/70 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="team-card bg-[#0B4D4A] rounded-lg p-8 text-[#F6F4EF]">
              <Quote className="w-8 h-8 text-[#D4A03A] mb-4" />
              <p className="text-lg mb-6 leading-relaxed">
                "I cut proposal time by half. What used to take days now takes hours, and the quality is even better."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4A03A]/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#D4A03A]" />
                </div>
                <div>
                  <p className="font-medium">Sarah Mitchell</p>
                  <p className="text-sm text-[#F6F4EF]/60">Grant Writer, Hope Foundation</p>
                </div>
              </div>
            </div>
            <div className="team-card bg-[#0B4D4A] rounded-lg p-8 text-[#F6F4EF]">
              <Quote className="w-8 h-8 text-[#D4A03A] mb-4" />
              <p className="text-lg mb-6 leading-relaxed">
                "Our reports finally look consistent. Donors have noticed the professionalism, and we've seen increased funding."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4A03A]/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#D4A03A]" />
                </div>
                <div>
                  <p className="font-medium">James Okonkwo</p>
                  <p className="text-sm text-[#F6F4EF]/60">Program Director, Community First</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Security & Trust */}
      <section className="security-section py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl text-[#F6F4EF] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Your data stays private.
          </h2>
          <p className="text-lg text-[#F6F4EF]/70 mb-12">
            We don't train on your documents. You control exports, edits, and sharing.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="trust-item">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F6F4EF]/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#D4A03A]" />
              </div>
              <p className="gf-label text-[#F6F4EF]">Encrypted in transit</p>
            </div>
            <div className="trust-item">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F6F4EF]/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#D4A03A]" />
              </div>
              <p className="gf-label text-[#F6F4EF]">No AI training on your data</p>
            </div>
            <div className="trust-item">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F6F4EF]/10 flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#D4A03A]" />
              </div>
              <p className="gf-label text-[#F6F4EF]">Export anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Pricing */}
      <section id="pricing" className="pricing-section py-24 px-6 lg:px-8 bg-[#F6F4EF]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[#0B4D4A] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Simple pricing
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="pricing-card gf-card p-8">
              <h3 className="text-2xl text-[#0B4D4A] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Free</h3>
              <p className="text-4xl font-bold text-[#0B4D4A] mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  5 documents per month
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  All document types
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Word & PDF export
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Basic templates
                </li>
              </ul>
              <Button 
                onClick={() => openGenerator('Grant Proposal')}
                className="w-full gf-btn border-2 border-[#0B4D4A] text-[#0B4D4A] hover:bg-[#0B4D4A] hover:text-[#F6F4EF]"
              >
                Get Started
              </Button>
            </div>
            
            <div className="pricing-card gf-card p-8 border-2 border-[#D4A03A] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A03A] text-[#0B4D4A] px-4 py-1 rounded-full gf-label text-xs">
                Recommended
              </div>
              <h3 className="text-2xl text-[#0B4D4A] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Pro</h3>
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#0B4D4A]">$29<span className="text-lg font-normal text-[#0B4D4A]/60">/mo</span></p>
                <p className="text-sm text-[#0B4D4A]/60 mt-1">or $290/year (Save $58)</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Unlimited documents
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Priority support
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Advanced templates
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Excel export
                </li>
                <li className="flex items-center gap-3 text-[#0B4D4A]/70">
                  <CheckCircle className="w-5 h-5 text-[#D4A03A]" />
                  Custom branding
                </li>
              </ul>
              <div className="space-y-3">
                <Button 
                  onClick={() => openPayment('monthly')}
                  className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90"
                >
                  Monthly - $29/mo
                </Button>
                <Button 
                  onClick={() => openPayment('yearly')}
                  variant="outline"
                  className="w-full gf-btn border-2 border-[#0B4D4A] text-[#0B4D4A] hover:bg-[#0B4D4A] hover:text-[#F6F4EF]"
                >
                  Yearly - $290/yr (Save $58)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal open={paymentOpen} onOpenChange={setPaymentOpen} plan={paymentPlan} />

      {/* Section 12: FAQ */}
      <section id="faq" className="py-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[#F6F4EF] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Frequently asked questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-[#F6F4EF]/20 rounded-lg px-6 bg-[#F6F4EF]/5">
                <AccordionTrigger className="text-left text-[#F6F4EF] hover:text-[#D4A03A] py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#F6F4EF]/70 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 13: Final CTA + Footer */}
      <section className="final-cta-section py-24 px-6 lg:px-8 bg-[#F6F4EF]">
        <div className="max-w-4xl mx-auto text-center final-cta">
          <h2 className="text-4xl sm:text-5xl text-[#0B4D4A] mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Start building funder-ready documents today.
          </h2>
          <Button 
            onClick={() => openGenerator('Grant Proposal')}
            className="gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 px-10 py-6 text-base mb-4"
          >
            Get Started Free
          </Button>
          <p className="text-sm text-[#0B4D4A]/60">No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-[#F6F4EF] border-t border-[#0B4D4A]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0B4D4A] rounded flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#F6F4EF]" />
              </div>
              <div>
                <span className="text-xl font-semibold text-[#0B4D4A]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  GrantForge
                </span>
                <p className="text-xs text-[#0B4D4A]/60">AI documents for non-profits.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <button onClick={() => toast.info('Privacy policy coming soon!')} className="gf-label text-[#0B4D4A]/60 hover:text-[#0B4D4A]">
                Privacy
              </button>
              <button onClick={() => toast.info('Terms of service coming soon!')} className="gf-label text-[#0B4D4A]/60 hover:text-[#0B4D4A]">
                Terms
              </button>
              <button onClick={() => toast.info('Contact form coming soon!')} className="gf-label text-[#0B4D4A]/60 hover:text-[#0B4D4A]">
                Contact
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#0B4D4A]/10 text-center">
            <p className="text-sm text-[#0B4D4A]/50">
              © 2026 GrantForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
