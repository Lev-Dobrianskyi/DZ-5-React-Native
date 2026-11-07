import {router} from "expo-router";
import { View, Text, Button } from "react-native";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';


export default function ProfileScreen() {
    const { currentUser, isLoading, logout, storageError } = useAuth();
    const [logoutError, setLogoutError] = useState('');

    const hendleLogout = async () => {
        setLogoutError('');
        try {
            await logout();
        } catch (error) {
            setLogoutError(
                error instanceof Error ? error.message : 'Unable to log out.',
            );
            return;
        }
        router.replace('/');
    }
    return (
        <View>
            <Text>
                {isLoading
                    ? 'Loading account...'
                    : currentUser
                      ? `Email: ${currentUser.email}`
                      : 'You are not logged in'}
            </Text>
            {storageError ? <Text accessibilityRole="alert">{storageError}</Text> : null}
            {logoutError ? <Text accessibilityRole="alert">{logoutError}</Text> : null}
            <Text>Welcome</Text>
            <Button title ="Logout" onPress ={hendleLogout}></Button>
        </View>
    );

}