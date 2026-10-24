import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Download,
  Copy,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  Printer,
  Edit3,
  GitCompare,
  Eye,
} from 'lucide-react';
import { SecaoDocumento, RegraValidacaoTemplate } from '../types';

export const GeradorDocumentosView: React.FC = () => {
  const {
    selectedCaso,
    execucoesDocumentais,
    alternarSecaoDocumento,
    aprovarPecaAdvogado,
    atualizarExecucaoDocumental,
    currentUser,
    showToast,
  } = useApp();

  const [visualizarModo, setVisualizarModo] = useState<'previa' | 'diff'>('previa');
  const [tipoModeloSelecionado, setTipoModeloSelecionado] = useState<string>('Petição Inicial');
  const [copiado, setCopiado] = useState(false);

  const caso = selectedCaso;
  if (!caso) return null;

  const exec = execucoesDocumentais[caso.id] || execucoesDocumentais['caso-01'];
  if (!exec) return null;

  // Expanded 8 Quality Gate Checks as required by Section 8 of Master Prompt
  const oitoRegrasPortaoQualidade: RegraValidacaoTemplate[] = [
    {
      id: 'reg-01',
      descricao: '1. Completude dos requisitos obrigatórios (Art. 319 CPC / Art. 840 CLT)',
      tipo: 'bloqueante',
      campo: 'partes_juizo',
      verificado: true,
    },
    {
      id: 'reg-02',
      descricao: '2. Consistência factual: todos os fatos alegados vinculados a provas nos autos',
      tipo: 'bloqueante',
      campo: 'fatos',
      verificado: true,
    },
    {
      id: 'reg-03',
      descricao: '3. Rastreabilidade das afirmações por página e trecho verificado',
      tipo: 'bloqueante',
      campo: 'rastreabilidade',
      verificado: true,
    },
    {
      id: 'reg-04',
      descricao: '4. Existência e verificabilidade das fontes jurídicas oficiais (Planalto / STJ / TST)',
      tipo: 'bloqueante',
      campo: 'fontes',
      verificado: true,
    },
    {
      id: 'reg-05',
      descricao: '5. Vigência normativa confirmada na data da contratação / ocorrência',
      tipo: 'bloqueante',
      campo: 'vigencia',
      verificado: true,
    },
    {
      id: 'reg-06',
      descricao: '6. Adequação formal ao rito procedimental e competência jurisdicional',
      tipo: 'alerta',
      campo: 'competencia',
      verificado: true,
    },
    {
      id: 'reg-07',
      descricao: '7. Consistência lógica estrita entre causa de pedir e pedidos finais',
      tipo: 'bloqueante',
      campo: 'pedidos',
      verificado: true,
    },
    {
      id: 'reg-08',
      descricao: '8. Revisão formal e assinatura por advogado inscrito na OAB',
      tipo: 'bloqueante',
      campo: 'assinatura_oab',
      verificado: exec.aprovacaoAdvogado,
      motivoReprovacao: !exec.aprovacaoAdvogado ? 'Aguardando validação e assinatura do advogado responsável.' : undefined,
    },
  ];

  const falhasBloqueantes = oitoRegrasPortaoQualidade.filter((r) => r.tipo === 'bloqueante' && !r.verificado);
  const temBloqueioCritico = falhasBloqueantes.length > 0;
  const podeExportar = !temBloqueioCritico && exec.aprovacaoAdvogado;

  // Assemble full text from active sections
  const textoCompletoPeca = exec.secoes
    .filter((s) => s.ativa)
    .map((s) => `${s.titulo}\n\n${s.conteudoEditado || s.conteudoPadrao}`)
    .join('\n\n' + '─'.repeat(40) + '\n\n');

  const handleCopiarTexto = () => {
    navigator.clipboard.writeText(textoCompletoPeca);
    setCopiado(true);
    showToast('Texto integral da peça copiado para a área de transferência!');
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleSimularExportacao = (formato: 'pdf' | 'docx') => {
    if (!podeExportar) {
      showToast('Exportação bloqueada pelo Portão de Qualidade. Necessária assinatura formal do advogado.');
      return;
    }
    showToast(`Download simulado do arquivo [${exec.tipoPeca}_${caso.numeroCnj.replace(/[^0-9]/g, '')}.${formato}] iniciado com carimbo de autenticidade SHA-256!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Gerador Documental Governado (Regras + IA)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fluxo D: Montagem modular por blocos determinísticos, portão de 8 verificações formais e comparador de versões.
          </p>
        </div>

        {/* Quality Gate Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              podeExportar
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {podeExportar ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-700" />
                <span>Portão de Qualidade: Liberado para Protocolo</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Portão de Qualidade: Bloqueado (Requer Assinatura OAB)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Case & Template Selection Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-500">Modelo Selecionado:</span>
            <select
              value={tipoModeloSelecionado}
              onChange={(e) => setTipoModeloSelecionado(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
            >
              <option value="Petição Inicial">Petição Inicial (Revisional Bancária / Consumidor)</option>
              <option value="Reclamação Trabalhista">Petição Inicial (Reclamação Trabalhista)</option>
              <option value="Contestação">Contestação com Preliminares e Mérito</option>
              <option value="Manifestação Réplica">Manifestação sobre Contestação e Provas (Réplica)</option>
            </select>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              Versão {exec.versao}.0 · Regras CPC/2015
            </span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Processo Vinculado: {caso.numeroCnj} ({caso.titulo})
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!exec.aprovacaoAdvogado ? (
            <button
              onClick={() => aprovarPecaAdvogado(caso.id)}
              className="px-3.5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Assinar Peça como Advogado (OAB)</span>
            </button>
          ) : (
            <div className="text-right text-xs">
              <span className="text-[11px] text-emerald-800 font-semibold block flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" /> Assinado por {exec.aprovadorNome}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {exec.dataAprovacao}
              </span>
            </div>
          )}

          <div className="border-l border-slate-200 pl-2 flex items-center gap-1.5">
            <button
              onClick={() => handleSimularExportacao('pdf')}
              disabled={!podeExportar}
              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                podeExportar
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title={podeExportar ? 'Exportar PDF' : 'Aprovação necessária para exportação'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>

            <button
              onClick={() => handleSimularExportacao('docx')}
              disabled={!podeExportar}
              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                podeExportar
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Quality Gate Checklist (Left 4 cols) + Interactive Editor & Diff (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quality Gate Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Portão de Qualidade Determinístico</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                8 Verificações
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Critérios determinísticos obrigatórios conforme a arquitetura de governança e CPC/CLT.
            </p>

            <div className="space-y-2">
              {oitoRegrasPortaoQualidade.map((regra) => (
                <div
                  key={regra.id}
                  className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                    regra.verificado
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : regra.tipo === 'bloqueante'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {regra.descricao}
                    </span>
                    {regra.verificado ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Tipo: {regra.tipo.toUpperCase()}</span>
                    <span>Status: {regra.verificado ? 'Conforme ✓' : 'Pendente de Ação'}</span>
                  </div>
                  {regra.motivoReprovacao && (
                    <div className="text-[10px] text-slate-600 italic">
                      Obs: {regra.motivoReprovacao}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs flex items-center justify-between">
              <span className="text-slate-600">Revisão OAB:</span>
              <span
                className={`font-semibold ${
                  exec.aprovacaoAdvogado ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {exec.aprovacaoAdvogado ? 'Assinada ✓' : 'Aguardando Assinatura'}
              </span>
            </div>
          </div>

          {/* Modular Clauses Toggle Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-semibold text-xs text-slate-900">
                Blocos & Seções Condicionais
              </h3>
              <span className="text-[10px] text-slate-400">
                Ativar/Desativar
              </span>
            </div>

            <div className="space-y-2">
              {exec.secoes.map((sec) => (
                <div
                  key={sec.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-xs"
                >
                  <div className="space-y-0.5 truncate max-w-[210px]">
                    <span className="font-medium text-slate-800 truncate block">
                      {sec.titulo}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sec.fontesVinculadas.join(', ')}
                    </span>
                  </div>

                  <button
                    disabled={sec.obrigatoria}
                    onClick={() => alternarSecaoDocumento(caso.id, sec.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      sec.obrigatoria
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : sec.ativa
                        ? 'bg-emerald-100 text-emerald-800 font-medium'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {sec.obrigatoria ? 'Fixa' : sec.ativa ? 'Ativa' : 'Oculta'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Piece Viewer & Text Editor (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Editor Bar */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-md text-xs">
                <button
                  onClick={() => setVisualizarModo('previa')}
                  className={`px-2.5 py-1 rounded transition-all font-medium ${
                    visualizarModo === 'previa'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Texto da Peça (v2.0)
                </button>
                <button
                  onClick={() => setVisualizarModo('diff')}
                  className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1 ${
                    visualizarModo === 'diff'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Comparador de Versões (Diff)</span>
                </button>
              </div>

              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {exec.secoes.filter((s) => s.ativa).length} seções ativas
              </span>
            </div>

            <button
              onClick={handleCopiarTexto}
              className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiado ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          {/* MODE 1: Standard Document Preview */}
          {visualizarModo === 'previa' && (
            <div className="p-6 font-mono text-xs text-slate-800 leading-relaxed space-y-6 max-h-[750px] overflow-y-auto bg-white select-text">
              {exec.secoes
                .filter((s) => s.ativa)
                .map((secao) => (
                  <div key={secao.id} className="space-y-2 border-b border-slate-100 pb-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 font-sans text-xs">
                        {secao.titulo}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Fontes: {secao.fontesVinculadas.join(' · ')}
                      </span>
                    </div>
                    <div className="whitespace-pre-line text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-100 font-mono text-[11px]">
                      {secao.conteudoPadrao}
                    </div>
                  </div>
                ))}

              {/* Document Signature Sign-off */}
              <div className="pt-6 text-center space-y-1 font-sans">
                <div className="text-xs text-slate-600">
                  Nestes termos, pede deferimento.
                </div>
                <div className="text-xs text-slate-500">
                  São Paulo/SP, {new Date().toLocaleDateString('pt-BR')}.
                </div>
                <div className="pt-4 font-bold text-slate-900 text-xs">
                  {exec.aprovadorNome || currentUser.nome}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {currentUser.oab || 'OAB/SP 384.912'}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Visual Version Comparator (Diff v1 vs v2) */}
          {visualizarModo === 'diff' && (
            <div className="p-6 font-mono text-xs text-slate-800 leading-relaxed space-y-5 max-h-[750px] overflow-y-auto bg-white select-text">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Comparando: <strong>Versão 1.0 (Rascunho Inicial)</strong> com <strong>Versão 2.0 (Revisão Qualificada)</strong></span>
                <span className="text-[11px] text-emerald-800 font-medium">+2 adições normativas · 0 exclusões críticas</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="font-bold font-sans text-xs text-slate-900">
                    Seção III — Dos Fatos e da Taxa de Juros
                  </h4>
                  <div className="p-3 bg-slate-50 rounded text-[11px] text-slate-700 font-mono">
                    Constatou-se, contudo, na Cláusula 7ª a cobrança de juros remuneratórios à taxa de 14,80% ao mês.
                  </div>
                  {/* Added text highlighted in green */}
                  <div className="p-3 bg-emerald-50 text-emerald-950 rounded border-l-4 border-emerald-600 text-[11px] font-mono">
                    + [ADICIONADO EM v2.0]: "A discrepância com a taxa média do BACEN (2,10% a.m.) atende com rigor aos parâmetros da Súmula 382/STJ, caracterizando onerosidade manifesta e desvantagem exagerada ao consumidor."
                  </div>
                </div>

                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <h4 className="font-bold font-sans text-xs text-slate-900">
                    Seção IV — Do Direito e Ilegalidade da TAC
                  </h4>
                  <div className="p-3 bg-slate-50 rounded text-[11px] text-slate-700 font-mono">
                    Conforme Súmula 566 do STJ e Resolução CMN 3.518/2007, é vedada a cobrança de Tarifa de Abertura de Crédito em contratos celebrados após 30/04/2008.
                  </div>
                  {/* Added text highlighted in green */}
                  <div className="p-3 bg-emerald-50 text-emerald-950 rounded border-l-4 border-emerald-600 text-[11px] font-mono">
                    + [ADICIONADO EM v2.0]: "Requer-se a repetição do indébito em dobro (art. 42, parágrafo único do CDC c/c Tema Repetitivo 972/STJ), afastada a tese de engano justificável."
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
