'use client';

import DonationTable from './components/modules/DonationTable';
import DonationPopup from './components/modules/DonationPopup';
import { useDonations } from './hooks/useDonations';

export default function HomePage() {
  const { isLoading } = useDonations();

  return (
    <div className="sacred-bg min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/bg-banner.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <main className="flex-1 max-w-7xl mx-auto w-[90%] mx-4 px-4 py-6" >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <DonationTable isLoading={isLoading} />
          </div>
        </div>
      </main>

      <DonationPopup />
    </div>
  );
}
