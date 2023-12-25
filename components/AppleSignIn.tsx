import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

import * as AsyncStorage from '../utils/AsyncStorage';

type AppleCredential = {
    user: {
        id: string;
        email: string;
        fullName: AppleAuthentication.AppleAuthenticationFullName;
    };
};

const APPLE_CREDENTIAL_KEY = 'appleCredential';

export function AppleSignIn() {
    const userId = '000506.c9659cd1b86149748a95e13035f4fd5e.0230';
    const [state, setState] = useState<AppleCredential | undefined>(undefined);

    useEffect(() => {
        // check if user credential is available
        AsyncStorage.get(APPLE_CREDENTIAL_KEY)
            .then((appleCredential: AppleCredential) => {
                console.log('apple credential: ', appleCredential);

                if (appleCredential) {
                    setState(appleCredential);

                    AppleAuthentication.isAvailableAsync().then((isAvailable) => {
                        console.log('is available: ', isAvailable);

                        if (isAvailable) {
                            AppleAuthentication.getCredentialStateAsync(appleCredential.user.id).then((credentialState) => {
                                console.log('credential state: ', credentialState);

                                switch (credentialState) {
                                    case AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED:
                                        console.log('authorized');
                                        break;
                                    case AppleAuthentication.AppleAuthenticationCredentialState.REVOKED:
                                        // user is not authenticated
                                        console.log('revoked');
                                        break;
                                    case AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND:
                                        // user is not authenticated
                                        console.log('not found');
                                        break;
                                }
                            });
                        } else {
                            // do something else
                        }
                    });
                }
            })
            .catch((e) => {
                console.error('apple credential error: ', e);
            });

        AppleAuthentication.addRevokeListener(() => {
            console.log('revoke listener');
        });
    }, []);

    const signIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL]
            });

            console.log('apple sign in success: ', JSON.stringify(credential, null, 2));

            if (credential.identityToken && (!credential.email || !credential.fullName)) {
                console.log('auth worked, but not the first authentication');
                return;
            }

            const creds: AppleCredential = {
                user: {
                    id: credential.user,
                    email: credential.email!,
                    fullName: credential.fullName!
                }
            };

            setState(creds);

            // save the credential to AsyncStorage if the first time
            const storedCreds = await AsyncStorage.get(APPLE_CREDENTIAL_KEY);
            if (!storedCreds) {
                await AsyncStorage.store(APPLE_CREDENTIAL_KEY, creds);
            }
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
            } else {
                // handle other errors
            }

            console.error('apple sign in error: ', JSON.stringify(e, null, 2));
        }
    };

    const signOut = async () => {
        console.log('sign out');
        try {
            if (!state) {
                return;
            }

            setState(undefined);
            AsyncStorage.remove(APPLE_CREDENTIAL_KEY);
        } catch (e) {
            // handle error
        }
    };

    return (
        <View style={{ alignItems: 'center' }}>
            <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={5}
                style={{ width: 200, height: 48 }}
                onPress={signIn}
            />

            {state && (
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        {state.user.fullName.givenName} {state.user.fullName.familyName}
                    </Text>
                    <Text>{state.user.email}</Text>
                    <Text>{state.user.id}</Text>
                </View>
            )}

            {state && (
                <Button
                    onPress={signOut}
                    title="Sign Out from Apple"
                />
            )}
        </View>
    );
}
