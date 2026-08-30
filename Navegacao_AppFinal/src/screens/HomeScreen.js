import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import MedicaoCard from '../components/MedicaoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useRegistros } from '../context/RegistrosContext';
import useConnectivity from '../hooks/useConnectivity';

export default function HomeScreen() {
   const { medicoes } = useRegistros();
   const { isConnected } = useConnectivity();
   const [carregando, setCarregando] = useState(true);
   const [atualizando, setAtualizando] = useState(false);

   // Simula uma chamada à API ao abrir a tela
   useEffect(() => {
      const timer = setTimeout(() => setCarregando(false), 1500);
      return () => clearTimeout(timer);
   }, []);

   const tentarNovamente = useCallback(() => {
      setCarregando(true);
      setTimeout(() => setCarregando(false), 1200);
   }, []);

   const aoAtualizar = useCallback(() => {
      setAtualizando(true);
      setTimeout(() => setAtualizando(false), 1200);
   }, []);

   if (carregando) {
      return <LoadingSpinner message="Carregando suas medições..." />;
   }

   // Falha de conexão: mostra tela de erro amigável
   if (!isConnected) {
      return (
         <ErrorMessage
            title="Sem conexão"
            icon="📡"
            message="Não foi possível carregar suas medições. Verifique sua conexão com a internet e tente novamente."
            buttonText="Tentar novamente"
            onRetry={tentarNovamente}
         />
      );
   }

   // Estado vazio (nenhuma medição registrada)
   if (medicoes.length === 0) {
      return (
         <View style={styles.vazioContainer}>
            <Text style={styles.vazioIcon}>🩺</Text>
            <Text style={styles.vazioTitulo}>Nenhuma medição ainda</Text>
            <Text style={styles.vazioTexto}>
               Registre sua primeira medição na tela "Registrar Medição".
            </Text>
         </View>
      );
   }

   return (
      <ScrollView
         style={styles.container}
         refreshControl={<RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} />}
      >
         <View style={styles.content}>
            <Text style={styles.header}>Minhas Medições</Text>
            <Text style={styles.subtitle}>Histórico de pressão arterial</Text>

            <View style={styles.resumo}>
               <Text style={styles.resumoTexto}>
                  {medicoes.length} {medicoes.length === 1 ? 'medição registrada' : 'medições registradas'}
               </Text>
            </View>

            {/* Lista de medições */}
            {medicoes.map(medicao => (
               <MedicaoCard
                  key={medicao.id}
                  sistolica={medicao.sistolica}
                  diastolica={medicao.diastolica}
                  data={medicao.data}
                  hora={medicao.hora}
               />
            ))}
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#f5f5f5' },
   content: { padding: 20 },
   header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
   },
   subtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 16,
   },
   resumo: {
      backgroundColor: '#161482',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginBottom: 16,
      alignSelf: 'flex-start',
   },
   resumoTexto: { color: '#fff', fontSize: 13, fontWeight: '600' },
   vazioContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
   },
   vazioIcon: { fontSize: 56, marginBottom: 12 },
   vazioTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
   vazioTexto: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
});