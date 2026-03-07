import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import { fecthCountries } from './lib/countryApiCosumer';





export default function App() {

  const [countries, setCountries] = useState([]);


  useEffect(
    //lo que se ejecuta al montar el componente
    () => {

      const loadcountries = async () => {
        const countries = await fecthCountries();
        setCountries(countries);
      }

      loadcountries();

    },


    [

      //Dependencias del useEffect, se ejecuta cada vez que cambie alguna de estas dependencias

    ]);




  return (
    <View style={styles.container}>


      <Header />
      <ScrollView>
        {countries.map((country, index) => (
          <View key={index}><Image
            source={{ uri: country.flags.png }}
            style={{
              width: 200,
              height: 100,
              resizeMode: 'contain',
            }}
          />
            <Text style={styles.countryNameCommon}>{country.name.common}</Text>
            <Text style={styles.countryNameOfficial}>{country.name.official} </Text>
          </View>
        ))}


      </ScrollView>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerApp: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headderAppIcopn: {
    width: 100,
    height: 100,
    marginBottom: 20,
    top: 10,
  },

  countryNameCommon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  countryNameOfficial: {
    fontSize: 16,
    color: 'gray',
  },



});
