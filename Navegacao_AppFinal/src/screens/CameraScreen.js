import { useState, useRef } from 'react';
import {
   View, Text, TouchableOpacity, StyleSheet, Image,
   ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRegistros } from '../context/RegistrosContext';

export default function CameraScreen() {
   const [permission, requestPermission] = useCameraPermissions();
   const [facing, setFacing] = useState('back');
   const [flash, setFlash] = useState('off');
   const [tirando, setTirando] = useState(false);
   const [preview, setPreview] = useState(null); // URI da foto recém capturada
   const cameraRef = useRef(null);
   const { fotos, adicionarFoto } = useRegistros();

   const tirarFoto = async () => {
      if (tirando || !cameraRef.current) return;
      setTirando(true);
      try {
         const resultado = await cameraRef.current.takePictureAsync({ quality: 0.7 });
         setPreview(resultado.uri);
      } catch (erro) {
         Alert.alert('Erro ao capturar', 'Não foi possível tirar a foto. Tente novamente.');
      } finally {
         setTirando(false);
      }
   };

   const salvarFoto = () => {
      if (!preview) return;
      const agora = new Date();
      adicionarFoto({
         id: Date.now(),
         uri: preview,
         data: agora.toLocaleDateString('pt-BR'),
         hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });
      setPreview(null);
   };

   // Tela de permissão pendente
   if (!permission) {
      return <LoadingSpinner message="Solicitando acesso à câmera..." />;
   }

   // Tela de erro de permissão negada
   if (!permission.granted) {
      return (
         <ErrorMessage
            title="Permissão de câmera"
            icon="🚫"
            message="Precisamos do acesso à câmera do seu celular para registrar fotos. Conceda a permissão para continuar."
            buttonText="Conceder permissão"
            onRetry={requestPermission}
         />
      );
   }

   // Preview da foto capturada
   if (preview) {
      return (
         <View style={styles.container}>
            <Image source={{ uri: preview }} style={styles.previewImagem} />
            <View style={styles.previewBotoes}>
               <TouchableOpacity
                  style={[styles.botao, styles.botaoDescartar]}
                  onPress={() => setPreview(null)}
               >
                  <Text style={styles.botaoTexto}>Refazer</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.botao, styles.botaoSalvar]} onPress={salvarFoto}>
                  <Text style={styles.botaoTexto}>💾 Salvar foto</Text>
               </TouchableOpacity>
            </View>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
            mirror={facing === 'front'}
         >
            <View style={styles.controles}>
               <TouchableOpacity
                  style={styles.botaoControle}
                  onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
               >
                  <Text style={styles.iconeControle}>{flash === 'on' ? '⚡ Flash' : '🔦 Flash'}</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.disparoBorda} onPress={tirarFoto}>
                  <View style={styles.disparoInterno} />
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.botaoControle}
                  onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
               >
                  <Text style={styles.iconeControle}>🔄 Virar</Text>
               </TouchableOpacity>
            </View>

            {tirando && (
               <View style={styles.overlayTirando}>
                  <ActivityIndicator size="large" color="#fff" />
               </View>
            )}
         </CameraView>

         {/* Miniaturas das fotos salvas */}
         <View style={styles.galeria}>
            <Text style={styles.galeriaTitulo}>Fotos registradas ({fotos.length})</Text>
            {fotos.length === 0 ? (
               <Text style={styles.galeriaVazia}>
                  Nenhuma foto salva ainda. Tire sua primeira foto! 📸
               </Text>
            ) : (
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {fotos.map((foto) => (
                     <Image key={foto.id} source={{ uri: foto.uri }} style={styles.miniatura} />
                  ))}
               </ScrollView>
            )}
         </View>
      </View>
   );
}
const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#111' },
   camera: { flex: 1 },
   controles: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingBottom: 24,
      paddingHorizontal: 16,
   },
   botaoControle: {
      backgroundColor: 'rgba(0,0,0,0.45)',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
   },
   iconeControle: { color: '#fff', fontSize: 14, fontWeight: '600' },
   disparoBorda: {
      width: 74,
      height: 74,
      borderRadius: 37,
      borderWidth: 4,
      borderColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
   },
   disparoInterno: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: '#fff',
   },
   overlayTirando: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.35)',
   },
   galeria: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
   },
   galeriaTitulo: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
   galeriaVazia: { fontSize: 13, color: '#888', marginBottom: 6 },
   miniatura: {
      width: 64,
      height: 64,
      borderRadius: 8,
      marginRight: 8,
      backgroundColor: '#eee',
   },
   previewImagem: { flex: 1, resizeMode: 'cover' },
   previewBotoes: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: '#fff',
   },
   botao: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 130,
      alignItems: 'center',
   },
   botaoDescartar: { backgroundColor: '#6C757D' },
   botaoSalvar: { backgroundColor: '#161482' },
   botaoTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
});