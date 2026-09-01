# Reference: Design principles and UX laws

Consultation document for all agents. These laws and principles govern design decisions at each phase of the process.

## System links

| Resource | Link |
|----------|------|
| Orchestrator | [brand-design-system](../skills/brand-design-system/SKILL.md) |
| Checklist | [checklist.md](checklist.md) |
| Agents | [05](../agents/05-brand-strategist.md) · [06](../agents/06-identity-logo.md) · [07](../agents/07-color-system.md) · [08](../agents/08-typography.md) · [09](../agents/09-ui-ux.md) · [10](../agents/10-spacing-layout.md) · [11](../agents/11-layout-build.md) |

---

## Gestalt principles of visual perception

### 1. Proximity
Elements that are close together are perceived as a group, regardless of shape or color.
**UI application**: Labels tight to their inputs. Related button groups clustered together. Greater space between sections than between elements within the same section.
**Anti-pattern**: A label equidistant between two inputs — the user cannot tell which it belongs to.

### 2. Similarity
Elements with the same color, shape, size, or texture are perceived as the same kind.
**UI application**: All links the same color. All primary buttons identical. Icons from the same set.
**Anti-pattern**: Buttons with different styles for the same action.

### 3. Closure
The brain completes incomplete shapes or missing information.
**UI application**: Cards cut off at the edge to suggest horizontal scroll. Stylized icons that need not be literal to be recognizable. Logos such as NBC, FedEx.

### 4. Continuity
The eye naturally follows lines, curves, and sequences.
**UI application**: Step flows in a horizontal line. Timelines. Progress bars. Breadcrumbs. Natural vertical scroll.

### 5. Figure–ground
The brain separates a focal element (figure) from its context (ground).
**UI application**: Modals with dark overlay. Dropdowns over content. Elevated cards over the background. Focus rings.
**Anti-pattern**: Insufficient contrast between element and background — the user cannot tell what is clickable.

### 6. Common region
Elements inside the same container are perceived as a group.
**UI application**: Cards. Sections with distinct background. Forms grouped in fieldsets. Toolbars.

### 7. Symmetry and order (Prägnanz)
The brain prefers to interpret shapes as simple, regular, and ordered.
**UI application**: Consistent grids. Alignment. Visual balance. Avoid chaotic layouts without purpose.

### 8. Common fate
Elements that move together are perceived as a group.
**UI application**: Coordinated animations. Panel slide transitions. Grouped parallax.

### 9. Uniform connectedness (connectivity)
Elements connected visually (lines, arrows) are seen as related.
**UI application**: Connector lines in workflows. Dividers. Progress steppers with a connecting line.

---

## UX laws

### Fitts’s law
T = a + b × log₂(1 + D/W)  
Time to reach a target increases with distance and decreases with size.
**Rule**: Make CTAs large. Place frequent actions in easy-to-reach areas. Touch targets ≥ 44px. Screen edges and corners are “infinitely” reachable.

### Hick–Hyman law
T = b × log₂(n + 1)  
Decision time grows with the number of options.
**Rule**: Limit options. Progressive disclosure. Menus ≤ 7 items. Smart defaults. Search for large catalogs.

### Jakob’s law
Users expect your site to work like others they already know.
**Rule**: Use established patterns. Logo top-left. Search top-right. Horizontal nav or hamburger. Close control top-right. Do NOT innovate on basic navigation.

### Miller’s law
7 ± 2 chunks of information in working memory.
**Rule**: Group information into 3–5 chunks. Phone numbers in groups. Multi-step forms. Categorized lists.

### Law of Prägnanz
The brain interprets ambiguous images in the simplest way possible.
**Rule**: Simplicity in design. Legible icons. One message per section. If you need to explain the UI, the UI is wrong.

### Von Restorff effect (isolation effect)
What is different is remembered more.
**Rule**: One prominent primary CTA. Strategic use of accent color. Break the pattern only on purpose.

### Serial position effect
The first and last items in a series are remembered best.
**Rule**: Most important actions at the start and end of nav. “Start” and “Help” in the most memorable positions.

### Common region law
Elements enclosed by a border or background are seen as a group.
**Rule**: Cards to group content. Alternating row backgrounds. Fieldsets in forms.

### Tesler’s law (conservation of complexity)
Every application has an irreducible level of complexity.
**Rule**: Absorb complexity in the system; do not push it onto the user. Smart defaults. Auto-fill. Real-time validation.

### Zeigarnik effect
People remember incomplete tasks better than completed ones.
**Rule**: Progress indicators. Onboarding with checklists. “Your profile is 80% complete.”

### Doherty threshold
Productivity spikes when the system responds in < 400ms.
**Rule**: Instant loading states. Skeleton screens. Optimistic UI. Debounce on search.

---

## Visual design principles

### Contrast
Differences between elements create hierarchy and focus.
- Size contrast: large vs small
- Weight contrast: bold vs light
- Color contrast: dark vs light, saturated vs neutral
- Space contrast: dense vs airy

### Balance
Visual distribution of weight in the composition.
- Symmetric: formal, stable, traditional
- Asymmetric: dynamic, modern, engaging
- Radial: centered, focal

### Alignment
Every element should have a visual connection to another.
**Rule**: Nothing arbitrary. Each element aligned to a grid or to another element. Invisible alignment (underlying grid) creates order.

### Repetition
Recurring visual elements create cohesion.
**Rule**: Same icon style. Same palette. Same border radius. Same typographic weight for the same hierarchical level.

### Scale
Relative size communicates importance.
**Rule**: Most important = largest. Minimum ratio between heading and body: 1.5:1 (preferably 2:1+).
