// https://lucide.dev/icons/brush

export const getBrushIcon = (size = 24, stroke = "currentColor", zoom = 1) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 5 * zoom}" height="${size * 5 * zoom}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-icon lucide-brush"><path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/></svg>`;
