import React, { useEffect, useRef } from 'react';

export default function RainforestBackground() {
  const bgCanvasRef = useRef(null);
  const fgCanvasRef = useRef(null);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    if (!bgCtx || !fgCtx) return;

    let animationId;
    let width = (bgCanvas.width = fgCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = fgCanvas.height = window.innerHeight);

    // Particle class for fireflies (Rendered on Foreground canvas)
    class Firefly {
      constructor() {
        this.reset();
        // Distribute randomly across screen on initialization
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        if (Math.random() > 0.5) {
          this.y = Math.random() * height;
          this.x = Math.random() > 0.5 ? -10 : width + 10;
        }
        this.size = Math.random() * 2.5 + 2.0; // Slightly larger for better glow
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.3 - 0.1; // Float slowly upwards
        this.alpha = Math.random() * 0.6 + 0.2;
        this.blinkSpeed = Math.random() * 0.02 + 0.01;
        this.blinkPhase = Math.random() * Math.PI * 2;
        // Glow color: Golden Yellow/Green or Radiant Emerald
        const isYellow = Math.random() > 0.4;
        this.color = isYellow ? '190, 242, 47' : '16, 185, 129';
      }

      update() {
        this.x += this.speedX + Math.sin(this.blinkPhase) * 0.15;
        this.y += this.speedY + Math.cos(this.blinkPhase) * 0.1;
        this.blinkPhase += this.blinkSpeed;

        // Pulse alpha
        this.alpha = (Math.sin(this.blinkPhase) + 1) / 2 * 0.75 + 0.15;

        // Boundary check
        if (this.x < -30 || this.x > width + 30 || this.y < -30 || this.y > height + 30) {
          this.reset();
        }
      }

      draw() {
        fgCtx.save();
        fgCtx.beginPath();
        const gradient = fgCtx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 6
        );
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        gradient.addColorStop(0.3, `rgba(${this.color}, ${this.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        fgCtx.fillStyle = gradient;
        fgCtx.arc(this.x, this.y, this.size * 6, 0, Math.PI * 2);
        fgCtx.fill();
        fgCtx.restore();
      }
    }

    // Floating leaf particles (Rendered on Foreground canvas)
    class ForestLeaf {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial spread
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 7 + 5;
        this.speedY = Math.random() * 0.4 + 0.2;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.alpha = Math.random() * 0.25 + 0.2; // High-visibility
        this.color = Math.random() > 0.5 ? '16, 185, 129' : '101, 163, 13'; // Emerald or Forest Green
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.25;
        this.angle += this.rotationSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        fgCtx.save();
        fgCtx.translate(this.x, this.y);
        fgCtx.rotate(this.angle);
        
        // Draw leaf body
        fgCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        fgCtx.beginPath();
        fgCtx.moveTo(0, -this.size);
        fgCtx.quadraticCurveTo(this.size * 0.55, -this.size * 0.2, 0, this.size);
        fgCtx.quadraticCurveTo(-this.size * 0.55, -this.size * 0.2, 0, -this.size);
        fgCtx.fill();
        
        // Leaf stem line
        fgCtx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.35})`;
        fgCtx.lineWidth = 1;
        fgCtx.beginPath();
        fgCtx.moveTo(0, -this.size);
        fgCtx.lineTo(0, this.size * 1.15);
        fgCtx.stroke();

        fgCtx.restore();
      }
    }

    // Sunlight Rays (Rendered on Foreground canvas)
    class LightRay {
      constructor(index) {
        this.index = index;
        this.reset();
      }

      reset() {
        this.width = Math.random() * 160 + 90;
        this.xStart = Math.random() * width * 0.4;
        this.xEnd = this.xStart + Math.random() * 250 + 150;
        this.alpha = Math.random() * 0.06 + 0.02;
        this.pulseSpeed = Math.random() * 0.003 + 0.001;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha <= 0.02 || this.alpha >= 0.1) {
          this.pulseDir = -this.pulseDir;
        }
      }

      draw() {
        fgCtx.save();
        fgCtx.beginPath();
        const gradient = fgCtx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `rgba(224, 255, 230, ${this.alpha * 1.6})`);
        gradient.addColorStop(0.5, `rgba(16, 185, 129, ${this.alpha})`);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        fgCtx.fillStyle = gradient;
        fgCtx.moveTo(this.xStart, 0);
        fgCtx.lineTo(this.xStart + this.width, 0);
        fgCtx.lineTo(this.xEnd + this.width, height);
        fgCtx.lineTo(this.xEnd, height);
        fgCtx.closePath();
        fgCtx.fill();
        fgCtx.restore();
      }
    }

    // Static structures for tree silhouettes on Background canvas
    const drawTreeSilhouette = (ctx, x, y, w, h) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - w / 2, y);
      ctx.lineTo(x, y - h);
      ctx.lineTo(x + w / 2, y);
      ctx.closePath();
      ctx.fill();

      // Lower branch layer
      ctx.beginPath();
      ctx.moveTo(x - w * 0.38, y - h * 0.35);
      ctx.lineTo(x, y - h * 0.65);
      ctx.lineTo(x + w * 0.38, y - h * 0.35);
      ctx.closePath();
      ctx.fill();

      // Middle branch layer
      ctx.beginPath();
      ctx.moveTo(x - w * 0.24, y - h * 0.6);
      ctx.lineTo(x, y - h * 0.88);
      ctx.lineTo(x + w * 0.24, y - h * 0.6);
      ctx.closePath();
      ctx.fill();
    };

    const generateHillLayers = (w, h) => {
      const layers = [];
      
      // Far Layer: smaller, denser conifer trees
      const farTrees = [];
      for (let x = 0; x < w; x += 35 + Math.random() * 45) {
        farTrees.push({
          x,
          width: Math.random() * 16 + 10,
          height: Math.random() * 55 + 35
        });
      }
      layers.push({
        color: '#030c08',
        trees: farTrees,
        curveOffset: 12
      });

      // Close Layer: larger conifer trees
      const closeTrees = [];
      for (let x = 15; x < w; x += 55 + Math.random() * 65) {
        closeTrees.push({
          x,
          width: Math.random() * 26 + 18,
          height: Math.random() * 95 + 55
        });
      }
      layers.push({
        color: '#010503',
        trees: closeTrees,
        curveOffset: 0
      });

      return layers;
    };

    // Draw branches and vines framing the top corners
    const drawCanopyFrame = (ctx, w, h) => {
      ctx.save();
      
      // 1. Top Left main branch
      ctx.strokeStyle = '#010604';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(-15, -15);
      ctx.quadraticCurveTo(w * 0.16, h * 0.08, w * 0.36, h * 0.04);
      ctx.stroke();

      // Top Left secondary branch
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(w * 0.14, h * 0.06);
      ctx.quadraticCurveTo(w * 0.22, h * 0.16, w * 0.28, h * 0.23);
      ctx.stroke();

      // Hanging Vine 1
      ctx.strokeStyle = '#03140b';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(w * 0.09, h * 0.05);
      ctx.quadraticCurveTo(w * 0.07, h * 0.22, w * 0.1, h * 0.4);
      ctx.stroke();

      // Hanging Vine 2
      ctx.beginPath();
      ctx.moveTo(w * 0.23, h * 0.06);
      ctx.quadraticCurveTo(w * 0.26, h * 0.18, w * 0.22, h * 0.32);
      ctx.stroke();

      // Draw stylized branch leaves
      const drawLeafGlow = (lx, ly, rot, size = 16) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        
        // Leaf body
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(size * 0.5, -size * 0.25, 0, size);
        ctx.quadraticCurveTo(-size * 0.5, -size * 0.25, 0, -size);
        ctx.fill();

        // Leaf details highlight
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(size * 0.32, -size * 0.2, 0, size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Populate leaves on branches and vines
      drawLeafGlow(w * 0.07, h * 0.04, 0.4);
      drawLeafGlow(w * 0.17, h * 0.06, 0.2);
      drawLeafGlow(w * 0.27, h * 0.05, -0.15, 14);
      drawLeafGlow(w * 0.35, h * 0.04, -0.4, 12);

      drawLeafGlow(w * 0.17, h * 0.1, 1.1, 14);
      drawLeafGlow(w * 0.23, h * 0.17, 0.8, 12);
      drawLeafGlow(w * 0.28, h * 0.23, 0.5, 10);

      drawLeafGlow(w * 0.085, h * 0.18, 1.5, 9);
      drawLeafGlow(w * 0.095, h * 0.3, 1.2, 8);
      drawLeafGlow(w * 0.1, h * 0.4, 1.4, 7);

      drawLeafGlow(w * 0.24, h * 0.15, -1.2, 8);
      drawLeafGlow(w * 0.23, h * 0.26, -1.6, 7);

      // 2. Top Right Branch
      ctx.strokeStyle = '#010604';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(w + 15, -15);
      ctx.quadraticCurveTo(w * 0.84, h * 0.1, w * 0.64, h * 0.03);
      ctx.stroke();

      // Top Right sub-branch
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.86, h * 0.08);
      ctx.quadraticCurveTo(w * 0.78, h * 0.2, w * 0.74, h * 0.28);
      ctx.stroke();

      // Hanging Vine 3
      ctx.strokeStyle = '#03140b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.9, h * 0.07);
      ctx.quadraticCurveTo(w * 0.92, h * 0.25, w * 0.89, h * 0.44);
      ctx.stroke();

      // Populate leaves
      drawLeafGlow(w * 0.91, h * 0.07, -0.5);
      drawLeafGlow(w * 0.81, h * 0.09, -0.2);
      drawLeafGlow(w * 0.71, h * 0.05, 0.1, 14);
      drawLeafGlow(w * 0.64, h * 0.03, 0.45, 12);

      drawLeafGlow(w * 0.82, h * 0.14, -1.0, 12);
      drawLeafGlow(w * 0.77, h * 0.22, -0.7, 10);
      drawLeafGlow(w * 0.74, h * 0.28, -0.4, 8);

      drawLeafGlow(w * 0.91, h * 0.18, 1.3, 9);
      drawLeafGlow(w * 0.90, h * 0.32, 1.5, 8);
      drawLeafGlow(w * 0.89, h * 0.44, 1.2, 7);

      ctx.restore();
    };

    const fireflies = Array.from({ length: 50 }, () => new Firefly());
    const leaves = Array.from({ length: 18 }, () => new ForestLeaf());
    const rays = Array.from({ length: 4 }, (_, i) => new LightRay(i));
    let hillLayers = generateHillLayers(width, height);

    // Drifting Fog offset calculations
    let fogOffset1 = 0;
    let fogOffset2 = 0;

    // Handle resizing dynamically across both canvases
    const handleResize = () => {
      width = bgCanvas.width = fgCanvas.width = window.innerWidth;
      height = bgCanvas.height = fgCanvas.height = window.innerHeight;
      hillLayers = generateHillLayers(width, height);
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      // CLEAR BOTH CANVASES
      bgCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      // ==========================================
      // BACKGROUND CANVAS RENDER (Behind dashboard)
      // ==========================================

      // 1. Dark Forest Base Gradient
      const baseGradient = bgCtx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, Math.max(width, height)
      );
      baseGradient.addColorStop(0, '#0a2318'); // Mossy dark green center
      baseGradient.addColorStop(0.6, '#030e0a');
      baseGradient.addColorStop(1, '#020504'); // Deep forest black
      bgCtx.fillStyle = baseGradient;
      bgCtx.fillRect(0, 0, width, height);

      // 2. Overlay flat canopy curves
      bgCtx.save();
      bgCtx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      bgCtx.beginPath();
      bgCtx.arc(width * 0.15, height, height * 0.9, Math.PI, 0);
      bgCtx.arc(width * 0.8, height, height * 0.75, Math.PI, 0);
      bgCtx.fill();
      bgCtx.restore();

      // 3. Overlapping Tree Silhouette Hills
      hillLayers.forEach((layer) => {
        bgCtx.fillStyle = layer.color;
        bgCtx.beginPath();
        bgCtx.moveTo(0, height);
        bgCtx.quadraticCurveTo(width * 0.5, height - 15 - layer.curveOffset, width, height);
        bgCtx.lineTo(width, height);
        bgCtx.lineTo(0, height);
        bgCtx.closePath();
        bgCtx.fill();

        // Draw conifer silhouettes along hill paths
        layer.trees.forEach((tree) => {
          drawTreeSilhouette(bgCtx, tree.x, height - layer.curveOffset, tree.width, tree.height);
        });
      });

      // 4. Shifting Forest Fog (Acoustic / Poaching Mist theme)
      bgCtx.save();
      fogOffset1 += 0.2;
      fogOffset2 += 0.08;
      
      // Layer 1 Mist
      bgCtx.fillStyle = 'rgba(16, 185, 129, 0.035)';
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const y = height - 100 + Math.sin(x / 140 + fogOffset1 * 0.05) * 15;
        bgCtx.lineTo(x, y);
      }
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();

      // Layer 2 Mist
      bgCtx.fillStyle = 'rgba(20, 80, 50, 0.025)';
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const y = height - 60 + Math.cos(x / 160 + fogOffset2 * 0.04) * 18;
        bgCtx.lineTo(x, y);
      }
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();
      bgCtx.restore();

      // ==========================================
      // FOREGROUND CANVAS RENDER (Over dashboard panels)
      // ==========================================

      // 1. Shimmering sunlight rays (god rays)
      rays.forEach((ray) => {
        ray.update();
        ray.draw();
      });

      // 2. Floating leaves
      leaves.forEach((leaf) => {
        leaf.update();
        leaf.draw();
      });

      // 3. Blinking glowing fireflies
      fireflies.forEach((firefly) => {
        firefly.update();
        firefly.draw();
      });

      // 4. Detailed Top Branches & Vines framing the dashboard
      drawCanopyFrame(fgCtx, width, height);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Background canvas (behind everything) */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      {/* Foreground canvas (on top of widgets, below interactive elements if needed, but z-25 or z-30 works beautifully for visual overlays) */}
      <canvas
        ref={fgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />
    </>
  );
}
