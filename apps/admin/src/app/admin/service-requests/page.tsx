"use client";

import { useState, useEffect } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { getServiceRequests, updateServiceRequestStatus } from "@/lib/api";
import { PromptDialog } from "@/components/PromptDialog";
import { DetailsDialog } from "@/components/DetailsDialog";

interface ServiceRequest {
  id: number;
  serviceName: string;
  phone: string;
  description?: string;
  status: 'pending' | 'done';
  statusReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [totals, setTotals] = useState({ all: 0, pending: 0, done: 0 });

  // Reason dialog states
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Details dialog states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const fetchRequests = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      const response = await getServiceRequests(page, 20, status === 'all' ? undefined : status);
      setRequests(response.items);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(response.page);

      // Update totals from backend
      // @ts-ignore
      setTotals({
        all: response.totalAll || 0,
        pending: response.totalPending || 0,
        done: response.totalDone || 0
      });
    } catch (err) {
      setError("Failed to fetch service requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleStatusUpdate = async (id: number, newStatus: 'pending' | 'done', reason?: string) => {
    try {
      setError("");
      setIsUpdating(true);
      await updateServiceRequestStatus(id, newStatus, reason);

      // Ro'yxatni qayta yuklash (filterlarni hisobga olgan holda)
      await fetchRequests(currentPage, statusFilter);
    } catch (err: any) {
      console.error('Status update error:', err);
      setError(err?.response?.data?.error || "Failed to update status");
    } finally {
      setIsUpdating(false);
      setIsPromptOpen(false);
      setSelectedId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AuthGate>
      <AdminNav />
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Заявки на услуги</h1>
            <p className="mt-1 text-sm text-slate-600">Управление заявками от клиентов</p>
            {totals.pending > 0 && (
              <div className="mt-2 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                {totals.pending} в ожидании
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Все ({totals.all})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            В ожидании ({totals.pending})
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'done'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Выполнено ({totals.done})
          </button>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center justify-center h-64">
            <div className="text-lg">Загрузка...</div>
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Услуга
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Телефон
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Описание / Причина
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {request.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {request.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <div className="min-w-[250px] max-w-xl">
                          <div className="font-normal text-slate-700">{request.description || '-'}</div>
                          {request.statusReason && (
                            <div className="mt-1 text-xs text-slate-500">
                              <span className="font-semibold text-blue-600">Причина: </span>
                              {request.statusReason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {request.status === 'pending' ? 'В ожидании' : 'Выполнено'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        <button
                          onClick={() => {
                            setViewId(request.id);
                            setIsDetailsOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Просмотреть
                        </button>
                        {request.status === 'pending' ? (
                          <button
                            onClick={() => {
                              setSelectedId(request.id);
                              setIsPromptOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Завершить
                          </button>
                        ) : (
                          <span className="text-slate-400 font-normal">Нет действий</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {requests.length === 0 && (
              <div className="mt-6 text-center py-8 text-slate-500">
                Заявки не найдены
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Назад
                </button>
                <span className="px-4 py-2 text-sm text-slate-700">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Вперед
                </button>
              </div>
            )}
          </>
        )}

        <PromptDialog
          open={isPromptOpen}
          title="Завершить заявку"
          description="Укажите причину или результат выполнения."
          placeholder="Например: Клиент подтвердил получение..."
          confirmText="Выполнить"
          loading={isUpdating}
          onClose={() => {
            setIsPromptOpen(false);
            setSelectedId(null);
          }}
          onConfirm={(reason) => {
            if (selectedId) handleStatusUpdate(selectedId, 'done', reason);
          }}
        />

        {(() => {
          const req = requests.find(r => r.id === viewId);
          return (
            <DetailsDialog
              open={isDetailsOpen}
              title={`Заявка #${viewId}`}
              onClose={() => {
                setIsDetailsOpen(false);
                setViewId(null);
              }}
              data={[
                { label: "Услуга", value: req?.serviceName },
                { label: "Телефон", value: req?.phone },
                { label: "Статус", value: req?.status === 'pending' ? 'В ожидании' : 'Выполнено' },
                { label: "Описание клиента", value: req?.description, isLong: true },
                { label: "Причина / Результат", value: req?.statusReason, isLong: true },
                { label: "Дата создания", value: req ? formatDate(req.createdAt) : null },
              ]}
            />
          );
        })()}
      </div>
    </AuthGate>
  );
}
