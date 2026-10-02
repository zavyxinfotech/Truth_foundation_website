import type { Plugin } from 'vite';
import sharp from 'sharp';

interface LcpPreloadOptions {
  source: string;
  widths: number[];
  sizes: string;
}

export function lcpPreload({ source, widths, sizes }: LcpPreloadOptions): Plugin {
  return {
    name: 'lcp-preload',
    apply: 'build',
    enforce: 'post',
    async transformIndexHtml(_html, ctx) {
      if (!ctx.bundle) return;

      const candidates: { url: string; width: number }[] = [];

      for (const asset of Object.values(ctx.bundle)) {
        if (asset.type !== 'asset' || !asset.fileName.endsWith('.webp')) continue;
        if (asset.originalFileNames?.[0] !== source) continue;

        const buf = Buffer.isBuffer(asset.source) ? asset.source : Buffer.from(asset.source);
        const { width } = await sharp(buf).metadata();
        if (!width || !widths.includes(width)) continue;
        if (candidates.some((c) => c.width === width)) continue;

        candidates.push({ url: `/${asset.fileName}`, width });
      }

      if (!candidates.length) return;

      candidates.sort((a, b) => a.width - b.width);

      return [
        {
          tag: 'link',
          injectTo: 'head-prepend',
          attrs: {
            rel: 'preload',
            as: 'image',
            type: 'image/webp',
            imagesrcset: candidates.map((c) => `${c.url} ${c.width}w`).join(', '),
            imagesizes: sizes,
            fetchpriority: 'high',
          },
        },
      ];
    },
  };
}
