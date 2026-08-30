import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRegistros } from '../context/RegistrosContext';

export default function ProfileScreen() {
   const { medicoes, fotos, audios } = useRegistros();

   const calcularMedia = (campo) => {
      if (medicoes.length === 0) return 0;
      const soma = medicoes.reduce((total, m) => total + m[campo], 0);
      return Math.round(soma / medicoes.length);
   };

   const mediaSistolica = calcularMedia('sistolica');
   const mediaDiastolica = calcularMedia('diastolica');
   const ultima = medicoes[0];

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.sectionTitle}>Meu Perfil</Text>

            {/* Cartão de análise */}
            <View style={styles.cardResumo}>
               <Text style={styles.cardTitulo}>Resumo de Medições</Text>
               <View style={styles.linhaEstatistica}>
                  <Text style={styles.estatisticaValor}>{medicoes.length}</Text>
                  <Text style={styles.estatisticaRotulo}>
                     {medicoes.length === 1 ? 'medição registrada' : 'medições registradas'}
                  </Text>
               </View>
               <View style={styles.linhaEstatistica}>
                  <Text style={styles.estatisticaValor}>{mediaSistolica} x {mediaDiastolica}</Text>
                  <Text style={styles.estatisticaRotulo}>média de pressão (mmHg)</Text>
               </View>
               {ultima ? (
                  <View style={styles.linhaEstatistica}>
                     <Text style={styles.estatisticaValor}>
                        {ultima.sistolica} x {ultima.diastolica}
                     </Text>
                     <Text style={styles.estatisticaRotulo}>última medição ({ultima.data})</Text>
                  </View>
               ) : null}
            </View>

            {/* Cartão de mídia */}
            <View style={styles.cardResumo}>
               <Text style={styles.cardTitulo}>Mídia Registrada</Text>
               <View style={styles.linhaEstatistica}>
                  <Text style={styles.estatisticaValor}>{fotos.length}</Text>
                  <Text style={styles.estatisticaRotulo}>{fotos.length === 1 ? 'foto salva' : 'fotos salvas'}</Text>
               </View>
               <View style={styles.linhaEstatistica}>
                  <Text style={styles.estatisticaValor}>{audios.length}</Text>
                  <Text style={styles.estatisticaRotulo}>
                     {audios.length === 1 ? 'gravação de áudio' : 'gravações de áudio'}
                  </Text>
               </View>
            </View>

            {/* Sobre */}
            <View style={styles.cardSobre}>
               <Text style={styles.cardTitulo}>Sobre o aplicativo</Text>
               <Text style={styles.sobreTexto}>
                  Este aplicativo permite registrar medições de pressão arterial, tirar fotos e
                  gravar notas de voz. Os dados são mantidos em memória durante esta versão de
                  demonstração.
               </Text>
            </View>
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
   cardResumo: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   cardSobre: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
   },
   cardTitulo: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#161482',
      marginBottom: 14,
   },
   linhaEstatistica: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#eee',
   },
   estatisticaValor: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
   },
   estatisticaRotulo: {
      fontSize: 13,
      color: '#888',
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
   },
   sobreTexto: {
      fontSize: 14,
      color: '#555',
      lineHeight: 21,
   },
});