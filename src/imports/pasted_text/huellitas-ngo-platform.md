Design a complete mobile-first responsive web platform called "Huellitas de la Calle", 
for an animal rescue NGO in Guatemala. The platform has exactly 3 main modules as 
defined in the project scope: Módulo de Asociación, Módulo de Adopciones, and 
Módulo de Jornadas de Castración.

─── BRAND & VISUAL IDENTITY ───
Name: Huellitas de la Calle
Personality: Warm, caring, trustworthy — designed for non-tech-savvy users.
The design must feel like a rescue shelter: cozy, hopeful, animal-friendly.

Color palette (apply strictly):
- Primary:    #178C2E  (Forest Green)  → main buttons, navbar, active states, headers
- Secondary:  #E7D7B1  (Sand Beige)   → card backgrounds, section dividers
- Background: #FFF9F1  (Soft Cream)   → global page background
- Text:       #4A2E1F  (Dark Brown)   → all body text, labels, headings
- Accent:     #F4C542  (Collar Yellow)→ CTAs, highlights, badges, icon fills

Typography: Rounded sans-serif — Nunito or Poppins.
Icons: Outlined style, consistent stroke weight (Lucide or Phosphor).
Visual style: Rounded corners (16–24px cards, 50px buttons), soft drop shadows,
              warm paw print and leaf decorative accents throughout.

─── SCREENS TO DESIGN ───

== SCREEN 1: HOME / LANDING (Mobile) ==
- Sticky navbar: logo "Huellitas de la Calle" left + paw icon, 
  hamburger menu right (links to the 3 modules)
- Hero banner: warm illustration of a rescued dog/cat, 
  headline "Dale un hogar a quien más lo necesita",
  subheadline "Rescatamos, cuidamos y conectamos mascotas con familias amorosas",
  Two CTA buttons: [Ver perritos en adopción] green | [Inscribir mi mascota] yellow
- Quick-access 3-icon row: 🐾 Nosotros | 🐶 Adopciones | 📅 Castración
- Preview strip: horizontal scrollable pet cards (3 visible), 
  title "Perritos buscando hogar"
- Footer: links to the 3 modules, Instagram icon, WhatsApp contact, 
  short tagline about the NGO

== SCREEN 2: MÓDULO DE ASOCIACIÓN (About the NGO) ==
Purpose: Inform visitors about the organization.
Sections in order:
  a) Hero with NGO name and a warm group photo placeholder
  b) "Nuestra Misión" — card with green left border, paragraph text
  c) "Nuestra Visión" — card with yellow left border, paragraph text  
  d) "Nuestra Historia" — timeline or narrative text section with illustrated accent
  e) "¿Cómo puedes ayudar?" — Two option cards side by side:
       [Voluntariado] with description and a contact/sign-up button (green)
       [Donaciones] with description and a donation link button (yellow)
     NOTE: Donaciones and Voluntariado are informational subsections 
     inside this module, NOT separate top-level modules.

== SCREEN 3: MÓDULO DE ADOPCIONES — Gallery (Mobile) ==
- Page title: "Perritos en Adopción"
- Search bar + horizontal filter chips: Tamaño (Pequeño/Mediano/Grande), 
  Sexo (Macho/Hembra), Edad
- 2-column masonry grid of pet cards:
  Each card: rounded photo top, name, age chip, size chip, 
  temperament tag, [Ver ficha] green button
- Empty state: friendly illustration + "No hay perritos disponibles en este momento"

== SCREEN 4: INDIVIDUAL PET PROFILE (Mobile) ==
- Full-width hero photo with rounded bottom corners
- Pet name as large heading, adoption status badge (Disponible = green)
- Info tags row: Edad | Tamaño | Sexo | Temperamento
- Section "Sobre mí": paragraph description
- Section "¿Quieres adoptarme?": brief instructions
- Primary CTA: [Solicitar adopción] large green button
- Secondary: [Compartir] yellow ghost button with WhatsApp icon

== SCREEN 5: ADOPTION REQUEST FORM (Modal or new screen) ==
- Title: "Formulario de Adopción"
- Fields: Full name, phone number, city, why do you want to adopt (textarea)
- Submit: [Enviar solicitud] green button
- Large tap targets, cream card background

== SCREEN 6: MÓDULO DE JORNADAS DE CASTRACIÓN — Step Wizard (Mobile) ==
Design as a 4-step progress flow. Show progress bar at top (steps 1–4).

  STEP 1 — Seleccionar Municipio:
    Title: "¿En qué municipio está tu mascota?"
    List of municipality cards, each showing: municipality name, 
    upcoming date, availability badge (Verde = cupos disponibles / Rojo = lleno)

  STEP 2 — Elegir Horario:
    Title: "Selecciona tu horario"
    Visual time slot grid: pill buttons for each time (8:00am, 9:00am, 10:00am, etc.)
    States: Available (green fill) | Taken (gray, disabled) | Selected (green + checkmark)
    Note below: "Los cupos se bloquean automáticamente al llenarse"

  STEP 3 — Datos del dueño y mascota:
    Title: "Ingresa tus datos"
    Form fields: 
      Owner: Nombre completo, Número de teléfono
      Pet: Nombre de la mascota, Especie (toggle: Perro / Gato), Edad aproximada
    Clean card-style layout, large inputs, cream background

  STEP 4 — Confirmación:
    Success screen: happy dog/cat illustration
    Title: "¡Inscripción exitosa! 🐾"
    Appointment summary card: Municipality, Date, Time, Pet name
    Two action buttons: 
      [Agregar al calendario] green
      [Compartir por WhatsApp] yellow with WhatsApp icon
    Small note: "Recibirás una confirmación en pantalla"

== SCREEN 7: ADMIN DASHBOARD (Desktop) ==
- Left sidebar: dark green (#178C2E), white icons + labels
  Nav items: Jornadas de Castración | Adopciones | Inscritos | Configuración
- Main content area (cream background):

  View A — Jornadas:
    Table with columns: Municipio | Fecha | Horarios | Cupos usados/Total | Estado | Acciones
    [+ Nueva Jornada] green button top right
    Add/edit jornada modal: fields for municipality, date, time slots, max capacity

  View B — Adopciones:
    Grid of pet cards with: photo thumbnail, name, status toggle (Disponible/Adoptado)
    [+ Agregar perrito] green button
    Edit and deactivate actions per card
    Upload photo button in edit modal

  View C — Inscritos por Jornada:
    Dropdown to select jornada
    Table: Nombre dueño | Teléfono | Mascota | Especie | Horario | Fecha inscripción
    [Exportar CSV] yellow button top right

─── COMPONENT LIBRARY ───
- Primary button: green #178C2E fill, white text, 50px border-radius
- Accent CTA button: yellow #F4C542 fill, dark brown text, 50px border-radius
- Ghost button: green outline, transparent fill
- Pet card component (gallery + profile states)
- Time slot pill (3 states: available / taken / selected)
- Municipality availability card
- 4-step progress bar indicator
- Form input field (rounded, cream background, brown border on focus)
- Status badge (Disponible green / Lleno red / Adoptado gray)
- Confirmation/success screen template
- Admin table row with action buttons

─── ACCESSIBILITY & PERFORMANCE ───
- Minimum 48x48px touch targets on all interactive elements
- Minimum 16px body font size
- High contrast text on all backgrounds per WCAG AA
- Optimized image placeholders (lazy loading consideration)
- Designed assuming shared WhatsApp links as primary entry point
- All navigation flows must be completable in 3 taps or fewer on mobile