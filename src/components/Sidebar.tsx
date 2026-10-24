import React from 'react';
import { useApp, ActiveModule } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  FileText,
  Search,
  FileCheck2,
  BellRing,
  GitMerge,
  BarChart3,
  Shield,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    tarefas,
    publicacoes,
  } = useApp();

  // Counts of pending items
  const prazosFataisCount = tarefas.filter(
    (t) => t.status !== 'concluida' && (t.prioridade === 'fatal' || t.diasUteisRestantes <= 5)
  ).length;

  const publicacoesNovasCount = publicacoes.filter(
    (p) => p.statusProcessamento === 'nova'
  ).length;

  const navGroups: {
    label: string;
    items: {
      id: ActiveModule;
      label: string;
      icon: React.ElementType;
      badgeCount?: number;
      badgeType?: 'warning' | 'neutral';
    }[];
  }[] = [
    {
      label: 'Operação Central',
      items: [
        {
          id: 'visao_geral',
          label: 'Visão Geral',
          icon: LayoutDashboard,
        },
        {
          id: 'clientes',
          label: 'Clientes & Atendimento',
          icon: Users,
        },
        {
          id: 'casos',
          label: 'Casos & Processos',
          icon: Briefcase,
        },
        {
          id: 'agenda_tarefas',
          label: 'Agenda & Prazos',
          icon: CalendarCheck,
          badgeCount: prazosFataisCount,
          badgeType: 'warning',
        },
      ],
    },
    {
      label: 'Inteligência & Peças',
      items: [
        {
          id: 'documentos',
          label: 'Evidências & Docs',
          icon: FileText,
        },
        {
          id: 'inteligencia_pesquisa',
          label: 'Pesquisa & Análise',
          icon: Search,
        },
        {
          id: 'gerador_documentos',
          label: 'Gerador Documental',
          icon: FileCheck2,
        },
      ],
    },
    {
      label: 'Monitoramento & Automação',
      items: [
        {
          id: 'monitoramento',
          label: 'Publicações DJEN',
          icon: BellRing,
          badgeCount: publicacoesNovasCount,
          badgeType: 'warning',
        },
        {
          id: 'workflows',
          label: 'Workflows & Rotinas',
          icon: GitMerge,
        },
        {
          id: 'relatorios',
          label: 'Inteligência Gerencial',
          icon: BarChart3,
        },
        {
          id: 'governanca',
          label: 'Governança & LGPD',
          icon: Shield,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold tracking-tight shadow-xs">
          P
        </div>
        <div className="leading-tight">
          <div className="text-white font-semibold text-sm tracking-tight">
            Paralegal Digital
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Plataforma Jurídica v2.6
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 tracking-wider">
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-emerald-800/80 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-emerald-300' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span
                      className={`ml-2 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        item.badgeType === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Office & System Scope Footer */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-medium">Escritório Modelo</span>
          <span className="text-[10px] text-slate-400 font-mono">3–15 Adv.</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Alencar & Prado Advogados Associados
        </div>
        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400">
          <Layers className="w-3 h-3" />
          <span>Contencioso Cível & Trabalhista</span>
        </div>
      </div>
    </aside>
  );
};
