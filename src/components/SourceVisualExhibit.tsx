import { PrimarySourceVisualKind } from '../data/theme6Data';

interface SourceVisualExhibitProps {
  kind: PrimarySourceVisualKind;
}

export function SourceVisualExhibit({ kind }: SourceVisualExhibitProps) {
  if (kind === 'versailles-table') {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <p className="text-xs font-semibold text-slate-900">
            Treaty of Versailles (1919) · Key Terms Imposed on Germany
          </p>
          <span className="text-xs font-mono font-semibold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
            414 / 440 punishing clauses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-white border border-slate-200 rounded-md p-3 space-y-1.5">
            <p className="font-semibold text-red-900 border-b border-slate-100 pb-1">
              Territorial Losses
            </p>
            <ul className="space-y-1 text-slate-700 leading-relaxed list-disc pl-4">
              <li>Alsace-Lorraine returned to France; French border extended to west bank of Rhine.</li>
              <li>All overseas colonies in Africa and the Pacific surrendered.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-3 space-y-1.5">
            <p className="font-semibold text-emerald-900 border-b border-slate-100 pb-1">
              Military Restrictions
            </p>
            <ul className="space-y-1 text-slate-700 leading-relaxed list-disc pl-4">
              <li>Strict cap on the size of the German army.</li>
              <li>Prohibited from importing or manufacturing weapons/war material.</li>
              <li>Forbidden to build submarines or maintain an air force.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-3 space-y-1.5">
            <p className="font-semibold text-indigo-900 border-b border-slate-100 pb-1">
              War Guilt &amp; Reparations
            </p>
            <ul className="space-y-1 text-slate-700 leading-relaxed list-disc pl-4">
              <li>Sole responsibility for starting WWI placed on Germany.</li>
              <li>Forced to pay Allies $33 billion in reparations over 30 years.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'bomb-trajectory') {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-900">
            Classroom Physics Diagram (1930s Textbook)
          </p>
          <span className="text-xs font-mono text-slate-600">
            Slide 113 Problem
          </span>
        </div>

        <svg
          viewBox="0 0 420 180"
          className="w-full h-auto bg-white border border-slate-200 rounded-md"
          role="img"
          aria-label="Diagram showing a plane at 1,000 meters altitude flying at 100 meters per second dropping a 1 kilogram bomb along a curved trajectory toward the ground"
        >
          {/* Altitude marker */}
          <line
            x1="44"
            y1="34"
            x2="44"
            y2="146"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x="50" y="92" fontSize="11" fill="#475569" fontFamily="monospace">
            y = 1,000 m
          </text>

          {/* Flight direction */}
          <line
            x1="60"
            y1="34"
            x2="210"
            y2="34"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <polygon points="210,30 220,34 210,38" fill="#334155" />
          <text x="112" y="24" fontSize="11" fill="#0f172a" fontWeight="600">
            Plane speed: 100 m/s
          </text>

          {/* Simple aircraft icon */}
          <path
            d="M46 34 L76 34 L84 26 L88 26 L84 34 L94 34 L98 31 L100 31 L98 36 L46 36 Z"
            fill="#0f172a"
          />

          {/* Parabolic bomb trajectory */}
          <path
            d="M 80 38 Q 200 42 325 144"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <circle cx="198" cy="64" r="4.5" fill="#b91c1c" />
          <text x="208" y="64" fontSize="11" fill="#991b1b" fontWeight="600">
            1 kg bomb
          </text>

          {/* Ground line */}
          <line x1="20" y1="146" x2="400" y2="146" stroke="#334155" strokeWidth="2" />
          <circle cx="325" cy="144" r="5" fill="#b91c1c" />
          <text x="242" y="164" fontSize="11" fill="#334155" fontFamily="monospace">
            Impact angle &amp; force (x distance)
          </text>
        </svg>
      </div>
    );
  }

  if (kind === 'population-growth') {
    const rows = [
      {
        group: 'Slavic people',
        y1900: 166,
        y1930: 226,
        pct: '+36.1%',
        highlight: true,
      },
      {
        group: 'Teutonic people',
        y1900: 124,
        y1930: 149,
        pct: '+20.2%',
        highlight: false,
      },
      {
        group: 'Latin people',
        y1900: 103,
        y1930: 121,
        pct: '+17.5%',
        highlight: false,
      },
    ];

    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-900">
            Population Figures Used in Nazi Math Problem (1900 vs. 1930)
          </p>
          <span className="text-xs font-mono text-slate-600">
            In millions · Slide 114
          </span>
        </div>

        <div className="space-y-3 bg-white border border-slate-200 rounded-md p-3.5">
          {rows.map((r) => (
            <div key={r.group} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">{r.group}</span>
                <span className="font-mono text-slate-700">
                  {r.y1900}M → {r.y1930}M{' '}
                  <span
                    className={
                      r.highlight
                        ? 'font-semibold text-red-800'
                        : 'font-semibold text-slate-900'
                    }
                  >
                    ({r.pct})
                  </span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-slate-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded"
                    style={{ width: `${(r.y1900 / 240) * 100}%` }}
                    title={`1900: ${r.y1900} million`}
                  />
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded overflow-hidden">
                  <div
                    className={`h-full rounded ${
                      r.highlight ? 'bg-red-700' : 'bg-slate-800'
                    }`}
                    style={{ width: `${(r.y1930 / 240) * 100}%` }}
                    title={`1930: ${r.y1930} million`}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 pt-1 border-t border-slate-100 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-2 bg-slate-400 rounded-sm inline-block" />
              1900 population
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-2 bg-slate-800 rounded-sm inline-block" />
              1930 population
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'hierarchy-pyramid') {
    const tiers = [
      {
        label: 'Single Charismatic Party Leader',
        detail: 'Unquestioned authority at the top',
        widthClass: 'w-full sm:w-3/5',
        boxClass: 'bg-slate-900 text-white border-slate-900',
        detailClass: 'text-slate-300',
      },
      {
        label: 'Top Party Members (National)',
        detail: 'Inner circle enforcing ideology and state policy',
        widthClass: 'w-full sm:w-3/4',
        boxClass: 'bg-indigo-50 text-indigo-950 border-indigo-200',
        detailClass: 'text-indigo-800',
      },
      {
        label: 'Lower Party Members (Regional & Local)',
        detail: 'Enforce obedience in towns, schools, and workplaces',
        widthClass: 'w-full sm:w-11/12',
        boxClass: 'bg-amber-50 text-amber-950 border-amber-200',
        detailClass: 'text-amber-800',
      },
      {
        label: 'Masses of People in the Nation',
        detail: 'Obedience to and support for the party is non-negotiable',
        widthClass: 'w-full',
        boxClass: 'bg-white text-slate-900 border-slate-300',
        detailClass: 'text-slate-600',
      },
    ];

    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-900">
            Totalitarian Hierarchical Structure (Slides 100–101)
          </p>
          <span className="text-xs font-mono text-slate-600">
            Top-down power
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          {tiers.map((t) => (
            <div
              key={t.label}
              className={`${t.widthClass} ${t.boxClass} border rounded-md px-3.5 py-2 text-center`}
            >
              <p className="text-xs font-semibold">{t.label}</p>
              <p className={`text-xs mt-0.5 ${t.detailClass}`}>{t.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div className="bg-white border border-slate-200 rounded-md p-2.5">
            <p className="font-semibold text-slate-900">Joseph Stalin</p>
            <p className="text-slate-600">Adopted title: &ldquo;Man of Steel&rdquo; (USSR)</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-2.5">
            <p className="font-semibold text-slate-900">Benito Mussolini</p>
            <p className="text-slate-600">Title: &ldquo;Il Duce&rdquo; — The Leader (Italy)</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-2.5">
            <p className="font-semibold text-slate-900">Adolf Hitler</p>
            <p className="text-slate-600">Title: &ldquo;Führer&rdquo; — Leader / Guide (Germany)</p>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'holodomor-cycle') {
    const steps = [
      {
        step: '1. Forced Collectivization (1929–1933)',
        body: 'Private farms seized into state kolkhozy; prosperous kulaks resist or are sent to Gulags.',
      },
      {
        step: '2. Impossible Grain Quotas & Seizures',
        body: 'Despite severe drought in 1932–1933, Stalin demands massive quotas and withholds stockpiled grain.',
      },
      {
        step: '3. Planned Famine (7–10 Million Deaths)',
        body: 'Starvation crushes resistance to collectivization and suppresses Ukrainian nationalism.',
      },
    ];

    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-900">
            Policy Chain: Collectivization to the Holodomor
          </p>
          <span className="text-xs font-mono text-slate-600">Slides 38–42</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white border border-slate-200 rounded-md p-3 space-y-1"
            >
              <p className="font-semibold text-slate-900">{s.step}</p>
              <p className="text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 'election-bars'
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-900">
          Democratic Choice vs. One-Sided Elections (S.O. 3.3)
        </p>
        <span className="text-xs font-mono text-slate-600">Slides 123–124</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
          <p className="font-semibold text-emerald-900">
            Multi-Party Liberal Democracy
          </p>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-slate-700 mb-0.5">
                <span>Party A (Government)</span>
                <span className="font-mono">42%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-emerald-600 w-[42%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-700 mb-0.5">
                <span>Party B (Official Opposition)</span>
                <span className="font-mono">34%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-blue-600 w-[34%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-700 mb-0.5">
                <span>Other Parties</span>
                <span className="font-mono">24%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-slate-500 w-[24%]" />
              </div>
            </div>
          </div>
          <p className="text-slate-600 pt-1">
            Voters can freely choose rivals and replace leaders.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
          <p className="font-semibold text-red-900">
            Dictatorship One-Sided Election
          </p>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-slate-700 mb-0.5">
                <span>Ruling Regime Claimed Share</span>
                <span className="font-mono font-semibold text-red-800">
                  90%–100%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-red-700 w-[98%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-500 mb-0.5">
                <span>Real Opposition Parties</span>
                <span className="font-mono">0% (Banned)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded overflow-hidden" />
            </div>
          </div>
          <p className="text-slate-600 pt-1">
            Example from Slide 124: North Korea reported 100% for Kim Jong Un to fake legitimacy.
          </p>
        </div>
      </div>
    </div>
  );
}
