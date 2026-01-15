// ========================================
// TAILWIND CONFIG - PIXELPERFECT
// ========================================
// File: frontend/tailwind.config.js
// Author: OneTechly
// Purpose: Tailwind CSS configuration
// Updated: January 2026

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Custom Colors
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      
      // Custom Font Families
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"Fira Code"',
          '"Courier New"',
          'Courier',
          'monospace',
        ],
      },
      
      // Custom Spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      
      // Custom Border Radius
      borderRadius: {
        '4xl': '2rem',
      },
      
      // Custom Box Shadows
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
      },
      
      // Custom Animations
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Custom Typography
      fontSize: {
        'xxs': '0.625rem',
      },
      
      // Custom Line Heights
      lineHeight: {
        'extra-loose': '2.5',
        '12': '3rem',
      },
      
      // Custom Max Widths
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // Custom Min Heights
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      
      // Custom Z-Index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Custom Backdrop Blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom Transitions
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    // Forms plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class', // Use 'form-input', 'form-select' classes
    }),
    
    // Typography plugin for rich text
    require('@tailwindcss/typography'),
    
    // Aspect Ratio plugin
    require('@tailwindcss/aspect-ratio'),
    
    // Line Clamp plugin (if using Tailwind 3.0+, this is built-in)
    // require('@tailwindcss/line-clamp'),
  ],
  
  // Safelist - Classes that should never be purged
  safelist: [
    'bg-blue-100',
    'bg-green-100',
    'bg-red-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-indigo-100',
    'bg-orange-100',
    'text-blue-700',
    'text-green-700',
    'text-red-700',
    'text-yellow-700',
    'text-purple-700',
    'text-indigo-700',
    'text-orange-700',
    'border-blue-200',
    'border-green-200',
    'border-red-200',
    'border-yellow-200',
  ],
}

// // tailwind.config.js  (ROOT ONLY)
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
//   theme: { extend: {} },
//   // MUST be an ARRAY. If you want the forms plugin, keep the require line below.
//   plugins: [require('@tailwindcss/forms')],
// };


