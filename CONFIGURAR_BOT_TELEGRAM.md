# 🤖 CONFIGURAR BOT DE TELEGRAM - GUÍA COMPLETA

## ✅ PASO 1: CREAR EL BOT

### **1.1 Abrir Telegram**
- En tu teléfono o computadora
- Busca: **@BotFather**
- Abre el chat (tiene ✓ azul)

### **1.2 Comandos**
```
/start
/newbot
```

### **1.3 Información del Bot**
```
Nombre: Super Agent Anbel AI
Username: SuperAgentAnbelBot

(Si está ocupado, prueba:)
- SuperAgentAnbelAIBot
- AnbelAIClubBot  
- ClubAnbelBot
```

### **1.4 Obtener Token**
```
BotFather te dará un token como este:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567

⭐ COPIA ESE TOKEN
   Lo necesitas para el siguiente paso
```

---

## ✅ PASO 2: CONFIGURAR ARCHIVO .env.local

### **2.1 Crear el Archivo**

En la carpeta raíz del proyecto (`C:\Users\ALP\Documents\Socios Anbel`), crea un archivo llamado `.env.local`

**⚠️ IMPORTANTE:** El archivo debe llamarse exactamente `.env.local` (con el punto al inicio)

### **2.2 Contenido del Archivo**

Copia y pega esto, reemplazando los valores:

```env
# ====================================
# TELEGRAM BOT TOKEN
# ====================================
TELEGRAM_BOT_TOKEN=TU_TOKEN_AQUI_DEL_BOTFATHER

# Ejemplo:
# TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567

# ====================================
# INFORMACIÓN DE CONTACTO
# ====================================
WHATSAPP_MAIN=+573144467389
WHATSAPP_ALT=+573144467389
TELEGRAM_SUPPORT=+17867725681

# ====================================
# MÉTODOS DE PAGO (Remesas USA → Colombia)
# ====================================
ZELLE_PHONE=+573144467389
ZELLE_EMAIL=richardbejarano52@gmail.com

# PayPal
PAYPAL_EMAIL=richardbejarano52@gmail.com

# ====================================
# PRECIOS
# ====================================
WEEKLY_PRICE=10
MONTHLY_PRICE=40

# ====================================
# CONFIGURACIÓN DE PREMIOS
# ====================================
DISTRIBUTION_MODEL=equal_parts

# ====================================
# FIREBASE (Obtén de Firebase Console)
# ====================================
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=super-agent-anbel-club.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=super-agent-anbel-club
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=super-agent-anbel-club.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (para el bot)
FIREBASE_ADMIN_PROJECT_ID=super-agent-anbel-club
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@super-agent-anbel-club.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
```

### **2.3 Obtener Credenciales de Firebase**

Si no tienes Firebase configurado todavía:

1. Ve a: https://console.firebase.google.com
2. Crea proyecto o selecciona "super-agent-anbel-club"
3. Ve a: Project Settings (⚙️ icono)
4. En "Your apps", copia las credenciales
5. Pégalas en .env.local

**O usa el archivo SETUP_GUIDE.md para instrucciones detalladas**

---

## ✅ PASO 3: PROBAR EL BOT

### **3.1 Instalar Dependencias** (si no lo has hecho)
```powershell
npm install
```

### **3.2 Iniciar el Bot**
```powershell
npm run bot
```

### **3.3 Verificar que Funciona**

Deberías ver en la terminal:
```
✅ Bot de Telegram Iniciado Exitosamente!
Usuario del Bot: @SuperAgentAnbelBot
Soporte WhatsApp: +573144467389
```

### **3.4 Probar en Telegram**

1. Abre Telegram
2. Busca tu bot: @SuperAgentAnbelBot
3. Envía: `/start`
4. Deberías recibir un mensaje de bienvenida

### **3.5 Probar Comandos**

Prueba estos comandos:
```
/start
/help
/payment
/metodos
/zelle
/cashapp
/venmo
/register
/soporte
```

Cada comando debería responder con información.

---

## ✅ PASO 4: CONFIGURAR COMANDOS DEL BOT (Opcional pero recomendado)

Esto hace que los comandos aparezcan en el menú de Telegram.

### **4.1 En el Chat con BotFather**
```
Envía: /setcommands
```

### **4.2 Selecciona tu Bot**
```
BotFather preguntará: "Choose a bot to change commands"
Selecciona: @SuperAgentAnbelBot
```

### **4.3 Pega esta Lista de Comandos**
```
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

### **4.4 Confirmar**
```
BotFather confirmará: "Success! Command list updated."
```

Ahora cuando los usuarios escriban "/" verán estos comandos sugeridos.

---

## ✅ PASO 5: PERSONALIZAR EL BOT (Opcional)

### **5.1 Agregar Foto de Perfil**
```
En BotFather:
/setuserpic

Selecciona tu bot
Envía una imagen (logo del club)
```

### **5.2 Agregar Descripción**
```
En BotFather:
/setdescription

Selecciona tu bot

Pega:
Club de Predicciones de Lotería para Latinos en USA. 
Si uno gana, TODOS ganamos igual. 
$10 semanal / $40 mensual.
```

### **5.3 Agregar Descripción Corta**
```
En BotFather:
/setabouttext

Selecciona tu bot

Pega:
Club de Lotería - Todos ganamos igual
```

---

## ❌ SOLUCIÓN DE PROBLEMAS

### **Error: "Invalid token"**
```
✅ Verifica que copiaste el token completo
✅ No debe tener espacios al inicio o final
✅ Verifica que está en .env.local correcto
```

### **Error: "Cannot find module"**
```
npm install
```

### **Bot no responde**
```
✅ Verifica que npm run bot está corriendo
✅ Busca errores en la terminal
✅ Verifica que el token es correcto
```

### **Error de Firebase**
```
✅ Verifica credenciales de Firebase en .env.local
✅ Asegúrate de que el proyecto existe
✅ Verifica que Firestore está habilitado
```

---

## 📋 CHECKLIST COMPLETO

```
□ Abrir Telegram
□ Buscar @BotFather
□ Enviar /newbot
□ Nombre: Super Agent Anbel AI
□ Username: SuperAgentAnbelBot
□ Copiar el token
□ Crear archivo .env.local
□ Pegar el token en TELEGRAM_BOT_TOKEN
□ Completar otras variables
□ Guardar .env.local
□ npm install
□ npm run bot
□ Verificar que inicia sin errores
□ Abrir Telegram y buscar el bot
□ Enviar /start
□ Probar comandos
□ Configurar /setcommands (opcional)
□ Agregar foto y descripción (opcional)
```

---

## 🎉 ¡LISTO!

Cuando veas esto en la terminal:
```
✅ Bot de Telegram Iniciado Exitosamente!
Usuario del Bot: @SuperAgentAnbelBot
```

Y el bot responda a tus mensajes, ¡está funcionando perfectamente!

---

## 📱 PRÓXIMO PASO

Ahora puedes:
1. ✅ Compartir el link del bot: https://t.me/SuperAgentAnbelBot
2. ✅ Invitar a socios de prueba
3. ✅ Probar el registro completo
4. ✅ Verificar que todo funciona

---

**¿Dudas? Revisa la sección de Solución de Problemas o pregunta** 😊







