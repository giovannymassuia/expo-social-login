import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { Button, Image, Text, View } from 'react-native';

export function GoogleSignIn() {
    // default config
    GoogleSignin.configure({
        scopes: ['email', 'profile']
    });

    const [state, setState] = useState<any>({});

    useEffect(() => {
        GoogleSignin.isSignedIn().then((isSignedIn) => {
            console.log('is signed in: ', isSignedIn);

            if (isSignedIn) {
                // get the user info
                GoogleSignin.getCurrentUser().then((userInfo) => {
                    console.log('current user info: ', JSON.stringify(userInfo, null, 2));

                    setState({ userInfo });
                });
            } else {
                console.log('not signed in');

                setState({});
            }
        });
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            console.log('google sign in success: ', JSON.stringify(userInfo, null, 2));

            setState({ userInfo });
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }

            console.error('google sign in error: ', JSON.stringify(error, null, 2));
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

            setState({ userInfo: null });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
            />

            {state.userInfo && (
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>{state.userInfo.user.name}</Text>
                    <Text>{state.userInfo.user.email}</Text>
                    <Text>{state.userInfo.user.id}</Text>
                    <Image
                        source={{ uri: state.userInfo.user.photo }}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                </View>
            )}

            {state.userInfo && (
                <Button
                    onPress={signOut}
                    title="Sign Out from Google"
                    color="#841584"
                />
            )}
        </View>
    );
}
