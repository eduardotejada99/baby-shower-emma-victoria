const { test } = require('node:test');
const assert = require('node:assert');
const { calculateTimeRemaining, generateGoogleCalendarUrl, formatWhatsAppRsvpMessage } = require('../js/utils.js');

test('calculateTimeRemaining calcula correctamente la diferencia de tiempo', () => {
  const now = new Date('2026-10-01T10:00:00Z');
  const target = new Date('2026-10-03T14:30:15Z'); // 2 días, 4 horas, 30 minutos, 15 segundos

  const result = calculateTimeRemaining(target, now);
  assert.strictEqual(result.days, 2);
  assert.strictEqual(result.hours, 4);
  assert.strictEqual(result.minutes, 30);
  assert.strictEqual(result.seconds, 15);
  assert.strictEqual(result.isExpired, false);
});

test('calculateTimeRemaining marca isExpired true si la fecha ya pasó', () => {
  const now = new Date('2026-11-01T00:00:00Z');
  const target = new Date('2026-10-24T16:00:00Z');

  const result = calculateTimeRemaining(target, now);
  assert.strictEqual(result.isExpired, true);
  assert.strictEqual(result.days, 0);
  assert.strictEqual(result.hours, 0);
  assert.strictEqual(result.minutes, 0);
  assert.strictEqual(result.seconds, 0);
});

test('generateGoogleCalendarUrl genera el enlace correcto con parámetros codificados', () => {
  const url = generateGoogleCalendarUrl({
    title: 'Baby Shower de Emma Victoria',
    details: 'Acompáñanos a celebrar la llegada de nuestra pequeña princesa',
    location: 'Jardín de Ensueño Las Rosas',
    startIso: '20261024T210000Z',
    endIso: '20261025T010000Z'
  });

  assert.ok(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
  assert.ok(url.includes('Emma+Victoria') || url.includes('Emma%20Victoria'));
});

test('formatWhatsAppRsvpMessage genera el mensaje formateado para enviar a WhatsApp', () => {
  const link = formatWhatsAppRsvpMessage({
    phone: '51999999999',
    guestName: 'Familia Perez',
    attending: 'si',
    passes: 2,
    wishes: '¡Muchas felicidades y bendiciones!'
  });

  assert.ok(link.startsWith('https://wa.me/51999999999?text='));
  const decoded = decodeURIComponent(link);
  assert.ok(decoded.includes('Familia Perez'));
  assert.ok(decoded.includes('Confirmación de Asistencia'));
  assert.ok(decoded.includes('Emma Victoria'));
  assert.ok(decoded.includes('Muchas felicidades y bendiciones'));
});
