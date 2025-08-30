# 🎨 Animated GitHub Contribution Calendar

A beautiful, interactive Next.js application that transforms GitHub contribution data into stunning animated patterns. Click each letter in "Activity" to experience different cellular automata and visual effects on your contribution grid.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-cyan)

## ✨ Features

### 🎯 Interactive Animation Patterns
Click each letter in **"Activity"** to trigger different animated patterns:

- **A** - Conway's Game of Life 🧬
- **C** - Random Noise 🌟
- **T** - Wave Interference 🌊
- **I** - Spiral Patterns 🌀
- **V** - Rule 30 Cellular Automaton 🔢
- **I** - Rain Effect 🌧️
- **T** - Circular Ripples 💫
- **Y** - GIF Pattern Support 🖼️

### 📊 Real GitHub Data Integration
- Fetches your actual GitHub contribution data via GraphQL API
- Displays real contribution counts with GitHub's color intensity levels
- Smart date range handling for calendar year display
- Manual override system for missing contributions
- REST API fallback for comprehensive data collection

### 🎮 Interactive Controls
- **Click any letter** to start/pause animations
- **Real-time pattern switching** while animations are running
- **Automatic pause** when patterns reach stable states
- **Grid restoration** when pausing animations
- **Performance-optimized** animation loops using `requestAnimationFrame`

### 🎨 Visual Excellence
- **GitHub-accurate styling** with proper square dimensions and spacing
- **Dark/light mode support** with Tailwind CSS
- **Smooth animations** with configurable speed settings
- **Responsive design** that works on all screen sizes
- **Pixel-perfect grid** matching GitHub's contribution calendar

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- GitHub Personal Access Token (for fetching contribution data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/animated-contribution-calendar.git
   cd animated-contribution-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```

4. **Configure your GitHub username**
   Edit `contribution-calendar.tsx` and update:
   ```typescript
   const YOUR_GITHUB_USERNAME = "yourusername" // Replace with your GitHub username
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `read:user` permissions
3. Add it to your `.env.local` file

### Customizing Patterns
Edit the `animateLetterPatterns` array in `contribution-calendar.tsx` to change which patterns are triggered by each letter:

```typescript
const animateLetterPatterns = [
  PATTERNS.GAME_OF_LIFE, // A
  PATTERNS.NOISE,        // C
  PATTERNS.WAVE,         // T
  PATTERNS.SPIRAL,       // I
  PATTERNS.RULE30,       // V
  PATTERNS.RAIN,         // I
  PATTERNS.RIPPLE,       // T
  PATTERNS.IMAGE,        // Y
]
```

### Animation Settings
Adjust animation parameters in the component state:

```typescript
const [animationSpeed, setAnimationSpeed] = useState(150) // Milliseconds per frame
const [maxGenerations, setMaxGenerations] = useState(500) // Auto-stop limit
```

## 📁 Project Structure

```
animated-contribution-calendar/
├── app/
│   ├── api/
│   │   └── contributions/
│   │       └── route.ts          # GitHub API integration
│   ├── globals.css               # Global styles & square animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   ├── square.tsx                # Individual grid square component
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── collapsible.tsx
│       ├── select.tsx
│       └── slider.tsx
├── lib/
│   └── utils.ts                  # Utility functions
├── public/
│   └── elm.gif                   # Example GIF for pattern animations
├── contribution-calendar.tsx     # Main calendar component
├── package.json
└── README.md
```

## 🎨 Animation Patterns Explained

### Conway's Game of Life
Classic cellular automaton with birth/death rules:
- **Birth**: Dead cell with exactly 3 neighbors becomes alive
- **Survival**: Live cell with 2-3 neighbors stays alive
- **Death**: All other cells die or stay dead

### Ripple Effect
Expanding circular waves that:
- Spawn randomly across the grid
- Grow outward from center points
- Fade away after reaching maximum radius
- Create mesmerizing wave interference patterns

### Wave Interference
Mathematical wave functions that:
- Combine sine waves in X and Y directions
- Create standing wave patterns
- Move continuously across the grid
- Generate beautiful interference effects

### Rain Animation
Simulated rainfall effect:
- Drops spawn randomly at the top
- Fall downward with gravity
- Disappear at the bottom
- Create a natural rain-like appearance

### Spiral Patterns
Mathematical spiral generation:
- Calculated using polar coordinates
- Rotates and expands over time
- Creates hypnotic spiral arms
- Based on angle and distance from center

### Random Noise
Controlled randomness that:
- Generates new random patterns each frame
- Uses probability thresholds for cell activation
- Creates TV static-like effects
- Useful for testing and debugging

### Rule 30 Automaton
Elementary cellular automaton:
- Applies specific rules to generate patterns
- Creates complex behavior from simple rules
- Demonstrates emergent complexity
- Based on Stephen Wolfram's research

### GIF Pattern Support
Image/animation integration:
- Loads external GIF files
- Converts frames to grid patterns
- Uses brightness thresholding
- Supports animated sequences

## 🔧 Technical Details

### Performance Optimizations
- **RequestAnimationFrame**: Smooth 60fps animations
- **Memoized calculations**: Prevents unnecessary re-renders
- **Grid state management**: Efficient React state updates
- **Canvas processing**: Offscreen image manipulation

### API Integration
- **GraphQL primary**: GitHub's official contribution API
- **REST fallback**: Additional data completeness
- **Caching disabled**: Always fetch fresh data
- **Error handling**: Graceful degradation

### Responsive Design
- **Mobile-first**: Works on all screen sizes
- **Touch-friendly**: Optimized for mobile interactions
- **Pixel-perfect**: Matches GitHub's exact styling
- **Dark mode**: Full theme support

## 🎯 Usage Examples

### Basic Interaction
1. Visit the page to see your GitHub contribution data
2. Click any letter in "Activity" to start an animation
3. Click the same letter again to pause and restore original data
4. Click different letters to switch between animation patterns

### Advanced Features
- **Pattern chaining**: Switch between patterns while running
- **Speed control**: Adjust animation timing in the code
- **Custom patterns**: Add your own cellular automata rules
- **Data override**: Manually add missing contribution data

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add `GITHUB_TOKEN` environment variable
4. Deploy automatically

### Other Platforms
- **Netlify**: Add build command `npm run build`
- **Railway**: Configure environment variables
- **Heroku**: Use Node.js buildpack
- **Self-hosted**: Build with `npm run build` and serve `/out`

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-pattern`
3. **Make your changes**: Add new patterns, fix bugs, improve UI
4. **Test thoroughly**: Ensure animations work smoothly
5. **Commit with clear messages**: `git commit -m "Add spiral wave pattern"`
6. **Push to your fork**: `git push origin feature/amazing-pattern`
7. **Open a Pull Request**: Describe your changes clearly

### Ideas for Contributions
- 🎨 New animation patterns
- 🚀 Performance improvements
- 📱 Better mobile experience
- 🎮 Additional interactive features
- 🐛 Bug fixes and optimizations
- 📚 Documentation improvements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub** for the contribution data API
- **Conway's Game of Life** for inspiring cellular automata
- **Next.js team** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Radix UI** for accessible components
- **Vercel** for hosting and deployment

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/animated-contribution-calendar/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/animated-contribution-calendar/discussions)
- 📧 **Email**: your.email@example.com
- 🐦 **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

*Transform your GitHub contributions into beautiful, interactive art!*