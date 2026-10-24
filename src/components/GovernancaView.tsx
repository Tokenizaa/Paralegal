import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  AlertCircle,
  Eye,
  Key,
} from 'lucide-react';

export const GovernancaView: React.FC = () => {
  const { auditLogs, currentUser, setCurrentUserRole, allUsers, showToast } = useApp();

  const [minimizacaoAtiva, setMinimizacaoAtiva] = useState(true);
  const [retencaoDias, setRetencaoDias] = useState(1825); // 5 anos (prescrição cível/trabalhista)

  const handleToggleMinimizacao = () => {
    const novo = !minimizacaoAtiva;
    setMinimizacaoAtiva(novo);
    showToast(
      novo
        ? 'Pseudonimização e Minimização LGPD ativadas para chamadas de IA!'
        : 'Atenção: Minimização desativada pelo administrador.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Governança, Segurança & Conformidade LGPD
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de acesso granular (RBAC), minimização de dados sensíveis e trilha de auditoria imutável.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>LGPD & Sigilo Profissional OAB</span>
        </div>
      </div>

      {/* Grid: RBAC and Privacy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RBAC Role Management */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="font-semibold text-xs text-slate-900">
                Matriz de Perfis & Permissões (RBAC)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Controle Granular
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {allUsers.map((u) => {
              const isCurrent = currentUser.id === u.id;
              return (
                <div
                  key={u.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{u.nome}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                          Sessão Ativa
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {u.cargo} {u.oab ? `· ${u.oab}` : ''}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentUserRole(u.role)}
                    className="px-2.5 py-1 text-xs border border-slate-300 hover:bg-white rounded text-slate-700 font-medium"
                  >
                    Assumir Perfil
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
            * <strong>Sócio:</strong> Acesso total, aprovação documental e configuração de regras.
            <br />* <strong>Advogado:</strong> Redação, revisão e protocolização de peças.
            <br />* <strong>Paralegal:</strong> Triagem de publicações e conferência de provas.
            <br />* <strong>DPO:</strong> Auditoria de privacidade e inspeção de logs.
          </div>
        </div>

        {/* LGPD & AI Safety Protocol */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700" />
              <h3 className="font-semibold text-xs text-slate-900">
                Minimização de Dados & Governança de IA
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Segurança
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle Switch */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 block">
                  Pseudonimização Automática Pré-Envio
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Substitui CPFs, contas bancárias e dados sensíveis por tokens sintéticos antes de qualquer processamento por modelos de linguagem.
                </p>
              </div>

              <button
                onClick={handleToggleMinimizacao}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  minimizacaoAtiva ? 'bg-emerald-700' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    minimizacaoAtiva ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Retention Rule */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800 block">
                Política de Retenção & Descarte Seguro
              </span>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Prazo de expurgo pós-trânsito em julgado:</span>
                <span className="font-mono font-bold text-slate-900">
                  {retencaoDias / 365} anos ({retencaoDias} dias)
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Cláusula de Autoridade Jurídica:</strong> Modelos de IA atuam exclusivamente como assistentes delimitados de rascunho e extração. A decisão processual e a autenticação da vigência legal permanecem sob responsabilidade indelegável do advogado inscrito na OAB.
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-700" />
            <h3 className="font-semibold text-xs text-slate-900">
              Trilha de Auditoria Imutável (Audit Trail)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {auditLogs.length} eventos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Usuário & Perfil</th>
                <th className="py-2.5 px-3">Ação Realizada</th>
                <th className="py-2.5 px-3">Entidade & Recurso</th>
                <th className="py-2.5 px-3">Detalhes da Operação</th>
                <th className="py-2.5 px-3 text-right">IP Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {log.dataHora}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 font-sans font-medium whitespace-nowrap">
                    {log.usuario}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-800 font-sans whitespace-nowrap">
                    {log.acao}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {log.entidade} ({log.recursoId})
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700 max-w-md truncate">
                    {log.detalhes}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 text-[10px]">
                    {log.ipOrigem}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
