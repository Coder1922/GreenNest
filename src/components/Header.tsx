import React, { useState } from 'react';
import { Sprout, ShoppingCart, Bell, MapPin, Sparkles, LogOut, Check, Trash2, Inbox, AlertCircle, Briefcase } from 'lucide-react';
import { User as UserType, AppNotification } from '../types';

interface HeaderProps {
  currentUser: UserType;
  onChangeUser: (userId: string) => void;
  onLogout?: () => void;
  allUsers: UserType[];
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications?: AppNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onClearNotifications?: (role: string, userId: string) => void;
}

export default function Header({
  currentUser,
  onChangeUser,
  onLogout,
  allUsers,
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  notifications = [],
  onMarkNotificationRead,
  onClearNotifications
}: HeaderProps) {
  const [showNotifDrop, setShowNotifDrop] = useState(false);

  const userNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      if (n.userId) {
        return n.userId === currentUser.id;
      }
      if (n.role) {
        return n.role === currentUser.role;
      }
      return false;
    });
  }, [notifications, currentUser]);

  const unreadCount = React.useMemo(() => {
    return userNotifications.filter(n => !n.read).length;
  }, [userNotifications]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'nursery':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'gardener':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getRoleDesc = (role: string) => {
    switch (role) {
      case 'admin': return 'Platform Admin';
      case 'nursery': return 'Nursery Owner';
      case 'gardener': return 'Expert Gardener';
      default: return 'Customer / Homeowner';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-emerald-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            id="logo-brand-container"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (currentUser.role === 'admin') {
                setActiveTab('admin-dashboard');
              } else if (currentUser.role === 'nursery' || currentUser.role === 'gardener') {
                setActiveTab('vendor-dashboard');
              } else {
                setActiveTab('shop');
              }
            }}
          >
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-sm shadow-emerald-600/30">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="font-sans font-bold text-xl tracking-tight text-emerald-950 block leading-tight">
                GreenNest
              </span>
              <span className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase block">
                Nursery & Garden Service
              </span>
            </div>
          </div>

          {/* Navigation Items based on active persona */}
          <nav className="hidden md:flex space-x-1">
            {currentUser.role === 'customer' && (
              <>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'shop'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  Plant & Seed Store
                </button>
                <button
                  onClick={() => setActiveTab('gardeners')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'gardeners'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  Book a Gardener
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'history'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  My Orders & Service Bookings
                </button>
              </>
            )}

            {(currentUser.role === 'nursery' || currentUser.role === 'gardener') && (
              <>
                <button
                  onClick={() => setActiveTab('vendor-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'vendor-dashboard'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  {currentUser.role === 'nursery' ? 'Nursery Portal' : 'Gardener Schedule'}
                </button>
                <button
                  onClick={() => setActiveTab('vendor-listings')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'vendor-listings'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  {currentUser.role === 'nursery' ? 'Manage Plant Catalog' : 'Manage Service Pricing'}
                </button>
                <button
                  onClick={() => setActiveTab('vendor-requests')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'vendor-requests'
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  {currentUser.role === 'nursery' ? 'Customer Orders' : 'Service Requests'}
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  Admin Analytics
                </button>
                <button
                  onClick={() => setActiveTab('admin-approvals')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'admin-approvals'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  Vendor Verification
                </button>
                <button
                  onClick={() => setActiveTab('admin-disputes')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'admin-disputes'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  Dispute & Complaints Desk
                </button>
                <button
                  onClick={() => setActiveTab('admin-catalog')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'admin-catalog'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  Products & Categories
                </button>
              </>
            )}
          </nav>

          {/* Right Header Area: Simulator and Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart button for Customer */}
            {currentUser.role === 'customer' && (
              <button
                onClick={onOpenCart}
                className="relative p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5.5 w-5.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Real notification bell dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDrop(!showNotifDrop);
                }}
                className="relative p-2 text-gray-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 font-bold text-[9px] text-white shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDrop && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-gray-150 flex items-center justify-between">
                    <div>
                      <span className="font-sans font-extrabold text-sm text-emerald-950 block">
                        Inbox Notifications ({userNotifications.length})
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                        Active Role: {getRoleDesc(currentUser.role)}
                      </span>
                    </div>
                    {userNotifications.length > 0 && onClearNotifications && (
                      <button
                        onClick={() => {
                          onClearNotifications(currentUser.role, currentUser.id);
                        }}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Inbox className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs italic font-sans">All clean! No pending notifications for your role.</p>
                      </div>
                    ) : (
                      userNotifications.map((notif) => {
                        let iconBg = 'bg-gray-100 text-gray-600';
                        if (notif.type === 'order') iconBg = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                        if (notif.type === 'booking') iconBg = 'bg-indigo-50 text-indigo-700 border border-indigo-100';
                        if (notif.type === 'dispute') iconBg = 'bg-rose-50 text-rose-700 border border-rose-100';
                        if (notif.type === 'verify') iconBg = 'bg-amber-50 text-amber-700 border border-amber-100';

                        return (
                          <div
                            key={notif.id}
                            className={`p-3.5 transition-colors duration-150 flex items-start gap-3 hover:bg-gray-50/50 ${
                              !notif.read ? 'bg-amber-50/15 border-l-2 border-amber-500' : ''
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
                              {notif.type === 'dispute' ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : notif.type === 'order' ? (
                                <ShoppingCart className="h-4 w-4" />
                              ) : notif.type === 'booking' ? (
                                <Briefcase className="h-4 w-4" />
                              ) : (
                                <Bell className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold leading-tight ${!notif.read ? 'text-gray-900' : 'text-gray-650'}`}>
                                  {notif.title}
                                </span>
                                <span className="text-[9px] text-gray-400 font-mono tracking-wider shrink-0">
                                  {notif.date}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                                {notif.message}
                              </p>
                              {!notif.read && onMarkNotificationRead && (
                                <button
                                  onClick={() => onMarkNotificationRead(notif.id)}
                                  className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-900 font-extrabold cursor-pointer transition-all"
                                >
                                  <Check className="h-3 w-3" /> Mark as Read
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile avatar info */}
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-100">
              <button
                id="header-profile-button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 text-left p-1 rounded-xl transition-all hover:bg-emerald-50/60 cursor-pointer ${
                  activeTab === 'profile' ? 'bg-emerald-50 ring-2 ring-emerald-500/15' : ''
                }`}
                title="View & Edit Member Profile"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
                  }}
                  className="h-8.5 w-8.5 rounded-full object-cover border border-emerald-200 ring-2 ring-emerald-500/10"
                />
                <div className="hidden lg:block text-left mr-1">
                  <p className="text-xs font-semibold text-emerald-950 leading-tight truncate max-w-[100px]">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-600 font-mono leading-none mt-0.5 font-bold">
                    {currentUser.role.toUpperCase()}
                  </p>
                </div>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer flex items-center justify-center animate"
                  title="Sign Out to Role Gatekeeper"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
