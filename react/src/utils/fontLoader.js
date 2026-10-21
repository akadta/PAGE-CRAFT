const loaded = new Set();
export const loadFont = (font) => {
  if (!font || loaded.has(font)) return;
  loaded.add(font);
  const id = `gfont-${font.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
};
