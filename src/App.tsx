import { useState, useMemo } from 'react';
import { 
  Box, 
  History, 
  Settings, 
  Plus, 
  ChevronRight,
  Shield,
  Zap,
  Download,
  Search,
  Filter,
  Trash2,
  Eye,
  RefreshCw,
  Upload as UploadIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Generation, User as UserType } from './types';

// Mock Data
const MOCK_GENERATIONS: Generation[] = [
  {
    id: '1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&h=200&auto=format&fit=crop',
    fullImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Modern apartment, warm evening light, wooden floors, plants in corner',
    createdAt: '2024-05-02T15:24:00Z',
    type: 'interior',
    creditCost: 1,
    dimensions: '4096x4096'
  },
  {
    id: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&h=200&auto=format&fit=crop',
    fullImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Scandinavian style house exterior with large glass windows',
    createdAt: '2024-05-01T10:15:00Z',
    type: 'exterior',
    creditCost: 1,
    dimensions: '4096x4096'
  },
];

const INITIAL_USER: UserType = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop',
  credits: 38,
  plan: 'basic'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'settings'>('generate');
  const [user, setUser] = useState<UserType>(INITIAL_USER);
  const [history, setHistory] = useState<Generation[]>(MOCK_GENERATIONS);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-snow border-b border-pebble/10 sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="font-sans text-2xl font-semibold tracking-tighter text-carbon leading-none">Plan3D</span>
          <span className="bg-[#242433] text-snow text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">PRO</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPricingModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-fog rounded-full border border-pebble/20 text-sm font-medium hover:bg-pebble/10 transition-colors"
          >
            <span className="text-carbon">{user.credits} credits</span>
            <div className="w-5 h-5 bg-tangerine-tag rounded-full flex items-center justify-center">
              <Plus className="w-3 h-3 text-snow" />
            </div>
          </button>
          
          <div className="relative group">
            <button className="w-8 h-8 rounded-full overflow-hidden border border-pebble/20">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-snow border-b border-pebble/10 px-6 flex gap-8">
        <button 
          onClick={() => setActiveTab('generate')}
          className={`nav-link ${activeTab === 'generate' ? 'active' : ''}`}
        >
          Generate
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
        >
          Settings
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'generate' && (
            <GenerateTab 
              key="generate" 
              user={user} 
              onBuyCredits={() => setIsPricingModalOpen(true)} 
              addHistory={(gen) => setHistory([gen, ...history])}
              spendCredits={(cost) => setUser({...user, credits: user.credits - cost})}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab key="history" history={history} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab key="settings" user={user} setUser={setUser} />
          )}
        </AnimatePresence>
      </main>

      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function GenerateTab({ user, onBuyCredits, addHistory, spendCredits }: { 
  user: UserType; 
  onBuyCredits: () => void; 
  addHistory: (gen: Generation) => void;
  spendCredits: (cost: number) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const presets = ['Modern', 'Cozy', 'Bright', 'Night', 'Sketchy'];

  const handleGenerate = async () => {
    if (!file || user.credits <= 0) return;
    
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const newGen: Generation = {
      id: Math.random().toString(36).substr(2, 9),
      thumbnailUrl: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=200&h=200&auto=format&fit=crop',
      fullImageUrl: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=1200&auto=format&fit=crop',
      prompt: prompt || 'Empty prompt',
      createdAt: new Date().toISOString(),
      type: 'interior',
      creditCost: 1,
      dimensions: '4096x4096'
    };
    
    setResult(newGen.fullImageUrl);
    addHistory(newGen);
    spendCredits(1);
    setIsGenerating(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6"
    >
      {/* Left Column - Controls */}
      <div className="space-y-6">
        <div className="card space-y-6">
          <h2 className="heading-display">Create Space</h2>
          
          <div>
            <label className="label-uppercase">Source Image</label>
            <div 
              className={`border border-dashed rounded-xl p-8 h-[160px] flex flex-col items-center justify-center gap-1 transition-colors text-center cursor-pointer bg-[#fafafa] ${file ? 'border-tangerine-tag' : 'border-pebble/40 hover:border-pebble/60'}`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? (
                <>
                  <div className="w-12 h-12 bg-snow rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] mt-1">
                    <p className="text-carbon font-medium">{file.name}</p>
                    <button className="text-tangerine-tag font-semibold hover:underline">Replace</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-1 text-pebble">⭯</div>
                  <p className="text-sm text-stone font-medium">Click or drag image here</p>
                  <p className="text-[10px] uppercase tracking-wider text-pebble">PNG, JPG, WebP (Max 10MB)</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="label-uppercase">Describe your vision</label>
            <textarea 
              className="w-full border border-pebble/20 rounded-xl p-4 text-sm font-sans min-h-[100px] resize-none focus:border-carbon focus:outline-none transition-colors"
              placeholder="e.g., 'modern apartment, warm evening light, wooden floors, plants in corner'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-pebble uppercase tracking-widest">{prompt.length} / 500 characters</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button 
                key={p}
                onClick={() => setPrompt(prev => prev ? `${prev}, ${p.toLowerCase()}` : p)}
                className="px-3 py-1.5 rounded-full bg-fog text-[12px] text-graphite font-medium hover:bg-pebble/20 transition-all"
              >
                + {p}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-pebble/10">
            <button 
              disabled={!file || user.credits <= 0 || isGenerating}
              onClick={handleGenerate}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed !h-14"
            >
              {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Generate (1 credit)'}
            </button>
            <div className="text-center">
              <span className="text-[12px] text-stone">
                You have {user.credits} credits remaining. {' '}
                <button onClick={onBuyCredits} className="font-semibold text-tangerine-tag hover:underline">Buy more</button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Results */}
      <div className="card !p-3">
        <div className="bg-[#fcfcfc] rounded-2xl border border-pebble/5 h-[500px] lg:h-full flex flex-col items-center justify-center relative overflow-hidden">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-tangerine-tag animate-spin" />
              <p className="text-sm font-medium text-stone">Rendering isometric 3D...</p>
            </div>
          ) : result ? (
            <img src={result} className="w-full h-full object-cover" />
          ) : (
             <div className="flex flex-col items-center text-center p-12">
                <svg width="100%" height="200" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f3f4f6" rx="16"/><path d="M200 80L320 140L200 200L80 140L200 80Z" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/><path d="M80 140V220L200 280V200L80 140Z" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/><path d="M320 140V220L200 280V200L320 140Z" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/><text x="200" y="150" font-family="Inter" font-size="12" text-anchor="middle" fill="#9ca3af">PREVIEW RENDERING</text></svg>
                <p className="text-sm text-pebble mt-4">Isometric preview will appear here</p>
             </div>
          )}
        </div>
        {result && !isGenerating && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex gap-3">
              <button className="btn-download px-6 !h-10 text-sm">Download 4K PNG</button>
              <button className="btn-secondary px-6 !h-10 text-sm">Regenerate</button>
            </div>
            <span className="text-[11px] font-bold text-pebble uppercase tracking-widest">ID: #P3D-88219</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HistoryTab({ history }: { history: Generation[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="heading-display !mb-1">Generation History</h1>
        <p className="text-stone">Your previous isometric creations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map(gen => (
          <div key={gen.id} className="card !p-0 overflow-hidden group">
            <div className="aspect-square bg-fog relative overflow-hidden">
              <img src={gen.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] text-pebble font-bold uppercase tracking-widest">May 2, 2026</p>
                <p className="text-sm font-medium text-carbon line-clamp-2 leading-snug">{gen.prompt}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-pebble/10 text-stone">
                <span className="text-[10px] font-bold uppercase tracking-widest">{gen.creditCost} Token</span>
                <div className="flex gap-3">
                  <Download className="w-4 h-4 cursor-pointer hover:text-carbon" />
                  <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsTab({ user, setUser }: { user: UserType; setUser: (u: UserType) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'billing' | 'credits'>('profile');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12"
    >
      <div className="space-y-1">
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeSubTab === 'profile' ? 'bg-snow text-carbon shadow-sm border border-pebble/10' : 'text-stone hover:text-carbon'}`}
        >
          Profile Settings
        </button>
        <button 
          onClick={() => setActiveSubTab('billing')}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeSubTab === 'billing' ? 'bg-snow text-carbon shadow-sm border border-pebble/10' : 'text-stone hover:text-carbon'}`}
        >
          Billing & Payment
        </button>
        <button 
          onClick={() => setActiveSubTab('credits')}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeSubTab === 'credits' ? 'bg-snow text-carbon shadow-sm border border-pebble/10' : 'text-stone hover:text-carbon'}`}
        >
          Credits & Usage
        </button>
      </div>

      <div className="max-w-2xl space-y-10">
        {activeSubTab === 'profile' && (
          <section className="space-y-8">
            <h2 className="heading-display !mb-2">Profile Settings</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-tangerine-tag shadow-lg">
                <img src={user.avatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <button className="text-xs font-bold text-tangerine-tag uppercase tracking-widest">Change Avatar</button>
                <p className="text-xs text-pebble mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="label-uppercase">Account Name</label>
                <input type="text" value={user.name} className="input-field" onChange={(e) => setUser({...user, name: e.target.value})} />
              </div>
              <div>
                <label className="label-uppercase">Email Address</label>
                <p className="text-sm font-medium py-3 text-stone">{user.email}</p>
              </div>
              <button className="btn-primary !h-12 !px-10">Save Profile</button>
            </div>
          </section>
        )}

        {activeSubTab === 'billing' && (
           <section className="space-y-8">
              <h2 className="heading-display !mb-2">Billing & Payment</h2>
              <div className="card !bg-carbon text-snow flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone mb-1">Active Plan</p>
                  <p className="text-xl font-medium tracking-tight">Basic Plan — $25/mo</p>
                </div>
                <button className="text-xs font-bold text-tangerine-tag uppercase tracking-widest">Upgrade</button>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone">Payment Method</h3>
                <div className="card !p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-6 bg-fog rounded flex items-center justify-center font-bold text-[8px] italic border">VISA</div>
                    <p className="text-sm font-medium">Ending in 4242</p>
                  </div>
                  <button className="text-xs font-bold text-carbon uppercase tracking-widest">Edit</button>
                </div>
              </div>
           </section>
        )}

        {activeSubTab === 'credits' && (
           <section className="space-y-8">
              <h2 className="heading-display !mb-2">Credits & Usage</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="card flex flex-col justify-between">
                  <span className="label-uppercase">Available</span>
                  <div className="flex items-end gap-2 mt-4">
                    <span className="text-5xl font-light leading-none">{user.credits}</span>
                    <span className="text-xs font-bold text-pebble uppercase mb-1 tracking-widest">Tokens</span>
                  </div>
                </div>
                <div className="card flex flex-col justify-between">
                   <span className="label-uppercase">Used (Month)</span>
                   <div className="mt-4">
                     <span className="text-5xl font-light leading-none">12</span>
                   </div>
                </div>
              </div>
              <button className="btn-primary w-full !h-14">Buy More Credits</button>
           </section>
        )}
      </div>
    </motion.div>
  );
}

function PricingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'packs' | 'subs'>('packs');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-carbon/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-fog rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-3xl border border-pebble/10"
          >
            <div className="p-8 md:p-12 text-center space-y-12 overflow-y-auto">
              <div className="space-y-2">
                <h2 className="text-4xl font-light tracking-tight">Catalyze Your Design</h2>
                <p className="text-stone">Select a computational protocol for your spatial renders.</p>
              </div>

              <div className="inline-flex bg-snow border border-pebble/10 p-1.5 rounded-2xl shadow-sm">
                <button 
                  onClick={() => setTab('packs')}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'packs' ? 'bg-carbon text-snow' : 'text-pebble'}`}
                >
                  Packs
                </button>
                <button 
                  onClick={() => setTab('subs')}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'subs' ? 'bg-carbon text-snow' : 'text-pebble'}`}
                >
                  Subscriptions
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tab === 'packs' ? (
                  <>
                    <PriceCard title="Starter" credits={10} price={10} description="Initial exploration" />
                    <PriceCard title="Pro Studio" credits={25} price={20} description="Our most popular focus" featured />
                    <PriceCard title="Bulk" credits={80} price={50} description="Volume production" />
                  </>
                ) : (
                  <>
                    <PriceCard title="Basic" credits={50} price={25} description="Monthly spatial cycle" label="/mo" />
                    <PriceCard title="Elite" credits={140} price={49} description="Priority renders" label="/mo" featured />
                    <PriceCard title="Infinity" credits={1200} price={399} description="Global enterprise" label="/mo" />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PriceCard({ title, credits, price, description, featured, label = '' }: {
  title: string;
  credits: number;
  price: number;
  description: string;
  featured?: boolean;
  label?: string;
}) {
  return (
    <div className={`card relative flex flex-col text-left p-8 transition-all ${featured ? 'bg-snow border-2 border-carbon scale-105 z-10' : 'bg-snow/60 border border-pebble/10'}`}>
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-carbon text-snow text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Recommended</span>
      )}
      <div className="space-y-6 flex-1">
        <div>
          <h4 className="text-xl mb-1 uppercase tracking-tight font-medium">{title}</h4>
          <p className="text-[10px] text-pebble font-bold uppercase tracking-widest">{description}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-light leading-none">${price}</span>
          <span className="text-sm font-bold text-pebble uppercase tracking-widest">{label}</span>
        </div>
        <div className="pt-6 space-y-4 font-sans">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <ChevronRight className="w-4 h-4 text-tangerine-tag" />
            {credits} Computational Tokens
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-pebble pl-7">4K High-Res Renders</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-pebble pl-7">Standard Tech Support</p>
        </div>
      </div>
      <button className={`w-full mt-10 btn-primary !h-12 !text-sm uppercase tracking-widest font-bold ${!featured ? '!bg-carbon !text-snow' : ''}`}>
        Activate Protocol
      </button>
    </div>
  );
}
