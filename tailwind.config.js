// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    // Configure the paths to all of your HTML templates, JS files, etc.
    // so Tailwind knows where to scan for classes.
    content: [
      "./frontend/**/*.{html,js}", // Looks for .html and .js files in the frontend folder and its subfolders
      "./backend/views/**/*.{html,js}", // Include if you have backend views (e.g., templating engine)
    ],
    darkMode: 'class', // Or 'media' if you prefer based on OS setting
  
    theme: {
      extend: {
        // --- Map CSS Variables to Tailwind Color Names ---
        // These names (e.g., 'background', 'foreground') will become part of Tailwind classes
        // e.g., class="bg-background text-foreground"
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          card: 'var(--card)',
          'card-foreground': 'var(--card-foreground)',
          popover: 'var(--popover)',
          'popover-foreground': 'var(--popover-foreground)',
          primary: 'var(--primary)',
          'primary-foreground': 'var(--primary-foreground)',
          secondary: 'var(--secondary)',
          'secondary-foreground': 'var(--secondary-foreground)',
          muted: 'var(--muted)',
          'muted-foreground': 'var(--muted-foreground)',
          accent: 'var(--accent)',
          'accent-foreground': 'var(--accent-foreground)',
          destructive: 'var(--destructive)',
          'destructive-foreground': 'var(--destructive-foreground)',
          border: 'var(--border)',
          input: 'var(--input)',
          ring: 'var(--ring)',
          // Chart colors (map directly or create a nested 'chart' object)
          'chart-1': 'var(--chart-1)',
          'chart-2': 'var(--chart-2)',
          'chart-3': 'var(--chart-3)',
          'chart-4': 'var(--chart-4)',
          'chart-5': 'var(--chart-5)',
          // Sidebar colors (map directly or create a nested 'sidebar' object)
          sidebar: 'var(--sidebar)',
          'sidebar-foreground': 'var(--sidebar-foreground)',
          'sidebar-primary': 'var(--sidebar-primary)',
          'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
          'sidebar-accent': 'var(--sidebar-accent)',
          'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
          'sidebar-border': 'var(--sidebar-border)',
          'sidebar-ring': 'var(--sidebar-ring)',
        },
  
        // --- Map CSS Radius Variable to Tailwind Radius Names ---
        // TweakCN provides various radius sizes based on a base --radius
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)', // Using the TweakCN calculation example
          sm: 'calc(var(--radius) - 4px)', // Using the TweakCN calculation example
          // Add more if needed, based on TweakCN's output or your design
          xl: 'calc(var(--radius) + 4px)',
          '2xl': 'calc(var(--radius) + 8px)',
          'full': '9999px', // Keep default full rounded
        },
  
        // --- Map CSS Shadow Variables to Tailwind Shadow Names ---
        boxShadow: {
           '2xs': 'var(--shadow-2xs)',
           'xs': 'var(--shadow-xs)',
           'sm': 'var(--shadow-sm)',
           // 'shadow' often maps to 'DEFAULT' in Tailwind
           'DEFAULT': 'var(--shadow)',
           'md': 'var(--shadow-md)',
           'lg': 'var(--shadow-lg)',
           'xl': 'var(--shadow-xl)',
           '2xl': 'var(--shadow-2xl)',
           // You can add 'inner', 'outline', 'none' if you need them but they aren't in your variables
        },
  
        // --- Map CSS Font Variables to Tailwind Font Names ---
        fontFamily: {
            sans: ['var(--font-sans)', 'sans-serif'], // Include a fallback
            serif: ['var(--font-serif)', 'serif'],   // Include a fallback
            mono: ['var(--font-mono)', 'monospace'], // Include a fallback
        },
  
        // --- Add other theme extensions if needed ---
        // You might need to add custom spacing units if they weren't covered by defaults
        // spacing: {
        //   '128': '32rem', // Example custom spacing
        // },
        // You might need to add custom font sizes if they weren't covered by defaults
        // fontSize: {
        //   '7xl': '5rem', // Example custom font size
        // },
        // You might need to extend fontWeight if your font has specific named weights (e.g., 'black')
        // fontWeight: {
        //   'black': '900',
        // },
      },
    },
    plugins: [], // Add any Tailwind plugins you want to use here
  }