# Ullalu feature backlog

## Next feature batch — imported trip identity

- On successful `.ullalu` import, show a clear “Trip imported” confirmation.
- When the imported document duplicates an existing trip, give the new copy a distinguishable default name such as “Japan — imported copy”. Never overwrite the original. Allow the user to rename the copy.
- Record import provenance in the trip document (for example, `importedAt` and an optional source identifier) and expose it in trip details if useful. Avoid a permanent “Imported” badge on every trip card.
- Imported trips are immediately editable normal trips. Planning, Upcoming, Live, and Completed are determined by dates and itinerary state, not by import provenance.
- Verify export → import, duplicate import, rename, and normal lifecycle behaviour in the next feature batch.
