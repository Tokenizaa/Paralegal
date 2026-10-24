/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { SimulacaoBanner, InfoModal } from './components/SimulacaoBanner';
import { VisaoGeralView } from './components/VisaoGeralView';
import { ClientesView } from './components/ClientesView';
import { CasosView } from './components/CasosView';
import { AgendaTarefasView } from './components/AgendaTarefasView';
import { DocumentosView } from './components/DocumentosView';
import { InteligenciaPesquisaView } from './components/InteligenciaPesquisaView';
import { GeradorDocumentosView } from './components/GeradorDocumentosView';
import { MonitoramentoView } from './components/MonitoramentoView';
import { WorkflowsView } from './components/WorkflowsView';
import { RelatoriosView } from './components/RelatoriosView';
import { GovernancaView } from './components/GovernancaView';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeModule, toastMessage } = useApp();
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeModule) {
      case 'visao_geral':
        return <VisaoGeralView />;
      case 'clientes':
        return <ClientesView />;
      case 'casos':
        return <CasosView />;
      case 'agenda_tarefas':
        return <AgendaTarefasView />;
      case 'documentos':
        return <DocumentosView />;
      case 'inteligencia_pesquisa':
        return <InteligenciaPesquisaView />;
      case 'gerador_documentos':
        return <GeradorDocumentosView />;
      case 'monitoramento':
        return <MonitoramentoView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'relatorios':
        return <RelatoriosView />;
      case 'governanca':
        return <GovernancaView />;
      default:
        return <VisaoGeralView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar onOpenInfoModal={() => setInfoModalOpen(true)} />

        {/* Prototype Scope Banner & Flow Shortcuts */}
        <SimulacaoBanner />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Architecture & Verification Modal */}
      <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
