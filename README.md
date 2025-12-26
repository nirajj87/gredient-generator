🎨 Gradient Studio Pro
A powerful, feature-rich gradient generator built with React that helps designers and developers create, analyze, and export beautiful CSS gradients.

https://img.shields.io/badge/Gradient-Studio%2520Pro-purple https://img.shields.io/badge/React-18-blue https://img.shields.io/badge/License-MIT-green

✨ Live Demo
🔗 Try it here (Coming Soon)

📸 Screenshots
Dashboard	Preview Mode	Gradient Cards
https://via.placeholder.com/400x250/667eea/ffffff?text=Dashboard	https://via.placeholder.com/400x250/764ba2/ffffff?text=Preview+Mode	https://via.placeholder.com/400x250/4A569D/ffffff?text=Gradient+Cards
🚀 Features
🎨 Core Features
Smart Gradient Generation - AI-powered gradient creation

Multiple Gradient Types - Linear & Radial gradients

Mood-based Presets - Generate gradients based on emotions (Calm, Energetic, Professional, etc.)

Real-time Preview - Instant visualization of gradients

Copy CSS - One-click copy of gradient CSS code

Color Palette Extraction - Generate 5-color palettes from each gradient

🔧 Advanced Features
Color Locking - Lock specific colors while regenerating others

Auto-Animation - Automatically cycle through gradients

WCAG Accessibility Check - Validate contrast ratios (4.5:1+)

Fullscreen Preview - Immersive gradient viewing experience

Gradient Direction Control - Adjust gradient angles (0-360°)

Multiple Export Formats - HEX, RGB, HSL, and full CSS

📤 Export & Sharing
Download as PNG - High-quality gradient images

Save to Library - Store favorite gradients locally

Share Gradients - Native sharing or copy to clipboard

Apply as Background - Set any gradient as page background

Copy Analysis - Detailed color analysis reports

🎯 Utility Features
Search & Filter - Find gradients by color or properties

Favorites System - Save and manage favorite gradients

Responsive Design - Works on mobile, tablet, and desktop

Dark/Light Mode - Automatic theme adaptation

Keyboard Shortcuts - Quick actions with keyboard

🛠️ Tech Stack
Frontend: React 18, Vite

Styling: Tailwind CSS, CSS3 Animations

Icons: React Icons

Color Manipulation: Chroma.js

Image Export: HTML2Canvas

Notifications: React Toastify

Clipboard: Copy-to-clipboard

📦 Installation
Prerequisites
Node.js (v16 or higher)

npm or yarn

Setup Instructions
Clone the repository

bash
git clone https://github.com/yourusername/gradient-studio-pro.git
cd gradient-studio-pro
Install dependencies

bash
npm install
# or
yarn install
Run development server

bash
npm run dev
# or
yarn dev
Open in browser

text
http://localhost:5173
🚀 Quick Start
Basic Usage
Adjust the number of gradients (4-50)

Select gradient type (Linear/Radial)

Choose a mood preset or go random

Click "Generate Gradients"

Hover over any gradient to see options

Click "Copy CSS" to use in your projects

Advanced Usage
Lock Colors: Click the lock icon to keep colors fixed

Auto Animation: Enable and set speed for automatic updates

Accessibility Check: Look for WCAG badges (green = accessible)

Fullscreen Mode: Click the expand icon for immersive view

Save Gradients: Use the save icon to store to local library

🔑 Keyboard Shortcuts
Shortcut	Action
Space	Generate new gradients
F	Toggle fullscreen mode
C	Copy current gradient CSS
L	Toggle lock on selected gradient
ESC	Exit fullscreen mode
1-5	Switch between mood presets
📖 API Reference
Available Props (if using as component)
jsx
<GradientStudio
  initialCount={20}
  defaultType="linear"
  showControls={true}
  enableAnimation={false}
  onGradientSelect={(gradient) => console.log(gradient)}
  theme="dark"
/>
Gradient Object Structure
javascript
{
  id: "unique-id",
  gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  css: "background: linear-gradient(135deg, #667eea, #764ba2);",
  colors: ["#667eea", "#764ba2"],
  degree: 135,
  palette: ["#667eea", "#7285ed", "#7e8bf0", "#8a91f3", "#9697f6"],
  contrast: "4.8",
  accessible: true,
  luminance1: "0.42",
  luminance2: "0.28",
  hex: ["#667eea", "#764ba2"],
  rgb: [[102, 126, 234], [118, 75, 162]],
  hsl: [[232, 0.79, 0.66], [272, 0.37, 0.46]],
  isFavorite: false,
  locked: false,
  mood: "professional",
  timestamp: 1678901234567
}
🎨 