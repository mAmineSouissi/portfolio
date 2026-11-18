import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import CustomCursor from "@/components/ui/CustomCursor";
import Loader from "@/components/ui/Loader";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} · ${profile.role}`,
  description: profile.tagline,
  keywords: [
    "Mohamed Amine Souissi",
    "Full-Stack Developer",
    "NestJS",
    "React",
    "Next.js",
    "React Native",
    "Angular",
    "TypeScript",
    "Tunisia",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} · ${profile.role}`,
    description: profile.tagline,
    url: siteUrl,
    siteName: profile.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description: profile.tagline,
  },
};

const themeScript = `
(function(){
  var d = document.documentElement;
  d.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
  if (sessionStorage.getItem('minted') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    d.setAttribute('data-minted', '');
  }
  // Some browser extensions stamp bis_skin_checked on every div before React hydrates,
  // which React reports as a hydration mismatch. Strip it as it appears.
  var strip = function (el) { if (el.removeAttribute) el.removeAttribute('bis_skin_checked'); };
  var mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === 'attributes') strip(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) {
        var n = m.addedNodes[j];
        if (n.nodeType === 1) { strip(n); var all = n.querySelectorAll('[bis_skin_checked]'); for (var k = 0; k < all.length; k++) strip(all[k]); }
      }
    }
  });
  mo.observe(d, { subtree: true, childList: true, attributes: true, attributeFilter: ['bis_skin_checked'] });
  addEventListener('load', function () { setTimeout(function () { mo.disconnect(); }, 4000); });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${archivo.variable} ${jetbrains.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <Loader />
        <CustomCursor />
        <div className="grain" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
