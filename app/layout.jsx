import "../css/style.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Modus | Inventory Management",
  description: "Inventory management dashboard",
  icons: {
    icon: "/images/modus-logo.png",
    apple: "/images/modus-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}