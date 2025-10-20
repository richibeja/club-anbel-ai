# 🧪 GUÍA DE PRUEBA DEL SISTEMA

## 📋 **PREPARACIÓN**

### **1. Instalar Dependencias**

```powershell
npm install
```

### **2. Crear archivo .env.local**

Crea un archivo llamado `.env.local` en la raíz del proyecto con este contenido (mínimo para probar):

```env
# Firebase (obtén estos valores de Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=super-agent-anbel-club.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=super-agent-anbel-club
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=super-agent-anbel-club.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Telegram Bot (obtén el token de @BotFather)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234567890

# Métodos de Pago
ZELLE_PHONE=+17867725681
ZELLE_EMAIL=club@anbelai.com
CASH_APP_TAG=$AnbelAIClub
VENMO_USERNAME=@AnbelAI-Club
PAYPAL_EMAIL=club@anbelai.com

# Contacto
WHATSAPP_MAIN=+17867725681
WHATSAPP_ALT=+19295909116
```

---

## 🚀 **PROBAR EL SISTEMA**

### **PRUEBA 1: Panel Administrativo**

```powershell
# Terminal 1
npm run dev
```

Luego abre: http://localhost:3000

**Verifica:**
- ✅ Página principal carga
- ✅ Puedes navegar a /admin/dashboard
- ✅ Las páginas HTML cargan:
  - http://localhost:3000/plan-afiliados.html
  - http://localhost:3000/terminos-condiciones.html
  - http://localhost:3000/como-pagar.html
  - http://localhost:3000/calculadora-premios.html

---

### **PRUEBA 2: Bot de Telegram**

```powershell
# Terminal 2 (nueva ventana)
npm run bot
```

**Deberías ver:**
```
✅ Bot de Telegram Iniciado Exitosamente!
Usuario del Bot: @SuperAgentAnbelBot
Soporte WhatsApp: +19295909116
```

**Si ves esto, el bot está funcionando!**

---

### **PRUEBA 3: Comandos del Bot**

Abre Telegram y busca tu bot. Prueba estos comandos:

```
/start
/help
/payment
/metodos
/zelle
/cashapp
/venmo
/paypal
/prepaid
/remesas
/register
/soporte
```

**Verifica que cada comando responda correctamente.**

---

### **PRUEBA 4: Registro de Socio (simulación)**

1. En Telegram, envía: `/register`
2. El bot te registra
3. Verifica en panel admin → Members
4. Deberías ver tu registro

---

### **PRUEBA 5: Ver Predicciones**

1. En Telegram: `/numbers`
2. Debería decir "Aún no hay predicciones"
3. Normal - hasta que importes predicciones

---

### **PRUEBA 6: Subir Foto**

1. En Telegram: `/upload`
2. Envía cualquier foto
3. Debería subirla a Firebase Storage
4. Verificar en panel admin → Tickets

---

## ✅ **CHECKLIST DE PRUEBAS**

```
Panel Admin:
□ npm run dev funciona
□ Dashboard carga sin errores
□ Páginas /admin/* cargan
□ plan-afiliados.html se ve bien
□ como-pagar.html se ve bien

Bot Telegram:
□ npm run bot inicia sin errores
□ /start responde
□ /help muestra comandos
□ /payment muestra métodos
□ /zelle muestra guía
□ /cashapp muestra guía
□ /venmo muestra guía
□ /paypal muestra guía
□ /register funciona
□ /upload acepta fotos

Firebase:
□ Datos se guardan en Firestore
□ Fotos se suben a Storage
```

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: Cannot find module**
```powershell
npm install
```

### **Error: Firebase not configured**
- Verifica que .env.local existe
- Verifica que los valores son correctos
- Copia credenciales de Firebase Console

### **Error: Bot token invalid**
- Ve a @BotFather en Telegram
- Envía `/newbot`
- Copia el token correcto
- Pégalo en .env.local

### **Puerto 3000 ocupado**
```powershell
# Usa otro puerto
npm run dev -- -p 3001
```

---

## 📊 **RESULTADOS ESPERADOS**

### **Panel Admin:**
```
✅ Dashboard muestra: 0 socios, 0 predicciones
✅ Todas las páginas cargan correctamente
✅ No hay errores en consola del navegador
```

### **Bot Telegram:**
```
✅ Responde a todos los comandos
✅ Guías de pago se muestran correctamente
✅ Puede registrar usuarios
✅ Puede subir fotos
```

### **Firebase:**
```
✅ Colección 'members' se crea automáticamente
✅ Colección 'tickets' guarda fotos
✅ Storage/tickets/ contiene imágenes
```

---

## 🎯 **SIGUIENTE PASO**

Una vez que todo funcione:

1. ✅ Importar predicciones de prueba
2. ✅ Asignarlas a tu usuario de prueba
3. ✅ Verificar que recibes los números
4. ✅ Invitar primeros socios reales

---

**¿Todo funciona? ¡Estás listo para operar! 🚀**







