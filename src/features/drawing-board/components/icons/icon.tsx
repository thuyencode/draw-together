type IconName = "brush" | "eraser";

const ICONS: Record<IconName, string> = {
  brush: `<path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/>`,
  eraser: `<path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/>`,
};

export function makeIcon(size = 24, stroke = "currentColor", zoom = 1) {
  const w = `${size * 5 * zoom}`;
  const h = `${size * 5 * zoom}`;

  return (icon: IconName) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${icon}-icon lucide-${icon}">${ICONS[icon]}</svg>`;
}
