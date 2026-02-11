/**
 * 电子名片制作器 - 主应用逻辑 v2.0
 * ============================
 * 负责：
 * 1. 初始化页面（填充公司列表、模板选项）
 * 2. 表单交互（监听输入变化）
 * 3. 实时更新名片预览（中英文同时显示）
 * 4. 导出按钮绑定
 */

// ==================== 应用状态 ====================
const AppState = {
  selectedCompany: null,       // 当前选中的公司对象
  selectedTemplate: "classic", // 当前选中的模板ID
  selectedLayout: "horizontal",// 当前选中的版式
  avatarDataUrl: null          // 头像图片的 DataURL
};

// ==================== 初始化 ====================
document.addEventListener("DOMContentLoaded", function() {
  console.log("[Card Maker] 初始化中...");
  
  initCompanySelect();
  initTemplateOptions();
  initLayoutOptions();
  initFormListeners();
  initAvatarUpload();
  initExportButtons();
  
  // 应用默认模板样式
  applyTemplate(AppState.selectedTemplate);
  
  console.log("[Card Maker] 初始化完成 ✓");
});

// ==================== 公司选择 ====================
/**
 * 初始化公司下拉列表
 */
function initCompanySelect() {
  const select = document.getElementById("companySelect");
  
  // 填充公司选项
  COMPANIES.forEach(function(company) {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.nameCN + " / " + company.nameEN;
    select.appendChild(option);
  });

  // 监听选择变化
  select.addEventListener("change", function() {
    const companyId = this.value;
    const companyInfoEl = document.getElementById("companyInfo");

    if (!companyId) {
      // 取消选择
      AppState.selectedCompany = null;
      companyInfoEl.classList.add("hidden");
      updateCardPreview();
      return;
    }

    // 查找选中的公司
    const company = COMPANIES.find(function(c) { return c.id === companyId; });
    if (company) {
      AppState.selectedCompany = company;

      // 显示公司信息
      document.getElementById("companyDisplayName").textContent = 
        company.nameCN + " / " + company.nameEN;
      document.getElementById("companyDisplayAddress").textContent = company.addressCN;
      document.getElementById("companyDisplayWebsite").textContent = company.website;
      companyInfoEl.classList.remove("hidden");

      // 更新预览
      updateCardPreview();
      
      console.log("[公司选择]", company.nameCN);
    }
  });
}

// ==================== 模板选择 ====================
/**
 * 初始化模板选项
 */
function initTemplateOptions() {
  const container = document.getElementById("templateOptions");

  TEMPLATES.forEach(function(template, index) {
    const div = document.createElement("div");
    div.className = "template-option" + (index === 0 ? " active" : "");
    div.setAttribute("data-template", template.id);

    // 颜色预览块
    const colorBlock = document.createElement("div");
    colorBlock.className = "template-color-block";
    
    // 如果模板有背景图，使用背景图作为缩略图
    if (template.backgroundImage) {
      colorBlock.style.backgroundImage = "url('" + template.backgroundImage + "')";
      colorBlock.style.backgroundSize = "cover";
      colorBlock.style.backgroundPosition = "center";
    } else {
      const bg = template.colors.background;
      if (bg.startsWith("linear")) {
        colorBlock.style.background = bg;
      } else {
        colorBlock.style.backgroundColor = bg;
      }
      // 如果背景是白色，添加边框
      if (bg === "#ffffff" || bg === "#f8fafc") {
        colorBlock.style.border = "1px solid #e2e8f0";
      }
    }

    // 模板名称
    const nameSpan = document.createElement("div");
    nameSpan.className = "template-name";
    nameSpan.textContent = template.nameCN;

    div.appendChild(colorBlock);
    div.appendChild(nameSpan);
    container.appendChild(div);

    // 点击切换模板
    div.addEventListener("click", function() {
      // 更新选中状态
      container.querySelectorAll(".template-option").forEach(function(el) {
        el.classList.remove("active");
      });
      div.classList.add("active");
      
      AppState.selectedTemplate = template.id;
      applyTemplate(template.id);
      
      console.log("[模板切换]", template.nameCN);
    });
  });
}

/**
 * 应用模板到名片
 * @param {string} templateId 
 */
function applyTemplate(templateId) {
  const cards = document.querySelectorAll(".business-card");
  cards.forEach(function(card) {
    // 移除所有模板 class
    card.className = card.className.replace(/theme-\S+/g, "").trim();
    // 添加新模板 class
    card.classList.add("theme-" + templateId);
  });
}

// ==================== 版式选择 ====================
/**
 * 初始化版式（横版/竖版）选择
 */
function initLayoutOptions() {
  const options = document.querySelectorAll(".layout-option");
  
  options.forEach(function(option) {
    option.addEventListener("click", function() {
      const layout = this.getAttribute("data-layout");
      
      // 更新选中状态
      options.forEach(function(el) { el.classList.remove("active"); });
      this.classList.add("active");
      
      // 更新状态
      AppState.selectedLayout = layout;
      
      // 更新名片方向
      const cards = document.querySelectorAll(".business-card");
      cards.forEach(function(card) {
        card.classList.remove("horizontal", "vertical");
        card.classList.add(layout);
      });
      
      console.log("[版式切换]", layout === "horizontal" ? "横版" : "竖版");
    });
  });
}

// ==================== 表单监听 ====================
/**
 * 初始化所有表单输入的监听器
 */
function initFormListeners() {
  // 需要监听的输入字段
  const fields = [
    "nameCN", "nameEN", "titleCN", "titleEN",
    "deptCN", "deptEN", "mobile", "email",
    "wechat", "telephone"
  ];

  fields.forEach(function(fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener("input", function() {
        updateCardPreview();
      });
    }
  });
}

// ==================== 头像上传 ====================
/**
 * 初始化头像上传功能
 * 上传后会弹出裁剪窗口，让用户拖动和缩放照片使人脸居中
 */
function initAvatarUpload() {
  const input = document.getElementById("avatarInput");
  const clearBtn = document.getElementById("avatarClear");

  input.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件（JPG、PNG等）");
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("图片文件过大，请选择5MB以内的图片");
      return;
    }

    // 读取文件后打开裁剪弹窗
    var reader = new FileReader();
    reader.onload = function(event) {
      showCropModal(event.target.result);
      console.log("[头像上传] 打开裁剪窗口");
    };
    reader.readAsDataURL(file);
  });

  // 移除头像
  clearBtn.addEventListener("click", function() {
    AppState.avatarDataUrl = null;
    document.getElementById("avatarPreview").innerHTML = '<span class="avatar-placeholder">👤</span>';
    clearBtn.classList.add("hidden");
    input.value = "";
    updateCardPreview();
  });

  // 初始化裁剪弹窗的交互
  initCropModal();
}

// ==================== 头像裁剪功能 ====================

/**
 * 裁剪弹窗的状态管理
 */
var CropState = {
  image: null,           // 原始 Image 对象
  baseScale: 1,          // 基础缩放（让图片覆盖圆框）
  zoom: 1,               // 用户缩放倍数（1~3）
  offsetX: 0,            // 图片水平偏移（像素）
  offsetY: 0,            // 图片垂直偏移（像素）
  isDragging: false,     // 是否正在拖动
  dragStartX: 0,         // 拖动起始鼠标X
  dragStartY: 0,         // 拖动起始鼠标Y
  dragStartOffsetX: 0,   // 拖动起始图片偏移X
  dragStartOffsetY: 0    // 拖动起始图片偏移Y
};

/** 圆形裁剪框的显示尺寸（像素） */
var CROP_CIRCLE_SIZE = 200;

/**
 * 打开头像裁剪弹窗
 * @param {string} dataUrl - 图片的 DataURL
 */
function showCropModal(dataUrl) {
  var modal = document.getElementById("avatarCropModal");
  var cropImg = document.getElementById("cropImage");

  // 加载图片获取原始尺寸
  var tempImg = new Image();
  tempImg.onload = function() {
    CropState.image = tempImg;

    // 计算基础缩放：让图片完全覆盖圆框（cover模式）
    CropState.baseScale = Math.max(
      CROP_CIRCLE_SIZE / tempImg.naturalWidth,
      CROP_CIRCLE_SIZE / tempImg.naturalHeight
    );

    // 重置缩放
    CropState.zoom = 1;

    // 居中显示
    var dispW = tempImg.naturalWidth * CropState.baseScale;
    var dispH = tempImg.naturalHeight * CropState.baseScale;
    CropState.offsetX = (CROP_CIRCLE_SIZE - dispW) / 2;
    CropState.offsetY = (CROP_CIRCLE_SIZE - dispH) / 2;

    // 设置裁剪图片
    cropImg.src = dataUrl;

    // 应用变换
    applyCropTransform();

    // 重置缩放滑块
    document.getElementById("cropZoom").value = 100;

    // 显示弹窗
    modal.classList.remove("hidden");

    console.log("[裁剪弹窗] 打开，图片尺寸:", tempImg.naturalWidth, "x", tempImg.naturalHeight);
  };
  tempImg.src = dataUrl;
}

/**
 * 将当前裁剪状态应用到预览图片
 */
function applyCropTransform() {
  var cropImg = document.getElementById("cropImage");
  var totalScale = CropState.baseScale * CropState.zoom;
  var dispW = CropState.image.naturalWidth * totalScale;
  var dispH = CropState.image.naturalHeight * totalScale;

  cropImg.style.width = dispW + "px";
  cropImg.style.height = dispH + "px";
  cropImg.style.left = CropState.offsetX + "px";
  cropImg.style.top = CropState.offsetY + "px";
}

/**
 * 限制图片偏移量，确保图片始终覆盖圆框（不留空白）
 */
function clampCropOffset() {
  var totalScale = CropState.baseScale * CropState.zoom;
  var dispW = CropState.image.naturalWidth * totalScale;
  var dispH = CropState.image.naturalHeight * totalScale;

  // 图片左边不能超过圆框左边，右边不能小于圆框右边
  CropState.offsetX = Math.min(0, Math.max(CROP_CIRCLE_SIZE - dispW, CropState.offsetX));
  CropState.offsetY = Math.min(0, Math.max(CROP_CIRCLE_SIZE - dispH, CropState.offsetY));
}

/**
 * 裁剪图片并导出为 DataURL
 * 将圆框中可见的部分裁剪为正方形图片
 * @returns {string} 裁剪后的图片 DataURL
 */
function cropAndExport() {
  var outputSize = 400; // 输出 400x400 像素，保证清晰度
  var totalScale = CropState.baseScale * CropState.zoom;
  var invScale = 1 / totalScale;

  // 计算原图中对应圆框可见区域的矩形
  var sx = -CropState.offsetX * invScale;
  var sy = -CropState.offsetY * invScale;
  var sSize = CROP_CIRCLE_SIZE * invScale;

  // 用 Canvas 裁剪
  var canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  var ctx = canvas.getContext("2d");

  ctx.drawImage(CropState.image, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);

  console.log("[裁剪导出] 从原图裁剪区域:", Math.round(sx), Math.round(sy), Math.round(sSize), "→ 输出", outputSize, "x", outputSize);

  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * 初始化裁剪弹窗的所有交互事件
 * 包括：拖拽移动、缩放滑块、鼠标滚轮缩放、确认/取消按钮
 */
function initCropModal() {
  var circle = document.getElementById("cropCircle");
  var zoomSlider = document.getElementById("cropZoom");
  var confirmBtn = document.getElementById("cropConfirm");
  var cancelBtn = document.getElementById("cropCancel");
  var modal = document.getElementById("avatarCropModal");
  var overlay = modal.querySelector(".crop-modal-overlay");

  // ---- 鼠标拖拽 ----
  circle.addEventListener("mousedown", function(e) {
    e.preventDefault();
    CropState.isDragging = true;
    CropState.dragStartX = e.clientX;
    CropState.dragStartY = e.clientY;
    CropState.dragStartOffsetX = CropState.offsetX;
    CropState.dragStartOffsetY = CropState.offsetY;
  });

  document.addEventListener("mousemove", function(e) {
    if (!CropState.isDragging) return;
    var dx = e.clientX - CropState.dragStartX;
    var dy = e.clientY - CropState.dragStartY;
    CropState.offsetX = CropState.dragStartOffsetX + dx;
    CropState.offsetY = CropState.dragStartOffsetY + dy;
    clampCropOffset();
    applyCropTransform();
  });

  document.addEventListener("mouseup", function() {
    CropState.isDragging = false;
  });

  // ---- 触屏拖拽（手机端支持） ----
  circle.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
      e.preventDefault();
      CropState.isDragging = true;
      CropState.dragStartX = e.touches[0].clientX;
      CropState.dragStartY = e.touches[0].clientY;
      CropState.dragStartOffsetX = CropState.offsetX;
      CropState.dragStartOffsetY = CropState.offsetY;
    }
  }, { passive: false });

  document.addEventListener("touchmove", function(e) {
    if (!CropState.isDragging) return;
    if (e.touches.length === 1) {
      var dx = e.touches[0].clientX - CropState.dragStartX;
      var dy = e.touches[0].clientY - CropState.dragStartY;
      CropState.offsetX = CropState.dragStartOffsetX + dx;
      CropState.offsetY = CropState.dragStartOffsetY + dy;
      clampCropOffset();
      applyCropTransform();
    }
  }, { passive: false });

  document.addEventListener("touchend", function() {
    CropState.isDragging = false;
  });

  // ---- 缩放滑块 ----
  zoomSlider.addEventListener("input", function() {
    var newZoom = parseInt(this.value) / 100;
    var oldZoom = CropState.zoom;

    // 以圆框中心为基准点缩放（缩放时保持中心不变）
    var ratio = newZoom / oldZoom;
    var centerX = CROP_CIRCLE_SIZE / 2;
    var centerY = CROP_CIRCLE_SIZE / 2;
    CropState.offsetX = CropState.offsetX * ratio + centerX * (1 - ratio);
    CropState.offsetY = CropState.offsetY * ratio + centerY * (1 - ratio);

    CropState.zoom = newZoom;
    clampCropOffset();
    applyCropTransform();
  });

  // ---- 鼠标滚轮缩放 ----
  circle.addEventListener("wheel", function(e) {
    e.preventDefault();
    var delta = e.deltaY > 0 ? -5 : 5; // 向下滚=缩小，向上滚=放大
    var newVal = Math.min(300, Math.max(100, parseInt(zoomSlider.value) + delta));
    zoomSlider.value = newVal;
    // 触发 input 事件来执行缩放逻辑
    zoomSlider.dispatchEvent(new Event("input"));
  }, { passive: false });

  // ---- 确认按钮 ----
  confirmBtn.addEventListener("click", function() {
    // 裁剪并导出
    var croppedUrl = cropAndExport();
    AppState.avatarDataUrl = croppedUrl;

    // 更新编辑区的头像预览
    var preview = document.getElementById("avatarPreview");
    preview.innerHTML = '<img src="' + croppedUrl + '" alt="头像">';
    document.getElementById("avatarClear").classList.remove("hidden");

    // 更新名片预览
    updateCardPreview();

    // 关闭弹窗
    modal.classList.add("hidden");

    console.log("[头像裁剪] 确认使用");
  });

  // ---- 取消按钮 ----
  cancelBtn.addEventListener("click", function() {
    modal.classList.add("hidden");
    // 重置文件输入
    document.getElementById("avatarInput").value = "";
    console.log("[头像裁剪] 取消");
  });

  // ---- 点击遮罩关闭 ----
  overlay.addEventListener("click", function() {
    cancelBtn.click();
  });
}

// ==================== 导出按钮 ====================
/**
 * 初始化导出按钮
 */
function initExportButtons() {
  document.getElementById("exportCN").addEventListener("click", function() {
    if (!validateForm()) return;
    const name = document.getElementById("nameCN").value.trim();
    CardExporter.exportChinese(name);
  });

  document.getElementById("exportEN").addEventListener("click", function() {
    if (!validateForm()) return;
    const name = document.getElementById("nameCN").value.trim();
    CardExporter.exportEnglish(name);
  });

  document.getElementById("exportAll").addEventListener("click", function() {
    if (!validateForm()) return;
    const name = document.getElementById("nameCN").value.trim();
    CardExporter.exportAll(name);
  });
}

/**
 * 验证必填字段
 * @returns {boolean} 是否通过验证
 */
function validateForm() {
  const requiredFields = [
    { id: "companySelect", label: "公司" },
    { id: "nameCN", label: "中文姓名" },
    { id: "nameEN", label: "英文姓名" },
    { id: "titleCN", label: "中文职位" },
    { id: "titleEN", label: "英文职位" },
    { id: "mobile", label: "手机号码" },
    { id: "email", label: "电子邮箱" }
  ];

  var missing = [];
  requiredFields.forEach(function(field) {
    const el = document.getElementById(field.id);
    if (!el.value.trim()) {
      missing.push(field.label);
    }
  });

  if (missing.length > 0) {
    alert("请填写以下必填信息：\n\n• " + missing.join("\n• "));
    return false;
  }

  return true;
}

// ==================== 更新名片预览（核心函数） ====================
/**
 * 根据当前表单数据更新名片预览
 * 同时更新中文和英文两张名片
 */
function updateCardPreview() {
  const company = AppState.selectedCompany;

  // ---- 获取表单数据 ----
  const data = {
    nameCN: document.getElementById("nameCN").value.trim() || "您的姓名",
    nameEN: document.getElementById("nameEN").value.trim() || "Your Name",
    titleCN: document.getElementById("titleCN").value.trim() || "职位名称",
    titleEN: document.getElementById("titleEN").value.trim() || "Job Title",
    deptCN: document.getElementById("deptCN").value.trim(),
    deptEN: document.getElementById("deptEN").value.trim(),
    mobile: document.getElementById("mobile").value.trim() || "手机号码",
    email: document.getElementById("email").value.trim() || "电子邮箱",
    wechat: document.getElementById("wechat").value.trim(),
    telephone: document.getElementById("telephone").value.trim()
  };

  // ---- 更新中文名片 ----
  updateSingleCard("CN", {
    companyName: company ? company.nameCN : "公司名称",
    name: data.nameCN,
    title: data.titleCN,
    dept: data.deptCN,
    mobile: data.mobile,
    email: data.email,
    wechat: data.wechat,
    telephone: data.telephone,
    website: company ? company.website : "",
    address: company ? company.addressCN : "公司地址",
    logo: company ? company.logo : "",
    avatar: AppState.avatarDataUrl
  });

  // ---- 更新英文名片 ----
  updateSingleCard("EN", {
    companyName: company ? company.nameEN : "Company Name",
    name: data.nameEN,
    title: data.titleEN,
    dept: data.deptEN,
    mobile: data.mobile ? "+86 " + data.mobile : "Mobile Number",
    email: data.email || "Email Address",
    wechat: data.wechat,
    telephone: data.telephone,
    website: company ? company.website : "",
    address: company ? company.addressEN : "Company Address",
    logo: company ? company.logo : "",
    avatar: AppState.avatarDataUrl
  });
}

/**
 * 更新单张名片的内容
 * @param {string} lang - "CN" 或 "EN"
 * @param {object} data - 名片数据
 */
function updateSingleCard(lang, data) {
  // 公司名称
  var companyNameEl = document.getElementById("cardCompanyName" + lang);
  if (companyNameEl) companyNameEl.textContent = data.companyName;

  // Logo
  var logoEl = document.getElementById("cardLogo" + lang);
  if (logoEl) {
    if (data.logo) {
      logoEl.innerHTML = '<img src="' + data.logo + '" alt="Logo">';
    } else {
      logoEl.innerHTML = '<span class="logo-placeholder">LOGO</span>';
    }
  }

  // 姓名
  var nameEl = document.getElementById("cardName" + lang);
  if (nameEl) nameEl.textContent = data.name;

  // 职位
  var titleTextEl = document.getElementById("cardTitleText" + lang);
  if (titleTextEl) titleTextEl.textContent = data.title;

  // 部门
  var deptTextEl = document.getElementById("cardDeptText" + lang);
  if (deptTextEl) deptTextEl.textContent = data.dept;

  // 手机
  var mobileEl = document.getElementById("cardMobile" + lang);
  if (mobileEl) mobileEl.textContent = data.mobile;

  // 邮箱
  var emailEl = document.getElementById("cardEmail" + lang);
  if (emailEl) emailEl.textContent = data.email;

  // 微信（可选字段）
  var wechatRow = document.getElementById("cardWechatRow" + lang);
  var wechatEl = document.getElementById("cardWechat" + lang);
  if (wechatRow && wechatEl) {
    if (data.wechat) {
      wechatRow.classList.remove("hidden");
      wechatEl.textContent = data.wechat;
    } else {
      wechatRow.classList.add("hidden");
    }
  }

  // 座机（可选字段）
  var telRow = document.getElementById("cardTelRow" + lang);
  var telEl = document.getElementById("cardTel" + lang);
  if (telRow && telEl) {
    if (data.telephone) {
      telRow.classList.remove("hidden");
      telEl.textContent = data.telephone;
    } else {
      telRow.classList.add("hidden");
    }
  }

  // 网址（可选字段）
  var websiteRow = document.getElementById("cardWebsiteRow" + lang);
  var websiteEl = document.getElementById("cardWebsite" + lang);
  if (websiteRow && websiteEl) {
    if (data.website) {
      websiteRow.classList.remove("hidden");
      websiteEl.textContent = data.website;
    } else {
      websiteRow.classList.add("hidden");
    }
  }

  // 地址
  var addressEl = document.getElementById("cardAddress" + lang);
  if (addressEl) addressEl.textContent = data.address;

  // 头像
  var avatarEl = document.getElementById("cardAvatar" + lang);
  if (avatarEl) {
    if (data.avatar) {
      avatarEl.innerHTML = '<img src="' + data.avatar + '" alt="头像">';
      avatarEl.classList.add("show");
    } else {
      avatarEl.innerHTML = "";
      avatarEl.classList.remove("show");
    }
  }
}
