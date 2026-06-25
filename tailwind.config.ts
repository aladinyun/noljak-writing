import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        noljak: {
          purple: '#534AB7',
          'purple-light': '#EEEDFE',
          'purple-dark': '#3C3489',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
