import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const { login, isLoading, storageError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        const normalizedEmail = email.trim();
        if (!normalizedEmail || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            await login(normalizedEmail, password);
            router.replace('./profile');
        } catch (loginError) {
            setError(
                loginError instanceof Error
                    ? loginError.message
                    : 'Unable to log in. Please try again.',
            );
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.screen}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.form}>
                    <Text style={styles.eyebrow}>AUTHDEMO</Text>
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.subtitle}>Sign in to your account.</Text>

                    <View style={styles.fields}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                accessibilityLabel="Email"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={setEmail}
                                onSubmitEditing={handleLogin}
                                placeholder="you@example.com"
                                placeholderTextColor="#8A94A6"
                                returnKeyType="next"
                                style={styles.input}
                                value={email}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                accessibilityLabel="Password"
                                autoCapitalize="none"
                                onChangeText={setPassword}
                                onSubmitEditing={handleLogin}
                                placeholder="Enter your password"
                                placeholderTextColor="#8A94A6"
                                returnKeyType="done"
                                secureTextEntry
                                style={styles.input}
                                value={password}
                            />
                        </View>
                    </View>

                    {error ? (
                        <Text accessibilityRole="alert" style={styles.error}>
                            {error}
                        </Text>
                    ) : null}
                    {storageError ? (
                        <Text accessibilityRole="alert" style={styles.error}>
                            {storageError}
                        </Text>
                    ) : null}

                    <Pressable
                        accessibilityRole="button"
                        disabled={isLoading}
                        onPress={handleLogin}
                        style={({ pressed }) => [
                            styles.submitButton,
                            pressed && styles.submitButtonPressed,
                            isLoading && styles.submitButtonDisabled,
                        ]}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Loading accounts...' : 'Sign in'}
                        </Text>
                    </Pressable>

                    <View style={styles.registerPrompt}>
                        <Text style={styles.promptText}>Don&apos;t have an account?</Text>
                        <Pressable
                            accessibilityRole="link"
                            onPress={() => router.push('./register')}
                            hitSlop={8}
                        >
                            <Text style={styles.registerLink}>Create one</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    form: {
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#E5EAF2',
        borderRadius: 20,
        borderWidth: 1,
        maxWidth: 460,
        padding: 24,
        width: '100%',
    },
    eyebrow: {
        color: '#356AE6',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    title: {
        color: '#172033',
        fontSize: 28,
        fontWeight: '700',
    },
    subtitle: {
        color: '#65718A',
        fontSize: 15,
        marginTop: 8,
    },
    fields: {
        gap: 16,
        marginTop: 28,
    },
    field: {
        gap: 8,
    },
    label: {
        color: '#28344A',
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderColor: '#D9E0EB',
        borderRadius: 10,
        borderWidth: 1,
        color: '#172033',
        fontSize: 16,
        minHeight: 50,
        paddingHorizontal: 14,
    },
    error: {
        color: '#B42318',
        fontSize: 14,
        marginTop: 16,
    },
    submitButton: {
        alignItems: 'center',
        backgroundColor: '#356AE6',
        borderRadius: 10,
        justifyContent: 'center',
        marginTop: 24,
        minHeight: 52,
    },
    submitButtonPressed: {
        opacity: 0.85,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    registerPrompt: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
        marginTop: 20,
    },
    promptText: {
        color: '#65718A',
        fontSize: 14,
    },
    registerLink: {
        color: '#356AE6',
        fontSize: 14,
        fontWeight: '600',
    },
});
