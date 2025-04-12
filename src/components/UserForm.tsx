import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { toast } from 'sonner';
import { Spinner } from '@phosphor-icons/react';

// Remplacez cette URL par celle que vous allez fournir
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVgZYnJIlS6lGi79CYfAko0G6nt9TWfnl39oJryy992kyfMOuFfKSLLWcPPOrP7O9i/exec";
const FORM_SUBMIT_URL = "https://formsubmit.co/rthelemuka@gmail.com";

const UserForm: React.FC = () => {
  const { t } = useLanguage();
  const { setUserInfo } = useChat();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    postnom: '',
    numero: ''
  });
  const [errors, setErrors] = useState({
    nom: '',
    postnom: '',
    numero: ''
  });

  const validateForm = () => {
    const newErrors = {
      nom: '',
      postnom: '',
      numero: ''
    };
    let isValid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = 'Veuillez entrer votre nom';
      isValid = false;
    }

    if (!formData.postnom.trim()) {
      newErrors.postnom = 'Veuillez entrer votre postnom';
      isValid = false;
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Veuillez entrer votre numéro de téléphone';
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.numero)) {
      newErrors.numero = 'Format invalide. Ex: +243XXXXXXXXX';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Envoi vers Google Sheets
      const params = new URLSearchParams({
        timestamp: new Date().toISOString(),
        nom: formData.nom,
        postnom: formData.postnom,
        numero: formData.numero
      });

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

      await new Promise((resolve) => {
        iframe.onload = resolve;
        setTimeout(resolve, 2000);
      });

      document.body.removeChild(iframe);

      // Envoi vers FormSubmit
      const formSubmitData = new FormData();
      formSubmitData.append('_captcha', 'false');
      formSubmitData.append('_subject', 'Nouvelle inscription HussleAI');
      formSubmitData.append('_template', 'table');
      formSubmitData.append('Nom', formData.nom);
      formSubmitData.append('Postnom', formData.postnom);
      formSubmitData.append('Numéro', formData.numero);
      formSubmitData.append('Date', new Date().toLocaleString());

      await fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        body: formSubmitData,
        mode: 'no-cors'
      });

      // Enregistrer dans le contexte local
      setUserInfo(formData);
      
      toast.success("Inscription réussie!");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bienvenue sur HussleAI
          </h2>
          <p className="text-neutral-400">
            Veuillez vous identifier pour commencer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nom" className="text-sm font-medium text-neutral-200">
              Nom
            </label>
            <Input
              id="nom"
              type="text"
              placeholder="Entrez votre nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 px-4 transition-colors focus:border-white/25 focus:ring-1 focus:ring-white/25"
              disabled={isSubmitting}
            />
            {errors.nom && <p className="text-red-400 text-sm mt-1">{errors.nom}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="postnom" className="text-sm font-medium text-neutral-200">
              Postnom
            </label>
            <Input
              id="postnom"
              type="text"
              placeholder="Entrez votre postnom"
              value={formData.postnom}
              onChange={(e) => setFormData({ ...formData, postnom: e.target.value })}
              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 px-4 transition-colors focus:border-white/25 focus:ring-1 focus:ring-white/25"
              disabled={isSubmitting}
            />
            {errors.postnom && <p className="text-red-400 text-sm mt-1">{errors.postnom}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="numero" className="text-sm font-medium text-neutral-200">
              Numéro de téléphone
            </label>
            <Input
              id="numero"
              type="tel"
              placeholder="+243 XX XXX XXXX"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 px-4 transition-colors focus:border-white/25 focus:ring-1 focus:ring-white/25"
              disabled={isSubmitting}
            />
            {errors.numero && <p className="text-red-400 text-sm mt-1">{errors.numero}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="w-4 h-4 animate-spin" />
                <span>Inscription en cours...</span>
              </div>
            ) : (
              "Commencer"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 