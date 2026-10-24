import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Split,
  Search,
  Filter,
} from 'lucide-react';
import { DocumentoCaso, DocumentoTrecho } from '../types';

export const DocumentosView: React.FC = () => {
  const {
    documentos,
    selectedCaso,
    adicionarDocumento,
    executarAnaliseDocumentoDemonstrativa,
    atualizarValidacaoTrecho,
    adicionarFatoAoCaso,
    currentUser,
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>(
    documentos[0]?.id || ''
  );
  const [selectedTrechoParaInspecao, setSelectedTrechoParaInspecao] =
    useState<DocumentoTrecho | null>(null);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);

  // Upload simulation state
  const [novoDocTitulo, setNovoDocTitulo] = useState('');
  const [novoDocTipo, setNovoDocTipo] = useState<DocumentoCaso['tipo']>('Contrato');
  const [novoDocPaginas, setNovoDocPaginas] = useState(6);

  const selectedDoc = documentos.find((d) => d.id === selectedDocId) || documentos[0];

  const handleSimularUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoDocTitulo || !selectedCaso) return;

    const novo = adicionarDocumento({
      casoId: selectedCaso.id,
      titulo: novoDocTitulo.endsWith('.pdf') ? novoDocTitulo : `${novoDocTitulo}.pdf`,
      tipo: novoDocTipo,
      tamanhoKb: Math.floor(Math.random() * 3000) + 500,
      formato: 'pdf',
      dataUpload: new Date().toISOString().substring(0, 10),
      statusAnalise: 'pendente',
      totalPaginas: novoDocPaginas,
      trechos: [],
    });

    setModalUploadOpen(false);
    setSelectedDocId(novo.id);
    setNovoDocTitulo('');
  };

  const converterTrechoEmFatoDoCaso = (trecho: DocumentoTrecho) => {
    if (!selectedCaso || !selectedDoc) return;

    adicionarFatoAoCaso(selectedCaso.id, {
      descricao: `Fato extraído do documento: ${trecho.texto.substring(0, 140)}...`,
      categoria: 'comprovado',
      documentoId: selectedDoc.id,
      documentoNome: selectedDoc.titulo,
      pagina: trecho.pagina,
      trechoCitacao: trecho.texto,
      validadoPorAdvogado: true,
      validadoPorNome: currentUser.nome,
      dataValidacao: new Date().toISOString().substring(0, 10),
    });

    atualizarValidacaoTrecho(selectedDoc.id, trecho.id, 'aprovado');
  };

  return (
    <div className="space-y-6">
      {/* Header and Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Repositório de Evidências & Análise Documental
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fluxo B: Custódia probatória, OCR assistido com proveniência de trechos e validação por advogado.
          </p>
        </div>

        <button
          onClick={() => setModalUploadOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Fazer Upload de Documento</span>
        </button>
      </div>

      {/* Main Split Layout: Document List (Left) + Document & Extraction Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Documents Directory */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-700">
              Documentos do Acervo ({documentos.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Integridade SHA-256
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {documentos.map((doc) => {
              const isSelected = doc.id === selectedDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setSelectedTrechoParaInspecao(null);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-50/50 border-l-2 border-emerald-700'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                      {doc.titulo}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      {(doc.tamanhoKb / 1024).toFixed(1)} MB
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{doc.tipo}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.totalPaginas} págs.</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-mono text-[10px] ${
                        doc.statusAnalise === 'analisado'
                          ? 'text-emerald-700 font-medium'
                          : 'text-amber-700 font-medium'
                      }`}
                    >
                      {doc.statusAnalise === 'analisado' ? 'Analisado ✓' : 'Aguardando Análise'}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    Hash: {doc.hashSha256.substring(0, 24)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Document Detail & Provenance Inspector */}
        <div className="lg:col-span-8 space-y-4">
          {selectedDoc ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
              {/* Doc Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-900 text-sm">
                      {selectedDoc.titulo}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      Versão {selectedDoc.versao}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Data Upload: {selectedDoc.dataUpload}</span>
                    <span aria-hidden="true">·</span>
                    <span>Custódia Verificada</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">
                      {selectedDoc.trechos.length} trechos probatórios
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => executarAnaliseDocumentoDemonstrativa(selectedDoc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Executar Análise Assistida (OCR)</span>
                  </button>
                </div>
              </div>

              {/* SHA-256 Custody Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 text-[11px] block">
                    Assinatura Criptográfica de Não-Repúdio (Custódia Probatória)
                  </span>
                  <div className="font-mono text-[10px] text-slate-500 break-all">
                    SHA-256: {selectedDoc.hashSha256}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 shrink-0 font-medium text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Íntegro</span>
                </div>
              </div>

              {/* Extracted Facts & Trechos Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">
                      Trechos Extraídos & Proveniência Factual
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cada afirmação está vinculada à página exata do documento original. Confirme ou rejeite a extração.
                    </p>
                  </div>
                </div>

                {selectedDoc.trechos.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDoc.trechos.map((trecho) => {
                      const isAprovado = trecho.statusValidacao === 'aprovado';
                      const isRejeitado = trecho.statusValidacao === 'rejeitado';

                      return (
                        <div
                          key={trecho.id}
                          className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-3 bg-white"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                Página {trecho.pagina}
                              </span>
                              <span className="text-slate-400" aria-hidden="true">·</span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                Confiança OCR: {trecho.confiancaOcr}%
                              </span>
                              <span className="text-slate-400" aria-hidden="true">·</span>
                              <span className="text-slate-600 font-medium">
                                {trecho.tipoDado.replace('_', ' ')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isAprovado && (
                                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                                </span>
                              )}
                              {isRejeitado && (
                                <span className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Rejeitado
                                </span>
                              )}

                              <button
                                onClick={() => setSelectedTrechoParaInspecao(trecho)}
                                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 font-medium flex items-center gap-1"
                                title="Ver página original e conferir proveniência lado a lado"
                              >
                                <Split className="w-3 h-3 text-slate-600" />
                                <span>Conferir na Página</span>
                              </button>

                              <button
                                onClick={() =>
                                  atualizarValidacaoTrecho(
                                    selectedDoc.id,
                                    trecho.id,
                                    isAprovado ? 'rejeitado' : 'aprovado'
                                  )
                                }
                                className="px-2.5 py-1 text-[11px] border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-medium"
                              >
                                {isAprovado ? 'Desmarcar' : 'Aprovar'}
                              </button>

                              <button
                                onClick={() => converterTrechoEmFatoDoCaso(trecho)}
                                className="px-2.5 py-1 text-[11px] bg-emerald-700 text-white hover:bg-emerald-800 rounded font-medium flex items-center gap-1"
                                title="Inserir como fato oficial no histórico do processo"
                              >
                                <span>Vincular a Fatos</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Highlighted text passage */}
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 leading-relaxed italic">
                            "{trecho.texto}"
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                    <FileSearch className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs text-slate-600">
                      Nenhum trecho extraído ainda para este documento.
                    </div>
                    <button
                      onClick={() => executarAnaliseDocumentoDemonstrativa(selectedDoc.id)}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800"
                    >
                      Executar Extração com Rastreabilidade
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Nenhum documento selecionado.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Split-Screen Provenance Document Inspector */}
      {selectedTrechoParaInspecao && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in">
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-emerald-700" />
                <h3 className="font-semibold text-xs text-slate-900">
                  Inspeção de Proveniência Probatória (Split-Screen Documental)
                </h3>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedDoc.titulo} · Pág. {selectedTrechoParaInspecao.pagina}
                </span>
              </div>
              <button
                onClick={() => setSelectedTrechoParaInspecao(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 flex-1 overflow-hidden">
              {/* Left Panel: Simulated Document Page (A4 Paper Aesthetic) */}
              <div className="p-6 overflow-y-auto bg-slate-100/60 flex flex-col items-center">
                <div className="bg-white rounded shadow-md border border-slate-300 p-8 w-full max-w-md text-[11px] font-mono text-slate-800 leading-relaxed space-y-4 select-text">
                  <div className="border border-slate-300 p-2 text-center text-[10px] text-slate-500 uppercase tracking-widest font-sans">
                    TJSP · Protocolo Digital Integrado · Custódia SHA-256 Verificada
                  </div>

                  <div className="text-center font-bold text-xs uppercase text-slate-900 border-b border-slate-200 pb-2">
                    {selectedDoc.titulo.replace('.pdf', '')}
                  </div>

                  <p className="text-slate-500 text-justify">
                    Instrumento particular firmado entre as partes para formalização das condições de contratação, prazos, encargos e responsabilidades financeiras recíprocas sob regência da legislação brasileira.
                  </p>

                  {/* Highlighted Passage on the Document */}
                  <div className="p-2.5 bg-yellow-100 border-l-4 border-yellow-400 text-slate-900 font-semibold rounded-xs">
                    [Página {selectedTrechoParaInspecao.pagina}] — "{selectedTrechoParaInspecao.texto}"
                  </div>

                  <p className="text-slate-500 text-justify">
                    Em caso de inadimplemento, aplicar-se-ão os juros moratórios pactuados, independentemente de notificação judicial ou extrajudicial, ficando eleito o foro da comarca central para dirimir eventuais controvérsias.
                  </p>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Página {selectedTrechoParaInspecao.pagina} de {selectedDoc.totalPaginas}</span>
                    <span>Assinado Digitalmente ICP-Brasil</span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Extraction Inspection & Correction Form */}
              <div className="p-6 overflow-y-auto space-y-5 bg-white flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block mb-1">
                      Texto Extraído pelo OCR (Conferência Factual)
                    </span>
                    <textarea
                      rows={5}
                      defaultValue={selectedTrechoParaInspecao.texto}
                      className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono leading-relaxed bg-slate-50/50"
                    />
                    <span className="text-[10px] text-slate-400">
                      O advogado pode retificar eventuais erros de OCR antes de fixar nos fatos do processo.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Confiança do Reconhecimento:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {selectedTrechoParaInspecao.confiancaOcr}% (Alta Precisão)
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Classificação do Trecho:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedTrechoParaInspecao.tipoDado.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      atualizarValidacaoTrecho(selectedDoc.id, selectedTrechoParaInspecao.id, 'rejeitado');
                      setSelectedTrechoParaInspecao(null);
                    }}
                    className="px-3 py-2 border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 text-xs font-medium"
                  >
                    Rejeitar Trecho
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        converterTrechoEmFatoDoCaso(selectedTrechoParaInspecao);
                        setSelectedTrechoParaInspecao(null);
                      }}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aprovar e Salvar nos Fatos do Caso</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upload Simulado */}
      {modalUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-900">
                Upload de Documento Probatório
              </h3>
              <button
                onClick={() => setModalUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimularUpload} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nome do Arquivo *
                </label>
                <input
                  type="text"
                  required
                  value={novoDocTitulo}
                  onChange={(e) => setNovoDocTitulo(e.target.value)}
                  placeholder="Ex: Extrato_Bancario_Consolidado_2025.pdf"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Tipo Documental
                  </label>
                  <select
                    value={novoDocTipo}
                    onChange={(e) => setNovoDocTipo(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Contrato">Contrato</option>
                    <option value="Comprovante">Comprovante</option>
                    <option value="Extrato">Extrato</option>
                    <option value="Laudo">Laudo Técnico</option>
                    <option value="Procuração">Procuração</option>
                    <option value="Petição">Petição</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Total de Páginas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={novoDocPaginas}
                    onChange={(e) => setNovoDocPaginas(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">
                  Protocolo de Segurança e Rastreabilidade:
                </div>
                <div>• Geração imediata de hash SHA-256 no client para custódia.</div>
                <div>• Isolamento de dados conforme diretrizes da LGPD e OAB.</div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalUploadOpen(false)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium"
                >
                  Salvar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
