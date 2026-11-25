export default function SectionView({ section }) {
  return (
    <div className="main-card">
      <div className="card-header">
        <div>
          <h1 className="page-title">{section.title}</h1>
          <p className="page-subtitle">Documentation Record</p>
        </div>
      </div>

    

            {/* Content ab yahan show hoga (HTML Support ke sath) */}
      <div 
        className="content-display" 
        dangerouslySetInnerHTML={{ __html: section.content || "No content available yet." }} 
      />

      {/* Message ab content ke bilkul neeche (end) mein aayega */}
      <div className="info-box" style={{ marginTop: "30px", marginBottom: "0" }}>
        <p>
          This document is securely served from the admin site. 
          Any updates must be made via the admin site.
        </p>
      </div>
    </div>
  );
}