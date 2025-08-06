import { login, register } from "@/services/authServices";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    updateToken: async () => { }
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter()

    useEffect(() => {
        loadToken()
    }, [])

    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem("token")
        if (storedToken) {
            try {
                const decoded = jwtDecode<DecodedTokenProps>(storedToken)
                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    await AsyncStorage.removeItem("token")
                    goToWelcomePage()

                    return
                }

                setToken(storedToken)
                setUser(decoded.user)
                goToHomePage()

            } catch (error) {
                console.log("got error: ", error)
                goToWelcomePage()
            }
        } else {
            goToWelcomePage()
        }
    }

    const goToHomePage = () => {
        setTimeout(() => {
            router.replace("/(main)/home")
        }, 1500)
    }

    const goToWelcomePage = () => {
        setTimeout(() => {
            router.replace("/(auth)/welcome")
        }, 1500)
    }

    const updateToken = async (token: string) => {
        if (token) {
            setToken(token)
            await AsyncStorage.setItem("token", token)

            const decoded = jwtDecode<DecodedTokenProps>(token)
            console.log("decoded: ", decoded)
            setUser(decoded.user)
        }
    }

    const signIn = async (email: string, password: string) => {
        const response = await login(email, password)
        await updateToken(response.token)
        router.replace("/(main)/home")
    }

    const signUp = async (email: string, password: string, name: string, avatar?: string | null) => {
        const response = await register(email, password, name, avatar)
        await updateToken(response.token)
        router.replace("/(main)/home")
    }

    const signOut = async () => {
        setToken(null)
        setUser(null)
        await AsyncStorage.removeItem("token")
        router.replace("/(auth)/welcome")
    }

    return (
        <AuthContext.Provider value={{
            token,
            user,
            signIn,
            signUp,
            signOut,
            updateToken
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)