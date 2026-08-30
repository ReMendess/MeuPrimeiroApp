import { View, Text, StyleSheet } from 'react-native';

export default function MedicaoCard({ sistolica, diastolica, data, hora }) {
  // Função para classificar a pressão conforme a Sociedade Brasileira de Cardiologia
  const getClassificacao = () => {
    if (sistolica < 90 || diastolica < 60)
      return { texto: 'Pressão Baixa', cor: '#3498DB' };
    if (sistolica < 120 && diastolica < 80)
      return { texto: 'Normal', cor: '#2ECC71' };
    if (sistolica < 130 && diastolica < 85)
      return { texto: 'Elevada', cor: '#F1C40F' };
    if (sistolica < 140 && diastolica < 90)
      return { texto: 'Hipertensão Estágio 1', cor: '#E67E22' };
    if (sistolica < 160 && diastolica < 100)
      return { texto: 'Hipertensão Estágio 2', cor: '#E63946' };
    if (sistolica >= 180 || diastolica >= 110)
      return { texto: 'Crise Hipertensiva', cor: '#8E44AD' };
    return { texto: 'Hipertensão Grave', cor: '#C0392B' };
  };

  const classificacao = getClassificacao();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.data}>{data}</Text>
        <Text style={styles.hora}>{hora}</Text>
      </View>

      <View style={styles.pressaoContainer}>
        <Text style={styles.pressaoLabel}>Pressão Arterial</Text>
        <Text style={styles.pressaoValor}>
          {sistolica} <Text style={styles.separador}>x</Text> {diastolica}
          <Text style={styles.unidade}> mmHg</Text>
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: classificacao.cor }]}>
        <Text style={styles.badgeText}>{classificacao.texto}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  data: { fontSize: 14, color: '#666' },
  hora: { fontSize: 14, color: '#999' },
  pressaoContainer: { alignItems: 'center', marginBottom: 12 },
  pressaoLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  pressaoValor: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  separador: { fontSize: 24, color: '#999' },
  unidade: { fontSize: 14, fontWeight: 'normal', color: '#666' },
  badge: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});