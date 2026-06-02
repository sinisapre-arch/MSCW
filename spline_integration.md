# Integrating Spline for 3D Websites

This document explains how to integrate Spline (https://spline.design/) into this website project to create premium, interactive 3D experiences similar to `igloo.inc`.

## 1. Create Your Spline Scene
1. Open up Spline and create or import your 3D artwork.
2. Animate and finalize your design (e.g., adding interactions, setting up the camera).
3. Click "Export" in the top bar.
4. Go to the "Code" export tab, select "Vanilla" or just copy the URL generated for the `.splinecode` file.

## 2. Using `@splinetool/runtime`
We use the official Spline runtime package for vanilla JavaScript. It is already installed!

```bash
npm install @splinetool/runtime
```

## 3. Implementing Spline in the Project

### HTML Preparation
You'll need a canvas element in your `index.html` where the 3D scene will render.

```html
<canvas id="canvas3d"></canvas>
```

### JavaScript Initialization
In your `main.js` (or a dedicated script file), initialize the application by grabbing the canvas element and loading your `.splinecode` URL.

```javascript
import { Application } from '@splinetool/runtime';

// 1. Get the canvas
const canvas = document.getElementById('canvas3d');

// 2. Initialize the Spline app
const app = new Application(canvas);

// 3. Load your exported spline scene
// Replace this URL with the one you copied from Spline's Export panel
app.load('https://prod.spline.design/your-scene-id/scene.splinecode').then(() => {
    console.log("Spline scene loaded!");

    // Optional: Interact with objects dynamically
    // const obj = app.findObjectByName('Cube');
});
```

## 4. CSS Styling
Ensure your canvas expands to cover the desired area, for example, full viewport:

```css
#canvas3d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* Send it to background */
  pointer-events: auto; /* Ensure it receives hover/click events if interactive */
}
```

## Tips for Premium 3D AI Websites
- **Performance**: Compress your Spline scenes. Use fewer polygons or baked textures when possible. High-performance interactions equal a better user experience.
- **Micro-interactions**: Tie scroll events or mouse-move events to your Spline objects or camera position (you can do this right inside the Spline editor!).
- **Glassmorphism**: Combine the `<canvas>` background with heavily blurred translucent UI overlays (`backdrop-filter: blur(16px)`) to achieve a futuristic AI-focused aesthetic.
