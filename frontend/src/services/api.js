import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- API METHODS ----
export const api = {
    auth: {
        signin: async ({ email, password }) => {
            const res = await apiClient.post("/api/auth/signin", {
                email,
                password
            });
            return res.data;
        },

        signup: async ({ name, email, password, role }) => {
            const res = await apiClient.post("/api/auth/signup", {
                name,
                email,
                password,
                role
            });
            return res.data;
        },

        me: async () => {
            const res = await apiClient.get("/api/auth/me");
            return res.data;
        }
    },

    tickets: {
        list: async () => {
            const res = await apiClient.get("/api/tickets");
            return res.data;
        },

        getById: async (ticketId) => {
            const res = await apiClient.get(`/api/tickets/${ticketId}`);
            return res.data;
        },

        create: async ({ priority, description, subject }) => {
            const res = await apiClient.post("/api/tickets/create", {
                priority,
                description,
                subject
            });
            return res.data;
        },

        updateStatus: async (ticketId, status) => {
            const res = await apiClient.put("/api/tickets/status", {
                ticketId,
                status
            });
            return res.data;
        },

        assign: async (ticketId, agentId) => {
            console.log(ticketId, agentId);
            const res = await apiClient.patch(`/api/tickets/${ticketId}/assign`, {
                agentId
            });
            console.log(res);
            return res.data;
        },

        accept: async (ticketId) => {
            const res = await apiClient.patch(`/api/tickets/${ticketId}/accept`);
            return res.data;
        }
    },

    messages: {
        list: async (ticketId) => {
            const res = await apiClient.get(`/api/messages/${ticketId}`);
            return res.data;
        },

        send: async ({ ticketId, content }) => {
            const res = await apiClient.post("/api/messages/send", {
                ticketId,
                content
            });
            return res.data;
        }
    },

    admin: {
        agents: {
            list: async () => {
                const res = await apiClient.get("/api/admin/agents");
                return res.data;
            },

            pending: async () => {
                const res = await apiClient.get("/api/admin/agents/pending");
                return res.data;
            },

            approve: async (id) => {
                const res = await apiClient.put(`/api/admin/agents/${id}/approve`);
                return res.data;
            },

            reject: async (id) => {
                const res = await apiClient.put(`/api/admin/agents/${id}/reject`);
                return res.data;
            }
        }
    },

    dashboard: {
        customer: async () => {
            const res = await apiClient.get("/api/dashboard/customer");
            return res.data;
        },

        agent: async () => {
            const res = await apiClient.get("/api/dashboard/agent");
            return res.data;
        },

        admin: async () => {
            const res = await apiClient.get("/api/dashboard/admin");
            return res.data;
        }
    }
};
