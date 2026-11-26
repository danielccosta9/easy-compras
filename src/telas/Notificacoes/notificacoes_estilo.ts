import { StyleSheet } from "react-native";
import { cores, fontes } from "@/theme/tema";

export const estilos = StyleSheet.create({
    titulo: {
        fontFamily: fontes.negrito,
        fontSize: 22,
        color: cores.texto
    },
    subtitulo: {
        fontFamily: fontes.regular,
        fontSize: 13,
        color: cores.textoSuave
    },
})