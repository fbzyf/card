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
  avatarDataUrl: null
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
  applyTemplate(AppState.selectedTemplate);
  
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

    // 颜色预览块
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
      
      console.log("[版式切换]", layout === "horizontal" ? "横版" : "竖版");
    });
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

  updateSingleCard("CN", {
    companyName: company ? company.nameCN : "公司名称",
    name: data.nameCN, title: data.titleCN, dept: data.deptCN,
    mobile: data.mobile, email: data.email,
    wechat: data.wechat, telephone: data.telephone,
    website: company ? company.website : "",
    address: company ? company.addressCN : "公司地址",
    logo: company ? company.logo : "",
    avatar: AppState.avatarDataUrl
  });

  updateSingleCard("EN", {
    companyName: company ? company.nameEN : "Company Name",
    name: data.nameEN, title: data.titleEN, dept: data.deptEN,
    mobile: data.mobile ? "+86 " + data.mobile : "Mobile Number",
    email: data.email || "Email Address",
    wechat: data.wechat, telephone: data.telephone,
    website: company ? company.website : "",
    address: company ? company.addressEN : "Company Address",
    logo: company ? company.logo : "",
    avatar: AppState.avatarDataUrl
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
