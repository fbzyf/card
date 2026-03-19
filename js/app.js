/**
 * 电子名片制作器 - 主应用逻辑 v3.0 (Apple Style)
 * =================================================
 * 布局：单列流式布局，预览在页面底部
 * 中英文名片始终同时展示
 */

// ==================== 应用状态 ====================
const AppState = {
  selectedCompany: null,
  selectedTemplate: "classic",
  selectedLayout: "horizontal",
  avatarDataUrl: null,
  qrDataUrl: null,         // 二维码图片 data URL
  backPatternEnabled: true, // 名片背面装饰图案开关
  backPatternStyle: "grid"  // 背面装饰风格
};

// ==================== 本地存储 KEY ====================
const STORAGE_KEY = "cardMakerFormData_v1";

// ==================== 初始化 ====================
document.addEventListener("DOMContentLoaded", function() {
  console.log("[Card Maker] 初始化中...");
  
  initCompanySelect();
  initTemplateOptions();
  initLayoutOptions();
  initFormListeners();
  initBackPatternToggle();
  initAvatarUpload();
  initExportButtons();
  applyTemplate(AppState.selectedTemplate);
  restoreFormFromStorage();   // 从本地存储恢复上次填写的内容
  
  console.log("[Card Maker] 初始化完成 ✓");
});

// ==================== 公司选择 ====================
function initCompanySelect() {
  const select = document.getElementById("companySelect");
  
  COMPANIES.forEach(function(company) {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.nameCN + " / " + company.nameEN;
    select.appendChild(option);
  });

  select.addEventListener("change", function() {
    const companyId = this.value;
    const companyInfoEl = document.getElementById("companyInfo");

    if (!companyId) {
      AppState.selectedCompany = null;
      companyInfoEl.classList.add("hidden");
      updateCardPreview();
      return;
    }

    const company = COMPANIES.find(function(c) { return c.id === companyId; });
    if (company) {
      AppState.selectedCompany = company;
      document.getElementById("companyDisplayName").textContent = 
        company.nameCN + " / " + company.nameEN;
      document.getElementById("companyDisplayAddress").textContent = company.addressCN;
      document.getElementById("companyDisplayWebsite").textContent = company.website;
      companyInfoEl.classList.remove("hidden");
      updateCardPreview();
      saveFormToStorage();
      console.log("[公司选择]", company.nameCN);
    }
  });
}

// ==================== 模板选择 ====================
function initTemplateOptions() {
  const container = document.getElementById("templateOptions");

  TEMPLATES.forEach(function(template, index) {
    const div = document.createElement("div");
    div.className = "template-option" + (index === 0 ? " active" : "");
    div.setAttribute("data-template", template.id);

    // 颜色预览块（模拟迷你名片效果）
    const colorBlock = document.createElement("div");
    colorBlock.className = "template-color-block";
    
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
      if (bg === "#ffffff" || bg === "#f8fafc") {
        colorBlock.style.border = "1px solid #e8e8ed";
      }
    }

    // 在色块内加入模拟的文字线条，让缩略图更像一张名片
    colorBlock.style.color = template.colors.textPrimary;
    ["tmpl-line tmpl-line-name", "tmpl-line tmpl-line-short", "tmpl-line tmpl-line-contact"].forEach(function(cls) {
      var line = document.createElement("div");
      line.className = cls;
      colorBlock.appendChild(line);
    });

    const nameSpan = document.createElement("div");
    nameSpan.className = "template-name";
    nameSpan.textContent = template.nameCN;

    div.appendChild(colorBlock);
    div.appendChild(nameSpan);
    container.appendChild(div);

    div.addEventListener("click", function() {
      container.querySelectorAll(".template-option").forEach(function(el) {
        el.classList.remove("active");
      });
      div.classList.add("active");
      AppState.selectedTemplate = template.id;
      applyTemplate(template.id);
      saveFormToStorage();
      console.log("[模板切换]", template.nameCN);
    });
  });
}

function applyTemplate(templateId) {
  const cards = document.querySelectorAll(".business-card");
  cards.forEach(function(card) {
    card.className = card.className.replace(/theme-\S+/g, "").trim();
    card.classList.add("theme-" + templateId);
  });
}

// ==================== 版式选择（胶囊按钮） ====================
function initLayoutOptions() {
  const chips = document.querySelectorAll(".layout-chip");
  
  chips.forEach(function(chip) {
    chip.addEventListener("click", function() {
      const layout = this.getAttribute("data-layout");
      
      chips.forEach(function(el) { el.classList.remove("active"); });
      this.classList.add("active");
      
      AppState.selectedLayout = layout;
      
      const cards = document.querySelectorAll(".business-card");
      cards.forEach(function(card) {
        card.classList.remove("horizontal", "vertical");
        card.classList.add(layout);
      });

      saveFormToStorage();
      console.log("[版式切换]", layout === "horizontal" ? "横版" : "竖版");
    });
  });
}

// ==================== 背面装饰图案开关 ====================
function initBackPatternToggle() {
  var toggle = document.getElementById("backPatternToggle");
  if (!toggle) return;

  toggle.addEventListener("change", function() {
    AppState.backPatternEnabled = !!this.checked;
    applyBackPatternState();
    saveFormToStorage();
    console.log("[背面装饰图案]", AppState.backPatternEnabled ? "开启" : "关闭");
  });

  var styleSelect = document.getElementById("backPatternStyle");
  if (styleSelect) {
    styleSelect.value = AppState.backPatternStyle;
    styleSelect.addEventListener("change", function() {
      AppState.backPatternStyle = this.value;
      applyBackPatternStyle();
      saveFormToStorage();
      console.log("[背面装饰风格]", AppState.backPatternStyle);
    });
  }

  applyBackPatternState();
  applyBackPatternStyle();
}

function applyBackPatternState() {
  var cards = document.querySelectorAll(".business-card");
  cards.forEach(function(card) {
    card.classList.toggle("pattern-disabled", !AppState.backPatternEnabled);
  });
}

function applyBackPatternStyle() {
  var cards = document.querySelectorAll(".business-card");
  cards.forEach(function(card) {
    card.classList.remove("pattern-style-grid", "pattern-style-orbit", "pattern-style-wave");
    card.classList.add("pattern-style-" + AppState.backPatternStyle);
  });
}

// ==================== 预设中英文对照表 ====================
var PRESET_TITLES = {
  "总经理": "General Manager",
  "副总经理": "Deputy General Manager",
  "销售经理": "Sales Manager",
  "市场经理": "Marketing Manager",
  "产品线经理": "Product Line Manager"
};

var PRESET_DEPTS = {
  "销售部": "Sales Department",
  "市场部": "Marketing Department",
  "物流部": "Logistics Department",
  "财务部": "Finance Department",
  "运营服务部": "Operations & Service Department"
};

// ==================== 表单监听 ====================
function initFormListeners() {
  var fields = [
    "nameCN", "nameEN", "titleCN", "titleEN",
    "deptCN", "deptEN", "mobile", "email",
    "wechat", "telephone"
  ];

  fields.forEach(function(fieldId) {
    var el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener("input", function() {
        updateCardPreview();
        saveFormToStorage();
      });
    }
  });

  // 中文职位 → 自动填英文职位
  var titleCNEl = document.getElementById("titleCN");
  if (titleCNEl) {
    titleCNEl.addEventListener("input", function() {
      var val = this.value.trim();
      if (PRESET_TITLES[val]) {
        document.getElementById("titleEN").value = PRESET_TITLES[val];
        console.log("[自动翻译] 职位:", val, "→", PRESET_TITLES[val]);
      }
    });
  }

  // 中文部门 → 自动填英文部门
  var deptCNEl = document.getElementById("deptCN");
  if (deptCNEl) {
    deptCNEl.addEventListener("input", function() {
      var val = this.value.trim();
      if (PRESET_DEPTS[val]) {
        document.getElementById("deptEN").value = PRESET_DEPTS[val];
        console.log("[自动翻译] 部门:", val, "→", PRESET_DEPTS[val]);
      }
    });
  }

  // 二维码链接 → 实时生成二维码并更新名片
  var qrcodeEl = document.getElementById("qrcodeUrl");
  if (qrcodeEl) {
    qrcodeEl.addEventListener("input", debounce(function() {
      var url = this.value.trim();
      AppState.qrDataUrl = generateQRDataUrl(url);
      updateCardPreview();
      saveFormToStorage();
      console.log("[二维码]", url ? "已生成" : "已清除");
    }, 400));
  }
}

// ==================== 头像上传 ====================
function initAvatarUpload() {
  var input = document.getElementById("avatarInput");
  var clearBtn = document.getElementById("avatarClear");

  input.addEventListener("change", function(e) {
    var file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件（JPG、PNG等）");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("图片文件过大，请选择5MB以内的图片");
      return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
      showCropModal(event.target.result);
    };
    reader.readAsDataURL(file);
  });

  clearBtn.addEventListener("click", function() {
    AppState.avatarDataUrl = null;
    document.getElementById("avatarPreview").innerHTML = '<span class="avatar-placeholder">👤</span>';
    clearBtn.classList.add("hidden");
    input.value = "";
    updateCardPreview();
  });

  initCropModal();
}

// ==================== 头像裁剪 ====================
var CropState = {
  image: null, baseScale: 1, zoom: 1,
  offsetX: 0, offsetY: 0,
  isDragging: false,
  dragStartX: 0, dragStartY: 0,
  dragStartOffsetX: 0, dragStartOffsetY: 0
};

var CROP_CIRCLE_SIZE = 200;

function showCropModal(dataUrl) {
  var modal = document.getElementById("avatarCropModal");
  var cropImg = document.getElementById("cropImage");

  var tempImg = new Image();
  tempImg.onload = function() {
    CropState.image = tempImg;
    CropState.baseScale = Math.max(
      CROP_CIRCLE_SIZE / tempImg.naturalWidth,
      CROP_CIRCLE_SIZE / tempImg.naturalHeight
    );
    CropState.zoom = 1;
    var dispW = tempImg.naturalWidth * CropState.baseScale;
    var dispH = tempImg.naturalHeight * CropState.baseScale;
    CropState.offsetX = (CROP_CIRCLE_SIZE - dispW) / 2;
    CropState.offsetY = (CROP_CIRCLE_SIZE - dispH) / 2;
    cropImg.src = dataUrl;
    applyCropTransform();
    document.getElementById("cropZoom").value = 100;
    modal.classList.remove("hidden");
  };
  tempImg.src = dataUrl;
}

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

function clampCropOffset() {
  var totalScale = CropState.baseScale * CropState.zoom;
  var dispW = CropState.image.naturalWidth * totalScale;
  var dispH = CropState.image.naturalHeight * totalScale;
  CropState.offsetX = Math.min(0, Math.max(CROP_CIRCLE_SIZE - dispW, CropState.offsetX));
  CropState.offsetY = Math.min(0, Math.max(CROP_CIRCLE_SIZE - dispH, CropState.offsetY));
}

function cropAndExport() {
  var outputSize = 400;
  var totalScale = CropState.baseScale * CropState.zoom;
  var invScale = 1 / totalScale;
  var sx = -CropState.offsetX * invScale;
  var sy = -CropState.offsetY * invScale;
  var sSize = CROP_CIRCLE_SIZE * invScale;
  var canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(CropState.image, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);
  return canvas.toDataURL("image/jpeg", 0.92);
}

function initCropModal() {
  var circle = document.getElementById("cropCircle");
  var zoomSlider = document.getElementById("cropZoom");
  var confirmBtn = document.getElementById("cropConfirm");
  var cancelBtn = document.getElementById("cropCancel");
  var modal = document.getElementById("avatarCropModal");
  var overlay = modal.querySelector(".crop-modal-overlay");

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
    CropState.offsetX = CropState.dragStartOffsetX + (e.clientX - CropState.dragStartX);
    CropState.offsetY = CropState.dragStartOffsetY + (e.clientY - CropState.dragStartY);
    clampCropOffset();
    applyCropTransform();
  });

  document.addEventListener("mouseup", function() { CropState.isDragging = false; });

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
    if (!CropState.isDragging || e.touches.length !== 1) return;
    CropState.offsetX = CropState.dragStartOffsetX + (e.touches[0].clientX - CropState.dragStartX);
    CropState.offsetY = CropState.dragStartOffsetY + (e.touches[0].clientY - CropState.dragStartY);
    clampCropOffset();
    applyCropTransform();
  }, { passive: false });

  document.addEventListener("touchend", function() { CropState.isDragging = false; });

  zoomSlider.addEventListener("input", function() {
    var newZoom = parseInt(this.value) / 100;
    var oldZoom = CropState.zoom;
    var ratio = newZoom / oldZoom;
    var center = CROP_CIRCLE_SIZE / 2;
    CropState.offsetX = CropState.offsetX * ratio + center * (1 - ratio);
    CropState.offsetY = CropState.offsetY * ratio + center * (1 - ratio);
    CropState.zoom = newZoom;
    clampCropOffset();
    applyCropTransform();
  });

  circle.addEventListener("wheel", function(e) {
    e.preventDefault();
    var delta = e.deltaY > 0 ? -5 : 5;
    var newVal = Math.min(300, Math.max(100, parseInt(zoomSlider.value) + delta));
    zoomSlider.value = newVal;
    zoomSlider.dispatchEvent(new Event("input"));
  }, { passive: false });

  confirmBtn.addEventListener("click", function() {
    var croppedUrl = cropAndExport();
    AppState.avatarDataUrl = croppedUrl;
    document.getElementById("avatarPreview").innerHTML = '<img src="' + croppedUrl + '" alt="头像">';
    document.getElementById("avatarClear").classList.remove("hidden");
    updateCardPreview();
    modal.classList.add("hidden");
  });

  cancelBtn.addEventListener("click", function() {
    modal.classList.add("hidden");
    document.getElementById("avatarInput").value = "";
  });

  overlay.addEventListener("click", function() { cancelBtn.click(); });
}

// ==================== 导出按钮 ====================
function initExportButtons() {
  document.getElementById("exportCN").addEventListener("click", function() {
    if (!validateForm()) return;
    CardExporter.exportChinese(document.getElementById("nameCN").value.trim());
  });

  document.getElementById("exportEN").addEventListener("click", function() {
    if (!validateForm()) return;
    CardExporter.exportEnglish(document.getElementById("nameCN").value.trim());
  });

  document.getElementById("exportAll").addEventListener("click", function() {
    if (!validateForm()) return;
    CardExporter.exportAll(document.getElementById("nameCN").value.trim());
  });
}

function validateForm() {
  var requiredFields = [
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
    if (!document.getElementById(field.id).value.trim()) {
      missing.push(field.label);
    }
  });

  if (missing.length > 0) {
    alert("请填写以下必填信息：\n\n• " + missing.join("\n• "));
    return false;
  }
  return true;
}

// ==================== 更新名片预览 ====================
function updateCardPreview() {
  var company = AppState.selectedCompany;
  var data = {
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

  // 英文名片手机号：去掉横线空格后加 +86 前缀（更规范）
  var mobileForEN = data.mobile
    ? "+86 " + data.mobile.replace(/[-\s]/g, "")
    : "Mobile Number";

  updateSingleCard("EN", {
    companyName: company ? company.nameEN : "Company Name",
    name: data.nameEN, title: data.titleEN, dept: data.deptEN,
    mobile: mobileForEN,
    email: data.email || "Email Address",
    wechat: data.wechat, telephone: data.telephone,
    website: company ? company.website : "",
    address: company ? company.addressEN : "Company Address",
    logo: company ? company.logo : "",
    avatar: AppState.avatarDataUrl,
    qr: AppState.qrDataUrl
  });

  // 中文名片也同步传入二维码
  updateSingleCard("CN", {
    companyName: company ? company.nameCN : "公司名称",
    name: data.nameCN, title: data.titleCN, dept: data.deptCN,
    mobile: data.mobile, email: data.email,
    wechat: data.wechat, telephone: data.telephone,
    website: company ? company.website : "",
    address: company ? company.addressCN : "公司地址",
    logo: company ? company.logo : "",
    avatar: AppState.avatarDataUrl,
    qr: AppState.qrDataUrl
  });
}

function updateSingleCard(lang, data) {
  var el;

  el = document.getElementById("cardCompanyName" + lang);
  if (el) el.textContent = data.companyName;

  el = document.getElementById("cardLogo" + lang);
  if (el) {
    el.innerHTML = data.logo
      ? '<img src="' + data.logo + '" alt="Logo">'
      : '<span class="logo-placeholder">LOGO</span>';
  }

  el = document.getElementById("cardName" + lang);
  if (el) el.textContent = data.name;

  el = document.getElementById("cardTitleText" + lang);
  if (el) el.textContent = data.title;

  el = document.getElementById("cardDeptText" + lang);
  if (el) el.textContent = data.dept;

  el = document.getElementById("cardMobile" + lang);
  if (el) el.textContent = data.mobile;

  el = document.getElementById("cardEmail" + lang);
  if (el) el.textContent = data.email;

  // 可选字段
  toggleOptionalField("cardWechatRow" + lang, "cardWechat" + lang, data.wechat);
  toggleOptionalField("cardTelRow" + lang, "cardTel" + lang, data.telephone);
  toggleOptionalField("cardWebsiteRow" + lang, "cardWebsite" + lang, data.website);

  el = document.getElementById("cardAddress" + lang);
  if (el) el.textContent = data.address;

  // 头像
  el = document.getElementById("cardAvatar" + lang);
  if (el) {
    if (data.avatar) {
      el.innerHTML = '<img src="' + data.avatar + '" alt="头像">';
      el.classList.add("show");
    } else {
      el.innerHTML = "";
      el.classList.remove("show");
    }
  }

  // 二维码
  var qrEl = document.getElementById("cardQR" + lang);
  if (qrEl) {
    var qrImg = qrEl.querySelector("img");
    if (data.qr && qrImg) {
      qrImg.src = data.qr;
      qrEl.classList.remove("hidden");
    } else {
      qrEl.classList.add("hidden");
    }
  }
}

/** 控制可选字段的显示/隐藏 */
function toggleOptionalField(rowId, textId, value) {
  var row = document.getElementById(rowId);
  var textEl = document.getElementById(textId);
  if (row && textEl) {
    if (value) {
      row.classList.remove("hidden");
      textEl.textContent = value;
    } else {
      row.classList.add("hidden");
    }
  }
}

// ==================== 本地存储：保存表单 ====================
function saveFormToStorage() {
  try {
    var data = {
      companyId:  document.getElementById("companySelect").value,
      nameCN:     document.getElementById("nameCN").value,
      nameEN:     document.getElementById("nameEN").value,
      titleCN:    document.getElementById("titleCN").value,
      titleEN:    document.getElementById("titleEN").value,
      deptCN:     document.getElementById("deptCN").value,
      deptEN:     document.getElementById("deptEN").value,
      mobile:     document.getElementById("mobile").value,
      email:      document.getElementById("email").value,
      wechat:     document.getElementById("wechat").value,
      telephone:  document.getElementById("telephone").value,
      qrcodeUrl:  document.getElementById("qrcodeUrl").value,
      layout:     AppState.selectedLayout,
      template:   AppState.selectedTemplate,
      backPatternEnabled: AppState.backPatternEnabled,
      backPatternStyle: AppState.backPatternStyle
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[本地存储] 保存失败", e);
  }
}

// ==================== 本地存储：恢复表单 ====================
function restoreFormFromStorage() {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    var data = JSON.parse(saved);

    // 恢复文本字段
    var textFields = ["nameCN","nameEN","titleCN","titleEN","deptCN","deptEN","mobile","email","wechat","telephone","qrcodeUrl"];
    textFields.forEach(function(key) {
      var el = document.getElementById(key);
      if (el && data[key]) el.value = data[key];
    });

    // 恢复公司选择
    if (data.companyId) {
      var select = document.getElementById("companySelect");
      select.value = data.companyId;
      select.dispatchEvent(new Event("change"));
    }

    // 恢复版式
    if (data.layout && data.layout !== AppState.selectedLayout) {
      var chip = document.querySelector('.layout-chip[data-layout="' + data.layout + '"]');
      if (chip) chip.click();
    }

    // 恢复模板
    if (data.template && data.template !== AppState.selectedTemplate) {
      var templateOption = document.querySelector('.template-option[data-template="' + data.template + '"]');
      if (templateOption) templateOption.click();
    }

    // 恢复背面装饰图案开关
    if (typeof data.backPatternEnabled === "boolean") {
      AppState.backPatternEnabled = data.backPatternEnabled;
      var toggle = document.getElementById("backPatternToggle");
      if (toggle) {
        toggle.checked = AppState.backPatternEnabled;
      }
      applyBackPatternState();
    }

    // 恢复背面装饰风格
    if (typeof data.backPatternStyle === "string") {
      AppState.backPatternStyle = data.backPatternStyle;
      var styleSelect = document.getElementById("backPatternStyle");
      if (styleSelect) {
        styleSelect.value = AppState.backPatternStyle;
      }
      applyBackPatternStyle();
    }

    // 恢复二维码
    if (data.qrcodeUrl) {
      AppState.qrDataUrl = generateQRDataUrl(data.qrcodeUrl);
    }

    updateCardPreview();
    console.log("[本地存储] 恢复上次记录 ✓");
  } catch (e) {
    console.warn("[本地存储] 恢复失败", e);
  }
}

// ==================== 二维码生成 ====================
/**
 * 根据文本同步生成二维码，返回 data URL 字符串
 * @param {string} text - 要编码的内容（URL、微信号等）
 * @returns {string|null} - PNG data URL，失败返回 null
 */
function generateQRDataUrl(text) {
  if (!text) return null;

  // 若 URL 不带协议头则自动补全，方便扫码后直接跳转
  var qrText = text;
  if (/^www\./i.test(text)) {
    qrText = "https://" + text;
  }

  try {
    var container = document.getElementById("qrGenContainer");
    container.innerHTML = "";
    new QRCode(container, {
      text: qrText,
      width: 120,
      height: 120,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
    var canvas = container.querySelector("canvas");
    return canvas ? canvas.toDataURL("image/png") : null;
  } catch (e) {
    console.error("[二维码] 生成失败", e);
    return null;
  }
}

// ==================== Toast 提示 ====================
/**
 * 在屏幕底部显示短暂的提示信息
 * @param {string} message - 提示文字
 * @param {number} duration - 持续时间（毫秒），默认 2800ms
 */
function showToast(message, duration) {
  duration = duration || 2800;
  var toast = document.getElementById("toastNotification");
  var msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(function() {
    toast.classList.remove("show");
  }, duration);
}

// ==================== 工具函数 ====================
/**
 * 防抖：在最后一次调用 delay 毫秒后才真正执行 fn
 */
function debounce(fn, delay) {
  var timer = null;
  return function() {
    var self = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(self, args); }, delay);
  };
}
