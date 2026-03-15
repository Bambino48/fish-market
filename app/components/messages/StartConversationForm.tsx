"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
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

        if (!content.trim()) {
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
                    content: content.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de l'envoi du message.");
                setLoading(false);
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
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <MessageCircle className="h-5 w-5" />
                </div>

                <div className="w-full">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Contacter le vendeur
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                        Posez une question ou demandez plus d&apos;informations avant de commander.
                    </p>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Bonjour, ce poisson est-il encore disponible ?"
                        className="mt-4 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        rows={4}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                    >
                        <Send className="h-4 w-4" />
                        {loading ? "Envoi..." : "Envoyer le message"}
                    </button>
                </div>
            </div>
        </form>
    );
}