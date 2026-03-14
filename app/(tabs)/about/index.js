import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const openURL = (url) => {
        Linking.openURL(url);
    };

    const handleSignOut = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="globe" size={80} color="#4A90E2" />
                    <Text style={styles.appName}>Countries App</Text>
                    <Text style={styles.version}>Versión 1.0.0</Text>
                </View>

                {/* Descripción */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Acerca de</Text>
                    <Text style={styles.description}>
                        Aplicación móvil para explorar información sobre países de diferentes regiones del mundo. 
                        Navega por continentes y descubre datos interesantes de cada nación.
                    </Text>
                </View>

                {/* Características */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Características</Text>
                    
                    <View style={styles.feature}>
                        <Ionicons name="search" size={24} color="#4A90E2" />
                        <Text style={styles.featureText}>Búsqueda por región geográfica</Text>
                    </View>

                    <View style={styles.feature}>
                        <Ionicons name="flag" size={24} color="#4A90E2" />
                        <Text style={styles.featureText}>Visualización de banderas nacionales</Text>
                    </View>

                    <View style={styles.feature}>
                        <Ionicons name="information-circle" size={24} color="#4A90E2" />
                        <Text style={styles.featureText}>Detalles completos de cada país</Text>
                    </View>

                    <View style={styles.feature}>
                        <Ionicons name="color-palette" size={24} color="#4A90E2" />
                        <Text style={styles.featureText}>Interfaz moderna y amigable</Text>
                    </View>
                </View>

                {/* Tecnologías */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tecnologías</Text>
                    
                    <View style={styles.tech}>
                        <Text style={styles.techItem}>• React Native</Text>
                        <Text style={styles.techItem}>• Expo SDK 55</Text>
                        <Text style={styles.techItem}>• Expo Router</Text>
                        <Text style={styles.techItem}>• REST Countries API</Text>
                    </View>
                </View>

                {/* API */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fuente de Datos</Text>
                    <Text style={styles.description}>
                        Los datos se obtienen de REST Countries API, una fuente confiable y actualizada de información sobre países.
                    </Text>
                    <Text 
                        style={styles.link}
                        onPress={() => openURL('https://restcountries.com')}
                    >
                        restcountries.com
                    </Text>
                </View>@

                {/* Usuario y Cerrar Sesión */}
                {user && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sesión</Text>
                        <View style={styles.userInfo}>
                            <Ionicons name="person-circle" size={40} color="#4A90E2" />
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userUsername}>{user.email}</Text>
                                {user.role && (
                                    <Text style={styles.userRole}>{user.role}</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.signOutButton}
                            onPress={handleSignOut}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#fff" />
                            <Text style={styles.signOutText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Desarrollado con ❤️</Text>
                    <Text style={styles.footerText}>© 2026 Countries App</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    version: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    tech: {
        paddingLeft: 8,
    },
    techItem: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        lineHeight: 24,
    },
    link: {
        fontSize: 16,
        color: '#4A90E2',
        marginTop: 8,
        textDecorationLine: 'underline',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    userDetails: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    userUsername: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    userRole: {
        fontSize: 12,
        color: '#4A90E2',
        marginTop: 4,
        fontWeight: '500',
    },
    signOutButton: {
        backgroundColor: '#ff3b30',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
