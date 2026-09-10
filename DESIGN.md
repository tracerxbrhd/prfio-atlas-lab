# Atlas Lab design

## Concept

A printed field atlas translated into a working analytical surface: precise rules, cartographic grid, muted land shapes and categorical colour.

## Palette

Paper #f4f3ed; ink #26342f; field #edf1e7; Europe #d7633b, Asia #487c78, Americas #606fa0, Oceania #ba8c3d, Africa #7a8560.

## Typography

Arial/system sans for city labels and figures; monospace for coordinates and data provenance.

## Spacing

4px/8px control rhythm, 24px panels, 46px desktop gutters. Filters become a compact two-column form on mobile.

## Shapes

Squared cards and ruled surfaces. Geographic grid as the compositional device; dots encode selectable cities.

## Animation

Brief entries and metric-bar transitions support filtering. No automatic chart movement. Reduced-motion disables transitions.

## References

- [Observable Plot — Interactions](https://observablehq.github.io/plot/features/interactions)
- [Observable — Scatterplot with interactive tips](https://observablehq.com/@observablehq/scatterplot-with-interactive-tips)
- [Motion — Reduced motion](https://motion.dev/docs/react-motion-config)

## Interaction and access

Visible focus, semantic controls, labelled forms and native dialogs preserve keyboard behaviour. Selected controls communicate state through text or pressed state as well as colour. Layouts are exercised at 360, 768, 1440 and 2560 pixels. See QA.md for executed checks.
