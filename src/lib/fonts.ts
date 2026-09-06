/**
 * Slots Studio — Authoritative Local Typography Configuration
 *
 * Exclusively loads local Sora and Inter font families via next/font/local.
 * Completely eliminates any network dependency or external Google Fonts CDN.
 *
 * MAPPING:
 * - SORA: Headings (h1-h6), display typography, studio titles, STUDIO badges, brand labels.
 * - INTER: Body, navigation, controls, buttons, forms, inputs, tables, metadata, technical spec.
 */

import localFont from "next/font/local";

export const sora = localFont({
  src: [
    {
      path: "../../fonts/sora font family/Sora-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/sora font family/Sora-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sora",
  display: "swap",
});

export const inter = localFont({
  src: [
    {
      path: "../../fonts/inter font family/Inter_24pt-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../fonts/inter font family/Inter_24pt-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
