# 🎨 Gradient Studio Pro

> A powerful, feature-rich **React Gradient Generator** for designers & developers to create, analyze, and export stunning CSS gradients effortlessly.

![Gradient Studio Pro](https://github.com/nirajj87/gredient-generator/blob/main/public/gredient.png)
![Gradient Studio Pro Preview](https://github.com/nirajj87/gredient-generator/blob/main/public/gredient2.png)

---

## ✨ Live Demo

🚀 **Try it here:**  
👉 https://devsupport.co.in/gredient-generatore

---

## 📸 Screenshots

| Dashboard | Preview Mode | Gradient Cards |
|---------|--------------|----------------|
| ![](https://via.placeholder.com/400x250/667eea/ffffff?text=Dashboard) | ![](https://via.placeholder.com/400x250/764ba2/ffffff?text=Preview+Mode) | ![](https://via.placeholder.com/400x250/4A569D/ffffff?text=Gradient+Cards) |

---

## 🚀 Features

### 🎨 Core Features
- 🤖 **Smart Gradient Generation** (AI-powered)
- 🌈 **Linear & Radial Gradients**
- 😊 **Mood-based Presets** (Calm, Energetic, Professional, etc.)
- ⚡ **Real-time Preview**
- 📋 **One-click Copy CSS**
- 🎯 **5-Color Palette Extraction**

---

### 🔧 Advanced Features
- 🔒 **Color Locking**
- 🔄 **Auto Animation Mode**
- ♿ **WCAG Accessibility Check (4.5:1+)**
- 🖥️ **Fullscreen Preview**
- 🧭 **Gradient Angle Control (0–360°)**
- 🎛️ **Export in HEX, RGB, HSL & CSS**

---

### 📤 Export & Sharing
- 🖼️ **Download Gradient as PNG**
- 💾 **Save to Local Library**
- 🔗 **Share Gradients**
- 🎨 **Apply as Page Background**
- 📊 **Detailed Color Analysis**

---

### 🎯 Utility Features
- 🔍 **Search & Filter Gradients**
- ❤️ **Favorites System**
- 📱 **Fully Responsive Design**
- 🌙 **Dark / Light Mode**
- ⌨️ **Keyboard Shortcuts Support**

---

## 🛠️ Tech Stack

| Technology | Usage |
|----------|-------|
| ⚛️ React 18 | UI Development |
| ⚡ Vite | Fast Build Tool |
| 🎨 Tailwind CSS | Styling |
| 🧮 Chroma.js | Color Manipulation |
| 🖼️ HTML2Canvas | Image Export |
| 🔔 React Toastify | Notifications |
| 📋 Copy-to-Clipboard | Clipboard Support |

---

## 📦 Installation

### ✅ Prerequisites
- Node.js **v16+**
- npm or yarn

### 🔧 Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/gradient-studio-pro.git

# Navigate into project
cd gradient-studio-pro

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev

___

Open in browser:
👉 http://localhost:5173

🚀 Quick Start
Basic Usage

Select gradient count (4–50)

Choose gradient type (Linear / Radial)

Pick a mood preset or random

Click Generate Gradients

Copy CSS & use anywhere 🎉

Advanced Usage

🔒 Lock colors to keep them fixed

🔄 Enable auto animation

♿ Check WCAG accessibility badges

🖥️ Use fullscreen preview

💾 Save gradients to library

🔑 Keyboard Shortcuts
Shortcut	Action
Space	Generate new gradients
F	Toggle fullscreen
C	Copy gradient CSS
L	Lock / Unlock colors
ESC	Exit fullscreen
1–5	Switch mood presets
📖 API Reference
React Component Usage
<GradientStudio
  initialCount={20}
  defaultType="linear"
  showControls={true}
  enableAnimation={false}
  onGradientSelect={(gradient) => console.log(gradient)}
  theme="dark"
/>

Gradient Object Structure
{
  id: "unique-id",
  gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  css: "background: linear-gradient(135deg, #667eea, #764ba2);",
  colors: ["#667eea", "#764ba2"],
  degree: 135,
  palette: ["#667eea", "#7285ed", "#7e8bf0", "#8a91f3", "#9697f6"],
  contrast: "4.8",
  accessible: true,
  hex: ["#667eea", "#764ba2"],
  rgb: [[102,126,234],[118,75,162]],
  hsl: [[232,0.79,0.66],[272,0.37,0.46]],
  isFavorite: false,
  locked: false,
  mood: "professional",
  timestamp: 1678901234567
}

🤝 Contributing

Contributions are welcome!
Feel free to fork, create issues, or submit pull requests.

📄 License

MIT License © 2025
Made with ❤️ by Niraj Singh