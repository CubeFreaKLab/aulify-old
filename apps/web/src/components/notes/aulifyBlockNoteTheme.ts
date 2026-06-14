import type { Theme } from "@blocknote/mantine";

export const aulifyBlockNoteTheme: Theme = {
  colors: {
    editor: {
      text: "#0F0F0F",
      background: "#FFFFFF"
    },
    menu: {
      text: "#0F0F0F",
      background: "#FFFFFF"
    },
    tooltip: {
      text: "#0F0F0F",
      background: "#ECECE7"
    },
    hovered: {
      text: "#0F0F0F",
      background: "#FAFAF8"
    },
    selected: {
      text: "#FFFFFF",
      background: "#049A4E"
    },
    disabled: {
      text: "#60615A",
      background: "#ECECE7"
    },
    shadow: "#ECECE7",
    border: "#ECECE7",
    sideMenu: "#60615A",
    highlights: {
      gray: { text: "#0F0F0F", background: "#ECECE7" },
      brown: { text: "#0F0F0F", background: "#FAFAF8" },
      red: { text: "#0F0F0F", background: "#ECECE7" },
      orange: { text: "#0F0F0F", background: "#FAFAF8" },
      yellow: { text: "#0F0F0F", background: "#B8FAC6" },
      green: { text: "#0F0F0F", background: "#B8FAC6" },
      blue: { text: "#FFFFFF", background: "#049A4E" },
      purple: { text: "#FFFFFF", background: "#60615A" },
      pink: { text: "#0F0F0F", background: "#ECECE7" }
    }
  },
  borderRadius: 12,
  fontFamily: "var(--font-inter), Inter, sans-serif"
};
