import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  
  // useSegments
  //['login'] -> /login
  //['(tabs)', 'countries'] -> /(tabs)/countries
  const segments = useSegments();
  
  // useRouter es el hook de navegación de Expo Router, similar a useNavigation en Reacte Navigation, pero adaptado al sistema de rutas basado en archivos de Expo Router.
  const router = useRouter();

  //Guard de rutas para proteger las rutas de autenticación
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      // Redirigir a login si no hay usuario autenticado
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirigir a tabs si el usuario ya está autenticado
      router.replace('/(tabs)/countries');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          title: 'Login'
        }} 
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
