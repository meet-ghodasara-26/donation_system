import './globals.css';
import ThemeRegistry from './components/ui/ThemeRegistry';

export const metadata = {
  title: 'Hare Krishna Hare Ram',
  description: 'Live Donation Management System — Sacred Offerings Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
