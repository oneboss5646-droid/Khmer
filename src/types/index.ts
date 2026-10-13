export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string; // for auth comparison
  balance: number; // Available USDT balance
  totalDeposited: number;
  totalWithdrawn: number;
  totalEarned: number;
  vipLevel: number; // 1 to 7
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  walletAddressTRC20?: string;
  walletAddressERC20?: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'investment_yield' | 'investment_principal' | 'admin_adjustment';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  username: string;
  type: TransactionType;
  amount: number;
  network?: 'TRC-20' | 'ERC-20';
  walletAddress?: string;
  txHash?: string;
  status: TransactionStatus;
  note?: string;
  createdAt: string;
  processedAt?: string;
}

export interface InvestmentPlan {
  id: string;
  title: string;
  days: number;
  dailyRate: number; // percentage, e.g., 1.0 = 1.00% daily
  minAmount: number;
  maxAmount: number;
  featured?: boolean;
}

export interface UserInvestment {
  id: string;
  userId: string;
  username: string;
  planId: string;
  planTitle: string;
  amount: number;
  dailyRate: number;
  durationDays: number;
  daysElapsed: number;
  totalEarned: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'redeemed';
  lastYieldClaimDate?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  role: 'user' | 'admin' | 'bot';
  text: string;
  timestamp: string;
}

export interface PlatformConfig {
  trc20Address: string;
  erc20Address: string;
  minDepositUSDT: number;
  minWithdrawUSDT: number;
  withdrawFeeUSDT: number;
  telegramSupport: string;
  onlineServiceHours: string;
}

export interface CryptoCoin {
  symbol: string;
  name: string;
  pair: string;
  price: number;
  change24h: number; // percentage
  high24h: number;
  low24h: number;
  volume24h: string;
  history: number[];
  iconBg: string;
}
