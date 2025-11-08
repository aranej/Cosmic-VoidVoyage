# Cosmic VoidVoyage

**An immersive, meditative web experience:** A synchronized journey through deep space to visually stunning nebulae, accompanied by atmospheric music.

## Project Status: Initialization Phase

Current version: **MVP 0.1 - Proof of Concept**

## Overview

Cosmic VoidVoyage transports users on a first-person automated flight through deep space to beautifully rendered nebulae. The experience features precise synchronization between flight duration and musical score, creating a tranquil, awe-inspiring journey.

### Core Features (Planned)

- 🌌 **5 Distinct Nebulae:** Visually unique destinations inspired by Hubble imagery
- 🎵 **10 Musical Tracks:** Atmospheric soundscapes from Suno AI
- ⏱️ **Dynamic Synchronization:** Flight duration precisely matches audio duration
- 🎥 **Automated Camera Flight:** Smooth spline-based paths from deep space to nebula heart
- 🎨 **Minimalist UI:** Non-intrusive interface that fades during the journey

## Technology Stack

- **Core:** Three.js r181 (WebGL renderer)
- **Build:** Vite 5.x
- **Language:** TypeScript 5.x
- **Styling:** Plain CSS
- **Deployment:** Vercel (Free Tier)

## Project Structure

```
Cosmic-VoidVoyage/
├── docs/
│   ├── PROJECT_BRIEF.md           # Vision and core requirements
│   ├── PROJECT_PLAN.md            # Implementation tracking
│   └── PRD.md                     # Product Requirements Document
├── src/
│   └── main.ts                    # Three.js application entry
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
└── vercel.json                    # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Modern browser with WebGL support

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Cosmic-VoidVoyage

# Install dependencies
npm install
```

### Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

This project is configured for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Performance Targets

| Metric | Target | Current (MVP 0.1) |
|--------|--------|-------------------|
| FPS | 60 (min 30) | ✅ 60+ |
| Bundle Size | <800KB (gzipped) | ✅ 123KB |
| Initial Load | <3s | ✅ <1s |

## Development Milestones

- ✅ **M0: Foundation** - Development environment and deployment pipeline
- 🔄 **M1: Core Rendering** - Procedural nebula generation (In Progress)
- ⏳ **M2: Audio Sync** - Audio playback with flight synchronization
- ⏳ **M3: Content Creation** - 5 nebulae + 10 audio tracks
- ⏳ **M4: User Interface** - Selection UI and user flow
- ⏳ **M5: Polish** - Post-processing and optimization
- ⏳ **M6: Launch** - Production deployment

## Key Decisions

### Why WebGL (not WebGPU)?

WebGPU in Three.js (as of Nov 2025) has performance issues, with reports of 10x slower rendering compared to WebGL. We're using the mature, production-ready WebGLRenderer.

### Why Procedural Nebulae?

Procedural generation via GLSL shaders offers:
- Zero bandwidth cost (runtime generation)
- Infinite visual variation
- 2x faster performance than texture-based approaches
- Better fit for Vercel free tier constraints (100GB/month bandwidth)

### Why Vercel Free Tier?

Demonstrates that high-quality 3D web experiences can be deployed cost-effectively while maintaining excellent performance.

## Documentation

- **[PROJECT_BRIEF.md](PROJECT_BRIEF.md)** - Original vision and technical requirements
- **[PRD.md](PRD.md)** - Comprehensive product requirements and implementation strategy
- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Live task tracking and technical decisions

## Browser Support

**Primary targets:**
- Chrome (latest) ✅
- Firefox (latest) ✅
- Safari (latest, macOS) ✅

**Mobile:** Secondary goal (graceful degradation)

## Contributing

This is currently a solo project with AI assistance. Contributions welcome after MVP launch.

## License

MIT

## Acknowledgments

- Inspired by the work of [@techartist_](https://twitter.com/techartist_)
- Nebula designs inspired by NASA Hubble Space Telescope imagery
- Audio tracks generated with Suno AI V5

---

**Last Updated:** 2025-11-08
**Current Phase:** Initialization & Foundation
