import { useState } from "react";
import { X } from "lucide-react";
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { api } from "../../services/api";

export const CreateTicketModal = ({ onClose, onCreated }) => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!subject.trim()) return;

        setLoading(true);
        try {
            await api.tickets.create({ subject, description, priority });
            onCreated();
            onClose();
        } catch (err) {
            console.error("Ticket creation failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-brand-card w-full max-w-md rounded-xl p-6 space-y-4 border border-gray-800">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">New Support Ticket</h2>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ticket subject"
                    className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your issue in detail"
                    rows={4}
                    className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white resize-none"
                />


                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <PrimaryButton loading={loading} onClick={handleCreate}>
                    Create Ticket
                </PrimaryButton>
            </div>
        </div>
    );
};
