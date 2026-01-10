
You are a highly capable AI assistant verifying billing synchronization.

## Validation Steps
1.  **Zombie Session Recovery**:
    *   Confirm that `InvoiceWizardModal` now imports `SessionRepository`.
    *   Confirm it runs `useQuery` with `SessionRepository.getSessionsByPatientId` when a patient is selected.
    *   Confirm the `legacySessions` (from patient doc) and `realSessions` (from subcollection) are merged, deduplicated by ID, and sorted.
    *   Verify the simplified filter `s.id && !s.paid` is active.

This logic ensures that even if the sessions aren't in the top-level array (legacy), they will be fetched and billable.
