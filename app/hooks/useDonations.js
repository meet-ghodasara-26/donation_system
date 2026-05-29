import { useCallback, useEffect, useRef } from 'react';
import useDonationStore from '../store/donationStore';

export function useDonations() {
  const {
    donations,
    isLoading,
    error,
    setDonations,
    setLoading,
    addDonation,
    latestDonation,
    openPopup,
  } = useDonationStore();

  // All IDs that existed when the app started (or were submitted this session)
  const knownIdsRef = useRef(new Set());
  // Becomes true after the very first fetch completes
  const initialLoadDone = useRef(false);

  const fetchDonations = useCallback(async () => {
    try {
      if (!initialLoadDone.current) {
        setLoading(true);
      }

      const res = await fetch('/api/donations');
      const data = await res.json();

      if (data.success) {
        const newDonations = Array.isArray(data.data) ? data.data : [];

        // Only call setDonations when the list actually changed (prevents flicker)
        const currentIds = useDonationStore.getState().donations.map((d) => d.id).join(',');
        const incomingIds = newDonations.map((d) => d.id).join(',');
        if (currentIds !== incomingIds) {
          setDonations(newDonations);
        }

        if (!initialLoadDone.current) {
          // First load — silently register every existing record, show NO popup
          newDonations.forEach((d) => knownIdsRef.current.add(d.id));
          initialLoadDone.current = true;
        } else {
          // Subsequent polls — only open popup for IDs that are genuinely new
          newDonations.forEach((d) => {
            if (!knownIdsRef.current.has(d.id)) {
              knownIdsRef.current.add(d.id);
              const currentPopupId = useDonationStore.getState().popupState.donationId;
              if (d.id !== currentPopupId) {
                openPopup(d.id);
                useDonationStore.setState({ latestDonation: d });
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('fetchDonations error:', err);
    } finally {
      setLoading(false);
    }
  }, [setDonations, setLoading, openPopup]);

  const submitDonation = useCallback(
    async (formData) => {
      try {
        const res = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success) {
          // Mark as known so the next poll doesn't re-trigger the popup
          knownIdsRef.current.add(data.data.id);
          // Instantly update list and open popup
          addDonation(data.data);
          openPopup(data.data.id);
          return { success: true, message: 'Donation submitted successfully!', data: data.data };
        } else {
          return { success: false, message: data.message || 'Submission failed' };
        }
      } catch (err) {
        console.error('submitDonation error:', err);
        return { success: false, message: 'Network error. Please try again.' };
      }
    },
    [addDonation, openPopup]
  );

  // Initial load + poll every 5 s
  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, [fetchDonations]);

  return { donations, isLoading, error, latestDonation, fetchDonations, submitDonation };
}
