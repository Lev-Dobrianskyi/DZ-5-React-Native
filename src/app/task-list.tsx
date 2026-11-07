import { Redirect, router } from 'expo-router';
import {
    Button,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import type { Task } from '../types/Task';

const tasks: Task[] = [
    {
        name: 'Plan the week',
        description: 'Review priorities and map out the week ahead.',
    },
    {
        name: 'Organize your workspace',
        description: 'Tidy up your desk and keep the essentials close by.',
    },
    {
        name: 'Review project notes',
        description: 'Catch up on the latest notes and project updates.',
    },
    {
        name: 'Take a short break',
        description: 'Step away from your screen and recharge for a few minutes.',
    },
    {
        name: 'Prepare for tomorrow',
        description: 'Write down what needs your attention next.',
    },
];

export default function TaskListScreen() {
    const { currentUser, isLoading, logout, storageError } = useAuth();
    if (!currentUser) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                { isLoading ? <Text>Data is loading...</Text> : storageError ? <Text>Storage error</Text> : <Text>Unknown error</Text>}
                <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push('/')}
                    style={({ pressed }) => [
                        styles.profileButton,
                        pressed && styles.profileButtonPressed,
                    ]}
                >
                    <Text style={styles.profileButtonText}>Go back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            style={styles.screen}
        >
            <View style={styles.container}>
                <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
                <Text style={styles.title}>Task list</Text>
                <Text style={styles.subtitle}>A few things to get you started.</Text>

                <View style={styles.taskList}>
                    {tasks.map((task, index) => (
                        <View key={task.name} style={styles.card}>
                            <Text style={styles.cardNumber}>
                                {String(index + 1).padStart(2, '0')}
                            </Text>
                            <Text style={styles.cardTitle}>{task.name}</Text>
                            <Text style={styles.cardDescription}>
                                {task.description}
                            </Text>
                        </View>
                    ))}
                </View>

                <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push('/profile')}
                    style={({ pressed }) => [
                        styles.profileButton,
                        pressed && styles.profileButtonPressed,
                    ]}
                >
                    <Text style={styles.profileButtonText}>Go to profile</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F6F8FC',
    },
    content: {
        flexGrow: 1,
        padding: 24,
    },
    container: {
        alignSelf: 'center',
        maxWidth: 620,
        paddingVertical: 24,
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
        fontSize: 30,
        fontWeight: '700',
    },
    subtitle: {
        color: '#65718A',
        fontSize: 15,
        marginTop: 8,
    },
    taskList: {
        gap: 14,
        marginTop: 28,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5EAF2',
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
    },
    cardNumber: {
        color: '#356AE6',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 10,
    },
    cardTitle: {
        color: '#172033',
        fontSize: 18,
        fontWeight: '700',
    },
    cardDescription: {
        color: '#65718A',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 6,
    },
    profileButton: {
        alignItems: 'center',
        backgroundColor: '#356AE6',
        borderRadius: 10,
        justifyContent: 'center',
        marginTop: 24,
        minHeight: 52,
    },
    profileButtonPressed: {
        opacity: 0.85,
    },
    profileButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
