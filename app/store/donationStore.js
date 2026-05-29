import { create } from 'zustand';

const useDonationStore = create((set, get) => ({
  donations: [],
  isLoading: false,
  error: null,
  latestDonation: null,
  popupState: {
    isOpen: false,
    displayCount: 0,
    maxDisplays: 3,
    donationId: null,
  },
  isScrollPaused: false,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDonations: (donations) => set({ donations }),

  addDonation: (donation) => {
    const { donations } = get();
    const arr = Array.isArray(donations) ? donations : [];
    if (arr.some((d) => d.id === donation.id)) return; // dedupe
    const updated = [...arr, donation].sort(
      (a, b) => Number(b.amount) - Number(a.amount)
    );
    set({ donations: updated, latestDonation: donation });
  },

  setLatestDonation: (donation) => set({ latestDonation: donation }),

  /**
   * Open popup for a donation.
   * - If it's a NEW donation (different id): reset counter to 1 and open.
   * - If it's the SAME donation being reopened (by closePopup's timer):
   *   increment the counter and open.
   * - If already shown maxDisplays times: no-op.
   */
  openPopup: (donationId) => {
    const { popupState } = get();
    const isSame = popupState.donationId === donationId;
    const currentCount = isSame ? popupState.displayCount : 0;

    if (currentCount >= 3) return; // already shown 3 times

    set({
      popupState: {
        isOpen: true,
        displayCount: currentCount + 1,
        maxDisplays: 3,
        donationId,
      },
      isScrollPaused: true,
    });
  },

  /**
   * Close popup and schedule a reopen after 20 s if still under maxDisplays.
   */
  closePopup: () => {
    const { popupState } = get();
    const { displayCount, maxDisplays, donationId } = popupState;

    set({
      popupState: { ...popupState, isOpen: false },
      isScrollPaused: false,
    });

    if (displayCount < maxDisplays) {
      setTimeout(() => {
        const state = get();
        // Only reopen if: same donation, popup still closed, count not exceeded
        if (
          state.popupState.donationId === donationId &&
          !state.popupState.isOpen &&
          state.popupState.displayCount < maxDisplays
        ) {
          set({
            popupState: {
              isOpen: true,
              displayCount: state.popupState.displayCount + 1,
              maxDisplays,
              donationId,
            },
            isScrollPaused: true,
          });
        }
      }, 20000);
    }
  },

  resetPopup: () =>
    set({
      popupState: { isOpen: false, displayCount: 0, maxDisplays: 3, donationId: null },
    }),

  setScrollPaused: (paused) => set({ isScrollPaused: paused }),
}));

export default useDonationStore;
