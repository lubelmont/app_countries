import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegionSelector({ selectedRegion, onRegionChange }) {
    const regions = [
        { 
            label: 'Europa', 
            value: 'euro',
            IconComponent: Ionicons,
            iconName: 'barbell',
        },
        { 
            label: 'América', 
            value: 'americas',
            IconComponent: Ionicons,
            iconName: 'earth',
        },
        { 
            label: 'Asia', 
            value: 'asia',
            IconComponent: MaterialCommunityIcons,
            iconName: 'temple-buddhist',
        },
        { 
            label: 'África', 
            value: 'africa',
            IconComponent: MaterialCommunityIcons,
            iconName: 'elephant',
        },
        { 
            label: 'Oceanía', 
            value: 'oceania',
            IconComponent: MaterialCommunityIcons,
            iconName: 'palm-tree',
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.regionsContainer}
            >
                {regions.map((region) => {
                    const isActive = selectedRegion === region.value;
                    const IconComponent = region.IconComponent;
                    
                    return (
                        <TouchableOpacity
                            key={region.value}
                            style={styles.regionButton}
                            onPress={() => onRegionChange(region.value)}
                            activeOpacity={0.7}
                        >
                            {/* Ícono */}
                            <View style={[
                                styles.iconContainer,
                                isActive && styles.iconContainerActive
                            ]}>
                                <IconComponent
                                    name={region.iconName}
                                    size={24}
                                    color={isActive ? '#4A90E2' : '#999'}
                                />
                            </View>
                            
                            {/* Label */}
                            <Text style={[
                                styles.regionButtonText,
                                isActive && styles.regionButtonTextActive
                            ]}>
                                {region.label}
                            </Text>
                            
                            {/* Indicador activo (línea inferior) */}
                            {isActive && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    regionsContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    regionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 4,
        minWidth: 80,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        marginBottom: 4,
    },
    iconContainerActive: {
        backgroundColor: '#E3F2FD',
    },
    regionButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#999',
        marginTop: 4,
    },
    regionButtonTextActive: {
        color: '#4A90E2',
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '20%',
        height: 3,
        backgroundColor: '#4A90E2',
        borderRadius: 2,
    },
});