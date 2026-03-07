import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Países',
          }}
        />
        <Stack.Screen 
          name="country/[name]" 
          options={{
            headerShown: true,
            title: 'Detalles',
            headerBackTitle: 'Atrás', 
 
            headerStyle: {
              backgroundColor: '#010101',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
