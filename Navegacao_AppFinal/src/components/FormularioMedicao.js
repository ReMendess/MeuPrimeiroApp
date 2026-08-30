import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function FormularioMedicao({ onAddMedicao }) {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const validar = () => {
    const novosErros = {};

    if (!sistolica.trim()) {
      novosErros.sistolica = 'Informe a pressão sistólica (máx).';
    } else {
      const valor = parseInt(sistolica, 10);
      if (isNaN(valor) || valor < 70 || valor > 250) {
        novosErros.sistolica = 'Use um valor entre 70 e 250.';
      }
    }

    if (!diastolica.trim()) {
      novosErros.diastolica = 'Informe a pressão diastólica (mín).';
    } else {
      const valor = parseInt(diastolica, 10);
      if (isNaN(valor) || valor < 40 || valor > 150) {
        novosErros.diastolica = 'Use um valor entre 40 e 150.';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (salvando) return;
    if (!validar()) return;

    setSalvando(true);

    const agora = new Date();
    const medicao = {
      id: Date.now(),
      sistolica: parseInt(sistolica, 10),
      diastolica: parseInt(diastolica, 10),
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      await onAddMedicao(medicao);
      setSistolica('');
      setDiastolica('');
      setErros({});
    } catch (e) {
      // A tela trata o erro (ex.: falha de conexão)
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Medição</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sistólica (máx)</Text>
          <TextInput
            style={[styles.input, erros.sistolica && styles.inputErro]}
            value={sistolica}
            onChangeText={setSistolica}
            placeholder="120"
            keyboardType="numeric"
            maxLength={3}
            editable={!salvando}
          />
          {erros.sistolica && <Text style={styles.textoErro}>{erros.sistolica}</Text>}
        </View>

        <Text style={styles.separator}>x</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diastólica (mín)</Text>
          <TextInput
            style={[styles.input, erros.diastolica && styles.inputErro]}
            value={diastolica}
            onChangeText={setDiastolica}
            placeholder="80"
            keyboardType="numeric"
            maxLength={3}
            editable={!salvando}
          />
          {erros.diastolica && <Text style={styles.textoErro}>{erros.diastolica}</Text>}
        </View>
      </View>

      <Text style={styles.hint}>Exemplo: 120 x 80 mmHg</Text>

      <TouchableOpacity
        style={[styles.button, salvando && styles.buttonDesabilitado]}
        onPress={handleSubmit}
        disabled={salvando}
      >
        <Text style={styles.buttonText}>
          {salvando ? 'Salvando...' : 'Registrar Medição'}
        </Text>
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
    alignItems: 'flex-start',
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

  inputErro: {
    borderColor: '#E63946',
    backgroundColor: '#FDECEC'
  },

  textoErro: {
    fontSize: 10,
    color: '#E63946',
    marginTop: 4,
    textAlign: 'center'
  },

  separator: {
    fontSize: 24,
    color: '#999',
    marginHorizontal: 12,
    marginTop: 34
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

  buttonDesabilitado: {
    backgroundColor: '#b0b877'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});