(function () {
  // Время Иркутска: UTC+8
  var START = new Date('2026-11-11T17:30:00+08:00').getTime();
  var END = new Date('2026-11-11T23:00:00+08:00').getTime();

  function plural(n, forms) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }
  var FORMS = {
    d: ['день', 'дня', 'дней'],
    h: ['час', 'часа', 'часов'],
    m: ['минута', 'минуты', 'минут'],
    s: ['секунда', 'секунды', 'секунд']
  };
  var timer = document.getElementById('timer');
  var done = document.getElementById('timerDone');
  var nums = {}, lbls = {};
  ['d', 'h', 'm', 's'].forEach(function (k) {
    nums[k] = timer.querySelector('[data-k="' + k + '"]');
    lbls[k] = timer.querySelector('[data-l="' + k + '"]');
  });

  function tick() {
    var diff = START - Date.now();
    if (diff <= 0) {
      timer.hidden = true;
      done.hidden = false;
      done.textContent = Date.now() < END
        ? 'Праздник уже начался — мы вас ждём!'
        : 'Спасибо, что были с нами в этот день!';
      return false;
    }
    var s = Math.floor(diff / 1000);
    var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (var k in v) {
      var t = k === 'd' ? String(v[k]) : String(v[k]).padStart(2, '0');
      if (nums[k].textContent !== t) nums[k].textContent = t;
      lbls[k].textContent = plural(v[k], FORMS[k]);
    }
    return true;
  }
  if (tick()) {
    var iv = setInterval(function () { if (!tick()) clearInterval(iv); }, 1000);
  }

  // Персональное приглашение: ?guest=Имя
  try {
    var g = new URLSearchParams(location.search).get('guest');
    if (g) {
      g = g.trim().slice(0, 40);
      document.getElementById('guestName').textContent = g;
    }
  } catch (e) {}

  // Файл календаря .ics
  document.getElementById('icsBtn').addEventListener('click', function (e) {
    e.preventDefault();
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Anna&Fedor//Wedding//RU', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:anna-fedor-20261111@wedding',
      'DTSTAMP:20261025T000000Z',
      'DTSTART:20261111T093000Z',
      'DTEND:20261111T150000Z',
      'SUMMARY:Свадьба Анны и Фёдора',
      'LOCATION:Ресторан «Чкалов»\\, Иркутск\\, ул. Ширямова\\, 6',
      'DESCRIPTION:Дресс-код: вечерний. Мы вас очень ждём!',
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Завтра свадьба Анны и Фёдора', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'svadba-anna-fedor.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  // Плавное появление
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
