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
import { useAuth } from '../context/AuthContext';
import {router } from 'expo-router';
export default function RegisterScreen() {
    const { register, isLoading, storageError } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () => {
        setError('');
        setSuccess('');
        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            await register(username.trim(), email.trim(), password);
            setSuccess('Your account has been created.');
            router.replace('./profile');
        } catch (registrationError) {
            setError(
                registrationError instanceof Error
                    ? registrationError.message
                    : 'Unable to create your account. Please try again.',
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
                    <Text style={styles.eyebrow}>GET STARTED</Text>
                    <Text style={styles.title}>Create your account</Text>
                    <Text style={styles.subtitle}>Sign up to continue.</Text>

                    <View style={styles.fields}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                accessibilityLabel="Username"
                                autoCapitalize="words"
                                onChangeText={setUsername}
                                placeholder="Your name"
                                placeholderTextColor="#8A94A6"
                                style={styles.input}
                                value={username}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                accessibilityLabel="Email"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                placeholderTextColor="#8A94A6"
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
                                placeholder="At least 6 characters"
                                placeholderTextColor="#8A94A6"
                                secureTextEntry
                                style={styles.input}
                                value={password}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Confirm password</Text>
                            <TextInput
                                accessibilityLabel="Confirm password"
                                autoCapitalize="none"
                                onChangeText={setConfirmPassword}
                                onSubmitEditing={handleRegister}
                                placeholder="Enter your password again"
                                placeholderTextColor="#8A94A6"
                                returnKeyType="done"
                                secureTextEntry
                                style={styles.input}
                                value={confirmPassword}
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
                    {success ? <Text style={styles.success}>{success}</Text> : null}

                    <Pressable
                        accessibilityRole="button"
                        disabled={isLoading}
                        onPress={handleRegister}
                        style={({ pressed }) => [
                            styles.submitButton,
                            pressed && styles.submitButtonPressed,
                            isLoading && styles.submitButtonDisabled,
                        ]}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Loading accounts...' : 'Create account'}
                        </Text>
                    </Pressable>
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
    success: {
        color: '#18794E',
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
});