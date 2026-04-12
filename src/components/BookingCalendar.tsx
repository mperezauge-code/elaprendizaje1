import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Loader2, Mail, User, Phone, 
  Calendar, Clock, Users, X, AlertCircle 
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { db, auth, googleProvider } from '../lib/firebase';
import emailjs from '@emailjs/browser';

// ─── EmailJS config ─────────────────────────────────────────────────────────
// 1. Crear cuenta gratis en https://www.emailjs.com (200 emails/mes gratis)
// 2. Crear un Email Service (Gmail) → copiar Service ID abajo
// 3. Crear un Email Template con estas variables:
//    {{to_name}}, {{to_email}}, {{day}}, {{time}}, {{price}}, {{reply_to}}
// 4. Copiar Public Key de Account → API Keys
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const TIME_SLOTS = ['15:00', '16:00', '17:00', '18:00', '19:00'];
const MAX_CAPACITY = 4;
const PRICE = 22000;

function getWeekDates(weekOffset: number = 0): Date[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sun, 1=Mon...
  const monday = new Date(today);
  // Get to Monday of current week
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  monday.setDate(today.getDate() + diff + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);
  
  const dates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString('es-AR', { month: 'long' });
}

function isPastSlot(date: Date, timeSlot: string): boolean {
  const now = new Date();
  const slotDate = new Date(date);
  const [hours] = timeSlot.split(':').map(Number);
  slotDate.setHours(hours, 0, 0, 0);
  return slotDate <= now;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
}

export default function BookingCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [bookings, setBookings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  
  const weekDates = getWeekDates(weekOffset);
  const firstDate = weekDates[0];
  const lastDate = weekDates[4];

  // Fetch bookings for current week
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const startKey = formatDateKey(weekDates[0]);
        const endKey = formatDateKey(weekDates[4]);
        
        const q = query(
          collection(db, 'bookings'),
          where('date', '>=', startKey),
          where('date', '<=', endKey)
        );
        
        const snapshot = await getDocs(q);
        const counts: Record<string, number> = {};
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const key = `${data.date}_${data.timeSlot}`;
          counts[key] = (counts[key] || 0) + 1;
        });
        
        setBookings(counts);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
      setLoading(false);
    };
    
    fetchBookings();
  }, [weekOffset]);

  const getAvailability = (date: Date, time: string): number => {
    const key = `${formatDateKey(date)}_${time}`;
    return MAX_CAPACITY - (bookings[key] || 0);
  };

  const handleGoogleLogin = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      setFormData({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
      });
      setStatus('idle');
    } catch (error: any) {
      console.error('Error with Google Login:', error);
      setStatus('error');
      setErrorMessage('No se pudo iniciar sesión con Google. Completa el formulario manualmente.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !formData.name || !formData.email || !formData.phone) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const dateKey = formatDateKey(selectedSlot.date);
      const slotKey = `${dateKey}_${selectedSlot.time}`;
      
      // Re-check availability
      const currentCount = bookings[slotKey] || 0;
      if (currentCount >= MAX_CAPACITY) {
        setStatus('error');
        setErrorMessage('Este horario se acaba de completar. Elegí otro por favor.');
        return;
      }
      
      await addDoc(collection(db, 'bookings'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: dateKey,
        timeSlot: selectedSlot.time,
        dayName: DAYS[selectedSlot.date.getDay() - 1] || '',
        price: PRICE,
        status: 'confirmed',
        timestamp: serverTimestamp(),
      });
      
      // Also save as lead
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        interest: 'clase_prueba',
        bookedDate: dateKey,
        bookedTime: selectedSlot.time,
        timestamp: serverTimestamp(),
        source: 'booking_calendar'
      });
      
      // Update local state
      setBookings(prev => ({
        ...prev,
        [slotKey]: (prev[slotKey] || 0) + 1
      }));
      
      setStatus('success');
    } catch (error: any) {
      console.error('Error booking:', error);
      setStatus('error');
      setErrorMessage('Hubo un error al agendar. Intenta de nuevo.');
    }
  };

  const resetBooking = () => {
    setStatus('idle');
    setSelectedSlot(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <section id="agendar" className="space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold uppercase tracking-widest text-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Clase de prueba
        </div>
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight">
          Probá una clase <span className="text-emerald-500 italic font-serif">gratis.</span>
        </h2>
        <p className="text-xl text-neutral-500 leading-relaxed">
          Agendá una clase de prueba de 1 hora. Cupo máximo de {MAX_CAPACITY} personas por clase. 
          <span className="block mt-2 text-neutral-900 font-bold text-2xl">
            ${PRICE.toLocaleString('es-AR')} por hora
          </span>
        </p>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-900/5 p-6 md:p-10 max-w-5xl mx-auto"
      >
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setWeekOffset(w => w - 1)}
            disabled={weekOffset <= 0}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">
              {getMonthName(firstDate) === getMonthName(lastDate) 
                ? getMonthName(firstDate)
                : `${getMonthName(firstDate)} - ${getMonthName(lastDate)}`
              } {firstDate.getFullYear()}
            </div>
            <div className="text-lg font-bold text-neutral-900">
              {formatDisplayDate(firstDate)} al {formatDisplayDate(lastDate)}
            </div>
          </div>
          
          <button 
            onClick={() => setWeekOffset(w => w + 1)}
            disabled={weekOffset >= 4}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {/* Day Headers */}
              {weekDates.map((date, i) => {
                const isToday = formatDateKey(date) === formatDateKey(new Date());
                return (
                  <div key={`header-${i}`} className={`text-center py-3 rounded-2xl ${isToday ? 'bg-neutral-900 text-white' : 'bg-neutral-50'}`}>
                    <div className="text-xs font-bold uppercase tracking-wider">{DAYS[i].slice(0, 3)}</div>
                    <div className="text-lg font-bold mt-1">{date.getDate()}</div>
                  </div>
                );
              })}
              
              {/* Time Slots */}
              {TIME_SLOTS.map((time) => (
                weekDates.map((date, dayIndex) => {
                  const available = getAvailability(date, time);
                  const past = isPastSlot(date, time);
                  const isFull = available <= 0;
                  const isDisabled = past || isFull;
                  const isSelected = selectedSlot && 
                    formatDateKey(selectedSlot.date) === formatDateKey(date) && 
                    selectedSlot.time === time;
                  
                  return (
                    <button
                      key={`${dayIndex}-${time}`}
                      onClick={() => !isDisabled && setSelectedSlot({ date, time })}
                      disabled={isDisabled}
                      className={`
                        p-2 md:p-3 rounded-2xl text-center transition-all border-2 relative group
                        ${isSelected 
                          ? 'bg-emerald-500 text-white border-emerald-500 scale-[1.02] shadow-lg shadow-emerald-500/30' 
                          : isDisabled 
                            ? 'bg-neutral-50 text-neutral-300 border-transparent cursor-not-allowed' 
                            : 'bg-white border-neutral-100 hover:border-emerald-300 hover:shadow-md cursor-pointer active:scale-95'
                        }
                      `}
                    >
                      <div className={`text-sm md:text-base font-bold ${isSelected ? 'text-white' : ''}`}>
                        {time}
                      </div>
                      <div className={`text-[10px] md:text-xs mt-1 font-medium ${
                        isSelected ? 'text-emerald-100' : 
                        isFull ? 'text-red-400' : 
                        available <= 2 ? 'text-orange-500' : 'text-emerald-500'
                      }`}>
                        {past ? 'Pasado' : isFull ? 'Completo' : `${available} lugar${available === 1 ? '' : 'es'}`}
                      </div>
                    </button>
                  );
                })
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-6 text-xs font-medium text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                Disponible
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                Últimos lugares
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                Completo
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Booking Form - appears when slot is selected */}
      <AnimatePresence>
        {selectedSlot && status !== 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl shadow-neutral-900/10 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <button 
                onClick={() => setSelectedSlot(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              {/* Selected Slot Summary */}
              <div className="flex items-center gap-4 p-4 mb-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-lg">
                    {DAYS[selectedSlot.date.getDay() - 1]} {selectedSlot.date.getDate()}/{selectedSlot.date.getMonth() + 1}
                  </div>
                  <div className="text-emerald-600 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedSlot.time} - {parseInt(selectedSlot.time) + 1}:00 hs
                    <span className="text-neutral-400 mx-1">•</span>
                    <Users className="w-4 h-4" />
                    {getAvailability(selectedSlot.date, selectedSlot.time)} lugar(es)
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 tracking-tight">Reservá tu clase de prueba</h3>
              <p className="text-neutral-500 mb-6">Completá tus datos para confirmar el turno.</p>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all border bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Completar con Google
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] flex-grow bg-neutral-100"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">o completá manual</span>
                <div className="h-[1px] flex-grow bg-neutral-100"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:ring-2 focus:ring-emerald-200 border border-neutral-200"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:ring-2 focus:ring-emerald-200 border border-neutral-200"
                    placeholder="tu@correo.com"
                  />
                </div>

                {/* Phone */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-base font-medium transition-all outline-none bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:ring-2 focus:ring-emerald-200 border border-neutral-200"
                    placeholder="Tu celular / WhatsApp"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || !formData.name || !formData.email || !formData.phone}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-bold transition-all bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Confirmar mi clase de prueba
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-sm text-neutral-400">
                    Precio: <span className="font-bold text-neutral-900">${PRICE.toLocaleString('es-AR')}/hora</span> • Cupo máximo: {MAX_CAPACITY} personas
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {status === 'success' && selectedSlot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl p-12 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
              
              <div className="relative z-10 space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-neutral-900">¡Clase reservada!</h3>
                  <p className="text-lg text-neutral-500">
                    Tu clase de prueba está confirmada para el
                  </p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="text-2xl font-bold text-neutral-900">
                    {DAYS[selectedSlot.date.getDay() - 1]} {selectedSlot.date.getDate()}/{selectedSlot.date.getMonth() + 1}
                  </div>
                  <div className="text-lg text-emerald-600 font-medium">
                    {selectedSlot.time} - {parseInt(selectedSlot.time) + 1}:00 hs
                  </div>
                </div>

                <p className="text-neutral-500">
                  Te enviamos un email a <span className="font-bold text-neutral-900">{formData.email}</span> con los detalles.
                </p>

                <button
                  onClick={resetBooking}
                  className="text-neutral-400 hover:text-neutral-600 font-medium transition-colors"
                >
                  Agendar otra clase
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
