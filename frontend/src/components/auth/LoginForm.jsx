import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { FormError } from '../ui/FormError';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

        // Mock Login (Restore mock behavior for smooth UI demo)
        setTimeout(() => {
            setLoading(false);

            // Call context login
            login({
                id: '1',
                name: 'John Doe',
                email: formData.email,
                role: 'customer'
            });

            // Redirect
            navigate('/dashboard/overview');
        }, 1500);
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
