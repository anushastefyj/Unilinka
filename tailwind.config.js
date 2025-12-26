module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)', // blue-800
          foreground: 'var(--color-primary-foreground)' // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // violet-600
          foreground: 'var(--color-secondary-foreground)' // white
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // amber-500
          foreground: 'var(--color-accent-foreground)' // gray-800
        },
        background: 'var(--color-background)', // gray-50
        foreground: 'var(--color-foreground)', // gray-900
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)' // gray-800
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // gray-800
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-100
          foreground: 'var(--color-muted-foreground)' // gray-500
        },
        border: 'var(--color-border)', // slate-200
        input: 'var(--color-input)', // slate-200
        ring: 'var(--color-ring)', // blue-800
        success: {
          DEFAULT: 'var(--color-success)', // emerald-600
          foreground: 'var(--color-success-foreground)' // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-600
          foreground: 'var(--color-warning-foreground)' // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)' // white
        }
      },
      fontFamily: {
        heading: ['Crimson Text', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['IBM Plex Sans', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.2' }],
        'h2': ['1.875rem', { lineHeight: '1.25' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'h5': ['1.125rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.025em' }]
      },
      borderRadius: {
        'academic-sm': '6px',
        'academic': '12px',
        'academic-md': '18px',
        'academic-lg': '24px'
      },
      spacing: {
        'academic-xs': '8px',
        'academic-sm': '16px',
        'academic': '24px',
        'academic-md': '32px',
        'academic-lg': '48px',
        'academic-xl': '64px',
        'academic-2xl': '80px',
        'academic-3xl': '120px'
      },
      boxShadow: {
        'academic-sm': '0 1px 3px rgba(15, 23, 42, 0.08)',
        'academic': '0 2px 6px rgba(15, 23, 42, 0.12)',
        'academic-md': '0 4px 12px rgba(15, 23, 42, 0.12)',
        'academic-lg': '0 8px 24px rgba(15, 23, 42, 0.14)',
        'academic-xl': '0 20px 40px -8px rgba(15, 23, 42, 0.16)'
      },
      transitionTimingFunction: {
        'academic': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitionDuration: {
        'academic': '250ms'
      },
      zIndex: {
        'base': '0',
        'card': '1',
        'dropdown': '50',
        'navigation': '100',
        'modal': '200',
        'notification': '300'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}