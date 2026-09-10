const segments = [
  {
    kind: "travel",
    icon: "✈",
    title: "SQ999",
    route: "BLR → NRT",
    duration: "8h 50m",
    start: "2300",
    end: "0750 +1",
    weight: 8.83,
  },
  {
    kind: "travel",
    icon: "🚆",
    title: "Transfer",
    route: "NRT → Hotel",
    duration: "2h",
    start: "1000",
    end: "1200",
    weight: 2,
  },
  {
    kind: "free",
    icon: "◷",
    title: "Free",
    route: "",
    duration: "1h",
    start: "1200",
    end: "1300",
    weight: 1,
  },
  {
    kind: "rest",
    icon: "🛏",
    title: "Rest",
    route: "",
    duration: "8h",
    start: "2200",
    end: "0600",
    weight: 8,
  },
];

export default function Home() {
  const totalWeight = segments.reduce((sum, item) => sum + item.weight, 0);

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
            {segments.map((segment) => {
              const share = Math.round((segment.weight / totalWeight) * 100);
              return (
                <article
                  key={`${segment.title}-${segment.start}`}
                  className={`segment segment--${segment.kind}`}
                  style={{ flexGrow: segment.weight }}
                  role="listitem"
                >
                  <div className="segment__topline">
                    <span className="segment__icon" aria-hidden="true">{segment.icon}</span>
                    <span className="segment__duration">{segment.duration}</span>
                  </div>

                  <div className="segment__body">
                    <strong>{segment.title}</strong>
                    {segment.route ? <span className="segment__route">{segment.route}</span> : null}

                    {segment.kind === "travel" ? (
                      <div className="travel-line" aria-label={`${segment.start} to ${segment.end}`}>
                        <span className="travel-line__time">{segment.start}</span>
                        <span className="travel-line__track"><span /></span>
                        <span className="travel-line__time">{segment.end}</span>
                      </div>
                    ) : (
                      <div className="stacked-time" aria-label={`${segment.start} to ${segment.end}`}>
                        <span>{segment.start}</span>
                        <small>to</small>
                        <span>{segment.end}</span>
                      </div>
                    )}
                  </div>

                  <span className="segment__share" aria-hidden="true">{share}%</span>
                </article>
              );
            })}
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
