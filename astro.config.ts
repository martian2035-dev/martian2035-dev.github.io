import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";

//const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://example.com";

// 默认设为你的 VPS 网址
let siteUrl = 'https://martianw.cn';

// 如果检测到是在 GitHub Actions 中运行构建，自动切换为 GitHub Pages 网址
if (process.env.GITHUB_ACTIONS) {
  siteUrl = 'https://martian2035-dev.github.io';
}

export default defineConfig({
  site: siteUrl,
  // 如果你的 github pages 有子路径（比如 /my-repo/），还需要动态配置 base
  // base: process.env.GITHUB_ACTIONS ? '/my-repo' : '/',

// export default defineConfig({
 // site: siteUrl,
  // base: "/",
  integrations: [
    sitemap({
      filter: () => true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
