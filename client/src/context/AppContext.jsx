import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [showLogin, setShowLogin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [credit, setCredit] = useState(null);

    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadCreditData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/credit`, { headers: { token } })

            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }


    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/image/generate-image`, {
                prompt: prompt
            }, {
                headers: { token }
            })

            if (data.success) {
                loadCreditData()
                return data.resultImage;
            } else {
                toast(data.message, {
                    icon: '❗',
                    style: {
                        color: 'red'
                    }
                })
                loadCreditData()
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }
        } catch (err) {
            console.log(err)
            toast.err(err.message)
        }

    }
    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(() => {
        if (token) {
            loadCreditData()
        }
    }, [token])

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        logout,
        loadCreditData,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}
export default AppContextProvider;