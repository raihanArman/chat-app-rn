import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'

const Login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { signIn } = useAuth()

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Sign in', 'Please fill all the fields')
            return
        }

        try {
            setIsLoading(true)
            await signIn(emailRef.current, passwordRef.current)
        } catch (error) {
            console.log("got error: ", error)
            Alert.alert('Sign in', 'Something went wrong ' + error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? "padding" : "height"}>
            <ScreenWrapper showPattern={true}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={28} />
                        <Typo size={17} color={colors.white}>
                            Forgot Password?
                        </Typo>
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ gap: spacingX._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={'600'}>
                                    Welcome back
                                </Typo>
                                <Typo color={colors.neutral600}>
                                    We are happy to see you!
                                </Typo>
                            </View>

                            <Input
                                placeholder='Enter your email'
                                onChangeText={(value: string) => emailRef.current = value}
                                icon={<Icons.At size={verticalScale(24)} color={colors.neutral600} />} />

                            <Input
                                placeholder='Enter your password'
                                onChangeText={(value: string) => passwordRef.current = value}
                                icon={<Icons.Lock size={verticalScale(24)} color={colors.neutral600} />} />

                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={isLoading} onPress={handleSubmit}>
                                    <Typo fontWeight={"bold"} color={colors.black}>Login</Typo>
                                </Button>
                                <View style={styles.footer}>
                                    <Typo>Don't have an account?</Typo>
                                    <Pressable onPress={() => router.push("/(auth)/register")} >
                                        <Typo fontWeight={"bold"} color={colors.primaryDark}>Sign Up</Typo>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
        paddingBottom: spacingY._25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20
    },
    form: {
        gap: spacingY._15,
        marginTop: spacingY._20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    }
})