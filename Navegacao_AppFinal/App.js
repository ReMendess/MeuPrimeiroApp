import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import storage from './src/utils/storage';

// Telas de autenticação
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';

// Telas do app
import HomeScreen from './src/screens/HomeScreen';
import NovaMedicaoScreen from './src/screens/NovaMedicaoScreen';
import CameraScreen from './src/screens/CameraScreen';
import AudioScreen from './src/screens/AudioScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import LoadingSpinner from './src/components/LoadingSpinner';
import { RegistrosProvider } from './src/context/RegistrosContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ícone de aba usando emoji (mesmo padrão usado antes na barra lateral)
const iconEmoji = (emoji) => ({ color }) => (
   <Text style={{ fontSize: 20, color }}>{emoji}</Text>
);

const headerVermelho = { headerStyle: { backgroundColor: '#E63946' }, headerTintColor: '#fff' };
const headerRoxo = { headerStyle: { backgroundColor: '#5856D6' }, headerTintColor: '#fff' };

// Navegador de autenticação (Login/Cadastro)
function AuthNavigator({ onLogin }) {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={onLogin} />}
         </Stack.Screen>
         <Stack.Screen name="Cadastro" component={CadastroScreen} />
      </Stack.Navigator>
   );
}

// Navegador principal (App autenticado)
function TabNavigator({ onLogout }) {
   return (
      <Tab.Navigator
         screenOptions={{
            tabBarActiveTintColor: '#E63946',
            tabBarInactiveTintColor: '#8E8E93',
         }}
      >
         <Tab.Screen
            name="Início"
            component={HomeScreen}
            options={{ ...headerVermelho, tabBarIcon: iconEmoji('🏠') }}
         />
         <Tab.Screen
            name="Medir Pressão"
            component={NovaMedicaoScreen}
            options={{ ...headerVermelho, tabBarIcon: iconEmoji('➕') }}
         />
         <Tab.Screen
            name="Câmera"
            component={CameraScreen}
            options={{ ...headerVermelho, tabBarIcon: iconEmoji('📷') }}
         />
         <Tab.Screen
            name="Áudio"
            component={AudioScreen}
            options={{ ...headerVermelho, tabBarIcon: iconEmoji('🎙️') }}
         />
         <Tab.Screen
            name="Perfil"
            options={{ ...headerRoxo, tabBarIcon: iconEmoji('👤') }}
         >
            {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
         </Tab.Screen>
      </Tab.Navigator>
   );
}

export default function App() {
   const [carregando, setCarregando] = useState(true);
   const [usuarioLogado, setUsuarioLogado] = useState(null);

   // Restaura a sessão salva ao iniciar o app
   useEffect(() => {
      let ativo = true;

      (async () => {
         try {
            const usuarioJSON = await storage.getItem('@usuario_logado');
            if (ativo && usuarioJSON) {
               setUsuarioLogado(JSON.parse(usuarioJSON));
            }
         } catch (error) {
            console.error('[App] Erro ao verificar login:', error);
         } finally {
            if (ativo) setCarregando(false);
         }
      })();

      return () => {
         ativo = false;
      };
   }, []);

   // Chamado pelo LoginScreen logo após salvar a sessão
   const handleLogin = (usuario) => setUsuarioLogado(usuario);

   // Chamado pelo ProfileScreen logo após remover a sessão
   const handleLogout = () => setUsuarioLogado(null);

   if (carregando) {
      return <LoadingSpinner message="Carregando..." />;
   }

   return (
      <NavigationContainer>
         {usuarioLogado ? (
            <RegistrosProvider>
               <TabNavigator onLogout={handleLogout} />
            </RegistrosProvider>
         ) : (
            <AuthNavigator onLogin={handleLogin} />
         )}
      </NavigationContainer>
   );
}