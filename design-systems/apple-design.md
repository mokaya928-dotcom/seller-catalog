---
version: alpha
name: Apple-design-analysis
description: An ultra-clean, aspirational studio design system anchored on pure white canvas, monochromatic neutrals, and Apple signature Blue (#0071e3). Type runs SF Pro Display and SF Pro Text at crisp weights with negative display letter-spacing (-0.02em to -0.03em); hierarchy prioritizes stark typographic contrast and expansive whitespace over decorative flair. Layouts default to an editorial hero product showcase with generous breathing room, transitioning into minimalist product tiles resting on subtle studio surfaces (#f5f5f7). Squircles and pill-shaped interactive elements (rounded full at 980px) deliver Apple's signature industrial aesthetic, reinforced by hairline borders (#d2d2d7) and frosted glass translucent materials (backdrop blur 20px).

colors:
  primary: "#0071e3"
  primary-active: "#0077ed"
  primary-disabled: "#80b8f1"
  primary-error-text: "#e30000"
  primary-error-text-hover: "#b80000"
  accent-dark: "#1d1d1f"
  ink: "#1d1d1f"
  body: "#515154"
  muted: "#86868b"
  muted-soft: "#a1a1a6"
  hairline: "#d2d2d7"
  hairline-soft: "#e5e5ea"
  border-strong: "#86868b"
  canvas: "#ffffff"
  surface-soft: "#f5f5f7"
  surface-card: "#ffffff"
  surface-strong: "#e8e8ed"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  legal-link: "#0071e3"
  star-rating: "#1d1d1f"
  scrim: "#000000"

typography:
  display-xl:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.8px
  display-lg:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.6px
  display-md:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.4px
  display-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
  title-md:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  title-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.15px
  rating-display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1px
  body-md:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.37px
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.42
    letterSpacing: -0.22px
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: -0.1px
  caption-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.36
    letterSpacing: 0
  badge:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  micro-label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.5px
    textTransform: uppercase
  uppercase-tag:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 9px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.6px
    textTransform: uppercase
  button-md:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.2px
  button-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.15px
  link:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.42
    letterSpacing: -0.22px
  nav-link:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.1px

rounded:
  none: 0px
  xs: 6px
  sm: 10px
  md: 18px
  lg: 24px
  xl: 36px
  full: 980px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 22px
    height: 44px
  button-secondary:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 10px 22px
    height: 44px
  product-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 24px
  top-nav:
    backgroundColor: "rgba(255, 255, 255, 0.8)"
    backdropFilter: "blur(20px)"
    textColor: "{colors.ink}"
    height: 48px
  footer-light:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    padding: 34px 20px
---

## Overview

The Apple design system represents precision, premium restraint, and editorial whitespace. The canvas relies on pure white (`#ffffff`) or light studio fill (`#f5f5f7`), punctuated by Apple Blue (`#0071e3`) for interactive accents, and deep ink (`#1d1d1f`) for crisp typography.

Hierarchy defaults to an elevated **Hero Product Showcase** that celebrates single-product grandeur, accompanied by generous margins and squircle-rounded tiles.
