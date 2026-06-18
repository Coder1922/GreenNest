import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Package,
  Calendar,
  Star,
  PlusCircle,
  TrendingUp,
  Clock,
  MapPin,
  Check,
  X,
  AlertCircle,
  Truck,
  Edit2,
  Trash2,
  ShieldCheck,
  FileSpreadsheet,
  Image,
  Sprout,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import { User, Product, Order, ServiceBooking, Review, GardenerService } from '../types';
import { getProductDataUri, getProductImage } from '../utils/productImages';

interface VendorPortalProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  bookings: ServiceBooking[];
  reviews: Review[];
  onAddProduct: (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewsCount'>) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: ServiceBooking['status']) => void;
  onUpdateUserBalance: (userId: string, addedAmount: number) => void;
  onUpdateGardenerServices?: (userId: string, services: GardenerService[]) => void;
  activeTab: string;
}

export default function VendorPortal({
  currentUser,
  products,
  orders,
  bookings,
  reviews,
  onAddProduct,
  onUpdateStock,
  onUpdateProductPrice,
  onRemoveProduct,
  onUpdateOrderStatus,
  onUpdateBookingStatus,
  onUpdateUserBalance,
  onUpdateGardenerServices,
  activeTab
}: VendorPortalProps) {
  // New Product state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Plants' | 'Seeds' | 'Pots' | 'Tools'>('Plants');
  const [newProdSub, setNewProdSub] = useState<'Indoor' | 'Outdoor' | 'Flowering' | 'Accessories' | 'Organic' | 'Hand Tools'>('Indoor');
  const [newProdPrice, setNewProdPrice] = useState('19.99');
  const [newProdStock, setNewProdStock] = useState('15');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80');

  // Gardener customized service states
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [servName, setServName] = useState('');
  const [servPrice, setServPrice] = useState('40');
  const [servDesc, setServDesc] = useState('');
  
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServName, setEditServName] = useState('');
  const [editServPrice, setEditServPrice] = useState('40');
  const [editServDesc, setEditServDesc] = useState('');
  
  // Care inputs
  const [lightSpec, setLightSpec] = useState('Bright indirect sunlight');
  const [waterSpec, setWaterSpec] = useState('Once per week');
  const [difficultySpec, setDifficultySpec] = useState<'Easy' | 'Moderate' | 'Challenging'>('Easy');
  const [placementSpec, setPlacementSpec] = useState('Living Room');

  // Quick Inline edits
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceTemp, setEditPriceTemp] = useState('');
  const [editStockTemp, setEditStockTemp] = useState('');

  // Gardener customized service helper triggers
  const currentServices = useMemo(() => {
    return currentUser.services || [];
  }, [currentUser]);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servName || !servPrice || !servDesc) return;
    
    const newService: GardenerService = {
      id: 'serv-' + Math.floor(1000 + Math.random() * 9000),
      name: servName,
      pricePerHour: parseFloat(servPrice) || 30,
      description: servDesc
    };
    
    if (onUpdateGardenerServices) {
      onUpdateGardenerServices(currentUser.id, [...currentServices, newService]);
    }
    
    setServName('');
    setServPrice('40');
    setServDesc('');
    setShowAddServiceForm(false);
  };

  const handleEditServiceInit = (s: GardenerService) => {
    setEditingServiceId(s.id);
    setEditServName(s.name);
    setEditServPrice(s.pricePerHour.toString());
    setEditServDesc(s.description);
  };

  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editServName || !editServPrice || !editServDesc || !editingServiceId) return;
    
    const updated = currentServices.map(s => {
      if (s.id === editingServiceId) {
        return {
          ...s,
          name: editServName,
          pricePerHour: parseFloat(editServPrice) || 30,
          description: editServDesc
        };
      }
      return s;
    });

    if (onUpdateGardenerServices) {
      onUpdateGardenerServices(currentUser.id, updated);
    }
    
    setEditingServiceId(null);
  };

  const handleDeleteService = (serviceId: string) => {
    const updated = currentServices.filter(s => s.id !== serviceId);
    if (onUpdateGardenerServices) {
      onUpdateGardenerServices(currentUser.id, updated);
    }
  };

  // 1. Filter Vendor elements corresponding directly to logged-in user
  const vendorProducts = useMemo(() => {
    return products.filter((p) => p.sellerId === currentUser.id);
  }, [products, currentUser]);

  const vendorOrders = useMemo(() => {
    return orders.filter((o) => o.sellerId === currentUser.id);
  }, [orders, currentUser]);

  const vendorBookings = useMemo(() => {
    return bookings.filter((b) => b.gardenerId === currentUser.id);
  }, [bookings, currentUser]);

  const vendorReviews = useMemo(() => {
    const listIds = currentUser.role === 'nursery' 
      ? vendorProducts.map(p => p.id)
      : [currentUser.id];
    return reviews.filter(r => listIds.includes(r.entityId));
  }, [reviews, vendorProducts, currentUser]);

  // Computing analytics parameters
  const totalRevenue = useMemo(() => {
    if (currentUser.role === 'nursery') {
      return vendorOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);
    } else {
      return vendorBookings
        .filter(b => b.status === 'Completed')
        .reduce((sum, b) => sum + b.price, 0);
    }
  }, [vendorOrders, vendorBookings, currentUser]);

  const incomingPendingCount = useMemo(() => {
    if (currentUser.role === 'nursery') {
      return vendorOrders.filter(o => o.status === 'Pending').length;
    } else {
      return vendorBookings.filter(b => b.status === 'Pending').length;
    }
  }, [vendorOrders, vendorBookings, currentUser]);

  // Form submit handler
  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock || !newProdDesc) return;

    onAddProduct({
      name: newProdName,
      category: newProdCategory,
      subCategory: newProdSub,
      price: parseFloat(newProdPrice) || 10,
      stock: parseInt(newProdStock) || 5,
      description: newProdDesc,
      image: newProdImg,
      careInstructions: {
        light: lightSpec,
        water: waterSpec,
        difficulty: difficultySpec,
        placement: placementSpec
      }
    });

    // Reset Form
    setNewProdName('');
    setNewProdPrice('19.99');
    setNewProdStock('15');
    setNewProdDesc('');
    setShowAddForm(false);
  };

  const startQuickEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditPriceTemp(p.price.toString());
    setEditStockTemp(p.stock.toString());
  };

  const saveQuickEdit = (id: string) => {
    onUpdateProductPrice(id, parseFloat(editPriceTemp) || 12);
    onUpdateStock(id, parseInt(editStockTemp) || 0);
    setEditingProductId(null);
  };

  const handleShipOrCompleteOrder = (orderId: string, currentStatus: string) => {
    if (currentStatus === 'Pending') {
      onUpdateOrderStatus(orderId, 'Shipped');
    } else if (currentStatus === 'Shipped') {
      onUpdateOrderStatus(orderId, 'Delivered');
      // Adding funds to the seller's wallet
      const ord = orders.find(o => o.id === orderId);
      if (ord) {
        onUpdateUserBalance(currentUser.id, ord.totalAmount);
      }
    }
  };

  const handleBookingResolution = (bookingId: string, accept: boolean) => {
    if (accept) {
      onUpdateBookingStatus(bookingId, 'Confirmed');
    } else {
      onUpdateBookingStatus(bookingId, 'Rejected');
    }
  };

  const handleMarkBookingCompleted = (bookingId: string, amount: number) => {
    onUpdateBookingStatus(bookingId, 'Completed');
    onUpdateUserBalance(currentUser.id, amount);
  };

  return (
    <div className="w-full space-y-8">
      {/* ⚠️ AUDIT / VERIFICATION STATUS STRIP */}
      {!currentUser.verified ? (
        <div className="bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 p-6 flex items-start gap-4 animate-pulse">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-800">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-amber-950 text-sm">
              License Auditing Verification Pending
            </h4>
            <p className="text-xs text-amber-900 mt-1 max-w-2xl leading-relaxed">
              Your company credentials <strong>({currentUser.companyName})</strong> are currently in the Admin verification review queue. While pending, your items and services will not appear to prospective clients.
            </p>
            <div className="mt-3">
              <span className="text-[10px] font-semibold bg-amber-205 text-amber-900 px-3 py-1 rounded-md border border-amber-202 uppercase">
                Awaiting Action from Platform Administrator
              </span>
              <p className="inline text-[11px] text-gray-500 ml-3">
                *Tip: Switch personas to <strong>Marcus Vance (Admin)</strong> to approve your nursery instantly!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-800 text-white rounded-2xl p-5 flex items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-emerald-100" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-200">Certified Business Partner</p>
              <h4 className="font-sans font-extrabold text-sm sm:text-base -mt-0.5">{currentUser.companyName}</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-250 block font-mono">AVAILABLE EARNINGS BALANCE</span>
            <span className="text-lg sm:text-xl font-mono font-black">${currentUser.balance?.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* 📊 ANALYTICS DASHBOARD CARD GRID */}
      {activeTab === 'vendor-dashboard' && (
        <div id="vendor-dashboard-panel" className="space-y-8">
          {/* Bento-grid of KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-700">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Wallet Balance</span>
                <span className="text-xl font-mono font-bold text-gray-900">${currentUser.balance?.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-700">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Sales</span>
                <span className="text-xl font-mono font-bold text-gray-900">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 rounded-xl text-amber-700">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Incoming Actions</span>
                <span className="text-xl font-mono font-bold text-amber-700 animate-pulse">{incomingPendingCount} Pending</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-700">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Feedback Rating</span>
                <span className="text-xl font-mono font-bold text-gray-900">
                  {vendorReviews.length > 0 ? (vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length).toFixed(1) : '5.0'} ★
                </span>
              </div>
            </div>
          </div>

          {/* Graphical custom SVG vector reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Report chart */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-sm">
              <h4 className="font-sans font-bold text-emerald-950 text-xs uppercase tracking-widest mb-4">
                Quarterly Revenue Report
              </h4>
              <div className="h-36 flex items-end justify-between gap-4 pt-4 border-b border-gray-150">
                {[45, 90, 75, 120, 160, 210, totalRevenue > 0 ? Math.min(240, totalRevenue) : 80].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      style={{ height: `${val / 2.5}px` }}
                      className="w-full bg-gradient-to-t from-emerald-700 to-emerald-400 rounded-t-md hover:opacity-80 transition-all duration-300 relative group"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap">
                        ${val}
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-gray-400 font-mono">
                      {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Satisfaction report & reviews feed summaries */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-bold text-emerald-950 text-xs uppercase tracking-widest mb-3">
                  Live Client Rebuttal & Reviews
                </h4>
                <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                  {vendorReviews.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-6">No reviews logged for your catalog or services yet.</p>
                  ) : (
                    vendorReviews.map((r) => (
                      <div key={r.id} className="text-xs border-b border-gray-50 pb-2">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-gray-800">{r.customerName}</span>
                          <span className="text-amber-500">{r.rating}★</span>
                        </div>
                        <p className="text-gray-500 font-sans mt-0.5">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 📈 COMPREHENSIVE MARKET INTELLIGENCE & SHIPPERS COMPLIANCE REGULATION (EXPANSION) */}
          <div className="bg-[#FAFBF7] rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-widest uppercase block mb-1">
                GN-V1 Market Intelligence Report
              </span>
              <h4 className="font-sans font-extrabold text-[#0d3c26] text-sm sm:text-base">
                Nursery Sales Optimization & Eco-Compliance Guidelines
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                To maintain your certified partner badge, review current seasonal consumer demands and guarantee structural compliance across all dispatch parcels.
              </p>
            </div>

            {/* Demand analysis grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2">
                <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wide">
                  🔥 High Demand Species (Current Month)
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Demand for indoor heavy-foliage like <strong>Monstera Deliciosa</strong> and air-purifying <strong>Snake Plants</strong> has increased by <strong>42%</strong>. Customers are actively filtering for "Easy Care" specimens. Ensure listings are up-to-date and maintain at least <strong>5 units in stock</strong>.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2">
                <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wide">
                  🌱 Soil & Bio-Matter Addon Strategy
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Average order values increase by <strong>18%</strong> when pots, organic compost blends, and slow-release trace minerals are suggested in product descriptions. Consider bundling wooden planters or ceramic pots directly with flowering outdoor perennials.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2">
                <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wide">
                  📅 Booking Slot Allocations
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Homeowners prefer booking gardening slots on <strong>Fridays, Saturdays, and Mondays</strong> between <strong>09:00 AM - 12:00 PM</strong>. Keep your active working calendar slot listings unlocked to increase weekly booking conversion rates by <strong>2.5×</strong>.
                </p>
              </div>
            </div>

            {/* Compliance checklist */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 space-y-4">
              <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> Live Botanical Transit Compliance Standards
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                All live biological products shipped from peer nurseries must adhere to our strict logistics protection rules to satisfy the GreenNest arrival guarantee:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-650">
                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-emerald-50 text-emerald-700 rounded-md font-mono font-bold text-[10px] shrink-0">01</div>
                  <p>
                    <strong className="text-gray-900 block">Capillary Root Wrapping:</strong>
                    Pot soils must be damp and entirely wrapped in biodegradable cling-membranes to lock down moisture levels during extreme heat Transits.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-emerald-50 text-emerald-700 rounded-md font-mono font-bold text-[10px] shrink-0">02</div>
                  <p>
                    <strong className="text-gray-900 block">Breathable Cargo Outer:</strong>
                    Carton structures must possess 4 diagonal aeration puncture points to support steady carbon dioxide exchanges without flattening container corners.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-emerald-50 text-emerald-700 rounded-md font-mono font-bold text-[10px] shrink-0">03</div>
                  <p>
                    <strong className="text-gray-900 block">Biological Pest Screening:</strong>
                    Visually audit stems and lower-leaf pockets to guarantee shipped products carry zero active spider mite networks or localized root aphids.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-emerald-50 text-emerald-700 rounded-md font-mono font-bold text-[10px] shrink-0">04</div>
                  <p>
                    <strong className="text-gray-900 block">Barcode Sync:</strong>
                    Affix the designated GreenNest Invoice barcode clearly on top faces to permit immediate scanning by our integrated courier logistics channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📋 INVENTORY CATALOG MANAGER TAB (FOR NURSERY OR GARDENER DETAILS) */}
      {activeTab === 'vendor-listings' && (
        <div id="vendor-listings-panel" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-gray-900 text-base">
                {currentUser.role === 'nursery' ? 'Plant & Garden Inventory Catalog' : 'Manage Service Offerings'}
              </h3>
              <p className="text-xs text-gray-500">
                Add, modify or delete items listed to search vectors instantly.
              </p>
            </div>

            {currentUser.role === 'nursery' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Add New Botanical Stock
              </button>
            )}
          </div>

          {/* Form to append new nursery items */}
          {showAddForm && currentUser.role === 'nursery' && (
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-250 p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-sans font-bold text-emerald-950 text-xs uppercase tracking-widest flex items-center gap-1">
                  <Sprout className="h-4.5 w-4.5 text-emerald-600" /> New Premium Botanical Stock Details
                </h4>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <form onSubmit={handleAddNewProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Name field */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Species / Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ficus Lyrata (Fiddle Leaf Fig)"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-emerald-600"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Stock Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e: any) => setNewProdCategory(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border rounded-lg"
                    >
                      <option value="Plants">Plants</option>
                      <option value="Seeds">Seeds</option>
                      <option value="Pots">Pots</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>

                  {/* SubCategory */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Sub-Category Tag</label>
                    <select
                      value={newProdSub}
                      onChange={(e: any) => setNewProdSub(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border rounded-lg"
                    >
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Organic">Organic</option>
                      <option value="Hand Tools">Hand Tools</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-emerald-600"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Initial Stock Volume</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-emerald-600"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Cover Image Link</label>
                    <input
                      type="text"
                      required
                      value={newProdImg}
                      onChange={(e) => setNewProdImg(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-emerald-600"
                    />
                  </div>
                </div>

                {/* BOTANICAL SPECIALIZED CARE METADATA - MANDATORY IN-SCOPE SPEC */}
                <div className="p-4 bg-emerald-900/5 rounded-xl border border-emerald-900/10 space-y-3">
                  <h5 className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                    Care Guidelines & Instructions specifications (Crucial for Client Care detail cards)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">☀️ Light Requirements</label>
                      <input
                        type="text"
                        value={lightSpec}
                        onChange={(e) => setLightSpec(e.target.value)}
                        className="w-full text-xs p-2 mt-1 bg-white border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">💧 Water Schedule</label>
                      <input
                        type="text"
                        value={waterSpec}
                        onChange={(e) => setWaterSpec(e.target.value)}
                        className="w-full text-xs p-2 mt-1 bg-white border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">🔰 Difficulty</label>
                      <select
                        value={difficultySpec}
                        onChange={(e: any) => setDifficultySpec(e.target.value)}
                        className="w-full text-xs p-2 mt-1 bg-white border rounded-lg"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Challenging">Challenging</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">📍 Preferred Placement</label>
                      <input
                        type="text"
                        value={placementSpec}
                        onChange={(e) => setPlacementSpec(e.target.value)}
                        className="w-full text-xs p-2 mt-1 bg-white border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Descriptions & Botanical Origins</label>
                  <textarea
                    required
                    placeholder="Provide depth about potting mix, leaf structures, and fertilizer frequencies..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border rounded-lg h-24 focus:outline-emerald-600"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 font-bold text-white rounded-lg cursor-pointer"
                  >
                    Publish to Catalog
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List existing items for the vendor */}
          {currentUser.role === 'nursery' ? (
            <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-gray-50 uppercase text-gray-400 font-mono font-bold text-[10px] border-b text-center">
                    <tr>
                      <th className="px-6 py-4 text-left">Product Species</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Listed Price</th>
                      <th className="px-4 py-4">Stock Availability</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-400 italic">No products currently listed inside your catalog. Add some using the button.</td>
                      </tr>
                    ) : (
                      vendorProducts.map((p) => {
                        const isEditing = editingProductId === p.id;
                        return (
                          <tr key={p.id} className="border-b border-gray-50 hover:bg-emerald-50/10 text-center">
                            <td className="px-6 py-4 text-left font-bold text-emerald-950 flex items-center gap-3">
                              <img
                                src={p.image || getProductImage(p.id, p.name, p.category)}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = getProductDataUri(p.id, p.name, p.category);
                                }}
                                className="h-10 w-10 object-cover rounded-lg border"
                              />
                              <div>
                                <p className="text-gray-900">{p.name}</p>
                                <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-semibold text-gray-600">{p.category} ({p.subCategory})</td>
                            <td className="px-4 py-4 font-mono font-bold">
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editPriceTemp}
                                  onChange={(e) => setEditPriceTemp(e.target.value)}
                                  className="w-16 text-center border p-0.5 rounded text-xs"
                                />
                              ) : (
                                `$${p.price.toFixed(2)}`
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editStockTemp}
                                  onChange={(e) => setEditStockTemp(e.target.value)}
                                  className="w-16 text-center border p-0.5 rounded text-xs"
                                />
                              ) : (
                                <span className={`px-2 py-0.5 rounded-full font-bold ${
                                  p.stock === 0 ? 'bg-red-100 text-red-800' : p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {p.stock} Available
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2 justify-center">
                                {isEditing ? (
                                  <button
                                    onClick={() => saveQuickEdit(p.id)}
                                    className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded cursor-pointer"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startQuickEdit(p)}
                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                                    title="Edit pricing and stock levels"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => onRemoveProduct(p.id)}
                                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                                  title="Remove listing"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Custom layout: dynamic gardener service list management */
            <div className="space-y-6">
              {/* Header inside view */}
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-emerald-100/80">
                <div>
                  <h4 className="font-sans font-bold text-gray-900 text-sm">Active Gardening Services & Hourly Rates</h4>
                  <p className="text-xs text-gray-500">Add, edit, or modify your listed expertise pricing models.</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddServiceForm(!showAddServiceForm);
                    setEditingServiceId(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Service Rate
                </button>
              </div>

              {/* Form to prepend a new gardener service */}
              {showAddServiceForm && (
                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-250 p-5 animate-fadeIn space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-widest flex items-center gap-1">
                      <Sprout className="h-4.5 w-4.5 text-emerald-600" /> Specify New Services Offering
                    </span>
                    <button onClick={() => setShowAddServiceForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                  </div>
                  <form onSubmit={handleAddService} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Service / Activity Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hedging, Trimming & Rose Care"
                          value={servName}
                          onChange={(e) => setServName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Hourly Wage Rate ($ / hr)</label>
                        <input
                          type="number"
                          required
                          min="15"
                          max="200"
                          value={servPrice}
                          onChange={(e) => setServPrice(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border rounded-lg focus:outline-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1">Scope description & necessary tools required</label>
                      <textarea
                        required
                        placeholder="Provide details about height allowances, types of branches, or organic weed spray models included..."
                        value={servDesc}
                        onChange={(e) => setServDesc(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border rounded-lg h-20 focus:outline-emerald-600"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddServiceForm(false)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Publish Offering
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Grid of existing gardener services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentServices.length === 0 ? (
                  <div className="md:col-span-2 bg-white text-center py-10 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-400 italic">No custom services listed. Create your first offering above!</p>
                  </div>
                ) : (
                  currentServices.map((s) => {
                    const isEditingThis = editingServiceId === s.id;
                    return (
                      <div
                        key={s.id}
                        className={`bg-white rounded-2xl border p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                          isEditingThis ? 'ring-2 ring-emerald-500 bg-emerald-50/10 border-emerald-300' : 'hover:border-emerald-200'
                        }`}
                      >
                        {isEditingThis ? (
                          <form onSubmit={handleSaveEditedService} className="space-y-3 h-full flex flex-col justify-between">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-bold text-emerald-900 uppercase">Service Name</label>
                                <input
                                  type="text"
                                  required
                                  value={editServName}
                                  onChange={(e) => setEditServName(e.target.value)}
                                  className="w-full text-xs p-2 bg-white border rounded-lg mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-emerald-900 uppercase">Hourly Rate ($/hr)</label>
                                <input
                                  type="number"
                                  required
                                  value={editServPrice}
                                  onChange={(e) => setEditServPrice(e.target.value)}
                                  className="w-full text-xs p-2 bg-white border rounded-lg mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-emerald-900 uppercase">Description</label>
                                <textarea
                                  required
                                  value={editServDesc}
                                  onChange={(e) => setEditServDesc(e.target.value)}
                                  className="w-full text-xs p-2 bg-white border rounded-lg h-20 mt-1 resize-none"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t">
                              <button
                                type="button"
                                onClick={() => setEditingServiceId(null)}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="h-full flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex justify-between items-start">
                                <h5 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                  <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg">🌻</span>
                                  {s.name}
                                </h5>
                                <div className="text-right">
                                  <span className="text-lg font-mono font-extrabold text-emerald-950">${s.pricePerHour}</span>
                                  <span className="text-[10px] text-gray-400 block font-mono">PER HOUR</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 font-sans leading-relaxed">{s.description}</p>
                            </div>

                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                Std. 3hr block: <strong className="font-extrabold">${s.pricePerHour * 3}</strong>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditServiceInit(s)}
                                  className="p-1.5 bg-emerald-105 hover:bg-emerald-100 rounded text-emerald-800 transition-colors"
                                  title="Edit Service Details & Price"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(s.id)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded text-rose-600 transition-colors"
                                  title="Delete Service Offering"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 📸 NURSERY & GARDENER LISTING QUALITY METRICS (EXPANSION) */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-6 mt-8 shadow-sm">
            <div>
              <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-widest uppercase block mb-1">
                GN-Q2 Catalog Standards
              </span>
              <h4 className="font-sans font-extrabold text-[#0d3c26] text-sm sm:text-base">
                Nursery Catalog Quality Scorecard & Photography Tips
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Maximize listing conversion rates by aligning with the platform's certified botanical listing guidelines. Studies show high-fidelity metadata increases orders by up to <strong>3.2×</strong>.
              </p>
            </div>

            {/* Grid of optimization guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed border-t border-gray-50 pt-6">
              <div className="space-y-4">
                <h5 className="font-sans font-bold text-gray-950 text-xs uppercase tracking-wide">
                  🏡 Photography Secrets for Live Specimens
                </h5>
                <div className="text-xs text-gray-600 space-y-3">
                  <p>
                    <strong className="text-gray-900 block">1. Use Natural Diffused Daylight:</strong>
                    Avoid sharp fluorescent bulbs which distort the organic chlorophyll tint of plant leaves. Photograph your indoor or outdoor species in well-lit shade, about 3 feet away from an east-facing window.
                  </p>
                  <p>
                    <strong className="text-gray-900 block">2. Frame Against Minimalist Contexts:</strong>
                    Capture your plant specimens centered in clean ceramic pots against plain off-white, light wooden, or neutral background walls to eliminate visual noise.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-sans font-bold text-gray-950 text-xs uppercase tracking-wide">
                  ✍️ Writing Rich Botanical Descriptions
                </h5>
                <div className="text-xs text-gray-600 space-y-3">
                  <p>
                    <strong className="text-gray-900 block">1. List Precise Care Metrics first:</strong>
                    Ensure you specify the exact light constraints (e.g. Bright indirect, low shade tolerance), water frequency (e.g. Every 7 days, let soil dry), and structural suitability of the seedling or seed lot.
                  </p>
                  <p>
                    <strong className="text-gray-900 block">2. Describe Ecological and Health Attributes:</strong>
                    Explain if the species effectively cleans air carbon compounds, acts as a bee/pollinator feeder, or contains organic sap which requires extra precautions near domestic pets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📥 INCOMING BOOKINGS AND ORDERS MANAGER TAB */}
      {activeTab === 'vendor-requests' && (
        <div id="vendor-requests-panel" className="space-y-6">
          <div>
            <h3 className="font-sans font-bold text-gray-900 text-base">
              {currentUser.role === 'nursery' ? 'Pending Customer Orders' : 'Client Gardening Bookings'}
            </h3>
            <p className="text-xs text-gray-500">
              Approve contracts, dispatch parcel logistics, and receive earnings balance instantly.
            </p>
          </div>

          {currentUser.role === 'nursery' ? (
            <div className="space-y-4">
              {vendorOrders.length === 0 ? (
                <div className="bg-white text-center py-10 rounded-2xl border border-gray-100 text-xs text-gray-400">
                  No incoming client product orders logged.
                </div>
              ) : (
                vendorOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2.5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-950">{order.id}</span>
                        <span className="text-[10px] text-gray-400 ml-2">Logged: {order.orderDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">Client: <strong>{order.customerName}</strong></span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-800">{it.productName} (Qty: {it.quantity})</span>
                          <span className="font-mono text-emerald-700">${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
                      <span className="text-gray-400">Shipment address: {order.shippingAddress} (Cell: {order.phone})</span>

                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleShipOrCompleteOrder(order.id, order.status)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          {order.status === 'Pending' ? 'Dispatched to Courier' : 'Mark Delivered (Disburse Balance)'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {vendorBookings.length === 0 ? (
                <div className="bg-white text-center py-10 rounded-2xl border border-gray-100 text-xs text-gray-400">
                  No incoming gardener bookings placed.
                </div>
              ) : (
                vendorBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2.5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-950">{booking.id}</span>
                        <span className="text-xs text-emerald-700 font-bold ml-2">[{booking.serviceType}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          booking.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          booking.status === 'Confirmed' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <span className="text-gray-400">Client Info:</span>
                        <p className="font-bold text-gray-900">{booking.customerName}</p>
                        <p className="text-gray-500">Address: {booking.customerAddress}</p>
                        <p className="text-gray-500">Contact: {booking.customerPhone}</p>
                      </div>

                      <div>
                        <span className="text-gray-400">Schedule Block:</span>
                        <p className="text-emerald-950 font-extrabold flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-emerald-600" /> {booking.date}
                        </p>
                        <p className="text-emerald-950 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock className="h-4 w-4 text-emerald-600" /> {booking.timeSlot}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="p-3 bg-gray-55 border border-dashed rounded-lg text-xs italic text-gray-500">
                        &ldquo;{booking.notes}&rdquo;
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                      <span className="text-gray-500">Total service cost: <strong className="font-mono text-emerald-700">${booking.price}</strong></span>

                      <div className="flex gap-2">
                        {booking.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleBookingResolution(booking.id, false)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg flex items-center gap-0.5 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" /> Decline
                            </button>
                            <button
                              onClick={() => handleBookingResolution(booking.id, true)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-0.5 cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" /> Accept Slot
                            </button>
                          </>
                        )}

                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => handleMarkBookingCompleted(booking.id, booking.price)}
                            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="h-4 w-4" /> Resolve Task (Disburse ${booking.price})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 📋 INCOMING CONTRACT DISPATCH & SERVICE PROTOCOLS (EXPANSION) */}
          <div className="bg-[#FAFBF7] rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-6 mt-8">
            <div>
              <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-widest uppercase block mb-1">
                GN-P3 Service Protocol
              </span>
              <h4 className="font-sans font-extrabold text-[#0d3c26] text-sm sm:text-base">
                Operational Fulfilment SLAs & Dispute Protections
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                To promote an organic trust structure between homeowners and local arborists, all vendors must adhere to standard service-delivery response guidelines.
              </p>
            </div>

            {/* SLA columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-3">
                <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600" /> 1. Booking Confirmation SLAs (24 Hours)
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Homeowners count on predictable schedules for lawn maintenance and soil prep. You are required to officially accept or decline incoming requests inside your portal within <strong>24 hours of lodging</strong>. Unresolved slots that cross this threshold are automatically cancelled to release customer holds.
                </p>
                <div className="border-t border-dashed border-gray-100 pt-2 text-[11px] text-emerald-800 font-semibold">
                  🎯 Target Accept Ratio: &gt;90% optimal ratings
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-3">
                <h5 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-emerald-600" /> 2. Transparent Dispute Resolution Process
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  If a homeowner registers a support complaint regarding product quality or a service no-show, GreenNest's Support Admin handles the mediation. Submit matching photographs of root potting or work completions to help admins resolve disputes neutrally within <strong>3 business days</strong>.
                </p>
                <div className="border-t border-dashed border-gray-100 pt-2 text-[11px] text-emerald-800 font-semibold">
                  📦 Support Resolution Window: typically 72 hours max
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
