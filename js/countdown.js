/**
 * GESTOR DE CUENTA REGRESIVA Y ENLACE DE CALENDARIO
 */

(function () {
  const EVENT_DATE = '2026-10-24T16:00:00-05:00';
  const EVENT_START_ISO = '20261024T210000Z'; // UTC equivalent
  const EVENT_END_ISO = '20261025T010000Z';

  function initCountdownTimer() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const calendarBtn = document.getElementById('btn-add-calendar');

    // Configurar enlace de Google Calendar
    if (calendarBtn && window.Utils) {
      calendarBtn.href = window.Utils.generateGoogleCalendarUrl({
        title: 'Baby Shower de Emma Victoria ✨',
        details: 'Acompáñanos a celebrar la pronta llegada de nuestra princesa Emma Victoria. ¡Habrá sorpresas, música y bendiciones!',
        location: 'Jardín de Ensueño Las Rosas, Av. Los Jazmines 450, Valle Hermoso',
        startIso: EVENT_START_ISO,
        endIso: EVENT_END_ISO
      });
    }

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function update() {
      if (!window.Utils) return;
      const time = window.Utils.calculateTimeRemaining(EVENT_DATE);
      daysEl.textContent = window.Utils.padZero(time.days);
      hoursEl.textContent = window.Utils.padZero(time.hours);
      minutesEl.textContent = window.Utils.padZero(time.minutes);
      secondsEl.textContent = window.Utils.padZero(time.seconds);
    }

    update();
    setInterval(update, 1000);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCountdownTimer);
    } else {
      initCountdownTimer();
    }
  }
})();
