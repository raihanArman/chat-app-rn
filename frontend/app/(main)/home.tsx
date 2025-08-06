import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import React from 'react'
import { StyleSheet } from 'react-native'

const Home = () => {
    const { user } = useAuth()
    console.log("user: ", user)
    return (
        <ScreenWrapper>
            <Typo color={colors.white}>Home</Typo>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({})