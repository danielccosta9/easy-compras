import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router, useIsFocused } from "expo-router";
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera'
import { Camera, ScanLine, SwitchCamera, X } from "lucide-react-native";

import { Tela } from "@/components/ui/Tela";
import { Botao } from "@/components/ui/Botao";
import { avisar } from "@/utils/avisos";
import { cores } from "@/theme/tema";
import { estilos } from "./escanear_estilo";

export default function Escanear() {
    const [permissao, perdirPermissao] = useCameraPermissions();
    const [lado, setLado] = useState<CameraType>('back')

    const emFoco = useIsFocused();

    function fechar() {
        if (router.canGoBack()) router.back()
        else router.navigate('/dashboard')
    }

    function trocarLado() {
        setLado((atual) => (atual === 'back' ? 'front' : 'back'))
    }

    function capturar() {
        avisar('Em breve', 'A leitura do QR Code ainda não está funcionando!')
    }

    return (
        <Tela>
            <View>
                <Pressable onPress={fechar} style={estilos.fechar} hitSlop={8} accessibilityLabel="Fechar">
                    <X size={20} color={cores.texto} />
                </Pressable>
                <View style={estilos.selo}>
                    <View style={estilos.ponto} />
                    <Text>ESCANEAR NOTA</Text>
                </View>
            </View>

            <View>
                <Text style={estilos.titulo}>Aponte para o</Text>
                <Text style={estilos.titulo}>QR Code da nota</Text>
                <Text style={estilos.tituloSuave}>fiscal</Text>
            </View>

            <View style={estilos.area}>
                <View style={estilos.quadro}>
                    {!permissao && <ActivityIndicator color={cores.branco} />}

                    {permissao && !permissao.granted && (
                        <View style={estilos.semPermissao}>
                            <Camera size={32} color={cores.branco} />
                            <Text style={estilos.textoPermissao}>
                                {permissao.canAskAgain
                                    ? 'Precisamos da camera para ler o QR Code da nota.'
                                    : 'A câmera foi bloqueada. Libere nas configurações do celular;'
                                }
                            </Text>
                            {permissao.canAskAgain && <Botao titulo="Permitr Câmera" onPress={perdirPermissao} />}
                        </View>
                    )}

                    {permissao?.granted && emFoco && (
                        <>
                            <CameraView style={estilos.camera} facing={lado} />
                            <Text style={estilos.etiqueta}>NFC-e</Text>
                            <Pressable
                                onPress={trocarLado}
                                style={estilos.trocar}
                                hitSlop={8}
                                accessibilityLabel="Trocar câmera"
                            >
                                <SwitchCamera size={18} color={cores.branco} />
                            </Pressable>
                        </>
                    )}
                </View>

                <Pressable
                    onPress={capturar}
                    style={({ pressed }) => [estilos.capturar, pressed && estilos.capturarPressionado]}
                    accessibilityLabel="Ler nota fiscal"
                >
                    <ScanLine size={28} color={cores.branco} />
                </Pressable>
            </View>
        </Tela>
    )
}