
import React, { useState } from 'react';

interface PaymentModalProps {
  price: number;
  onSuccess: () => void;
  onLogout: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ price, onSuccess, onLogout }) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 16 || expiry.length < 4 || cvc.length < 3) {
      setError('Please enter valid card details (Simulated).');
      return;
    }
    
    setProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  // Input formatters
  const formatCard = (val: string) => val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) => val.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="bg-indigo-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-1">Unlock Full Access</h2>
            <p className="opacity-90 text-sm">Join the elite marketing guild.</p>
        </div>
        
        <div className="p-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <span className="text-slate-600 font-medium">Lifetime Membership</span>
                <span className="text-2xl font-bold text-slate-800">${price}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        />
                        <i className="fa-regular fa-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="123"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-70 flex items-center justify-center"
                >
                    {processing ? (
                        <>
                           <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Processing...
                        </>
                    ) : (
                        `Pay $${price} Securely`
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={onLogout} className="text-slate-400 text-sm hover:text-slate-600">
                    Log out / Cancel
                </button>
                <div className="mt-4 flex justify-center items-center space-x-2 text-slate-300 text-xl">
                    <i className="fa-brands fa-cc-visa"></i>
                    <i className="fa-brands fa-cc-mastercard"></i>
                    <i className="fa-brands fa-cc-amex"></i>
                    <i className="fa-brands fa-stripe"></i>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
