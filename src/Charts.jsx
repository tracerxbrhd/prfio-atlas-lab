import { indicators, regionColors } from './data.js';
const land = [
  'M83 117L105 90 160 64 186 72 216 60 263 90 243 112 260 133 233 166 212 185 202 224 177 233 171 207 141 194 127 156 102 148Z',
  'M233 232L265 222 290 241 306 276 301 309 280 342 266 376 251 367 248 322 231 284 221 249Z',
  'M310 49L350 30 382 43 367 87 336 105 316 89Z',
  'M407 141L430 117 458 117 464 94 489 81 501 115 524 125 532 142 509 159 486 152 476 174 445 172Z',
  'M419 178L455 165 487 176 517 212 504 247 483 288 464 313 440 286 436 256 414 224 404 197Z',
  'M499 112L525 76 581 64 620 77 672 68 715 87 760 105 783 122 765 140 734 143 711 166 686 166 668 196 630 202 623 238 604 231 590 199 567 188 550 164 523 165Z',
  'M649 235L665 250 689 253 710 269 693 278 672 266 655 268Z',
  'M691 290L722 273 752 280 774 310 756 338 719 341 697 325Z',
  'M798 339L806 327 810 347 797 365 788 365Z',
  'M512 280L523 257 530 268 521 293Z',
  'M759 181L765 158 771 159 770 176Z',
];
const project = (c) => ({
  x: 55 + ((c.lon + 180) / 360) * 770,
  y: 35 + ((83 - c.lat) / 150) * 345,
});
export function WorldMap({ rows, selected, onSelect, metric }) {
  return (
    <svg
      className="world-map"
      viewBox="0 0 880 435"
      aria-label={
        'City map coloured by region. Selected indicator: ' +
        indicators[metric].label
      }
    >
      <defs>
        <pattern
          id="map-grid"
          width="44"
          height="43.5"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M44 0H0V43.5"
            fill="none"
            stroke="#d9ded3"
            strokeWidth=".65"
          />
        </pattern>
      </defs>
      <rect x="25" y="18" width="830" height="390" fill="url(#map-grid)" />
      {land.map((d, i) => (
        <path key={i} d={d} fill="#d8dfd1" stroke="#f0f2e9" strokeWidth="2" />
      ))}
      <text x="36" y="39" className="map-coordinate">
        60° N
      </text>
      <text x="36" y="211" className="map-coordinate">
        0°
      </text>
      <text x="755" y="401" className="map-coordinate">
        SCHEMATIC PROJECTION
      </text>
      {rows.map((c) => {
        const { x, y } = project(c);
        const chosen = selected.includes(c.id);
        return (
          <g
            key={c.id}
            role="button"
            tabIndex="0"
            aria-label={
              'Explore ' +
              c.name +
              ', ' +
              indicators[metric].short +
              ' ' +
              c[metric]
            }
            onClick={() => onSelect(c)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(c);
              }
            }}
            className="city-point"
          >
            <circle
              cx={x}
              cy={y}
              r={chosen ? 13 : 9}
              fill={regionColors[c.region]}
              fillOpacity=".16"
            />
            <circle
              cx={x}
              cy={y}
              r={chosen ? 6 : 4.5}
              fill={regionColors[c.region]}
              stroke="#fff"
              strokeWidth="1.5"
            />
            <title>
              {c.name + ': ' + c[metric] + ' ' + indicators[metric].unit}
            </title>
            {[
              'tokyo',
              'vancouver',
              'singapore',
              'cape-town',
              'copenhagen',
              'melbourne',
              'new-york',
            ].includes(c.id) && (
              <text x={x + 12} y={y + 4} className="city-map-label">
                {c.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
export function Scatter({ rows, onSelect }) {
  const x = (v) => 60 + v * 6.3,
    y = (v) => 325 - v * 2.9;
  return (
    <svg
      className="scatter"
      viewBox="0 0 760 390"
      aria-label="Scatterplot: cost of living on the horizontal axis, sustainability on the vertical axis"
    >
      {[0, 20, 40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1="60" x2="690" y1={y(v)} y2={y(v)} stroke="#d9ded3" />
          <text x="40" y={y(v) + 4} textAnchor="end">
            {v}
          </text>
          <text x={x(v)} y="345" textAnchor="middle">
            {v}
          </text>
        </g>
      ))}
      <text x="65" y="18">
        SUSTAINABILITY ↑
      </text>
      <text x="525" y="375">
        COST OF LIVING →
      </text>
      {rows.map((c) => (
        <g
          key={c.id}
          role="button"
          tabIndex="0"
          className="city-point"
          aria-label={
            c.name + ', cost ' + c.cost + ', sustainability ' + c.sustainability
          }
          onClick={() => onSelect(c)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(c);
            }
          }}
        >
          <circle
            cx={x(c.cost)}
            cy={y(c.sustainability)}
            r={6 + Math.sqrt(c.population)}
            fill={regionColors[c.region]}
            opacity=".8"
            stroke="white"
            strokeWidth="1.5"
          />
          <title>
            {c.name +
              ' · cost ' +
              c.cost +
              ' · sustainability ' +
              c.sustainability}
          </title>
        </g>
      ))}
      <text x="65" y="373">
        BUBBLE AREA APPROXIMATES POPULATION
      </text>
    </svg>
  );
}
const radarKeys = ['sustainability', 'mobility', 'green', 'digital', 'cost'];
export function Radar({ rows }) {
  const point = (i, r) => [
    210 + Math.sin((i * 2 * Math.PI) / 5) * r,
    182 - Math.cos((i * 2 * Math.PI) / 5) * r,
  ];
  return (
    <svg
      className="radar"
      viewBox="0 0 420 370"
      role="img"
      aria-label="Comparison radar for sustainability, mobility, green space, digital access and affordability"
    >
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon
          key={r}
          points={radarKeys
            .map((_, i) => point(i, 125 * r).join(','))
            .join(' ')}
          fill="none"
          stroke="#d1d8c9"
        />
      ))}
      {radarKeys.map((key, i) => {
        const p = point(i, 157);
        const end = point(i, 125);
        return (
          <g key={key}>
            <line x1="210" y1="182" x2={end[0]} y2={end[1]} stroke="#d1d8c9" />
            <text x={p[0]} y={p[1]} textAnchor="middle">
              {key === 'cost' ? 'Affordability' : indicators[key].short}
            </text>
          </g>
        );
      })}
      {rows.map((c, i) => (
        <polygon
          key={c.id}
          points={radarKeys
            .map((key, j) =>
              point(
                j,
                ((key === 'cost' ? 100 - c[key] : c[key]) / 100) * 125,
              ).join(','),
            )
            .join(' ')}
          fill={['#d7633b', '#487c78', '#606fa0'][i]}
          fillOpacity=".10"
          stroke={['#d7633b', '#487c78', '#606fa0'][i]}
          strokeWidth="2.4"
        />
      ))}
    </svg>
  );
}
