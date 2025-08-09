import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { FaArrowLeft } from 'react-icons/fa';
import { AxiosError } from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode } = useThemeStore();
    const { login, previousPath, checkAuthStatus, isAuthenticated } = useAuthStore();
    const { showToast } = useToastStore();

    useEffect(() => {
        const init = async () => {
            const isAuth = await checkAuthStatus();
            if (isAuth) {
                navigate('/admin/dashboard', { replace: true });
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({ email, password });
            showToast('Welcome back! Login successful', 'success');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            showToast(axiosError.response?.data?.message || 'Invalid email or password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(previousPath || '/');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${
            isDarkMode ? 'bg-[#0a0f1e]' : 'bg-gray-50'
        }`}>
            {/* Back Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDarkMode 
                        ? 'bg-[#141b2d] text-white hover:bg-[#1f2937]' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors duration-200`}
            >
                <FaArrowLeft />
                <span>Back</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
                    isDarkMode 
                        ? 'bg-[#141b2d] border border-gray-800' 
                        : 'bg-white border border-gray-100'
                }`}
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img 
                        src={isDarkMode ? "/dark.png" : "/light.png"} 
                        alt="Logo" 
                        className="w-16 h-16 object-contain" 
                    />
                </div>

                <div className="text-center mb-8">
                    <h2 className={`text-2xl font-light ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Zameel Academy
                    </h2>
                    <p className={`text-sm mt-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Sign in to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label 
                            htmlFor="email" 
                            className={`block text-sm font-medium mb-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-[#1f2937] border-gray-700 text-white focus:ring-indigo-500' 
                                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-indigo-500'
                            }`}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className={`block text-sm font-medium mb-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-[#1f2937] border-gray-700 text-white focus:ring-indigo-500' 
                                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-indigo-500'
                            }`}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login; 