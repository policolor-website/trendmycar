"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { User, Mail, Phone, Calendar, Car, MapPin, Clock, FileText, LogOut, CheckCircle2, XCircle, Clock as ClockIcon, Camera, Trash2, Plus, Star, Award, TrendingUp, Route } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferred_vehicle: string | null;
  preferred_language: string | null;
  created_at: string;
}

interface SavedLocation {
  id: string;
  label: string;
  address: string;
}

interface Booking {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string | null;
  pickup_time: string | null;
  vehicle: string;
  passengers: string;
  extra_info: string | null;
  distance: string | null;
  duration: string | null;
  price: number | null;
  currency: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { labelKey: string; color: string; icon: any }> = {
  pending: { labelKey: "statusPending", color: "text-yellow-400 bg-yellow-400/10", icon: ClockIcon },
  confirmed: { labelKey: "statusConfirmed", color: "text-green-400 bg-green-400/10", icon: CheckCircle2 },
  completed: { labelKey: "statusCompleted", color: "text-blue-400 bg-blue-400/10", icon: CheckCircle2 },
  cancelled: { labelKey: "statusCancelled", color: "text-red-400 bg-red-400/10", icon: XCircle },
};

const vehicleOptions = [
  { value: "", labelKey: "noPreference" },
  { value: "Mercedes S-Class", label: "Mercedes S-Class" },
  { value: "Mercedes E-Class", label: "Mercedes E-Class" },
  { value: "Mercedes V-Class", label: "Mercedes V-Class" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
  { value: "zh", label: "中文" },
];

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tAuth = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPrefForm, setShowPrefForm] = useState(false);
  const [prefForm, setPrefForm] = useState({ preferred_vehicle: "", preferred_language: "en" });
  const [savingPref, setSavingPref] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);
  const [showLocForm, setShowLocForm] = useState(false);
  const [locForm, setLocForm] = useState({ label: "", address: "" });
  const [savingLoc, setSavingLoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/checkout");
      return;
    }
    setUser(session.user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setProfile(profileData);
    setEditForm({
      full_name: profileData?.full_name || "",
      phone: profileData?.phone || "",
    });
    setPrefForm({
      preferred_vehicle: profileData?.preferred_vehicle || "",
      preferred_language: profileData?.preferred_language || "en",
    });

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    setBookings(bookingsData || []);

    const { data: locData } = await supabase
      .from("saved_locations")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });
    setSavedLocations(locData || []);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editForm.full_name, phone: editForm.phone })
      .eq("id", user.id);
    if (!error) {
      setProfile({ ...profile!, full_name: editForm.full_name, phone: editForm.phone });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;
      await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
      setProfile({ ...profile!, avatar_url: avatarUrl });
    }
    setUploadingAvatar(false);
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
    setProfile({ ...profile!, avatar_url: null });
  };

  const handleSavePreferences = async () => {
    setSavingPref(true);
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_vehicle: prefForm.preferred_vehicle, preferred_language: prefForm.preferred_language })
      .eq("id", user.id);
    if (!error) {
      setProfile({ ...profile!, preferred_vehicle: prefForm.preferred_vehicle, preferred_language: prefForm.preferred_language });
      setShowPrefForm(false);
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 3000);
    }
    setSavingPref(false);
  };

  const handleSaveLocation = async () => {
    if (!locForm.label || !locForm.address || !user) return;
    if (savedLocations.length >= 5) return;
    setSavingLoc(true);
    const { data, error } = await supabase
      .from("saved_locations")
      .insert({ user_id: user.id, label: locForm.label, address: locForm.address })
      .select()
      .single();
    if (!error && data) {
      setSavedLocations([...savedLocations, data]);
      setLocForm({ label: "", address: "" });
      setShowLocForm(false);
    }
    setSavingLoc(false);
  };

  const handleDeleteLocation = async (id: string) => {
    await supabase.from("saved_locations").delete().eq("id", id);
    setSavedLocations(savedLocations.filter((l) => l.id !== id));
  };

  // Calculate stats
  const totalDistance = bookings.reduce((sum, b) => {
    const match = b.distance?.match(/[\d.]+/);
    return sum + (match ? parseFloat(match[0]) : 0);
  }, 0);

  const vehicleHistory = bookings.reduce((acc, b) => {
    if (b.vehicle) {
      acc[b.vehicle] = (acc[b.vehicle] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const upcomingBookings = bookings.filter((b) => {
    if (b.status !== "confirmed") return false;
    if (!b.pickup_date) return false;
    const pickupDate = new Date(b.pickup_date);
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return pickupDate >= now && pickupDate <= weekLater;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-ink pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">{t("title")}</h1>
            <p className="text-ash">{t("welcome")}, {profile?.full_name || user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-ash hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
          >
            <LogOut size={16} /> {tNav("logout")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Profile card with avatar */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{t("profile")}</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-ash hover:text-white transition-colors"
                >
                  {t("edit")}
                </button>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <User size={32} className="text-white/40" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
                  aria-label={t("changePhoto")}
                >
                  <Camera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{profile?.full_name || user.email}</p>
                <p className="text-xs text-white/50 mt-1">
                  {t("memberSince")} {profile?.created_at ? formatDate(profile.created_at) : "—"}
                </p>
                {profile?.avatar_url && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="text-xs text-ash hover:text-red-400 transition-colors mt-1"
                  >
                    {t("removePhoto")}
                  </button>
                )}
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tAuth("fullName")}</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{tAuth("phone")}</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-white text-ink font-semibold rounded-lg py-2.5 text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? t("saving") : t("save")}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2.5 text-sm text-ash hover:text-white border border-white/10 rounded-lg transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-white/40 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-white/50 uppercase tracking-wide">{tAuth("email")}</p>
                    <p className="text-sm text-white truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-white/40 shrink-0" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">{tAuth("phone")}</p>
                    <p className="text-sm text-white">{profile?.phone || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats card */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">{t("overview")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-ash">{t("totalBookings")}</span>
                <span className="font-display text-2xl font-bold text-white">{bookings.length}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-ash flex items-center gap-2">
                  <Route size={14} className="text-white/40" />
                  {t("totalDistance")}
                </span>
                <span className="font-display text-2xl font-bold text-white">
                  {totalDistance.toFixed(0)} <span className="text-sm text-ash">{t("km")}</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-ash">{t("completed")}</span>
                <span className="font-display text-2xl font-bold text-blue-400">
                  {bookings.filter((b) => b.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-ash">{t("totalSpent")}</span>
                <span className="font-display text-2xl font-bold text-white">
                  €{bookings.reduce((sum, b) => sum + (b.price || 0), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick action + Loyalty */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white mb-3">{t("newBooking")}</h2>
                <p className="text-sm text-ash mb-4">{t("newBookingDesc")}</p>
              </div>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-white text-ink font-semibold rounded-lg py-3 hover:bg-white/90 transition-colors"
              >
                {t("bookNow")} <Car size={16} />
              </Link>
            </div>

            {/* Loyalty badge */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Award size={20} className="text-white/60" />
                </div>
                <div>
                  <h3 className="font-display text-sm text-white font-bold">{t("loyaltyProgram")}</h3>
                  <span className="inline-block text-[10px] font-bold tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full mt-1">
                    {t("loyaltyComingSoon")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-ash leading-relaxed">{t("loyaltyDesc")}</p>
            </div>
          </div>
        </div>

        {/* Preferences + Saved Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Preferences */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{t("preferences")}</h2>
              {!showPrefForm && (
                <button
                  onClick={() => setShowPrefForm(true)}
                  className="text-xs text-ash hover:text-white transition-colors"
                >
                  {t("edit")}
                </button>
              )}
            </div>

            {prefSaved && (
              <div className="mb-4 text-xs text-green-400 bg-green-400/10 rounded-lg px-4 py-2">
                {t("preferencesSaved")}
              </div>
            )}

            {showPrefForm ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("preferredVehicle")}</label>
                  <select
                    value={prefForm.preferred_vehicle}
                    onChange={(e) => setPrefForm({ ...prefForm, preferred_vehicle: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                  >
                    {vehicleOptions.map((v) => (
                      <option key={v.value} value={v.value} className="bg-ink">
                        {v.label || t(v.labelKey as any)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("preferredLanguage")}</label>
                  <select
                    value={prefForm.preferred_language}
                    onChange={(e) => setPrefForm({ ...prefForm, preferred_language: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                  >
                    {languageOptions.map((l) => (
                      <option key={l.value} value={l.value} className="bg-ink">
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePreferences}
                    disabled={savingPref}
                    className="flex-1 bg-white text-ink font-semibold rounded-lg py-2.5 text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {savingPref ? t("saving") : t("savePreferences")}
                  </button>
                  <button
                    onClick={() => setShowPrefForm(false)}
                    className="px-4 py-2.5 text-sm text-ash hover:text-white border border-white/10 rounded-lg transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Car size={18} className="text-white/40 shrink-0" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">{t("preferredVehicle")}</p>
                    <p className="text-sm text-white">{profile?.preferred_vehicle || t("noPreference")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User size={18} className="text-white/40 shrink-0" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">{t("preferredLanguage")}</p>
                    <p className="text-sm text-white">
                      {languageOptions.find((l) => l.value === profile?.preferred_language)?.label || "English"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Locations */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{t("savedLocations")}</h2>
              {!showLocForm && savedLocations.length < 5 && (
                <button
                  onClick={() => setShowLocForm(true)}
                  className="text-xs text-ash hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> {t("addLocation")}
                </button>
              )}
            </div>

            {showLocForm && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("locationLabel")}</label>
                  <input
                    type="text"
                    value={locForm.label}
                    onChange={(e) => setLocForm({ ...locForm, label: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                    placeholder="Home"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wide mb-2 block">{t("locationAddress")}</label>
                  <input
                    type="text"
                    value={locForm.address}
                    onChange={(e) => setLocForm({ ...locForm, address: e.target.value })}
                    className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-electric/50 focus:outline-none transition-colors"
                    placeholder="Munich Airport, Germany"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveLocation}
                    disabled={savingLoc || !locForm.label || !locForm.address}
                    className="flex-1 bg-white text-ink font-semibold rounded-lg py-2.5 text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {savingLoc ? t("saving") : t("saveLocation")}
                  </button>
                  <button
                    onClick={() => { setShowLocForm(false); setLocForm({ label: "", address: "" }); }}
                    className="px-4 py-2.5 text-sm text-ash hover:text-white border border-white/10 rounded-lg transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}

            {savedLocations.length === 0 && !showLocForm ? (
              <p className="text-sm text-ash text-center py-8">{t("noLocations")}</p>
            ) : (
              <div className="space-y-3">
                {savedLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin size={16} className="text-white/40 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium">{loc.label}</p>
                        <p className="text-xs text-ash truncate">{loc.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="text-ash hover:text-red-400 transition-colors shrink-0"
                      aria-label={t("deleteLocation")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {savedLocations.length >= 5 && (
                  <p className="text-xs text-white/40 text-center pt-2">{t("maxLocations")}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle History */}
        {Object.keys(vehicleHistory).length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-white/40" /> {t("vehicleHistory")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(vehicleHistory).map(([vehicle, count]) => (
                <div key={vehicle} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Car size={18} className="text-white/40" />
                    <span className="text-sm text-white">{vehicle}</span>
                  </div>
                  <span className="text-sm text-ash">
                    {count} <span className="text-xs">{t("timesUsed")}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Rides */}
        {upcomingBookings.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-white/40" /> {t("upcomingRides")}
            </h2>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-white/40" />
                    <div>
                      <p className="text-sm text-white">{booking.origin} → {booking.destination}</p>
                      <p className="text-xs text-ash mt-1">{booking.pickup_date} · {booking.pickup_time}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> {t("statusConfirmed")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings history */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold text-white mb-6">{t("bookingHistory")}</h2>

          {bookings.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Car size={40} className="text-white/20 mx-auto mb-4" />
              <p className="text-ash mb-2">{t("noBookings")}</p>
              <Link href="/booking" className="text-sm text-white hover:underline">
                {t("bookFirstRide")} →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <div key={booking.id} className="glass rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-white/40 mt-0.5" />
                        <div>
                          <p className="text-sm text-white font-medium">
                            {booking.origin} → {booking.destination}
                          </p>
                          <p className="text-xs text-stone mt-1">
                            {t("bookedOn")} {formatDate(booking.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                          <StatusIcon size={12} /> {t(status.labelKey)}
                        </span>
                        <span className="font-display text-xl font-bold text-white">
                          €{booking.price}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Calendar size={11} /> {t("pickupDate")}
                        </p>
                        <p className="text-sm text-white">{booking.pickup_date || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Clock size={11} /> {t("pickupTime")}
                        </p>
                        <p className="text-sm text-white">{booking.pickup_time || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Car size={11} /> {t("vehicle")}
                        </p>
                        <p className="text-sm text-white">{booking.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("distance")}</p>
                        <p className="text-sm text-white">{booking.distance} · {booking.duration}</p>
                      </div>
                    </div>

                    {booking.extra_info && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{t("extraInfo")}</p>
                        <p className="text-sm text-ash">{booking.extra_info}</p>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                        <button className="inline-flex items-center gap-2 text-xs text-ash hover:text-white transition-colors">
                          <FileText size={14} /> {t("downloadInvoice")}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
