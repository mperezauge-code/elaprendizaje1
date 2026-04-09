import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Brain, 
  Lightbulb, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  ChevronRight,
  ShieldCheck,
  X,
  MessageCircle,
  Users
} from "lucide-react";
import LeadForm from "./components/LeadForm";
import BookingCalendar from "./components/BookingCalendar";

const FadeIn = ({ children, delay = 0, className = "", ...props }: { children: React.ReactNode, delay?: number, className?: string, [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -250]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 150]);

  const scrollToForm = () => {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openInfo = () => {
    // window.location.href = '/informacion.html';
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200 font-sans overflow-x-hidden relative">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />



      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-lg tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Sparkles className="w-5 h-5 text-blue-500" />
            Escuelita IA
          </div>
          <button 
            onClick={() => scrollToForm()}
            className="text-sm font-bold bg-neutral-900 text-white px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-neutral-900/20 active:scale-95 transition-all duration-300"
          >
            Inscribite
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-32 relative z-10">
        
        {/* 1. HERO */}
        <section className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Parallax Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
            <motion.div 
              style={{ y: y1 }} 
              className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
            />
            <motion.div 
              style={{ y: y2 }} 
              className="absolute top-32 -right-32 w-[32rem] h-[32rem] bg-purple-400/10 rounded-full blur-3xl"
            />
          </div>

          <div className="space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-wider text-blue-600 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Edición Mayo 2026 • Cupos Limitados
              </div>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.95] text-neutral-900">
                Aprendé IA <br className="hidden md:block" />
                <span className="text-neutral-400 italic font-serif">sin vueltas.</span>
              </h1>
            </motion.div>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-neutral-500 max-w-xl leading-relaxed">
                Transformá tu carrera con las herramientas que están definiendo el futuro. Formación práctica hecha por humanos, para humanos.
              </p>
            </FadeIn>

            <FadeIn delay={0.3} className="flex flex-wrap gap-6 pt-4 text-sm font-semibold text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                Garantía total
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
                Acceso vitalicio
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl -z-10 opacity-50" />
            <LeadForm />
          </FadeIn>
        </section>

        {/* 2. PROBLEMA */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              No dejes que el futuro <br className="hidden md:block" />
              <span className="text-neutral-400">te pase por el costado.</span>
            </h2>
            <p className="text-xl text-neutral-500 mb-10 leading-relaxed">
              El mundo avanza rápido. Muchos se sienten abrumados por la cantidad de información desordenada. En EscuelitaIA te damos el mapa.
            </p>
            <button 
              onClick={() => scrollToForm()}
              className="group flex items-center gap-3 text-lg font-bold bg-white border border-neutral-200 px-8 py-4 rounded-2xl hover:bg-neutral-50 transition-all shadow-sm active:scale-95"
            >
              Empezar mi transformación
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeIn>
          
          <div className="space-y-4">
            {[
              { text: "No sabés por dónde empezar con tanta IA", color: "red" },
              { text: "Sentís que perdés tiempo en tutoriales vacíos", color: "orange" },
              { text: "No lográs aplicarlo a tu trabajo diario real", color: "rose" }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-center gap-5 p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm group hover:border-neutral-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <XCircle className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-xl font-semibold text-neutral-800">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* 3. PROPUESTA */}
        <section className="bg-neutral-900 text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest mb-8 text-blue-400">Nuestro Método</div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                Aprendizaje <br />
                <span className="text-blue-400">100% aplicado.</span>
              </h2>
              <p className="text-xl text-neutral-400 mb-10 leading-relaxed">
                Sin teoría aburrida. Vas a crear, automatizar y optimizar desde el primer encuentro.
              </p>
              <button 
                onClick={() => scrollToForm()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
              >
                Inscribirme ahora
                <ChevronRight className="w-5 h-5" />
              </button>
            </FadeIn>

            <div className="space-y-10">
              {[
                { icon: Zap, text: "Uso de IA desde el minuto cero", desc: "No esperes al final para practicar." },
                { icon: Target, text: "Casos de uso reales y locales", desc: "Educación, negocios, marketing y más." },
                { icon: Lightbulb, text: "Creá tus propias herramientas", desc: "Llevate soluciones funcionando." }
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1} className="flex gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white transition-all group-hover:text-neutral-900">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{item.text}</p>
                    <p className="text-neutral-400 text-lg">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CURSOS (BENTO GRID) */}
        <section className="space-y-16">
          <FadeIn className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight">Elegí tu camino.</h2>
            <p className="text-xl text-neutral-500">Módulos especializados de alta intensidad para dominar cada área.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[380px]">
            {[
              { 
                id: 1, 
                title: "IA para Principiantes", 
                desc: "Fundamentos claros. Entendé cómo piensan las máquinas y dominá el miedo a lo nuevo.", 
                icon: Brain, 
                color: "blue",
                span: "lg:col-span-2"
              },
              { 
                id: 2, 
                title: "Prompts Profesionales", 
                desc: "El arte de dar comandos para obtener resultados perfectos en segundos.", 
                icon: MessageSquare, 
                color: "purple"
              },
              { 
                id: 3, 
                title: "IA en Redes Sociales", 
                desc: "Contenido viral, estrategias y automatización de posteos a gran escala.", 
                icon: Sparkles, 
                color: "pink"
              },
              { 
                id: 4, 
                title: "IA para Académicos", 
                desc: "Análisis de datos, resumen de papers y estructuración de tesis con rigor científico.", 
                icon: BarChart3, 
                color: "emerald",
                span: "lg:col-span-2"
              },
            ].map((item, i) => {
              const colors = {
                blue: { bg: "bg-blue-50", text: "text-blue-500", blob: "bg-blue-100" },
                purple: { bg: "bg-purple-50", text: "text-purple-500", blob: "bg-purple-100" },
                pink: { bg: "bg-pink-50", text: "text-pink-500", blob: "bg-pink-100" },
                emerald: { bg: "bg-emerald-50", text: "text-emerald-500", blob: "bg-emerald-100" },
              }[item.color as keyof typeof colors] || { bg: "bg-gray-50", text: "text-gray-500", blob: "bg-gray-100" };

              return (
              <FadeIn 
                key={item.id} 
                delay={i * 0.1} 
                className={`${item.span || ""} bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-neutral-900/5 transition-all flex flex-col justify-between group overflow-hidden relative cursor-default`}
              >
                <div className={`w-16 h-16 rounded-[1.5rem] ${colors.bg} flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform relative z-10`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <div className="text-sm font-black tracking-widest text-neutral-300 uppercase mb-3">Módulo 0{item.id}</div>
                    <h3 className="text-3xl font-bold mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-neutral-500 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => openInfo()}
                    className="flex items-center gap-2 text-sm font-bold text-neutral-400 group-hover:text-neutral-900 transition-all uppercase tracking-widest group-hover:gap-4"
                  >
                    Me interesa este curso
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Decorative blob */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${colors.blob} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </FadeIn>
            )})}
          </div>
        </section>

        {/* 5. IMPACTO REAL */}
        <section className="space-y-16 py-12">
          <FadeIn className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">El impacto real.</h2>
            <p className="text-xl text-neutral-500">¿Cómo cambia tu día a día después de pasar por EscuelitaIA?</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-10">
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-[3rem] p-12 border border-neutral-100 shadow-sm h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-10 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-black">1</span>
                  Antes de la IA
                </h3>
                <ul className="space-y-6 text-neutral-500 flex-grow">
                  {[
                    "Horas buscando ideas para una simple clase",
                    "Textos académicos densos difíciles de procesar",
                    "Tareas repetitivas que consumen tu energía creativa"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2.5 shrink-0" />
                      <p className="text-lg">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-neutral-900 text-white rounded-[3rem] p-12 shadow-2xl h-full relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-2xl font-bold mb-10 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-black">2</span>
                  Con EscuelitaIA
                </h3>
                <ul className="space-y-6 text-neutral-300 flex-grow">
                  {[
                    "Actividades generadas en minutos, no horas",
                    "Análisis profundo de documentos en segundos",
                    "Automatización de procesos estratégicos"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-lg font-medium">{text}</p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => scrollToForm()}
                  className="mt-10 w-full py-4 bg-white text-neutral-900 rounded-2xl font-bold text-lg hover:bg-neutral-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Quiero este cambio
                  <Zap className="w-5 h-5 fill-current" />
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 6. MÉTODO DETALLE */}
        <section className="bg-white rounded-[4rem] p-12 md:p-24 border border-neutral-100 shadow-sm text-center space-y-20">
          <FadeIn className="space-y-6">
            <div className="w-20 h-20 bg-neutral-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Método con rigor académico.
            </h2>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto">Nuestro enfoque no es solo técnico, es una transformación mental.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Análisis Crítico", desc: "No solo copiamos y pegamos. Entendemos los sesgos y límites de la IA." },
              { title: "Práctica Aplicada", desc: "Cada concepto se traduce inmediatamente en soluciones para vos." },
              { title: "Impacto Cultural", desc: "Analizamos cómo esta tecnología moldea nuestra sociedad actual." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="space-y-6 group">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-50 flex items-center justify-center font-bold text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all text-xl">
                  0{i + 1}
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-lg text-neutral-500 leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <button 
              onClick={() => scrollToForm()}
              className="bg-neutral-900 text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-neutral-900/20"
            >
              Comenzar ahora
            </button>
          </FadeIn>
        </section>

        {/* DIRECTOR SECTION */}
        <section className="grid lg:grid-cols-2 gap-20 items-center bg-blue-50/30 rounded-[4rem] p-12 md:p-24 border border-blue-100/50">
          <FadeIn className="relative">
            <div className="relative aspect-square max-w-md mx-auto z-10 group">
              <div className="absolute inset-0 bg-blue-500/10 rounded-[4rem] rotate-6 group-hover:rotate-3 transition-transform" />
              <div className="absolute inset-0 bg-neutral-900 rounded-[4rem] -rotate-3 group-hover:rotate-0 transition-transform shadow-2xl" />
              <div className="w-full h-full bg-neutral-100 rounded-[4rem] overflow-hidden border-4 border-white flex items-center justify-center relative">
                <img 
                  src="/director.png" 
                  alt="Marcos Perez Linares" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
            {/* Stats floating */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white p-6 rounded-3xl shadow-xl border border-neutral-100 z-20 space-y-1">
              <div className="flex -space-x-3 mb-2">
                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200" />)}
              </div>
              <p className="text-sm font-bold text-neutral-900">+1000 Alumnos formados</p>
            </div>
          </FadeIn>
          
          <div className="space-y-10">
            <FadeIn className="space-y-8">
              <div className="space-y-4">
                <div className="text-sm font-black tracking-[0.2em] text-blue-600 uppercase">El Director</div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight hover:text-blue-600 transition-colors cursor-pointer">
                  <a href="/cv-marcos-perez-linares.pdf" target="_blank" rel="noopener noreferrer">
                    Marcos Perez Linares
                  </a>
                </h2>
              </div>
              <p className="text-xl text-neutral-600 leading-relaxed">
                Especialista en IA y educación, Marcos fundó EscuelitaIA con una misión clara: <span className="text-neutral-900 font-bold">humanizar la tecnología.</span>
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg text-neutral-500">"La IA no va a reemplazarte, te va a potenciar si sabés cómo usarla."</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-3 bg-white border border-neutral-200 px-8 py-4 rounded-2xl font-bold hover:bg-neutral-50 transition-all shadow-sm group active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  Consultar información
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-16">
          <FadeIn className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Dudas frecuentes.</h2>
            <p className="text-xl text-neutral-500">Todo lo que necesitás saber antes de embarcarte.</p>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "¿Necesito saber programación?", a: "Absolutamente no. El curso está diseñado para que cualquier persona, sin importar su base técnica, pueda dominar y aplicar estas herramientas." },
              { q: "¿Qué herramientas vemos?", a: "ChatGPT, Claude, Midjourney, y sistemas de automatización como Zapier o Make enfocados en productividad real." },
              { q: "¿Es online o presencial?", a: "Formato híbrido optimizado: Clases grabadas de alta factura y sesiones de mentoría en vivo para sacarte todas las dudas." }
            ].map((faq, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <details className="group bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden border-b-4 border-b-transparent open:border-b-blue-500 transition-all">
                  <summary className="flex items-center justify-between p-8 cursor-pointer font-bold text-xl list-none group-open:bg-neutral-50 transition-colors">
                    {faq.q}
                    <ChevronRight className="w-6 h-6 text-neutral-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="p-8 pt-2 text-neutral-500 text-lg leading-relaxed bg-neutral-50/30">
                    <p>{faq.a}</p>
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn className="text-center">
            <p className="text-neutral-400 font-medium mb-6">¿Tenés otra pregunta específica?</p>
            <button 
              onClick={() => scrollToForm()}
              className="text-neutral-900 font-bold border-b-2 border-neutral-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
            >
              Contactanos directamente
            </button>
          </FadeIn>
        </section>

        {/* BOOKING CALENDAR */}
        <BookingCalendar />

        {/* 7. FINAL CTA */}
        <section id="cta" className="relative group">
          <div className="absolute inset-0 bg-neutral-900 rounded-[5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-700" />
          <div className="relative bg-neutral-950 text-white rounded-[5rem] p-12 md:p-24 overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-60" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <FadeIn className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-blue-400">Cupos Limitados Mayo 2026</div>
                  <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                    No dejes <br />
                    que el futuro <br />
                    <span className="text-blue-500 italic font-serif">te espere.</span>
                  </h2>
                  <p className="text-2xl text-neutral-400 max-w-md leading-relaxed">
                    Convertite en el profesional que lidera con IA, no en el que intenta alcanzarla.
                  </p>
                  
                  <div className="flex gap-12 border-t border-white/10 pt-12">
                    <div className="space-y-2">
                      <div className="text-4xl font-bold">+500</div>
                      <div className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-black">Alumnos</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold">100%</div>
                      <div className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-black">Práctico</div>
                    </div>
                  </div>
                </FadeIn>
              </div>

              <div id="form-cta">
                <LeadForm variant="cta" />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white py-20 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <FadeIn className="text-center md:text-left space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-2xl tracking-tighter">Escuelita IA</span>
            </div>
            <p className="text-neutral-500 max-w-sm">Dando las herramientas para que el futuro sea una oportunidad y no una amenaza.</p>
            <div className="flex justify-center md:justify-start gap-4">
              <button 
                onClick={() => scrollToForm()}
                className="text-sm font-bold bg-neutral-50 hover:bg-neutral-100 px-6 py-3 rounded-xl transition-all"
              >
                Suscribirme al Newsletter
              </button>
            </div>
          </FadeIn>
          
          <FadeIn className="text-center md:text-right space-y-4">
            <p className="text-neutral-900 font-bold text-lg">Dirección Marcos Perez Linares</p>
            <p className="text-neutral-400 text-sm">© {new Date().getFullYear()} EscuelitaIA. Todos los derechos reservados.</p>
          </FadeIn>
        </div>
      </footer>

      {/* LEAD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg"
            >
              <LeadForm 
                variant="modal" 
                onClose={() => setIsModalOpen(false)}
                title="¿Te interesa este módulo?"
                subtitle="Dejanos tus datos para enviarte el programa detallado y el costo de la próxima edición."
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

