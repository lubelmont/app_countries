# 📝 Documento de Cambios - Countries App

Este documento explica todos los cambios realizados en la aplicación para agregar navegación entre pantallas y mejorar la experiencia del usuario.

---

## 📋 Índice

1. [Resumen de Cambios](#resumen-de-cambios)
2. [React Navigation](#react-navigation)
3. [SafeAreaView y el Problema del Notch](#safeareaview-y-el-problema-del-notch)
4. [Estructura de Navegación](#estructura-de-navegación)
5. [Componentes Creados](#componentes-creados)
6. [API y Fetch](#api-y-fetch)
7. [Estilos y Diseño](#estilos-y-diseño)
8. [Nueva Estructura del Proyecto](#nueva-estructura-del-proyecto)

---

## 🎯 Resumen de Cambios

### ¿Qué se agregó?

1. **Navegación entre pantallas** - Ahora puedes tocar un país y ver sus detalles en una nueva pantalla
2. **Corrección del Header** - El header ya no se superpone con la cámara/notch del dispositivo
3. **Pantalla de detalles** - Muestra información completa del país seleccionado con un diseño atractivo
4. **Mejoras visuales** - Cards con sombras, mejor organización y diseño más profesional

### Dependencias Instaladas

```bash
@react-navigation/native
@react-navigation/native-stack
react-native-screens
react-native-safe-area-context
```

---

## 🧭 React Navigation

### ¿Qué es React Navigation?

**React Navigation** es la biblioteca más popular para manejar la navegación en aplicaciones React Native. Es como tener un sistema de "páginas" en tu app móvil.

### ¿Por qué usarlo?

En aplicaciones móviles no tenemos URLs como en web. React Navigation nos permite:

- **Cambiar de pantalla**: Ir de una vista a otra
- **Pasar datos**: Enviar información entre pantallas
- **Botón de retroceso**: Volver a la pantalla anterior
- **Animaciones**: Transiciones suaves entre pantallas

### Tipos de Navegadores

En esta app usamos **Stack Navigator** (navegador de pila):

```javascript
const Stack = createNativeStackNavigator();
```

Funciona como una **pila de cartas**:
- Cuando abres una pantalla nueva, se coloca encima de la anterior
- Cuando presionas "atrás", se quita la carta de arriba
- Siempre puedes ver qué pantalla está "activa" (la de arriba)

**Otros tipos de navegadores** (no usados en esta app):
- **Tab Navigator**: Pestañas en la parte inferior (como Instagram)
- **Drawer Navigator**: Menú lateral que se desliza

---

## 📱 SafeAreaView y el Problema del Notch

### El Problema

En dispositivos modernos (iPhone X y posteriores, muchos Android), la pantalla tiene:
- **Notch**: El "corte" en la parte superior donde está la cámara
- **Zonas no seguras**: Áreas donde el contenido puede quedar oculto

**Antes del cambio:**
```
┌─────────────────┐
│ ⚫️ [Cámara]    │ ← Header oculto aquí
│ Countries App   │ ← Texto cortado
├─────────────────┤
│                 │
```

### La Solución: SafeAreaView

`SafeAreaView` es un componente que **detecta automáticamente** las zonas seguras del dispositivo y ajusta el contenido:

```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={styles.safeArea}>
  <View style={styles.headerContainer}>
    {/* Tu contenido aquí */}
  </View>
</SafeAreaView>
```

**Después del cambio:**
```
┌─────────────────┐
│ ⚫️ [Cámara]    │ ← Espacio reservado
├─────────────────┤
│ 🌍 Countries App│ ← Header visible
├─────────────────┤
│                 │
```

**Propiedades importantes:**
- `edges={['top']}`: Solo aplica padding arriba (no abajo ni a los lados)
- `edges={['top', 'bottom']}`: Aplica padding arriba y abajo
- Sin `edges`: Aplica en todos lados

---

## 🏗️ Estructura de Navegación

### Configuración en App.js

```javascript
export default function App() {
  return (
    <SafeAreaProvider>          {/* 1. Proveedor de SafeArea */}
      <NavigationContainer>      {/* 2. Contenedor de navegación */}
        <Stack.Navigator>        {/* 3. Navegador tipo pila */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
          />
          <Stack.Screen 
            name="CountryDetail" 
            component={CountryDetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

### Componentes Explicados

1. **SafeAreaProvider**: Debe envolver toda la app para que SafeAreaView funcione
2. **NavigationContainer**: Gestiona el estado de navegación
3. **Stack.Navigator**: Define el tipo de navegación (pila)
4. **Stack.Screen**: Cada pantalla de la app

### Navegación Entre Pantallas

#### Ir a otra pantalla (Pasar datos)

En `HomeScreen.js`:

```javascript
const handleCountryPress = (countryName) => {
  // navigation.navigate('NombreDePantalla', { parametros })
  navigation.navigate('CountryDetail', { countryName });
};
```

**¿Qué hace esto?**
- `navigation`: Objeto que React Navigation inyecta automáticamente
- `'CountryDetail'`: Nombre de la pantalla destino (debe coincidir con `<Stack.Screen name="CountryDetail">`)
- `{ countryName }`: Parámetros que se envían (como argumentos de una función)

#### Recibir datos en la pantalla destino

En `CountryDetailScreen.js`:

```javascript
export default function CountryDetailScreen({ route }) {
  const { countryName } = route.params;
  // Ahora puedes usar countryName
}
```

**¿Qué hace esto?**
- `route`: Objeto con información de la ruta actual
- `route.params`: Los parámetros que se pasaron desde la pantalla anterior
- `{ countryName }`: Desestructuración para extraer el valor

#### Regresar a la pantalla anterior

React Navigation agrega automáticamente un **botón de retroceso** en el header cuando `headerShown: true`.

Si quisieras hacerlo programáticamente:
```javascript
navigation.goBack();
```

---

## 🔧 Componentes Creados

### 1. HomeScreen.js

**Responsabilidad**: Mostrar la lista de países

**Características clave:**

```javascript
export default function HomeScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      const countries = await fecthCountries();
      setCountries(countries);
      setLoading(false);
    };
    loadCountries();
  }, []);

  return (
    <View>
      <Header />
      <ScrollView>
        {countries.map((country, index) => (
          <TouchableOpacity onPress={() => handleCountryPress(country.name.common)}>
            {/* Contenido del país */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
```

**Conceptos importantes:**

- **`{ navigation }`**: Props que React Navigation pasa automáticamente
- **`TouchableOpacity`**: Componente que detecta toques (como un botón invisible)
  - `onPress`: Se ejecuta cuando el usuario toca
  - `activeOpacity={0.7}`: Opacidad al tocar (efecto visual)
- **`state` (useState)**: Variables que React "observa" y re-renderiza cuando cambian
- **`useEffect`**: Se ejecuta cuando el componente se monta (como componentDidMount en clases)

**¿Por qué TouchableOpacity?**

```javascript
// ❌ Esto NO funciona:
<View onPress={...}>  // View no detecta toques

// ✅ Esto SÍ funciona:
<TouchableOpacity onPress={...}>  // TouchableOpacity sí detecta toques
```

### 2. CountryDetailScreen.js

**Responsabilidad**: Mostrar detalles completos de un país

**Características clave:**

```javascript
export default function CountryDetailScreen({ route }) {
  const { countryName } = route.params;  // Recibe el nombre del país
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountryDetails = async () => {
      const countryData = await fetchCountryByName(countryName);
      setCountry(countryData);
      setLoading(false);
    };
    loadCountryDetails();
  }, [countryName]);

  // Renderiza detalles del país
}
```

**Funciones helper:**

```javascript
// Formatear población con separadores de miles
const formatPopulation = (population) => {
  return population.toLocaleString('es-ES');  // 1000000 → 1.000.000
};

// Extraer monedas del objeto
const getCurrencies = (currencies) => {
  return Object.values(currencies)
    .map(curr => `${curr.symbol} - ${curr.name}`)  // Mapea cada moneda
    .join(', ');  // Une con comas
};

// Abrir mapa en el navegador
const openMap = () => {
  Linking.openURL(country.maps.googleMaps);
};
```

**¿Qué es Linking?**

`Linking` es una API de React Native para interactuar con enlaces externos:
- Abrir URLs en el navegador
- Abrir otras apps (teléfono, email, etc.)
- Recibir deep links

---

## 🌐 API y Fetch

### Función Original: fecthCountries()

```javascript
const fecthCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/region/euro?fields=name,flags');
  const data = await response.json();
  return data;
}
```

**¿Qué hace?**
1. Consulta la API de países europeos
2. Solo pide campos `name` y `flags` (optimización)
3. Convierte la respuesta a JSON
4. Retorna un array de países

### Nueva Función: fetchCountryByName()

```javascript
const fetchCountryByName = async (countryName) => {
  const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
  const data = await response.json();
  return data[0];  // La API devuelve un array, tomamos el primero
}
```

**¿Por qué `encodeURIComponent`?**

Convierte caracteres especiales para URLs:
```javascript
// Sin encode:
"Côte d'Ivoire" → https://...name/Côte d'Ivoire ❌ (espacios y acentos rompen la URL)

// Con encode:
encodeURIComponent("Côte d'Ivoire") → "C%C3%B4te%20d'Ivoire" ✅
```

### async/await Explicado

```javascript
// ❌ Forma antigua (callbacks):
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// ✅ Forma moderna (async/await):
const loadData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

**Ventajas:**
- Código más limpio y legible
- Se lee como código síncrono
- Manejo de errores con try/catch

---

## 🎨 Estilos y Diseño

### Principios de Diseño Aplicados

#### 1. **Cards (Tarjetas)**

Las cards son contenedores visuales que agrupan información:

```javascript
const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,           // Esquinas redondeadas
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',        // Sombra para dar profundidad
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,               // Sombra en Android
  },
});
```

**¿Por qué usar cards?**
- Agrupan información relacionada
- Crean jerarquía visual
- Indican que el contenido es interactivo
- Se ven modernas y profesionales

#### 2. **Sombras (Shadows)**

Las sombras dan sensación de **profundidad** y **elevación**:

```javascript
// iOS
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,

// Android
elevation: 3,
```

**Regla general:**
- Elevation 1-2: Elementos sutiles
- Elevation 3-5: Elementos importantes (botones, cards)
- Elevation 6+: Modals, menús flotantes

#### 3. **Espaciado y Padding**

```javascript
padding: 16,           // Espacio interno (dentro del elemento)
margin: 12,            // Espacio externo (entre elementos)
marginBottom: 12,      // Solo abajo
paddingHorizontal: 20, // Solo izquierda y derecha
```

**Regla de 8px:**
Usa múltiplos de 8 para espaciado: 8, 16, 24, 32...
- Crea consistencia visual
- Facilita alineación
- Estándar en diseño móvil

#### 4. **Colores**

```javascript
const COLORS = {
  primary: '#4A90E2',      // Azul principal
  background: '#f5f5f5',   // Gris claro de fondo
  cardBg: '#ffffff',       // Blanco para cards
  text: '#333',            // Texto oscuro
  textSecondary: '#666',   // Texto secundario
  border: '#e0e0e0',       // Bordes sutiles
};
```

**Jerarquía de colores:**
- Texto principal: Oscuro (#333)
- Texto secundario: Gris (#666, #999)
- Fondo: Blanco o gris muy claro
- Acento: Un color vibrante (#4A90E2)

#### 5. **Tipografía**

```javascript
// Título principal
fontSize: 28,
fontWeight: '700',  // Bold

// Subtítulo
fontSize: 16,
fontWeight: '500',  // Medium

// Cuerpo
fontSize: 14,
fontWeight: '400',  // Regular

// Labels
fontSize: 12,
fontWeight: '600',
textTransform: 'uppercase',
letterSpacing: 0.5,
```

**fontWeight en React Native:**
- '400' = Regular
- '500' = Medium
- '600' = Semi-bold
- '700' = Bold

### Componentes Estilizados

#### TouchableOpacity con Feedback Visual

```javascript
<TouchableOpacity 
  style={styles.countryCard}
  onPress={handlePress}
  activeOpacity={0.7}  // Se vuelve 70% opaco al tocar
>
```

#### ScrollView con Padding

```javascript
<ScrollView 
  style={styles.scrollView}              // height, width
  contentContainerStyle={styles.content}  // padding, alignItems del contenido
>
```

**Diferencia:**
- `style`: Afecta al ScrollView (contenedor)
- `contentContainerStyle`: Afecta al contenido dentro

---

## 📁 Nueva Estructura del Proyecto

```
app_countries/
├── App.js                          ← Configuración de navegación
├── package.json                    ← Dependencias actualizadas
├── example_country.js              ← Ejemplo de datos (referencia)
├── assets/
│   ├── iconoApp.png
│   └── flags/
├── components/
│   ├── Header.js                   ← Header con SafeAreaView ✨
│   ├── HomeScreen.js               ← Pantalla principal (lista) ✨ NUEVO
│   └── CountryDetailScreen.js      ← Pantalla de detalles ✨ NUEVO
└── lib/
    └── countryApiCosumer.js        ← Funciones API (mejorado) ✨
```

### Archivos Modificados

1. **App.js** (Reescrito completamente)
   - Ahora solo configura navegación
   - No tiene lógica de negocio

2. **Header.js** (Actualizado)
   - Agregado SafeAreaView
   - Corrige problema de notch

3. **lib/countryApiCosumer.js** (Mejorado)
   - Agregada función `fetchCountryByName()`
   - Manejo de errores mejorado

### Archivos Nuevos

1. **components/HomeScreen.js**
   - Extrae lógica de App.js
   - Lista de países clickeables
   - Mejores estilos (cards)

2. **components/CountryDetailScreen.js**
   - Pantalla nueva desde cero
   - Muestra todos los detalles del país
   - Diseño atractivo con cards y emojis

---

## 🔄 Flujo de la Aplicación

### 1. **Usuario abre la app**

```
App.js (NavigationContainer)
    ↓
SafeAreaProvider envuelve todo
    ↓
Stack.Navigator decide qué pantalla mostrar
    ↓
HomeScreen (pantalla inicial)
```

### 2. **HomeScreen carga países**

```
HomeScreen monta (useEffect se ejecuta)
    ↓
llama a fecthCountries()
    ↓
Fetch a API: https://restcountries.com/v3.1/region/euro?fields=name,flags
    ↓
setCountries(data) actualiza el estado
    ↓
React re-renderiza y muestra la lista
```

### 3. **Usuario toca un país**

```
Usuario toca TouchableOpacity
    ↓
onPress={handleCountryPress} se ejecuta
    ↓
navigation.navigate('CountryDetail', { countryName: 'Spain' })
    ↓
Stack.Navigator agrega CountryDetail encima de Home
    ↓
Animación de transición (slide_from_right)
```

### 4. **CountryDetailScreen carga detalles**

```
CountryDetailScreen monta
    ↓
Extrae countryName de route.params
    ↓
useEffect se ejecuta
    ↓
llama a fetchCountryByName(countryName)
    ↓
Fetch a API: https://restcountries.com/v3.1/name/Spain
    ↓
setCountry(data[0]) actualiza el estado
    ↓
React re-renderiza y muestra detalles
```

### 5. **Usuario presiona botón atrás**

```
Usuario presiona botón ← del header
    ↓
Stack.Navigator quita CountryDetail de la pila
    ↓
Vuelve a mostrar HomeScreen (que se mantuvo en memoria)
```

---

## 🎓 Conceptos Clave para Aprender

### 1. **Estado (State) en React**

El estado son variables que React "observa":

```javascript
const [countries, setCountries] = useState([]);

// Leer:
console.log(countries);

// Actualizar (React re-renderiza automáticamente):
setCountries(newData);
```

**Regla importante:** Nunca modifiques el estado directamente:
```javascript
// ❌ MAL:
countries.push(newCountry);

// ✅ BIEN:
setCountries([...countries, newCountry]);
```

### 2. **Props (Propiedades)**

Props son datos que se pasan de componente padre a hijo:

```javascript
// Padre:
<Header title="Countries App" />

// Hijo (Header.js):
function Header({ title }) {
  return <Text>{title}</Text>;
}
```

**Props especiales de React Navigation:**
- `navigation`: Objeto con métodos para navegar
- `route`: Información de la ruta actual (params, name, etc.)

### 3. **useEffect**

Se ejecuta después del render:

```javascript
useEffect(() => {
  // Código que se ejecuta
}, [dependencies]);
```

**Casos comunes:**

```javascript
// Se ejecuta solo una vez (al montar):
useEffect(() => {
  fetchData();
}, []);

// Se ejecuta cada vez que "count" cambia:
useEffect(() => {
  console.log(count);
}, [count]);

// Se ejecuta en cada render (evitar):
useEffect(() => {
  console.log('Render');
});
```

### 4. **Componentes Funcionales vs Clases**

Esta app usa **componentes funcionales** (moderno):

```javascript
// ✅ Componente funcional (moderno):
export default function HomeScreen({ navigation }) {
  const [state, setState] = useState();
  return <View />;
}

// ❌ Componente de clase (antiguo):
class HomeScreen extends React.Component {
  constructor() {
    this.state = {};
  }
  render() {
    return <View />;
  }
}
```

**Ventajas de funcionales:**
- Menos código
- Hooks (useState, useEffect, etc.)
- Más fáciles de testear

---

## 🚀 Próximos Pasos Sugeridos

Ahora que entiendes la base, puedes agregar:

### 1. **Búsqueda de Países**
```javascript
const [searchQuery, setSearchQuery] = useState('');
const filteredCountries = countries.filter(c => 
  c.name.common.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### 2. **Favoritos**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveFavorite = async (country) => {
  await AsyncStorage.setItem(`favorite_${country.cca2}`, JSON.stringify(country));
};
```

### 3. **Caché de Datos**
```javascript
const [cache, setCache] = useState({});

const fetchWithCache = async (countryName) => {
  if (cache[countryName]) {
    return cache[countryName];  // Devuelve del caché
  }
  const data = await fetchCountryByName(countryName);
  setCache({ ...cache, [countryName]: data });  // Guarda en caché
  return data;
};
```

### 4. **Animaciones**
```javascript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500,
}).start();
```

### 5. **Tab Navigation**
```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Countries" component={HomeScreen} />
  <Tab.Screen name="Favorites" component={FavoritesScreen} />
</Tab.Navigator>
```

---

## 📚 Recursos para Seguir Aprendiendo

### Documentación Oficial

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)

### Tutoriales Recomendados

- **React Native Express**: https://www.reactnative.express/
- **React Native School**: https://www.reactnativeschool.com/
- **FreeCodeCamp React Native**: https://www.youtube.com/watch?v=0-S5a0eXPoc

### Conceptos para Profundizar

1. **Hooks**: useState, useEffect, useCallback, useMemo
2. **Context API**: Para estado global
3. **Redux/Zustand**: Gestión de estado más compleja
4. **React Query**: Manejo avanzado de datos API
5. **Testing**: Jest, React Native Testing Library
6. **TypeScript**: Tipado estático para prevenir errores

---

## ✅ Verificación de Funcionamiento

### Checklist

- [ ] La app inicia sin errores
- [ ] El header se ve completo (no cortado por la cámara)
- [ ] Se muestra la lista de países europeos
- [ ] Al tocar un país, navega a la pantalla de detalles
- [ ] La pantalla de detalles muestra: bandera, nombre, capital, población, moneda, idiomas, zona horaria
- [ ] El botón "Ver en el mapa" abre el navegador
- [ ] El botón de retroceso regresa a la lista
- [ ] Los estilos se ven bien (cards con sombras, buen espaciado)

### Comandos para Probar

```bash
# Iniciar la app
npm start

# Limpiar caché si hay problemas
npx expo start --clear

# Ver logs en tiempo real
npx expo start --dev-client
```

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Cannot read property 'navigate' of undefined"

**Causa:** El componente no está siendo renderizado por React Navigation.

**Solución:** Asegúrate de que el componente esté dentro de `<Stack.Screen>` en App.js.

### Error: "SafeAreaProvider not found"

**Causa:** Falta envolver la app con `<SafeAreaProvider>`.

**Solución:** Asegúrate de que App.js tenga:
```javascript
<SafeAreaProvider>
  <NavigationContainer>
    {/* resto del código */}
  </NavigationContainer>
</SafeAreaProvider>
```

### Las sombras no se ven en Android

**Causa:** Android no usa las props de shadow de iOS.

**Solución:** Usa `elevation`:
```javascript
elevation: 3,  // Solo para Android
```

### La imagen de la bandera no se carga

**Causa:** URL inválida o problema de red.

**Solución:** Verifica que `country.flags.png` exista y muestra un placeholder:
```javascript
<Image 
  source={{ uri: country.flags.png }}
  defaultSource={require('../assets/placeholder.png')}
/>
```

---

## 🎉 Conclusión

¡Felicidades! Has implementado:

✅ Navegación entre pantallas con React Navigation  
✅ Paso de parámetros entre componentes  
✅ Consultas a API REST con fetch  
✅ Manejo de estado con useState  
✅ Efectos secundarios con useEffect  
✅ Diseño moderno con cards y sombras  
✅ Corrección del problema del notch con SafeAreaView  
✅ Componentes reutilizables y organizados  

**Continúa practicando y experimentando. ¡El mejor momento para aprender es ahora!** 🚀

---

_Documento creado el 7 de marzo de 2026_  
_Versión de la app: 1.0.0_
