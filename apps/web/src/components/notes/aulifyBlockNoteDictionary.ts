import type { Dictionary } from "@blocknote/core";
import { es } from "@blocknote/core/locales";

export const aulifyBlockNoteDictionary: Dictionary = {
  ...es,
  slash_menu: {
    ...es.slash_menu,
    paragraph: {
      ...es.slash_menu.paragraph,
      title: "Texto",
      subtext: "Escribe contenido de clase"
    },
    bullet_list: {
      ...es.slash_menu.bullet_list,
      title: "Lista con viñetas"
    },
    numbered_list: {
      ...es.slash_menu.numbered_list,
      title: "Lista numerada"
    },
    check_list: {
      ...es.slash_menu.check_list,
      title: "Lista de tareas"
    },
    code_block: {
      ...es.slash_menu.code_block,
      title: "Código"
    },
    toggle_list: {
      ...es.slash_menu.toggle_list,
      title: "Lista desplegable"
    }
  },
  color_picker: {
    ...es.color_picker,
    colors: {
      ...es.color_picker.colors,
      default: "Automático",
      gray: "Gris",
      green: "Verde",
      yellow: "Verde claro"
    }
  },
  placeholders: {
    ...es.placeholders,
    default: "Escribe o usa / para insertar contenido",
    heading: "Encabezado"
  }
};
