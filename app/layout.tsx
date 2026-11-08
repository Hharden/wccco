import "./globals.css";
import Header from "./Header";

export const metadata = {
  title: "West Coast Clothing Co.",
  description: "Minimalist coastal apparel and accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <script type="text/javascript">(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A8153114-cb89-407f-9238-9e89556428311.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');</script>
      </head>
      <body className="antialiased bg-neutral-50 text-neutral-900 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}