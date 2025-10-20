# 📦 LISTA EXACTA PARA DESPLIEGUE EN VERCEL

## ✅ ARCHIVOS QUE SE ENVÍAN:

### **📁 Carpetas de Código:**
```
✅ src/
   ├── app/
   │   ├── admin/
   │   │   ├── calculator/
   │   │   ├── dashboard/
   │   │   ├── directive/
   │   │   ├── generator/
   │   │   ├── members/
   │   │   ├── payments/
   │   │   ├── predictions/
   │   │   ├── tickets/
   │   │   └── layout.tsx
   │   ├── contract/
   │   │   └── page.tsx
   │   ├── team/
   │   │   └── page.tsx
   │   ├── globals.css
   │   ├── layout.tsx
   │   └── page.tsx
   ├── lib/
   │   └── (todas las librerías)
   └── types/
       └── index.ts
```

### **📁 Archivos Públicos:**
```
✅ public/
   ├── aceptacion-terminos.html
   ├── calculadora-premios.html
   ├── como-pagar.html
   ├── plan-afiliados.html
   ├── terminos-condiciones.html
   └── *.csv (archivos de ejemplo)
```

### **📁 Bot de Telegram:**
```
✅ telegram-bot/
   ├── bot.js
   └── bot-simple.js
```

### **📁 Archivos de Configuración:**
```
✅ package.json
✅ package-lock.json
✅ next.config.js
✅ next-env.d.ts
✅ tsconfig.json
✅ tailwind.config.js
✅ postcss.config.js
```

### **📁 Documentación:**
```
✅ README.md
✅ *.md (todos los archivos de documentación)
```

### **📁 Archivos de Control:**
```
✅ .gitignore
✅ .vercelignore (recién creado)
```

---

## ❌ ARCHIVOS QUE NO SE ENVÍAN:

### **Carpetas Excluidas:**
```
❌ node_modules/        (500+ MB - se instala automático)
❌ .next/               (se genera automático en Vercel)
❌ logs/                (archivos temporales locales)
❌ reports/             (reportes locales)
❌ exports/             (exportaciones temporales)
```

### **Archivos Sensibles:**
```
❌ .env.local           (¡IMPORTANTE! Tiene tus contraseñas)
❌ super-agent-anbel-club-firebase-adminsdk-*.json
```

---

## 📊 TAMAÑO TOTAL A ENVIAR:

**Aproximadamente: 5-15 MB**

- src/ → ~3-5 MB
- public/ → ~1 MB
- telegram-bot/ → ~100 KB
- Configuración → ~500 KB
- Documentación → ~500 KB

---

## 🚀 COMANDO PARA DESPLEGAR:

### **Opción 1: GitHub → Vercel (Recomendado)**

1. **Sube a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [tu-repo-github]
git push -u origin main
```

2. **En Vercel:**
- Importa desde GitHub
- Selecciona el repositorio
- Vercel despliega automático

### **Opción 2: Directo desde PC**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Sigue las instrucciones en pantalla
```

---

## 🔐 VARIABLES DE ENTORNO (Agregar en Vercel):

**Después de desplegar, agrega estas variables en el panel de Vercel:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBISdz4WHVhMHJ60bskjc7igk9Ea1mkxMI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=super-agent-anbel-club.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=super-agent-anbel-club
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=super-agent-anbel-club.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=789541259111
NEXT_PUBLIC_FIREBASE_APP_ID=1:789541259111:web:c917c8d37e5ce542cad1c2

FIREBASE_ADMIN_PROJECT_ID=super-agent-anbel-club
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@super-agent-anbel-club.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[tu-clave]\n-----END PRIVATE KEY-----\n"

TELEGRAM_BOT_TOKEN=[tu-token-del-bot]
WHATSAPP_MAIN=+573144467389
TELEGRAM_SUPPORT=+17867725681
PAYPAL_EMAIL=richardbejarano52@gmail.com
```

---

## ✅ CHECKLIST ANTES DE DESPLEGAR:

- [ ] `.vercelignore` creado (ya está ✅)
- [ ] `.gitignore` configurado
- [ ] **NO** incluir .env.local
- [ ] **NO** incluir node_modules
- [ ] **NO** incluir .next
- [ ] Código actualizado y funcionando en local
- [ ] Credenciales de Firebase listas para copiar

---

## 🎯 RESULTADO FINAL:

Tu sitio estará en línea en:
```
https://tu-proyecto.vercel.app
```

Con estas páginas públicas:
- `/` → Dashboard (redirige a /admin/dashboard)
- `/team` → Nuestro Equipo
- `/contract` → Contrato
- `/admin/*` → Panel administrativo

---

## 📝 NOTAS IMPORTANTES:

1. **El bot de Telegram** debe correrse por separado (no en Vercel)
2. **Vercel solo aloja el sitio web** (Next.js)
3. **Para el bot**, usa Railway, Render o un VPS
4. **Firebase funciona perfecto** con Vercel

---

**¿Listo para desplegar? Dime si quieres que te guíe paso a paso.**

