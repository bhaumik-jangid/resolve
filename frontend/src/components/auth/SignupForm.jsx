import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { InputField } from '../ui/InputField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { FormError } from '../ui/FormError';
import { cn } from '../../lib/utils';
import axios from 'axios';

export const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer' // 'customer' | 'agent'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const setRole = (role) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full name is required';

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");

        if (!validate()) return;

        setLoading(true);

        try {
            // 1️⃣ Signup
            const signupRes = await api.auth.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role.toUpperCase()
            });

            const { token, role, agentApproved } = signupRes.data;

            // Edge case: agent pending approval
            // if (role === "AGENT" && agentApproved === false) {
            //     setGeneralError("Your account is pending admin approval.");
            //     return;
            // }

            // 2️⃣ Store token
            localStorage.setItem("token", token);

            // 3️⃣ Fetch profile
            let meRes;
            try {
                meRes = await api.auth.me();
            } catch {
                localStorage.removeItem("token");
                throw new Error("Failed to load user profile");
            }

            // 4️⃣ Hydrate auth context
            login(meRes.data);

            // 5️⃣ Redirect
            navigate("/dashboard/overview");

        } catch (err) {
            if (!err.response) {
                setGeneralError("Server not reachable. Try again later.");
            } else if (err.response.status === 400) {
                setGeneralError(err.response.data.message || "Invalid signup details.");
            } else {
                setGeneralError("Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mb-6">
                {['customer', 'agent'].map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setRole(role)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-300",
                            formData.role === role
                                ? "bg-white text-brand-purple shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {role === 'customer' ? <User size={16} /> : <Briefcase size={16} />}
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
            </div>

            <InputField
                name="name"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={User}
                required
            />

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
                required
            />

            {generalError && <FormError message={generalError} />}

            <PrimaryButton loading={loading} type="submit">
                Create Account
            </PrimaryButton>
        </form>
    );
};
