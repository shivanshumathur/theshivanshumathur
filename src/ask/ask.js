(function () {
  var overlay = document.getElementById('ask-overlay');
  if (!overlay) return;

  var orbBtn = document.getElementById('ask-orb');
  var dockBtn = document.getElementById('open-ask');
  var statusEl = document.getElementById('ask-status');
  var userEl = document.getElementById('ask-user');
  var replyEl = document.getElementById('ask-reply');
  var input = document.getElementById('ask-input');
  var micBtn = document.getElementById('ask-mic');
  var speakerBtn = document.getElementById('ask-speaker');
  var cardsEl = document.getElementById('ask-cards');
  var chips = overlay.querySelectorAll('[data-ask]');

  var SOUND_KEY = 'ask-sound';
  var soundOn = localStorage.getItem(SOUND_KEY) === '1';
  var state = 'idle';
  var recognizing = false;
  var holdTimer = null;
  var holding = false;
  var suppressDockClick = false;
  var rec = null;
  var finalTranscript = '';
  var speakToken = 0;

  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  var canListen = !!Rec;

  function isLocked() {
    return document.body.classList.contains('is-locked');
  }

  function setSound(on) {
    soundOn = !!on;
    try { localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0'); } catch (e) {}
    if (speakerBtn) {
      speakerBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      speakerBtn.title = soundOn ? 'Turn voice off' : 'Turn voice on';
      speakerBtn.setAttribute('aria-label', speakerBtn.title);
      speakerBtn.classList.toggle('is-off', !soundOn);
    }
    if (!soundOn) stopSpeaking();
  }

  function setPlaceholder() {
    if (!input) return;
    if (state === 'listening') input.placeholder = 'Listening…';
    else if (state === 'thinking') input.placeholder = 'Thinking…';
    else input.placeholder = 'Type to Ask';
  }

  function setState(next) {
    state = next;
    overlay.setAttribute('data-state', next);
    if (dockBtn) dockBtn.classList.toggle('ask-dock-live', overlay.classList.contains('open') && next !== 'idle');
    if (statusEl) {
      statusEl.textContent = next === 'listening' ? 'Listening…' : next === 'thinking' ? 'Thinking…' : '';
    }
    setPlaceholder();
  }

  function stopSpeaking() {
    speakToken += 1;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function pickSystemVoice() {
    if (!window.speechSynthesis) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    var female = /veena|heera|lekha|neerja/i;
    var i;
    for (i = 0; i < voices.length; i++) {
      if (/IN/i.test(voices[i].lang || '') && female.test(voices[i].name || '')) return voices[i];
    }
    for (i = 0; i < voices.length; i++) {
      if (/en(-|_)IN/i.test(voices[i].lang || '')) return voices[i];
    }
    return null;
  }

  function speak(text, onDone) {
    if (!soundOn || !text || !window.speechSynthesis) {
      if (onDone) onDone();
      return;
    }
    stopSpeaking();
    var token = speakToken;
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    var voice = pickSystemVoice();
    if (voice) utter.voice = voice;
    utter.rate = 1.02;
    utter.onend = function () {
      if (token === speakToken && onDone) onDone();
    };
    utter.onerror = function () {
      if (token === speakToken && onDone) onDone();
    };
    setState('speaking');
    window.speechSynthesis.speak(utter);
  }

  function runAction(action) {
    var os = window.PersonalOS || {};
    var c = (window.AskKnowledge && window.AskKnowledge.contact) || {};

    if (action === 'open_work') {
      if (typeof os.requestPortfolio === 'function') os.requestPortfolio('dock');
      return;
    }
    if (action === 'open_forge' || action === 'open_finance') {
      var id = action === 'open_forge' ? 'forge-volt' : 'novartis-finplan';
      if (typeof os.openCaseStudy === 'function') {
        var opened = os.openCaseStudy(id);
        if (!opened && typeof os.requestPortfolio === 'function') {
          os.requestPortfolio('dock');
        }
      } else if (typeof os.requestPortfolio === 'function') {
        os.requestPortfolio('dock');
      }
      return;
    }
    if (action === 'open_ailab') {
      window.location.href = '/ai-lab/';
      return;
    }
    if (action === 'open_mail') {
      window.location.href = 'mailto:' + (c.email || 'ershivanshumathur@gmail.com');
      return;
    }
    if (action === 'open_calendly') {
      window.open(c.calendly || 'https://calendly.com/shivanshu-mthr8/30min', '_blank', 'noopener');
      return;
    }
    if (action === 'open_linkedin') {
      window.open(c.linkedin || 'https://www.linkedin.com/in/shivanshumathur/', '_blank', 'noopener');
      return;
    }
    if (action === 'theme_dark' && typeof os.setTheme === 'function') os.setTheme('dark');
    if (action === 'theme_light' && typeof os.setTheme === 'function') os.setTheme('light');
    if (action === 'theme_toggle' && typeof os.setTheme === 'function') {
      os.setTheme(typeof os.getTheme === 'function' && os.getTheme() === 'light' ? 'dark' : 'light');
    }
  }

  function clearCards() {
    if (!cardsEl) return;
    cardsEl.innerHTML = '';
    cardsEl.hidden = true;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderCards(cards) {
    clearCards();
    if (!cardsEl || !cards || !cards.length) return;
    cards.forEach(function (card) {
      var wrap = el('div', 'ask-card ask-glass');
      if (card.image) {
        var img = el('img', 'ask-card-media');
        img.src = card.image;
        img.alt = card.title || '';
        wrap.appendChild(img);
      }
      var body = el('div', 'ask-card-body');
      if (card.type === 'metrics') body.appendChild(el('div', 'ask-card-kicker', card.title || 'Impact'));
      else if (card.title) body.appendChild(el('div', 'ask-card-title', card.title));
      if (card.subtitle) body.appendChild(el('div', 'ask-card-sub', card.subtitle));
      if (card.meta) body.appendChild(el('div', 'ask-card-meta', card.meta));
      if (card.metrics && card.metrics.length) {
        var grid = el('div', 'ask-card-metrics');
        card.metrics.forEach(function (m) {
          var cell = el('div', 'ask-metric');
          cell.appendChild(el('span', 'ask-metric-value', m.value));
          cell.appendChild(el('span', 'ask-metric-label', m.label));
          grid.appendChild(cell);
        });
        body.appendChild(grid);
      }
      if (card.steps && card.steps.length) {
        var list = el('ol', 'ask-card-steps');
        card.steps.forEach(function (step) {
          list.appendChild(el('li', '', step));
        });
        body.appendChild(list);
      }
      if (card.cta && card.cta.action) {
        var row = el('div', 'ask-card-cta');
        var btn = el('button', 'ask-card-btn', card.cta.label || 'Open');
        btn.type = 'button';
        btn.addEventListener('click', function () { runAction(card.cta.action); });
        row.appendChild(btn);
        body.appendChild(row);
      }
      if (card.actions && card.actions.length) {
        var actions = el('div', 'ask-card-actions');
        card.actions.forEach(function (a, i) {
          var b = el('button', 'ask-card-btn' + (i ? ' ghost' : ''), a.label);
          b.type = 'button';
          b.addEventListener('click', function () { runAction(a.action); });
          actions.appendChild(b);
        });
        body.appendChild(actions);
      }
      wrap.appendChild(body);
      cardsEl.appendChild(wrap);
    });
    cardsEl.hidden = false;
  }

  function applyResult(result) {
    result = result || {};
    if (replyEl) {
      replyEl.textContent = result.show || result.speak || '';
      replyEl.classList.toggle('is-refuse', !!result.refuse);
    }
    renderCards(result.cards);
    overlay.classList.add('is-answered');
    setState(result.refuse ? 'refuse' : 'idle');

    speak(result.speak, function () {
      if (overlay.classList.contains('open') && state === 'speaking') setState('idle');
    });

    var action = result.action;
    var hasCta = result.cards && result.cards.some(function (c) {
      return (c.cta && c.cta.action) || (c.actions && c.actions.length);
    });
    var auto = action && (!hasCta || action.indexOf('theme') === 0);
    if (auto) {
      var shouldClose = /open_/.test(action) && action.indexOf('theme') !== 0;
      window.setTimeout(function () {
        if (shouldClose) closeAsk();
        runAction(action);
      }, action.indexOf('theme') === 0 ? 280 : 720);
    }
  }

  function localAnswer(q) {
    return window.AskKnowledge
      ? window.AskKnowledge.answer(q)
      : { speak: 'Ask is not ready.', show: '', action: null, refuse: false, cards: [] };
  }

  function respond(raw) {
    var q = String(raw || '').trim();
    if (!q) return;
    if (userEl) userEl.textContent = q;
    if (input) input.value = q;
    overlay.classList.remove('is-answered');
    setState('thinking');
    if (replyEl) {
      replyEl.textContent = '';
      replyEl.classList.remove('is-refuse');
    }
    clearCards();

    fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q })
    }).then(function (res) {
      if (!res.ok) throw new Error('ask');
      return res.json();
    }).then(applyResult).catch(function () {
      applyResult(localAnswer(q));
    });
  }

  function stopRec(andSend) {
    if (!rec || !recognizing) {
      if (andSend && finalTranscript) respond(finalTranscript);
      return;
    }
    recognizing = false;
    try { rec.stop(); } catch (e) {}
    if (andSend) {
      var text = finalTranscript.trim();
      finalTranscript = '';
      if (text) respond(text);
      else setState('idle');
    }
  }

  function startRec() {
    if (!canListen || recognizing) return;
    stopSpeaking();
    finalTranscript = '';
    try {
      rec = new Rec();
      rec.lang = 'en-IN';
      rec.interimResults = true;
      rec.continuous = true;
      rec.onresult = function (ev) {
        var interim = '';
        var fin = '';
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          var piece = ev.results[i][0].transcript;
          if (ev.results[i].isFinal) fin += piece;
          else interim += piece;
        }
        if (fin) finalTranscript = (finalTranscript + ' ' + fin).trim();
        var live = (finalTranscript + ' ' + interim).trim();
        if (userEl) userEl.textContent = live;
        if (input) input.value = live;
      };
      rec.onerror = function () {
        recognizing = false;
        if (state === 'listening') setState('idle');
      };
      rec.onend = function () {
        recognizing = false;
        if (holding) {
          try { rec.start(); recognizing = true; } catch (e) {}
        }
      };
      rec.start();
      recognizing = true;
      setState('listening');
    } catch (err) {
      recognizing = false;
      setState('idle');
      if (input) input.focus();
    }
  }

  function openAsk(opts) {
    if (isLocked()) return;
    opts = opts || {};
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    if (dockBtn) dockBtn.setAttribute('aria-pressed', 'true');
    if (!opts.keepText) {
      overlay.classList.remove('is-answered');
      if (userEl) userEl.textContent = '';
      if (input && !opts.listen) input.value = '';
      if (replyEl) {
        replyEl.textContent = '';
        replyEl.classList.remove('is-refuse');
      }
      clearCards();
    }
    setState(opts.listen ? 'listening' : 'idle');
    if (opts.listen) startRec();
    else if (input && !opts.skipFocus) {
      window.setTimeout(function () { input.focus(); }, 80);
    }
  }

  function closeAsk() {
    holding = false;
    stopRec(false);
    stopSpeaking();
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (dockBtn) {
      dockBtn.setAttribute('aria-pressed', 'false');
      dockBtn.classList.remove('ask-dock-live');
    }
    setState('idle');
  }

  function toggleAsk() {
    if (overlay.classList.contains('open')) closeAsk();
    else openAsk();
  }

  function submitInput() {
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    respond(text);
  }

  /* Pointer: tap toggles listen / hold talks */
  function bindHold(el, fromDock) {
    if (!el) return;
    el.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      if (!fromDock) e.preventDefault();
      holding = true;
      holdTimer = window.setTimeout(function () {
        if (!holding) return;
        suppressDockClick = true;
        if (fromDock && !overlay.classList.contains('open')) {
          openAsk({ listen: true, skipFocus: true });
        } else {
          startRec();
        }
      }, 180);
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    function endHold() {
      if (!holding) return;
      var wasListening = recognizing;
      holding = false;
      window.clearTimeout(holdTimer);
      if (wasListening) {
        suppressDockClick = true;
        stopRec(true);
      } else if (!fromDock && canListen && state !== 'thinking') {
        if (recognizing) stopRec(true);
        else startRec();
      }
    }
    el.addEventListener('pointerup', endHold);
    el.addEventListener('pointercancel', endHold);
    el.addEventListener('lostpointercapture', function () {
      if (holding) endHold();
    });
  }

  bindHold(orbBtn, false);
  bindHold(dockBtn, true);

  if (dockBtn) {
    dockBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (suppressDockClick) {
        suppressDockClick = false;
        return;
      }
      if (overlay.classList.contains('open')) closeAsk();
      else openAsk();
    });
  }

  overlay.querySelector('.ask-scrim').addEventListener('click', closeAsk);

  if (micBtn) {
    micBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!canListen) {
        if (input) input.focus();
        return;
      }
      if (recognizing) stopRec(true);
      else startRec();
    });
  }
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitInput();
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      respond(chip.getAttribute('data-ask'));
    });
  });

  if (speakerBtn) {
    speakerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setSound(!soundOn);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (isLocked()) return;
    var meta = e.metaKey || e.ctrlKey;
    if (meta && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggleAsk();
      return;
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.preventDefault();
      e.stopPropagation();
      closeAsk();
    }
  }, true);

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
      window.speechSynthesis.getVoices();
    };
  }

  setSound(soundOn);
  setState('idle');
})();
