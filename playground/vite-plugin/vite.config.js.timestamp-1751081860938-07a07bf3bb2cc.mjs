// vite.config.js
import { defineConfig } from "file:///Users/MasashiOhtsubo/Projects/smsshcss/.yarn/__virtual__/vite-virtual-22f49612e7/3/.yarn/berry/cache/vite-npm-5.4.19-6d369030b0-10c0.zip/node_modules/vite/dist/node/index.js";
import smsshcss from "file:///Users/MasashiOhtsubo/Projects/smsshcss/.yarn/__virtual__/@smsshcss-vite-virtual-40a2107459/1/packages/@smsshcss/vite/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    smsshcss({
      includeReset: true,
      includeBase: true,
      minify: false,
      debug: false,
      content: [
        "./index.html",
        "./spacing.html",
        "./color.html",
        "./width-height.html",
        "./gap.html",
        "./apply.html",
        "./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
        "./components/**/*.{js,ts,jsx,tsx,vue}",
        "./**/*.html"
      ],
      apply: {
        "main-layout": "w-full max-w-12xl mx-auto px-md",
        container: "w-full max-w-4xl mx-auto px-md",
        "text-notification": "text-[rgb(255,0,0)]",
        "text-primary": "text-[#259270]"
      },
      showPurgeReport: false
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        spacing: "spacing.html",
        color: "color.html",
        "width-height": "width-height.html",
        gap: "gap.html",
        apply: "apply.html"
      }
    }
  },
  server: {
    port: 3e3,
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvTWFzYXNoaU9odHN1Ym8vUHJvamVjdHMvc21zc2hjc3MvcGxheWdyb3VuZC92aXRlLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL01hc2FzaGlPaHRzdWJvL1Byb2plY3RzL3Ntc3NoY3NzL3BsYXlncm91bmQvdml0ZS1wbHVnaW4vdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL01hc2FzaGlPaHRzdWJvL1Byb2plY3RzL3Ntc3NoY3NzL3BsYXlncm91bmQvdml0ZS1wbHVnaW4vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBzbXNzaGNzcyBmcm9tICdAc21zc2hjc3Mvdml0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBzbXNzaGNzcyh7XG4gICAgICBpbmNsdWRlUmVzZXQ6IHRydWUsXG4gICAgICBpbmNsdWRlQmFzZTogdHJ1ZSxcbiAgICAgIG1pbmlmeTogZmFsc2UsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG5cbiAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAgJy4vaW5kZXguaHRtbCcsXG4gICAgICAgICcuL3NwYWNpbmcuaHRtbCcsXG4gICAgICAgICcuL2NvbG9yLmh0bWwnLFxuICAgICAgICAnLi93aWR0aC1oZWlnaHQuaHRtbCcsXG4gICAgICAgICcuL2dhcC5odG1sJyxcbiAgICAgICAgJy4vYXBwbHkuaHRtbCcsXG4gICAgICAgICcuL3NyYy8qKi8qLntodG1sLGpzLHRzLGpzeCx0c3gsdnVlLHN2ZWx0ZX0nLFxuICAgICAgICAnLi9jb21wb25lbnRzLyoqLyoue2pzLHRzLGpzeCx0c3gsdnVlfScsXG4gICAgICAgICcuLyoqLyouaHRtbCcsXG4gICAgICBdLFxuXG4gICAgICBhcHBseToge1xuICAgICAgICAnbWFpbi1sYXlvdXQnOiAndy1mdWxsIG1heC13LTEyeGwgbXgtYXV0byBweC1tZCcsXG4gICAgICAgIGNvbnRhaW5lcjogJ3ctZnVsbCBtYXgtdy00eGwgbXgtYXV0byBweC1tZCcsXG5cbiAgICAgICAgJ3RleHQtbm90aWZpY2F0aW9uJzogJ3RleHQtW3JnYigyNTUsMCwwKV0nLFxuICAgICAgICAndGV4dC1wcmltYXJ5JzogJ3RleHQtWyMyNTkyNzBdJyxcbiAgICAgIH0sXG5cbiAgICAgIHNob3dQdXJnZVJlcG9ydDogZmFsc2UsXG4gICAgfSksXG4gIF0sXG5cbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBtYWluOiAnaW5kZXguaHRtbCcsXG4gICAgICAgIHNwYWNpbmc6ICdzcGFjaW5nLmh0bWwnLFxuICAgICAgICBjb2xvcjogJ2NvbG9yLmh0bWwnLFxuICAgICAgICAnd2lkdGgtaGVpZ2h0JzogJ3dpZHRoLWhlaWdodC5odG1sJyxcbiAgICAgICAgZ2FwOiAnZ2FwLmh0bWwnLFxuICAgICAgICBhcHBseTogJ2FwcGx5Lmh0bWwnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgb3BlbjogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VyxTQUFTLG9CQUFvQjtBQUN6WSxPQUFPLGNBQWM7QUFFckIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLE1BQ1AsY0FBYztBQUFBLE1BQ2QsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsT0FBTztBQUFBLE1BRVAsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUVBLE9BQU87QUFBQSxRQUNMLGVBQWU7QUFBQSxRQUNmLFdBQVc7QUFBQSxRQUVYLHFCQUFxQjtBQUFBLFFBQ3JCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsTUFFQSxpQkFBaUI7QUFBQSxJQUNuQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsT0FBTztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsUUFDaEIsS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
