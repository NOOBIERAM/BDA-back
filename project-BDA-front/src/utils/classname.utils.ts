import type { Action } from "../types/Action";

export const getColors = (action: Action) => {
    const colorMap = {
        AJOUT: { border_bg: "border-green-400", text: "text-green-400", shadow: "shadow-green-200" },
        MODIFICATION: { border_bg: "border-cyan-400", text: "text-cyan-400", shadow: "shadow-cyan-200" },
        SUPPRESSION: { border_bg: "border-red-400", text: "text-red-400", shadow: "shadow-red-200" }
    };
    return colorMap[action as keyof typeof colorMap];
};