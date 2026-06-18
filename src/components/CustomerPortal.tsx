import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  Search,
  Filter,
  Star,
  Info,
  Calendar,
  Clock,
  MapPin,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  X,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  Sprout,
  Heart,
  Droplet,
  Sun,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { Product, CartItem, User, Order, ServiceBooking, Review, Dispute, GardenerService } from '../types';
import { getProductDataUri, getProductImage } from '../utils/productImages';

interface CustomerPortalProps {
  products: Product[];
  gardeners: User[];
  bookings: ServiceBooking[];
  orders: Order[];
  reviews: Review[];
  cart: CartItem[];
  currentUser: User;
  onAddToCart: (product: Product, qty: number) => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (shippingAddress: string, phone: string) => void;
  onBookGardener: (bookingData: Omit<ServiceBooking, 'id' | 'customerId' | 'customerName' | 'status'>) => void;
  onAddReview: (entityId: string, rating: number, comment: string) => void;
  onFileDispute: (disputeData: Omit<Dispute, 'id' | 'status' | 'date'>) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeTab: string;
}

export default function CustomerPortal({
  products,
  gardeners,
  bookings,
  orders,
  reviews,
  cart,
  currentUser,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onPlaceOrder,
  onBookGardener,
  onAddReview,
  onFileDispute,
  isCartOpen,
  setIsCartOpen,
  activeTab
}: CustomerPortalProps) {
  // Catalog filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('All'); // All, Indoor, Outdoor, Flowering
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Booking states
  const [selectedGardener, setSelectedGardener] = useState<User | null>(null);
  const [bookingService, setBookingService] = useState<'Home Gardening' | 'Lawn Maintenance' | 'Plant Care & Pruning'>('Home Gardening');
  const [bookingDate, setBookingDate] = useState<string>('2026-05-25');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('09:00 AM - 12:00 PM');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Checkout states
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [address, setAddress] = useState(currentUser.address);
  const [phone, setPhone] = useState(currentUser.phone);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  // Support / Complaint state
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeSubject, setDisputeSubject] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [disputeRefId, setDisputeRefId] = useState('');
  const [disputeRefType, setDisputeRefType] = useState<'Order' | 'Booking'>('Order');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  // Review state
  const [reviewEntityId, setReviewEntityId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Expanded order details state
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPlacement = selectedPlacement === 'All' || 
                                (selectedPlacement === 'Indoor' && p.subCategory === 'Indoor') ||
                                (selectedPlacement === 'Outdoor' && p.subCategory === 'Outdoor') ||
                                (selectedPlacement === 'Flowering' && p.subCategory === 'Flowering');
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPlacement && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, selectedPlacement, maxPrice]);

  // Cart values
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartSubtotal > 0 ? Number((cartSubtotal + 4.99).toFixed(2)) : 0; // plus shipping
  }, [cartSubtotal]);

  // Handle placing the order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const generatedId = 'GV-' + Math.floor(1000 + Math.random() * 9000);
    onPlaceOrder(address, phone);
    setOrderCompletedId(generatedId);
    setCheckoutStep(false);
    setIsCartOpen(false);
  };

  // Submit gardener booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGardener || !activeService) return;
    
    const rate = activeService.pricePerHour;
    const totalPrice = rate * 3; // Standard 3 hour slot

    onBookGardener({
      customerPhone: phone || currentUser.phone,
      customerAddress: address || currentUser.address,
      gardenerId: selectedGardener.id,
      gardenerName: selectedGardener.name,
      serviceType: activeService.name as any,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      notes: bookingNotes,
      price: totalPrice
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedGardener(null);
      setBookingNotes('');
    }, 4000);
  };

  // Clear states
  const openWriteReview = (id: string) => {
    setReviewEntityId(id);
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccess(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewEntityId) return;
    onAddReview(reviewEntityId, reviewRating, reviewComment);
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewEntityId(null);
      setReviewSuccess(false);
    }, 2000);
  };

  // Filter active/verified gardeners
  const gardenersList = useMemo(() => {
    return gardeners.filter(g => g.role === 'gardener');
  }, [gardeners]);

  // Dynamic available services depending on the selected gardener
  const availableServices = useMemo(() => {
    if (!selectedGardener) return [];
    if (selectedGardener.services && selectedGardener.services.length > 0) {
      return selectedGardener.services;
    }
    // Deep fallback if no services listed
    const isThomas = selectedGardener.name.includes('Thomas');
    const isElena = selectedGardener.name.includes('Elena');
    const rate = isThomas ? 45 : isElena ? 35 : 40;
    return [
      { id: 'fallback-s1', name: 'Home Gardening & Sorting', pricePerHour: rate, description: 'General backyard gardening, flowerbeds setup and potting soils.' },
      { id: 'fallback-s2', name: 'Lawn Maintenance & Edges', pricePerHour: rate - 5, description: 'Backyard lawn mowing, hedges cleaning and edges shaving.' },
      { id: 'fallback-s3', name: 'Plant Care & Pruning', pricePerHour: rate + 5, description: 'Expert arborist tree clipping, rose nutrition and organic weeding.' }
    ];
  }, [selectedGardener]);

  // Synchronize dynamic booking service when selected gardener changes
  React.useEffect(() => {
    if (selectedGardener && availableServices.length > 0) {
      setBookingService(availableServices[0].name);
    }
  }, [selectedGardener, availableServices]);

  const activeService = useMemo(() => {
    return availableServices.find(s => s.name === bookingService) || availableServices[0];
  }, [availableServices, bookingService]);

  // Support Dispute Form
  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeSubject || !disputeDescription) return;

    // find user corresponding to reference id
    let vendorName = 'GreenNest Official';
    if (disputeRefType === 'Order') {
      const ord = orders.find(o => o.id === disputeRefId);
      if (ord) vendorName = ord.items[0]?.productName || 'Nursery Vendor';
    } else {
      const bk = bookings.find(b => b.id === disputeRefId);
      if (bk) vendorName = bk.gardenerName;
    }

    onFileDispute({
      referenceId: disputeRefId,
      referenceType: disputeRefType,
      customerName: currentUser.name,
      vendorName: vendorName,
      subject: disputeSubject,
      description: disputeDescription,
    });

    setDisputeSuccess(true);
    setDisputeSubject('');
    setDisputeDescription('');
    setDisputeRefId('');
    setTimeout(() => {
      setDisputeOpen(false);
      setDisputeSuccess(false);
    }, 3000);
  };

  // Helper to extract botanical care guidelines for the expanded order view
  const getBotanicalCare = (productId: string, productName: string) => {
    // 1. Find product in props
    const p = products.find((prod) => prod.id === productId);
    if (p && p.careInstructions) {
      return p.careInstructions;
    }

    // 2. Fallbacks based on search keywords
    const nameLower = productName.toLowerCase();
    if (nameLower.includes('monstera')) {
      return {
        light: 'Bright indirect sunlight. Avoid direct scorching rays.',
        water: 'Water once a week, or when the top 2 inches of soil feel dry.',
        difficulty: 'Easy' as const,
        placement: 'Spacious living room corners or shaded patios.'
      };
    }
    if (nameLower.includes('snake') || nameLower.includes('sansevieria')) {
      return {
        light: 'Extremely tolerant of light levels. Thrives in medium indirect.',
        water: 'Water infrequently, about once every 2-3 weeks. Sensitive to rot.',
        difficulty: 'Easy' as const,
        placement: 'Bedrooms, dark corners, or modern hallway stands.'
      };
    }
    if (nameLower.includes('lily') || nameLower.includes('spathiphyllum')) {
      return {
        light: 'Partial shade or filtered low light. Sensitive to direct sun.',
        water: 'Keep soil consistently moist. Water immediately when leaves drape.',
        difficulty: 'Moderate' as const,
        placement: 'Bathrooms with natural windows & warm kitchen tops.'
      };
    }
    if (nameLower.includes('orchid') || nameLower.includes('phalaenopsis')) {
      return {
        light: 'Bright indirect eastern light. Mimic bark canopy shade.',
        water: 'Water every 7-10 days. Soak bark, let drain completely.',
        difficulty: 'Challenging' as const,
        placement: 'Dining centerpieces or elevated window sills.'
      };
    }
    if (nameLower.includes('palm') || nameLower.includes('areca')) {
      return {
        light: 'Bright, non-harsh filtered sunlight.',
        water: 'Keep light moist balance. Thrives on relative humidity sprays.',
        difficulty: 'Moderate' as const,
        placement: 'Bright cozy living rooms or moist outdoor decks.'
      };
    }
    if (nameLower.includes('tomato')) {
      return {
        light: 'Full direct solar radiation, 6 to 8 hours daily minimum.',
        water: 'Water deeply and regularly at base. Do not wet leaf canopy.',
        difficulty: 'Easy' as const,
        placement: 'Outdoor vegetable yards and raised seed beds.'
      };
    }
    if (nameLower.includes('lavender')) {
      return {
        light: 'Maximum bright sunshine. Hardwood heat lovers.',
        water: 'Very sparse. Let complete drought guide your next soak.',
        difficulty: 'Moderate' as const,
        placement: 'Borders, sunny window boxes, or dry sandy patio corners.'
      };
    }
    if (nameLower.includes('pot') || nameLower.includes('planter') || nameLower.includes('ceramic')) {
      return {
        light: 'N/A (Decorative pottery container)',
        water: 'Wash gently with soft sponge. Clean drain hole to let soils breathe.',
        difficulty: 'Easy' as const,
        placement: 'Fabulous indoors or outdoors matching your layout.'
      };
    }
    
    // Default fallback
    return {
      light: 'Adaptable to bright indirect lighting.',
      water: 'Water when topsoil feels dried. Avoid soggy roots.',
      difficulty: 'Easy' as const,
      placement: 'Optimal on shelves or cozy medium-light tables.'
    };
  };

  // Generates a simple, beautiful PDF invoice for a completed order
  const handleDownloadInvoice = (order: Order) => {
    const matched = products.find(p => p.sellerId === order.sellerId);
    const resolvedSellerName = matched ? matched.sellerName : 'GreenNest Nursery Vendor';

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Brand header
    doc.setTextColor(16, 185, 129); // Accent Emerald
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('GreenNest', 20, 25);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('BOTANICAL MARKETPLACE', 20, 29);

    // Invoice Meta
    doc.setFontSize(20);
    doc.setTextColor(17, 24, 39); // Deep Slate
    doc.text('INVOICE', 140, 25);

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`Invoice ID: INV-${order.id.replace('ord-', '')}`, 140, 31);
    doc.text(`Order Date: ${order.orderDate}`, 140, 36);
    doc.text(`Invoice Date: ${new Date().toISOString().split('T')[0]}`, 140, 41);
    doc.text(`Status: COMPLETED`, 140, 46);

    // Separator line
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 52, 190, 52);

    // Customer & Vendor detail sections
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('BILL TO:', 20, 62);
    doc.text('SOLD BY:', 110, 62);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(order.customerName, 20, 68);
    
    // Auto-wrapped shipping address
    const addressLines = doc.splitTextToSize(order.shippingAddress || 'No Address Provided', 75);
    doc.text(addressLines, 20, 73);
    const endAddressY = 73 + (addressLines.length * 4.5);
    doc.text(`Phone: ${order.phone || ''}`, 20, endAddressY);

    // Vendor info
    doc.text(resolvedSellerName, 110, 68);
    doc.text('Official Certified Seller', 110, 73);
    doc.text('Platform Supervised Vendor', 110, 78);

    // Column Headings
    const tableStartY = 95;
    doc.setFillColor(243, 244, 246);
    doc.rect(20, tableStartY, 170, 8, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text('Item Description', 22, tableStartY + 5.5);
    doc.text('Qty', 115, tableStartY + 5.5);
    doc.text('Unit Price', 135, tableStartY + 5.5);
    doc.text('Amount', 165, tableStartY + 5.5);

    let currentY = tableStartY + 14;
    doc.setFont('Helvetica', 'normal');

    order.items.forEach((item) => {
      doc.setTextColor(17, 24, 39);
      const titleLines = doc.splitTextToSize(item.productName, 80);
      doc.text(titleLines, 22, currentY);
      
      doc.setTextColor(75, 85, 99);
      doc.text(String(item.quantity), 115, currentY);
      doc.text(`$${Number(item.price).toFixed(2)}`, 135, currentY);
      
      doc.setTextColor(17, 24, 39);
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 165, currentY);

      currentY += Math.max(8, titleLines.length * 4.5 + 2);
    });

    // Totals calculations
    const calculatedSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = Number((order.totalAmount - calculatedSubtotal).toFixed(2));

    // Closing border
    doc.setDrawColor(229, 231, 235);
    doc.line(20, currentY, 190, currentY);

    currentY += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('Subtotal:', 120, currentY);
    doc.text(`$${calculatedSubtotal.toFixed(2)}`, 165, currentY);

    if (shippingCost > 0) {
      currentY += 5;
      doc.text('Shipping Fee:', 120, currentY);
      doc.text(`$${shippingCost.toFixed(2)}`, 165, currentY);
    }

    currentY += 7;
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Accent Emerald
    doc.text('Paid Total Amount:', 120, currentY);
    doc.text(`$${order.totalAmount.toFixed(2)}`, 165, currentY);

    currentY += 18;
    
    // Footer notices
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Thank you for choosing GreenNest to enrich your green spaces!', 20, currentY);
    
    // Validation watermark
    doc.setFont('Courier', 'normal');
    doc.setFontSize(7);
    doc.text(`Verification Secure Lock: SHA256-${order.id}-${Math.floor(Math.random() * 999999)}`, 20, currentY + 5);

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="w-full">
      {/* 1. PLANT & SEEDS STORE TAB */}
      {activeTab === 'shop' && (
        <div id="customer-store" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Bento-style Sidebar Filters */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-md shadow-emerald-950/2">
            <h3 className="font-sans font-bold text-emerald-950 text-base flex items-center gap-2 mb-5">
              <Filter className="h-4.5 w-4.5 text-emerald-600" />
              Dynamic Catalog Filters
            </h3>

            {/* Keyword Search */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Search Species
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Monstera, basil, pot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Category selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Category
              </label>
              <div className="space-y-1">
                {['All', 'Plants', 'Seeds', 'Pots', 'Tools'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Placement Filter */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Placement Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Any', value: 'All' },
                  { label: '🏡 Indoor', value: 'Indoor' },
                  { label: '🪵 Outdoor', value: 'Outdoor' },
                  { label: '🌸 Flowering', value: 'Flowering' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedPlacement(item.value)}
                    className={`text-center text-[11px] font-semibold py-2 rounded-lg border transition-all ${
                      selectedPlacement === item.value
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-2 border-t border-emerald-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Max Budget
                </label>
                <span className="text-sm font-mono font-bold text-emerald-700">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="3"
                max="60"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-gray-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>$3</span>
                <span>$60</span>
              </div>
            </div>

            {/* Platform Trust Box */}
            <div className="mt-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
              <Sprout className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-emerald-950">GreenNest Promise</p>
              <p className="text-[10px] text-emerald-800 leading-relaxed mt-1">
                Every plant is dispatched directly from local bio-certified nurseries in organic potting mix.
              </p>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-sans font-bold text-gray-900 text-lg">
                  Browse Premium Gardening Stock
                </h2>
                <p className="text-xs text-gray-500">
                  {filteredProducts.length} pristine items found matching your filter criteria
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
                <div className="p-3 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="text-sm font-bold text-gray-700">No matching products</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try widening your budget, resetting filters, or looking for general botanical categories as seeds or tools.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedPlacement('All');
                    setMaxPrice(60);
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-2xl border border-emerald-100/50 hover:border-emerald-200 hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer"
                      onClick={() => setSelectedProduct(p)}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                        <img
                          src={p.image || getProductImage(p.id, p.name, p.category)}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = getProductDataUri(p.id, p.name, p.category);
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-emerald-950 shadow-sm">
                            {p.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white shadow-xs">
                            {p.subCategory}
                          </span>
                        </div>
                        {p.stock <= 5 && p.stock > 0 && (
                          <span className="absolute bottom-2 right-2 text-[9px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md">
                            Only {p.stock} Left!
                          </span>
                        )}
                        {p.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-[11px] font-bold bg-red-600 text-white px-3 py-1 rounded-md tracking-wider uppercase">
                              Temporarily Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Card Panel */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h4 className="font-sans font-bold text-gray-900 group-hover:text-emerald-700 transition-colors text-sm line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex text-amber-400">
                              <Star className="h-3 w-3 fill-amber-400" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">{p.rating}</span>
                            <span className="text-[10px] text-gray-400">({p.reviewsCount} reviews)</span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                              Member Price
                            </span>
                            <span className="text-base font-mono font-bold text-emerald-700">
                              ${p.price.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                            Details & Care <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 🌿 SPRING BOTANICAL COMPANION MATRIX & EDUCATION SYSTEM (ENRICHED EXPANSION) */}
            <div className="mt-12 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-200 mb-2">
                  <Sprout className="h-3 w-3 text-emerald-600 animate-bounce" /> GreenNest Masterclass
                </span>
                <h3 className="font-sans font-extrabold text-[#0d3c26] text-lg sm:text-xl tracking-tight">
                  The Botanical Companion Matrix & Seasonal Planting Guide
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Growing plants in isolation often limits soil potential. Our master botanists have compiled the ultimate guide to botanical companion planting, microclimate setup, and seasonal adjustments to ensure your GreenNest thrives year-round.
                </p>
              </div>

              {/* Grid of Educational Companion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50/20 rounded-2xl p-5 border border-emerald-100/40 hover:bg-emerald-50/45 transition-colors space-y-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center font-bold font-mono">
                    01
                  </div>
                  <h4 className="font-sans font-bold text-gray-900 text-sm">
                    Synergistic Root Networks
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Planting deeply-rooted species like our <strong>Snake Plant (Sansevieria)</strong> alongside shallow container-growers helps aerate potting layers. For vegetables, pairing <strong>Basil</strong> with <strong>Tomato seedlings</strong> acts as a physical barrier that deters whiteflies and hornworms while enhancing natural nitrogen fixation.
                  </p>
                  <ul className="text-[11px] space-y-1.5 text-emerald-900 font-medium">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Ideal Companion: Herbaceous crops + Leafy greens
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Soil Impact: Balanced pH & Aeration boost
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50/20 rounded-2xl p-5 border border-emerald-100/40 hover:bg-emerald-50/45 transition-colors space-y-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center font-bold font-mono">
                    02
                  </div>
                  <h4 className="font-sans font-bold text-gray-900 text-sm">
                    Microclimates & Canopy Shelters
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tall, wide-leaf species such as the <strong>Monstera Deliciosa</strong> or <strong>Areca Palms</strong> generate local microclimates with increased humidity through rapid transpiration. Place delicate moisture-lovers like the <strong>Peace Lily</strong> or <strong>Phalaenopsis Orchid</strong> directly beneath their leafy canopies.
                  </p>
                  <ul className="text-[11px] space-y-1.5 text-emerald-900 font-medium">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Ideal Companion: Broadleaf Shade + Canopy Understory
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Soil Impact: Retains surface humidity & protects roots
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50/20 rounded-2xl p-5 border border-emerald-100/40 hover:bg-emerald-50/45 transition-colors space-y-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center font-bold font-mono">
                    03
                  </div>
                  <h4 className="font-sans font-bold text-gray-900 text-sm">
                    Ecological Pest Management
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Avoid synthetic and chemical pesticides which compromise family-friendly living spaces. Sowing aromatic herbs like <strong>Lavender</strong> or <strong>Rosemary</strong> on sunny balcony boxes acts as a natural aesthetic deterrent against mosquitoes, ticks, and beetles while attracting vital honeybee pollinators.
                  </p>
                  <ul className="text-[11px] space-y-1.5 text-emerald-900 font-medium">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Ideal Companion: Lavender borders + Raised vegetable beds
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Soil Impact: Organic bio-diversified soil microbes
                    </li>
                  </ul>
                </div>
              </div>

              {/* 📦 THE GREENNEST ECO-TRANSIT GUARANTEE PANEL */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-gray-150 flex flex-col md:flex-row items-center gap-6">
                <div className="p-3 bg-emerald-600 rounded-2xl text-white">
                  <Sprout className="h-8 w-8" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-sans font-bold text-gray-900 text-sm">
                    How GreenNest Delivers Live Plants Safely to Your Doorstep
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Our local nursery partners don't just put live plants in standard cardboard mailers. Each specimen is carefully inspected, fed with trace mineral solutions, and cocooned in our protective, biodegradable 100% compostable structural pulp molds. Dual air vents ensure carbon exchange is maintained, and root plugs are sealed to lock in soil hydration for up to 9 consecutive transit days.
                  </p>
                </div>
                <div className="shrink-0 font-mono text-center bg-white p-3.5 rounded-xl border border-gray-200">
                  <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Transit Guard Spec</span>
                  <span className="text-emerald-700 font-bold text-lg block">99.8%</span>
                  <span className="text-[9px] text-gray-500 font-semibold block uppercase">Healthy Arrival Rate</span>
                </div>
              </div>

              {/* 💡 FREQUENTLY ASKED BOTANICAL QUESTIONS SECTION (FAQ) */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5 text-emerald-600" /> Frequently Asked Botanical FAQ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#fafaf8] p-4.5 rounded-xl border border-emerald-50 hover:bg-white transition-all space-y-1.5 hover:shadow-sm">
                    <h5 className="font-sans font-bold text-xs text-[#0d3c26]">
                      Q: What should I do immediately after my plant arrives?
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      First, remove all packaging including the biodegradable root plug sleeve. Let the plant acclimatize to indoor environmental lighting in a shaded area for 24-48 hours. Give it a gentle splash of tepid water directly onto the soil, but do not repot immediately — wait at least two weeks to prevent transplant shock.
                    </p>
                  </div>

                  <div className="bg-[#fafaf8] p-4.5 rounded-xl border border-emerald-50 hover:bg-white transition-all space-y-1.5 hover:shadow-sm">
                    <h5 className="font-sans font-bold text-xs text-[#0d3c26]">
                      Q: How do I know if my houseplants are overwatered?
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Yellow leaves that feel soft, mushy, or listing stems are classic signs of root suffocation from overwatering. If you suspect rotting roots, suspend watering immediately, verify your container's drainage hole is not obstructed, and check the top 2 inches of soil with your finger before applying more moisture.
                    </p>
                  </div>

                  <div className="bg-[#fafaf8] p-4.5 rounded-xl border border-emerald-50 hover:bg-white transition-all space-y-1.5 hover:shadow-sm">
                    <h5 className="font-sans font-bold text-xs text-[#0d3c26]">
                      Q: Can I use gardener services to build a vegetable raised bed?
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Absolutely! Our specialist partners are equipped to handle architectural setups, sod installation, raised bed construction, and nutrient organic soil layering. Write your exact scope inside the "Detailed Care Instructions" block during gardener booking to ensure they bring the appropriate tools.
                    </p>
                  </div>

                  <div className="bg-[#fafaf8] p-4.5 rounded-xl border border-emerald-50 hover:bg-white transition-all space-y-1.5 hover:shadow-sm">
                    <h5 className="font-sans font-bold text-xs text-[#0d3c26]">
                      Q: Is there transparent licensing checks for GreenNest specialists?
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Yes. Every service provider listed on GreenNest under the gardener tab undergoes strict identification verification, ecological background screening, and accreditation reviews by our platform administrators. Unlicensed or uncertified operators are automatically flagged and disabled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOK A GARDENER SERVICE TAB */}
      {activeTab === 'gardeners' && (
        <div id="customer-gardeners" className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-sans font-extrabold text-gray-900 text-2xl tracking-tight">
              Surgically Verified Experts & Gardeners
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
              Skip informal WhatsApp recommendations. Browse fully credentialed experts with background clearance ready to shape lawns or trim decorative pruning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {gardenersList.map((g) => {
              // Simulated pricing matching their persona
              let rate = 40;
              let experience = "Master Gardener (12 yrs experience)";
              let bio = "Specializes in Japanese Bonsai shaping, organic fertilizers, and restoring neglected backyard soil compositions.";
              if (g.name.includes('Elena')) {
                rate = 35;
                experience = "Lawn Architect (8 yrs experience)";
                bio = "Expert in complex weed extraction, customized sod layering, and lawn leveling and sprinkler alignments.";
              }
              if (g.name.includes('Thomas')) {
                rate = 45;
                experience = "Certified Arborist (15 yrs experience)";
                bio = "Specialist in tall canopy pruning, disease identification lists, health diagnostics, and precision hedge design.";
              }

              return (
                <div
                  key={g.id}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    selectedGardener?.id === g.id
                      ? 'border-emerald-600 ring-2 ring-emerald-600/10 shadow-md'
                      : 'border-emerald-100 hover:border-emerald-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <img
                          src={g.avatar}
                          alt={g.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
                          }}
                          className="h-14 w-14 rounded-xl object-cover border border-gray-100"
                        />
                        <div>
                          <h4 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            {g.name}
                            {g.verified && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle className="h-2.5 w-2.5 fill-emerald-800 text-white" />
                                VERIFIED
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-emerald-700 font-medium">{g.companyName}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{experience}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-mono font-bold text-emerald-700 block">${rate}</span>
                        <span className="text-[10px] text-gray-400 block font-semibold leading-none">/ hour</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 leading-relaxed">{bio}</p>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <div className="flex text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-700">5.0</span>
                      <span className="text-[10px] text-gray-400">(4 reviews)</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    {g.verified ? (
                      <button
                        onClick={() => {
                          setSelectedGardener(g);
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedGardener?.id === g.id
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {selectedGardener?.id === g.id ? 'Selected / Details Form Below' : 'Choose Gardener & Set Schedule'}
                      </button>
                    ) : (
                      <div className="bg-amber-50 rounded-xl py-2 px-3 border border-amber-100 flex items-center gap-1.5 justify-center">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-[10px] text-amber-800 font-semibold uppercase">Pending Licensing Approval by Admin</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Booking Scheduler Form */}
          {selectedGardener && (
            <div className="bg-emerald-900/5 rounded-2xl border border-emerald-900/10 p-6 sm:p-8 animate-fadeIn">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-sans font-bold text-emerald-950 text-base">
                    Schedule Appointment with {selectedGardener.name}
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Your service session will be booked in a standard 3-hour comprehensive block.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGardener(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="bg-emerald-800 text-white p-6 rounded-xl text-center">
                  <CheckCircle className="h-10 w-10 mx-auto mb-3" />
                  <h4 className="font-bold text-sm">Booking Request Transmitted Successfully!</h4>
                  <p className="text-xs text-emerald-100 mt-1">
                    Your appointment is currently <strong>Pending Confirmation</strong>. Switch roles to <strong>{selectedGardener.name}</strong> to approve or reject this booking live in the gardener panel!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Service Type Selection */}
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 mb-1">
                        Gardening Service
                      </label>
                      <select
                        value={bookingService}
                        onChange={(e: any) => setBookingService(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                      >
                        {availableServices.map((s) => (
                          <option key={s.id} value={s.name}>
                            🌻 {s.name} (${s.pricePerHour}/hr)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Select Working Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min="2026-05-24"
                        className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Time Slot Picker */}
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Select Working Slot
                      </label>
                      <select
                        value={bookingTimeSlot}
                        onChange={(e) => setBookingTimeSlot(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                        <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                        <option value="05:00 PM - 08:00 PM">Evening (05:00 PM - 08:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer phone and address confirmations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Primary Callback Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Execution Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Street details"
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Notes / Instructions */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Detailed Care Instructions or Desired Scope
                    </label>
                    <textarea
                      placeholder="e.g. Please bring special hedge shears. Pruning needed for two 5-feet rose gardens."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg h-20 focus:border-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Pricing transparency and confirmation button */}
                  <div className="bg-emerald-950 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-emerald-300 font-mono block">TRANSPARENT PRICING breakdown</span>
                      <p className="text-xs mt-0.5">
                        Selected: "{activeService?.name || 'Gardening Slot'}" rate: ${activeService?.pricePerHour || 40}/hr × 3 hrs standard block. No booking surcharges.
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-emerald-300 block">ESTIMATED TOTAL</span>
                        <span className="text-xl font-mono font-bold">${(activeService?.pricePerHour || 40) * 3}</span>
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Confirm Booking Request
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 🛠️ SPECIALIST CORE COMPETENCIES & LANDSCAPING TIMELINE (ENRICHED EXPANSION) */}
          <div className="mt-12 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm space-y-8">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-200 mb-2">
                <CheckCircle className="h-3 w-3 text-emerald-600" /> Operational Blueprint
              </span>
              <h3 className="font-sans font-extrabold text-[#0d3c26] text-lg sm:text-xl tracking-tight">
                Specialist Core Competencies & Landscaping Procedures
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                GreenNest does not simply match you with gig-workers. Every professional on our registry possesses dedicated certifications and conforms to specific biosafety and environmental codes.
              </p>
            </div>

            {/* Competency Bento-Like Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-gray-150 space-y-2">
                <span className="p-2 inline-block bg-teal-150 rounded-lg text-teal-850 font-bold font-mono text-[10px] tracking-wide mb-1 uppercase">
                  Procedural Code GN-A1
                </span>
                <h4 className="font-sans font-bold text-gray-900 text-sm">
                  Soil Nutrient Calibration & pH Mapping
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed">
                  Before adding any fertilizer, specialists perform a chemical spot check to register nitrogen (N), phosphorus (P), potassium (K), and general soil alkalinity. They balance pH naturally using slow-release bone meal, limestone coatings, or peat moss adjusters to suit your botanical species' explicit profile.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-gray-150 space-y-2">
                <span className="p-2 inline-block bg-emerald-150 rounded-lg text-emerald-850 font-bold font-mono text-[10px] tracking-wide mb-1 uppercase">
                  Procedural Code GN-B4
                </span>
                <h4 className="font-sans font-bold text-gray-900 text-sm">
                  Pathogen Diagnostics & Selective Weed Elimination
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed">
                  Instead of non-selective toxic chemical compounds, our certified arborists isolate mildew, root fungus, or target weeds manually and apply localized bio-pesticide soap sprays. They protect helpful insects such as ladybugs and earthworms while safely dismantling invasive plant species.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-gray-150 space-y-2">
                <span className="p-2 inline-block bg-amber-150 rounded-lg text-amber-850 font-bold font-mono text-[10px] tracking-wide mb-1 uppercase">
                  Procedural Code GN-C3
                </span>
                <h4 className="font-sans font-bold text-gray-900 text-sm">
                  Sanitized Tool Biosafety Protocol
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed">
                  To prevent cross-site botanical contamination, select specialists sterilize all pruning shears, root saw teeth, and shovels using a 70% isopropyl alcohol sanitizing bath before entering and leaving your residential work boundaries. Black rot and rose rosette diseases are safely kept away.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-gray-150 space-y-2">
                <span className="p-2 inline-block bg-indigo-150 rounded-lg text-indigo-850 font-bold font-mono text-[10px] tracking-wide mb-1 uppercase">
                  Procedural Code GN-D2
                </span>
                <h4 className="font-sans font-bold text-gray-900 text-sm">
                  Organic Eco-Waste & Compost Recycling
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed">
                  We believe in circular design. All lawn clipping fractions, dried branches, and weeds extracted during maintenance are sorted and designated for local bio-gas plants or nursery composting rows rather than municipal dumping landfills, reducing greenhouse output directly.
                </p>
              </div>
            </div>

            {/* Our 4-Step Professional Care Process Timeline */}
            <div className="pt-4 border-t border-emerald-55 space-y-6">
              <h4 className="font-sans font-bold text-gray-900 text-sm">
                Our Standardized 4-Step Professional Service Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'Site Inspection', desc: 'Arborist assesses your overall garden layout, records direct sunlight durations, and inspects the health of current species.' },
                  { step: '02', title: 'Prep & Sanitize', desc: 'Our specialist cleans their equipment, establishes organic borders, and lays down protective ground canvases.' },
                  { step: '03', title: 'Master Service', desc: 'Pruning, mowing, potting fertilization, and weeding are completed meticulously to professional quality standards.' },
                  { step: '04', title: 'Recitative Cleanup', desc: 'All garden debris is organized, tools cleaned, and a comprehensive care summary is submitted to your GreenNest logs.' }
                ].map((item, idx) => (
                  <div key={idx} className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow-sm">
                        {item.step}
                      </div>
                      <div className="h-0.5 bg-emerald-100 flex-1 hidden md:block"></div>
                    </div>
                    <h5 className="font-sans font-bold text-gray-900 text-xs mt-1">{item.title}</h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER & SERVICE HISTORY TAB */}
      {activeTab === 'history' && (
        <div id="customer-history" className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="font-sans font-bold text-gray-900 text-lg">
              Personal Gardening Service & Order History
            </h2>
            <p className="text-xs text-gray-500">
              Track details of dispatched parcels, pending gardener visits, or file complaints.
            </p>
          </div>

          {/* Catalog orders list */}
          <div className="bg-white rounded-2xl border border-emerald-100/80 p-6 shadow-sm">
            <h3 className="font-sans font-bold text-emerald-950 text-sm flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
              <ShoppingBag className="h-4.5 w-4.5 text-emerald-600" />
              Nursery Products Placement History ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No previous botanical orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/30 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2 mb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-800">{order.id}</span>
                        <span className="text-[10px] text-gray-400 ml-2">Ordered on {order.orderDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {order.status}
                        </span>

                        {order.status === 'Delivered' && (
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-150 hover:border-emerald-300 transition-all flex items-center gap-1 cursor-pointer"
                            title="Download beautiful PDF invoice sheet"
                          >
                            <Download className="h-3.5 w-3.5" /> Download Invoice
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {expandedOrderId === order.id ? <ChevronUp className="h-3.5 w-3.5 text-slate-600" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-600" />}
                          {expandedOrderId === order.id ? 'Hide Details' : 'View Details & Care'}
                        </button>

                        <button
                          onClick={() => {
                            setDisputeRefId(order.id);
                            setDisputeRefType('Order');
                            setDisputeSubject(`Issues regarding ${order.id}`);
                            setDisputeOpen(true);
                          }}
                          className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" /> File Complaint
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || getProductImage(item.productId, item.productName)}
                              alt={item.productName}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = getProductDataUri(item.productId, item.productName);
                              }}
                              className="w-10 h-10 object-cover rounded-lg border"
                            />
                            <div>
                              <p className="text-xs font-bold text-gray-800">{item.productName}</p>
                              <p className="text-[10px] text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                          </div>

                          {order.status === 'Delivered' && (
                            <button
                              onClick={() => openWriteReview(item.productId)}
                              className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              ★ Rate Product
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between text-xs">
                      <span className="text-gray-400">Ship to Address: <strong>{order.shippingAddress}</strong></span>
                      <span className="font-mono font-bold text-emerald-800 col-span-1 text-right">Paid Total: ${order.totalAmount}</span>
                    </div>

                    {/* Collapsible expanded botanical details and care tips */}
                    {expandedOrderId === order.id && (
                      <div className="mt-4 pt-4 border-t border-dashed border-emerald-100 bg-emerald-50/15 rounded-xl p-4 space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Financial Summary card */}
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-sm">
                            <h4 className="font-sans font-bold text-emerald-950 text-xs flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-50">
                              <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
                              Order Breakdown
                            </h4>
                            <div className="space-y-1.5 text-[11px] text-gray-600 font-sans">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Subtotal:</span>
                                <span className="font-semibold text-gray-800">
                                  ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Standard Packaging:</span>
                                <span className="text-emerald-700 font-semibold uppercase text-[9px] tracking-wider">Free Eco-wrap</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Shipping Standard:</span>
                                <span className="font-semibold text-gray-800">Included</span>
                              </div>
                              <hr className="my-1 border-gray-100" />
                              <div className="flex justify-between text-[11px] font-bold text-emerald-800 pt-0.5">
                                <span>Paid Amount:</span>
                                <span className="font-mono">${order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Logistics Summary card */}
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-sm">
                            <h4 className="font-sans font-bold text-emerald-950 text-xs flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-50">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                              Recipient & Dispatch Information
                            </h4>
                            <div className="space-y-1 text-[11px] text-gray-600">
                              <p className="leading-snug">
                                <span className="text-gray-400">Address Name:</span> <strong className="text-gray-800">{order.customerName}</strong>
                              </p>
                              <p className="leading-relaxed">
                                <span className="text-gray-400">Shipping Location:</span> <span className="text-gray-800">{order.shippingAddress}</span>
                              </p>
                              <p>
                                <span className="text-gray-400">Recipient Phone:</span> <span className="text-gray-800">{order.phone || '+1 (555) 349-2041'}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Plant Care Sheet Card Container */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 pt-1">
                            <Sprout className="h-4.5 w-4.5 text-emerald-600" />
                            <h4 className="font-sans font-bold text-emerald-950 text-xs">
                              Botanical Care Sheet & Pro-Tips
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {order.items.map((item, idx) => {
                              const care = getBotanicalCare(item.productId, item.productName);
                              return (
                                <div key={idx} className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-xs space-y-2.5">
                                  <div className="flex items-center justify-between border-b border-gray-50 pb-1.5 gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="p-1 bg-emerald-50 rounded-full text-emerald-700">
                                        <Sprout className="h-3.5 w-3.5" />
                                      </span>
                                      <span className="font-bold text-gray-900 text-xs truncate max-w-[150px]" title={item.productName}>
                                        {item.productName}
                                      </span>
                                    </div>
                                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                      care.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-800' :
                                      care.difficulty === 'Moderate' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                                    }`}>
                                      {care.difficulty} Care
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600">
                                    <div className="bg-slate-50/60 p-2 rounded-lg space-y-0.5">
                                      <span className="font-bold text-emerald-800 block text-[9px] uppercase tracking-wider flex items-center gap-0.5">
                                        <Sun className="h-2.5 w-2.5 text-amber-500" /> Light Needs
                                      </span>
                                      <span className="leading-snug">{care.light}</span>
                                    </div>
                                    <div className="bg-slate-50/60 p-2 rounded-lg space-y-0.5">
                                      <span className="font-bold text-sky-800 block text-[9px] uppercase tracking-wider flex items-center gap-0.5">
                                        <Droplet className="h-2.5 w-2.5 text-sky-500" /> Watering
                                      </span>
                                      <span className="leading-snug">{care.water}</span>
                                    </div>
                                  </div>

                                  <div className="text-[10px] text-gray-655 bg-emerald-55/20 p-2 rounded-lg">
                                    <strong className="text-emerald-950 font-sans block text-[9px] uppercase tracking-wider font-extrabold mb-0.5">Recommended Space Placement:</strong>
                                    <span>{care.placement}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gardener scheduling bookings history */}
          <div className="bg-white rounded-2xl border border-emerald-100/80 p-6 shadow-sm">
            <h3 className="font-sans font-bold text-emerald-950 text-sm flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
              <Calendar className="h-4.5 w-4.5 text-emerald-600" />
              Gardener Appointment Booking Log ({bookings.length})
            </h3>

            {bookings.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No gardener appointments requested.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/30 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2 mb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-800">{booking.id}</span>
                        <span className="text-[10px] text-emerald-700 font-bold ml-2">[{booking.serviceType}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            booking.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : booking.status === 'Confirmed'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {booking.status}
                        </span>

                        <button
                          onClick={() => {
                            setDisputeRefId(booking.id);
                            setDisputeRefType('Booking');
                            setDisputeSubject(`Complaint for booking ${booking.id}`);
                            setDisputeOpen(true);
                          }}
                          className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" /> Dispute This
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400">Assigned Professional:</p>
                        <p className="font-bold text-gray-800">{booking.gardenerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Appointment Schedule:</p>
                        <p className="font-bold text-emerald-950 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          {booking.date} @ {booking.timeSlot}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-2 text-[11px] p-2 bg-gray-50 rounded text-gray-500 italic">
                        &ldquo;{booking.notes}&rdquo;
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Workstation: {booking.customerAddress}</span>
                      <span className="font-mono font-bold text-emerald-700">Service cost: ${booking.price}</span>
                    </div>

                    {booking.status === 'Completed' && (
                      <div className="mt-3 text-right">
                        <button
                          onClick={() => openWriteReview(booking.gardenerId)}
                          className="px-3 py-1 border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          ★ Leave Feedback for {booking.gardenerName}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🌿 MY BOTANICAL ECOLOGICAL SCORECARD & CARE CHECKLISTS */}
          <div className="bg-gradient-to-br from-[#0c311f] to-[#041a10] text-emerald-100 rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
              <div>
                <span className="text-[10px] text-[#00f38c] font-mono font-bold tracking-widest uppercase block mb-1">
                  Eco-Impact Integration
                </span>
                <h3 className="font-sans font-black text-white text-base sm:text-lg">
                  Household Ecological Footprint Tracker
                </h3>
                <p className="text-xs text-emerald-200/70 mt-0.5 max-w-md">
                  Every organic seed sown, nursery plant nourished, and arborist session booked contributes directly to urban biodiversity and carbon reduction indices.
                </p>
              </div>
              <div className="bg-emerald-900/50 border border-emerald-700/50 py-2.5 px-4 rounded-2xl shrink-0">
                <span className="text-[9px] text-emerald-400 font-bold uppercase block tracking-wider">Estimated Offset Rating</span>
                <span className="text-xl font-mono font-bold text-white block">Level 3 Specialist</span>
              </div>
            </div>

            {/* Impact stats columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-800/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide block">Carbon Sequestered</span>
                <span className="text-lg font-mono font-bold text-white block mt-0.5">24.5 lbs</span>
                <span className="text-[9px] text-emerald-300/60 block leading-snug">annual botanical capture rate</span>
              </div>

              <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-800/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide block">Water Infiltration</span>
                <span className="text-lg font-mono font-bold text-white block mt-0.5">380 gal</span>
                <span className="text-[9px] text-emerald-300/60 block leading-snug">soil capillary saturation water saved</span>
              </div>

              <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-800/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide block">Bees Supported</span>
                <span className="text-lg font-mono font-bold text-white block mt-0.5">750+</span>
                <span className="text-[9px] text-emerald-300/60 block leading-snug">pollinator feeding index</span>
              </div>

              <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-800/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide block">Soil Nitrogen Level</span>
                <span className="text-lg font-mono font-bold text-white block mt-0.5">+14% Optimal</span>
                <span className="text-[9px] text-emerald-300/60 block leading-snug">organic bio-matter rating</span>
              </div>
            </div>

            {/* Micro Care Tasks Checklist */}
            <div className="bg-emerald-950/45 border border-emerald-800/40 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="h-4 w-4 text-emerald-400" /> Weekly Botanical Grooming Checklist
                </h4>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Keep your purchased species in peak physical condition with this customized dynamic planner compiled from your ongoing history catalog.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <label className="flex items-start gap-2.5 p-3.5 bg-emerald-900/20 rounded-xl border border-emerald-800/30 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-emerald-500 rounded h-3.5 w-3.5" />
                  <div>
                    <span className="font-bold text-white block text-xs">Aerate Houseplant Topsoils</span>
                    <span className="text-[10px] text-emerald-300/60 leading-snug block">Use a soft wooden stick to stir the upper 1 inch of potting soil in your Monstera and Snake Plants container.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3.5 bg-emerald-900/20 rounded-xl border border-emerald-800/30 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 accent-emerald-500 rounded h-3.5 w-3.5" />
                  <div>
                    <span className="font-bold text-white block text-xs">Foliage Dusting Session</span>
                    <span className="text-[10px] text-emerald-300/60 leading-snug block">Wipe wide-leaf surfaces with a damp textile cloth to remove fine dust layers. Optimizes solar energy absorption by 30%.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3.5 bg-emerald-900/20 rounded-xl border border-emerald-800/30 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-emerald-500 rounded h-3.5 w-3.5" />
                  <div>
                    <span className="font-bold text-white block text-xs">Watering Calibrations</span>
                    <span className="text-[10px] text-emerald-300/60 leading-snug block">Verify sub-surface soil moisture before re-watering. Ensure the drain hole of ceramic containers clears easily.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3.5 bg-emerald-900/20 rounded-xl border border-emerald-800/30 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 accent-emerald-500 rounded h-3.5 w-3.5" />
                  <div>
                    <span className="font-bold text-white block text-xs">Draught Moisture Spritz</span>
                    <span className="text-[10px] text-emerald-300/60 leading-snug block">For orchids and shade foliage, mist air spaces briefly in high-temperature hours to replicate natural relative canopy moisture.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING PRODUCT DETAILS DRAWER / MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl border border-emerald-100 animate-scaleUp">
            {/* Header info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedProduct.category} Catalog Listing
                </span>
                <h3 className="font-sans font-bold text-gray-900 text-lg sm:text-xl mt-1">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 px-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Image and Basic Reviews info */}
              <div>
                <img
                  src={selectedProduct.image || getProductImage(selectedProduct.id, selectedProduct.name, selectedProduct.category)}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = getProductDataUri(selectedProduct.id, selectedProduct.name, selectedProduct.category);
                  }}
                  className="w-full aspect-square object-cover rounded-xl border border-gray-100 shadow-sm"
                />
                <div className="mt-3 p-3 bg-emerald-55 text-emerald-900 rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-1 mb-1">
                    <Info className="h-4 w-4 text-emerald-600" />
                    <span>Vendor Seller:</span>
                  </div>
                  <span className="font-bold underline text-emerald-950">{selectedProduct.sellerName}</span>
                </div>
              </div>

              {/* Specs & Care Instructions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Species Description</h4>
                  <p className="text-xs text-gray-650 mt-1 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* CARE DETAILS CARD - MANDATORY REQUIREMENT */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1 mb-2.5">
                    <Sprout className="h-4 w-4 text-emerald-700" /> Plant Care Guide & Specs
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">☀️ Light Required</span>
                      <span className="text-emerald-900 font-semibold">{selectedProduct.careInstructions.light}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">💧 Hydration / Water</span>
                      <span className="text-emerald-900 font-semibold">{selectedProduct.careInstructions.water}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">🔰 Difficulty Rating</span>
                      <span className={`font-mono text-[11px] font-bold ${
                        selectedProduct.careInstructions.difficulty === 'Easy' ? 'text-emerald-700' :
                        selectedProduct.careInstructions.difficulty === 'Moderate' ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {selectedProduct.careInstructions.difficulty}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">📍 Recommended Fit</span>
                      <span className="text-emerald-900 font-semibold">{selectedProduct.careInstructions.placement}</span>
                    </div>
                  </div>
                </div>

                {/* Stock tracker and price line */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-mono">STOCKS IN STORES</span>
                    <span className="text-xs font-bold text-gray-800">
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} units available` : 'Out of stock'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase text-right font-mono text-emerald-800">Direct Pricing</span>
                    <span className="text-xl font-mono font-black text-emerald-700">
                      ${selectedProduct.price}
                    </span>
                  </div>
                </div>

                {/* Add to Cart button or warning */}
                <div>
                  {selectedProduct.stock > 0 ? (
                    <button
                      onClick={() => {
                        onAddToCart(selectedProduct, 1);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-extrabold rounded-lg transition-transform flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <ShoppingBag className="h-4.5 w-4.5" /> Add Botanical to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed"
                    >
                      Out of stock
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Reviews inside details modal */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Verified Plant Reviews</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {reviews.filter(r => r.entityId === selectedProduct.id).length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">No feedback published yet. Be the first customer to purchase and review!</p>
                ) : (
                  reviews.filter(r => r.entityId === selectedProduct.id).map((r, idx) => (
                    <div key={idx} className="bg-gray-50 p-2.5 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-700">{r.customerName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-500 text-[11px] font-sans">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CART AND CHECKOUT DRAWER / SIDEBAR --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-emerald-950/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 animate-slideLeft">
            <div className="flex justify-between items-center border-b border-light pb-4 mb-4">
              <div>
                <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-1.5">
                  <ShoppingBag className="h-5 w-5 text-emerald-600" />
                  Your Gardening Checkout Cart
                </h3>
                <p className="text-[11px] text-gray-400">
                  Secure shipping computed instantly
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Cart products list */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Sprout className="h-10 w-10 text-emerald-200 mb-2" />
                  <p className="text-xs text-gray-400 font-semibold">Your direct seed & planter cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Return to Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border border-gray-100 p-3 rounded-xl hover:bg-gray-55/40">
                    <img
                      src={item.product.image || getProductImage(item.product.id, item.product.name, item.product.category)}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = getProductDataUri(item.product.id, item.product.name, item.product.category);
                      }}
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">{item.product.name}</p>
                      <p className="text-xs font-mono font-semibold text-emerald-700 mt-0.5">${item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateCartQty(item.product.id, item.quantity - 1);
                            } else {
                              onRemoveFromCart(item.product.id);
                            }
                          }}
                          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQty(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total calculation panel */}
            {cart.length > 0 && (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Cart Subtotal</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Eco-Packaging & Shipping</span>
                  <span className="font-mono">$4.99</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-950 pt-2 border-t border-emerald-100">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-700">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Checkout step integration */}
            {cart.length > 0 && (
              <div>
                {!checkoutStep ? (
                  <button
                    onClick={() => setCheckoutStep(true)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Proceed to Delivery Coordinates
                  </button>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3 animate-fadeIn">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Shipping Destination</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Callback Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(false)}
                        className="flex-1 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-bold"
                      >
                        Adjust Cart
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Place Order (Simulated COD)
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ADD REVIEW FEEDBACK MODAL --- */}
      {reviewEntityId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl border border-emerald-100">
            <h3 className="font-sans font-bold text-gray-900 text-base mb-2">Write Review & Give Stars</h3>
            <p className="text-xs text-gray-400 mb-4">Your rating instantly recalculates vendor stats on submit!</p>

            {reviewSuccess ? (
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl text-center text-xs font-semibold">
                Review submitted successfully! Recalculating averages...
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Star Assessment</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Feedback Comment</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe product vigor or gardener performance..."
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg h-24 focus:outline-emerald-500"
                  ></textarea>
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReviewEntityId(null)}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    Publish Stars
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- WRITE COMPLAINT / SUBMIT DISPUTE MODAL --- */}
      {disputeOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-sans font-bold text-gray-900 text-base">File Support Dispute Ticket</h3>
              <button onClick={() => setDisputeOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Your message will log in the Admin Dispute Center for swift arbitration.
            </p>

            {disputeSuccess ? (
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl text-center text-xs font-semibold">
                Dispute successfully submitted! Redirecting to ticket monitor...
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Reference ID</label>
                  <input
                    type="text"
                    value={disputeRefId}
                    readOnly
                    className="w-full text-xs p-2 bg-gray-50 border rounded-lg text-gray-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Case Subject</label>
                  <input
                    type="text"
                    required
                    value={disputeSubject}
                    onChange={(e) => setDisputeSubject(e.target.value)}
                    placeholder="e.g. Broken pot on arrival, delayed gardener"
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Factual Description</label>
                  <textarea
                    required
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    placeholder="Provide specific details..."
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg h-24 focus:outline-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg mt-2 cursor-pointer"
                >
                  File Dispute Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
