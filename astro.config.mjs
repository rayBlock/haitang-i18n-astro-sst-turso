import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import icon from "astro-icon";
import aws from "astro-sst";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";

// also need to adjust in i18n file
const defaultLocale = "en";
const locales = {
  en: "en-US", // the `defaultLocale`
  es: "es-ES",
  fr: "fr-CA",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP",
  zh: "zh-CN",
  th: "th-TH", 
};

export default defineConfig({
  output: "server",
  outDir: 'dist',
  adapter: aws({ serverRoutes: ["api/*"] }),
  // site: config.site.base_url,
  trailingSlash: "never",
  build: {
    format: "file",
  },
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: {
    entrypoint: "astro/assets/services/sharp",
    config: {
      limitInputPixels: false,
    },
  },
  integrations: [
    react(),
    i18n({
      locales,
      defaultLocale,
      // exclude: ["/excluded", "/api/*"],
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    AutoImport({
      imports: [],
    }),
    mdx(),
    icon({
      include: {
        tabler: ["*"],
      },
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: {
        light: "dracula",
        dark: "github-dark",
      },
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
