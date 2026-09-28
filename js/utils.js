/**
 * UTILIDADES DE TIEMPO, CALENDARIO Y MENSAJES DE WHATSAPP
 */

function padZero(num) {
  return String(num).padStart(2, '0');
}

function calculateTimeRemaining(targetDate, currentDate = new Date()) {
  const target = new Date(targetDate).getTime();
  const current = new Date(currentDate).getTime();
  const diff = target - current;

  if (diff <= 0 || isNaN(diff)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);
  const seconds = Math.floor((diff % minute) / second);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false
  };
}

function generateGoogleCalendarUrl({ title, details, location, startIso, endIso }) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = [
    `text=${encodeURIComponent(title)}`,
    `dates=${startIso}/${endIso}`,
    `details=${encodeURIComponent(details)}`,
    `location=${encodeURIComponent(location)}`
  ];
  return `${baseUrl}&${params.join('&')}`;
}

function formatWhatsAppRsvpMessage({ phone = '51999999999', guestName, attending, passes = 1, wishes = '' }) {
  const isAttending = attending === 'si';
  const attendingText = isAttending ? '¡Sí, con mucho gusto asistiré! 💖' : 'Con mucho pesar no podré asistir esta vez 💌';
  
  let message = `🌸 *Confirmación de Asistencia* 🌸\n` +
    `*Baby Shower de Sofía* ✨\n` +
    `*Familia Tejada Dávila*\n\n` +
    `👤 *Invitado / Familia:* ${guestName}\n` +
    `💌 *Asistencia:* ${attendingText}\n` +
    (isAttending ? `🎟️ *Pases / Personas:* ${passes}\n` : '');

  if (wishes && wishes.trim().length > 0) {
    message += `\n💖 *Mensaje para Sofía y sus papás (Maricielo & Arturo):*\n"${wishes.trim()}"\n`;
  }

  message += `\n¡Muchas gracias por la hermosa invitación! 🎀`;

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Compatibilidad con Node.js (tests) y Navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    padZero,
    calculateTimeRemaining,
    generateGoogleCalendarUrl,
    formatWhatsAppRsvpMessage
  };
}

if (typeof window !== 'undefined') {
  window.Utils = {
    padZero,
    calculateTimeRemaining,
    generateGoogleCalendarUrl,
    formatWhatsAppRsvpMessage
  };
}
