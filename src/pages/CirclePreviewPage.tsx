import { useState, useEffect } from "react";

// Variation 1: Aurora Glow - Multiple layered glows with color shifts
const AuroraCircle = ({ scale }: { scale: number }) => (
  <div className="relative w-48 h-48">
    {/* Outer aurora glow layers */}
    <div 
      className="absolute inset-0 rounded-full blur-3xl opacity-60 animate-pulse"
      style={{
        background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)',
        transform: `scale(${1.3 + scale * 0.2})`,
      }}
    />
    <div 
      className="absolute inset-0 rounded-full blur-2xl opacity-50"
      style={{
        background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(147,51,234,0.2) 60%, transparent 80%)',
        transform: `scale(${1.2 + scale * 0.15})`,
        animation: 'spin 8s linear infinite',
      }}
    />
    {/* Main circle */}
    <div 
      className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out"
      style={{
        transform: `scale(${0.5 + scale * 0.5})`,
        background: 'linear-gradient(135deg, rgba(147,51,234,0.6) 0%, rgba(59,130,246,0.5) 50%, rgba(236,72,153,0.4) 100%)',
        boxShadow: `
          0 0 40px rgba(147,51,234,0.5),
          0 0 80px rgba(59,130,246,0.3),
          inset 0 0 60px rgba(255,255,255,0.2)
        `,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div 
          className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, rgba(147,51,234,0.2), transparent)',
            animation: 'spin 6s linear infinite',
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-lg">Aurora</span>
      </div>
    </div>
  </div>
);

// Variation 2: Ocean Depth - Deep blues with wave-like motion
const OceanCircle = ({ scale }: { scale: number }) => (
  <div className="relative w-48 h-48">
    {/* Ripple effects */}
    <div 
      className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
      style={{
        transform: `scale(${1.1 + scale * 0.3})`,
        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }}
    />
    <div 
      className="absolute inset-0 rounded-full border border-blue-400/20"
      style={{
        transform: `scale(${1.2 + scale * 0.4})`,
        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s',
      }}
    />
    {/* Main circle */}
    <div 
      className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out overflow-hidden"
      style={{
        transform: `scale(${0.5 + scale * 0.5})`,
        background: 'linear-gradient(180deg, rgba(6,182,212,0.7) 0%, rgba(37,99,235,0.8) 50%, rgba(30,58,138,0.9) 100%)',
        boxShadow: `
          0 0 30px rgba(6,182,212,0.4),
          0 0 60px rgba(37,99,235,0.3),
          inset 0 -20px 40px rgba(30,58,138,0.5)
        `,
      }}
    >
      {/* Wave layers */}
      <div 
        className="absolute w-[150%] h-[50%] -left-[25%] rounded-[40%]"
        style={{
          bottom: '60%',
          background: 'rgba(255,255,255,0.15)',
          animation: 'wave 3s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute w-[150%] h-[50%] -left-[25%] rounded-[45%]"
        style={{
          bottom: '55%',
          background: 'rgba(6,182,212,0.2)',
          animation: 'wave 4s ease-in-out infinite reverse',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-lg">Ocean</span>
      </div>
    </div>
  </div>
);

// Variation 3: Nebula - Space-like with particle effects
const NebulaCircle = ({ scale }: { scale: number }) => (
  <div className="relative w-48 h-48">
    {/* Outer nebula glow */}
    <div 
      className="absolute inset-[-20%] rounded-full blur-2xl"
      style={{
        background: 'radial-gradient(ellipse at 30% 30%, rgba(192,38,211,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.4) 0%, transparent 50%)',
        transform: `scale(${1 + scale * 0.3})`,
      }}
    />
    {/* Main circle */}
    <div 
      className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out overflow-hidden"
      style={{
        transform: `scale(${0.5 + scale * 0.5})`,
        background: 'radial-gradient(circle at 30% 30%, rgba(192,38,211,0.8) 0%, rgba(88,28,135,0.6) 40%, rgba(30,27,75,0.9) 100%)',
        boxShadow: `
          0 0 50px rgba(192,38,211,0.5),
          0 0 100px rgba(59,130,246,0.3),
          inset 0 0 30px rgba(255,255,255,0.1)
        `,
      }}
    >
      {/* Star particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            opacity: 0.3 + Math.random() * 0.7,
            animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
          }}
        />
      ))}
      {/* Swirling nebula gas */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(147,51,234,0.3), transparent, rgba(59,130,246,0.2), transparent)',
          animation: 'spin 10s linear infinite',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-lg">Nebula</span>
      </div>
    </div>
  </div>
);

// Variation 4: Zen Garden - Soft, minimal with subtle gradients
const ZenCircle = ({ scale }: { scale: number }) => (
  <div className="relative w-48 h-48">
    {/* Soft outer glow */}
    <div 
      className="absolute inset-[-10%] rounded-full blur-xl opacity-40"
      style={{
        background: 'radial-gradient(circle, rgba(134,239,172,0.5) 0%, rgba(34,197,94,0.3) 50%, transparent 70%)',
        transform: `scale(${1 + scale * 0.2})`,
      }}
    />
    {/* Main circle */}
    <div 
      className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out"
      style={{
        transform: `scale(${0.5 + scale * 0.5})`,
        background: 'linear-gradient(145deg, rgba(134,239,172,0.4) 0%, rgba(34,197,94,0.5) 50%, rgba(22,163,74,0.6) 100%)',
        boxShadow: `
          0 0 40px rgba(34,197,94,0.3),
          inset 0 0 40px rgba(255,255,255,0.2),
          inset 0 20px 40px rgba(134,239,172,0.3)
        `,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(134,239,172,0.3)',
      }}
    >
      {/* Subtle inner highlight */}
      <div 
        className="absolute top-[10%] left-[15%] w-[40%] h-[30%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-lg">Zen</span>
      </div>
    </div>
  </div>
);

// Variation 5: Plasma - Electric with animated gradients
const PlasmaCircle = ({ scale }: { scale: number }) => (
  <div className="relative w-48 h-48">
    {/* Electric outer glow */}
    <div 
      className="absolute inset-[-15%] rounded-full blur-2xl"
      style={{
        background: 'conic-gradient(from 0deg, rgba(250,204,21,0.4), rgba(249,115,22,0.4), rgba(239,68,68,0.4), rgba(250,204,21,0.4))',
        transform: `scale(${1.1 + scale * 0.2})`,
        animation: 'spin 4s linear infinite',
      }}
    />
    {/* Main circle */}
    <div 
      className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out overflow-hidden"
      style={{
        transform: `scale(${0.5 + scale * 0.5})`,
        background: 'linear-gradient(135deg, rgba(250,204,21,0.7) 0%, rgba(249,115,22,0.7) 50%, rgba(239,68,68,0.7) 100%)',
        boxShadow: `
          0 0 40px rgba(250,204,21,0.5),
          0 0 80px rgba(249,115,22,0.3),
          inset 0 0 30px rgba(255,255,255,0.3)
        `,
      }}
    >
      {/* Plasma waves */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 40%)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, transparent 0%, rgba(255,255,255,0.3) 10%, transparent 20%)',
          animation: 'spin 2s linear infinite',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-lg">Plasma</span>
      </div>
    </div>
  </div>
);

// Variation 6: Crystal - Glass-like with refraction effects
const CrystalCircle = ({ scale }: { scale: number }) => (
  <div className="relative w-48 h-48">
    {/* Prismatic glow */}
    <div 
      className="absolute inset-[-5%] rounded-full blur-xl opacity-50"
      style={{
        background: 'conic-gradient(from 45deg, rgba(239,68,68,0.3), rgba(250,204,21,0.3), rgba(34,197,94,0.3), rgba(59,130,246,0.3), rgba(147,51,234,0.3), rgba(239,68,68,0.3))',
        transform: `scale(${1 + scale * 0.2})`,
      }}
    />
    {/* Main circle */}
    <div 
      className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out overflow-hidden"
      style={{
        transform: `scale(${0.5 + scale * 0.5})`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(200,200,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
        boxShadow: `
          0 0 30px rgba(255,255,255,0.3),
          inset 0 0 40px rgba(255,255,255,0.4),
          inset -10px -10px 30px rgba(200,200,255,0.2)
        `,
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
    >
      {/* Refraction lines */}
      <div 
        className="absolute top-[20%] left-[10%] w-[60%] h-[2px] rotate-[-30deg]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        }}
      />
      <div 
        className="absolute top-[35%] left-[20%] w-[40%] h-[1px] rotate-[-25deg]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />
      {/* Rainbow refraction */}
      <div 
        className="absolute bottom-[20%] right-[15%] w-[50%] h-[3px] rotate-[20deg]"
        style={{
          background: 'linear-gradient(90deg, rgba(239,68,68,0.4), rgba(250,204,21,0.4), rgba(34,197,94,0.4), rgba(59,130,246,0.4))',
          filter: 'blur(2px)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg drop-shadow-lg">Crystal</span>
      </div>
    </div>
  </div>
);

const CirclePreviewPage = () => {
  const [scale, setScale] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setScale(prev => {
        // Create a breathing-like sine wave
        const newScale = (Math.sin(Date.now() / 2000) + 1) / 2;
        return newScale;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(-25%) rotate(0deg); }
          50% { transform: translateX(0%) rotate(2deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Breathing Circle Previews</h1>
          <p className="text-slate-400 mb-4">Click to toggle animation</p>
          <button 
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            {isAnimating ? 'Pause Animation' : 'Resume Animation'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
          <div className="flex flex-col items-center gap-4">
            <AuroraCircle scale={scale} />
            <p className="text-white/70 text-sm text-center max-w-[200px]">
              Layered purple/pink aurora with rotating conic gradient
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <OceanCircle scale={scale} />
            <p className="text-white/70 text-sm text-center max-w-[200px]">
              Deep ocean blues with wave animation and ripple effects
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <NebulaCircle scale={scale} />
            <p className="text-white/70 text-sm text-center max-w-[200px]">
              Space nebula with twinkling stars and swirling gas
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <ZenCircle scale={scale} />
            <p className="text-white/70 text-sm text-center max-w-[200px]">
              Minimal green zen style with soft glows and subtle highlights
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <PlasmaCircle scale={scale} />
            <p className="text-white/70 text-sm text-center max-w-[200px]">
              Electric plasma with rotating warm gradient glow
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <CrystalCircle scale={scale} />
            <p className="text-white/70 text-sm text-center max-w-[200px]">
              Glass-like crystal with prismatic refraction effects
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white/5 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Design Techniques Used:</h2>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• <strong>Layered blur effects</strong> - Multiple divs with blur-xl/2xl/3xl for depth</li>
            <li>• <strong>Radial & conic gradients</strong> - For glow and spinning effects</li>
            <li>• <strong>Box shadows</strong> - Outer glow + inset shadows for 3D depth</li>
            <li>• <strong>Backdrop blur</strong> - Glass/frosted effect on main circle</li>
            <li>• <strong>CSS animations</strong> - spin, wave, twinkle for organic movement</li>
            <li>• <strong>Multiple glow layers</strong> - Outer halo at different scales</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CirclePreviewPage;
