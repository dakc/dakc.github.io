/* Multiplication flashcard logic (1..9)
   - Adds a "attempt" mode: 20 random questions per attempt
   - Tracks attempt duration and stores the latest 5 attempts in localStorage
*/
(function(){
  const questionEl = document.getElementById('question');
  const answerInput = document.getElementById('answer');
  const submitBtn = document.getElementById('submitBtn');
  const showBtn = document.getElementById('showBtn');
  const nextBtn = document.getElementById('nextBtn');
  const startAttemptBtn = document.getElementById('startAttemptBtn');
  const modeNormalBtn = document.getElementById('modeNormalBtn');
  const modeChallengeBtn = document.getElementById('modeChallengeBtn');
  const feedbackEl = document.getElementById('feedback');
  const correctEl = document.getElementById('correct');
  const incorrectEl = document.getElementById('incorrect');
  const streakEl = document.getElementById('streak');
  const historyList = document.getElementById('historyList');
  const progressEl = document.getElementById('progress');
  const timerEl = document.getElementById('timer');
  const cardEl = document.getElementById('card');
  const cardPlaceholderEl = document.getElementById('cardPlaceholder');

  let state = {
    // global counters (non-attempt quick practice)
    correct:0,
    incorrect:0,
    streak:0,
    // store latest attempts (max 5)
    attempts: [] // {startedAt, durationSec, correct, incorrect, total, mode}
  };

  // attempt runtime state
  let inAttempt = false;
  let attemptQuestions = []; // array of {a,b}
  let attemptIndex = 0; // 0..19
  let attemptCorrect = 0;
  let attemptIncorrect = 0;
  let attemptStart = null; // ms timestamp
  let timerInterval = null;

  function rand1to9(){ return Math.floor(Math.random()*9)+1 }
  function genQuestion(){ return { a: rand1to9(), b: rand1to9() } }

  function renderQuestion(q){ questionEl.textContent = `${q.a} × ${q.b}`; }
  function clearFeedback(){ feedbackEl.textContent=''; feedbackEl.className='feedback' }

  function saveState(){ try{ localStorage.setItem('timesState', JSON.stringify(state)) }catch(e){} }
  function loadState(){ try{ const raw = localStorage.getItem('timesState'); if(raw){ state = Object.assign(state, JSON.parse(raw)) } }catch(e){} }

  function updateStats(){
    correctEl.textContent = state.correct;
    incorrectEl.textContent = state.incorrect;
    streakEl.textContent = state.streak;
    renderHistory();
  }

  function renderHistory(){
    historyList.innerHTML = '';
    state.attempts.slice().reverse().forEach(at=>{
      const li = document.createElement('li');
      const started = new Date(at.startedAt);
      const t = started.toLocaleString();
      const modeLabel = at.mode === 'attempt' ? '【挑戦】' : '【通常】';
      li.textContent = `${t} ${modeLabel} ${at.correct}/${at.total} 正解 — ${at.durationSec}s`;
      historyList.appendChild(li);
    })
  }

  function formatTimeElapsed(ms){
    const sec = Math.floor(ms/1000);
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = (sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function startTimer(){ if(timerInterval) clearInterval(timerInterval); timerInterval = setInterval(()=>{ const now = Date.now(); timerEl.textContent = formatTimeElapsed(now - attemptStart); },250); }
  function stopTimer(){ if(timerInterval) { clearInterval(timerInterval); timerInterval = null } }

  function startAttempt(){
    inAttempt = true;
    attemptQuestions = Array.from({length:20}, () => genQuestion());
    attemptIndex = 0;
    attemptCorrect = 0; attemptIncorrect = 0;
    attemptStart = Date.now();
    startAttemptBtn.disabled = true;
    startAttemptBtn.style.display = 'none'; // hide start button during attempt
    startAttemptBtn.classList.remove('pulse'); // remove animation
    submitBtn.disabled = false;
    submitBtn.classList.add('green'); // make submit button green
    nextBtn.style.display = 'none'; // hide Next in attempt
    showBtn.style.display = 'none'; // hide Show in attempt
    // hide mode toggle to prevent accidental clicks
    document.querySelector('.mode-toggle').classList.add('hidden');
    // show the card
    cardEl.style.display = '';
    cardPlaceholderEl.style.display = 'none';
    renderQuestion(attemptQuestions[attemptIndex]);
    updateProgress();
    timerEl.textContent = '00:00';
    startTimer();
    clearFeedback();
    answerInput.value = '';
    answerInput.focus();
  }

  function updateProgress(){ progressEl.textContent = `問題 ${attemptIndex+1} / ${attemptQuestions.length}`; }

  function endAttempt(){
    const durationSec = Math.round((Date.now() - attemptStart)/1000);
    const attemptRecord = { startedAt: attemptStart, durationSec, correct: attemptCorrect, incorrect: attemptIncorrect, total: attemptQuestions.length, mode: 'attempt' };
    state.attempts = (state.attempts || []).concat([attemptRecord]).slice(-5);
    state.correct += attemptCorrect;
    state.incorrect += attemptIncorrect;
    saveState();
    updateStats();
    stopTimer();
    inAttempt = false;
    startAttemptBtn.disabled = false;
    startAttemptBtn.style.display = ''; // show start button again after attempt ends
    startAttemptBtn.classList.add('pulse'); // add pulse animation
    submitBtn.classList.remove('green'); // remove green color from submit button
    // show mode toggle again
    document.querySelector('.mode-toggle').classList.remove('hidden');
    // clear input field
    answerInput.value = '';
    // show celebration in question card
    const celebrationRate = attemptCorrect / attemptQuestions.length;
    let celebrationEmoji = '🏅'; // default trophy
    if(celebrationRate >= 0.9) celebrationEmoji = '🏆'; // perfect/near perfect
    else if(celebrationRate >= 0.7) celebrationEmoji = '🥇'; // gold medal
    else if(celebrationRate >= 0.5) celebrationEmoji = '🥈'; // silver medal
    else celebrationEmoji = '🥉'; // bronze medal
    questionEl.innerHTML = `${celebrationEmoji}<br/><br/>おめでとう！<br/>挑戦完了！`;
    questionEl.style.fontSize = '2.8rem';
    if(currentMode === 'normal'){
      nextBtn.style.display = '';
      showBtn.style.display = '';
      startAttemptBtn.style.display = 'none';
      cardEl.style.display = '';
      cardPlaceholderEl.style.display = 'none';
    } else {
      nextBtn.style.display = 'none';
      showBtn.style.display = 'none';
      startAttemptBtn.style.display = '';
      cardEl.style.display = '';
      cardPlaceholderEl.style.display = 'none';
    }
    submitBtn.disabled = true;
    showBtn.disabled = true;
    modeNormalBtn.disabled = false; modeChallengeBtn.disabled = false;
    feedbackEl.textContent = `挑戦終了！ ${attemptCorrect}/${attemptQuestions.length} 正解 — ${durationSec}s`;
    feedbackEl.className = 'feedback';
  }

  function submitAnswer(){
    const raw = answerInput.value.trim();
    if(raw === ''){ feedbackEl.textContent = '数字を入力してください。'; feedbackEl.classList.add('wrong'); return }
    const num = Number(raw);
    const q = inAttempt ? attemptQuestions[attemptIndex] : genQuestion();
    const correct = q.a * q.b;
    const ok = num === correct;
    if(ok){
      feedbackEl.textContent = 'よくできたね！ 🎉'; feedbackEl.className='feedback correct';
      state.streak += 1;
      if(inAttempt) attemptCorrect += 1; else state.correct += 1;
    } else {
      feedbackEl.textContent = `ちょっと違うね — ${q.a}×${q.b} = ${correct}`; feedbackEl.className='feedback wrong';
      state.streak = 0;
      if(inAttempt) attemptIncorrect += 1; else state.incorrect += 1;
    }

    if(inAttempt){
      attemptIndex += 1;
      if(attemptIndex >= attemptQuestions.length){ endAttempt(); }
      else { renderQuestion(attemptQuestions[attemptIndex]); updateProgress(); answerInput.value = ''; answerInput.focus(); }
    } else {
      setTimeout(()=>{ const newQ = genQuestion(); renderQuestion(newQ); clearFeedback(); answerInput.value = ''; answerInput.focus(); }, 700);
    }

    saveState(); updateStats();
  }

  function showAnswer(){ const q = inAttempt ? attemptQuestions[attemptIndex] : genQuestion(); const correct = q.a * q.b; feedbackEl.textContent = `答え：${correct}`; feedbackEl.className='feedback'; }

  let currentMode = 'normal';
  function setMode(mode){ 
    if(inAttempt) return; 
    currentMode = mode; 
    if(mode === 'normal'){ 
      modeNormalBtn.classList.add('active'); 
      modeChallengeBtn.classList.remove('active'); 
      nextBtn.style.display = ''; 
      showBtn.style.display = ''; 
      startAttemptBtn.style.display = 'none'; 
      startAttemptBtn.classList.remove('pulse');
      cardEl.style.display = '';
      cardPlaceholderEl.style.display = 'none';
    } else { 
      modeNormalBtn.classList.remove('active'); 
      modeChallengeBtn.classList.add('active'); 
      nextBtn.style.display = 'none'; 
      showBtn.style.display = 'none'; 
      startAttemptBtn.style.display = ''; 
      startAttemptBtn.classList.add('pulse');
      cardEl.style.display = 'none';
      cardPlaceholderEl.style.display = '';
    } 
  }

  modeNormalBtn.addEventListener('click', ()=> setMode('normal'));
  modeChallengeBtn.addEventListener('click', ()=> setMode('attempt'));

  // events
  submitBtn.addEventListener('click', submitAnswer);
  showBtn.addEventListener('click', showAnswer);
  nextBtn.addEventListener('click', ()=>{ if(inAttempt) return; const q = genQuestion(); renderQuestion(q); clearFeedback(); answerInput.value = ''; answerInput.focus(); });
  startAttemptBtn.addEventListener('click', startAttempt);
  answerInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') submitAnswer(); });

  // init
  loadState(); renderQuestion(genQuestion()); updateStats(); progressEl.textContent = `問題 0 / 20`; timerEl.textContent = '00:00'; setMode('normal');

})();
