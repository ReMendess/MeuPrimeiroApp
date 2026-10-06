import { useState } from 'react';
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   ActivityIndicator
} from 'react-native';
import storage from '../utils/storage';

export default function LoginScreen({ navigation, onLogin }) {
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [erro, setErro] = useState('');
   const [entrando, setEntrando] = useState(false);

   const handleLogin = async () => {
      if (entrando) return;
      setErro('');

      if (!email.trim() || !senha) {
         setErro('Preencha email e senha.');
         return;
      }

      setEntrando(true);

      try {
         // Buscar usuários cadastrados
         const usuariosJSON = await storage.getItem('@usuarios');
         const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

         // Buscar usuário por email e senha
         const usuario = usuarios.find(
            u => u.email === email.trim().toLowerCase() && u.senha === senha
         );

         if (!usuario) {
            setErro('Email ou senha incorretos.');
            return;
         }

         // Login bem-sucedido - salvar sessão
         await storage.setItem('@usuario_logado', JSON.stringify(usuario));

         // Avisar o App para trocar para a área autenticada
         if (onLogin) {
            onLogin(usuario);
         }
      } catch (error) {
         console.error('Erro ao fazer login:', error);
         setErro('Não foi possível fazer login. Tente novamente.');
      } finally {
         setEntrando(false);
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Bem-vindo!</Text>
         <Text style={styles.subtitle}>Faça login para continuar</Text>

         <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
         />

         <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
         />

         {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}

         <TouchableOpacity
            style={[styles.button, entrando && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={entrando}
         >
            {entrando
               ? <ActivityIndicator color="#fff" />
               : <Text style={styles.buttonText}>Entrar</Text>}
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5',
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 40,
   },
   input: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ddd',
   },
   button: {
      backgroundColor: '#E63946',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   buttonDisabled: {
      backgroundColor: '#F2A0A6',
   },
   erroTexto: {
      color: '#E63946',
      fontSize: 14,
      marginBottom: 10,
      textAlign: 'center',
   },
   linkText: {
      color: '#E63946',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 14,
   },
});