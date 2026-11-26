import { View } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import {
    Bell,
    House,
    ListChecks,
    Receipt,
    ScanLine
} from 'lucide-react-native';
import { cores, fontes } from '@/theme/tema';
import { estilos } from './abas_estilos';

export default function AbasLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: cores.primaria,
                tabBarInactiveTintColor: cores.textoSuave,
                tabBarLabelStyle: {
                    fontFamily: fontes.media,
                    fontSize: 11,
                },
                tabBarStyle: {
                    borderTopColor: cores.borda,
                    backgroundColor: cores.fundo,
                },
            }}
        >
            <Tabs.Screen
                name='dashboard'
                options={{
                    title: "Início",
                    tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name='compras'
                options={{
                    title: "Compras",
                    tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name='escanear'
                options={{
                    title: "Escanear",
                    tabBarAccessibilityLabel: 'Escanear nota fiscal',
                    tabBarShowLabel: false,
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ focused }) => (
                        <View style={[estilos.botaoEscanear, focused && estilos.botaoEscanearAtivo]}>
                            <ScanLine color={cores.branco} size={26} />
                        </View>
                    )
                }}
            />

            <Tabs.Screen
                name='listas'
                options={{
                    title: "Listas",
                    tabBarIcon: ({ color, size }) => <ListChecks color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name='notificacoes'
                options={{
                    title: "Notificações",
                    tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
                }}
            />
        </Tabs>
    )
}