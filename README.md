# 🎂 BirthdayHub - Calendario de Cumpleaños Premium

**El mejor calendario de cumpleaños del mundo.** Aplicación web completa, moderna y production-ready para gestionar cumpleaños, regalos, wishlists y recordatorios con inteligencia artificial.

## ✨ Características

### 📅 Gestión de Cumpleaños
- **CRUD completo** de personas con datos personales, fotografía, redes sociales y etiquetas
- **Cálculo automático de edad** y cuenta regresiva hasta el próximo cumpleaños
- **Calendario visual interactivo** con vistas de día, semana, mes, año y lista
- **Recordatorios configurables**: 60, 30, 15, 7, 3, 1 días, horas y personalizados
- **Próximos cumpleaños** con cuenta regresiva en tiempo real

### 🎁 Regalos & Wishlist
- **Historial completo de regalos** con fotos, costo, tienda, valoración y notas
- **Wishlist por persona** con prioridades y links a tiendas
- **Detección de regalos repetidos** (preparado para IA)
- **Presupuestos y estadísticas** de gastos por persona y periodo

### 👥 Perfiles de Personas
- Datos personales: nombre, teléfono, email, categoría
- **Gustos detallados**: colores, comida, música, películas, hobbies, tallas, perfumes, alergias
- **Etiquetas personalizadas** para organización flexible
- **Notas privadas** sobre preferencias y detalles importantes

### 🤖 Inteligencia Artificial (Preparado)
- Sugerencias inteligentes de regalos basadas en gustos
- Generación automática de mensajes personalizados
- Análisis de presupuesto y recomendaciones
- Detección de patrones y preferencias

### 📊 Dashboard & Analytics
- **Estadísticas visuales**: total personas, cumpleaños hoy, próximos 7 días, regalos registrados
- **Tableros interactivos** con filtros por categoría, fecha y etiquetas
- **Línea de tiempo** con recuerdos, fotos y notas históricas

### 🔒 Datos & Privacidad
- **Almacenamiento local** (localStorage) - tus datos nunca salen de tu navegador
- **Exportación/Importación** en formato JSON para backups
- **Sin registro requerido** - app 100% offline-first

### 🎨 Diseño Premium
- **Interfaz moderna** inspirada en Apple Calendar, Notion y Linear
- **Colores pastel** y tarjetas redondeadas
- **Modo claro/oscuro** con transiciones suaves
- **Responsive design** - funciona perfectamente en móvil, tablet y escritorio
- **Animaciones fluidas** y transiciones elegantes
- **Accesibilidad WCAG** - navegación por teclado, lectores de pantalla, alto contraste

## 🚀 Instalación y Uso

### Opción 1: Uso Directo (Más Simple)

1. **Descarga los archivos**:
   ```bash
   git clone https://github.com/GRECIACS/birthdayhub.git
   cd birthdayhub
   ```

2. **Abre `index.html` directamente en tu navegador**:
   - Doble clic en `index.html`
   - O arrastra el archivo a tu navegador
   - O click derecho → "Abrir con" → Chrome/Firefox/Edge

¡Listo! La aplicación funciona sin necesidad de servidor.

### Opción 2: Servidor Local (Recomendado para desarrollo)

Si prefieres usar un servidor local:

**Con Python:**
```bash
python -m http.server 8000
# Abre http://localhost:8000
```

**Con Node.js (http-server):**
```bash
npx http-server -p 8000
# Abre http://localhost:8000
```

**Con PHP:**
```bash
php -S localhost:8000
# Abre http://localhost:8000
```

### Opción 3: Despliegue en Producción
#### GitHub Pages (Gratis)

1. Ve a **Settings** de tu repositorio
2. Sección **Pages** → Source: `main branch`
3. Tu app estará en: `https://GRECIACS.github.io/birthdayhub/`

#### Netlify (Gratis)

1. Arrastra la carpeta del proyecto a [netlify.com/drop](https://app.netlify.com/drop)
2. O conecta tu repo de GitHub desde [netlify.com](https://netlify.com)
3. Build settings: Ninguno necesario (es HTML puro)

#### Vercel (Gratis)

```bash
npm i -g vercel
vercel
```

## 📚 Estructura del Proyecto

```
birthdayhub/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS (modo claro/oscuro, responsive)
├── app.js              # Lógica JavaScript (CRUD, calendario, validaciones)
└── README.md           # Este archivo
```

### Arquitectura

- **Frontend puro**: HTML5 + CSS3 + JavaScript ES6+
- **Sin dependencias externas** - cero librerías, totalmente vanilla
- **LocalStorage** para persistencia de datos
- **Modular y escalable** - fácil de extender con backend o APIs

## 👨‍💻 Funcionalidades Implementadas

### ✅ Completado

- [x] CRUD completo de personas
- [x] Calendario interactivo (día/semana/mes/año/lista)
- [x] Cálculo automático de edad y días restantes
- [x] Próximos cumpleaños con cuenta regresiva
- [x] Recordatorios configurables
- [x] Historial de regalos con valoración
- [x] Wishlist por persona con prioridades
- [x] Dashboard con estadísticas
- [x] Exportación/Importación JSON
- [x] Modo claro/oscuro
- [x] Responsive design
- [x] Validaciones de formularios
- [x] Notificaciones toast
- [x] Almacenamiento local (localStorage)
- [x] Búsqueda y filtros

### 🚧 Próximamente

- [ ] Backend opcional (Node.js/Express o Supabase)
- [ ] Autenticación multi-usuario
- [ ] Sincronización en la nube
- [ ] Integración con APIs de IA (OpenAI, Claude)
- [ ] Notificaciones push
- [ ] Integración con Google Calendar
- [ ] PWA (Progressive Web App)
- [ ] Modo offline completo
- [ ] Envío automático de emails/SMS

## 🔧 Tecnologías

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+** - Vanilla JS moderno, sin frameworks
- **LocalStorage API** - Persistencia local de datos
- **Responsive Design** - Mobile-first approach

## 🎯 Casos de Uso

1. **Uso Personal**: Gestiona los cumpleaños de familia y amigos
2. **Equipos de Trabajo**: Organiza celebraciones de cumpleaños en la oficina
3. **Gestión de Clientes**: Recuerda fechas importantes de clientes
4. **Comunidades**: Administra eventos de cumpleaos en grupos
5. **Educación**: Proyecto de aprendizaje web development

## 🐛 Reporte de Errores

Si encuentras algún error:

1. Abre un **Issue** en GitHub
2. Describe el problema con capturas de pantalla
3. Indica navegador y versión

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'feat: agrega nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request**

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 💬 Contacto

- **Autor**: GRECIACS
- **Repositorio**: [github.com/GRECIACS/birthdayhub](https://github.com/GRECIACS/birthdayhub)

---

🎉 **¡Hecho con ❤️ para nunca olvidar un cumpleaños!**
