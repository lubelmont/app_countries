import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#010101',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="countries/index"
        options={{
          title: 'Países',
          tabBarLabel: 'Países',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="about/index"
        options={{
          title: 'Acerca de',
          tabBarLabel: 'Acerca de',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
