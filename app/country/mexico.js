import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchCountryByName } from '../../lib/countryApiCosumer';

export default function CountryDetailScreen() {
  // En Expo Router, usamos useLocalSearchParams para obtener los parámetros de la ruta
  const { name } = useLocalSearchParams();
  const countryName = decodeURIComponent(name);
  
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCountryDetails = async () => {
      try {
        setLoading(true);
        const countryData = await fetchCountryByName(countryName);
        setCountry(countryData);
        setError(false);
      } catch (err) {
        console.error('Error loading country details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadCountryDetails();
  }, [countryName]);

  const formatPopulation = (population) => {
    if (!population) return 'N/A';
    return population.toLocaleString('es-ES');
  };

  const getCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(curr => `${curr.symbol} - ${curr.name}`)
      .join(', ');
  };

  const getLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  const getTimezones = (timezones) => {
    if (!timezones || timezones.length === 0) return 'N/A';
    return timezones.slice(0, 3).join(', ') + (timezones.length > 3 ? '...' : '');
  };

  const openMap = () => {
    if (country && country.maps && country.maps.googleMaps) {
      Linking.openURL(country.maps.googleMaps);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !country) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>No se pudo cargar la información</Text>
        <Text style={styles.errorSubtext}>Intenta nuevamente más tarde</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Bandera grande */}
      <View style={styles.flagContainer}>
        <Image
          source={{ uri: country.flags.png }}
          style={styles.flagImage}
        />
        {country.flags.alt && (
          <Text style={styles.flagDescription}>{country.flags.alt}</Text>
        )}
      </View>

      {/* Nombre del país */}
      <View style={styles.titleContainer}>
        <Text style={styles.countryFlag}>{country.flag}</Text>
        <Text style={styles.countryName}>{country.name.common}</Text>
        <Text style={styles.officialName}>{country.name.official}</Text>
      </View>

      {/* Cards con información */}
      <View style={styles.cardsContainer}>
        {/* Capital */}
        {country.capital && country.capital.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardEmoji}>🏛️</Text>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardLabel}>Capital</Text>
              <Text style={styles.cardValue}>{country.capital[0]}</Text>
            </View>
          </View>
        )}

        {/* Población */}
        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>👥</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Población</Text>
            <Text style={styles.cardValue}>{formatPopulation(country.population)} habitantes</Text>
          </View>
        </View>

        {/* Moneda */}
        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>💰</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Moneda</Text>
            <Text style={styles.cardValue}>{getCurrencies(country.currencies)}</Text>
          </View>
        </View>

        {/* Idiomas */}
        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>🗣️</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Idiomas</Text>
            <Text style={styles.cardValue}>{getLanguages(country.languages)}</Text>
          </View>
        </View>

        {/* Región */}
        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>🌍</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Región</Text>
            <Text style={styles.cardValue}>
              {country.region}{country.subregion ? ` - ${country.subregion}` : ''}
            </Text>
          </View>
        </View>

        {/* Zona horaria */}
        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>🕐</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Zona Horaria</Text>
            <Text style={styles.cardValue}>{getTimezones(country.timezones)}</Text>
          </View>
        </View>
      </View>

      {/* Botón de mapa */}
      {country.maps && country.maps.googleMaps && (
        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <Text style={styles.mapButtonIcon}>🗺️</Text>
          <Text style={styles.mapButtonText}>Ver en el mapa</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
  },
  flagContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagImage: {
    width: 300,
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  flagDescription: {
    marginTop: 12,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  titleContainer: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryFlag: {
    fontSize: 48,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  officialName: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardsContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  mapButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  mapButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
});
