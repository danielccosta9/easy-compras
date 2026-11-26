import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Plus, Receipt } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { ItemCompra } from '@/components/cards/ItemCompra';

import { useAuth } from '@/hooks/useAuth';
import { useCompras } from '@/hooks/useCompras';
import { formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import { estilos } from './compras_estilo';
import type { Usuario } from '@/types';

export default function Compras() {
  const { usuario } = useAuth();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <ConteudoCompras usuario={usuario} />;
}

function ConteudoCompras({ usuario }: { usuario: Usuario }) {
  const { compras, erro, totalCentavos } = useCompras(usuario.id);

  return (
    <Tela>
      <View style={estilos.topo}>
        <Text style={estilos.titulo}>Compras</Text>
        <Pressable
          onPress={() => router.navigate('/nova-compra')}
          style={({ pressed }) => [estilos.botaoNova, pressed && { opacity: 0.8 }]}
          accessibilityLabel="Registrar nova compra"
        >
          <Plus size={18} color={cores.branco} />
          <Text style={estilos.textoBotaoNova}>Nova</Text>
        </Pressable>
      </View>

      {!!erro && <Text style={estilos.erro}>{erro}</Text>}

      {!compras && !erro && (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      )}

      {compras && compras.length > 0 && (
        <>
          <View style={estilos.resumo}>
            <View>
              <Text style={estilos.resumoRotulo}>Compras registradas</Text>
              <Text style={estilos.resumoValor}>{compras.length}</Text>
            </View>
            <View style={estilos.resumoDireita}>
              <Text style={estilos.resumoRotulo}>Total gasto</Text>
              <Text style={estilos.resumoValor}>{formatarReais(totalCentavos)}</Text>
            </View>
          </View>

          <View style={estilos.lista}>
            {compras.map((compra) => (
              <ItemCompra key={compra.id} compra={compra} />
            ))}
          </View>
        </>
      )}

      {compras && compras.length === 0 && (
        <View style={estilos.vazio}>
          <EstadoVazio
            icone={<Receipt size={26} color={cores.primaria} />}
            titulo="Nenhuma compra registrada"
            texto="Registre sua primeira compra ou carregue os dados de demonstração no seu perfil."
          >
            <Botao
              titulo="Registrar compra"
              onPress={() => router.navigate('/nova-compra')}
            />
            <Botao
              titulo="Ir para o perfil"
              variante="secundario"
              onPress={() => router.navigate('/perfil')}
            />
          </EstadoVazio>
        </View>
      )}
    </Tela>
  );
}
