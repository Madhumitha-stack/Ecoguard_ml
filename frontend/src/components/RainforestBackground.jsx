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

    // Floating Golden Pollen / Dust Particles (Rendered on Background canvas)
    class PollenParticle {
      constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.6;
        this.speedX = Math.random() * 0.12 - 0.06;
        this.speedY = Math.random() * 0.12 - 0.06;
        this.alpha = Math.random() * 0.35 + 0.1;
        this.wobbleSpeed = Math.random() * 0.015 + 0.005;
        this.wobblePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX + Math.sin(this.wobblePhase) * 0.08;
        this.y += this.speedY + Math.cos(this.wobblePhase) * 0.08;
        this.wobblePhase += this.wobbleSpeed;

        // Fade in and out gently
        this.alpha = (Math.sin(this.wobblePhase) + 1) / 2 * 0.3 + 0.1;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        // Warm golden sunlight pollen glow
        ctx.fillStyle = `rgba(250, 204, 21, ${this.alpha})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Particle class for fireflies (Rendered on Foreground canvas)
    class Firefly {
      constructor() {
        this.reset();
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
        this.size = Math.random() * 2.5 + 2.0;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.3 - 0.1;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.blinkSpeed = Math.random() * 0.02 + 0.01;
        this.blinkPhase = Math.random() * Math.PI * 2;
        
        const isYellow = Math.random() > 0.4;
        this.color = isYellow ? '190, 242, 47' : '16, 185, 129';
      }

      update() {
        this.x += this.speedX + Math.sin(this.blinkPhase) * 0.15;
        this.y += this.speedY + Math.cos(this.blinkPhase) * 0.1;
        this.blinkPhase += this.blinkSpeed;

        this.alpha = (Math.sin(this.blinkPhase) + 1) / 2 * 0.75 + 0.15;

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
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 7 + 5;
        this.speedY = Math.random() * 0.4 + 0.2;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.alpha = Math.random() * 0.25 + 0.2;
        this.color = Math.random() > 0.5 ? '16, 185, 129' : '101, 163, 13';
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
        
        fgCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        fgCtx.beginPath();
        fgCtx.moveTo(0, -this.size);
        fgCtx.quadraticCurveTo(this.size * 0.55, -this.size * 0.2, 0, this.size);
        fgCtx.quadraticCurveTo(-this.size * 0.55, -this.size * 0.2, 0, -this.size);
        fgCtx.fill();
        
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
        this.alpha = Math.random() * 0.05 + 0.01;
        this.pulseSpeed = Math.random() * 0.002 + 0.001;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha <= 0.015 || this.alpha >= 0.08) {
          this.pulseDir = -this.pulseDir;
        }
      }

      draw() {
        fgCtx.save();
        fgCtx.beginPath();
        const gradient = fgCtx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `rgba(253, 224, 71, ${this.alpha * 1.5})`); // warm sunbeam
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

    // Draw branches framing top corners
    const drawCanopyFrame = (ctx, w, h) => {
      ctx.save();
      
      // Top Left main branch
      ctx.strokeStyle = 'rgba(1, 6, 4, 0.85)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(-15, -15);
      ctx.quadraticCurveTo(w * 0.16, h * 0.08, w * 0.36, h * 0.04);
      ctx.stroke();

      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(w * 0.14, h * 0.06);
      ctx.quadraticCurveTo(w * 0.22, h * 0.16, w * 0.28, h * 0.23);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(3, 20, 11, 0.8)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(w * 0.09, h * 0.05);
      ctx.quadraticCurveTo(w * 0.07, h * 0.22, w * 0.1, h * 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w * 0.23, h * 0.06);
      ctx.quadraticCurveTo(w * 0.26, h * 0.18, w * 0.22, h * 0.32);
      ctx.stroke();

      const drawLeafGlow = (lx, ly, rot, size = 16) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(size * 0.5, -size * 0.25, 0, size);
        ctx.quadraticCurveTo(-size * 0.5, -size * 0.25, 0, -size);
        ctx.fill();

        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(size * 0.32, -size * 0.2, 0, size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

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

      // Top Right main branch
      ctx.strokeStyle = 'rgba(1, 6, 4, 0.85)';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(w + 15, -15);
      ctx.quadraticCurveTo(w * 0.84, h * 0.1, w * 0.64, h * 0.03);
      ctx.stroke();

      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.86, h * 0.08);
      ctx.quadraticCurveTo(w * 0.78, h * 0.2, w * 0.74, h * 0.28);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(3, 20, 11, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.9, h * 0.07);
      ctx.quadraticCurveTo(w * 0.92, h * 0.25, w * 0.89, h * 0.44);
      ctx.stroke();

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
    const pollen = Array.from({ length: 30 }, () => new PollenParticle());

    let fogOffset1 = 0;
    let fogOffset2 = 0;

    const handleResize = () => {
      width = bgCanvas.width = fgCanvas.width = window.innerWidth;
      height = bgCanvas.height = fgCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      // Clear canvases
      bgCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      // ==========================================
      // BACKGROUND CANVAS RENDER
      // ==========================================

      // 1. Shifting Forest Fog / Mist Layers
      bgCtx.save();
      fogOffset1 += 0.18;
      fogOffset2 += 0.07;
      
      // Layer 1 Mist
      bgCtx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const y = height - 120 + Math.sin(x / 140 + fogOffset1 * 0.05) * 15;
        bgCtx.lineTo(x, y);
      }
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();

      // Layer 2 Mist
      bgCtx.fillStyle = 'rgba(20, 80, 50, 0.02)';
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const y = height - 80 + Math.cos(x / 160 + fogOffset2 * 0.04) * 18;
        bgCtx.lineTo(x, y);
      }
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();
      bgCtx.restore();

      // 2. Draw Golden Pollen / Shimmering Dust
      pollen.forEach((p) => {
        p.update();
        p.draw(bgCtx);
      });

      // ==========================================
      // FOREGROUND CANVAS RENDER
      // ==========================================

      // 1. Shimmering sunlight rays
      rays.forEach((ray) => {
        ray.update();
        ray.draw();
      });

      // 2. Floating leaves
      leaves.forEach((leaf) => {
        leaf.update();
        leaf.draw();
      });

      // 3. Blinking fireflies
      fireflies.forEach((firefly) => {
        firefly.update();
        firefly.draw();
      });

      // 4. Canopy Frame
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
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      <canvas
        ref={fgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />
    </>
  );
}
