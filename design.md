# Tickets visual design

## Design direction

Tickets is a movie-making program presented like a cinema ticket: dark theater
surfaces, warm paper ticket panels, and small details borrowed from film reels,
marquees, barcodes, and perforated stubs. The interface should feel playful and
cinematic while keeping the offer, steps, and submission form easy to understand.

The site also uses a restrained black-and-white treatment for interactive
controls. Keep that contrast, and use the warmer cinema colors as accents rather
than competing palettes.

## Color palette

The primary tokens are defined in `frontend/app/app.css` under `:root`.

| Role | Token | Value |
| --- | --- | --- |
| Theater background | `--bg-black` | `#0c0a0e` |
| Raised dark surface | `--bg-surface` | `#141017` |
| Dark card | `--bg-card` | `#1c1622` |
| Ticket paper | `--ticket-cream` | `#faf5ea` |
| Secondary ticket paper | `--ticket-cream-alt` | `#f1e7d2` |
| Ticket outline | `--ticket-border` | `#ded1b8` |
| Ticket text | `--ticket-text` | `#1f1a24` |
| Velvet red | `--velvet-red` | `#8f1924` |
| Bright velvet accent | `--velvet-bright` | `#b82332` |
| Primary marquee gold | `--gold-primary` | `#e6b764` |
| Light gold | `--gold-light` | `#ffdf9e` |
| Main light text | `--text-white` | `#fcfbf9` |
| Muted light text | `--text-muted` | `#c4b9b4` |

Use the near-black and off-white values for primary contrast. Cream is for
ticket-like content surfaces. Red and gold should signal cinema identity,
highlights, and ornament; avoid using both as prominent text colors in the same
component. Reserve semantic colors for clear success and error feedback.

## Typography

- **Body and UI:** Plus Jakarta Sans (`--font-body`). Use for paragraphs, form
  labels, buttons, and most headings.
- **Display:** Bebas Neue (`--font-display`). Use sparingly for ticket amounts,
  ticket labels, or deliberate marquee-style accents.
- **Metadata:** Space Mono (`--font-mono`). Use for serials, small counts,
  barcode labels, and compact technical metadata.

Prefer sentence case and clear weight/size hierarchy. Avoid forcing long
headings, button labels, or explanatory copy into all caps. Uppercase and
letter-spaced text works best for short metadata such as a ticket serial.

## Surfaces and components

### Theater backdrop

The landing hero uses `frontend/public/background.jpg`, a charcoal cinema
pattern with cream film-related illustrations. Use it as a backdrop or a
texture beneath a translucent overlay, not directly behind long body copy or
form controls.

### Ticket surfaces

Use cream panels against dark sections to make important content feel like a
physical ticket. Rounded corners, perforated dividers, notches, and barcode
details are the signature motifs. Keep these details selective: one or two
recognizable ticket cues per component are usually enough.

The hero ticket is the most literal expression of the motif, with its separate
grant stub, perforation, and barcode. Other sections can borrow one detail
without copying the complete ticket.

### Buttons and links

- Primary actions use a black background with white text.
- Secondary actions can use a white background with black text.
- Hover states may invert those colors.
- Keep labels in sentence case, use a readable UI font, and use a thin outline
  rather than a heavy frame.
- Disabled controls should remain visibly disabled and must not imply they are
  interactive.
- Text links should remain visually distinct from buttons and have an
  identifiable hover and keyboard-focus state.

### Forms and selection

Submission steps and form fields use light surfaces for readability. Use
consistent labels, concise helper text only where it adds information, and
clear selected, locked, loading, success, and error states. Selected project
cards should be visually distinct without making every unselected card look
like a heavy bordered tile.

The estimated grant is the key result of project selection. Give the total
stronger size and contrast than supporting project counts or tracked-hour
metadata, and keep it easy to scan on narrow screens.

## Layout and responsiveness

- Use the shared `.container` for page alignment and keep content widths
  comfortable for reading.
- Build mobile layouts by stacking content, preserving spacing, and allowing
  labels and actions to wrap rather than shrink below readable sizes.
- The hero ticket switches to a side-by-side body and stub at 840px.
- The How It Works journey switches to stacked cards at 680px.
- Submission project and form grids use two columns when there is room
  (650px and above); stack them on smaller screens.
- Check that filmstrip labels, project names, grant totals, and buttons wrap
  without horizontal overflow.

## Accessibility and motion

- Preserve the global visible focus ring on links, buttons, form controls, and
  disclosure summaries.
- Maintain strong text contrast on cream and dark surfaces.
- Keep decorative imagery and film details hidden from assistive technology
  where they convey no information.
- Respect `prefers-reduced-motion`; avoid making hover movement necessary to
  understand state.
- Pair color changes with another cue such as text, an icon, or selection
  shape.

## Implementation

Global tokens, component styles, responsive breakpoints, and interaction states
live in `frontend/app/app.css`. Reuse the existing tokens and class conventions
before introducing new values. Keep component markup semantic and use
component-specific classes for visual differences instead of inline styles.
