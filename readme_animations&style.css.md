# Animations & Style Guide

This document provides an overview of the animations and styles used in the DAPPU ICO Crowdsale application.

## Table of Contents
- [Button Animations](#button-animations)
- [Text Animations](#text-animations)
- [Logo Animations](#logo-animations)
- [UI Element Animations](#ui-element-animations)
- [Status Indicators](#status-indicators)

## Button Animations

### Pulsing Buttons
The application uses pulsing glow effects to draw attention to important buttons:

- **Buy Tokens Button**: Orange pulsing effect with faster animation
  ```css
  .pulse-buy-button {
    animation: pulse-buy 1.5s infinite;
  }
  ```

- **Connect Wallet Button**: Blue-purple pulsing effect
  ```css
  .pulse-connect-button {
    animation: pulse-connect 2s infinite;
  }
  ```

- **Whitelist Button**: Teal-green pulsing effect
  ```css
  .pulse-whitelist-button {
    animation: pulse-whitelist 2.5s infinite;
  }
  ```

### Hover Effects
All buttons enlarge slightly when hovered over:
```css
.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

The Buy Tokens button has a more pronounced hover effect:
```css
.buy-tokens-button:hover {
  transform: scale(1.08) !important;
}
```

## Text Animations

### Typing Animation
Text appears character by character as if being typed:
```css
.typing-animation {
  animation: typing 2.2s steps(40, end) forwards;
}
```

With various delays for sequential typing:
```css
.typing-delay-1 { animation-delay: 1.1s; }
.typing-delay-2 { animation-delay: 1.5s; }
/* etc. */
```

### Bouncing Text
Text that moves horizontally to draw attention:
```css
.bounce-horizontal {
  animation: bounce-horizontal 11s infinite;
}
```

### Pulsing Text
Text that grows and shrinks:
```css
.pulse-DAPPU-text {
  animation: pulse-DAPPU-text 11s ease-in-out infinite;
}

.pulse-buy-text {
  animation: pulse-buy-text 2.55s ease-in-out infinite;
}
```

## Logo Animations

### Spinning Elements
Logo elements that rotate:
```css
.spin-circle {
  animation: spin-circle 22s linear infinite;
}

.spin-logo {
  animation: spin-logo 44s linear infinite;
}
```

### Pulsing Circle
Background circle that grows and shrinks:
```css
.pulse-circle {
  animation: pulse-circle 11s ease-in-out infinite;
}
```

## UI Element Animations

### Admin Card Hover
Cards that lift up when hovered:
```css
.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
```

With different shadow for dark mode:
```css
.admin-card.bg-dark:hover {
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.15);
}
```

### Navbar Scroll Effect
Navbar changes appearance when scrolling:
```css
.navbar-scroll.scrolled:not(.bg-dark) {
  background-color: rgba(255, 255, 255, 0.88) !important;
  box-shadow: 0 5px 20px rgba(42, 4, 194, 0.33);
}
```

## Status Indicators

### Sale Status Indicators
Visual indicators for the sale status:

- **Closed Sale Warning**:
  ```css
  .warning-text {
    animation: warning-flash 1.44s ease-in-out infinite;
  }
  ```

- **Lock Shake**:
  ```css
  .lock-shake {
    animation: lock-shake 3s ease-in-out infinite;
  }
  ```

- **Key Shake**:
  ```css
  .key-shake {
    animation: key-shake 2.5s ease-in-out infinite;
  }
  ```

- **Eyes Pulse**:
  ```css
  .eyes-pulse {
    animation: eyes-pulse 2s ease-in-out infinite;
  }
  ```

- **Stay Tuned Text**:
  ```css
  .tuned-text {
    animation: tuned-flash 2s ease-in-out infinite;
  }
  ```

## Usage Guidelines

1. **Attention Hierarchy**:
   - Use the most intense animations (like pulse-buy-button) for primary actions
   - Use moderate animations for secondary actions
   - Use subtle animations for decorative elements

2. **Performance Considerations**:
   - Limit the number of simultaneous animations to prevent performance issues
   - Use `transform` and `opacity` for smoother animations

3. **Accessibility**:
   - Consider adding `prefers-reduced-motion` media queries for users who prefer minimal animations

4. **Dark Mode Compatibility**:
   - All animations are designed to work in both light and dark modes
   - Shadow colors are adjusted based on the theme