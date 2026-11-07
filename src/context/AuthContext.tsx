import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { User } from '../types/User';

type AuthContextType = {
    users: User[];

    currentUser: User | null;

    isLoading: boolean;
    storageError: string;

    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USERS_STORAGE_KEY = 'authdemo-users';
const SESSION_STORAGE_KEY = 'authdemo-session';

type AuthProviderProps = {
    children: ReactNode;
};

function isUser(value: unknown): value is User {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        typeof value.id === 'string' &&
        'name' in value &&
        typeof value.name === 'string' &&
        'email' in value &&
        typeof value.email === 'string' &&
        'password' in value &&
        typeof value.password === 'string'
    );
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [storageError, setStorageError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            try {
                const [storedUsers, storedSessionId] = await Promise.all([
                    AsyncStorage.getItem(USERS_STORAGE_KEY),
                    AsyncStorage.getItem(SESSION_STORAGE_KEY),
                ]);
                let loadedUsers: User[] = [];
                if (storedUsers) {
                    const parsedUsers: unknown = JSON.parse(storedUsers);
                    if (!Array.isArray(parsedUsers) || !parsedUsers.every(isUser)) {
                        throw new Error('Saved account data is invalid.');
                    }
                    loadedUsers = parsedUsers;
                }
                const loggedInUser = storedSessionId
                    ? loadedUsers.find((user) => user.id === storedSessionId)
                    : null;
                if (storedSessionId && !loggedInUser) {
                    throw new Error('Saved session does not match an account.');
                }
                if (isMounted) {
                    setUsers(loadedUsers);
                    setCurrentUser(loggedInUser ?? null);
                }
            } catch (error) {
                if (isMounted) {
                    setStorageError(
                        error instanceof Error
                            ? `Unable to load saved accounts: ${error.message}`
                            : 'Unable to load saved accounts.',
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    const register = async (username: string, email: string, password: string) => {
        if (isLoading) {
            throw new Error('Please wait while saved accounts are loading.');
        }
        if (storageError) {
            throw new Error(storageError);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = users.find(
            (user) => user.email.toLowerCase() === normalizedEmail,
        );
        if (existingUser) {
            throw new Error('User already exists');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        const newUser: User = {
            id: Date.now().toString(),
            name: username,
            email: normalizedEmail,
            password,
        };
        const updatedUsers = [...users, newUser];
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, newUser.id);
        setCurrentUser(newUser);
    };

    const login = async (email: string, password: string) => {
        if (isLoading) {
            throw new Error('Please wait while saved accounts are loading.');
        }
        if (storageError) {
            throw new Error(storageError);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find(
            (savedUser) =>
                savedUser.email.toLowerCase() === normalizedEmail &&
                savedUser.password === password,
        );
        if (!user) {
            throw new Error('Invalid email or password');
        }
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, user.id);
        setCurrentUser(user);
    };

    const logout = async () => {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                users,
                currentUser,
                isLoading,
                storageError,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}