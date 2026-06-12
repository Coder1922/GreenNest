import React, { useState } from 'react';
import {
  ArrowLeft,
  Sprout,
  ShieldCheck,
  HelpCircle,
  Leaf,
  CheckCircle,
  Clock,
  FileText,
  Layers,
  Search,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Check,
  ExternalLink,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface FooterPagesProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserRole: string;
}

export default function FooterPages({ activeTab, setActiveTab, currentUserRole }: FooterPagesProps) {
  // --- Back to Home Helper ---
  const handleBack = () => {
    if (currentUserRole === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (currentUserRole === 'nursery' || currentUserRole === 'gardener') {
      setActiveTab('vendor-dashboard');
    } else {
      setActiveTab('shop');
    }
  };

  // --- TAB: Eco Standards state ---
  const [plantType, setPlantType] = useState<string>('tree');
  const [quantity, setQuantity] = useState<number>(3);
  const [soilType, setSoilType] = useState<string>('compost');

  // Offset calculator logic: approx CO2 offset per year in pounds (lbs)
  const calculateOffset = () => {
    let multiplier = 48; // Standard tree
    if (plantType === 'shrub') multiplier = 12;
    if (plantType === 'indoor') multiplier = 4;
    if (plantType === 'cover') multiplier = 8;

    let base = multiplier * quantity;
    if (soilType === 'compost') base *= 1.15; // +15% benefit
    if (soilType === 'local') base *= 1.05;

    return Math.round(base * 10) / 10;
  };

  // --- TAB: Licensing Rules state ---
  const [searchLicNumber, setSearchLicNumber] = useState<string>('');
  const [licResult, setLicResult] = useState<{
    found: boolean;
    name?: string;
    type?: string;
    status?: string;
    validated?: string;
  } | null>(null);

  const mockLicensesDb = [
    { num: 'ISA-WU-9814', name: 'Thomas Wu', type: 'Certified Master Arborist & Tree Care', status: 'Active Verified', validated: 'June 2026' },
    { num: 'AGR-NSR-OASIS', name: 'Green Leaves Oasis Nursery', type: 'Class A Commercial Sourcing', status: 'Active Verified', validated: 'May 2026' },
    { num: 'ISA-AL-3129', name: 'Alice Lopez', type: 'Licensed Landscape Design Consultant', status: 'Active Verified', validated: 'April 2026' },
    { num: 'AGR-NSR-BLOOM', name: 'Flora Dreamscape & Seed Nursery', type: 'Organic Certified Supplier', status: 'Active Verified', validated: 'May 2026' },
  ];

  const handleSearchLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = searchLicNumber.trim().toUpperCase();
    if (!cleanNum) {
      setLicResult(null);
      return;
    }
    const match = mockLicensesDb.find(item => item.num.includes(cleanNum) || cleanNum.includes(item.num));
    if (match) {
      setLicResult({ found: true, ...match });
    } else {
      setLicResult({ found: false });
    }
  };

  // --- TAB: Help Desk Support state ---
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);
  const [supportName, setSupportName] = useState<string>('');
  const [supportEmail, setSupportEmail] = useState<string>('');
  const [supportCategory, setSupportCategory] = useState<string>('delivery');
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [submittedTickets, setSubmittedTickets] = useState<{
    id: string;
    name: string;
    email: string;
    category: string;
    message: string;
    status: string;
    date: string;
  }[]>(() => {
    const saved = localStorage.getItem('gn_support_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) return;

    const newTicket = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      name: supportName,
      email: supportEmail,
      category: supportCategory,
      message: supportMessage,
      status: 'Awaiting triage',
      date: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...submittedTickets, newTicket];
    setSubmittedTickets(updated);
    localStorage.setItem('gn_support_tickets', JSON.stringify(updated));

    // Reset inputs
    setSupportName('');
    setSupportEmail('');
    setSupportMessage('');

    // Trigger local visual feedback
    alert(`Support Ticket ${newTicket.id} has been registered securely. A customer support botanist has been assigned and will reply within 4 hours.`);
  };

  const handleClearTickets = () => {
    setSubmittedTickets([]);
    localStorage.removeItem('gn_support_tickets');
  };

  const faqs = [
    {
      q: 'How does the GreenNest Escrow Payment safety protocol protect buyers?',
      a: 'We secure client payments in a temporary escrow hold during booking schedules or nursery dispatch transits. Registered funds are only released to gardeners or nurseries when either the homeowner clicks "Sign-off Completion" in their panel or after 7 days post-completion under default SLA rules without dispute filings.'
    },
    {
      q: 'My plant courier package arrived with yellowed leaves. Is it eligible for a refund?',
      a: 'Live flora naturally experiences minor transport stress (light leaf dropping or leaf fatigue). If roots are secure and soil has trace moisture, standard rehydration in filtered partial-shade typically brings recovery in 48 hours under our Eco Standard guidelines. If severe stem fracture or complete root blight has occurred, you can file a refund dispute docket in your Orders list.'
    },
    {
      q: 'How does GreenNest background-vet freelance arborists and specialist designers?',
      a: 'We partner with accredited screening agencies to conduct rigorous criminology, identity, and reference audits for any specialist seeking to list home services. Arborists must additionally provide a valid ISA Certified Arborist License number that matches active state registrar rosters.'
    },
    {
      q: 'Can I change my booked appointment slot or reschedule professional lawn care?',
      a: 'Rescheduling home bookings is free if requested at least 24 hours in advance. Simply access your booked services log in the Customer Panel and press "Request Reschedule" or send a chat request directly through support tools.'
    }
  ];

  return (
    <div id="footer-pages-viewport" className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Back Button controller and SubHeader */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-150 shadow-xs">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-150 hover:bg-slate-200 text-gray-800 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs border border-gray-200"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Platform
        </button>

        <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-emerald-700" /> Platform Knowledge Base & Service Accord
        </span>
      </div>

      {/* --- ECO STANDARDS PAGE --- */}
      {activeTab === 'eco-standards' && (
        <div className="space-y-8">
          {/* Main banner block page */}
          <div className="bg-gradient-to-r from-[#0d3c26] via-[#104e32] to-teal-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-sm border border-emerald-800">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500 rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-teal-400 rounded-full opacity-15 blur-2xl"></div>

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold tracking-widest text-[#00f38c] uppercase bg-emerald-950/80 rounded-full px-3 py-1 border border-emerald-500/20">
                <Leaf className="h-3 w-3" /> Code ECO-26 Compliant
              </span>
              <h2 className="text-xl sm:text-3xl font-sans font-black tracking-tight leading-none text-emerald-50">
                Organic Stewardship & Nursery Quality Standards
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-3xl leading-relaxed">
                GreenNest implements rigorous biological sourcing parameters to ensure that every sprout, bloom, pot, and gardening soil blend listed on our platform promotes flourishing biodiversity and offsets trace greenhouse carbon.
              </p>
            </div>
          </div>

          {/* Core Principles Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs relative group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-750 font-bold flex items-center justify-center mb-4">
                <CheckCircle className="h-5 w-5 text-emerald-700" />
              </div>
              <h4 className="font-sans font-extrabold text-[#0d3c26] text-sm sm:text-base">Biological Pest Management</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Our partnered nurseries pledge to use biological predators (like beneficial ladybugs and green lacewings) and organic cold-pressed neem oils over harmful synthetic neonicotinoid sprays to maintain healthy, resilient foliage crops.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs relative group">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0d3c26] font-bold flex items-center justify-center mb-4">
                <Layers className="h-5 w-5 text-teal-700" />
              </div>
              <h4 className="font-sans font-extrabold text-[#0d3c26] text-sm sm:text-base">Peat-Free Conservation Soils</h4>
              <p className="text-xs text-gray-550 mt-2 leading-relaxed">
                To preserve carbon-capturing peatlands globally, all soil products and potting blends distributed through GreenNest are 105% peat-free, utilizing sustainably sourced organic compost, coconut coir, and thermal pine wood shavings instead.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs relative group">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-750 font-bold flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-indigo-700" />
              </div>
              <h4 className="font-sans font-extrabold text-[#0d3c26] text-sm sm:text-base">Zero-Waste Courier Wraps</h4>
              <p className="text-xs text-gray-550 mt-2 leading-relaxed">
                Deliveries are wrapped in 100% biodegradable corrugated cardboard with root balls nestled in organic burlap bags instead of petroleum-based plastic sleeves, reducing landscape landfill footprints to zero.
              </p>
            </div>
          </div>

          {/* Interactive Carbon Offset Estimation Engine */}
          <div className="bg-[#FAFBF7] border border-emerald-100 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
            <div className="border-b border-emerald-150 pb-4">
              <h3 className="font-sans font-black text-[#0d3c26] text-base sm:text-lg">
                Interactive Biological Carbon Offset Estimator
              </h3>
              <p className="text-xs text-gray-550 mt-1">
                Enter your prospective residential backyard additions to calculate their estimated annual carbon dioxide absorption benefits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                    Flora Taxonomy Group
                  </label>
                  <select
                    value={plantType}
                    onChange={(e) => setPlantType(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="tree">🌳 Native Shade Tree (Oak, Maple, Elm)</option>
                    <option value="shrub">🌿 Evergreen Shrub / Boxwood</option>
                    <option value="indoor">☘️ Broadleaf Houseplant (Snake, Monstera)</option>
                    <option value="cover">🌸 Perennial Ground Cover / Rose Bed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                    Quantity Sown
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                    Premium Compost / Soil Bio-boost
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="compost">With Heat-Pasteurized Compost (+15% Carbon Capture)</option>
                    <option value="local">With Raw Regional Soil (+5% Carbon Capture)</option>
                    <option value="none">Standard Sand/Clay Silt (No Boost)</option>
                  </select>
                </div>
              </div>

              {/* Graphical result card */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-emerald-50 p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-emerald-500 rounded-full opacity-5"></div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 rounded px-2.5 py-0.5 border border-emerald-100 uppercase inline-block">
                    Environmental Index Projection
                  </span>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-3xl sm:text-5xl font-mono font-extrabold text-[#0d3c26]">
                      {calculateOffset()}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">lbs of CO₂ / year</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans mt-2">
                    This selection of flora absorbs a lifetime average equivalent of emissions corresponding to charging over <strong>{Math.round(calculateOffset() * 57.6)} smartphones</strong>!
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-gray-650">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 font-bold" /> Checked Bio-remediation compliant
                  </span>
                  <span className="text-emerald-800 font-bold">
                    GreenNext Global Offset Rating: Grade A+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LICENSING RULES PAGE --- */}
      {activeTab === 'licensing-rules' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-sm border border-emerald-800">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500 rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-400 rounded-full opacity-15 blur-2xl"></div>

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold tracking-widest text-indigo-300 uppercase bg-emerald-950/80 rounded-full px-3 py-1 border border-[#0d3c26]">
                <ShieldCheck className="h-3 w-3" /> Policy Protocol GS-LIC-9
              </span>
              <h2 className="text-xl sm:text-3xl font-sans font-black tracking-tight leading-none text-emerald-55">
                Horticulture Licensing & Specialist Vetting Policy
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-3xl leading-relaxed">
                GreenNest implements a multi-layer credentials vetting framework before authorizing home landscaping bookings, protecting neighborhood health, botanical biosecurity, and client peace of mind.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Detailed guidelines narrative */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6">
              <h3 className="font-sans font-black text-[#0d3c26] text-base uppercase tracking-wider pb-3 border-b border-gray-100">
                Core Licentiate & Sourcing Guidelines (Standard LIC-9)
              </h3>

              <div className="space-y-6 text-xs text-gray-750">
                <div className="space-y-1.5">
                  <span className="font-extrabold text-gray-900 block text-xs">Section I: Phytosanitary & Bio-safety Certifications</span>
                  <p className="leading-relaxed">
                    Nursery vendor inventories must undergo certified thermal pasteurization on nursery soils, verified using chemical litmus to guarantee eradication of root rot nematode spores and destructive leaf beetle larva prior to shipment across regional borders.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-extrabold text-gray-900 block text-xs">Section II: Safety & Criminal Background Clearances (BGC)</span>
                  <p className="leading-relaxed">
                    Before activating any arborist profile or gardening listing to permit physical on-site home bookings, specialists must yield absolute clearance under active background scrutiny. This includes criminal registries checks, identity matching, and professional client reference audits.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-extrabold text-gray-900 block text-xs">Section III: Professional Trade Accreditations</span>
                  <p className="leading-relaxed">
                    Arborists and tree service personnel must list their International Society of Arboriculture (ISA) license code. Lawn designs and pruning configurations submitted on GreenNest require a secondary certification confirming training in localized biological disease vectors.
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Simulator tool */}
            <div className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden group">
              <div>
                <h4 className="font-sans font-black text-emerald-950 text-sm uppercase tracking-wider">
                  Accreditation Validation Engine
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Query our registry database directly to confirm the active clearance of a contractor license or nursery state permit.
                </p>
              </div>

              <form onSubmit={handleSearchLicense} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">
                    Enter License or Permit Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISA-WU-9814"
                    value={searchLicNumber}
                    onChange={(e) => setSearchLicNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none uppercase font-mono"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Verify Credentials Status
                </button>
              </form>

              {/* Status Report Result Box */}
              {licResult && (
                <div className="animate-scaleIn pt-4 border-t border-gray-100">
                  {licResult.found ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-700" />
                        <span className="text-xs font-bold text-emerald-900">Credentials Validated</span>
                      </div>
                      <div className="text-[11px] text-emerald-950 font-sans space-y-0.5">
                        <p><strong>License Holder:</strong> {licResult.name}</p>
                        <p><strong>Classification:</strong> {licResult.type}</p>
                        <p><strong>Roster Status:</strong> <span className="text-emerald-800 font-bold uppercase font-mono text-[10px]">{licResult.status}</span></p>
                        <p className="text-emerald-800/80 text-[10px] font-mono mt-1 pt-1 border-t border-emerald-150">Last audited: {licResult.validated}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1.5 text-xs text-rose-950">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900">
                        <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
                        <span>License Record Absent</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-rose-900/80">
                        This license is not synced with active primary rosters. If you are an applicant, submit high-resolution scans to our help desk support.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Verified badges */}
              <div className="bg-[#FAFBF7] border border-gray-150 p-4 rounded-2xl text-[11px] text-gray-500 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-750 shrink-0" />
                <span>All platform service links carry a minimum <strong>$1,000,000 General Liability Guarantee</strong> automatically.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HELP DESK SUPPORT PAGE --- */}
      {activeTab === 'help-desk' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main banner block */}
          <div className="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-sm border border-teal-800">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-teal-400 rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-[#00f38c] rounded-full opacity-10 blur-2xl"></div>

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold tracking-widest text-[#00f38c] uppercase bg-teal-950/80 rounded-full px-3 py-1 border border-teal-500/20">
                <HelpCircle className="h-3 w-3 animate-pulse" /> Botanical Support Desk
              </span>
              <h2 className="text-xl sm:text-3xl font-sans font-black tracking-tight leading-none text-teal-100">
                GreenNest Help Desk & Support Center
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/90 max-w-3xl leading-relaxed">
                Connect directly with certified operational horticulturalists and administration staff to answer queries, process package shipping updates, or file dispute settlements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Interactive FAQs Accordion */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 space-y-5">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-sans font-black text-[#0d3c26] text-base uppercase tracking-wider">
                  Frequently Asked Botanical Questions
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Click a question segment to expand and review platform rules, plant transits advice, or payment security.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-150 rounded-2xl overflow-hidden transition-all duration-200 hover:border-emerald-250">
                    <button
                      onClick={() => setFaqOpenIdx(faqOpenIdx === idx ? null : idx)}
                      className="w-full py-4 px-5 text-left text-xs font-bold text-gray-900 bg-gray-50/50 hover:bg-gray-50 flex justify-between items-center gap-4 transition-colors cursor-pointer"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-gray-400 shrink-0 transition-transform ${faqOpenIdx === idx ? 'rotate-180 text-emerald-800' : ''}`} />
                    </button>
                    {faqOpenIdx === idx && (
                      <div className="p-5 text-xs text-gray-650 leading-relaxed bg-white border-t border-gray-150 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Ticket Logger Block */}
            <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h4 className="font-sans font-black text-emerald-950 text-sm uppercase tracking-wider">
                  Log a New Support Incident Docket
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Complete the fields. An active administrator will reply to your registered account within a strict 4-hour SLA window.
                </p>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor@gmail.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">
                    Topic Category Classification
                  </label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="delivery">🚚 Delayed Parcel / Nursery courier transit</option>
                    <option value="gardening">🪜 Specialist Gardener Rescheduling / Service dispute</option>
                    <option value="license">👮 Apply to verify Nursery / Arborist Professional license</option>
                    <option value="soil">🧪 Soil Biosecurity standards or nursery shipping certificates</option>
                    <option value="billing">💳 Billing query & Escrow disburse balance holding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">
                    Incident Statement / Query Details
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide full description of delayed shipments or license scanning issues..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none font-sans"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Publish Help Incident Docket
                </button>
              </form>

              {/* Dynamic logged tickets display section */}
              {submittedTickets.length > 0 && (
                <div className="border-t border-gray-150 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-gray-450 uppercase uppercase tracking-wider block">
                      Active Ticket Dossiers ({submittedTickets.length})
                    </span>
                    <button
                      onClick={handleClearTickets}
                      className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear History
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                    {submittedTickets.map((t) => (
                      <div key={t.id} className="border border-gray-150 rounded-2xl p-4 space-y-2 bg-gray-50/20 hover:bg-[#FAFBF7] transition-all">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-black text-gray-900">{t.id}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-bold">
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 leading-normal line-clamp-1">
                          Subject of Category: {t.category.toUpperCase()}
                        </p>
                        <p className="text-[11px] text-gray-500 italic line-clamp-2 leading-relaxed">
                          "{t.message}"
                        </p>
                        <div className="flex justify-between items-center text-[9px] text-gray-450 pt-2 border-t border-dashed border-gray-200">
                          <span>Reported by: {t.name} ({t.email})</span>
                          <span>{t.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
