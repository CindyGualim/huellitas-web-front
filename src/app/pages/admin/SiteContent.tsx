import { useEffect, useState, FormEvent } from 'react';
import { Heart, Eye, Clock, Images, Plus, X, Upload, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import {
  apiGetSiteSettings,
  apiUpdateSiteSettings,
  apiUploadImage,
  ApiSiteSettings,
  ApiTimelineEntry,
  ApiHeroSlide,
  ApiFaqEntry
} from '../../lib/api';
import { setSiteSettingsCache } from '../../lib/useSiteSettings';

const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#20A83E] transition-all duration-250 text-sm";
const textareaClass = inputClass + " resize-none";
const labelClass = "block text-sm text-[#222222]/60 mb-2";

function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function AdminSiteContent() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador';
  const [settings, setSettings] = useState<ApiSiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);

  useEffect(() => {
    apiGetSiteSettings()
      .then(setSettings)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido'))
      .finally(() => setIsLoading(false));
  }, []);

  if (!hasAccess) return <RestrictedAccess />;

  if (isLoading || !settings) {
    return (
      <div className="p-8 bg-[#F8F8F8] min-h-screen">
        <p className="text-[#222222]/50">Cargando...</p>
      </div>
    );
  }

  const update = <K extends keyof ApiSiteSettings>(key: K, value: ApiSiteSettings[K]) => {
    setSettings(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateTimelineEntry = (index: number, entry: Partial<ApiTimelineEntry>) => {
    update('timeline', settings.timeline.map((t, i) => (i === index ? { ...t, ...entry } : t)));
  };

  const addTimelineEntry = () => {
    update('timeline', [...settings.timeline, { year: '', text: '' }]);
  };

  const removeTimelineEntry = (index: number) => {
    update('timeline', settings.timeline.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, slide: Partial<ApiHeroSlide>) => {
    update('heroSlides', settings.heroSlides.map((s, i) => (i === index ? { ...s, ...slide } : s)));
  };

  const addSlide = () => {
    update('heroSlides', [...settings.heroSlides, { imageUrl: '', theme: '', headline: '', headlineLine2: '' }]);
  };

  const removeSlide = (index: number) => {
    update('heroSlides', settings.heroSlides.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, faq: Partial<ApiFaqEntry>) => {
    update('faqs', settings.faqs.map((f, i) => (i === index ? { ...f, ...faq } : f)));
  };

  const addFaq = () => {
    update('faqs', [...settings.faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    update('faqs', settings.faqs.filter((_, i) => i !== index));
  };

  const handleSlideImageUpload = async (index: number, file: File | undefined) => {
    if (!file || !token) return;

    setError(null);
    setUploadingSlideIndex(index);

    try {
      const { imageUrl } = await apiUploadImage(token, file);
      updateSlide(index, { imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen');
    } finally {
      setUploadingSlideIndex(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (settings.heroSlides.some(s => !s.imageUrl)) {
      setError('Cada slide del carrusel necesita una imagen. Quita los que estén incompletos o súbeles una foto.');
      return;
    }

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const saved = await apiUpdateSiteSettings(token, settings);
      setSettings(saved);
      setSiteSettingsCache(saved);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el contenido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Contenido del sitio</h1>
        <p className="text-[#222222]/50">Misión, visión, línea del tiempo, carrusel de inicio y preguntas frecuentes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="px-4 py-2.5 rounded-xl bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm">
            Contenido guardado correctamente
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#20A83E]/10 rounded-xl">
                <Heart size={22} className="text-[#20A83E]" />
              </div>
              <div>
                <h2 className="text-[#222222] text-lg font-medium">Misión</h2>
                <p className="text-xs text-[#222222]/40">Página "Nuestra Historia"</p>
              </div>
            </div>
            <textarea
              value={settings.mission}
              onChange={e => update('mission', e.target.value)}
              className={textareaClass}
              rows={5}
            />
          </div>

          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#20A83E]/10 rounded-xl">
                <Eye size={22} className="text-[#20A83E]" />
              </div>
              <div>
                <h2 className="text-[#222222] text-lg font-medium">Visión</h2>
                <p className="text-xs text-[#222222]/40">Página "Nuestra Historia"</p>
              </div>
            </div>
            <textarea
              value={settings.vision}
              onChange={e => update('vision', e.target.value)}
              className={textareaClass}
              rows={5}
            />
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#20A83E]/10 rounded-xl">
              <Clock size={22} className="text-[#20A83E]" />
            </div>
            <div>
              <h2 className="text-[#222222] text-lg font-medium">Línea del tiempo</h2>
              <p className="text-xs text-[#222222]/40">Sección "Cómo Empezamos"</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {settings.timeline.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#F8F8F8] rounded-xl border border-[#D9D9D9]/50">
                <div className="flex flex-col gap-1 pt-1">
                  <button type="button" onClick={() => update('timeline', move(settings.timeline, i, -1))} disabled={i === 0} className="text-[#222222]/40 hover:text-[#222222] disabled:opacity-20" aria-label="Mover arriba">
                    <ChevronUp size={16} />
                  </button>
                  <button type="button" onClick={() => update('timeline', move(settings.timeline, i, 1))} disabled={i === settings.timeline.length - 1} className="text-[#222222]/40 hover:text-[#222222] disabled:opacity-20" aria-label="Mover abajo">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <input
                  value={entry.year}
                  onChange={e => updateTimelineEntry(i, { year: e.target.value })}
                  className={inputClass + " w-24! shrink-0"}
                  placeholder="Año"
                />
                <textarea
                  value={entry.text}
                  onChange={e => updateTimelineEntry(i, { text: e.target.value })}
                  className={textareaClass + " flex-1"}
                  rows={2}
                  placeholder="Descripción de este momento"
                />
                <button
                  type="button"
                  onClick={() => removeTimelineEntry(i)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  aria-label="Quitar este hito"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTimelineEntry}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#20A83E]/10 text-[#20A83E] rounded-xl hover:bg-[#20A83E]/20 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Agregar hito
          </button>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#20A83E]/10 rounded-xl">
              <Images size={22} className="text-[#20A83E]" />
            </div>
            <div>
              <h2 className="text-[#222222] text-lg font-medium">Carrusel de inicio</h2>
              <p className="text-xs text-[#222222]/40">Imágenes y textos que rotan en la portada del sitio</p>
            </div>
          </div>
          <p className="text-xs text-[#222222]/50 mb-6">
            Si no agregás ningún slide aquí, el sitio muestra el carrusel original por defecto. El carrusel es ancho y bajo (proporción aproximada 2.4:1) —
            funcionan mejor fotos horizontales, con el sujeto principal cerca del centro. Si la foto no queda bien encuadrada, usá el ajuste de "Encuadre" para subir o bajar el punto de enfoque.
          </p>

          <div className="space-y-4 mb-4">
            {settings.heroSlides.map((slide, i) => (
              <div key={i} className="p-4 bg-[#F8F8F8] rounded-xl border border-[#D9D9D9]/50">
                <div className="flex items-start gap-4">
                  <div className="w-48 h-20 shrink-0 rounded-lg overflow-hidden bg-white border border-[#D9D9D9] flex items-center justify-center relative">
                    {slide.imageUrl ? (
                      <img
                        src={slide.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ objectPosition: slide.focusPosition ?? 'center center' }}
                      />
                    ) : (
                      <span className="text-xs text-[#222222]/30">Sin imagen</span>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 text-white opacity-0 hover:opacity-100 transition-all cursor-pointer">
                      <Upload size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleSlideImageUpload(i, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      value={slide.theme}
                      onChange={e => updateSlide(i, { theme: e.target.value })}
                      className={inputClass}
                      placeholder="Etiqueta (ej: Rescate y rehabilitación)"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={slide.headline}
                        onChange={e => updateSlide(i, { headline: e.target.value })}
                        className={inputClass}
                        placeholder="Primera línea del título"
                      />
                      <input
                        value={slide.headlineLine2}
                        onChange={e => updateSlide(i, { headlineLine2: e.target.value })}
                        className={inputClass}
                        placeholder="Segunda línea del título"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#222222]/50">Encuadre:</span>
                      {([
                        { value: 'center top', label: 'Arriba' },
                        { value: 'center center', label: 'Centro' },
                        { value: 'center bottom', label: 'Abajo' }
                      ] as const).map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateSlide(i, { focusPosition: option.value })}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                            (slide.focusPosition ?? 'center center') === option.value
                              ? 'bg-[#20A83E] text-white border-[#20A83E]'
                              : 'bg-white text-[#222222]/60 border-[#D9D9D9] hover:border-[#20A83E]/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {uploadingSlideIndex === i && <p className="text-xs text-[#222222]/50">Subiendo imagen...</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => update('heroSlides', move(settings.heroSlides, i, -1))} disabled={i === 0} className="text-[#222222]/40 hover:text-[#222222] disabled:opacity-20" aria-label="Mover arriba">
                      <ChevronUp size={16} />
                    </button>
                    <button type="button" onClick={() => update('heroSlides', move(settings.heroSlides, i, 1))} disabled={i === settings.heroSlides.length - 1} className="text-[#222222]/40 hover:text-[#222222] disabled:opacity-20" aria-label="Mover abajo">
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSlide(i)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Quitar este slide"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSlide}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#20A83E]/10 text-[#20A83E] rounded-xl hover:bg-[#20A83E]/20 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Agregar slide
          </button>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#20A83E]/10 rounded-xl">
              <HelpCircle size={22} className="text-[#20A83E]" />
            </div>
            <div>
              <h2 className="text-[#222222] text-lg font-medium">Preguntas Frecuentes</h2>
              <p className="text-xs text-[#222222]/40">Sección "Preguntas Frecuentes" de la página Quiero Ayudar</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {settings.faqs.map((faq, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#F8F8F8] rounded-xl border border-[#D9D9D9]/50">
                <div className="flex flex-col gap-1 pt-1">
                  <button type="button" onClick={() => update('faqs', move(settings.faqs, i, -1))} disabled={i === 0} className="text-[#222222]/40 hover:text-[#222222] disabled:opacity-20" aria-label="Mover arriba">
                    <ChevronUp size={16} />
                  </button>
                  <button type="button" onClick={() => update('faqs', move(settings.faqs, i, 1))} disabled={i === settings.faqs.length - 1} className="text-[#222222]/40 hover:text-[#222222] disabled:opacity-20" aria-label="Mover abajo">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    value={faq.question}
                    onChange={e => updateFaq(i, { question: e.target.value })}
                    className={inputClass}
                    placeholder="Pregunta"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={e => updateFaq(i, { answer: e.target.value })}
                    className={textareaClass}
                    rows={2}
                    placeholder="Respuesta"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  aria-label="Quitar esta pregunta"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#20A83E]/10 text-[#20A83E] rounded-xl hover:bg-[#20A83E]/20 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Agregar pregunta
          </button>
        </div>

        <PrimaryButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </PrimaryButton>
      </form>
    </div>
  );
}
