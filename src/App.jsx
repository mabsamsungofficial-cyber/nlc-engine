import React, { useState, useEffect } from 'react';
import { Calculator, Percent, Layers, Box, Wallet, Copy, Check, Tag, Gift, Minus, Plus, IndianRupee, Star } from 'lucide-react';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [specialSupport, setSpecialSupport] = useState('');
  const [upgradeCb, setUpgradeCb] = useState('');
  const [series, setSeries] = useState('S'); 
  const [baseType, setBaseType] = useState('DP'); 
  const [schemePercent, setSchemePercent] = useState(6.5);
  const [kroPercent, setKroPercent] = useState(1.5);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, []);

  const rawInput = parseFloat(inputValue) || 0;
  const specialSupportValue = parseFloat(specialSupport) || 0;
  const upgradeCbValue = parseFloat(upgradeCb) || 0;
  const isMop = series === 'A' && baseType === 'MOP';
  const actualDp = isMop ? (rawInput / 1.04) : rawInput;
  const mopGap = isMop ? (rawInput - actualDp) : 0;

  const inbillMargin = Math.round(actualDp * 0.03);
  const purchaseRate = Math.round(actualDp - inbillMargin); 
  const monthlyBase = Math.max(0, actualDp - specialSupportValue); 
  const monthlyScheme = Math.round((monthlyBase / 1.18) * (schemePercent / 100));

  let kroScheme = 0;
  if (series === 'A') {
    kroScheme = Math.round((monthlyBase / 1.18) * (kroPercent / 100));
  }

  const nettMargin = Math.round(inbillMargin + monthlyScheme + kroScheme + mopGap);
  const netLanding = Math.round(rawInput - nettMargin - specialSupportValue - upgradeCbValue);

  const formatCurrency = (amount) => '₹' + amount.toLocaleString('en-IN');

  const handleCopy = () => {
    if (netLanding !== 0) {
      navigator.clipboard.writeText(netLanding.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const decreaseScheme = () => { if (schemePercent > 3.0) setSchemePercent(prev => parseFloat((prev - 0.5).toFixed(1))); };
  const increaseScheme = () => { if (schemePercent < 9.5) setSchemePercent(prev => parseFloat((prev + 0.5).toFixed(1))); };
  const decreaseKro = () => { if (kroPercent > 1.0) setKroPercent(prev => parseFloat((prev - 0.5).toFixed(1))); };
  const increaseKro = () => { if (kroPercent < 3.0) setKroPercent(prev => parseFloat((prev + 0.5).toFixed(1))); };

  return (
    <div className="min-h-[100dvh] w-full bg-[#05050A] flex justify-center py-6 px-3 sm:p-6 font-sans text-white relative overflow-y-auto overflow-x-hidden selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#030014]"></div>
      </div>

      <div className={`relative z-10 w-full max-w-[420px] my-auto rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 
        bg-white/[0.03] backdrop-blur-2xl 
        border border-white/10 border-t-white/20 border-l-white/10 border-b-black/40 border-r-black/40
        shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]
        transition-all duration-700 ease-out flex flex-col ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <div className="flex items-center justify-between mb-6 relative z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            <Calculator className="w-6 h-6 text-cyan-300" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">SAMSUNG</h1>
              <p className="text-white/50 text-[10px] sm:text-[11px] font-medium tracking-wide uppercase mt-0.5">NLC Calculator</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center mb-4">
          <span className="text-sm">Final NLC</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{formatCurrency(netLanding)}</span>
            <button onClick={handleCopy}>{copied ? <Check size={16}/> : <Copy size={16}/>}</button>
          </div>
        </div>

        <input type="number" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} placeholder="Dealer Price"
        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-3"/>

        <input type="number" value={specialSupport} onChange={(e)=>setSpecialSupport(e.target.value)} placeholder="Special Support"
        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-3"/>

        <input type="number" value={upgradeCb} onChange={(e)=>setUpgradeCb(e.target.value)} placeholder="Upgrade / CB"
        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-4"/>

        <div className="text-sm mb-2">Inbill (3%): {formatCurrency(inbillMargin)}</div>
        <div className="text-sm mb-2">Purchase Rate: {formatCurrency(purchaseRate)}</div>
        <div className="text-sm mb-2">Monthly Scheme: {formatCurrency(monthlyScheme)}</div>
        {series === 'A' && <div className="text-sm mb-2">KRO Scheme: {formatCurrency(kroScheme)}</div>}
        <div className="text-sm font-bold mt-2">Nett Margin: {formatCurrency(nettMargin)}</div>
      </div>
    </div>
  );
};

export default App;
