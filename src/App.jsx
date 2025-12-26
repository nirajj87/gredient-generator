import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCopy, FiRefreshCw, FiSettings, FiGrid, FiList, FiEye, FiDownload, FiLock, FiUnlock, FiHeart, FiShare2 } from "react-icons/fi";
import { FaPalette, FaRandom } from "react-icons/fa";

function App() {
  const [num, setNum] = useState(20);
  const [type, setType] = useState("linear");
  const [gradients, setGradients] = useState([]);
  const [layout, setLayout] = useState("grid"); // grid or list
  const [favorites, setFavorites] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [gradientSize, setGradientSize] = useState("medium"); // small, medium, large
  const [lockedColors, setLockedColors] = useState({}); // Store locked color combinations
  const [showControls, setShowControls] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0); // 0: no animation, 1-5: speed levels
  const canvasRef = useRef(null);

  // Color names for more meaningful gradients
  const colorNames = {
    "#FF6B6B": "Coral Red",
    "#4ECDC4": "Turquoise",
    "#FFD166": "Sunshine Yellow",
    "#06D6A0": "Emerald Green",
    "#118AB2": "Ocean Blue",
    "#EF476F": "Watermelon",
    "#073B4C": "Midnight Blue",
    "#FF9E6D": "Peach",
    "#9B5DE5": "Purple Majesty",
    "#00BBF9": "Sky Blue",
    "#00F5D4": "Mint",
    "#FF97B7": "Blush Pink",
    "#8338EC": "Electric Purple",
    "#3A86FF": "Azure Blue",
    "#FB5607": "Vibrant Orange"
  };

  const getHexColorCode = (lockedColor = null) => {
    if (lockedColor) return lockedColor;
    
    const colors = Object.keys(colorNames);
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateGradients = () => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      // Check if this index has locked colors
      const lockedPair = lockedColors[i];
      const color1 = lockedPair ? lockedPair[0] : getHexColorCode();
      const color2 = lockedPair ? lockedPair[1] : getHexColorCode();
      const degree = Math.floor(Math.random() * 360);

      const gradient = type === "linear" 
        ? `linear-gradient(${degree}deg, ${color1}, ${color2})`
        : `radial-gradient(circle at center, ${color1}, ${color2})`;

      colors.push({
        id: Date.now() + i,
        gradient,
        css: `background: ${gradient};`,
        colors: [color1, color2],
        degree,
        colorNames: [colorNames[color1], colorNames[color2]],
        isFavorite: favorites.includes(`${color1}-${color2}`),
        locked: !!lockedColors[i]
      });
    }
    setGradients(colors);
  };

  const onCopy = (css) => {
    navigator.clipboard.writeText(css);
    toast.success("🎨 Gradient Copied!", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '10px'
      }
    });
  };

  const toggleFavorite = (gradient) => {
    const key = `${gradient.colors[0]}-${gradient.colors[1]}`;
    if (favorites.includes(key)) {
      setFavorites(favorites.filter(fav => fav !== key));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, key]);
      toast.success("Added to favorites 💖");
    }
  };

  const toggleLock = (index) => {
    setLockedColors(prev => ({
      ...prev,
      [index]: prev[index] ? null : gradients[index].colors
    }));
  };

  const generateSingleGradient = (index) => {
    const newGradients = [...gradients];
    const lockedPair = lockedColors[index];
    
    const color1 = lockedPair ? lockedPair[0] : getHexColorCode();
    const color2 = lockedPair ? lockedPair[1] : getHexColorCode();
    const degree = Math.floor(Math.random() * 360);

    const gradient = type === "linear" 
      ? `linear-gradient(${degree}deg, ${color1}, ${color2})`
      : `radial-gradient(circle at center, ${color1}, ${color2})`;

    newGradients[index] = {
      ...newGradients[index],
      gradient,
      css: `background: ${gradient};`,
      colors: [color1, color2],
      degree,
      colorNames: [colorNames[color1], colorNames[color2]]
    };

    setGradients(newGradients);
  };

  const downloadGradient = async (gradient, index) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const grd = type === "linear"
      ? ctx.createLinearGradient(0, 0, 400, 0)
      : ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    
    grd.addColorStop(0, gradient.colors[0]);
    grd.addColorStop(1, gradient.colors[1]);
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 400, 400);
    
    // Convert to blob and download
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gradient-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("📸 Gradient Image Downloaded!");
    });
  };

  const shareGradient = (gradient) => {
    const text = `Check out this beautiful gradient: ${gradient.colors[0]} → ${gradient.colors[1]}`;
    if (navigator.share) {
      navigator.share({
        title: 'Beautiful Gradient',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.info("📋 Gradient details copied to clipboard!");
    }
  };

  const applyGradientToBackground = (gradient) => {
    document.body.style.background = gradient.gradient;
    toast.success("🌅 Applied as background!");
  };

  const getGradientSizeClass = () => {
    switch(gradientSize) {
      case 'small': return 'h-32';
      case 'medium': return 'h-45';
      case 'large': return 'h-64';
      default: return 'h-45';
    }
  };

  useEffect(() => {
    generateGradients();
  }, [num, type]);

  // Animation effect
  useEffect(() => {
    if (animationSpeed > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * gradients.length);
        generateSingleGradient(randomIndex);
      }, 3000 / animationSpeed);
      
      return () => clearInterval(interval);
    }
  }, [animationSpeed, gradients.length]);

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-300 py-12 transition-all duration-500 ${previewMode ? 'p-0' : ''}`}>
      <canvas ref={canvasRef} width="400" height="400" className="hidden" />
      
      {!previewMode && (
        <div className="w-11/12 mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="relative p-8 rounded-2xl shadow-2xl overflow-hidden" style={{background: gradients[0]?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg flex items-center gap-3">
  <FaPalette className="animate-pulse" />
  Gradient Studio
</h1>
                <p className="text-white/80 mt-2">Create beautiful color gradients instantly</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowControls(!showControls)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                    title="Toggle Controls"
                  >
                    <FiSettings className="text-white text-xl" />
                  </button>
                  <button 
                    onClick={() => setPreviewMode(true)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                    title="Preview Mode"
                  >
                    <FiEye className="text-white text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          {showControls && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    <FiGrid className="inline mr-2" />
                    Layout
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setLayout("grid")}
                      className={`flex-1 py-2 rounded-lg transition-all ${layout === "grid" ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      Grid
                    </button>
                    <button 
                      onClick={() => setLayout("list")}
                      className={`flex-1 py-2 rounded-lg transition-all ${layout === "list" ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      List
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    <FaPalette className="inline mr-2" />
                    Gradient Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    🔢 Number of Gradients
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="4"
                      max="50"
                      value={num}
                      onChange={(e) => setNum(e.target.value)}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-bold bg-gray-100 py-1 rounded-lg">
                      {num}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    🎬 Animation Speed
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-bold bg-gray-100 py-1 rounded-lg">
                      {animationSpeed === 0 ? 'Off' : animationSpeed}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
                <button 
                  onClick={generateGradients}
                  className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <FiRefreshCw className={`${animationSpeed > 0 ? 'animate-spin' : ''}`} />
                  {animationSpeed > 0 ? 'Auto-Generating' : 'Generate Gradients'}
                </button>
                
                <button 
                  onClick={() => generateSingleGradient(0)}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FaRandom />
                  Randomize First
                </button>

                <select
                  value={gradientSize}
                  onChange={(e) => setGradientSize(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white"
                >
                  <option value="small">Small Cards</option>
                  <option value="medium">Medium Cards</option>
                  <option value="large">Large Cards</option>
                </select>
              </div>
            </div>
          )}

          {/* Gradients Grid/List */}
          <div className={`${layout === "grid" ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'flex flex-col'} gap-6`}>
            {gradients.map((item, index) => (
              <div
                key={item.id}
                className={`${getGradientSizeClass()} rounded-2xl shadow-xl relative group overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  layout === "list" ? 'flex' : ''
                }`}
                style={{ background: item.gradient }}
              >
                {/* Color Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white" style={{background: item.colors[0]}}></div>
                        <div className="text-sm font-semibold">{item.colorNames[0]}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">{item.colorNames[1]}</div>
                        <div className="w-4 h-4 rounded-full border-2 border-white" style={{background: item.colors[1]}}></div>
                      </div>
                    </div>
                    {type === "linear" && (
                      <div className="text-xs opacity-80">Angle: {item.degree}°</div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleFavorite(item)}
                    className={`p-2 rounded-full backdrop-blur-sm ${
                      item.isFavorite 
                        ? 'bg-red-500/80 text-white' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    } transition-all`}
                    title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FiHeart className={`${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => toggleLock(index)}
                    className={`p-2 rounded-full backdrop-blur-sm ${
                      item.locked 
                        ? 'bg-yellow-500/80 text-white' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    } transition-all`}
                    title={item.locked ? "Unlock colors" : "Lock colors"}
                  >
                    {item.locked ? <FiLock /> : <FiUnlock />}
                  </button>
                  
                  <button
                    onClick={() => generateSingleGradient(index)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all"
                    title="Regenerate this gradient"
                  >
                    <FiRefreshCw />
                  </button>
                </div>

                {/* Bottom Action Buttons */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => onCopy(item.css)}
                    className="flex-1 py-2 bg-black/60 hover:bg-black/80 text-white rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <FiCopy />
                    Copy CSS
                  </button>
                  
                  <button
                    onClick={() => downloadGradient(item, index)}
                    className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl transition-all"
                    title="Download as image"
                  >
                    <FiDownload />
                  </button>
                  
                  <button
                    onClick={() => shareGradient(item)}
                    className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl transition-all"
                    title="Share gradient"
                  >
                    <FiShare2 />
                  </button>
                </div>

                {/* Apply as Background Button */}
                <button
                  onClick={() => applyGradientToBackground(item)}
                  className="absolute top-4 left-4 px-3 py-1 bg-black/60 hover:bg-black/80 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  Apply BG
                </button>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{gradients.length}</div>
                  <div className="text-sm text-gray-600">Gradients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{favorites.length}</div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {Object.values(lockedColors).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-gray-600">Locked</div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                {favorites.length > 0 && (
                  <button 
                    onClick={() => {
                      // Show only favorites
                      const favGradients = gradients.filter(g => g.isFavorite);
                      setGradients(favGradients);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl flex items-center gap-2"
                  >
                    <FiHeart className="fill-current" />
                    View Favorites ({favorites.length})
                  </button>
                )}
                
                <button 
                  onClick={generateGradients}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl"
                >
                  Generate All New
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {previewMode && (
        <div className="flex-1 relative">
          <div 
            className="absolute inset-0 transition-all duration-1000"
            style={{ background: gradients[0]?.gradient }}
          ></div>
          
          <button
            onClick={() => setPreviewMode(false)}
            className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
          >
            Exit Preview
          </button>
          
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold">Fullscreen Preview</h2>
            <p className="opacity-80">Press escape or click the button to exit</p>
          </div>
        </div>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;