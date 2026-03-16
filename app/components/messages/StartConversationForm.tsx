"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type StartConversationFormProps = {
    fishId: number;
};

export default function StartConversationForm({
    fishId,
}: StartConversationFormProps) {
    const router = useRouter();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            toast.error("Le message ne peut pas être vide.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fishId,
                    content: trimmedContent,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de l'envoi du message.");
                return;
            }

            toast.success("Message envoyé au vendeur.");
            setContent("");

            if (data.conversationId) {
                router.push(`/dashboard/messages/${data.conversationId}`);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <MessageCircle className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Contacter le vendeur
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Posez une question ou demandez plus d’informations avant de commander.
                            </p>
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                            {content.length}/500
                        </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Bonjour, ce poisson est-il encore disponible ?"
                            maxLength={500}
                            rows={4}
                            disabled={loading}
                            className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Envoyer le message
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}