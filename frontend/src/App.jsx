import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const habits = [
  { id:1, icon:"🌅", title:"Despertar Temprano", category:"Energía", desc:"Levantarse antes de las 6 AM activa tu metabolismo y te da ventaja sobre el día.", color:"#FF6B35", accent:"#FFF0E8", benefit:"Más productividad", time:"5:30 AM", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:2, icon:"💧", title:"Hidratación Diaria", category:"Salud", desc:"Tomar 2 litros de agua al día mejora la concentración y la salud en general.", color:"#3B82F6", accent:"#EBF3FF", benefit:"Piel y mente clara", time:"Todo el día", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:3, icon:"🧘", title:"Meditación", category:"Mente", desc:"10 minutos de meditación al día reducen el estrés y mejoran el enfoque mental.", color:"#8B5CF6", accent:"#F0EAFF", benefit:"Paz interior", time:"10 min/día", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:4, icon:"📚", title:"Leer a Diario", category:"Conocimiento", desc:"20 páginas al día equivalen a 12 libros al año. El conocimiento compuesto es poderoso.", color:"#10B981", accent:"#E6FAF4", benefit:"Vocabulario y sabiduría", time:"20 páginas", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:5, icon:"🏃", title:"Ejercicio Físico", category:"Cuerpo", desc:"30 minutos de movimiento diario mejoran el estado de ánimo y la longevidad.", color:"#EF4444", accent:"#FFEBEB", benefit:"Vitalidad", time:"30 min/día", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:6, icon:"😴", title:"Sueño de Calidad", category:"Descanso", desc:"Dormir 7-8 horas con un horario fijo restaura el cuerpo y consolida la memoria.", color:"#6366F1", accent:"#EEEFFF", benefit:"Recuperación total", time:"7-8 horas", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:7, icon:"🥗", title:"Alimentación Consciente", category:"Nutrición", desc:"Comer sin distracciones y masticar bien mejora la digestión y evita el exceso.", color:"#F59E0B", accent:"#FEF8E7", benefit:"Digestión óptima", time:"Cada comida", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:8, icon:"📝", title:"Journaling", category:"Reflexión", desc:"Escribir tus pensamientos cada mañana o noche aclara la mente y reduce la ansiedad.", color:"#EC4899", accent:"#FDE8F3", benefit:"Claridad mental", time:"10 min/día", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:9, icon:"📵", title:"Detox Digital", category:"Bienestar", desc:"1 hora sin pantallas antes de dormir mejora el sueño y la calidad de atención.", color:"#14B8A6", accent:"#E6FAFA", benefit:"Descanso profundo", time:"1h antes de dormir", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
  { id:10, icon:"🙏", title:"Gratitud Diaria", category:"Actitud", desc:"Anotar 3 cosas por las que estás agradecido reconfigura el cerebro hacia el optimismo.", color:"#D97706", accent:"#FEF6E4", benefit:"Mentalidad positiva", time:"5 min/día", pdf:"https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf" },
];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [showPDF, setShowPDF] = useState(false);

  const open = (h) => { setSelected(h); setShowPDF(false); };
  const close = () => { setSelected(null); setShowPDF(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100%; }
        body { font-family: 'DM Sans', sans-serif; background: #F5F3EE; }
        .card { transition: transform 0.22s ease, box-shadow 0.22s ease; cursor: pointer; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 18px 45px rgba(0,0,0,0.13) !important; }
        .pdfbtn:hover { opacity: 0.88; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <div style={{ width:"100%", minHeight:"100vh", background:"#F5F3EE", padding:"0 0 60px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", padding:"56px 20px 44px" }}>
          <span style={{ display:"inline-block", background:"#1A1A1A", color:"#F5F3EE", fontSize:"10px", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", padding:"5px 14px", borderRadius:"100px", marginBottom:"20px" }}>
            Sistema de Vida
          </span>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(32px,5vw,64px)", fontWeight:800, color:"#1A1A1A", lineHeight:1.08, marginBottom:"16px" }}>
            10 Hábitos que<br/>
            <span style={{ color:"#FF6B35" }}>Transforman</span> tu Vida
          </h1>
          <p style={{ fontSize:"15px", color:"#777", lineHeight:1.7, maxWidth:"420px", margin:"0 auto" }}>
            Pequeñas acciones consistentes producen resultados extraordinarios. Explora cada hábito.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"20px", maxWidth:"1180px", margin:"0 auto", padding:"0 20px" }}>
          {habits.map((h, i) => (
            <div key={h.id} className="card" onClick={() => open(h)}
              style={{ background:"#fff", borderRadius:"20px", overflow:"hidden", boxShadow:"0 3px 16px rgba(0,0,0,0.07)", animation:`fadeUp 0.45s ease ${i*0.06}s both`, position:"relative" }}>
              <div style={{ background:h.accent, padding:"22px 22px 18px", display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"34px", lineHeight:1 }}>{h.icon}</span>
                <span style={{ color:h.color, fontSize:"10px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{h.category}</span>
              </div>
              <div style={{ padding:"0 22px 22px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:700, color:"#1A1A1A", margin:"14px 0 8px" }}>{h.title}</h3>
                <p style={{ fontSize:"13px", color:"#888", lineHeight:1.65, marginBottom:"16px" }}>{h.desc}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ background:h.accent, color:h.color, fontSize:"11px", fontWeight:600, padding:"4px 11px", borderRadius:"100px" }}>⏱ {h.time}</span>
                  <span style={{ color:h.color, fontSize:"13px", fontWeight:600 }}>Ver más →</span>
                </div>
              </div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:h.color }} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div onClick={close} style={{ position:"fixed", inset:0, background:"rgba(10,10,10,0.5)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"16px" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#fff", borderRadius:"22px", width:"100%", maxWidth:"500px", maxHeight:"88vh", overflow:"hidden", display:"flex", flexDirection:"column", animation:"modalIn 0.28s ease", boxShadow:"0 30px 80px rgba(0,0,0,0.22)" }}>

            {/* Modal Header */}
            <div style={{ background:selected.accent, padding:"24px", display:"flex", alignItems:"flex-start", gap:"14px", position:"relative" }}>
              <span style={{ fontSize:"46px", lineHeight:1, flexShrink:0 }}>{selected.icon}</span>
              <div style={{ flex:1 }}>
                <span style={{ color:selected.color, fontSize:"10px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>{selected.category}</span>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"22px", fontWeight:800, color:"#1A1A1A" }}>{selected.title}</h2>
              </div>
              <button onClick={close} style={{ background:"rgba(0,0,0,0.09)", border:"none", borderRadius:"50%", width:"34px", height:"34px", cursor:"pointer", fontSize:"13px", color:"#444", flexShrink:0 }}>✕</button>
            </div>

            {!showPDF ? (
              <div style={{ padding:"24px", overflowY:"auto", flex:1 }}>
                <p style={{ fontSize:"15px", color:"#555", lineHeight:1.75, marginBottom:"22px" }}>{selected.desc}</p>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"18px" }}>
                  {[["Beneficio", selected.benefit], ["Tiempo", selected.time]].map(([label, val]) => (
                    <div key={label} style={{ border:`2px solid ${selected.color}`, borderRadius:"14px", padding:"14px" }}>
                      <span style={{ fontSize:"10px", color:"#aaa", textTransform:"uppercase", letterSpacing:"1px", fontWeight:600, display:"block", marginBottom:"4px" }}>{label}</span>
                      <span style={{ color:selected.color, fontSize:"15px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background:"#F5F3EE", borderRadius:"14px", padding:"15px", fontSize:"13px", color:"#666", lineHeight:1.65, marginBottom:"22px" }}>
                  <strong>💡 Consejo:</strong> Comienza con versiones micro de este hábito durante los primeros 7 días para que tu cerebro no lo rechace.
                </div>

                <button className="pdfbtn" onClick={() => setShowPDF(true)}
                  style={{ width:"100%", border:"none", background:selected.color, color:"#fff", padding:"15px", borderRadius:"13px", fontSize:"15px", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"opacity 0.2s" }}>
                  📄 Abrir Guía PDF Completa
                </button>
              </div>
            ) : (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <div style={{ padding:"12px 18px", borderBottom:"1px solid #eee", background:"#FAFAFA", display:"flex", alignItems:"center", gap:"10px" }}>
                  <button onClick={() => setShowPDF(false)} style={{ background:"none", border:"1px solid #ddd", padding:"5px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", color:"#444", fontFamily:"'DM Sans',sans-serif" }}>← Volver</button>
                  <span style={{ flex:1, fontSize:"13px", fontWeight:600, color:"#333" }}>Guía: {selected.title}</span>
                  <a href={selected.pdf} target="_blank" rel="noreferrer"
                    style={{ background:selected.color, color:"#fff", textDecoration:"none", padding:"5px 12px", borderRadius:"8px", fontSize:"12px", fontWeight:600 }}>⬇ Descargar</a>
                </div>
                <iframe src={selected.pdf} style={{ flex:1, border:"none", width:"100%", minHeight:"380px" }} title={selected.title} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}