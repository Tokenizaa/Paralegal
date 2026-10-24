import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  User,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';

interface TopBarProps {
  onOpenInfoModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenInfoModal }) => {
  const {
    activeModule,
    currentUser,
    setCurrentUserRole,
    allUsers,
  } = useApp();

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'visao_geral':
        return 'Visão Geral Operacional';
      case 'clientes':
        return 'Clientes & Atendimentos';
      case 'casos':
        return 'Casos & Processos Judiciais';
      case 'agenda_tarefas':
        return 'Agenda & Prazos Processuais';
      case 'documentos':
        return 'Repositório de Evidências & Documentos';
      case 'inteligencia_pesquisa':
        return 'Inteligência Jurídica & Fontes Rastreáveis';
      case 'gerador_documentos':
        return 'Gerador Documental Híbrido (Regras + IA)';
      case 'monitoramento':
        return 'Monitoramento DJEN & Movimentações';
      case 'workflows':
        return 'Workflows & Automações de Rotina';
      case 'relatorios':
        return 'Inteligência Gerencial & SLA';
      case 'governanca':
        return 'Governança, LGPD & Auditoria';
      default:
        return 'Paralegal Digital';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 shrink-0 z-20">
      {/* Zone 1: Breadcrumb Trail & Brand Context */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-slate-800">
          <Scale className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="font-semibold text-sm tracking-tight text-slate-900 whitespace-nowrap">
            Paralegal Digital
          </span>
        </div>
        <span className="text-slate-300 font-light" aria-hidden="true">/</span>
        <h1 className="text-sm font-medium text-slate-700 truncate">
          {getModuleTitle()}
        </h1>
      </div>

      {/* Zone 2: Navigation Context / Mode Indicator */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Motor Determinístico + IA Assistida
        </span>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <button
          onClick={onOpenInfoModal}
          className="hover:text-emerald-700 flex items-center gap-1 text-slate-600 transition-colors"
          title="Ver detalhes de arquitetura e validação"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Arquitetura & Fontes</span>
        </button>
      </div>

      {/* Zone 3: Role Switcher & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-[11px] font-medium text-slate-500 px-2">Perfil:</span>
          {allUsers.map((u) => {
            const isSelected = currentUser.role === u.role;
            return (
              <button
                key={u.role}
                onClick={() => setCurrentUserRole(u.role)}
                className={`px-2.5 py-1 rounded font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Alternar para ${u.cargo}`}
              >
                {u.role === 'socio'
                  ? 'Sócio'
                  : u.role === 'advogado'
                  ? 'Advogado'
                  : u.role === 'paralegal'
                  ? 'Paralegal'
                  : 'DPO'}
              </button>
            );
          })}
        </div>

        {/* Current User Quick Display */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-xs font-semibold">
            {currentUser.nome.charAt(0)}
          </div>
          <div className="text-left text-xs leading-tight">
            <div className="font-semibold text-slate-800">{currentUser.nome}</div>
            <div className="text-slate-500 font-mono text-[10px]">
              {currentUser.oab || currentUser.cargo}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
