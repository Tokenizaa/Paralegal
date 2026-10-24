import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitMerge,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  Layers,
} from 'lucide-react';
import { WorkflowInstancia } from '../types';

export const WorkflowsView: React.FC = () => {
  const {
    workflows,
    avancarEtapaWorkflow,
    simularErroWorkflow,
    currentUser,
    setActiveModule,
    setSelectedCasoId,
  } = useApp();

  const [selectedWfId, setSelectedWfId] = useState<string>(workflows[0]?.id || '');
  const selectedWf = workflows.find((w) => w.id === selectedWfId) || workflows[0];

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Workflows & Automações de Rotinas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fluxo F: Automação determinística de rotinas jurídicas com portões de aprovação humana e recuperação de falhas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-500">Motor de Execução:</span>
          <span className="text-emerald-700 font-semibold">Ativo (Event-Driven)</span>
        </div>
      </div>

      {/* Main Grid: Workflows Selector Strip (Left 4 cols) + Pipeline Stages Canvas (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Workflows Catalog */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-700">
              Rotinas Automatizadas ({workflows.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              SLA Controlado
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {workflows.map((wf) => {
              const isSelected = wf.id === selectedWf?.id;
              const etapasConcluidas = wf.etapas.filter((e) => e.status === 'concluida').length;

              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWfId(wf.id)}
                  className={`p-4 cursor-pointer transition-colors space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/50 border-l-2 border-emerald-700'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate max-w-[210px]">
                      {wf.nome}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        wf.statusGeral === 'concluido'
                          ? 'bg-emerald-50 text-emerald-800'
                          : wf.statusGeral === 'pausado_aprovacao'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {wf.statusGeral === 'concluido'
                        ? 'Concluído'
                        : wf.statusGeral === 'pausado_aprovacao'
                        ? 'Pausado'
                        : 'Ativo'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {wf.descricao}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>
                      Progresso: {etapasConcluidas}/{wf.etapas.length} etapas
                    </span>
                    <span>{wf.dataInicio}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Pipeline Stages Detail */}
        <div className="lg:col-span-8 space-y-4">
          {selectedWf && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
              {/* Pipeline Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {selectedWf.nome}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Iniciado em: {selectedWf.dataInicio}</span>
                    {selectedWf.casoTitulo && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-700 font-medium truncate max-w-[300px]">
                          Caso: {selectedWf.casoTitulo}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {selectedWf.casoId && (
                  <button
                    onClick={() => {
                      if (selectedWf.casoId) {
                        setSelectedCasoId(selectedWf.casoId);
                        setActiveModule('casos');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>Abrir Ficha do Caso</span>
                  </button>
                )}
              </div>

              {/* Stages Stepper */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Etapas e Condições de Execução
                </div>

                <div className="space-y-3">
                  {selectedWf.etapas.map((etapa, idx) => {
                    const isConcluida = etapa.status === 'concluida';
                    const isAguardando = etapa.status === 'aguardando_aprovacao';
                    const isFalha = etapa.status === 'falha';
                    const isProgresso = etapa.status === 'em_progresso';

                    return (
                      <div
                        key={etapa.id}
                        className={`p-4 rounded-xl border text-xs transition-all space-y-2.5 ${
                          isConcluida
                            ? 'bg-emerald-50/30 border-emerald-200'
                            : isFalha
                            ? 'bg-rose-50/40 border-rose-200'
                            : isAguardando
                            ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-400/20'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-[11px] text-slate-700 shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-900 text-xs">
                              {etapa.titulo}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                                isConcluida
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isFalha
                                  ? 'bg-rose-100 text-rose-800'
                                  : isAguardando
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isConcluida
                                ? 'Concluída ✓'
                                : isFalha
                                ? 'Falha Detectada'
                                : isAguardando
                                ? 'Aguardando Decisão Humana'
                                : isProgresso
                                ? 'Em Execução...'
                                : 'Pendente'}
                            </span>
                          </div>
                        </div>

                        {/* Detail text */}
                        {etapa.detalhe && (
                          <div className="text-slate-600 bg-white p-2.5 rounded border border-slate-100 font-mono text-[11px] leading-relaxed">
                            {etapa.detalhe}
                          </div>
                        )}

                        {/* Stage Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-500">
                            Responsável: <strong>{etapa.responsavel}</strong>
                            {etapa.dataConclusao && (
                              <span className="ml-2 font-mono">
                                (Concluído em: {etapa.dataConclusao})
                              </span>
                            )}
                          </span>

                          <div className="flex items-center gap-2">
                            {!isConcluida && (
                              <>
                                <button
                                  onClick={() => avancarEtapaWorkflow(selectedWf.id, etapa.id)}
                                  className="px-2.5 py-1 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 flex items-center gap-1 transition-colors"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{isAguardando ? 'Aprovar e Avançar' : 'Concluir Etapa'}</span>
                                </button>

                                <button
                                  onClick={() => simularErroWorkflow(selectedWf.id, etapa.id)}
                                  className="px-2 py-1 border border-slate-200 text-slate-500 rounded hover:bg-slate-50 flex items-center gap-1"
                                  title="Simular interrupção técnica ou divergência"
                                >
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  <span>Simular Falha</span>
                                </button>
                              </>
                            )}

                            {isFalha && (
                              <button
                                onClick={() => avancarEtapaWorkflow(selectedWf.id, etapa.id)}
                                className="px-2.5 py-1 bg-amber-600 text-white rounded font-medium hover:bg-amber-700 flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Retentar Etapa</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
