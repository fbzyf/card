/**
 * 名片导出功能模块
 * =================
 * 使用 html2canvas 将名片 DOM 元素转换为 PNG 图片并下载
 */

const CardExporter = {
  /**
   * 导出名片为 PNG 图片
   * @param {string} elementId - 要导出的名片元素的ID（"cardCN" 或 "cardEN"）
   * @param {string} fileName - 导出的文件名（不含扩展名）
   * @returns {Promise<void>}
   */
  async exportCard(elementId, fileName) {
    const cardElement = document.getElementById(elementId);
    if (!cardElement) {
      console.error(`[导出错误] 找不到名片元素: ${elementId}`);
      alert("导出失败：找不到名片元素，请刷新页面重试。");
      return;
    }

    // 显示加载提示
    this.showLoading(true);

    try {
      // 使用 html2canvas 将名片渲染为 Canvas
      const canvas = await html2canvas(cardElement, {
        scale: 3,                    // 3倍渲染，保证高清晰度
        useCORS: true,               // 允许跨域图片
        allowTaint: false,
        backgroundColor: null,       // 透明背景（名片自带背景色）
        logging: false,
        // 确保名片以实际尺寸渲染
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
        onclone: function(clonedDoc) {
          // 在克隆的文档中确保所有样式正确应用
          const clonedCard = clonedDoc.getElementById(elementId);
          if (clonedCard) {
            // 移除可能的 transform 缩放（手机端预览可能缩小了）
            clonedCard.style.transform = 'none';
          }
        }
      });

      // 将 Canvas 转为 PNG 并下载
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`[导出成功] ${fileName}.png`);
    } catch (error) {
      console.error("[导出错误]", error);
      alert("导出失败，请检查网络连接后重试。\n错误信息：" + error.message);
    } finally {
      // 隐藏加载提示
      this.showLoading(false);
    }
  },

  /**
   * 导出中文名片
   * @param {string} personName - 用于文件名
   */
  async exportChinese(personName) {
    const name = personName || "名片";
    await this.exportCard("cardCN", `${name}_中文名片`);
  },

  /**
   * 导出英文名片
   * @param {string} personName - 用于文件名
   */
  async exportEnglish(personName) {
    const name = personName || "card";
    await this.exportCard("cardEN", `${name}_英文名片`);
  },

  /**
   * 一键导出中英文名片
   * @param {string} personNameCN - 中文姓名（用于文件名）
   */
  async exportAll(personNameCN) {
    const name = personNameCN || "名片";
    await this.exportCard("cardCN", `${name}_中文名片`);
    // 延迟一下再导出第二张，避免浏览器合并下载
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.exportCard("cardEN", `${name}_英文名片`);
  },

  /**
   * 显示/隐藏加载提示
   * @param {boolean} show 
   */
  showLoading(show) {
    const loading = document.getElementById("exportLoading");
    if (loading) {
      if (show) {
        loading.classList.remove("hidden");
      } else {
        loading.classList.add("hidden");
      }
    }
  }
};
