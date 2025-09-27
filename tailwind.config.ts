
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			github: {
    				dark: '#0d1117',
    				darker: '#010409',
    				light: '#161b22',
    				text: '#c9d1d9',
    				border: '#30363d'
    			},
    			neon: {
    				green: '#3fb950',
    				purple: '#bf4dff',
    				blue: '#1f6feb',
    				pink: '#f778ba'
    			},
    			tech: {
    				html: '#e34c26',
    				css: '#563d7c',
    				js: '#f1e05a',
    				ts: '#3178c6',
    				react: '#61dafb',
    				node: '#43853d',
    				python: '#3572A5',
    				firebase: '#FFCA28',
    				mongodb: '#13aa52'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
    				'sans-serif'
    			],
    			mono: [
    				'Fira Code',
    				'monospace'
    			]
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			float: {
    				'0%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				}
    			},
    			glow: {
    				'0%, 100%': {
    					filter: 'brightness(1)'
    				},
    				'50%': {
    					filter: 'brightness(1.2)'
    				}
    			},
    			'pulse-slow': {
    				'0%, 100%': {
    					opacity: '1'
    				},
    				'50%': {
    					opacity: '0.7'
    				}
    			},
    			'cursor-blink': {
    				'0%, 100%': {
    					opacity: '1'
    				},
    				'50%': {
    					opacity: '0'
    				}
    			},
    			ripple: {
    				'0%': {
    					transform: 'scale(0)',
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'scale(4)',
    					opacity: '0'
    				}
    			},
    			'bounce-soft': {
    				'0%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-15px)'
    				}
    			},
    			'rotate-slow': {
    				'0%': {
    					transform: 'rotate(0deg)'
    				},
    				'100%': {
    					transform: 'rotate(360deg)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			float: 'float 6s ease-in-out infinite',
    			glow: 'glow 3s ease-in-out infinite',
    			'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
    			'cursor-blink': 'cursor-blink 0.8s step-end infinite',
    			ripple: 'ripple 1s cubic-bezier(0, 0.2, 0.8, 1) forwards',
    			'bounce-soft': 'bounce-soft 3s ease-in-out infinite',
    			'rotate-slow': 'rotate-slow 15s linear infinite'
    		},
    		boxShadow: {
    			'neon-green': '0 0 5px #3fb950, 0 0 20px rgba(63, 185, 80, 0.3)',
    			'neon-purple': '0 0 5px #bf4dff, 0 0 20px rgba(191, 77, 255, 0.3)',
    			'neon-blue': '0 0 5px #1f6feb, 0 0 20px rgba(31, 111, 235, 0.3)',
    			'neon-pink': '0 0 5px #f778ba, 0 0 20px rgba(247, 120, 186, 0.3)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
