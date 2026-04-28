import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import MapPicker from "../Component/MapPicker";

const inputStyle = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid var(--border)",
  padding: "9px 12px",
  fontSize: 13,
  fontFamily: "inherit",
  background: "var(--g5)",
  outline: "none",
  boxSizing: "border-box",
  color: "var(--txt)",
};

function Label({ children, required }) {
  return (
    <label
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "var(--txt3)",
        letterSpacing: "0.03em",
        marginBottom: 6,
        display: "block",
      }}
    >
      {children} {required && <span style={{ color: "#e05050" }}>*</span>}
    </label>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
        paddingBottom: 12,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "rgba(95,139,76,0.12)",
          border: "1px solid rgba(95,139,76,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className={`bi ${icon}`}
          style={{ color: "var(--g2)", fontSize: 15 }}
        />
      </div>
      <span
        className="syne-h1"
        style={{ fontSize: 14, color: "var(--txt)", letterSpacing: "0.01em" }}
      >
        {title}
      </span>
    </div>
  );
}

function CreateDonation() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [photos, setPhotos] = useState([]);
  const [coords, setCoords] = useState({ lat: 3.5952, lng: 98.6722 });
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    quantity: "",
    quantity_unit: "",
    pickup_address: "",
    pickup_city: "",
    pickup_notes: "",
    pickup_start_time: "",
    pickup_end_time: "",
    expired_at: "",
    is_halal: "",
    allergen_notes: "",
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMsg("error:Maksimal 5 foto");
      return;
    }
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") formData.append(k, v);
      });
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      photos.forEach((p) => formData.append("photos", p));
      await api.post("/donations", formData);
      setMsg("success");
      setTimeout(() => navigate("/donations"), 1500);
    } catch (err) {
      setMsg("error:" + (err.response?.data?.msg || "Gagal membuat donasi"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="outfit"
      style={{ background: "var(--bg)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--surf2)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 24px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="grid-detail-responsive"
          style={{ position: "absolute", inset: 0, borderRadius: 0 }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className="bi-plus-circle"
              style={{
                fontSize: 35,
                color: "var(--g1)",
                lineHeight: 1,
              }}
            />

            <h4
              className="syne-h1 mb-0"
              style={{
                color: "var(--txt)",
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              Buat Donasi Baru
            </h4>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--txt3)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: 14 }} /> Kembali
          </button>
        </div>
      </div>

      {/* Toast */}
      {msg === "success" && (
        <div style={{ margin: "16px auto", maxWidth: 820, padding: "0 20px" }}>
          <div
            style={{
              background: "rgba(95,139,76,0.12)",
              border: "1px solid rgba(95,139,76,0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              color: "var(--g2)",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <i className="bi bi-check-circle-fill" /> Donasi berhasil dibuat!
            Mengalihkan...
          </div>
        </div>
      )}
      {msg.startsWith("error:") && (
        <div style={{ margin: "16px auto", maxWidth: 820, padding: "0 20px" }}>
          <div
            style={{
              background: "rgba(224,80,80,0.1)",
              border: "1px solid rgba(224,80,80,0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              color: "#e05050",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <i className="bi bi-exclamation-circle-fill" />{" "}
            {msg.replace("error:", "")}
          </div>
        </div>
      )}

      {/* Form */}
      <div
        style={{ maxWidth: 820, margin: "0 auto", padding: "24px 20px 48px" }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ── Informasi Donasi ── */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "var(--shadow)",
              }}
            >
              <SectionTitle icon="bi-basket2" title="Informasi Donasi" />

              <div style={{ marginBottom: 14 }}>
                <Label required>Judul Donasi</Label>
                <input
                  className="input-green"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="cth: Nasi Kotak Sisa Acara"
                  style={{ ...inputStyle }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <Label>Deskripsi</Label>
                <textarea
                  className="input-green"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Jelaskan kondisi makanan, isi, dll..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <Label required>Kategori</Label>
                <select
                  className="input-green"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle }}
                >
                  <option value="">Pilih kategori...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon_emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <Label required>Jumlah</Label>
                  <input
                    className="input-green"
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="cth: 10"
                    style={{ ...inputStyle }}
                  />
                </div>
                <div>
                  <Label required>Satuan</Label>
                  <input
                    className="input-green"
                    type="text"
                    name="quantity_unit"
                    value={form.quantity_unit}
                    onChange={handleChange}
                    required
                    placeholder="porsi, kg, bungkus"
                    style={{ ...inputStyle }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <Label>Halal?</Label>
                  <select
                    className="input-green"
                    name="is_halal"
                    value={form.is_halal}
                    onChange={handleChange}
                    style={{ ...inputStyle }}
                  >
                    <option value="">Tidak Tahu</option>
                    <option value="true">✅ Halal</option>
                    <option value="false">❌ Tidak Berlabel Halal</option>
                  </select>
                </div>
                <div>
                  <Label required>Batas Waktu Ambil</Label>
                  <input
                    className="input-green"
                    type="datetime-local"
                    name="expired_at"
                    value={form.expired_at}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle }}
                  />
                </div>
              </div>

              <div>
                <Label>Catatan Alergen</Label>
                <input
                  className="input-green"
                  type="text"
                  name="allergen_notes"
                  value={form.allergen_notes}
                  onChange={handleChange}
                  placeholder="cth: mengandung kacang, seafood..."
                  style={{ ...inputStyle }}
                />
              </div>
            </div>

            {/* ── Lokasi Pickup ── */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "var(--shadow)",
              }}
            >
              <SectionTitle icon="bi-geo-alt" title="Lokasi Pickup" />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <Label required>Alamat Lengkap</Label>
                  <input
                    className="input-green"
                    type="text"
                    name="pickup_address"
                    value={form.pickup_address}
                    onChange={handleChange}
                    required
                    placeholder="cth: Jl. Sudirman No. 123"
                    style={{ ...inputStyle }}
                  />
                </div>
                <div>
                  <Label required>Kota</Label>
                  <input
                    className="input-green"
                    type="text"
                    name="pickup_city"
                    value={form.pickup_city}
                    onChange={handleChange}
                    required
                    placeholder="cth: Medan"
                    style={{ ...inputStyle }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Label>Tandai Lokasi di Peta</Label>
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    marginBottom: 8,
                  }}
                >
                  <MapPicker
                    lat={coords.lat}
                    lng={coords.lng}
                    onChange={(pos) => setCoords(pos)}
                    onAddress={(result) => {
                      setForm((prev) => ({
                        ...prev,
                        pickup_address:
                          result.address_line || prev.pickup_address,
                        pickup_city: result.city || prev.pickup_city,
                      }));
                    }}
                    searchQuery={form.pickup_address}
                  />
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "var(--g5)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "5px 12px",
                  }}
                >
                  <i
                    className="bi bi-geo"
                    style={{ color: "var(--g2)", fontSize: 12 }}
                  />
                  <small
                    style={{
                      fontSize: 11,
                      color: "var(--txt3)",
                      fontFamily: "monospace",
                    }}
                  >
                    {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </small>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <Label>Jam Mulai Pickup</Label>
                  <input
                    className="input-green"
                    type="time"
                    name="pickup_start_time"
                    value={form.pickup_start_time}
                    onChange={handleChange}
                    style={{ ...inputStyle }}
                  />
                </div>
                <div>
                  <Label>Jam Selesai Pickup</Label>
                  <input
                    className="input-green"
                    type="time"
                    name="pickup_end_time"
                    value={form.pickup_end_time}
                    onChange={handleChange}
                    style={{ ...inputStyle }}
                  />
                </div>
              </div>

              <div>
                <Label>Catatan Pickup</Label>
                <textarea
                  className="input-green"
                  name="pickup_notes"
                  rows={2}
                  value={form.pickup_notes}
                  onChange={handleChange}
                  placeholder="cth: Hubungi dulu sebelum datang, parkir di depan"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>

            {/* ── Foto ── */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "var(--shadow)",
              }}
            >
              <SectionTitle icon="bi-images" title="Foto Donasi (Maks. 5)" />

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "28px 20px",
                  borderRadius: 12,
                  cursor: "pointer",
                  border: "2px dashed var(--border)",
                  background: "var(--g5)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--g2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                <i
                  className="bi bi-cloud-upload"
                  style={{
                    fontSize: 28,
                    color: "var(--txt4)",
                    marginBottom: 8,
                  }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--txt3)",
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  Klik untuk upload foto
                </p>
                <small
                  style={{ fontSize: 11, color: "var(--txt4)", marginTop: 4 }}
                >
                  JPG, PNG · Maks 5MB per foto · Maks 5 foto
                </small>
              </label>

              {photos.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 14,
                    flexWrap: "wrap",
                  }}
                >
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img
                        src={URL.createObjectURL(p)}
                        alt={`preview-${i}`}
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "cover",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 5,
                          left: 5,
                          background: "rgba(11,21,9,0.7)",
                          borderRadius: 20,
                          padding: "1px 7px",
                          fontSize: 9,
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {i + 1}/{photos.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-green-gradient"
              style={{
                border: "none",
                borderRadius: 12,
                padding: "14px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: loading ? 0.75 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {loading ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm"
                    style={{ width: 16, height: 16, borderWidth: 2 }}
                  />{" "}
                  Menyimpan...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle" style={{ fontSize: 18 }} />{" "}
                  Buat Donasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDonation;
