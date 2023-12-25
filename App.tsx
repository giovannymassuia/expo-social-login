import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GoogleSignIn } from './components/GoogleSignIn';
import { AppleSignIn } from './components/AppleSignIn';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            {Platform.OS === 'android' && <GoogleSignIn />}
            {Platform.OS === 'ios' && <AppleSignIn />}
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
