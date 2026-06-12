import React, { useState } from 'react';
import { Sprout, Mail, Lock, User, Phone, MapPin, Briefcase, LogIn, Sparkles, UserPlus, ShieldAlert, Key } from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface AuthPortalProps {
  allUsers: UserType[];
  onLogin: (userId: string) => void;
  onRegister: (newUser: UserType) => void;
}

export default function AuthPortal({ allUsers, onLogin, onRegister }: AuthPortalProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setErrorMsg('Please specify your profile email.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please specify your account password.');
      return;
    }

    const matched = allUsers.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (matched) {
      if (loginPassword !== matched.password) {
        setErrorMsg('Incorrect password. All built-in preset accounts use password: "green123"');
        return;
      }
      onLogin(matched.id);
      setErrorMsg(null);
    } else {
      setErrorMsg('Account credentials or email address not found. Please register a brand new developer/vendor profile or sign in using your existing credential values.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regPhone || !regAddress) {
      setErrorMsg('Please fill in all standard user profile details and choose a secure password.');
      return;
    }

    const emailInUse = allUsers.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailInUse) {
      setErrorMsg('This email address is already in use.');
      return;
    }

    // Creating a premium registered user
    const generatedId = 'user-reg-' + Math.floor(1000 + Math.random() * 9000);
    const brandNewUser: UserType = {
      id: generatedId,
      name: regName,
      email: regEmail.trim(),
      password: regPassword,
      role: selectedRole,
      phone: regPhone,
      address: regAddress,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: regAvatar,
      balance: selectedRole === 'customer' ? undefined : 0.00,
      // Nursery and Gardeners start off unverified so the admin verify loop can be illustrated live!
      verified: selectedRole === 'customer' || selectedRole === 'admin' ? undefined : false,
      companyName: selectedRole === 'customer' || selectedRole === 'admin' ? undefined : regCompany || `${regName} Plant Specialists`,
      // Add default services automatically for gardeners
      services: selectedRole === 'gardener' ? [
        { id: `reg-s-${generatedId}-1`, name: 'Standard Trim & Garden Prep', pricePerHour: 35, description: 'Basic weeding, branch trimming, soil feeding, and cleanup.' },
        { id: `reg-s-${generatedId}-2`, name: 'Heavy Grass Lawn Treatment', pricePerHour: 30, description: 'Full mowing, organic fertilizer infusion, and edge correction.' }
      ] : undefined
    };

    onRegister(brandNewUser);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic ambient organic design background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-12 translate-y-12"></div>

      <div className="w-full max-w-4xl bg-[#fafaf8] rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/10 flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Brand & Quick Simulator helper */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 md:w-5/12 flex flex-col justify-between space-y-8 relative">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2">
              <div className="p-2 bg-emerald-500 rounded-xl text-emerald-950 shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white block">GreenNest</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-50 leading-snug">
              Eco-Friendly Nursery and Expert Gardening Platform.
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
              Connect effortlessly with registered botanical greenhouses and specialized arborist labor to refine lawnscapes under transparent hourly compliance rules.
            </p>
          </div>

          <div className="border-t border-emerald-700/40 pt-4 space-y-3">
            <span className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase block font-bold">
              ⚡ Secure Portal Account Access
            </span>
            <p className="text-[11px] text-emerald-200/90 leading-tight">
              Sign in with your email or register a new customer, nursery, or gardener specialist account to explore, bid on projects, update stock, or manage disputes.
            </p>
          </div>

          {/* Decorative absolute element background */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Sprout className="h-64 w-64 text-emerald-300" />
          </div>
        </div>

        {/* Right Side: Auth Inputs & Quick Switches */}
        <div className="p-8 md:w-7/12 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="font-sans font-black text-emerald-950 text-xl leading-none">
                {isLoginView ? 'Welcome Back!' : 'Join the GreenNest'}
              </h3>
              <button
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                {isLoginView ? 'Create Account' : 'Already have account?'}
                <UserPlus className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 bg-rose-50 text-rose-800 text-xs p-3.5 rounded-xl border border-rose-100 flex items-start gap-2">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-500" />
                <p className="font-semibold">{errorMsg}</p>
              </div>
            )}

            {/* LOGIN INNER VIEW */}
            {isLoginView ? (
              <div className="space-y-4 mt-6">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-950 mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Profile Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah.jenkins@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-gray-250 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-emerald-700" /> Account Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Password (presets use: green123)"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-gray-250 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" /> Log In Securely
                  </button>
                </form>

                <div className="text-center pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Reset application local storage? This will clear all stale browser states and restore original mock accounts with password 'green123'.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="text-[10px] text-gray-400 hover:text-rose-600 underline font-sans font-semibold transition-colors"
                    title="Clears all local storage variables of GreenNest"
                  >
                    ⚠️ Reset stale browser data & restore defaults
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION VIEW */
              <div className="space-y-4 mt-4">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Role Switcher tabs */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-900 mb-1.5">
                      Select Your Registry Profile Role
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
                      {(['customer', 'nursery', 'gardener'] as UserRole[]).map((roleVal) => (
                        <button
                          key={roleVal}
                          type="button"
                          onClick={() => setSelectedRole(roleVal)}
                          className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            selectedRole === roleVal
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                          }`}
                        >
                          {roleVal === 'customer' ? 'Customer' : roleVal === 'nursery' ? 'Nursery Owner' : 'Specialist Gardener'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-gray-500">Contact / Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded-lg focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-gray-500">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@yoursite.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded-lg focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                      <Lock className="h-3 w-3 text-emerald-800" /> Account Security Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Define a secure password for profile logins"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded-lg focus:border-emerald-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-gray-500">Phone Mobile</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +1 (555) 700-1122"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded-lg focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-gray-500">Residential/Business Address</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 52 Oak Drive, Queens, NY"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded-lg focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Company name field for vendors */}
                  {(selectedRole === 'nursery' || selectedRole === 'gardener') && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <label className="block text-[9px] uppercase font-bold text-emerald-900 mb-1 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Registered Business / Company Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={selectedRole === 'nursery' ? "e.g. Sunset botanical Greenhouse" : "e.g. Custom Hedge & Lawn Design Services"}
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-emerald-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                      />
                      <p className="text-[10px] text-gray-400 mt-1 italic leading-none">
                        * Note: To simulate real-world auditing safeguards, registered vendors start as <strong>Unverified</strong>. Switch roles to Admin panel (Marcus Vance) to verify and unlock full visibility!
                      </p>
                    </div>
                  )}

                  {/* Profile avatar preset options */}
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1.5">
                      Select Custom Profile Avatar Icon
                    </label>
                    <div className="flex gap-2.5">
                      {[
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
                      ].map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRegAvatar(url)}
                          className={`p-1 rounded-full border-2 transition-all ${
                            regAvatar === url ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={url} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
                            }}
                            className="w-10 h-10 rounded-full object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" /> Create Profile & Log In
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Secure transaction notice */}
          <p className="text-[10px] text-gray-400 text-center font-mono mt-4 leading-none">
            GreenNest Role Gatekeeper Protocol. All account simulations logged on localized storage.
          </p>
        </div>
      </div>
    </div>
  );
}
