import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  FileText,
  CalendarClock,
  Search,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileCheck2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { FatoCaso } from '../types';

export const CasosView: React.FC = () => {
  const {
    casos,
    selectedCasoId,
    setSelectedCasoId,
    selectedCaso,
    documentos,
    tarefas,
    atualizarFatoCaso,
    adicionarFatoAoCaso,
    historicoEventos,
    currentUser,
    setActiveModule,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'fatos' | 'documentos' | 'tarefas' | 'historico'
  >('fatos');

  // New fact modal or inline form
  const [novoFatoDesc, setNovoFatoDesc] = useState('');
  const [novoFatoCat, setNovoFatoCat] = useState<FatoCaso['categoria']>('alegado');
  const [novoFatoDocNome, setNovoFatoDocNome] = useState('');
  const [novoFatoPag, setNovoFatoPag] = useState<number | ''>('');
  const [novoFatoCitacao, setNovoFatoCitacao] = useState('');
  const [formFatoAberto, setFormFatoAberto] = useState(false);

  const caso = selectedCaso;
  if (!caso) return null;

  const docsDoCaso = documentos.filter((d) => d.casoId === caso.id);
  const tarefasDoCaso = tarefas.filter((t) => t.casoId === caso.id);

  const handleSalvarNovoFato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoFatoDesc) return;

    adicionarFatoAoCaso(caso.id, {
      descricao: novoFatoDesc,
      categoria: novoFatoCat,
      documentoNome: novoFatoDocNome || undefined,
      pagina: novoFatoPag ? Number(novoFatoPag) : undefined,
      trechoCitacao: novoFatoCitacao || undefined,
      validadoPorAdvogado: currentUser.role === 'socio' || currentUser.role === 'advogado',
      validadoPorNome: currentUser.nome,
      dataValidacao: new Date().toISOString().substring(0, 10),
    });

    setNovoFatoDesc('');
    setNovoFatoDocNome('');
    setNovoFatoPag('');
    setNovoFatoCitacao('');
    setFormFatoAberto(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Strip: Cases */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Processo em Visualização:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {casos.map((c) => {
              const isSelected = c.id === caso.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCasoId(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.numeroCnj}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('inteligencia_pesquisa')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Análise Jurídica do Caso</span>
          </button>
          <button
            onClick={() => setActiveModule('gerador_documentos')}
            className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Elaborar Peça</span>
          </button>
        </div>
      </div>

      {/* Unified Case Header (Ficha Unificada) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {caso.numeroCnj}
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium">{caso.ramo}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono">Fase: {caso.fase}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {caso.titulo}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="text-right">
              <div className="text-slate-400 text-[10px]">Valor da Causa</div>
              <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                R$ {caso.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right border-l border-slate-200 pl-4">
              <div className="text-slate-400 text-[10px]">Responsável</div>
              <div className="text-xs font-semibold text-slate-800">
                {caso.responsavelNome}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Forum Meta Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px]">Tribunal / Foro</span>
            <span className="font-medium text-slate-800">{caso.tribunal} · {caso.comarca}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Vara / Juízo</span>
            <span className="font-medium text-slate-800">{caso.vara}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Polo / Parte Contrária</span>
            <span className="font-medium text-slate-800">
              {caso.polo} vs. {caso.parteContraria}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Data Distribuição</span>
            <span className="font-mono text-slate-800">{caso.dataDistribuicao}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-1">
        <button
          onClick={() => setActiveTab('fatos')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'fatos'
              ? 'border-emerald-700 text-emerald-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Fatos & Provas Rastreáveis ({caso.fatos.length})
        </button>
        <button
          onClick={() => setActiveTab('documentos')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'documentos'
              ? 'border-emerald-700 text-emerald-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Documentos & Evidências ({docsDoCaso.length})
        </button>
        <button
          onClick={() => setActiveTab('tarefas')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'tarefas'
              ? 'border-emerald-700 text-emerald-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Prazos & Providências ({tarefasDoCaso.length})
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'historico'
              ? 'border-emerald-700 text-emerald-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Histórico Processual & Questões
        </button>
      </div>

      {/* TAB 1: Fatos e Provas Rastreáveis */}
      {activeTab === 'fatos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Diferenciação obrigatória entre <strong>fato documentalmente comprovado</strong>, <strong>alegação da parte</strong> e <strong>ponto controverso</strong>.
            </div>
            <button
              onClick={() => setFormFatoAberto(!formFatoAberto)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{formFatoAberto ? 'Fechar Formulário' : 'Novo Fato'}</span>
            </button>
          </div>

          {/* Inline Form to add fact */}
          {formFatoAberto && (
            <form
              onSubmit={handleSalvarNovoFato}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs animate-in fade-in"
            >
              <div className="font-semibold text-slate-800">
                Adicionar Fato à Teoria do Caso
              </div>
              <div>
                <label className="block text-slate-600 mb-1">
                  Descrição Factual Objetiva *
                </label>
                <textarea
                  rows={2}
                  required
                  value={novoFatoDesc}
                  onChange={(e) => setNovoFatoDesc(e.target.value)}
                  placeholder="Ex: O extrato bancário de fls. 42 demonstra o pagamento integral da parcela nº 08 em 10/11/2025."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">
                    Categoria da Informação
                  </label>
                  <select
                    value={novoFatoCat}
                    onChange={(e) => setNovoFatoCat(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="comprovado">Comprovado por Documento</option>
                    <option value="alegado">Alegado pela Parte (sem prova)</option>
                    <option value="controverso">Controverso / Impugnado</option>
                    <option value="nao_comprovado">Não Comprovado / Lacuna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">
                    Nome do Arquivo / Doc
                  </label>
                  <input
                    type="text"
                    value={novoFatoDocNome}
                    onChange={(e) => setNovoFatoDocNome(e.target.value)}
                    placeholder="Ex: Contrato_doc01.pdf"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">
                    Página / Folhas
                  </label>
                  <input
                    type="number"
                    value={novoFatoPag}
                    onChange={(e) => setNovoFatoPag(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ex: 3"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">
                  Trecho Exato da Evidência (Citação Textual)
                </label>
                <input
                  type="text"
                  value={novoFatoCitacao}
                  onChange={(e) => setNovoFatoCitacao(e.target.value)}
                  placeholder="Ex: 'Cláusula 4ª: O valor mensal é de R$ 1.200,00...'"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormFatoAberto(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium"
                >
                  Salvar Fato
                </button>
              </div>
            </form>
          )}

          {/* List of Facts */}
          <div className="space-y-3">
            {caso.fatos.map((fato) => {
              const isComprovado = fato.categoria === 'comprovado';
              return (
                <div
                  key={fato.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${
                          isComprovado
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : fato.categoria === 'controverso'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {fato.categoria === 'comprovado'
                          ? 'Comprovado'
                          : fato.categoria === 'alegado'
                          ? 'Alegado'
                          : fato.categoria === 'controverso'
                          ? 'Controverso'
                          : 'Não Comprovado'}
                      </span>
                      {fato.validadoPorAdvogado && (
                        <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Validado por {fato.validadoPorNome || 'Advogado'}
                        </span>
                      )}
                    </div>

                    {/* Quick validation toggles for human review */}
                    <div className="flex items-center gap-2 text-xs">
                      {!fato.validadoPorAdvogado ? (
                        <button
                          onClick={() =>
                            atualizarFatoCaso(caso.id, fato.id, {
                              validadoPorAdvogado: true,
                              validadoPorNome: currentUser.nome,
                              dataValidacao: new Date().toISOString().substring(0, 10),
                            })
                          }
                          className="px-2.5 py-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 rounded hover:bg-emerald-100 font-medium"
                        >
                          Aprovar como Advogado
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            atualizarFatoCaso(caso.id, fato.id, {
                              validadoPorAdvogado: false,
                            })
                          }
                          className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                        >
                          Revogar Validação
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {fato.descricao}
                  </p>

                  {/* Provenance Box if evidence exists */}
                  {fato.trechoCitacao && (
                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-medium text-slate-700">
                          Origem Documental Rastreável:
                        </span>
                        <span className="font-mono">
                          {fato.documentoNome} · Pág. {fato.pagina || '1'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 italic">
                        "{fato.trechoCitacao}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Documentos do Caso */}
      {activeTab === 'documentos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Arquivos de prova sob custódia criptográfica (SHA-256) com OCR e extração rastreável.
            </div>
            <button
              onClick={() => setActiveModule('documentos')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              <span>Abrir Repositório Completo & Visualizador</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docsDoCaso.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 truncate max-w-[220px]">
                        {doc.titulo}
                      </h4>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {doc.tipo} · {(doc.tamanhoKb / 1024).toFixed(1)} MB · {doc.totalPaginas} páginas
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                    {doc.statusAnalise === 'analisado' ? 'Analisado' : 'Pendente'}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono break-all bg-slate-50 p-1.5 rounded border border-slate-100">
                  SHA-256: {doc.hashSha256.substring(0, 36)}...
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {doc.trechos.length} trecho(s) extraído(s)
                  </span>
                  <button
                    onClick={() => setActiveModule('documentos')}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Inspecionar Trechos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Prazos e Tarefas */}
      {activeTab === 'tarefas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Prazos processuais calculados segundo as regras do CPC/CLT vinculados a este processo.
            </div>
            <button
              onClick={() => setActiveModule('agenda_tarefas')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              <span>Gerenciar na Agenda Geral</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {tarefasDoCaso.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-slate-900">
                    {t.titulo}
                  </div>
                  <div className="text-xs text-slate-500 max-w-xl">
                    {t.descricao}
                  </div>
                  {t.regraContagem && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      {t.regraContagem}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-amber-700 tabular-nums">
                    {t.diasUteisRestantes} dias úteis
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Vence em {t.dataVencimento}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Histórico & Questões */}
      {activeTab === 'historico' && (
        <div className="space-y-6">
          {/* Chronological Life Cycle Timeline */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider text-slate-500">
                Linha do Tempo Processual Conectada
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Rastreabilidade de Atos
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {(historicoEventos[caso.id] || []).map((evento) => (
                <div key={evento.id} className="relative flex items-start gap-3.5 pl-1 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center shrink-0 z-10 text-emerald-800 text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="flex-1 bg-slate-50/70 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-semibold text-slate-900">
                        {evento.titulo}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {evento.dataHora}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {evento.descricao}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
                      <span>Responsável: <strong>{evento.autorNome}</strong></span>
                      {evento.documentoId && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700">Doc ID: {evento.documentoId}</span>
                        </>
                      )}
                      {evento.tarefaId && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-800">Tarefa ID: {evento.tarefaId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider text-slate-500">
              Questões Jurídicas em Discussão
            </h3>
            <div className="space-y-3">
              {caso.questoes.map((q) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="font-semibold text-slate-900">{q.enunciado}</div>
                  <div className="flex items-center gap-2 text-slate-500 flex-wrap">
                    <span className="font-medium text-slate-700">Artigos de Lei:</span>
                    {q.artigosLei.map((art, idx) => (
                      <span key={idx} className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {art}
                      </span>
                    ))}
                  </div>
                  <div className="text-slate-600">
                    <strong>Recomendação:</strong> {q.recomendacao}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-xs text-slate-800 mb-2">
                Lacunas Probatórias Identificadas (Pontos de Atenção):
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                {caso.lacunas.map((lacuna, idx) => (
                  <li key={idx}>{lacuna}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
