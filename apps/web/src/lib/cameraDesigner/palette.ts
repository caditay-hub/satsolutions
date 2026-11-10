// Цвета уровней детализации — общие для калькулятора и плана объекта:
// от самого детального (ближе к камере) к самому грубому.
export const SHADES = ["#134e5e", "#1d6a7d", "#2a7b90", "#3f95ab", "#6bb3c5", "#9fd0dc", "#cde9ef"];
export const levelColor = (i: number, n: number) => SHADES[Math.round((i * (SHADES.length - 1)) / Math.max(1, n - 1))];
