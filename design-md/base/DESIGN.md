---
version: alpha
name: Base-brand-design-analysis
description: "Base brand guidance distilled from brand.base.org with an Apple-native typography adaptation: a grayscale-first, square-led onchain identity anchored by pure RGB Base Blue (#0000ff), SF Pro-style system typography, compact rounded UI chrome, and motion that resolves around the Square rather than decorative effects."

colors:
  primary: "#0000ff"
  primary-print: "#0033a0"
  canvas: "#ffffff"
  ink: "#0a0b0d"
  ink-soft: "#323232"
  surface-soft: "#fafafa"
  surface-subtle: "#f7f7f7"
  surface-raised: "#f2f2f2"
  hairline-soft: "#eef0f3"
  hairline: "#dee1e7"
  hairline-strong: "#b1b7c3"
  text-muted: "#717886"
  text-subtle: "#5b616e"
  gray-0: "#ffffff"
  gray-10: "#eef0f3"
  gray-15: "#dee1e7"
  gray-30: "#b1b7c3"
  gray-50: "#717886"
  gray-60: "#5b616e"
  gray-80: "#32353d"
  gray-100: "#0a0b0d"
  cerulean: "#3c8aff"
  tan: "#b8a581"
  yellow: "#ffd12f"
  green: "#66c800"
  lime: "#b6f569"
  red: "#fc401f"
  pink: "#fea8cd"
  selection-bg: "#d3e1ff"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  dark-canvas: "#0b0c0d"
  dark-page: "#111111"
  dark-surface: "#181818"
  dark-control: "#242424"
  dark-text: "#ededed"
  dark-muted: "#9b9b9b"
  dark-hairline: "rgba(255,255,255,0.08)"
  dark-blue-dim: "#00125c"
  app-backdrop: "#1d1d1f"
  app-surface: "#f3f5f8"
  app-surface-hover: "#eef1f5"
  app-success: "#16c852"
  app-warning: "#ff9f0a"
  app-error: "#f56a2a"
  app-cyan: "#1ec5f4"
  app-yellow: "#ffd51a"

typography:
  fontStacks:
    sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"
    text: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"
    mono: "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Consolas, monospace"
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
  display-xl:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 80px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.03em
  display-lg:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.03em
  display-md:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.03em
  display-sm:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  title-lg:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  title-md:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.025em
  body-lg:
    fontFamily: "{typography.fontStacks.text}"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "{typography.fontStacks.text}"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  body-sm:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.01em
  label-mono:
    fontFamily: "{typography.fontStacks.mono}"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.055rem
    textTransform: uppercase
  mono-md:
    fontFamily: "{typography.fontStacks.mono}"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: 0
  system-display:
    fontFamily: "{typography.fontStacks.display}"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.03em
    textTransform: uppercase
  button:
    fontFamily: "{typography.fontStacks.sans}"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: 0

rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 24px
  pill: 100px
  full: 9999px
  square-mark: "5% radius with 60% smoothing"

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 96px
  side-nav: 215px

motion:
  standard-ease: "cubic-bezier(0.4, 0, 0.2, 1)"
  feedback-duration: "120ms-240ms"
  expressive-duration: "600ms-800ms"
  max-logo-runtime: "1000ms"
  type-scramble-duration: "under 800ms"
  intro-outro-duration: "under 800ms"
  square-led: true
  allowed-patterns:
    - "tech-scramble"
    - "square-wipe"
    - "center-burst"
    - "grid-mosaic"
    - "simple-slide"
    - "lower-third"
  forbidden-patterns:
    - "motion blur"
    - "wrong curves or slow speed"
    - "distorted square"
    - "3D logo rotation"

components:
  side-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    width: "{spacing.side-nav}"
    itemRounded: "{rounded.md}"
    itemPadding: "10px"
  nav-link-hover:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: 36px
  button-neutral:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: 36px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "9px 15px"
  hero-editorial:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section}"
  section-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  image-frame:
    backgroundColor: "{colors.surface-soft}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  spec-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
  color-swatch:
    rounded: "{rounded.md}"
    minHeight: 112px
    labelTypography: "{typography.label-mono}"
  square-mark:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.square-mark}"
    aspectRatio: "1 / 1"
  square-icon-on-white:
    backgroundColor: "{colors.canvas}"
    foregroundColor: "{colors.primary}"
    iconScaleSquareCanvas: "60%"
    iconScaleCircularMask: "50%"
  basemark:
    foregroundColor: "{colors.primary}"
    grid: "1 by 1; strokes 40% from each edge; 10% corner clearance"
  logotype-lockup:
    foregroundColor: "{colors.ink}"
    squareColor: "{colors.primary}"
    spacing: "3x the lowercase b stem"
  partnership-lockup:
    foregroundColor: "{colors.ink}"
    spacing: "1.5x the lowercase b vertical stem"
    alignment: "optically match partner logo to logotype x-height"
  type-sample-card:
    backgroundColor: "{colors.surface-soft}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  motion-stage:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    choreography: "Square-led movement with one transition style per story"
  onboarding-screen:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    backdropColor: "{colors.app-backdrop}"
    primaryAction: "{components.button-primary}"
    inputBackground: "{colors.surface-soft}"
    inputRounded: "{rounded.md}"
    validation: "blue focus, red error, green success"
  onboarding-art-panel:
    backgroundColor: "{colors.app-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    aspectRatio: "1 / 1.18"
    treatment: "bright color field, halftone texture, glassy floating app/object cards"
  wallet-home:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    actionTileBackground: "{colors.app-surface}"
    actionTileRounded: "{rounded.lg}"
    activeNavColor: "{colors.primary}"
  send-flow:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    amountTypography: "{typography.title-lg}"
    assetPillBackground: "{colors.surface-soft}"
    slideTrackBackground: "{colors.app-surface}"
    slideThumbColor: "{colors.primary}"
  product-screen-gallery:
    source: "Base iOS Onboarding screenshots"
    frame: "full-height iOS screenshots on white"
    keyStates: "splash, welcome, email, code, loading, username, wallet-empty"
    treatment: "show real app screenshots before recreating product chrome"
  dark-editorial-page:
    backgroundColor: "{colors.dark-canvas}"
    textColor: "{colors.dark-text}"
    mutedTextColor: "{colors.dark-muted}"
    borderColor: "{colors.dark-hairline}"
    navMark: "white Square"
    primaryAction: "{components.button-primary}"
    secondaryActionBackground: "{colors.dark-control}"
  dark-vision-hero:
    backgroundColor: "{colors.dark-canvas}"
    textColor: "{colors.dark-text}"
    visualTexture: "vertical blue bar topography over black"
    labelColor: "{colors.cerulean}"
    headlineTypography: "{typography.display-md}"
  dark-cta-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    visualTexture: "white, yellow, and dark-blue vertical bar topography"
  app-marketing-rail:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    width: 400px
    logoSize: 56px
    headlineTypography: "70px / 400 / 92% / -5%"
    cta: "{components.button-primary}"
  app-feature-module:
    backgroundColor: "{colors.canvas}"
    copyWidth: 340px
    imageSize: 364px
    imageRounded: "{rounded.xl}"
    titleTypography: "34px / 400 / 103%"
    bodyTypography: "16px / 400 / 122%"
  footer-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    linkTypography: "{typography.label-mono}"
    padding: "{spacing.3xl}"
---

## Overview

Base is a public, builder-facing crypto brand with a deliberately simple visual grammar: white canvas, black or near-black type, pure RGB Base Blue, and a square as both symbol and system. This kit keeps the Square, Base Blue, and restrained grayscale hierarchy, but uses Apple-native system typography so the product surfaces feel closer to the supplied iOS screenshots.

The page should feel open, direct, and human. It is not a dense exchange dashboard, not a neon crypto interface, and not a gradient-heavy web3 brand. It is closer to a clean design manual: sparse sections, hard-working type, rounded square geometry, spec chips, image frames, and direct copy about building, creating, owning, and earning onchain.

Key characteristics:
- Pure RGB Base Blue (`{colors.primary}` / `#0000ff`) is the anchor, but it should be used sparingly. A mostly grayscale layout should outweigh blue.
- The Square is the core identity device. It can be an icon, product frame, visual grid, motion anchor, or sign-off.
- Apple system sans carries the product voice; SF Mono carries metadata, code, labels, and developer-facing moments.
- Secondary color is allowed for marketing and social expression, but only after black, white, gray, and blue have done the structural work.
- Avoid gradients, opacity stacking, motion blur, heavy shadows, and generic crypto glow effects.

## Colors

### Core Palette

| Token | Hex | Role |
|---|---:|---|
| `{colors.primary}` | `#0000ff` | Base Blue, the screen-native brand anchor. Use for the Square, primary identity moments, and occasional highest-priority actions. |
| `{colors.ink}` | `#0a0b0d` | Deep black from the master palette. Use for headline text, dark bands, and monochrome marks. |
| `{colors.canvas}` | `#ffffff` | Default page ground and logo clear space. |
| `{colors.gray-10}` | `#eef0f3` | Soft field, disabled surface, quiet background. |
| `{colors.gray-15}` | `#dee1e7` | Hairline, divider, input border. |
| `{colors.gray-30}` | `#b1b7c3` | Disabled text, pale icon state. |
| `{colors.gray-50}` | `#717886` | Muted text and secondary metadata. |
| `{colors.gray-60}` | `#5b616e` | Body-muted text. |
| `{colors.gray-80}` | `#32353d` | Deep gray surface, dark UI relief. |
| `{colors.gray-100}` | `#0a0b0d` | Deepest brand black. |

The live brand site also uses utility UI neutrals: `{colors.surface-soft}` `#fafafa`, `{colors.surface-subtle}` `#f7f7f7`, and `{colors.surface-raised}` `#f2f2f2` for card fills, nav hovers, and code/spec panels.

### Secondary Palette

| Token | Hex | Role |
|---|---:|---|
| `{colors.cerulean}` | `#3c8aff` | Cool secondary accent for expressive marketing compositions. |
| `{colors.tan}` | `#b8a581` | Muted balancing color when vibrant colors are present. |
| `{colors.yellow}` | `#ffd12f` | High-energy accent, sparingly. |
| `{colors.green}` | `#66c800` | Secondary accent, not a product success state by default. |
| `{colors.lime}` | `#b6f569` | Bright accent for novelty/social uses. |
| `{colors.red}` | `#fc401f` | Urgency accent, not a default error token unless product confirms. |
| `{colors.pink}` | `#fea8cd` | Soft expressive accent. |

Secondary color rules:
- Use one to three vibrant secondary colors at most.
- Pair vibrant color with at least one muted color.
- Use secondary color in supporting graphics, campaigns, social, and novelty moments.
- Do not lead core web or product communications with secondary color.

Print note: Base Blue is screen-native RGB `0 0 255`; for print, the guide maps it to PMS 286 / `{colors.primary-print}`. Several secondary colors also shift in print. Do not assume the screen hex is always the print value.

### Accessibility

Base Blue on white, and white on Base Blue, pass AA contrast for large display use. For normal body text, prefer `{colors.ink}` on `{colors.canvas}` or `{colors.on-primary}` on `{colors.primary}` only when the text is sufficiently large and bold. Do not rely on low-opacity blue or pale gray for essential text.

### Dark Editorial Mode

The `base.org/vision` page adds a dark editorial mode that is distinct from the white brand-guide and iOS product surfaces. Use it for vision, ecosystem, developer, and campaign pages where Base needs to feel expansive and institutional without becoming glossy or crypto-styled.

Observed dark-mode structure:
- Page background is near-black: body around `{colors.dark-page}` `#111111`, hero sections around `{colors.dark-canvas}` `#0b0c0d`.
- Primary text is off-white `{colors.dark-text}` `#ededed`; secondary copy is muted gray around `{colors.dark-muted}`.
- Dividers are almost invisible white hairlines: `{colors.dark-hairline}` `rgba(255,255,255,0.08)`.
- The nav mark flips to a white Square. Nav links stay white and compact; the main `Get Started` control becomes a white pill with black text.
- Hero composition is centered and spacious: small blue label, large white headline, then one blue primary CTA and one dark secondary CTA.
- The dark visual texture is not a glow. It is vertical bar topography: thin Base Blue bars, dim blue bars, and occasional white bars arranged like a digital landscape.
- Content sections use a narrow centered measure. Section labels and numbered rows sit on the same dark canvas with subtle dividers and generous vertical spacing.
- The page can finish with a full Base Blue CTA band, still using the vertical-bar landscape but switching the bars to white, yellow, and dim blue accents.

Dark-mode rules:
- Prefer dark mode for editorial/vision pages, not for the default iOS app screenshots unless the product source shows it.
- Keep blue concentrated in CTAs, labels, active links, and bar textures.
- Do not add neon bloom, blur, radial glows, or glass panels. The page should feel sharp and flat.
- Do not invert every light component mechanically. Re-compose hierarchy around fewer surfaces, stronger whitespace, and low-contrast dividers.
- Pair dark pages with one bold blue CTA band only when there is a clear conversion moment.

## Typography

### Font Families

Primary typeface for this kit: **Apple system sans**. In CSS, use `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`. This gives the Base app surfaces a native iOS feel that matches the provided onboarding screenshots.

Use **SF Pro Display-style rendering** for large headlines and **SF Pro Text-style rendering** for paragraphs and compact product UI. On non-Apple platforms, the stack falls back to Helvetica Neue / Arial while preserving the same spacing rules.

Companion typeface: **SF Mono**. Use it for metadata, code blocks, labels, dates, technical captions, and developer-facing display moments.

Do not use Doto in this adaptation. Keep display moments in the Apple sans stack so the UI stays native and product-led.

Fallback stack:
- Apple sans -> `-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text`, `Helvetica Neue`, `Arial`, `sans-serif`.
- Apple mono -> `SF Mono`, `SFMono-Regular`, `ui-monospace`, `Menlo`, `Consolas`, `monospace`.

Implementation note: do not ship custom font files for this version. Let the operating system provide the Apple-like typeface stack.

### Type Hierarchy

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---:|---:|---:|---:|---|
| `{typography.display-xl}` | 80px | 500 | 100% | -3% | First-screen brand statements, hero headlines. |
| `{typography.display-lg}` | 72px | 500 | 100% | -3% | Major section heads and campaign statements. |
| `{typography.display-md}` | 56px | 500 | 100% | -3% | Secondary hero or large feature headline. |
| `{typography.display-sm}` | 40px | 500 | 105% | -3% | Compact hero, page h1 on tablet. |
| `{typography.title-lg}` | 32px | 500 | 105% | -3% | Card group titles and feature headers. |
| `{typography.title-md}` | 24px | 500 | 120% | -2.5% | Section subtitles and card titles. |
| `{typography.body-lg}` | 18px | 400 | 140% | 0 | Lead body copy. |
| `{typography.body-md}` | 16px | 400 | 130% | 0 | Default body copy. |
| `{typography.body-sm}` | 14px | 400 | 130% | +1% | Navigation and small UI copy. |
| `{typography.label-mono}` | 11px | 400 | 140% | 0.055rem | Uppercase chips, spec labels, footers. |
| `{typography.mono-md}` | 16px | 300 | 100% | 0 | Dates, code-like display, developer labels. |
| `{typography.system-display}` | 48px | 700 | 100% | -2% | Short Apple-native display moments. |
| `{typography.button}` | 15px | 500 | 114% | 0 | Buttons and compact commands. |

Apple-native type-system examples:
- XL headline: SF Pro Display-style, 500, -3% kerning, 100% leading.
- Large subheadline: SF Pro Display-style, 400, -2% kerning, 120% leading.
- Article headline: SF Pro Display-style, 500, -2% kerning, 110% leading.
- Date/metadata: SF Mono, 300-400, 0% kerning, 100% leading.
- Body: SF Pro Text-style, 400, 0% kerning, 130%-140% leading.
- Product lockup: Apple sans 700 at -2% tracking paired with SF Mono 300-400 at 0 tracking.

### Type Principles

- Display type uses tight negative tracking, usually around `-0.03em`.
- Use medium weight for most large Apple sans headlines. Reserve bold/black for short display moments, not default page headings.
- Use the text stack for paragraphs; keep paragraphs at 130%-140% leading.
- Body copy stays normal-tracked and plain. Clarity matters more than attitude.
- Headlines can be large but should feel direct, not bombastic.
- SF Mono is for structural metadata and code-adjacent tone. Do not set long body copy in mono.
- Keep tabular figures for data columns and balances.
- Turn discretionary ligatures off in code and metadata contexts.
- Do not reintroduce Doto unless the target surface is explicitly a brand-guideline or campaign surface instead of the iOS-style product UI.

## Identity Elements

### The Square

The Square is both icon and interface. It represents a canvas, a frame, and a beacon for the Base community. Use it to say "Base lives here" without words.

Rules:
- Shape uses 5% corner radius with 60% smoothing.
- Valid fills are Base Blue, white, or black.
- App icons place the blue Square on white.
- In a square canvas, the icon should occupy 60% of height.
- In a circular mask, reduce the icon to 50% of height.
- When placed on photography, add a 4px white keyline.
- Do not use gradients, secondary colors, opacity, shadows, bevels, or distortions on the Square.

### Basemark

The Basemark is the Square in motion: four outward-pointing square strokes implying growth. Use it for merch, expressive layouts, and situations where the logotype is too literal.

Rules:
- Keep it on a 1 by 1 grid.
- Strokes sit 40% in from each edge with 10% corner clearance.
- Match the Square's 5% radius and 60% smoothing.
- Use only Base Blue, white, or black.
- Do not rotate, break apart, rearrange, or fill with secondary colors.

### Logotype

The logotype spells `base` in lowercase. It should feel approachable, modern, and code-native.

Rules:
- Default to the locked-up logotype for recognition.
- Square-to-word spacing equals 3 times the width of the lowercase `b` stem.
- Keep safe space equal to the Square on all sides.
- The Square can decouple from the logotype only in approved dynamic layouts.
- Never place the Square to the right of the logotype.
- Do not type your own wordmark, adjust spacing, resize elements independently, or alter colors.

### Partnerships

Partnership lockups must honor both brands while staying inside the Base toolkit.

Rules:
- Use the logotype lockup when Base owns the initiative.
- Invert the order when Base supports a partner launch.
- Match optical weight, not literal size.
- Partnership spacing equals 1.5 times the vertical stem of the lowercase `b`.
- Align the partner logo optically to the Base logotype x-height.

### Official Assets

Use the official files from `_base-brand.zip` when exact marks matter:
- `assets/base-square-blue.svg` for the Square.
- `assets/base-basemark-blue.svg` for the Basemark.
- `assets/base-lockup-2color.svg` for the two-color lockup.

The copied SVGs keep the official geometry and use `blue` as the fill, which resolves to pure RGB Base Blue. Do not redraw these marks in app code unless the implementation is a dynamic animation that lands on the same geometry.

## Sub-Brands

Sub-brands are "rooms in one house": distinct product pillars with shared foundations. They are functional branches, not campaign slogans.

Rules:
- Naming pattern is `base` plus a descriptor: Base App, Base Builders, Base Pay, and future services.
- The descriptor stays lowercase in visual lockups and is followed by the Square.
- Base App can speak more warmly to everyday users; Base Builders can speak more technically to developers.
- Typography, color, Square geometry, and motion remain constant across the family.
- Differentiation comes from content tone and motion, not from new logos, new palettes, or campaign-only graphics.
- Abstract lockups may use the Square or Basemark instead of the spelled-out logotype when the Base context is already clear, such as inside products or social channels.

## Layout

### Spacing System

Base spacing follows a 4px unit. The most common UI increments are 8px, 12px, 16px, 24px, 32px, 48px, 64px, and 96px.

Use:
- 8px for compact nav item interiors.
- 16px for small card padding and gaps.
- 24px for normal card padding and grid gutters.
- 32px for feature grids and larger gaps.
- 64px for dense section rhythm.
- 96px for major editorial bands.

### Grid

The brand site uses a desktop side rail of about 215px and a main content area capped within a 1920px page shell. Product and marketing pages should not copy the side rail unless they are guide/documentation surfaces. For application UI, use the same DNA through:
- White or near-white page canvas.
- 12-column or simple 2-column grids.
- Cards framed by hairlines, not heavy shadows.
- Large open blocks of whitespace.
- Square or rounded-square modules.

### Whitespace

Whitespace is part of the identity. Let black, white, gray, and the Square do most of the work. If a screen feels flat, first improve hierarchy, alignment, and spacing before adding color, gradients, or shadow.

## Components

### Navigation

`side-nav` is the guide-site pattern: sticky left rail, 215px wide, white background, small Apple sans links, 8px rounded hover cells, and a Square/logotype animation at the top.

For product or marketing pages, simplify it into a top nav:
- Base lockup left.
- Minimal text links.
- Neutral or blue CTA right.
- Avoid crowded crypto-style utility bars.

### Buttons

`button-primary`: Base Blue rectangular button with 8px radius, 15px / 500 Apple sans, 36px height, and 10px by 16px padding. Use for the one highest-priority action in a section.

`button-neutral`: Soft gray button with black text. Use for secondary actions, downloads, filters, and guide controls.

`button-outline`: Transparent with a 1px gray hairline. Use when a button should be visible but not compete with the primary action.

Button guidance:
- Prefer compact 8px rounded rectangles over oversized pills for guide/product chrome.
- Use blue sparingly. Most buttons can be neutral.
- Do not create gradient buttons.

### Cards And Frames

`section-card`: White surface, 1px hairline, 12px radius, 24px padding.

`image-frame`: Near-white surface, 1px hairline, 8px radius, 16px padding. Use for brand examples, diagrams, app screenshots, and visual samples.

`type-sample-card`: Near-white panel with a mono spec chip at top and live type sample below.

Cards should feel like frames in a design manual. Use borders and spacing, not shadows, as the main separation.

### Chips And Labels

`spec-chip`: Small rounded chip, soft gray background, uppercase SF Mono, 11px, 0.055rem tracking. Use for labels such as `primary typeface`, `color`, `headline: medium / kerning -3%`.

Labels should be functional metadata. Avoid decorative tags that say nothing.

### Color Swatches

Swatches should be square or rounded-square blocks with the color name, hex, and RGB. Keep values locked. Do not interpolate shades unless the brand/product team has approved the token.

### Identity Marks

`square-mark`: A blue square with 5% radius. Use for icons, anchors, loading states, and motion start/end points.

`basemark`: Four square-derived strokes on a 1:1 grid. Use when a layout benefits from an abstract identity cue.

`logotype-lockup`: Lowercase `base` with the Square. Use as default brand recognition.

### Product And Onboarding UI

The provided Base iOS Onboarding screenshots are the product source of truth for this kit. Do not approximate the product with generic crypto cards when these states are available. The app is stark, white, native-feeling, and uses blue as action/focus rather than decoration.

Core product screens:
- `00 Splash`: white iOS canvas, status bar, centered Base Blue rounded Square, black home indicator.
- `01 Welcome`: dithered/pixel map texture behind a soft blue gradient Square, title "Welcome to Base", gray subtitle, gray `Sign In`, blue `Create Account`, and tiny legal copy.
- `02 Email Empty`: back chevron, large `Enter your email` title, gray helper copy, oversized pale input with gray placeholder, disabled blue `Next`.
- `03 Email Filled`: same email screen with stronger input text, active blue `Next`, and optional blue `Use passkey instead` inline link.
- `04 Code Empty`: `Let's confirm it's you`, six pale rounded code slots, first slot blue focused, resend timer, gray warning card, native numeric keyboard.
- `05 Code Filled`: six large digits in pale slots, active blue `Resend`, warning card, native numeric keyboard.
- `06 Loading`: same white stage with only a centered black spinner.
- `07 Username Focus`: `Choose username`, big `.base.eth` input with blue focus ring, checked `Personalized Offers`, disabled `Claim`, native keyboard.
- `08 Username Error`: orange field ring and inline orange validation message, with the rest of the layout unchanged.
- `09 Username Success`: green field ring and green confirmed basename message, with active blue `Claim`.
- `10 Wallet Empty`: wallet home with yellow avatar, `Wallet` title, QR/chat icons, centered `$0.00`, four soft action tiles, APY promo card, tabs, filter chips, empty state, and bottom nav with Base Blue active icon.

Product UI rules:
- Keep page backgrounds white. Use pale gray only for fields, cards, key slots, action tiles, and disabled surfaces.
- Use oversized headings and controls on onboarding. The hierarchy comes from scale and whitespace, not added decoration.
- Blue means brand mark, primary action, focus, checkbox, and active navigation. Do not wash the full screen in blue.
- Validation colors are product-specific: blue focus, orange error, green success.
- Native keyboards and iOS status/home affordances matter in these references; preserve that native feeling when recreating flows.
- On signed-in wallet screens, reduce the art. Favor dense utility: balance, tiles, tabs, chips, rows, empty states, and bottom nav.

`join.base.app` is the marketing layer, not the in-app product UI. It can still inform acquisition pages through its large app icon, direct "Built to trade" copy, feature modules, QR download block, and product imagery, but app-flow recreations should start from the iOS screenshots above.

## Motion

Motion should feel lightweight, snappy, and purposeful. Every animation should communicate a state change, reveal hierarchy, or reward an action. The live guide treats motion as a first-class identifier, not as decoration.

Principles:
- Use one shared ease: `{motion.standard-ease}`.
- UI feedback should land in `{motion.feedback-duration}`.
- Expressive type/square transitions should stay under `{motion.expressive-duration}`.
- Logo variants should stay under `{motion.max-logo-runtime}`.
- Motion often begins or ends with the Square.
- Prefer quick fade, slide, square-wipe, grid-mosaic, and type-scramble patterns.
- Add small bounces or subtle overshoot only when they clarify feedback.
- Extend duration for scale changes instead of inventing new curves.
- Every motion sequence should land back on the baseline/grid before interaction resumes.

Type-scramble:
- Reveal text through cascading vertical glyph swaps.
- Use for product headlines, social teasers, and keynotes.
- Do not use for body copy.
- Keep medium weight for readability.
- Keep the sequence under `{motion.type-scramble-duration}`.
- Pair the headline resolve with a quick fade-in of supporting content so hierarchy stays clear.

Logotype motion:
- The logotype may scramble, rotate slightly, or momentarily morph into icons before snapping back to `base`.
- Tracking and baseline must stay constant.
- Expressive variants are for launches, live streams, and social teasers.
- Routine UI should use a simpler slide-in or fade.
- Do not distort letterforms beyond 10 degrees.
- Total logo runtime must stay under `{motion.max-logo-runtime}`.

Intro and outro presets:
- `square-wipe`: content slides on as the Square travels left to right.
- `center-burst`: the Square expands to full bleed, then collapses to reveal the next scene.
- `grid-mosaic`: nine mini Squares flip to expose new artwork.
- `type-scramble`: the headline resolves first, UI elements follow with a fade.
- Use one transition style per story.
- Keep intro/outro sequences under `{motion.intro-outro-duration}`.

Live guide motion references:
- Homepage and section cards: `/videos/motion/motion.webm`.
- Wordmark: `/videos/motion/Wordmark_TEST_07_large.webm`.
- Type scramble: `/videos/motion/TYPE_TEST_11_BRANDGUIDELINE.webm`, `TYPE_TEST_16_BRANDGUIDELINE.webm`, `TYPE_TEST_18_BRANDGUIDELINE.webm`, `TYPE_TEST_20_BRANDGUIDELINE.webm`.
- Square system: `/videos/motion/the-square-1.webm` through `the-square-8.webm`.
- Logotype: `/videos/motion/logotype-1.webm` through `logotype-4.webm`.
- Intro/outro: `/videos/motion/intro-outro-1.webm` through `intro-outro-4.webm`.
- Misuse: `/videos/motion/misuse-1.webm` through `misuse-4.webm`.

Misuse:
- No motion blur.
- No wrong curves or slow theatrical easing.
- No distorted Square.
- No 3D rotation.

## Voice And Copy

Base copy is clear, direct, optimistic, and conversational. It should make onchain concepts feel accessible.

Writing rules:
- Say "Base" whenever possible.
- Use `onchain`, not `on-chain`, `on chain`, or `On Chain`.
- Avoid `web3`; use `crypto` sparingly.
- Use active voice.
- State the benefit first, the tech second.
- Use concrete examples over abstract protocol language.
- Celebrate builders, creators, communities, and practical use cases.
- Keep sentences brief and punchy.
- Use title case for headlines.
- Use the Oxford comma.
- Use minimal emojis: one at most.

Avoid:
- Financial gain language, investment framing, high-yield claims, leverage, or profit promises.
- Specific token promotion unless there is a clear utility context.
- Unverified superlatives such as "the best" or "the first".
- Aggressive all-caps marketing.
- Unsupported data.
- Focusing on Coinbase instead of Base.
- Negative competitor comparisons.

## Depth And Elevation

Base is mostly flat. Depth is created through canvas shifts, hairline borders, strong spacing, and identity scale.

| Level | Treatment | Use |
|---|---|---|
| Flat | No border, no shadow | Page canvas, hero text blocks. |
| Hairline | 1px `{colors.hairline}` | Cards, image frames, dividers, inputs. |
| Soft surface | `{colors.surface-soft}` or `{colors.surface-raised}` | Spec panels, hover cells, code/text samples. |
| Identity scale | Large Square, Basemark, or logotype | Hero and campaign emphasis. |

Avoid:
- Heavy drop shadows.
- Glassmorphism.
- Opacity layering.
- Bevels.
- Decorative gradients.
- Glow effects.

## Responsive Behavior

| Breakpoint | Width | Behavior |
|---|---:|---|
| Mobile | < 640px | Single column, top nav instead of side rail, 44px minimum touch targets, display-xl collapses to 40px-48px. |
| Tablet | 640px-1024px | 2-column grids allowed, hero type 48px-64px, cards keep 16px-24px padding. |
| Desktop | 1024px-1536px | Full grid, optional side rail for guide surfaces, 72px-80px display type. |
| Wide | > 1536px | Content remains capped; do not let text lines become too long. Brand visuals can scale in the margins. |

Touch targets:
- Buttons should be at least 36px high in dense desktop UI and 44px on touch screens.
- Square icons smaller than 32px need padded hit areas.
- Nav rows should keep at least 8px vertical padding.

## Do's And Don'ts

### Do

- Lead with grayscale, whitespace, and clean hierarchy.
- Use Base Blue as the identity anchor, not as a flood fill.
- Keep the Square, Basemark, and logotype geometrically consistent.
- Use Apple system sans for almost everything.
- Use SF Mono for labels, dates, code, and developer metadata.
- Put secondary color in supporting graphics after the core palette is established.
- Make copy human, concrete, and useful.

### Don't

- Do not lead with gradients in core communications.
- Do not make secondary colors the hero of a page.
- Do not overuse Base Blue on product or web UI.
- Do not distort, recolor, shadow, or bevel the Square.
- Do not create your own Square or type your own wordmark.
- Do not use motion blur or 3D rotate the identity.
- Do not use crypto cliches, neon glow, glass cards, or trading-dashboard clutter.
- Do not hide weak hierarchy behind decorative effects.

## Agent Prompt Guide

Use this when asking an AI agent to build in the Base brand language:

> Build a Base-inspired interface using a white canvas, deep black text, restrained gray surfaces, and pure Base Blue (#0000ff) only for the identity mark and the highest-priority action. Use Apple system sans (`-apple-system`, SF Pro-style) for most text and SF Mono for small uppercase labels and technical metadata. Use rounded-square geometry, hairline borders, compact 8px-12px radii, and square-led identity moments. If adding motion, use one cubic-bezier(0.4, 0, 0.2, 1) curve, keep UI feedback at 120ms-240ms, use Square-wipe/grid-mosaic/type-scramble patterns, and keep sequences under 800ms. Avoid gradients, heavy shadows, opacity layers, neon crypto styling, motion blur, 3D logo rotation, Doto-style decorative type, and overusing blue.

Quick token reference:
- Brand blue: `{colors.primary}` / `#0000ff`.
- Default text: `{colors.ink}` / `#0a0b0d`.
- Muted text: `{colors.text-muted}` / `#717886`.
- Canvas: `{colors.canvas}` / `#ffffff`.
- Soft panels: `{colors.surface-soft}` / `#fafafa`.
- Hairline: `{colors.hairline}` / `#dee1e7`.
- Primary type: `{typography.display-*}` and `{typography.body-*}` in Apple system sans.
- Labels/code: `{typography.label-mono}` and `{typography.mono-md}` in SF Mono.
- Identity: Square radius 5%, smoothing 60%, colors only blue/white/black.

## Known Gaps

- The official Base brand uses Base Sans, Base Mono, and Doto; this local kit intentionally uses Apple system typography to better match the iOS product screenshots.
- The product palette may differ from the brand palette. The brand guide explicitly says product-specific color guidance should come from the product team.
- Motion examples are documented from the live `/motion` page; the referenced `.webm` examples are not committed here.
- This document is distilled from the public brand guide, visible site CSS, `_base-brand.zip`, and `Base iOS Onboarding.zip`, not from a private Figma source.
