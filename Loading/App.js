import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoadingSpinner from './src/components/LoadingSpinner';
import ErrorMessage from './src/components/ErrorMessage';

export default function App() {
  return (
    <LoadingSpinner />
  );
}
