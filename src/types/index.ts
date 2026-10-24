/**
 * Tipos centrais do domínio da Plataforma Paralegal Digital
 * Modelado em conformidade com o direito processual brasileiro (CPC, CLT, CNJ, DataJud, DJEN)
 */

export type UserRole = 'socio' | 'advogado' | 'paralegal' | 'dpo';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  oab?: string;
  role: UserRole;
  cargo: string;
  avatarUrl?: string;
}

export type StatusAtendimento = 'novo' | 'em_analise' | 'convertido' | 'arquivado';

export interface Atendimento {
  id: string;
  clienteId: string;
  clienteNome: string;
  data: string;
  canal: 'WhatsApp' | 'Presencial' | 'E-mail' | 'Telefone' | 'Indicação';
  assunto: string;
  descricao: string;
  responsavelId: string;
  responsavelNome: string;
  status: StatusAtendimento;
  convertidoEmCasoId?: string;
  observacoes?: string;
  createdAt: string;
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  cpfCnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  endereco: string;
  dataCadastro: string;
  status: 'ativo' | 'inativo' | 'potencial';
  casosCount: number;
}

export type PoloProcessual = 'Ativo' | 'Passivo' | 'Terceiro Interessado';
export type FaseProcessual = 'Inicial' | 'Instrução' | 'Decisória' | 'Recursal' | 'Cumprimento de Sentença';

export interface FatoCaso {
  id: string;
  descricao: string;
  categoria: 'comprovado' | 'alegado' | 'controverso' | 'nao_comprovado';
  documentoId?: string;
  documentoNome?: string;
  pagina?: number;
  trechoCitacao?: string;
  validadoPorAdvogado: boolean;
  validadoPorNome?: string;
  dataValidacao?: string;
}

export interface QuestaoJuridica {
  id: string;
  enunciado: string;
  artigosLei: string[];
  precedentesRelevantes: string[];
  risco: 'baixo' | 'medio' | 'alto';
  recomendacao: string;
}

export interface Caso {
  id: string;
  numeroCnj: string; // Ex: 5001289-44.2026.8.26.0100
  titulo: string;
  clienteId: string;
  clienteNome: string;
  parteContraria: string;
  polo: PoloProcessual;
  ramo: 'Cível / Bancário' | 'Trabalhista' | 'Tributário' | 'Empresarial' | 'Previdenciário';
  tribunal: string; // TJSP, TRT2, etc.
  comarca: string;
  vara: string;
  juizo: string;
  fase: FaseProcessual;
  valorCausa: number;
  responsavelId: string;
  responsavelNome: string;
  status: 'ativo' | 'suspenso' | 'encerrado';
  dataDistribuicao: string;
  fatos: FatoCaso[];
  questoes: QuestaoJuridica[];
  lacunas: string[];
  documentosCount: number;
  tarefasAbertasCount: number;
}

export interface DocumentoTrecho {
  id: string;
  pagina: number;
  texto: string;
  fatoCorrespondenteId?: string;
  confiancaOcr: number; // 0 a 100
  tipoDado: 'clausula_contratual' | 'comprovante_negativacao' | 'calculo' | 'declaracao' | 'outro';
  statusValidacao: 'pendente' | 'aprovado' | 'rejeitado';
}

export interface DocumentoCaso {
  id: string;
  casoId: string;
  titulo: string;
  tipo: 'Contrato' | 'Comprovante' | 'Procuração' | 'Extrato' | 'Laudo' | 'Petição';
  tamanhoKb: number;
  formato: 'pdf' | 'docx' | 'xlsx';
  dataUpload: string;
  versao: number;
  hashSha256: string;
  statusAnalise: 'pendente' | 'analisado' | 'com_divergencia';
  totalPaginas: number;
  trechos: DocumentoTrecho[];
}

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta' | 'fatal';
export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';

export interface Tarefa {
  id: string;
  casoId?: string;
  casoNumero?: string;
  clienteNome?: string;
  titulo: string;
  descricao: string;
  responsavelId: string;
  responsavelNome: string;
  prioridade: PrioridadeTarefa;
  dataCriacao: string;
  dataVencimento: string; // YYYY-MM-DD
  diasUteisRestantes: number;
  status: StatusTarefa;
  tipo: 'prazo_processual' | 'atendimento' | 'elaboracao_peca' | 'audiencia' | 'revisao_documental';
  origemPublicacaoId?: string;
  regraContagem?: string; // Ex: "Art. 219 CPC (dias úteis, exclusão do dia do começo)"
}

export interface PublicacaoDjen {
  id: string;
  casoId?: string;
  numeroProcesso: string;
  tribunal: string;
  diario: string; // Ex: "DJEN - Caderno Administrativo e Judicial"
  dataDisponibilizacao: string;
  dataPublicacaoEfetiva: string; // Dia útil seguinte
  textoPublicacao: string;
  providenciaSugerida: string;
  prazoSugeridoDiasUteis: number;
  fundamentoPrazo: string;
  statusProcessamento: 'nova' | 'em_triagem' | 'tarefa_criada' | 'arquivada';
  tarefaVinculadaId?: string;
  advogadoNotificado: string;
}

export interface FonteNormativa {
  dispositivo: string; // Ex: "Art. 39, V e 51, IV do CDC (Lei 8.078/1990)"
  orgaoEmissor: string;
  vigente: boolean;
  verificadaEm: string;
  urlOficial: string;
  trechoOficial: string;
}

export interface PrecedenteJudicial {
  identificador: string; // Ex: "STJ - Tema Repetitivo 972"
  tribunal: string;
  relator: string;
  dataJulgamento: string;
  tese: string;
  vinculante: boolean;
  linkOficial: string;
}

export interface AnaliseJuridicaCaso {
  id: string;
  casoId: string;
  tesePrincipal: string;
  perguntaJuridica: string;
  fatosComprovados: string[];
  fatosAlegados: string[];
  fatosNaoComprovados: string[];
  dispositivosLegais: FonteNormativa[];
  precedentes: PrecedenteJudicial[];
  argumentosFavoraveis: string[];
  argumentosContrarios: string[];
  riscosIdentificados: { descricao: string; probabilidade: 'baixa' | 'media' | 'alta'; impacto: 'baixo' | 'medio' | 'alto' }[];
  lacunasProbatorias: string[];
  revisadoPor?: string;
  dataRevisao?: string;
  versao: number;
}

export interface RegraValidacaoTemplate {
  id: string;
  descricao: string;
  tipo: 'bloqueante' | 'alerta' | 'sugestao';
  campo: string;
  verificado: boolean;
  motivoReprovacao?: string;
}

export interface SecaoDocumento {
  id: string;
  titulo: string;
  obrigatoria: boolean;
  ativa: boolean;
  conteudoPadrao: string;
  conteudoEditado?: string;
  fontesVinculadas: string[];
}

export interface ExecucaoDocumental {
  id: string;
  casoId: string;
  tipoPeca: 'Petição Inicial' | 'Contestação' | 'Manifestação sobre Documentos' | 'Recurso de Apelação';
  versao: number;
  dataCriacao: string;
  secoes: SecaoDocumento[];
  regrasValidacao: RegraValidacaoTemplate[];
  aprovacaoAdvogado: boolean;
  aprovadorNome?: string;
  dataAprovacao?: string;
  bloqueadoParaExportacao: boolean;
}

export interface EtapaWorkflow {
  id: string;
  titulo: string;
  tipo: 'automatica' | 'decisao_humana' | 'validacao_regras' | 'notificacao';
  responsavel: string;
  status: 'pendente' | 'em_progresso' | 'concluida' | 'aguardando_aprovacao' | 'falha';
  detalhe?: string;
  dataConclusao?: string;
}

export interface WorkflowInstancia {
  id: string;
  nome: string;
  descricao: string;
  casoId?: string;
  casoTitulo?: string;
  dataInicio: string;
  etapas: EtapaWorkflow[];
  statusGeral: 'ativo' | 'pausado_aprovacao' | 'concluido' | 'cancelado';
}

export interface AuditLogItem {
  id: string;
  dataHora: string;
  usuario: string;
  papel: UserRole;
  acao: string;
  entidade: string;
  recursoId: string;
  detalhes: string;
  ipOrigem: string;
}

export interface HistoricoEventoCaso {
  id: string;
  dataHora: string;
  tipo: 'atendimento' | 'distribuicao' | 'juntada_documento' | 'publicacao_djen' | 'tarefa' | 'analise_juridica' | 'peca_gerada';
  titulo: string;
  descricao: string;
  autorNome: string;
  documentoId?: string;
  tarefaId?: string;
}

export interface ConectorJudicial {
  id: string;
  nome: string;
  orgao: string;
  tipo: 'DJEN' | 'DataJud' | 'Tribunal_PJe' | 'Tribunal_eSAJ' | 'Planalto_LexML';
  status: 'operacional' | 'degradado' | 'em_manutencao';
  ultimaSincronizacao: string;
  proximaVarredura: string;
  checkpointId: string;
  latenciaMs: number;
  taxaSucesso24h: number; // e.g. 99.8
}

