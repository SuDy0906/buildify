import "./globals.css";
import CustomCursor from "./components/CustomCursor";

export const metadata = {
  title: "Buildify Tech Services | Architecting the Digital Future",
  description: "Elite MVP Creation, Web Development, and ML Workflows engineered for visionary founders and high-growth enterprises.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth overflow-x-clip max-w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Google Fonts CDN directly */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..700&family=Space+Grotesk:wght@300..700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#050505] text-[#e6e0e9] antialiased blueprint-grid overflow-x-clip max-w-full">
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
