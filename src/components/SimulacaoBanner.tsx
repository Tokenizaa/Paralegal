import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SimulacaoBanner: React.FC = () => {
  const [minimized, setMinimized] = useState(false);
  const { setActiveModule } = useApp();

  if (minimized) {
    return (
      <div className="bg-emerald-950 text-emerald-200 px-4 py-1.5 text-xs flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Ambiente Demonstrativo Interativo:</span>
          <span>Plataforma Paralegal Digital — Motor Determinístico & Governança Jurídica</span>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="text-emerald-400 hover:text-white underline text-xs"
        >
          Expandir orientações dos fluxos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-6 py-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="text-slate-300">
            <span className="font-semibold text-white">Protótipo Funcional & Navegável:</span>{' '}
            Todos os fluxos (A a F) estão ativos. Dados de demonstração modelados segundo CPC/CLT e normas do CNJ.
          </div>
        </div>

        {/* Quick flow shortcuts */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="text-slate-400">Atalhos rápidos:</span>
          <button
            onClick={() => setActiveModule('clientes')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
          >
            Fluxo A: Atendimento → Caso
          </button>
          <button
            onClick={() => setActiveModule('documentos')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
          >
            Fluxo B: Provas & Trechos
          </button>
          <button
            onClick={() => setActiveModule('gerador_documentos')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
          >
            Fluxo D: Portão de Qualidade
          </button>
          <button
            onClick={() => setActiveModule('monitoramento')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
          >
            Fluxo E: Publicação → Tarefa
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="text-slate-400 hover:text-white ml-2"
            title="Recolher banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Arquitetura, Fontes Normativas & Mapeamento de Produção
            </h2>
            <p className="text-xs text-slate-500">
              Plataforma Paralegal Digital — Especificações técnicas e critérios de aceitação
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Section 1: Target Audience & Proposition */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              1. Posicionamento e Diferencial Competitivo
            </h3>
            <p>
              Projetado para escritórios contenciosos brasileiros de médio porte (3 a 15 advogados). Diferencia-se de plataformas tradicionais (Astrea, ADVBOX, Legal One) pela união entre:
            </p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1">
              <li><strong>Motor determinístico rígido:</strong> regras formais versionadas, cálculo de prazos CPC/CLT sem risco de alucinação de IA, e portão de qualidade bloqueante para documentos.</li>
              <li><strong>IA delimitada com rastreabilidade:</strong> sumarização, extração de fatos e sugestão textual sempre ancorados na página e trecho do documento de origem.</li>
              <li><strong>Gestão orientada a providências:</strong> cada evento ou publicação capturada gera cálculo processual em dias úteis e tarefa com responsável.</li>
            </ul>
          </div>

          {/* Section 2: Real vs Simulated */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-700" />
              2. Capacidades do Protótipo vs. Integrações de Produção
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200/80">
                <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Funcionalidades Reais no Protótipo
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Navegação entre todos os 11 módulos funcionais.</li>
                  <li>• Conversão de Atendimento em Caso com 1ª tarefa (Fluxo A).</li>
                  <li>• Inspeção de proveniência de fatos vs documento (Fluxo B).</li>
                  <li>• Análise jurídica fundamentada com dispositivos oficiais (Fluxo C).</li>
                  <li>• Portão de qualidade determinístico com bloqueio de exportação (Fluxo D).</li>
                  <li>• Triagem de publicação DJEN e contagem em dias úteis (Fluxo E).</li>
                  <li>• Workflows de automação com decisão humana (Fluxo F).</li>
                  <li>• Controle de perfis (Sócio, Advogado, Paralegal, DPO) e logs de auditoria.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-slate-600" />
                  Conectores para Ativação em Produção
                </div>
                <ul className="space-y-1 text-slate-600">
                  <li>• <strong>Supabase:</strong> Preservação de tabelas existentes, Row Level Security (RLS) e storage seguro de PDFs.</li>
                  <li>• <strong>DataJud / CNJ API:</strong> Consulta federada de movimentações processuais por número CNJ.</li>
                  <li>• <strong>DJEN Conector:</strong> Consumo automatizado de comunicações eletrônicas com certificado digital.</li>
                  <li>• <strong>Planalto / LexML:</strong> Verificação programática de vigência de leis e súmulas via webhooks.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Responsible AI & LGPD */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              3. Governança, LGPD e Autoridade Jurídica
            </h3>
            <p className="text-slate-600">
              Em nenhuma hipótese a IA possui autoridade final sobre prazos fatais, vigência de leis ou peças processuais. A revisão por advogado inscrito na OAB é obrigatória (human-in-the-loop). Dados sensíveis são pseudonimizados antes de qualquer chamada a modelos externos.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-medium"
          >
            Entendido, explorar protótipo
          </button>
        </div>
      </div>
    </div>
  );
};
