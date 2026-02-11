
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, GEMINI_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'DOUBLE JUMP',
        description: 'Jump again in mid-air. Essential for high obstacles.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'MAX LIFE UP',
        description: 'Permanently adds a heart slot and heals you.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'REPAIR KIT',
        description: 'Restores 1 Life point instantly.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMMORTALITY',
        description: 'Unlock Ability: Press Space/Tap to be invincible for 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, [hasDoubleJump, hasImmortality]);

    return (
        <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
             <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                 <h2 className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 font-cyber tracking-widest text-center">CYBER SHOP</h2>
                 <div className="flex items-center text-yellow-400 mb-6 md:mb-8">
                     <span className="text-base md:text-lg mr-2">CREDITS:</span>
                     <span className="text-xl md:text-2xl font-bold font-mono">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="bg-gray-900/80 border border-gray-700 p-4 md:p-6 rounded-xl flex flex-col items-center text-center hover:border-cyan-500 transition-colors">
                                 <div className="bg-gray-800 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                                     <Icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                                 </div>
                                 <h3 className="text-lg md:text-xl font-bold mb-2">{item.name}</h3>
                                 <p className="text-gray-400 text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center">{item.description}</p>
                                 <button 
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded font-bold w-full text-sm md:text-base ${canAfford ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                                 >
                                     {item.cost} GEMS
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                 >
                     RESUME MISSION <Play className="ml-2 w-5 h-5" fill="white" />
                 </button>
             </div>
        </div>
    );
};

const MobileControls: React.FC = () => {
    const { hasImmortality, isImmortalityActive } = useStore();
    
    const trigger = (name: string) => {
        window.dispatchEvent(new Event(`control-${name}`));
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-[60]">
            <div className="flex justify-between items-end w-full">
                {/* D-Pad Style Movement */}
                <div className="flex space-x-4">
                    <button 
                        onPointerDown={() => trigger('left')}
                        className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 bg-cyan-500/10 border-2 border-cyan-500/50 rounded-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-95 transition-all backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                    </button>
                    <button 
                        onPointerDown={() => trigger('right')}
                        className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 bg-cyan-500/10 border-2 border-cyan-500/50 rounded-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-95 transition-all backdrop-blur-sm"
                    >
                        <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center space-y-4">
                    {hasImmortality && (
                        <button 
                            onPointerDown={() => trigger('special')}
                            className={`pointer-events-auto w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border-2 ${isImmortalityActive ? 'bg-yellow-500 border-white animate-pulse shadow-[0_0_20px_gold]' : 'bg-purple-900/40 border-purple-500/50 active:bg-purple-500/60'}`}
                        >
                            <Shield className={`w-6 h-6 md:w-8 md:h-8 ${isImmortalityActive ? 'text-white' : 'text-purple-400'}`} fill={isImmortalityActive ? "white" : "none"} />
                        </button>
                    )}
                    <button 
                        onPointerDown={() => trigger('jump')}
                        className="pointer-events-auto w-20 h-20 md:w-24 md:h-24 bg-pink-500/10 border-2 border-pink-500/50 rounded-full flex items-center justify-center active:bg-pink-500/40 active:scale-90 transition-all backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,100,0.2)]"
                    >
                        <ArrowUp className="w-10 h-10 md:w-12 md:h-12 text-pink-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed } = useStore();
  const target = ['G', 'E', 'M', 'I', 'N', 'I'];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)] border border-white/10">
                <div className="relative w-full bg-gray-900">
                     <img 
                      src="https://www.gstatic.com/aistudio/starter-apps/gemini_runner/gemini_runner.png" 
                      alt="Gemini Runner Cover" 
                      className="w-full h-auto block"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050011] via-black/30 to-transparent"></div>
                     <div className="absolute inset-0 flex flex-col justify-end items-center p-6 pb-8 text-center z-10">
                        <button 
                          onClick={() => { audio.init(); startGame(); }}
                          className="w-full group relative px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xl rounded-xl hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:border-cyan-400 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative z-10 tracking-widest flex items-center justify-center">
                                {isMobile ? 'START MISSION' : 'INITIALIZE RUN'} <Play className="ml-2 w-5 h-5 fill-white" />
                            </span>
                        </button>

                        <p className="text-cyan-400/60 text-[10px] md:text-xs font-mono mt-3 tracking-wider uppercase">
                            {isMobile ? '[ ON-SCREEN CONTROLS ]' : '[ ARROWS TO MOVE / SPACE FOR SKILL ]'}
                        </p>
                     </div>
                </div>
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-sm overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] font-cyber text-center">GAME OVER</h1>
                <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-yellow-400 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5"/> LEVEL</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{level}</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-purple-400 text-sm md:text-base"><MapPin className="mr-2 w-4 h-4 md:w-5 md:h-5"/> DISTANCE</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{Math.floor(distance)} LY</div>
                    </div>
                     <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg flex items-center justify-between mt-2">
                        <div className="flex items-center text-white text-sm md:text-base">TOTAL SCORE</div>
                        <div className="text-2xl md:text-3xl font-bold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{score.toLocaleString()}</div>
                    </div>
                </div>
                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                    RUN AGAIN
                </button>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <Rocket className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                <h1 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500 mb-2 font-cyber text-center leading-tight">
                    MISSION COMPLETE
                </h1>
                <p className="text-cyan-300 text-sm md:text-2xl font-mono mb-8 tracking-widest text-center">
                    THE ANSWER TO THE UNIVERSE HAS BEEN FOUND
                </p>
                <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-black/60 p-6 rounded-xl border border-yellow-500/30">
                        <div className="text-xs md:text-sm text-gray-400 mb-1 tracking-wider">FINAL SCORE</div>
                        <div className="text-3xl md:text-4xl font-bold font-cyber text-yellow-400">{score.toLocaleString()}</div>
                    </div>
                </div>
                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] tracking-widest"
                >
                    RESTART MISSION
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50">
        {/* Top Bar - Adjusted for Mobile thumb clearance */}
        <div className="flex justify-between items-start w-full px-2">
            <div className="flex flex-col">
                <div className="text-2xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#00ffff] font-cyber">
                    {score.toLocaleString()}
                </div>
            </div>
            
            <div className="flex space-x-1 md:space-x-2">
                {[...Array(maxLives)].map((_, i) => (
                    <Heart 
                        key={i} 
                        className={`w-5 h-5 md:w-8 md:h-8 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800 fill-gray-800'} drop-shadow-[0_0_5px_#ff0054] transition-all`} 
                    />
                ))}
            </div>
        </div>
        
        {/* Level Indicator - Center */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs md:text-lg text-purple-300 font-bold tracking-wider font-mono bg-black/60 px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm">
            LVL {level}
        </div>

        {/* Gemini Collection Status */}
        <div className="absolute top-16 md:top-24 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-3">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = GEMINI_COLORS[idx];
                return (
                    <div 
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : 'rgba(55, 65, 81, 0.5)',
                            color: isCollected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(55, 65, 81, 0.5)',
                            boxShadow: isCollected ? `0 0 15px ${color}` : 'none',
                            backgroundColor: isCollected ? color : 'rgba(0, 0, 0, 0.7)'
                        }}
                        className={`w-7 h-9 md:w-10 md:h-12 flex items-center justify-center border-2 font-black text-sm md:text-xl font-cyber rounded-lg transform transition-all duration-300 ${isCollected ? 'scale-110' : 'scale-100'}`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        {/* Skill Active Indicator */}
        {isImmortalityActive && (
             <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-lg md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_gold]">
                 <Shield className="mr-2 fill-yellow-400 w-5 h-5 md:w-6 md:h-6" /> IMMORTAL
             </div>
        )}

        {/* Virtual Controls */}
        {isMobile && status === GameStatus.PLAYING && <MobileControls />}

        {/* Bottom Stats */}
        {!isMobile && (
            <div className="w-full flex justify-end items-end">
                <div className="flex items-center space-x-2 text-cyan-500 opacity-70">
                    <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                    <span className="font-mono text-base md:text-xl">SPEED {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
                </div>
            </div>
        )}
    </div>
  );
};
