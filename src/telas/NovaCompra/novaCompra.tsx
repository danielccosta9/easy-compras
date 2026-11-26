import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { ItemFormularioCompra } from '@/components/forms/ItemFormularioCompra';

import { useAuth } from '@/hooks/useAuth';
import { useNovaCompra } from '@/hooks/useNovaCompra';
import { avisar } from '@/utils/avisos';
import { formatarDataBr } from '@/utils/datas';
import { formatarReais } from '@/utils/dinheiro';
import { montarCompra, type Erros } from '@/utils/validacao';
import { cores } from '@/theme/tema';
import { estilos } from './novaCompra_estilo';
import type { ItemFormulario, Usuario } from '@/types';

let contador = 0;
function itemVazio(): ItemFormulario {
  contador++;
  return { chave: String(contador), descricao: '', quantidade: '1', unidade: 'UN', preco: '' };
}

function mensagemDeSucesso(avisos: number) {
  if (avisos === 0) return 'Ela já aparece na sua lista de compras.';
  const produtos = avisos === 1 ? '1 produto saiu' : `${avisos} produtos saíram`;
  return `Ela já aparece na sua lista. ${produtos} abaixo da sua média: veja nas notificações.`;
}

function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/compras');
}

export default function NovaCompra() {
  const { usuario } = useAuth();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <FormularioNovaCompra usuario={usuario} />;
}

function FormularioNovaCompra({ usuario }: { usuario: Usuario }) {
  const { lojasRecentes, salvar } = useNovaCompra(usuario.id);

  const [loja, setLoja] = useState('');
  const [data, setData] = useState(formatarDataBr(new Date()));
  const [itens, setItens] = useState<ItemFormulario[]>([itemVazio()]);
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);

  // Total ao vivo: montarCompra ignora com segurança os campos ainda incompletos.
  const total = montarCompra({ loja, data, itens }).totalCentavos;

  // Ao editar um campo, a mensagem de erro dele some.
  function limparErros(...chaves: string[]) {
    setErros((atuais) => {
      const novos = { ...atuais };
      chaves.forEach((chave) => delete novos[chave]);
      return novos;
    });
  }

  function mudarLoja(texto: string) {
    setLoja(texto);
    limparErros('loja');
  }

  function mudarData(texto: string) {
    setData(texto);
    limparErros('data');
  }

  function mudarItem(posicao: number, novo: ItemFormulario) {
    const atual = itens[posicao];
    setItens(itens.map((item, i) => (i === posicao ? novo : item)));

    const prefixo = `itens.${posicao}`;
    if (novo.descricao !== atual.descricao) limparErros(`${prefixo}.descricao`);
    if (novo.quantidade !== atual.quantidade || novo.unidade !== atual.unidade) {
      limparErros(`${prefixo}.quantidade`);
    }
    if (novo.preco !== atual.preco) limparErros(`${prefixo}.preco`);
  }

  function adicionarItem() {
    setItens([...itens, itemVazio()]);
    limparErros('itens');
  }

  function removerItem(posicao: number) {
    setItens(itens.filter((_, i) => i !== posicao));
    setErros({}); // as posições mudaram; os erros são recalculados ao salvar
  }

  async function handleSalvar() {
    setSalvando(true);
    try {
      const resultado = await salvar({ loja, data, itens });
      if (!resultado.ok) {
        setErros(resultado.erros);
        return;
      }
      avisar('Compra salva!', mensagemDeSucesso(resultado.avisos));
      voltar();
    } catch {
      avisar('Ops', 'Não foi possível salvar a compra.');
    } finally {
      setSalvando(false);
    }
  }

  const temErros = Object.keys(erros).length > 0;

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable onPress={voltar} style={estilos.voltar} hitSlop={8} accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={cores.texto} />
        </Pressable>
        <Text style={estilos.titulo}>Nova compra</Text>
      </View>

      <View style={estilos.secao}>
        <CampoTexto
          rotulo="Estabelecimento"
          placeholder="Ex.: Mercado Central"
          value={loja}
          onChangeText={mudarLoja}
          erro={erros.loja}
        />
        {lojasRecentes.length > 0 && (
          <View style={estilos.sugestoes}>
            {lojasRecentes.map((nome) => (
              <Pressable key={nome} onPress={() => mudarLoja(nome)} style={estilos.sugestao}>
                <Text style={estilos.textoSugestao}>{nome}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <CampoTexto
          rotulo="Data da compra"
          placeholder="dd/mm/aaaa"
          value={data}
          onChangeText={mudarData}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          erro={erros.data}
        />
      </View>

      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Itens</Text>

        {itens.map((item, posicao) => (
          <ItemFormularioCompra
            key={item.chave}
            item={item}
            posicao={posicao}
            erros={erros}
            onMudar={(novo) => mudarItem(posicao, novo)}
            onRemover={() => removerItem(posicao)}
          />
        ))}

        {!!erros.itens && <Text style={estilos.erro}>{erros.itens}</Text>}

        <Botao
          titulo="Adicionar item"
          variante="secundario"
          onPress={adicionarItem}
          icone={<Plus size={18} color={cores.primaria} />}
        />
      </View>

      <View style={estilos.total}>
        <Text style={estilos.totalRotulo}>Total da compra</Text>
        <Text style={estilos.totalValor}>{formatarReais(total)}</Text>
      </View>

      {temErros && <Text style={estilos.erro}>Confira os campos destacados.</Text>}

      <Botao titulo="Salvar compra" onPress={handleSalvar} carregando={salvando} />
    </Tela>
  );
}
