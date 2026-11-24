/* 互動模擬：疊加（SIM-01）、分鏡動畫（07B）、水波（SIM-02）、雙狹縫（SIM-03）、單雙縫比較、薄膜（SIM-04） */
(function () {
  var SIM = window.SIM = {};
  function stage(cv, W, H) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr; cv.style.aspectRatio = W + "/" + H;
    var g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); return g;
  }
  function loop(fn) {
    var on = true, last = performance.now();
    function f(now) { if (!on) return; var dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now; fn(dt); requestAnimationFrame(f); }
    requestAnimationFrame(f); window.SIMS_STOP.push(function () { on = false; });
  }
  function pos(cv, e, W, H) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
  function nmRGB(nm, a) {
    var r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else r = 1;
    var f = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
    return [Math.round(255 * r * f), Math.round(255 * g * f), Math.round(255 * b * f)];
  }
  SIM.nmRGB = nmRGB;
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  var COL = { a: "#6ea8ff", b: "#ffb44d", sum: "#ffffff", red: "#ff4d5a", grid: "rgba(255,255,255,.12)", txt: "#c9d2e3", dim: "#7c879b" };

  SIM.frame = function (o) {
    return '<div class="sim ' + (o.cls || "") + '" id="' + o.id + '"><div class="sim-head">' + icon(o.icon || "wave") + '<b>' + o.title + '</b>' + (o.tag ? ' <span class="tag md">' + o.tag + '</span>' : '') + '<span class="sp"></span>' + (o.head || "") + '</div><div class="sim-body' + (o.stack ? " stack" : "") + '"><div class="sim-stage">' + (o.stageHtml || '<canvas></canvas>') + '<div class="ovl"><span class="l"></span><span class="r"></span></div>' + (o.cap ? '<div class="cap" hidden></div>' : '') + '</div><div class="sim-ctl">' + (o.ctl || "") + '</div></div>' + (o.foot ? '<div class="sim-foot">' + o.foot + '</div>' : '') + '</div>';
  };
  function rng(id, label, min, max, step, val, unit) {
    return '<div class="ctl"><label for="' + id + '">' + label + '<span class="num" data-out="' + id + '">' + val + (unit || "") + '</span></label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
  SIM.rng = rng;

  /* ================= 繩波疊加（SIM-01，依 07B 模擬需求腳本） ================= */
  var W1 = 900, H1 = 430, X0 = 60, X1 = 870;
  function px(p) { return X0 + (X1 - X0) * p / 100; }
  function pulse(x, c, h) { var d = x - c; return Math.abs(d) < 10 ? h * .5 * (1 + Math.cos(Math.PI * d / 10)) : 0; }
  function drawRope(g, st) {
    g.clearRect(0, 0, W1, H1);
    var panels = [{ y: 105, t: "① 分波模型　A 細實線／B 虛線" }, { y: 315, t: "② 合成繩形　粗實線" }];
    var U = 26;
    panels.forEach(function (pn) {
      g.strokeStyle = COL.grid; g.lineWidth = 1; g.setLineDash([]);
      g.beginPath(); g.moveTo(X0, pn.y); g.lineTo(X1, pn.y); g.stroke();
      [-3, 3].forEach(function (v) { g.beginPath(); g.moveTo(X0, pn.y - v * U); g.lineTo(X1, pn.y - v * U); g.stroke(); });
      g.fillStyle = COL.dim; g.font = "12px IBM Plex Mono, monospace"; g.fillText("+3", 30, pn.y - 3 * U + 4); g.fillText(" 0", 30, pn.y + 4); g.fillText("-3", 30, pn.y + 3 * U + 4);
      g.fillStyle = COL.txt; g.font = "13px Noto Sans TC, sans-serif"; g.fillText(pn.t, X0, pn.y - 3 * U - 10);
      g.setLineDash([2, 4]); g.strokeStyle = "rgba(255,255,255,.45)"; g.beginPath(); g.moveTo(px(50), pn.y - 3 * U); g.lineTo(px(50), pn.y + 3 * U); g.stroke(); g.setLineDash([]);
      g.fillStyle = COL.txt; g.fillText("P", px(50) + 5, pn.y + 3 * U - 4);
    });
    function curve(yc, f, col, w, dash) {
      g.strokeStyle = col; g.lineWidth = w; g.setLineDash(dash || []); g.beginPath();
      for (var x = 0; x <= 100; x += .25) { var y = yc - f(x) * U; if (x === 0) g.moveTo(px(x), y); else g.lineTo(px(x), y); }
      g.stroke(); g.setLineDash([]);
    }
    var cA = st.cA, cB = st.cB;
    curve(105, function (x) { return pulse(x, cA, st.hA); }, COL.a, 2.2);
    curve(105, function (x) { return pulse(x, cB, st.hB); }, COL.b, 2.4, [8, 6]);
    curve(315, function (x) { return pulse(x, cA, st.hA) + pulse(x, cB, st.hB); }, COL.sum, 4);
    // 標籤與方向箭頭
    g.font = "bold 14px Noto Sans TC, sans-serif";
    [[cA, st.hA, "A", COL.a, 1], [cB, st.hB, "B", COL.b, -1]].forEach(function (k) {
      if (k[0] < -8 || k[0] > 108) return;
      var x = px(k[0]), y = 105 - k[1] * U - (k[1] >= 0 ? 14 : -24);
      g.fillStyle = k[3]; g.fillText(k[2], x - 5, y);
      if (st.arrows) { g.strokeStyle = k[3]; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 14 * k[4] + 14, y - 5 + 0); g.stroke(); var ax = x + 22 * k[4]; g.beginPath(); g.moveTo(ax - 10 * k[4], y - 5); g.lineTo(ax, y - 5); g.lineTo(ax - 5 * k[4], y - 10); g.moveTo(ax, y - 5); g.lineTo(ax - 5 * k[4], y); g.stroke(); }
      if (st.drag) { g.fillStyle = k[3]; g.beginPath(); g.arc(x, 105 - k[1] * U, 7, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 2; g.stroke(); }
    });
    if (st.pred != null) {
      var yP = 315 - st.pred * U;
      g.fillStyle = COL.red; g.beginPath(); g.arc(px(50), yP, 9, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 2; g.stroke();
      g.font = "bold 13px Noto Sans TC, sans-serif"; g.fillText("我的預測 " + (st.pred > 0 ? "+" : "") + st.pred.toFixed(1), px(50) + 14, yP + 4);
    }
    if (st.note) { g.fillStyle = "#ffd166"; g.font = "bold 14px Noto Sans TC, sans-serif"; g.fillText(st.note, X1 - g.measureText(st.note).width, 24); }
  }
  SIM.ropeFrame = function (id, opts) {
    opts = opts || {};
    var ctl = rng(id + "-a", "脈衝高度 A（含正負號）", -1.5, 1.5, .1, "+1") + rng(id + "-b", "脈衝高度 B（含正負號）", -1.5, 1.5, .1, "+1") +
      '<div class="btns"><button class="btn ghost" data-case="same">同向</button><button class="btn ghost" data-case="opp">反向</button></div>' +
      '<div class="btns"><button class="btn" data-run>' + icon("play") + '播放</button><button class="btn ghost" data-reset>' + icon("reset") + '重設</button></div>' +
      '<div class="readout" data-ro></div>';
    return SIM.frame({ id: id, title: opts.title || "繩波疊加模擬", icon: "pulse", tag: "模型", ctl: ctl, foot: '<span class="legend"><span><i style="border-color:' + COL.a + '"></i>分波 A</span><span><i style="border-color:' + COL.b + ';border-top-style:dashed"></i>分波 B</span><span><i style="border-color:#888;border-top-width:4px"></i>合成繩形</span></span><span class="sp" style="flex:1"></span>' + icon("hand") + ' 可直接拖曳上方 A、B 的圓點改變高度・理想線性介質的模型' });
  };
  SIM.rope = function (root, id) {
    var el = root.querySelector("#" + id); var cv = el.querySelector("canvas"); var g = stage(cv, W1, H1);
    var st = { hA: 1, hB: 1, t: 0, run: false, drag: true, arrows: true };
    var sa = el.querySelector("#" + id + "-a"), sb = el.querySelector("#" + id + "-b"), ro = el.querySelector("[data-ro]"), run = el.querySelector("[data-run]");
    function fmt(v) { return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1).replace(/\.0$/, ""); }
    function sync() { sa.value = st.hA; sb.value = st.hB; el.querySelector('[data-out="' + id + '-a"]').textContent = fmt(st.hA); el.querySelector('[data-out="' + id + '-b"]').textContent = fmt(st.hB); }
    function reset() { st.t = 0; st.run = false; run.innerHTML = icon("play") + "播放"; }
    sa.oninput = function () { st.hA = +(+sa.value).toFixed(1); reset(); sync(); };
    sb.oninput = function () { st.hB = +(+sb.value).toFixed(1); reset(); sync(); };
    el.querySelectorAll("[data-case]").forEach(function (b) { b.onclick = function () { st.hA = 1; st.hB = b.getAttribute("data-case") === "same" ? 1 : -1; reset(); sync(); }; });
    run.onclick = function () { if (st.t >= 17) st.t = 0; st.run = !st.run; run.innerHTML = st.run ? icon("pause") + "暫停" : icon("play") + "播放"; };
    el.querySelector("[data-reset]").onclick = function () { st.hA = 1; st.hB = 1; reset(); sync(); };
    var dragging = null;
    cv.addEventListener("pointerdown", function (e) {
      var p = pos(cv, e, W1, H1); var cA = 25 + 5 * st.t, cB = 75 - 5 * st.t;
      if (p.y > 210) return;
      var dA = Math.abs(p.x - px(cA)), dB = Math.abs(p.x - px(cB));
      if (Math.min(dA, dB) < 40) { dragging = dA <= dB ? "A" : "B"; cv.setPointerCapture(e.pointerId); reset(); }
    });
    cv.addEventListener("pointermove", function (e) {
      if (!dragging) return; var p = pos(cv, e, W1, H1);
      var v = Math.max(-1.5, Math.min(1.5, Math.round((105 - p.y) / 26 * 10) / 10));
      if (dragging === "A") st.hA = v; else st.hB = v; sync();
    });
    cv.addEventListener("pointerup", function () { dragging = null; });
    loop(function (dt) {
      if (st.run) { st.t += dt; if (st.t >= 17) { st.t = 17; st.run = false; run.innerHTML = icon("play") + "重播"; } }
      st.cA = 25 + 5 * st.t; st.cB = 75 - 5 * st.t;
      drawRope(g, st);
      var pa = pulse(50, st.cA, st.hA), pb = pulse(50, st.cB, st.hB);
      ro.innerHTML = "t = " + st.t.toFixed(1) + " 秒<br>P 點　A = " + fmt(+pa.toFixed(1)) + "　B = " + fmt(+pb.toFixed(1)) + "<br>合成 = <b>" + fmt(+(pa + pb).toFixed(1)) + "</b>（相對單位）";
    });
    sync();
  };

  /* 拖曳預測：重疊瞬間 P 點的合成高度 */
  SIM.predictFrame = function (id, q) {
    return '<div class="q" data-qid="' + id + '">' + '<div class="qh"><span class="qn">' + q.n + '</span><div class="qt">' + q.q + '</div></div>' +
      '<div class="sim" id="' + id + '-sim" style="box-shadow:none"><div class="sim-body stack"><div class="sim-stage"><canvas></canvas></div></div></div>' +
      '<div class="btns"><span class="small muted">' + icon("hand") + ' 上下拖曳下方紅點設定你的預測</span><span class="sp" style="flex:1"></span><button class="btn" data-go>' + icon("play") + '播放並對照</button><button class="btn ghost" data-again hidden>' + icon("reset") + '再試一次</button></div><div data-fb></div></div>';
  };
  SIM.predict = function (root, id, hA, hB, done) {
    var box = root.querySelector('[data-qid="' + id + '"]'); var cv = box.querySelector("canvas"); var g = stage(cv, W1, H1);
    var st = { hA: hA, hB: hB, t: 0, run: false, pred: 0, arrows: true }; var fb = box.querySelector("[data-fb]");
    var prev = (window.STATE.ans[id] || {}).v;
    var drag = false;
    cv.addEventListener("pointerdown", function (e) { var p = pos(cv, e, W1, H1); if (p.y > 220 && Math.abs(p.x - px(50)) < 50 && st.t === 0) { drag = true; cv.setPointerCapture(e.pointerId); } });
    cv.addEventListener("pointermove", function (e) { if (!drag) return; var p = pos(cv, e, W1, H1); st.pred = Math.max(-3, Math.min(3, Math.round((315 - p.y) / 26 * 2) / 2)); });
    cv.addEventListener("pointerup", function () { drag = false; });
    function show(pred) {
      var ok = Math.abs(pred - (hA + hB)) < .01;
      fb.innerHTML = '<div class="fb ' + (ok ? "ok" : "info") + '">' + icon(ok ? "check" : "info") + '<div>你預測 <b>' + (pred > 0 ? "+" : "") + pred + '</b>，實際合成為 <b>' + (hA + hB > 0 ? "+" : "") + (hA + hB) + '</b>。' + (ok ? "同一位置、同一時刻的位移相加。" : "注意：同一位置、同一時刻的兩個位移要「相加」（含正負號）。") + '　繼續播放可看到兩脈衝通過後仍各自前進。</div></div>';
    }
    box.querySelector("[data-go]").onclick = function () { st.run = true; this.hidden = true; box.querySelector("[data-again]").hidden = false; };
    box.querySelector("[data-again]").onclick = function () { st.t = 0; st.run = false; st.pred = 0; fb.innerHTML = ""; this.hidden = true; box.querySelector("[data-go]").hidden = false; };
    if (prev) { st.pred = prev.pred; show(prev.pred); }
    var stopAt = 5, stopped = false;
    loop(function (dt) {
      if (st.run) {
        st.t += dt;
        if (!stopped && st.t >= stopAt) { st.t = stopAt; st.run = false; stopped = true; show(st.pred); done(st.pred); setTimeout(function () { st.run = true; }, 1600); }
        if (st.t >= 17) { st.t = 17; st.run = false; }
      }
      if (st.t === 0) stopped = false;
      st.cA = 25 + 5 * st.t; st.cB = 75 - 5 * st.t;
      st.note = st.t > 4.9 && st.t < 5.1 ? "完全重疊（教學定格）" : "";
      drawRope(g, st);
    });
  };

  /* ================= 分鏡動畫（依 07B 動畫腳本，36 秒） ================= */
  var SHOTS = [
    { s: 0, e: 6, n: "01", cap: "在理想線性介質中，兩個相同脈衝正相向傳播。" },
    { s: 6, e: 14, n: "02", cap: "同一位置的位移相加。同向重疊時，這裡的合成位移變大。" },
    { s: 14, e: 20, n: "03", cap: "通過之後，兩個脈衝仍各自向原方向傳播。" },
    { s: 20, e: 28, n: "04", cap: "改成等大反向時，位移抵銷，完全重疊當下合成位移為零。" },
    { s: 28, e: 36, n: "05", cap: "零位移只描述這一瞬間；不代表波或能量永久消失。" }
  ];
  function storyState(T) {
    var st = { arrows: true }; var lerp = function (a, b, u) { return a + (b - a) * Math.max(0, Math.min(1, u)); };
    var c;
    if (T < 20) { st.hA = 1; st.hB = 1; if (T < 1) c = 25; else if (T < 6) c = lerp(25, 50, (T - 1) / 5); else if (T < 14) c = 50; else c = lerp(50, 75, (T - 14) / 6); }
    else { st.hA = 1; st.hB = -1; if (T < 21) c = 25; else if (T < 26) c = lerp(25, 50, (T - 21) / 5); else if (T < 28) c = 50; else c = lerp(50, 75, (T - 28) / 5); }
    st.cA = c; st.cB = 100 - c;
    if ((T >= 6 && T < 14) || (T >= 26 && T < 28)) st.note = "教學定格";
    if (T >= 20 && T < 21.5) st.note = "新案例：等大反向";
    if (T >= 33) st.note = "重疊暫時，通過後各自傳播";
    return st;
  }
  SIM.storyFrame = function (id) {
    var chips = SHOTS.map(function (s, i) { return '<button class="btn ghost" data-shot="' + i + '" style="padding:.3rem .6rem">' + s.n + '</button>'; }).join("");
    return SIM.frame({ id: id, title: "動畫：兩個脈衝相遇的兩種案例", icon: "film2", tag: "模型示意", stack: true, cap: true,
      ctl: '<div class="btns"><button class="btn" data-run>' + icon("play") + '播放</button><button class="btn ghost" data-reset>' + icon("reset") + '從頭</button><span class="num small muted" data-time>0.0 / 36 秒</span></div><div class="btns"><span class="small muted">跳到鏡頭</span>' + chips + '</div>',
      foot: "依多模態需求腳本製作：36 秒、旁白即字幕、無配樂。停格處為教學定格，不代表波停止。" });
  };
  SIM.story = function (root, id) {
    var el = root.querySelector("#" + id); var cv = el.querySelector("canvas"); var g = stage(cv, W1, H1);
    var cap = el.querySelector(".cap"); var T = 0, run = false; var btn = el.querySelector("[data-run]"), tm = el.querySelector("[data-time]");
    btn.onclick = function () { if (T >= 36) T = 0; run = !run; btn.innerHTML = run ? icon("pause") + "暫停" : icon("play") + "播放"; };
    el.querySelector("[data-reset]").onclick = function () { T = 0; run = true; btn.innerHTML = icon("pause") + "暫停"; };
    el.querySelectorAll("[data-shot]").forEach(function (b) { b.onclick = function () { T = SHOTS[+b.getAttribute("data-shot")].s; }; });
    loop(function (dt) {
      if (run) { T += dt; if (T >= 36) { T = 36; run = false; btn.innerHTML = icon("play") + "重播"; } }
      var st = storyState(T); drawRope(g, st);
      var sh = SHOTS.filter(function (s) { return T >= s.s && T < s.e; })[0] || SHOTS[4];
      cap.hidden = false; cap.textContent = "鏡頭 " + sh.n + "｜" + sh.cap;
      if (T >= 6 && T < 14) { g.fillStyle = "#ffd166"; g.font = "bold 15px IBM Plex Mono, monospace"; var tx = T < 8 ? "P：+1" : T < 10 ? "P：+1 + 1" : "P：+1 + 1 = +2"; g.fillText(tx, px(50) + 14, 315 - 2 * 26 - 8); }
      if (T >= 26 && T < 28) { g.fillStyle = "#ffd166"; g.font = "bold 15px IBM Plex Mono, monospace"; g.fillText("P：+1 − 1 = 0", px(50) + 14, 300); }
      tm.textContent = T.toFixed(1) + " / 36 秒";
      el.querySelectorAll("[data-shot]").forEach(function (b, i) { b.style.borderColor = SHOTS[i] === sh ? "var(--accent)" : ""; });
    });
  };

  /* ================= 水波干涉（SIM-02） ================= */
  SIM.rippleFrame = function (id) {
    var ctl = '<div class="tabs" data-mode><button class="on" data-m="inst">瞬時畫面</button><button data-m="amp">一段時間的振幅</button></div>' +
      rng(id + "-d", "波源距離", 2, 6, .5, 3, " λ") + rng(id + "-l", "波長", 14, 30, 1, 20, "") +
      '<div class="btns"><button class="btn ghost" data-run>' + icon("pause") + '暫停</button></div>' +
      '<div class="ctl"><label>放置觀察點</label><div class="tabs" data-probe><button class="on" data-p="A">A 點</button><button data-p="B">B 點</button></div></div><div class="readout" data-ro>點水面放置 A、B 觀察點</div>';
    return SIM.frame({ id: id, title: "水波干涉：兩個同相點波源", icon: "drop", tag: "模型", ctl: ctl,
      stageHtml: '<canvas data-main></canvas><canvas data-trace style="border-top:1px solid rgba(255,255,255,.1)"></canvas>',
      foot: "上：水面俯視（模型，非真實水槽）。下：A、B 兩點一段時間的上下起伏。判斷腹線、節線要看「一段時間」，不要只看單張畫面的顏色。" });
  };
  SIM.ripple = function (root, id, onProbe) {
    var el = root.querySelector("#" + id); var cv = el.querySelector("[data-main]"), tc = el.querySelector("[data-trace]");
    var W = 720, H = 430, gw = 240, gh = 144; var g = stage(cv, W, H), gt = stage(tc, W, 120);
    var off = document.createElement("canvas"); off.width = gw; off.height = gh; var og = off.getContext("2d"); var img = og.createImageData(gw, gh);
    var st = { d: 3, lam: 20, t: 0, run: true, mode: "inst", probe: "A", A: null, B: null, hist: { A: [], B: [] } };
    var r1, r2;
    function geom() {
      r1 = new Float32Array(gw * gh); r2 = new Float32Array(gw * gh);
      var sep = st.d * st.lam, x1 = gw / 2 - sep / 2 * gw / 240, x2 = gw / 2 + sep / 2 * gw / 240, y0 = 14;
      st.s1 = [x1, y0]; st.s2 = [x2, y0];
      for (var y = 0; y < gh; y++) for (var x = 0; x < gw; x++) { var i = y * gw + x; r1[i] = Math.hypot(x - x1, y - y0); r2[i] = Math.hypot(x - x2, y - y0); }
    }
    function field(i, t) { var k = 2 * Math.PI / st.lam; var a1 = 1 / (1 + r1[i] / 120), a2 = 1 / (1 + r2[i] / 120); return { y: a1 * Math.sin(k * r1[i] - t) + a2 * Math.sin(k * r2[i] - t), amp: Math.hypot(a1 + a2 * Math.cos(k * (r2[i] - r1[i])), a2 * Math.sin(k * (r2[i] - r1[i]))) }; }
    function ampAt(p) { var i = Math.round(p.y / H * (gh - 1)) * gw + Math.round(p.x / W * (gw - 1)); var f = field(i, 0); var k = 2 * Math.PI / st.lam; var rel = Math.abs(Math.cos(k * (r2[i] - r1[i]) / 2)); return { i: i, amp: f.amp, rel: rel }; }
    var sd = el.querySelector("#" + id + "-d"), sl = el.querySelector("#" + id + "-l"), ro = el.querySelector("[data-ro]");
    sd.oninput = function () { st.d = +sd.value; el.querySelector('[data-out="' + id + '-d"]').textContent = st.d + " λ"; geom(); clearHist(); };
    sl.oninput = function () { st.lam = +sl.value; el.querySelector('[data-out="' + id + '-l"]').textContent = st.lam; geom(); clearHist(); };
    function clearHist() { st.hist = { A: [], B: [] }; }
    el.querySelector("[data-run]").onclick = function () { st.run = !st.run; this.innerHTML = st.run ? icon("pause") + "暫停" : icon("play") + "播放"; };
    el.querySelectorAll("[data-mode] button").forEach(function (b) { b.onclick = function () { st.mode = b.getAttribute("data-m"); el.querySelectorAll("[data-mode] button").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    el.querySelectorAll("[data-probe] button").forEach(function (b) { b.onclick = function () { st.probe = b.getAttribute("data-p"); el.querySelectorAll("[data-probe] button").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    cv.addEventListener("pointerdown", function (e) {
      var p = pos(cv, e, W, H); st[st.probe] = p; st.hist[st.probe] = [];
      st.probe = st.probe === "A" ? "B" : "A"; el.querySelectorAll("[data-probe] button").forEach(function (x) { x.classList.toggle("on", x.getAttribute("data-p") === st.probe); });
      if (onProbe) onProbe(desc());
    });
    function kind(rel) { return rel > .85 ? "接近腹線（振幅大）" : rel < .2 ? "接近節線（幾乎不動）" : "介於腹線與節線之間"; }
    function desc() { var o = {}; ["A", "B"].forEach(function (k) { if (st[k]) { var a = ampAt(st[k]); o[k] = { rel: a.rel, kind: kind(a.rel) }; } }); return o; }
    SIM["ripple_" + id] = desc;
    geom();
    loop(function (dt) {
      if (st.run) st.t += dt * 4;
      var d = img.data;
      for (var i = 0; i < gw * gh; i++) {
        var f = field(i, st.t), r, gg, b;
        if (st.mode === "inst") { var v = f.y / 2; r = 20 + 90 * Math.max(0, v); gg = 60 + 120 * (v + 1) / 2; b = 110 + 145 * (v + 1) / 2; }
        else { var a = Math.min(1, f.amp / 1.6); r = 15 + 240 * a; gg = 20 + 120 * a * a; b = 40 + 40 * a; }
        d[i * 4] = r; d[i * 4 + 1] = gg; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
      }
      og.putImageData(img, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(off, 0, 0, W, H);
      [st.s1, st.s2].forEach(function (s) { g.fillStyle = "#fff"; g.beginPath(); g.arc(s[0] / gw * W, s[1] / gh * H, 6, 0, 7); g.fill(); });
      g.font = "bold 14px Noto Sans TC, sans-serif";
      ["A", "B"].forEach(function (k, n) {
        var p = st[k]; if (!p) return; var c = n ? COL.a : COL.red;
        g.strokeStyle = "#fff"; g.lineWidth = 3; g.fillStyle = c; g.beginPath(); g.arc(p.x, p.y, 9, 0, 7); g.fill(); g.stroke();
        g.fillStyle = "#fff"; g.fillText(k, p.x + 12, p.y + 5);
        var a = ampAt(p); st.hist[k].push(field(a.i, st.t).y); if (st.hist[k].length > 360) st.hist[k].shift();
      });
      // trace
      gt.clearRect(0, 0, W, 120); gt.strokeStyle = COL.grid; gt.beginPath(); gt.moveTo(0, 60); gt.lineTo(W, 60); gt.stroke();
      gt.font = "12px Noto Sans TC, sans-serif"; gt.fillStyle = COL.dim; gt.fillText("位移–時間紀錄", 10, 16);
      ["A", "B"].forEach(function (k, n) {
        var h = st.hist[k]; if (!h.length) return; gt.strokeStyle = n ? COL.a : COL.red; gt.lineWidth = 2; gt.beginPath();
        h.forEach(function (v, j) { var x = W - (h.length - j) * 2; var y = 60 - v * 24; if (j === 0) gt.moveTo(x, y); else gt.lineTo(x, y); }); gt.stroke();
        gt.fillStyle = n ? COL.a : COL.red; gt.fillText(k, W - 16, 16 + n * 16);
      });
      if (st.A || st.B) { var ds = desc(); ro.innerHTML = (ds.A ? "A：" + ds.A.kind + "<br>" : "") + (ds.B ? "B：" + ds.B.kind : ""); }
    });
  };

  /* ================= 雙狹縫（SIM-03／M02）：次波模型、B 亮 D 暗 ================= */
  SIM.dslitFrame = function (id) {
    var ctl = '<div class="tabs" data-view><button class="on" data-v="model">模型</button><button data-v="photo">實拍</button></div>' +
      rng(id + "-w", "波長", 420, 680, 10, 633, " nm") + rng(id + "-s", "縫距", 50, 130, 5, 80, "") +
      '<div class="ctl"><label>比較位置</label><div class="tabs" data-pt><button data-p="B">B 亮紋</button><button data-p="D">D 暗紋</button></div></div>' +
      '<div class="readout" data-ro>點屏幕上任一點，或選 B／D</div>';
    return SIM.frame({ id: id, title: "雙狹縫：兩個相干次波源", icon: "slit", tag: "模型", ctl: ctl,
      stageHtml: '<canvas></canvas><img data-photo src="assets/photos/P2-04.jpg" alt="632.8 nm 紅光雙狹縫干涉實拍：屏幕上多條明暗相間的條紋" hidden style="width:100%;display:block">',
      foot: '模型：弧線為波前示意，<b>不是</b>看得到的光路；屏幕亮度為時間平均光強。實拍：Bryan Tong Minh｜Public Domain（素材 P2-04）。' });
  };
  SIM.dslit = function (root, id) {
    var el = root.querySelector("#" + id); var cv = el.querySelector("canvas"); var W = 900, H = 560; var g = stage(cv, W, H);
    var photo = el.querySelector("[data-photo]");
    var st = { nm: 633, d: 80, t: 0, P: null }; var bx = 200, sx = 740, cy = 205;
    var sw = el.querySelector("#" + id + "-w"), ss = el.querySelector("#" + id + "-s"), ro = el.querySelector("[data-ro]");
    function lam() { return 14 + (st.nm - 420) / 260 * 12; }
    function I(y) { var a = Math.hypot(sx - bx, y - (cy - st.d / 2)), b = Math.hypot(sx - bx, y - (cy + st.d / 2)); var dl = (b - a) / lam(); return { I: Math.pow(Math.cos(Math.PI * dl), 2), dl: dl }; }
    function findD() { for (var y = cy; y < cy + 200; y += .25) { if (Math.abs(I(y).dl) >= .5) return y; } return cy + 60; }
    sw.oninput = function () { st.nm = +sw.value; el.querySelector('[data-out="' + id + '-w"]').textContent = st.nm + " nm"; if (st.which === "D") st.P = findD(); };
    ss.oninput = function () { st.d = +ss.value; el.querySelector('[data-out="' + id + '-s"]').textContent = st.d; if (st.which === "D") st.P = findD(); };
    el.querySelectorAll("[data-view] button").forEach(function (b) { b.onclick = function () { var ph = b.getAttribute("data-v") === "photo"; photo.hidden = !ph; cv.hidden = ph; el.querySelectorAll("[data-view] button").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    el.querySelectorAll("[data-pt] button").forEach(function (b) { b.onclick = function () { st.which = b.getAttribute("data-p"); st.P = st.which === "B" ? cy : findD(); el.querySelectorAll("[data-pt] button").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    cv.addEventListener("pointerdown", function (e) { var p = pos(cv, e, W, H); if (p.x > sx - 60 && p.y < 410) { st.P = Math.max(20, Math.min(400, p.y)); st.which = null; el.querySelectorAll("[data-pt] button").forEach(function (x) { x.classList.remove("on"); }); } });
    loop(function (dt) {
      st.t += dt; var L = lam(), col = nmRGB(st.nm); var s1 = cy - st.d / 2, s2 = cy + st.d / 2;
      g.fillStyle = "#0f1420"; g.fillRect(0, 0, W, H);
      // 入射平面波
      var ph = (((st.t * 30) % L) + L) % L;
      g.strokeStyle = rgba(col, .35); g.lineWidth = 2;
      for (var x = 20 + ph; x < bx; x += L) { g.beginPath(); g.moveTo(x, 20); g.lineTo(x, 400); g.stroke(); }
      // 次波波前
      g.save(); g.beginPath(); g.rect(bx, 0, sx - bx, 410); g.clip();
      [s1, s2].forEach(function (sy) { for (var r = ph; r < 620; r += L) { g.strokeStyle = rgba(col, .28 * (1 - r / 650)); g.beginPath(); g.arc(bx, sy, r, -Math.PI / 2, Math.PI / 2); g.stroke(); } });
      g.restore();
      // 擋板
      g.fillStyle = "#c6cedd"; g.fillRect(bx - 5, 15, 10, s1 - 4 - 15); g.fillRect(bx - 5, s1 + 4, 10, s2 - s1 - 8); g.fillRect(bx - 5, s2 + 4, 10, 400 - s2 - 4);
      g.fillStyle = COL.txt; g.font = "13px Noto Sans TC, sans-serif"; g.fillText("S₁", bx - 30, s1 + 5); g.fillText("S₂", bx - 30, s2 + 5); g.fillText("雙狹縫", bx - 22, 432 - 20); g.fillText("屏幕", sx - 8, 432 - 20);
      // 屏幕亮度與強度曲線
      for (var y = 15; y < 400; y++) { var v = I(y).I; g.fillStyle = rgba(col, .15 + .85 * v); g.fillRect(sx - 4, y, 10, 1); }
      g.strokeStyle = rgba(col, .9); g.lineWidth = 2; g.beginPath();
      for (y = 15; y < 400; y++) { var xx = sx + 14 + I(y).I * 120; if (y === 15) g.moveTo(xx, y); else g.lineTo(xx, y); } g.stroke();
      g.fillStyle = COL.dim; g.fillText("光強（時間平均）", sx + 14, 412 - 2);
      // 觀察點
      if (st.P != null) {
        var r = I(st.P); var lab = st.which || "P";
        g.setLineDash([6, 5]); g.lineWidth = 1.6;
        g.strokeStyle = COL.a; g.beginPath(); g.moveTo(bx, s1); g.lineTo(sx, st.P); g.stroke();
        g.strokeStyle = COL.b; g.beginPath(); g.moveTo(bx, s2); g.lineTo(sx, st.P); g.stroke(); g.setLineDash([]);
        g.fillStyle = "#fff"; g.beginPath(); g.arc(sx, st.P, 7, 0, 7); g.fill();
        g.font = "bold 16px Noto Sans TC, sans-serif"; g.fillText(lab, sx - 30, st.P - 10);
        // 下方：到達的兩列波
        var y0 = 470, A = 22, ph0 = st.t * 4;
        g.fillStyle = "#151c2b"; g.fillRect(0, 430, W, 130);
        g.fillStyle = COL.txt; g.font = "13px Noto Sans TC, sans-serif"; g.fillText("到達 " + lab + " 的兩列光波（示意）", 20, 450);
        function sine(yb, phs, amp, c, w) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); for (var x = 0; x <= 360; x += 2) { var yy = yb - amp * Math.sin(x / 360 * 4 * Math.PI - ph0 + phs); if (!x) g.moveTo(40 + x, yy); else g.lineTo(40 + x, yy); } g.stroke(); }
        var dphi = 2 * Math.PI * r.dl;
        sine(y0 + 8, 0, A * .6, COL.a, 2); sine(y0 + 8, dphi, A * .6, COL.b, 2);
        g.fillStyle = COL.a; g.fillText("來自 S₁", 410, y0); g.fillStyle = COL.b; g.fillText("來自 S₂", 410, y0 + 18);
        g.strokeStyle = "#fff"; g.lineWidth = 3; g.beginPath();
        for (var k = 0; k <= 360; k += 2) { var s = Math.sin(k / 360 * 4 * Math.PI - ph0) + Math.sin(k / 360 * 4 * Math.PI - ph0 + dphi); var yy = 520 - A * .6 * s; if (!k) g.moveTo(520 + k, yy); else g.lineTo(520 + k, yy); } g.stroke();
        g.fillStyle = "#fff"; g.fillText("疊加結果", 520, 450);
        var frac = Math.abs(r.dl) % 1; var phase = frac < .12 || frac > .88 ? "同相" : Math.abs(frac - .5) < .12 ? "反相" : "介於同相與反相";
        ro.innerHTML = "位置 " + lab + "<br>路程差 ≈ <b>" + Math.abs(r.dl).toFixed(2) + " λ</b><br>到達時：<b>" + phase + "</b><br>光強：<b>" + (r.I > .8 ? "較強（亮紋）" : r.I < .1 ? "理想下≈0（暗紋）" : "中等") + "</b>";
      }
    });
  };

  /* ================= 單狹縫 vs 雙狹縫圖樣 ================= */
  SIM.patternFrame = function (id) {
    var ctl = '<div class="tabs" data-m><button class="on" data-v="s">單狹縫</button><button data-v="d">雙狹縫</button><button data-v="b">並排比較</button></div>' + rng(id + "-a", "單縫寬度", 2, 8, .5, 4, " λ") + '<div class="readout" data-ro></div>';
    return SIM.frame({ id: id, title: "次波源分布與屏幕圖樣", icon: "single", tag: "模型", ctl: ctl, foot: "遠場、均勻單色照明的理想模型。點點＝次波源：雙狹縫是兩個分立的次波源；單狹縫是縫內連續分布的許多次波源。" });
  };
  SIM.pattern = function (root, id) {
    var el = root.querySelector("#" + id); var cv = el.querySelector("canvas"); var W = 900, H = 430; var g = stage(cv, W, H);
    var st = { m: "s", a: 4 }; var col = nmRGB(633); var ro = el.querySelector("[data-ro]");
    var sa = el.querySelector("#" + id + "-a");
    sa.oninput = function () { st.a = +sa.value; el.querySelector('[data-out="' + id + '-a"]').textContent = st.a + " λ"; };
    el.querySelectorAll("[data-m] button").forEach(function (b) { b.onclick = function () { st.m = b.getAttribute("data-v"); el.querySelectorAll("[data-m] button").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    function sinc(x) { return Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x; }
    function Is(th) { return Math.pow(sinc(Math.PI * st.a * Math.sin(th)), 2); }
    function Id(th) { return Math.pow(Math.cos(Math.PI * 6 * Math.sin(th)), 2) * Math.pow(sinc(Math.PI * 1 * Math.sin(th)), 2); }
    function row(y0, f, label, src) {
      g.fillStyle = COL.txt; g.font = "bold 14px Noto Sans TC, sans-serif"; g.fillText(label, 20, y0 - 58);
      // 狹縫與次波源
      var cx = 90; g.fillStyle = "#c6cedd"; g.fillRect(cx - 3, y0 - 60, 6, 120);
      g.fillStyle = "#0f1420";
      src.forEach(function (s) { g.fillRect(cx - 4, y0 + s[0], 8, s[1]); });
      g.fillStyle = "#ffd166"; src.forEach(function (s) { var n = s[2]; for (var k = 0; k < n; k++) { var yy = y0 + s[0] + (n === 1 ? s[1] / 2 : k * s[1] / (n - 1)); g.beginPath(); g.arc(cx, yy, 3, 0, 7); g.fill(); } });
      // 屏幕條紋（水平）
      for (var x = 180; x < 880; x++) { var th = (x - 530) / 350 * .35; var v = f(th); g.fillStyle = rgba(col, .08 + .92 * Math.pow(v, .8)); g.fillRect(x, y0 - 44, 1, 26); }
      g.strokeStyle = rgba(col, 1); g.lineWidth = 2; g.beginPath();
      for (x = 180; x < 880; x++) { var t2 = (x - 530) / 350 * .35; var yy2 = y0 + 50 - f(t2) * 60; if (x === 180) g.moveTo(x, yy2); else g.lineTo(x, yy2); } g.stroke();
      g.fillStyle = COL.dim; g.font = "12px Noto Sans TC, sans-serif"; g.fillText("屏幕", 180, y0 - 50); g.fillText("光強", 850, y0 + 2);
    }
    loop(function () {
      g.fillStyle = "#0f1420"; g.fillRect(0, 0, W, H);
      var single = function (th) { return Is(th); };
      var sSrc = [[-st.a * 3, st.a * 6, 9]], dSrc = [[-22, 6, 1], [16, 6, 1]];
      if (st.m === "s") row(230, single, "單狹縫繞射", sSrc);
      else if (st.m === "d") row(230, Id, "雙狹縫干涉", dSrc);
      else { row(120, single, "單狹縫繞射", sSrc); row(330, Id, "雙狹縫干涉", dSrc); }
      ro.innerHTML = st.m === "d" ? "兩個分立次波源<br>中央附近：明暗交替、間距近似相等" : "縫內連續分布的次波源<br>中央亮紋：<b>較寬、較亮</b><br>旁側亮紋：較窄、向外漸弱" + (st.m === "s" ? "<br>縫越窄 → 展開越寬" : "");
    });
  };

  /* ================= 薄膜干涉（SIM-04） ================= */
  SIM.filmFrame = function (id) {
    var ctl = rng(id + "-t", "膜厚", 60, 900, 10, 300, " nm") + rng(id + "-w", "觀察的色光", 400, 700, 10, 550, " nm") + '<div class="readout" data-ro></div>';
    return SIM.frame({ id: id, title: "薄膜的兩路反射光", icon: "film", tag: "模型", ctl: ctl, foot: "剖面為機制模型（光線角度、比例皆示意）。顏色帶為白光照射時，不同膜厚的反射色（肥皂膜 n≈1.33 的理想計算，屬延伸）。" });
  };
  SIM.film = function (root, id) {
    var el = root.querySelector("#" + id); var cv = el.querySelector("canvas"); var W = 900, H = 470; var g = stage(cv, W, H);
    var st = { d: 300, nm: 550, t: 0 }; var n = 1.33; var ro = el.querySelector("[data-ro]");
    var st1 = el.querySelector("#" + id + "-t"), st2 = el.querySelector("#" + id + "-w");
    st1.oninput = function () { st.d = +st1.value; el.querySelector('[data-out="' + id + '-t"]').textContent = st.d + " nm"; };
    st2.oninput = function () { st.nm = +st2.value; el.querySelector('[data-out="' + id + '-w"]').textContent = st.nm + " nm"; };
    function R(d, nm) { return Math.pow(Math.sin(2 * Math.PI * n * d / nm), 2); } // 含上表面反射相位改變
    var strip = null;
    function buildStrip() {
      strip = [];
      for (var k = 0; k <= 400; k++) {
        var d = 60 + k / 400 * 840, r = 0, gg = 0, b = 0;
        for (var nm = 400; nm <= 700; nm += 10) { var c = nmRGB(nm), w = R(d, nm); r += c[0] * w; gg += c[1] * w; b += c[2] * w; }
        strip.push([r / 14, gg / 14, b / 14].map(function (x) { return Math.min(255, Math.round(x)); }));
      }
    }
    buildStrip();
    loop(function (dt) {
      st.t += dt; var col = nmRGB(st.nm);
      g.fillStyle = "#0f1420"; g.fillRect(0, 0, W, H);
      // 剖面
      var top = 170, th = 40 + st.d / 900 * 90;
      g.fillStyle = "rgba(120,170,255,.18)"; g.fillRect(30, top, 420, th);
      g.strokeStyle = "rgba(160,200,255,.6)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(30, top); g.lineTo(450, top); g.moveTo(30, top + th); g.lineTo(450, top + th); g.stroke();
      g.fillStyle = COL.txt; g.font = "13px Noto Sans TC, sans-serif"; g.fillText("空氣", 40, top - 12); g.fillText("薄膜（肥皂水）", 40, top + th / 2 + 5); g.fillText("空氣", 40, top + th + 22);
      var ax = 120, ay = 30, hx = 200; // 入射
      var tx = hx + (top + th - top) * .45;
      g.lineWidth = 3; g.strokeStyle = rgba(col, .95);
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(hx, top); g.stroke(); arrow(ax, ay, hx, top);
      g.beginPath(); g.moveTo(hx, top); g.lineTo(hx + 80, ay); g.stroke(); arrow(hx, top, hx + 80, ay);
      g.strokeStyle = rgba(col, .7); g.beginPath(); g.moveTo(hx, top); g.lineTo(tx, top + th); g.lineTo(tx + (tx - hx), top); g.lineTo(tx + (tx - hx) + 80, ay); g.stroke(); arrow(tx + (tx - hx), top, tx + (tx - hx) + 80, ay);
      g.fillStyle = "#fff"; g.font = "bold 14px Noto Sans TC, sans-serif"; g.fillText("①", hx + 84, ay + 8); g.fillText("②", tx + (tx - hx) + 84, ay + 8);
      g.font = "12px Noto Sans TC, sans-serif"; g.fillStyle = COL.txt; g.fillText("① 上表面反射", 300, 60); g.fillText("② 進入薄膜、下表面反射後穿出", 300, 80); g.fillText("入射光", ax - 50, ay + 10);
      // 右：兩路波與疊加
      var dphi = 4 * Math.PI * n * st.d / st.nm + Math.PI, ph = st.t * 3;
      function sine(yb, phs, c, w, sum) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); for (var x = 0; x <= 360; x += 2) { var a = x / 360 * 4 * Math.PI - ph; var yy = yb - 18 * (sum ? Math.sin(a) + Math.sin(a + phs) : Math.sin(a + phs)); if (!x) g.moveTo(500 + x, yy); else g.lineTo(500 + x, yy); } g.stroke(); }
      g.fillStyle = COL.txt; g.font = "13px Noto Sans TC, sans-serif"; g.fillText("到達眼睛的兩路反射光", 500, 40);
      sine(80, 0, COL.a, 2); sine(80, dphi, COL.b, 2); g.fillStyle = COL.a; g.fillText("①", 870, 70); g.fillStyle = COL.b; g.fillText("②", 870, 92);
      sine(180, dphi, "#fff", 3, true); g.fillStyle = "#fff"; g.fillText("疊加", 870, 184);
      var r = R(st.d, st.nm);
      g.font = "bold 18px Noto Sans TC, sans-serif"; g.fillStyle = r > .7 ? "#7dffa8" : r < .25 ? "#ff8a8a" : "#ffd166";
      g.fillText(r > .7 ? "此色光增強" : r < .25 ? "此色光減弱" : "部分增強", 500, 250);
      // 顏色帶
      var y0 = 330; g.fillStyle = COL.txt; g.font = "13px Noto Sans TC, sans-serif"; g.fillText("白光照射時的反射色（膜厚 60 → 900 nm）", 30, y0 - 12);
      for (var k = 0; k <= 400; k++) { var c = strip[k]; g.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; g.fillRect(30 + k * 2.1, y0, 2.2, 46); }
      var mx = 30 + (st.d - 60) / 840 * 840; g.strokeStyle = "#fff"; g.lineWidth = 2; g.strokeRect(mx - 3, y0 - 4, 6, 54);
      g.fillStyle = COL.dim; g.fillText("薄", 30, y0 + 66); g.fillText("厚", 860, y0 + 66);
      ro.innerHTML = "膜厚 <b>" + st.d + " nm</b><br>" + st.nm + " nm 色光：<b>" + (r > .7 ? "增強" : r < .25 ? "減弱" : "部分增強") + "</b><br><span style='font-family:inherit'>兩路光的相位差隨膜厚改變，不同顏色在不同厚度增強</span>";
    });
    function arrow(x1, y1, x2, y2) { var a = Math.atan2(y2 - y1, x2 - x1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2; g.beginPath(); g.moveTo(mx + 7 * Math.cos(a), my + 7 * Math.sin(a)); g.lineTo(mx - 6 * Math.cos(a - .5), my - 6 * Math.sin(a - .5)); g.moveTo(mx + 7 * Math.cos(a), my + 7 * Math.sin(a)); g.lineTo(mx - 6 * Math.cos(a + .5), my - 6 * Math.sin(a + .5)); g.stroke(); }
  };

  /* ================= 封面：兩波源干涉 ================= */
  SIM.cover = function (cv) {
    var gw = 200, gh = 110; var off = document.createElement("canvas"); off.width = gw; off.height = gh; var og = off.getContext("2d"); var img = og.createImageData(gw, gh);
    var g = cv.getContext("2d"); var t = 0;
    function size() { var r = cv.getBoundingClientRect(); cv.width = r.width; cv.height = r.height; }
    size(); window.addEventListener("resize", size);
    var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    loop(function (dt) {
      if (!still) t += dt * 2.5; var d = img.data, k = 2 * Math.PI / 11;
      for (var y = 0; y < gh; y++) for (var x = 0; x < gw; x++) {
        var r1 = Math.hypot(x - 150, y - 40), r2 = Math.hypot(x - 178, y - 40);
        var v = (Math.sin(k * r1 - t) + Math.sin(k * r2 - t)) / 2; var a = Math.abs(Math.cos(k * (r2 - r1) / 2));
        var i = (y * gw + x) * 4, e = Math.max(0, v) * a;
        d[i] = 15 + 200 * e; d[i + 1] = 20 + 40 * e; d[i + 2] = 32 + 50 * e; d[i + 3] = 255;
      }
      og.putImageData(img, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(off, 0, 0, cv.width, cv.height);
    });
  };
})();
