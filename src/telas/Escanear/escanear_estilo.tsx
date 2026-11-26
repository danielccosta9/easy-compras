import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
    topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    fechar: {
        width: 40,
        height: 40,
        borderRadius: raio.pilula,
        backgroundColor: cores.superficie,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selo: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
    ponto: { width: 8, height: 8, borderRadius: raio.pilula, backgroundColor: cores.primaria },
    textoSelo: { fontFamily: fontes.media, fontSize: 12, letterSpacing: 1, color: cores.texto },

    titulo: { fontFamily: fontes.seminegrito, fontSize: 30, lineHeight: 36, color: cores.texto },
    tituloSuave: {
        fontFamily: fontes.seminegrito,
        fontSize: 30,
        lineHeight: 36,
        color: cores.textoSuave,
        opacity: 0.45,
    },

    area: { alignItems: 'center', paddingBottom: 44 },
    quadro: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: raio.lg,
        overflow: 'hidden', // corta a imagem da câmera nos cantos arredondados
        backgroundColor: cores.texto,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: StyleSheet.absoluteFill, // a câmera ocupa o quadro inteiro
    etiqueta: {
        position: 'absolute',
        top: espaco.md,
        left: espaco.md,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: raio.sm,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        fontFamily: fontes.media,
        fontSize: 12,
        color: cores.branco,
    },
    trocar: {
        position: 'absolute',
        top: espaco.md,
        right: espaco.md,
        width: 36,
        height: 36,
        borderRadius: raio.pilula,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    semPermissao: { alignItems: 'center', gap: espaco.md, padding: espaco.lg },
    textoPermissao: {
        fontFamily: fontes.regular,
        fontSize: 14,
        textAlign: 'center',
        color: cores.branco,
    },
    capturar: {
        position: 'absolute',
        bottom: 8,
        width: 72,
        height: 72,
        borderRadius: raio.pilula,
        backgroundColor: cores.primaria,
        borderWidth: 5,
        borderColor: cores.fundo,
        alignItems: 'center',
        justifyContent: 'center',
        // Sombra: iOS usa shadow*, Android usa elevation.
        shadowColor: cores.primariaEscura,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    capturarPressionado: { backgroundColor: cores.primariaEscura },
});
