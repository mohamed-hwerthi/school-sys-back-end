import { useState, useRef } from "react";
import { Loader2, Globe, FileText, Image, Megaphone, ExternalLink, Plus, Trash2, Eye, EyeOff, Upload, Edit2, BarChart3, Mail, MessageSquare, CheckCircle2, Clock, Send, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import SectionEditor from "@/components/vitrine/SectionEditor";
import GalleryManager from "@/components/vitrine/GalleryManager";
import RichTextEditor from "@/components/vitrine/RichTextEditor";
import VitrineAnalyticsDashboard from "@/components/vitrine/VitrineAnalyticsDashboard";
import {
  useVitrineConfig,
  useUpdateVitrineConfig,
  useVitrinePages,
  useCreateVitrinePage,
  useUpdateVitrinePage,
  useDeleteVitrinePage,
  useVitrineAnnouncements,
  useCreateVitrineAnnouncement,
  useUpdateVitrineAnnouncement,
  useDeleteVitrineAnnouncement,
  useVitrineUpload,
  useVitrineContacts,
  useVitrineUnreadCount,
  useMarkContactAsRead,
  useReplyToContact,
} from "@/hooks/useVitrineAdmin";
import type { VitrineConfig, VitrinePage, VitrineAnnouncement, VitrineContact } from "@/types/vitrine";

export default function VitrineAdmin() {
  const { data: config, isLoading: configLoading } = useVitrineConfig();
  const { data: pages, isLoading: pagesLoading } = useVitrinePages();
  const { data: announcements, isLoading: annLoading } = useVitrineAnnouncements();
  const { data: unreadCount } = useVitrineUnreadCount();

  if (configLoading || pagesLoading || annLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Vitrine</h1>
          <p className="text-muted-foreground">Configurez le site web public de votre &eacute;tablissement</p>
        </div>
        <div className="flex items-center gap-3">
          {config?.published ? (
            <Badge variant="default" className="bg-green-600">Publi&eacute;</Badge>
          ) : (
            <Badge variant="secondary">Brouillon</Badge>
          )}
          <Button variant="outline" size="sm" asChild>
            <a href={`/vitrine/${config?.schoolDisplayName ? encodeURIComponent(config.schoolDisplayName.toLowerCase().replace(/\s+/g, "-")) : "preview"}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Pr&eacute;visualiser
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config"><Globe className="mr-2 h-4 w-4" /> Configuration</TabsTrigger>
          <TabsTrigger value="pages"><FileText className="mr-2 h-4 w-4" /> Pages</TabsTrigger>
          <TabsTrigger value="gallery"><Image className="mr-2 h-4 w-4" /> Galerie</TabsTrigger>
          <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4" /> Annonces</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="mr-2 h-4 w-4" /> Statistiques</TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            <MessageSquare className="mr-2 h-4 w-4" /> Messages
            {(unreadCount ?? 0) > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-6">
          {config && <ConfigTab config={config} />}
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <PagesTab pages={pages || []} />
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <GalleryManager />
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsTab announcements={announcements || []} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <VitrineAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <ContactsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ======================== IMAGE UPLOAD FIELD ========================

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const upload = useVitrineUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload.mutateAsync(file);
    onChange(url);
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL ou uploadez..." className="flex-1" />
        <Button type="button" variant="outline" size="icon" onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
          {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && <img src={value} alt="" className="mt-2 h-20 rounded border object-cover" />}
    </div>
  );
}

// ======================== CONFIG TAB ========================

function ConfigTab({ config }: { config: VitrineConfig }) {
  const updateConfig = useUpdateVitrineConfig();
  const [form, setForm] = useState<Partial<VitrineConfig>>({ ...config });

  const handleSave = () => {
    updateConfig.mutate(form);
  };

  const set = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>Informations g&eacute;n&eacute;rales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nom de l'&eacute;tablissement</Label>
            <Input value={form.schoolDisplayName || ""} onChange={(e) => set("schoolDisplayName", e.target.value)} />
          </div>
          <div>
            <Label>Slogan</Label>
            <Input value={form.slogan || ""} onChange={(e) => set("slogan", e.target.value)} />
          </div>
          <ImageUploadField
            label="Logo"
            value={form.logoUrl || ""}
            onChange={(url) => set("logoUrl", url)}
          />
          <ImageUploadField
            label="Image Hero (banniere)"
            value={form.heroImageUrl || ""}
            onChange={(url) => set("heroImageUrl", url)}
          />
          <div>
            <Label>Description SEO</Label>
            <Textarea value={form.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Couleur principale</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor || "#1e40af"} onChange={(e) => set("primaryColor", e.target.value)} className="h-10 w-10 cursor-pointer rounded border" />
                <Input value={form.primaryColor || ""} onChange={(e) => set("primaryColor", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div>
              <Label>Couleur secondaire</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor || "#f59e0b"} onChange={(e) => set("secondaryColor", e.target.value)} className="h-10 w-10 cursor-pointer rounded border" />
                <Input value={form.secondaryColor || ""} onChange={(e) => set("secondaryColor", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div>
              <Label>Couleur accent</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accentColor || "#10b981"} onChange={(e) => set("accentColor", e.target.value)} className="h-10 w-10 cursor-pointer rounded border" />
                <Input value={form.accentColor || ""} onChange={(e) => set("accentColor", e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>
          <div>
            <Label>Template</Label>
            <Select value={form.themeTemplate || "modern"} onValueChange={(v) => set("themeTemplate", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Moderne</SelectItem>
                <SelectItem value="classic">Classique</SelectItem>
                <SelectItem value="minimal">Minimaliste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Color preview */}
          <div className="rounded-lg border p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Apercu des couleurs</p>
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: form.primaryColor || "#1e40af" }} title="Principale" />
              <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: form.secondaryColor || "#f59e0b" }} title="Secondaire" />
              <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: form.accentColor || "#10b981" }} title="Accent" />
              <div className="flex-1 rounded-lg p-2" style={{ background: `linear-gradient(135deg, ${form.primaryColor || "#1e40af"}, ${form.secondaryColor || "#f59e0b"})` }}>
                <span className="text-xs font-medium text-white">Gradient</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>T&eacute;l&eacute;phone</Label>
            <Input value={form.contactPhone || ""} onChange={(e) => set("contactPhone", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div>
            <Label>Adresse</Label>
            <Textarea value={form.contactAddress || ""} onChange={(e) => set("contactAddress", e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Social & Publication */}
      <Card>
        <CardHeader>
          <CardTitle>R&eacute;seaux sociaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facebook</Label>
            <Input value={form.facebookUrl || ""} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input value={form.instagramUrl || ""} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input value={form.whatsappNumber || ""} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="+212600000000" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Publier le site</p>
              <p className="text-sm text-muted-foreground">Rendre le site visible aux visiteurs</p>
            </div>
            <Switch checked={form.published || false} onCheckedChange={(v) => set("published", v)} />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="lg:col-span-2">
        <Button onClick={handleSave} disabled={updateConfig.isPending} className="w-full sm:w-auto">
          {updateConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer la configuration
        </Button>
      </div>
    </div>
  );
}

// ======================== PAGES TAB ========================

function PagesTab({ pages }: { pages: VitrinePage[] }) {
  const createPage = useCreateVitrinePage();
  const updatePage = useUpdateVitrinePage();
  const deletePage = useDeleteVitrinePage();
  const [newPageTitle, setNewPageTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);

  const handleCreate = () => {
    if (!newPageTitle.trim()) return;
    const slug = newPageTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    createPage.mutate(
      { title: newPageTitle, slug, displayOrder: pages.length, visible: true },
      { onSuccess: () => { setNewPageTitle(""); setDialogOpen(false); } }
    );
  };

  // If editing sections for a page, show the section editor
  if (editingPageId) {
    const page = pages.find((p) => p.id === editingPageId);
    if (page) {
      return (
        <SectionEditor
          pageId={page.id}
          pageTitle={page.title}
          onBack={() => setEditingPageId(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pages ({pages.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Ajouter une page</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Titre de la page</Label>
                <Input value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)} placeholder="Ex: Nos activites" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={createPage.isPending}>
                {createPage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cr&eacute;er
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">{page.title}</p>
                  <p className="text-sm text-muted-foreground">/{page.slug} &middot; {page.sections?.length || 0} sections</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPageId(page.id)}
                >
                  <Edit2 className="mr-2 h-4 w-4" /> Sections
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updatePage.mutate({ id: page.id, dto: { ...page, visible: !page.visible } })}
                  title={page.visible ? "Masquer" : "Afficher"}
                >
                  {page.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { if (confirm("Supprimer cette page ?")) deletePage.mutate(page.id); }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">Aucune page</p>
        )}
      </div>
    </div>
  );
}

// ======================== ANNOUNCEMENTS TAB ========================

function AnnouncementsTab({ announcements }: { announcements: VitrineAnnouncement[] }) {
  const createAnn = useCreateVitrineAnnouncement();
  const updateAnn = useUpdateVitrineAnnouncement();
  const deleteAnn = useDeleteVitrineAnnouncement();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAnn, setEditAnn] = useState<VitrineAnnouncement | null>(null);
  const [form, setForm] = useState({ title: "", body: "", pinned: false });

  const handleCreate = () => {
    if (!form.title.trim()) return;
    createAnn.mutate(
      { title: form.title, body: form.body, pinned: form.pinned, published: true },
      { onSuccess: () => { setForm({ title: "", body: "", pinned: false }); setDialogOpen(false); } }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Annonces ({announcements.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nouvelle annonce</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle annonce</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Titre</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Contenu</Label>
                <RichTextEditor
                  content={form.body}
                  onChange={(html) => setForm({ ...form, body: html })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.pinned} onCheckedChange={(v) => setForm({ ...form, pinned: v })} />
                <Label>Epinglee (importante)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={createAnn.isPending}>
                {createAnn.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {announcements.map((ann) => (
          <Card key={ann.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{ann.title}</p>
                  {ann.pinned && <Badge variant="secondary">Important</Badge>}
                  {!ann.published && <Badge variant="outline">Brouillon</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(ann.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditAnn(ann)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { if (confirm("Supprimer cette annonce ?")) deleteAnn.mutate(ann.id); }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">Aucune annonce pour le moment</p>
        )}
      </div>

      {/* Edit Announcement Dialog */}
      {editAnn && (
        <EditAnnouncementDialog
          announcement={editAnn}
          onClose={() => setEditAnn(null)}
        />
      )}
    </div>
  );
}

function EditAnnouncementDialog({ announcement, onClose }: { announcement: VitrineAnnouncement; onClose: () => void }) {
  const updateAnn = useUpdateVitrineAnnouncement();
  const [title, setTitle] = useState(announcement.title);
  const [body, setBody] = useState(announcement.body || "");
  const [pinned, setPinned] = useState(announcement.pinned);
  const [published, setPublished] = useState(announcement.published);

  const handleSave = () => {
    updateAnn.mutate(
      { id: announcement.id, dto: { ...announcement, title, body, pinned, published } },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier l'annonce</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Titre</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Contenu</Label>
            <RichTextEditor content={body} onChange={setBody} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={pinned} onCheckedChange={setPinned} />
              <Label>Epinglee</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={published} onCheckedChange={setPublished} />
              <Label>Publiee</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave} disabled={updateAnn.isPending}>
            {updateAnn.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================== CONTACTS/MESSAGES TAB ========================

function ContactsTab() {
  const { data: contacts = [], isLoading } = useVitrineContacts();
  const markAsRead = useMarkContactAsRead();
  const [selectedContact, setSelectedContact] = useState<VitrineContact | null>(null);
  const [replyContact, setReplyContact] = useState<VitrineContact | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return !c.read;
    if (filter === "replied") return c.replied;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.read).length;

  const handleSelect = (contact: VitrineContact) => {
    setSelectedContact(contact);
    if (!contact.read) {
      markAsRead.mutate(contact.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Messages ({contacts.length})</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les messages</SelectItem>
              <SelectItem value="unread">Non lus</SelectItem>
              <SelectItem value="replied">Avec reponse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* Message List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {filtered.map((contact) => (
            <Card
              key={contact.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedContact?.id === contact.id ? "ring-2 ring-primary" : ""
              } ${!contact.read ? "border-l-4 border-l-primary bg-primary/5" : ""}`}
              onClick={() => handleSelect(contact)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${!contact.read ? "font-bold" : "font-medium"}`}>
                        {contact.name}
                      </p>
                      {!contact.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                    <p className={`mt-1 text-sm truncate ${!contact.read ? "font-semibold" : ""}`}>
                      {contact.subject}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{contact.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                    {contact.replied && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        <CheckCircle2 className="mr-1 h-3 w-3 text-green-600" /> Repondu
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                {filter === "all" ? "Aucun message recu" : filter === "unread" ? "Aucun message non lu" : "Aucun message avec reponse"}
              </p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div>
          {selectedContact ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{selectedContact.subject}</h4>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {selectedContact.name}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {selectedContact.email}</span>
                    </div>
                    {selectedContact.phone && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{selectedContact.phone}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(selectedContact.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap text-sm">{selectedContact.message}</p>
                </div>

                {selectedContact.replied && selectedContact.replyText && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Reponse envoyee le{" "}
                      {selectedContact.repliedAt
                        ? new Date(selectedContact.repliedAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })
                        : ""}
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-green-900">{selectedContact.replyText}</p>
                  </div>
                )}

                {!selectedContact.replied && (
                  <Button onClick={() => setReplyContact(selectedContact)} className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Repondre
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                <Mail className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm">Selectionnez un message pour le lire</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      {replyContact && (
        <ReplyDialog
          contact={replyContact}
          onClose={() => setReplyContact(null)}
        />
      )}
    </div>
  );
}

function ReplyDialog({ contact, onClose }: { contact: VitrineContact; onClose: () => void }) {
  const reply = useReplyToContact();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    reply.mutate(
      { id: contact.id, replyText: text },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Repondre a {contact.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Message original :</p>
            <p className="text-sm font-medium">{contact.subject}</p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{contact.message}</p>
          </div>
          <div>
            <Label>Votre reponse</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Ecrivez votre reponse ici..."
              autoFocus
            />
            <p className="mt-1 text-xs text-muted-foreground">
              La reponse sera envoyee par email a {contact.email}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSend} disabled={reply.isPending || !text.trim()}>
            {reply.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" /> Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
