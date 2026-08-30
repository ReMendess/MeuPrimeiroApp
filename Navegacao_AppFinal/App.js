import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import NovaMedicaoScreen from './src/screens/NovaMedicaoScreen';
import CameraScreen from './src/screens/CameraScreen';
import AudioScreen from './src/screens/AudioScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Contexto global
import { RegistrosProvider } from './src/context/RegistrosContext';

const Drawer = createDrawerNavigator();

const iconEmoji = (emoji) => ({ color, size }) => (
   <Text style={{ fontSize: size * 0.6, color }}>{emoji}</Text>
);

export default function App() {
   return (
      <GestureHandlerRootView style={styles.flex}>
         <RegistrosProvider>
            <NavigationContainer>
               <StatusBar style="light" />
               {/* Barra lateral de navegação (drawer) */}
               <Drawer.Navigator
                  screenOptions={{
                     headerStyle: styles.header,
                     headerTintColor: '#fff',
                     headerTitleStyle: styles.headerTitle,
                     headerTitleAlign: 'center',
                     drawerActiveTintColor: '#161482',
                     drawerInactiveTintColor: '#555',
                     drawerActiveBackgroundColor: '#E8E8FA',
                     drawerStyle: styles.drawer,
                     drawerLabelStyle: styles.drawerLabel,
                     drawerItemStyle: styles.drawerItem,
                  }}
               >
                  <Drawer.Screen
                     name="Home"
                     component={HomeScreen}
                     options={{ title: 'Início', drawerIcon: iconEmoji('🏠') }}
                  />
                  <Drawer.Screen
                     name="NovaMedicao"
                     component={NovaMedicaoScreen}
                     options={{ title: 'Registrar Medição', drawerIcon: iconEmoji('➕') }}
                  />
                  <Drawer.Screen
                     name="Camera"
                     component={CameraScreen}
                     options={{ title: 'Câmera', drawerIcon: iconEmoji('📷') }}
                  />
                  <Drawer.Screen
                     name="Audio"
                     component={AudioScreen}
                     options={{ title: 'Áudio', drawerIcon: iconEmoji('🎙️') }}
                  />
                  <Drawer.Screen
                     name="Perfil"
                     component={ProfileScreen}
                     options={{ title: 'Perfil', drawerIcon: iconEmoji('👤') }}
                  />
               </Drawer.Navigator>
            </NavigationContainer>
         </RegistrosProvider>
      </GestureHandlerRootView>
   );
}

const styles = StyleSheet.create({
   flex: { flex: 1 },
   header: { backgroundColor: '#161482' },
   headerTitle: { fontWeight: 'bold', fontSize: 18 },
   drawer: {
      backgroundColor: '#fafafa',
      width: 280,
   },
   drawerLabel: {
      fontSize: 15,
      fontWeight: '600',
   },
   drawerItem: {
      borderRadius: 10,
      marginHorizontal: 8,
   },
});