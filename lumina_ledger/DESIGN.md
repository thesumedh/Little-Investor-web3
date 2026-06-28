---
name: Lumina Ledger
colors:
  surface: '#fbf8fc'
  surface-dim: '#dbd9dc'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf0'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e2e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#45464e'
  inverse-surface: '#303033'
  inverse-on-surface: '#f2f0f3'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4f5e81'
  primary: '#051635'
  on-primary: '#ffffff'
  primary-container: '#1c2b4b'
  on-primary-container: '#8493b8'
  inverse-primary: '#b7c6ee'
  secondary: '#006783'
  on-secondary: '#ffffff'
  secondary-container: '#40ccfd'
  on-secondary-container: '#00546c'
  tertiary: '#20004f'
  on-tertiary: '#ffffff'
  tertiary-container: '#390082'
  on-tertiary-container: '#a67aff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b7c6ee'
  on-primary-fixed: '#0a1a3a'
  on-primary-fixed-variant: '#384668'
  secondary-fixed: '#bde9ff'
  secondary-fixed-dim: '#64d3ff'
  on-secondary-fixed: '#001f2a'
  on-secondary-fixed-variant: '#004d64'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e2e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style
The design system establishes a bridge between the foundational trust of traditional finance and the innovative clarity of modern Web3 education. The personality is "The Guiding Architect"—authoritative and secure, yet inherently accessible and optimistic. 

The visual style is **Corporate Modern with Web3 accents**. It prioritizes extreme legibility and "calm" interfaces to lower the barrier to entry for complex blockchain concepts. High-quality whitespace is used as a functional tool to reduce cognitive load, while subtle glassmorphism and vibrant accents signal the technological nature of the platform. The goal is to evoke a sense of "safe exploration" where the user feels empowered rather than intimidated.

## Colors
This design system utilizes a high-contrast palette to distinguish between platform structure and educational progression.

- **Primary (Deep Trust Blue):** Used for navigation, headers, and heavy text to establish institutional authority.
- **Secondary (Stellar Blue):** The main action color. Used for primary CTAs, links, and "Active" states.
- **Tertiary (Smart Purple):** Specifically reserved for blockchain-specific elements, smart contract interactions, and technical concepts.
- **Accent (Achievement Gold):** Used sparingly for rewards, certificates, and gamification milestones to drive positive reinforcement.
- **Neutrals:** A range of cool grays (Slate) provides the background structure, ensuring the interface feels airy and modern.

## Typography
The typography strategy balances friendly approachability with technical precision. 

**Plus Jakarta Sans** is used for headlines to provide a soft, welcoming entry point. Its slightly rounded terminals remove the coldness typically associated with financial institutions. **Inter** is the workhorse for body copy, chosen for its exceptional readability in long-form educational content. **Geist** is introduced for labels, data points, and wallet addresses to provide a "developer-friendly" monospaced feel that confirms the technical accuracy of the data being presented.

## Layout & Spacing
The layout follows a **Fluid Grid** system with strict adherence to an 8px spatial rhythm. 

- **Desktop:** A 12-column grid with a 1280px max-width container. Large 80px gaps between vertical sections ensure concepts have "room to breathe," preventing the user from feeling overwhelmed by dense information.
- **Tablet:** 8-column grid with 24px margins. Content cards typically stack 2-up.
- **Mobile:** 4-column grid with 16px margins. All primary actions (like "Connect Wallet") are pinned or promoted to full-width for ease of thumb-access.

Vertical rhythm is prioritized over horizontal density; educational modules should use generous internal padding (32px+) to isolate ideas.

## Elevation & Depth
Depth is signaled through **Ambient Shadows** and **Tonal Layers**, avoiding harsh borders to maintain a friendly aesthetic.

- **Level 1 (Base):** Neutral background (#F8FAFC).
- **Level 2 (Cards):** Pure white background with a very soft, large-radius shadow (Y: 4px, Blur: 20px, Opacity: 4% Primary Blue). This makes the learning modules feel light and elevated.
- **Level 3 (Popovers/Modals):** Subtle backdrop blur (12px) with a 1px semi-transparent border (#FFFFFF33) to create a glassmorphic effect, suggesting the "transparency" of the blockchain.
- **Interactive Depth:** Buttons should use a slight 2px Y-axis lift on hover rather than changing color significantly, maintaining the tactile feel of a physical learning tool.

## Shapes
The shape language is consistently **Rounded**, using a 12px base radius for standard elements.

- **Cards & Content Blocks:** 16px (rounded-lg) to emphasize the soft, approachable EdTech vibe.
- **Buttons & Inputs:** 12px (standard) to provide a modern, friendly touchpoint.
- **Success/Progress Indicators:** Full pill-shaped (rounded-xl) to feel organic and rewarding.
- **Data Visualizations:** Graphs and progress bars should use rounded caps to avoid sharp, clinical edges.

## Components

- **Buttons:** Primary buttons use a solid Stellar Blue fill with white text. The "Connect Wallet" CTA is a distinct component—using the Primary Deep Blue with a Tertiary Purple subtle glow effect to highlight its unique function.
- **Progress Indicators:** Linear bars for lesson progress should use a dual-tone approach (Light Gray track / Stellar Blue fill). Achievement progress uses the Gold accent.
- **Educational Cards:** Must contain a 32px padding. Headers within cards use Plus Jakarta Sans Bold. Include a "Time to Read" label in the top right using the Geist font.
- **Inputs:** High-affordance fields with 12px rounding. Active states use a 2px Stellar Blue stroke. Errors are displayed in a soft red with a supporting icon.
- **Chips/Tags:** Used for "Level" (Beginner, Intermediate) or "Topic" (DeFi, NFTs). These use low-saturation versions of the primary/tertiary colors with high-contrast text.
- **Wallet Connection Status:** A persistent, small pill in the navigation bar. When disconnected, it pulses slightly in Stellar Blue; when connected, it shows a truncated Geist-font address with a green "online" dot.