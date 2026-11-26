import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  voltar: {
    width: 40,
    height: 40,
    borderRadius: raio.pilula,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontFamily: fontes.negrito, fontSize: 24, color: cores.texto },
  secao: { gap: espaco.sm },
  tituloSecao: { fontFamily: fontes.seminegrito, fontSize: 16, color: cores.texto },
  sugestoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.xs },
  sugestao: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaSuave,
  },
  textoSugestao: { fontFamily: fontes.media, fontSize: 12, color: cores.primariaEscura },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.primariaSuave,
    borderRadius: raio.md,
    padding: espaco.md,
  },
  totalRotulo: { fontFamily: fontes.regular, fontSize: 13, color: cores.primariaEscura },
  totalValor: { fontFamily: fontes.seminegrito, fontSize: 20, color: cores.texto },
  erro: { fontFamily: fontes.regular, fontSize: 13, color: cores.erro, textAlign: 'center' },
});
