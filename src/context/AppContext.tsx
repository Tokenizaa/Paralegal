import React, { createContext, useContext, useState } from 'react';
import {
  Cliente,
  Atendimento,
  Caso,
  DocumentoCaso,
  Tarefa,
  PublicacaoDjen,
  AnaliseJuridicaCaso,
  ExecucaoDocumental,
  WorkflowInstancia,
  AuditLogItem,
  UserProfile,
  UserRole,
  FatoCaso,
  ConectorJudicial,
  HistoricoEventoCaso,
} from '../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  INITIAL_CLIENTES,
  INITIAL_ATENDIMENTOS,
  INITIAL_CASOS,
  INITIAL_DOCUMENTOS,
  INITIAL_TAREFAS,
  INITIAL_PUBLICACOES,
  INITIAL_ANALISE_CASO_01,
  INITIAL_EXECUCAO_DOCUMENTAL,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONECTORES,
  INITIAL_HISTORICO_EVENTOS,
} from '../data/mockData';

export type ActiveModule =
  | 'visao_geral'
  | 'clientes'
  | 'casos'
  | 'agenda_tarefas'
  | 'documentos'
  | 'inteligencia_pesquisa'
  | 'gerador_documentos'
  | 'monitoramento'
  | 'workflows'
  | 'relatorios'
  | 'governanca';

interface AppContextType {
  // Navigation & Role
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  allUsers: UserProfile[];

  // Selected Entities
  selectedCasoId: string;
  setSelectedCasoId: (id: string) => void;
  selectedCaso: Caso | undefined;

  // Data Collections & Operations
  clientes: Cliente[];
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro' | 'casosCount'>) => Cliente;

  atendimentos: Atendimento[];
  adicionarAtendimento: (atend: Omit<Atendimento, 'id' | 'createdAt' | 'status'>) => Atendimento;
  converterAtendimentoEmCaso: (
    atendimentoId: string,
    dadosCaso: {
      numeroCnj: string;
      titulo: string;
      ramo: Caso['ramo'];
      comarca: string;
      vara: string;
      juizo: string;
      valorCausa: number;
      responsavelId: string;
    }
  ) => Caso;

  casos: Caso[];
  adicionarCaso: (caso: Caso) => void;
  atualizarFatoCaso: (casoId: string, fatoId: string, updates: Partial<FatoCaso>) => void;
  adicionarFatoAoCaso: (casoId: string, novoFato: Omit<FatoCaso, 'id'>) => void;

  documentos: DocumentoCaso[];
  adicionarDocumento: (doc: Omit<DocumentoCaso, 'id' | 'versao' | 'hashSha256'>) => DocumentoCaso;
  executarAnaliseDocumentoDemonstrativa: (documentoId: string) => void;
  atualizarValidacaoTrecho: (docId: string, trechoId: string, status: 'aprovado' | 'rejeitado') => void;

  tarefas: Tarefa[];
  adicionarTarefa: (tarefa: Omit<Tarefa, 'id' | 'dataCriacao'>) => Tarefa;
  concluirTarefa: (tarefaId: string) => void;

  publicacoes: PublicacaoDjen[];
  converterPublicacaoEmTarefa: (publicacaoId: string, responsavelId: string) => Tarefa;

  analisesJuridicas: Record<string, AnaliseJuridicaCaso>;
  atualizarAnaliseJuridica: (casoId: string, updates: Partial<AnaliseJuridicaCaso>) => void;

  execucoesDocumentais: Record<string, ExecucaoDocumental>;
  atualizarExecucaoDocumental: (casoId: string, updates: Partial<ExecucaoDocumental>) => void;
  alternarSecaoDocumento: (casoId: string, secaoId: string) => void;
  aprovarPecaAdvogado: (casoId: string) => void;

  workflows: WorkflowInstancia[];
  avancarEtapaWorkflow: (workflowId: string, etapaId: string) => void;
  simularErroWorkflow: (workflowId: string, etapaId: string) => void;

  auditLogs: AuditLogItem[];
  registrarAuditoria: (acao: string, entidade: string, recursoId: string, detalhes: string) => void;

  conectores: ConectorJudicial[];
  sincronizarConector: (conectorId: string) => void;

  historicoEventos: Record<string, HistoricoEventoCaso[]>;
  adicionarEventoHistorico: (casoId: string, evento: Omit<HistoricoEventoCaso, 'id' | 'dataHora'>) => void;

  // Global Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('visao_geral');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [selectedCasoId, setSelectedCasoId] = useState<string>('caso-01');

  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>(INITIAL_ATENDIMENTOS);
  const [casos, setCasos] = useState<Caso[]>(INITIAL_CASOS);
  const [documentos, setDocumentos] = useState<DocumentoCaso[]>(INITIAL_DOCUMENTOS);
  const [tarefas, setTarefas] = useState<Tarefa[]>(INITIAL_TAREFAS);
  const [publicacoes, setPublicacoes] = useState<PublicacaoDjen[]>(INITIAL_PUBLICACOES);
  const [conectores, setConectores] = useState<ConectorJudicial[]>(INITIAL_CONECTORES);
  const [historicoEventos, setHistoricoEventos] = useState<Record<string, HistoricoEventoCaso[]>>(INITIAL_HISTORICO_EVENTOS);
  const [analisesJuridicas, setAnalisesJuridicas] = useState<Record<string, AnaliseJuridicaCaso>>({
    'caso-01': INITIAL_ANALISE_CASO_01,
  });
  const [execucoesDocumentais, setExecucoesDocumentais] = useState<Record<string, ExecucaoDocumental>>({
    'caso-01': INITIAL_EXECUCAO_DOCUMENTAL,
  });
  const [workflows, setWorkflows] = useState<WorkflowInstancia[]>(INITIAL_WORKFLOWS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const adicionarEventoHistorico = (casoId: string, evento: Omit<HistoricoEventoCaso, 'id' | 'dataHora'>) => {
    const novoEvento: HistoricoEventoCaso = {
      ...evento,
      id: `he-${Date.now()}`,
      dataHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setHistoricoEventos((prev) => ({
      ...prev,
      [casoId]: [novoEvento, ...(prev[casoId] || [])],
    }));
  };

  const sincronizarConector = (conectorId: string) => {
    const horaAgora = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setConectores((prev) =>
      prev.map((c) =>
        c.id === conectorId
          ? {
              ...c,
              ultimaSincronizacao: horaAgora,
              latenciaMs: Math.floor(Math.random() * 80) + 90,
            }
          : c
      )
    );
    registrarAuditoria('Varredura de Conector Judicial', 'ConectorJudicial', conectorId, `Checkpoint de sincronização atualizado.`);
    showToast('Conector sincronizado com sucesso!');
  };

  const registrarAuditoria = (acao: string, entidade: string, recursoId: string, detalhes: string) => {
    const novoLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      dataHora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario: `${currentUser.nome} (${currentUser.id})`,
      papel: currentUser.role,
      acao,
      entidade,
      recursoId,
      detalhes,
      ipOrigem: '189.120.45.10 (Sessão Ativa)',
    };
    setAuditLogs((prev) => [novoLog, ...prev]);
  };

  const setCurrentUserRole = (role: UserRole) => {
    const matched = MOCK_USERS.find((u) => u.role === role) || {
      ...currentUser,
      role,
    };
    setCurrentUser(matched);
    registrarAuditoria('Alteração de Perfil de Acesso', 'UserProfile', matched.id, `Perfil alterado para ${role.toUpperCase()}`);
    showToast(`Perfil alterado para: ${matched.cargo}`);
  };

  // FLUXO A: Adicionar Cliente
  const adicionarCliente = (dados: Omit<Cliente, 'id' | 'dataCadastro' | 'casosCount'>): Cliente => {
    const novoId = `cli-${Date.now().toString().slice(-4)}`;
    const novoCliente: Cliente = {
      ...dados,
      id: novoId,
      dataCadastro: new Date().toISOString().substring(0, 10),
      casosCount: 0,
    };
    setClientes((prev) => [novoCliente, ...prev]);
    registrarAuditoria('Criação de Cliente', 'Cliente', novoId, `Cadastrado cliente ${novoCliente.nome} (${novoCliente.cpfCnpj})`);
    showToast(`Cliente "${novoCliente.nome}" cadastrado com sucesso.`);
    return novoCliente;
  };

  // FLUXO A: Adicionar Atendimento
  const adicionarAtendimento = (dados: Omit<Atendimento, 'id' | 'createdAt' | 'status'>): Atendimento => {
    const novoId = `atend-${Date.now().toString().slice(-4)}`;
    const novoAtend: Atendimento = {
      ...dados,
      id: novoId,
      status: 'novo',
      createdAt: new Date().toISOString(),
    };
    setAtendimentos((prev) => [novoAtend, ...prev]);
    registrarAuditoria('Registro de Atendimento', 'Atendimento', novoId, `Registrado atendimento para ${novoAtend.clienteNome}`);
    showToast(`Atendimento registrado com sucesso.`);
    return novoAtend;
  };

  // FLUXO A: Converter Atendimento em Caso
  const converterAtendimentoEmCaso = (
    atendimentoId: string,
    dadosCaso: {
      numeroCnj: string;
      titulo: string;
      ramo: Caso['ramo'];
      comarca: string;
      vara: string;
      juizo: string;
      valorCausa: number;
      responsavelId: string;
    }
  ): Caso => {
    const atend = atendimentos.find((a) => a.id === atendimentoId);
    if (!atend) throw new Error('Atendimento não encontrado');

    const novoCasoId = `caso-${Date.now().toString().slice(-4)}`;
    const respUser = MOCK_USERS.find((u) => u.id === dadosCaso.responsavelId) || currentUser;

    const novoCaso: Caso = {
      id: novoCasoId,
      numeroCnj: dadosCaso.numeroCnj,
      titulo: dadosCaso.titulo,
      clienteId: atend.clienteId,
      clienteNome: atend.clienteNome,
      parteContraria: 'A definir / Em qualificação',
      polo: 'Ativo',
      ramo: dadosCaso.ramo,
      tribunal: 'TJSP',
      comarca: dadosCaso.comarca,
      vara: dadosCaso.vara,
      juizo: dadosCaso.juizo,
      fase: 'Inicial',
      valorCausa: dadosCaso.valorCausa,
      responsavelId: respUser.id,
      responsavelNome: respUser.nome,
      status: 'ativo',
      dataDistribuicao: new Date().toISOString().substring(0, 10),
      documentosCount: 0,
      tarefasAbertasCount: 1,
      fatos: [
        {
          id: `fat-${Date.now()}-1`,
          descricao: `Fato inicial registrado no atendimento: ${atend.descricao.substring(0, 120)}...`,
          categoria: 'alegado',
          validadoPorAdvogado: false,
        },
      ],
      questoes: [
        {
          id: `q-${Date.now()}-1`,
          enunciado: `Análise preliminar da pretensão: ${atend.assunto}`,
          artigosLei: ['Art. 319 do CPC', 'Código Civil Art. 186/927'],
          precedentesRelevantes: ['Precedente preliminar em pesquisa'],
          risco: 'medio',
          recomendacao: 'Solicitar procuração assinada e documentos de identificação para instrução da inicial.',
        },
      ],
      lacunas: ['Comprovante de residência atualizado', 'Documento comprobatório da relação contratual'],
    };

    // Criar primeira tarefa do caso (Etapa 5 do Fluxo A)
    const primeiraTarefa: Tarefa = {
      id: `tar-${Date.now().toString().slice(-4)}`,
      casoId: novoCasoId,
      casoNumero: novoCaso.numeroCnj,
      clienteNome: atend.clienteNome,
      titulo: `Coletar procuração e documentos complementares - ${atend.clienteNome}`,
      descricao: `Intruir o caso recém-convertido a partir do atendimento #${atendimentoId}. Validar documentos de comprovação factual.`,
      responsavelId: respUser.id,
      responsavelNome: respUser.nome,
      prioridade: 'alta',
      dataCriacao: new Date().toISOString().substring(0, 10),
      dataVencimento: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
      diasUteisRestantes: 5,
      status: 'pendente',
      tipo: 'atendimento',
    };

    // Atualizar estado de atendimento
    setAtendimentos((prev) =>
      prev.map((a) => (a.id === atendimentoId ? { ...a, status: 'convertido', convertidoEmCasoId: novoCasoId } : a))
    );

    // Incrementar contagem no cliente
    setClientes((prev) =>
      prev.map((c) => (c.id === atend.clienteId ? { ...c, casosCount: c.casosCount + 1 } : c))
    );

    setCasos((prev) => [novoCaso, ...prev]);
    setTarefas((prev) => [primeiraTarefa, ...prev]);
    setSelectedCasoId(novoCasoId);

    adicionarEventoHistorico(novoCasoId, {
      tipo: 'atendimento',
      titulo: 'Atendimento Convertido em Caso Operacional',
      descricao: `Atendimento inicial convertido no processo CNJ ${novoCaso.numeroCnj}. Primeira providência agendada com 5 dias úteis.`,
      autorNome: currentUser.nome,
      tarefaId: primeiraTarefa.id,
    });

    registrarAuditoria(
      'Conversão de Atendimento em Caso',
      'Caso',
      novoCasoId,
      `Atendimento #${atendimentoId} convertido no caso CNJ ${novoCaso.numeroCnj} com 1ª tarefa agendada.`
    );

    showToast(`Caso "${novoCaso.titulo}" criado com sucesso com 1ª tarefa atribuída a ${respUser.nome}!`);
    return novoCaso;
  };

  const adicionarCaso = (caso: Caso) => {
    setCasos((prev) => [caso, ...prev]);
    registrarAuditoria('Criação de Caso Manual', 'Caso', caso.id, `Novo processo cadastrado: ${caso.numeroCnj}`);
  };

  const atualizarFatoCaso = (casoId: string, fatoId: string, updates: Partial<FatoCaso>) => {
    setCasos((prev) =>
      prev.map((c) => {
        if (c.id !== casoId) return c;
        return {
          ...c,
          fatos: c.fatos.map((f) => (f.id === fatoId ? { ...f, ...updates } : f)),
        };
      })
    );
    registrarAuditoria('Atualização de Fato Processual', 'Caso', casoId, `Fato #${fatoId} atualizado com nova categoria ou validação.`);
    showToast('Fato do caso atualizado.');
  };

  const adicionarFatoAoCaso = (casoId: string, novoFato: Omit<FatoCaso, 'id'>) => {
    const id = `fat-${Date.now()}`;
    setCasos((prev) =>
      prev.map((c) => (c.id === casoId ? { ...c, fatos: [...c.fatos, { ...novoFato, id }] } : c))
    );
    registrarAuditoria('Inclusão de Fato', 'Caso', casoId, `Adicionado novo fato ao caso: "${novoFato.descricao.substring(0, 40)}..."`);
    showToast('Fato adicionado ao histórico do caso.');
  };

  // FLUXO B: Documentos
  const adicionarDocumento = (doc: Omit<DocumentoCaso, 'id' | 'versao' | 'hashSha256'>): DocumentoCaso => {
    const novoDocId = `doc-${Date.now().toString().slice(-4)}`;
    const novoDoc: DocumentoCaso = {
      ...doc,
      id: novoDocId,
      versao: 1,
      hashSha256: `sha256_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    };
    setDocumentos((prev) => [novoDoc, ...prev]);

    // Incrementar contagem no caso correspondente
    setCasos((prev) =>
      prev.map((c) => (c.id === doc.casoId ? { ...c, documentosCount: c.documentosCount + 1 } : c))
    );

    adicionarEventoHistorico(doc.casoId, {
      tipo: 'juntada_documento',
      titulo: `Juntada de ${doc.tipo}: ${novoDoc.titulo}`,
      descricao: `Documento recebido sob custódia probatória (hash SHA-256 gerado).`,
      autorNome: currentUser.nome,
      documentoId: novoDocId,
    });

    registrarAuditoria('Upload de Documento', 'DocumentoCaso', novoDocId, `Arquivo "${novoDoc.titulo}" carregado com hash de integridade.`);
    showToast(`Documento "${novoDoc.titulo}" registrado.`);
    return novoDoc;
  };

  // FLUXO B: Executar análise demonstrativa do documento
  const executarAnaliseDocumentoDemonstrativa = (documentoId: string) => {
    const doc = documentos.find((d) => d.id === documentoId);
    if (!doc) return;

    // Simulação determinística assistida de extração OCR com proveniência de trechos
    const novoTrecho1 = {
      id: `tr-sim-${Date.now()}-1`,
      pagina: 1,
      texto: `Cláusula Identificada: Registro de obrigações contratuais com vencimento no dia 10 e encargos moratórios calculados sobre o saldo devedor.`,
      confiancaOcr: 98,
      tipoDado: 'clausula_contratual' as const,
      statusValidacao: 'pendente' as const,
    };

    const novoTrecho2 = {
      id: `tr-sim-${Date.now()}-2`,
      pagina: Math.min(2, doc.totalPaginas),
      texto: `Assinatura Digital ICP-Brasil: Verificada autenticidade do signatário sob carimbo do tempo.`,
      confiancaOcr: 99,
      tipoDado: 'declaracao' as const,
      statusValidacao: 'aprovado' as const,
    };

    setDocumentos((prev) =>
      prev.map((d) =>
        d.id === documentoId
          ? {
              ...d,
              statusAnalise: 'analisado',
              trechos: [...d.trechos, novoTrecho1, novoTrecho2],
            }
          : d
      )
    );

    registrarAuditoria(
      'Extração Assistida de Documento',
      'DocumentoCaso',
      documentoId,
      `Extraídos trechos demonstrativos e gerada proveniência para "${doc.titulo}".`
    );

    showToast(`Análise demonstrativa do documento concluída! Fatos prontos para conferência.`);
  };

  const atualizarValidacaoTrecho = (docId: string, trechoId: string, status: 'aprovado' | 'rejeitado') => {
    setDocumentos((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        return {
          ...d,
          trechos: d.trechos.map((t) => (t.id === trechoId ? { ...t, statusValidacao: status } : t)),
        };
      })
    );
    registrarAuditoria('Conferência de Proveniência', 'DocumentoTrecho', trechoId, `Trecho marcado como ${status.toUpperCase()} por ${currentUser.nome}`);
    showToast(`Trecho ${status === 'aprovado' ? 'aprovado' : 'rejeitado'} pelo advogado.`);
  };

  // FLUXO E: Converter Publicação em Tarefa
  const converterPublicacaoEmTarefa = (publicacaoId: string, responsavelId: string): Tarefa => {
    const pub = publicacoes.find((p) => p.id === publicacaoId);
    if (!pub) throw new Error('Publicação não encontrada');

    const resp = MOCK_USERS.find((u) => u.id === responsavelId) || currentUser;
    const novaTarefaId = `tar-${Date.now().toString().slice(-4)}`;

    const novaTarefa: Tarefa = {
      id: novaTarefaId,
      casoId: pub.casoId,
      casoNumero: pub.numeroProcesso,
      clienteNome: pub.casoId ? casos.find((c) => c.id === pub.casoId)?.clienteNome : 'Cliente do Processo',
      titulo: pub.providenciaSugerida,
      descricao: `Providência oriunda da publicação DJEN disponibilizada em ${pub.dataDisponibilizacao}: "${pub.textoPublicacao.substring(0, 180)}..."`,
      responsavelId: resp.id,
      responsavelNome: resp.nome,
      prioridade: pub.prazoSugeridoDiasUteis <= 5 ? 'fatal' : 'alta',
      dataCriacao: new Date().toISOString().substring(0, 10),
      dataVencimento: new Date(Date.now() + pub.prazoSugeridoDiasUteis * 86400000 * 1.4).toISOString().substring(0, 10),
      diasUteisRestantes: pub.prazoSugeridoDiasUteis,
      status: 'pendente',
      tipo: 'prazo_processual',
      origemPublicacaoId: publicacaoId,
      regraContagem: pub.fundamentoPrazo,
    };

    setTarefas((prev) => [novaTarefa, ...prev]);

    // Marcar publicação como tarefa_criada
    setPublicacoes((prev) =>
      prev.map((p) => (p.id === publicacaoId ? { ...p, statusProcessamento: 'tarefa_criada', tarefaVinculadaId: novaTarefaId } : p))
    );

    // Incrementar tarefas do caso se existir
    if (pub.casoId) {
      setCasos((prev) =>
        prev.map((c) => (c.id === pub.casoId ? { ...c, tarefasAbertasCount: c.tarefasAbertasCount + 1 } : c))
      );

      adicionarEventoHistorico(pub.casoId, {
        tipo: 'publicacao_djen',
        titulo: `Publicação DJEN Triada e Tarefa Aberta`,
        descricao: `${pub.providenciaSugerida}. Prazo: ${pub.prazoSugeridoDiasUteis} dias úteis (venc. em ${novaTarefa.dataVencimento}).`,
        autorNome: currentUser.nome,
        tarefaId: novaTarefaId,
      });
    }

    registrarAuditoria(
      'Conversão de Publicação em Tarefa',
      'PublicacaoDjen',
      publicacaoId,
      `Publicação processada com prazo legal de ${pub.prazoSugeridoDiasUteis} dias úteis e atribuída a ${resp.nome}.`
    );

    showToast(`Tarefa processual criada e atribuída a ${resp.nome} com prazo de ${pub.prazoSugeridoDiasUteis} dias úteis!`);
    return novaTarefa;
  };

  const adicionarTarefa = (tarefa: Omit<Tarefa, 'id' | 'dataCriacao'>): Tarefa => {
    const novaId = `tar-${Date.now().toString().slice(-4)}`;
    const nova: Tarefa = {
      ...tarefa,
      id: novaId,
      dataCriacao: new Date().toISOString().substring(0, 10),
    };
    setTarefas((prev) => [nova, ...prev]);
    registrarAuditoria('Criação de Tarefa', 'Tarefa', novaId, `Tarefa "${nova.titulo}" criada para ${nova.responsavelNome}`);
    showToast(`Tarefa cadastrada com sucesso.`);
    return nova;
  };

  const concluirTarefa = (tarefaId: string) => {
    setTarefas((prev) =>
      prev.map((t) => (t.id === tarefaId ? { ...t, status: 'concluida' as const } : t))
    );
    registrarAuditoria('Conclusão de Tarefa', 'Tarefa', tarefaId, `Tarefa finalizada por ${currentUser.nome}`);
    showToast(`Tarefa concluída com sucesso!`);
  };

  // FLUXO C: Análise Jurídica
  const atualizarAnaliseJuridica = (casoId: string, updates: Partial<AnaliseJuridicaCaso>) => {
    setAnalisesJuridicas((prev) => {
      const atual = prev[casoId] || {
        id: `ana-${casoId}`,
        casoId,
        tesePrincipal: '',
        perguntaJuridica: '',
        fatosComprovados: [],
        fatosAlegados: [],
        fatosNaoComprovados: [],
        dispositivosLegais: [],
        precedentes: [],
        argumentosFavoraveis: [],
        argumentosContrarios: [],
        riscosIdentificados: [],
        lacunasProbatorias: [],
        versao: 1,
      };
      return {
        ...prev,
        [casoId]: {
          ...atual,
          ...updates,
          versao: atual.versao + 1,
          revisadoPor: `${currentUser.nome} (${currentUser.oab || currentUser.role})`,
          dataRevisao: new Date().toISOString().substring(0, 10),
        },
      };
    });
    registrarAuditoria('Revisão de Análise Jurídica', 'AnaliseJuridicaCaso', casoId, `Análise jurídica revisada e versionada por ${currentUser.nome}.`);
    showToast('Análise jurídica salva e revisada com nova versão registrada!');
  };

  // FLUXO D: Geração Documental e Portão de Qualidade
  const atualizarExecucaoDocumental = (casoId: string, updates: Partial<ExecucaoDocumental>) => {
    setExecucoesDocumentais((prev) => {
      const atual = prev[casoId] || INITIAL_EXECUCAO_DOCUMENTAL;
      return {
        ...prev,
        [casoId]: {
          ...atual,
          ...updates,
        },
      };
    });
    registrarAuditoria('Edição da Execução Documental', 'ExecucaoDocumental', casoId, 'Conteúdo de seções ou parâmetros documentais atualizados.');
  };

  const alternarSecaoDocumento = (casoId: string, secaoId: string) => {
    setExecucoesDocumentais((prev) => {
      const atual = prev[casoId];
      if (!atual) return prev;
      return {
        ...prev,
        [casoId]: {
          ...atual,
          secoes: atual.secoes.map((s) => (s.id === secaoId ? { ...s, ativa: !s.ativa } : s)),
        },
      };
    });
  };

  const aprovarPecaAdvogado = (casoId: string) => {
    setExecucoesDocumentais((prev) => {
      const atual = prev[casoId];
      if (!atual) return prev;
      return {
        ...prev,
        [casoId]: {
          ...atual,
          aprovacaoAdvogado: true,
          aprovadorNome: currentUser.nome,
          dataAprovacao: new Date().toISOString().replace('T', ' ').substring(0, 16),
          bloqueadoParaExportacao: false,
        },
      };
    });
    registrarAuditoria('Aprovação Humana da Peça', 'ExecucaoDocumental', casoId, `Peça formalmente revisada e liberada para exportação por ${currentUser.nome}`);
    showToast(`Peça aprovada e assinada por ${currentUser.nome}! Exportação liberada.`);
  };

  // FLUXO F: Workflows
  const avancarEtapaWorkflow = (workflowId: string, etapaId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf;
        const index = wf.etapas.findIndex((e) => e.id === etapaId);
        if (index === -1) return wf;

        const updatedEtapas = wf.etapas.map((e, idx) => {
          if (idx === index) {
            return {
              ...e,
              status: 'concluida' as const,
              dataConclusao: new Date().toISOString().replace('T', ' ').substring(0, 16),
            };
          }
          if (idx === index + 1 && e.status === 'pendente') {
            return {
              ...e,
              status: e.tipo === 'decisao_humana' ? ('aguardando_aprovacao' as const) : ('em_progresso' as const),
            };
          }
          return e;
        });

        const todosConcluidos = updatedEtapas.every((e) => e.status === 'concluida');

        return {
          ...wf,
          etapas: updatedEtapas,
          statusGeral: todosConcluidos ? ('concluido' as const) : wf.statusGeral,
        };
      })
    );
    registrarAuditoria('Avanço de Workflow', 'WorkflowInstancia', workflowId, `Etapa #${etapaId} concluída manualmente por ${currentUser.nome}`);
    showToast(`Etapa do workflow concluída com sucesso.`);
  };

  const simularErroWorkflow = (workflowId: string, etapaId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf;
        return {
          ...wf,
          etapas: wf.etapas.map((e) =>
            e.id === etapaId
              ? {
                  ...e,
                  status: 'falha' as const,
                  detalhe: 'Simulação de erro: Timeout no conector do Tribunal ou pendência de certidão obrigatória.',
                }
              : e
          ),
          statusGeral: 'pausado_aprovacao' as const,
        };
      })
    );
    registrarAuditoria('Falha Simulada em Workflow', 'WorkflowInstancia', workflowId, `Simulada interrupção na etapa #${etapaId}`);
    showToast(`Falha simulada na etapa. O workflow foi pausado e requer intervenção.`);
  };

  const selectedCaso = casos.find((c) => c.id === selectedCasoId) || casos[0];

  return (
    <AppContext.Provider
      value={{
        activeModule,
        setActiveModule,
        currentUser,
        setCurrentUserRole,
        allUsers: MOCK_USERS,
        selectedCasoId,
        setSelectedCasoId,
        selectedCaso,
        clientes,
        adicionarCliente,
        atendimentos,
        adicionarAtendimento,
        converterAtendimentoEmCaso,
        casos,
        adicionarCaso,
        atualizarFatoCaso,
        adicionarFatoAoCaso,
        documentos,
        adicionarDocumento,
        executarAnaliseDocumentoDemonstrativa,
        atualizarValidacaoTrecho,
        tarefas,
        adicionarTarefa,
        concluirTarefa,
        publicacoes,
        converterPublicacaoEmTarefa,
        analisesJuridicas,
        atualizarAnaliseJuridica,
        execucoesDocumentais,
        atualizarExecucaoDocumental,
        alternarSecaoDocumento,
        aprovarPecaAdvogado,
        workflows,
        avancarEtapaWorkflow,
        simularErroWorkflow,
        auditLogs,
        registrarAuditoria,
        conectores,
        sincronizarConector,
        historicoEventos,
        adicionarEventoHistorico,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};
