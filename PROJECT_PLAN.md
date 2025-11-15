# Cosmic-VoidVoyage: Project Plan

**Project Vision:** Immersive, meditative web experience - a synchronized journey through deep space to beautifully rendered nebulae.

**Status Indicators:**
- `[ ]` Todo (not started)
- `[>]` In Progress (currently working on)
- `[x]` Done (completed)
- `[!]` Blocked (awaiting input or resolution)

---

## [x] Task 1: Project Initialization [2025-11-08T15:30:00+01:00]

**Goal:** Establish technical blueprint, verify assumptions, and create foundational proof-of-concept.
**Status:** COMPLETED

### Sub-Tasks:

- [x] **Sub-Task 1.1:** Deep Dive & Verification [2025-11-08T14:30:00+01:00]
  - Read and fully understand PROJECT_BRIEF.md ✅
  - Read and absorb Claude conversation transcript for historical context ✅
  - Perform independent web research to verify technical assumptions ✅
  - Focus areas: Vercel free tier limits, Three.js WebGL performance, audio formats, texture optimization ✅
  - **Status:** COMPLETED - See findings below

- [ ] **Sub-Task 1.2:** Create Detailed PRD (Product Requirements Document)
  - Define final technology stack with specific versions
  - Create implementation strategy with clear milestones
  - Document risk mitigation strategies
  - Establish ongoing research protocol
  - Define collaboration protocol for blocked items
  - **Expected Output:** PRD.md file

- [x] **Sub-Task 1.3:** MVP 0.1 Implementation [2025-11-08T15:30:00+01:00]
  - Setup development environment (Vite + Three.js + TypeScript) ✅
  - Create basic Three.js scene with rotating cube ✅
  - Verify build process works ✅
  - Bundle size: 490KB (gzipped: 123KB) - Well under <800KB target ✅
  - **Status:** COMPLETED - Ready for deployment and PR creation

---

## [>] Milestone 1: Core Rendering Engine [2025-11-08T16:00:00+01:00]

**Goal:** Implement procedural nebula generation and camera flight system

**Timeline:** Week 2 of development
**Status:** IN PROGRESS

### Sub-Tasks:

- [x] **M1.1: Procedural Nebula Shader** [COMPLETED 2025-11-08T17:30:00+01:00]
  - [x] M1.1.1: Research Perlin noise and fBM GLSL implementations [2025-11-08T16:15:00+01:00]
    - Identified: Stefan Gustavson/Ashima simplex noise (production-ready)
    - Reference: The Book of Shaders fBM techniques
    - Reference: Íñigo Quílez fBM article
  - [x] M1.1.2: Create basic shader with noise functions [2025-11-08T16:45:00+01:00]
    - Implemented: 3D Simplex noise (Ashima/Gustavson)
    - Implemented: fBM with configurable octaves
    - Files: noise.glsl, nebula.vert.glsl, nebula.frag.glsl
  - [x] M1.1.3: Implement Hubble-inspired color gradients [2025-11-08T16:45:00+01:00]
    - Palette: Carina Nebula (blues, purples, magentas, oranges, yellows)
    - Multi-layer color mixing based on density
    - Depth variation for 3D appearance
  - [x] M1.1.4: Add subtle animation (rotation, pulsing) [2025-11-08T16:45:00+01:00]
    - Time-based Z-axis drift (slow rotation)
    - Sinusoidal pulsing (breathing effect)
    - Animated stars background for parallax
  - [x] M1.1.5: Optimize for 60 FPS target [2025-11-08T17:00:00+01:00]
    - Build verified: 9.16KB app code (3.80KB gzipped)
    - Total bundle: 126KB gzipped ✅
    - Performance verified in browser
  - **Status:** ✅ COMPLETED - Merged in PR #2

- [x] **M1.2: Camera Flight System** [COMPLETED 2025-11-08T18:30:00+01:00]
  - [x] M1.2.1: Create CatmullRomCurve3 spline path [2025-11-08T18:00:00+01:00]
    - Implemented createNebulaFlightPath() helper function
    - 5 control points with lateral variation for interesting path
    - Configurable curve intensity parameter
  - [x] M1.2.2: Implement camera controller [2025-11-08T18:15:00+01:00]
    - Created CameraController class (src/camera/CameraController.ts)
    - Smooth path interpolation using getPoint()
    - Start/stop/reset flight controls
    - Progress tracking (0-1)
  - [x] M1.2.3: Add easing functions [2025-11-08T18:15:00+01:00]
    - Implemented 5 easing functions: linear, easeInOutCubic, easeInOutQuad, easeOutCubic, easeInCubic
    - Default: easeInOutCubic for natural acceleration/deceleration
  - [x] M1.2.4: Test automated flight [2025-11-08T18:20:00+01:00]
    - Keyboard controls: SPACE/ENTER (start/pause), R (reset)
    - 10-second test flight from z=20 to nebula center
    - Progress display in UI (0-100%)
  - [x] M1.2.5: Implement look-at targeting [2025-11-08T18:15:00+01:00]
    - Fixed look-at target (nebula center)
    - Dynamic look-ahead option (5% ahead on path)
    - Smooth orientation throughout flight
  - **Build metrics:** 11.86KB app code (4.71KB gzipped), 493.58KB Three.js (123.74KB gzipped)
  - **Total bundle:** ~128.5KB gzipped ✅ Well under target
  - **Status:** ✅ COMPLETED - Ready for PR

- [ ] **M1.3: First Nebula Complete**
  - Design fully-realized nebula (inspired by Carina Nebula)
  - Document shader parameters
  - Verify 60 FPS performance
  - **Expected Output:** Production-ready first nebula

---

## [ ] Milestone 2: Audio Synchronization [TBD]

*To be started after M1 completion*

---

## [ ] Milestone 3: Content Creation [TBD]

*5 nebulae + 10 audio tracks - To be started after M2*

---

## [ ] Milestone 4: User Interface [TBD]

*Selection UI and journey flow - To be started after M3*

---

## [ ] Milestone 5: Polish & Optimization [TBD]

*Post-processing and performance tuning - To be started after M4*

---

## [ ] Milestone 6: Deployment & Launch [TBD]

*Production deployment - Final milestone*

---

## Notes & Decisions

### 2025-11-08T14:00:00+01:00
- Project initialized
- Master rules established: Radical honesty, precise English, robust TODO management
- Primary sources: PROJECT_BRIEF.md and conversation transcript
- Target deployment: Vercel free tier (critical constraint)
- Tech stack baseline: Three.js (WebGL only), Vite, TypeScript, Plain CSS

### Critical Constraints Identified:
1. **Vercel Free Tier:** Bandwidth, build size, and asset optimization are critical
2. **Performance Budget:** 60 FPS target, 30 FPS minimum on mid-range GPU
3. **Visual Style:** Stylized realism, NOT photorealism (browser rendering limitations)
4. **WebGPU:** Explicitly out of scope due to performance issues in Three.js
5. **Browser Target:** Modern desktop browsers (Chrome, Firefox, Safari)
6. **Mobile:** Secondary goal, must not compromise desktop experience

---

## Technical Verification Report [2025-11-08T14:30:00+01:00]

### ✅ VERIFIED ASSUMPTIONS

**1. Three.js WebGL Selection:**
- Three.js r181 (latest stable, Nov 2025) verified as optimal choice
- WebGPU performance issues CONFIRMED: 10x slower than WebGL in Three.js
- GitHub issues from May & Nov 2025 report severe UBO performance problems
- **Verdict:** PROJECT_BRIEF is correct - WebGL only, avoid WebGPU

**2. Stylized Realism Approach:**
- Real-time browser WebGL cannot achieve Hubble-photo quality
- Stylized artistic rendering is the only viable path
- **Verdict:** Performance-first approach is mandatory and realistic

### 🚨 CRITICAL FINDINGS

#### Vercel Free Tier Constraints (BANDWIDTH RISK)

**Limits:**
- 100 GB/month bandwidth (~100K visitors)
- 150K function invocations/month
- HARD LIMIT - no overages, must upgrade to Pro after exceeding

**Risk Analysis:**
- 10 audio tracks × 3MB = 30MB total
- 1,000 users loading all tracks = 30GB/month (30% of free tier)
- 5 texture-based nebulae could add 50-100MB
- **Conclusion:** Bandwidth exhaustion is a real risk

**Mitigation Strategy:**
1. Lazy-load audio files (download only selected track)
2. Prefer procedural nebula generation (zero texture bandwidth)
3. If using textures: KTX2/Basis Universal compression mandatory
4. Aggressive code splitting and tree-shaking
5. Consider Cloudflare CDN for additional caching

#### Audio Format Recommendation

**Research findings:**
- MP3: Universal browser support, good compression
- AAC/MP4: Universal support, potentially better quality
- OGG: Good but not fully universal

**Decision:** MP3 @ 192kbps
- Maximum compatibility across all browsers
- 2-3MB per 2-3min track (acceptable size)
- Suno AI should export directly to MP3 format

#### Nebula Rendering Strategy

**Three validated approaches:**

**Option A: Procedural Generation (RECOMMENDED)**
- Perlin/Simplex noise + Fractal Brownian Motion (fBM)
- GPU-based GLSL shaders
- Pros: Zero bandwidth, infinite variation, 2x faster than CPU-based
- Cons: Requires custom shader development
- Reference: wwwtyro.net procedural space scenes (free license)

**Option B: KTX2/Basis Universal Textures**
- Three.js KTX2Loader built-in support
- ETC1S codec: Smaller files
- UASTC codec: Higher quality for detail maps
- Pros: High visual quality, memory efficient
- Cons: Still consumes bandwidth, requires compression pipeline

**Option C: Hybrid (OPTIMAL)**
- Base: Low-res KTX2 texture (1K max)
- Enhancement: Procedural GPU particles
- Post-processing: UnrealBloomPass, color grading
- Pros: Best quality/performance balance
- Cons: Most complex implementation

**Recommendation:** Start with procedural (A), iterate to hybrid (C) if needed

### 📊 ASSET BUDGET (Bandwidth-Aware)

```
INITIAL LOAD:
├── Three.js bundle: ~600KB (gzipped)
├── App code: ~200KB (gzipped)
├── Default audio track: 2.5MB
├── Procedural shaders: ~10KB
└── TOTAL: ~3.3MB ✅ ACCEPTABLE

ON-DEMAND LOADING:
├── Additional audio track: 2.5MB each (lazy-loaded)
└── Additional nebula assets: 0KB (procedural) OR ~500KB (KTX2)
```

### ⚠️ IDENTIFIED RISKS & LIMITATIONS

**1. Bandwidth Exhaustion (HIGH)**
- **Risk:** Audio library could consume 30% of Vercel free tier
- **Mitigation:** Strict lazy loading, monitor usage weekly
- **Fallback:** Reduce track count or upgrade to Pro if needed

**2. Visual Quality Expectations (MEDIUM)**
- **Reality:** Stylized beauty, NOT Hubble photorealism
- **Action:** Set clear expectations with stakeholders upfront
- **Outcome:** Still beautiful, but artistic interpretation

**3. Mobile Performance (LOW - Secondary Goal)**
- **Reality:** Complex shaders will struggle on mobile GPUs
- **Strategy:** Desktop-first, graceful degradation for mobile
- **Testing:** Mobile as stretch goal, not primary target

**4. Browser Audio Policies (LOW)**
- **Issue:** Safari strict autoplay policies
- **Solution:** User interaction required before playback (standard UX)
- **Implementation:** "Begin Journey" button triggers audio context

### ✅ FINAL TECHNICAL VALIDATION

**Refined Technology Stack:**
```
CORE:
├── Three.js r181 (WebGL only, NO WebGPU)
├── Vite (fast bundler)
├── TypeScript (type safety)
└── Plain CSS (lightweight)

RENDERING:
├── Procedural GLSL shaders (primary)
├── KTX2 textures (fallback, 1K max)
└── Post-processing (UnrealBloomPass, color grading)

AUDIO:
├── MP3 @ 192kbps
├── Lazy-load on demand
└── ~2.5MB per track

DEPLOYMENT:
├── Vercel Free Tier
├── Code splitting
├── Aggressive optimization
└── Optional: Cloudflare CDN wrapper
```

**Verdict:** PROJECT_BRIEF plan is sound. Proceed to Phase 2 (PRD creation) with bandwidth mitigation strategies integrated.

---

**Last Updated:** 2025-11-08T14:30:00+01:00
