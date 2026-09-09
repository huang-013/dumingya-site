/* ==========================================================================
   杜冥鸦作品集 · 交互逻辑（原生 JS，无任何外部依赖）
   —— 渲染全部由 assets/js/data.js 的 window.SITE_DATA 驱动
   ========================================================================== */
(function () {
  "use strict";

  var D = window.SITE_DATA;
  if (!D) { console.error("SITE_DATA 未加载"); return; }

  /* ---------------- 工具 ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function dash(v) { return v == null || v === "" ? "—" : v; }

  /* 封面图：有 cover 显示图片，否则渲染渐变色占位图（带首字） */
  function coverMarkup(cover, variant, initial, extra, coverClass) {
    var ch = String(initial || "").trim().charAt(0) || "·";
    var inner = cover
      ? '<img class="cover-img" src="' + esc(cover) + '" alt="" loading="lazy" />'
      : '<div class="cover-placeholder ' + variant + '"><span class="cover-initial">' + esc(ch) + '</span></div>';
    return '<div class="card-cover' + (coverClass ? " " + coverClass : "") + '">' + inner + (extra || "") + '</div>';
  }

  /* 语音播放按钮：仅当有 audio 字段时渲染，放在名称右侧。
     图标用 play/pause 两条 path 共存 + CSS 交叉淡切（.ico-play/.ico-pause），不再用 innerHTML 替换。 */
  function voiceBtnMarkup(audio) {
    if (!audio) return "";
    return '<span class="voice-btn" role="button" tabindex="0" data-audio="' + esc(audio) + '" aria-label="播放语音">' +
      '<svg viewBox="0 0 24 24" fill="currentColor">' +
      '<path class="ico-play" d="M6.5 5v14l11-7z"/>' +
      '<path class="ico-pause" d="M6 4h4v16H6zM14 4h4v16h-4z"/>' +
      '</svg>' +
      '</span>';
  }

  /* 关键词高亮 */
  function hl(text, q) {
    var s = esc(text == null ? "" : text);
    if (!q) return s;
    var eq = esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      return s.replace(new RegExp("(" + eq + ")", "gi"), '<mark class="hit">$1</mark>');
    } catch (e) { return s; }
  }

  /* 一条记录是否命中搜索（values: 参与匹配的字段数组） */
  function hit(q, values) {
    if (!q) return true;
    var needle = q.toLowerCase();
    for (var i = 0; i < values.length; i++) {
      if (values[i] != null && String(values[i]).toLowerCase().indexOf(needle) > -1) return true;
    }
    return false;
  }

  /* 注意：所有内联 SVG 必须写死 width/height，
     否则浏览器会按替换元素默认尺寸(300x150)渲染，把卡片撑变形 */
  var ICONS = {
    weibo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.6"/><path d="M17.6 6.4a6 6 0 0 1 0 11.2"/></svg>',
    bilibili: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 3.5L11 7M16 3.5L13 7"/><path d="M8.5 11.5v3.5M15.5 11.5v3.5"/></svg>',
    douyin: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18a3 3 0 1 0 3-3v-2"/><path d="M12 13V4.5c1.4 1.6 3 2.4 5 2.6"/></svg>',
    xiaohongshu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.2L6 21z"/><path d="M9.5 8.5h5M9.5 12h5"/></svg>',
    manbo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="7" rx="2"/><rect x="17.5" y="13" width="4" height="7" rx="2"/></svg>',
    music: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6"/></svg>'
  };

  /* 社交平台品牌图标（assets/img/ 下的官方 SVG）：真实品牌图形辨识度远高于
     线性通用图标。没有品牌 SVG 的平台（如 B 站）自动回退到上面的 ICONS 线性图标。
     这些品牌图标统一为深棕 #796034，CSS 里用 filter 提亮到接近品牌金以适配深色主题。 */
  var SOCIAL_ICON_FILE = {
    weibo: "assets/img/social-weibo.svg",
    douyin: "assets/img/social-douyin.svg",
    xiaohongshu: "assets/img/social-xiaohongshu.svg",
    manbo: "assets/img/social-manbo.svg",
    music: "assets/img/social-netease.svg"
  };

  function socialIconHtml(key) {
    var file = SOCIAL_ICON_FILE[key];
    if (file) {
      /* 不设 loading="lazy"：图标仅 2–5 KB 且是卡片主视觉，懒加载会让滚动到
         社交区时出现「空白方框 → 图标突然出现」的跳动 */
      return '<img class="social-icon-img" src="' + esc(file) + '" alt="" ' +
             'width="22" height="22" decoding="async">';
    }
    return ICONS[key] || ICONS.music;
  }

  /* 小箭头：默认 14px，具体尺寸由 CSS 按使用场景覆盖 */
  var ARROW_T ='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>';
  var ARROW_D = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  /* ---------------- 全局状态 ----------------
     作品集定位是「展示量」：所有年份分组默认全部平铺展开，不做折叠，
     年份切换完全交给吸顶筛选条（桌面 chip / 手机下拉）。 */
  var state = {
    query: "",
    gameKey: "ALL",    // 各模块当前筛选：年份 / 分类名（"ALL" = 全部）
    dramaKey: "ALL",
    webKey: "ALL",
    musicKey: "ALL",
    animKey: "ALL",
    eventKey: "ALL",
    webPage: {}        // 网配：年份 -> 页码
  };

  var WEB_PAGE_SIZE = 25;
  var WEB_SEARCH_LIMIT = 300; // 搜索时最多渲染的网配条目，避免一次性塞太多 DOM

  /* ---------- UI 状态持久化（刷新后恢复筛选/页码，位置不跳变） ---------- */
  var UI_KEY = "dmy-ui-v3";
  var UI_FIELDS = ["gameKey", "dramaKey", "webKey", "musicKey", "animKey", "eventKey", "webPage"];
  function saveState() {
    try {
      var o = {};
      UI_FIELDS.forEach(function (k) { o[k] = state[k]; });
      localStorage.setItem(UI_KEY, JSON.stringify(o));
    } catch (e) {}
  }
  function restoreState() {
    try {
      var raw = localStorage.getItem(UI_KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      UI_FIELDS.forEach(function (k) {
        if (s[k] && typeof s[k] === "object") {
          state[k] = s[k];
        } else if (s[k]) {
          state[k] = s[k];
        }
      });
    } catch (e) {}
  }

  /* 把选中年份滚回可视区中间：innerHTML 重渲染会重置 scrollLeft，
     不处理的话点完屏外的年份，选中项会停在视野外要自己滑回去 */
  function revealActiveChip(bar) {
    var scroller = bar && bar.querySelector(".filter-scroll");
    var active = bar && bar.querySelector(".filter-chip.is-active");
    if (!scroller || !active) return;
    if (scroller.scrollWidth <= scroller.clientWidth + 1) return;
    var sRect = scroller.getBoundingClientRect();
    var aRect = active.getBoundingClientRect();
    /* 注意：可滚动宽度只能取 scroller.clientWidth，DOMRect 上没有这个属性 */
    var delta = (aRect.left + aRect.width / 2) - (sRect.left + scroller.clientWidth / 2);
    if (Math.abs(delta) < 2) return;
    scroller.scrollLeft += delta;   /* 超出边界由浏览器钳制 */
  }

  /* 吸顶筛选条实际高度 → --filter-h，让年份标题吸顶时精确排在筛选条下方 */
  function syncStickyOffset() {
    var bars = $$(".filter-bar");
    var maxH = 0;
    bars.forEach(function (b) { var h = b.offsetHeight; if (h > maxH) maxH = h; });
    document.documentElement.style.setProperty("--filter-h", (maxH || 46) + "px");
  }

  /* ---------- 通用：筛选条（chip + 手机端 select 双形态） ----------
   年份用大号数字（--text 修饰类留给中文类目/「全部」，手机端字号分档） */
  function filterBarHtml(keys, activeKey, label) {
    function cls(k) { return /^\d{4}$/.test(k) ? "" : " filter-chip--text"; }
    var chips = '<button class="filter-chip' + cls("ALL") + (activeKey === "ALL" ? " is-active" : "") + '" data-key="ALL">全部</button>';
    keys.forEach(function (k) {
      chips += '<button class="filter-chip' + cls(k) + (activeKey === k ? " is-active" : "") + '" data-key="' + esc(k) + '">' + esc(k) + "</button>";
    });
    var sel = '<select class="filter-select" aria-label="' + esc(label || "筛选") + '">' +
      '<option value="ALL"' + (activeKey === "ALL" ? " selected" : "") + ">全部</option>";
    keys.forEach(function (k) {
      sel += '<option value="' + esc(k) + '"' + (activeKey === k ? " selected" : "") + ">" + esc(k) + "</option>";
    });
    return '<div class="filter-scroll">' + chips + sel + "</select></div>";
  }

  /* ---------- 通用：年份分组（平铺展示，默认全部展开） ----------
     labelHtml 已含高亮；bodyHtml 直接平铺在年份标题下方，无折叠。
     .year-body 是网配翻页时的局部更新锚点。 */
  function yearGroupHtml(key, labelHtml, summary, bodyHtml, cls) {
    return '<div class="year-group' + (cls ? " " + cls : "") + '" data-key="' + esc(key) + '">' +
      '<div class="year-head">' +
        '<span class="year-badge">' + labelHtml + "</span>" +
        '<span class="year-count">' + summary + "</span>" +
        '<span class="year-rule"></span>' +
      "</div>" +
      '<div class="year-body">' + bodyHtml + "</div>" +
    "</div>";
  }

  /* ======================================================================
     0. 首屏信息（由 profile 驱动，改 data.js 即可生效）
     ====================================================================== */
  function applyProfile() {
    var p = D.profile;
    if (!p) return;
    $$("[data-pf]").forEach(function (el) {
      var v = p[el.getAttribute("data-pf")];
      if (v) el.textContent = v;
    });
    if (p.name) document.title = p.name + " · 配音演员作品集";
    var brand = $(".nav-brand");
    if (brand && p.name) brand.lastChild.textContent = p.name;
  }

  /* ======================================================================
     0b. 首屏照片轮播（由 gallery 驱动）
     ====================================================================== */
  var ARROW_L = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 5 8 12 15 19"/></svg>';
  var ARROW_R = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 5 16 12 9 19"/></svg>';

  function initCarousel() {
    var root = $("#heroCarousel");
    if (!root) return;

    var list = (D.gallery && D.gallery.length)
      ? D.gallery
      : [{ src: "assets/img/portrait-placeholder.svg", caption: "" }];

    var track = $("#carouselTrack");
    var dots = $("#carouselDots");
    var n = list.length;
    var name = (D.profile && D.profile.name) || "";

    if (n === 1) root.classList.add("is-single");

    track.innerHTML = list.map(function (it, i) {
      return '<div class="carousel-slide" role="group" aria-roledescription="幻灯片" aria-label="' +
        (i + 1) + " / " + n + '">' +
        '<img src="' + esc(it.src) + '" alt="' + esc(it.caption || name + " 照片 " + (i + 1)) + '"' +
        (i === 0 ? "" : ' loading="lazy"') + ' decoding="async">' +
        (it.caption ? '<div class="carousel-caption">' + esc(it.caption) + "</div>" : "") +
        "</div>";
    }).join("");

    // 图片加载失败 → 显示兜底底纹，不让轮播开天窗
    $$("img", track).forEach(function (img) {
      img.addEventListener("error", function () {
        var slide = img.closest(".carousel-slide");
        if (slide) slide.classList.add("is-missing");
      });
    });

    if (n > 1) {
      dots.innerHTML = list.map(function (_, i) {
        return '<button class="carousel-dot' + (i === 0 ? " is-active" : "") +
          '" data-i="' + i + '" aria-label="第 ' + (i + 1) + ' 张"></button>';
      }).join("");
    }

    var idx = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function go(i, byUser) {
      idx = (i % n + n) % n;
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      $$(".carousel-dot", dots).forEach(function (d, k) {
        d.classList.toggle("is-active", k === idx);
      });
      $$(".carousel-slide", track).forEach(function (s, k) {
        s.setAttribute("aria-hidden", k === idx ? "false" : "true");
      });
      if (byUser) restart();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); if (n > 1 && !reduce) timer = setInterval(function () { go(idx + 1); }, 5000); }

    root.addEventListener("click", function (e) {
      var arrow = e.target.closest(".carousel-arrow");
      if (arrow) { go(idx + (arrow.classList.contains("next") ? 1 : -1), true); return; }
      var dot = e.target.closest(".carousel-dot");
      if (dot) go(parseInt(dot.getAttribute("data-i"), 10), true);
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", restart);

    // 键盘左右切换
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(idx - 1, true); e.preventDefault(); }
      else if (e.key === "ArrowRight") { go(idx + 1, true); e.preventDefault(); }
    });

    // 触摸滑动
    var x0 = null;
    root.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; stop();
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1), true); else restart();
      x0 = null;
    });

    go(0);
    restart();
  }

  /* ======================================================================
     0c. 首屏角色展示台（由 signatureRoles 驱动）
         左侧大立绘 + 右侧资料 + 底部头像切换 + 声线试听
     ====================================================================== */
  var stageIdx = 0;
  var stageList = [];      // 展示台条目：[本人, 角色1, 角色2, ...]
  var stageAudio = null;   // 真实音频 <audio>
  var stageDuration = 0;   // 当前角色的总时长(秒)，进入页面就预加载锁定
  var stageProbe = null;   // 当前预加载 probe；旧的会被新 probe 替换，事件回调失效
  var toneCtx = null;      // 占位提示音用的 AudioContext
  var toneTimer = null;

  /* 停止语音播放，复位 UI */
  var voiceRaf = 0;      // 进度条 rAF 帧循环句柄
  function voiceProgressTick() {
    if (!stageAudio) { voiceRaf = 0; return; }
    var bar = $("#voiceProgress");
    if (bar && stageDuration) {
      bar.style.width = Math.min(100, stageAudio.currentTime / stageDuration * 100) + "%";
    }
    voiceRaf = requestAnimationFrame(voiceProgressTick);
  }
  function stopVoice() {
    if (stageAudio) { try { stageAudio.pause(); } catch (e) {} stageAudio = null; }
    if (toneTimer) { clearTimeout(toneTimer); toneTimer = null; }
    if (voiceRaf) { cancelAnimationFrame(voiceRaf); voiceRaf = 0; }
    var p = $("#voicePlayer");
    if (p) p.classList.remove("is-playing");
    var bar = $("#voiceProgress");
    if (bar) { bar.style.width = "0%"; bar.style.transition = ""; }
  }

  /* 无真实音频时的占位提示音（柔和琶音） */
  function playTone() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!toneCtx) toneCtx = new AC();
      if (toneCtx.state === "suspended") toneCtx.resume();
      var now = toneCtx.currentTime;
      [523.25, 659.25, 783.99].forEach(function (f, i) {
        var osc = toneCtx.createOscillator();
        var gain = toneCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        var t0 = now + i * 0.14;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.10, t0 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.0);
        osc.connect(gain); gain.connect(toneCtx.destination);
        osc.start(t0); osc.stop(t0 + 1.1);
      });
      return true;
    } catch (e) { return false; }
  }

  /* 点击播放 / 暂停 */
  function toggleVoice() {
    var btn = $("#voiceBtn");
    if (!btn) return;
    var p = $("#voicePlayer");
    var src = btn.getAttribute("data-src") || "";

    if (p && p.classList.contains("is-playing")) { stopVoice(); return; }

    if (src) {
      /* 有真实音频文件 */
      stageAudio = new Audio(src);
      stageAudio.addEventListener("loadedmetadata", function () {
        if (isFinite(stageAudio.duration) && stageAudio.duration > 0) {
          stageDuration = stageAudio.duration;
        }
      });
      /* 进度条逐帧驱动：timeupdate 只有 4Hz 会一顿一顿，rAF 才顺滑 */
      if (voiceRaf) cancelAnimationFrame(voiceRaf);
      voiceRaf = requestAnimationFrame(voiceProgressTick);
      stageAudio.addEventListener("ended", stopVoice);
      stageAudio.addEventListener("error", function () {
        stopVoice();
        var h = $("#voiceHint");
        if (h) h.textContent = "音频加载失败，请检查 assets/audio/ 下的文件路径是否正确。";
      });
      if (p) p.classList.add("is-playing");
      var play = stageAudio.play();
      if (play && play.catch) play.catch(function () { stopVoice(); });
    } else {
      /* 无音频文件：播放占位提示音，保持交互完整 */
      var ok = playTone();
      if (p && ok) p.classList.add("is-playing");
      var bar = $("#voiceProgress");
      if (bar) {
        bar.style.transition = "width 1.4s linear";
        bar.style.width = "100%";
      }
      toneTimer = setTimeout(stopVoice, 1500);
    }
  }

  /* 展示台条目列表：[杜冥鸦本人] + signatureRoles
     —— 本人永远排第一，点第一个头像即可切回本人介绍 */
  function buildStageList() {
    var p = D.profile || {};
    var cover = p.cover || ((D.gallery && D.gallery[0]) ? D.gallery[0].src : "");

    var self = {
      isSelf: true,
      name: p.name || "",
      title: p.subtitle || "",
      desc: p.bio || "",
      cover: cover,
      avatar: "assets/img/avatar-self.webp",
      // 本人页也跟代表角色一样,在 profile.cover / profile.bg 里独立配置
      // 「左侧大立绘 + 背景场景虚化图」；任一字段为空就用 fallback
      bg: p.bg || "",                          // 不填 bg → 本人页不显示场景背景蒙层
      voice: p.voice || "",
      voiceLabel: p.voiceLabel || "「用声音,让角色活过来。」",
      chips: [
        { k: "生日", v: p.birthday },
        { k: "星座", v: p.constellation },
        { k: "所属", v: p.company },
        { k: "昵称", v: p.nicknames, wide: true }
      ].filter(function (c) { return !!c.v; })
    };

    var roles = (D.signatureRoles || []).map(function (r) {
      return {
        isSelf: false,
        name: r.name || "",
        title: r.title || "",
        desc: r.desc || "",
        cover: r.cover || "",
        avatar: r.avatar || "",
        bg: r.bg || "",
        voice: r.voice || "",
        voiceLabel: r.voiceLabel || "声线试听",
        chips: [
          { k: "", v: r.game },
          { k: "CV", v: p.name || "杜冥鸦" }
        ].filter(function (c) { return !!c.v; })
      };
    });

    return [self].concat(roles);
  }

  /* 立绘轮播：把第 stageIdx 张滑块滚动到轨道中心。
   程序化滚动会设 progScrollUntil 抑制窗口，避免 scroll 监听把它误判为手势。 */
  var progScrollUntil = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function centerStageTrack(smooth) {
    var track = $("#stageTrack");
    if (!track) return;
    var slide = track.children[stageIdx];
    if (!slide) return;
    var tRect = track.getBoundingClientRect();
    var sRect = slide.getBoundingClientRect();
    var delta = (sRect.left + sRect.width / 2) - (tRect.left + track.clientWidth / 2);
    if (Math.abs(delta) < 2) return;
    progScrollUntil = Date.now() + 800;
    /* 注意：behavior 必须用 "instant" 而非 "auto"——"auto" 会回到 CSS 的
       scroll-behavior（曾为 smooth），导致本该瞬时的复位变成动画，与惯性滚动
       和 snap 相互打断，表现为滑动后左右来回弹跳。 */
    track.scrollTo({ left: track.scrollLeft + delta, behavior: smooth && !reduceMotion.matches ? "smooth" : "instant" });
  }

  /* 只填写首屏右侧信息卡的纯文字部分（eyebrow/姓名/头衔/简介/芯片/试听标签），
     不带音频、圆点等副作用。ctx 可为真实 #stageInfo，也可为离屏测量容器——
     渲染与「整卡最高锁定」共用同一填充逻辑，保证测量高度与真实一致 */
  function fillStageTexts(ctx, r) {
    if (!ctx || !r) return;
    var q = function (sel) { return ctx.querySelector(sel); };
    var eyebrow = r.isSelf
      ? '<span class="eyebrow-en">Voice Actress</span><span class="eyebrow-dot">·</span><span class="eyebrow-cn">配音演员</span>'
      : '<span class="eyebrow-en">Signature Roles</span><span class="eyebrow-dot">·</span><span class="eyebrow-cn">代表角色</span>';
    var el;
    el = q("#stageEyebrow"); if (el) el.innerHTML = eyebrow;
    el = q("#stageName"); if (el) el.textContent = r.name || "";
    el = q("#stageTitle"); if (el) el.textContent = r.title || "";
    el = q("#stageDesc"); if (el) el.textContent = r.desc || "";
    el = q("#stageMeta");
    if (el) {
      el.innerHTML = (r.chips || []).map(function (c) {
        return '<span class="stage-chip' + (c.k ? "" : " alt") + (c.wide ? " is-wide" : "") + '">' +
               (c.k ? '<i class="ck">' + esc(c.k) + "</i>" : "") + esc(c.v) + "</span>";
      }).join("");
    }
    el = q("#voiceLabel"); if (el) el.textContent = r.voiceLabel || "声线试听";
  }

  /* 渲染第 idx 个条目（0 = 杜冥鸦本人） */
  function renderStage(idx, opts) {
    opts = opts || {};
    if (!stageList.length) return;
    var prevIdx = stageIdx;
    stageIdx = Math.max(0, Math.min(idx, stageList.length - 1));
    var r = stageList[stageIdx];

    /* 背景场景图：手机端用立绘模糊做背景（竖图适配竖屏），桌面端用场景图。
       切换时做「真交叉淡化」：旧图留在底层离场层，新图在顶层淡入，
       避免直接换 backgroundImage 造成整屏硬切 */
    var isMobile = window.matchMedia('(max-width: 900px)').matches;
    var bg = $("#stageBg");
    if (bg) {
      var bgUrl = isMobile ? (r.cover || r.bg) : r.bg;
      var prevUrl = bg.style.backgroundImage;
      if (bgUrl) {
        if (prevUrl && prevUrl !== "none" && prevUrl.indexOf(bgUrl) === -1 && !reduceMotion.matches) {
          var old = document.createElement("i");
          old.className = "stage-bg stage-bg-leave";
          old.setAttribute("aria-hidden", "true");
          old.style.backgroundImage = prevUrl;
          bg.parentNode.insertBefore(old, bg);   /* 插到新图层下方 */
          setTimeout(function () {
            if (old && old.parentNode) old.parentNode.removeChild(old);
          }, 1000);
        }
        bg.classList.remove("is-on");
        bg.style.backgroundImage = 'url("' + bgUrl + '")';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bg.classList.add("is-on"); });
        });
      } else {
        bg.classList.remove("is-on");
        bg.style.backgroundImage = "";
      }
    }

    /* 立绘轮播：滑到当前角色。手势滚过来的（fromScroll）不回中——
       停靠交给原生 scroll-snap，JS 不再抢方向盘（否则每帧就近判定都会瞬时
       回中一次，与惯性滚动互相打断，就是滑动后左右弹跳的根因） */
    if (!opts.fromScroll) centerStageTrack(true);

    /* 文字资料：容器整体淡出 → 换内容 → 子块错峰浮现（比旧版瞬时闪烁更柔和） */
    var info = $("#stageInfo");
    function applyStageTexts() {
      fillStageTexts(info, r);

      /* 语音区：按钮可用态与音频元数据预加载（hint 恒隐藏——
         开发占位说明“把 mp3 放进 assets/audio…”不展示，避免撑高卡片） */
      stopVoice();
      var btn = $("#voiceBtn");
      var hint = $("#voiceHint");
      if (btn) {
        if (r.voice) {
          btn.setAttribute("data-src", r.voice);
          btn.removeAttribute("disabled");
          btn.removeAttribute("title");
        } else {
          btn.setAttribute("data-src", "");
          btn.removeAttribute("disabled");
          btn.setAttribute("title", "暂无试听音频");
        }
      }
      if (hint) hint.hidden = true;

    /* 预加载音频元数据，锁定总长（进度条按百分比计算用，页面不再显示时长） */
    stageDuration = 0;
    stageProbe = null;
    if (r.voice) {
      var probe = new Audio();
      probe.preload = "metadata";
      probe.src = r.voice;
      stageProbe = probe;
      probe.addEventListener("loadedmetadata", function () {
        if (probe !== stageProbe) return;        // 已被新角色替换，丢弃
        if (isFinite(probe.duration) && probe.duration > 0) {
          stageDuration = probe.duration;
        }
      });
    }

    /* 切换圆点激活态 */
    $$("#stageSwitch .stage-dot").forEach(function (b, i) {
      var on = i === stageIdx;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.setAttribute("tabindex", on ? "0" : "-1");
    });
    }
    function stageTextsFadeIn() {
      if (!info) return;
      info.classList.add("is-swap");               // 子块先稳定到隐藏态
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          info.classList.remove("is-swap");        // 统一移除 → 按 60ms 级联浮现
        });
      });
    }
    if (prevIdx !== stageIdx && !opts.fromScroll) {
      if (!reduceMotion.matches) {
        if (info) info.classList.add("is-fading");
        setTimeout(function () {
          applyStageTexts();
          if (info) info.classList.remove("is-fading");
          stageTextsFadeIn();
        }, 200);
      } else {
        /* 弱化动效：直接换内容，不做淡出淡入 */
        applyStageTexts();
      }
    } else {
      applyStageTexts();
    }
  }

  function initRoleStage() {
    stageList = buildStageList();
    var sw = $("#stageSwitch");
    var track = $("#stageTrack");
    if (!sw || !track || !stageList.length) return;

    /* 立绘轮播：每角色一张滑块（第 1 张是杜冥鸦本人） */
    track.innerHTML = stageList.map(function (r, i) {
      var img = r.cover
        ? '<img class="stage-portrait" src="' + esc(r.cover) + '" alt="' + esc(r.name || "") + '"' + (i > 1 ? ' loading="lazy"' : "") + " />"
        : "";
      return '<div class="stage-slide">' + img + "</div>";
    }).join("");

    /* 角色名胶囊：按钮文本即角色名（无需 aria-label，文本就是可访问名称） */
    sw.innerHTML = stageList.map(function (r, i) {
      return '<button class="stage-dot" type="button" role="tab" data-idx="' + i + '"' +
             ' aria-selected="false" tabindex="-1">' + esc(r.name || "") + "</button>";
    }).join("");

    var solo = stageList.length < 2;
    if (solo) sw.classList.add("is-single");
    ["#stageArrowPrev", "#stageArrowNext"].forEach(function (id) {
      var el = $(id);
      if (el && solo) el.style.display = "none";
    });

    sw.addEventListener("click", function (e) {
      var b = e.target.closest(".stage-dot");
      if (!b) return;
      renderStage(parseInt(b.getAttribute("data-idx"), 10));
    });

    /* 键盘左右切换（圆点与轨道都支持） */
    sw.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var n = stageList.length;
      var next = (stageIdx + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
      renderStage(next);
      var cur = sw.querySelector('.stage-dot[data-idx="' + next + '"]');
      if (cur) cur.focus();
    });
    track.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var n = stageList.length;
      renderStage((stageIdx + (e.key === "ArrowRight" ? 1 : -1) + n) % n);
    });

    /* 桌面悬停箭头 */
    var prev = $("#stageArrowPrev"), nextBtn = $("#stageArrowNext");
    if (prev) prev.addEventListener("click", function () {
      renderStage((stageIdx - 1 + stageList.length) % stageList.length);
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      renderStage((stageIdx + 1) % stageList.length);
    });

    /* 手势滑动 → 等滚动停下来再同步角色（只更新文案/胶囊，不动画滚动位置）。
       原生 scroll-snap（mandatory + stop:always）已负责逐张停靠；
       此前逐帧就近判定会不断触发瞬时回中，与惯性滚动互相打断 → 左右弹跳。 */
    var settleTimer = 0;
    track.addEventListener("scroll", function () {
      if (Date.now() < progScrollUntil) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () {
        var tRect = track.getBoundingClientRect();
        var mid = tRect.left + track.clientWidth / 2;
        var best = 0, bestD = Infinity;
        Array.prototype.forEach.call(track.children, function (s, i) {
          var rct = s.getBoundingClientRect();
          var d = Math.abs(rct.left + rct.width / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        if (best !== stageIdx) renderStage(best, { fromScroll: true });
      }, 120);
    });

    /* 视口变化后重新居中 */
    window.addEventListener("resize", function () { centerStageTrack(false); });

    /* 播放按钮 */
    var btn = $("#voiceBtn");
    if (btn) btn.addEventListener("click", toggleVoice);

    /* 波形条：固定 28 根。
       内联 animation-delay 按 0.618*周期 取模铺相位（黄金间隔，伪随机且确定），
       避免所有条同步齐升齐降的机械感；内联样式优先级高于 .is-playing 动画的简写重置。 */
    var wave = $("#voiceWave");
    if (wave) {
      var PERIOD = 1.8, html = "";
      for (var wi = 0; wi < 28; wi++) {
        html += '<i style="animation-delay:-' + (((wi * 0.618) % PERIOD)).toFixed(2) + 's"></i>';
      }
      wave.innerHTML = html;
    }

    renderStage(0);
  }

  /* ======================================================================
     1. 数据概览
     ====================================================================== */
  function renderStats() {
    var gameCount = D.games.reduce(function (s, g) { return s + g.items.length; }, 0);
    var dramaCount = D.dramas.reduce(function (s, g) { return s + g.items.length; }, 0);
    var webCount = D.webDramas.reduce(function (s, g) { return s + g.items.length; }, 0);
    var animCount = D.animations.categories.reduce(function (s, c) { return s + c.items.length; }, 0);

    var items = [
      { n: gameCount, l: "游戏角色" },
      { n: dramaCount, l: "商业广播剧" },
      { n: webCount, l: "网配剧期数" },
      { n: D.musicWorks.length, l: "音乐单曲" },
      { n: animCount, l: "动画 / PV" }
    ];
    $("#statStrip").innerHTML = items.map(function (i) {
      return '<div class="stat-item"><div class="stat-num">' + i.n + '</div><div class="stat-label">' + i.l + "</div></div>";
    }).join("");
  }

  /* ======================================================================
     2.（代表角色区块已移除 —— 相关内容并入首屏展示台）
     ====================================================================== */

  /* ======================================================================
     3. 游戏配音
     ====================================================================== */
  function renderGames() {
    var q = state.query;
    var key = state.gameKey;
    var years = D.games.map(function (g) { return g.year; });

    $("#gameFilter").innerHTML = filterBarHtml(years, key, "按年份筛选游戏");

    var html = "";
    D.games.forEach(function (g) {
      if (key !== "ALL" && g.year !== key) return;
      var items = g.items.filter(function (it) { return hit(q, [it.char, it.game, g.year]); });
      if (!items.length) return;
      html += yearGroupHtml(g.year,
        hl(g.year, q),
        items.length + " 个角色",
        '<div class="game-cards">' +
          items.map(function (it) {
            return '<div class="game-card">' +
              '<div class="game-body">' +
              '<div class="game-text"><div class="game-char">' + hl(it.char, q) + '</div><div class="game-name">' + hl(it.game, q) + '</div></div>' + voiceBtnMarkup(it.audio) + '</div>' +
              "</div>";
          }).join("") +
        "</div>"
      );
    });
    var gameTl = $("#gameTimeline");
    gameTl.innerHTML = html || '<div class="empty-state">没有匹配的游戏角色</div>';
    gameTl.classList.toggle("is-filtered", key !== "ALL");
  }

  /* ======================================================================
     4. 商业广播剧
     ====================================================================== */
  function castTag(type) {
    var t = String(type || "");
    var cls = t.indexOf("主役") > -1 ? "tag-lead" : (t.indexOf("协役") > -1 ? "tag-support" : "tag-guest");
    return '<span class="tag ' + cls + '">' + esc(dash(type)) + "</span>";
  }

  /* 线下活动 type 着色：漫展/专场/游戏/其它 各一色；
     organizer 标签复用同函数，使同一活动的 type 与 organizer 同色、不同 type 不同色 */
  function eventTagClass(type) {
    var t = String(type || "");
    return t.indexOf("漫展") > -1 ? "tag-expo"
      : t.indexOf("专场") > -1 ? "tag-special"
      : t.indexOf("游戏") > -1 ? "tag-game"
      : "tag-other";
  }
  function eventTypeTag(type) {
    return '<span class="tag ' + eventTagClass(type) + '">' + esc(dash(type)) + "</span>";
  }

  function renderDramas() {
    var q = state.query;
    var key = state.dramaKey;
    var years = D.dramas.map(function (g) { return g.year; });
    $("#dramaFilter").innerHTML = filterBarHtml(years, key, "按年份筛选广播剧");

    var html = "";

    D.dramas.forEach(function (g) {
      if (key !== "ALL" && g.year !== key) return;
      var items = g.items.filter(function (it) {
        return hit(q, [it.title, it.role, it.platform, it.castType, it.season, g.year]);
      });
      if (!items.length) return;

      html += yearGroupHtml(g.year,
        hl(g.year, q),
        items.length + " 部作品",
        '<div class="drama-grid">' +
          items.map(function (it) {
            var ongoing = it.endDate === "连载中";
            var initial = (it.title || "").charAt(0) || "剧";
            /* 日期显示：合并官宣/完结为「起始 - 终止」，连载中显示「起始 - 至今」 */
            var dateText = "";
            if (it.announceDate && it.endDate && it.endDate !== "连载中") {
              dateText = esc(it.announceDate) + " - " + esc(it.endDate);
            } else if (it.announceDate && ongoing) {
              dateText = esc(it.announceDate) + " - 至今";
            } else if (it.announceDate) {
              dateText = esc(it.announceDate);
            } else if (it.endDate && !ongoing) {
              dateText = esc(it.endDate);
            }
            /* 平台标签：支持多平台，按平台名加专属 class 配色 */
            var platformColorMap = {
              "饭角": "pf-fanjiao",
              "漫播": "pf-manbo",
              "猫耳": "pf-maoer",
              "听姬": "pf-tingji",
              "喜马拉雅": "pf-ximalaya",
              "荔枝": "pf-lizhi",
              "配音秀": "pf-peiyinxiu"
            };
            var platformHtml = "";
            if (it.platform) {
              var platforms = String(it.platform).split(/[/、,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
              platformHtml = platforms.map(function (p) {
                var cls = platformColorMap[p] || "pf-default";
                return '<span class="drama-platform ' + cls + '">' + hl(p, q) + "</span>";
              }).join("");
            }
            /* 信息分层：封面 / 标题+角色 / 季节+平台+主役 / 日期 / 右上角跳转箭头 */
            var metaRow = "";
            var metaParts = [];
            if (platformHtml) metaParts.push(platformHtml);
            if (it.castType) metaParts.push('<span class="tag ' + (it.castType === "主役" ? "tag-lead" : "tag-support") + '">' + esc(it.castType) + "</span>");
            if (ongoing) metaParts.push('<span class="tag tag-ongoing">连载中</span>');
            if (metaParts.length) metaRow = '<div class="drama-meta-row">' + metaParts.join("") + "</div>";

            var titleRow = '<div class="drama-title-row">' +
                '<h3 class="drama-title">' + hl(it.title, q) + "</h3>" +
                (it.season ? '<span class="drama-season">' + hl(it.season, q) + "</span>" : "") +
              "</div>";

            var inner =
              coverMarkup(it.cover, "cover-drama", initial, voiceBtnMarkup(it.audio), it.audio ? "cover-playable" : "") +
              '<div class="drama-body">' +
                titleRow +
                '<div class="drama-role">饰 <span>' + hl(it.role, q) + "</span></div>" +
                metaRow +
                ((dateText || it.link) ? '<div class="drama-footer">' +
                  (dateText ? '<span class="drama-date">' + dateText + "</span>" : "") +
                  (it.link ? '<span class="drama-link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' : "") +
                "</div>" : "") +
              "</div>";

            return '<div class="drama-card' + ((it.audio || it.link) ? " drama-card-playable" : "") + '"' + (it.link ? ' data-link="' + esc(it.link) + '"' : "") + ">" + inner + "</div>";
          }).join("") +
        "</div>"
      );
    });

    var dramaList = $("#dramaList");
    dramaList.innerHTML = html || '<div class="empty-state">没有匹配的广播剧</div>';
    dramaList.classList.toggle("is-filtered", key !== "ALL");
  }

  /* ======================================================================
     5. 网配广播剧（470 期：折叠 + 分页 + 搜索）
     ====================================================================== */
  /* 网配某年份的表格 + 分页内容（全量渲染与翻页局部更新共用） */
  function webYearInnerHtml(g, items, q) {
    var pageSize = q ? items.length : WEB_PAGE_SIZE;
    var pages = Math.max(1, Math.ceil(items.length / pageSize));
    var page = Math.min(state.webPage[g.year] || 1, pages);
    state.webPage[g.year] = page;
    var slice = items.slice((page - 1) * pageSize, page * pageSize);
    var table =
      '<div class="table-wrap"><div class="data-table">' +
        '<div class="trow trow-head cols-7"><span>剧名</span><span>角色</span><span>CAST</span>' +
          '<span class="tcell-optional">类型</span><span class="tcell-optional">题材</span><span>期数</span><span>发布日期</span></div>' +
        slice.map(function (it) {
          return '<div class="trow cols-7">' +
            '<span class="tcell tcell-title" data-label="剧名">' + hl(it.title, q) + "</span>" +
            '<span class="tcell tcell-role" data-label="角色">' + hl(dash(it.role), q) + "</span>" +
            '<span class="tcell" data-label="CAST">' + hl(dash(it.castType), q) + "</span>" +
            '<span class="tcell tcell-muted tcell-optional" data-label="类型">' + hl(dash(it.dtype), q) + "</span>" +
            '<span class="tcell tcell-muted tcell-optional" data-label="题材">' + hl(dash(it.genre), q) + "</span>" +
            '<span class="tcell tcell-muted" data-label="期数">' + hl(dash(it.episode), q) + "</span>" +
            '<span class="tcell tcell-date" data-label="发布">' + esc(dash(it.updateDate)) + "</span>" +
          "</div>";
        }).join("") +
      "</div></div>";
    return table + (pages > 1 ? pagerHtml(g.year, page, pages) : "");
  }

  function renderWebDramas() {
    var q = state.query;
    var key = state.webKey;
    var years = D.webDramas.map(function (g) { return g.year; });

    $("#webFilter").innerHTML = filterBarHtml(years, key, "按年份筛选非商广播剧");

    var html =
      '<div class="intro-box">' +
        "<p>" + esc(D.earlyWorks.intro) + "</p>" +
        '<div class="highlight-row"><span class="label">代表作</span>' +
          D.earlyWorks.highlights.map(function (h) { return '<span class="chip">' + esc(h) + "</span>"; }).join("") +
        "</div>" +
      "</div>";

    var shown = 0;
    var truncated = false;

    D.webDramas.forEach(function (g) {
      if (key !== "ALL" && g.year !== key) return;
      var items = g.items.filter(function (it) {
        return hit(q, [it.title, it.role, it.castType, it.dtype, it.genre, it.episode, it.updateDate, g.year]);
      });

      // 搜索结果过多时截断，保证滚动流畅
      if (q && shown + items.length > WEB_SEARCH_LIMIT) {
        items = items.slice(0, Math.max(0, WEB_SEARCH_LIMIT - shown));
        truncated = true;
      }
      if (!items.length) return;
      shown += items.length;

      html += yearGroupHtml(g.year,
        hl(g.year, q),
        items.length + " 期",
        webYearInnerHtml(g, items, q)
      );
    });

    if (truncated) {
      html += '<div class="empty-state">结果较多，仅显示前 ' + WEB_SEARCH_LIMIT + " 期，请输入更精确的关键词</div>";
    }

    var webPanel = $("#webDramaPanel");
    webPanel.innerHTML = html;
    webPanel.classList.toggle("is-filtered", key !== "ALL");
  }

  function pagerHtml(year, page, pages) {
    var out = '<div class="pager" data-year="' + esc(year) + '">';
    out += '<button data-page="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + '>上一页</button>';
    var start = Math.max(1, page - 2), end = Math.min(pages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (var i = start; i <= end; i++) {
      out += '<button data-page="' + i + '"' + (i === page ? ' class="is-active"' : "") + ">" + i + "</button>";
    }
    out += '<button data-page="' + (page + 1) + '"' + (page === pages ? " disabled" : "") + ">下一页</button>";
    return out + "</div>";
  }

  /* ======================================================================
     6. 音乐作品
     ====================================================================== */
  function renderMusic() {
    var q = state.query;
    var key = state.musicKey;
    var years = [];
    D.musicWorks.forEach(function (m) { if (years.indexOf(m.year) === -1) years.push(m.year); });

    $("#musicFilter").innerHTML = filterBarHtml(years, key, "按年份筛选音乐作品");

    // 按年份分组（平铺数组 → 分组）
    var groups = [];
    years.forEach(function (y) {
      var items = D.musicWorks.filter(function (m) {
        return m.year === y && hit(q, [m.title, m.remark, m.year]);
      });
      if (items.length) groups.push({ year: y, items: items });
    });

    var html = "";
    groups.forEach(function (g) {
      if (key !== "ALL" && g.year !== key) return;
      html += yearGroupHtml(g.year,
        hl(g.year, q),
        g.items.length + " 首",
        '<div class="music-grid">' +
          g.items.map(function (m) {
            var initial = (m.title || "").charAt(0) || "乐";
            var inner =
              coverMarkup(m.cover, "cover-music", initial) +
              '<span class="music-body">' +
                '<span class="music-title">' + hl(m.title, q) + "</span>" +
                '<span class="music-remark">' + hl(m.remark, q) + "</span>" +
              "</span>" +
              '<span class="music-year">' + esc(m.year) + "</span>";
            return m.link
              ? '<a class="music-card" href="' + esc(m.link) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>"
              : '<div class="music-card">' + inner + "</div>";
          }).join("") +
        "</div>"
      );
    });

    var musicGrid = $("#musicGrid");
    musicGrid.innerHTML = html || '<div class="empty-state">没有匹配的音乐作品</div>';
    musicGrid.classList.toggle("is-filtered", key !== "ALL");
  }

  /* ======================================================================
     7. 动画 / PV / 有声漫
     ====================================================================== */
  function renderAnimations() {
    var q = state.query;
    var key = state.animKey;
    var cats = D.animations.categories.map(function (c) { return c.name; });
    $("#animFilter").innerHTML = filterBarHtml(cats, key, "按分类筛选动画作品");

    var html = "";

    D.animations.categories.forEach(function (cat) {
      if (key !== "ALL" && cat.name !== key) return;
      var items = cat.items
        .filter(function (it) { return hit(q, [it.title, it.role, it.platform, it.episode, it.date, it.note, cat.name]); })
        .sort(function (a, b) { return (a.date || "") < (b.date || "") ? 1 : -1; });

      if (!items.length) return;

      html += yearGroupHtml(cat.name,
        hl(cat.name, q),
        items.length + " 条",
        '<div class="table-wrap"><div class="data-table">' +
          '<div class="trow trow-head cols-6"><span>剧名</span><span>角色</span>' +
            '<span class="tcell-optional">期数</span><span>发布日期</span><span>平台</span><span>备注</span></div>' +
          items.map(function (it) {
            return '<div class="trow cols-6">' +
              '<span class="tcell tcell-title" data-label="剧名">' + hl(it.title, q) + "</span>" +
              '<span class="tcell tcell-role" data-label="角色">' + hl(dash(it.role), q) + "</span>" +
              '<span class="tcell tcell-muted tcell-optional" data-label="期数">' + hl(dash(it.episode), q) + "</span>" +
              '<span class="tcell tcell-date" data-label="发布">' + esc(dash(it.date)) + "</span>" +
              '<span class="tcell tcell-muted" data-label="平台">' + hl(dash(it.platform), q) + "</span>" +
              '<span class="tcell tcell-muted" data-label="备注">' + hl(dash(it.note), q) + "</span>" +
            "</div>";
          }).join("") +
        "</div></div>"
      );
    });

    var animList = $("#animList");
    animList.innerHTML = html || '<div class="empty-state">没有匹配的动画 / PV 作品</div>';
    animList.classList.toggle("is-filtered", key !== "ALL");
  }

  /* ======================================================================
     8. 社交平台
     ====================================================================== */
  function renderSocials() {
    $("#socialGrid").innerHTML = D.socials.map(function (s) {
      return '<a class="social-card reveal" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="social-icon">' + socialIconHtml(s.icon) + "</span>" +
        '<span class="music-body">' +
          '<span class="social-platform">' + esc(s.platform) + "</span>" +
          '<span class="social-account">' + esc(s.account) + "</span>" +
        "</span>" +
        '<span class="social-arrow">' + ARROW_T + "</span>" +
        "</a>";
    }).join("");
  }

  /* ======================================================================
     9. 线下活动
     ====================================================================== */
  /* 解析 "YYYY.MM.DD" → { month, day, weekday }，解析失败返回 null */
  function parseEventDate(dateStr) {
    var parts = String(dateStr || "").split(".");
    if (parts.length < 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    var dt = new Date(y, m - 1, d);
    if (isNaN(dt.getTime())) return null;
    var weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return {
      month: m,
      day: d,
      monthStr: m + "月",
      dayStr: (d < 10 ? "0" : "") + d,
      weekday: weekdays[dt.getDay()]
    };
  }

  function renderEvents() {
    var q = state.query;
    var key = state.eventKey;
    var years = D.events.map(function (g) { return g.year; });

    $("#eventFilter").innerHTML = filterBarHtml(years, key, "按年份筛选活动");

    var today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
    var html = "";

    D.events.forEach(function (g) {
      if (key !== "ALL" && g.year !== key) return;
      var items = g.items.filter(function (it) {
        return hit(q, [it.title, it.city, it.province, it.venue, it.organizer, it.type, it.date, g.year]);
      });
      if (!items.length) return;

      html += yearGroupHtml(g.year,
        hl(g.year, q),
        items.length + " 场",
        '<div class="event-list">' +
          items.map(function (it) {
            var done = it.participated === "是";
            var upcoming = !done && (it.date || "") >= today;
            var pd = parseEventDate(it.date);
            var statusClass = done ? "is-done" : (upcoming ? "is-upcoming" : "is-past");
            var statusText = done ? "已参加" : (upcoming ? "即将到来" : "");

            var badge = pd
              ? '<div class="event-date-badge">' +
                  '<span class="ed-month">' + esc(pd.monthStr) + "</span>" +
                  '<span class="ed-day">' + esc(pd.dayStr) + "</span>" +
                  '<span class="ed-week">' + esc(pd.weekday) + "</span>" +
                "</div>"
              : "";

            var cityText = it.province === it.city ? it.city : (it.province + " · " + it.city);

            var body =
              '<div class="event-head">' +
                '<span class="event-city">' +
                  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>' +
                  hl(cityText, q) +
                "</span>" +
                (statusText ? '<span class="event-status ' + statusClass + '">' + statusText + "</span>" : "") +
              "</div>" +
              '<h3 class="event-title">' + hl(it.title, q) + "</h3>" +
              (it.venue ? '<div class="event-venue">' + hl(it.venue, q) + "</div>" : "") +
              '<div class="event-tags">' +
                eventTypeTag(it.type) +
                (it.organizer && it.organizer !== it.title ? '<span class="tag ' + eventTagClass(it.type) + '">' + hl(it.organizer, q) + "</span>" : "") +
              "</div>";

            return '<div class="event-item ' + statusClass + '">' +
              (it.link
                ? '<a class="event-box" href="' + esc(it.link) + '" target="_blank" rel="noopener noreferrer">' + badge + '<div class="event-body">' + body + "</div></a>"
                : '<div class="event-box">' + badge + '<div class="event-body">' + body + "</div></div>") +
            "</div>";
          }).join("") +
        "</div>"
      );
    });

    var eventList = $("#eventList");
    eventList.innerHTML = html || '<div class="empty-state">没有匹配的线下活动</div>';
    eventList.classList.toggle("is-filtered", key !== "ALL");
  }

  /* ======================================================================
     10. 页脚
     ====================================================================== */
  function renderFooter() {
    $("#footerQuote").textContent = D.footer.quote;
    $("#footerCopy").innerHTML = esc(D.footer.copyright) + "<br>本站为粉丝向作品资料整理，内容以官方发布为准。";
  }

  /* ======================================================================
     11. 统一渲染
     ====================================================================== */
  function renderAll() {
    renderGames();
    renderDramas();
    renderWebDramas();
    renderMusic();
    renderAnimations();
    renderEvents();
    observeReveal();
    syncStickyOffset();
  }

  function updateSearchCount() {
    var q = state.query;
    var el = $("#searchCount");
    if (!q) { el.textContent = ""; return; }
    var n = 0;
    D.games.forEach(function (g) { g.items.forEach(function (i) { if (hit(q, [i.char, i.game])) n++; }); });
    D.dramas.forEach(function (g) { g.items.forEach(function (i) { if (hit(q, [i.title, i.role, i.platform])) n++; }); });
    D.webDramas.forEach(function (g) { g.items.forEach(function (i) { if (hit(q, [i.title, i.role, i.castType])) n++; }); });
    D.musicWorks.forEach(function (m) { if (hit(q, [m.title, m.remark])) n++; });
    D.animations.categories.forEach(function (c) { c.items.forEach(function (i) { if (hit(q, [i.title, i.role, i.platform])) n++; }); });
    D.signatureRoles.forEach(function (r) { if (hit(q, [r.name, r.game])) n++; });
    el.textContent = n ? "命中 " + n + " 条" : "无匹配";
  }

  /* ======================================================================
     12. 事件绑定
     ====================================================================== */
  function bindEvents() {
    /* 网配分页：局部更新该年份表格，不做整块重渲染，避免闪烁 */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".pager button");
      if (!btn || btn.disabled) return;
      var wrap = btn.closest(".pager");
      var year = wrap.getAttribute("data-year");
      state.webPage[year] = parseInt(btn.getAttribute("data-page"), 10);
      saveState();

      var g = null;
      D.webDramas.forEach(function (gg) { if (gg.year === year) g = gg; });
      if (!g) return;
      var q = state.query;
      var items = g.items.filter(function (it) {
        return hit(q, [it.title, it.role, it.castType, it.dtype, it.genre, it.episode, it.updateDate, g.year]);
      });

      var group = wrap.closest(".year-group");
      var inner = group ? group.querySelector(".year-body") : null;
      if (inner) {
        inner.innerHTML = webYearInnerHtml(g, items, q);
        // 淡入动画：先清 class 强制 reflow，再重新加上触发
        inner.classList.remove("is-flash");
        void inner.offsetWidth;
        inner.classList.add("is-flash");
      }
      // 翻页后把该年份标题平滑滚到吸顶区（导航 + 筛选条）下方，
      // 让新一页从顶部开始；scroll-padding-top 会自动避开吸顶层。
      if (group) {
        var head = group.querySelector(".year-head");
        if (head) head.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    /* 角色语音播放：全局单一音频实例，播放中可暂停，切换时自动停上一条 */
    var curAudio = null;
    var curBtn = null;
    function setBtnPlaying(btn, playing) {
      if (!btn) return;
      /* 图标由 CSS 交叉淡切（.ico-play/.ico-pause），这里只切状态 */
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-label", playing ? "暂停语音" : "播放语音");
    }
    function stopVoice() {
      if (curAudio) { try { curAudio.pause(); } catch (err) {} curAudio = null; }
      if (curBtn) { setBtnPlaying(curBtn, false); curBtn = null; }
    }
    function toggleVoice(btn) {
      var src = btn.getAttribute("data-audio");
      if (!src) return;
      if (curBtn === btn && curAudio && !curAudio.paused) {
        curAudio.pause();
        setBtnPlaying(btn, false);
        return;
      }
      stopVoice();
      curBtn = btn;
      curAudio = new Audio(src);
      curAudio.preload = "auto";
      curAudio.play().then(function () {
        setBtnPlaying(btn, true);
      }).catch(function () {
        setBtnPlaying(btn, false);
        curAudio = null;
        curBtn = null;
      });
      curAudio.addEventListener("ended", function () {
        setBtnPlaying(btn, false);
        curAudio = null;
        curBtn = null;
      });
      curAudio.addEventListener("error", function () {
        setBtnPlaying(btn, false);
        curAudio = null;
        curBtn = null;
      });
    }
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".voice-btn");
      if (!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleVoice(btn);
    });
    /* 封面点击播放（drama 卡片含 cover-playable 时，排除播放按钮本身） */
    document.addEventListener("click", function (e) {
      if (e.target.closest(".voice-btn")) return;
      var cover = e.target.closest(".cover-playable");
      if (!cover) return;
      var btn = cover.querySelector(".voice-btn");
      if (!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleVoice(btn);
    });
    /* 卡片右侧区域点击跳转（drama 卡片 data-link，但排除封面和 voice-btn） */
    document.addEventListener("click", function (e) {
      if (e.target.closest(".voice-btn")) return;
      if (e.target.closest(".cover-playable")) return;
      var card = e.target.closest(".drama-card-playable[data-link]");
      if (!card) return;
      var link = card.getAttribute("data-link");
      if (!link) return;
      window.open(link, "_blank", "noopener,noreferrer");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var btn = e.target.closest(".voice-btn");
      if (!btn) return;
      e.preventDefault();
      toggleVoice(btn);
    });

    /* 年份筛选：chip（桌面） + select（手机）统一走同一状态 */
    var FADE_MS = 170;   // 切换年份时列表淡出时长（淡入由 CSS 380ms 过渡承担）

    function bindFilter(sel, key, rerender, listSel) {
      var bar = $(sel);

      /* 用文档坐标定位：sticky 状态 + 页面高度骤变会让视口坐标锚点失真，
         所以统一换算成「目标 scrollY = 目标文档 Y - (导航 + 筛选条 + 间距)」。 */
      function positionTo(target) {
        var navH = parseFloat(getComputedStyle(document.documentElement)
          .getPropertyValue("--nav-h")) || 62;
        var barH = bar.offsetHeight || 0;
        var docY = target.getBoundingClientRect().top + window.scrollY;
        var want = Math.max(0, docY - (navH + barH + 14));
        if (Math.abs(want - window.scrollY) < 2) return;
        var root = document.documentElement;
        var prevBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";   // 关闭平滑滚动，避免看到长距离滑动
        window.scrollTo(0, want);
        root.style.scrollBehavior = prevBehavior;
      }

      /* 提交：重渲染 + 瞬间把该年份的第一个分组定位到筛选条下方 */
      function commit(v) {
        console.log("[commit] " + v);
        state[key] = v;
        rerender();
        revealActiveChip(bar);
        saveState();
        syncStickyOffset();
        var list = listSel ? $(listSel) : null;
        var target = list ? list.querySelector(".year-group") : null;
        if (target) {
          positionTo(target);
          /* 高度骤变后浏览器可能二次裁剪 scrollY，下一帧再校正一次（此时仍淡出，不可见） */
          requestAnimationFrame(function () {
            if (target.isConnected) positionTo(target);
          });
        }
      }

      /* 淡出 → 换内容并定位 → 淡入：用户看不到快速上滑，只看到内容自然更替 */
      function apply(v) {
        var list = listSel ? $(listSel) : null;
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!list || reduce) { commit(v); return; }
        list.classList.add("is-switching");
        setTimeout(function () {
          commit(v);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { list.classList.remove("is-switching"); });
          });
        }, FADE_MS);
      }
      bar.addEventListener("click", function (e) {
        var chip = e.target.closest(".filter-chip");
        if (!chip) return;
        apply(chip.getAttribute("data-key"));
      });
      bar.addEventListener("change", function (e) {
        var selEl = e.target;
        if (selEl && selEl.classList && selEl.classList.contains("filter-select")) {
          apply(selEl.value);
        }
      });
      /* 移动端：select 聚焦时 iOS 会尝试将其滚动到视口中央，
         导致 sticky 筛选条跳位。用 focusin/focusout（冒泡版）委托到 bar，
         避免 innerHTML 重渲染后旧 select 上的监听失效。 */
      var savedScrollY = 0;
      bar.addEventListener("focusin", function (e) {
        if (e.target.classList && e.target.classList.contains("filter-select")) {
          savedScrollY = window.scrollY;
        }
      });
      bar.addEventListener("focusout", function (e) {
        if (!e.target.classList || !e.target.classList.contains("filter-select")) return;
        /* 延迟一帧等 iOS 原生 select 关闭后再检测位置 */
        requestAnimationFrame(function () {
          var barTop = bar.getBoundingClientRect().top;
          if (barTop < -10 || barTop > window.innerHeight * 0.5) {
            var root = document.documentElement;
            var prev = root.style.scrollBehavior;
            root.style.scrollBehavior = "auto";
            window.scrollTo(0, savedScrollY);
            root.style.scrollBehavior = prev;
          }
        });
      });
    }
    bindFilter("#gameFilter", "gameKey", renderGames, "#gameTimeline");
    bindFilter("#dramaFilter", "dramaKey", renderDramas, "#dramaList");
    bindFilter("#webFilter", "webKey", renderWebDramas, "#webDramaPanel");
    bindFilter("#musicFilter", "musicKey", renderMusic, "#musicGrid");
    bindFilter("#animFilter", "animKey", renderAnimations, "#animList");
    bindFilter("#eventFilter", "eventKey", renderEvents, "#eventList");
    /* 初次渲染后也把选中项（可能是恢复的持久化状态）滚到可视区 */
    $$(".filter-bar").forEach(revealActiveChip);

    /* 搜索 */
    var timer;
    $("#searchInput").addEventListener("input", function (e) {
      clearTimeout(timer);
      var v = e.target.value.trim();
      timer = setTimeout(function () {
        state.query = v;
        renderAll();
        updateSearchCount();
      }, 200);
    });

    $("#searchToggle").addEventListener("click", function () {
      var panel = $("#searchPanel");
      var open = panel.classList.toggle("is-open");
      this.setAttribute("aria-expanded", String(open));
      if (open) $("#searchInput").focus();
    });
    $("#searchClose").addEventListener("click", closeSearch);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); $("#searchToggle").click(); }
    });

    function closeSearch() {
      var panel = $("#searchPanel");
      if (!panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      $("#searchToggle").setAttribute("aria-expanded", "false");
      $("#searchInput").value = "";
      state.query = "";
      renderAll();
      updateSearchCount();
    }

    /* 移动端菜单 */
    $("#navToggle").addEventListener("click", function () {
      var open = $("#navLinks").classList.toggle("is-open");
      this.setAttribute("aria-expanded", String(open));
    });
    /* 导航跳转：整页淡出 → 瞬间定位 → 淡入（与年份切换同款节奏），
       关掉 smooth 滚动，用户看不到长距离滑动。 */
    $$(".nav-link").forEach(function (a) {
      a.addEventListener("click", function (e) {
        $("#navLinks").classList.remove("is-open");
        $("#navToggle").setAttribute("aria-expanded", "false");
        var t = document.getElementById(a.getAttribute("href").slice(1));
        if (!t) return;
        e.preventDefault();
        var navH = parseFloat(getComputedStyle(document.documentElement)
          .getPropertyValue("--nav-h")) || 62;
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var page = document.getElementById("main") || document.body;

        function jump() {
          var docY = t.getBoundingClientRect().top + window.scrollY;
          var root = document.documentElement;
          var prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          window.scrollTo(0, Math.max(0, docY - navH));
          root.style.scrollBehavior = prev;
          try { history.replaceState(null, "", "#" + t.id); } catch (err) {}
        }
        if (reduce) { jump(); return; }
        page.classList.add("is-page-switching");
        setTimeout(function () {
          jump();
          /* 双 rAF 确保定位后的新画面先绘制，再开始淡入 */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { page.classList.remove("is-page-switching"); });
          });
        }, 150);
      });
    });

    /* 主题切换（记忆到 localStorage） */
    $("#themeToggle").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("dmy-theme", next); } catch (err) {}
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#100d1a" : "#f7f4f0");
    });

    /* 回到顶部 */
    $("#toTop").addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* 滚动：进度条 / 导航态 / 高亮当前区块 */
    var nav = $("#nav"), bar = $("#scrollProgress"), ticking = false;
    var links = $$(".nav-link");
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      nav.classList.toggle("is-scrolled", y > 40);

      var active = -1;
      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        if (t && t.getBoundingClientRect().top <= 140) active = i;
      }
      links.forEach(function (l, i) { l.classList.toggle("is-active", i === active); });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* ======================================================================
     13. 入场动画
     ====================================================================== */
  /* 信息卡高度锁定：角色名字/芯片/简介长短各异，若让整卡随内容伸缩，
     首屏高度会被顶得变化，页面下方内容与滚动条随之跳动。
     做法：把「全角色中最高的整卡」高度设为 #stageInfo 的 min-height。
     卡内元素保持自然排版——简介与播放器始终紧贴、没有空行；
     短文案角色多出的空间落在卡片底部透明留白里，视觉上不可见。 */
  function fitStageInfo() {
    var info = $("#stageInfo");
    if (!info || !stageList.length) return;
    var cur = stageIdx;
    var prev = info.style.visibility;
    info.style.visibility = "hidden";   /* 瞬时测量期隐藏，避免文字来回切换可见闪烁 */
    var max = 0;
    for (var i = 0; i < stageList.length; i++) {
      fillStageTexts(info, stageList[i]);
      var h = info.offsetHeight;
      if (h > max) max = h;
    }
    fillStageTexts(info, stageList[cur]);   /* 还原当前角色的文案 */
    info.style.visibility = prev;
    info.style.minHeight = max ? (max + 6) + "px" : "";   /* +6 安全垫，防亚像素差裁掉最长角色 */
  }

  var io = null;
  function observeReveal() {
    if (io) io.disconnect();
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- 吸顶筛选条：静态只露分场线，吸顶后浮出阴影（底色带常驻实色）。
     .is-stuck 用同步几何判定（getBoundingClientRect().top 是否到达导航下沿），
     scroll + rAF 驱动——不用 IntersectionObserver：observer 回调异步且在
     bar 远离视口时会误判，快速滚动/锚点跳转时状态脱节，
     造成吸顶底色短暂缺失、下方列表文字透出。 */
  function initStickyBars() {
    var navH = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue("--nav-h")) || 62;
    var bars = $$(".filter-bar");
    if (!bars.length) return;
    function updateStuck() {
      bars.forEach(function (bar) {
        bar.classList.toggle("is-stuck", bar.getBoundingClientRect().top <= navH + 1);
      });
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(function () { updateStuck(); ticking = false; });
      }
    }, { passive: true });
    window.addEventListener("resize", updateStuck);
    updateStuck();
  }

  /* ======================================================================
     14. 启动
     ====================================================================== */
  try {
    var saved = localStorage.getItem("dmy-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch (err) {}

  restoreState();       // 先恢复 UI 状态，再渲染，保证刷新后位置/展开一致
  applyProfile();
  initRoleStage();
  renderStats();
  renderSocials();
  renderFooter();
  renderAll();
  bindEvents();
  initStickyBars();
  syncStickyOffset();   // 渲染后再同步一次（图片/字体可能影响高度）
  fitStageInfo();      // 信息卡按全角色最长锁定：切换只动卡内排版，页面/滚动条稳定
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { fitStageInfo(); });   // 自定义字体加载后再校准
  }
  window.addEventListener("resize", function () {
    fitStageInfo();    // 宽度变了行数/换行会变，重新取最长
    syncStickyOffset();
  });
})();
