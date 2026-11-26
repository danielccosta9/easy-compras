import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ListChecks, Plus } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { CabecalhoSecao } from '@/components/ui/CabecalhoSecao';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { CartaoLista } from '@/components/cards/CartaoLista';

import { useAuth } from '@/hooks/useAuth';
import { useListas } from '@/hooks/useListas';
import { validarNomeLista } from '@/services/listas';
import { avisar } from '@/utils/avisos';
import { cores } from '@/theme/tema';
import { estilos } from './listas_estilo';
import type { ListaResumida, Usuario } from '@/types';

export default function Listas() {
    const { usuario } = useAuth();

    // As rotas protegidas garantem que só chegamos aqui com usuário logado.
    if (!usuario) return null;

    return <ConteudoListas usuario={usuario} />;
}

function abrir(id: number) {
    router.push({ pathname: '/lista/[id]', params: { id: String(id) } });
}

function ConteudoListas({ usuario }: { usuario: Usuario }) {
    const { listas, erro, criar } = useListas(usuario.id);
    const [nome, setNome] = useState('');
    const [erroNome, setErroNome] = useState<string>();
    const [criando, setCriando] = useState(false);

    async function handleCriar() {
        const erros = validarNomeLista(nome);
        setErroNome(erros.nome);
        if (erros.nome) return;

        setCriando(true);
        try {
            const id = await criar(nome);
            setNome('');
            abrir(id);
        } catch {
            avisar('Ops', 'Não foi possível criar a lista.');
        } finally {
            setCriando(false);
        }
    }

    const emAndamento = (listas ?? []).filter((l) => !l.concluidaEm);
    const concluidas = (listas ?? []).filter((l) => l.concluidaEm);

    function renderizar(grupo: ListaResumida[]) {
        return grupo.map((lista) => (
            <CartaoLista key={lista.id} lista={lista} onPress={() => abrir(lista.id)} />
        ));
    }

    return (
        <Tela>
            <Text style={estilos.titulo}>Listas de compras</Text>

            <View style={estilos.nova}>
                <CampoTexto
                    rotulo="Nova lista"
                    placeholder="Ex.: Compras do mês"
                    value={nome}
                    onChangeText={(texto) => {
                        setNome(texto);
                        setErroNome(undefined);
                    }}
                    onSubmitEditing={handleCriar}
                    returnKeyType="done"
                    erro={erroNome}
                />
                <Botao
                    titulo="Criar lista"
                    onPress={handleCriar}
                    carregando={criando}
                    icone={<Plus size={18} color={cores.branco} />}
                />
            </View>

            {!!erro && <Text style={estilos.erro}>{erro}</Text>}

            {!listas && !erro && (
                <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
            )}

            {listas && listas.length === 0 && (
                <EstadoVazio
                    icone={<ListChecks size={26} color={cores.primaria} />}
                    titulo="Nenhuma lista ainda"
                    texto="Crie uma lista e o app sugere os produtos que você mais compra, com o preço médio do seu histórico."
                />
            )}

            {emAndamento.length > 0 && (
                <View style={estilos.secao}>
                    <CabecalhoSecao titulo="Em andamento" />
                    {renderizar(emAndamento)}
                </View>
            )}

            {concluidas.length > 0 && (
                <View style={estilos.secao}>
                    <CabecalhoSecao titulo="Concluídas" />
                    {renderizar(concluidas)}
                </View>
            )}
        </Tela>
    );
}
