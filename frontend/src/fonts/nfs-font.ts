import localFont from "next/font/local";

/** NFS (ofont.ru) — только подзаголовок баннера на главной */
export const nfsBannerFont = localFont({
  src: "./nfs.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-nfs-banner",
});
