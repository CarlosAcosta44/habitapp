---
name: Beetroot Habit Architecture Light
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd7e6'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebfa'
  surface-container-high: '#ece6f5'
  surface-container-highest: '#e6e0ef'
  on-surface: '#1c1a25'
  on-surface-variant: '#484556'
  inverse-surface: '#312f3a'
  inverse-on-surface: '#f4eefd'
  outline: '#797587'
  outline-variant: '#c9c4d8'
  surface-tint: '#5e38eb'
  primary: '#572de4'
  on-primary: '#ffffff'
  primary-container: '#704efd'
  on-primary-container: '#f7f2ff'
  inverse-primary: '#c9beff'
  secondary: '#6053a2'
  on-secondary: '#ffffff'
  secondary-container: '#b6a8fe'
  on-secondary-container: '#463987'
  tertiary: '#9b340a'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4c22'
  on-tertiary-container: '#fff1ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#c9beff'
  on-primary-fixed: '#1b0063'
  on-primary-fixed-variant: '#4608d4'
  secondary-fixed: '#e6deff'
  secondary-fixed-dim: '#c9beff'
  on-secondary-fixed: '#1b065c'
  on-secondary-fixed-variant: '#483b88'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#fdf8ff'
  on-background: '#1c1a25'
  surface-variant: '#e6e0ef'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  numeric-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  screen-edge: 1.25rem
  card-padding: 1.25rem
  gutter-default: 0.75rem
---

## Brand & Style

This design system translates the habit-building psychology of everyday discipline into an uplifting, luminous day-mode experience. Conceived for active wellness, daily routines, and structured habit formation, it speaks to mindful strivers who value crisp mobile ergonomics paired with encouraging, organic energy.

The aesthetic fuses **Modern Clean Utility** with **Tactile Softness**:
- An illuminated, warm off-white canvas sets an airy backdrop, banishing visual fatigue while sustaining high contrast.
- Signature vibrant violet acts as an urgent, impassioned focal point for primary drives, high-value commits, and energetic milestones.
- Muted lavender growth serves as the visceral reward signal—powering completed streaks, positive rituals, and vital momentum.
- Smooth rounded geometries (16px–24px card envelopes, pill interactive items) combined with whisper-soft ambient diffusion deliver an inviting, tactile touch experience natively tuned for modern iOS and mobile interactions.

## Colors

The light mode color architecture balances luminous surface layers with punchy chromatic anchors and sharp ink typography.

### Foundations & Surfaces
- **Canvas Base (`#F8F9FA`)**: Grounding background creating subtle separation from pure white elevated containers.
- **Card Surface (`#FFFFFF`)**: Pure high-clarity white for primary cards, modals, and focal modules.
- **Container Muted (`#F1F3F5`)**: Low-elevation secondary containers, search fields, and grouped panel backings.
- **Border Subtle (`#E5E7EB`)**: Precise hair-line edge dividers keeping components defined without creating harsh optical cages.

### Brand Accents
- **Primary Violet (`#704efd`)**: The core driver for high-intent actions, primary buttons, dynamic milestone rings, and active selection states. Its pressed variation is `#5838d3`.
- **Secondary Lavender (`#796cbd`)**: The affirmative completion signal for streaks, progress rings, checkmarks, and active calendar indices. Its pressed variation is `#655ba6`.
- **Tertiary Amber Glow (`#8d2a00`)**: Motivational accents, hot streaks, milestone badges, and alert banners.

### Typography Ink Values
- **Primary Ink (`#797582`)**: Maximum-contrast charcoal for headlines, numerical stats, and primary actions.
- **Secondary Ink (`#2D3139`)**: Balanced body text and active metadata.
- **Muted Ink (`#495057`)**: Inactive icons, timestamps, units, and secondary labels.

## Typography

**Plus Jakarta Sans** governs the typography across every layer. Its geometric foundation combined with rounded outer terminals offers immediate human warmth alongside institutional digital precision.

- **Scale Rhythms**: Display and `headline-lg` carry tight tracking (`-0.02em`) to condense visual mass and impart modern editorial authority.
- **Micro Labels**: The `label-sm` tier uses expanded tracking (`+0.04em`) with uppercase styling for category chips, time stamps, and pill indicators.
- **Quantitative Metrics**: The `numeric-stat` role applies tabular numerical figures (`font-variant-numeric: tabular-nums`) so that real-time counters, daily streaks, and timer countdowns stay aligned across dynamic updates.

## Layout & Spacing

The layout is built around a mobile-first, vertical content river based on an 8pt layout model with a 4pt subgrid for precise control over badges and icons.

- **Mobile Viewport**: Horizontal edge gutter is fixed to `1.25rem` (20px). Cards stretch edge-to-edge within this gutter, establishing a thumb-accessible single-column stack.
- **Card Interiors**: Primary habit tiles enforce a uniform `1.25rem` (20px) internal margin, maintaining clear breathing room around progress gauges, titles, and habit badges.
- **Structural Rhythm**:
  - Inter-section spacing: `2rem` (32px).
  - List card-to-card gap: `0.75rem` (12px).
  - Internal element clustering (icon next to heading): `0.5rem` (8px).
- **Tablet & Desktop Adaptation**: On screens larger than 640px, the single column locks to a centered 600px container or reflows into a 2-column balanced grid with `1rem` (16px) gutters.

## Elevation & Depth

Depth in this light environment avoids heavy black drop shadows, relying instead on clean surface transitions, delicate structural borders, and diffused ambient illumination.

- **Level 0 (App Canvas)**: Ground `#F8F9FA`. Zero shadow.
- **Level 1 (Resting Habit Cards & Shelves)**: Background `#FFFFFF`, framed with a 1px crisp stroke in `#E5E7EB`, paired with a light, warm ambient drop:
  `box-shadow: 0 1px 3px rgba(121, 117, 130, 0.04), 0 4px 12px rgba(121, 117, 130, 0.03)`.
- **Level 2 (Hovered / Active / Draggable Cards)**: Background `#FFFFFF`, border `#D1D5DB`, elevated with a smooth lift:
  `box-shadow: 0 6px 20px rgba(121, 117, 130, 0.07), 0 2px 6px rgba(121, 117, 130, 0.04)`.
- **Primary Accent Glow**: Primary commit buttons and interactive triggers use a soft chromatic halo:
  `box-shadow: 0 8px 20px rgba(112, 78, 253, 0.22)`.
- **Secondary Accent Glow**: Habit completion toggles and celebration states radiate a natural lavender halo:
  `box-shadow: 0 8px 18px rgba(121, 108, 189, 0.22)`.
- **Floating Bottom Bar / Navigation Dock**: Translucent frosted glass effect using `rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(16px)` and top border `1px solid rgba(229, 231, 235, 0.8)`.

## Shapes

The design system uses generous, organic radii to soften structural cards and establish friendly touch targets across mobile screens.

- **Primary Cards & Modals**: `20px` to `24px` (`rounded-2xl` to `rounded-3xl`) for daily habit items, streak summaries, and bottom sheets.
- **Pills & Buttons**: `9999px` (`rounded-full`) for main CTAs, secondary action pills, segment tabs, and streak badges.
- **Emblem & Mascot Icons**: `14px` to `16px` squircle curves for visual habit anchors.
- **Form Controls & Search Insets**: `14px` to `16px` for comfortable finger alignment on mobile screens.

## Components

### Buttons
- **Primary CTA**: Pill shape (`height: 52px`), solid `#704efd` background, white text (`label-lg`), with subtle shadow `0 8px 20px rgba(112, 78, 253, 0.22)`. On press, shifts to `#5838d3` and scales slightly to `0.98`.
- **Secondary Pill**: White surface (`#FFFFFF`), border `1px solid #E5E7EB`, text `#797582` (`label-md`). Hover surface transitions to `#F1F3F5`.
- **Floating Action Button (Add Habit)**: Full-circle (`56px × 56px`), background `#796cbd`, white center plus glyph, with ambient glow `0 8px 20px rgba(121, 108, 189, 0.28)`.

### Habit Cards
- **Daily Habit Row**: Background `#FFFFFF`, rounded `20px`, padding `16px 20px`, border `1px solid #E5E7EB`, soft shadow. Left element: `44px × 44px` squircle icon container with primary tint or secondary tint. Center: habit title in `#797582` (`headline-sm`) accompanied by streak chip. Right: interactive completion circle.
- **Completion Check Circle**: Circular `36px × 36px` target. Incomplete: background `#F1F3F5` with border `1.5px solid #D1D5DB`. Complete: background `#796cbd` with white checkmark icon, scaling up smoothly with the accent glow.

### Chips & Badges
- **Streak Counters**: Pill badge (`rounded-full`), padding `4px 10px`, background `#FFFBEB`, text `#8d2a00`, paired with an amber fire glyph.
- **Success & Milestone Chips**: Background `#F3F2F8`, text `#704efd`, font weight `600` (`label-sm`).
- **Category Chips**: Background `#F1F3F5`, text `#2D3139`, transitioning to `#704efd` with white text when active.

### Lists & Calendar Bar
- **Horizontal Date Strip**: Scrollable calendar row. Active day: pill shape (`width: 40px`, `height: 62px`, `border-radius: 20px`), background `#796cbd`, text `#FFFFFF` with bold numeric stat. Inactive days: `#FFFFFF` card with weekday in `#495057` and day number in `#797582`.
- **Dividers**: Clean hairline rules using `#F1F3F5` with 0 margins within content blocks.

### Input Fields & Controls
- **Search & Text Input**: Inset container (`height: 48px`, `border-radius: 14px`), background `#F1F3F5`, border `1px solid transparent`, text `#797582` (`body-md`). On focus, shifts to `#FFFFFF` background with border `#704efd` and ring `0 0 0 3px rgba(112, 78, 253, 0.12)`.
- **Toggle Switches**: Pill switch (`50px × 28px`). Inactive track `#E5E7EB`; active track `#796cbd`; white thumb (`24px × 24px`) with soft floating drop shadow `0 2px 4px rgba(0, 0, 0, 0.12)`.

### Progress Rings & Visual Trackers
- **Ring Gauges**: Circular SVG stroke track `#E5E7EB` with active stroke `#796cbd` or `#704efd`. Linecap set to `round`. Inset center typography displays current progress over target (e.g., `4/5`) using `numeric-stat`.