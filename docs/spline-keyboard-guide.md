# Spline Mechanical Keyboard Design Guide

This guide outlines how to create a 3D mechanical keyboard visualization in Spline for our portfolio project.

## Overview

We're replacing our Three.js implementation with Spline due to WebGL context loss issues. The new implementation should include:
- Sound effects
- Improved animations
- Realistic details
- Performance optimizations for mobile
- Theme switching capabilities

## Step 1: Set Up Spline Project

1. Create a new Spline project at [https://spline.design](https://spline.design)
2. Set up a scene with appropriate lighting and camera angles
3. Configure the scene for optimal performance

## Step 2: Design the Keyboard Base

1. Create a rectangular base with rounded corners
   - Width: ~30cm
   - Height: ~2cm
   - Depth: ~12cm
   - Use a subtle material with metallic properties
   
2. Add details to the base:
   - USB cable connection point
   - Subtle branding or logo
   - Slight angle for ergonomics (~5-7 degrees)
   - Bottom rubber feet

## Step 3: Create Keycaps

1. Design a standard keycap:
   - Create a slightly concave top surface
   - Round the edges
   - Size: ~1.8cm x 1.8cm for standard keys
   - Height: ~1cm
   
2. Create variations:
   - Space bar (longer)
   - Enter key (L-shaped)
   - Shift, Backspace, Tab (wider)
   
3. Add text to keycaps:
   - Use clear, readable font
   - Position text centered on keys
   - Add icons for special keys

## Step 4: Arrange Keys in Layout

1. Create a standard QWERTY layout:
   - First row: Programming languages (Q, W, E, R, T, Y)
   - Second row: Frontend technologies (A, S, D, F, G, H)
   - Third row: Frameworks (Z, X, C, V, B, N)
   
2. Space keys appropriately:
   - ~0.2cm between keys
   - Align in proper rows
   - Stagger rows slightly for realism

## Step 5: Add Materials and Textures

1. Create different theme materials:
   - Modern: Clean, minimal, light colors
   - Retro: Beige/cream with brown keys
   - Neon: Dark base with bright, glowing keys
   
2. Add textures:
   - Subtle grain for plastic
   - Fingerprint-resistant matte finish
   - Slight reflection for realism

## Step 6: Implement Animations

1. Create key press animations:
   - Down movement: ~0.2cm
   - Slight squish effect
   - Quick down, slightly slower up
   - Add subtle bounce on release
   
2. Add hover effects:
   - Subtle glow or highlight
   - Slight elevation change
   
3. Create theme transition animations:
   - Smooth color transitions
   - Material property changes

## Step 7: Add Interactive Elements

1. Make keys clickable:
   - Add onClick events to each key
   - Connect to key press animations
   
2. Create hover states:
   - Visual feedback on hover
   - Tooltip or highlight effect
   
3. Add keyboard-wide effects:
   - Ripple effect when typing
   - Ambient animations for idle state

## Step 8: Optimize for Performance

1. Reduce polygon count:
   - Simplify geometry where possible
   - Use instances for repeated elements
   
2. Optimize textures:
   - Appropriate resolution
   - Compressed formats
   
3. Level of detail (LOD):
   - Simplified version for mobile
   - Reduced effects on low-power devices

## Step 9: Add Sound Integration Points

1. Create animation events that can trigger sounds:
   - Key down event
   - Key up event
   - Theme change event
   
2. Ensure events are accessible via the Spline API

## Step 10: Export for React Integration

1. Export the scene:
   - Use Spline's React export option
   - Save the scene file (.splinecode)
   
2. Host the scene file:
   - Upload to your server or use Spline's hosting
   - Update the scene URL in SplineKeyboardSkills.tsx

## Implementation Notes

### Key Naming Convention

Name each key in Spline according to the technology it represents:
- Example: The 'J' key might be named 'JavaScript'
- This allows us to find objects by name in the React component

### Event Handling

Set up these events in Spline:
- mouseDown: Trigger key press animation
- mouseUp: Trigger key release animation
- hover: Trigger hover effect

### Theme Switching

Create separate materials for each theme and organize them in groups for easy switching.

## Final Checklist

Before integration:
- [ ] All keys are properly named
- [ ] Animations work smoothly
- [ ] Events are properly set up
- [ ] Performance is optimized
- [ ] Multiple themes are implemented
- [ ] Scene exports correctly

## Resources

- [Spline Documentation](https://docs.spline.design/)
- [React-Spline GitHub](https://github.com/splinetool/react-spline)
- [Mechanical Keyboard Reference Images](https://www.mechanical-keyboard.org/)
