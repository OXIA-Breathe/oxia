
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
			fontFamily: {
				sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
				jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
			},
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
				// Custom breathing app colors
				// OXIA palette
				breath: {
					light: '#F0F5F4',   // Quartz
					DEFAULT: '#225688', // Lapis (primary brand)
					dark: '#092C56',    // Abyss
				},
				quartz: '#F0F5F4',
				glacier: '#A9CBE0',
				slate: '#668CA9',
				lapis: '#225688',
				abyss: '#092C56',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'breathe-in': {
					'0%': {
						transform: 'scale(1)',
						opacity: '0.7'
					},
					'100%': {
						transform: 'scale(1.3)',
						opacity: '1'
					}
				},
				'breathe-out': {
					'0%': {
						transform: 'scale(1.3)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '0.7'
					}
				},
				'breathe-hold': {
					'0%': {
						boxShadow: '0 0 0 0 rgba(119, 169, 232, 0.7)'
					},
					'50%': {
						boxShadow: '0 0 0 20px rgba(119, 169, 232, 0.3)'
					},
					'100%': {
						boxShadow: '0 0 0 0 rgba(119, 169, 232, 0.7)'
					}
				},
				'fluid-float-1': {
					'0%, 100%': { 
						transform: 'translate(0%, 0%) scale(1)',
						opacity: '0.6'
					},
					'33%': { 
						transform: 'translate(20%, -15%) scale(1.1)',
						opacity: '0.8'
					},
					'66%': { 
						transform: 'translate(-15%, 10%) scale(0.9)',
						opacity: '0.7'
					}
				},
				'fluid-float-2': {
					'0%, 100%': { 
						transform: 'translate(0%, 0%) scale(1)',
						opacity: '0.5'
					},
					'33%': { 
						transform: 'translate(-25%, 20%) scale(1.2)',
						opacity: '0.7'
					},
					'66%': { 
						transform: 'translate(15%, -10%) scale(0.85)',
						opacity: '0.6'
					}
				},
				'fluid-float-3': {
					'0%, 100%': { 
						transform: 'translate(0%, 0%) scale(1) rotate(0deg)',
						opacity: '0.4'
					},
					'50%': { 
						transform: 'translate(10%, -20%) scale(1.15) rotate(180deg)',
						opacity: '0.6'
					}
				},
				breathe: {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
					'50%': { transform: 'scale(1.1)', opacity: '1' },
				},
				wave: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'10%, 30%': { transform: 'rotate(14deg)' },
					'20%, 40%': { transform: 'rotate(-8deg)' },
					'50%, 100%': { transform: 'rotate(0deg)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'breathe-in': 'breathe-in var(--breathe-in-duration, 4s) ease-in-out forwards',
				'breathe-out': 'breathe-out var(--breathe-out-duration, 4s) ease-in-out forwards',
				'breathe-hold': 'breathe-hold var(--breathe-hold-duration, 4s) ease-in-out infinite',
				'fluid-1': 'fluid-float-1 8s ease-in-out infinite',
				'fluid-2': 'fluid-float-2 10s ease-in-out infinite',
				'fluid-3': 'fluid-float-3 12s ease-in-out infinite',
				breathe: 'breathe 4s ease-in-out infinite',
				wave: 'wave 1s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
