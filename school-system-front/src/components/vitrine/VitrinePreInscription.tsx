import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VitrineConfig } from "@/types/vitrine";
import axios from "axios";
import env from "@/config/env";

interface Props {
  config: VitrineConfig;
}

export default function VitrinePreInscription({ config }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    dateOfBirth: "",
    niveau: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: "",
    notes: "",
  });

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${env.API_URL}/public/pre-inscription`, form, {
        headers: { "X-Tenant-ID": slug },
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-lg px-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Demande envoy&eacute;e !</h2>
          <p className="mt-2 text-gray-600">
            Votre demande de pr&eacute;-inscription a &eacute;t&eacute; enregistr&eacute;e. Nous vous contacterons bient&ocirc;t.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" style={{ backgroundColor: config.primaryColor + "05" }}>
      <div className="mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Pr&eacute;-inscription</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Remplissez le formulaire pour inscrire votre enfant
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Pr&eacute;nom *</Label>
                  <Input required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                </div>
                <div>
                  <Label>Nom *</Label>
                  <Input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Sexe *</Label>
                  <Select value={form.sex} onValueChange={(v) => set("sex", v)}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">F&eacute;minin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date de naissance</Label>
                  <Input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Niveau souhait&eacute;</Label>
                <Input value={form.niveau} onChange={(e) => set("niveau", e.target.value)} placeholder="Ex: 1ere ann&eacute;e primaire" />
              </div>

              <hr className="my-4" />
              <p className="text-sm font-medium text-muted-foreground">Informations du parent / tuteur</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Pr&eacute;nom du parent</Label>
                  <Input value={form.parentFirstName} onChange={(e) => set("parentFirstName", e.target.value)} />
                </div>
                <div>
                  <Label>Nom du parent</Label>
                  <Input value={form.parentLastName} onChange={(e) => set("parentLastName", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>T&eacute;l&eacute;phone</Label>
                  <Input type="tel" value={form.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.parentEmail} onChange={(e) => set("parentEmail", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Notes / commentaires</Label>
                <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={loading || !form.firstName || !form.lastName || !form.sex}
                className="w-full"
                style={{ backgroundColor: config.primaryColor }}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer la demande
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
