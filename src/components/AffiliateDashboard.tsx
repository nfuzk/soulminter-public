import { FC, useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardIcon, UserGroupIcon, CurrencyDollarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import styles from '../views/home/styles.module.css';

interface AffiliateStats {
  totalEarnings: number;
  totalReferrals: number;
  recentTransactions: Array<{
    timestamp: string;
    amount: number;
    userWallet: string;
  }>;
}

const initialStats: AffiliateStats = {
  totalEarnings: 0,
  totalReferrals: 0,
  recentTransactions: [],
};

export const AffiliateDashboard: FC = () => {
  const { publicKey } = useWallet();
  const [affiliateLink, setAffiliateLink] = useState<string>('');
  const [stats, setStats] = useState<AffiliateStats>(initialStats);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (publicKey) {
        setIsLoading(true);
        try {
          // Get affiliate data
          const response = await fetch(`/api/affiliate/${publicKey.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setStats({
              totalEarnings: data.totalEarnings || 0,
              totalReferrals: data.totalReferrals || 0,
              recentTransactions: data.recentTransactions || [],
            });
          }

          // Generate affiliate link
          const baseUrl = window.location.origin;
          const link = `${baseUrl}/create?ref=${publicKey.toString()}`;
          setAffiliateLink(link);
        } catch (error) {
          console.error('Error fetching affiliate data:', error);
          notify({
            type: 'error',
            message: 'Failed to load affiliate data',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset stats when wallet is disconnected
        setStats(initialStats);
        setAffiliateLink('');
        setIsLoading(false);
      }
    };

    fetchAffiliateData();
  }, [publicKey]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    notify({
      type: 'success',
      message: 'Affiliate link copied to clipboard!',
    });
  };

  const toggleHowItWorks = () => {
    setHowItWorksOpen(!howItWorksOpen);
    if (!howItWorksOpen && howItWorksRef.current) {
      setTimeout(() => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-[#1A2332] rounded-lg p-8 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your wallet to view your affiliate dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#1A2332] rounded-lg p-8 shadow-xl min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mb-4"></div>
          <p className="text-gray-400">Loading your affiliate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-8 mt-8">
        <h1 className={`${styles.title} text-3xl md:text-4xl font-extrabold mb-2`}>Affiliate Dashboard</h1>
        <p className="text-lg text-gray-300">Track your earnings, manage referrals, and grow your network</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#181F2C] rounded-lg shadow p-6 flex flex-col items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalEarnings} <span className="text-base text-gray-400">SOL</span></div>
          <div className="text-gray-400 mt-1">Total Earnings</div>
        </div>
        <div className="bg-[#181F2C] rounded-lg shadow p-6 flex flex-col items-center">
          <UserGroupIcon className="h-8 w-8 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalReferrals}</div>
          <div className="text-gray-400 mt-1">Total Referrals</div>
        </div>
        <div className="bg-[#181F2C] rounded-lg shadow p-6 flex flex-col items-center">
          <ClipboardIcon className="h-8 w-8 text-purple-400 mb-2 cursor-pointer" onClick={copyToClipboard} />
          <div className="text-xs text-gray-300 break-all mb-1">{affiliateLink}</div>
          <button
            className="mt-2 px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition"
            onClick={copyToClipboard}
          >
            Copy Affiliate Link
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#181F2C] rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-white flex-1">Recent Referrals</h2>
          <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-pointer" title="These are your most recent affiliate earnings." />
        </div>
        {stats.recentTransactions.length === 0 ? (
          <div className="text-gray-400 text-center">No recent affiliate transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Amount (SOL)</th>
                  <th className="py-2 px-2">User Wallet</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-[#232B3A] transition">
                    <td className="py-2 px-2">{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}</td>
                    <td className="py-2 px-2">{tx.amount}</td>
                    <td className="py-2 px-2">
                      <span className="font-mono text-xs bg-gray-800 rounded px-2 py-1 inline-block align-middle">
                        {tx.userWallet.slice(0, 4)}...{tx.userWallet.slice(-4)}
                      </span>
                      <button
                        className="ml-2 text-purple-400 hover:text-purple-300"
                        onClick={() => {
                          navigator.clipboard.writeText(tx.userWallet);
                          notify({ type: 'success', message: 'Wallet address copied!' });
                        }}
                        title="Copy wallet address"
                      >
                        <ClipboardIcon className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-[#181F2C] rounded-lg shadow p-6 mb-8">
        <button
          className="flex items-center text-purple-400 hover:text-purple-300 font-semibold mb-2 focus:outline-none"
          onClick={toggleHowItWorks}
        >
          <InformationCircleIcon className="h-5 w-5 mr-2" />
          How does the affiliate program work?
        </button>
        {howItWorksOpen && (
          <div ref={howItWorksRef} className="text-gray-300 mt-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>Share your affiliate link to invite others to create tokens.</li>
              <li>Earn a commission in SOL for every successful referral.</li>
              <li>Track your earnings and referrals in real time on this dashboard.</li>
              <li>Payouts are automatic and transparent on the Solana blockchain.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 