/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { User, CryptoCoin } from './types';
import { initialCoins } from './data/mockCrypto';
import { Language } from './locales/translations';
import { LoginModal } from './components/LoginModal';
import { HomeScreen } from './components/HomeScreen';
import { MarketScreen } from './components/MarketScreen';
import { WalletInvestScreen } from './components/WalletInvestScreen';
import { AccountScreen } from './components/AccountScreen';
import { SupportScreen } from './components/SupportScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AdminPanel } from './components/AdminPanel';
import { Globe, Shield, ExternalLink } from 'lucide-react';

export default function App() {
  // Global Language state (Default: Khmer 'km' as requested)
  const [language, setLanguage] = useState<Language>('km');

  // Multi-Site Routing: 'invest' (Investor Web) vs 'admin' (Admin Panel Web)
  const [currentSite, setCurrentSite] = useState<'invest' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;
      if (path.includes('/admin') || hash.includes('/admin') || search.includes('site=admin')) {
        return 'admin';
      }
    }
    return 'invest';
  });

  // User Auth & View state for Investor Website
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [depositInitialAmount, setDepositInitialAmount] = useState<string>('500');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);

  const handleOpenDepositWithAmount = (amount: number) => {
    setDepositInitialAmount(amount.toString());
    setIsDepositOpen(true);
  };

  // Crypto coins and market state
  const [coins, setCoins] = useState<CryptoCoin[]>(initialCoins);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>(initialCoins[0]);

  // Sync hash routing with currentSite
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('/admin')) {
        setCurrentSite('admin');
      } else if (hash.includes('/invest')) {
        setCurrentSite('invest');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchSite = (site: 'invest' | 'admin') => {
    setCurrentSite(site);
    if (typeof window !== 'undefined') {
      window.location.hash = site === 'admin' ? '#/admin' : '#/invest';
    }
  };

  // Subscribe to store updates for real-time reactivity
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const user = store.getCurrentUser();
      setCurrentUser(user ? { ...user } : null);
    });
    return () => unsubscribe();
  }, []);

  // Real-time crypto price ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          const deltaPct = (Math.random() - 0.49) * 0.4; // +/- 0.2%
          const newPrice = Math.max(0.0001, coin.price * (1 + deltaPct / 100));
          const newChange = coin.change24h + (deltaPct > 0 ? 0.05 : -0.05);

          const updatedCoin = {
            ...coin,
            price: newPrice,
            change24h: Number(newChange.toFixed(2)),
          };

          if (selectedCoin.symbol === coin.symbol) {
            setSelectedCoin(updatedCoin);
          }

          return updatedCoin;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedCoin.symbol]);

  const handleLoginSuccess = () => {
    setCurrentUser(store.getCurrentUser());
  };

  const handleLogout = () => {
    store.logoutUser();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const refreshUserData = () => {
    const user = store.getCurrentUser();
    if (user) {
      setCurrentUser({ ...user });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Portal Switcher Bar - Separate Website Routing Bar */}
      <div className="bg-slate-950/95 border-b border-slate-800/80 px-3 py-1.5 z-50 sticky top-0 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              {language === 'km' ? 'ជ្រើសរើសគេហទំព័រ៖' : 'Select Portal:'}
            </span>
            <div className="inline-flex p-0.5 rounded-xl bg-slate-900 border border-slate-800">
              {/* Button to Website 1: Investor App */}
              <button
                onClick={() => switchSite('invest')}
                className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                  currentSite === 'invest'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'គេហទំព័រវិនីយោគ (Investor Web)' : 'Investor Web (/) '}</span>
              </button>

              {/* Button to Website 2: Admin Panel */}
              <button
                onClick={() => switchSite('admin')}
                className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                  currentSite === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង Admin (Admin Portal)' : 'Admin Panel (/admin)'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden md:inline font-mono">
              {currentSite === 'admin' ? 'Route: /admin' : 'Route: /'}
            </span>
            <span className={`w-2 h-2 rounded-full ${currentSite === 'admin' ? 'bg-amber-400' : 'bg-blue-400'} animate-pulse`}></span>
          </div>
        </div>
      </div>

      {/* RENDER SELECTED WEBSITE */}
      {currentSite === 'admin' ? (
        /* ============================================================ */
        /* WEBSITE 2: STANDALONE ADMIN PANEL WEBSITE (/admin)           */
        /* ============================================================ */
        <div className="flex-1">
          <AdminPanel
            language={language}
            onLanguageChange={setLanguage}
            onSwitchToInvestApp={() => switchSite('invest')}
          />
        </div>
      ) : (
        /* ============================================================ */
        /* WEBSITE 1: STANDALONE INVESTOR CRYPTO WEBSITE (/)           */
        /* ============================================================ */
        <div className="flex-1 flex justify-center selection:bg-blue-600 selection:text-white relative">
          {/* Background ambient lighting */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"></div>
          </div>

          {/* User App Shell */}
          {!currentUser ? (
            /* Screen 1: Login Screen */
            <LoginModal
              language={language}
              onLanguageChange={setLanguage}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            /* Main Investor App Container */
            <div className="w-full max-w-md min-h-screen bg-[#0c1220] border-x border-slate-800/80 shadow-2xl relative flex flex-col">
              {/* Dynamic Screen View based on activeTab */}
              <div className="flex-1">
                {activeTab === 'home' && (
                  <HomeScreen
                    currentUser={currentUser}
                    coins={coins}
                    language={language}
                    onLanguageChange={setLanguage}
                    onOpenDeposit={() => setIsDepositOpen(true)}
                    onOpenDepositWithAmount={handleOpenDepositWithAmount}
                    onOpenWithdraw={() => setIsWithdrawOpen(true)}
                    onSelectCoin={(coin) => setSelectedCoin(coin)}
                    onNavigateToTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'market' && (
                  <MarketScreen
                    selectedCoin={selectedCoin}
                    onSelectCoin={setSelectedCoin}
                    allCoins={coins}
                    currentUser={currentUser}
                    language={language}
                  />
                )}

                {activeTab === 'wallet' && (
                  <WalletInvestScreen
                    currentUser={currentUser}
                    language={language}
                    onOpenDeposit={() => setIsDepositOpen(true)}
                    onOpenWithdraw={() => setIsWithdrawOpen(true)}
                    onRefreshUser={refreshUserData}
                  />
                )}

                {activeTab === 'support' && (
                  <SupportScreen
                    currentUser={currentUser}
                    language={language}
                  />
                )}

                {activeTab === 'account' && (
                  <AccountScreen
                    currentUser={currentUser}
                    language={language}
                    onOpenDeposit={() => setIsDepositOpen(true)}
                    onOpenWithdraw={() => setIsWithdrawOpen(true)}
                    onLogout={handleLogout}
                    onOpenSupport={() => setActiveTab('support')}
                  />
                )}
              </div>

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                language={language}
              />

              {/* Deposit Modal */}
              <DepositModal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                currentUser={currentUser}
                language={language}
                initialAmount={depositInitialAmount}
                onSuccess={refreshUserData}
              />

              {/* Withdraw Modal */}
              <WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                currentUser={currentUser}
                language={language}
                onSuccess={refreshUserData}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
