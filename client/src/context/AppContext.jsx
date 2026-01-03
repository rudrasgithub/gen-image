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
    const [imageHistory, setImageHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [lastHistoryError, setLastHistoryError] = useState(null);

    const navigate = useNavigate();

    // Compute backend URL. We resolve the effective backend at runtime via health checks to ensure
    // generation and history use the same backend (avoids writing to production and reading from local).
    const configuredBackend = import.meta.env.VITE_BACKEND_URL;
    const localBackend = 'http://localhost:4000';
    const isLocalFrontend = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const resolveBackendUrl = async () => {
        // Simple logic: if frontend runs on localhost, always use local backend for dev.
        // Otherwise use the configured backend (production).
        if (isLocalFrontend) {
            console.debug('Frontend on localhost, using local backend:', localBackend);
            return localBackend;
        }
        
        // Production environment: use configured backend
        if (configuredBackend) {
            console.debug('Using configured backend:', configuredBackend);
            return configuredBackend;
        }

        // Fallback to local if nothing configured (dev without env var)
        return localBackend;
    }

    // Synchronous getter for components that need backendUrl immediately (like Login)
    const getBackendUrl = () => {
        if (isLocalFrontend) {
            return localBackend;
        }
        return configuredBackend || localBackend;
    }

    const loadCreditData = async () => {
        try {
            if (!token) {
                console.log('⚠️ loadCreditData: no token, skipping');
                return;
            }
            
            const baseUrlToUse = getBackendUrl();
            console.log('💰 Loading credit data from:', baseUrlToUse, 'with token:', token.substring(0, 20) + '...');
            
            const { data } = await axios.get(`${baseUrlToUse}/api/user/credit`, { 
                headers: { token } 
            })

            console.log('✅ Credit data response:', data);
            
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            } else {
                console.error('❌ Credit data error:', data.message);
                toast.error(data.message)
            }
        } catch (err) {
            console.error('❌ Load credit error:', err?.response?.status, err?.response?.data || err.message);
            toast.error('Failed to load credit: ' + err.message)
        }
    }

    const loadImageHistory = async () => {
        // If we don't have a token, there's nothing to fetch — clear history and exit early.
        if (!token) {
            console.debug('loadImageHistory: no token available, skipping fetch.');
            setImageHistory([]);
            return [];
        }

        try {
            setHistoryLoading(true);
            console.log('📸 Loading image history...');

            const baseUrlToUse = getBackendUrl();
            console.log('🔬 Using backend for history:', baseUrlToUse);
            console.log('� Requesting', baseUrlToUse + '/api/image/history', 'with token present?', !!token);

            const res = await axios.get(`${baseUrlToUse}/api/image/history`, {
                headers: { token },
                timeout: 8000
            });

            // Accept multiple possible shapes: { success, images }, or direct array, etc.
            const payload = res.data;
            console.log('📨 Raw response from history endpoint:', payload, 'status:', res.status);

            let images = [];

            if (Array.isArray(payload)) {
                images = payload;
            } else if (payload && payload.success && Array.isArray(payload.images)) {
                images = payload.images;
            } else if (payload && Array.isArray(payload.data)) {
                images = payload.data;
            } else if (payload && payload.success && payload.images == null) {
                // backend returned success but no images; treat as empty
                images = [];
            } else {
                // Unexpected payload shape
                console.warn('loadImageHistory: unexpected payload shape', payload);
                images = [];
            }

            console.log('✅ History loaded:', images.length, 'images');
            setImageHistory(images);
            setLastHistoryError(null);
            return images;
        } catch (err) {
            // Normalize error message
            const status = err?.response?.status;
            const serverMessage = err?.response?.data?.message;
            const message = serverMessage || err.message || 'Unknown error';

            console.error('❌ History load exception:', { status, message, err });

            if (status === 401 || status === 403) {
                console.log('❌ Auth error loading history');
            }

            setImageHistory([]);
            return [];
        } finally {
            setHistoryLoading(false);
        }
    }

    const generateImage = async (prompt) => {
        try {
            console.log('🎨 Generating image for prompt:', prompt);
            // Ensure we POST to the same effective backend as history uses
            const baseUrlToUse = getBackendUrl();
            console.log('🎯 Posting generateImage to', baseUrlToUse);

            const { data } = await axios.post(`${baseUrlToUse}/api/image/generate-image`, {
                prompt: prompt
            }, {
                headers: { token }
            })

            if (data.success) {
                console.log('✅ Image generated successfully');
                toast.success('Image Generated')
                
                // Reload credit
                await loadCreditData()
                
                // Reload image history
                // Try reloading history from the same backend; if that fails, optimistically append the new image
                const images = await loadImageHistory();
                if ((!images || images.length === 0) && data.resultImage && data.imageId) {
                    console.log('➕ Optimistically appending generated image to local history');
                    setImageHistory(prev => [{
                        _id: data.imageId,
                        prompt,
                        imageUrl: data.resultImage,
                        isFavorite: false,
                        createdAt: new Date().toISOString()
                    }, ...prev]);
                }
                
                return data.resultImage;
            } else {
                console.error('❌ Generation error:', data.message);
                toast.error(data.message, {
                    icon: '❗',
                    style: {
                        color: 'red'
                    }
                })
                
                await loadCreditData()
                
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
                return null;
            }
        } catch (err) {
            console.error('❌ Generation exception:', err)
            toast.error(err.message)
            return null;
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        setImageHistory([])
    }

    useEffect(() => {
        if (token) {
            loadCreditData()
            loadImageHistory()
        }
    }, [token])

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        token,
        setToken,
        credit,
        setCredit,
        logout,
        loadCreditData,
        loadImageHistory,
        generateImage,
        imageHistory,
        setImageHistory,
        historyLoading,
        getBackendUrl
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