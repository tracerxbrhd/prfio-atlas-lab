import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  cities,
  indicators,
  regions,
  regionColors,
  filterCities,
  mean,
  csvFor,
} from './data.js';
import { WorldMap, Scatter, Radar } from './Charts.jsx';
import './style.css';

function Icon({ name }) {
  const paths = {
    map: 'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5zm6-2v16m6-14v16',
    grid: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
    chart: 'M4 3v17h17M8 15l4-5 4 2 5-7',
    search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    cross: 'M5 5l14 14M5 19 19 5',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.map} />
    </svg>
  );
}
function App() {
  const [tab, setTab] = useState('explore');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const [minimum, setMinimum] = useState(0);
  const [metric, setMetric] = useState('sustainability');
  const [view, setView] = useState('map');
  const [selected, setSelected] = useState(['copenhagen', 'singapore']);
  const [city, setCity] = useState(cities[0]);
  const [message, setMessage] = useState('');
  const dialog = useRef(null);
  const rows = filterCities({ query, region, minimum, sort: metric });
  const compared = selected.map((id) => cities.find((c) => c.id === id));
  function toggleCity(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter((value) => value !== id));
      setMessage('City removed from comparison.');
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
      setMessage('City added to comparison.');
    } else
      setMessage(
        'Your comparison has three cities. Remove one to add another.',
      );
  }
  function showCity(value) {
    setCity(value);
    dialog.current.showModal();
  }
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([csvFor(rows)], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'atlas-lab-scenario-cities.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      'Exported ' +
        rows.length +
        ' cities. Values are illustrative scenario data.',
    );
  }
  function changeTab(next) {
    setTab(next);
    setMessage('');
  }
  return (
    <>
      <a className="skip" href="#main">
        Skip to workspace
      </a>
      <header className="topbar">
        <a className="brand" href="./">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="16" />
            <path d="m20 4 7 16-7 16-7-16 7-16Zm-16 16h32M20 4v32" />
          </svg>
          ATLAS<span>LAB</span>
          <small>URBAN OBSERVATORY</small>
        </a>
        <nav aria-label="Main views">
          <button
            className={tab === 'explore' ? 'active' : ''}
            onClick={() => changeTab('explore')}
          >
            Explorer
          </button>
          <button
            className={tab === 'compare' ? 'active' : ''}
            onClick={() => changeTab('compare')}
          >
            Compare <span>{selected.length}</span>
          </button>
          <button
            className={tab === 'notes' ? 'active' : ''}
            onClick={() => changeTab('notes')}
          >
            Field notes
          </button>
        </nav>
        <button className="method-link" onClick={() => changeTab('notes')}>
          About the data ↗
        </button>
      </header>
      <main id="main">
        <div className="page-title">
          <div>
            <span className="eyebrow">
              AN EXPLORATION OF THE PLACES WE CALL HOME
            </span>
            <h1>
              {tab === 'explore'
                ? 'The shape of urban life.'
                : tab === 'compare'
                  ? 'Different cities. Shared questions.'
                  : 'Read between the data points.'}
            </h1>
            <p>
              {tab === 'explore'
                ? 'Every city is a set of trade-offs. Find the patterns. Explore the possibilities.'
                : tab === 'compare'
                  ? 'Put up to three cities side by side to see where their priorities meet.'
                  : 'The context behind the charts, and the limits of what they can tell us.'}
            </p>
          </div>
          <span className="edition">
            <i /> SCENARIO DATA
            <br />
            <strong>20 CITIES / 2026 EDITION</strong>
          </span>
        </div>
        {tab === 'explore' && (
          <div className="workspace">
            <aside className="filters">
              <div className="filter-heading">
                <h2>Explore the atlas</h2>
                <span>01—20</span>
              </div>
              <label className="search">
                <Icon name="search" />
                <input
                  type="search"
                  aria-label="Search cities or countries"
                  placeholder="Find a city or country"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label className="field-label" htmlFor="region">
                REGION
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option>All regions</option>
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <label className="field-label" htmlFor="metric">
                LOOK THROUGH THE LENS OF
              </label>
              <select
                id="metric"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
              >
                {Object.entries(indicators).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
              <div className="range-label">
                <label className="field-label" htmlFor="minimum">
                  SUSTAINABILITY, AT LEAST
                </label>
                <strong>{minimum}</strong>
              </div>
              <input
                id="minimum"
                type="range"
                min="0"
                max="100"
                step="5"
                value={minimum}
                onChange={(e) => setMinimum(Number(e.target.value))}
              />
              <div className="range-ends">
                <span>0</span>
                <span>100</span>
              </div>
              <button
                className="reset"
                onClick={() => {
                  setQuery('');
                  setRegion('All regions');
                  setMinimum(0);
                  setMetric('sustainability');
                }}
              >
                Reset filters ↺
              </button>
              <div className="filter-note">
                <span className="eyebrow">A NOTE ON PERSPECTIVE</span>
                <p>
                  A high score tells one part of a city's story. Use the
                  indicators together, and keep the context in view.
                </p>
                <button onClick={() => changeTab('notes')}>
                  Read the methodology <Icon name="arrow" />
                </button>
              </div>
              <div className="selected-box">
                <span className="eyebrow">YOUR COMPARISON</span>
                {compared.length === 0 ? (
                  <p>No cities selected yet.</p>
                ) : (
                  compared.map((c) => (
                    <div key={c.id}>
                      <span style={{ background: regionColors[c.region] }} />
                      {c.name}
                      <button
                        aria-label={'Remove ' + c.name + ' from comparison'}
                        onClick={() => toggleCity(c.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
                <button
                  className="compare-button"
                  onClick={() => changeTab('compare')}
                >
                  Compare cities <Icon name="arrow" />
                </button>
              </div>
            </aside>
            <div className="explorer">
              <div className="metrics">
                <div>
                  <span>CITIES IN VIEW</span>
                  <strong>
                    {rows.length.toString().padStart(2, '0')}
                    <small> / 20</small>
                  </strong>
                </div>
                <div>
                  <span>AVG. SUSTAINABILITY</span>
                  <strong>
                    {rows.length
                      ? mean(rows, 'sustainability').toFixed(0)
                      : '—'}
                    <small> / 100</small>
                  </strong>
                </div>
                <div>
                  <span>AVG. GREEN SPACE</span>
                  <strong>
                    {rows.length ? mean(rows, 'green').toFixed(0) : '—'}
                    <small> %</small>
                  </strong>
                </div>
                <div>
                  <span>COMBINED POPULATION</span>
                  <strong>
                    {rows.reduce((sum, c) => sum + c.population, 0).toFixed(1)}
                    <small> M</small>
                  </strong>
                </div>
              </div>
              <section className="map-panel">
                <div className="panel-toolbar">
                  <div>
                    <span className="eyebrow">THE BIG PICTURE</span>
                    <h2>
                      {view === 'map'
                        ? 'A world of different priorities.'
                        : 'What does a greener city cost?'}
                    </h2>
                  </div>
                  <div className="view-switch" aria-label="Chart view">
                    <button
                      aria-label="Map view"
                      aria-pressed={view === 'map'}
                      className={view === 'map' ? 'active' : ''}
                      onClick={() => setView('map')}
                    >
                      <Icon name="map" />
                    </button>
                    <button
                      aria-label="Scatterplot view"
                      aria-pressed={view === 'scatter'}
                      className={view === 'scatter' ? 'active' : ''}
                      onClick={() => setView('scatter')}
                    >
                      <Icon name="chart" />
                    </button>
                  </div>
                </div>
                {rows.length ? (
                  view === 'map' ? (
                    <WorldMap
                      rows={rows}
                      selected={selected}
                      onSelect={showCity}
                      metric={metric}
                    />
                  ) : (
                    <Scatter rows={rows} onSelect={showCity} />
                  )
                ) : (
                  <div className="empty">
                    <Icon name="search" />
                    <h3>No cities in this view.</h3>
                    <p>
                      Try a broader region or a lower sustainability threshold.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        setRegion('All regions');
                        setMinimum(0);
                      }}
                    >
                      Show all cities
                    </button>
                  </div>
                )}
                <div className="map-footer">
                  <div className="legend">
                    {regions.map((r) => (
                      <span key={r}>
                        <i style={{ background: regionColors[r] }} />
                        {r}
                      </span>
                    ))}
                  </div>
                  <span>SELECT A POINT TO EXPLORE ↗</span>
                </div>
              </section>
              <section className="cities-section">
                <div className="list-toolbar">
                  <h2>
                    Cities in focus <span>{rows.length}</span>
                  </h2>
                  <span>
                    Sorted by {indicators[metric].short.toLowerCase()}
                  </span>
                  <button onClick={exportData} disabled={!rows.length}>
                    <Icon name="download" /> Export CSV
                  </button>
                </div>
                <div className="city-grid">
                  {rows.map((c, i) => (
                    <article
                      className="city-card"
                      key={c.id}
                      style={{ '--city-color': regionColors[c.region] }}
                    >
                      <div className="city-card-top">
                        <span>
                          {String(i + 1).padStart(2, '0')} /{' '}
                          {c.region.toUpperCase()}
                        </span>
                        <button
                          className={
                            'compare-toggle ' +
                            (selected.includes(c.id) ? 'chosen' : '')
                          }
                          aria-label={
                            (selected.includes(c.id) ? 'Remove ' : 'Compare ') +
                            c.name
                          }
                          aria-pressed={selected.includes(c.id)}
                          onClick={() => toggleCity(c.id)}
                        >
                          {selected.includes(c.id) ? '✓' : '+'}
                        </button>
                      </div>
                      <button className="city-name" onClick={() => showCity(c)}>
                        {c.name}
                        <span>↗</span>
                      </button>
                      <p>
                        {c.country} <span>· {c.population}M people</span>
                      </p>
                      <div className="city-score">
                        <span>{indicators[metric].short}</span>
                        <strong>
                          {c[metric]}
                          <small>
                            {indicators[metric].unit === '%'
                              ? '%'
                              : indicators[metric].unit === 'million'
                                ? 'M'
                                : ' / 100'}
                          </small>
                        </strong>
                      </div>
                      <div className="score-track">
                        <span
                          style={{
                            width:
                              Math.min(
                                metric === 'population'
                                  ? (c.population / 40) * 100
                                  : c[metric],
                                100,
                              ) + '%',
                          }}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
        {tab === 'compare' && (
          <section className="comparison">
            <div className="comparison-intro">
              <span className="eyebrow">
                SIDE BY SIDE / {selected.length} OF 3 CITIES
              </span>
              <p>
                {selected.length < 2
                  ? 'Select at least two cities in the explorer for a useful comparison.'
                  : 'Different strengths become clearer when you put them in the same frame.'}
              </p>
              <button onClick={() => changeTab('explore')}>
                ＋ Choose cities
              </button>
            </div>
            {compared.length > 0 && (
              <>
                <div className="compare-layout">
                  <div className="radar-panel">
                    <span className="eyebrow">
                      FIVE DIMENSIONS OF CITY LIFE
                    </span>
                    <Radar rows={compared} />
                    <div className="compare-legend">
                      {compared.map((c, i) => (
                        <span key={c.id}>
                          <i
                            style={{
                              background: ['#d7633b', '#487c78', '#606fa0'][i],
                            }}
                          />
                          {c.name}
                        </span>
                      ))}
                    </div>
                    <p>
                      Affordability = 100 − cost index. Other dimensions use
                      their raw 0–100 values; green space is a percentage.
                    </p>
                  </div>
                  <div className="compare-cards">
                    {compared.map((c) => (
                      <article key={c.id}>
                        <span className="eyebrow">
                          {c.country} / {c.region}
                        </span>
                        <button
                          className="remove-city"
                          aria-label={'Remove ' + c.name}
                          onClick={() => toggleCity(c.id)}
                        >
                          ×
                        </button>
                        <h2>{c.name}</h2>
                        <p>{c.description}</p>
                        <dl>
                          <div>
                            <dt>Population</dt>
                            <dd>{c.population}M</dd>
                          </div>
                          <div>
                            <dt>Strongest scenario index</dt>
                            <dd>
                              {['sustainability', 'mobility', 'digital']
                                .sort((a, b) => c[b] - c[a])
                                .map((key, i) =>
                                  i === 0 ? indicators[key].short : null,
                                )}
                            </dd>
                          </div>
                        </dl>
                        <button
                          className="detail-link"
                          onClick={() => showCity(c)}
                        >
                          Explore city profile ↗
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="table-container">
                  <table>
                    <caption>
                      City indicator comparison — illustrative scenario values
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Indicator</th>
                        {compared.map((c) => (
                          <th scope="col" key={c.id}>
                            {c.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(indicators).map(([key, value]) => (
                        <tr key={key}>
                          <th scope="row">
                            {value.label}
                            <small>{value.unit}</small>
                          </th>
                          {compared.map((c) => (
                            <td key={c.id}>{c[key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}
        {tab === 'notes' && (
          <section className="notes">
            <article className="methodology">
              <span className="eyebrow">01 / METHODOLOGY</span>
              <h2>
                An atlas for asking
                <br />
                better questions.
              </h2>
              <p>
                Atlas Lab uses an authored, illustrative dataset to make
                relationships between urban indicators explorable. The cities
                are real. The indicator values are scenarios, not official
                measurements or rankings.
              </p>
              <p>
                The dataset contains 20 cities in five broad regions. All
                filters, averages, charts and exports use the same local
                records. No network request is needed to explore the atlas.
              </p>
              <h3>Reading the indicators</h3>
              {Object.entries(indicators).map(([key, value]) => (
                <div className="method-row" key={key}>
                  <strong>{value.label}</strong>
                  <p>{value.description}</p>
                </div>
              ))}
              <h3>Limits and interpretation</h3>
              <p>
                Urban boundaries vary, indicators use different units, and
                citywide averages hide differences between neighbourhoods. The
                map is schematic. No composite overall score is calculated.
                Avoid using this dataset for relocation, investment or policy
                decisions.
              </p>
              <h3>Reproducibility</h3>
              <p>
                Version 1.0 · authored September 2026. CSV export contains the
                currently filtered records. Mean values are unweighted city
                averages. Population totals sum the illustrative urban-area
                figures.
              </p>
              <button className="download-data" onClick={exportData}>
                <Icon name="download" /> Export current selection
              </button>
            </article>
            <aside className="field-notes">
              <span className="eyebrow">02 / FIELD NOTES</span>
              <article>
                <span>01 — MOBILITY</span>
                <h3>
                  Density is only
                  <br />
                  the beginning.
                </h3>
                <p>
                  Compare Tokyo with Copenhagen. Both scenario cities score
                  strongly on mobility, but their population scales differ by
                  more than an order of magnitude. A similar index can describe
                  very different daily experiences.
                </p>
                <button
                  onClick={() => {
                    setSelected(['tokyo', 'copenhagen']);
                    changeTab('compare');
                  }}
                >
                  Explore this comparison ↗
                </button>
              </article>
              <article>
                <span>02 — GREEN SPACE</span>
                <h3>
                  A park is more
                  <br />
                  than a percentage.
                </h3>
                <p>
                  Singapore and Vienna allocate a similar share of this
                  dataset's urban area to green space. The number does not tell
                  us how accessible that space is, how it feels, or who gets to
                  use it.
                </p>
                <button
                  onClick={() => {
                    setSelected(['singapore', 'vienna']);
                    changeTab('compare');
                  }}
                >
                  Explore this comparison ↗
                </button>
              </article>
              <article>
                <span>03 — COST</span>
                <h3>Better for whom?</h3>
                <p>
                  A lower cost index is not automatically a more affordable
                  life. Wages, household composition and housing access are
                  absent here. Good comparisons make room for what the chart
                  cannot measure.
                </p>
                <button
                  onClick={() => {
                    setView('scatter');
                    changeTab('explore');
                  }}
                >
                  Look at the trade-offs ↗
                </button>
              </article>
            </aside>
          </section>
        )}
      </main>
      <footer className="footer">
        <span>
          ATLAS LAB <i>—</i> A study in urban possibility.
        </span>
        <span>ILLUSTRATIVE DATA / V1.0</span>
        <a href="./credits.html">Sources & credits ↗</a>
      </footer>
      <div className="announcement" role="status">
        {message}
      </div>
      <dialog ref={dialog} className="city-dialog" aria-labelledby="city-title">
        <button
          className="dialog-close"
          aria-label="Close city profile"
          onClick={() => dialog.current.close()}
        >
          ×
        </button>
        <span className="eyebrow">
          {city.region} / {city.country}
        </span>
        <h2 id="city-title">
          {city.name}
          <span>↗</span>
        </h2>
        <p>{city.description}</p>
        <div className="coordinates">
          {Math.abs(city.lat).toFixed(2)}° {city.lat > 0 ? 'N' : 'S'} ·{' '}
          {Math.abs(city.lon).toFixed(2)}° {city.lon > 0 ? 'E' : 'W'}
          <span>{city.population}M PEOPLE</span>
        </div>
        <div className="profile-metrics">
          {Object.entries(indicators)
            .filter(([key]) => key !== 'population')
            .map(([key, value]) => (
              <div key={key}>
                <span>{value.label}</span>
                <strong>
                  {city[key]}
                  <small> {value.unit}</small>
                </strong>
                <div className="profile-track">
                  <i style={{ width: city[key] + '%' }} />
                </div>
              </div>
            ))}
        </div>
        <button className="profile-compare" onClick={() => toggleCity(city.id)}>
          {selected.includes(city.id)
            ? 'Remove from comparison'
            : 'Add to comparison'}{' '}
          <span>{selected.includes(city.id) ? '−' : '+'}</span>
        </button>
        <p className="profile-note">
          Illustrative scenario values. Read the methodology before interpreting
          this profile.
        </p>
        <div role="status" className="profile-message">
          {message}
        </div>
      </dialog>
    </>
  );
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
