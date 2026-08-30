import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import FormularioMedicao from '../components/FormularioMedicao';

export default function ProfileScreen() {
   const [erro, setErro] = useState(null);

   const handleAddMedicao = (medicao) => {
      console.log('Tentando salvar medição:', medicao);

      // Simulando um delay para dar sensação de processamento
      setTimeout(() => {
         // Simulando erro ao tentar salvar (será implementado posteriormente)
         setErro('Não foi possível salvar a medição. Verifique sua conexão com o servidor.');
      }, 500);
   };

   const handleRetry = () => {
      console.log('Limpando mensagem de erro...');
      setErro(null);
   };

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.sectionTitle}>Registro de Medições</Text>

            {/* Exibe o erro se houver */}
            {erro ? (
               <View style={styles.section}>
                  <ErrorMessage
                     message={erro}
                     onRetry={handleRetry}
                     icon="Atenção"
                  />
               </View>
            ) : (
               /* Formulário de registro */
               <View style={styles.section}>
                  <FormularioMedicao onAddMedicao={handleAddMedicao} />
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
   section: {
      marginBottom: 25,
   },
});