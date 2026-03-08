export const tailwindConfig = {
    theme: {
        extend: {
            colors: {
                brand: "#22c55e",
                "brand-dim": "#15803d",
                "brand-glow": "rgba(34, 197, 94, 0.4)",
                background: "#050505",
                surface: "#0a0a0b",
                "surface-light": "#121214",
                border: "#1f1f22",
                "border-light": "#2a2a2e",
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'Courier New', 'Courier', 'monospace'],
            }
        }
    }
};
