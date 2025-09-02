import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { verticalScale } from '@/utils/styling'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

const NewConversationModal = () => {
    const { isGroup } = useLocalSearchParams()
    const isGroupMode = isGroup == "1"
    const router = useRouter()
    const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null)
    const [groupName, setGroupName] = useState("")
    const [selectionParticipant, setSelectedParticipant] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const { user: currentUser } = useAuth()

    const contacts = [
        {
            id: "9",
            name: "Benjamin Sesko",
            avatar: "https://i.pravatar.cc/150?img=19"
        },
        {
            id: "10",
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?img=10"
        },
        {
            id: "11",
            name: "Kevin Harris",
            avatar: "https://i.pravatar.cc/150?img=11"
        }
    ]

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 0.5,
        })

        console.log(result)

        if (!result.canceled) {
            setGroupAvatar(result.assets[0])
        }
    }

    const toggleParticipant = (user: any) => {
        setSelectedParticipant((prev: any) => {
            if (prev.includes(user.id)) {
                return prev.filter((id: string) => id != user.id)
            }
            return [...prev, user.id]
        })
    }

    const onSelectUser = (user: any) => {
        if (!currentUser) {
            Alert.alert("User", "Please login first")
        }

        if (isGroupMode) {
            toggleParticipant(user);
        } else {

        }
    }

    const createGroup = async () => {
        if (!groupName.trim() || !currentUser || selectionParticipant.length < 2) return;
    }

    return (
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header
                    title={isGroupMode ? "New Group" : "Select User"}
                    leftIcon={<BackButton color={colors.black} />}
                />
                {
                    isGroupMode && (
                        <View style={styles.groupInfoContainer}>
                            <View style={styles.avatarContainer}>
                                <TouchableOpacity onPress={onPickImage}>
                                    <Avatar
                                        uri={groupAvatar?.uri || null}
                                        size={100}
                                        isGroup={true}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.groupNameContainer}>
                                <Input
                                    placeholder='Group Name'
                                    value={groupName}
                                    onChangeText={setGroupName}
                                />
                            </View>
                        </View>
                    )
                }
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contactList}
                >
                    {
                        contacts.map((user: any, index: number) => {
                            const isSelected = selectionParticipant.includes(user.id)
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.contactRow, isSelected && styles.selectedContact]}
                                    onPress={() => onSelectUser(user)}>
                                    <Avatar
                                        size={45}
                                        uri={user.avatar}
                                    />
                                    <Typo fontWeight={500}>{user.name}</Typo>
                                    {
                                        isGroupMode && (
                                            <View style={styles.selectionIndicator}>
                                                <View style={[styles.checkbox, isSelected && styles.checked]} />
                                            </View>
                                        )
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
                {
                    isGroupMode && selectionParticipant.length > 0 && (
                        <View style={styles.createGroupButton}>
                            <Button
                                onPress={createGroup}
                                disabled={!groupName.trim()}
                                loading={isLoading}>
                                <Typo fontWeight={600} size={17}>
                                    Create Group
                                </Typo>
                            </Button>
                        </View>
                    )
                }
            </View>
        </ScreenWrapper>
    )
}

export default NewConversationModal

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacingX._15,
        flex: 1
    },
    groupInfoContainer: {
        alignItems: "center",
        marginTop: spacingY._10
    },
    groupNameContainer: {
        width: "100%"
    },
    avatarContainer: {
        marginBottom: spacingY._10
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._5
    },
    selectedContact: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15
    },
    contactList: {
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(150),
    },
    selectionIndicator: {
        marginLeft: "auto",
        marginRight: spacingX._10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    checked: {
        backgroundColor: colors.primary,
    },
    createGroupButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200,
    }
})