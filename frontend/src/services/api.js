// SERVICES API LAYER
// Handles data fetching with automatic fallback to mock data
// Implements 15 specific endpoints for Dashboards, Tickets, Chat, and Admin.

const MOCK_DELAY = 600;

// --- MOCK DATA STORE ---
const MOCK_DB = {
    user: { id: '1', name: 'Demo User', role: 'customer' },
    tickets: [
        { id: 'T-1024', subject: 'Login issue on mobile app', status: 'open', priority: 'high', updated: '2 hrs ago', messages: 2, requester: 'Acme Corp', assignedTo: 'A-1' },
        { id: 'T-1023', subject: 'Billing question', status: 'in-progress', priority: 'medium', updated: '1 day ago', messages: 5, requester: 'Globex', assignedTo: 'A-1' },
        { id: 'T-1020', subject: 'Feature request: Dark mode', status: 'closed', priority: 'low', updated: '3 days ago', messages: 12, requester: 'Soylent', assignedTo: 'A-2' },
        { id: 'T-2401', subject: 'Critical DB Failure', status: 'open', priority: 'critical', updated: '10m ago', messages: 1, requester: 'Internal', assignedTo: null },
    ],
    messages: {
        'T-1024': [
            { id: 1, sender: 'Support Bot', role: 'bot', content: 'Hello! How can we help you today?', timestamp: '10:00 AM' },
            { id: 2, sender: 'You', role: 'customer', content: 'I cannot login to the iOS app.', timestamp: '10:05 AM' },
        ]
    },
    agents: [
        { id: 'A-1', name: 'Sarah Miller', status: 'active', email: 'sarah@example.com' },
        { id: 'A-2', name: 'Mike Ross', status: 'active', email: 'mike@example.com' },
        { id: 'A-3', name: 'Jessica Pearson', status: 'pending', email: 'jessica@example.com' },
    ]
};

// --- UTILS ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithFallback(endpoint, options = {}, mockHandler) {
    try {
        // SIMULATE REAL FETCH ATTEMPT
        // console.log(`[API] Fetching: ${endpoint}`);
        // const res = await fetch(endpoint, options);
        // if (!res.ok) throw new Error(res.statusText);
        // return { data: await res.json(), isFallback: false };

        // FORCE FALLBACK FOR DEMO - Simulate network delay then fail or just return mock
        await wait(MOCK_DELAY);

        // Uncomment to simulate random network errors
        // if (Math.random() > 0.9) throw new Error("Random Network Error");

        // RETURN MOCK
        const mockData = mockHandler();
        return { data: mockData, isFallback: true };

    } catch (error) {
        console.warn(`[API] Network Error on ${endpoint}: ${error.message}. Using fallback.`);
        const mockData = mockHandler();
        return { data: mockData, isFallback: true, error: error.message }; // Return error info to UI
    }
}

// --- API EXPORTS ---
export const api = {
    tickets: {
        // 3) POST /api/tickets/create
        create: (data) => fetchWithFallback('/api/tickets/create', { method: 'POST', body: JSON.stringify(data) }, () => {
            const newTicket = {
                id: `T-${Math.floor(Math.random() * 10000)}`,
                subject: 'New Support Request',
                status: 'open',
                priority: data.priority || 'MEDIUM',
                updated: 'Just now',
                messages: 0
            };
            MOCK_DB.tickets.unshift(newTicket);
            return newTicket;
        }),

        // 4) GET /api/tickets
        list: (role) => fetchWithFallback('/api/tickets', {}, () => {
            // Filter tickets based on role
            if (role === 'customer') return MOCK_DB.tickets.slice(0, 3); // Own tickets
            if (role === 'agent') return MOCK_DB.tickets.filter(t => t.assignedTo === 'A-1'); // Assigned
            return MOCK_DB.tickets; // Admin sees all
        }),

        // 5) POST /api/tickets/assign
        assign: (data) => fetchWithFallback('/api/tickets/assign', { method: 'POST', body: JSON.stringify(data) }, () => {
            return { success: true, ticketId: data.ticketId, newAgent: data.agentId };
        })
    },

    messages: {
        // 6) GET /api/messages/:ticketId
        list: (ticketId) => fetchWithFallback(`/api/messages/${ticketId}`, {}, () => {
            return MOCK_DB.messages[ticketId] || MOCK_DB.messages['T-1024']; // Default to sample if not found
        }),

        // 7) POST /api/messages/send
        send: (data) => fetchWithFallback('/api/messages/send', { method: 'POST', body: JSON.stringify(data) }, () => {
            const newMsg = {
                id: Date.now(),
                sender: 'You',
                role: 'customer',
                content: data.content,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            if (MOCK_DB.messages['T-1024']) MOCK_DB.messages['T-1024'].push(newMsg);
            return newMsg;
        })
    },

    admin: {
        agents: {
            // 8) POST /api/admin/agents/create
            create: (data) => fetchWithFallback('/api/admin/agents/create', { method: 'POST', body: JSON.stringify(data) }, () => {
                return { id: `A-${Date.now()}`, ...data, status: 'pending' };
            }),

            // 9) GET /api/admin/agents
            list: () => fetchWithFallback('/api/admin/agents', {}, () => {
                return MOCK_DB.agents;
            }),

            // 10) GET /api/admin/agents/pending
            pending: () => fetchWithFallback('/api/admin/agents/pending', {}, () => {
                return MOCK_DB.agents.filter(a => a.status === 'pending');
            }),

            // 11) PUT /api/admin/agents/:id/approve
            approve: (id) => fetchWithFallback(`/api/admin/agents/${id}/approve`, { method: 'PUT' }, () => {
                return { success: true, id, status: 'active' };
            }),

            // 12) PUT /api/admin/agents/:id/reject
            reject: (id) => fetchWithFallback(`/api/admin/agents/${id}/reject`, { method: 'PUT' }, () => {
                return { success: true, id, status: 'rejected' };
            })
        }
    },

    dashboard: {
        // 13) GET /api/dashboard/customer
        customer: () => fetchWithFallback('/api/dashboard/customer', {}, () => {
            return {
                stats: [
                    { label: 'Active Tickets', value: '3', change: null },
                    { label: 'Resolved', value: '12', change: null },
                ],
                recentTickets: MOCK_DB.tickets.slice(0, 3)
            };
        }),

        // 14) GET /api/dashboard/agent
        agent: () => fetchWithFallback('/api/dashboard/agent', {}, () => {
            return {
                stats: [
                    { label: 'Assigned', value: '8', change: '+2' },
                    { label: 'Pending', value: '3', change: '-1' },
                    { label: 'Resolved Today', value: '14', change: '+5' },
                    { label: 'Avg Response', value: '12m', change: '-2m' },
                ],
                queue: MOCK_DB.tickets.filter(t => t.assignedTo === 'A-1')
            };
        }),

        // 15) GET /api/dashboard/admin
        admin: () => fetchWithFallback('/api/dashboard/admin', {}, () => {
            return {
                stats: [
                    { label: 'Total Users', value: '2,845', change: '+12%' },
                    { label: 'Active Tickets', value: '142', change: '-5%' },
                    { label: 'Avg Resolution', value: '4.2h', change: 'Stable' },
                    { label: 'System Health', value: '99.9%', change: 'Good' },
                ],
                activity: [
                    { user: 'Agent Smith', action: 'Resolved T-1024', time: '5m ago' },
                    { user: 'System', action: 'Backup Correct', time: '1h ago' }
                ]
            };
        })
    }
};
