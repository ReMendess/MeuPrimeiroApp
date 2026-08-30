import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
   useAudioRecorder,
   useAudioRecorderState,
   useAudioPlayer,
   useAudioPlayerStatus,
   RecordingPresets,
   setAudioModeAsync,
   requestRecordingPermissionsAsync,
} from 'expo-audio';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRegistros } from '../context/RegistrosContext';

const formatarDuracao = (segundos) => {
   const s = Math.max(0, Math.floor(segundos));
   const minutos = Math.floor(s / 60);
   const resto = s % 60;
   return `${minutos}:${String(resto).padStart(2, '0')}`;
};

export default function AudioScreen() {
   const { audios, adicionarAudio } = useRegistros();
   const [permissao, setPermissao] = useState('carregando'); // 'carregando' | 'concedida' | 'negada'
   const [erro, setErro] = useState(null);
   const [tocandoId, setTocandoId] = useState(null); // id do áudio selecionado
   const [tocando, setTocando] = useState(false);

   const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
   const recorderState = useAudioRecorderState(recorder, 300);
   const player = useAudioPlayer(null);
   const playerStatus = useAudioPlayerStatus(player);

   // Configura o modo de áudio e solicita permissão do microfone
   useEffect(() => {
      setAudioModeAsync({
         allowsRecording: true,
         playsInSilentMode: true,
         interruptionMode: 'doNotMix',
      }).catch(() => {});

      (async () => {
         try {
            const { granted } = await requestRecordingPermissionsAsync();
            setPermissao(granted ? 'concedida' : 'negada');
         } catch (e) {
            setPermissao('negada');
         }
      })();
   }, []);

   const iniciarGravacao = async () => {
      setErro(null);
      try {
         await recorder.prepareToRecordAsync();
         recorder.record();
      } catch (e) {
         setErro('Não foi possível iniciar a gravação. Verifique se o microfone está disponível.');
      }
   };

   const pararGravacao = async () => {
      try {
         await recorder.stop();
         const uri = recorder.uri;
         if (uri) {
            const agora = new Date();
            adicionarAudio({
               id: Date.now(),
               uri,
               data: agora.toLocaleDateString('pt-BR'),
               hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
               duracao: Math.round(recorder.currentTime),
            });
         }
      } catch (e) {
         setErro('Não foi possível salvar a gravação. Tente novamente.');
      }
   };

   const alternarGravacao = () => {
      if (recorderState.isRecording) {
         pararGravacao();
      } else {
         iniciarGravacao();
      }
   };

   const tocarOuPausar = (audio) => {
      if (tocandoId === audio.id) {
         if (playerStatus.playing) {
            player.pause();
         } else {
            player.play();
         }
         return;
      }

      setTocandoId(audio.id);
      setTocando(true);
      player.replace(audio.uri);
      player.play();
   };

   // Mantém o estado "tocando" sincronizado com o player
   useEffect(() => {
      setTocando(Boolean(playerStatus.playing));
   }, [playerStatus.playing]);

   if (permissao === 'carregando') {
      return <LoadingSpinner message="Solicitando acesso ao microfone..." />;
   }

   if (permissao === 'negada') {
      return (
         <ErrorMessage
            title="Permissão de microfone"
            icon="🚫"
            message="Precisamos do acesso ao microfone do seu celular para gravar áudios. Conceda a permissão para continuar."
            buttonText="Conceder permissão"
            onRetry={async () => {
               const { granted } = await requestRecordingPermissionsAsync();
               setPermissao(granted ? 'concedida' : 'negada');
            }}
         />
      );
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.titulo}>Gravador de Notas de Voz</Text>
            <Text style={styles.subtitulo}>Registre um comentário sobre sua medição.</Text>

            {/* Erro de gravação */}
            {erro && (
               <ErrorMessage
                  title="Falha no gravador"
                  icon="⚠️"
                  message={erro}
                  buttonText="Entendi"
                  onRetry={() => setErro(null)}
               />
            )}

            {/* Controle de gravação */}
            <View style={styles.cartaoGravacao}>
               <Text style={styles.tempoGravacao}>
                  {recorderState.isRecording ? '🔴 Gravando...' : 'Pronto para gravar'}
               </Text>
               <Text style={styles.duracaoGravacao}>
                  {formatarDuracao(recorderState.durationMillis / 1000)}
               </Text>

               <TouchableOpacity
                  style={[
                     styles.botaoGravar,
                     recorderState.isRecording && styles.botaoGravarAtivo,
                  ]}
                  onPress={alternarGravacao}
               >
                  <Text style={styles.botaoGravarTexto}>
                     {recorderState.isRecording ? '⬛ Parar' : '🎤 Gravar'}
                  </Text>
               </TouchableOpacity>
            </View>

            {/* Lista de gravações */}
            <Text style={styles.tituloLista}>Gravações ({audios.length})</Text>
            {audios.length === 0 ? (
               <View style={styles.vazio}>
                  <Text style={styles.vazioTexto}>
                     Nenhuma gravação ainda. Toque em "Gravar" para começar. 🎙️
                  </Text>
               </View>
            ) : (
               audios.map((audio) => {
                  const estaTocando = tocandoId === audio.id && tocando;
                  return (
                     <View key={audio.id} style={styles.cartaoAudio}>
                        <View style={styles.infoAudio}>
                           <Text style={styles.dataAudio}>
                              {audio.data} às {audio.hora}
                           </Text>
                           <Text style={styles.duracaoAudio}>
                              Duração: {formatarDuracao(audio.duracao)}
                           </Text>
                        </View>
                        <TouchableOpacity
                           style={styles.botaoPlay}
                           onPress={() => tocarOuPausar(audio)}
                        >
                           <Text style={styles.botaoPlayTexto}>
                              {estaTocando ? '⏸' : '▶️'}
                           </Text>
                        </TouchableOpacity>
                     </View>
                  );
               })
            )}
         </View>
      </ScrollView>
   );
}
const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#f5f5f5' },
   content: { padding: 20 },
   titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      textAlign: 'center',
   },
   subtitulo: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
   },
   cartaoGravacao: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 24,
      marginTop: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      alignItems: 'center',
   },
   tempoGravacao: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 4 },
   duracaoGravacao: { fontSize: 40, fontWeight: 'bold', color: '#161482', marginBottom: 16 },
   botaoGravar: {
      backgroundColor: '#161482',
      paddingHorizontal: 40,
      paddingVertical: 14,
      borderRadius: 40,
   },
   botaoGravarAtivo: { backgroundColor: '#E63946' },
   botaoGravarTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
   tituloLista: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
   vazio: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
   },
   vazioTexto: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20 },
   cartaoAudio: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
   },
   infoAudio: { flex: 1 },
   dataAudio: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 2 },
   duracaoAudio: { fontSize: 12, color: '#888' },
   botaoPlay: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#161482',
      justifyContent: 'center',
      alignItems: 'center',
   },
   botaoPlayTexto: { fontSize: 20, color: '#fff' },
});