import React, { useState } from "react";
import styles from "./ExercisesOverview.module.css";

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
    <div className={styles.exercisesOverviewContainer}>
      <div className={styles.exercisesOverviewCard}>
        <h1 className={styles.exercisesOverviewTitle}>Övningar</h1>
        <form onSubmit={handleSave} className={styles.exercisesOverviewForm}>
          <div className={styles.exercisesOverviewFlexRow}>
            <div className={styles.flexOne}>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="exercise-input"
                placeholder="Ange övningsnamn"
                title="Namn på övningen"
              />
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className={styles.exerciseInput}
                title="Namn på övningen"
                placeholder="Ange övningsnamn"
              />
                            <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className={styles.exerciseTextarea}
                title="Beskrivning av övningen"
                placeholder="Beskriv övningen här"
              />
              <label className={styles.exerciseLabel}>Taggar (kommaseparerade):</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className={styles.exerciseTagsInput}
                title="Taggar för övningen, kommaseparerade"
                placeholder="Exempel: passning, skott, rörelse"
              />
              <label className={styles.exerciseCategoryLabel}>Kategori:</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                className={styles.exerciseSelect}
                title="Välj kategori för övningen"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className={styles.exerciseImageContainer}>
              <label className={styles.exerciseImageLabel}>Whiteboard-bild:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.exerciseImageInput}
                title="Ladda upp en whiteboard-bild"
                placeholder="Välj bild"
              />
              {form.image && <img src={form.image} alt="Whiteboard" className={styles.exerciseImagePreview} />}
            </div>
          </div>
          <button type="submit" className={styles.saveExerciseButton}>Spara övning</button>
        </form>
        <h2 className={styles.savedExercisesTitle}>Sparade övningar</h2>
        {exercises.length === 0 && <p className={styles.noExercisesText}>Du har ännu inte sparat några övningar.</p>}
        <div className={styles.exercisesGrid}>
          {exercises.map(ex => (
            <div key={ex.id} className={styles.exerciseCard}>
              <h3 className={styles.exerciseCardTitle}>{ex.name}</h3>
              <div className={styles.exerciseCardCategory}><b>Kategori:</b> {ex.category}</div>
              <div className={styles.exerciseCardTags}><b>Taggar:</b> {ex.tags.join(", ")}</div>
              <div className={styles.exerciseCardDescription}><b>Beskrivning:</b> {ex.description}</div>
              {ex.image && <img src={ex.image} alt="Whiteboard" className={styles.exerciseCardImage} />}
              <button onClick={() => handleShare(ex)} className={styles.exerciseShareButton}>Dela till laget</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisesOverview;
