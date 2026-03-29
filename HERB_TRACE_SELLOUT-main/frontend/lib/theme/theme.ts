export const Theme = {
  brandName: "HerbTracking",

  colors: {
    primary: "#047857",
    secondary: "#16A34A",
    accent: "#DCFCE7",
    backgroundStart: "#F0FDF4",
    backgroundEnd: "#ECFDF5",
  },

  gradients: {
    main: "bg-gradient-to-br from-emerald-50 via-white to-emerald-100",
  },

  card: {
    base: "bg-white rounded-2xl p-8 text-center shadow-sm border border-emerald-100",
    hover: "hover:shadow-lg hover:-translate-y-1 transition duration-300",
  },

  glass: "bg-white/70 backdrop-blur-xl border border-emerald-100",

  layout: {
    container: "min-h-screen flex items-center justify-center bg-emerald-50",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8",
  },
}
