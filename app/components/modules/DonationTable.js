'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Skeleton, Typography } from '@mui/material';
import useDonationStore from '../../store/donationStore';
import { formatCurrency, getInitials } from '../../utils/formatters';

function LoadingRows() {
  return Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="donations-grid grid grid-cols-[90px_1fr_220px] gap-5 mb-5">
      <Skeleton variant="rounded" height={72} sx={{ borderRadius: '22px' }} />
      <Skeleton variant="rounded" height={72} sx={{ borderRadius: '22px' }} />
      <Skeleton variant="rounded" height={72} sx={{ borderRadius: '22px' }} />
    </div>
  ));
}

function HeaderBox({ title, className = '' }) {
  return (
    <div
      className={`header-box h-[76px] rounded-[28px] flex items-center justify-center text-[#ffe600] font-black tracking-wide shadow-2xl border border-[#8a5a21] ${className}`}
      style={{
        background: 'linear-gradient(180deg, #6f431d 0%, #553012 100%)',
        textShadow: '0px 2px 6px rgba(0,0,0,0.45)',
        fontSize: '27px',
        fontWeight: '600',
      }}
    >
      {title}
    </div>
  );
}

export default function DonationTable({ isLoading }) {
  const { donations, latestDonation, isScrollPaused } = useDonationStore();

  const scrollRef      = useRef(null);
  const scrollPosition = useRef(0);
  const animationRef   = useRef(null);
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => {
    if (latestDonation) {
      setHighlightId(latestDonation.id);
      const timer = setTimeout(() => setHighlightId(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [latestDonation]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || donations.length === 0) return;

    let isResetting = false;

    const scroll = () => {
      if (!isScrollPaused && !isResetting) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        scrollPosition.current += 0.5;

        if (scrollPosition.current >= maxScroll) {
          isResetting = true;
          container.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            scrollPosition.current = 0;
            isResetting = false;
          }, 4000);
        } else {
          container.scrollTop = scrollPosition.current;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [donations.length, isScrollPaused]);

  const duplicatedRows = useMemo(() => donations, [donations]);

  return (
    <div className="relative overflow-hidden p-6 lg:p-8">

      {/* Top Mantra */}
      <div className="flex w-full justify-evenly">
        <div>
          <img
            alt="right_logo"
            src="/left.png"
            className="logo-left"
            style={{ width: '125px', position: 'relative', top: '20px', left: '50px' }}
          />
        </div>
        <div className="flex justify-center mb-6 w-[70%]">
          <div
            className="rounded-b-[30px] h-[60] px-8 py-4 w-full text-center items-center flex justify-center"
            style={{ background: '#e7d0b1', color: '#7b2d1e' }}
          >
            <Typography className="mantra-text" sx={{ fontSize: '35px', fontWeight: 800, letterSpacing: '0.5px' }}>
              ॥ હરે કૃષ્ણ હરે કૃષ્ણ કૃષ્ણ કૃષ્ણ હરે હરે । હરે રામ હરે રામ રામ રામ હરે હરે ॥
            </Typography>
          </div>
        </div>
        <div>
          <img
            alt="left_logo"
            src="/right.png"
            className="logo-right"
            style={{ width: '125px', position: 'relative', top: '20px', right: '50px', border: '4px solid #5b3718', borderRadius: '50%' }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1
          className="page-title text-white text-[35px] md:text-[35px] font-black relative top-[-43px]"
          style={{
            WebkitTextStroke: '1.5px #4a2f1b',
            textShadow: '2px 2px 4px rgba(0,0,0,0.35)',
            fontFamily: "'Noto Sans Gujarati', sans-serif",
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
          }}
        >
          મંદિર નવ નિર્માણ ના દાતાશ્રી
        </h1>
      </div>

      {/* Header row */}
      <div className="donations-grid grid grid-cols-[90px_1fr_300px] gap-[20px] m-[16px]">
        <HeaderBox title="ક્રમ" />
        <HeaderBox title="દાતાશ્રી ના નામ" />
        <HeaderBox title="ડોનેશન" />
      </div>

      {/* Rows */}
      <div ref={scrollRef} className="overflow-hidden" style={{ height: '60vh', margin: '0px 16px' }}>
        {isLoading ? (
          <LoadingRows />
        ) : donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ height: '40vh' }}>
            <h2
              style={{
                fontFamily: "'Noto Sans Gujarati', sans-serif",
                fontSize: '2rem',
                fontWeight: 800,
                textAlign: 'center',
                WebkitTextStroke: '1.5px #4a2f1b',
                textShadow: '2px 2px 4px rgba(0,0,0,0.35)',
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
              }}
            >
              કોઈ દાતા મળ્યા નથી
            </h2>
            <p
              style={{
                fontFamily: "'Noto Sans Gujarati', sans-serif",
                fontSize: '1.1rem',
                marginTop: '8px',
                textAlign: 'center',
                WebkitTextStroke: '1.5px #4a2f1b',
                textShadow: '2px 2px 4px rgba(0,0,0,0.35)',
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
              }}
            >
              હજી સુધી કોઈ દાન નોંધાયું નથી
            </p>
          </div>
        ) : (
          duplicatedRows.map((donation, index) => (
            <div
              key={`${donation.id}-${index}`}
              className="donations-grid grid grid-cols-[90px_1fr_300px] gap-[20px] my-[10px] mb-5"
            >
              {/* Serial Number */}
              <div
                className="row-cell row-serial h-[72px] rounded-[24px] flex items-center justify-center text-[#4b2a0f] text-[20px] font-black transition-all duration-500"
                style={{ background: 'rgba(255,255,255,0.88)' }}
              >
                {index + 1}
              </div>

              {/* Donor Name */}
              <div
                className="row-cell h-[72px] rounded-[24px] px-6 flex items-center justify-between transition-all duration-500"
                style={{ background: 'rgba(255,255,255,0.88)' }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0 p-[25px]">
                    <h3 className="row-name text-[#4b2a0f] text-[25px] md:text-xl font-extrabold truncate">
                      {donation.nameGu || donation.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div
                className="row-cell row-amount h-[72px] rounded-[24px] flex items-center justify-center text-[#4b2a0f] text-[25px] font-[500] md:text-2xl font-black transition-all duration-500"
                style={{ background: 'rgba(255,255,255,0.88)' }}
              >
                {formatCurrency(donation.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
