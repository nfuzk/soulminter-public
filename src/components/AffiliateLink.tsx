import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';

export const AffiliateLink: FC = () => {
  const { publicKey } = useWallet();
  const [affiliateLink, setAffiliateLink] = useState<string>('');
  const [isAffiliated, setIsAffiliated] = useState<boolean>(false);

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (publicKey) {
        try {
          // Check if user is already affiliated
          const response = await fetch(`/api/affiliate/check/${publicKey.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setIsAffiliated(data.isAffiliated);
          }
          
          // Generate affiliate link
          const baseUrl = window.location.origin;
          const link = `${baseUrl}/create?ref=${publicKey.toString()}`;
          setAffiliateLink(link);
        } catch (error) {
          console.error('Error checking affiliate status:', error);
        }
      }
    };

    checkAffiliateStatus();
  }, [publicKey]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    notify({
      type: 'success',
      message: 'Affiliate link copied to clipboard!',
    });
  };

  if (!publicKey) {
    return null;
  }

  return (
    <div className="card bg-base-200 shadow-xl p-4">
      <div className="card-body">
        <h2 className="card-title">Your Affiliate Link</h2>
        {isAffiliated ? (
          <p className="text-warning">You are already affiliated with another wallet</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="input input-bordered flex-1"
              />
              <button onClick={copyToClipboard} className="btn btn-primary">
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this link to earn 50% commission on token creation fees
            </p>
          </>
        )}
      </div>
    </div>
  );
}; 