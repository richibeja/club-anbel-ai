# 💡 CÓMO USAR EL SISTEMA DE TOPES - GUÍA RÁPIDA

## 🎯 TABLA RÁPIDA DE REFERENCIA

| Si el Premio es... | ¿Se reparte? | Sistema |
|-------------------|--------------|---------|
| **$1 - $999** | ❌ NO | Ganador se lo queda completo |
| **$1,000 - $9,999** | ✅ SÍ | Partes iguales |
| **$10,000 - $99,999** | ✅ SÍ | Partes iguales + bono 10% al ganador |
| **$100,000+** | ✅ SÍ | Partes iguales + bono 15% + fondo 5% |

---

## 🖥️ USO DE LA CALCULADORA

### **1. Accede a la Calculadora**
📍 http://localhost:3000/admin/calculator

### **2. Ingresa los Datos**
- **Monto del Premio:** Cantidad exacta ganada
- **% Impuestos:** Normalmente 24% (federal)
- **Socios Activos:** Se detecta automáticamente

### **3. Haz Clic en "Calcular Reparto"**

La calculadora automáticamente:
- ✅ Identifica el NIVEL de distribución
- ✅ Aplica las reglas correspondientes
- ✅ Calcula bonos si aplica
- ✅ Calcula fondo del club si aplica
- ✅ Te muestra cuánto recibe cada uno

---

## 📊 EJEMPLOS PRÁCTICOS CON LA CALCULADORA

### **Ejemplo 1: Premio de $500**
```
Ingresa: $500
Impuestos: 24%
Premio Neto: $380

RESULTADO:
📍 NIVEL 1: Premio Pequeño
💰 Ganador recibe: $380
👥 Otros miembros: $0

✅ El ganador se lo queda completo
```

### **Ejemplo 2: Premio de $5,000**
```
Ingresa: $5,000
Impuestos: 24%
Premio Neto: $3,800
Socios Activos: 25

RESULTADO:
📍 NIVEL 2: Premio Mediano
💰 Ganador recibe: $152
👥 Cada miembro recibe: $152

✅ Todos reciben partes iguales
```

### **Ejemplo 3: Premio de $50,000**
```
Ingresa: $50,000
Impuestos: 24%
Premio Neto: $38,000
Socios Activos: 30

RESULTADO:
📍 NIVEL 3: Premio Grande + Bono 10%
💰 Ganador recibe: $5,066.67
   (Parte base $1,266.67 + Bono $3,800)
👥 Otros 29 reciben: $1,266.67 c/u

✅ Ganador recibe bono especial
```

### **Ejemplo 4: Premio de $1,000,000** 🎰
```
Ingresa: $1,000,000
Impuestos: 24%
Premio Neto: $760,000
Socios Activos: 50

RESULTADO:
📍 NIVEL 4: JACKPOT
🏛️ Fondo del Club (5%): $38,000
💰 Ganador recibe: $128,440
   (Parte base $14,440 + Bono $114,000)
👥 Otros 49 reciben: $14,440 c/u

✅ Se crea fondo para el club
```

---

## 📋 DESPUÉS DE CALCULAR

### **1. Copia el Anuncio**
- Haz clic en "📋 Copiar Anuncio"
- Pega en el grupo de Telegram/WhatsApp
- El mensaje ya viene formateado profesionalmente

### **2. Descarga la Lista (si aplica)**
- Solo para premios que se reparten ($1,000+)
- Haz clic en "📥 Descargar Lista"
- Archivo CSV con todos los socios y montos
- Úsalo para hacer los pagos

### **3. Procesa el Reparto**
- El ganador tiene 7 días máximo
- Debe enviar a cada socio su parte
- Documentar con comprobantes
- Publicar evidencia en el grupo

---

## ⚠️ MENSAJES ESPECIALES DE LA CALCULADORA

### **Si el premio es < $1,000:**
```
💡 Premio menor a $1,000: 
El ganador se lo queda completo (no se reparte)
```

### **Si el premio tiene bono:**
```
(Incluye bono especial de $X,XXX)
```

### **Si hay fondo del club:**
```
🏛️ Fondo del Club (5%): $XX,XXX
```

---

## 🎯 VENTAJAS DEL SISTEMA AUTOMÁTICO

✅ **Sin errores de cálculo** - La calculadora hace todo
✅ **Identificación automática** - Detecta el nivel correcto
✅ **Mensaje listo** - Copia y pega en el grupo
✅ **Lista descargable** - CSV con todos los datos
✅ **Transparente** - Muestra todos los cálculos

---

## 🔄 ACTUALIZACIÓN EN TIEMPO REAL

La calculadora:
- ✅ Lee socios activos de la base de datos en tiempo real
- ✅ Solo cuenta miembros con pagos al día
- ✅ Se actualiza automáticamente
- ✅ Puedes hacer clic en "🔄 Recargar lista de socios" si es necesario

---

## 📞 PREGUNTAS FRECUENTES

**P: ¿Qué pasa si un premio es de exactamente $1,000?**
R: Se reparte. Solo premios menores a $1,000 van completos al ganador.

**P: ¿El bono del ganador sale del premio total?**
R: Sí, forma parte del premio neto que se reparte.

**P: ¿Qué pasa con el fondo del club?**
R: Se guarda para eventos, emergencias y mejoras del sistema.

**P: ¿Puedo cambiar los porcentajes?**
R: Sí, pero requiere votación de la directiva o asamblea general.

**P: ¿Los socios inactivos reciben parte?**
R: No, solo los socios con membresía activa y pagos al día.

---

## ✅ CHECKLIST PARA ADMINISTRADORES

Cuando alguien gana:

- [ ] Verificar el boleto ganador
- [ ] Confirmar monto exacto del premio
- [ ] Ir a http://localhost:3000/admin/calculator
- [ ] Ingresar monto y calcular
- [ ] Copiar anuncio al grupo
- [ ] Descargar lista (si aplica)
- [ ] Dar instrucciones al ganador
- [ ] Monitorear que complete en 7 días
- [ ] Verificar comprobantes de pago
- [ ] Publicar reporte final

---

**🏛️ Club Anbel AI - Sistema de Reparto Justo y Automatizado**

*Versión 1.0 - Octubre 2025*

