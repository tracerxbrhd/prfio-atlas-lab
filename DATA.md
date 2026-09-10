# Data reference

Atlas Lab keeps its complete scenario dataset in `src/data.js`. There is no runtime API or database.

## City record

Each city is exposed as an object with the following shape:

```js
{
  id,
  name,
  country,
  region,
  lat,
  lon,
  population,
  sustainability,
  mobility,
  cost,
  green,
  digital,
  description
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable local identifier used by the interface. |
| `name` | string | Display city name. |
| `country` | string | Display country name. |
| `region` | string | One of the five project regions. |
| `lat` / `lon` | number | Approximate city-centre coordinates used by the schematic map projection. |
| `population` | number | Illustrative urban-area population in millions. |
| `sustainability` | number | Scenario index; higher is better. |
| `mobility` | number | Scenario index; higher is better. |
| `cost` | number | Relative cost index; higher is more expensive. |
| `green` | number | Illustrative green-space percentage. |
| `digital` | number | Scenario index; higher is better. |
| `description` | string | Short editorial context used in profiles. |

The dataset currently contains 20 records.

## Regions

The defined region set is:

```text
Europe
Asia
Americas
Oceania
Africa
```

Region colors are categorical presentation metadata. They do not encode an ordered value.

## Indicator metadata

`indicators` provides the display label, abbreviated label, unit and interpretation text for each numeric dimension. Charts and interface controls can therefore refer to a shared definition rather than duplicating labels and units.

The project mixes several kinds of numeric fields:

- 0–100 scenario indices;
- a relative cost index;
- a percentage;
- population in millions.

Code consuming an indicator must not assume that all higher values mean “better” or that every field shares a unit.

## Filtering

`filterCities()` accepts:

```js
{
  query = '',
  region = 'All regions',
  minimum = 0,
  sort = 'sustainability'
}
```

A row remains when:

1. its region matches the selected region, unless all regions are selected;
2. the normalized city/country text contains the search query;
3. sustainability is at least the selected minimum.

The result is then sorted descending by the selected numeric field, with city name as the deterministic tie-breaker.

The function returns a sorted array derived from the local records. The interface uses that result for cards, map state, summary values and CSV export.

## Means

`mean(rows, key)` calculates the arithmetic mean of a numeric property over the supplied rows.

```text
mean = sum(row[key]) / number of rows
```

An empty array returns `0` at the utility level; presentation code is responsible for treating an empty filtered state appropriately rather than interpreting zero as an observed city average.

These means are descriptive summaries of the current scenario subset only.

## CSV export

`csvFor(rows)` serializes the current rows using this header:

```text
city,country,region,population_millions,sustainability,mobility,cost_index,green_percent,digital
```

The export intentionally contains the numeric comparison fields rather than interface descriptions or coordinates. It reflects the rows supplied to the function, so exporting after filtering produces the filtered dataset.

The current authored names do not contain commas. If arbitrary user/external records were introduced later, the serializer would need proper CSV quoting rather than simple comma joining.

## Data ownership

All records are authored for this repository. They are not cached copies of an external dataset and should not be cited as official urban statistics.

See [METHODOLOGY.md](METHODOLOGY.md) for interpretation and comparison limits.