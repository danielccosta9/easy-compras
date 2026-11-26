import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ListChecks, Plus, Trash2 } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { SeletorUnidade } from '@/components/ui/SeletorUnidade';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { SeloDemo } from '@/components/ui/SeloDemo';
import { ItemDaLista } from '@/components/cards/ItemDaLista';

import { useAuth } from '@/hooks/useAuth';
import { useLista } from '@/hooks/useLista';
import { ordenarItens, resumoDaLista, validarItemLista } from '@/services/listas';
import { avisar, confirmar } from '@/utils/avisos';
import { formatarReais } from '@/utils/dinheiro';
import { textoParaNumero, type Erros } from '@/utils/validacao';
import { cores } from '@/theme/tema';
import { estilos } from './listaDetalhe_estilo';
import type { UnidadeItem, Usuario } from '@/types';

function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/listas');
}

export default function TelaLista() {
  const { usuario } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <ConteudoLista usuario={usuario} listaId={Number(id)} />;
}

function ConteudoLista({ usuario, listaId }: { usuario: Usuario; listaId: number }) {
  const {
    lista,
    sugestoes,
    carregando,
    erro,
    alternarItem,
    adicionarItem,
    removerItem,
    concluir,
    excluir,
  } = useLista(usuario.id, listaId);

  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [unidade, setUnidade] = useState<UnidadeItem>('UN');
  const [erros, setErros] = useState<Erros>({});
  const [adicionando, setAdicionando] = useState(false);

  async function incluir(texto: string, qtd: string, und: UnidadeItem) {
    const novosErros = validarItemLista(texto, qtd);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setAdicionando(true);
    try {
      await adicionarItem(texto, textoParaNumero(qtd) ?? 1, und);
      setDescricao('');
      setQuantidade('1');
      setUnidade('UN');
    } catch {
      avisar('Ops', 'Não foi possível adicionar o item.');
    } finally {
      setAdicionando(false);
    }
  }

  async function handleExcluir() {
    const ok = await confirmar(
      'Excluir lista',
      'A lista e todos os itens dela serão apagados.',
      'Excluir',
    );
    if (!ok) return;
    try {
      await excluir();
      voltar();
    } catch {
      avisar('Ops', 'Não foi possível excluir a lista.');
    }
  }

  async function handleConcluir() {
    try {
      await concluir(!lista?.concluidaEm);
    } catch {
      avisar('Ops', 'Não foi possível atualizar a lista.');
    }
  }

  if (carregando) {
    return (
      <Tela>
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      </Tela>
    );
  }

  if (!lista) {
    return (
      <Tela>
        <EstadoVazio
          icone={<ListChecks size={26} color={cores.primaria} />}
          titulo="Lista não encontrada"
          texto={erro ?? 'Ela pode ter sido excluída.'}
        >
          <Botao titulo="Voltar para as listas" variante="secundario" onPress={voltar} />
        </EstadoVazio>
      </Tela>
    );
  }

  const resumo = resumoDaLista(lista.itens);
  const itens = ordenarItens(lista.itens);
  const notaSemPreco =
    resumo.itensSemPreco > 0 ? ` · ${resumo.itensSemPreco} sem preço conhecido` : '';

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable
          onPress={voltar}
          style={estilos.botaoRedondo}
          hitSlop={8}
          accessibilityLabel="Voltar"
        >
          <ChevronLeft size={22} color={cores.texto} />
        </Pressable>
        <Text style={estilos.titulo} numberOfLines={2}>
          {lista.nome}
        </Text>
        <Pressable
          onPress={handleExcluir}
          style={estilos.botaoRedondo}
          hitSlop={8}
          accessibilityLabel="Excluir lista"
        >
          <Trash2 size={18} color={cores.erro} />
        </Pressable>
      </View>

      {lista.demonstracao && <SeloDemo />}

      <View style={estilos.resumo}>
        <View style={estilos.resumoLinha}>
          <View>
            <Text style={estilos.resumoRotulo}>Comprados</Text>
            <Text style={estilos.resumoValor}>
              {resumo.marcados} de {resumo.total}
            </Text>
          </View>
          <View style={estilos.resumoDireita}>
            <Text style={estilos.resumoRotulo}>Falta (estimado)</Text>
            <Text style={estilos.resumoValor}>{formatarReais(resumo.restanteCentavos)}</Text>
          </View>
        </View>
        {resumo.total > 0 && <BarraProgresso valor={resumo.marcados / resumo.total} />}
        <Text style={estilos.resumoNota}>
          Estimativa total {formatarReais(resumo.estimadoCentavos)}, pela média do seu
          histórico{notaSemPreco}.
        </Text>
      </View>

      <View style={estilos.adicionar}>
        <CampoTexto
          rotulo="Adicionar produto"
          placeholder="Ex.: Leite integral 1L"
          value={descricao}
          onChangeText={(texto) => {
            setDescricao(texto);
            setErros({});
          }}
          onSubmitEditing={() => incluir(descricao, quantidade, unidade)}
          returnKeyType="done"
          erro={erros.descricao}
        />
        <View style={estilos.linhaAdicionar}>
          <View style={estilos.metade}>
            <CampoTexto
              rotulo={unidade === 'KG' ? 'Peso (kg)' : 'Quantidade'}
              placeholder={unidade === 'KG' ? '1,5' : '1'}
              value={quantidade}
              onChangeText={(texto) => {
                setQuantidade(texto);
                setErros({});
              }}
              keyboardType="decimal-pad"
              erro={erros.quantidade}
            />
          </View>
          <View style={estilos.metade}>
            <SeletorUnidade valor={unidade} onMudar={setUnidade} />
          </View>
        </View>
        <Botao
          titulo="Adicionar"
          variante="secundario"
          onPress={() => incluir(descricao, quantidade, unidade)}
          carregando={adicionando}
          icone={<Plus size={18} color={cores.primaria} />}
        />
      </View>

      {sugestoes.length > 0 && (
        <View style={estilos.secao}>
          <Text style={estilos.rotuloSecao}>Você costuma comprar</Text>
          <View style={estilos.sugestoes}>
            {sugestoes.map(({ nome, unidade: unidadeSugerida }) => (
              <Pressable
                key={nome}
                onPress={() => incluir(nome, '1', unidadeSugerida)}
                style={({ pressed }) => [estilos.sugestao, pressed && { opacity: 0.7 }]}
                accessibilityLabel={`Adicionar ${nome}`}
              >
                <Plus size={14} color={cores.primaria} />
                <Text style={estilos.textoSugestao}>{nome}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={estilos.secao}>
        <Text style={estilos.rotuloSecao}>Itens</Text>
        {itens.length === 0 ? (
          <Text style={estilos.vazio}>Adicione o primeiro produto acima.</Text>
        ) : (
          itens.map((item) => (
            <ItemDaLista
              key={item.id}
              item={item}
              onAlternar={() => alternarItem(item.id, !item.marcado)}
              onRemover={() => removerItem(item.id)}
            />
          ))
        )}
      </View>

      <Botao
        titulo={lista.concluidaEm ? 'Reabrir lista' : 'Concluir lista'}
        variante={lista.concluidaEm ? 'secundario' : 'primario'}
        onPress={handleConcluir}
      />
    </Tela>
  );
}
