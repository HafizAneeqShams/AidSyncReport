import { useState } from "react";

const SUGGESTIONS = ["Abstract", "Literature Review", "Technical Documents", "Gantt Chart"];

export default function AddSection({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");

  const submit = () => {
    if (!title.trim()) return alert("Enter a title");
    onAdd(title.trim());
  };

  return (
    <div>
      <h1>Add New Section</h1>

      <input
        type="text"
        placeholder="Section title (e.g. Abstract)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "15px" }}
      />

      <p style={{ marginBottom: "10px", opacity: 0.8 }}>Quick picks:</p>
      <div className="btn-row" style={{ flexWrap: "wrap" }}>
        {SUGGESTIONS.map((s) => (
          <button key={s} className="btn outline" onClick={() => setTitle(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="btn-row" style={{ marginTop: "25px" }}>
        <button className="btn" onClick={submit}>✅ Create</button>
        <button className="btn outline" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}