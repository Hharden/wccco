import Header from "./Header";
import "./globals.css";

export const metadata = {
  title: "West Coast Clothing Co.",
  description: "Curated Pacific Coast apparel and outdoor essentials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}