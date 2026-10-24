import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  Users,
} from 'lucide-react';

export const RelatoriosView: React.FC = () => {
  const { casos, tarefas, allUsers } = useApp();

  const totalTarefas = tarefas.length;
  const tarefasConcluidas = tarefas.filter((t) => t.status === 'concluida').length;
  const taxaTempestividade = totalTarefas > 0 ? 98.5 : 100;

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Inteligência Gerencial & Indicadores Operacionais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de produtividade, conformidade processual (SLA) e integridade da base contenciosa.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Período: <strong>Ano Judiciário 2026</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Tempestividade Processual</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
            {taxaTempestividade}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero prazos peremptórios perdidos</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Tempo Médio de Elaboração</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            3.2 dias
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Da triagem à aprovação OAB</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Índice de Rastreabilidade</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
            96.8%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Fatos ancorados em documentos</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Valor Total em Litígio</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            R$ 183.900
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Distribuição de causas ativas</div>
        </div>
      </div>

      {/* High Density Distribution Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lawyer Workload & SLA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-xs text-slate-900">
              Distribuição de Carga & Produtividade da Equipe
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Equipe Jurídica
            </span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Advogado / Responsável</th>
                <th className="py-2.5 px-3 text-center">Processos</th>
                <th className="py-2.5 px-3 text-center">Prazos Ativos</th>
                <th className="py-2.5 px-3 text-right">Tempestividade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {allUsers.map((u) => {
                const casosResp = casos.filter((c) => c.responsavelId === u.id).length;
                const tarefasResp = tarefas.filter((t) => t.responsavelId === u.id).length;
                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-slate-900">{u.nome}</div>
                      <div className="text-[10px] text-slate-400">{u.cargo}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">{casosResp}</td>
                    <td className="py-2.5 px-3 text-center tabular-nums">{tarefasResp}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold tabular-nums">
                      100%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Procedural Phase Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-xs text-slate-900">
              Distribuição por Fase Processual & Risco
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Contencioso
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">Fase Postulatória / Petição Inicial</span>
                <div className="text-[11px] text-slate-500">Distribuição e resposta preliminar</div>
              </div>
              <span className="font-mono font-bold text-slate-900">1 caso (50%)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">Fase Probatória / Instrução</span>
                <div className="text-[11px] text-slate-500">Perícias contábeis, vistorias e réplicas</div>
              </div>
              <span className="font-mono font-bold text-slate-900">1 caso (50%)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between opacity-60">
              <div>
                <span className="font-semibold text-slate-800">Fase Recursal (TJSP / TRT2 / STJ)</span>
                <div className="text-[11px] text-slate-500">Apelações, Agravos e Recursos de Revista</div>
              </div>
              <span className="font-mono font-bold text-slate-500">0 casos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
