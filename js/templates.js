/**
 * 名片模板定义
 * =============
 * 定义所有可选的名片样式模板
 * 每个模板包含名称、描述、配色方案和样式类名
 */

const TEMPLATES = [
  {
    id: "classic",
    nameCN: "经典商务",
    nameEN: "Classic Business",
    description: "深蓝底色 + 白色文字，稳重大气",
    // 模板颜色方案
    colors: {
      background: "#1b365d",       // 深蓝色背景
      backgroundSecondary: "#264478", // 次要背景色
      textPrimary: "#ffffff",      // 主要文字颜色（白色）
      textSecondary: "#b8cce4",    // 次要文字颜色（浅蓝）
      accent: "#c9a84c",           // 强调色（金色线条）
      divider: "#c9a84c"           // 分隔线颜色
    },
    thumbnail: "🔵"
  },
  {
    id: "modern",
    nameCN: "清新现代",
    nameEN: "Fresh Modern",
    description: "白色底色 + 彩色点缀，干净利落",
    colors: {
      background: "#ffffff",
      backgroundSecondary: "#f0f4f8",
      textPrimary: "#2d3748",
      textSecondary: "#718096",
      accent: "#38b2ac",
      divider: "#e2e8f0"
    },
    thumbnail: "🟢"
  },
  {
    id: "dark-gold",
    nameCN: "极简黑金",
    nameEN: "Minimalist Black & Gold",
    description: "黑色底色 + 金色文字，高端奢华",
    colors: {
      background: "#1a1a2e",
      backgroundSecondary: "#16213e",
      textPrimary: "#d4af37",
      textSecondary: "#c0c0c0",
      accent: "#d4af37",
      divider: "#d4af37"
    },
    thumbnail: "⚫"
  },
  {
    id: "tech-blue",
    nameCN: "科技蓝",
    nameEN: "Tech Blue",
    description: "蓝色渐变背景 + 白色文字，科技感十足",
    colors: {
      background: "linear-gradient(135deg, #0077b6, #00b4d8)",
      backgroundSecondary: "#0096c7",
      textPrimary: "#ffffff",
      textSecondary: "#caf0f8",
      accent: "#90e0ef",
      divider: "rgba(255,255,255,0.3)"
    },
    thumbnail: "🔷"
  },
  {
    id: "china-red",
    nameCN: "中国红",
    nameEN: "Chinese Red",
    description: "白色底色 + 红色点缀，传统优雅",
    colors: {
      background: "#ffffff",
      backgroundSecondary: "#fff5f5",
      textPrimary: "#1a1a1a",
      textSecondary: "#666666",
      accent: "#c53030",
      divider: "#c53030"
    },
    thumbnail: "🔴"
  },
  // ====== 以下是带背景图案的新模板 ======
  {
    id: "circuit",
    nameCN: "电路板",
    nameEN: "Circuit Board",
    description: "PCB电路板纹理背景，科技电子风格",
    colors: {
      background: "#0a5e2a",
      backgroundSecondary: "#0d7a38",
      textPrimary: "#ffffff",
      textSecondary: "#a7f3d0",
      accent: "#34d399",
      divider: "#34d399"
    },
    backgroundImage: "assets/backgrounds/circuit.svg",
    thumbnail: "🟩"
  },
  {
    id: "starfield",
    nameCN: "星空科技",
    nameEN: "Starfield Tech",
    description: "深邃星空背景，搭配科技网络连线",
    colors: {
      background: "#0a0a1a",
      backgroundSecondary: "#1a1a3e",
      textPrimary: "#ffffff",
      textSecondary: "#a5b4fc",
      accent: "#818cf8",
      divider: "#6366f1"
    },
    backgroundImage: "assets/backgrounds/starfield.svg",
    thumbnail: "🌌"
  },
  {
    id: "geometric",
    nameCN: "几何蓝白",
    nameEN: "Geometric Light",
    description: "浅色底+蓝色几何六边形图案，清爽专业",
    colors: {
      background: "#f8fafc",
      backgroundSecondary: "#e2e8f0",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      accent: "#3b82f6",
      divider: "#3b82f6"
    },
    backgroundImage: "assets/backgrounds/geometric.svg",
    thumbnail: "🔷"
  },
  {
    id: "wave",
    nameCN: "紫韵波纹",
    nameEN: "Purple Wave",
    description: "紫色渐变背景+波浪纹理，优雅科技",
    colors: {
      background: "#4338ca",
      backgroundSecondary: "#312e81",
      textPrimary: "#ffffff",
      textSecondary: "#c7d2fe",
      accent: "#a5b4fc",
      divider: "rgba(255,255,255,0.3)"
    },
    backgroundImage: "assets/backgrounds/wave.svg",
    thumbnail: "🟪"
  }
];
