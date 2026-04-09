import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Loader2, Mail, User, BookOpen, AlertCircle, Phone, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { db, auth, googleProvider } from '../lib/firebase';

interface LeadFormProps {
  variant?: "hero" | "cta" | "modal";
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export default function LeadForm({ 
  variant = "hero", 
  onClose, 
  title, 
  subtitle 
}: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", interest: "" });

  const handleGoogleLogin = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Guardar info de Google en Firestore
      await addDoc(collection(db, "leads"), {
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        interest: "google_login",
        timestamp: serverTimestamp(),
        source: `${variant}_google`
      });

      setFormData({
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        interest: "google_login"
      });
      
      setStatus("success");
      
      setTimeout(() => {
        window.location.href = '/informacion.html';
        if (variant === "modal") {
          onClose?.();
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error with Google Login:", error);
      setStatus("error");
      setErrorMessage("No se pudo iniciar sesión con Google. Intenta completar el formulario.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setStatus("loading");
    setErrorMessage("");

    try {
      // Guardar en Firestore
      await addDoc(collection(db, "leads"), {
        ...formData,
        timestamp: serverTimestamp(),
        source: variant // para saber de qué parte de la landing vino
      });
      setStatus("success");
      
      // Redirect after showing the success message briefly
      setTimeout(() => {
        window.location.href = '/informacion.html';
        if (variant === "modal") {
          onClose?.();
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error capturing lead:", error);
      setStatus("error");
      setErrorMessage("Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.");
    }
  };

  const isDark = variant === 'cta';
  const isModal = variant === 'modal';

  const containerClasses = isModal
    ? "w-full max-w-lg bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
    : isDark 
      ? 'w-full max-w-md mx-auto p-8 rounded-3xl flex flex-col space-y-5 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl' 
      : 'w-full max-w-md mx-auto p-8 rounded-3xl flex flex-col space-y-5 bg-white shadow-xl shadow-neutral-900/10 border border-neutral-100';

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${containerClasses} flex flex-col items-center text-center space-y-6`}
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            ¡Ya casi estás!
          </h3>
          <p className={`text-lg ${isDark ? 'text-neutral-300' : 'text-neutral-500'}`}>
            Gracias {formData.name.split(' ')[0]}. Revisa tu correo {formData.email} para los siguientes pasos.
          </p>
        </div>
        {isModal && (
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 font-medium pt-4"
          >
            Cerrar ventana
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <motion.form 
        onSubmit={handleSubmit}
        initial={isModal ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 20 }}
        animate={isModal ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
        className={containerClasses}
      >
        {isModal && onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        )}

        <div className="text-left mb-6">
          <h3 className={`text-3xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {title || (isDark ? 'Comienza tu viaje hoy' : 'Da el primer paso')}
          </h3>
          <p className={`text-base ${isDark ? 'text-neutral-300' : 'text-neutral-500'}`}>
            {subtitle || 'Registrate para recibir acceso anticipado y una clase de introducción gratuita.'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={status === "loading"}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all border ${
              isDark 
                ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
                : 'bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Ingresar con Google
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className={`h-[1px] flex-grow ${isDark ? 'bg-white/10' : 'bg-neutral-100'}`}></div>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>o completá tus datos</span>
            <div className={`h-[1px] flex-grow ${isDark ? 'bg-white/10' : 'bg-neutral-100'}`}></div>
          </div>

          {/* Name Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={`w-5 h-5 transition-colors ${isDark ? 'text-white/40 group-focus-within:text-white' : 'text-neutral-400 group-focus-within:text-neutral-900'}`} />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none ${
                isDark 
                  ? 'bg-white/10 text-white placeholder-white/40 focus:bg-white/20 focus:ring-2 focus:ring-white/30 border border-transparent' 
                  : 'bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-200 border border-neutral-200'
              }`}
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`w-5 h-5 transition-colors ${isDark ? 'text-white/40 group-focus-within:text-white' : 'text-neutral-400 group-focus-within:text-neutral-900'}`} />
            </div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none ${
                isDark 
                  ? 'bg-white/10 text-white placeholder-white/40 focus:bg-white/20 focus:ring-2 focus:ring-white/30 border border-transparent' 
                  : 'bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-200 border border-neutral-200'
              }`}
              placeholder="tu@correo.com"
            />
          </div>

          {/* Phone Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className={`w-5 h-5 transition-colors ${isDark ? 'text-white/40 group-focus-within:text-white' : 'text-neutral-400 group-focus-within:text-neutral-900'}`} />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none ${
                isDark 
                  ? 'bg-white/10 text-white placeholder-white/40 focus:bg-white/20 focus:ring-2 focus:ring-white/30 border border-transparent' 
                  : 'bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-200 border border-neutral-200'
              }`}
              placeholder="Tu WhatsApp (Opcional)"
            />
          </div>
          
          {/* Interest Select */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <BookOpen className={`w-5 h-5 transition-colors ${isDark ? 'text-white/40 group-focus-within:text-white' : 'text-neutral-400 group-focus-within:text-neutral-900'}`} />
            </div>
            <select
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              className={`w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none appearance-none cursor-pointer ${
                isDark 
                  ? 'bg-[#2a2a2a] text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 border border-white/20' 
                  : 'bg-neutral-50 text-neutral-600 focus:bg-white focus:ring-2 focus:ring-neutral-200 border border-neutral-200'
              }`}
            >
              <option value="" disabled>¿Cuál es tu interés principal?</option>
              <option value="docencia">IA para Docencia</option>
              <option value="negocios">IA para Negocios / Emprendimiento</option>
              <option value="desarrollo">Desarrollo Profesional / Trabajo</option>
              <option value="curiosidad">Soy curioso/a, quiero aprender</option>
            </select>
          </div>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 p-4 mt-4 bg-red-100 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !formData.name || !formData.email}
          className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 ${
            isDark 
              ? 'bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-[1.02] shadow-xl shadow-white/10' 
              : 'bg-neutral-900 text-white hover:scale-[1.02] hover:shadow-2xl hover:shadow-neutral-900/30'
          }`}
        >
          {status === "loading" ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Reservar mi lugar
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
        <p className={`text-sm text-center mt-6 ${isDark ? 'text-neutral-400' : 'text-neutral-400'}`}>
          No enviamos spam. Tus datos están seguros.
        </p>
      </motion.form>
    </div>
  );
}

