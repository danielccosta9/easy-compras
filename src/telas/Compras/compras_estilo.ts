import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  botaoNova: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: raio.pilula,
    backgroundColor: cores.primaria,
  },

  textoBotaoNova: {
    fontFamily: fontes.seminegrito,
    fontSize: 14,
    color: cores.branco,
  },

  titulo: {
    fontFamily: fontes.negrito,
    fontSize: 24,
    color: cores.texto,
  },

  resumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: cores.primariaSuave,
    borderRadius: raio.md,
    padding: espaco.md,
  },

  resumoDireita: {
    alignItems: 'flex-end',
  },

  resumoRotulo: {
    fontFamily: fontes.regular,
    fontSize: 12,
    color: cores.primariaEscura,
  },

  resumoValor: {
    fontFamily: fontes.seminegrito,
    fontSize: 20,
    color: cores.texto,
  },

  lista: {
    gap: espaco.sm,
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
  },

  erro: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.erro,
    textAlign: 'center',
  },

  carregando: {
    marginTop: espaco.xl,
  },
});
