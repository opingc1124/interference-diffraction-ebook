/* 電子書核心：狀態、路由（含段落錨點）、目錄、互動題元件、追問助手、測驗、去識別化紀錄、題目索引 */
(function () {
  var KEY = "idbook-v2";
  var S = { role: "student", code: "", seen: {}, done: {}, ans: {}, quiz: {} };
  try { var raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  window.STATE = S;
  document.documentElement.setAttribute("data-role", S.role);

  var BOOK = window.BOOK = { chapters: [] };
  var REG = window.REG = {};
  var PAGES = [];
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var strip = function (s) { return String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); };

  /* ---------- 版面小元件 ---------- */
  var H = window.H = {
    key: function (ic, title, body, cls, id) { return '<div class="key ' + (cls || "") + '"' + (id ? ' id="' + id + '"' : '') + '>' + (title ? '<b class="t">' + title + '</b>' : '') + '<div>' + body + '</div></div>'; },
    teach: function (title, body, open) { return '<details class="fold teach t-only"' + (open ? " open" : "") + '><summary>' + title + icon("chev", "chev") + '</summary><div class="in">' + body + '</div></details>'; },
    fold: function (ic, title, body, open, id) { return '<details class="fold"' + (id ? ' id="' + id + '"' : '') + (open ? " open" : "") + '><summary>' + title + icon("chev", "chev") + '</summary><div class="in">' + body + '</div></details>'; },
    fig: function (src, cap, alt) { return '<figure><img src="' + src + '" alt="' + esc(alt || strip(cap)) + '" loading="lazy"><figcaption>' + cap + '</figcaption></figure>'; },
    cycle: function (on) { return '<div class="cycle" aria-label="學習四步">' + ["預測", "觀察", "解釋", "修訂"].map(function (s, i) { return '<span class="' + (s === on ? "on" : "") + '">' + (i + 1) + ' ' + s + '</span>'; }).join("") + '</div>'; },
    head: function (kick, title, lead) { return '<div class="hero"><span class="kicker">' + kick + '</span><h1>' + title + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + '</div>'; },
    table: function (head, rows, wide) {
      return '<div class="tbl' + (wide ? " wide" : "") + '"><table><thead><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + '</tr></thead><tbody>' + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div>';
    },
    src: function (t) { return '<span class="tag gy">' + t + '</span>'; }
  };

  /* ---------- 互動題 ---------- */
  var R = {};
  function qhead(d) { return '<div class="qh">' + (d.n ? '<span class="qn">' + d.n + '</span>' : '') + '<div class="qt">' + d.q + (d.meta ? '<div class="qmeta">' + d.meta + '</div>' : '') + '</div></div>'; }
  function fbx(kind, html) { return '<div class="fb ' + kind + '">' + html + '</div>'; }
  function book(link, lt) { return link ? '<br><a class="book" href="#' + link + '">' + (lt || "複習相關段落") + '</a>' : ''; }
  function letter(i) { return "ABCDEFGH"[i]; }

  R.mcq = function (d) {
    var a = S.ans[d.id] || {}; var sel = a.sel != null ? a.sel : (d.multi ? [] : null);
    var checked = a.checked; var locked = checked && (d.ans == null || a.ok);
    var h = '<div class="q" data-qid="' + d.id + '" data-type="mcq">' + qhead(d) + '<div class="opts' + (d.row ? " row" : "") + '">';
    d.opts.forEach(function (o, i) {
      var isSel = d.multi ? sel.indexOf(i) >= 0 : sel === i; var cls = isSel ? "sel" : "";
      if (checked && d.ans != null) { var right = d.multi ? d.ans.indexOf(i) >= 0 : d.ans === i; if (a.ok && right) cls = "right"; else if (isSel) cls = right ? "right" : "wrong"; }
      h += '<button type="button" class="opt ' + cls + '" data-act="pick" data-i="' + i + '"' + (locked ? " disabled" : "") + '><span class="mk">' + letter(i) + '</span><span>' + o + '</span></button>';
    });
    h += '</div>';
    if (!locked) h += '<div class="btns"><button class="btn" data-act="check"' + ((d.multi ? sel.length : sel != null) ? "" : " disabled") + '>' + (d.ans == null ? "保留我的預測" : "送出") + '</button></div>';
    if (checked) {
      if (d.ans == null) h += fbx("info", "已保留你的預測。" + (d.after || "繼續往下觀察，再回來比較。"));
      else if (a.ok) h += fbx("ok", "<b>答對了。</b>" + (d.explain || "") + book(d.link, d.lt));
      else h += fbx("no", "<b>再想想。</b>" + (d.hint || "回看上方的觀察或模擬，再選一次。"));
    }
    if (d.ladder && checked && d.ans != null && !a.ok) h += ladderHtml(d);
    return h + '</div>';
  };
  function ladderHtml(d) {
    var lv = (S.ans[d.id] || {}).lv || 0;
    var h = '<div class="assist"><div class="h">追問助手・一次一個問題</div>';
    for (var i = 0; i < lv; i++) { var L = d.ladder[i]; h += fbx("hint", '<b>L' + (i + 1) + '</b>　' + (L.q || L) + book(L.link, L.lt)); }
    if (lv < d.ladder.length) h += '<div class="btns" style="margin-top:.5rem"><button class="btn ghost" data-act="ladder">' + (lv ? "還是不確定，再問我一題" : "請追問我") + '</button></div>';
    else h += '<p class="small muted" style="margin-top:.5rem">三個問題都看過還卡住？請舉手請老師協助。</p>';
    return h + '</div>';
  }
  /* 文字題的追問助手：依關鍵字判讀，連回課本段落 */
  function diagHtml(d, v) {
    if (!d.diag) return "";
    var txt = Object.keys(v || {}).map(function (k) { return v[k]; }).join(" ");
    var hits = d.diag.filter(function (r) { var m = r.re.test(txt); return r.not ? !m : m; }).slice(0, 2);
    var h = '<div class="assist"><div class="h">追問助手</div>';
    if (!hits.length) h += fbx("ok", "你寫到了關鍵概念。對照下方要點，檢查因果是否連貫。");
    hits.forEach(function (r) { h += fbx("hint", r.q + book(r.link, r.lt)); });
    return h + '</div>';
  }

  R.text = function (d) {
    var a = S.ans[d.id] || {};
    var h = '<div class="q" data-qid="' + d.id + '" data-type="text">' + qhead(d);
    (d.fields || [{ k: "v", label: "", rows: d.rows || 3, ph: d.ph }]).forEach(function (f) {
      h += '<div class="field">' + (f.label ? '<label for="' + d.id + "-" + f.k + '">' + f.label + '</label>' : '') + '<textarea id="' + d.id + "-" + f.k + '" data-k="' + f.k + '" rows="' + (f.rows || 3) + '" placeholder="' + esc(f.ph || "") + '">' + esc((a.v || {})[f.k] || "") + '</textarea></div>';
    });
    h += '<div class="btns"><button class="btn" data-act="savetext">' + (a.saved ? "儲存修訂" : "儲存") + '</button>' + (a.saved ? '<span class="saved">已儲存' + (a.rev ? '・第 ' + (a.rev + 1) + ' 版' : '') + '</span>' : '') + '</div>';
    if (a.saved) h += diagHtml(d, a.v);
    if (d.ref) h += a.saved ? '<div class="ref"><b>對照要點　</b>' + d.ref + '</div>' : '<div class="ref t-only"><b>參考答案　</b>' + d.ref + '</div>';
    return h + '</div>';
  };
  R.cer = function (d) {
    d.fields = [
      { k: "c", label: '<span class="tag c">主張 C</span>　我的結論', rows: 2, ph: d.phC || "" },
      { k: "e", label: '<span class="tag c">證據 E</span>　我觀察到什麼（註明實拍或模型）', rows: 2, ph: d.phE || "" },
      { k: "r", label: '<span class="tag c">推理 R</span>　證據如何連到波的疊加', rows: 3, ph: d.phR || "" }
    ];
    return R.text(d);
  };
  R.strip = function (d) {
    var n = d.cells || 15; var a = S.ans[d.id] || {}; var v = a.v || new Array(n).fill(0); var lock = a.saved;
    var h = '<div class="q" data-qid="' + d.id + '" data-type="strip">' + qhead(d);
    h += '<div class="strip' + (lock ? " lock" : "") + '" style="--n:' + n + '">' + v.map(function (x, i) { return '<button type="button" aria-label="位置 ' + (i + 1) + '：' + ["暗", "微亮", "亮"][x] + '" data-act="cell" data-i="' + i + '" class="' + (x === 2 ? "on" : x === 1 ? "mid" : "") + '"' + (lock ? " disabled" : "") + '></button>'; }).join("") + '</div>';
    h += '<div class="strip-label"><span>左</span><span>中央</span><span>右</span></div>';
    if (!lock) h += '<p class="small muted">點格子切換：暗 → 微亮 → 亮</p><div class="btns"><button class="btn" data-act="savestrip">保存這張圖</button><button class="btn ghost" data-act="clearstrip">清除</button></div>';
    else h += fbx("info", "已保存。" + (d.after || ""));
    return h + '</div>';
  };
  R.seg = function (d) {
    var a = S.ans[d.id] || {}; var v = a.v || {}; var checked = a.checked;
    var h = '<div class="q" data-qid="' + d.id + '" data-type="seg">' + qhead(d) + '<div class="bdgrid"><span></span>' + d.cols.map(function (c) { return '<span class="h">' + c.t + '</span>'; }).join("");
    d.rows.forEach(function (r) {
      h += '<span class="pt">' + r.t + '</span>';
      d.cols.forEach(function (c, ci) {
        h += '<div class="seg" role="group" aria-label="' + r.t + ' ' + c.t + '">' + c.o.map(function (o, oi) {
          var k = r.k + ci; var isSel = v[k] === oi; var cls = isSel ? "sel" : "";
          if (checked && isSel) cls = r.ans[ci] === oi ? "right" : "wrong";
          return '<button type="button" data-act="segpick" data-k="' + k + '" data-i="' + oi + '" class="' + cls + '"' + (checked && a.ok ? " disabled" : "") + '>' + o + '</button>';
        }).join("") + '</div>';
      });
    });
    h += '</div>';
    if (!(checked && a.ok)) h += '<div class="btns"><button class="btn" data-act="segcheck">送出</button></div>';
    if (checked) h += a.ok ? fbx("ok", "<b>判斷正確。</b>" + (d.explain || "") + book(d.link, d.lt)) : fbx("no", "<b>紅色的格子需要修正。</b>");
    if (d.ladder && checked && !a.ok) h += ladderHtml(d);
    return h + '</div>';
  };
  R.sort = function (d) {
    var a = S.ans[d.id] || {}; var v = a.v || {}; var checked = a.checked;
    var h = '<div class="q" data-qid="' + d.id + '" data-type="sort">' + qhead(d) + '<div class="sort">';
    d.items.forEach(function (it, ii) {
      var st = checked && v[ii] != null ? (v[ii] === it.ans ? "right" : "wrong") : "";
      h += '<div class="item ' + st + '"><img src="' + it.img + '" alt="' + esc(it.t) + '" loading="lazy"><div class="body"><b>' + it.t + '</b><div class="seg">' + d.cats.map(function (c, ci) { return '<button type="button" data-act="sortpick" data-k="' + ii + '" data-i="' + ci + '" class="' + (v[ii] === ci ? (st || "sel") : "") + '">' + c + '</button>'; }).join("") + '</div>' + (checked && st === "right" && it.why ? '<span class="small muted">' + it.why + '</span>' : '') + '</div></div>';
    });
    var all = Object.keys(v).length === d.items.length;
    h += '</div><div class="btns"><button class="btn" data-act="sortcheck"' + (all ? "" : " disabled") + '>檢查分類</button>' + (all ? "" : '<span class="small muted">每張都選好後才能檢查</span>') + '</div>';
    if (checked) { var n = d.items.filter(function (it, ii) { return v[ii] === it.ans; }).length; h += fbx(n === d.items.length ? "ok" : "no", "答對 " + n + " / " + d.items.length + "。" + (n === d.items.length ? (d.explain || "") : "紅框的照片再想一次：是哪幾路光在疊加？") + book(d.link, d.lt)); }
    return h + '</div>';
  };
  R.quiz = function (d) {
    var a = S.quiz[d.id] || { v: {} }; var done = a.done;
    var h = '<div class="quiz" data-qid="' + d.id + '" data-type="quiz">';
    if (done) h += '<div class="card quiz-head"><div class="score"><div><div class="big num">' + a.score + '<span class="muted" style="font-size:1rem"> / ' + a.auto + '</span></div><span class="small muted">選擇題得分</span></div>' + (a.open ? '<div class="small muted">另有 ' + a.open + ' 分簡答<br>由老師評分</div>' : '') + '</div><button class="btn ghost" data-act="qretry">' + icon("reset") + '重新作答</button></div>';
    d.items.forEach(function (it, i) {
      var sel = a.v[i];
      h += '<div class="q" style="margin-top:.9rem"><div class="qh"><span class="qn">' + (i + 1) + '</span><div class="qt">' + it.q + '<div class="qmeta">' + it.pts + ' 分　<span class="lvl">' + it.lvl + '</span></div></div></div>';
      if (it.img) h += it.img;
      if (it.type === "open") {
        h += '<textarea rows="3" data-act="qtext" data-i="' + i + '" aria-label="第 ' + (i + 1) + ' 題作答" placeholder="寫下你的回答"' + (done ? " readonly" : "") + '>' + esc(sel || "") + '</textarea>';
        h += '<div class="ref' + (done ? '' : ' t-only') + '"><b>評分要點　</b>' + it.ref + '</div>';
      } else {
        h += '<div class="opts">' + it.opts.map(function (o, oi) {
          var cls = sel === oi ? "sel" : "";
          if (done) { if (oi === it.ans) cls = "right"; else if (sel === oi) cls = "wrong"; }
          return '<button type="button" class="opt ' + cls + '" data-act="qpick" data-i="' + i + '" data-o="' + oi + '"' + (done ? " disabled" : "") + '><span class="mk">' + letter(oi) + '</span><span>' + o + '</span></button>';
        }).join("") + '</div>';
        if (done && it.ex) h += fbx(sel === it.ans ? "ok" : "info", it.ex + book(it.link, it.lt));
        else if (done && sel !== it.ans && it.link) h += fbx("info", "這題可以回去複習。" + book(it.link, it.lt));
        else if (!done) h += '<div class="ref t-only"><b>答案 ' + letter(it.ans) + '　</b>' + (it.ex || "") + '</div>';
      }
      h += '</div>';
    });
    if (!done) h += '<div class="btns" style="margin-top:1rem"><button class="btn" data-act="qsubmit">交卷看結果</button><span class="small muted">交卷前可隨時修改</span></div>';
    return h + '</div>';
  };

  var C = window.C = {};
  ["mcq", "text", "cer", "strip", "seg", "sort", "quiz"].forEach(function (t) {
    C[t] = function (d) { d.type = t; d.page = C._page; REG[d.id] = d; return '<div class="qwrap" data-wrap="' + d.id + '">' + R[t](d) + '</div>'; };
  });
  function refresh(id) { var w = document.querySelector('[data-wrap="' + id + '"]'); if (!w) return; w.innerHTML = R[REG[id].type](REG[id]); save(); markDone(); }
  window.regExt = function (id, q, n) { REG[id] = { type: "ext", q: q, n: n, page: C._page }; };

  /* ---------- 事件 ---------- */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act");
    var box = b.closest("[data-qid]"); var id = box && box.getAttribute("data-qid"); var d = id && REG[id];
    var a = id ? (S.ans[id] = S.ans[id] || {}) : null; var i = +b.getAttribute("data-i");
    switch (act) {
      case "pick": if (d.multi) { a.sel = a.sel || []; var p = a.sel.indexOf(i); if (p >= 0) a.sel.splice(p, 1); else a.sel.push(i); } else a.sel = i; a.checked = false; refresh(id); break;
      case "check":
        a.checked = true; if (d.ans != null) a.ok = d.multi ? (a.sel.slice().sort().join() === d.ans.slice().sort().join()) : a.sel === d.ans;
        a.tries = (a.tries || 0) + 1; a.saved = true; refresh(id); break;
      case "ladder": a.lv = (a.lv || 0) + 1; refresh(id); break;
      case "savetext":
        var v = {}; box.querySelectorAll("textarea[data-k]").forEach(function (t) { v[t.getAttribute("data-k")] = t.value.trim(); });
        if (!Object.keys(v).some(function (k) { return v[k]; })) { toast("請先寫下你的想法"); break; }
        if (a.saved && JSON.stringify(a.v) !== JSON.stringify(v)) { a.hist = a.hist || []; a.hist.push(a.v); a.rev = a.hist.length; }
        a.v = v; a.saved = true; refresh(id); toast("已儲存"); break;
      case "cell": var n = d.cells || 15; a.v = a.v || new Array(n).fill(0); a.v[i] = (a.v[i] + 1) % 3; refresh(id); break;
      case "clearstrip": a.v = null; refresh(id); break;
      case "savestrip": if (!a.v || !a.v.some(Boolean)) { toast("先點格子畫出亮暗"); break; } a.saved = true; refresh(id); break;
      case "segpick": a.v = a.v || {}; a.v[b.getAttribute("data-k")] = i; a.checked = false; refresh(id); break;
      case "segcheck":
        a.v = a.v || {}; var full = true, ok = true;
        d.rows.forEach(function (r) { d.cols.forEach(function (c, ci) { if (a.v[r.k + ci] == null) full = false; if (a.v[r.k + ci] !== r.ans[ci]) ok = false; }); });
        if (!full) { toast("每一格都選好再送出"); break; }
        a.checked = true; a.ok = ok; a.tries = (a.tries || 0) + 1; a.saved = true; refresh(id); break;
      case "sortpick": a.v = a.v || {}; a.v[b.getAttribute("data-k")] = i; a.checked = false; refresh(id); break;
      case "sortcheck": a.checked = true; a.saved = true; refresh(id); break;
      case "qpick": var q = S.quiz[id] = S.quiz[id] || { v: {} }; q.v[i] = +b.getAttribute("data-o"); refresh(id); break;
      case "qsubmit":
        var qq = S.quiz[id] = S.quiz[id] || { v: {} };
        box.querySelectorAll("textarea[data-act=qtext]").forEach(function (t) { qq.v[t.getAttribute("data-i")] = t.value; });
        var miss = d.items.filter(function (it, k) { return it.type !== "open" && qq.v[k] == null; }).length;
        if (miss) { toast("還有 " + miss + " 題未作答"); break; }
        var sc = 0, auto = 0, open = 0;
        d.items.forEach(function (it, k) { if (it.type === "open") open += it.pts; else { auto += it.pts; if (qq.v[k] === it.ans) sc += it.pts; } });
        qq.done = true; qq.score = sc; qq.auto = auto; qq.open = open;
        S.ans[id] = { saved: true }; refresh(id); box.scrollIntoView({ behavior: "smooth", block: "start" }); break;
      case "qretry": S.quiz[id] = { v: {} }; refresh(id); break;
      case "role": setRole(b.getAttribute("data-r")); break;
      case "menu": document.body.classList.toggle("nav-open"); break;
      case "grp": b.parentNode.classList.toggle("open"); break;
      case "savecode": saveCode(); break;
      case "copyrec": copyRecord(); break;
      case "reset-all":
        if (b.getAttribute("data-armed")) { var role = S.role; S.ans = {}; S.quiz = {}; S.done = {}; S.seen = {}; S.code = ""; S.role = role; save(); location.hash = "home"; toast("已清除這台裝置的作答"); }
        else { b.setAttribute("data-armed", "1"); b.textContent = "再按一次確認清除"; }
        break;
    }
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target; if (t.getAttribute("data-act") !== "qtext") return;
    var id = t.closest("[data-qid]").getAttribute("data-qid"); var q = S.quiz[id] = S.quiz[id] || { v: {} }; q.v[t.getAttribute("data-i")] = t.value; save();
  });
  function toast(msg) { var el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("show"); }, 2000); }
  window.toast = toast;
  window.saveAns = function (id, obj) { S.ans[id] = Object.assign(S.ans[id] || {}, obj, { saved: true }); save(); markDone(); };

  function setRole(r) {
    S.role = r; save(); document.documentElement.setAttribute("data-role", r);
    document.querySelectorAll(".role button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-r") === r ? "true" : "false"); });
    var p = currentPage(); if (r === "student" && p && p.teacher) location.hash = "home"; else { buildToc(); }
  }

  /* ---------- 去識別化紀錄 ---------- */
  function looksLikeName(c) { return /^[一-鿿]{2,4}$/.test(c) || /@/.test(c) || /^\d{8,}$/.test(c); }
  function saveCode() {
    var inp = document.getElementById("stu-code"); var c = (inp.value || "").trim().toUpperCase();
    var msg = document.getElementById("code-msg");
    if (!/^[A-Z0-9-]{2,12}$/.test(c)) { msg.innerHTML = fbx("no", "代碼請用 2–12 個英文字母或數字（例如 <b>A07</b>、<b>301-15</b>），不要填姓名。"); return; }
    if (looksLikeName(c)) { msg.innerHTML = fbx("no", "這看起來像可識別個人的資料，請改用老師給的代碼。"); return; }
    S.code = c; save(); msg.innerHTML = fbx("ok", "已設定代碼 <b>" + c + "</b>。"); var ta = document.getElementById("rec-text"); if (ta) ta.value = recordText();
  }
  function scrub(s) { return String(s == null ? "" : s).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[已移除]").replace(/09\d{2}[- ]?\d{3}[- ]?\d{3}/g, "[已移除]"); }
  function deep(v) { if (v == null) return v; if (typeof v === "string") return scrub(v); if (Array.isArray(v)) return v.map(deep); if (typeof v === "object") { var o = {}; Object.keys(v).forEach(function (k) { o[k] = deep(v[k]); }); return o; } return v; }
  window.recordText = function () {
    var out = { 教材: "干涉與繞射", 學生代碼: S.code || "（未設定）", 日期: new Date().toISOString().slice(0, 10), 作答: [], 測驗: [] };
    collect().forEach(function (it) {
      var a = S.ans[it.id]; if (!a || !a.saved || it.kind === "quiz") return; var d = REG[it.id] || {};
      var ans = a.v != null ? a.v : (a.sel != null && d.opts ? [].concat(a.sel).map(function (x) { return d.opts[x]; }).join("、") : null);
      out.作答.push(deep({ 位置: it.pageTitle, 題號: it.n || "", 題目: it.q, 回答: ans, 結果: a.ok == null ? undefined : (a.ok ? "正確" : "待修正"), 嘗試次數: a.tries, 追問層次: a.lv, 先前版本: a.hist }));
    });
    ["quiz-pre", "quiz-l1", "quiz-l2", "quiz-l3", "quiz-post"].forEach(function (k) { var q = S.quiz[k]; if (q && q.done) out.測驗.push({ 測驗: { "quiz-pre": "前測", "quiz-l1": "第1節隨堂", "quiz-l2": "第2節隨堂", "quiz-l3": "第3節隨堂", "quiz-post": "後測" }[k], 選擇題得分: q.score + "/" + q.auto, 簡答待評: q.open || 0, 簡答: deep(Object.keys(q.v).filter(function (i) { return typeof q.v[i] === "string"; }).map(function (i) { return { 題: +i + 1, 回答: q.v[i] }; })) }); });
    return JSON.stringify(out, null, 2);
  };
  function copyRecord() {
    if (!S.code) { toast("請先設定學生代碼"); document.getElementById("stu-code").focus(); return; }
    var t = recordText(); var ta = document.getElementById("rec-text"); if (ta) ta.value = t;
    function fallback() { if (ta) { ta.focus(); ta.select(); } toast("已選取，請按 Ctrl+C（手機長按）複製"); }
    try { navigator.clipboard.writeText(t).then(function () { toast("已複製，可貼到老師指定的繳交處"); }, fallback); } catch (e) { fallback(); }
  }

  /* ---------- 題目索引（自動收集所有頁面的題目） ---------- */
  var COLLECTED = null;
  function collect() {
    if (COLLECTED) return COLLECTED; var out = [];
    PAGES.forEach(function (p) {
      if (p.teacher || p.noIndex) return; C._page = p.id; var html = ""; try { html = p.render(); } catch (e) {}
      var re = /data-qid="([^"]+)"/g, m;
      while ((m = re.exec(html))) {
        var d = REG[m[1]] || {}; if (out.some(function (x) { return x.id === m[1]; })) continue;
        out.push({ id: m[1], page: p.id, pageTitle: p.title, ch: p.ch, n: d.n || "", q: d.type === "quiz" ? (d.title || "測驗") + "（" + d.items.length + " 題）" : strip(d.q), kind: d.type });
      }
    });
    C._page = null; return (COLLECTED = out);
  }
  window.collectQuestions = collect;
  window.qStatus = function (id) { var q = S.quiz[id]; if (q && q.done) return "已交卷"; var a = S.ans[id]; return a && a.saved ? "已完成" : ""; };

  /* ---------- 目錄與路由 ---------- */
  function allPages() { PAGES = []; BOOK.chapters.forEach(function (ch) { ch.pages.forEach(function (p) { p.ch = ch; p.teacher = !!ch.teacher; PAGES.push(p); }); }); }
  window.PAGES = function () { return PAGES; };
  function visiblePages() { return PAGES.filter(function (p) { return S.role === "teacher" || !p.teacher; }); }
  function parseHash() { var h = decodeURIComponent(location.hash.replace("#", "")) || "home"; var i = h.indexOf("--"); return i > 0 ? { id: h.slice(0, i), anchor: h.slice(i + 2) } : { id: h, anchor: null }; }
  function currentPage() { var id = parseHash().id; return PAGES.filter(function (p) { return p.id === id; })[0]; }
  function buildToc() {
    var cur = currentPage(); var h = "";
    BOOK.chapters.forEach(function (ch) {
      if (ch.teacher && S.role !== "teacher") return;
      var open = cur && cur.ch === ch ? " open" : "";
      h += '<div class="grp' + open + '" style="--gc:var(--c-' + ch.color + ')"><button type="button" data-act="grp" aria-expanded="' + (open ? "true" : "false") + '"><span class="dot">' + ch.mark + '</span><span>' + ch.title + '</span>' + icon("chev", "chev") + '</button><ul>';
      ch.pages.forEach(function (p) { var st = S.done[p.id] ? "done" : S.seen[p.id] ? "seen" : ""; h += '<li><a href="#' + p.id + '"' + (cur === p ? ' aria-current="page"' : '') + '><span class="st ' + st + '" aria-label="' + (st === "done" ? "已完成" : "") + '"></span>' + p.title + '</a></li>'; });
      h += '</ul></div>';
    });
    document.getElementById("toc").innerHTML = h;
    var sp = PAGES.filter(function (p) { return !p.teacher && p.track !== false; }); var dn = sp.filter(function (p) { return S.done[p.id]; }).length;
    document.getElementById("prog-bar").style.width = Math.round(dn / sp.length * 100) + "%";
    document.getElementById("prog-txt").textContent = dn + " / " + sp.length;
  }
  function markDone() {
    var p = currentPage(); if (!p) return;
    var ids = [].slice.call(document.querySelectorAll("#page [data-qid]")).map(function (e) { return e.getAttribute("data-qid"); });
    var ok = ids.length ? ids.every(function (k) { return (S.ans[k] || {}).saved; }) : !!S.seen[p.id];
    if (ok !== !!S.done[p.id]) { S.done[p.id] = ok; save(); buildToc(); }
  }
  function goAnchor(a) {
    if (!a) return; var el = document.getElementById(a) || document.querySelector('[data-qid="' + a + '"]'); if (!el) return;
    if (el.tagName === "DETAILS") el.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" }); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  }
  window.SIMS_STOP = [];
  var lastId = null;
  function route() {
    var hs = parseHash(); var p = currentPage();
    if (p && p.id === lastId && hs.anchor) { goAnchor(hs.anchor); return; }
    window.SIMS_STOP.forEach(function (f) { try { f(); } catch (e) {} }); window.SIMS_STOP = [];
    if (!p || (p.teacher && S.role !== "teacher")) p = PAGES[0];
    lastId = p.id; S.seen[p.id] = true; save();
    document.documentElement.setAttribute("data-ch", p.ch.id);
    var vp = visiblePages(); var i = vp.indexOf(p); var prev = vp[i - 1], next = vp[i + 1];
    C._page = p.id;
    var html = '<article class="page">' + p.render() + '</article>';
    C._page = null;
    html += '<nav class="pager col" aria-label="上一節／下一節">' + (prev ? '<a class="prev" href="#' + prev.id + '"><small>← 上一節</small><b>' + prev.title + '</b></a>' : '<span></span>') + (next ? '<a class="next" href="#' + next.id + '"><small>下一節 →</small><b>' + next.title + '</b></a>' : '') + '</nav>';
    var el = document.getElementById("page"); el.innerHTML = html;
    document.getElementById("crumb").innerHTML = p.ch.title + ' <span class="muted">/</span> <b>' + p.title + '</b>';
    document.title = p.title + "｜干涉與繞射";
    if (p.mount) { try { p.mount(el); } catch (e) { console.error(e); } }
    buildToc(); markDone(); document.body.classList.remove("nav-open");
    if (hs.anchor) setTimeout(function () { goAnchor(hs.anchor); }, 60); else window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  window.bootBook = function () {
    allPages();
    document.querySelectorAll(".role button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-r") === S.role ? "true" : "false"); });
    collect(); route();
  };
})();
