---
name: Lustrous Moss Telemetry
colors:
  surface: '#f3fde6'
  surface-dim: '#d4ddc7'
  surface-bright: '#f3fde6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef7e0'
  surface-container: '#e8f1db'
  surface-container-high: '#e2ecd5'
  surface-container-highest: '#dce6d0'
  on-surface: '#161e10'
  on-surface-variant: '#45483e'
  inverse-surface: '#2b3324'
  inverse-on-surface: '#ebf4de'
  outline: '#75786d'
  outline-variant: '#c5c8ba'
  surface-tint: '#516538'
  primary: '#2d3f16'
  on-primary: '#ffffff'
  primary-container: '#43562b'
  on-primary-container: '#b4ca94'
  inverse-primary: '#b8ce98'
  secondary: '#556437'
  on-secondary: '#ffffff'
  secondary-container: '#d3e4ac'
  on-secondary-container: '#576639'
  tertiary: '#353c26'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b533c'
  on-tertiary-container: '#bec6a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3ebb2'
  primary-fixed-dim: '#b8ce98'
  on-primary-fixed: '#102000'
  on-primary-fixed-variant: '#3a4c22'
  secondary-fixed: '#d8e9b1'
  secondary-fixed-dim: '#bccd97'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#3e4c22'
  tertiary-fixed: '#dee6c8'
  tertiary-fixed-dim: '#c2caad'
  on-tertiary-fixed: '#171e0b'
  on-tertiary-fixed-variant: '#424a33'
  background: '#f3fde6'
  on-background: '#161e10'
  surface-variant: '#dce6d0'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance, organic-modernist aesthetic engineered for mission-critical telemetry, observability, and infrastructure intelligence. Departing from generic neon-cyan developer tool interfaces, the visual philosophy draws directly from the deep, anisotropic sheen and luxurious weight of moss-satin fabric. It pairs organic grounding with analytical rigor.

The core brand personality reflects quiet authority, mathematical precision, and sustained clarity under cognitive load. The design language fuses **Minimalism** and **Tactile Glassmorphism** with subtle physical depth: warm off-white canvas surfaces, micro-grooved data tiles, low-frequency atmospheric shadows, and deep forest-charcoal text contrast. Engineering teams experience calm clarity, high situational awareness, and tactile luxury during high-stakes monitoring workflows.

## Colors

The color architecture is derived from the light-bending values of dense olive satin. 

- **Primary (`#43562B`)**: The deep core moss tone, used for brand anchors, primary action buttons, key metrics, and focused telemetry states.
- **Secondary (`#8A9A68`)**: A muted sage green for secondary data series, active filter chips, interactive tabs, and mid-level charts.
- **Tertiary (`#D4DCBE`)**: Pale meadow tint for subtle badge backdrops, highlighted table rows, and soft hover fills.
- **Neutral (`#1C2416`)**: An ultra-deep forest charcoal that replaces harsh pure black, providing optimal contrast for high-density metrics and typographic hierarchy without visual fatigue.

Canvas and surface tiers rely on warm chalk white (`#FAFBF8`) and layered card fills (`#F3F5EF`), bound by micro-borders tinted in muted olive-ash (`#E1E6D8`) to ensure crisp visual separation in complex bento-grid layouts.

## Typography

The type system pairs **Hanken Grotesk** for structural prose and displays with **JetBrains Mono** for data density, latency figures, timestamps, logs, and telemetry values.

- Large metric displays prioritize negative tracking (`-0.03em` to `-0.02em`) to mirror high-end editorial clarity and modern engineering dashboards.
- Telemetry readouts, status pills, and code identifiers strictly employ JetBrains Mono in uppercase or tabular numerals to maintain columnar scanning speed without jitter.
- Leading values are tuned generously across body copy to prevent visual claustrophobia inside dense bento cards.

## Layout & Spacing

This design system uses a flexible 12-column bento-box grid built on an 8pt architectural rhythm. 

- **Desktop (>= 1280px)**: 12-column layout with fixed side navigation, `2rem` outer page margins, and `1.25rem` grid gutters. Bento cards span columns across dynamic intervals (e.g., 8-4 split for charts and live trace logs, 3-3-3-3 split for core KPI tiles).
- **Tablet (768px - 1279px)**: 8-column layout with `1.5rem` margins and `1rem` gutters; secondary bento widgets wrap cleanly below primary diagnostic graphs.
- **Mobile (< 768px)**: 4-column single-stack arrangement utilizing `1rem` margins and `0.75rem` gutters. Metric headers compress gracefully into swipeable carousels or stacked inspection blocks.

Internal widget padding adheres to a strict hierarchy: `space-sm` (`0.5rem`) for compact badge clusters, `space-md` (`1rem`) for dense log rows and tabular cells, and `space-lg` (`1.5rem`) for standard bento module body areas.

## Elevation & Depth

Visual hierarchy is conveyed through organic tonal layering coupled with soft, moss-tinted ambient shadows and crisp hairline borders:

- **Surface Tiers**:
  - `Base Canvas`: `#FAFBF8`
  - `Card Surface / Level 1`: `#FFFFFF` with a 1px border of `rgba(67, 86, 43, 0.12)`.
  - `Sub-container / Inset Level 2`: `#F5F7F1` with an inner border of `rgba(67, 86, 43, 0.08)` for code blocks, terminal segments, and sparkline wells.
  - `Overlay / Level 3 (Modals, Popovers)`: `#FFFFFF` paired with an ambient drop shadow: `0 20px 40px -12px rgba(28, 36, 22, 0.14), 0 1px 3px rgba(28, 36, 22, 0.04)`.

- **Shadow Character**: Shadows are diffused and warm, tinted with the neutral forest-charcoal tone rather than a cold gray, yielding a natural, satin-like lift. Floating panels use a delicate inner highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.8)`) to suggest beveled glass edges.

## Shapes

The design system adopts a refined rounded posture (`roundedness: 2`), balancing structural precision with tactile softness.

- Primary interactive elements (buttons, inputs, select triggers) feature an 8px (`0.5rem`) border radius.
- Bento cards and telemetry panels feature a smooth 16px (`1rem` / `rounded-lg`) corner radius, creating distinct content compartments.
- Floating dialogs and system drawers leverage 24px (`1.5rem` / `rounded-xl`) geometry.
- Metric indicators, status dots, and live pulse pings employ full pill curvature (`9999px`) to visually contrast against square-aligned data tables.

## Components

- **Buttons**:
  - *Primary*: Background `#43562B`, text `#FAFBF8`, hairline top bevel `inset 0 1px 0 rgba(255, 255, 255, 0.25)`, subtle shadow `0 2px 6px rgba(67, 86, 43, 0.3)`. On hover, lightens to `#4F6533`.
  - *Secondary*: Surface `#FFFFFF`, text `#43562B`, 1px border in `#D4DCBE`. Hover applies `#F3F5EF`.
  - *Ghost / Monospaced Action*: Borderless, JetBrains Mono text in `#1C2416`, soft hover fill in `rgba(67, 86, 43, 0.06)`.

- **Telemetry Cards & Bento Modules**:
  - Encased in 16px rounded white modules with a 1px `#E1E6D8` border.
  - Header sections include a title in Hanken Grotesk (`14px`, semi-bold) alongside live status indicators (e.g., streaming pulse dot in `#43562B`).

- **Input Fields & Search**:
  - Height 40px, surface `#FFFFFF`, border 1px `#D4DCBE`, radius 8px.
  - Focus state shifts border to `#43562B` with a subtle 3px ring in `rgba(67, 86, 43, 0.15)`. Monospace placeholder text in `#8A9A68`.

- **Status Chips & Pills**:
  - Background `#EAF0E0`, text `#43562B`, border 1px `rgba(67, 86, 43, 0.2)`. Fully rounded (pill), typography set in `label-sm` JetBrains Mono for system services (e.g., `HEALTHY`, `DEGRADED`, `99.98%`).

- **Lists & Data Grids**:
  - Alternating rows with clean 1px bottom divider `rgba(67, 86, 43, 0.06)`. Numeric metrics right-aligned in tabular JetBrains Mono. Selected rows highlight with `#F3F6EC`.

- **Specialty Telemetry Widgets**:
  - *Sparklines / Area Charts*: Filled with a linear gradient of `#43562B` at 25% opacity fading to 0%, stroked with `#43562B` at 2px weight.
  - *Live Log Streamers*: Inset background `#1C2416` with text in `#D4DCBE` and active cursor accents in `#8A9A68`.