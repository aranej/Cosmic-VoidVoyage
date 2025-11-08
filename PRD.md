# Product Requirements Document (PRD)
## Cosmic-VoidVoyage

**Version:** 1.0
**Date:** 2025-11-08
**Status:** Initial Technical Blueprint

---

## 1. Executive Summary

**Vision:** Create an immersive, meditative web experience that transports users on a synchronized first-person journey through deep space to visually stunning nebulae, accompanied by atmospheric music.

**Core Experience:** User selects a destination nebula and soundtrack, then experiences an automated camera flight where the journey duration precisely matches the music length, culminating in a tranquil, awe-inspiring experience.

**Technical Goal:** Push the boundaries of browser-based 3D graphics while maintaining high performance and deploying within Vercel free tier constraints.

---

## 2. Final Technology Stack

### 2.1 Core Framework

| Component | Version | Justification |
|-----------|---------|---------------|
| **Three.js** | r181 (latest stable) | Industry standard for WebGL, excellent performance, massive community |
| **Renderer** | WebGLRenderer | WebGPU confirmed 10x slower in Three.js (Nov 2025); WebGL is production-ready |
| **Build Tool** | Vite 5.x | Fast HMR, excellent tree-shaking, optimized for modern browsers |
| **Language** | TypeScript 5.x | Type safety, better DX, prevents runtime errors |
| **Styling** | Plain CSS (CSS3) | Lightweight, no framework overhead, sufficient for minimal UI |
| **Deployment** | Vercel (Free Tier) | Serverless, excellent DX, 100GB/month bandwidth |

### 2.2 Three.js Ecosystem

```typescript
dependencies: {
  "three": "^0.181.0",           // Core library
  "vite": "^5.0.0",              // Build tool
  "typescript": "^5.3.0"         // Language
}

// Three.js modules to use:
// - WebGLRenderer (NOT WebGPURenderer)
// - EffectComposer + UnrealBloomPass (post-processing)
// - CatmullRomCurve3 (camera path splines)
// - AudioListener + Audio (spatial audio support)
// - ShaderMaterial (custom nebula shaders)
```

### 2.3 Audio Pipeline

**Format:** MP3 @ 192kbps
**Rationale:**
- Universal browser support (Chrome, Firefox, Safari)
- Good compression (2-3MB per 2-3min track)
- Suno AI can export directly to MP3

**Loading Strategy:** Lazy-loading on demand
```typescript
// User selects track → download only that track
// NOT: Preload all 10 tracks (bandwidth waste)
```

### 2.4 Nebula Rendering Strategy

**Primary Approach:** Procedural Generation via GLSL Shaders

**Techniques:**
- Perlin/Simplex noise functions
- Fractal Brownian Motion (fBM) for layered detail
- GPU-based computation (2x faster than CPU)
- Zero bandwidth cost (runtime generation)

**Fallback Approach:** KTX2/Basis Universal Textures (if needed)
- Max resolution: 1K (1024x1024)
- ETC1S codec for compression
- KTX2Loader (built into Three.js)
- Estimated size: ~500KB per texture compressed

**Visual Style:** Stylized Realism
- Artistic interpretation inspired by Hubble imagery
- NOT photorealistic (browser rendering limitations)
- Emphasis on atmosphere, color, and emotional impact

### 2.5 Performance Targets

| Metric | Target | Minimum Acceptable |
|--------|--------|-------------------|
| **FPS** | 60 | 30 |
| **Initial Load Time** | <3s | <5s (on 4G) |
| **Bundle Size (gzipped)** | <800KB | <1MB |
| **Memory Usage** | <500MB | <800MB |
| **GPU** | Mid-range (GTX 1060) | Integrated (Intel Iris) |

---

## 3. Implementation Strategy & Milestones

### Milestone 0: Foundation (Week 1)

**Goal:** Establish development environment and verify deployment pipeline

**Deliverables:**
- ✅ Vite + Three.js + TypeScript project initialized
- ✅ Basic Three.js scene (rotating cube proof-of-concept)
- ✅ Vercel deployment configured and tested
- ✅ Build pipeline optimized (code splitting, tree-shaking)

**Success Criteria:**
- Deploys to Vercel successfully
- Bundle size <500KB (excluding assets)
- Hot reload works locally
- TypeScript compilation error-free

---

### Milestone 1: Core Rendering Engine (Week 2)

**Goal:** Implement procedural nebula generation and camera system

**Tasks:**
1. **Procedural Nebula Shader (M1.1)**
   - Research and adapt Perlin noise + fBM algorithms
   - Create ShaderMaterial with customizable parameters
   - Implement color gradients (Hubble-inspired palettes)
   - Add subtle animation (slow rotation/pulsing)

2. **Camera Flight System (M1.2)**
   - Implement CatmullRomCurve3 spline paths
   - Create camera controller with smooth interpolation
   - Add easing functions (ease-in-out for natural motion)
   - Test path from origin to nebula destination

3. **First Nebula Complete (M1.3)**
   - Design and implement 1 fully-realized nebula
   - Optimize shader performance (target 60fps)
   - Document parameters for future nebulae

**Success Criteria:**
- Single nebula renders at 60fps on target hardware
- Camera smoothly follows spline path
- Visually compelling (stylized but beautiful)

---

### Milestone 2: Audio Synchronization (Week 3)

**Goal:** Implement audio playback with precise flight duration sync

**Tasks:**
1. **Audio System (M2.1)**
   - Implement Web Audio API integration
   - Create lazy-loading audio file manager
   - Add AudioListener to camera
   - Handle browser autoplay policies

2. **Synchronization Logic (M2.2)**
   ```typescript
   // Pseudo-code
   const audioDuration = audio.duration; // e.g., 180s
   const cameraPath = createSplinePath(nebulaPosition);

   function animate(currentTime) {
     const progress = currentTime / audioDuration; // 0 to 1
     const position = cameraPath.getPoint(progress);
     camera.position.copy(position);
     camera.lookAt(nebulaPosition);
   }
   ```

3. **Testing (M2.3)**
   - Verify flight ends exactly when music ends
   - Test with tracks of varying lengths (2min, 3min, 4min)
   - Handle edge cases (audio load failure, user skip)

**Success Criteria:**
- Flight duration matches audio duration within 100ms
- Smooth playback without stuttering
- Works across Chrome, Firefox, Safari

---

### Milestone 3: Content Creation (Week 4)

**Goal:** Create all 5 nebulae and integrate 10 audio tracks

**Tasks:**
1. **Nebula Designs (M3.1)**
   - Design 5 visually distinct nebulae
   - Reference: Carina, Orion, Crab, Horsehead, Eagle (Hubble images)
   - Each with unique color palette and structure
   - Each with unique camera flight path

2. **Audio Integration (M3.2)**
   - Receive 10 MP3 tracks from Suno AI (2-3min each)
   - Verify file sizes (<3MB each)
   - Implement file naming convention
   - Create audio metadata (title, duration)

3. **Flight Path Design (M3.3)**
   - Design unique spline path for each nebula
   - Vary approach angles (side, top, through center)
   - Balance dramatic vs. meditative pacing

**Success Criteria:**
- 5 nebulae fully implemented and performant
- 10 audio tracks integrated
- Each nebula-track combination tested

---

### Milestone 4: User Interface & Interaction (Week 5)

**Goal:** Implement selection UI and user flow

**Tasks:**
1. **Loading Screen (M4.1)**
   - Simple animated loader
   - "Begin Journey" call-to-action
   - Triggers audio context unlock

2. **Selection Interface (M4.2)**
   - Minimalist menu (fade-in on initial load)
   - Nebula selection (5 options with preview thumbnails)
   - Audio track selection (10 options with titles)
   - "Auto-assign track" option (random pairing)
   - "Start Journey" button

3. **Journey Experience (M4.3)**
   - UI fades out completely when journey starts
   - Fullscreen canvas experience
   - Audio begins in sync with camera movement

4. **End State (M4.4)**
   - Smooth fade to black as music ends
   - "Journey Complete" message
   - Options: "Fly Again" | "Choose New Destination"

**Success Criteria:**
- UI is non-intrusive and fades completely
- User flow is intuitive (no instructions needed)
- Works on 1920x1080 and 2560x1440 displays

---

### Milestone 5: Polish & Optimization (Week 6)

**Goal:** Post-processing effects, performance tuning, cross-browser testing

**Tasks:**
1. **Post-Processing (M5.1)**
   - Implement UnrealBloomPass for glow effects
   - Add subtle color grading
   - Optimize pass order for performance

2. **Performance Optimization (M5.2)**
   - Profile with Chrome DevTools
   - Optimize shader complexity (reduce ALU operations)
   - Implement adaptive quality:
     ```typescript
     if (fps < 30) {
       reduceParticleCount();
       lowerBloomResolution();
     }
     ```

3. **Cross-Browser Testing (M5.3)**
   - Test on Chrome, Firefox, Safari (latest versions)
   - Verify audio playback on all platforms
   - Fix Safari-specific issues (if any)

4. **Asset Optimization (M5.4)**
   - Verify bundle size <800KB (gzipped)
   - Verify audio files <3MB each
   - Test lazy-loading behavior

**Success Criteria:**
- Maintains 30+ fps on minimum target hardware
- Works correctly in Chrome, Firefox, Safari
- Total bandwidth per session <10MB (1 nebula + 1 track)

---

### Milestone 6: Deployment & Launch (Week 7)

**Goal:** Production deployment and monitoring setup

**Tasks:**
1. **Production Build (M6.1)**
   - Finalize Vercel configuration
   - Enable compression (gzip/brotli)
   - Configure caching headers
   - Test deployment

2. **Monitoring Setup (M6.2)**
   - Set up Vercel analytics
   - Monitor bandwidth usage
   - Track Core Web Vitals (LCP, FID, CLS)

3. **Documentation (M6.3)**
   - User-facing: Brief "How to Experience" guide
   - Developer: README with setup instructions
   - Maintenance: Known issues and future roadmap

4. **Launch (M6.4)**
   - Deploy to production
   - Share preview link
   - Gather initial feedback

**Success Criteria:**
- Successfully deployed to Vercel free tier
- Monitoring dashboards active
- Documentation complete

---

## 4. Risk Mitigation Strategies

### 4.1 Bandwidth Exhaustion (HIGH RISK)

**Problem:** 100GB/month Vercel limit could be exhausted with modest traffic

**Mitigation:**
1. **Lazy Loading:** Only load selected audio track (saves 27MB per session)
2. **Procedural Nebulae:** Zero texture bandwidth (vs. 50-100MB if using images)
3. **Code Splitting:** Separate routes/features to minimize initial bundle
4. **Monitoring:** Weekly bandwidth usage checks via Vercel dashboard
5. **Fallback Plan:** If approaching limit, consider:
   - Reduce audio quality to 128kbps (smaller files)
   - Reduce track count from 10 to 5
   - Upgrade to Vercel Pro ($20/month, 1TB bandwidth)

**Early Warning Threshold:** Alert if bandwidth >70GB in a month

### 4.2 Visual Quality Expectations (MEDIUM RISK)

**Problem:** Stakeholders may expect Hubble-photo realism (not achievable)

**Mitigation:**
1. **Set Expectations Early:** Share procedural nebula examples during M1
2. **Manage Language:** Use "stylized" and "artistic interpretation" in communications
3. **Showcase Strengths:** Emphasize dynamic, animated, interactive aspects
4. **Reference Examples:** Show similar projects (wwwtyro.net space scenes)

**Communication Template:**
> "These nebulae are artistically inspired by Hubble imagery, using procedural techniques to create a stylized, meditative experience. While not photorealistic, they offer a unique, performant, and emotionally resonant visual journey."

### 4.3 Performance on Lower-End Hardware (MEDIUM RISK)

**Problem:** Complex shaders may struggle on integrated GPUs

**Mitigation:**
1. **Adaptive Quality:**
   ```typescript
   const renderer = detectGPUTier(); // 'high' | 'medium' | 'low'

   if (tier === 'low') {
     particleCount *= 0.5;
     bloomResolution *= 0.5;
     shaderComplexity = 'simplified';
   }
   ```

2. **Performance Budget Enforcement:**
   - Monitor fps in real-time
   - Dynamically reduce quality if fps < 30

3. **Graceful Degradation:**
   - Minimum experience: Simple particle field + audio
   - Still meditative and enjoyable even at low quality

### 4.4 Browser Audio Policies (LOW RISK)

**Problem:** Browsers block autoplay without user interaction

**Mitigation:**
1. **Standard UX Pattern:** "Begin Journey" button unlocks audio context
   ```typescript
   beginButton.addEventListener('click', () => {
     audioContext.resume();
     audio.play();
     startJourney();
   });
   ```

2. **Clear Messaging:** Button text explicitly says "Begin Journey" (not ambiguous)

3. **Tested Pattern:** This is standard practice, very low risk

### 4.5 Mobile Performance (LOW RISK - Secondary Goal)

**Problem:** Mobile GPUs cannot handle complex shaders

**Strategy:** Desktop-first, mobile as stretch goal

**If Mobile Support Desired:**
1. Detect mobile via `navigator.userAgent`
2. Show message: "For the best experience, please visit on desktop"
3. OR: Provide heavily degraded mobile version (minimal particles, no bloom)

**Decision:** Mobile is out of scope for MVP (per PROJECT_BRIEF)

---

## 5. Ongoing Research Protocol

### 5.1 When to Conduct Research

Research should be triggered when:
1. **Implementation Blocker:** Cannot proceed without external information
2. **Performance Issue:** fps <30 on target hardware despite optimization
3. **Browser Compatibility:** Unexpected behavior in Chrome/Firefox/Safari
4. **New Technology:** Relevant Three.js updates or WebGL techniques discovered

### 5.2 Research Process

```
1. Define Specific Question
   ✅ Good: "How to optimize fBM noise for 60fps in fragment shader?"
   ❌ Bad: "How to make shaders faster?"

2. Search Strategy
   - Primary: Three.js docs, examples, forum
   - Secondary: Shadertoy, WebGL resources
   - Tertiary: Stack Overflow, GitHub issues
   - Always check dates (prefer 2024-2025 content)

3. Validate Findings
   - Test in isolated example first
   - Measure performance impact
   - Verify browser compatibility

4. Document Decision
   - Update PROJECT_PLAN.md with timestamp
   - Add code comments explaining approach
   - Note alternatives considered
```

### 5.3 Pre-Approved Research Topics

These topics are known gaps and should be researched as-needed during implementation:

| Topic | Phase | Priority |
|-------|-------|----------|
| Perlin/Simplex noise implementations | M1 | High |
| Camera easing functions | M1 | Medium |
| Web Audio API best practices | M2 | High |
| Safari audio quirks | M2 | Medium |
| GPU tier detection libraries | M5 | Low |
| Bloom pass optimization | M5 | Medium |

---

## 6. Collaboration Protocol

### 6.1 When to Request Manual Input

Create a **GitHub Issue** labeled `[!] Blocked: User Input Required` when:

1. **Manual Asset Delivery:**
   - Example: "Ready to integrate 10 audio tracks from Suno AI"
   - Issue should specify:
     - Format needed: MP3 @ 192kbps
     - Naming convention: `track_01.mp3`, `track_02.mp3`, etc.
     - Placement: `/public/audio/` directory
     - Metadata needed: Track titles for UI

2. **Design Decision:**
   - Example: "Nebula color palette selection"
   - Present 2-3 options with visual examples
   - Request specific selection

3. **Scope Clarification:**
   - Example: "Should mobile support be included in MVP?"
   - Present trade-offs clearly
   - Request yes/no decision

### 6.2 When to Request Technical Help

Create a **GitHub Issue** labeled `[!] Blocked: Technical Issue` when:

1. **Stuck on Implementation:**
   - Describe problem in detail
   - List solutions already attempted
   - Provide minimal reproduction code
   - Formulate specific question

2. **Performance Bottleneck:**
   - Provide profiling data (screenshots from DevTools)
   - Show what optimizations were tried
   - Request suggestions for next steps

3. **Browser-Specific Bug:**
   - Specify browser + version
   - Describe expected vs. actual behavior
   - Provide reproduction steps
   - Note if workaround exists

### 6.3 Issue Template

```markdown
## Issue Type
- [ ] Blocked: User Input Required
- [ ] Blocked: Technical Issue
- [ ] Question

## Context
[Describe what you were trying to accomplish]

## Problem
[Describe the blocker]

## What I've Tried
1. [Attempt 1]
2. [Attempt 2]
3. [Attempt 3]

## What I Need
[Specific, actionable request]

## Deadline Impact
- [ ] Blocking current milestone
- [ ] Blocking future milestone
- [ ] Non-blocking (nice-to-have)
```

### 6.4 Communication Standards

**Response Time Expectations:**
- Blocking issues: Acknowledge within 24 hours
- Non-blocking: Acknowledge within 3 days

**Status Updates:**
- Update `PROJECT_PLAN.md` task status daily
- Add timestamp to each status change
- Use clear status prefixes: `[ ]`, `[>]`, `[x]`, `[!]`

**Radical Honesty:**
- Report problems immediately (don't wait for perfect solution)
- If deadline is at risk, communicate early
- If approach isn't working, propose alternative

---

## 7. Success Criteria (Definition of Done)

The project is considered **successfully completed** when ALL of the following criteria are met:

### 7.1 Functional Requirements
- ✅ 5 distinct nebulae implemented and visually compelling
- ✅ 10 audio tracks integrated with lazy-loading
- ✅ Flight duration precisely syncs with audio duration (<100ms variance)
- ✅ User can select nebula and track via UI
- ✅ "Auto-assign" feature pairs random track with selected nebula
- ✅ Journey starts smoothly with UI fade-out
- ✅ Journey ends with fade-to-black and completion message

### 7.2 Performance Requirements
- ✅ Maintains 30+ fps on mid-range GPU (GTX 1060 equivalent)
- ✅ Initial load time <5 seconds on 4G connection
- ✅ Total bundle size <1MB (gzipped, excluding audio)
- ✅ Single journey session <10MB total bandwidth

### 7.3 Compatibility Requirements
- ✅ Works in latest Chrome (desktop)
- ✅ Works in latest Firefox (desktop)
- ✅ Works in latest Safari (desktop, macOS)
- ✅ Audio plays correctly in all three browsers

### 7.4 Deployment Requirements
- ✅ Successfully deployed to Vercel free tier
- ✅ Accessible via public URL
- ✅ No console errors in production build
- ✅ Monitoring/analytics configured

### 7.5 Documentation Requirements
- ✅ `PROJECT_PLAN.md` updated with final status
- ✅ `README.md` with setup instructions
- ✅ Code comments for complex logic
- ✅ Known issues documented

---

## 8. Future Enhancements (Out of Scope for MVP)

The following features are explicitly **NOT** included in the initial version but may be considered for future iterations:

### 8.1 Interactive Features
- ❌ User-controlled camera during flight
- ❌ Pause/resume journey
- ❌ Speed controls (2x, 0.5x playback)

### 8.2 Advanced Rendering
- ❌ VR/WebXR support
- ❌ Stereoscopic 3D
- ❌ Physics-based particle simulations

### 8.3 Social Features
- ❌ Share specific journey links
- ❌ Social media preview cards
- ❌ User-generated nebula designs

### 8.4 Mobile Optimization
- ❌ Touch controls
- ❌ Mobile-specific UI
- ❌ Gyroscope camera control

### 8.5 Advanced Audio
- ❌ Real-time audio visualization (frequency bars)
- ❌ Spatial audio positioning
- ❌ Beat detection for visual sync

**Rationale for Exclusions:** These features would add significant complexity, increase bundle size, or require mobile optimization work that's beyond the MVP scope. Focus is on delivering a high-quality desktop experience first.

---

## 9. Appendix

### 9.1 Key Technical References

**Three.js Documentation:**
- Official docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Three.js Journey: https://threejs-journey.com/

**Procedural Generation:**
- wwwtyro.net 2D space scenes: https://wwwtyro.net/2016/10/22/2D-space-scene-procgen.html
- Perlin noise tutorial: https://adrianb.io/2014/08/09/perlinnoise.html
- fBM techniques: https://thebookofshaders.com/13/

**Shader Resources:**
- Shadertoy nebula examples: https://www.shadertoy.com/results?query=nebula
- The Book of Shaders: https://thebookofshaders.com/

**Performance:**
- Three.js optimization guide: https://discoverthreejs.com/tips-and-tricks/
- WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

### 9.2 Vercel Configuration

**Recommended `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/audio/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 9.3 Development Environment Setup

**Required:**
- Node.js 18+
- npm 9+
- Modern browser (Chrome/Firefox/Safari latest)
- GPU with WebGL support

**Recommended:**
- VS Code with extensions:
  - Volar (TypeScript + Vue support)
  - GLSL Lint (shader syntax highlighting)
  - Error Lens (inline error display)

**Optional:**
- Git LFS (if using large texture files)
- Lighthouse (performance auditing)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-08T15:00:00+01:00
**Status:** Approved for Implementation
