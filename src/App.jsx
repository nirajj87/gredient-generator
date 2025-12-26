import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import chroma from 'chroma-js';
import copy from 'copy-to-clipboard';
import { FiCopy, FiRefreshCw, FiSettings, FiGrid, FiList, FiEye, FiDownload, FiLock, FiUnlock, FiHeart, FiShare2, FiInfo, FiStar, FiFilter, FiSave } from "react-icons/fi";
import { FaRandom, FaPalette, FaPaintBrush, FaMagic, FaSwatchbook, FaEyeDropper, FaExpand, FaCompress } from "react-icons/fa";
import { MdGradient, MdColorLens, MdContrast, MdAccessibility } from "react-icons/md";
import { GiPaintBrush, GiPalette } from "react-icons/gi";

function App() {
  const [num, setNum] = useState(20);
  const [type, setType] = useState("linear");
  const [gradients, setGradients] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [gradientSize, setGradientSize] = useState("medium");
  const [lockedColors, setLockedColors] = useState({});
  const [showControls, setShowControls] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0);
  const [selectedMood, setSelectedMood] = useState("random");
  const [showColorInfo, setShowColorInfo] = useState(false);
  const [gradientDirection, setGradientDirection] = useState(135);
  const [colorMode, setColorMode] = useState("hex");
  const [savedGradients, setSavedGradients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const canvasRef = useRef(null);
  const gradientRefs = useRef([]);

  // Mood-based gradient presets
  const moodPresets = {
    random: "🎲 Random",
    calm: "😌 Calm",
    energetic: "⚡ Energetic",
    professional: "💼 Professional",
    nature: "🌿 Nature",
    sunset: "🌅 Sunset",
    ocean: "🌊 Ocean",
    vibrant: "🌈 Vibrant",
    pastel: "🎀 Pastel",
    dark: "🌙 Dark",
    neon: "🔆 Neon",
    earth: "🌎 Earth"
  };

  // Mood color combinations
  const moodColors = {
    calm: ['#8BC6EC', '#9599E2'],
    energetic: ['#FF9A9E', '#FAD0C4'],
    professional: ['#4A569D', '#DC2424'],
    nature: ['#134E5E', '#71B280'],
    sunset: ['#FF5F6D', '#FFC371'],
    ocean: ['#2193B0', '#6DD5ED'],
    vibrant: ['#FF0080', '#FF8C00'],
    pastel: ['#FFDEE9', '#B5FFFC'],
    dark: ['#0F2027', '#203A43'],
    neon: ['#00F260', '#0575E6'],
    earth: ['#8B7355', '#228B22']
  };

  const getHexColorCode = (lockedColor = null) => {
    if (lockedColor) return lockedColor;
    
    // Use chroma.js for better color generation
    if (selectedMood !== "random" && moodColors[selectedMood]) {
      const colors = moodColors[selectedMood];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    return chroma.random().hex();
  };

  const generateAdvancedGradient = (index = null) => {
    const generateSingle = (i) => {
      const lockedPair = lockedColors[i];
      
      let color1, color2;
      
      if (lockedPair) {
        color1 = lockedPair[0];
        color2 = lockedPair[1];
      } else if (selectedMood !== "random" && moodColors[selectedMood]) {
        [color1, color2] = moodColors[selectedMood];
      } else {
        // Generate perceptually pleasing gradient with chroma.js
        const baseColor = chroma.random();
        const colorMode = Math.random() > 0.5 ? 'complementary' : 'analogous';
        
        if (colorMode === 'complementary') {
          color1 = baseColor.hex();
          color2 = baseColor.set('hsl.h', '+180').hex();
        } else {
          color1 = baseColor.hex();
          color2 = baseColor.set('hsl.h', '+30').hex();
        }
        
        // Adjust for better contrast
        if (chroma.contrast(color1, color2) < 2) {
          color2 = baseColor.set('hsl.l', '-0.3').hex();
        }
      }

      const degree = gradientDirection;
      const gradient = type === "linear" 
        ? `linear-gradient(${degree}deg, ${color1}, ${color2})`
        : `radial-gradient(circle at center, ${color1}, ${color2})`;

      // Generate color palette
      const palette = chroma.scale([color1, color2]).mode('lch').colors(5);
      
      // Check accessibility
      const contrast = chroma.contrast(color1, color2);
      
      return {
        id: Date.now() + i,
        gradient,
        css: `background: ${gradient};`,
        cssAdvanced: `
background: ${gradient};
background: -webkit-${gradient};
background: -moz-${gradient};
background: -o-${gradient};`,
        colors: [color1, color2],
        degree,
        palette,
        contrast: contrast.toFixed(2),
        accessible: contrast > 4.5,
        luminance1: chroma(color1).luminance().toFixed(2),
        luminance2: chroma(color2).luminance().toFixed(2),
        hex: [color1, color2],
        rgb: [chroma(color1).rgb(), chroma(color2).rgb()],
        hsl: [chroma(color1).hsl(), chroma(color2).hsl()],
        isFavorite: favorites.includes(`${color1}-${color2}`),
        locked: !!lockedColors[i],
        mood: selectedMood,
        timestamp: Date.now()
      };
    };

    if (index !== null) {
      // Regenerate single gradient
      const newGradients = [...gradients];
      newGradients[index] = generateSingle(index);
      setGradients(newGradients);
    } else {
      // Generate all gradients
      const colors = [];
      for (let i = 0; i < num; i++) {
        colors.push(generateSingle(i));
      }
      setGradients(colors);
    }
  };

  const onCopy = (css, gradient) => {
    const textToCopy = colorMode === "hex" 
      ? css 
      : `/* CSS Gradient */
${css}
/* Colors: ${gradient.hex[0]} → ${gradient.hex[1]} */
/* Contrast Ratio: ${gradient.contrast}:1 ${gradient.accessible ? '✅ Accessible' : '⚠️ Low Contrast'} */`;
    
    copy(textToCopy);
    
    toast.success(
      <div>
        <div className="font-bold">🎨 Gradient Copied!</div>
        <div className="text-sm opacity-80">Contrast: {gradient.contrast}:1</div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        icon: "📋"
      }
    );
  };

  const toggleFavorite = (gradient) => {
    const key = `${gradient.colors[0]}-${gradient.colors[1]}`;
    if (favorites.includes(key)) {
      setFavorites(favorites.filter(fav => fav !== key));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, key]);
      toast.success(
        <div>
          <div>💖 Added to favorites!</div>
          <div className="text-xs">Click View Favorites to see all</div>
        </div>
      );
    }
  };

  const toggleLock = (index) => {
    setLockedColors(prev => ({
      ...prev,
      [index]: prev[index] ? null : gradients[index].colors
    }));
    
    toast.info(
      lockedColors[index] 
        ? "🔓 Colors unlocked" 
        : "🔒 Colors locked - they won't change on regenerate"
    );
  };

  const downloadGradient = async (gradient, index) => {
    try {
      // Create a temporary div for capturing
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '800px';
      tempDiv.style.height = '600px';
      tempDiv.style.background = gradient.gradient;
      tempDiv.style.borderRadius = '30px';
      tempDiv.style.padding = '40px';
      tempDiv.style.boxSizing = 'border-box';
      
      // Add gradient info
      tempDiv.innerHTML = `
        <div style="color: ${chroma(gradient.colors[0]).luminance() > 0.5 ? '#000' : '#fff'}; font-family: Arial, sans-serif;">
          <h1 style="font-size: 48px; margin: 0 0 20px 0;">Gradient #${index + 1}</h1>
          <div style="display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <h3 style="margin: 0 0 10px 0;">Colors</h3>
              <div>${gradient.hex[0]} → ${gradient.hex[1]}</div>
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 10px 0;">Contrast</h3>
              <div>${gradient.contrast}:1 ${gradient.accessible ? '✅' : '⚠️'}</div>
            </div>
          </div>
          <div style="font-size: 14px; opacity: 0.8;">
            Generated with Gradient Studio • ${new Date().toLocaleDateString()}
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          clonedDoc.body.style.background = gradient.gradient;
        }
      });
      
      document.body.removeChild(tempDiv);
      
      const link = document.createElement('a');
      link.download = `gradient-${index + 1}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(
        <div>
          <div>📸 Gradient Image Downloaded!</div>
          <div className="text-xs">Saved as {link.download}</div>
        </div>
      );
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download image");
    }
  };

  const shareGradient = (gradient) => {
    const text = `🎨 Beautiful Gradient from Gradient Studio:
${gradient.hex[0]} → ${gradient.hex[1]}
Contrast: ${gradient.contrast}:1 ${gradient.accessible ? '✅ Accessible' : '⚠️'}
Generate your own at: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Gradient Studio',
        text: text,
        url: window.location.href
      });
    } else {
      copy(text);
      toast.info("📋 Gradient details copied to clipboard!");
    }
  };

  const applyGradientToBackground = (gradient) => {
    document.body.style.background = gradient.gradient;
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    
    toast.success(
      <div>
        <div>🌅 Applied as background!</div>
        <div className="text-xs">Refresh page to reset</div>
      </div>
    );
  };

  const saveGradient = (gradient) => {
    const saved = [...savedGradients];
    if (!saved.find(g => g.id === gradient.id)) {
      saved.push({...gradient, savedAt: Date.now()});
      setSavedGradients(saved);
      localStorage.setItem('savedGradients', JSON.stringify(saved));
      toast.success("💾 Gradient saved to library!");
    } else {
      toast.info("Already saved");
    }
  };

  const analyzeGradient = (gradient) => {
    const analysis = `
🎨 Gradient Analysis:
────────────────────
Colors: ${gradient.hex[0]} → ${gradient.hex[1]}
Contrast: ${gradient.contrast}:1 ${gradient.accessible ? '✅ WCAG Compliant' : '⚠️ Low Contrast'}
Brightness: ${gradient.luminance1} → ${gradient.luminance2}
Mood: ${moodPresets[gradient.mood] || 'Random'}
Type: ${type} ${type === 'linear' ? `(${gradient.degree}°)` : ''}
────────────────────
CSS:
${gradient.css}
    `;
    
    copy(analysis);
    toast.info("📊 Analysis copied to clipboard!");
  };

  const getGradientSizeClass = () => {
    switch(gradientSize) {
      case 'small': return 'h-40';
      case 'medium': return 'h-56';
      case 'large': return 'h-72';
      default: return 'h-56';
    }
  };

  // Filter gradients based on search
  const filteredGradients = gradients.filter(gradient => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      gradient.hex[0].toLowerCase().includes(searchLower) ||
      gradient.hex[1].toLowerCase().includes(searchLower) ||
      gradient.contrast.includes(searchTerm) ||
      (gradient.accessible && 'accessible'.includes(searchLower)) ||
      (gradient.mood && gradient.mood.includes(searchLower))
    );
  });

  // Initialize with saved gradients
  useEffect(() => {
    const saved = localStorage.getItem('savedGradients');
    if (saved) {
      setSavedGradients(JSON.parse(saved));
    }
    generateAdvancedGradient();
  }, [num, type, selectedMood, gradientDirection]);

  // Auto-animation effect
  useEffect(() => {
    if (animationSpeed > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * gradients.length);
        if (!lockedColors[randomIndex]) {
          generateAdvancedGradient(randomIndex);
        }
      }, 3000 / animationSpeed);
      
      return () => clearInterval(interval);
    }
  }, [animationSpeed, gradients.length, lockedColors]);

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${previewMode ? 'p-0' : 'py-8'}`}>
      <canvas ref={canvasRef} width="800" height="600" className="hidden" />
      
      {!previewMode ? (
        <div className="w-11/12 mx-auto space-y-6">
          {/* Enhanced Header */}
          <div className="relative p-8 rounded-3xl shadow-2xl overflow-hidden group">
            <div 
              className="absolute inset-0 transition-all duration-1000 group-hover:scale-105"
              style={{ 
                background: gradients[0]?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                filter: 'brightness(0.9)'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                    <GiPalette className="text-4xl text-white animate-pulse" />
                    <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                      Gradient Studio Pro
                    </h1>
                  </div>
                  <p className="text-white/90 text-lg">Create, analyze & export beautiful gradients</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search gradients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                  </div>
                  
                  <button 
                    onClick={() => setPreviewMode(true)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 text-white flex items-center gap-2 transition-all"
                  >
                    <FaExpand />
                    Fullscreen
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{gradients.length}</div>
                  <div className="text-white/80 text-sm">Total Gradients</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{favorites.length}</div>
                  <div className="text-white/80 text-sm">Favorites</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {gradients.filter(g => g.accessible).length}
                  </div>
                  <div className="text-white/80 text-sm">Accessible</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{savedGradients.length}</div>
                  <div className="text-white/80 text-sm">Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaPalette />
                  Mood Preset
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  {Object.entries(moodPresets).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MdGradient />
                  Gradient Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setType("linear")}
                    className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${type === "linear" ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <FiGrid />
                    Linear
                  </button>
                  <button
                    onClick={() => setType("radial")}
                    className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${type === "radial" ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <GiPaintBrush />
                    Radial
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaMagic />
                  Quantity: {num}
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={num}
                  onChange={(e) => setNum(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiRefreshCw />
                  Auto-Refresh
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className={`w-16 text-center font-bold py-2 rounded-lg ${animationSpeed > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {animationSpeed === 0 ? 'Off' : `Level ${animationSpeed}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MdContrast />
                  Direction: {gradientDirection}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiEye />
                  Card Size
                </label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGradientSize(size)}
                      className={`flex-1 py-2 rounded-lg capitalize ${gradientSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiCopy />
                  Copy Format
                </label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white"
                >
                  <option value="hex">HEX Code</option>
                  <option value="css">Full CSS</option>
                  <option value="advanced">CSS with Prefixes</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t">
              <button
                onClick={() => generateAdvancedGradient()}
                className="flex-1 lg:flex-none px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <FaMagic className={animationSpeed > 0 ? 'animate-spin' : ''} />
                Generate {selectedMood !== 'random' ? moodPresets[selectedMood] : ''} Gradients
              </button>

              {savedGradients.length > 0 && (
                <button
                  onClick={() => setGradients(savedGradients.slice(0, num))}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FiSave />
                  Load Saved ({savedGradients.length})
                </button>
              )}

              <button
                onClick={() => setShowColorInfo(!showColorInfo)}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <MdAccessibility />
                {showColorInfo ? 'Hide' : 'Show'} Info
              </button>
            </div>
          </div>

          {/* Gradients Grid */}
          <div className={`${layout === "grid" ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col'} gap-6`}>
            {filteredGradients.map((item, index) => (
              <div
                key={item.id}
                ref={el => gradientRefs.current[index] = el}
                className={`${getGradientSizeClass()} rounded-2xl shadow-2xl relative group overflow-hidden transform transition-all duration-500 hover:scale-[1.03] hover:shadow-3xl`}
                style={{ background: item.gradient }}
              >
                {/* Color Palette Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1"
                      style={{ background: color }}
                      title={color}
                    ></div>
                  ))}
                </div>

                {/* Accessibility Badge */}
                {item.accessible && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <MdAccessibility />
                    WCAG
                  </div>
                )}

                {/* Lock Indicator */}
                {item.locked && (
                  <div className="absolute top-3 right-3 p-2 bg-yellow-500/90 backdrop-blur-sm rounded-full">
                    <FiLock className="text-white text-sm" />
                  </div>
                )}

                {/* Color Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg" style={{background: item.colors[0]}}></div>
                        <div>
                          <div className="font-bold text-white">{item.hex[0]}</div>
                          {showColorInfo && (
                            <div className="text-xs text-white/70">
                              RGB: {item.rgb[0].join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/80 text-sm">Contrast</div>
                        <div className={`font-bold ${item.accessible ? 'text-green-300' : 'text-yellow-300'}`}>
                          {item.contrast}:1
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold text-white text-right">{item.hex[1]}</div>
                          {showColorInfo && (
                            <div className="text-xs text-white/70 text-right">
                              RGB: {item.rgb[1].join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg" style={{background: item.colors[1]}}></div>
                      </div>
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onCopy(
                          colorMode === "hex" ? item.css : 
                          colorMode === "advanced" ? item.cssAdvanced : item.css,
                          item
                        )}
                        className="py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <FiCopy />
                        Copy
                      </button>
                      
                      <button
                        onClick={() => toggleFavorite(item)}
                        className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${item.isFavorite ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                      >
                        <FiHeart className={item.isFavorite ? 'fill-current' : ''} />
                        {item.isFavorite ? 'Loved' : 'Love'}
                      </button>
                      
                      <button
                        onClick={() => toggleLock(index)}
                        className="py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        {item.locked ? <FiUnlock /> : <FiLock />}
                        {item.locked ? 'Unlock' : 'Lock'}
                      </button>
                      
                      <button
                        onClick={() => generateAdvancedGradient(index)}
                        className="py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <FaRandom />
                        Refresh
                      </button>
                      
                      <button
                        onClick={() => saveGradient(item)}
                        className="py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <FiSave />
                        Save
                      </button>
                      
                      <button
                        onClick={() => analyzeGradient(item)}
                        className="py-2 bg-purple-500/80 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <FiInfo />
                        Analyze
                      </button>
                      
                      <button
                        onClick={() => downloadGradient(item, index)}
                        className="py-2 bg-green-500/80 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all col-span-2"
                      >
                        <FiDownload />
                        Download PNG
                      </button>
                      
                      <button
                        onClick={() => shareGradient(item)}
                        className="py-2 bg-pink-500/80 hover:bg-pink-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <FiShare2 />
                        Share
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions (visible without hover) */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-60 group-hover:opacity-0 transition-opacity">
                  <button
                    onClick={() => onCopy(item.css, item)}
                    className="p-2 bg-black/50 rounded-lg"
                    title="Copy CSS"
                  >
                    <FiCopy className="text-white text-sm" />
                  </button>
                  <button
                    onClick={() => applyGradientToBackground(item)}
                    className="p-2 bg-black/50 rounded-lg"
                    title="Set as background"
                  >
                    <FaPaintBrush className="text-white text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Results Info */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-gray-800 text-lg">Gradient Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Showing {filteredGradients.length} of {gradients.length} gradients • 
                  {gradients.filter(g => g.accessible).length} accessible • 
                  {Object.values(lockedColors).filter(Boolean).length} locked
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setGradients(gradients.filter(g => g.isFavorite))}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl flex items-center gap-2"
                >
                  <FiHeart className="fill-current" />
                  View Favorites ({favorites.length})
                </button>
                
                <button
                  onClick={() => setGradients(gradients.filter(g => g.accessible))}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2"
                >
                  <MdAccessibility />
                  Accessible Only
                </button>
                
                <button
                  onClick={() => {
                    localStorage.setItem('gradientLibrary', JSON.stringify(gradients));
                    toast.success("Library saved!");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl"
                >
                  Save Library
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fullscreen Preview Mode
        <div className="flex-1 relative">
          <div 
            className="absolute inset-0 transition-all duration-1000"
            style={{ 
              background: gradients[0]?.gradient,
              animation: 'gradientShift 10s ease infinite'
            }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                Fullscreen Preview
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Press ESC or click below to exit
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {gradients.slice(0, 4).map((gradient, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-24 rounded-2xl shadow-2xl cursor-pointer transform transition-transform hover:scale-110"
                    style={{ background: gradient.gradient }}
                    onClick={() => {
                      document.body.style.background = gradient.gradient;
                      toast.success("Background updated!");
                    }}
                    title="Click to set as background"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setPreviewMode(false)}
            className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-sm rounded-2xl text-white hover:bg-white/30 transition-all group"
          >
            <FaCompress className="text-2xl" />
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-sm py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Exit Fullscreen (ESC)
            </div>
          </button>
          
          {/* Preview Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={() => {
                const randomIdx = Math.floor(Math.random() * gradients.length);
                document.body.style.background = gradients[randomIdx].gradient;
              }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <FaRandom />
              Random Gradient
            </button>
            
            <button
              onClick={() => {
                const currentBg = document.body.style.background;
                copy(`body { background: ${currentBg}; }`);
                toast.success("Background CSS copied!");
              }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <FiCopy />
              Copy Background CSS
            </button>
          </div>
        </div>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;