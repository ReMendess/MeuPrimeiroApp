import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ErrorMessage from './src/components/ErrorMessage';
import LoadingSpinner from './src/components/LoadingSpinner';
import MedicaoCard from './src/components/MedicaoCard';
import FormularioMedicao from './src/components/FormularioMedicao';

export default function App() {
  return (
<FormularioMedicao/>
  );
}