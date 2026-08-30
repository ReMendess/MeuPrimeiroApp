import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import FormularioMedicao from '../components/FormularioMedicao';
import ErrorMessage from '../components/ErrorMessage';
import { useRegistros } from '../context/RegistrosContext';
import useConnectivity from '../hooks/useConnectivity';

export default function NovaMedicaoScreen() {
   const { adicionarMedicao } = useRegistros();
   const { isConnected } = useConnectivity();

   // 'form' | 'sucesso' | 'erro'
   const [status, setStatus] = useState('form');
   const [mensagemErro, setMensagemErro] = useState('');

   const handleAddMedicao = async (medicao) => {
      // Falha de conexão: simula a impossibilidade de contatar o servidor
      if (!isConnected) {
         setMensagemErro(
            'Falha de conexão com o servidor. Sua medição não foi salva. ' +
            'Verifique sua internet e tente novamente.'
         );
         setStatus('erro');
         return;
      }

      // Simula o envio para o servidor (dá sensação de processamento)
      await new Promise((resolve) => setTimeout(resolve, 800));

      adicionarMedicao(medicao);
      setStatus('sucesso');
   };

   if (status === 'sucesso') {
      return (
         <View style={styles.centered}>
            <Text style={styles.okIcon}>✅</Text>
            <Text style={styles.okTitle}>Medição salva!</Text>
            <Text style={styles.okMessage}>
               Sua medição foi registrada e já aparece no seu histórico.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => setStatus('form')}>
               <Text style={styles.buttonText}>Registrar outra medição</Text>
            </TouchableOpacity>
         </View>
      );
   }

   if (status === 'erro') {
      return (
         <View style={styles.centered}>
            <ErrorMessage
               title="Falha de conexão"
               icon="📡"
               message={mensagemErro}
               buttonText="Tentar novamente"
               onRetry={() => setStatus('form')}
            />
         </View>
      );
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.sectionTitle}>Registro de Medições</Text>

            <FormularioMedicao onAddMedicao={handleAddMedicao} />

            {!isConnected && (
               <View style={styles.avisoOffline}>
                  <Text style={styles.avisoTexto}>
                     ⚠️ Você está sem conexão com a internet. As medições podem não ser salvas.
                  </Text>
               </View>
            )}
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#f5f5f5' },
   content: { padding: 20 },
   sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
   },
   avisoOffline: {
      backgroundColor: '#FDEBD0',
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: '#F5B041',
   },
   avisoTexto: {
      color: '#935116',
      fontSize: 13,
      lineHeight: 20,
   },
   centered: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
   },
   okIcon: { fontSize: 64, marginBottom: 12 },
   okTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
   okMessage: {
      fontSize: 15,
      color: '#666',
      textAlign: 'center',
      marginBottom: 28,
      lineHeight: 22,
   },
   button: {
      backgroundColor: '#161482',
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 8,
   },
   buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});