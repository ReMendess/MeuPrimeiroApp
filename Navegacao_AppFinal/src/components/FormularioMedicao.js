import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function FormularioMedicao({ onAddMedicao }) {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');

  const handleSubmit = () => {
    if (!sistolica || !diastolica) return;

    const agora = new Date();
    const medicao = {
      id: Date.now(),
      sistolica: parseInt(sistolica),
      diastolica: parseInt(diastolica),
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddMedicao(medicao);
    setSistolica('');
    setDiastolica('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Medição</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sistólica (máx)</Text>
          <TextInput
            style={styles.input}
            value={sistolica}
            onChangeText={setSistolica}
            placeholder="120"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <Text style={styles.separator}>x</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diastólica (mín)</Text>
          <TextInput
            style={styles.input}
            value={diastolica}
            onChangeText={setDiastolica}
            placeholder="80"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>

      <Text style={styles.hint}>Exemplo: 120 x 80 mmHg</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar Medição</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },

  inputGroup: {
    flex: 1,
    alignItems: 'center'
  },

  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  separator: {
    fontSize: 24,
    color: '#999',
    marginHorizontal: 12
  },

  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16
  },

  button: {
    backgroundColor: '#ccd215',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});