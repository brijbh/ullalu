import styles from "./Home.module.css";

type Trip = {
  name: string;
  meta: string;
  status?: string;
  visual: string;
  icon: string;
  progress?: number;
};

const continuePlanning: Trip[] = [
  {
    name: "Japan 2026",
    meta: "10–20 Sep · 6 days planned",
    status: "Draft",
    visual: "visualTokyo",
    icon: "🗻",
    progress: 68,
  },
  {
    name: "Europe Summer",
    meta: "14–29 Jun · 4 cities",
    status: "Planning",
    visual: "visualEurope",
    icon: "🏛️",
    progress: 36,
  },
];

const upcomingTrips: Trip[] = [
  {
    name: "Singapore",
    meta: "04–08 Nov · 5 days",
    status: "42 days",
    visual: "visualSingapore",
    icon: "🌆",
  },
  {
    name: "Bali",
    meta: "18–23 Jan · 6 days",
    status: "Upcoming",
    visual: "visualBali",
    icon: "🌴",
  },
  {
    name: "New Zealand",
    meta: "03–14 Apr · 12 days",
    status: "Upcoming",
    visual: "visualNewZealand",
    icon: "🏔️",
  },
];

const completedTrips: Trip[] = [
  {
    name: "Thailand",
    meta: "Feb 2026 · 8 days",
    status: "Completed",
    visual: "visualThailand",
    icon: "🛕",
  },
  {
    name: "Vietnam",
    meta: "Nov 2025 · 7 days",
    status: "Completed",
    visual: "visualVietnam",
    icon: "🏮",
  },
  {
    name: "Europe",
    meta: "Jun 2025 · 14 days",
    status: "Completed",
    visual: "visualArchive",
    icon: "🚆",
  },
];

function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className={styles.tripCard}>
      <div className={`${styles.tripVisual} ${styles[trip.visual]}`}>
        <span className={styles.landmark} aria-hidden="true">{trip.icon}</span>
        {trip.status ? <span className={styles.statusPill}>{trip.status}</span> : null}
      </div>
      <div className={styles.tripInfo}>
        <strong>{trip.name}</strong>
        <span>{trip.meta}</span>
        {typeof trip.progress === "number" ? (
          <div className={styles.progress} aria-label={`${trip.progress}% planned`}>
            <span style={{ width: `${trip.progress}%` }} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Section({
  title,
  trips,
  showNewTrip = false,
}: {
  title: string;
  trips: Trip[];
  showNewTrip?: boolean;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        <button type="button">See all</button>
      </div>
      <div className={styles.rail}>
        {trips.map((trip) => <TripCard key={trip.name} trip={trip} />)}
        {showNewTrip ? (
          <button className={styles.newTripCard} type="button" aria-label="Create a new trip">
            <b aria-hidden="true">+</b>
            <span>New Trip</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <strong>ULLALU</strong>
            <span>See your day. Travel smarter.</span>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconButton} type="button" aria-label="Search">⌕</button>
            <button className={styles.iconButton} type="button" aria-label="Notifications">○</button>
            <button className={styles.avatar} type="button" aria-label="Profile">BB</button>
          </div>
        </header>

        <section className={styles.hero}>
          <h1>Your journeys</h1>
          <p>Pick up where you left off, see what’s coming, or revisit a past trip.</p>
        </section>

        <Section title="Continue planning" trips={continuePlanning} showNewTrip />
        <Section title="Upcoming trips" trips={upcomingTrips} />
        <Section title="Completed trips" trips={completedTrips} />
      </div>

      <nav className={styles.bottomNav} aria-label="Primary navigation">
        <button className={`${styles.navItem} ${styles.navItemActive}`} type="button">
          <span className={styles.navIcon} aria-hidden="true">⌂</span>
          <span>Home</span>
        </button>
        <button className={styles.navItem} type="button">
          <span className={styles.navIcon} aria-hidden="true">▣</span>
          <span>My Trips</span>
        </button>
        <button className={styles.navItem} type="button">
          <span className={styles.navIcon} aria-hidden="true">◇</span>
          <span>Explore</span>
        </button>
        <button className={styles.navItem} type="button">
          <span className={styles.navIcon} aria-hidden="true">☰</span>
          <span>More</span>
        </button>
      </nav>
    </main>
  );
}
