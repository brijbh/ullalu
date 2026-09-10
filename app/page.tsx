const segments = [
  {
    kind: "travel",
    icon: "✈",
    title: "SQ999",
    from: "BLR",
    to: "NRT",
    duration: "8h 50m",
    start: "2300",
    end: "0750",
    startDate: "10 Sep",
    endDate: "11 Sep",
    weight: 8.83,
  },
  {
    kind: "travel",
    icon: "🚆",
    title: "Transfer",
    from: "NRT",
    to: "HOTEL",
    duration: "2h",
    start: "1000",
    end: "1200",
    startDate: "11 Sep",
    endDate: "11 Sep",
    weight: 2,
  },
  {
    kind: "free",
    icon: "◷",
    title: "Free",
    duration: "1h",
    start: "1200",
    end: "1300",
    weight: 1,
  },
  {
    kind: "rest",
    icon: "🛏",
    title: "Rest",
    duration: "8h",
    start: "2200",
    end: "0600",
    weight: 8,
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="phone-stage" aria-label="Ullalu Day Card prototype">
        <header className="app-header">
          <div>
            <p className="eyebrow">ULLALU</p>
            <h1>See your day.</h1>
            <p className="subhead">A visual time planner for travel.</p>
          </div>
          <button className="icon-button" aria-label="More options">•••</button>
        </header>

        <section className="day-card">
          <div className="day-card__header">
            <div>
              <p className="day-kicker">DAY 1 · THU 10 SEP</p>
              <h2>Bengaluru → Tokyo</h2>
            </div>
            <span className="day-badge">Travel day</span>
          </div>

          <div className="day-strip" role="list" aria-label="Day itinerary segments">
            {segments.map((segment) => (
              <article
                key={`${segment.title}-${segment.start}`}
                className={`segment segment--${segment.kind}`}
                style={{ flexGrow: segment.weight }}
                role="listitem"
              >
                {segment.kind === "travel" ? (
                  <div className="travel-segment">
                    <div className="travel-segment__identity">
                      <strong>{segment.title}</strong>
                      <span>{segment.duration}</span>
                    </div>

                    <div
                      className="travel-route"
                      aria-label={`${segment.from} ${segment.start} ${segment.startDate} to ${segment.to} ${segment.end} ${segment.endDate}`}
                    >
                      <div className="travel-route__places">
                        <span>{segment.from}</span>
                        <span>{segment.to}</span>
                      </div>

                      <div className="travel-route__graphic" aria-hidden="true">
                        <svg viewBox="0 0 100 32" preserveAspectRatio="none">
                          <path d="M6 25 Q50 3 94 25" />
                          <circle cx="6" cy="25" r="3" />
                          <circle cx="94" cy="25" r="3" />
                        </svg>
                        <span className="travel-route__mode">{segment.icon}</span>
                      </div>

                      <div className="travel-route__schedule">
                        <div>
                          <strong>{segment.start}</strong>
                          <span>{segment.startDate}</span>
                        </div>
                        <div>
                          <strong>{segment.end}</strong>
                          <span>{segment.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="standard-segment">
                    <div className="standard-segment__icon" aria-hidden="true">{segment.icon}</div>
                    <strong>{segment.title}</strong>
                    <span className="standard-segment__duration">{segment.duration}</span>
                    <div className="stacked-time" aria-label={`${segment.start} to ${segment.end}`}>
                      <span>{segment.start}</span>
                      <small>to</small>
                      <span>{segment.end}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="day-insight">
            <span className="day-insight__dot" aria-hidden="true" />
            <p><strong>Long travel day.</strong> Only 1 hour of usable free time.</p>
            <button className="chevron-button" aria-label="Expand day">⌄</button>
          </div>
        </section>

        <section className="prototype-note">
          <p className="eyebrow">DUMMY CARD · PHASE 1</p>
          <p>
            This prototype validates Ullalu&apos;s core geometry: minimum readable segments,
            duration-weighted width, persistent time information, semantic colors, and the
            travel-line treatment for movement.
          </p>
        </section>
      </section>
    </main>
  );
}
