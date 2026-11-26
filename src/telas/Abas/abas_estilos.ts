import { StyleSheet } from "react-native";
import { cores, raio } from "@/theme/tema";

export const estilos = StyleSheet.create({
    botaoEscanear: {
        width: 56,
        height: 56,
        borderRadius: raio.pilula,
        backgroundColor: cores.primaria,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -14 }],
        borderWidth: 4,
        borderColor: cores.fundo,
        shadowColor: cores.primariaEscura,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,

    },
    botaoEscanearAtivo: { backgroundColor: cores.primariaEscura }
})