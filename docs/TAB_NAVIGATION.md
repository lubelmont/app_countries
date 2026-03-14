# Implementación de Tab Navigation

**Fecha:** 14 de marzo de 2026  
**Tipo de cambio:** Feature - Navegación con pestañas (Tabs)

## Resumen

Se implementó la navegación mediante Tabs (pestañas en la parte inferior) en la aplicación usando Expo Router. Esto permite al usuario navegar entre diferentes secciones de la app a través de pestañas visibles en la parte inferior de la pantalla.

## Cambios Realizados

### 1. Instalación de Dependencias

Se instalaron las siguientes dependencias:

```bash
npm install @react-navigation/drawer react-dom --legacy-peer-deps
npm install react-native-reanimated@~3.16.7 --legacy-peer-deps
```

**Nota:** Aunque se instaló `@react-navigation/drawer` inicialmente, finalmente se optó por usar Tabs debido a problemas de compatibilidad con `react-native-gesture-handler` en Expo SDK 55.

### 2. Reestructuración de Carpetas

Se reorganizó la estructura del proyecto usando el patrón de grupos `(tabs)`:

**Estructura Final:**
```
app/
  _layout.js (Stack principal)
  index.js (redirección)
  (tabs)/
    _layout.js (configuración de Tabs)
    countries/
      index.js (pantalla de países)
    about/
      index.js (pantalla acerca de)
  country/
    [name].js (detalles de país)
```

### 3. Archivos Modificados y Creados

#### `app/_layout.js` (Principal)

Stack principal que contiene las tabs y las pantallas adicionales:

```javascript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="country/[name]" 
        options={{
          headerShown: true,
          title: 'Detalles',
          // ... más opciones
        }}
      />
    </Stack>
  );
}
```

#### `app/(tabs)/_layout.js` (NUEVO)

Configuración de las pestañas con iconos de Ionicons:

```javascript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#010101' },
        headerTintColor: '#ffffff',
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="countries/index"
        options={{
          title: 'Países',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about/index"
        options={{
          title: 'Acerca de',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

#### `app/index.js`

Redirección a la primera pestaña:

```javascript
import { Redirect } from 'expo-router';

export default function Index() {
    return <Redirect href="/(tabs)/countries" />;
}
```

#### `app/(tabs)/countries/index.js`

Pantalla principal de países (movida desde `app/countries/index.js`). Las rutas de importación se actualizaron:

```javascript
import { fecthCountries } from '../../../lib/countryApiCosumer';
import Header from '../../../components/Header';
import RegionSelector from '../../../components/RegionSelector';
```

#### `app/(tabs)/about/index.js`

Pantalla vacía para "Acerca de" (movida desde `app/about/index.js`).

## Funcionalidad

### Navegación por Tabs

- **Pestaña "Países"**: Muestra la lista de países filtrable por región con icono de globo
- **Pestaña "Acerca de"**: Pantalla vacía (pendiente de implementación) con icono de información
- Las pestañas están en la parte inferior y se cambia tocándolas
- La pestaña activa se resalta en color azul (#4A90E2)

### Navegación a Detalles

- Al tocar una tarjeta de país, se navega a `/country/[name]`
- La pantalla de detalles muestra un header con botón "Atrás"
- El header es negro (#010101) con texto blanco
- Las tabs desaparecen en la pantalla de detalles

## Ventajas de Tabs vs Drawer

✅ **Mejor descubrimiento**: Las opciones siempre visibles  
✅ **Más estable**: Menos problemas de compatibilidad  
✅ **Familiar**: Patrón común en apps móviles  
✅ **Acceso rápido**: Un solo toque para cambiar de sección  

## Próximos Pasos

- [ ] Implementar contenido para la pantalla "Acerca de"
- [ ] Personalizar más los iconos o agregar más pestañas
- [ ] Agregar badges a las tabs (ej: notificaciones)
- [ ] Considerar modo oscuro para las pestañas

## Notas Técnicas

### Compatibilidad

- ✅ iOS
- ✅ Android  
- ✅ Web

### Patrón de Grupos

Los grupos `(nombre)` en Expo Router:
- No aparecen en la URL
- Permiten organizar layouts anidados
- Útiles para tabs, drawers, y auth flows

### Problemas Resueltos

1. **Error con Drawer**: Incompatibilidad con `react-native-gesture-handler` y `react-native-reanimated` en Expo SDK 55
2. **Solución**: Cambio a Tabs que usa solo el Stack Navigator integrado de Expo Router
3. **Dependencias limpias**: No requiere configuración de Babel ni worklets

## Referencias

- [Expo Router - Tabs](https://docs.expo.dev/router/advanced/tabs/)
- [Expo Router - Groups](https://docs.expo.dev/router/advanced/groups/)
- [Ionicons - Icon List](https://ionic.io/ionicons)

