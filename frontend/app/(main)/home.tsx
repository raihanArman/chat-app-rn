import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { testSocket } from '@/socket/socketEvents'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'

const Home = () => {
    const { user, signOut } = useAuth()

    useEffect(() => {
        testSocket(testSocketCallbackHandler)
        testSocket(null)

        return () => {
            testSocket(testSocketCallbackHandler, true)
        }
    }, [])

    const testSocketCallbackHandler = (data: any) => {
        console.log("test socket callback handler", data)
    }

    console.log("user: ", user)
    const handleLogout = async () => {
        await signOut()
    }
    return (
        <ScreenWrapper>
            <Typo color={colors.white}>Home</Typo>
            <Button onPress={handleLogout}>
                <Typo>Logout</Typo>
            </Button>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({})