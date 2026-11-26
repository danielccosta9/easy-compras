import { Text } from "react-native";
import { Bell } from "lucide-react-native";

import { Tela } from "@/components/ui/Tela";
import { EstadoVazio } from "@/components/ui/EstadoVazio";
import { cores } from "@/theme/tema";
import { estilos } from './notificacoes_estilo';

export default function Notificacoes() {
    return (
        <Tela>
            <Text style={estilos.titulo}>Notificações</Text>
            <Text style={estilos.subtitulo}>
                Avisamos aqui quando você paga menos que a sua média por produto.
            </Text>

            <EstadoVazio
                icone={<Bell size={26} color={cores.primaria} />}
                titulo="Nenhuma notificação"
                texto="Quando um produto sair abaixo da sua média de preço, o aviso aparece aqui"
            />
        </Tela>
    )
}