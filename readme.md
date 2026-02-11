# 📇 电子名片制作器 Card Maker

一个简单易用的在线电子名片制作工具，员工只需选择公司、填写个人信息，即可快速生成专业的中英文电子名片，并导出为PNG图片。

---

## 🌐 在线访问地址

| 平台 | 网址 | 适用区域 |
|------|------|---------|
| **公司NAS**（推荐）| http://linpo.familyds.net:8080/card/ | 🇨🇳 国内随时可用 |
| **公司内网** | http://192.168.90.24/card/ | 🏢 公司网络内 |
| **Cloudflare** | https://card.jbdmsxzgp8.workers.dev/ | 🌍 备用 |
| **Vercel** | https://card-eight-fawn.vercel.app/ | 🌍 备用 |
| **GitHub Pages** | https://fbzyf.github.io/card/ | 🌍 备用 |

> 💡 **推荐使用公司NAS链接，国内访问速度最快最稳定**

---

## 🚀 快速开始

### 员工使用方法

1. 打开网页：**http://linpo.familyds.net:8080/card/**
2. **选择公司** → 从下拉列表选择你所在的公司
3. **选择版式** → 横版或竖版
4. **选择模板** → 5种精美模板任你选
5. **填写信息** → 输入姓名、职位、手机、邮箱等
6. **上传头像**（可选）
7. **导出名片** → 点击导出按钮下载PNG图片

就这么简单！3分钟搞定你的电子名片。

---

## 🎨 可选模板

| 模板 | 风格 | 适合行业 |
|------|------|---------|
| 经典商务 | 深蓝底 + 白字 | 金融、法律、咨询 |
| 清新现代 | 白底 + 彩色点缀 | 互联网、科技 |
| 极简黑金 | 黑底 + 金字 | 高端品牌、奢侈品 |
| 科技蓝 | 蓝色渐变 | 科技、AI |
| 中国红 | 白底 + 红色 | 传统企业、国企 |

---

## 🔧 管理员指南

### 如何添加新公司

编辑 `js/companies.js` 文件，在 `COMPANIES` 数组中添加新公司：

```javascript
{
  id: "new-company",                    // 唯一ID，英文小写
  nameCN: "新公司中文名",                // 中文名称
  nameEN: "New Company English Name",   // 英文名称
  logo: "assets/logos/new-company.png", // Logo路径
  addressCN: "中文地址",                 // 中文地址
  addressEN: "English Address",         // 英文地址
  website: "www.example.com",           // 公司网址
  phone: "010-12345678",               // 公司电话
  primaryColor: "#1a73e8"              // 品牌主色
}
```

### 如何添加公司Logo

1. 准备Logo图片（建议PNG格式，透明背景，200×200像素左右）
2. 将图片放到 `assets/logos/` 文件夹
3. 在 `js/companies.js` 中对应公司的 `logo` 字段填写路径

### 如何部署到网上

本项目已部署到以下三个平台，修改代码推送到 GitHub 后会自动更新：

**平台一：Cloudflare Pages（推荐，国内可访问，免费）**
- 网址：https://card.jbdmsxzgp8.workers.dev/
- 推送 GitHub 后自动部署

**平台二：Vercel（免费）**
- 网址：https://card-eight-fawn.vercel.app/
- 推送 GitHub 后自动部署

**平台三：GitHub Pages（免费，国内不可用）**
- 网址：https://fbzyf.github.io/card/
- 推送 GitHub 后自动部署

**代码仓库：**
- GitHub：https://github.com/fbzyf/card
- Gitee（国内镜像）：https://gitee.com/linpozhu/card

---

## 📁 项目结构

```
card/
├── index.html          ← 主页面
├── css/
│   └── style.css       ← 页面和名片样式
├── js/
│   ├── companies.js    ← 公司预设数据【管理员编辑此文件】
│   ├── templates.js    ← 名片模板定义
│   ├── app.js          ← 主逻辑（表单交互、实时预览）
│   └── export.js       ← 导出图片功能
├── assets/
│   ├── logos/          ← 公司Logo图片
│   └── fonts/          ← 字体文件（如需要）
└── readme.md           ← 本说明文件
```

---

## 📋 功能清单

- ✅ 公司信息预设，下拉选择
- ✅ 横版/竖版两种版式
- ✅ 5套精美名片模板
- ✅ 中英文双面名片
- ✅ 实时预览效果
- ✅ 导出高清PNG图片
- ✅ 支持上传个人头像
- ✅ 可选字段：微信、座机、部门
- ✅ 纯前端实现，无需后端服务器
- ✅ 响应式设计，手机电脑都能用

---

## ⚠️ 注意事项

1. 导出图片需要网络连接（首次加载 html2canvas 库）
2. 建议使用 Chrome / Edge 浏览器以获得最佳体验
3. Logo图片建议使用PNG透明背景格式
4. 图片过大可能导致导出较慢，头像建议5MB以内

---

## 📝 后续可改进

- [ ] 支持更多名片模板
- [ ] 名片背面装饰图案
- [ ] 支持二维码嵌入名片
- [ ] 批量生成名片（Excel导入）
- [ ] 支持PDF导出
