import type { Metadata } from "next";
import localFont from "next/font/local";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeSurfaces } from "@/components/layout/ThemeSurfaces";
import { AppProviders } from "@/components/providers/AppProviders";
import { site } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

/* Fonts are self-hosted (Latin subsets from Google Fonts) so builds never
   depend on reaching fonts.googleapis.com. */
const outfit = localFont({
  src: "./fonts/outfit-latin.woff2",
  weight: "100 900",
  variable: "--font-outfit",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "400 800",
  variable: "--font-inter",
});

const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  weight: "400 700",
  variable: "--font-montserrat",
});

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  weight: "400 800",
  variable: "--font-jakarta",
});

const playfair = localFont({
  src: "./fonts/playfair-display-900-latin.woff2",
  weight: "900",
  variable: "--font-playfair",
  adjustFontFallback: "Times New Roman",
});

const archivo = localFont({
  src: "./fonts/archivo-black-latin.woff2",
  weight: "400",
  variable: "--font-display",
});

const quicksand = localFont({
  src: "./fonts/quicksand-700-latin.woff2",
  weight: "700",
  variable: "--font-quicksand",
});

const quattrocento = localFont({
  src: [
    { path: "./fonts/quattrocento-400-latin.woff2", weight: "400" },
    { path: "./fonts/quattrocento-700-latin.woff2", weight: "700" },
  ],
  variable: "--font-quattrocento",
  adjustFontFallback: "Times New Roman",
});

const rye = localFont({
  src: "./fonts/rye-latin.woff2",
  weight: "400",
  variable: "--font-rye",
});

/* Rye is Latin-only; Yatra One covers Devanagari for the Hindi "OK" swap.
   Its Devanagari file is a separate family limited by unicode-range, and
   globals.css combines both into --font-yatra. */
const yatraLatin = localFont({
  src: "./fonts/yatra-one-latin.woff2",
  weight: "400",
  variable: "--font-yatra-latin",
});

const yatraDevanagari = localFont({
  src: "./fonts/yatra-one-devanagari.woff2",
  weight: "400",
  variable: "--font-yatra-devanagari",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0900-097F, U+1CD0-1CF4, U+1CF7-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF",
    },
  ],
});

const yeseva = localFont({
  src: "./fonts/yeseva-one-latin.woff2",
  weight: "400",
  variable: "--font-yeseva",
});

const caveat = localFont({
  src: "./fonts/caveat-latin.woff2",
  weight: "500 700",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} — ${site.tagline}`,
    template: `%s — ${site.fullName}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${archivo.variable} ${inter.variable} ${montserrat.variable} ${jakarta.variable} ${playfair.variable} ${quicksand.variable} ${quattrocento.variable} ${rye.variable} ${yatraLatin.variable} ${yatraDevanagari.variable} ${yeseva.variable} ${caveat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body
        className="bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        <AppProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingContact />
          <ThemeSurfaces />
        </AppProviders>
      </body>
    </html>
  );
}
