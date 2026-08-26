import './globals.css';

export const metadata = {
  title: 'Myntra - Quick Check MVP',
  description: 'Resolve purchase doubts in seconds inside the wishlist',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
