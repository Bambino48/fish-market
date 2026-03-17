"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileCheck2, Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function VerificationForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erreur upload document.");
    }

    return data.imageUrl as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("Veuillez sélectionner un document.");
      return;
    }

    setLoading(true);

    try {
      const fileUrl = await uploadFile();

      const res = await fetch("/api/verification-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la soumission.");
        return;
      }

      toast.success("Permis envoyé avec succès.");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de l’envoi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              Ajouter votre document
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Importez une image claire de votre permis de pêche au format JPG,
              PNG ou WEBP.
            </p>

            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <UploadCloud className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG ou WEBP uniquement
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
              </label>
            </div>

            {file && (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <FileCheck2 className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Fichier sélectionné
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
            <ShieldCheck className="h-4 w-4" />
            Soumettre le permis
          </>
        )}
      </button>
    </form>
  );
}