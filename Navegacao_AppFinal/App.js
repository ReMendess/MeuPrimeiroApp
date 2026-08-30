import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importar as telas
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#161482',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerStyle: styles.header,
          headerTintColor: '#fff',
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontWeight: 'bold' }}>HOME</Text>
            ),
            headerStyle: { backgroundColor: '#161482' },
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontWeight: 'bold' }}>PERFIL</Text>
            ),
            headerStyle: { backgroundColor: '#161482' },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarLabel: { fontSize: 12, fontWeight: '600' },
  header: { backgroundColor: '#161482' },
  headerTitle: { fontWeight: 'bold', fontSize: 18 },
});