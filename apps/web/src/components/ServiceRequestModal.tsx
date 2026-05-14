"use client";

import { useState } from "react";
import { createServiceRequest } from "@/lib/api";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

export function ServiceRequestModal({ isOpen, onClose, serviceName }: ServiceRequestModalProps) {
  const [formData, setFormData] = useState({
    serviceName,
    phoneRest: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function digitsOnly(v: string) {
    return v.replace(/\D+/g, "");
  }

  function formatUzRest(digits: string) {
    const d = digitsOnly(digits).slice(0, 9);
    const a = d.slice(0, 2);
    const b = d.slice(2, 5);
    const c = d.slice(5, 7);
    const e = d.slice(7, 9);
    return [a, b, c, e].filter(Boolean).join(" ");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      console.log('Submitting service request:', {
        ...formData,
        phone: formData.phoneRest.trim() ? `+998${digitsOnly(formData.phoneRest)}` : null
      });
      const data = await createServiceRequest({
        ...formData,
        phone: formData.phoneRest.trim() ? `+998${digitsOnly(formData.phoneRest)}` : null
      });
      console.log('Service request response:', data);

      if (data.success) {
        setMessage("Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.");
        setFormData({ serviceName, phoneRest: "", description: "" });
        setTimeout(() => {
          onClose();
          setMessage("");
        }, 3000);
      } else {
        setMessage(data.message || "Произошла ошибка при отправке заявки.");
      }
    } catch (error) {
      console.error('Service request error:', error);
      setMessage("Произошла ошибка при отправке заявки. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Подать заявку</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {message && (
          <div className={`mb-4 rounded-lg p-3 ${message.includes("успешно")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Услуга
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              style={{ borderColor: "rgb(50 143 168)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Телефон *
            </label>
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              <div className="flex items-center bg-slate-50 px-3 text-sm font-semibold text-slate-700">+998</div>
              <input
                type="tel"
                name="phoneRest"
                value={formatUzRest(formData.phoneRest)}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneRest: digitsOnly(e.target.value).slice(0, 9) }))}
                required
                placeholder="90 123 45 67"
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ borderColor: "rgb(50 143 168)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Опишите вашу потребность..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ borderColor: "rgb(50 143 168)" }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
