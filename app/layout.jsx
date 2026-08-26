import './globals.css';
import { AppProvider } from '../state/store.jsx';
import PhoneFrame from '../components/PhoneFrame.jsx';

export const metadata = {
  title: 'Myntra - Quick Check MVP',
  description: 'Resolve purchase doubts in seconds inside the wishlist',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          <PhoneFrame>
            {children}
          </PhoneFrame>
        </AppProvider>
      </body>
    </html>
  );
}
