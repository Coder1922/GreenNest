import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldAlert,
  Sprout,
  BarChart3,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Briefcase,
  TrendingUp,
  Scale,
  Trash,
  Plus,
  Edit,
  FolderPlus,
  Tag,
  Search,
  Sliders,
  X,
  PlusCircle,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  Award,
  Layers,
  Heart,
  Calendar,
  ShieldCheck,
  Info
} from 'lucide-react';
import { User, Product, Order, ServiceBooking, Dispute, Review } from '../types';
import { getProductDataUri, getProductImage } from '../utils/productImages';

interface AdminPortalProps {
  users: User[];
  products: Product[];
  orders: Order[];
  bookings: ServiceBooking[];
  disputes: Dispute[];
  reviews: Review[];
  onToggleVerifyUser: (userId: string) => void;
  onRemoveProductAdmin: (productId: string) => void;
  onResolveDispute: (disputeId: string, resolutionNotes: string) => void;
  activeTab: string;
  categories: string[];
  subCategories: string[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
  onAddSubCategory: (subCat: string) => void;
  onRemoveSubCategory: (subCat: string) => void;
  onEditProductAdmin: (updatedProduct: Product) => void;
  onCreateProductAdmin: (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewsCount'>) => void;
}

export default function AdminPortal({
  users,
  products,
  orders,
  bookings,
  disputes,
  reviews,
  onToggleVerifyUser,
  onRemoveProductAdmin,
  onResolveDispute,
  activeTab,
  categories,
  subCategories,
  onAddCategory,
  onRemoveCategory,
  onAddSubCategory,
  onRemoveSubCategory,
  onEditProductAdmin,
  onCreateProductAdmin
}: AdminPortalProps) {
  // Dispute resolves
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Search & dynamic catalog filters
  const [productSearch, setProductSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  // Category inline additions
  const [newCatInput, setNewCatInput] = useState('');
  const [newSubCatInput, setNewSubCatInput] = useState('');

  // Active modal editing states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [addForm, setAddForm] = useState<Partial<Product>>({
    name: '',
    category: 'Plants' as any,
    subCategory: 'Indoor' as any,
    price: 25,
    stock: 20,
    description: '',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&auto=format&fit=crop&q=80',
    careInstructions: {
      light: 'Bright indirect indoor placement',
      water: 'Once per week. Do not stagnate water',
      difficulty: 'Easy' as any,
      placement: 'Indoor'
    }
  });

  // KPI calculations
  const nurseriesList = useMemo(() => users.filter(u => u.role === 'nursery'), [users]);
  const gardenersList = useMemo(() => users.filter(u => u.role === 'gardener'), [users]);
  const customersCount = useMemo(() => users.filter(u => u.role === 'customer').length, [users]);

  const totalVolume = useMemo(() => {
    const productTotal = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
    const serviceTotal = bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.price, 0);
    return Number((productTotal + serviceTotal).toFixed(2));
  }, [orders, bookings]);

  const platformKPIs = useMemo(() => {
    const completionRate = bookings.length > 0 
      ? Math.round((bookings.filter(b => b.status === 'Completed').length / bookings.length) * 100) 
      : 100;
    
    return {
      totalUsers: users.length,
      activeProducts: products.length,
      completionRate: `${completionRate}%`,
      openDisputes: disputes.filter(d => d.status === 'Open').length
    };
  }, [users, products, bookings, disputes]);

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingId || !resolutionNote) return;
    onResolveDispute(resolvingId, resolutionNote);
    setResolvingId(null);
    setResolutionNote('');
  };

  // Search product filters list 
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchText = prod.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                        prod.sellerName.toLowerCase().includes(productSearch.toLowerCase()) ||
                        prod.description.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = catFilter === '' || prod.category === catFilter;
      return matchText && matchCat;
    });
  }, [products, productSearch, catFilter]);

  // Form submits
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditForm({ ...p });
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editForm.name) {
      onEditProductAdmin(editForm as Product);
      setEditingProduct(null);
    }
  };

  const handleSaveAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (addForm.name && addForm.price && addForm.stock) {
      onCreateProductAdmin(addForm as any);
      setShowAddModal(false);
      setAddForm({
        name: '',
        category: categories[0] as any || 'Plants',
        subCategory: subCategories[0] as any || 'Indoor',
        price: 25,
        stock: 20,
        description: '',
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&auto=format&fit=crop&q=80',
        careInstructions: {
          light: 'Bright indirect indoor placement',
          water: 'Once per week. Do not stagnate water',
          difficulty: 'Easy' as any,
          placement: 'Indoor'
        }
      });
    }
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* 🚀 ADMIN DASHBOARD METRICS ARCHITECTURE */}
      {activeTab === 'admin-dashboard' && (
        <div id="admin-dashboard-panel" className="space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm border border-emerald-800">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500 rounded-full opacity-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-teal-500 rounded-full opacity-10 blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-[#00f38c] uppercase bg-emerald-950/80 rounded-full px-3 py-1 border border-emerald-500/30">
                  <Activity className="h-3 w-3 animate-pulse" /> Live Telemetry Dashboard
                </span>
                <h2 className="text-xl sm:text-2xl font-sans font-black tracking-tight text-white leading-none">
                  GreenNest Operations Sentinel
                </h2>
                <p className="text-xs text-emerald-250/80 max-w-xl leading-relaxed">
                  Platform telemetry index. Command center to assess trade volumes, monitor real-time nursery credentials, resolve customer-vendor disputes, and check node health parameters.
                </p>
              </div>
              
              <div className="flex gap-4 shrink-0 font-mono text-xs text-right">
                <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-2xl">
                  <span className="text-[9px] text-[#00f38c]/70 block font-bold uppercase tracking-wider">Horticulture Index</span>
                  <span className="text-sm font-bold text-white block mt-0.5">Grade A compliant</span>
                </div>
                <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-2xl">
                  <span className="text-[9px] text-[#00f38c]/70 block font-bold uppercase tracking-wider">Active System Nodes</span>
                  <span className="text-sm font-bold text-white block mt-0.5">4 Virtual Links</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 PREMIUM KPI BLOCKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 group-hover:scale-y-110 transition-transform"></div>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +14% MoM
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total User Base</span>
                <span className="text-xl font-mono font-extrabold text-gray-900 block mt-1">{platformKPIs.totalUsers} Profiles</span>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span>Customers: {customersCount}</span>
                  <span className="text-indigo-600 font-medium">Vendors: {nurseriesList.length + gardenersList.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 group-hover:scale-y-110 transition-transform"></div>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active SKU
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Listed Inventory</span>
                <span className="text-xl font-mono font-extrabold text-gray-900 block mt-1">{products.length} Items</span>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span>Taxonomy: {categories.length} Classes</span>
                  <span className="text-emerald-700 font-medium">In-Stock Status: High</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500 group-hover:scale-y-110 transition-transform"></div>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-extrabold text-teal-750 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-250">
                  +24.1% YoY
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Platform Gross Turnover</span>
                <span className="text-xl font-mono font-extrabold text-[#0d3c26] block mt-1">${totalVolume}</span>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span>Product Sales: 62%</span>
                  <span className="text-teal-700 font-medium">Gardening Fees: 38%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 group-hover:scale-y-110 transition-transform"></div>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                  platformKPIs.openDisputes > 0 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {platformKPIs.openDisputes > 0 ? 'Action Reqd' : 'Flawless'}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Complaints Queue</span>
                <span className="text-xl font-mono font-extrabold text-rose-700 block mt-1">{platformKPIs.openDisputes} Open Cases</span>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span>SLA Check: Passed</span>
                  <span className="text-rose-700 font-medium">Mediation rate: 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 📊 PLATFORM PERFORMANCE & FINANCIAL METRICS LEDGER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales visual trends chart */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100/80 shadow-xs lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h3 className="font-sans font-black text-[#0d3c26] text-sm uppercase tracking-wider">
                    Administrative Trade & Transact Ingress
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bi-Weekly aggregate of organic plant deliveries and verified gardener invoices combined.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-gray-600">
                  <div className="flex items-center gap-1.5 bg-gray-50 border px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Nursery Catalog</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 border px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>Gardener Service</span>
                  </div>
                </div>
              </div>

              {/* Graphical Representation */}
              <div className="pt-2">
                <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-gray-150 pb-2 relative">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((gridLine, idx) => (
                    <div 
                      key={idx} 
                      className="absolute left-0 w-full border-t border-dashed border-gray-100 text-[8px] font-mono text-gray-450 z-0"
                      style={{ bottom: `${gridLine}%` }}
                    >
                      <span className="absolute left-0 -mt-2 bg-white px-1 font-bold tracking-wider">{gridLine * 6} Value</span>
                    </div>
                  ))}

                  {/* Columns */}
                  {[180, 290, 210, 440, 390, 510, totalVolume > 0 ? Math.min(550, totalVolume) : 420].map((val, idx) => {
                    const names = ['Cycle A', 'Cycle B', 'Cycle C', 'Cycle D', 'Cycle E', 'Cycle F', 'May 23 (Live)'];
                    const nurserySplit = Math.round(val * 0.62);
                    const gardenerSplit = val - nurserySplit;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                        {/* Hover Popup Tooltip info */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-slate-900 text-white rounded-xl p-3.5 shadow-xl transition-opacity duration-300 w-48 text-[11px] pointer-events-none z-50 space-y-1 border border-slate-700">
                          <p className="font-sans font-bold text-[#00f38c]">{names[idx]} Total Ingress</p>
                          <div className="border-t border-slate-700 my-1 pt-1 space-y-0.5 font-mono text-[10px]">
                            <div className="flex justify-between">
                              <span>☘️ Nursery orders:</span>
                              <span className="font-bold">${nurserySplit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🪜 Service Bills:</span>
                              <span className="font-bold">${gardenerSplit}</span>
                            </div>
                            <div className="flex justify-between text-white border-t border-slate-800 pt-1 mt-1 font-bold">
                              <span>Sum:</span>
                              <span>${val}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Column split stacked */}
                        <div className="w-full flex flex-col justify-end h-44 gap-0.5 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                          {/* Gardener Split (top piece) */}
                          <div 
                            style={{ height: `${(gardenerSplit / 5.5)}px` }} 
                            className="w-full bg-indigo-600 relative"
                          ></div>
                          {/* Nursery Split (bottom piece) */}
                          <div 
                            style={{ height: `${(nurserySplit / 5.5)}px` }} 
                            className="w-full bg-emerald-800 relative"
                          ></div>
                        </div>

                        {/* Title x-axis */}
                        <span className="text-[9px] font-bold text-gray-550 font-mono tracking-tight text-center truncate w-full">
                          {names[idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub features list indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-gray-600 bg-gray-50 p-4.5 rounded-2xl border border-gray-150">
                <div className="space-y-1">
                  <p className="font-bold text-gray-850 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle className="h-4 w-4 text-emerald-600" /> Platform Retention Rate: 91.4%
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Nursery buyers indicate consistent returning habits. Repeat customers place an average of 3.4 product orders over a 90-day seasonal term.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-850 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="h-4 w-4 text-indigo-600" /> Dynamic Optimization Engine Active
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Automatic delivery routing maps and certified gardener scheduling models have streamlined platform dispatch lags by 4 hours platform-wide.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Subcategory shares and trend widgets */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100/80 shadow-xs space-y-6">
              <div>
                <h3 className="font-sans font-black text-[#0d3c26] text-sm uppercase tracking-wider">
                  Species & Category Market Shares
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Percentage distribution of platform transactions.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { name: '☘️ Indoor Air-Purifiers (Snake, Monstera)', pct: '72%', color: 'bg-emerald-800' },
                  { name: '🪨 Artisan Ceramics & Drainage Pots', pct: '54%', color: 'bg-teal-600' },
                  { name: '🪜 Professional Soil pH Calibration Services', pct: '41%', color: 'bg-indigo-600' },
                  { name: '🪵 Certified Organic Nutrients & Seeds', pct: '28%', color: 'bg-amber-600' }
                ].map((categoryItem, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="text-gray-900 font-bold truncate pr-3">{categoryItem.name}</span>
                      <span className="font-mono font-bold text-gray-550">{categoryItem.pct}</span>
                    </div>
                    {/* Progress container bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        style={{ width: categoryItem.pct }}
                        className={`h-full ${categoryItem.color} rounded-full`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#FAFBF7] border border-emerald-50 rounded-2xl p-4.5 space-y-3">
                <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100 rounded px-2 py-0.5">
                  <Award className="h-3 w-3 text-emerald-700" /> Platform Standard Compliance
                </span>
                <p className="text-xs text-gray-650 leading-relaxed">
                  Registered biosecurity checks and nursery shipping certificates comply fully with state standards. Certified soil microflora scores stand at an active rating of <strong>99.42%</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 📡 REAL-TIME INFRASTRUCTURE STACK AND TELEMETRY TIMELINE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Nodes Diagnostics and health */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-xs space-y-6">
              <div>
                <h3 className="font-sans font-black text-[#0d3c26] text-sm uppercase tracking-wider">
                  Diagnostic Nodes & API Status
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automated service monitoring parameters polled live.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-150 p-4 rounded-2xl bg-[#FAFBF7] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Horticultural DB Status</span>
                    <span className="text-xs font-bold text-gray-950 block">Synced & Encrypted</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] border border-emerald-200">
                    Active Node
                  </span>
                </div>

                <div className="border border-gray-150 p-4 rounded-2xl bg-[#FAFBF7] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-mono">BGC Vetting Pipeline API</span>
                    <span className="text-xs font-bold text-gray-950 block">Integrated Feeds Online</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] border border-emerald-200">
                    Connected
                  </span>
                </div>

                <div className="border border-gray-150 p-4 rounded-2xl bg-[#FAFBF7] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">TLS Key Exchange</span>
                    <span className="text-xs font-bold text-gray-950 block">Locked (SHA-256)</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-[10px] border border-indigo-200">
                    TLS 1.3 Secure
                  </span>
                </div>

                <div className="border border-gray-150 p-4 rounded-2xl bg-[#FAFBF7] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Vitals (CPU & memory Load)</span>
                    <span className="text-xs font-bold text-gray-950 block">0.12 CPU / 4.4GB RAM</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] border border-emerald-200">
                    99.992% Up
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Live Events Timeline */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 shadow-xs lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-sans font-black text-[#0d3c26] text-sm uppercase tracking-wider">
                  Live Operations Event Ticker
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Security logging output capturing transactions, credentials, and catalog modifications.
                </p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {[
                  { icon: <Clock className="h-4 w-4 text-emerald-700" />, time: '2 mins ago', text: 'Secure Database Synchronization completed cleanly.', color: 'border-emerald-100 bg-emerald-50/30' },
                  { icon: <Sprout className="h-4 w-4 text-teal-700" />, time: '14 mins ago', text: `Loaded list containing ${products.length} registered products and verified pricing matrices.`, color: 'border-teal-100 bg-teal-50/20' },
                  { icon: <ShieldAlert className="h-4 w-4 text-amber-700" />, time: '38 mins ago', text: 'Priya Sharma applied for Nursery Certification. Identity credential check queued.', color: 'border-amber-100 bg-amber-50/30' },
                  { icon: <Award className="h-4 w-4 text-indigo-700" />, time: '1 hour ago', text: ' thomas Wu (Arborist Cert #9814) completed background verification checklist.', color: 'border-indigo-100 bg-indigo-50/20' },
                  { icon: <Scale className="h-4 w-4 text-rose-700" />, time: '3 hours ago', text: `Audit system scanned ${platformKPIs.openDisputes} pending complaints in queue with no threshold violations.`, color: 'border-rose-100 bg-rose-50/20' }
                ].map((timelineItem, idx) => (
                  <div key={idx} className={`flex items-start gap-4 p-3.5 rounded-2xl border ${timelineItem.color} transition-all hover:scale-[1.01]`}>
                    <div className="p-2 bg-white rounded-xl border border-gray-150 shrink-0 shadow-xs">
                      {timelineItem.icon}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="font-bold text-gray-900">Event #{605 + idx}</span>
                        <span className="text-gray-400">{timelineItem.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-normal truncate sm:whitespace-normal font-sans">
                        {timelineItem.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guidelines accordion check list footer */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b">
              <CheckCircle className="h-5 w-5 text-emerald-800" />
              <h3 className="font-sans font-extrabold text-[#0d3c26] text-base leading-snug">
                Administrative Security Guidelines & Verification Frameworks
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-650">
              <div className="space-y-2">
                <p className="font-bold text-gray-950 flex items-center gap-1.5 font-sans">
                  <Award className="h-4.5 w-4.5 text-emerald-700 shrink-0" />
                  1. Nursery Bio-Safety Standards (Code GS-V1)
                </p>
                <p className="leading-relaxed pl-6">
                  Prior to activating a gardener or arborist account to accept bookings, administrators must inspect their identity filings, professional references, liability insurance covers, and certificate transcripts. This prevents liability incidents in residential neighborhoods.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-gray-950 flex items-center gap-1.5 font-sans">
                  <Scale className="h-4.5 w-4.5 text-indigo-700 shrink-0" />
                  2. Holding Escrow Vetting Code (Code GS-D2)
                </p>
                <p className="leading-relaxed pl-6">
                  Under standard dispute rules, funds placed in the local digital holding balance remain locked in escrow until the customer signs off on the booking or the admin logs a resolution. If a dispute is resolved, automatic notifications alert both parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🤝 LICENSING APPROVAL QUEUE TAB */}
      {activeTab === 'admin-approvals' && (
        <div id="admin-approvals-panel" className="space-y-8 animate-fadeIn">
          {/* Header Dashboard Banner */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-200 mb-2">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> Regulatory Clearance
                </span>
                <h3 className="font-sans font-black text-[#0d3c26] text-xl tracking-tight">
                  Nursery & Specialist Accreditation Suite
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Verify legal business filings, phytosanitary state certifications, arborist credentials, and bio-security protocols before enabling instant product list exposure platform-wide.
                </p>
              </div>

              {/* Status metrics bar */}
              <div className="flex flex-wrap gap-4 shrink-0 font-mono text-[11px] text-gray-700">
                <div className="bg-indigo-50/50 border border-indigo-100 py-1.5 px-3.5 rounded-xl">
                  <span className="text-[9px] text-indigo-700 font-bold uppercase block tracking-wider">Vetting SLA</span>
                  <span className="font-bold text-indigo-950">18.4 Hours Avg</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 py-1.5 px-3.5 rounded-xl">
                  <span className="text-[9px] text-emerald-700 font-bold uppercase block tracking-wider">Pass Rate</span>
                  <span className="font-bold text-emerald-950">92.4% Verified</span>
                </div>
              </div>
            </div>

            {/* Quick summary tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans text-gray-650">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-gray-150 space-y-1">
                <span className="font-bold text-gray-900 block">☘️ Step 1: Agr. Audit</span>
                <span className="text-[11px] leading-relaxed text-gray-500 block">Ensure matching state agricultural licensing credentials and biosecurity zone approvals.</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-gray-150 space-y-1">
                <span className="font-bold text-gray-900 block">🕵️‍♂️ Step 2: BGC Check</span>
                <span className="text-[11px] leading-relaxed text-gray-500 block">Arborists undergo thorough criminology BGCs prior to residential physical boundary service.</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-gray-150 space-y-1">
                <span className="font-bold text-gray-900 block">🧪 Step 3: Bio-Safety</span>
                <span className="text-[11px] leading-relaxed text-gray-500 block">Pruning tools and pots sanitization guidelines must match GN-C3 sterilizing rules.</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-gray-150 space-y-1">
                <span className="font-bold text-gray-900 block">✍️ Step 4: Soil Certificate</span>
                <span className="text-[11px] leading-relaxed text-gray-500 block">Verify soil blends are heat-pasteurized to eradicate latent fungal spores and insect eggs.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Nurseries list segment */}
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h4 className="font-sans font-black text-emerald-950 text-sm flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-emerald-700" />
                  Nursery Supply Partners ({nurseriesList.length})
                </h4>
                <span className="text-[10px] text-gray-400 font-mono font-bold uppercase bg-slate-50 rounded px-2 py-0.5 border">
                  Sourcing Registered
                </span>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {nurseriesList.map((n) => (
                  <div 
                    key={n.id} 
                    className="border border-gray-150 hover:border-emerald-200 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/20 hover:bg-[#FAFBF7] transition-all"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={n.avatar} 
                        alt={n.name} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
                        }}
                        className="h-12 w-12 rounded-2xl object-cover border border-emerald-100 shrink-0 shadow-xs" 
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-sans font-extrabold text-gray-950 text-xs sm:text-sm leading-none">{n.companyName}</h5>
                          {n.verified && (
                            <span className="inline-flex items-center text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-200">
                              L9 Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">Officer: {n.name} | {n.email}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-sm">Location: {n.address}</p>
                        
                        {/* Interactive Credentials List layout */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          <span className="text-[8px] font-mono font-bold bg-neutral-100 text-neutral-700 rounded px-1.5 py-0.2 border border-neutral-200">
                            State Agr. Lic #NSR-{n.id.substring(0,4).toUpperCase()}
                          </span>
                          <span className="text-[8px] font-mono font-bold bg-[#FAFBF7] text-emerald-800 rounded px-1.5 py-0.2 border border-emerald-200">
                            Bio-Safe Zone Checked
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <button
                        onClick={() => onToggleVerifyUser(n.id)}
                        className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-xs ${
                          n.verified
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                        }`}
                      >
                        {n.verified ? 'Revoke License' : 'Approve & Activate'}
                      </button>
                      <span className="text-[9px] text-gray-400 font-mono mt-1 block">Registered: {n.joinedDate || 'May 2026'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Freelance Gardeners list segment */}
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h4 className="font-sans font-black text-emerald-950 text-sm flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-700" />
                  Specialist Freelance Arborists ({gardenersList.length})
                </h4>
                <span className="text-[10px] text-gray-400 font-mono font-bold uppercase bg-slate-50 rounded px-2 py-0.5 border">
                  Horticulture Board
                </span>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {gardenersList.map((g) => (
                  <div 
                    key={g.id} 
                    className="border border-gray-150 hover:border-emerald-200 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/20 hover:bg-[#FAFBF7] transition-all"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={g.avatar} 
                        alt={g.name} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
                        }}
                        className="h-12 w-12 rounded-2xl object-cover border border-emerald-100 shrink-0 shadow-xs" 
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-sans font-extrabold text-gray-950 text-xs sm:text-sm leading-none">{g.name}</h5>
                          {g.verified && (
                            <span className="inline-flex items-center text-[8px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded-md border border-indigo-200">
                              BGC Passed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-800 font-bold">{g.companyName || 'Independent Specialist'}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-sm">Zone: {g.address}</p>
                        
                        {/* Interactive Credentials list */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          <span className="text-[8px] font-mono font-bold bg-neutral-100 text-neutral-700 rounded px-1.5 py-0.2 border border-neutral-200">
                            ISA Cert #{g.id.substring(0,4).toUpperCase()}
                          </span>
                          <span className="text-[8px] font-mono font-bold bg-[#FAFBF7] text-teal-800 rounded px-1.5 py-0.2 border border-[#d2efe5]">
                            Liability Insured ($1M)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <button
                        onClick={() => onToggleVerifyUser(g.id)}
                        className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-xs ${
                          g.verified
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                        }`}
                      >
                        {g.verified ? 'Revoke License' : 'Approve & Activate'}
                      </button>
                      <span className="text-[9px] text-gray-400 font-mono mt-1 block">Active: {g.joinedDate || 'April 2026'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🛡️ BACKGROUND AUDITING PROTOCOLS & ACCREDITATION CODES TIMELINE */}
          <div className="bg-[#FAFBF7] rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-widest uppercase block mb-1">
                Licensing Protocol GS-L9
              </span>
              <h4 className="font-sans font-extrabold text-[#092e1c] text-sm sm:text-base">
                Audit Checklist & Multi-stage Background Clearance
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                All nursery partners and independent arborists must satisfy five distinct layers of vetting before receiving their "GreenNest Verified" badge.
              </p>
            </div>

            {/* Grid of checklist criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-650">
              <div className="bg-white p-5 rounded-2xl border border-emerald-50 relative overflow-hidden space-y-2">
                <span className="p-1 px-2 block w-8 bg-emerald-50 text-emerald-800 font-mono font-bold text-[10px] text-center rounded border border-emerald-100 mb-1">
                  01
                </span>
                <span className="font-bold text-gray-900 block font-sans">Agricultural Inspection Check</span>
                <p className="leading-relaxed text-[11px] text-gray-500">
                  Verify seller is registered with the state department of agriculture. Nursery listings must originate from certified, pest-free bio-security zones.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-50 relative overflow-hidden space-y-2">
                <span className="p-1 px-2 block w-8 bg-indigo-50 text-indigo-850 font-mono font-bold text-[10px] text-center rounded border border-indigo-100 mb-1">
                  02
                </span>
                <span className="font-bold text-gray-900 block font-sans">Criminal & Identity Clearance</span>
                <p className="leading-relaxed text-[11px] text-gray-500">
                  Arborists entering residential property borders undergo criminology background checks, protecting against liability or property grifting threats.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-50 relative overflow-hidden space-y-2">
                <span className="p-1 px-2 block w-8 bg-teal-50 text-teal-850 font-mono font-bold text-[10px] text-center rounded border border-teal-100 mb-1">
                  03
                </span>
                <span className="font-bold text-gray-900 block font-sans">Horticulture Diploma Review</span>
                <p className="leading-relaxed text-[11px] text-gray-500">
                  Manually check matching ISA Arborist numbers, state horticulture licenses, or landscaping engineering diplomas directly with primary regulatory database registries.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-50 relative overflow-hidden space-y-2">
                <span className="p-1 px-2 block w-8 bg-amber-50 text-amber-850 font-mono font-bold text-[10px] text-center rounded border border-amber-100 mb-1">
                  04
                </span>
                <span className="font-bold text-gray-900 block font-sans">Bio-waste Recycle Accord</span>
                <p className="leading-relaxed text-[11px] text-gray-500">
                  Validate the vendor signature on our Circular Eco-Waste Recycling code, guaranteeing lawn clippings are targeted for bio-gas and nurseries composting.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚖️ COMPLAINTS & DISPUTES DESK TAB */}
      {activeTab === 'admin-disputes' && (
        <div id="admin-disputes-panel" className="space-y-8 animate-fadeIn">
          {/* Dispute Statistics Dashboard Banner */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-[#d93838] uppercase bg-rose-50 rounded-full px-2.5 py-1 border border-rose-200 mb-2 animate-pulse">
                  <Scale className="h-3 w-3 text-rose-500" /> Active Arbitration Suite
                </span>
                <h3 className="font-sans font-black text-[#0d3c26] text-xl tracking-tight">
                  Dispute & Escrow Resolution Suite
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Mediate transaction-level delays, plant shipping wilts, or specialist gardener service breaches. Review uploaded claims, disburse locked funds, and post administrative decrees.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-4 shrink-0 font-mono text-[11px] text-gray-700">
                <div className="bg-rose-50 border border-rose-100 py-1.5 px-3.5 rounded-xl">
                  <span className="text-[9px] text-rose-700 font-bold uppercase block tracking-wider">Queue Volume</span>
                  <span className="font-bold text-rose-950">{disputes.filter(d => d.status === 'Open').length} Open / {disputes.length} Cases</span>
                </div>
                <div className="bg-amber-50 border border-amber-100 py-1.5 px-3.5 rounded-xl">
                  <span className="text-[9px] text-amber-700 font-bold uppercase block tracking-wider">In Escrow</span>
                  <span className="font-bold text-amber-950">$340 locked</span>
                </div>
              </div>
            </div>

            {/* General Escrow warning prompt */}
            <div className="bg-[#FAFBF7] border border-yellow-100/80 rounded-2xl p-4.5 flex gap-3 text-xs leading-relaxed text-yellow-950">
              <Info className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold text-amber-900 block mb-0.5">Escrow holding policy active</strong>
                <span>All customer funds in dispute remain locked inside safe GreenNest escrow buffers. Arbitrators must submit formal legal decrees before funds can be returned to customer balances or paid out to nurseries.</span>
              </div>
            </div>
          </div>

          {/* Core Case Dossiers Grid */}
          <div className="space-y-6">
            <h4 className="font-sans font-black text-emerald-950 text-sm uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              General Mediation Logs & Dossiers ({disputes.length} Reports Logged)
            </h4>

            <div className="space-y-6">
              {disputes.length === 0 ? (
                <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center space-y-3">
                  <span className="p-3 bg-emerald-50 text-emerald-700 rounded-full inline-block">
                    <CheckCircle className="h-6 w-6" />
                  </span>
                  <h5 className="font-sans font-bold text-gray-900 text-sm">Mediation Queue Flawless</h5>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    All dispute files are closed. Homeowners and botanical nurseries are transacting in complete alignment. No tickets are marked for emergency intervention.
                  </p>
                </div>
              ) : (
                disputes.map((d) => (
                  <div 
                    key={d.id} 
                    className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group"
                  >
                    {/* Status accent stripe header */}
                    <div className={`h-1.5 w-full ${d.status === 'Resolved' ? 'bg-emerald-600' : 'bg-rose-500'}`}></div>

                    <div className="p-6 sm:p-8 space-y-6">
                      {/* Folder / Docket Identity Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] font-extrabold text-gray-400 block uppercase">
                            Case File Docket ID
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-gray-950 text-sm sm:text-base">{d.id}</span>
                            <span className="text-[10px] bg-neutral-100 text-neutral-850 px-2 py-0.5 rounded-full border font-bold">
                              {d.referenceType} Reference: #{d.referenceId}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold rounded-full border ${
                            d.status === 'Resolved' 
                              ? 'bg-emerald-100 text-emerald-850 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${d.status === 'Resolved' ? 'bg-emerald-600' : 'bg-rose-500'}`}></span>
                            {d.status} Case File
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 block mt-1">Logged timestamp: {d.date}</span>
                        </div>
                      </div>

                      {/* Litigant Portfolios Split Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-2xl border border-gray-150 text-xs font-sans">
                        <div className="space-y-2">
                          <p className="font-bold text-gray-550 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Complainant (Client Party)
                          </p>
                          <div className="space-y-0.5 pl-3">
                            <p className="font-extrabold text-gray-900 text-sm">{d.customerName}</p>
                            <p className="text-gray-500">Contact Method: Registered Platform Account Email</p>
                            <p className="text-gray-400 text-[10px]">Security Escrow Deposit Locked Status: Protected</p>
                          </div>
                        </div>

                        <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                          <p className="font-bold text-gray-550 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></span> Accused (Business Vendor)
                          </p>
                          <div className="space-y-0.5 pl-3">
                            <p className="font-extrabold text-[#0d3c26] text-sm">{d.vendorName}</p>
                            <p className="text-gray-500">Classification: Certified Nursery Partner / Gardener</p>
                            <p className="text-gray-400 text-[10px]">Bio-safety inspection accreditation tier: Tier L9 Checked</p>
                          </div>
                        </div>
                      </div>

                      {/* Subject & Core Incident Statement */}
                      <div className="space-y-2.5">
                        <div>
                          <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">Incident Subject</span>
                          <h5 className="font-sans font-black text-gray-950 text-xs sm:text-sm">{d.subject}</h5>
                        </div>
                        
                        <div className="bg-[#FAFBF7] border-l-4 border-amber-500 p-4 rounded-r-2xl text-[11px] leading-relaxed italic text-gray-800">
                          &rdquo;{d.description}&rdquo;
                        </div>
                      </div>

                      {/* Resolution actions or stamp footer */}
                      {d.resolutionNotes ? (
                        <div className="bg-emerald-50 text-emerald-950 p-4 sm:p-5 rounded-2xl border border-emerald-100 flex gap-4 text-[11px] leading-relaxed">
                          <div className="p-2.5 bg-white text-emerald-700 border border-emerald-200 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6" />
                          </div>
                          <div>
                            <strong className="text-[10px] font-mono font-black uppercase text-emerald-800 tracking-wider block mb-1">
                              Escrow Settled — Decree of Resolution Issued
                            </strong>
                            <p className="text-[11px] text-emerald-950 font-medium">Resolution Notes: {d.resolutionNotes}</p>
                            <span className="text-[9px] text-emerald-600/80 font-mono block mt-2 font-bold uppercase tracking-wider">
                              Status Index: Escrow Disbursed | Case Closed Legally
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                          {resolvingId === d.id ? (
                            <form onSubmit={handleResolveSubmit} className="space-y-4 animate-scaleIn">
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                                  Formal Arbitration Decrees Details
                                </label>
                                <textarea
                                  required
                                  value={resolutionNote}
                                  onChange={(e) => setResolutionNote(e.target.value)}
                                  placeholder="Type formal judicial settlement details..."
                                  className="w-full text-xs p-3.5 bg-white border border-gray-200 rounded-2xl h-24 focus:outline-emerald-500 font-sans shadow-inner"
                                ></textarea>
                              </div>

                              {/* Interactive Quick-Fill Templates Suite for admins */}
                              <div className="space-y-1.5 font-sans">
                                <span className="block text-[9px] font-mono font-bold uppercase text-gray-400">
                                  Quick-Fill Decrees Templates
                                </span>
                                <div className="flex flex-wrap gap-2 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => setResolutionNote(`Full Customer Restitution: Verified plant wilt under GS Clause A. Lock Escrow released to customer balance in full. Partner nursery registered a Tier 1 supply warning.`)}
                                    className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-100"
                                  >
                                    ☘️ Wilt & Full Refund
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setResolutionNote(`Specialist No-Show Penalty: Specialist arborist failed to appear within confirmed booking slot. Booking cancelled. Customer refunded. $15 administrative penalty collected from specialist.`)}
                                    className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100"
                                  >
                                    🪜 No-Show Penalty Charge
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setResolutionNote(`Mutual Agreement & Escrow Release: Disputing parties agreed to mutual resolution. Partial product delivery confirmed under GS Clause C-D. Locked escrow released to nursery.`)}
                                    className="px-3 py-1 bg-teal-50 border border-[#b2efe5] text-teal-800 rounded-lg hover:bg-[#d4f8f1]"
                                  >
                                    🤝 Mutual Settlement Clear
                                  </button>
                                </div>
                              </div>

                              {/* Final Form submission button footer */}
                              <div className="flex justify-end gap-3 text-xs pt-1">
                                <button
                                  type="button"
                                  onClick={() => setResolvingId(null)}
                                  className="px-4 py-1.5 bg-slate-100 border rounded-xl text-gray-650 hover:bg-slate-200"
                                >
                                  Cancel Decree
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                                >
                                  Commit Settlement Decision
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex justify-between items-center bg-[#FAFBF7] p-4.5 rounded-2xl border border-emerald-50">
                              <span className="text-[11px] text-gray-500 pr-4">Admin must review claims and register a decree resolution details to disburse the local funds.</span>
                              <button
                                onClick={() => {
                                  setResolvingId(d.id);
                                  setResolutionNote(`Arbitrator settlement: Issue resolved with partner vendor. Warning notice has been registered. Reference transaction details verified.`);
                                }}
                                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-xs hover:bg-emerald-500 transition-all cursor-pointer text-xs shrink-0"
                              >
                                Write Settlement Resolution
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ⚖️ ADMINISTRATIVE SETTLEMENT RULES & COOLING-OFF CODES PANEL */}
          <div className="bg-[#FAFBF7] rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-widest uppercase block mb-1">
                Resolution Code GS-D14
              </span>
              <h4 className="font-sans font-extrabold text-[#092e1c] text-sm sm:text-base">
                Dispute Advisory Guidelines & Escrow Disbursal Policy
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Admins should consult these pre-coded resolution paths when mediating customer issues to maintain uniform operations.
              </p>
            </div>

            {/* Path description list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-650">
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2">
                <span className="p-1 px-2.5 inline-block bg-amber-50 text-amber-850 font-bold font-mono text-[9px] tracking-wide mb-1 uppercase rounded">
                  Clause A: Plant Wilt & Stress
                </span>
                <p className="leading-relaxed text-[11px]">
                  If live plants arrive with mild stress (partially yellowed leaves) or minor wilt from courier transits, the issue typically resolves with 48 hours of fresh watering and shade placement. If species show severe root decay or necrotic leaf loss, award a <strong>full refund</strong> funded by the partner nursery.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2">
                <span className="p-1 px-2.5 inline-block bg-teal-50 text-teal-850 font-bold font-mono text-[9px] tracking-wide mb-1 uppercase rounded">
                  Clause B: No-Shows & Services
                </span>
                <p className="leading-relaxed text-[11px]">
                  If an arborist or gardener fails to appear within their confirmed 3-hour appointment booking slot without recording an event rescheduling notice, cancel the booking immediately. Charge the specialist a <strong>$15 administrative penalty fee</strong> and disburse the customer slot funds back immediately.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2">
                <span className="p-1 px-2.5 inline-block bg-indigo-50 text-indigo-850 font-bold font-mono text-[9px] tracking-wide mb-1 uppercase rounded">
                  Clause C: Safe Ground Conduct
                </span>
                <p className="leading-relaxed text-[11px]">
                  Any validated incident of a certified arborist treating homeowners or community staff with coarse disrespect or damaging residential physical assets triggers an immediate, permanent <strong>revoke of their license</strong> on the platform. Safety is our primary objective.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔖 CATALOG & CATEGORIES MANAGEMENT SYSTEM TAB */}
      {activeTab === 'admin-catalog' && (
        <div id="admin-catalog-panel" className="space-y-8">
          <div>
            <h3 className="font-sans font-bold text-emerald-950 text-base">
              GreenNest Master Catalog, Inventory & Categories Control Center
            </h3>
            <p className="text-xs text-gray-500">
              Complete administrative authority to add, edit, or delete botanical catalog inventory items, and dynamically dictate list definitions of Platform Categories and Subcategories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* 1. Category & Subcategory Modifier Left Panel */}
            <div className="space-y-6">
              {/* Category List block */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Tag className="h-4.5 w-4.5 text-emerald-700" />
                  <h4 className="font-sans font-bold text-xs text-emerald-950 uppercase tracking-wider">
                    Product Categories ({categories.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                      <span className="text-xs font-bold text-gray-850 font-sans">{cat}</span>
                      <button
                        onClick={() => onRemoveCategory(cat)}
                        disabled={categories.length <= 1}
                        className="p-1 text-gray-450 hover:text-rose-600 disabled:opacity-40 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatInput.trim()) return;
                    onAddCategory(newCatInput.trim());
                    setNewCatInput('');
                  }}
                  className="pt-2 flex gap-2"
                >
                  <input
                    type="text"
                    required
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="New category..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-emerald-600"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg cursor-pointer flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Sub-Category List block */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Sliders className="h-4.5 w-4.5 text-indigo-700" />
                  <h4 className="font-sans font-bold text-xs text-indigo-950 uppercase tracking-wider">
                    Sub-Categories ({subCategories.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {subCategories.map((sub) => (
                    <div key={sub} className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                      <span className="text-xs font-bold text-gray-850 font-sans">{sub}</span>
                      <button
                        onClick={() => onRemoveSubCategory(sub)}
                        disabled={subCategories.length <= 1}
                        className="p-1 text-gray-450 hover:text-rose-600 disabled:opacity-40 transition-colors cursor-pointer"
                        title="Delete Subcategory"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newSubCatInput.trim()) return;
                    onAddSubCategory(newSubCatInput.trim());
                    setNewSubCatInput('');
                  }}
                  className="pt-2 flex gap-2"
                >
                  <input
                    type="text"
                    required
                    value={newSubCatInput}
                    onChange={(e) => setNewSubCatInput(e.target.value)}
                    placeholder="New subcategory..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-indigo-600"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-indigo-600 text-white hover:bg-indigo-550 rounded-lg cursor-pointer flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* 2. Platform Central Catalog Inventory Table */}
            <div className="lg:col-span-2 space-y-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h4 className="font-sans font-bold text-sm text-emerald-950">
                    Active Catalog Directory ({filteredProducts.length} items listed)
                  </h4>
                  <p className="text-[11px] text-gray-400">Total listed products including independent verified nurseries assets.</p>
                </div>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 font-bold text-white text-xs rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                >
                  <PlusCircle className="h-4 w-4" /> Add Product Item
                </button>
              </div>

              {/* Filtering + Searching controls */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, tags, description, or seller nursery..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs pl-9 pr-4 py-2 focus:outline-emerald-600"
                  />
                </div>
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl text-xs px-3 py-2 text-gray-650 focus:outline-emerald-600"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Items tabular panel */}
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <Sprout className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-sans">No botanical catalog products match your filter parameters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border rounded-xl divide-y">
                  <table className="min-w-full divide-y divide-gray-100 text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Botanical Asset</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Retail Price</th>
                        <th className="px-4 py-2.5">Stock</th>
                        <th className="px-4 py-2.5">Nursery Seller</th>
                        <th className="px-4 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 min-w-[180px]">
                            <div className="flex items-center gap-3">
                              <img 
                                src={p.image || getProductImage(p.id, p.name, p.category)} 
                                alt={p.name} 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = getProductDataUri(p.id, p.name, p.category);
                                }}
                                className="h-10 w-10 object-cover rounded-md border" 
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-gray-900 block truncate max-w-[150px]">{p.name}</span>
                                <span className="text-[10px] font-mono text-gray-400 block">{p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 font-sans">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-950">${p.price}</td>
                          <td className="px-4 py-3 font-mono">
                            <span className={`font-semibold ${p.stock === 0 ? 'text-rose-600 font-extrabold animate-pulse' : 'text-gray-900'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="px-4 py-3 font-sans text-gray-400 text-[11px] truncate max-w-[100px]" title={p.sellerName}>
                            {p.sellerName}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-all inline-flex items-center justify-center"
                              title="Edit product info, categories and price"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onRemoveProductAdmin(p.id)}
                              className="p-1.5 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100 rounded-lg cursor-pointer transition-all inline-flex items-center justify-center"
                              title="Remove item permanently"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 🏷️ GLOBAL TAXONOMY & CATALOG INTEGRITY PRINCIPLES (EXPANSION) */}
            <div className="lg:col-span-3 bg-[#FAFBF7] rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-6 mt-8 shadow-sm">
              <div>
                <span className="text-[10px] text-emerald-850 font-mono font-bold tracking-widest uppercase block mb-1">
                  Catalog Protocol GS-C12
                </span>
                <h4 className="font-sans font-extrabold text-[#092e1c] text-sm sm:text-base">
                  Master Taxonomy Structure & Metadata Ingress Rules
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  To keep search indices fully compatible, administrators must audit newly added catalog listings against established sub-category definitions.
                </p>
              </div>

              {/* Guidelines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs text-gray-650 pt-2">
                <div className="space-y-3">
                  <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wider">
                    🪴 Category Definition Specifications
                  </h5>
                  <p>
                    <strong className="text-gray-900 block">Plants (Indoor/Outdoor/Succulents):</strong>
                    Must carry verifiable binomial nomenclature (scientific names) appended in parentheses. Sub-categories require rigorous hardiness zone tags to assist customers in matching localized light scopes.
                  </p>
                  <p>
                    <strong className="text-gray-900 block">Seeds & Soil Addons:</strong>
                    Check that soil mixes are certified organic, heat-pasteurized, and fully document their N-P-K nutrient composition ratios clearly.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wider">
                    📦 Anti-Duplication & Audit Procedures
                  </h5>
                  <p>
                    Ensure newly provisioned products from third-party nurseries do not copy existing listings. Avoid spammy, non-standard naming prefixes such as "SUPER SALE", "BEST DEAL", or "MUST BUY!!!". Keep visual catalog items high-fidelity, clean, and styled according to platform display models.
                  </p>
                  <p className="font-semibold text-emerald-800">
                    💡 Pro-Tip: Run regular catalog diagnostics to isolate zero-stock inactive entries and preserve search vector efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ MODAL EDIT DIALOG CONTAINER */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 animate-scaleUp">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 p-1 text-gray-450 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[9px] font-bold font-mono text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded uppercase tracking-wider">
                ID: {editingProduct.id}
              </span>
              <h3 className="font-sans font-black text-gray-900 text-lg mt-1">
                Edit Botanical Asset Details
              </h3>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Botanical Scientific / Common Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-semibold text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Target Category</label>
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-semibold text-gray-800"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Sub-Category</label>
                    <select
                      value={editForm.subCategory || ''}
                      onChange={(e) => setEditForm({ ...editForm, subCategory: e.target.value as any })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-semibold text-gray-800"
                    >
                      {subCategories.map((sc) => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Retail Price ($ USD)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editForm.price || 0}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-mono font-bold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Available Stock Supply</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editForm.stock === undefined ? 0 : editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-mono font-bold text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Description</label>
                  <textarea
                    required
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 h-16 resize-none font-sans text-gray-700"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Asset Image URL Link</label>
                  <input
                    type="text"
                    required
                    value={editForm.image || ''}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 text-gray-650"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ➕ MODAL ADD DIALOG CONTAINER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 animate-scaleUp">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1 text-gray-450 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[9px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 w-max">
                <Sparkles className="h-3 w-3" /> Administrative Ingress
              </span>
              <h3 className="font-sans font-black text-gray-900 text-lg mt-1">
                Add Brand New Catalog Asset
              </h3>
            </div>

            <form onSubmit={handleSaveAddProduct} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Product Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ficus Lyrata (Fiddle Leaf Fig)"
                    value={addForm.name || ''}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Core Category</label>
                    <select
                      value={addForm.category || categories[0] || 'Plants'}
                      onChange={(e) => setAddForm({ ...addForm, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-semibold text-gray-800"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Sub-Category</label>
                    <select
                      value={addForm.subCategory || subCategories[0] || 'Indoor'}
                      onChange={(e) => setAddForm({ ...addForm, subCategory: e.target.value as any })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-semibold text-gray-800"
                    >
                      {subCategories.map((sc) => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Retail Price ($ USD)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={addForm.price || 0}
                      onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-mono font-bold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Initial Stock Level</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={addForm.stock || 0}
                      onChange={(e) => setAddForm({ ...addForm, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 font-mono font-bold text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Description & Story</label>
                  <textarea
                    required
                    placeholder="Enter visual details, origins, care overview, and potting suggestions..."
                    value={addForm.description || ''}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 h-16 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Reference Showcase Image URL</label>
                  <input
                    type="text"
                    required
                    value={addForm.image || ''}
                    onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 focus:outline-emerald-600 text-gray-650"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
