"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MessageCircleMore, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

type ReplyMessageFormProps = {
    conversationId: number;
};

export default function ReplyMessageForm({
    conversationId,
}: ReplyMessageFormProps) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Le message ne peut pas être vide.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: content.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de l'envoi.");
                setLoading(false);
                return;
            }

            setContent("");
            toast.success(data.message || "Message envoyé.");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 border-t border-slate-200 pt-6">
            <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <MessageCircleMore className="h-5 w-5" />
                    </div>

                    <div className="w-full">
                        <h3 className="text-base font-semibold text-slate-900">
                            Répondre à la conversation
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            Écrivez votre réponse puis envoyez-la pour continuer l’échange.
                        </p>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Écrivez votre réponse..."
                            className="mt-4 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                            rows={4}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    <SendHorizonal className="h-4 w-4" />
                                    Répondre
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}