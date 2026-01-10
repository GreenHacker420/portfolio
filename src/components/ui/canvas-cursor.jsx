"use client";

import { useEffect, useRef } from "react";

const CanvasCursor = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let ctx = canvas.getContext("2d");
        let f;
        let lines = [];
        let pos = { x: 0, y: 0 };
        let E = {
            debug: true,
            friction: 0.5,
            trails: 20,
            size: 50,
            dampening: 0.25,
            tension: 0.98,
        };

        class Wave {
            constructor(options = {}) {
                this.phase = options.phase || 0;
                this.offset = options.offset || 0;
                this.frequency = options.frequency || 0.001;
                this.amplitude = options.amplitude || 1;
            }

            update() {
                this.phase += this.frequency;
                return this.offset + Math.sin(this.phase) * this.amplitude;
            }

            value() {
                return this.offset + Math.sin(this.phase) * this.amplitude;
            }
        }

        class Node {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.vy = 0;
                this.vx = 0;
            }
        }

        class Line {
            constructor(options = {}) {
                this.spring = (options.spring || 0) + 0.1 * Math.random() - 0.05;
                this.friction = (E.friction || 0.5) + 0.01 * Math.random() - 0.005;
                this.nodes = [];
                for (let i = 0; i < E.size; i++) {
                    const t = new Node();
                    t.x = pos.x;
                    t.y = pos.y;
                    this.nodes.push(t);
                }
            }

            update() {
                let spring = this.spring;
                let node = this.nodes[0];

                node.vx += (pos.x - node.x) * spring;
                node.vy += (pos.y - node.y) * spring;

                for (let i = 0; i < this.nodes.length; i++) {
                    node = this.nodes[i];
                    if (i > 0) {
                        const prev = this.nodes[i - 1];
                        node.vx += (prev.x - node.x) * spring;
                        node.vy += (prev.y - node.y) * spring;
                        node.vx += prev.vx * E.dampening;
                        node.vy += prev.vy * E.dampening;
                    }
                    node.vx *= this.friction;
                    node.vy *= this.friction;
                    node.x += node.vx;
                    node.y += node.vy;
                    spring *= E.tension;
                }
            }

            draw() {
                let n = this.nodes[0].x;
                let i = this.nodes[0].y;

                ctx.beginPath();
                ctx.moveTo(n, i);

                let a;
                for (a = 1; a < this.nodes.length - 2; a++) {
                    const e = this.nodes[a];
                    const t = this.nodes[a + 1];
                    const midX = 0.5 * (e.x + t.x);
                    const midY = 0.5 * (e.y + t.y);
                    ctx.quadraticCurveTo(e.x, e.y, midX, midY);
                }

                const last = this.nodes[a];
                const next = this.nodes[a + 1];
                ctx.quadraticCurveTo(last.x, last.y, next.x, next.y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        function onMousemove(e) {
            function createLines() {
                lines = [];
                for (let i = 0; i < E.trails; i++) {
                    lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
                }
            }

            function updatePos(e) {
                if (e.touches) {
                    pos.x = e.touches[0].pageX;
                    pos.y = e.touches[0].pageY;
                } else {
                    pos.x = e.clientX;
                    pos.y = e.clientY;
                }
            }

            function updateTouchPos(e) {
                if (e.touches && e.touches.length === 1) {
                    pos.x = e.touches[0].pageX;
                    pos.y = e.touches[0].pageY;
                }
            }

            document.removeEventListener("mousemove", onMousemove);
            document.removeEventListener("touchstart", onMousemove);

            document.addEventListener("mousemove", updatePos);
            document.addEventListener("touchmove", updatePos);
            document.addEventListener("touchstart", updateTouchPos);

            updatePos(e);
            createLines();
            render();
        }

        function render() {
            if (!ctx.running) return;

            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalCompositeOperation = "lighter";

            const hue = Math.round(f.update());

            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.025)`;
            ctx.lineWidth = 15;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.1)`;

            for (let i = 0; i < lines.length; i++) {
                lines[i].update();
                lines[i].draw();
            }

            ctx.frame++;
            window.requestAnimationFrame(render);
        }

        function resizeCanvas() {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        }

        ctx.running = true;
        ctx.frame = 1;

        f = new Wave({
            phase: Math.random() * 2 * Math.PI,
            amplitude: 85,
            frequency: 0.0015,
            offset: 285,
        });

        document.addEventListener("mousemove", onMousemove);
        document.addEventListener("touchstart", onMousemove);
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        return () => {
            ctx.running = false;
            document.removeEventListener("mousemove", onMousemove);
            document.removeEventListener("touchstart", onMousemove);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
            id="canvas-cursor"
        />
    );
};

export default CanvasCursor;
