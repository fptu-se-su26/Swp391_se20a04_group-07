/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#16233F",       // navy đậm - header, thanh điều hướng
        "ink-soft": "#22335A",
        amber: "#F2A93B",     // vàng xe buýt - accent chính
        "amber-soft": "#FCE7C2",
        route: "#2E9E6B",     // xanh - đúng giờ / đã lên xe
        "route-soft": "#DCEFE4",
        flag: "#E15241",      // đỏ cam - cảnh báo / vắng / đình chỉ
        "flag-soft": "#FBDFDA",
        paper: "#F6F3EC",     // nền kem ấm
        "paper-dim": "#EDE8DC",
        graphite: "#5B6472",  // chữ phụ
        line: "#E2DDD0",      // đường viền/chấm phân cách
      },
      fontFamily: {
        display: ["Sora_600SemiBold"],
        "display-bold": ["Sora_700Bold"],
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
        mono: ["IBMPlexMono_500Medium"],
      },
    },
  },
  plugins: [],
};
