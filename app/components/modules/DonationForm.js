'use client';

import { useState, useRef } from 'react';
import {
  TextField, Button, Typography, Alert, Snackbar,
  Avatar, IconButton, CircularProgress, Box,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useDonations } from '../../hooks/useDonations';
import { formatCurrency } from '../../utils/formatters';

const initialForm = { name: '', amount: '', city: '', message: '', profileImage: null };

/**
 * Donation entry form with validation and religious UI
 */
export default function DonationForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { submitDonation } = useDonations();

  /** Validate the form */
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Donor name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!form.amount) newErrors.amount = 'Donation amount is required';
    else if (isNaN(form.amount) || parseFloat(form.amount) <= 0)
      newErrors.amount = 'Please enter a valid positive amount';

    if (!form.city.trim()) newErrors.city = 'City is required';

    return newErrors;
  };

  /** Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Restrict amount to numbers only
    if (name === 'amount' && value && !/^\d*\.?\d*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /** Handle image upload */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /** Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitDonation({
        name: form.name.trim(),
        amount: parseFloat(form.amount),
        city: form.city.trim(),
        message: form.message.trim(),
        profileImage: form.profileImage,
      });

      if (result.success) {
        setSnackbar({ open: true, message: '🙏 Donation submitted! Jay Shri Ram!', severity: 'success' });
        setForm(initialForm);
        setImagePreview(null);
        setErrors({});
      } else {
        setSnackbar({ open: true, message: result.message || 'Submission failed', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Something went wrong. Please try again.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewAmount = form.amount ? parseFloat(form.amount) : 0;

  return (
    <div className="sacred-card p-6 md:p-8 animate-fade-in-up form-wrapper w-[80%]">
      {/* Form Header */}
      <div className="text-center mb-6">
        <Typography
          variant="h5"
          className="font-heading"
          sx={{
            background: 'linear-gradient(135deg, #b45309, #d97706, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 0.5,
          }}
        >
          Make a Sacred Offering
        </Typography>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <TextField
            label="Donor Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            placeholder="Enter your full name"
            // InputProps={{
            //   startAdornment: <span style={{ marginRight: 8, fontSize: '1.1rem' }}>👤</span>,
            // }}
          />

          <TextField
            label="Donation Amount (₹) *"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount || (previewAmount > 0 ? `= ${formatCurrency(previewAmount)}` : '')}
            fullWidth
            placeholder="e.g. 1100"
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
              },
            }}
            // InputProps={{
            //   startAdornment: <span style={{ marginRight: 8, fontSize: '1.1rem' }}>₹</span>,
            // }}
          />

          <TextField
            label="City *"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            fullWidth
            placeholder="Your city"
            // InputProps={{
            //   startAdornment: <span style={{ marginRight: 8, fontSize: '1.1rem' }}>📍</span>,
            // }}
          />

          <TextField
            label="Blessing Note (Optional)"
            name="message"
            value={form.message}
            onChange={handleChange}
            fullWidth
            placeholder="Share a prayer or message..."
            multiline
            rows={1}
            // InputProps={{
            //   startAdornment: <span style={{ marginRight: 8, fontSize: '1.1rem', alignSelf: 'flex-start', paddingTop: 2 }}>🌸</span>,
            // }}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
          sx={{
            mt: 4,
            py: 1.5,
            fontSize: '1rem',
            fontFamily: "'Cinzel', serif",
            fontWeight: 600,
            letterSpacing: '1px',
            background: isSubmitting
              ? '#d1d5db'
              : 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
            boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(245, 158, 11, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
              boxShadow: '0 6px 28px rgba(245, 158, 11, 0.55)',
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'translateY(0)' },
          }}
        >
          {isSubmitting ? 'Submitting...' : '🙏 Submit Sacred Offering'}
        </Button>
      </form>

      {/* Success / error snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{
            fontFamily: "'Lato', sans-serif",
            ...(snackbar.severity === 'success' && {
              background: 'linear-gradient(135deg, #065f46, #047857)',
              color: '#fff',
              '& .MuiAlert-icon': { color: '#6ee7b7' },
            }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
