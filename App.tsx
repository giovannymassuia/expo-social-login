import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { GoogleSignIn } from './components/GoogleSignIn';
import { AppleSignIn } from './components/AppleSignIn';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabaseClient, supabaseSignIn } from './utils/Supabase';

export default function App() {
    const [session, setSession] = useState<Session | null>(null);

    // Check if user is logged in
    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription }
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // supbase sign out
    const supabaseSignOut = () => {
        supabaseClient.auth.signOut();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            {Platform.OS === 'android' && <GoogleSignIn />}
            {Platform.OS === 'ios' && <AppleSignIn />}

            <View
                style={{
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}
                >
                    Supabase Status:{' '}
                </Text>

                {session ? (
                    <View>
                        <Text>{session.user.id}</Text>
                        <Text>{session.user.email}</Text>
                    </View>
                ) : (
                    <Text>Not Logged In</Text>
                )}

                {session && (
                    <Button
                        title="Sign Out Supabase"
                        onPress={supabaseSignOut}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
