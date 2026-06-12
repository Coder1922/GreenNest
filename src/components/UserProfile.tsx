import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  DollarSign,
  Calendar,
  Save,
  Camera,
  ShoppingBag,
  Star,
  CheckCircle,
  Briefcase,
  Key,
  Flame,
  Award
} from 'lucide-react';
import { User, Product, Order, ServiceBooking } from '../types';

interface UserProfileProps {
  currentUser: User;
  onUpdateProfile: (updated: User) => void;
  products: Product[];
  orders: Order[];
  bookings: ServiceBooking[];
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
];

export default function UserProfile({
  currentUser,
  onUpdateProfile,
  products,
  orders,
  bookings,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [password, setPassword] = useState(currentUser.password || 'green123');
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Stats derivations
  const userOrders = React.useMemo(() => {
    return orders.filter(o => o.customerId === currentUser.id);
  }, [orders, currentUser.id]);

  const userBookings = React.useMemo(() => {
    return bookings.filter(b => b.customerId === currentUser.id);
  }, [bookings, currentUser.id]);

  const vendorProducts = React.useMemo(() => {
    return products.filter(p => p.sellerId === currentUser.id);
  }, [products, currentUser.id]);

  const vendorOrders = React.useMemo(() => {
    return orders.filter(o => o.sellerId === currentUser.id);
  }, [orders, currentUser.id]);

  const gardenerBookings = React.useMemo(() => {
    return bookings.filter(b => b.gardenerId === currentUser.id);
  }, [bookings, currentUser.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name,
      email,
      phone,
      address,
      password,
      avatar,
      companyName: ['nursery', 'gardener'].includes(currentUser.role) ? companyName : undefined,
    };
    onUpdateProfile(updatedUser);
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const roleLabels: Record<string, string> = {
    customer: 'Customer & Garden Enthusiast',
    nursery: 'Certified Nursery Vendor',
    gardener: 'Expert Maintenance Gardener',
    admin: 'Platform Administrator',
  };

  return (
    <div id="user-profile-tab" className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back breadcrumb banner */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Member Profile</h2>
          <p className="text-xs text-gray-500 font-mono mt-0.5">Manage details for your secure platform identity</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold font-sans">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Profile summary, avatar selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 text-center">
            <div className="relative inline-block mx-auto mb-4">
              <img
                src={avatar}
                alt={name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
                }}
                className="h-28 w-28 rounded-full object-cover border-4 border-emerald-50 ring-4 ring-emerald-500/10 shadow-md mx-auto"
              />
              <button
                type="button"
                onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                title="Change Avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {showAvatarPresets && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-gray-150">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Select Design Avatar
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((currUrl) => (
                    <button
                      key={currUrl}
                      type="button"
                      onClick={() => {
                        setAvatar(currUrl);
                        setShowAvatarPresets(false);
                      }}
                      className={`h-9 w-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                        avatar === currUrl ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-transparent hover:scale-105'
                      }`}
                    >
                      <img src={currUrl} alt="Avatar option" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h3 className="font-sans font-extrabold text-lg text-emerald-950 leading-tight">
              {name || 'No Name'}
            </h3>
            <p className="text-xs font-mono text-emerald-600 mt-1 uppercase tracking-wider font-semibold">
              {currentUser.role}
            </p>
            <p className="text-[11px] text-gray-500 font-sans mt-0.5">
              {roleLabels[currentUser.role] || 'Platform Member'}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-mono">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span>Joined Platform on {currentUser.joinedDate || '2026'}</span>
            </div>

            {currentUser.verified && (
              <span className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-extrabold tracking-tight border border-emerald-150">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                VERIFIED PARTNER
              </span>
            )}
          </div>

          {/* Quick Info Box depending on Role */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Account Metrics</h4>

            {currentUser.role === 'customer' && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-emerald-600" /> Store Orders
                  </span>
                  <span className="font-mono font-bold text-gray-900">{userOrders.length} placed</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" /> Servicing
                  </span>
                  <span className="font-mono font-bold text-gray-900">{userBookings.length} bookings</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Platform Rank</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    Bronze Patron
                  </span>
                </div>
              </div>
            )}

            {currentUser.role === 'nursery' && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-sky-600" /> Catalog Offers
                  </span>
                  <span className="font-mono font-bold text-gray-900">{vendorProducts.length} live index</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-sky-600" /> Sales Serviced
                  </span>
                  <span className="font-mono font-bold text-gray-900">{vendorOrders.length} orders</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Nursery Wallet
                  </span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    ${currentUser.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </span>
                </div>
              </div>
            )}

            {currentUser.role === 'gardener' && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-amber-600" /> Schedule Load
                  </span>
                  <span className="font-mono font-bold text-gray-900">{gardenerBookings.length} assignments</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-550 fill-amber-300" /> Average Rating
                  </span>
                  <span className="font-mono font-bold text-gray-900">4.9 / 5</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Earned Wallet
                  </span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    ${currentUser.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </span>
                </div>
              </div>
            )}

            {currentUser.role === 'admin' && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-rose-600" /> Authority
                  </span>
                  <span className="font-bold text-rose-800">Super Admin</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Operational Keys</span>
                  <span className="font-mono font-semibold text-emerald-700 text-[10px]">ALL_PERMISSIONS</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Bypass Gatekeeper</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-[10px]">ENABLED</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Profile Info form or detailed fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <span className="font-sans font-extrabold text-sm text-emerald-950">
                Contact & Identity Registry
              </span>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg cursor-pointer transition-colors"
                >
                  Edit Profile Details
                </button>
              ) : (
                <span className="text-[11px] text-amber-700 font-semibold italic">Editing active</span>
              )}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Read-Only State */}
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-gray-100/80 space-y-1">
                    <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                      Full Registrant Name
                    </p>
                    <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <UserIcon className="h-4 w-4 text-emerald-600 shrink-0" /> {currentUser.name}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-gray-100/80 space-y-1">
                    <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                      Email Address
                    </p>
                    <p className="text-xs font-bold text-gray-805 truncate flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-emerald-600 shrink-0" /> {currentUser.email}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-gray-100/80 space-y-1">
                    <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                      Phone Number
                    </p>
                    <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-emerald-600 shrink-0" /> {currentUser.phone || 'Not Supplied'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-gray-100/80 space-y-1">
                    <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                      Delivery & Home Address
                    </p>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" /> {currentUser.address || 'Not Supplied'}
                    </p>
                  </div>

                  {['nursery', 'gardener'].includes(currentUser.role) && (
                    <div className="p-3 bg-slate-50/70 rounded-xl border border-gray-100/80 space-y-1 md:col-span-2">
                      <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                        Company Name / Brand Label
                      </p>
                      <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Building className="h-4 w-4 text-emerald-600 shrink-0" /> {currentUser.companyName || 'Not configured'}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-gray-100/80 space-y-1">
                    <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                      Security Password
                    </p>
                    <p className="text-xs font-mono font-bold text-gray-750 flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-emerald-600 shrink-0" /> ••••••••
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Edit State inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <UserIcon className="h-3.5 w-3.5 text-emerald-600" /> Full Registrant Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/40 focus:bg-white border rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-emerald-600" /> Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/40 focus:bg-white border rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" /> Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/40 focus:bg-white border rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Delivery & Home Address
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/40 focus:bg-white border rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all text-gray-800"
                      />
                    </div>

                    {['nursery', 'gardener'].includes(currentUser.role) && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 text-emerald-600" /> Company Name / Brand Label
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Your business trademark name"
                          className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/40 focus:bg-white border rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all text-gray-850 font-sans"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Key className="h-3.5 w-3.5 text-emerald-600" /> Account Password
                      </label>
                      <input
                        type="text"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/40 focus:bg-white border rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setName(currentUser.name);
                        setEmail(currentUser.email);
                        setPhone(currentUser.phone);
                        setAddress(currentUser.address);
                        setPassword(currentUser.password || 'green123');
                        setCompanyName(currentUser.companyName || '');
                        setAvatar(currentUser.avatar);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-700/10"
                    >
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-55 bg-gradient-to-tr from-emerald-100/20 to-teal-50/20 rounded-2xl border border-emerald-100 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Flame className="h-4 w-4 text-amber-500 shrink-0" /> Security Check-in
              </span>
              <p className="text-xs font-bold text-gray-800 mt-1">Need to jump profiles or test other personas?</p>
              <p className="text-[11px] text-gray-500">You can log out to the gateway access door to try different system personas.</p>
            </div>
            {/* Direct Logout shortcut here */}
            <button
              type="button"
              onClick={() => {
                window.location.reload(); // Quick reset/refresh
              }}
              className="px-4 py-2 hover:bg-emerald-900 hover:text-white bg-emerald-50 text-emerald-800 border border-emerald-200 text-center text-xs font-bold rounded-xl shrink-0 cursor-pointer transition-all"
            >
              System Re-Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
