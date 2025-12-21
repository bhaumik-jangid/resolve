import { createContext, useContext, useState } from "react";

const TicketsContext = createContext();

export const useTickets = () => useContext(TicketsContext);

export const TicketsProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);

    const upsertTickets = (list) => {
        setTickets(list);
    };

    const updateTicketStatus = (ticketId, status) => {
        setTickets(prev =>
            prev.map(t =>
                (t.id === ticketId || t._id === ticketId)
                    ? { ...t, status: status.toLowerCase() }
                    : t
            )
        );
    };


    const getTicketById = (id) =>
        tickets.find(t => t.id === id || t._id === id);

    return (
        <TicketsContext.Provider value={{
            tickets,
            upsertTickets,
            getTicketById,
            updateTicketStatus
        }}>
            {children}
        </TicketsContext.Provider>
    );
};

