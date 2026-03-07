import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fecthCountries } from '../lib/countryApiCosumer';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';

export default function HomeScreen() {
    const router = useRouter();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('euro');

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countries = await fecthCountries(selectedRegion);

                const sortedCountries = countries.sort((a, b) =>
                    a.name.common.localeCompare(b.name.common, 'es')
                );

                setCountries(sortedCountries);
            } catch (error) {
                console.error('Error loading countries:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCountries();
    }, [selectedRegion]);

    const handleCountryPress = (countryName) => {
        // Usar router.push en lugar de navigation.navigate
        router.push(`/country/${encodeURIComponent(countryName)}`);
        //console.log('Navegando a detalles de:', countryName);
        //router.push(`/country/mexico`);
    };

    const handleRegionChange = (region) => {
        setSelectedRegion(region);
        setLoading(true);
    };

    const renderCountryItem = ({ item: country }) => (
        <TouchableOpacity
            style={styles.countryCard}
            onPress={() => handleCountryPress(country.name.common)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Image
                    source={{ uri: country.flags.png }}
                    style={styles.flagImage}
                />
                <View style={styles.countryInfo}>
                    <Text style={styles.countryNameCommon}>{country.name.common}</Text>
                    <Text style={styles.countryNameOfficial}>{country.name.official}</Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.loadingText}>Cargando países...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            
            <RegionSelector 
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
            />

            <FlatList
                data={countries}
                renderItem={renderCountryItem}
                keyExtractor={(item, index) => item.cca2 || index.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    countryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    flagImage: {
        width: 80,
        height: 50,
        borderRadius: 4,
        resizeMode: 'cover',
    },
    countryInfo: {
        flex: 1,
        marginLeft: 16,
    },
    countryNameCommon: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    countryNameOfficial: {
        fontSize: 14,
        color: '#666',
    },
    arrowIcon: {
        fontSize: 32,
        color: '#4A90E2',
        fontWeight: '300',
    },
});
