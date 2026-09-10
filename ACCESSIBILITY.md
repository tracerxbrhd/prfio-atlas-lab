# Accessibility

Atlas Lab combines ordinary interface controls with interactive SVG visualizations. The accessibility approach is therefore based on two rules: interactions must remain keyboard reachable, and a chart must not be the only way to obtain important data.

## Explorer controls

Search, region, threshold and sort controls use semantic form elements with labels. Selected states communicate their meaning through text or control state rather than color alone.

Visible focus styling is retained throughout the interface. Reduced-motion preferences suppress nonessential transitions.

## Schematic map

City markers in the SVG map are interactive controls rather than pointer-only dots. Markers expose an accessible name and can be reached from the keyboard.

Enter/Space activation opens the same city information available to pointer users. Region color is supplementary: city identity is communicated by its accessible label and profile content.

The map is schematic and is not presented as a geographic navigation tool.

## Scatterplot

Scatterplot points expose city identity and the values represented by the selected axes. Axis selection uses normal controls rather than requiring direct manipulation of the SVG.

The same city records remain available through the explorer cards and profiles, so the scatterplot is not the sole route to the underlying values.

## City comparison

The radar chart is paired with a data table containing the exact indicator values for each selected city.

This is important for both accessibility and interpretation: radar geometry is useful for recognizing shape differences but is poor at communicating precise values. The table is the authoritative numeric alternative.

Comparison selection is capped at three cities to keep both the graphic and table legible.

## Dialogs and focus

City profiles use native dialog behavior. Keyboard dismissal and focus restoration are covered by the browser interaction suite.

Controls retain visible focus, and content is not intentionally hidden behind hover-only interaction.

## Responsive layouts

The application is exercised at 360, 768, 1440 and 2560 pixel viewport widths. Responsive checks include the explorer, comparison and notes views and guard against document-level horizontal overflow.

The goal is not to preserve a desktop chart at miniature scale. Controls and surrounding layout adapt while the data remains accessible through textual structures.

## Automated checks

The Playwright suite includes axe scans over representative explorer, profile, comparison and notes states in addition to interaction tests.

Automated accessibility testing can catch structural and contrast regressions, but it does not replace screen-reader evaluation, user testing or a complete WCAG audit. The repository therefore describes these checks as test coverage rather than certification.

## Design constraints

Atlas Lab uses region colors as categorical cues, but meaningful state is not intended to depend on color alone. Small interface labels use readable sizes, and secondary foreground colors were adjusted during browser review for contrast.

Motion is brief and functional; users requesting reduced motion receive transitions without unnecessary movement.

For indicator interpretation and the limits of visual comparison, see [METHODOLOGY.md](METHODOLOGY.md).