import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  Filter,
  Search,
  Briefcase,
  AlertTriangle,
  User,
  X,
} from 'lucide-react';
import { Tarefa, PrioridadeTarefa } from '../types';

export const AgendaTarefasView: React.FC = () => {
  const {
    tarefas,
    adicionarTarefa,
    concluirTarefa,
    casos,
    allUsers,
    currentUser,
    setActiveModule,
    setSelectedCasoId,
  } = useApp();

  const [viewMode, setViewMode] = useState<'lista' | 'calendario'>('lista');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todas');
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('todos');
  const [modalNovaTarefaOpen, setModalNovaTarefaOpen] = useState(false);

  // New task form state
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoCasoId, setNovoCasoId] = useState(casos[0]?.id || '');
  const [novaPrioridade, setNovaPrioridade] = useState<PrioridadeTarefa>('alta');
  const [novoDiasUteis, setNovoDiasUteis] = useState(5);
  const [novoRespId, setNovoRespId] = useState(currentUser.id);

  const handleSalvarTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo) return;

    const casoSelecionado = casos.find((c) => c.id === novoCasoId);
    const resp = allUsers.find((u) => u.id === novoRespId) || currentUser;

    const dataVenc = new Date(Date.now() + novoDiasUteis * 86400000 * 1.4)
      .toISOString()
      .substring(0, 10);

    adicionarTarefa({
      casoId: casoSelecionado?.id,
      casoNumero: casoSelecionado?.numeroCnj,
      clienteNome: casoSelecionado?.clienteNome,
      titulo: novoTitulo,
      descricao: novaDescricao,
      responsavelId: resp.id,
      responsavelNome: resp.nome,
      prioridade: novaPrioridade,
      dataVencimento: dataVenc,
      diasUteisRestantes: novoDiasUteis,
      status: 'pendente',
      tipo: 'prazo_processual',
      regraContagem: 'Art. 219 CPC (contagem de dias úteis)',
    });

    setModalNovaTarefaOpen(false);
    setNovoTitulo('');
    setNovaDescricao('');
  };

  const filteredTarefas = tarefas.filter((t) => {
    if (filtroPrioridade !== 'todas' && t.prioridade !== filtroPrioridade) return false;
    if (filtroResponsavel !== 'todos' && t.responsavelId !== filtroResponsavel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Agenda & Prazos Processuais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de compromissos com contagem determinística em dias úteis (CPC/2015 & CLT).
          </p>
        </div>

        <button
          onClick={() => setModalNovaTarefaOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nova Tarefa / Prazo</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('lista')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'lista'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista de Prazos
            </button>
            <button
              onClick={() => setViewMode('calendario')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'calendario'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendário Mensal
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Urgência:</span>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded-lg bg-white"
            >
              <option value="todas">Todas as Prioridades</option>
              <option value="fatal">Prazos Fatais</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Responsável:</span>
            <select
              value={filtroResponsavel}
              onChange={(e) => setFiltroResponsavel(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded-lg bg-white"
            >
              <option value="todos">Toda a Equipe</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Exibindo {filteredTarefas.length} de {tarefas.length} atividades
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === 'calendario' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Calendário Forense — Outubro / Novembro 2026
              </h3>
              <p className="text-[11px] text-slate-500">
                Regra: Art. 219 do CPC (dias úteis, excluído dia do começo e incluído o do vencimento). Sábados, domingos e feriados suspensos.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-[11px] text-rose-700 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Prazo Fatal
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-700 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Prazo Regular
              </span>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <div className="text-slate-400">Dom (Inútil)</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div className="text-slate-400">Sáb (Inútil)</div>
          </div>

          {/* Calendar Grid Sample Month (Outubro 2026) */}
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {/* Week 1 padding */}
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-50/50 text-slate-300 font-mono">27</div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-50/50 text-slate-300 font-mono">28</div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-50/50 text-slate-300 font-mono">29</div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-50/50 text-slate-300 font-mono">30</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">01</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">02</div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">03</div>

            {/* Week 2 */}
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">04</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">05</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">06</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">07</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">08</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">09</div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">10</div>

            {/* Week 3 */}
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">11</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">12</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">13</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">14</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">15</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">16</div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">17</div>

            {/* Week 4 */}
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">18</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">19</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">20</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">21</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">22</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-emerald-300 bg-emerald-50/40 font-mono text-slate-900 font-bold">
              <span>23 (Hoje)</span>
            </div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">24</div>

            {/* Week 5 */}
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">25</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">26</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">27</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-amber-200 bg-amber-50/50 font-mono text-slate-900">
              <span className="font-bold">28</span>
              <div className="mt-1 p-1 bg-amber-100 text-amber-900 rounded text-[10px] font-sans font-medium line-clamp-2">
                Série Bacen (Luciana Ramos)
              </div>
            </div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">29</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">30</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 font-mono text-slate-900">
              <span className="font-bold">31</span>
              <div className="mt-1 p-1 bg-rose-100 text-rose-900 rounded text-[10px] font-sans font-medium line-clamp-2">
                Quesitos Perícia (TransLog)
              </div>
            </div>

            {/* Week 6 into November */}
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">01/11</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">02/11 (Feriado)</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">03/11</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">04/11</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-slate-100 bg-white font-mono text-slate-700">05/11</div>
            <div className="min-h-[75px] p-1.5 rounded-lg border border-rose-300 bg-rose-50 font-mono text-slate-900">
              <span className="font-bold text-rose-800">06/11 (FATAL)</span>
              <div className="mt-1 p-1 bg-rose-600 text-white rounded text-[10px] font-sans font-bold line-clamp-2">
                Réplica Contestação (CrediMais)
              </div>
            </div>
            <div className="min-h-[75px] p-1.5 rounded-lg bg-slate-100/60 font-mono text-slate-400">07/11</div>
          </div>
        </div>
      )}

      {/* Tasks Table (LIST VIEW) */}
      {viewMode === 'lista' && (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTarefas.map((t) => {
          const isConcluida = t.status === 'concluida';
          const isFatal = t.prioridade === 'fatal' || t.diasUteisRestantes <= 5;

          return (
            <div
              key={t.id}
              className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isConcluida
                  ? 'bg-slate-50/50 opacity-60'
                  : 'hover:bg-slate-50/80'
              }`}
            >
              {/* Task Title & Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      t.prioridade === 'fatal'
                        ? 'bg-rose-100 text-rose-800'
                        : t.prioridade === 'alta'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t.prioridade.toUpperCase()}
                  </span>
                  <h3
                    className={`font-semibold text-xs truncate ${
                      isConcluida
                        ? 'line-through text-slate-500'
                        : 'text-slate-900'
                    }`}
                  >
                    {t.titulo}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t.descricao}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                  {t.casoNumero && (
                    <>
                      <button
                        onClick={() => {
                          if (t.casoId) {
                            setSelectedCasoId(t.casoId);
                            setActiveModule('casos');
                          }
                        }}
                        className="font-mono text-emerald-800 hover:underline font-medium"
                      >
                        {t.casoNumero}
                      </button>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span>Cliente: {t.clienteNome || 'Em qualificação'}</span>
                  <span aria-hidden="true">·</span>
                  <span>Resp: <strong>{t.responsavelNome}</strong></span>
                  {t.regraContagem && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-600">{t.regraContagem}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <div
                    className={`text-xs font-mono font-bold tabular-nums ${
                      isFatal && !isConcluida ? 'text-rose-700' : 'text-slate-800'
                    }`}
                  >
                    {t.diasUteisRestantes} dias úteis
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Vence em {t.dataVencimento}
                  </div>
                </div>

                {!isConcluida ? (
                  <button
                    onClick={() => concluirTarefa(t.id)}
                    className="p-2 rounded-lg border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 transition-colors"
                    title="Concluir tarefa"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-semibold font-mono">
                    Concluído ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredTarefas.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            Nenhuma tarefa encontrada com os filtros selecionados.
          </div>
        )}
      </div>
      )}

      {/* MODAL: Nova Tarefa */}
      {modalNovaTarefaOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-900">
                Criar Nova Tarefa ou Prazo Processual
              </h3>
              <button
                onClick={() => setModalNovaTarefaOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarTarefa} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Título da Providência *
                </label>
                <input
                  type="text"
                  required
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Protocolar Agravo de Instrumento contra tutela indeferida"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Caso Vinculado
                </label>
                <select
                  value={novoCasoId}
                  onChange={(e) => setNovoCasoId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {casos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.numeroCnj} - {c.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={novaPrioridade}
                    onChange={(e) => setNovaPrioridade(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="fatal">Fatal (Peremptório)</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Prazo em Dias Úteis
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={novoDiasUteis}
                    onChange={(e) => setNovoDiasUteis(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Responsável
                  </label>
                  <select
                    value={novoRespId}
                    onChange={(e) => setNovoRespId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Instruções e Fundamentação
                </label>
                <textarea
                  rows={3}
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Detalhes operacionais, modelo a utilizar e observações de estratégia..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovaTarefaOpen(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
