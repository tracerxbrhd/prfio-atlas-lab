# Methodology

Atlas Lab is an interface and visualization study built on a deliberately authored scenario dataset. The values are designed to make filtering, comparison and chart interactions meaningful; they are not presented as official measurements of the named cities.

## What the data represents

The repository contains 20 city scenarios across Europe, Asia, the Americas, Oceania and Africa. Each record combines geographic coordinates, an illustrative population value, five urban indicators and a short editorial description.

The named cities provide recognizable contexts for exploring the interface. A value in Atlas Lab should therefore be read as **the value of the project scenario**, not as a factual claim about the city.

No external API is queried at runtime and no live statistical source is merged into the dataset.

## Indicators

### Sustainability

A 0–100 scenario index combining the idea of resource use, energy and environmental planning. Higher values indicate a stronger sustainability scenario.

It is not derived from a published sustainability index and should not be compared with an external ranking that happens to use the same scale.

### Urban mobility

A 0–100 scenario index representing transit, walking and cycling access. Higher is better within the project dataset.

It does not model travel time, modal share or transport affordability separately.

### Cost of living

A relative 0–100 index in which the New York scenario is set to 100. Higher values mean a more expensive scenario.

Unlike sustainability, mobility and digital access, a higher cost value is not inherently a better outcome. This is one reason Atlas Lab does not compute an overall city score.

### Green space

An illustrative percentage representing urban land allocated to public green space.

The project does not standardize what counts as an urban boundary or green-space category, so these percentages must not be interpreted as comparable official land-use measurements.

### Digital infrastructure

A 0–100 scenario index for connectivity and digital public services. Higher values represent stronger digital access in the authored scenario.

### Population

An illustrative urban-area population in millions. Boundaries are explicitly not standardized between records.

Population is useful as a contextual dimension and scatterplot variable, but it is not normalized into the radar comparison.

## No composite ranking

Atlas Lab intentionally avoids a single score or ordered list of “best cities.”

The indicators represent different concepts, one of them (`cost`) has a different desirability direction, and the project defines no defensible weighting system. Averaging the five values would therefore create a ranking without a real methodology behind it.

The comparison interface keeps the dimensions separate so the viewer can inspect trade-offs directly.

## Radar comparison

The radar plot compares dimensions that already occupy percentage-like or 0–100 ranges. It is a visual summary of the selected records, not an area-based score.

The exact values remain available in the adjacent table. Users should use the table when precise numeric comparison matters.

Population is excluded from the radar because its unit and range are fundamentally different.

## Map

City latitude and longitude identify approximate city-centre positions. The visualization projects those coordinates onto a schematic world surface.

The land shapes and grid are compositional interface elements. Atlas Lab is not intended for navigation, boundary analysis or geographic measurement.

## Filtering and summary values

Search, region and minimum-sustainability controls operate on the same in-memory city collection. Sorting changes display order without changing membership in the current subset.

Summary means are arithmetic averages over the currently filtered rows. An empty subset produces no meaningful mean rather than introducing imputed values.

Because all filtering is local and deterministic, the map, cards, summaries and CSV export can represent the same selected set without asynchronous data synchronization.

## Interpretation limits

Atlas Lab does not establish correlations as causal relationships. A visible relationship in a scatterplot is only a pattern in these 20 authored scenarios.

The small sample, illustrative values, non-standardized population boundaries and simplified indicators make inferential statistical claims inappropriate.

For the exact record structure and transformation functions, see [DATA.md](DATA.md).