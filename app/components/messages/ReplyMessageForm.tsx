"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Send, Loader2} from "lucide-react";
import { toast } from "sonner";

type ReplyMessageFormProps = {
    conversationId: number;
    currentUserName: string;
    currentUserProfileImageUrl?: string | null;
};

function getInitials(name?: string | null) {
    if (!name) return "FM";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ReplyMessageForm({
    conversationId,
    currentUserName,
    currentUserProfileImageUrl,
}: ReplyMessageFormProps) {
    const router = useRouter();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const initials = getInitials(currentUserName);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
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
                body: JSON.stringify({
                    content: trimmedContent,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de l'envoi.");
                return;
            }

            setContent("");
            toast.success("Message envoyé.");
            router.refresh();
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
            className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-sky-100 ring-1 ring-slate-200">
                    {currentUserProfileImageUrl ? (
                        <Image
                            src={currentUserProfileImageUrl}
                            alt={currentUserName || "Photo de profil"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-sky-700">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Répondre à la conversation
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Connecté en tant que {currentUserName}
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
                            placeholder="Écrivez votre réponse..."
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
                                    Envoyer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}