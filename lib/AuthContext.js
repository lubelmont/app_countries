import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "../config/fb";
import { collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoreAuth();
    }, []);


    const loadStoreAuth = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error loading stored user:", error);
        } finally {
            setLoading(false);
        }
    };


    const signIn = async (username, password) => {
        try {
            // Consultar Firestore para buscar el usuario por email
            const usersRef = collection(database, "users");
            const q = query(usersRef, where("email", "==", username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { success: false, message: "Usuario no encontrado" };
            }

            // Obtener el primer documento encontrado
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Verificar la contraseña
            if (userData.password !== password) {
                return { success: false, message: "Contraseña incorrecta" };
            }

            // Preparar los datos del usuario para guardar
            const userToStore = {
                id: userDoc.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
            };

            // Guardar en AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(userToStore));
            setUser(userToStore);
            
            return { success: true };

        } catch (error) {
            console.error("Error en signIn:", error);
            return { 
                success: false, 
                message: "Error al iniciar sesión. Por favor, intenta de nuevo." 
            };
        }
    };


    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem("user");
    };

    return (

        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext);