/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        caveat: 'Caveat'
      },
      container: {
        padding: '24px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      },
      fontSize: {
        '2xs': '.625rem',
        xs: '.75rem',
        sm: '.9375rem',
        base: '1rem',
        lg: '1.5rem'
      },
      colors: {
        purple: {
          6: '#f7e6f2',
          12: '#efcde6',
          18: '#e7b3d9',
          24: '#df9acd',
          30: '#d781c0',
          36: '#cf68b3',
          42: '#c74ea7',
          48: '#bf359a',
          54: '#b71c8e',
          60: '#a81a82',
          66: '#9a1877',
          72: '#8b156c',
          78: '#7c1360',
          84: '#6e1155',
          90: '#5f0f4a',
          96: '#500c3e',
          102: '#420a33',
          108: '#330828'
        },
        blue: {
          6: '#e6f6f7',
          12: '#cdeeef',
          18: '#b3e5e7',
          24: '#9adddf',
          30: '#81d4d7',
          36: '#68cccf',
          42: '#4ec3c7',
          48: '#35babf',
          54: '#1cb2b7',
          60: '#1aa4a8',
          66: '#18959a',
          72: '#15878b',
          78: '#13797c',
          84: '#116b6e',
          90: '#0f5c5f',
          96: '#0c4e50',
          102: '#0a4042',
          108: '#083233'
        },
        black: {
          5: '#ffffff',
          10: '#f2f2f2',
          15: '#e6e6e6',
          20: '#d9d9d9',
          25: '#cccccc',
          30: '#bfbfbf',
          35: '#b3b3b3',
          40: '#a6a6a6',
          45: '#999999',
          50: '#8c8c8c',
          55: '#808080',
          60: '#737373',
          65: '#666666',
          70: '#595959',
          75: '#4d4d4d',
          80: '#404040',
          85: '#333333',
          90: '#262626',
          95: '#1a1a1a',
          100: '#0d0d0d'
        }
      },
      boxShadow: {
        nav: '0 0 16px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
};
