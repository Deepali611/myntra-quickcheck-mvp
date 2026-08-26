import './globals.css';
import { AppProvider } from '../state/store.jsx';

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
      <body>
        <AppProvider>
          <div className="app-wrapper">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
