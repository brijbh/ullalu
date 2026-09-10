# Ullalu — Product Requirements & Experience Definition

**Project:** Ullalu  
**Document type:** Product Requirements / Experience Definition  
**Status:** Initial product definition  
**Primary focus:** Visual, time-aware travel itinerary planning  
**Target implementation folder:** `C:\dev\ullalu`  
**Reference documents folder:** `C:\dev\ullalu\ref-docs`

---

## 1. Product Summary

Ullalu is a visual travel itinerary planner built around one core idea:

> **A traveller should be able to glance at a day and immediately understand where their time goes.**

Traditional itinerary products usually present a list of places, reservations, and activities with time information attached.

Ullalu reverses that model.

The primary object is **time**.

Places, activities, transport, free time, fixed reservations, buffers, and rest are represented as visual segments within a day. The width and content of those segments help the traveller understand the real shape of the day.

At a glance, Ullalu should make it possible to answer questions such as:

- Are we spending half the day travelling?
- How much usable time do we actually have?
- Is this day too tightly packed?
- Do we have enough time between two fixed reservations?
- How much of this day is activity versus travel?
- Is there enough free time to add something else?
- Will changing one activity create more usable time?
- Are we likely to arrive late?
- Is this route inefficient?

Ullalu is therefore not just an itinerary viewer.

It is a **visual time planner for travel**.

---

## 2. Product Principle

The central product principle is:

> **Users enter intentions and constraints. Ullalu generates movement and time geometry.**

A user should not manually construct every travel segment.

For example, the user may enter:

- Hotel
- Mt Fuji
- Spend 5 hours
- Dinner reservation at 19:00
- Return to hotel

Ullalu should determine, where possible:

- travel time from hotel to Mt Fuji
- mode of transport
- travel time from Mt Fuji to the next destination
- gaps between items
- free time
- usable time
- buffer time
- warnings
- likely conflicts

The resulting itinerary should then be represented visually.

---

## 3. Core User Value

The core value of Ullalu is not simply:

> “Plan my trip.”

It is:

> **“Show me what my day actually looks like.”**

A traveller should be able to look at a single Day Card and immediately recognise:

- a travel-heavy day
- a relaxed day
- a tightly packed day
- a day with significant free time
- a day dominated by one long activity
- a day with dangerous timing around a reservation
- a day that could be reorganised more efficiently

This interpretation should happen visually before the user reads detailed text.

---

# 4. Core Visual Model

## 4.1 Day Card

The primary Ullalu interface object is the **Day Card**.

A collapsed Day Card consists of three main zones:

```text
┌─────────────────────────────────────┐
│ DAY 1 · THU 10 SEP                  │
├─────────────────────────────────────┤
│                                     │
│          DAY STRIP                  │
│                                     │
├─────────────────────────────────────┤
│ Long travel day · 1h free        ▾ │
└─────────────────────────────────────┘
```

The Day Card must be useful even without expansion.

The expanded card may show:

- map
- detailed route information
- transport options
- reservation details
- hotel information
- notes
- opening hours
- warnings
- alternatives
- booking references
- other contextual information

The collapsed card remains the primary scanning experience.

---

## 4.2 Day Strip

The **Day Strip** is the defining visual component of Ullalu.

It displays the day as a sequence of time-based segments.

Example:

```text
DAY 2 · THU 11 SEP

┌────────┬───────────────┬──────┬─────────┬───────────┐
│ 🚗     │      ⛰        │  ◷   │    🍴   │     🛏    │
│ 2h30   │    MT FUJI    │  3h  │ DINNER  │   REST    │
│0600    │      5h       │1330  │    2h   │    10h    │
│ to     │0830 to 1330   │ to   │1800     │2000       │
│0830    │               │1630  │ to 2000 │ to 0600   │
└────────┴───────────────┴──────┴─────────┴───────────┘
```

The Day Strip should communicate the character of the day through:

- width
- color
- iconography
- duration
- start time
- end time
- segment sequence

---

# 5. Segment Geometry

## 5.1 Minimum Segment Width

The smallest possible segment must remain readable.

The minimum segment width is defined by the ability to display:

```text
0000
 to
9999
```

The minimum width is therefore a **content-based design token**, not a fixed time interval.

For implementation purposes, define:

```text
U = minimum readable segment width
```

The exact pixel value of `U` should be determined through real mobile typography testing.

---

## 5.2 Segment Width Rule

All segments receive at least the minimum width `U`.

Additional available horizontal space is then distributed approximately according to real duration.

Conceptually:

```text
segment width >= U
```

Then:

```text
remaining available width
        ↓
distributed by duration
```

This preserves both:

- usability
- a meaningful visual relationship to time

The Day Strip is therefore **time-proportional, but not mathematically rigid**.

Very short segments remain tappable and readable.

---

## 5.3 Height

Vertical space may be used freely to preserve information.

On mobile, horizontal space is scarce; height is comparatively inexpensive.

A narrow segment may therefore show:

```text
┌───────┐
│  🚆   │
│ TRAIN │
│ 1700  │
│  to   │
│ 1730  │
│  30m  │
└───────┘
```

The product should not aggressively compress the Day Strip vertically.

The Day Strip is the primary Ullalu visualization and should be given enough height to remain useful.

---

# 6. Segment Information Priority

Each segment should progressively reveal information depending on available width.

Priority:

1. start/end time
2. duration
3. icon
4. category/name
5. route or place
6. secondary details

Example minimum state:

```text
1700
 to
1730
```

Small state:

```text
🚆
1700
 to
1730
30m
```

Medium state:

```text
🚆
NRT → Hotel
2h
1000 → 1200
```

Large state:

```text
✈
SQ999
BLR → NRT
8h 50m
2300 → 0750 (+1)
```

Essential timing information must never disappear merely because a segment is narrow.

---

# 7. Segment Categories and Colors

Color communicates **semantic category**.

Icons communicate subtype or transport mode.

Transport modes must not use separate colors.

## Proposed semantic categories

| Category | Visual family | Meaning |
|---|---|---|
| Travel | Blue | Movement from A to B |
| Activity / Place | Green | Time spent at a destination |
| Free Time | Warm yellow | Unscheduled usable time |
| Fixed Reservation | Rose / pink | Time-constrained reservation, tour, event, meal |
| Sleep / Rest | Indigo / muted violet | Overnight or rest period |
| Buffer / Other | Neutral grey | Waiting, check-in, security, transfer overhead, buffer |

Examples of travel icons:

- flight
- train
- metro
- bus
- taxi/car
- walk
- ferry

The color remains Travel blue regardless of transport mode.

---

# 8. Travel Segment Visual Language

Travel segments should use a distinctive **travel line** representation.

Example:

```text
BLR ●  - - - - - ✈ - - - - -  ● NRT
    2300                    0750
```

For train,bus,car,boat,ship,ferry,two wheelers,walking,etc with suitable icon:

```text
NRT ●  - - - - 🚆 - - - -  ● HOTEL
    1000                  1200
```

This travel line should appear inside the travel segment.

Times must not be duplicated outside the segment.

The travel segment should make movement visually obvious, rather than behaving like a generic colored block.

---

# 9. Free Time

Free time is one of Ullalu's most important outputs.

It should normally be **calculated**, not manually entered.

For example:

```text
Mt Fuji ends      16:00
Dinner starts     19:00
```

Ullalu generates:

```text
FREE
3h
1600
to
1900
```

Free time must remain readable even when visually small.

It should be highly visible because it directly answers:

> “How much time do I actually have?”

---

# 10. Fixed Reservations

Fixed reservations act as anchors in the day.

Examples:

- restaurant booking
- tour
- concert
- train reservation
- timed museum entry
- airport transfer
- appointment

A fixed item cannot simply move when surrounding items are rearranged.

Example:

```text
DINNER
19:00–21:00
FIXED
```

If preceding activities cause an estimated arrival after 19:00, Ullalu should surface a warning. Maybe also use some color hints/icons to draw attention.

Example:

```text
⚠ Expected arrival: 19:20
Reservation: 19:00
You may be 20 minutes late.
```

---

# 11. Day Insight

The Day Card should interpret the visual schedule.

Examples:

- Long travel day · 1h usable time
- Relaxed day · 4h 30m free
- Very tight · only 20m buffer before dinner
- 5h 40m spent in transit
- Looks good · ~3h free
- Heavy travel · keep the evening light

The insight does not replace the Day Strip.

The strip provides the visual evidence.

The insight provides a concise interpretation.

---

# 12. New Trip Flow

## 12.1 Initial Trip Form

A new itinerary begins with a lightweight form.

Fields:

```text
Trip name
Start date
End date
Starting place
Ending place
Return to starting place?
```

Example:

```text
Trip name
Japan 2026

Start date
10 Sep 2026

End date
20 Sep 2026

Starting place
Bengaluru, India

Ending place
Tokyo, Japan

Return to starting place?
Yes
```

The user should not need to define the complete return route during initial setup.

---

# 13. Storage Choice

After creating the trip basics, Ullalu asks:

> **Where should Ullalu save your trip?**

Three storage modes are planned.

## Google Drive

- saved in the user's own Google Drive
- private by default
- free
- Drive access requested only when this option is chosen

## Ullalu Cloud

- stored on Ullalu infrastructure
- sync across devices
- easier publishing/sharing
- paid option

## Save to Device

- downloadable portable Ullalu file
- user manages the file
- free

Possible file format:

```text
japan-2026.ullalu
```

The internal format may be structured JSON packaged as an Ullalu document. We will need to show a note to inform that the trip iten file is downloaded to the user's device. 

---

# 14. Authentication

Google login is the preferred authentication method.

Important separation:

```text
Google Sign-in
      │
      └── identity

Google Drive
      │
      └── optional storage permission
```

Signing in with Google must not automatically grant Ullalu Drive access.

Drive permissions are requested only if the user selects Google Drive as their storage method.

---

# 15. Offline Behaviour

Travel itineraries must remain usable when internet connectivity is weak or unavailable.

The current trip should therefore be cached locally regardless of canonical storage.

Conceptually:

```text
        CANONICAL STORAGE

Google Drive   Ullalu Cloud   File
     │              │          │
     └──────────────┼──────────┘
                    ↓
             LOCAL TRIP CACHE
                    ↓
                ULLALU UI
```

The traveller should still be able to view their active itinerary while:

- underground
- roaming
- offline
- on a plane
- in areas with poor mobile service

---

# 16. Day Composer

The Day Composer is the primary itinerary creation experience.

The screen consists of two main areas:

```text
DAY STRIP
(always visible)

────────────────────

EDITOR / COMPOSER
```

The bottom editor asks:

> **What happens next?**

Possible item types:

- Place / Activity
- Reservation
- Flight / Transport
- Hotel / Rest

The form changes based on the selected item type.

---

# 17. Live Day Building

As users enter details in the editor, the Day Strip above updates live.

Example:

User enters:

```text
SQ999
BLR → NRT
Departure 23:00
Arrival 07:50 +1
```

The Day Strip immediately adds a flight segment.

Then the user adds:

```text
Hotel Gracery Shinjuku
```

Ullalu knows:

```text
previous location = NRT
next location = Hotel
```

Ullalu should calculate or suggest the travel segment between them.

The user should not normally need to manually create local transport.

---

# 18. Google Maps / Routes Integration

Google Maps and related services are expected to provide much of Ullalu's location and routing intelligence.

Potential capabilities include:

- place search
- geocoding
- route duration
- route distance
- driving
- transit
- walking
- cycling where appropriate
- public transport
- opening hours
- map previews
- alternative routes

Conceptually:

```text
USER INTENTION
Hotel → Mt Fuji
       ↓
GOOGLE / ROUTING SERVICES
       ↓
car / train / bus options
duration
distance
       ↓
ULLALU
       ↓
Travel segment
```

The route system should eventually be abstracted so Ullalu is not permanently tied to a single provider.

---

# 19. Sticky Day Strip During Editing

This is a design invariant.

> **During itinerary creation or editing, the current Day Strip remains visible.**

The strip must remain visible:

- while editing
- while searching for a place
- while selecting transport
- while changing duration
- while the mobile keyboard is open

The Day Card may reduce its height, but the Day Strip itself remains visible.

---

## 19.1 Screen States

### Review state

Full Day Card:

```text
Day/date
Day Strip
Insight
Notes/warnings
```

### Composer state

Reduced Day Card:

```text
Day/date
Day Strip
Insight
```

### Keyboard-open state

Compressed sticky state:

```text
Day/date
Day Strip
free-time summary
```

Secondary content disappears before the Day Strip disappears.

---

# 20. Live Geometry Feedback

Changes in the editor should visibly alter the Day Strip.

Example:

```text
Mt Fuji duration
5h → 3h
```

Before:

```text
┌──────┬────────────────────┬─────┐
│TRAVEL│      MT FUJI       │FREE │
│ 2h30 │        5h          │ 1h  │
└──────┴────────────────────┴─────┘
```

After:

```text
┌──────┬─────────────┬───────────┐
│TRAVEL│   MT FUJI   │   FREE    │
│ 2h30 │     3h      │    3h     │
└──────┴─────────────┴───────────┘
```

This immediate cause-and-effect is a defining Ullalu interaction.

---

# 21. Automatic Travel Creation

For normal local movement, the user should enter destinations, not travel records.

Example user input:

```text
Hotel
Sensoji Temple
Ueno Park
Shibuya Sky
Hotel
```

Ullalu should produce:

```text
HOTEL
 ↓
🚇 35 min
 ↓
SENSOJI · 2h
 ↓
🚇 20 min
 ↓
UENO · 3h
 ↓
🚇 28 min
 ↓
SHIBUYA SKY · 2h
 ↓
🚇 35 min
 ↓
HOTEL
```

Travel is a first-class object in the resulting itinerary, but it should often be automatically generated.

---

# 22. Day Completion

The user may explicitly finish a day.

Possible action:

```text
+ Add another item

✓ Finish Day 1
```

When finishing, Ullalu may summarise:

```text
Travel             11h 05m
Activities           2h 00m
Waiting / buffer     1h 10m
Free time            1h 45m
Rest                 8h

⚠ Long travel day
✓ Connections look safe
✓ 1h 45m usable time
```

Then:

```text
Day 2 →
```

---

# 23. Home Screen

The Home screen has been visually frozen for the first implementation.

The design uses **horizontal thumbnail groups**, providing stronger visual separation between current and historic travel.

Primary sections:

## Continue Planning

Shows active draft/planning trips.

Approximately three horizontal cards may be visible, including a New Trip shortcut.

Example:

```text
Continue planning                 See all

[ Japan 2026 ] [ Europe ] [ + New Trip ]
```

## Upcoming Trips

Horizontal thumbnails.

Example:

```text
Upcoming trips                    See all

[ Singapore ] [ Bali ] [ New Zealand ]
```

## Completed Trips

Horizontal thumbnails.

Example:

```text
Completed trips                   See all

[ Thailand ] [ Vietnam ] [ Europe ]
```

This design is preferred over one large vertical card per section because it:

- visually separates planning/upcoming trips from old trips
- improves scanning
- creates stronger visual rhythm
- exposes multiple trips without excessive scrolling
- keeps old trips visually secondary

---

# 24. Main Navigation

Current proposed primary navigation:

```text
Home
My Trips
Explore
Notifications
```

Shared trips may be accessible through My Trips or another clearly connected view.

The information architecture should avoid unnecessary top-level destinations.

---

# 25. My Trips

My Trips contains the user's own itineraries.

Possible groups/tabs:

```text
Drafts
Upcoming
Completed
```

This page supports deeper browsing beyond the horizontal Home summaries.

---

# 26. Shared With Me

Shared itineraries are trips created by other users and explicitly shared with the current user.

Examples:

- family trip
- friend's itinerary
- collaborative planning
- trip shared for review

This must remain distinct from public itineraries.

---

# 27. Explore

Explore contains public Ullalu itineraries.

Examples:

- Japan in 10 days
- Kyoto slow travel
- Tokyo with children
- Weekend in Singapore
- Food-focused Osaka trip

Public itineraries should be useful as planning references.

The strongest future action is:

> **Use this itinerary**

A user should be able to copy/adapt a public itinerary into their own trip.

The copied itinerary then becomes editable with Ullalu's time-aware Day Strips.

---

# 28. Sharing and Publishing

Ullalu should distinguish:

```text
PRIVATE
Only me

SHARED
Specific people

PUBLIC — UNLISTED
Anyone with the link

PUBLIC — LISTED
Appears in Explore
```

Publishing is not the same thing as sharing.

---

# 29. Privacy-Safe Publishing

Private itineraries can contain sensitive travel information.

Examples:

- exact hotel
- exact dates
- flight numbers
- reservation details
- confirmation numbers
- booking references
- personal notes

Publishing should therefore generate a **sanitised public representation**.

Example:

```text
PUBLISH JAPAN TRIP

Include

✓ Places
✓ Travel modes
✓ Travel durations
✓ Activity durations
✓ Day Strip

□ Exact hotel
□ Exact travel dates
□ Flight numbers
□ Reservation details
□ Personal notes

Allow questions
✓
```

Highly sensitive booking information should never be publishable.

Architecture:

```text
PRIVATE ITINERARY
      │
      │ Publish
      ↓
SANITISED PUBLIC SNAPSHOT
      ↓
PUBLIC ULLALU PAGE
```

---

# 30. Questions on Public Itineraries

Public itinerary owners may optionally enable questions.

This should be framed as:

> **Ask about this itinerary**

rather than generic social comments.

Examples:

- Was 5 hours enough at Mt Fuji?
- Would you still take the Narita Express?
- Was Day 5 too packed?
- Was 2 hours enough at Sensoji?

Questions may eventually be associated with:

- the whole itinerary
- a specific day
- a specific segment

This creates useful travel knowledge without turning Ullalu into a generic social network.

---

# 31. Social Scope

Ullalu should keep social features restrained.

Preferred model:

```text
Publish
   ↓
Discover
   ↓
Ask
   ↓
Copy / Adapt
```

Avoid making likes, followers, feeds, or social engagement the core product.

Planning remains primary.

---

# 32. Portable Trip Model

Ullalu should have a storage-independent internal trip representation.

Conceptually:

```text
Trip document
     │
     ├── local/file
     ├── Google Drive
     └── Ullalu Cloud
```

The same itinerary model should be used regardless of storage provider.

Avoid creating separate application logic for each storage method.

---

# 33. Initial Development Strategy

The build should start now, but implementation order matters.

The first goal is **not** authentication, database design, or cloud infrastructure.

The first goal is to validate the core Ullalu experience in a real mobile browser.

## Phase 1 — Foundation

Build:

- application shell
- mobile-first responsive layout
- typography
- spacing
- color tokens
- semantic segment colors
- icon system
- basic routing
- reusable UI primitives

Avoid hardcoding screen-specific styling when reusable tokens can be established.

## Phase 2 — Day Strip Reference Implementation

The Day Strip is the highest-risk and most differentiating component.

Create a dedicated reference/development page such as:

```text
/ui-reference/day-strip
```

Test deliberately difficult cases:

```text
8h flight + 20m transfer + 1h free + 8h sleep

10m walk + 4h museum + 15m metro + 45m lunch

six small segments

cross-midnight flight

24-hour travel day

very tight schedule

large amount of free time

multiple fixed reservations
```

Validate:

- minimum segment width
- duration-based growth
- readability
- mobile tap targets
- travel line
- long labels
- time formatting
- cross-midnight dates
- free-time visibility

Do not bury Day Strip experimentation inside production screens.

## Phase 3 — Day Composer

Build:

- review state
- composer state
- keyboard-open sticky state
- add place/activity
- add reservation
- add transport
- add hotel/rest
- segment selection
- segment editing
- live Day Strip reconstruction

Use mocked route durations initially.

## Phase 4 — First End-to-End Flow

Build:

```text
New Trip
   ↓
Japan 2026
10–20 Sep
Bengaluru → Tokyo
   ↓
Choose Storage
   ↓
Day 1
   ↓
Add SQ999
   ↓
Day Strip appears
```

This becomes the first meaningful Ullalu product milestone.

## Phase 5 — Frozen Home

Implement the frozen horizontal-thumbnail Home design.

Use real trip objects from the application model rather than purely hardcoded presentation cards.

## Phase 6 — Google Services

After the visual planning experience works:

- Google sign-in
- Google Places search
- Maps
- Routes
- travel time
- transport options
- opening hours
- route alternatives

Do not redesign Ullalu around API limitations prematurely.

## Phase 7 — Persistence

Implement the internal portable trip model first.

Then add storage adapters:

```text
Trip Document
     │
     ├── Save to device
     ├── Google Drive
     └── Ullalu Cloud
```

## Phase 8 — Publishing / Explore / Questions

Implement only after the planning experience is stable.

The screens should influence the data model from the beginning, but the community layer is not the first build priority.

---

# 34. Development Priority

Avoid this sequence:

```text
Auth
↓
database
↓
Drive
↓
Maps
↓
sharing
↓
public library
↓
Day Strip
```

Preferred sequence:

```text
DAY STRIP
    ↓
DAY COMPOSER
    ↓
NEW TRIP FLOW
    ↓
HOME
    ↓
REAL MAP DATA
    ↓
PERSISTENCE
    ↓
AUTH / DRIVE / CLOUD
    ↓
PUBLISH / EXPLORE
```

---

# 35. First Product Milestone

The first meaningful implementation milestone is:

> **On a real mobile browser, create a Day 1 itinerary and watch the Ullalu Day Strip build and resize live as items and durations are entered.**

This milestone validates:

- Ullalu's key visual language
- minimum segment geometry
- time proportionality
- live composer interaction
- mobile usability
- free-time calculation
- sticky Day Strip behaviour

If this interaction feels compelling in the browser, the most important Ullalu product hypothesis has been validated.

---

# 36. Product Invariants

The following principles should be treated as product invariants unless deliberately revisited.

1. **Time is the primary visual object.**
2. **The Day Strip is the defining Ullalu component.**
3. **Travel is a first-class segment, not a footnote.**
4. **Travel segment color is consistent across transport modes.**
5. **Icons communicate transport subtype.**
6. **Every segment has a minimum readable width.**
7. **The minimum width must support `0000 / to / 9999`.**
8. **Extra width is approximately proportional to duration.**
9. **Height may expand to preserve useful information.**
10. **Free time is calculated and highly visible.**
11. **Fixed reservations act as anchors.**
12. **Users enter intentions; Ullalu generates travel where possible.**
13. **The current Day Strip stays visible while editing.**
14. **The Day Strip remains visible when the keyboard is open.**
15. **Changes in duration should visibly alter the geometry immediately.**
16. **The collapsed Day Card should already communicate the day.**
17. **Expanded views are for detail, not basic understanding.**
18. **Storage choice should remain user-controlled.**
19. **Google login and Google Drive permissions are separate.**
20. **The active itinerary should remain available offline.**
21. **Public publishing creates a privacy-safe representation.**
22. **Explore supports discovery and adaptation, not generic social engagement.**
23. **The frozen Home uses horizontal trip thumbnails.**
24. **The planning experience must be excellent before community features are prioritised.**

---

# 37. Current Product Positioning

Working positioning:

> **Ullalu is a visual time planner for travel.**

Alternative expression:

> **See your day. Travel smarter.**

The product should not be positioned merely as:

- an AI itinerary generator
- a travel reservation manager
- a list-based trip planner
- a map route planner
- a travel social network

Its differentiation is the combination of:

```text
places
+
activities
+
travel
+
duration
+
constraints
+
free time
+
visual time geometry
```

so that the traveller can understand the real shape of each day.

---

# 38. Next Development Step

Begin development in:

```text
C:\dev\ullalu
```

The first implementation target should be:

```text
Day Strip reference page
```

followed by:

```text
Day Composer
```

Use the existing visual designs as references, but validate the geometry with real responsive HTML/CSS and real mobile widths before declaring the Day Strip implementation frozen.
