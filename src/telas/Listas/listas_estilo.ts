import { StyleSheet } from "react-native";
import { cores, espaco, fontes } from "@/theme/tema";

export const estilos = StyleSheet.create({
    titulo: {
        fontFamily: fontes.negrito,
        fontSize: 24,
        color: cores.texto
    },
    nova: {
        gap: espaco.sm
    },
    secao: {
        gap: espaco.sm
    },
    erro: {
        fontFamily: fontes.regular,
        fontSize: 13,
        color: cores.erro,
        textAlign: 'center'
    },
    carregando: {
        marginTop: espaco.xl
    }
})