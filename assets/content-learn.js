/* 學生章節：開始 → 第1–3節 → 總結與延伸 → 索引 */
(function () {
  var B = window.BOOK, h = H;
  function tq(body) { return h.teach("教師提示", body); }
  function L(q, link, lt) { return { q: q, link: link, lt: lt }; }
  function D(re, q, link, lt, not) { return { re: re, q: q, link: link, lt: lt, not: !!not }; }
  var NO_LIGHT = /沒有光|沒光|沒到|到不了|擋住|擋到/;

  /* 器材空間位置示意（重製 P2-08／P3-01；wave=true 時加波前模型） */
  function setupSvg(n, wave) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 170" style="width:100%;display:block;background:#fff;border-radius:8px"><g font-family="sans-serif" font-size="13" fill="#3e4c59">';
    s += '<rect x="20" y="70" width="70" height="30" rx="5" fill="#c92a4a"/><text x="22" y="122">雷射光源</text><rect x="230" y="20" width="10" height="130" fill="#3e4c59"/>';
    if (n === 2) s += '<rect x="230" y="72" width="10" height="7" fill="#fff"/><rect x="230" y="91" width="10" height="7" fill="#fff"/><text x="205" y="166">雙狹縫</text>';
    else s += '<rect x="230" y="78" width="10" height="14" fill="#fff"/><text x="210" y="166">單狹縫</text>';
    if (wave) for (var r = 20; r < 300; r += 24) { [n === 2 ? 75 : 85].concat(n === 2 ? [94] : []).forEach(function (y) { s += '<path d="M240 ' + y + ' m0 ' + (-r) + ' a' + r + ' ' + r + ' 0 0 1 0 ' + (2 * r) + '" fill="none" stroke="#3b5bdb" opacity=".45"/>'; }); }
    s += '<rect x="500" y="10" width="14" height="150" fill="#cfd5dd"/><text x="490" y="166">屏幕</text><path d="M100 40h120M250 40h240" stroke="#9aa3ad" stroke-dasharray="4 4"/><text x="130" y="34">光凳</text>';
    return s + '</g></svg>';
  }
  var rippleSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 110" style="background:#fff"><g fill="none" stroke-width="2"><g stroke="#3b5bdb" opacity=".7"><circle cx="55" cy="20" r="14"/><circle cx="55" cy="20" r="30"/><circle cx="55" cy="20" r="46"/><circle cx="55" cy="20" r="62"/></g><g stroke="#c92a4a" opacity=".7"><circle cx="95" cy="20" r="14"/><circle cx="95" cy="20" r="30"/><circle cx="95" cy="20" r="46"/><circle cx="95" cy="20" r="62"/></g></g></svg>';
  var svgURI = function (s) { return "data:image/svg+xml;utf8," + encodeURIComponent(s); };

  /* 01 核心教材文本原文（完整課文） */
  var FULL = {
    n1: ["01　波的疊加與水波干涉", "在理想線性介質中，合位移等於各波位移之和；固定位置的振幅取決於兩列波的振動關係。",
      ["兩列繩波脈衝相遇時，會暫時在同一段繩上重疊。在理想線性介質中，該處的合位移等於兩列波各自造成的位移相加。相遇結束後，兩列脈衝仍各自沿原方向傳播。", "對同一位置的兩列同頻率週期波而言，若振動步調相同，合振幅最大，稱為完全建設性干涉；若振幅相等且振動步調恰好相反，合振幅為零，稱為完全破壞性干涉。", "位移是某一時刻偏離平衡位置的程度；振幅則是週期振動中偏離平衡位置的最大程度。某一刻位移為零，不能據此認定振幅為零。", "兩個位置固定、振動關係固定的水波源，可形成位置穩定的干涉分布。完全相消還要求兩列波到達該處時振幅相等。局部振幅為零，不代表兩列波永久消失。"],
      "疊加採理想線性近似。穩定干涉須有固定的波源相位關係；完全相消須在觀察處等振幅、反相。應寫「位移相消」，避免把它說成總能量消失。", "線性疊加、波通過彼此、完全相消的條件", "OpenStax University Physics Vol. 1 §16.5", "https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves"],
    n2: ["02　雙狹縫干涉", "兩列相干光波到達屏幕各處時的相位差不同，形成穩定的明暗條紋。",
      ["單色光照射兩條相近的窄縫後，屏幕可出現交替排列的明暗條紋。這些條紋是光在不同位置的強度分布，不能當成兩條狹縫的放大影像。", "依惠更斯原理，波面上各點可視為發出次波的波源；在窄縫近似下，兩條狹縫可視為兩個次波源。同一穩定單色光適當照明兩縫時，兩者頻率相同，並保持固定的相位關係，稱為相干波源。相位描述週期振動進行到哪個階段。", "兩列光波到達某處時，若相位相同便互相增強；若相位相反便互相減弱。兩列光波在該處振幅相等且反相時，可完全相消。眼睛無法追蹤光的快速振動，看到的是時間平均的光強度，因此形成亮紋與暗紋。", "暗紋不表示兩列光波都未到達。光波疊加可以解釋這種規律分布，提供光具有波動性的證據。"],
      "此處採同偏振方向、相干單色光的理想模型。完全暗紋還需等振幅；實驗暗紋可能仍有背景光。兩縫都會產生繞射，不能說雙狹縫只有干涉。", "相干條件、次波源近似與明暗紋的形成", "OpenStax University Physics Vol. 3 §3.1", "https://openstax.org/books/university-physics-volume-3/pages/3-1-youngs-double-slit-interference"],
    n3: ["03　單狹縫繞射", "光通過窄縫後，縫內不同位置的次波在各方向增強或減弱，形成繞射的明暗分布。",
      ["單色光通過窄單狹縫後，會向側方展開。在遠場條件下，屏幕中央出現較寬、較亮的中央亮紋，兩側則有較窄、逐漸變弱的旁側亮紋，亮紋之間由暗紋隔開。此處的遠場指屏幕足夠遠，使縫內各處到同一觀察點的傳播方向可近似平行。", "以均勻、同相照明的狹縫為例，縫內不同位置可視為許多次波源。正前方的次波大致同相到達，彼此增強；偏離正前方後，各次波的路徑長度不同，某些方向完全相消，另一些方向仍有部分增強。", "在相同波長與遠場觀察條件下，於本教材的狹縫尺度內縮小縫寬，會使繞射展開角度增加，中央亮紋變寬。這不是狹縫影像的單純放大。", "雙狹縫以兩縫之間的光波疊加說明條紋；單狹縫則考慮同一縫內不同位置的次波疊加。兩者都運用波的疊加概念。"],
      "中央寬亮紋與旁側亮紋的敘述採遠場、均勻單色照明條件。「縫越窄，展開越明顯」須固定波長並限於本教材尺度，不能外推到所有縫寬與近場情況。", "遠場假設、次波疊加、中央亮紋與縫寬關係", "OpenStax University Physics Vol. 3 §4.1", "https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction"],
    n4: ["04　薄膜干涉與單元統整", "透明薄膜兩表面的反射光可發生干涉；薄膜色彩與狹縫明暗分布均可用光的波動模型解釋。",
      ["白光照到肥皂膜或水面油膜時，部分光在上表面反射，另一部分進入薄膜，在下表面反射後再離開。兩部分光朝同一觀察方向傳播時，可以互相干涉。", "干涉結果與膜厚、折射率、觀察角度及光的波長有關，也受到反射時振動相位改變的影響。相位描述振動進行到哪個階段；折射率則反映光在介質中的傳播速度。膜厚隨位置變化時，白光中的不同波長可能在不同位置增強或減弱，因而呈現彩色分布。", "牛頓環與薄空氣膜的干涉有關；抗反射鍍膜利用干涉，在設計的波長與角度範圍內降低反射。這些例子都能連回光波疊加的概念。", "回顧雙狹縫與單狹縫，雖然參與疊加的次波源分布不同，兩者都形成有規律的明暗分布。這些現象可由波動模型解釋，因此支持光具有波動性。"],
      "以透明薄膜的反射光作定性說明；不能只比較幾何路徑而忽略反射相位。「抗反射」有波長與角度範圍，不表示所有光都不反射。波動性證據也不等於否定光的粒子性。", "兩表面反射、反射相位及膜厚對干涉的影響", "OpenStax University Physics Vol. 3 §3.4", "https://openstax.org/books/university-physics-volume-3/pages/3-4-interference-in-thin-films"]
  };
  function full(k) {
    var f = FULL[k];
    return h.fold("", "完整課文・知識節點 " + f[0], '<p><b>核心理解</b>　' + f[1] + '</p>' + f[2].map(function (p) { return '<p>' + p + '</p>'; }).join("") + '<p class="small"><b>成立條件與易混淆處</b>　' + f[3] + '</p><p class="small muted">查核重點：' + f[4] + '。依據：<a href="' + f[6] + '" target="_blank" rel="noopener">' + f[5] + '</a>（2026-09-04 查核）</p>' +
      '<p class="small t-only">精確性檢核：■ 名詞與定義一致　■ 因果或關係正確　■ 適用條件完整　■ 前後概念連貫　■ 關鍵說法有依據（節點01原欄名為「自我檢核」；可扣課綱代碼）</p>', false, "full");
  }

  /* ======================= 開始 ======================= */
  B.chapters.push({ id: "start", title: "開始", color: "start", mark: "始", pages: [
    { id: "home", title: "單元首頁", track: false, render: function () {
      function u(id, c, n, t, s) { return '<a href="#' + id + '" style="--uc:var(--c-' + c + ')"><span class="n">' + n + '</span><b>' + t + '</b><small>' + s + '</small></a>'; }
      return '<div class="wide"><div class="cover"><canvas id="cover-cv" aria-hidden="true"></canvas><div><span class="kicker">高一必修物理・3 節課</span><h1>干涉與繞射</h1><p style="margin-top:.5rem">光通過狹縫後，為什麼會出現一條條明暗紋？<br>從繩波、水波一路走到光，用證據找出答案。</p><div class="btns" style="margin-top:1.1rem"><a class="btn" href="#map">開始學習</a><a class="btn ghost" href="#pretest">先做前測</a></div></div></div></div>' +
        '<div class="col"><h2>本單元要回答的問題</h2><p class="lead">「光只沿直線前進」能解釋狹縫後的亮暗分布嗎？如果不能，<span class="hl">波的疊加</span>又如何解釋？</p>' +
        '<h2>學習路徑</h2></div><div class="wide"><div class="units">' +
        u("map", "start", "開始", "學習地圖與前測", "看全貌，測一測起點") + u("l1-1", "1", "第1節", "波的疊加與水波干涉", "波如何疊加？") + u("l2-0", "2", "第2節", "光的雙狹縫干涉", "亮暗紋如何形成？") + u("l3-0", "3", "第3節", "光的繞射與生活應用", "何以支持波動性？") + u("review", "4", "總結", "回顧、後測與延伸", "整理所學、檢查進步") + u("qindex", "5", "索引", "題目、模擬與紀錄", "快速找到任何一題") +
        '</div></div><div class="col"><h2>每一節都用同樣的四步</h2>' + h.cycle("") +
        h.table(["步驟", "怎麼做"], [["1 預測", "看結果前先作答，預測不計對錯，保留初稿。"], ["2 觀察", "記錄看到的現象，標明 <span class=\"tag ev\">實拍</span> 或 <span class=\"tag md\">模型</span>。"], ["3 解釋", "用主張—證據—推理（CER）說明，推理要連到波的疊加。"], ["4 修訂", "對照證據與追問助手修改，寫下改變想法的理由。"]]) +
        h.key("", "作答會自動保存在這台裝置", "左側目錄的小圓點變綠，表示該節完成。課末到「索引 › 我的學習紀錄」設定學生代碼並複製紀錄。") +
        '<div class="t-only">' + h.key("", "教師版已開啟", "每頁多了橘色「教師提示」，左側多了「教師專區」。投影給學生前請切回學生版。", "warn") + '</div></div>';
    }, mount: function (el) { SIM.cover(el.querySelector("#cover-cv")); } },

    { id: "map", title: "學習地圖", render: function () {
      return '<div class="col">' + h.head("開始", "學習地圖", "四個知識節點，一節接一節。") +
        h.table(["知識節點", "核心知識", "銜接依據", "在哪一節"], [
          ["01 波的疊加與水波干涉", "波的疊加可造成振幅增強或減弱；位移為零不等於振幅為零。", "先備：位移、振幅、週期。", '<a href="#l1-1">第1節</a>'],
          ["02 雙狹縫干涉", "兩列相干光波疊加，在屏幕形成穩定的明暗分布。", "承接01：將振幅增減連到光的明暗。", '<a href="#l2-0">第2節</a>'],
          ["03 單狹縫繞射", "狹縫內不同位置的次波疊加，形成中央寬亮紋與旁側弱亮紋。", "承接02：由兩個次波源推進到縫內許多次波源。", '<a href="#l3-1">第3節</a>'],
          ["04 薄膜干涉與統整", "薄膜反射光的干涉可形成色彩；干涉與繞射共同支持光的波動性。", "承接02、03：應用疊加概念並收束全章。", '<a href="#l3-2">第3節</a>']]) +
        h.fold("", "單元總覽（核心教材文本）", '<p><b>單元名稱</b>　干涉與繞射</p><p><b>適用對象</b>　高中一年級必修物理；已學過波的波長、頻率、週期與振幅等物理概念，採定性理解。</p><p><b>核心結論</b>　光的干涉與繞射形成有規律的明暗分布，可用波的疊加與惠更斯原理解釋，因此支持光具有波動性。</p><p><b>先備知識</b>　知道波會傳播；能區分位移與振幅，理解波長、頻率及週期的意義。</p><p><b>內容範圍</b>　處理波的疊加、水波干涉、雙狹縫、單狹縫與薄膜干涉；以定性解釋為主，暫不推導條紋位置及膜厚公式。</p><p class="small muted">依原教材整理為四個知識節點。檢查：各節點能否依序理解，並共同支持本單元的核心結論？</p>', false, "overview") +
        '<h2>學完你能做到</h2><ol class="clean"><li>用疊加解釋繩波與水波。</li><li>解釋雙狹縫的亮紋與暗紋。</li><li>比較干涉、繞射與薄膜反射。</li><li>引用光學證據完成論證，並說明波動模型的界限。</li></ol>' +
        h.key("", "範圍", "本單元做定性解釋，不推導條紋位置與膜厚公式。水波是類比，光學觀察才是光的證據。", "warn") +
        tq('<p>課綱：tr-Ⅴc-1 證據與因果、tm-Ⅴc-1 模型及限制、pc-Ⅴc-2 表達與討論；PKa-Ⅴc-3 光的理論、PKa-Ⅴc-5 干涉與繞射、PKa-Ⅴc-6 惠更斯原理。完整依據見 <a href="#t-guide">教學指南</a>。</p>') + '</div>';
    } },
    { id: "pretest", title: "前測", render: function () {
      return '<div class="col">' + h.head("開始・課前", "前測", "14 題，約 25–30 分鐘。看看你目前的想法，不列入成績。") +
        '<p class="small muted">第 14 題是簡答，交卷後顯示評分要點，由老師評分。答錯的題目會附上課本段落連結。</p>' + C.quiz(QUIZ.pre) +
        tq('<p>依前測雙向細目表：14 題／30 分。用於辨識碰撞、相消等迷思。見 <a href="#t-assess">評量與細目表</a>。</p>') + '</div>';
    } }
  ] });

  /* ======================= 第1節 ======================= */
  B.chapters.push({ id: "c1", title: "第1節　波的疊加", color: "1", mark: "1", pages: [
    { id: "l1-1", title: "1-1 預測：兩個脈衝相遇", render: function () {
      regExt("l1q2a", "同向案例：預測完全重疊時 P 點的高度", "Q2"); regExt("l1q2b", "反向案例：預測完全重疊時 P 點的高度", "Q2");
      return '<div class="col">' + h.head("第1節・預測", "兩個脈衝相遇", "繩上兩個脈衝正相向而行。相遇時、相遇後，會發生什麼？") + h.cycle("預測") +
        C.mcq({ id: "l1q1", n: "Q1", q: "你預測兩個脈衝相遇後會怎樣？", opts: ["像球一樣反彈回去", "重疊時合在一起，之後各自繼續往前", "互相抵消，之後消失", "黏在一起，變成一個脈衝"], ans: null, after: "接著拖曳紅點，預測重疊那一刻的高度。" }) +
        '<div class="qwrap">' + SIM.predictFrame("l1q2a", { n: "Q2", q: "同向案例：A、B 都高 +1。完全重疊那一刻，P 點的繩子多高？" }) + '</div>' +
        '<div class="qwrap">' + SIM.predictFrame("l1q2b", { n: "Q2", q: "反向案例：A 高 +1、B 高 −1。完全重疊那一刻，P 點的繩子多高？" }) + '</div>' +
        tq('<p><b>0–22 分</b>　先畫脈衝，再看重疊與通過。問：「相消後波消失嗎？」Q1 不計對錯，保留初稿。</p><p>若選「反彈」：L1「你預測會反彈，是根據什麼想法？」→ L2「追蹤同一脈衝的相遇前、重疊與通過後，方向有改變嗎？」→ L3「依 Q2 的圖，你會如何修訂？」</p><p class="small muted">原學習單為紙本作圖；此處以拖曳預測呈現（補充設計）。</p>') + '</div>';
    }, mount: function (el) {
      SIM.predict(el, "l1q2a", 1, 1, function (p) { saveAns("l1q2a", { v: { 預測: p, 實際: 2 } }); });
      SIM.predict(el, "l1q2b", 1, -1, function (p) { saveAns("l1q2b", { v: { 預測: p, 實際: 0 } }); });
    } },
    { id: "l1-2", title: "1-2 觀察：疊加原理", render: function () {
      return '<div class="col">' + h.head("第1節・觀察與解釋", "疊加原理", "先看動畫，再自己動手調整脈衝高度。") + h.cycle("觀察") +
        '</div><div class="wide">' + SIM.storyFrame("story") + '</div><div class="col">' +
        h.key("", "疊加原理", '在理想線性介質中，<span class="hl">同一位置、同一時刻</span>的合位移＝各波位移相加。相遇結束後，兩脈衝仍各自沿原方向傳播。', "", "sup") +
        '<h2>動手試試</h2><p>拖曳上方 A、B 的圓點（或用滑桿）改變高度，再按播放。試試 +1 與 −0.5、+1.5 與 −1.5。</p></div>' +
        '<div class="wide">' + SIM.ropeFrame("rope") + '</div><div class="col">' +
        '<div class="grid-2">' + h.key("", "同向", "振動步調相同 → 合振幅最大：<b>完全建設性干涉</b>。", "ok") + h.key("", "等大反向", "步調恰好相反 → 合振幅為零：<b>完全破壞性干涉</b>。", "ev") + '</div>' +
        h.fold("", "容易混淆：位移與振幅", '<p><b>位移</b>：某一刻偏離平衡位置的程度。<b>振幅</b>：週期振動中偏離平衡位置的最大程度。</p><p>某一刻位移為零，不能說振幅為零。應說「位移相消」，不要說成能量消失。</p>', true, "disp") +
        full("n1") +
        C.text({ id: "l1q3", n: "Q3", q: "用疊加解釋：兩個脈衝重疊時與通過後，各發生了什麼？", rows: 3, ph: "提示：同一位置、同一時刻……", ref: "重疊時，同一位置、同一時刻的位移相加：同向變大（+2），等大反向抵銷（0）。重疊是暫時的，通過後兩脈衝仍各自沿原方向傳播。",
          diag: [D(/反彈|彈回|撞/, "你提到「反彈」。追蹤同一個脈衝：通過後它往哪個方向走？", "l1-2--story", "分鏡動畫：鏡頭 03"), D(/位置|時刻|同時|瞬間|那一刻/, "你的解釋有寫到「同一位置、同一時刻」嗎？", "l1-2--sup", "疊加原理", true), D(/消失|不見/, "位移為零的那一刻，波真的消失了嗎？之後發生什麼？", "l1-2--disp", "位移與振幅")] }) +
        tq('<p><b>評量證據</b>　位移相加；通過後仍傳播。<b>專業說明</b>　同處、同時的位移作代數相加；適用理想線性介質。相消不等於能量消失。對應核心題目 1。動畫依多模態需求腳本製作（36 秒、五個鏡頭）。</p>') + '</div>';
    }, mount: function (el) { SIM.story(el, "story"); SIM.rope(el, "rope"); } },
    { id: "l1-3", title: "1-3 觀察：水波干涉", render: function () {
      regExt("l1q5", "選點：腹線上的 A 點與節線上的 B 點", "Q5");
      return '<div class="col">' + h.head("第1節・觀察", "兩個波源的水波", "兩個同步振動的點波源，會讓水面出現穩定的圖樣嗎？") + h.cycle("觀察") +
        C.mcq({ id: "l1q4", n: "Q4", q: "預測：A 點到兩波源一樣遠；B 點到兩波源的距離差半個波長。一段時間內，哪一點上下起伏比較大？", opts: ["A 起伏大，B 幾乎不動", "B 起伏大，A 幾乎不動", "兩點一樣", "隨時間亂變，無法預測"], ans: null, after: "用下方模擬放置 A、B 觀察點檢查。" }) +
        '</div><div class="wide">' + SIM.rippleFrame("ripple") + '</div><div class="col">' +
        '<div class="q" data-qid="l1q5"><div class="qh"><span class="qn">Q5</span><div class="qt">選點任務：在水面上放一個「一直大幅起伏」的 A 點，和一個「幾乎不動」的 B 點。<div class="qmeta">可先切到「一段時間的振幅」看清楚，再看下方起伏紀錄。</div></div></div><div class="btns"><button class="btn" data-chk5>檢查我選的點</button></div><div data-fb5></div></div>' +
        C.mcq({ id: "l1q6", n: "Q6", q: "比較你的預測與觀察：瞬時畫面中「亮」的地方，一定是腹線嗎？", opts: ["一定是", "不一定：單張畫面只顯示那一刻的位移，要看一段時間的振幅", "一定不是", "亮暗與水波無關"], ans: 1, explain: "判斷腹線、節線要看一段時間的起伏。", hint: "比較模擬的「瞬時畫面」與「一段時間的振幅」。", link: "l1-2--disp", lt: "位移與振幅" }) +
        tq('<p><b>22–42 分</b>　先預測 A、B，再看一週期。問：「亮處一定是腹線嗎？」評量證據：依一段時間的振幅判讀。</p><p><b>常見迷思</b>　波峰交點＝建設性干涉；亮色＝腹線；節線在真實水槽必定完全靜止；把腹線畫成向外傳播的圓形波。對應核心題目 2。</p><p class="small muted">模擬依原「水波的干涉繞射」功能重製（SIM-02）；法拉第波延伸未納入。</p>') + '</div>';
    }, mount: function (el) {
      SIM.ripple(el, "ripple");
      var fb = el.querySelector("[data-fb5]"); var prev = STATE.ans.l1q5;
      if (prev && prev.saved) fb.innerHTML = '<div class="fb ok">已完成：A 在腹線、B 在節線。</div>';
      el.querySelector("[data-chk5]").onclick = function () {
        var d = SIM.ripple_ripple();
        if (!d.A || !d.B) fb.innerHTML = '<div class="fb hint">請先在水面上點兩下，放好 A 與 B。</div>';
        else if (d.A.rel > .85 && d.B.rel < .2) { fb.innerHTML = '<div class="fb ok"><b>找到了。</b>A 在腹線（兩波同相到達），B 在節線（兩波反相到達）。這些位置連成線，而且不會移動。</div>'; saveAns("l1q5", { v: { A: d.A.kind, B: d.B.kind }, ok: true }); }
        else fb.innerHTML = '<div class="fb no">目前 A：' + d.A.kind + '；B：' + d.B.kind + '。再調整看看，下方起伏紀錄可以幫你判斷。<br><a class="book" href="#l1-4--stable">腹線與節線</a></div>';
      };
    } },
    { id: "l1-4", title: "1-4 解釋：腹線、節線與 CER", render: function () {
      return '<div class="col">' + h.head("第1節・解釋與修訂", "腹線、節線與我的解釋", "") + h.cycle("解釋") +
        '<div class="grid-2">' + h.key("", "腹線", "振幅極大的位置連成的線：兩波<b>同相</b>到達。", "ok") + h.key("", "節線", "振幅極小的位置連成的線：兩波<b>反相</b>到達。等振幅時才完全相消。", "model") + '</div>' +
        h.key("", "為什麼位置穩定？", "兩波源位置固定、振動關係固定（同調），每個位置的到達相位差就固定。腹線、節線<b>不是</b>向外移動的波前；局部振幅為零也不代表波永久消失。", "", "stable") +
        C.cer({ id: "l1q7", n: "Q7", q: "寫出水波干涉的 CER：為什麼水面會出現位置穩定的腹線與節線？", phE: "例：A 點在一個週期內……（模型）", ref: "主張：兩同調波源的波在各處疊加，形成穩定的腹線與節線。證據：模擬中 A 點一段時間大幅起伏、B 點幾乎不動（模型）。推理：各位置到達的相位差固定；同相處振幅增大成腹線，反相處振幅減小成節線。",
          diag: [D(/一段時間|週期|起伏|一直|持續/, "你的證據是單一畫面，還是一段時間的起伏？", "l1-3--ripple", "水波模擬：起伏紀錄", true), D(/顏色|亮的|暗的|亮色/, "瞬時畫面的亮暗只代表那一刻的位移，能判斷腹線嗎？", "l1-2--disp", "位移與振幅"), D(/同相|反相|相位/, "推理有沒有說明兩波「到達時」的振動關係？", "l1-4--stable", "為什麼位置穩定", true)] }) +
        C.text({ id: "l1q8", n: "Q8", q: "反思：哪一項觀察讓你改變（或確認）了原來的想法？", rows: 2, ph: "我原本以為……，看到……之後……" }) +
        tq('<p><b>42–50 分</b>　命名腹線、節線，再反思。問：「哪項觀察讓你改變？」評量證據：觀察支持解釋；指出修訂理由。</p>') + '</div>';
    } },
    { id: "l1-q", title: "1-5 隨堂測驗", render: function () {
      return '<div class="col">' + h.head("第1節・課後", "隨堂測驗", "7 題，約 10 分鐘。") + C.quiz(QUIZ.l1) + tq('<p>補充設計（7 題／15 分），細目表見 <a href="#t-assess">評量與細目表</a>。</p>') + '</div>';
    } }
  ] });

  /* ======================= 第2節 ======================= */
  var CER_RULES = [D(/一段時間|週期|起伏|一直|持續/, "證據寫的是一段時間的起伏嗎？", "l1-3--ripple", "水波模擬：起伏紀錄", true), D(/模型|模擬/, "有沒有標明證據來自模型？", "l1-3--ripple", "水波模擬", true), D(/同相|反相|相位/, "推理有連到同相、反相到達嗎？", "l1-4--stable", "為什麼位置穩定", true)];
  B.chapters.push({ id: "c2", title: "第2節　雙狹縫干涉", color: "2", mark: "2", pages: [
    { id: "l2-0", title: "2-0 回顧：修訂水波 CER", render: function () {
      var a = (STATE.ans.l1q7 || {}).v || {};
      return '<div class="col">' + h.head("第2節・開場", "先修訂上一節的解釋", "好的解釋要有可回查的證據，推理要連到疊加。") + h.cycle("修訂") +
        '<div class="card"><b>你在第1節寫的 CER</b><p class="small"><span class="tag c">C</span> ' + (a.c || "（尚未作答，可先回到 <a href=\"#l1-4\">1-4</a>）") + '<br><span class="tag c">E</span> ' + (a.e || "—") + '<br><span class="tag c">R</span> ' + (a.r || "—") + '</p></div>' +
        C.mcq({ id: "l2q0a", n: "檢查", q: "支持「腹線、節線」最好的證據是：", opts: ["一段時間的振幅（起伏大／幾乎不動）", "某一張截圖的顏色", "波源的顏色", "不需要證據"], ans: 0, explain: "能回查的觀察才是好證據。", hint: "單張截圖只顯示瞬時位移。", link: "l1-2--disp", lt: "位移與振幅" }) +
        C.cer({ id: "l2q0", n: "修訂", q: "修訂你的水波 CER（可保留原句，補上證據或推理）。", ref: "證據寫出「一段時間」的起伏並標明是模型；推理連到同相／反相到達。", diag: CER_RULES }) +
        tq('<p><b>0–8 分</b>　呈現匿名水波 CER。問：「哪項觀察支持腹線、節線？」學生修訂第1節 Q7；評量證據：修訂有明確證據與理由。</p>') + '</div>';
    } },
    { id: "l2-1", title: "2-1 預測：屏幕上會看到什麼", render: function () {
      return '<div class="col">' + h.head("第2節・活動01・8 分鐘", "先預測", "一束穩定的紅色雷射光通過兩條相近的窄縫，遠方屏幕會出現什麼？") + h.cycle("預測") +
        '<figure>' + setupSvg(2) + '<figcaption>雙狹縫實驗的空間位置示意（只標器材位置，不畫光線）。</figcaption></figure>' +
        C.mcq({ id: "l2q1", n: "Q1", q: "你預測屏幕上會看到什麼？", opts: ["主要只有兩條亮紋", "整片亮度差不多", "多條明暗相間的條紋", "其他"], ans: null, after: "再把預測畫在下面。" }) +
        C.strip({ id: "l2q1s", n: "Q1", q: "畫出你預測的屏幕：中央與左右兩側的明暗分布。", after: "看實拍前不要修改。" }) +
        C.text({ id: "l2q1r", n: "Q1", q: "我這樣預測，因為……", rows: 2 }) +
        tq('<p><b>8–15 分</b>　只呈現裝置，不揭圖樣。問：「依直進模型會看到什麼？」學生未完成 Q1 前，不展示屏幕結果。</p><p><b>判讀</b>　不以正誤評分；畫出面向屏幕的完整分布並保留一項理由。<b>引導</b>　只畫兩條狹縫 →「這是開口的樣子，還是屏幕上看到的樣子？」；擦掉預測 →「請保留初稿，等觀察後再比較。」</p>') + '</div>';
    } },
    { id: "l2-2", title: "2-2 觀察：真實的屏幕", render: function () {
      return '<div class="col">' + h.head("第2節・活動02・12 分鐘", "觀察與比較", "先記錄真實屏幕，再和你的預測比較。") + h.cycle("觀察") +
        '<div class="grid-2">' + h.fig("assets/photos/P2-02.jpg", "光凳器材組（P2-02）。Waifer X／Cuesta College｜CC BY 2.0。不代表本次實驗組。") + h.fig("assets/photos/P2-03.jpg", "光凳實際架設（P2-03）。Cantons-de-l'Est｜CC BY-SA 4.0。") + '</div>' +
        h.key("", "安全", "雷射由老師操作；不直視、不指向他人或鏡面。", "warn") +
        '<div id="photo">' + h.fig("assets/photos/P2-04.jpg", '<span class="tag ev">實拍</span> 632.8 nm 紅光雙狹縫干涉（P2-04）。Bryan Tong Minh｜Public Domain。') + '</div>' +
        C.mcq({ id: "l2q2a", n: "Q2", q: "你這次用的資料來源是？", opts: ["現場示範", "有來源的實拍照片／影片", "僅理想模型"], ans: null, after: "只看模型時，要標為模型結果。" }) +
        C.strip({ id: "l2q2s", n: "Q2", q: "畫出你觀察到的屏幕明暗分布。" }) +
        C.text({ id: "l2q2t", n: "Q2", q: "寫出兩個觀察特徵。", fields: [{ k: "f1", label: "特徵一", rows: 1 }, { k: "f2", label: "特徵二", rows: 1 }], ref: "例：明暗交替；左右近似對稱；中央附近亮紋間距近似相等。" }) +
        C.mcq({ id: "l2q3a", n: "Q3", q: "與 Q1 比較，你的預測和觀察：", opts: ["大致相同", "部分相同", "不同"], ans: null, after: "" }) +
        C.text({ id: "l2q3", n: "Q3", q: "你保留或修正哪一點？請引用一項觀察。", rows: 2, ph: "我保留／修正＿＿；依據是＿＿。", ref: "指出保留或修改的內容，並連到觀察；不要求每人都改變想法。", diag: [D(/觀察|實拍|照片|看到|條紋/, "請引用一項觀察，作為保留或修正的依據。", "l2-2--photo", "雙狹縫實拍", true)] }) +
        tq('<p><b>15–32 分</b>　先看實拍，再用模擬比較。問：「哪個特徵需要修正？」評量證據：指出多條明暗紋；如實標示來源。</p><p><b>引導</b>　把波面弧線當實拍 →「這是實際紀錄，還是用來解釋的模型？」；只寫「不同」→「哪個觀察讓你修改哪一部分？」對應核心題目 3。</p>') + '</div>';
    } },
    { id: "l2-3", title: "2-3 解釋：亮紋與暗紋", render: function () {
      return '<div class="col">' + h.head("第2節・活動03・15 分鐘", "解釋亮暗", "兩列光波都能到達屏幕，為什麼還會有暗紋？") + h.cycle("解釋") +
        h.key("", "惠更斯原理", '波面上每一點都可視為發出<span class="hl">次波</span>的波源。窄縫可近似為次波源；同一束單色光照明兩縫，兩縫的次波頻率相同、相位關係固定，稱為<b>相干波源</b>。<span class="small muted">相位：週期振動進行到哪個階段。</span>', "model", "huygens") +
        '</div><div class="wide">' + SIM.dslitFrame("dslit") + '</div><div class="col">' +
        '<div class="grid-2" id="rule">' + h.key("", "同相到達 → 亮紋", "互相增強；光強較大。", "ok") + h.key("", "反相到達 → 暗紋", "互相減弱；等振幅時理想光強為零。", "ev") + '</div>' +
        h.key("", "暗紋不是沒有光", "兩列光都到達暗紋處，只是反相相消。眼睛看到的是<b>時間平均</b>的光強。", "warn", "dark") +
        C.seg({ id: "l2q4", n: "Q4", q: "依兩個相干次波源的模型，判斷 B（亮紋）與 D（暗紋）。", cols: [{ t: "相位", o: ["同相", "反相"] }, { t: "干涉", o: ["建設性", "破壞性"] }, { t: "光強", o: ["較強", "理想下為零"] }], rows: [{ k: "B", t: "B", ans: [0, 0, 0] }, { k: "D", t: "D", ans: [1, 1, 1] }], explain: "B 同相、建設性、較強；D 反相、破壞性、理想下為零。", link: "l2-3--dark", lt: "暗紋不是沒有光",
          ladder: [L("你判斷的根據是哪一項觀察？先回看實拍中的亮暗位置。", "l2-2--photo", "雙狹縫實拍"), L("在模型選 D 點：從兩條狹縫出發的路徑，是否都能到達 D？", "l2-3--dslit", "雙狹縫模型"), L("D 點兩路光到達時是同相還是反相？這如何影響合成振幅與亮度？", "l2-3--rule", "同相亮、反相暗")] }) +
        C.text({ id: "l2q4t", n: "Q4", q: "用 2–3 句說明：兩列光波都能到達屏幕，為何仍有亮紋與暗紋？", rows: 3, ref: "兩列光波到達各處的相位關係不同：同相處互相增強成亮紋；反相處互相減弱，等振幅時完全相消成暗紋。暗紋處兩列光都有到達。",
          diag: [D(NO_LIGHT, "兩條狹縫發出的光，都能到達暗紋處嗎？", "l2-3--dark", "暗紋不是沒有光"), D(/同相|反相|相位/, "亮與暗的差別，和兩列光到達時的相位有什麼關係？", "l2-3--rule", "同相亮、反相暗", true)] }) +
        full("n2") +
        h.fold("", "成立條件", "<p>同偏振方向、相干單色光的理想模型。完全暗紋還需等振幅；實驗暗紋可能仍有背景光。兩縫也都會產生繞射，不能說雙狹縫只有干涉。</p>", false, "cond2") +
        tq('<p><b>32–45 分</b>　用惠更斯原理解釋 B 亮、D 暗。問：「暗處真的沒有光到達嗎？」評量證據：相位關係連到電場疊加及光強。</p><p><b>專業說明</b>　次波包絡形成新波面；兩狹縫受同一入射波驅動成同調次波源。模型波面不是可見光路。雷射示範由教師固定光路，避開眼睛與鏡面；調整前關閉光源。對應核心題目 4；規格見 <a href="#t-ai">AI 追問與數位規格</a>。</p>') + '</div>';
    }, mount: function (el) { SIM.dslit(el, "dslit"); } },
    { id: "l2-4", title: "2-4 修訂：比較與統整", render: function () {
      return '<div class="col">' + h.head("第2節・活動04・15 分鐘", "水波與光：同一條規則", "兩種現象直接看到的東西不同，規則卻相同。") + h.cycle("修訂") +
        h.table(["", "直接看到的", "共同規則"], [["水波", "水面起伏（位移）", "波的疊加；同相增強、反相減弱"], ["光", "屏幕上時間平均的光強", "同上"]]) +
        C.text({ id: "l2q5", n: "Q5", q: "比較水波干涉與光的雙狹縫干涉。", fields: [{ k: "w", label: "水波可觀察", rows: 1 }, { k: "l", label: "光的雙狹縫可觀察", rows: 1 }, { k: "r", label: "共同規則", rows: 1 }], ref: "水波：水面起伏。光：屏幕上時間平均的光強分布。共同規則：波的疊加與建設性／破壞性干涉。",
          diag: [D(/光強|亮度|平均|強度/, "屏幕上直接看到的是位移，還是光的強度？", "l2-3--dark", "時間平均光強", true)] }) +
        C.text({ id: "l2q6", n: "Q6", q: "用 4–5 句解釋雙狹縫亮暗紋。依序寫：兩個次波源 → 光波疊加 → 亮紋 → 暗紋 → 與 Q2 觀察的連結。", rows: 5, ph: "因為……所以……", ref: "兩窄縫可視為相干次波源。兩列光波在屏幕各處疊加。同相處增強形成亮紋。反相處減弱，等振幅時可完全相消形成暗紋。這可解釋 Q2 的明暗分布；若 Q2 只看了模型，要註明尚待實際觀察支持。",
          diag: [D(/次波|波源|惠更斯/, "從哪裡開始解釋？兩條狹縫在模型中扮演什麼角色？", "l2-3--huygens", "惠更斯原理", true), D(NO_LIGHT, "暗紋處真的沒有光嗎？", "l2-3--dark", "暗紋不是沒有光"), D(/Q2|觀察|實拍|照片/, "最後一句有連到你在 Q2 的觀察嗎？", "l2-2--photo", "雙狹縫實拍", true)] }) +
        tq('<p><b>45–50 分</b>　問：「水波位移與屏幕亮暗相同嗎？」評量證據：引用屏幕觀察；寫出類比限制。<b>引導</b>　把水面位移當光強 →「兩種活動各自直接看到的是什麼？」；Q6 只有名詞 →「請用『因為……所以……』連起相位、疊加與亮暗。」</p>') + '</div>';
    } },
    { id: "l2-q", title: "2-5 隨堂測驗", render: function () { return '<div class="col">' + h.head("第2節・課後", "隨堂測驗", "7 題，約 10 分鐘。") + C.quiz(QUIZ.l2) + tq('<p>補充設計（7 題／15 分），細目表見 <a href="#t-assess">評量與細目表</a>。</p>') + '</div>'; } }
  ] });

  /* ======================= 第3節 ======================= */
  B.chapters.push({ id: "c3", title: "第3節　繞射與薄膜", color: "3", mark: "3", pages: [
    { id: "l3-0", title: "3-0 回顧：證據還是模型？", render: function () {
      var a = (STATE.ans.l2q6 || {}).v || {};
      return '<div class="col">' + h.head("第3節・開場", "哪句話把模型當成了證據？", "") + h.cycle("修訂") +
        h.key("", "證據與模型", '<span class="tag ev">實拍</span> 是光的證據；<span class="tag md">模型</span> 用來解釋；水波是<b>類比</b>。', "", "evidence") +
        C.sort({ id: "l3q0s", n: "分類", q: "這些資料，哪些是光的證據，哪些是類比或模型？", cats: ["光學實拍", "水波類比", "模型"], items: [
          { t: "雙狹縫紅光照片", img: "assets/photos/P2-04.jpg", ans: 0, why: "真實屏幕紀錄" },
          { t: "雙狹縫波前弧線圖", img: svgURI(setupSvg(2, true)), ans: 2, why: "用來解釋的模型" },
          { t: "水波干涉示意", img: svgURI(rippleSvg), ans: 1, why: "水波是類比" }], explain: "只有實拍能當光的證據。" }) +
        '<div class="card"><b>你在第2節寫的 Q6</b><p class="small">' + (a.v || "（尚未作答，可先回到 <a href=\"#l2-4\">2-4</a>）") + '</p></div>' +
        C.text({ id: "l3q0", n: "修訂", q: "修訂第2節 Q6：補上證據或推理，並標明哪些是實拍、哪些是模型。", rows: 4, diag: [D(/模型|實拍|照片/, "你有標明哪些是實拍、哪些是模型嗎？", "l3-0--evidence", "證據與模型", true), D(NO_LIGHT, "暗紋處真的沒有光嗎？", "l2-3--dark", "暗紋不是沒有光")] }) +
        tq('<p><b>0–8 分</b>　呈現匿名後台回答紀錄。問：「哪句把模型當成實驗證據？」評量證據：區分光學實拍、水波類比與模型。</p>') + '</div>';
    } },
    { id: "l3-1", title: "3-1 單狹縫繞射", render: function () {
      return '<div class="col">' + h.head("第3節・知識節點03", "單狹縫繞射", "光通過一條窄縫，屏幕上會怎樣？") + h.cycle("觀察") +
        h.fig("assets/photos/P3-09.jpg", '<span class="tag ev">實拍</span> 藍光雷射單狹縫繞射（P3-09）。Xyqorophibian｜CC BY-SA 4.0。') +
        '<div class="grid-2">' + h.fig("assets/photos/P3-08.jpg", "可調式單狹縫器（P3-08）。Jan Krieger｜CC BY-SA 3.0。照片尺度不代表課堂狹縫。") + '<figure>' + setupSvg(1) + '<figcaption>單狹縫實驗空間位置示意（不畫幾何光線）。</figcaption></figure></div>' +
        C.mcq({ id: "l3q1a", n: "Q1", q: "比較實拍：中央亮紋與兩側亮紋有什麼差別？", opts: ["中央較寬、較亮；兩側較窄、向外漸弱", "全部等寬等亮", "中央是暗紋", "只有一條亮紋"], ans: 0, explain: "這是遠場、均勻單色照明下的單狹縫圖樣。", link: "l3-1--why", lt: "單狹縫：許多次波源" }) +
        '</div><div class="wide">' + SIM.patternFrame("pattern") + '</div><div class="col">' +
        h.key("", "為什麼？", '縫內不同位置可視為<span class="hl">許多次波源</span>。正前方的次波大致同相到達，互相增強；偏離正前方，路徑長度不同，某些方向完全相消，某些方向部分增強。<br>雙狹縫看<b>兩縫之間</b>的疊加；單狹縫看<b>同一縫內</b>的疊加。兩者都是波的疊加。', "model", "why") +
        C.mcq({ id: "l3q2", n: "Q2", q: "波長不變，把縫變窄（本教材的尺度內），中央亮紋會？", opts: ["變寬（展開角度增加）", "變窄", "不變", "消失"], ans: 0, explain: "這不是狹縫影像的放大，而是繞射展開更明顯。", hint: "用模擬的「單縫寬度」滑桿試試。", link: "l3-1--pattern", lt: "次波源分布與屏幕圖樣" }) +
        C.text({ id: "l3q1", n: "Q1", q: "單狹縫與雙狹縫的圖樣有何不同？為什麼都能用疊加解釋？", rows: 3, ref: "單縫：中央寬亮、旁側漸弱；雙縫：中央附近明暗交替。雙縫是兩個分立次波源，單縫是縫內連續分布的次波源，兩者都是次波疊加。",
          diag: [D(/無關|完全不同|不同原理|原理不同/, "圖樣不同，原理就一定不同嗎？比較兩者的次波源分布。", "l3-1--why", "單狹縫：許多次波源"), D(/次波|波源/, "用「次波源分布」說明兩者的差別。", "l3-1--pattern", "次波源分布模擬", true), D(/彎/, "只說「光彎曲」夠嗎？是哪些次波在疊加？", "l3-1--why", "為什麼會展開")] }) +
        full("n3") +
        h.fold("", "成立條件", "<p>中央寬亮紋與旁側亮紋採遠場、均勻單色照明。「縫越窄，展開越明顯」須固定波長並限於本教材尺度，不能外推到所有縫寬與近場。遠場：屏幕夠遠，縫內各處到同一點的方向可近似平行。</p>", false, "cond3") +
        tq('<p><b>8–18 分</b>　先比實拍，再比次波源分布。問：「中央與兩側亮紋有何差別？」評量證據：中央較寬較亮；兩側漸弱。</p><p><b>困難：干涉繞射無關</b>　L1「你認為原理不同，是根據哪個差異？」→ L2「在兩個模型標出次波源，各自如何分布？」→ L3「根據次波源與明暗紋，你會如何修訂？」對應核心題目 5。Q2 為補充設計。</p>') + '</div>';
    }, mount: function (el) { SIM.pattern(el, "pattern"); } },
    { id: "l3-2", title: "3-2 薄膜干涉", render: function () {
      return '<div class="col">' + h.head("第3節・知識節點04", "透明的膜，為什麼有顏色？", "肥皂膜和油膜沒有彩色顏料。") + h.cycle("解釋") +
        '<div class="photo-grid">' + h.fig("assets/photos/P3-15.jpg", "肥皂泡（P3-15）。Pksois23｜CC BY-SA 4.0") + h.fig("assets/photos/P3-14.jpg", "水面油膜（P3-14）。gambier20｜CC BY 2.0") + h.fig("assets/photos/P3-16.jpg", "厚度不均的肥皂膜（P3-16）。Yaroslav Ulyushin｜CC BY 4.0") + '</div>' +
        '</div><div class="wide">' + SIM.filmFrame("film") + '</div><div class="col">' +
        h.key("", "兩路反射光", '一部分光在<b>上表面</b>反射（①）；另一部分進入薄膜，在<b>下表面</b>反射後再離開（②）。兩路光朝同一方向前進並互相干涉。<br>結果與膜厚、折射率、觀察角度、波長，以及反射時的相位改變有關。膜厚各處不同 → 不同顏色在不同位置增強 → 彩色分布。', "model", "two") +
        C.mcq({ id: "l3q3a", n: "Q3", q: "到達眼睛、互相干涉的兩路光是？", opts: ["上表面反射光，與下表面反射後穿出的光", "直射光與折射光", "顏料反射光與天空光", "只有一路光"], ans: 0, explain: "不是顏料，也不只是折射。", hint: "看模擬剖面的 ① 和 ②。", link: "l3-2--two", lt: "兩路反射光" }) +
        C.text({ id: "l3q3", n: "Q3", q: "指出薄膜上、下表面的兩路反射光，並說明它們如何造成色彩。", rows: 3, ref: "一路由上表面直接反射；另一路進入薄膜由下表面反射後穿出。兩路光重疊干涉，使不同波長增強或減弱，因而出現色彩。不要求膜厚或顏色計算。",
          diag: [D(/顏料|色素/, "薄膜裡有顏料嗎？顏色從哪裡來？", "l3-2--two", "兩路反射光"), D(/上表面|下表面|兩路|兩道|上下/, "指出是哪兩路光：分別在哪個表面反射？", "l3-2--film", "薄膜模擬剖面", true), D(/^[^干]*$/, "你的說明有提到「干涉」嗎？兩路光重疊後會怎樣？", "l3-2--two", "兩路反射光")] }) +
        '<div class="grid-2">' + h.fig("assets/photos/P3-12.jpg", "牛頓環：薄空氣膜的干涉（P3-12）。Ulfbastel｜PD") + h.fig("assets/photos/P3-05.jpg", "一般鏡片與抗反射鏡片（P3-05）。Maximilian Schönherr｜CC0") + '</div>' +
        full("n4") +
        h.fold("", "成立條件", "<p>以透明薄膜的反射光作定性說明；不能只比較幾何路徑而忽略反射相位。「抗反射」只在設計的波長與角度範圍內降低反射，不是所有光都不反射。</p>", false, "cond4") +
        tq('<p><b>18–28 分</b>　展示薄膜照片與剖面。問：「哪兩束反射光會重疊？」評量證據：兩路反射光正確；不只歸因折射。只作定性說明。對應核心題目 6。顏色帶屬延伸。</p>') + '</div>';
    }, mount: function (el) { SIM.film(el, "film"); } },
    { id: "l3-3", title: "3-3 應用：生活中的干涉與繞射", render: function () {
      return '<div class="col">' + h.head("第3節・生活應用", "生活中的干涉與繞射", "每一張照片，各是哪幾路光在疊加？") +
        C.sort({ id: "l3q4", n: "Q4", q: "把照片分類：主要來自哪一種機制？", cats: ["薄膜干涉", "繞射", "多種機制"], link: "l3-2--two", lt: "兩路反射光", items: [
          { t: "肥皂泡", img: "assets/photos/P3-15.jpg", ans: 0, why: "上下表面兩路反射光" },
          { t: "光碟的彩虹", img: "assets/photos/P3-07.jpg", ans: 1, why: "週期結構繞射，不是薄膜" },
          { t: "望遠鏡星點的尖芒", img: "assets/photos/P3-11.jpg", ans: 1, why: "繞射尖峰，不是恆星真實外形" },
          { t: "牛頓環", img: "assets/photos/P3-12.jpg", ans: 0, why: "薄空氣膜干涉" },
          { t: "抗反射鏡片", img: "assets/photos/P3-05.jpg", ans: 0, why: "鍍膜利用干涉降低反射" },
          { t: "藍閃蝶翅膀", img: "assets/photos/P3-13.jpg", ans: 2, why: "結構色：可能同時涉及干涉、繞射與散射" },
          { t: "孔雀羽毛", img: "assets/photos/P3-10.jpg", ans: 2, why: "結構色，不只是顏料" }], explain: "光碟色彩不能一律歸為薄膜干涉；結構色要依個別機制說明。" }) +
        '<p class="small muted">照片：Hapecko｜CC BY-SA 4.0（P3-07）；ESA/Hubble &amp; NASA｜CC BY 4.0（P3-11）；Alias 0591｜CC BY 2.0（P3-13）；Bernard Spragg. NZ｜CC0（P3-10）；其餘見 3-2。</p>' +
        tq('<p>新情境應用：辨認薄膜的兩路反射光；比較光碟與薄膜的機制，不混淆兩者。本頁分類為補充設計。</p>') + '</div>';
    } },
    { id: "l3-4", title: "3-4 統整：光是波嗎？", render: function () {
      return '<div class="col">' + h.head("第3節・統整・28–50 分", "光的波動性：證據與界限", "回看雙狹縫與單狹縫的實拍：直進模型漏掉了什麼？") + h.cycle("解釋") +
        '<div class="grid-2" id="ev">' + h.fig("assets/photos/P2-04.jpg", '<span class="tag ev">證據 1</span> 雙狹縫：多條明暗交替（P2-04）') + h.fig("assets/photos/P3-09.jpg", '<span class="tag ev">證據 2</span> 單狹縫：中央寬亮紋、旁側漸弱（P3-09）') + '</div>' +
        h.table(["", "直進模型預期", "波動模型解釋"], [["雙狹縫", "兩條亮紋（狹縫投影）", "兩列相干波疊加 → 明暗交替"], ["單狹縫", "與縫等寬的亮區", "縫內次波疊加 → 展開、中央寬亮紋"]]) +
        C.cer({ id: "l3q5a", n: "Q5①", q: "雙狹縫干涉與單狹縫繞射如何共同支持光具有波動行為？", ref: "主張：光在這些情境中具有波動行為。證據：雙狹縫多條明暗交替、單狹縫中央寬亮紋與旁側弱亮紋（實拍，可回查）。推理：直進模型無法解釋；波的展開與次波疊加能解釋兩者。",
          diag: [D(/水波|模擬/, "水波與模擬是類比和模型，能當光的主要證據嗎？", "l3-0--evidence", "證據與模型"), D(/雙狹縫|雙縫/, "有沒有引用雙狹縫的實拍？", "l3-4--ev", "兩項證據", true), D(/單狹縫|單縫|繞射/, "有沒有引用單狹縫的實拍？", "l3-4--ev", "兩項證據", true)] }) +
        h.key("", "結論的界限", "兩項證據支持光在<b>這些情境中</b>具有波動行為，不等於已說明光的全部性質，也不等於否定光的粒子性。", "warn", "limit") +
        C.mcq({ id: "l3q5b", n: "界限", q: "這個結論的界限是？", opts: ["證明光只是波，不可能有其他性質", "支持光在這些情境中具有波動行為，不等於已說明光的全部性質", "水波模擬就足以證明", "不需要任何實拍"], ans: 1, explain: "", link: "l3-4--limit", lt: "結論的界限" }) +
        C.text({ id: "l3q5c", n: "Q5②", q: "反思：學習前後，你的想法有什麼不同？哪項證據改變了你？若用過追問助手，你採納或拒絕了哪些問題？為什麼？", rows: 3 }) +
        tq('<p><b>28–45 分</b>　回看兩種實拍。問：「直進模型漏掉了什麼？」<b>45–50 分</b>　問：「哪項證據改變你的想法？」提醒保存修訂及採納理由，複製完整紀錄。對應核心題目 7、目標 4。</p>') + '</div>';
    } },
    { id: "l3-q", title: "3-5 隨堂測驗", render: function () { return '<div class="col">' + h.head("第3節・課後", "隨堂測驗", "7 題，10–12 分鐘。") + C.quiz(QUIZ.l3) + tq('<p>依隨堂測驗雙向細目表・第3節：7 題／15 分。</p>') + '</div>'; } }
  ] });

  /* ======================= 總結與延伸 ======================= */
  B.chapters.push({ id: "c4", title: "總結與延伸", color: "4", mark: "4", pages: [
    { id: "review", title: "單元回顧", render: function () {
      return '<div class="col">' + h.head("總結", "單元回顧", "一頁看完整個單元，點連結可回到課本段落。") +
        h.table(["概念", "重點", "課本"], [["疊加", "同一位置、同一時刻位移相加；重疊暫時，通過後各自傳播。", '<a href="#l1-2--sup">1-2</a>'], ["水波干涉", "同調波源 → 每處相位差固定 → 穩定的腹線與節線。", '<a href="#l1-4--stable">1-4</a>'], ["雙狹縫", "兩個相干次波源；同相亮、反相暗；暗紋處光仍到達。", '<a href="#l2-3--rule">2-3</a>'], ["單狹縫", "縫內許多次波源；中央寬亮紋、旁側漸弱。", '<a href="#l3-1--why">3-1</a>'], ["薄膜", "上、下表面兩路反射光干涉 → 色彩。", '<a href="#l3-2--two">3-2</a>'], ["結論", "實拍證據支持光的波動行為，但不是光的全部。", '<a href="#l3-4--limit">3-4</a>']]) +
        '<h2>常見誤解與正確說法</h2>' + h.table(["常見誤解", "正確說法"], [["兩個波撞到後會彈回去", "重疊後各自沿原方向傳播"], ["這一刻位移是零，所以振幅是零", "振幅看一段時間的最大位移"], ["暗紋處沒有光到達", "兩列光都到達，反相相消"], ["照片裡的光沿圓弧前進", "圓弧是波前模型，不是看得到的光路"], ["干涉和繞射原理完全不同", "都是次波疊加，次波源分布不同"]]) + '</div>';
    } },
    { id: "posttest", title: "後測", render: function () { return '<div class="col">' + h.head("總結", "後測", "14 題，約 25–30 分鐘。和前測比一比，看看自己的進步。") + C.quiz(QUIZ.post) + tq('<p>依後測雙向細目表：14 題／30 分。第 1–7、10、11 題與前測相同，可作前後比較。</p>') + '</div>'; } },
    { id: "extend", title: "延伸學習與學習單", track: false, render: function () {
      function res(t, pub, sum, url, lv) { return '<a class="card" href="' + url + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:grid;gap:.25rem;margin-top:0"><span class="tag ' + (lv === "高一" ? "c" : lv === "高中量化" ? "md" : "tc") + '" style="justify-self:start">' + lv + '</span><b>' + t + ' ' + icon("ext") + '</b><span class="small muted">' + pub + '</span><span class="small">' + sum + '</span></a>'; }
      return '<div class="col">' + h.head("延伸", "延伸學習", "高一定性理解 → 高中量化 → 大一波動光學。依自己的程度選讀，再完成下方延伸學習單。") +
        h.table(["", "高一（本單元）", "高中進階物理", "大一普通物理"], [["主題", "波疊加、水波干涉、雙狹縫與繞射", "雙狹縫、單狹縫、光柵與薄膜量化", "相量、解析度、干涉量測與影像分析"], ["能力", "解釋亮暗；區分觀察與模型", "由路程差求條紋位置；估算波長、縫寬與膜厚", "比較強度與可見度；估算解析度"], ["工具", "波形圖、實拍與模擬", "幾何圖、三角函數、小角度近似", "相量圖、強度曲線、試算表擬合"], ["先備", "波長、振幅、直進、反射與折射", "疊加、相位、三角比、單位換算", "高中干涉繞射公式、向量、誤差概念"]], true) +
        '<h2>延伸資源</h2></div><div class="wide"><div class="grid">' +
        res("PhET：波的干涉", "PhET，科羅拉多大學", "用水波、聲波、光波模擬干涉、雙狹縫與繞射（中文介面）。", "https://phet.colorado.edu/zh_TW/simulations/wave-interference", "高一") +
        res("PhET：波的介紹", "PhET，科羅拉多大學", "複習波長、振幅、頻率。", "https://phet.colorado.edu/zh_TW/simulations/waves-intro", "高一") +
        res("科博館：蝶色", "國立自然科學博物館", "蝴蝶的色素色與奈米結構色。", "https://www.nmns.edu.tw/ch/learn/museum-education/naturalist/scienceimages/detail/SciencePhotography-07062/", "高一") +
        res("均一：光的干涉與繞射", "均一教育平台", "雙狹縫條紋位置、單狹縫繞射的影片與例題。", "https://www.junyiacademy.org/topics/h12a-physics-unit4", "高中量化") +
        res("薄膜干涉", "陽明交大光電系", "以泡膜、油膜連結光程差與反射相位。", "https://dop.nycu.edu.tw/ch/page.html?tID=260", "高中量化") +
        res("極光巧克力炫目登場", "臺灣網路科教館（江淑芳、陳坤龍）", "由微細紋理與光碟虹彩認識光柵。", "https://www.ntsec.edu.tw/liveSupply/detail.aspx?a=6829&cat=6843&lid=19944&p=1&print=1", "高中量化") +
        res("光學膜：光的魔術師", "科技大觀園（原刊《科學發展》）", "抗反射膜如何利用破壞性干涉。", "https://scitechvista.nat.gov.tw/Article/c000003/detail?ID=20bd62e5-60dd-49c4-b478-90d4b18108fe", "高中量化") +
        res("University Physics Vol. 3", "OpenStax（英文）", "第3章、第4章 4.1–4.5：強度與解析度。", "https://openstax.org/books/university-physics-volume-3/pages/3-introduction", "大一") +
        res("偵測重力波的關鍵技術", "國立自然科學博物館", "精密鍍膜如何提升重力波探測器靈敏度。", "https://web3.nmns.edu.tw/Exhibits/112/the-gravity-realm/unit-4.html", "大一") +
        '</div></div><div class="col"><h2 id="sheet">延伸學習單</h2><p class="small muted">選做。每題都標明搭配的資源；寫完按儲存，會一起出現在學習紀錄中。</p>' +
        C.text({ id: "ex1", n: "延伸1", q: "【高一・PhET 波的干涉】選「光」與「雙狹縫」，把縫距變大，屏幕上條紋的間距怎麼變？寫下你的操作與觀察。", rows: 3, ref: "縫距變大，條紋間距變小（條紋變密）。" }) +
        C.text({ id: "ex2", n: "延伸2", q: "【高一・PhET 波的干涉】縫距不變，把光從紅色換成藍色（波長變短），條紋間距怎麼變？", rows: 2, ref: "波長變短，條紋間距變小。" }) +
        C.text({ id: "ex3", n: "延伸3", q: "【高中量化・均一】兩縫到屏幕某點的路程差為多少時會出現第一條暗紋？用路程差與波長說明。", rows: 2, ref: "路程差為半個波長（λ/2）時，兩列光反相，出現第一條暗紋。" }) +
        C.text({ id: "ex4", n: "延伸4", q: "【高中量化・科技大觀園】抗反射膜為什麼能降低某個顏色的反射？用「兩路反射光」說明。", rows: 3, ref: "膜的厚度使上、下表面兩路反射光對設計的波長反相相消，因此該色光反射減弱；其他波長與角度不一定。" }) +
        tq('<p>延伸學習單為補充設計。原「原延伸教材第1至4章（高三選修物理教材）」未提供，以已查證的網路資源替代：PhET、均一、科技大觀園、科博館「蝶色」為新增。OpenStax 第4章：<a href="https://openstax.org/books/university-physics-volume-3/pages/4-introduction" target="_blank" rel="noopener">4-introduction</a>。</p>') + '</div>';
    } }
  ] });

  /* ======================= 索引 ======================= */
  B.chapters.push({ id: "idx", title: "索引", color: "5", mark: "索", pages: [
    { id: "qindex", title: "題目與學習單", track: false, noIndex: true, render: function () {
      var list = collectQuestions(); var groups = {};
      list.forEach(function (q) { (groups[q.ch.title] = groups[q.ch.title] || []).push(q); });
      var total = list.length, done = list.filter(function (q) { return qStatus(q.id); }).length;
      var h1 = '<div class="col">' + h.head("索引", "題目與學習單", "全部 " + total + " 題（含測驗），已完成 " + done + " 題。點任一題直接前往。");
      Object.keys(groups).forEach(function (g) {
        h1 += '<h2>' + g + '</h2><div class="qindex">' + groups[g].map(function (q) { var st = qStatus(q.id); return '<a href="#' + q.page + '--' + q.id + '"><span class="n">' + q.pageTitle.split(" ")[0] + ' ' + (q.n || "") + '</span><span>' + q.q + '</span><span class="s ' + (st ? "done" : "") + '">' + (st || "未作答") + '</span></a>'; }).join("") + '</div>';
      });
      return h1 + '</div>';
    } },
    { id: "rindex", title: "模擬、動畫與照片", track: false, render: function () {
      var sims = [["l1-2--story", "分鏡動畫：兩個脈衝相遇", "第1節"], ["l1-2--rope", "繩波疊加模擬（可拖曳波形）", "第1節"], ["l1-1--l1q2a", "拖曳預測：重疊時的高度", "第1節"], ["l1-3--ripple", "水波干涉模擬（放置觀察點）", "第1節"], ["l2-3--dslit", "雙狹縫次波模型（B 亮、D 暗）", "第2節"], ["l3-1--pattern", "單雙縫圖樣比較", "第3節"], ["l3-2--film", "薄膜的兩路反射光", "第3節"]];
      var photos = [["l2-2--photo", "雙狹縫紅光實拍（P2-04）"], ["l2-2", "光凳器材與架設（P2-02、P2-03）"], ["l3-1", "單狹縫藍光實拍、可調式單狹縫器（P3-09、P3-08）"], ["l3-2", "肥皂泡、油膜、肥皂膜、牛頓環、抗反射鏡片（P3-05、P3-12、P3-14～16）"], ["l3-3", "光碟、望遠鏡尖芒、藍閃蝶、孔雀羽毛（P3-07、P3-10、P3-11、P3-13）"]];
      function row(a) { return '<a href="#' + a[0] + '"><span class="n">' + (a[2] || "照片") + '</span><span>' + a[1] + '</span><span class="s">前往</span></a>'; }
      return '<div class="col">' + h.head("索引", "模擬、動畫與照片", "所有互動模擬與實拍照片的位置。") +
        '<h2>互動模擬與動畫</h2><div class="qindex">' + sims.map(row).join("") + '</div>' +
        '<h2>實拍照片</h2><div class="qindex">' + photos.map(row).join("") + '</div>' +
        '<h2>延伸資源</h2><div class="qindex">' + row(["extend", "延伸資源（9 個網站）與延伸學習單", "延伸"]) + '</div>' +
        '<p class="small muted">照片來源與授權見各圖說明；教師可在「教師專區 › 素材庫與授權」查看完整清單。</p></div>';
    } },
    { id: "record", title: "我的學習紀錄", track: false, render: function () {
      var qs = [["quiz-pre", "前測"], ["quiz-l1", "第1節隨堂"], ["quiz-l2", "第2節隨堂"], ["quiz-l3", "第3節隨堂"], ["quiz-post", "後測"]];
      var dn = Object.keys(STATE.ans).filter(function (k) { return STATE.ans[k].saved; }).length;
      return '<div class="col">' + h.head("索引", "我的學習紀錄", "作答存在這台裝置。用學生代碼繳交，不需要填姓名。") +
        '<div class="card"><b>1　設定學生代碼</b><p class="small muted">請用老師給的代碼（例如座號 <b>A07</b>）。<b>不要填姓名、學號、電話或 email。</b></p><div class="btns"><input type="text" id="stu-code" maxlength="12" value="' + (STATE.code || "") + '" placeholder="例如 A07" style="max-width:180px" autocomplete="off"><button class="btn" data-act="savecode">設定</button></div><div id="code-msg"></div></div>' +
        '<div class="card"><b>2　檢查成績</b><div class="grid">' + qs.map(function (x) { var r = STATE.quiz[x[0]]; return '<div><span class="small muted">' + x[1] + '</span><div class="num" style="font-size:1.4rem;font-weight:600">' + (r && r.done ? r.score + '<span class="small muted"> / ' + r.auto + '</span>' : '—') + '</div></div>'; }).join("") + '</div><p class="small">已作答 <b class="num">' + dn + '</b> 題。未完成的題目可到 <a href="#qindex">題目與學習單</a> 查看。</p></div>' +
        '<div class="card"><b>3　複製紀錄並繳交</b><p class="small muted">紀錄只含學生代碼、題目、作答、修訂歷程與成績；email、電話格式會自動移除。</p><div class="field"><label for="rec-text">學習紀錄預覽</label><textarea id="rec-text" rows="9" readonly></textarea></div><div class="btns"><button class="btn" data-act="copyrec">' + icon("clip") + '複製紀錄</button><button class="btn ghost" data-act="reset-all">清除這台裝置的作答</button></div></div>' +
        h.key("", "共用電腦", "繳交後請按「清除」，下一位同學才不會看到你的作答。", "warn") + '</div>';
    }, mount: function (el) { el.querySelector("#rec-text").value = recordText(); } }
  ] });
})();
