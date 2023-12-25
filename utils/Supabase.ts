import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseClient = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL, // Supabase API URL
    process.env.EXPO_PUBLIC_SUPABASE_KEY, // Supabase API Key
    {
        // Supabase Auth Config
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        }
    }
);

const supabaseSignIn = async (provider: 'google' | 'apple', token: string) => {
    try {
        const { data, error } = await supabaseClient.auth.signInWithIdToken({
            provider,
            token
        });

        console.log('provider', provider);
        console.log('data', data);
        console.log('error', error);

        return { data, error };
    } catch (error) {
        console.log('error', error);
        return { data: null, error };
    }
};

export { supabaseClient, supabaseSignIn };
