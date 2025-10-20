const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const bucket = getStorage().bucket();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function getMemberByTelegramId(telegram_id) {
  const snapshot = await db.collection('members')
    .where('telegram_id', '==', telegram_id.toString())
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function getMemberPrediction(memberId) {
  const snapshot = await db.collection('predictions')
    .where('assigned_to', '==', memberId)
    .where('status', '==', 'assigned')
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

function formatPrediction(prediction) {
  const numbersStr = prediction.numbers.join(', ');
  
  if (prediction.lottery_type === 'Powerball') {
    return `🎱 *Powerball*\n\nNumbers: ${numbersStr}\nPowerball: ${prediction.powerball}\n\n📅 Draw Date: ${prediction.draw_date}`;
  } else if (prediction.lottery_type === 'MegaMillions') {
    return `💰 *Mega Millions*\n\nNumbers: ${numbersStr}\nMega Ball: ${prediction.megaball}\n\n📅 Draw Date: ${prediction.draw_date}`;
  } else if (prediction.lottery_type === 'EuroMillions') {
    const starsStr = prediction.lucky_stars?.join(', ') || '';
    return `⭐ *EuroMillions*\n\nNumbers: ${numbersStr}\nLucky Stars: ${starsStr}\n\n📅 Draw Date: ${prediction.draw_date}`;
  }
  
  return `${prediction.lottery_type}: ${numbersStr}`;
}

bot.start(async (ctx) => {
  const telegram_id = ctx.from.id.toString();
  const member = await getMemberByTelegramId(telegram_id);
  
  if (member) {
    return ctx.reply(
      `✅ ¡Bienvenido de nuevo, ${ctx.from.first_name}!\n\n` +
      `Tu membresía está: *${member.membership_status}*\n\n` +
      `Usa /help para ver los comandos disponibles.`,
      { parse_mode: 'Markdown' }
    );
  }
  
  return ctx.reply(
    `🌟 *¡Bienvenido al Club Super Agent Anbel AI!*\n\n` +
    `Aún no estás registrado.\n\n` +
    `Por favor usa /register para unirte al club.`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('register', async (ctx) => {
  const telegram_id = ctx.from.id.toString();
  const existing = await getMemberByTelegramId(telegram_id);
  
  if (existing) {
    return ctx.reply('✅ ¡Ya estás registrado!');
  }
  
  const newMember = {
    telegram_id: telegram_id,
    telegram_username: ctx.from.username || '',
    first_name: ctx.from.first_name || 'Usuario',
    last_name: ctx.from.last_name || '',
    membership_status: 'inactive',
    membership_type: 'weekly',
    joined_date: new Date().toISOString(),
    total_paid: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const docRef = await db.collection('members').add(newMember);
  ctx.session = { ...ctx.session, registering: true, member_id: docRef.id };
  
  return ctx.reply(
    `✅ *¡Registro Exitoso!*\n\n` +
    `¡Bienvenido ${ctx.from.first_name}!\n\n` +
    `🎯 Para completar tu registro, elige tu método de pago preferido:\n\n` +
    `1️⃣ Zelle (recomendado - sin comisión)\n` +
    `2️⃣ Cash App (fácil y rápido)\n` +
    `3️⃣ Venmo (popular entre jóvenes)\n` +
    `4️⃣ PayPal (conocido y confiable)\n` +
    `5️⃣ Tarjeta Prepagada (para efectivo)\n` +
    `6️⃣ Remesas (si estás fuera de USA)\n\n` +
    `Responde con el *número* de tu método preferido (ejemplo: 1)\n\n` +
    `💡 Después te explicaré cómo pagar fácilmente.`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('numbers', async (ctx) => {
  const telegram_id = ctx.from.id.toString();
  const member = await getMemberByTelegramId(telegram_id);
  
  if (!member) {
    return ctx.reply('❌ No estás registrado. Usa /register primero.');
  }
  
  if (member.membership_status !== 'active') {
    return ctx.reply(
      `⚠️ *Membresía No Activa*\n\n` +
      `Tu estado actual: ${member.membership_status}\n\n` +
      `Por favor realiza un pago para activar tu membresía.\n` +
      `Usa /payment para enviar tu comprobante de pago.`,
      { parse_mode: 'Markdown' }
    );
  }
  
  const prediction = await getMemberPrediction(member.id);
  
  if (!prediction) {
    return ctx.reply(
      `⏳ *Aún No Hay Predicciones Disponibles*\n\n` +
      `Las predicciones se asignan semanalmente.\n` +
      `¡Recibirás tus números pronto!`,
      { parse_mode: 'Markdown' }
    );
  }
  
  const formattedPrediction = formatPrediction(prediction);
  
  return ctx.reply(
    `🎯 *Tu Predicción Personalizada*\n\n` +
    `${formattedPrediction}\n\n` +
    `📸 Después de comprar tu ticket, ¡usa /upload para enviar una foto!`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('upload', async (ctx) => {
  const telegram_id = ctx.from.id.toString();
  const member = await getMemberByTelegramId(telegram_id);
  
  if (!member) {
    return ctx.reply('❌ No estás registrado. Usa /register primero.');
  }
  
  if (member.membership_status !== 'active') {
    return ctx.reply('⚠️ Solo miembros activos pueden subir tickets.');
  }
  
  return ctx.reply(
    `📸 *Sube Tu Ticket*\n\n` +
    `Por favor envíame una foto de tu boleto de lotería.\n\n` +
    `¡Asegúrate de que la foto sea clara y todos los números sean visibles!`,
    { parse_mode: 'Markdown' }
  );
});

bot.on('photo', async (ctx) => {
  const telegram_id = ctx.from.id.toString();
  const member = await getMemberByTelegramId(telegram_id);
  
  if (!member) {
    return ctx.reply('❌ No estás registrado. Usa /register primero.');
  }
  
  if (member.membership_status !== 'active') {
    return ctx.reply('⚠️ Solo miembros activos pueden subir tickets.');
  }
  
  const prediction = await getMemberPrediction(member.id);
  
  if (!prediction) {
    return ctx.reply('❌ Aún no tienes una predicción asignada.');
  }
  
  try {
    await ctx.reply('⏳ Subiendo tu ticket...');
    
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    const fileName = `tickets/${member.id}/${Date.now()}.jpg`;
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });
    
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    const ticketData = {
      member_id: member.id,
      member_name: `${member.first_name} ${member.last_name || ''}`,
      telegram_id: telegram_id,
      prediction_id: prediction.id,
      prediction_numbers: prediction.numbers,
      lottery_type: prediction.lottery_type,
      photo_url: publicUrl,
      photo_id: photo.file_id,
      upload_date: new Date().toISOString(),
      draw_date: prediction.draw_date,
      verified: false,
      result: 'pending',
      created_at: new Date().toISOString(),
    };
    
    await db.collection('tickets').add(ticketData);
    
    return ctx.reply(
      `✅ *¡Ticket Subido Exitosamente!*\n\n` +
      `Tu ticket ha sido guardado y vinculado a tu predicción.\n\n` +
      `📋 Detalles:\n` +
      `Lotería: ${prediction.lottery_type}\n` +
      `Números: ${prediction.numbers.join(', ')}\n` +
      `Fecha del Sorteo: ${prediction.draw_date}\n\n` +
      `¡Buena suerte! 🍀`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error uploading ticket:', error);
    return ctx.reply('❌ Error al subir el ticket. Por favor intenta de nuevo.');
  }
});

bot.command('payment', async (ctx) => {
  return ctx.reply(
    `💰 *MÉTODOS DE PAGO - CLUB ANBEL AI*\n\n` +
    `💵 *Precios:*\n` +
    `• Semanal: $10 USD\n` +
    `• Mensual: $40 USD (¡Ahorra $10!)\n\n` +
    `📱 *OPCIONES DE PAGO:*\n\n` +
    `1️⃣ *ZELLE* ⭐ (Recomendado - Sin comisión)\n` +
    `   📧 Email: ${process.env.ZELLE_EMAIL || 'club@anbelai.com'}\n` +
    `   📱 Teléfono: ${process.env.ZELLE_PHONE || '+17867725681'}\n` +
    `   ✅ Instantáneo y gratis\n\n` +
    `2️⃣ *CASH APP* 💚 (Muy fácil)\n` +
    `   $Cashtag: $AnbelAIClub\n` +
    `   ✅ No necesitas SSN inicial\n` +
    `   ✅ Puedes usar tarjeta prepagada\n\n` +
    `3️⃣ *VENMO* 💜 (Popular)\n` +
    `   @AnbelAI-Club\n` +
    `   ✅ Social y rápido\n\n` +
    `4️⃣ *PAYPAL* 💙\n` +
    `   📧 club@anbelai.com\n` +
    `   ✅ Elige "Friends & Family" (sin comisión)\n\n` +
    `5️⃣ *TARJETA PREPAGADA* 💳\n` +
    `   Compra en: Walmart, CVS, Walgreens\n` +
    `   Luego usa Cash App o PayPal\n\n` +
    `6️⃣ *REMESAS* 🌎 (Si estás fuera de USA)\n` +
    `   Usa: Remitly, Xoom, WorldRemit\n` +
    `   Envía a: club@anbelai.com (PayPal)\n\n` +
    `📸 *DESPUÉS DE PAGAR:*\n` +
    `1. Toma captura de pantalla\n` +
    `2. Envíala como foto aquí\n` +
    `3. Escribe tu nombre completo\n\n` +
    `💡 Usa /metodos para ver guía detallada de cada método\n\n` +
    `⏱️ Verificación: 24-48 horas`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('status', async (ctx) => {
  const telegram_id = ctx.from.id.toString();
  const member = await getMemberByTelegramId(telegram_id);
  
  if (!member) {
    return ctx.reply('❌ No estás registrado. Usa /register primero.');
  }
  
  return ctx.reply(
    `👤 *Estado de Tu Membresía*\n\n` +
    `Nombre: ${member.first_name} ${member.last_name || ''}\n` +
    `Estado: *${member.membership_status}*\n` +
    `Tipo: ${member.membership_type}\n` +
    `Total Pagado: $${member.total_paid}\n` +
    `Fecha de Ingreso: ${new Date(member.joined_date).toLocaleDateString()}\n\n` +
    `${member.next_payment_due ? `⏰ Próximo Pago: ${new Date(member.next_payment_due).toLocaleDateString()}` : ''}`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('help', async (ctx) => {
  return ctx.reply(
    `📚 *Comandos Disponibles*\n\n` +
    `/start - Iniciar el bot\n` +
    `/register - Registrarte como socio\n` +
    `/numbers - Obtener tus predicciones\n` +
    `/upload - Subir foto del ticket\n` +
    `/payment - Información de pago\n` +
    `/status - Ver tu estado\n` +
    `/soporte - Información de contacto\n` +
    `/help - Mostrar este mensaje\n\n` +
    `💡 *Guía Rápida:*\n` +
    `1. Regístrate con /register\n` +
    `2. Realiza el pago y envía el comprobante\n` +
    `3. Obtén tus números con /numbers\n` +
    `4. Compra tu ticket y sube la foto\n` +
    `5. ¡Espera los resultados!\n\n` +
    `📞 ¿Necesitas ayuda? Usa /soporte`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('soporte', async (ctx) => {
  return ctx.reply(
    `📞 *Canales de Soporte*\n\n` +
    `*Para operaciones del club (registro, números, tickets):*\n` +
    `🤖 Telegram Bot (este chat)\n\n` +
    `*Para soporte directo y consultas personalizadas:*\n` +
    `📱 WhatsApp: +17867725681\n` +
    `💬 Telegram: +17867725681\n` +
    `📱 WhatsApp Alternativo: +19295909116\n\n` +
    `*Redes sociales:*\n` +
    `📘 Facebook Página: https://www.facebook.com/amarresdeamorestadosunid/\n` +
    `👥 Facebook Grupo: https://www.facebook.com/share/g/1EJebD3RPP/\n` +
    `📺 YouTube: https://www.youtube.com/@SuperAgentAnbelAI\n\n` +
    `*Email:*\n` +
    `📧 soporte@superagentanbel.com\n\n` +
    `💡 *Horario de atención:*\n` +
    `Lunes a Domingo: 9:00 AM - 9:00 PM (EST)`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('metodos', async (ctx) => {
  return ctx.reply(
    `📱 *GUÍA DE MÉTODOS DE PAGO*\n\n` +
    `Elige tu método para ver instrucciones detalladas:\n\n` +
    `1️⃣ /zelle - Guía de Zelle (recomendado)\n` +
    `2️⃣ /cashapp - Guía de Cash App\n` +
    `3️⃣ /venmo - Guía de Venmo\n` +
    `4️⃣ /paypal - Guía de PayPal\n` +
    `5️⃣ /prepaid - Tarjetas prepagadas\n` +
    `6️⃣ /remesas - Remesas internacionales\n\n` +
    `💡 Cada guía incluye:\n` +
    `• Requisitos necesarios\n` +
    `• Paso a paso con instrucciones\n` +
    `• Consejos útiles\n` +
    `• Costo y tiempo de proceso`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('zelle', async (ctx) => {
  return ctx.reply(
    `💵 *GUÍA: PAGAR CON ZELLE*\n\n` +
    `⭐ *RECOMENDADO* - Sin comisiones y instantáneo\n\n` +
    `📋 *Requisitos:*\n` +
    `✅ Cuenta bancaria en USA\n` +
    `✅ App del banco instalada\n` +
    `✅ Número de teléfono\n\n` +
    `📱 *Bancos que incluyen Zelle:*\n` +
    `• Bank of America ⭐\n` +
    `• Wells Fargo\n` +
    `• Chase\n` +
    `• PNC Bank\n` +
    `• US Bank\n` +
    `• Capital One\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `1️⃣ Abre la app de tu banco\n` +
    `2️⃣ Busca el ícono de Zelle (morado/amarillo)\n` +
    `3️⃣ Clic en "Enviar dinero"\n` +
    `4️⃣ Destinatario: +17867725681\n` +
    `5️⃣ Monto: $10.00\n` +
    `6️⃣ Mensaje: "Aporte semanal - [Tu Nombre]"\n` +
    `7️⃣ Confirmar → ¡Listo!\n\n` +
    `✅ El pago llega en menos de 1 minuto\n\n` +
    `📸 Después:\n` +
    `• Toma screenshot de confirmación\n` +
    `• Envíala aquí como foto\n` +
    `• Recibirás confirmación en 24-48h`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('cashapp', async (ctx) => {
  return ctx.reply(
    `💚 *GUÍA: PAGAR CON CASH APP*\n\n` +
    `⭐ *IDEAL* - No necesitas SSN inicial\n\n` +
    `📋 *Requisitos:*\n` +
    `✅ Teléfono USA (prepago funciona)\n` +
    `✅ Tarjeta de débito (prepagada sirve)\n` +
    `✅ Email\n\n` +
    `📥 *Descargar:*\n` +
    `• iOS: App Store → "Cash App"\n` +
    `• Android: Play Store → "Cash App"\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `*Primera vez (crear cuenta):*\n` +
    `1️⃣ Descarga Cash App\n` +
    `2️⃣ Registra tu teléfono\n` +
    `3️⃣ Crea tu $Cashtag (ej: $TuNombre)\n` +
    `4️⃣ Vincula tarjeta de débito\n` +
    `5️⃣ ¡Listo para usar!\n\n` +
    `*Para enviar el pago:*\n` +
    `1️⃣ Abre Cash App\n` +
    `2️⃣ Clic en "$" (enviar)\n` +
    `3️⃣ Busca: $AnbelAIClub\n` +
    `4️⃣ Monto: $10\n` +
    `5️⃣ Nota: "Aporte semanal"\n` +
    `6️⃣ Enviar → ¡Confirmado!\n\n` +
    `💡 *Ventajas:*\n` +
    `• No necesitas SSN al inicio\n` +
    `• Puedes usar tarjeta prepagada de tienda\n` +
    `• Instantáneo y sin comisión\n` +
    `• Interfaz en español\n\n` +
    `📸 Envía screenshot de confirmación`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('venmo', async (ctx) => {
  return ctx.reply(
    `💜 *GUÍA: PAGAR CON VENMO*\n\n` +
    `⭐ *POPULAR* - Social y rápido\n\n` +
    `📋 *Requisitos:*\n` +
    `✅ Teléfono USA\n` +
    `✅ Tarjeta de débito o cuenta bancaria\n` +
    `✅ Email\n\n` +
    `📥 *Descargar:*\n` +
    `• iOS: App Store → "Venmo"\n` +
    `• Android: Play Store → "Venmo"\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `*Primera vez:*\n` +
    `1️⃣ Descarga Venmo\n` +
    `2️⃣ Regístrate con teléfono/email\n` +
    `3️⃣ Crea tu @username\n` +
    `4️⃣ Vincula tarjeta o banco\n\n` +
    `*Para pagar:*\n` +
    `1️⃣ Busca: @AnbelAI-Club\n` +
    `2️⃣ Monto: $10\n` +
    `3️⃣ Nota: "Aporte semanal"\n` +
    `4️⃣ Enviar\n\n` +
    `💡 *Nota:*\n` +
    `Venmo es muy popular entre jóvenes latinos\n` +
    `Sin comisión para pagos básicos\n\n` +
    `📸 Envía screenshot de confirmación`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('paypal', async (ctx) => {
  return ctx.reply(
    `💙 *GUÍA: PAGAR CON PAYPAL*\n\n` +
    `⭐ *CONFIABLE* - Conocido mundialmente\n\n` +
    `📋 *Requisitos:*\n` +
    `✅ Email\n` +
    `✅ Teléfono USA\n` +
    `✅ Tarjeta de débito o cuenta bancaria\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `*Si NO tienes cuenta:*\n` +
    `1️⃣ Ve a PayPal.com\n` +
    `2️⃣ Clic "Sign Up" → Cuenta Personal\n` +
    `3️⃣ Registra email + teléfono\n` +
    `4️⃣ Vincula tarjeta o banco\n\n` +
    `*Para enviar pago:*\n` +
    `1️⃣ Login en PayPal\n` +
    `2️⃣ Clic "Enviar dinero"\n` +
    `3️⃣ Destinatario: club@anbelai.com\n` +
    `4️⃣ Monto: $10\n` +
    `5️⃣ Tipo: "Friends & Family" (sin comisión)\n` +
    `6️⃣ Enviar\n\n` +
    `⚠️ *IMPORTANTE:*\n` +
    `Elige "Friends & Family" para evitar comisión\n` +
    `Si eliges "Goods & Services" hay comisión 2.9%\n\n` +
    `📸 Envía screenshot de confirmación`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('prepaid', async (ctx) => {
  return ctx.reply(
    `💳 *GUÍA: TARJETAS PREPAGADAS*\n\n` +
    `⭐ *IDEAL* - Si trabajas en efectivo\n\n` +
    `🏪 *Dónde comprar:*\n` +
    `• Walmart (Bluebird - GRATIS)\n` +
    `• CVS / Walgreens\n` +
    `• 7-Eleven\n` +
    `• Dollar General\n\n` +
    `📋 *Tarjetas recomendadas:*\n` +
    `1. Bluebird by Amex ($0)\n` +
    `2. Green Dot ($5.95)\n` +
    `3. NetSpend ($4.95)\n` +
    `4. Vanilla Visa ($4.95)\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `*Paso 1: Comprar tarjeta*\n` +
    `1️⃣ Ve a Walmart, CVS o 7-Eleven\n` +
    `2️⃣ Busca sección "Gift Cards"\n` +
    `3️⃣ Compra Green Dot o Bluebird\n` +
    `4️⃣ Costo: $0-5.95\n\n` +
    `*Paso 2: Recargar efectivo*\n` +
    `1️⃣ En la misma tienda\n` +
    `2️⃣ Di: "Quiero recargar mi tarjeta"\n` +
    `3️⃣ Entrega efectivo + tarjeta\n` +
    `4️⃣ Fee: $3-5 por recarga\n\n` +
    `*Paso 3: Vincular a Cash App*\n` +
    `1️⃣ Descarga Cash App\n` +
    `2️⃣ Agrega tu tarjeta prepagada\n` +
    `3️⃣ Envía $10 a $AnbelAIClub\n\n` +
    `💡 *Costo total ejemplo:*\n` +
    `• Tarjeta: $5 (una sola vez)\n` +
    `• Recarga $50: $3\n` +
    `• Pagar club: $10 (sin fee extra)\n\n` +
    `✅ No necesitas banco ni SSN`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('remesas', async (ctx) => {
  return ctx.reply(
    `🌎 *GUÍA: REMESAS INTERNACIONALES*\n\n` +
    `⭐ *IDEAL* - Si estás fuera de USA\n\n` +
    `📱 *Apps recomendadas:*\n` +
    `1. Remitly ⭐ (la más barata)\n` +
    `2. Xoom (de PayPal)\n` +
    `3. WorldRemit\n` +
    `4. Wise (antes TransferWise)\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `*Con Remitly (ejemplo):*\n` +
    `1️⃣ Descarga app Remitly\n` +
    `2️⃣ Regístrate con tu país\n` +
    `3️⃣ Selecciona "Enviar a USA"\n` +
    `4️⃣ Monto: $10 USD\n` +
    `5️⃣ Método: PayPal\n` +
    `6️⃣ Destinatario: club@anbelai.com\n` +
    `7️⃣ Paga desde tu país\n` +
    `8️⃣ Fee: $3-8 según app\n\n` +
    `*Con Xoom (PayPal):*\n` +
    `1️⃣ Ve a xoom.com\n` +
    `2️⃣ Login con tu PayPal\n` +
    `3️⃣ Envía a USA\n` +
    `4️⃣ A cuenta PayPal del club\n\n` +
    `⏱️ *Tiempo:*\n` +
    `• Remitly: 1-2 días\n` +
    `• Xoom: Instantáneo-24h\n` +
    `• Wise: 1-3 días\n\n` +
    `💰 *Costo:*\n` +
    `Entre $3-10 USD según app\n\n` +
    `📸 Envía screenshot de confirmación`,
    { parse_mode: 'Markdown' }
  );
});

bot.launch().then(() => {
  console.log('✅ Bot de Telegram Iniciado Exitosamente!');
  console.log(`Usuario del Bot: @${bot.botInfo.username}`);
  console.log(`Soporte WhatsApp: +19295909116`);
}).catch((error) => {
  console.error('❌ Error al iniciar el bot:', error);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

