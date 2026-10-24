import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  PlusCircle,
  Briefcase,
  Search,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  FileText,
  X,
} from 'lucide-react';
import { Cliente, Atendimento, Caso } from '../types';

export const ClientesView: React.FC = () => {
  const {
    clientes,
    adicionarCliente,
    atendimentos,
    adicionarAtendimento,
    converterAtendimentoEmCaso,
    allUsers,
    currentUser,
    setActiveModule,
    setSelectedCasoId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'clientes' | 'atendimentos'>('atendimentos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [modalNovoClienteOpen, setModalNovoClienteOpen] = useState(false);
  const [modalNovoAtendimentoOpen, setModalNovoAtendimentoOpen] = useState(false);
  const [modalConverterCasoOpen, setModalConverterCasoOpen] = useState(false);
  const [atendimentoSelecionadoParaConversao, setAtendimentoSelecionadoParaConversao] = useState<Atendimento | null>(null);

  // Form states - Novo Cliente
  const [novoClienteNome, setNovoClienteNome] = useState('');
  const [novoClienteTipo, setNovoClienteTipo] = useState<'PF' | 'PJ'>('PF');
  const [novoClienteCpfCnpj, setNovoClienteCpfCnpj] = useState('');
  const [novoClienteEmail, setNovoClienteEmail] = useState('');
  const [novoClienteTelefone, setNovoClienteTelefone] = useState('');
  const [novoClienteCidade, setNovoClienteCidade] = useState('São Paulo');
  const [novoClienteEstado, setNovoClienteEstado] = useState('SP');
  const [novoClienteEndereco, setNovoClienteEndereco] = useState('');

  // Form states - Novo Atendimento
  const [atendClienteId, setAtendClienteId] = useState('');
  const [atendCanal, setAtendCanal] = useState<Atendimento['canal']>('Presencial');
  const [atendAssunto, setAtendAssunto] = useState('');
  const [atendDescricao, setAtendDescricao] = useState('');
  const [atendResponsavelId, setAtendResponsavelId] = useState(currentUser.id);

  // Form states - Conversão em Caso (Fluxo A)
  const [convNumeroCnj, setConvNumeroCnj] = useState('5008912-10.2026.8.26.0100');
  const [convTitulo, setConvTitulo] = useState('');
  const [convRamo, setConvRamo] = useState<Caso['ramo']>('Cível / Bancário');
  const [convComarca, setConvComarca] = useState('São Paulo - Foro Central Cível');
  const [convVara, setConvVara] = useState('18ª Vara Cível');
  const [convJuizo, setConvJuizo] = useState('Juiz Titular da 18ª Vara Cível');
  const [convValorCausa, setConvValorCausa] = useState(35000);
  const [convResponsavelId, setConvResponsavelId] = useState(currentUser.id);

  // Handle Novo Cliente Submit
  const handleSubmitNovoCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoClienteNome || !novoClienteCpfCnpj) return;

    const criado = adicionarCliente({
      nome: novoClienteNome,
      tipo: novoClienteTipo,
      cpfCnpj: novoClienteCpfCnpj,
      email: novoClienteEmail || `${novoClienteNome.toLowerCase().replace(/\s+/g, '.')}@exemplo.com.br`,
      telefone: novoClienteTelefone || '(11) 99888-7766',
      cidade: novoClienteCidade,
      estado: novoClienteEstado,
      endereco: novoClienteEndereco || 'Endereço Comercial / Residencial em qualificação',
      status: 'ativo',
    });

    setModalNovoClienteOpen(false);
    setAtendClienteId(criado.id);
    // Reset fields
    setNovoClienteNome('');
    setNovoClienteCpfCnpj('');
    setNovoClienteEmail('');
    setNovoClienteTelefone('');
    setNovoClienteEndereco('');
  };

  // Handle Novo Atendimento Submit
  const handleSubmitNovoAtendimento = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = clientes.find((c) => c.id === atendClienteId);
    if (!cliente || !atendAssunto || !atendDescricao) return;

    const resp = allUsers.find((u) => u.id === atendResponsavelId) || currentUser;

    const criado = adicionarAtendimento({
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      data: new Date().toISOString().substring(0, 10),
      canal: atendCanal,
      assunto: atendAssunto,
      descricao: atendDescricao,
      responsavelId: resp.id,
      responsavelNome: resp.nome,
      observacoes: 'Atendimento aguardando triagem inicial e conferência documental.',
    });

    setModalNovoAtendimentoOpen(false);
    setAtendAssunto('');
    setAtendDescricao('');

    // Prepara para conversão imediata se o usuário desejar
    abrirModalConversao(criado);
  };

  const abrirModalConversao = (atend: Atendimento) => {
    setAtendimentoSelecionadoParaConversao(atend);
    setConvTitulo(`${atend.clienteNome} vs. Contraparte a qualificar`);
    setModalConverterCasoOpen(true);
  };

  // Handle Conversão em Caso (Fluxo A Passo Final)
  const handleConfirmarConversaoEmCaso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atendimentoSelecionadoParaConversao) return;

    const novoCaso = converterAtendimentoEmCaso(atendimentoSelecionadoParaConversao.id, {
      numeroCnj: convNumeroCnj,
      titulo: convTitulo || `${atendimentoSelecionadoParaConversao.clienteNome} vs. Parte Contrária`,
      ramo: convRamo,
      comarca: convComarca,
      vara: convVara,
      juizo: convJuizo,
      valorCausa: Number(convValorCausa) || 25000,
      responsavelId: convResponsavelId,
    });

    setModalConverterCasoOpen(false);
    setAtendimentoSelecionadoParaConversao(null);

    // Navega diretamente para o caso criado
    setSelectedCasoId(novoCaso.id);
    setActiveModule('casos');
  };

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.includes(searchTerm)
  );

  const filteredAtendimentos = atendimentos.filter(
    (a) =>
      a.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assunto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Clientes & Atendimentos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de contatos, histórico de triagens e conversão em casos operacionais (Fluxo A).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalNovoClienteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            <span>Cadastrar Cliente</span>
          </button>
          <button
            onClick={() => {
              if (clientes.length > 0 && !atendClienteId) {
                setAtendClienteId(clientes[0].id);
              }
              setModalNovoAtendimentoOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Atendimento</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('atendimentos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'atendimentos'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Atendimentos & Triagens ({atendimentos.length})
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'clientes'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Base de Clientes ({clientes.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, documento..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
          />
        </div>
      </div>

      {/* Tab 1: Atendimentos List */}
      {activeTab === 'atendimentos' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {filteredAtendimentos.map((atend) => {
              const isConvertido = atend.status === 'convertido';
              return (
                <div
                  key={atend.id}
                  className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {atend.clienteNome}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-500 font-mono">
                        Canal: {atend.canal}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-500 font-mono">
                        Data: {atend.data}
                      </span>
                    </div>

                    <div className="font-medium text-xs text-slate-800">
                      {atend.assunto}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {atend.descricao}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Responsável: <strong>{atend.responsavelNome}</strong></span>
                      {atend.observacoes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="italic">{atend.observacoes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between gap-3">
                    {isConvertido ? (
                      <div className="space-y-1.5 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Caso Criado
                        </span>
                        <div>
                          <button
                            onClick={() => {
                              if (atend.convertidoEmCasoId) {
                                setSelectedCasoId(atend.convertidoEmCasoId);
                                setActiveModule('casos');
                              }
                            }}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                          >
                            <span>Abrir Processo</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => abrirModalConversao(atend)}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Converter em Caso</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredAtendimentos.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                Nenhum atendimento encontrado para o termo pesquisado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Clientes Table */}
      {activeTab === 'clientes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nome / Razão Social</th>
                  <th className="py-3 px-4">CPF / CNPJ</th>
                  <th className="py-3 px-4">Contato</th>
                  <th className="py-3 px-4">Cidade / UF</th>
                  <th className="py-3 px-4 text-center">Processos Ativos</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClientes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.nome}</div>
                      <div className="text-[11px] text-slate-400">Tipo: {c.tipo}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                      {c.cpfCnpj}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{c.email}</div>
                      <div className="font-mono text-slate-500">{c.telefone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {c.cidade}/{c.estado}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-900">
                      {c.casosCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setAtendClienteId(c.id);
                          setModalNovoAtendimentoOpen(true);
                        }}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs"
                      >
                        Novo Atendimento
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Novo Cliente */}
      {modalNovoClienteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-900">
                Cadastrar Novo Cliente
              </h3>
              <button
                onClick={() => setModalNovoClienteOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNovoCliente} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nome Completo ou Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={novoClienteNome}
                  onChange={(e) => setNovoClienteNome(e.target.value)}
                  placeholder="Ex: Mariana Vasconcelos de Oliveira"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Tipo de Pessoa
                  </label>
                  <select
                    value={novoClienteTipo}
                    onChange={(e) => setNovoClienteTipo(e.target.value as 'PF' | 'PJ')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                  >
                    <option value="PF">Pessoa Física (PF)</option>
                    <option value="PJ">Pessoa Jurídica (PJ)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    CPF ou CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoClienteCpfCnpj}
                    onChange={(e) => setNovoClienteCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={novoClienteEmail}
                    onChange={(e) => setNovoClienteEmail(e.target.value)}
                    placeholder="cliente@exemplo.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Telefone / Celular
                  </label>
                  <input
                    type="text"
                    value={novoClienteTelefone}
                    onChange={(e) => setNovoClienteTelefone(e.target.value)}
                    placeholder="(11) 98888-7766"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={novoClienteCidade}
                    onChange={(e) => setNovoClienteCidade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={novoClienteEstado}
                    onChange={(e) => setNovoClienteEstado(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovoClienteOpen(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Novo Atendimento */}
      {modalNovoAtendimentoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-900">
                Registrar Atendimento / Triagem Inicial
              </h3>
              <button
                onClick={() => setModalNovoAtendimentoOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNovoAtendimento} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Cliente Solicitante *
                </label>
                <select
                  required
                  value={atendClienteId}
                  onChange={(e) => setAtendClienteId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.cpfCnpj})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Canal de Contato
                  </label>
                  <select
                    value={atendCanal}
                    onChange={(e) => setAtendCanal(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Presencial">Presencial no Escritório</option>
                    <option value="WhatsApp">WhatsApp Jurídico</option>
                    <option value="E-mail">E-mail Institucional</option>
                    <option value="Telefone">Ligação Telefônica</option>
                    <option value="Indicação">Indicação de Parceiro</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Advogado Responsável
                  </label>
                  <select
                    value={atendResponsavelId}
                    onChange={(e) => setAtendResponsavelId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.cargo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Assunto Principal da Consulta *
                </label>
                <input
                  type="text"
                  required
                  value={atendAssunto}
                  onChange={(e) => setAtendAssunto(e.target.value)}
                  placeholder="Ex: Ação indenizatória por atraso de voo e perda de conexão internacional"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Relato Factual do Cliente (Contexto) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={atendDescricao}
                  onChange={(e) => setAtendDescricao(e.target.value)}
                  placeholder="Descreva detalhadamente o relato do cliente, datas relevantes, documentos apresentados e pretensão manifestada..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovoAtendimentoOpen(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium"
                >
                  Registrar e Avançar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Converter Atendimento em Caso (Fluxo A) */}
      {modalConverterCasoOpen && atendimentoSelecionadoParaConversao && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  Fluxo A: Converter Atendimento em Caso Operacional
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cliente: <strong>{atendimentoSelecionadoParaConversao.clienteNome}</strong>
                </p>
              </div>
              <button
                onClick={() => setModalConverterCasoOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmarConversaoEmCaso} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Assunto: </span>
                {atendimentoSelecionadoParaConversao.assunto}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Título Operacional da Demanda *
                </label>
                <input
                  type="text"
                  required
                  value={convTitulo}
                  onChange={(e) => setConvTitulo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Número do Processo (CNJ)
                  </label>
                  <input
                    type="text"
                    required
                    value={convNumeroCnj}
                    onChange={(e) => setConvNumeroCnj(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Ramo do Direito
                  </label>
                  <select
                    value={convRamo}
                    onChange={(e) => setConvRamo(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Cível / Bancário">Cível / Bancário</option>
                    <option value="Trabalhista">Trabalhista</option>
                    <option value="Empresarial">Empresarial</option>
                    <option value="Tributário">Tributário</option>
                    <option value="Previdenciário">Previdenciário</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Comarca / Foro
                  </label>
                  <input
                    type="text"
                    value={convComarca}
                    onChange={(e) => setConvComarca(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Vara / Juízo
                  </label>
                  <input
                    type="text"
                    value={convVara}
                    onChange={(e) => setConvVara(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Valor da Causa (R$)
                  </label>
                  <input
                    type="number"
                    value={convValorCausa}
                    onChange={(e) => setConvValorCausa(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Advogado Responsável
                  </label>
                  <select
                    value={convResponsavelId}
                    onChange={(e) => setConvResponsavelId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.cargo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notice about deterministic automatic step 5 & 6 */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Ações Automáticas do Fluxo A ao Confirmar:
                </div>
                <div>• Vinculação de partes, histórico e qualificação inicial.</div>
                <div>• Geração automática da 1ª tarefa com prazo e responsável.</div>
                <div>• Registro imutável de proveniência na trilha de auditoria.</div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalConverterCasoOpen(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Efetivar Caso & Abrir Ficha</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
