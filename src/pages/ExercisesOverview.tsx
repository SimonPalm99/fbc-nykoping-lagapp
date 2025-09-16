import React, { useState } from "react";

type Category = "Anfall" | "Försvar" | "Uppvärmning" | "Teknik" | "Övrigt";

interface Exercise {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: Category;
  image?: string; // base64
}

const categories: Category[] = ["Anfall", "Försvar", "Uppvärmning", "Teknik", "Övrigt"];

const ExercisesOverview: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    category: "Anfall" as Category,
    image: ""
  });
  // Hantera bilduppladdning
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => ({ ...f, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  // Spara övning
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        category: form.category,
        image: form.image
      }
    ]);
    setForm({ name: "", description: "", tags: "", category: "Anfall", image: "" });
  };
  // Dela övning (kopiera till urklipp)
  const handleShare = (exercise: Exercise) => {
    const shareText = `Övning: ${exercise.name}\nKategori: ${exercise.category}\nTaggar: ${exercise.tags.join(", ")}\nBeskrivning: ${exercise.description}`;
    navigator.clipboard.writeText(shareText);
    alert("Övningen är kopierad till urklipp!");
  };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #101a10 60%, #22c55e 100%)", padding: "2rem 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem", borderRadius: 32, boxShadow: "0 8px 32px #000a", background: "rgba(20,32,20,0.85)", border: "2px solid #22c55e" }}>
        <h1 style={{ color: "#22c55e", fontWeight: 900, fontSize: "2.4rem", letterSpacing: "2px", textShadow: "0 2px 12px #000", marginBottom: 32 }}>Övningar</h1>
        <form onSubmit={handleSave} style={{ marginBottom: 32, background: "rgba(255,255,255,0.08)", padding: 24, borderRadius: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#fff", fontWeight: 700 }}>Namn:</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={{ width: "100%", padding: 10, borderRadius: 8, border: "2px solid #22c55e", marginBottom: 12, fontSize: "1.1rem" }} />
              <label style={{ color: "#fff", fontWeight: 700 }}>Beskrivning:</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ width: "100%", padding: 10, borderRadius: 8, border: "2px solid #22c55e", marginBottom: 12, fontSize: "1.1rem" }} />
              <label style={{ color: "#fff", fontWeight: 700 }}>Taggar (kommaseparerade):</label>
              <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "2px solid #22c55e", marginBottom: 12, fontSize: "1.1rem" }} />
              <label style={{ color: "#fff", fontWeight: 700 }}>Kategori:</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "2px solid #22c55e", marginBottom: 12, fontSize: "1.1rem" }}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#fff", fontWeight: 700 }}>Whiteboard-bild:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 12 }} />
              {form.image && <img src={form.image} alt="Whiteboard" style={{ maxWidth: "100%", borderRadius: 12, marginTop: 8 }} />}
            </div>
          </div>
          <button type="submit" style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, fontSize: "1.1rem", marginTop: 16, boxShadow: "0 2px 8px #22c55e88", cursor: "pointer" }}>Spara övning</button>
        </form>
        <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.3rem", marginBottom: 16 }}>Sparade övningar</h2>
        {exercises.length === 0 && <p style={{ color: "#aaa" }}>Du har ännu inte sparat några övningar.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {exercises.map(ex => (
            <div key={ex.id} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px #22c55e33", color: "#fff" }}>
              <h3 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem" }}>{ex.name}</h3>
              <div style={{ marginBottom: 8 }}><b>Kategori:</b> {ex.category}</div>
              <div style={{ marginBottom: 8 }}><b>Taggar:</b> {ex.tags.join(", ")}</div>
              <div style={{ marginBottom: 8 }}><b>Beskrivning:</b> {ex.description}</div>
              {ex.image && <img src={ex.image} alt="Whiteboard" style={{ maxWidth: "100%", borderRadius: 12, margin: "12px 0" }} />}
              <button onClick={() => handleShare(ex)} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 700, fontSize: "1rem", marginTop: 8, boxShadow: "0 1px 4px #22c55e88", cursor: "pointer" }}>Dela till laget</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisesOverview;
