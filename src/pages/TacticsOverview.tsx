import React, { useState } from "react";

type Category = "Anfall" | "Försvar" | "PP" | "BP" | "Övrigt";

interface Tactic {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: Category;
  image?: string; // base64
}

const categories: Category[] = ["Anfall", "Försvar", "PP", "BP", "Övrigt"];

const TacticsOverview: React.FC = () => {
  const [tactics, setTactics] = useState<Tactic[]>([]);
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
  // Spara taktik
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setTactics([
      ...tactics,
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
  // Dela taktik (kopiera till urklipp)
  const handleShare = (tactic: Tactic) => {
    const shareText = `Taktik: ${tactic.name}\nKategori: ${tactic.category}\nTaggar: ${tactic.tags.join(", ")}\nBeskrivning: ${tactic.description}`;
    navigator.clipboard.writeText(shareText);
    alert("Taktiken är kopierad till urklipp!");
  };
  return (
    <div className="tacticsOverviewRoot">
      <div className="tacticsOverviewContainer">
        <h1 className="tacticsOverviewTitle">Taktiker</h1>
        <form onSubmit={handleSave} className="tacticsOverviewForm">
          <div className="tacticsOverviewFormRow">
            <div className="tacticsOverviewFormCol">
              <label className="tacticsOverviewLabel" htmlFor="tactics-name">Namn:</label>
              <input
                id="tactics-name"
                className="tacticsOverviewInput"
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                title="Namn på taktik"
                placeholder="Ange namn"
              />
              <label className="tacticsOverviewLabel" htmlFor="tactics-description">Beskrivning:</label>
              <textarea
                id="tactics-description"
                className="tacticsOverviewTextarea"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                title="Beskrivning av taktik"
                placeholder="Ange beskrivning"
              />
              <label className="tacticsOverviewLabel" htmlFor="tactics-tags">Taggar (kommaseparerade):</label>
              <input
                id="tactics-tags"
                className="tacticsOverviewInput"
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                title="Taggar för taktik"
                placeholder="Ange taggar"
              />
              <label className="tacticsOverviewLabel" htmlFor="tactics-category">Kategori:</label>
              <select
                id="tactics-category"
                className="tacticsOverviewSelect"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                title="Kategori för taktik"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="tacticsOverviewFormCol">
              <label className="tacticsOverviewLabel" htmlFor="tactics-image">Whiteboard-bild:</label>
              <input
                id="tactics-image"
                className="tacticsOverviewFileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                title="Ladda upp whiteboard-bild"
              />
              {form.image && <img src={form.image} alt="Whiteboard" className="tacticsOverviewImage" />}
            </div>
          </div>
          <button type="submit" className="tacticsOverviewButton">Spara taktik</button>
        </form>
        <h2 className="tacticsOverviewSavedTitle">Sparade taktiker</h2>
        {tactics.length === 0 && <p className="tacticsOverviewSavedEmpty">Du har ännu inte sparat några taktiker.</p>}
        <div className="tacticsOverviewGrid">
          {tactics.map(tac => (
            <div key={tac.id} className="tacticsOverviewCard">
              <h3 className="tacticsOverviewCardTitle">{tac.name}</h3>
              <div className="tacticsOverviewCardMeta"><b>Kategori:</b> {tac.category}</div>
              <div className="tacticsOverviewCardMeta"><b>Taggar:</b> {tac.tags.join(", ")}</div>
              <div className="tacticsOverviewCardMeta"><b>Beskrivning:</b> {tac.description}</div>
              {tac.image && <img src={tac.image} alt="Whiteboard" className="tacticsOverviewCardImage" />}
              <button onClick={() => handleShare(tac)} className="tacticsOverviewCardButton">Dela till laget</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TacticsOverview;
