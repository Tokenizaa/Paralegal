import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  FileCheck,
  BellRing,
  Briefcase,
  ArrowRight,
  Clock,
  UserCheck,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const VisaoGeralView: React.FC = () => {
  const {
    casos,
    tarefas,
    publicacoes,
    setActiveModule,
    setSelectedCasoId,
    execucoesDocumentais,
    concluirTarefa,
  } = useApp();

  const prazosFatais = tarefas
    .filter((t) => t.status !== 'concluida')
    .sort((a, b) => a.diasUteisRestantes - b.diasUteisRestantes);

  const publicacoesPendentes = publicacoes.filter(
    (p) => p.statusProcessamento === 'nova'
  );

  const casosAtivosCount = casos.filter((c) => c.status === 'ativo').length;
  const prazosCriticosCount = prazosFatais.filter((t) => t.diasUteisRestantes <= 5).length;
  const pecasPendentesAprovacao = Object.values(execucoesDocumentais).filter(
    (e) => !e.aprovacaoAdvogado
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Centro Operacional do Contencioso
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Alencar & Prado Advogados</span>
            <span aria-hidden="true">·</span>
            <span>Regras Processuais Ativas: CPC/2015 & CLT</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Tribunais: TJSP / TRT2 / STJ</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveModule('clientes')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Atendimento</span>
          </button>
          <button
            onClick={() => setActiveModule('gerador_documentos')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Gerar Petição</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Casos em Andamento</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {casosAtivosCount}
            </span>
            <span className="text-xs text-slate-500">processos ativos</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Valor sob gestão:</span>
            <span className="font-mono font-medium text-slate-700">R$ 183.900,00</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Prazos Fatais (≤ 5 dias)</span>
            <CalendarClock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-amber-700 tabular-nums">
              {prazosCriticosCount}
            </span>
            <span className="text-xs text-slate-500">em contagem útil</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Contagem CPC Art. 219:</span>
            <span className="font-mono text-emerald-700 font-medium">100% tempestivos</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Publicações DJEN Pendentes</span>
            <BellRing className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {publicacoesPendentes.length}
            </span>
            <span className="text-xs text-slate-500">requerem triagem</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Sugestão de providência:</span>
            <span className="text-emerald-700 font-medium">Disponível</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Validação de Peças (Portão)</span>
            <FileCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {pecasPendentesAprovacao > 0 ? pecasPendentesAprovacao : '0'}
            </span>
            <span className="text-xs text-slate-500">bloqueios críticos: 0</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Governança formal:</span>
            <span className="text-emerald-700 font-medium">Motor ativo</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines & Captured Publications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Prazos Processuais */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-emerald-700" />
              <h3 className="font-semibold text-sm text-slate-900">
                Prazos Processuais & Providências Iminentes
              </h3>
            </div>
            <button
              onClick={() => setActiveModule('agenda_tarefas')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              <span>Ver agenda completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {prazosFatais.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-900 truncate">
                      {t.titulo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                    <span className="font-mono text-slate-700 font-medium">
                      {t.casoNumero}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{t.clienteNome}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600">Resp: {t.responsavelNome}</span>
                  </div>
                  {t.regraContagem && (
                    <div className="text-[10px] text-slate-600 font-mono">
                      Regra: {t.regraContagem}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-xs font-mono font-bold tabular-nums ${
                        t.diasUteisRestantes <= 5
                          ? 'text-amber-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {t.diasUteisRestantes} dias úteis
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">
                      Venc: {t.dataVencimento}
                    </div>
                  </div>

                  <button
                    onClick={() => concluirTarefa(t.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-emerald-50 transition-colors"
                    title="Marcar como cumprido"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Publicações DJEN */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-700" />
              <h3 className="font-semibold text-sm text-slate-900">
                Publicações DJEN em Triagem
              </h3>
            </div>
            <button
              onClick={() => setActiveModule('monitoramento')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {publicacoes.slice(0, 2).map((pub) => {
              const isNova = pub.statusProcessamento === 'nova';
              return (
                <div
                  key={pub.id}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-slate-800">
                      {pub.numeroProcesso}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono">
                      {pub.dataDisponibilizacao}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pub.textoPublicacao}
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-emerald-800 font-medium truncate max-w-[200px]">
                      {pub.providenciaSugerida}
                    </div>
                    {isNova ? (
                      <button
                        onClick={() => {
                          setActiveModule('monitoramento');
                        }}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-medium hover:bg-emerald-800 transition-colors"
                      >
                        Triar Publicação
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-600 font-mono">
                        Tarefa gerada ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demonstration Cases Fast Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Casos Demonstrativos Selecionados
            </h3>
            <p className="text-xs text-slate-500">
              Casos com peças, fatos com rastreabilidade em páginas de documentos e regras do CPC/CLT.
            </p>
          </div>
          <button
            onClick={() => setActiveModule('casos')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
          >
            <span>Ver Ficha Unificada Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {casos.map((caso) => (
            <div
              key={caso.id}
              onClick={() => {
                setSelectedCasoId(caso.id);
                setActiveModule('casos');
              }}
              className="p-4 rounded-lg border border-slate-200 hover:border-emerald-600/50 hover:bg-emerald-50/20 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-800 font-semibold">
                  {caso.numeroCnj}
                </span>
                <span className="text-slate-600 text-[11px]">{caso.ramo}</span>
              </div>
              <h4 className="font-semibold text-sm text-slate-900 group-hover:text-emerald-900">
                {caso.titulo}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span>{caso.vara}</span>
                <span aria-hidden="true">·</span>
                <span>{caso.tribunal}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Valor: R$ {caso.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>Resp: {caso.responsavelNome}</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  Abrir Ficha <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
