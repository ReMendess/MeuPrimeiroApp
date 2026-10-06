import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import MedicaoCard from '../components/MedicaoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRegistros } from '../context/RegistrosContext';

export default function HomeScreen() {
   // Medições vêm do contexto global (persistido em @medicoes),
   // assim aparecem aqui independentemente da tela que as registrou.
   const { medicoes, carregado } = useRegistros();

   if (!carregado) {
      return <LoadingSpinner message="Carregando medições..." />;
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.header}>Histórico de Medições</Text>
            <Text style={styles.subtitle}>
               {medicoes.length > 0
                  ? `${medicoes.length} medição(ões) registrada(s)`
                  : 'Nenhuma medição registrada ainda'}
            </Text>

            {medicoes.length === 0 ? (
               <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📊</Text>
                  <Text style={styles.emptyText}>
                     Comece registrando sua primeira medição na aba "Medir Pressão"
                  </Text>
               </View>
            ) : (
               medicoes.map(medicao => (
                  <MedicaoCard
                     key={medicao.id}
                     sistolica={medicao.sistolica}
                     diastolica={medicao.diastolica}
                     data={medicao.data}
                     hora={medicao.hora}
                  />
               ))
            )}
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5'
   },
   content: {
      padding: 20
   },
   header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
   },
   subtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 20,
   },
   emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
   },
   emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
   },
   emptyText: {
      fontSize: 16,
      color: '#999',
      textAlign: 'center',
      paddingHorizontal: 40,
   },
});