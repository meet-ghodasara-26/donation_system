'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography, IconButton, Avatar, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useDonationStore from '../../store/donationStore';
import { formatCurrency, formatDate, getInitials, getAvatarColor, getDonorTier } from '../../utils/formatters';

function Particle({ style }) {
  return <div style={style} />;
}

function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const radius = 140 + Math.random() * 30;
    const size = 6 + Math.random() * 8;
    const colors = ['#fbbf24', '#f59e0b', '#fde68a', '#f97316', '#ffedd5'];
    return {
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: colors[i % colors.length],
      top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
      left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
      transform: 'translate(-50%, -50%)',
      opacity: 0.6 + Math.random() * 0.4,
      animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 2}s`,
    };
  });
  return <>{particles.map((style, i) => <Particle key={i} style={style} />)}</>;
}

export default function DonationPopup() {
  const { popupState, latestDonation, closePopup } = useDonationStore();
  const { isOpen, displayCount, maxDisplays } = popupState;

  const [visible, setVisible]   = useState(false);
  const timerRef                = useRef(null);
  const progressRef             = useRef(null);

  const DISPLAY_DURATION = 15000;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const startTime = Date.now();
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / DISPLAY_DURATION) * 100);
      }, 50);
      timerRef.current = setTimeout(() => handleClose(), DISPLAY_DURATION);
    }
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, displayCount]);

  const handleClose = () => {
    setVisible(false);
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    setTimeout(() => closePopup(), 350);
  };

  if (!isOpen && !visible) return null;
  if (!latestDonation) return null;

  const tier = getDonorTier(latestDonation.amount);

  return (
    <div
      className="popup-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: visible && isOpen ? 1 : 0,
        transition: 'opacity 0.35s ease',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Main Popup — original styles preserved, responsive class names added */}
      <div
        className="animate-pop-in popup-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1450px',
          minHeight: '600px',
          overflow: 'hidden',
          borderRadius: '34px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
          backgroundImage: "url('/bg-banner.png')",
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top mantra */}
        <div className="flex justify-center">
          <div
            className="popup-mantra"
            style={{
              background: '#ead1b2',
              borderBottomLeftRadius: '28px',
              borderBottomRightRadius: '28px',
              padding: '18px 60px',
            }}
          >
            <Typography
              sx={{ color: '#6f2a20', fontSize: '25px', fontWeight: 900, letterSpacing: '1px', textAlign: 'center' }}
            >
              ॥ હરે કૃષ્ણ હરે કૃષ્ણ કૃષ્ણ કૃષ્ણ હરે હરે । હરે રામ હરે રામ રામ રામ હરે હરે ॥
            </Typography>
          </div>
        </div>

        {/* Side images — original positions */}
        <img
          src="/left.png"
          alt="radha krishna"
          className="absolute rounded-full object-cover popup-logo popup-logo-left"
          style={{ top: '20px', left: '90px', width: '130px', height: '130px' }}
        />
        <img
          src="/right.png"
          alt="prabhupada"
          className="absolute rounded-full object-cover popup-logo popup-logo-right"
          style={{ top: '20px', right: '90px', width: '130px', height: '130px', border: '4px solid #5b3718' }}
        />

        {/* Subtitle */}
        <div className="text-center mt-14 px-10">
          <Typography
            className="popup-subtitle"
            sx={{ color: '#fff', marginTop: '14px', fontSize: '30px', fontWeight: 900, textShadow: '0px 4px 10px rgba(0,0,0,0.5)', textAlign: 'center' }}
          >
            કૃષ્ણકૃપા મૂર્તિ શ્રી શ્રીમદ એ.સી. ભક્તિવેદાંત સ્વામી શ્રીલ પ્રભુપાદ
          </Typography>
        </div>

        {/* Main title */}
        <div className="text-center mt-10">
          <Typography
            className="popup-title"
            sx={{
              fontSize: '38px',
              marginTop: '19px',
              fontWeight: 900,
              color: '#ef2020',
              WebkitTextStroke: '10px white',
              paintOrder: 'stroke fill',
              lineHeight: 1,
              textShadow: '0px 8px 20px rgba(0,0,0,0.4)',
              letterSpacing: '5px',
              textAlign: 'center',
            }}
          >
            મંદિર નવ નિર્માણ સેવા
          </Typography>
        </div>

        {/* Main layout */}
        <div className="popup-layout flex gap-[20px] px-[20px] mt-[40px] items-start pb-6">
          {/* Left side */}
          <div className="popup-left space-y-14 w-[60%]">
            {/* Donor name */}
            <div
              className="popup-donor-box"
              style={{
                minHeight: '140px',
                borderRadius: '40px',
                background: 'rgba(255,255,255,0.9)',
                border: '3px solid #5b3718',
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              <div className="flex items-center gap-8 w-full">
                <div className="min-w-0 flex-1">
                  <Typography
                    className="popup-donor-name"
                    sx={{ color: '#5b3718', fontSize: '40px', fontWeight: 900, lineHeight: 1.1 }}
                  >
                    {latestDonation.nameGu || latestDonation.name}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Service name */}
            <div
              className="popup-service-box"
              style={{
                minHeight: '140px',
                borderRadius: '40px',
                background: 'rgba(255,255,255,0.9)',
                border: '3px solid #5b3718',
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                marginTop: '20px',
              }}
            >
              <Typography
                className="popup-service-txt"
                sx={{ color: '#5b3718', fontSize: '40px', fontWeight: 900 }}
              >
                સેવાનું નામ :
                <span style={{ color: '#7b2d1e', marginLeft: 18 }}>
                  {latestDonation.messageGu || latestDonation.message || 'મંદિર સેવા'}
                </span>
              </Typography>
            </div>
          </div>

          {/* Right amount box */}
          <div
            className="popup-right"
            style={{
              borderRadius: '40px',
              overflow: 'hidden',
              border: '3px solid #5b3718',
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.18)',
              width: '30%',
            }}
          >
            <div
              className="popup-amount-hdr"
              style={{
                background: 'linear-gradient(180deg, #6f431d 0%, #523012 100%)',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{ color: '#fff', fontWeight: 900, fontSize: '40px', textAlign: 'center' }}
              >
                સેવાની રકમ
              </Typography>
            </div>
            <div
              style={{
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <Typography
                className="popup-amount-val"
                sx={{ fontSize: '40px', fontWeight: 900, color: '#5b3718', lineHeight: 1.1, wordBreak: 'break-word' }}
              >
                {formatCurrency(latestDonation.amount)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
