import styles from "./Home.module.css";

type IllustrationKind = "thailand" | "vietnam" | "japan" | "singapore" | "newzealand" | "europe";

type SignatureTone = "past" | "featured" | "future" | "planning";

type Journey = {
  name: string;
  dates: string;
  meta?: string;
  countdown?: string;
  illustration: IllustrationKind;
  tone: SignatureTone;
  questions?: number;
};

const pastJourneys: Journey[] = [
  {
    name: "Thailand 2025",
    dates: "12 Jan – 20 Jan",
    illustration: "thailand",
    tone: "past",
    questions: 3,
  },
  {
    name: "Vietnam 2026",
    dates: "10 Mar – 18 Mar",
    illustration: "vietnam",
    tone: "past",
    questions: 1,
  },
];

const upcomingJourneys: Journey[] = [
  {
    name: "Singapore",
    dates: "12 Nov – 16 Nov",
    countdown: "2 months to go",
    illustration: "singapore",
    tone: "future",
  },
  {
    name: "New Zealand",
    dates: "Feb 2027",
    countdown: "5 months to go",
    illustration: "newzealand",
    tone: "future",
  },
];

function Icon({ name }: { name: "home" | "trips" | "explore" | "more" | "message" | "share" | "copy" | "plus" | "arrow" }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

  if (name === "home") return <svg {...common}><path d="M3.5 10.8 12 3.8l8.5 7v8.7a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7Z"/><path d="M9.2 21.2v-6.5h5.6v6.5"/></svg>;
  if (name === "trips") return <svg {...common}><rect x="5" y="6" width="14" height="14" rx="2"/><path d="M9 6V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V6M5 11h14M8 9v4m8-4v4"/></svg>;
  if (name === "explore") return <svg {...common}><circle cx="12" cy="12" r="8.5"/><path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4Z"/></svg>;
  if (name === "more") return <svg {...common}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></svg>;
  if (name === "message") return <svg {...common}><path d="M5.2 5.5h13.6a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-7.2L7 20.7v-3.4H5.2a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z"/></svg>;
  if (name === "share") return <svg {...common}><path d="M14.5 5.5 18 2l3.5 3.5M18 2v12"/><path d="M10.5 6H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4"/></svg>;
  if (name === "copy") return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>;
  if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  return <svg {...common}><path d="m9 5 7 7-7 7"/></svg>;
}

function TimeSignature({ tone }: { tone: SignatureTone }) {
  return (
    <div className={`${styles.signature} ${styles[`signature_${tone}`]}`} aria-label="Trip time signature">
      <span className={styles.travel} style={{ flex: 1.4 }} />
      <span className={styles.activity} style={{ flex: 1 }} />
      <span className={styles.free} style={{ flex: 0.65 }} />
      <span className={styles.travel} style={{ flex: 0.38 }} />
      <span className={styles.reservation} style={{ flex: 0.7 }} />
      <span className={styles.rest} style={{ flex: 1.05 }} />
    </div>
  );
}

function JourneyIllustration({ kind }: { kind: IllustrationKind }) {
  if (kind === "thailand") {
    return (
      <svg className={styles.illustration} viewBox="0 0 120 76" aria-hidden="true">
        <path d="M8 64h104" className={styles.inkSoft}/>
        <path d="M35 63h48M42 58h34M47 52h24M51 46h16M54 39h10" className={styles.inkSoft}/>
        <path d="M57 13v26M63 23v16M51 23v16M47 30h20M43 39h28M39 46h36M34 52h46M30 58h54" className={styles.ink}/>
        <path d="m57 8 3 5h-6ZM47 25l4-5 4 5M59 25l4-5 4 5" className={styles.ink}/>
        <path d="M29 61c-5-10-13-9-18-3m73 2c7-9 16-8 24-2" className={styles.inkSoft}/>
      </svg>
    );
  }

  if (kind === "vietnam") {
    return (
      <svg className={styles.illustration} viewBox="0 0 120 76" aria-hidden="true">
        <path d="M4 61c18 4 33-2 49 1 17 4 37 2 63-2" className={styles.water}/>
        <path d="M12 57c8-18 17-26 25-31 2 14 9 22 17 31M62 58c8-25 16-35 25-43 2 18 9 30 20 43" className={styles.inkSoft}/>
        <path d="M20 51c6-9 10-14 16-19M70 49c6-12 11-19 17-27" className={styles.ink}/>
        <path d="m45 58 9-4 9 4-9 3Z" className={styles.ink}/>
      </svg>
    );
  }

  if (kind === "japan") {
    return (
      <svg className={styles.illustration} viewBox="0 0 145 88" aria-hidden="true">
        <path d="M2 77h141" className={styles.water}/>
        <path d="m10 67 42-45 28 45Z" className={styles.mountain}/>
        <path d="m38 37 14-15 9 15-8-5-7 6Z" className={styles.snow}/>
        <path d="M87 70h43M91 62h35M95 54h27M100 46h18" className={styles.pinkInk}/>
        <path d="M108 27v43M101 42h14M97 50h22M94 58h28M91 66h34" className={styles.pinkInk}/>
        <path d="m108 21 4 7h-8Z" className={styles.pinkInk}/>
      </svg>
    );
  }

  if (kind === "singapore") {
    return (
      <svg className={styles.illustration} viewBox="0 0 135 78" aria-hidden="true">
        <path d="M4 66h126" className={styles.water}/>
        <path d="M50 64V44h12v20M69 64V38h13v26M89 64V46h13v18" className={styles.inkSoft}/>
        <path d="M45 36h63l-8 8H52Z" className={styles.ink}/>
        <path d="M20 64V43m-8 2h17m-14-7 5-14 5 14" className={styles.greenInk}/>
        <path d="M12 52c5 3 11 3 16 0" className={styles.greenInk}/>
      </svg>
    );
  }

  if (kind === "newzealand") {
    return (
      <svg className={styles.illustration} viewBox="0 0 135 78" aria-hidden="true">
        <path d="M3 66h129" className={styles.water}/>
        <path d="m3 61 23-27 18 17 17-31 25 31 17-20 29 30" className={styles.mountain}/>
        <path d="m49 36 12-16 9 16-8-5-6 5Z" className={styles.snow}/>
        <path d="M8 68c18-8 36-5 49 0 20-9 45-8 68 0" className={styles.greenInk}/>
      </svg>
    );
  }

  return (
    <svg className={styles.illustration} viewBox="0 0 135 78" aria-hidden="true">
      <path d="M4 67h127" className={styles.water}/>
      <path d="m8 64 20-17 18 12 19-25 19 20 16-12 27 22" className={styles.mountain}/>
      <path d="M78 61V43h31v18M82 43l11-10 12 10M88 48h4v6h-4m10-6h4v6h-4" className={styles.pinkInk}/>
    </svg>
  );
}

function PostTripActions({ questions }: { questions?: number }) {
  return (
    <div className={styles.postActions} aria-label="Completed trip actions">
      <button type="button" aria-label={`${questions ?? 0} questions`}>
        <Icon name="message" />
        <span>{questions ? `${questions} ${questions === 1 ? "question" : "questions"}` : "Questions"}</span>
      </button>
      <button type="button" aria-label="Share trip">
        <Icon name="share" />
        <span>Share</span>
      </button>
      <button type="button" aria-label="Reuse trip">
        <Icon name="copy" />
        <span>Reuse</span>
      </button>
    </div>
  );
}

function PastJourney({ journey, showLabel = false }: { journey: Journey; showLabel?: boolean }) {
  return (
    <div className={styles.timelineEntry}>
      <div className={styles.phaseLabel}>{showLabel ? "Earlier" : ""}</div>
      <div className={styles.nodeColumn}><span className={styles.node} /></div>
      <article className={styles.pastJourney}>
        <div className={styles.pastCopy}>
          <strong>{journey.name}</strong>
          <span>{journey.dates}</span>
          <TimeSignature tone={journey.tone} />
          <PostTripActions questions={journey.questions} />
        </div>
        <JourneyIllustration kind={journey.illustration} />
      </article>
    </div>
  );
}

function SmallJourneyCard({ journey, phaseLabel }: { journey: Journey; phaseLabel?: string }) {
  return (
    <div className={styles.timelineEntry}>
      <div className={styles.phaseLabel}>{phaseLabel ?? ""}</div>
      <div className={styles.nodeColumn}><span className={`${styles.node} ${phaseLabel === "Planning" ? styles.nodePlanning : ""}`} /></div>
      <article className={styles.smallCard}>
        <div className={styles.smallCardCopy}>
          {journey.countdown ? <span className={styles.countdown}>{journey.countdown}</span> : null}
          <strong>{journey.name}</strong>
          <span>{journey.dates}</span>
          <TimeSignature tone={journey.tone} />
          {journey.meta ? <small>{journey.meta}</small> : null}
        </div>
        <JourneyIllustration kind={journey.illustration} />
        <button type="button" className={styles.cardArrow} aria-label={`Open ${journey.name}`}><Icon name="arrow" /></button>
      </article>
    </div>
  );
}

export default function Home() {
  const japan: Journey = {
    name: "Japan 2026",
    dates: "29 Sep – 12 Oct",
    meta: "8 of 12 days planned",
    countdown: "18 days to go",
    illustration: "japan",
    tone: "featured",
  };

  const europe: Journey = {
    name: "Europe Summer",
    dates: "Jun 2027",
    meta: "3 of 14 days planned",
    illustration: "europe",
    tone: "planning",
  };

  return (
    <main className={styles.home}>
      <div className={styles.phone}>
        <header className={styles.masthead}>
          <div>
            <div className={styles.wordmark}>Ullalu</div>
            <div className={styles.brandLine}>Journeys in time</div>
          </div>
          <div className={styles.mastheadRight}>
            <button className={styles.avatar} type="button" aria-label="Open profile">BB</button>
            <p>Not just places<br/>but a better you.</p>
          </div>
        </header>

        <section className={styles.hero}>
          <h1>Your journeys</h1>
          <p>See where your time is going.</p>
        </section>

        <section className={styles.journeyTimeline} aria-label="Your journeys over time">
          {pastJourneys.map((journey, index) => (
            <PastJourney key={journey.name} journey={journey} showLabel={index === 0} />
          ))}

          <div className={`${styles.timelineEntry} ${styles.todayEntry}`}>
            <div className={styles.phaseLabel}>Today</div>
            <div className={styles.nodeColumn}><span className={styles.todayNode}><i /></span></div>
            <div className={styles.todayNote}>Here · Now</div>
          </div>

          <div className={styles.timelineEntry}>
            <div className={styles.phaseLabel}>Upcoming</div>
            <div className={styles.nodeColumn}><span className={`${styles.node} ${styles.nodeUpcoming}`} /></div>
            <article className={styles.featuredCard}>
              <span className={styles.featuredCountdown}>{japan.countdown}</span>
              <div className={styles.featuredTop}>
                <div>
                  <strong>{japan.name}</strong>
                  <span>{japan.dates}</span>
                  <small>Tokyo · Kyoto · Osaka</small>
                </div>
                <JourneyIllustration kind="japan" />
              </div>
              <TimeSignature tone="featured" />
              <div className={styles.featuredFooter}>
                <span>{japan.meta}</span>
                <button type="button">Continue planning <Icon name="arrow" /></button>
              </div>
            </article>
          </div>

          {upcomingJourneys.map((journey) => (
            <SmallJourneyCard key={journey.name} journey={journey} />
          ))}

          <SmallJourneyCard journey={europe} phaseLabel="Planning" />
        </section>

        <button type="button" className={styles.planButton}>
          <span className={styles.plusCircle}><Icon name="plus" /></span>
          <span><strong>Plan another journey</strong><small>A new place. A new you.</small></span>
        </button>

        <section className={styles.journalFooter} aria-label="Travel thought">
          <p>Collect moments<br/>not just destinations.</p>
          <svg viewBox="0 0 430 132" aria-hidden="true">
            <path d="M0 126 70 90l48 19 58-58 49 39 39-30 66 66Z" fill="#d9e5eb" opacity=".72"/>
            <path d="M48 128 104 103l36 15 72-83 50 61 35-20 73 52Z" fill="#c9dae4" opacity=".82"/>
            <path d="M280 100c4-15 15-29 25-32 5 12 7 23 5 32m-18-20-9 20m26-16 10 17" fill="none" stroke="#17324d" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="304" cy="62" r="5" fill="#17324d"/>
          </svg>
        </section>
      </div>

      <nav className={styles.bottomNav} aria-label="Primary navigation">
        <button className={`${styles.navItem} ${styles.navActive}`} type="button"><Icon name="home"/><span>Home</span></button>
        <button className={styles.navItem} type="button"><Icon name="trips"/><span>My Trips</span></button>
        <button className={styles.navItem} type="button"><Icon name="explore"/><span>Explore</span></button>
        <button className={styles.navItem} type="button"><Icon name="more"/><span>More</span></button>
      </nav>
    </main>
  );
}
