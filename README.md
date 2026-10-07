# Corazón Artesano

**Vitrina Colectiva de 75 mujeres artesanas de Santa Cruz de Mompox, Bolívar (Colombia).**

Prototipo funcional (MVP académico) de una plataforma web que representa una solución de innovación social y economía solidaria: una Cooperativa Multiactiva que gestiona colectivamente una vitrina comercial física y digital, reduciendo la dependencia de intermediarios y facilitando la venta directa a turistas, clientes nacionales e internacionales.

> **Prototipo académico.** No existe backend, base de datos ni pasarela de pagos real: todos los datos y transacciones son simulados y se guardan en `localStorage`.

## Demo

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administradora | `admin@corazonartesano.co` | `admin123` |
| Artesana (María Rodríguez) | `artesana@corazonartesano.co` | `artesana123` |

## Cómo ejecutarlo

1. Abrir `index.html` directamente en el navegador.
2. O mejor aún, para garantizar la persistencia de `localStorage`, levantar un servidor local:

```bash
python -m http.server 8000
# y abrir http://localhost:8000
```

## Vistas

- `index.html` — Landing pública (comunidad, categorías, proceso, economía solidaria, impacto)
- `catalogo.html` — Catálogo colectivo con búsqueda, filtros y orden
- `producto.html` — Detalle del producto + "Conoce a la artesana"
- `login.html` — Ingreso simulado por rol
- `dashboard.html` — Panel de gestión con KPIs y gráficos
- `productos.html` — CRUD de productos (localStorage)
- `pedidos.html` — Pedidos y ventas con estados y filtros
- `artesanas.html` — Las 75 integrantes de la cooperativa
- `cooperativa.html` — Organigrama, comités y votación democrática
- `impacto.html` — Impacto económico, social y cultural
- `perfil-artesana.html` — Panel simplificado para la artesana

## Funcionalidades clave

- Carrito de compras con checkout simulado que registra pedidos reales en el panel.
- Login por rol (administradora / artesana) con guardias de sesión.
- CRUD de productos, cambio de disponibilidad y persistencia en `localStorage`.
- Votación simulada bajo el principio **"una persona, un voto"**.
- Reinicio de datos del prototipo desde Configuración.
- Gráficos construidos solo con CSS/JS (sin librerías externas).
- Diseño responsive (móvil, tablet, escritorio).

## Datos coherentes del prototipo

75 artesanas · 128 productos · 46 pedidos · **$8.450.000 COP** en ventas · 32 ventas y 12 artesanas activas en junio. Todas las cifras se calculan en vivo desde el estado guardado.

## Tecnologías

HTML5, CSS3 y JavaScript vanilla. Sin frameworks, sin dependencias, sin CDN. Ilustraciones SVG propias.

## Estructura

```
├── index.html, catalogo.html, producto.html, login.html
├── dashboard.html, productos.html, pedidos.html, artesanas.html
├── cooperativa.html, impacto.html, perfil-artesana.html
├── css/    (styles.css, landing.css, dashboard.css)
├── js/     (data, store, app, auth, admin + lógica por vista)
└── assets/images/  (20 ilustraciones SVG)
```

## Mensaje central

> No se trata solamente de vender artesanías; se trata de que las artesanas sean protagonistas de su comercialización. La tecnología es solo una herramienta para fortalecer la organización, la venta directa, la participación, la identidad cultural y la economía solidaria.
