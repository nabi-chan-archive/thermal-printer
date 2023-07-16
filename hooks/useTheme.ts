export function useTheme() {
  const theme = globalThis?.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  
  return theme;
}