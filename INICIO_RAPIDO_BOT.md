# ⚡ INICIO RÁPIDO - CONFIGURAR BOT (10 MINUTOS)

## 🎯 **3 PASOS SIMPLES**

---

## 📱 **PASO 1: CREAR BOT (5 minutos)**

```
1. Abre Telegram
2. Busca: @BotFather
3. Envía: /start
4. Envía: /newbot
5. Nombre: Super Agent Anbel AI
6. Username: SuperAgentAnbelBot
7. Copia el TOKEN que te da
```

**Ejemplo de TOKEN:**
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567
```

---

## 📝 **PASO 2: CREAR ARCHIVO .env.local (3 minutos)**

### **2.1 Ubicación**
```
C:\Users\ALP\Documents\Socios Anbel\.env.local
```

### **2.2 Contenido Mínimo**

Crea un archivo llamado `.env.local` y pega esto:

```env
# TOKEN DEL BOT (Obtenido de BotFather)
TELEGRAM_BOT_TOKEN=PEGA_TU_TOKEN_AQUI

# CONTACTO
WHATSAPP_MAIN=+573144467389
TELEGRAM_SUPPORT=+17867725681

# PAGOS
PAYPAL_EMAIL=richardbejarano52@gmail.com

# FIREBASE (Si ya lo tienes configurado, pega aquí)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

**⚠️ Reemplaza `PEGA_TU_TOKEN_AQUI` con el token real de BotFather**

---

## 🚀 **PASO 3: PROBAR EL BOT (2 minutos)**

### **3.1 En la terminal (PowerShell):**
```powershell
npm run bot
```

### **3.2 Deberías ver:**
```
✅ Bot de Telegram Iniciado Exitosamente!
Usuario del Bot: @SuperAgentAnbelBot
Soporte WhatsApp: +573144467389
```

### **3.3 En Telegram:**
```
1. Busca: @SuperAgentAnbelBot
2. Envía: /start
3. ¡Debería responder!
```

---

## ✅ **COMANDOS PARA PROBAR**

```
/start      → Bienvenida
/help       → Lista de comandos
/payment    → Métodos de pago
/metodos    → Menú de guías
/zelle      → Guía de remesas
/register   → Registrarse
/soporte    → Contactos
```

---

## ❌ **SI ALGO NO FUNCIONA**

### **Error: "Invalid token"**
```
→ El token está mal copiado
→ Verifica en .env.local que no tenga espacios
→ Copia nuevamente desde BotFather
```

### **Error: "Cannot find module"**
```powershell
npm install
```

### **Error: Firebase**
```
→ Por ahora puedes probarlo sin Firebase
→ El bot responderá a comandos
→ Solo no guardará datos todavía
→ Configura Firebase después
```

### **Bot no responde**
```
→ Verifica que npm run bot está corriendo
→ Busca errores en la terminal roja
→ Verifica el token en .env.local
```

---

## 🎊 **¡LISTO!**

Cuando el bot responda a `/start`, ¡está funcionando!

Link de tu bot:
```
https://t.me/SuperAgentAnbelBot
```

---

## 📋 **SIGUIENTE PASO**

**Opcional - Configurar comandos visibles:**

En @BotFather:
```
/setcommands
[Selecciona tu bot]

Pega:
start - Iniciar el bot
register - Registrarse como socio
numbers - Ver tus predicciones
upload - Subir foto del ticket
payment - Ver métodos de pago
metodos - Guía de métodos de pago
status - Ver estado de membresía
help - Lista de comandos
soporte - Información de contacto
```

---

**⏰ Tiempo total: 10 minutos**
**🎯 Dificultad: Muy fácil**
**✅ Resultado: Bot funcionando**

---

## 📞 INFORMACIÓN DEL CLUB

```
🤖 Bot: @SuperAgentAnbelBot
📱 Telegram: +1 786 772 5681
📱 WhatsApp: +57 314 446 7389
📧 PayPal: richardbejarano52@gmail.com
```

---

**¿Listo para crear tu bot? ¡Adelante! 🚀**







