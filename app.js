(() => {
  "use strict";
  // All learning data stays in this browser. No analytics or remote requests.
  const KEY = "learning-lab-v1";
  const DAY_MS = 24 * 60 * 60 * 1000;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cards = [
    {id:"habit",q:"習慣迴路的四個要素是什麼？請各舉一個讀書情境。",a:"提示（Cue）、慣例（Routine）、獎勵（Reward）、信念（Belief）。例如：坐到書桌→開始 25 分鐘學習→短暫休息→相信自己可以逐步養成習慣。"},
    {id:"pomodoro",q:"番茄工作法為什麼要把注意力放在過程，而不是只看結果？",a:"因為大目標容易讓人害怕開始；承諾專注一小段固定時間，能降低啟動的心理負擔，逐步累積實際完成的經驗。"},
    {id:"recall",q:"「看得懂詳解」和「真正學會」有什麼不同？怎麼檢查？",a:"熟悉感不等於會提取知識。合上書本、不看詳解，試著自己推導、解題或向他人解釋，才能看出能力錯覺與知識漏洞。"},
    {id:"focus",q:"什麼是專注模式與發散模式？難題卡住時要怎麼做？",a:"專注模式沿著較明確的思路深入分析；發散模式更容易產生遠距聯想。先認真思考並記下卡點，再適度走動或休息，之後回來重新檢視。"},
    {id:"chunk",q:"記憶組塊是什麼？如何用在微積分？",a:"透過理解、練習與提取，把相關步驟連結成可快速調用的整體。例如將「辨認題型→選方法→推導→檢查」練成完整的解題程序。"},
    {id:"spacing",q:"為什麼間隔複習通常比一次讀完更適合長期記憶？",a:"把提取練習分散到不同日期，讓大腦多次重新找回知識，可加強日後的記憶表現。先不看答案回憶，再檢查錯誤。"},
    {id:"interleave",q:"什麼是交錯練習？它和重複做同一類題有何不同？",a:"將不同題型混合練習，訓練判斷何時使用哪一個方法；只做相同題型時，可能靠模仿步驟作答，沒有真正練到辨識與選擇策略。"},
    {id:"attribution",q:"失敗時，哪種歸因方式較有助於維持自我效能？",a:"辨認可改變的原因，例如觀念缺口、解題策略或練習安排，而不是直接宣告自己天生能力不足。也不宜把所有失敗都怪罪於努力不夠。"},
    {id:"teach",q:"為什麼「準備教別人」能促進學習？",a:"它會促使學習者先整理重點、組織知識、想例子並預想別人的疑問。真正嘗試說明時，更容易發現自己不懂的細節。"},
    {id:"team",q:"團隊討論如何降低個人認知盲點？有哪些限制？",a:"其他人可能指出自己看不見的假設與錯誤；但若只附和能力較強的人或讓討論變成聊天，團隊的學習效果也會降低。"},
    {id:"exam",q:"什麼是先難後易法則？使用時需要注意什麼？",a:"考試時短暫接觸難題，卡住先跳去簡單題，再回來檢視難題，以避免在同一題耗盡時間。若難題會讓自己過度緊張，也可先從容易題開始。"},
    {id:"sleep",q:"當你學習很久卻想不出解法，為何不一定要繼續熬夜？",a:"適當休息與睡眠有助於學習內容的鞏固，也可讓過度僵化的思路鬆動。熬夜不能取代高品質的練習與提取。"}
  ];
  const quiz = [
    {q:"看完老師的積分詳解後覺得每一步都很合理，但自己不看答案就做不出來。這最接近哪個概念？",options:["發散模式","能力錯覺","交錯練習","教學相長"],answer:1,why:"看懂示範不代表能獨立提取或運用。合上詳解重做一次，可以檢驗真正的理解程度。"},
    {q:"準備期末考時，把一整週的題目都排在同一天反覆練習，最需要補強的是哪個方法？",options:["間隔重複","短期模仿","純粹標記","背誦答案"],answer:0,why:"把複習分散到不同天，讓提取在多個時間點發生，更能檢查知識是否保留。"},
    {q:"看到微積分難題就想打開 Shorts。若要改變習慣迴路，哪個行動最具體？",options:["繼續責怪自己","一次讀完所有章節","移開手機並設定 25 分鐘專注","等到心情很好才開始"],answer:2,why:"調整環境提示，降低新慣例的啟動門檻，並在完成後安排適度獎勵。"},
    {q:"你已經熟練十道相同題型，下一步怎樣較能準備真正的考試？",options:["只做更熟的題目","再看十次解答","把同一題背起來","混合不同題型並先判斷方法"],answer:3,why:"交錯練習的重點是練習辨認題型、挑選策略，而不只是重複執行熟悉程序。"},
    {q:"一個人原以為自己了解電路概念，但試著教同學時才發現解釋不清楚。這說明什麼？",options:["準備教別人可暴露理解漏洞","學習只需要多聽老師講解","會講話就等於會解題","團隊不需要各自練習"],answer:0,why:"組織內容、預想疑問與嘗試說明會推動更深入的學習；不會解釋處可回頭補強。"},
    {q:"遇到物理難題想不出來，先認真嘗試、去散步，再回來找新解法，這最符合什麼策略？",options:["被動反覆閱讀","先完全不碰題目","專注與發散模式交替","所有時候都只靠直覺"],answer:2,why:"先讓專注思考建立問題線索，再透過休息促進不同聯想；關鍵在於有意識地回到原任務。"}
  ];

  function fresh() { return {focusSessions:0,reviews:0,mistakes:[],days:Array(7).fill(false),journals:{},cardState:{}}; }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!raw || typeof raw !== "object") return fresh();
      return {
        focusSessions: Number.isSafeInteger(raw.focusSessions) && raw.focusSessions >= 0 ? raw.focusSessions : 0,
        reviews: Number.isSafeInteger(raw.reviews) && raw.reviews >= 0 ? raw.reviews : 0,
        mistakes: Array.isArray(raw.mistakes) ? raw.mistakes.slice(0,100).filter(m => m && typeof m.problem === "string") : [],
        days: Array.from({length:7}, (_,i) => Boolean(raw.days?.[i])),
        journals: raw.journals && typeof raw.journals === "object" ? raw.journals : {},
        cardState: raw.cardState && typeof raw.cardState === "object" ? raw.cardState : {}
      };
    } catch { return fresh(); }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch { notify("目前無法使用本機儲存；請檢查瀏覽器設定。"); }
    updateStats();
  }
  let toastTimer = null;
  function notify(message) {
    const box = $("#toast");
    if (!box) return;
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove("show"), 3700);
  }
  function updateStats() {
    $("#stat-focus").textContent = String(state.focusSessions);
    $("#stat-cards").textContent = String(state.reviews);
    const count = state.days.filter(Boolean).length;
    $("#stat-days").innerHTML = count + ' <small>/ 7</small>';
    $("#experiment-count").textContent = count + " / 7";
    $("#experiment-bar").style.width = ((count / 7) * 100) + "%";
    $$("[data-day-check]").forEach(input => {
      const index = Number(input.dataset.dayCheck);
      input.checked = Boolean(state.days[index]);
      input.closest(".day-card")?.classList.toggle("done", input.checked);
    });
  }

  // Navigation uses the URL hash so pages are bookmarkable.
  const pageTitles = {home:"學習實驗室",story:"我的學習故事",theory:"學習科學圖鑑",tools:"實作工具箱",experiment:"七日學習實驗",reflection:"成果與反思"};
  function showPage(key, scroll = true) {
    if (!Object.hasOwn(pageTitles, key)) key = "home";
    $$("main > .page").forEach(section => { section.hidden = section.id !== "page-" + key; });
    $$(".nav-link").forEach(button => {
      const isCurrent = button.dataset.page === key;
      button.classList.toggle("is-active", isCurrent);
      if (isCurrent) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    $("#crumb-title").textContent = pageTitles[key];
    document.title = pageTitles[key] + "｜學會學";
    $(".sidebar").classList.remove("open");
    $("#mobile-menu").setAttribute("aria-expanded", "false");
    if (scroll) window.scrollTo({top:0,behavior:"smooth"});
  }
  function navigate(page) {
    if (!Object.hasOwn(pageTitles,page)) return;
    if (location.hash !== "#" + page) location.hash = page;
    else showPage(page);
  }
  $$("[data-page]").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.page)));
  $$("[data-go]").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.go)));
  window.addEventListener("hashchange", () => showPage(location.hash.substring(1)));
  showPage(location.hash.substring(1), false);
  $("#mobile-menu").addEventListener("click", () => {
    const open = $(".sidebar").classList.toggle("open");
    $("#mobile-menu").setAttribute("aria-expanded", String(open));
  });

  // Timer: deadline-based to remain accurate even when background tabs throttle intervals.
  let timerMode = "focus", timerSeconds = 25 * 60, timerFull = timerSeconds, timerRunning = false, timerDeadline = 0;
  const timerDisplay = $("#timer-display"), timerToggle = $("#timer-toggle");
  const currentDuration = () => timerMode === "focus" ? Number($("#focus-duration").value) * 60 : 5 * 60;
  function renderTimer() {
    const seconds = Math.max(0,Math.ceil(timerSeconds));
    timerDisplay.textContent = String(Math.floor(seconds / 60)).padStart(2,"0") + ":" + String(seconds % 60).padStart(2,"0");
    const pct = Math.max(0,Math.min(100,(1 - timerSeconds / timerFull) * 100));
    $("#timer-ring").style.setProperty("--progress", pct.toFixed(2) + "%");
    $("#timer-label").textContent = timerMode === "focus" ? "FOCUS SESSION" : "MINDFUL BREAK";
    $("#timer-subtitle").textContent = timerRunning ? "專注在這一刻" : timerMode === "focus" ? "只專注在下一步" : "有意識地休息一下";
    timerToggle.textContent = timerRunning ? "暫停計時" : timerSeconds < timerFull ? "繼續計時" : timerMode === "focus" ? "開始專注" : "開始休息";
    $("#focus-duration").disabled = timerRunning;
    [["focus","#mode-focus"],["break","#mode-break"]].forEach(([mode,selector]) => {
      $(selector).classList.toggle("selected",timerMode===mode);
      $(selector).setAttribute("aria-pressed", String(timerMode===mode));
    });
  }
  function setTimerMode(mode) {
    timerRunning = false;
    timerMode = mode;
    timerSeconds = currentDuration();
    timerFull = timerSeconds;
    renderTimer();
  }
  function timerTick() {
    if (!timerRunning) return;
    timerSeconds = Math.max(0, (timerDeadline - Date.now()) / 1000);
    if (timerSeconds <= 0) {
      timerRunning = false;
      if (timerMode === "focus") {
        state.focusSessions++;
        save();
        notify("完成一個專注區段！你可以安心休息五分鐘。");
        setTimerMode("break");
      } else {
        notify("休息結束。準備好後，再開始下一段專注。");
        setTimerMode("focus");
      }
    } else renderTimer();
  }
  $("#mode-focus").addEventListener("click", () => { setTimerMode("focus"); });
  $("#mode-break").addEventListener("click", () => { setTimerMode("break"); });
  $("#focus-duration").addEventListener("change", () => { if (!timerRunning && timerMode==="focus") setTimerMode("focus"); });
  timerToggle.addEventListener("click", () => {
    if (timerRunning) {
      timerSeconds = Math.max(0,(timerDeadline - Date.now()) / 1000);
      timerRunning = false;
    } else {
      if (timerSeconds <= 0) timerSeconds = currentDuration();
      timerDeadline = Date.now() + timerSeconds * 1000;
      timerRunning = true;
    }
    renderTimer();
  });
  $("#timer-reset").addEventListener("click", () => setTimerMode(timerMode));
  setInterval(timerTick, 300);
  document.addEventListener("visibilitychange", timerTick);
  renderTimer();

  // Flashcards: simple spacing, with explicitly stated suggested review dates.
  let cardIndex = 0, cardFlipped = false;
  function dueCount() {
    return cards.filter(c => !state.cardState[c.id] || Number(state.cardState[c.id].nextDue) <= Date.now()).length;
  }
  function renderCard() {
    const card = cards[cardIndex];
    const rec = state.cardState[card.id];
    $("#flash-index").textContent = "第 " + (cardIndex + 1) + " / " + cards.length + " 張";
    $("#flash-due").textContent = "今日待複習 " + dueCount() + " 張";
    $("#flash-kicker").textContent = cardFlipped ? "ANSWER / 答案" : "QUESTION / 問題";
    $("#flash-content").textContent = cardFlipped ? card.a : card.q;
    $("#flash-tip").textContent = cardFlipped ? "現在評估自己是否能在不看答案時回答" : "先回憶，再點擊查看答案 ↗";
    $("#flash-face").setAttribute("aria-label", cardFlipped ? "目前顯示答案。點擊回到題目" : "目前顯示問題。點擊查看答案");
    $("#flash-actions").hidden = cardFlipped;
    $("#flash-grade").hidden = !cardFlipped;
    $("#flash-flip").textContent = cardFlipped ? "回到問題" : "查看答案";
    if (!cardFlipped && rec && Number(rec.nextDue) > Date.now()) {
      $("#flash-message").textContent = "這張卡片已排入未來複習；仍可自由練習。";
    } else {
      $("#flash-message").textContent = "先在心中回答，再打開卡片。評估後會安排下次複習。";
    }
  }
  function flipCard() { cardFlipped = !cardFlipped; renderCard(); }
  function changeCard(step) { cardIndex = (cardIndex + step + cards.length) % cards.length; cardFlipped = false; renderCard(); }
  $("#flash-face").addEventListener("click", flipCard);
  $("#flash-flip").addEventListener("click", flipCard);
  $("#flash-prev").addEventListener("click", () => changeCard(-1));
  $("#flash-next").addEventListener("click", () => changeCard(1));
  function gradeCard(good) {
    const id = cards[cardIndex].id, old = state.cardState[id];
    const interval = good ? (old && Number(old.interval) >= 1 ? Math.min(Number(old.interval) * 2 + 1,30) : 3) : 1;
    state.cardState[id] = {interval,nextDue:Date.now() + interval * DAY_MS,gradedAt:new Date().toISOString()};
    state.reviews++;
    save();
    notify(good ? "已安排 " + interval + " 天後再複習。" : "已安排明天再複習。");
    const nextDue = cards.findIndex((c,i) => i !== cardIndex && (!state.cardState[c.id] || Number(state.cardState[c.id].nextDue) <= Date.now()));
    if (nextDue >= 0) { cardIndex = nextDue; cardFlipped = false; renderCard(); }
    else changeCard(1);
  }
  $("#flash-again").addEventListener("click", () => gradeCard(false));
  $("#flash-good").addEventListener("click", () => gradeCard(true));
  renderCard();

  // Quiz is designed to challenge recall, not to display answer keys up front.
  let quizIndex = 0, quizScore = 0, quizAnswered = false;
  const quizArea = $("#quiz-area");
  function renderQuiz() {
    $("#quiz-feedback").hidden = true;
    $("#quiz-next").hidden = true;
    quizAnswered = false;
    if (quizIndex >= quiz.length) {
      $("#quiz-progress").textContent = "COMPLETE / 已完成";
      $("#quiz-question").textContent = "你答對了 " + quizScore + " / " + quiz.length + " 題";
      $("#quiz-choices").replaceChildren();
      $("#quiz-feedback").textContent = "答對不代表已經永久掌握；可以過幾天再不看提示重做。錯誤是找出下一步的線索。";
      $("#quiz-feedback").classList.remove("bad");
      $("#quiz-feedback").hidden = false;
      $("#quiz-next").textContent = "重新測驗";
      $("#quiz-next").hidden = false;
      return;
    }
    const question = quiz[quizIndex];
    $("#quiz-progress").textContent = "問題 " + (quizIndex+1) + " / " + quiz.length;
    $("#quiz-question").textContent = question.q;
    const holder = $("#quiz-choices");
    holder.replaceChildren();
    question.options.forEach((choice,index) => {
      const button = document.createElement("button");
      button.className = "quiz-choice";
      button.type = "button";
      button.textContent = String.fromCharCode(65 + index) + ". " + choice;
      button.addEventListener("click", () => answerQuiz(index));
      holder.appendChild(button);
    });
  }
  function answerQuiz(answer) {
    if (quizAnswered || quizIndex >= quiz.length) return;
    quizAnswered = true;
    const q = quiz[quizIndex], correct = answer === q.answer;
    if (correct) quizScore++;
    $$(".quiz-choice",quizArea).forEach((button,i) => {
      button.disabled = true;
      if (i === q.answer) button.classList.add("correct");
      else if (i === answer) button.classList.add("incorrect");
    });
    const fb = $("#quiz-feedback");
    fb.textContent = (correct ? "回答正確。 " : "這題再想想。 ") + q.why;
    fb.classList.toggle("bad", !correct);
    fb.hidden = false;
    $("#quiz-next").textContent = quizIndex === quiz.length - 1 ? "查看測驗結果" : "下一題";
    $("#quiz-next").hidden = false;
  }
  $("#quiz-next").addEventListener("click", () => {
    if (quizIndex >= quiz.length) { quizIndex=0; quizScore=0; }
    else quizIndex++;
    renderQuiz();
  });
  renderQuiz();

  // Mistake journal: DOM textContent, never HTML-inject user data.
  function drawMistakes() {
    const holder = $("#mistake-list");
    holder.replaceChildren();
    if (!state.mistakes.length) {
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = "還沒有紀錄。第一個錯誤，也可以成為進步的起點。";
      holder.append(p);
      return;
    }
    state.mistakes.forEach(m => {
      const section = document.createElement("div");
      section.className = "mistake-item";
      const top = document.createElement("div");top.className = "mistake-top";
      const subject = document.createElement("span");subject.textContent = m.subject + " · " + (m.date || "");
      const del = document.createElement("button");del.type="button";del.textContent="刪除";del.setAttribute("aria-label","刪除這筆錯題紀錄");
      del.addEventListener("click", () => {state.mistakes=state.mistakes.filter(item=>item.id!==m.id);save();drawMistakes();notify("已刪除這筆紀錄。");});
      top.append(subject,del);
      const title = document.createElement("strong");title.textContent=m.problem;
      const body=document.createElement("p");body.textContent="下一步｜"+m.fix;
      section.append(top,title,body);holder.append(section);
    });
  }
  $("#mistake-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const subject = form.elements.namedItem("subject").value;
    const problem = form.elements.namedItem("problem").value.trim();
    const fix = form.elements.namedItem("fix").value.trim();
    if (!problem || !fix) return;
    state.mistakes.unshift({id:String(Date.now())+Math.random().toString(36).slice(2,6),subject,problem,fix,date:new Date().toLocaleDateString("zh-TW")});
    state.mistakes=state.mistakes.slice(0,100);
    save();drawMistakes();form.reset();notify("已記錄學習盲點。下次不看答案，再試一次。");
  });
  drawMistakes();

  // Seven-day experiment: completion is opt-in and starts blank.
  $$("[data-day-check]").forEach(input => input.addEventListener("change", event => {
    const i=Number(event.target.dataset.dayCheck);
    state.days[i]=event.target.checked;
    save();
    if (state.days[i]) notify("DAY "+String(i+1).padStart(2,"0")+" 已標記完成。");
  }));
  function loadJournal() {
    const day=$("#journal-day").value;
    $("#journal-text").value=typeof state.journals[day]==="string"?state.journals[day]:"";
    $("#journal-status").textContent="";
  }
  $("#journal-day").addEventListener("change",loadJournal);
  $("#journal-form").addEventListener("submit",event=>{
    event.preventDefault();
    const day=$("#journal-day").value;
    state.journals[day]=$("#journal-text").value.trim();
    save();
    $("#journal-status").textContent="已儲存 DAY "+(Number(day)+1)+" 的反思";
    notify("反思已儲存在本機。");
  });
  loadJournal();updateStats();

  // Data portability: native JSON download, with no network request.
  $("#export-data").addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),format:"learning-lab-v1",data:state},null,2)],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="learning-lab-records-"+new Date().toISOString().slice(0,10)+".json";
    document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    notify("已下載本機學習紀錄。");
  });
})();