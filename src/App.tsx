import React, { useState, useEffect } from 'react';
import { Sprout, ShoppingBag, Eye, Lock, Star, Sparkles, CheckCircle, Flame, ShieldAlert, ArrowRight } from 'lucide-react';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_DISPUTES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import { Product, User, Order, ServiceBooking, Dispute, Review, CartItem, GardenerService, AppNotification } from './types';
import Header from './components/Header';
import CustomerPortal from './components/CustomerPortal';
import VendorPortal from './components/VendorPortal';
import AdminPortal from './components/AdminPortal';
import AuthPortal from './components/AuthPortal';
import FooterPages from './components/FooterPages';
import UserProfile from './components/UserProfile';

export default function App() {
  // --- STATE PERSISTENCE LOOPS ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gn_users');
    if (saved) {
      try {
        const loaded: User[] = JSON.parse(saved);
        return loaded.map((u) => ({
          ...u,
          password: u.password || 'green123'
        }));
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gn_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gn_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    const saved = localStorage.getItem('gn_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('gn_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gn_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('gn_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('gn_categories');
    return saved ? JSON.parse(saved) : ['Plants', 'Seeds', 'Pots', 'Tools'];
  });

  const [subCategories, setSubCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('gn_subcategories');
    return saved ? JSON.parse(saved) : ['Indoor', 'Outdoor', 'Flowering', 'Accessories', 'Organic', 'Hand Tools'];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gn_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Session authentication states
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('gn_current_user_id');
    return saved ? saved : 'user-cust-1';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('gn_authenticated');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedUserId = localStorage.getItem('gn_current_user_id') || 'user-cust-1';
    const savedUsers = localStorage.getItem('gn_users');
    let uList = INITIAL_USERS;
    if (savedUsers) {
      try {
        uList = JSON.parse(savedUsers);
      } catch (e) {}
    }
    const currentUsr = uList.find(u => u.id === savedUserId) || uList[0];
    if (currentUsr) {
      if (currentUsr.role === 'admin') {
        return 'admin-dashboard';
      } else if (currentUsr.role === 'nursery' || currentUsr.role === 'gardener') {
        return 'vendor-dashboard';
      }
    }
    return 'shop';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gn_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gn_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gn_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gn_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('gn_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('gn_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('gn_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gn_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('gn_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('gn_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gn_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gn_subcategories', JSON.stringify(subCategories));
  }, [subCategories]);

  // Read current user
  const currentUser = React.useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  // Adjust active screen tab depending on active persona role
  const handleUserChange = (id: string) => {
    setCurrentUserId(id);
    const selectedUser = users.find(u => u.id === id) || users[0];
    
    if (selectedUser.role === 'customer') {
      setActiveTab('shop');
    } else if (selectedUser.role === 'nursery' || selectedUser.role === 'gardener') {
      setActiveTab('vendor-dashboard');
    } else if (selectedUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    }
    showToast(`Logged in as key persona: ${selectedUser.name}`);
  };
  
  const handleUpdateProfile = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
    showToast('Member profile details updated successfully.');
  };

  const handleLogin = (id: string) => {
    setIsAuthenticated(true);
    handleUserChange(id);
  };

  const handleRegister = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setIsAuthenticated(true);
    setCurrentUserId(newUser.id);
    
    if (newUser.role === 'customer') {
      setActiveTab('shop');
    } else if (newUser.role === 'nursery' || newUser.role === 'gardener') {
      setActiveTab('vendor-dashboard');
    } else if (newUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    }
    
    let welcomeMsg = `Welcome ${newUser.name}! Your account has been registered.`;
    if (newUser.role === 'nursery' || newUser.role === 'gardener') {
      welcomeMsg += ` Account pending live Admin approval.`;
    }
    showToast(welcomeMsg);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of profile session.');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const triggerNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    targetRole?: User['role'],
    targetUserId?: string
  ) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Math.floor(10000 + Math.random() * 90000),
      userId: targetUserId,
      role: targetRole,
      title,
      message,
      type,
      read: false,
      date: new Date().toISOString().split('T')[0]
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkNotifAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = (role: string, userId: string) => {
    setNotifications((prev) =>
      prev.filter((n) => {
        const matchesUser = n.userId === userId;
        const matchesRole = n.role === role && !n.userId;
        return !(matchesUser || matchesRole);
      })
    );
  };

  // --- ACTIONS LOG & HELPERS ---

  const handleAddToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const newCart = [...prev];
        newCart[idx].quantity = Math.min(product.stock, newCart[idx].quantity + qty);
        showToast(`Increased quantity of ${product.name} in cart`);
        return newCart;
      } else {
        showToast(`Added ${product.name} to cart`);
        return [...prev, { product, quantity: qty }];
      }
    });
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId));
    showToast('Removed item from shopping cart');
  };

  const handlePlaceOrder = (shippingAddress: string, phone: string) => {
    if (cart.length === 0) return;

    // Default source registry for first product item in cart
    const activeSellerId = cart[0].product.sellerId;
    const trackingId = 'ORD-' + Math.floor(1005 + Math.random() * 9000);

    const newOrder: Order = {
      id: trackingId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      items: cart.map(it => ({
        productId: it.product.id,
        productName: it.product.name,
        price: it.product.price,
        quantity: it.quantity,
        image: it.product.image
      })),
      totalAmount: cart.reduce((sum, it) => sum + it.product.price * it.quantity, 0) + 4.99,
      status: 'Pending',
      shippingAddress,
      phone,
      orderDate: new Date().toISOString().split('T')[0],
      sellerId: activeSellerId
    };

    // Decrease product stocks accordingly
    setProducts((prev) =>
      prev.map(p => {
        const boughtItem = cart.find(ci => ci.product.id === p.id);
        if (boughtItem) {
          return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast(`Order ${trackingId} successfully placed! It is pending shipment.`);
    
    // Notify customer role
    triggerNotification(
      'Order Placed Successfully',
      `Your order ${trackingId} for $${newOrder.totalAmount.toFixed(2)} has been submitted successfully to ${cart[0].product.sellerName || 'Nursery'}.`,
      'order',
      'customer',
      currentUser.id
    );

    // Notify nursery vendor
    triggerNotification(
      'New Customer Order!',
      `${currentUser.name} placed a new order ${trackingId} for ${cart.length} item(s) from your catalog.`,
      'order',
      'nursery',
      activeSellerId
    );
  };

  const handleBookGardener = (bookingData: Omit<ServiceBooking, 'id' | 'customerId' | 'customerName' | 'status'>) => {
    const bookingId = 'BK-' + Math.floor(5100 + Math.random() * 900);
    const newBooking: ServiceBooking = {
      ...bookingData,
      id: bookingId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      status: 'Pending'
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Gardener booking request (${bookingId}) submitted successfully!`);

    // Notify customer
    triggerNotification(
      'Gardener Appointment Sent',
      `Your request for ${bookingData.gardenerName} (${bookingData.serviceType}) is pending review.`,
      'booking',
      'customer',
      currentUser.id
    );

    // Notify gardener
    triggerNotification(
      'New Customer Booking Request',
      `${currentUser.name} wants to book you for ${bookingData.serviceType} on ${bookingData.date} during ${bookingData.timeSlot}.`,
      'booking',
      'gardener',
      bookingData.gardenerId
    );
  };

  const handleAddReview = (entityId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'rev-' + Math.floor(100 + Math.random() * 900),
      entityId,
      customerName: currentUser.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate average product rating inside local state
    setProducts((prev) =>
      prev.map(p => {
        if (p.id === entityId) {
          const count = p.reviewsCount + 1;
          const avg = Number(((p.rating * p.reviewsCount + rating) / count).toFixed(1));
          return { ...p, rating: avg, reviewsCount: count };
        }
        return p;
      })
    );

    showToast('Feedback reviewed and processed dynamically!');
  };

  const handleFileDispute = (disputeData: Omit<Dispute, 'id' | 'status' | 'date'>) => {
    const disputeId = 'DISP-' + Math.floor(3002 + Math.random() * 900);
    const newDispute: Dispute = {
      ...disputeData,
      id: disputeId,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    setDisputes((prev) => [newDispute, ...prev]);
    showToast(`Dispute case ${disputeId} logged with Support Admin.`);

    // Notify Admin role
    triggerNotification(
      'New dispute case logged',
      `Homeowner ${currentUser.name} filed dispute case ${disputeId} regarding ${disputeData.subject}.`,
      'dispute',
      'admin'
    );
  };

  // --- VENDOR & ADMIN SPECIFIC WRAPPER ACTIONS ---

  const handleAddProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewsCount'>) => {
    const generatedId = 'prod-' + Math.floor(9000 + Math.random() * 999);
    const newProduct: Product = {
      ...productData,
      id: generatedId,
      sellerId: currentUser.id,
      sellerName: currentUser.companyName || currentUser.name,
      rating: 5.0,
      reviewsCount: 0
    };

    setProducts((prev) => [...prev, newProduct]);
    showToast(`Succesfully published "${newProduct.name}" to live directory!`);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    showToast('Inventory stock count synchronized.');
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map(p => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    showToast('Pricing details synchronized.');
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
    showToast('Product removed from active logs.');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    
    // Read order to notify specifically its customer
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      triggerNotification(
        `Order Status: ${newStatus}`,
        `Your order #${orderId} with "${currentUser.companyName || currentUser.name}" has been marked: ${newStatus}.`,
        'order',
        'customer',
        targetOrder.customerId
      );
    }

    showToast(`Order ${orderId} dispatch logistics changed: ${newStatus}`);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: ServiceBooking['status']) => {
    setBookings((prev) =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );

    const targetBk = bookings.find(b => b.id === bookingId);
    if (targetBk) {
      triggerNotification(
        `Gardener Slot ${newStatus}`,
        `Specialist ${currentUser.name} updated your appointment ${bookingId} to: ${newStatus}.`,
        'booking',
        'customer',
        targetBk.customerId
      );
    }

    showToast(`Gardener slot ${bookingId} status: ${newStatus}`);
  };

  const handleUpdateUserBalance = (userId: string, addedAmount: number) => {
    setUsers((prev) =>
      prev.map(u => (u.id === userId ? { ...u, balance: Number(((u.balance || 0) + addedAmount).toFixed(2)) } : u))
    );
  };

  const handleUpdateGardenerServices = (userId: string, newServices: GardenerService[]) => {
    setUsers((prev) =>
      prev.map(u => (u.id === userId ? { ...u, services: newServices } : u))
    );
    showToast('Your gardening services catalog has been updated!');
  };

  const handleToggleVerifyUser = (userId: string) => {
    setUsers((prev) =>
      prev.map(u => (u.id === userId ? { ...u, verified: !u.verified } : u))
    );
    
    const target = users.find(u => u.id === userId);
    if (target) {
      const nextVerifyState = !target.verified;
      triggerNotification(
        'Accreditation Status Updated',
        `Platform Admin has changed your certification status. State: ${nextVerifyState ? 'VERIFIED ACTIVE' : 'AWAITING RE-AUDIT'}.`,
        'verify',
        target.role,
        target.id
      );
    }
    
    const targetName = target?.name || 'Vendor';
    const wasVerified = target?.verified;
    showToast(`Accreditation status changed for ${targetName}: ${!wasVerified ? 'Verified Active Partner' : 'Awaiting Audit'}`);
  };

  const handleResolveDispute = (disputeId: string, resolutionNotes: string) => {
    setDisputes((prev) =>
      prev.map(d => (d.id === disputeId ? { ...d, status: 'Resolved', resolutionNotes } : d))
    );

    const targetDispute = disputes.find(d => d.id === disputeId);
    if (targetDispute) {
      // Find customer user to trigger notifications
      const matchedCust = users.find(u => u.name === targetDispute.customerName);
      if (matchedCust) {
        triggerNotification(
          'Dispute Case Settled',
          `Admin completed review of your ${targetDispute.referenceType} dispute (${disputeId}). Decision: "${resolutionNotes}"`,
          'dispute',
          'customer',
          matchedCust.id
        );
      }
      
      const matchedVendor = users.find(u => u.companyName === targetDispute.vendorName || u.name === targetDispute.vendorName);
      if (matchedVendor) {
        triggerNotification(
          'Dispute Resolution Filed',
          `Admin resolved dispute case ${disputeId}. Check compliance requirements.`,
          'dispute',
          matchedVendor.role,
          matchedVendor.id
        );
      }
    }

    showToast(`Dispute Case ${disputeId} marked RESOLVED by Admin.`);
  };

  const handleEditProductAdmin = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Product "${updatedProduct.name}" details updated.`);
  };

  const handleCreateProductAdmin = (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewsCount'>) => {
    const generatedId = 'prod-' + Math.floor(9000 + Math.random() * 999);
    const newProduct: Product = {
      ...productData,
      id: generatedId,
      sellerId: 'admin',
      sellerName: 'Platform Admin Store',
      rating: 5.0,
      reviewsCount: 0
    };
    setProducts((prev) => [...prev, newProduct]);
    showToast(`Successfully published ${newProduct.name} to central catalog.`);
  };

  const handleAddCategory = (cat: string) => {
    if (!categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      showToast(`Category "${cat}" added successfully.`);
    } else {
      showToast('Category already exists!');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories((prev) => prev.filter(c => c !== cat));
    showToast(`Category "${cat}" deleted.`);
  };

  const handleAddSubCategory = (subCat: string) => {
    if (!subCategories.includes(subCat)) {
      setSubCategories((prev) => [...prev, subCat]);
      showToast(`Subcategory "${subCat}" added successfully.`);
    } else {
      showToast('Subcategory already exists!');
    }
  };

  const handleRemoveSubCategory = (subCat: string) => {
    setSubCategories((prev) => prev.filter(sc => sc !== subCat));
    showToast(`Subcategory "${subCat}" deleted.`);
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthPortal
          allUsers={users}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl border border-emerald-800 p-4 shadow-2xl flex items-center gap-3 animate-slideLeft transition-all">
            <div className="p-1.5 bg-emerald-600 rounded-lg text-emerald-100">
              <Sparkles className="h-4.5 w-4.5 animate-spin" />
            </div>
            <p className="text-xs font-semibold">{notification}</p>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-gray-800 font-sans flex flex-col justify-between">
      
      {/* 1. TOP HEADER NAVIGATION BLOCK */}
      <Header
        currentUser={currentUser}
        onChangeUser={handleUserChange}
        onLogout={handleLogout}
        allUsers={users}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotifAsRead}
        onClearNotifications={handleClearAllNotifications}
      />

      {/* 🔮 NOTIFICATION TOASTER ALERT CONTAINER */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl border border-emerald-800 p-4 shadow-2xl flex items-center gap-3 animate-slideLeft transition-all">
          <div className="p-1.5 bg-emerald-600 rounded-lg text-emerald-100">
            <Sparkles className="h-4.5 w-4.5 animate-spin" />
          </div>
          <p className="text-xs font-semibold">{notification}</p>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LANDING MARKETING HERO (Only visible to customer on Plant and seed catalog page to keep page highly visual) */}
        {currentUser.role === 'customer' && activeTab === 'shop' && (
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-10 mb-8 border border-emerald-800 shadow-lg shadow-emerald-950/5 relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono tracking-widest text-emerald-300 uppercase bg-emerald-900/50 rounded-full px-3 py-1 border border-emerald-700/40 mb-4 animate-fadeIn">
                <Flame className="h-3 w-3 text-emerald-400" /> Spring Planting Season Active
              </span>
              <h1 className="font-sans font-black text-2xl sm:text-4xl leading-tight tracking-tight text-emerald-50">
                Lush Living Spaces, Designed Offline, Ordered Online.
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-3 font-sans leading-relaxed">
                Connect with local nursery catalog holdings and hire background-cleared expert arborists to shape flowerbeds, remove stubborn weeds, and nourish potting soils.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => {
                    const el = document.getElementById('customer-store');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1 cursor-pointer text-emerald-950"
                >
                  Browse Spring Catalog <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('gardeners')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer text-emerald-100"
                >
                  Book Specialist Gardeners
                </button>
              </div>
            </div>

            {/* Absolute organic vector background layout */}
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-12 translate-y-12">
              <Sprout className="h-72 w-72 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Dynamic platform dashboard loader depending on current persona's role */}
        <div className="animate-fadeIn">
          {activeTab === 'profile' ? (
            <UserProfile
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              products={products}
              orders={orders}
              bookings={bookings}
            />
          ) : ['eco-standards', 'licensing-rules', 'help-desk'].includes(activeTab) ? (
            <FooterPages
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUserRole={currentUser.role}
            />
          ) : (
            <>
              {currentUser.role === 'customer' && (
                <CustomerPortal
                  products={products}
                  gardeners={users}
                  bookings={bookings}
                  orders={orders}
                  reviews={reviews}
                  cart={cart}
                  currentUser={currentUser}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                  onPlaceOrder={handlePlaceOrder}
                  onBookGardener={handleBookGardener}
                  onAddReview={handleAddReview}
                  onFileDispute={handleFileDispute}
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                  activeTab={activeTab}
                />
              )}

              {(currentUser.role === 'nursery' || currentUser.role === 'gardener') && (
                <VendorPortal
                  currentUser={currentUser}
                  products={products}
                  orders={orders}
                  bookings={bookings}
                  reviews={reviews}
                  onAddProduct={handleAddProduct}
                  onUpdateStock={handleUpdateStock}
                  onUpdateProductPrice={handleUpdateProductPrice}
                  onRemoveProduct={handleRemoveProduct}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onUpdateUserBalance={handleUpdateUserBalance}
                  onUpdateGardenerServices={handleUpdateGardenerServices}
                  activeTab={activeTab}
                />
              )}

              {currentUser.role === 'admin' && (
                <AdminPortal
                  users={users}
                  products={products}
                  orders={orders}
                  bookings={bookings}
                  disputes={disputes}
                  reviews={reviews}
                  onToggleVerifyUser={handleToggleVerifyUser}
                  onRemoveProductAdmin={handleRemoveProduct}
                  onResolveDispute={handleResolveDispute}
                  activeTab={activeTab}
                  categories={categories}
                  subCategories={subCategories}
                  onAddCategory={handleAddCategory}
                  onRemoveCategory={handleRemoveCategory}
                  onAddSubCategory={handleAddSubCategory}
                  onRemoveSubCategory={handleRemoveSubCategory}
                  onEditProductAdmin={handleEditProductAdmin}
                  onCreateProductAdmin={handleCreateProductAdmin}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* 3. PLATFORM SYSTEM FOOTER */}
      <footer className="bg-white border-t border-emerald-150 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="font-sans font-bold text-sm tracking-tight text-emerald-950">
              GreenNest Platform
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            &copy; 2026 GreenNest Garden Solutions. All licensing metrics background processed.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-emerald-800">
            <span
              onClick={() => setActiveTab('eco-standards')}
              className={`cursor-pointer hover:underline ${activeTab === 'eco-standards' ? 'text-emerald-950 underline font-extrabold' : ''}`}
            >
              Eco Standards
            </span>
            <span
              onClick={() => setActiveTab('licensing-rules')}
              className={`cursor-pointer hover:underline ${activeTab === 'licensing-rules' ? 'text-emerald-950 underline font-extrabold' : ''}`}
            >
              Licensing Rules
            </span>
            <span
              onClick={() => setActiveTab('help-desk')}
              className={`cursor-pointer hover:underline ${activeTab === 'help-desk' ? 'text-emerald-950 underline font-extrabold' : ''}`}
            >
              Help Desk Support
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
