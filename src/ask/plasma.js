/* Plasma globe — glass, few tendrils, quiet idle */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var globes = [];
  var gid = 0;

  var BOLTS = [
    { angle: 0.38, hero: true, reach: 37, segs: 7, fork: true },
    { angle: 1.92, hero: false, reach: 29, segs: 6, fork: true },
    { angle: 3.52, hero: false, reach: 26, segs: 5, fork: true },
    { angle: 5.12, hero: false, reach: 32, segs: 6, fork: false }
  ];

  function node(name, attrs) {
    var el = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function stop(offset, color, opacity) {
    var s = node('stop', { offset: offset, 'stop-color': color });
    if (opacity != null) s.setAttribute('stop-opacity', opacity);
    return s;
  }

  function toQ(pts) {
    if (!pts.length) return '';
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    if (pts.length === 2) {
      return d + ' L' + pts[1].x.toFixed(1) + ' ' + pts[1].y.toFixed(1);
    }
    var i;
    for (i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i].x + pts[i + 1].x) / 2;
      var my = (pts[i].y + pts[i + 1].y) / 2;
      d += ' Q' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }
    var last = pts[pts.length - 1];
    d += ' T' + last.x.toFixed(1) + ' ' + last.y.toFixed(1);
    return d;
  }

  function chain(angle, t, phase, segs, reach, startR, wriggle) {
    var pts = [];
    var i;
    for (i = 0; i <= segs; i++) {
      var u = i / segs;
      var r = startR + u * reach;
      var mid = Math.exp(-Math.pow((u - 0.45) / 0.28, 2));
      var amp = reduce ? 0 : (0.9 + mid * 6.2) * wriggle;
      var side = Math.sin(t * 1.15 + phase + i * 1.4) * amp;
      side += Math.cos(t * 0.72 + phase * 1.3 + i * 0.7) * amp * 0.4;
      pts.push({
        x: 50 + Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * side,
        y: 50 + Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * side
      });
    }
    return pts;
  }

  function energy() {
    var ov = document.getElementById('ask-overlay');
    var st = ov && ov.getAttribute('data-state');
    if (st === 'listening') return 1.28;
    if (st === 'thinking') return 0.78;
    if (document.querySelector('.dock-item--ask.ask-dock-live')) return 1.12;
    return 1;
  }

  function mount(clip) {
    if (!clip || clip.querySelector('.plasma-globe')) return;
    var uid = 'pg' + (++gid);
    var svg = node('svg', { class: 'plasma-globe', viewBox: '0 0 100 100', 'aria-hidden': 'true' });
    var defs = node('defs');
    var gas = node('radialGradient', { id: uid + '-gas', cx: '50%', cy: '48%', r: '52%' });
    gas.appendChild(stop('0%', '#ff4d88', '0.18'));
    gas.appendChild(stop('32%', '#7c3aed', '0.2'));
    gas.appendChild(stop('62%', '#4c1d95', '0.08'));
    gas.appendChild(stop('100%', '#05060c', '0'));
    defs.appendChild(gas);
    svg.appendChild(defs);
    svg.appendChild(node('circle', { class: 'plasma-gas', cx: '50', cy: '50', r: '46', fill: 'url(#' + uid + '-gas)' }));

    var bolts = [];

    BOLTS.forEach(function (spec, i) {
      var grad = node('linearGradient', {
        id: uid + '-b' + i,
        gradientUnits: 'userSpaceOnUse',
        x1: '50',
        y1: '50',
        x2: '80',
        y2: '30'
      });
      grad.appendChild(stop('0%', '#f8ffff'));
      grad.appendChild(stop('26%', '#7df9ff'));
      grad.appendChild(stop('66%', '#818cf8'));
      grad.appendChild(stop('100%', spec.hero ? '#ff6b9d' : '#c4b5fd'));
      defs.appendChild(grad);

      var glow = node('path', { class: spec.hero ? 'plasma-filament-glow is-main' : 'plasma-filament-glow' });
      var midGlow = node('path', { class: spec.hero ? 'plasma-midglow is-main' : 'plasma-midglow' });
      var line = node('path', {
        class: spec.hero ? 'plasma-filament is-main' : 'plasma-filament',
        stroke: 'url(#' + uid + '-b' + i + ')'
      });
      var tip = node('circle', { class: spec.hero ? 'plasma-tip is-main' : 'plasma-tip', r: spec.hero ? '2.4' : '1.7' });
      var bGlow = node('path', { class: 'plasma-filament-glow is-branch' });
      var bLine = node('path', { class: 'plasma-filament is-branch' });
      svg.appendChild(glow);
      svg.appendChild(midGlow);
      svg.appendChild(bGlow);
      svg.appendChild(line);
      svg.appendChild(bLine);
      svg.appendChild(tip);
      bolts.push({
        glow: glow,
        midGlow: midGlow,
        line: line,
        tip: tip,
        bGlow: bGlow,
        bLine: bLine,
        grad: grad,
        angle: spec.angle,
        hero: spec.hero,
        phase: i * 1.31,
        reach: spec.reach,
        segs: spec.segs,
        fork: spec.fork
      });
    });

    svg.appendChild(node('circle', { class: 'plasma-halo', cx: '50', cy: '50', r: '8.2' }));
    svg.appendChild(node('circle', { class: 'plasma-core', cx: '50', cy: '50', r: '4.1' }));
    svg.appendChild(node('circle', { class: 'plasma-core-hot', cx: '48.9', cy: '48.6', r: '1.45' }));
    clip.appendChild(svg);

    function draw(t, e) {
      var wriggle = reduce ? 0 : (0.72 + (e - 1) * 0.55);
      bolts.forEach(function (bolt) {
        var wander = reduce ? 0 : Math.sin(t * 0.32 + bolt.phase) * 0.1;
        var a = bolt.angle + wander;
        var reach = bolt.reach * (0.92 + (e - 1) * 0.18);
        var pts = chain(a, t, bolt.phase, bolt.segs, reach, 5.2, wriggle);
        var d = toQ(pts);
        bolt.glow.setAttribute('d', d);
        bolt.line.setAttribute('d', d);
        var midFrom = Math.max(1, Math.floor((pts.length - 1) * 0.22));
        var midTo = Math.max(midFrom + 2, Math.ceil((pts.length - 1) * 0.72));
        bolt.midGlow.setAttribute('d', toQ(pts.slice(midFrom, midTo + 1)));

        var start = pts[0];
        var end = pts[pts.length - 1];
        bolt.grad.setAttribute('x1', start.x.toFixed(1));
        bolt.grad.setAttribute('y1', start.y.toFixed(1));
        bolt.grad.setAttribute('x2', end.x.toFixed(1));
        bolt.grad.setAttribute('y2', end.y.toFixed(1));

        var hitsGlass = reach > 31;
        bolt.tip.setAttribute('cx', end.x.toFixed(1));
        bolt.tip.setAttribute('cy', end.y.toFixed(1));
        bolt.tip.setAttribute('opacity', hitsGlass
          ? (reduce ? '0.7' : (0.35 + Math.abs(Math.sin(t * 1.35 + bolt.phase)) * 0.4 + (e - 1) * 0.15).toFixed(2))
          : '0');

        if (bolt.fork) {
          var from = pts[Math.max(1, Math.round((pts.length - 1) * 0.44))];
          var forkA = a + (reduce ? 0.42 : 0.48 + Math.sin(t * 0.95 + bolt.phase) * 0.28);
          var forkPts = [
            from,
            {
              x: from.x + Math.cos(forkA) * 8 + (reduce ? 0 : Math.sin(t * 1.35 + bolt.phase) * 2.2),
              y: from.y + Math.sin(forkA) * 8 + (reduce ? 0 : Math.cos(t * 1.15 + bolt.phase) * 2.2)
            },
            {
              x: from.x + Math.cos(forkA + 0.18) * 15 + (reduce ? 0 : Math.sin(t * 0.8 + bolt.phase) * 1.4),
              y: from.y + Math.sin(forkA + 0.18) * 15 + (reduce ? 0 : Math.cos(t * 0.7 + bolt.phase) * 1.4)
            }
          ];
          var bd = toQ(forkPts);
          bolt.bGlow.setAttribute('d', bd);
          bolt.bLine.setAttribute('d', bd);
          bolt.bLine.setAttribute('opacity', reduce ? '0.4' : (0.22 + Math.abs(Math.sin(t * 1.1 + bolt.phase)) * 0.28).toFixed(2));
        } else {
          bolt.bGlow.setAttribute('d', '');
          bolt.bLine.setAttribute('d', '');
        }

        if (!reduce) {
          var base = bolt.hero ? 0.82 : 0.58;
          var flick = base + Math.sin(t * 1.25 + bolt.phase * 1.6) * 0.1 + (e - 1) * 0.08;
          bolt.line.setAttribute('opacity', Math.max(0.4, Math.min(1, flick)).toFixed(2));
        }
      });
    }

    draw(0, 1);
    globes.push({ draw: draw });
  }

  document.querySelectorAll('.siri-orb-clip').forEach(mount);

  if (!reduce && globes.length) {
    function tick(now) {
      var e = energy();
      var t = (now / 1000) * (0.9 + (e - 1) * 0.4);
      for (var i = 0; i < globes.length; i++) globes[i].draw(t, e);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
