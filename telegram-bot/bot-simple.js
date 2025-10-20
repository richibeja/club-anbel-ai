const { Telegraf } = require('telegraf');
require('dotenv').config({ path: '.env.local' });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log('🚀 Iniciando bot de Telegram...');

// Comando /start
bot.start(async (ctx) => {
  return ctx.reply(
    `🌟 *¡Bienvenido al Club Super Agent Anbel AI!*\n\n` +
    `🎰 *Club de Predicciones de Lotería*\n` +
    `Para Latinos en Estados Unidos\n\n` +
    `🤝 *Si UNO gana, TODOS ganamos IGUAL*\n` +
    `🔍 *Sistema 100% Transparente*\n` +
    `💎 *Sin secretos, todo público*\n\n` +
    `💰 *Precios:*\n` +
    `• Semanal: $10 USD\n` +
    `• Mensual: $40 USD\n\n` +
    `📚 *Aprende Más:*\n` +
    `/comofunciona - ¿Cómo funciona? 🎯\n` +
    `/transparencia - Todo es público 🔍\n` +
    `/ejemplos - Ejemplos de premios 💰\n` +
    `/referidos - Juega gratis trayendo amigos 🎁\n\n` +
    `💳 *Únete Ahora:*\n` +
    `/register - Registrarte\n` +
    `/payment - Ver métodos de pago\n\n` +
    `👥 *Comunidad:*\n` +
    `/comunidad - Únete al grupo 📘\n\n` +
    `❓ *Ayuda:*\n` +
    `/help - Todos los comandos\n` +
    `/soporte - Contacto directo\n\n` +
    `⭐ ¡Comienza con /comofunciona!`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /help
bot.command('help', async (ctx) => {
  return ctx.reply(
    `📚 *TODOS LOS COMANDOS*\n\n` +
    `🎯 *Información del Club:*\n` +
    `/start - Inicio\n` +
    `/comofunciona - ¿Cómo funciona?\n` +
    `/transparencia - Sistema transparente 🔍\n` +
    `/ejemplos - Ejemplos de premios\n` +
    `/referidos - Gana trayendo amigos 💰\n` +
    `/beneficios - Beneficios de ser socio\n\n` +
    `💳 *Registro y Pagos:*\n` +
    `/register - Registrarte\n` +
    `/payment - Ver métodos de pago\n` +
    `/metodos - Guías de pago\n` +
    `/remesas - Guía de remesas\n` +
    `/paypal - Guía de PayPal\n\n` +
    `📊 *Mi Cuenta:*\n` +
    `/status - Mi estado\n` +
    `/numbers - Mis predicciones\n` +
    `/upload - Subir ticket\n\n` +
    `👥 *Comunidad:*\n` +
    `/comunidad - Únete al grupo y redes 📘\n\n` +
    `❓ *Soporte:*\n` +
    `/soporte - Contacto\n` +
    `/help - Este mensaje\n\n` +
    `💡 Empieza con /comofunciona`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /payment
bot.command('payment', async (ctx) => {
  return ctx.reply(
    `💰 *MÉTODOS DE PAGO - CLUB ANBEL AI*\n\n` +
    `💵 *Precios:*\n` +
    `• Semanal: $10 USD\n` +
    `• Mensual: $40 USD (¡Ahorra $10!)\n\n` +
    `📱 *ELIGE TU MÉTODO DE PAGO:*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🥇 *PAGO CON TARJETA* ⭐ RECOMENDADO\n` +
    `   Instantáneo y automático\n\n` +
    `💳 Plan Semanal ($10/semana):\n` +
    `   https://pay.hotmart.com/P102503654V?off=vwt7ox1z\n\n` +
    `💳 Plan Mensual ($40/mes) - ¡AHORRA $10!\n` +
    `   https://pay.hotmart.com/P102503654V?off=vwt7ox1z&checkoutMode=6\n\n` +
    `✅ Paga con:\n` +
    `   • Tarjeta de crédito\n` +
    `   • Tarjeta de débito\n` +
    `   • PayPal\n` +
    `✅ Activación automática\n` +
    `✅ Sin esperas\n` +
    `✅ Seguro (Hotmart)\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🥈 *REMESAS* (USA → Colombia)\n` +
    `   Si prefieres envío bancario\n\n` +
    `📱 Opciones:\n` +
    `1️⃣ REMITLY - Usa /remesas\n` +
    `2️⃣ WESTERN UNION\n` +
    `3️⃣ XOOM (PayPal)\n` +
    `4️⃣ WISE\n\n` +
    `💡 Usa /metodos para ver guía completa\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `⭐ *MEJOR OPCIÓN:*\n` +
    `Pago con tarjeta (Hotmart)\n` +
    `• Más rápido\n` +
    `• Sin comisiones extra\n` +
    `• Activación inmediata\n\n` +
    `📱 ¿Dudas? WhatsApp: +57 314 446 7389`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /metodos
bot.command('metodos', async (ctx) => {
  return ctx.reply(
    `📱 *GUÍA DE MÉTODOS DE PAGO*\n\n` +
    `Elige tu método para ver instrucciones:\n\n` +
    `/remesas - Remitly, WU, Xoom, Wise\n` +
    `/paypal - PayPal internacional\n\n` +
    `💡 Cada guía incluye:\n` +
    `• Paso a paso completo\n` +
    `• Costos y tiempos\n` +
    `• Consejos útiles`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /remesas
bot.command('remesas', async (ctx) => {
  return ctx.reply(
    `🌎 *GUÍA: REMESAS USA → COLOMBIA*\n\n` +
    `📱 *Apps recomendadas:*\n\n` +
    `1️⃣ *REMITLY* ⭐ (La mejor)\n` +
    `   • Descarga app "Remitly"\n` +
    `   • Enviar a Colombia\n` +
    `   • Destinatario: Richard Bejarano Aragon\n` +
    `   • Teléfono: +57 314 446 7389\n` +
    `   • Monto: $10 USD (o $40)\n` +
    `   • Comisión: $2-5\n` +
    `   • Tiempo: 1-2 días\n\n` +
    `2️⃣ *WESTERN UNION*\n` +
    `   • Ve a CVS, Walgreens, 7-Eleven\n` +
    `   • A: Colombia, Bogotá\n` +
    `   • Nombre: Richard Bejarano Aragon\n` +
    `   • Doc: 93419093\n` +
    `   • Comisión: $5-10\n` +
    `   • Tiempo: Minutos-24h\n\n` +
    `3️⃣ *XOOM* (de PayPal)\n` +
    `   • xoom.com\n` +
    `   • Login con tu PayPal\n` +
    `   • Comisión: $3-8\n\n` +
    `4️⃣ *WISE*\n` +
    `   • wise.com\n` +
    `   • Más barato: $1-5\n` +
    `   • Tiempo: 1-3 días\n\n` +
    `📸 *Después de pagar:*\n` +
    `1. Toma captura del comprobante\n` +
    `2. Envíala aquí como foto\n` +
    `3. Escribe tu nombre completo\n\n` +
    `⏰ Verificación: 24-48 horas`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /paypal
bot.command('paypal', async (ctx) => {
  return ctx.reply(
    `💙 *GUÍA: PAGAR CON PAYPAL*\n\n` +
    `📧 *Enviar a:*\n` +
    `richardbejarano52@gmail.com\n\n` +
    `🔹 *PASO A PASO:*\n\n` +
    `1️⃣ Abre tu PayPal\n` +
    `2️⃣ Clic "Enviar dinero"\n` +
    `3️⃣ A: richardbejarano52@gmail.com\n` +
    `4️⃣ Monto: $10 (o $40 mensual)\n` +
    `5️⃣ Tipo: "Friends & Family"\n` +
    `6️⃣ Confirmar\n\n` +
    `⚠️ *Comisión:*\n` +
    `PayPal internacional: ~5%\n` +
    `Total: $10.50 aprox\n\n` +
    `💡 *Mejor opción:*\n` +
    `Usa Remitly o Western Union\n` +
    `Comisiones más bajas\n\n` +
    `📸 Envía comprobante como foto`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /comofunciona
bot.command('comofunciona', async (ctx) => {
  return ctx.reply(
    `🎯 *¿CÓMO FUNCIONA EL CLUB?*\n\n` +
    `Es muy simple:\n\n` +
    `1️⃣ *TE REGISTRAS*\n` +
    `   Usa /register aquí en el bot\n\n` +
    `2️⃣ *PAGAS TU MEMBRESÍA*\n` +
    `   $10 semanal o $40 mensual\n` +
    `   Por Remitly, Western Union, etc.\n\n` +
    `3️⃣ *RECIBES TUS NÚMEROS*\n` +
    `   Predicciones únicas cada semana\n` +
    `   Solo para ti, nadie más las tiene\n\n` +
    `4️⃣ *COMPRAS TU TICKET*\n` +
    `   Con los números que te dimos\n` +
    `   En cualquier tienda autorizada\n\n` +
    `5️⃣ *SUBES FOTO DEL TICKET*\n` +
    `   Aquí en el bot con /upload\n` +
    `   Para tener comprobante\n\n` +
    `6️⃣ *ESPERAMOS EL SORTEO*\n` +
    `   Powerball, Mega Millions, etc.\n\n` +
    `7️⃣ *SI ALGUIEN GANA...*\n` +
    `   ¡TODOS ganamos en partes IGUALES!\n` +
    `   Ejemplo: $10,000 ÷ 50 socios = $200 c/u\n\n` +
    `🤝 *TODOS SOMOS IGUALES*\n` +
    `No importa quién tenga el ticket ganador,\n` +
    `TODOS recibimos la misma cantidad.\n\n` +
    `💡 Usa /ejemplos para ver premios reales`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /ejemplos
bot.command('ejemplos', async (ctx) => {
  return ctx.reply(
    `💰 *EJEMPLOS DE PREMIOS REALES*\n\n` +
    `🤝 Recuerda: TODOS ganan lo mismo\n\n` +
    `📊 *Ejemplo 1:*\n` +
    `Premio: $10,000\n` +
    `Socios: 50\n` +
    `Cada uno: $10,000 ÷ 50 = *$200*\n\n` +
    `📊 *Ejemplo 2:*\n` +
    `Premio: $50,000\n` +
    `Socios: 100\n` +
    `Cada uno: $50,000 ÷ 100 = *$500*\n\n` +
    `📊 *Ejemplo 3:*\n` +
    `Premio: $100,000\n` +
    `Socios: 200\n` +
    `Cada uno: $100,000 ÷ 200 = *$500*\n\n` +
    `📊 *Ejemplo 4 (Jackpot):*\n` +
    `Premio: $1,000,000\n` +
    `Socios: 200\n` +
    `Cada uno: $1,000,000 ÷ 200 = *$5,000*\n\n` +
    `🎯 *Mientras más socios:*\n` +
    `✅ Más tickets compramos\n` +
    `✅ Más oportunidades de ganar\n` +
    `✅ Más premios para todos\n\n` +
    `💡 ¡Trae amigos! Usa /referidos`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /referidos
bot.command('referidos', async (ctx) => {
  return ctx.reply(
    `🎁 *PROGRAMA DE REFERIDOS*\n\n` +
    `💡 *¡JUEGA GRATIS TRAYENDO AMIGOS!*\n\n` +
    `🔥 *Beneficios:*\n\n` +
    `👥 *Trae 3 amigos* → 1 semana GRATIS 🎉\n` +
    `   Valor: $10 USD\n\n` +
    `👥 *Trae 5 amigos* → 1 mes GRATIS 🎉\n` +
    `   Valor: $40 USD\n\n` +
    `👥 *Trae 10 amigos* → 3 meses GRATIS 🎉\n` +
    `   Valor: $120 USD\n\n` +
    `👥 *Trae 20 amigos* → 6 meses GRATIS 🎉\n` +
    `   Valor: $240 USD\n\n` +
    `👥 *Trae 50+ amigos* → Membresía GRATIS de por vida 🔥\n` +
    `   Valor: $480+ USD/año\n\n` +
    `📊 *¿Por qué traer amigos?*\n` +
    `✅ Tú juegas gratis\n` +
    `✅ Más socios = Más tickets\n` +
    `✅ Más chances de ganar\n` +
    `✅ Premios más grandes\n` +
    `✅ Comunidad más fuerte\n\n` +
    `🚀 *Cómo Funciona:*\n\n` +
    `1️⃣ Comparte el link del bot:\n` +
    `   https://t.me/SuperAgentAnbelBot\n\n` +
    `2️⃣ Dile a tu amigo:\n` +
    `   "Cuando te registres, menciona mi nombre"\n\n` +
    `3️⃣ Tu amigo se registra:\n` +
    `   Envía tu nombre cuando pague\n\n` +
    `4️⃣ Verificamos el pago:\n` +
    `   Contamos el referido para ti\n\n` +
    `5️⃣ Alcanzas 3, 5, 10, 20 referidos:\n` +
    `   ¡Recibes semanas/meses GRATIS!\n\n` +
    `🎯 *Ejemplo Real:*\n` +
    `Invitas a 5 amigos:\n` +
    `→ 1 mes gratis ($40 ahorrado)\n` +
    `→ 5 amigos más chances de ganar\n` +
    `→ ¡Win-win para todos!\n\n` +
    `💪 ¡Empieza a compartir el link!\n\n` +
    `📱 ¿Dudas? WhatsApp: +57 314 446 7389`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /transparencia
bot.command('transparencia', async (ctx) => {
  return ctx.reply(
    `🔍 *SISTEMA 100% TRANSPARENTE*\n\n` +
    `🎯 *TODO ES PÚBLICO Y VERIFICABLE*\n\n` +
    `📊 *Lo que TODOS pueden ver:*\n\n` +
    `✅ *Lista de Socios Activos:*\n` +
    `   • Cuántos socios hay\n` +
    `   • Quién está activo\n` +
    `   • Fecha de ingreso de cada uno\n` +
    `   (Publicado semanalmente)\n\n` +
    `✅ *Tickets Comprados:*\n` +
    `   • Foto de cada ticket\n` +
    `   • Nombre del socio\n` +
    `   • Números jugados\n` +
    `   • Fecha de compra\n` +
    `   (Sistema guarda automáticamente)\n\n` +
    `✅ *Reportes Semanales:*\n` +
    `   • Total recaudado\n` +
    `   • Tickets comprados\n` +
    `   • Predicciones asignadas\n` +
    `   • Estado del fondo\n\n` +
    `✅ *Resultados de Sorteos:*\n` +
    `   • Números ganadores oficiales\n` +
    `   • Quién ganó (si hay ganador)\n` +
    `   • Cómo se repartió el premio\n` +
    `   • Comprobantes de pagos\n\n` +
    `✅ *Historial de Premios:*\n` +
    `   • Todos los ganadores\n` +
    `   • Montos repartidos\n` +
    `   • Screenshots de transacciones\n` +
    `   • IDs de pago verificables\n\n` +
    `🔐 *Dónde se publica todo:*\n` +
    `📘 Grupo de Facebook del Club\n` +
    `💬 Canal de Telegram\n` +
    `📊 Panel de estadísticas (próximamente)\n\n` +
    `🎯 *Cualquier socio puede:*\n` +
    `✅ Pedir ver los reportes\n` +
    `✅ Verificar comprobantes\n` +
    `✅ Auditar el sistema\n` +
    `✅ Preguntar públicamente\n\n` +
    `💪 *Sin secretos, sin sorpresas*\n` +
    `Todo se documenta y comparte\n\n` +
    `📱 ¿Dudas? WhatsApp: +57 314 446 7389`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /beneficios
bot.command('beneficios', async (ctx) => {
  return ctx.reply(
    `🎁 *BENEFICIOS DE SER SOCIO*\n\n` +
    `✅ *Predicciones Únicas:*\n` +
    `   Números personalizados cada semana\n` +
    `   Solo TÚ tienes esos números\n\n` +
    `✅ *Todos Ganamos Igual:*\n` +
    `   Si alguien gana, TODOS recibimos lo mismo\n` +
    `   100% justo y transparente\n\n` +
    `✅ *Más Oportunidades:*\n` +
    `   Jugamos en grupo = Más tickets\n` +
    `   Más chances de ganar\n\n` +
    `✅ *Comunidad:*\n` +
    `   Grupo de socios apoyándose\n` +
    `   Compartimos estrategias\n\n` +
    `✅ *Sistema Transparente:*\n` +
    `   Todo documentado públicamente\n` +
    `   Usa /transparencia para ver cómo\n\n` +
    `✅ *Juega Gratis con Referidos:*\n` +
    `   Trae amigos y ahorra\n` +
    `   Usa /referidos para más info\n\n` +
    `💰 *Inversión Baja, Premios Altos:*\n` +
    `   $10/semana o $40/mes\n` +
    `   Oportunidad de ganar millones\n` +
    `   Repartidos justamente\n\n` +
    `🚀 ¿Listo? Usa /register`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /register
bot.command('register', async (ctx) => {
  return ctx.reply(
    `✅ *¡REGÍSTRATE AHORA!*\n\n` +
    `🎯 *Pasos rápidos:*\n\n` +
    `1️⃣ Elige tu plan:\n` +
    `   • $10 USD semanal\n` +
    `   • $40 USD mensual (ahorra $10)\n\n` +
    `2️⃣ Realiza el pago:\n` +
    `   Usa /payment para ver métodos\n` +
    `   (Remitly, Western Union, etc.)\n\n` +
    `3️⃣ Envía comprobante:\n` +
    `   Toma captura y envíala aquí\n` +
    `   Incluye tu nombre completo\n\n` +
    `4️⃣ Espera verificación:\n` +
    `   24-48 horas\n` +
    `   Te notificaremos\n\n` +
    `5️⃣ Recibe tus números:\n` +
    `   Usa /numbers\n` +
    `   Predicciones únicas para ti\n\n` +
    `💡 *Mientras tanto:*\n` +
    `• Lee /comofunciona\n` +
    `• Ve /ejemplos de premios\n` +
    `• Aprende sobre /referidos\n\n` +
    `📱 ¿Dudas? WhatsApp: +57 314 446 7389`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /comunidad o /redes
bot.command(['comunidad', 'redes'], async (ctx) => {
  return ctx.reply(
    `👥 *ÚNETE A LA COMUNIDAD*\n\n` +
    `🎯 Conéctate con otros socios del club:\n\n` +
    `📘 *GRUPO DE FACEBOOK* ⭐\n` +
    `   Comparte experiencias, estrategias\n` +
    `   Ve reportes semanales públicos\n` +
    `   Conoce a otros socios\n` +
    `   🔗 https://www.facebook.com/share/g/1EJebD3RPP/\n\n` +
    `📺 *CANAL DE YOUTUBE*\n` +
    `   Tutoriales y resultados\n` +
    `   Cómo funciona el sistema\n` +
    `   Testimonios de socios\n` +
    `   🔗 https://www.youtube.com/@SuperAgentAnbelAI\n\n` +
    `📘 *PÁGINA DE FACEBOOK*\n` +
    `   Noticias y actualizaciones\n` +
    `   🔗 https://www.facebook.com/amarresdeamorestadosunid/\n\n` +
    `💡 *¿Por qué unirte?*\n` +
    `✅ Ver reportes semanales transparentes\n` +
    `✅ Conocer a otros socios\n` +
    `✅ Compartir estrategias\n` +
    `✅ Estar al día con sorteos\n` +
    `✅ Ver resultados en vivo\n` +
    `✅ Verificar todo públicamente\n\n` +
    `🎊 ¡Somos una comunidad, no solo un club!\n\n` +
    `🤖 Bot: @SuperAgentAnbelBot\n` +
    `📱 WhatsApp: +57 314 446 7389`,
    { parse_mode: 'Markdown' }
  );
});

// Comando /soporte
bot.command('soporte', async (ctx) => {
  return ctx.reply(
    `📞 *CANALES DE SOPORTE*\n\n` +
    `*Para consultas y ayuda:*\n` +
    `📱 WhatsApp: +57 314 446 7389\n` +
    `💬 Telegram: +1 786 772 5681\n` +
    `📧 Email: richardbejarano52@gmail.com\n\n` +
    `*Métodos de pago:*\n` +
    `💸 Remesas: Remitly, Western Union, Xoom\n` +
    `📧 PayPal: richardbejarano52@gmail.com\n\n` +
    `*Bot de registro:*\n` +
    `🤖 @SuperAgentAnbelBot (este bot)\n\n` +
    `*Redes Sociales:*\n` +
    `Usa /comunidad para ver todas\n\n` +
    `*Horario de atención:*\n` +
    `Lunes a Domingo: 9:00 AM - 9:00 PM (COL)\n\n` +
    `💡 ¿Quieres unirte? Usa /register`,
    { parse_mode: 'Markdown' }
  );
});

// Manejo de texto (para cuando alguien escribe sin comando)
bot.on('text', async (ctx) => {
  return ctx.reply(
    `👋 Hola! Para ver los comandos disponibles, usa:\n\n` +
    `/help - Ver todos los comandos\n` +
    `/payment - Ver cómo pagar\n` +
    `/soporte - Contacto\n\n` +
    `💡 Escribe "/" para ver comandos sugeridos`
  );
});

// Iniciar bot
bot.launch()
  .then(() => {
    console.log('✅ Bot de Telegram Iniciado Exitosamente!');
    console.log(`🤖 Usuario del Bot: @${bot.botInfo?.username || 'SuperAgentAnbelBot'}`);
    console.log(`📱 WhatsApp: +57 314 446 7389`);
    console.log(`💬 Telegram: +1 786 772 5681`);
    console.log('\n🎯 El bot está funcionando y esperando mensajes...\n');
  })
  .catch((error) => {
    console.error('❌ Error al iniciar el bot:', error.message);
    console.error('Detalles:', error);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

