import { Mail, Lock } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { FormError } from '../ui/FormError';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { api } from '../../services/api';

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field-specific error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

        if (!formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");

        if (!validate()) return;

        setLoading(true);

        try {
            // 1️⃣ Sign in
            const signinRes = await api.auth.signin({
                email: formData.email,
                password: formData.password
            });

            const { token } = signinRes;

            localStorage.setItem("token", token);

            // 2️⃣ Fetch profile
            let meRes;
            try {
                meRes = await api.auth.me();
            } catch {
                localStorage.removeItem("token");
            }

            // 3️⃣ Hydrate context
            login(meRes);
            // 4️⃣ Redirect
            navigate("/dashboard/overview");

        } catch (err) {
            // 🎯 Precise error handling
            if (!err.response) {
                setGeneralError("Server not reachable. Check your connection.");
            } else if (err.response.status === 400) {
                setGeneralError("Invalid email or password.");
            } else if (err.response.status === 401) {
                setGeneralError("Session expired. Please login again.");
            } else {
                setGeneralError(
                    err.response?.data?.message || "Signin failed. Try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={Mail}
                required
            />

            <InputField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
                requirednpm
            />

            <FormError message={generalError} />

            <PrimaryButton loading={loading} type="submit">
                Sign In
            </PrimaryButton>
        </form>
    );
};
