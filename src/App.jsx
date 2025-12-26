import { useState,useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [num, setNum] = useState(20);
  const [type, setType] = useState("linear");
  const [gradients, setGradients] = useState([]);

  const getHexColorCode = () => {
    const rgb = 255 * 255 * 255;
    const random = Math.floor(Math.random() * rgb);
    const int = Math.floor(random);
    const hexCode = int.toString(16);
    const colorHex = `#${hexCode.padEnd(6, "0")}`;
    return colorHex;
  };

  const generateGradients = () => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      const color1 = getHexColorCode();
      const color2 = getHexColorCode();
      const degree = Math.floor(Math.random() * 360);

      if (type === "linear") {
        colors.push({
          gradient: `linear-gradient(${degree}deg, ${color1}, ${color2})`,
          css: `background: linear-gradient(${degree}deg, ${color1}, ${color2});`,
        });
      } else {
        colors.push({
          gradient: `radial-gradient(circle, ${color1}, ${color2})`,
          css: `background: radial-gradient(circle, ${color1}, ${color2});`,
        });
      }
    }
    setGradients(colors);
  };
  
  const onCopy = (css)=>{
    navigator.clipboard.writeText(css);
    toast.success("Gradient CSS Copied!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }
  useEffect(() => {
    generateGradients();
  }, [num, type]);
  return (
    <div className="min-h-screen flex bg-gray-200 py-12">
      <div className="w-9/12 mx-auto space-y-8">
        <div className="flex justify-between p-6 rounded-xl" style={{background:getHexColorCode()}}>
          <h1 className="text-3xl font-bold">
            🎨 Gredient Generate 
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              onChange={(e) => setNum(e.target.value)}
              placeholder="12"
              className="border border-slate-300 bg-white rounded-lg w-25 p-2 "
              value={num}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-slate-300 bg-white rounded-lg w-25 p-2"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
            <button className="px-16 py-2 bg-rose-500 text-white font-medium" onClick={generateGradients}>
              Generate
            </button>
          </div>
          
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Render gradient boxes */}
          
          {
            gradients.map((item, index) => (
              <div
                key={index}
                className="h-45 rounded-xl relative"
                style={{ background: item.gradient

                }}
              >
                <button onClick={() => onCopy(item.css)} className="bg-black/50 hover:bg-black text-white rounded absolute bottom-3 right-3 text-[10px] px-1 py-1 cursor-grabbing hover:cursor-pointer">
                  Copy
                </button>
              </div>
            ))
          }

        </div>
        <ToastContainer />

      </div>
    </div>
  );
}

export default App;
