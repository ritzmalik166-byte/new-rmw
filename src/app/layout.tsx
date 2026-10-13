import type { Metadata } from "next";
import {
  Archivo_Black,
  Caveat,
  Inter,
  Montserrat,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Quattrocento,
  Quicksand,
  Rye,
  Yatra_One,
  Yeseva_One,
} from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeSurfaces } from "@/components/layout/ThemeSurfaces";
import { AppProviders } from "@/components/providers/AppProviders";
import { site } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: "900",
});

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-quicksand",
});

const quattrocento = Quattrocento({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quattrocento",
});

const rye = Rye({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rye",
});

/* Rye is Latin-only; Yatra One covers Devanagari for the Hindi "OK" swap. */
const yatra = Yatra_One({
  subsets: ["latin", "devanagari"],
  weight: "400",
  variable: "--font-yatra",
});

const yeseva = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yeseva",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
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
      className={`${outfit.variable} ${archivo.variable} ${inter.variable} ${montserrat.variable} ${jakarta.variable} ${playfair.variable} ${quicksand.variable} ${quattrocento.variable} ${rye.variable} ${yatra.variable} ${yeseva.variable} ${caveat.variable} antialiased`}
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
          <ThemeSurfaces />
        </AppProviders>
      </body>
    </html>
  );
}
