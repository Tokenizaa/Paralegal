import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Layers,
  Sparkles,
  Database,
  RotateCw,
  Cpu,
  Calculator,
  AlertTriangle,
} from 'lucide-react';
import { PublicacaoDjen } from '../types';

export const MonitoramentoView: React.FC = () => {
  const {
    publicacoes,
    casos,
    allUsers,
    converterPublicacaoEmTarefa,
    setActiveModule,
    setSelectedCasoId,
    conectores,
    sincronizarConector,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'publicacoes' | 'conectores' | 'calculadora'>('publicacoes');
  const [selectedRespId, setSelectedRespId] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'novas' | 'processadas'>('todos');

  // Calculator states
  const [calcDataDisp, setCalcDataDisp] = useState('2026-10-23');
  const [calcDiasUteis, setCalcDiasUteis] = useState(15);
  const [calcRegra, setCalcRegra] = useState('Art. 350/351 CPC - Réplica (15 dias úteis)');

  const filteredPubs = publicacoes.filter((p) => {
    const matchesSearch =
      p.numeroProcesso.includes(searchTerm) ||
      p.textoPublicacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tribunal.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filtroStatus === 'novas') return p.statusProcessamento === 'nova';
    if (filtroStatus === 'processadas') return p.statusProcessamento === 'tarefa_criada';
    return true;
  });

  const handleConverter = (pubId: string) => {
    const respId = selectedRespId[pubId] || currentUser.id;
    converterPublicacaoEmTarefa(pubId, respId);
  };

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Monitoramento de Publicações & Conectores Judiciais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fluxo E: Captura diária no DJEN, conectores DataJud/Tribunais e cálculo determinístico (CPC Art. 219/224).
          </p>
        </div>

        {/* Integration Status Box */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-slate-600">Conector DJEN / CNJ:</span>
          <span className="font-semibold text-slate-800 font-mono">Online · 99.9% SLA</span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 w-fit text-xs">
        <button
          onClick={() => setActiveTab('publicacoes')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'publicacoes'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Publicações Capturadas ({publicacoes.length})
        </button>
        <button
          onClick={() => setActiveTab('conectores')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'conectores'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Conectores & Fontes Oficiais ({conectores.length})
        </button>
        <button
          onClick={() => setActiveTab('calculadora')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'calculadora'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Calculadora de Prazos CPC/CLT
        </button>
      </div>

      {/* TAB 1: PUBLICAÇÕES DJEN */}
      {activeTab === 'publicacoes' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 w-fit">
              <button
                onClick={() => setFiltroStatus('todos')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filtroStatus === 'todos'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({publicacoes.length})
              </button>
              <button
                onClick={() => setFiltroStatus('novas')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filtroStatus === 'novas'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aguardando Triagem ({publicacoes.filter((p) => p.statusProcessamento === 'nova').length})
              </button>
              <button
                onClick={() => setFiltroStatus('processadas')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filtroStatus === 'processadas'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Com Tarefa Criada
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número CNJ ou texto..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
              />
            </div>
          </div>

          {/* Publications Stream */}
          <div className="space-y-4">
            {filteredPubs.map((pub) => {
              const isNova = pub.statusProcessamento === 'nova';
              const casoRelacionado = casos.find((c) => c.numeroCnj === pub.numeroProcesso || c.id === pub.casoId);

              return (
                <div
                  key={pub.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all space-y-4 ${
                    isNova
                      ? 'border-emerald-200 ring-1 ring-emerald-500/10'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Header: Court & Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {pub.numeroProcesso}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {pub.tribunal}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>Disponibilização: {pub.dataDisponibilizacao}</span>
                      <span aria-hidden="true">·</span>
                      <span>Publicação Efetiva: {pub.dataPublicacaoEfetiva}</span>
                    </div>
                  </div>

                  {/* Publication Text Snippet */}
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed italic">
                    "{pub.textoPublicacao}"
                  </div>

                  {/* Deterministic Rule Engine Box */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3.5 bg-emerald-50/50 rounded-lg border border-emerald-200/80 items-center">
                    <div className="md:col-span-8 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Providência Sugerida: {pub.providenciaSugerida}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        Regra Jurídica Aplicada: {pub.fundamentoPrazo}
                      </div>
                    </div>

                    <div className="md:col-span-4 flex items-center md:justify-end gap-3 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Prazo Legal Calculado</span>
                        <span className="font-mono font-bold text-amber-800 text-sm tabular-nums">
                          {pub.prazoSugeridoDiasUteis} dias úteis
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar: Case link and Convert to Task */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      {casoRelacionado ? (
                        <button
                          onClick={() => {
                            setSelectedCasoId(casoRelacionado.id);
                            setActiveModule('casos');
                          }}
                          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Ver Caso: {casoRelacionado.titulo}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">
                          Processo não indexado no acervo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isNova ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 text-[11px]">Atribuir a:</span>
                            <select
                              value={selectedRespId[pub.id] || currentUser.id}
                              onChange={(e) =>
                                setSelectedRespId({ ...selectedRespId, [pub.id]: e.target.value })
                              }
                              className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                            >
                              {allUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.nome}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => handleConverter(pub.id)}
                            className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-1.5"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>Converter em Tarefa</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Tarefa criada e vinculada na agenda ✓</span>
                          <button
                            onClick={() => setActiveModule('agenda_tarefas')}
                            className="underline text-emerald-800 ml-1 hover:text-emerald-950 font-semibold"
                          >
                            Ver na Agenda
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPubs.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                Nenhuma publicação encontrada para o filtro selecionado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONECTORES JUDICIAIS */}
      {activeTab === 'conectores' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Status de Sincronização e Checkpoints das Fontes Oficiais
                </h3>
                <p className="text-[11px] text-slate-500">
                  Arquitetura de monitoramento de diários e sistemas processuais (DataJud, DJEN, PJe, e-SAJ e Planalto).
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded font-semibold border border-emerald-200">
                5 Conectores Ativos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conectores.map((con) => (
                <div
                  key={con.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-xs text-slate-900">
                        {con.nome}
                      </h4>
                      <div className="text-[10px] text-slate-500">{con.orgao}</div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                      {con.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 font-mono text-[10px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Última Varredura:</span>
                      <span className="font-semibold text-slate-800">{con.ultimaSincronizacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latência:</span>
                      <span className="text-emerald-700 font-semibold">{con.latenciaMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SLA 24h:</span>
                      <span className="text-slate-800">{con.taxaSucesso24h}%</span>
                    </div>
                    <div className="text-slate-400 truncate pt-1 border-t border-slate-200">
                      Checkpoint: {con.checkpointId}
                    </div>
                  </div>

                  <button
                    onClick={() => sincronizarConector(con.id)}
                    className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sincronizar Agora</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CALCULADORA DE PRAZOS CPC/CLT */}
      {activeTab === 'calculadora' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" />
              Calculadora Determinística de Prazos Processuais
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Demonstração passo a passo da regra dos Arts. 219 e 224 do Código de Processo Civil e CLT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Data da Disponibilização no Diário
              </label>
              <input
                type="date"
                value={calcDataDisp}
                onChange={(e) => setCalcDataDisp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Regra Jurídica Aplicável
              </label>
              <select
                value={calcRegra}
                onChange={(e) => {
                  setCalcRegra(e.target.value);
                  if (e.target.value.includes('5 dias')) setCalcDiasUteis(5);
                  else if (e.target.value.includes('15 dias')) setCalcDiasUteis(15);
                  else if (e.target.value.includes('8 dias')) setCalcDiasUteis(8);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Art. 350/351 CPC - Réplica (15 dias úteis)">Art. 350/351 CPC - Réplica (15 dias úteis)</option>
                <option value="Art. 465 CPC - Quesitos Periciais (5 dias úteis)">Art. 465 CPC - Quesitos Periciais (5 dias úteis)</option>
                <option value="Art. 1.003 CPC - Apelação Cível (15 dias úteis)">Art. 1.003 CPC - Apelação Cível (15 dias úteis)</option>
                <option value="Art. 895 CLT - Recurso Ordinário (8 dias úteis)">Art. 895 CLT - Recurso Ordinário (8 dias úteis)</option>
                <option value="Art. 1.015 CPC - Agravo de Instrumento (15 dias úteis)">Art. 1.015 CPC - Agravo de Instrumento (15 dias úteis)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Duração do Prazo (Dias Úteis)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={calcDiasUteis}
                onChange={(e) => setCalcDiasUteis(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Step-by-Step Calculation Breakdown Box */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-3 text-xs">
            <span className="font-semibold text-emerald-950 block">
              Memória de Cálculo Processual Tempestiva:
            </span>

            <div className="space-y-2 font-mono text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-[10px]">1</span>
                <span>Disponibilização da Intimação: <strong>{calcDataDisp}</strong> (Sexta-feira)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-[10px]">2</span>
                <span>Data Efetiva de Publicação: <strong>26/10/2026</strong> (Primeiro dia útil seguinte à disponibilização - Art. 224, § 2º CPC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-[10px]">3</span>
                <span>Termo Inicial (Início da Contagem): <strong>27/10/2026</strong> (Exclui-se o dia do começo - Art. 224 caput CPC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-[10px]">4</span>
                <span>Contagem Exclusiva em Dias Úteis: Suspende-se no feriado nacional de Finados (02/11) e finais de semana.</span>
              </div>
              <div className="flex items-center gap-2 text-rose-800 font-bold bg-white p-2.5 rounded border border-emerald-200">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-800 text-[10px]">★</span>
                <span>TERMO FINAL (DATA LIMITE FATAL): 17/11/2026 às 23:59:59 (PJe/e-SAJ)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
