import { useState } from 'react';
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   ScrollView
} from 'react-native';
import storage from '../utils/storage';

export default function CadastroScreen({ navigation }) {
   const [nome, setNome] = useState('');
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [confirmarSenha, setConfirmarSenha] = useState('');
   const [erro, setErro] = useState('');
   const [sucesso, setSucesso] = useState(false);
   const [salvando, setSalvando] = useState(false);

   const validarEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
   };

   const handleCadastro = async () => {
      if (salvando) return;
      setErro('');

      // Validação: campos vazios
      if (!nome || !email || !senha || !confirmarSenha) {
         setErro('Preencha todos os campos.');
         return;
      }

      // Validação: nome muito curto
      if (nome.trim().length < 3) {
         setErro('Nome deve ter pelo menos 3 caracteres.');
         return;
      }

      // Validação: email inválido
      if (!validarEmail(email.trim())) {
         setErro('Digite um email válido.');
         return;
      }

      // Validação: senha muito curta
      if (senha.length < 6) {
         setErro('Senha deve ter pelo menos 6 caracteres.');
         return;
      }

      // Validação: senhas não conferem
      if (senha !== confirmarSenha) {
         setErro('As senhas não conferem.');
         return;
      }

      setSalvando(true);

      try {
         // Buscar usuários existentes
         const usuariosJSON = await storage.getItem('@usuarios');
         const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

         // Verificar se email já existe (comparação em minúsculas)
         const emailNormalizado = email.trim().toLowerCase();
         const emailExiste = usuarios.some(u => u.email === emailNormalizado);
         if (emailExiste) {
            setErro('Este email já está cadastrado.');
            return;
         }

         // Criar novo usuário
         const novoUsuario = {
            id: Date.now().toString(),
            nome: nome.trim(),
            email: emailNormalizado,
            senha,
            dataCadastro: new Date().toISOString()
         };

         // Adicionar à lista e salvar
         usuarios.push(novoUsuario);
         await storage.setItem('@usuarios', JSON.stringify(usuarios));

         // Limpar campos e mostrar confirmação
         setNome('');
         setEmail('');
         setSenha('');
         setConfirmarSenha('');
         setSucesso(true);
      } catch (error) {
         console.error('Erro ao cadastrar:', error);
         setErro('Não foi possível realizar o cadastro. Tente novamente.');
      } finally {
         setSalvando(false);
      }
   };

   if (sucesso) {
      return (
         <View style={styles.sucessoContainer}>
            <Text style={styles.sucessoIcon}>✅</Text>
            <Text style={styles.sucessoTitulo}>Cadastro realizado!</Text>
            <Text style={styles.sucessoTexto}>
               Sua conta foi criada com sucesso. Faça login para continuar.
            </Text>
            <TouchableOpacity
               style={styles.button}
               onPress={() => navigation.navigate('Login')}
            >
               <Text style={styles.buttonText}>Ir para o login</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados abaixo</Text>

            <TextInput
               style={styles.input}
               placeholder="Nome completo"
               value={nome}
               onChangeText={setNome}
               autoCapitalize="words"
            />

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

            <TextInput
               style={styles.input}
               placeholder="Confirmar senha"
               value={confirmarSenha}
               onChangeText={setConfirmarSenha}
               secureTextEntry
            />

            {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}

            <TouchableOpacity
               style={[styles.button, salvando && styles.buttonDisabled]}
               onPress={handleCadastro}
               disabled={salvando}
            >
               <Text style={styles.buttonText}>
                  {salvando ? 'Cadastrando...' : 'Cadastrar'}
               </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
               <Text style={styles.linkText}>Já tem conta? Faça login</Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
   },
   content: {
      padding: 20,
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 30,
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
   sucessoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: '#f5f5f5',
   },
   sucessoIcon: {
      fontSize: 64,
      marginBottom: 12,
   },
   sucessoTitulo: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
      textAlign: 'center',
   },
   sucessoTexto: {
      fontSize: 15,
      color: '#666',
      textAlign: 'center',
      marginBottom: 28,
      lineHeight: 22,
   },
});