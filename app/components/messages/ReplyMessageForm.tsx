"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

type ReplyMessageFormProps = {
    conversationId: number;
};

export default function ReplyMessageForm({
    conversationId,
}: ReplyMessageFormProps) {
    const router = useRouter();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setMessage("Le message ne peut pas être vide.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: trimmedContent,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Erreur lors de l'envoi.");
                return;
            }

            setContent("");
            setMessage("Message envoyé.");
            router.refresh();
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">
                    Répondre à la conversation
                </h3>

                <span className="text-xs text-slate-500">
                    {content.length}/500
                </span>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrivez votre réponse..."
                maxLength={500}
                className="mt-4 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                rows={4}
                disabled={loading}
            />

            <div className="mt-4 flex items-center justify-between">
                {message && (
                    <p
                        className={`text-sm ${message === "Message envoyé."
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Envoi...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Envoyer
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}