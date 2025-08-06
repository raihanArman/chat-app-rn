import { colors } from '@/constants/theme'
import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const SplashScreen = () => {
    // const router = useRouter()
    // useEffect(() => {
    //     setTimeout(() => {
    //         router.replace('/(auth)/welcome')
    //     }, 2000)
    // })
    return (
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={colors.neutral900} />
            <Animated.Image
                source={require('../assets/images/splashImage.png')}
                entering={FadeInDown.duration(700).springify()}
                style={styles.logo}
                resizeMode={"contain"}
            />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral900
    },
    logo: {
        height: "23%",
        aspectRatio: 1,
    }
});