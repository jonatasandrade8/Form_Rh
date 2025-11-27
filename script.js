
const LOGO_BASE64 = './images/logo-qdelicia.png';

// Lista de UFs (Estados)
const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// --- Variáveis Globais de Câmera e Currículo ---
let selfieBase64 = null;
let videoStream = null;
// REMOVIDO: let cvPdfBytes = null; // Armazena os bytes do PDF do currículo

// --- Lógica de Endereçamento (ViaCEP) ---

async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    let cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        limparCamposEndereco(false);
        return;
    }
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.erro) {
            alert('CEP não encontrado. Preencha manualmente.');
            limparCamposEndereco(true);
            return;
        }
        document.getElementById('endereco').value = data.logradouro || '';
        const estadoSelect = document.getElementById('estado');
        estadoSelect.value = data.uf || '';
        // MODIFICADO: Preenche a cidade diretamente no novo campo de texto.
        document.getElementById('cidade').value = data.localidade || '';
        // REMOVIDO: carregarCidades(data.uf, data.localidade);
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro de comunicação. Preencha manualmente.');
        limparCamposEndereco(true);
    }
}

function limparCamposEndereco(limparTudo) {
    if (limparTudo) {
        document.getElementById('endereco').value = '';
        // ADICIONADO: Limpa o campo de cidade
        document.getElementById('cidade').value = '';
    }
    document.getElementById('estado').value = '';
    // REMOVIDO: Lógica de manipulação de options do select 'cidade'
    // const cidadeSelect = document.getElementById('cidade');
    // cidadeSelect.innerHTML = '<option value="">Selecione o Estado primeiro</option>';
}

// REMOVIDA A FUNÇÃO carregarCidades, pois 'cidade' é agora um campo de texto livre

/**
 * Inicializa os campos do formulário (preenche UFs e adiciona listeners).
 */
function inicializarFormulario() {
    // 1. Preenche Dropdown de Estado (UF)
    const estadoSelect = document.getElementById('estado');
    UFS.forEach(uf => {
        const option = document.createElement('option');
        option.value = uf;
        option.textContent = uf;
        estadoSelect.appendChild(option);
    });
    
    // 2. Listener do CEP
    document.getElementById('cep').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
    });

    // REMOVIDO: 3. Listener do Upload de Currículo
    // document.getElementById('cvFile').addEventListener('change', handleCvUpload);
}

// REMOVIDA A FUNÇÃO handleCvUpload

// Inicia o formulário quando o script é carregado
inicializarFormulario();


// --- Funções de Câmera/Selfie ---

async function inicializarCamera() {
    const video = document.getElementById('video');
    const startBtn = document.getElementById('start-camera-btn');
    const captureBtn = document.getElementById('capture-selfie-btn');
    
    const constraints = {
        video: {
            facingMode: 'user',
            width: { ideal: 480 },
            height: { ideal: 360 }
        }
    };

    try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
        
        startBtn.style.display = 'none';
        video.style.display = 'block';
        captureBtn.style.display = 'block';

    } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
}

function capturarSelfie() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-selfie-btn');
    const previewContainer = document.getElementById('selfie-preview');
    const previewImage = document.getElementById('preview-image');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    selfieBase64 = canvas.toDataURL('image/jpeg', 0.8);
    
    previewImage.src = selfieBase64;
    previewContainer.style.display = 'block';
    
    video.style.display = 'none';
    captureBtn.style.display = 'none';
    
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
}


// --- Funções Auxiliares de Geração de PDF (PRESERVADAS) ---

function adicionarCabecalho(doc) {
    try {
        doc.addImage(LOGO_BASE64, 'PNG', 65, 15, 80, 30);
    } catch (e) {
        doc.setFontSize(10);
        doc.text('', 105, 30, { align: 'center' });
    }

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('FORMULÁRIO DE CANDIDATURA', 105, 55, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text('Promotor de Vendas', 105, 63, { align: 'center' });
    
    return 70; // Posição Y inicial para as colunas
}

function adicionarSecao(doc, titulo, y, x, colWidth) {
    if (y > 270) { 
        doc.addPage();
        y = 20;
    }
    
    doc.setFillColor(37, 99, 235);
    doc.rect(x, y, colWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(titulo, x + 2, y + 5.5);
    doc.setTextColor(0, 0, 0);
    return y + 12;
}

function adicionarCampo(doc, label, valor, y, x, colWidth) {
    doc.setFontSize(8); 
    
    if (y > 280) {
        doc.addPage();
        y = 20;
    }
    
    doc.setFont(undefined, 'bold');
    if (label) {
        doc.text(label + ':', x, y);
    } else {
        y -= 3;
    }
    doc.setFont(undefined, 'normal');
    const texto = valor || 'Não informado';
    
    const linhas = doc.splitTextToSize(texto, colWidth - 5); 
    doc.text(linhas, x, y + 3);
    
    return y + 3 + (linhas.length * 3.5);
}


// --- Função principal para gerar o PDF (MODIFICADA) ---
async function gerarPDF() {
    // REMOVIDA A DECLARAÇÃO PDFDocument
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // 1. Coletar dados (PRESERVADA)
    const dados = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        cpf: document.getElementById('cpf').value,
        rg: document.getElementById('rg').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        cep: document.getElementById('cep').value, 
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        experienciaPromocao: document.getElementById('experienciaPromocao').value,
        tempoExperiencia: document.getElementById('tempoExperiencia').value,
        empresasAnteriores: document.getElementById('empresasAnteriores').value,
        motivoSaida: document.getElementById('motivoSaida').value,
        temCelularProprio: document.getElementById('temCelularProprio').value,
        conheceAppEstoque: document.getElementById('conheceAppEstoque').value,
        facilidadeTecnologia: document.getElementById('facilidadeTecnologia').value,
        possuiVeiculo: document.getElementById('possuiVeiculo').value,
        baterPonto: document.getElementById('baterPonto').checked,
        passarEstoque: document.getElementById('passarEstoque').checked,
        tirarFotos: document.getElementById('tirarFotos').checked,
        usarAppOficial: document.getElementById('usarAppOficial').checked,
        comunicacaoEquipe: document.getElementById('comunicacaoEquipe').checked,
        relatorios: document.getElementById('relatorios').checked,
        disponibilidadeHorario: document.getElementById('disponibilidadeHorario').value,
        segunda: document.getElementById('segunda').checked,
        terca: document.getElementById('terca').checked,
        quarta: document.getElementById('quarta').checked,
        quinta: document.getElementById('quinta').checked,
        sexta: document.getElementById('sexta').checked,
        sabado: document.getElementById('sabado').checked,
        domingo: document.getElementById('domingo').checked,
        inicioImediato: document.getElementById('inicioImediato').value,
        pretensoSalarial: document.getElementById('pretensoSalarial').value,
        conheceProdutos: document.getElementById('conheceProdutos').value,
        observacoes: document.getElementById('observacoes').value,
    };
    
    // 2. Validação (PRESERVADA)
    const camposObrigatorios = ['nomeCompleto', 'cpf', 'dataNascimento', 'rg', 'telefone', 'email', 'cep', 'endereco', 'cidade', 'estado', 'experienciaPromocao', 'temCelularProprio', 'conheceAppEstoque', 'facilidadeTecnologia', 'disponibilidadeHorario', 'inicioImediato', 'pretensoSalarial'];
    
    for (const campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo] === '') {
            alert(`O campo "${document.querySelector(`label[for='${campo}']`)?.textContent?.replace(' *', '') || campo}" é obrigatório.`);
            return; 
        }
    }
    if (!selfieBase64) {
        alert('É obrigatório capturar a selfie de verificação (Seção 7).');
        return;
    }

    // 3. Geração do PDF do Formulário (Layout de Duas Colunas - PRESERVADA)
    const col1X = 15;
    const col2X = 110;
    const colWidth = 85;
    
    let y1 = adicionarCabecalho(doc);
    let y2 = y1;

    // --- COLUNA 1 ---
    y1 = adicionarSecao(doc, '1. DADOS PESSOAIS', y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Nome Completo', dados.nomeCompleto, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Data de Nascimento', dados.dataNascimento, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'CPF', dados.cpf, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'RG', dados.rg, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Telefone', dados.telefone, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'E-mail', dados.email, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'CEP', dados.cep, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Endereço', dados.endereco, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Cidade/UF', `${dados.cidade} / ${dados.estado}`, y1, col1X, colWidth);
    y1 += 3;

    y1 = adicionarSecao(doc, '2. EXPERIÊNCIA', y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Experiência como promotor', dados.experienciaPromocao, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Tempo de experiência', dados.tempoExperiencia, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Empresas que trabalhou', dados.empresasAnteriores, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Motivo da Saída', dados.motivoSaida, y1, col1X, colWidth);
    y1 += 3;

    y1 = adicionarSecao(doc, '3. CONHECIMENTOS', y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Celular', dados.temCelularProprio, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Conhece Apps de Estoque', dados.conheceAppEstoque, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Nível de conhecimento de Tecnologia', dados.facilidadeTecnologia, y1, col1X, colWidth);
    y1 = adicionarCampo(doc, 'Possui veículo próprio', dados.possuiVeiculo, y1, col1X, colWidth);

    // --- COLUNA 2 ---
    y2 = adicionarSecao(doc, '4. USO DE CELULAR PRÓPRIO PARA:', y2, col2X, colWidth);
    const atividades = [];
    if (dados.baterPonto) atividades.push('✓ Bater ponto');
    if (dados.passarEstoque) atividades.push('✓ Passar estoque');
    if (dados.tirarFotos) atividades.push('✓ Tirar fotos');
    if (dados.usarAppOficial) atividades.push('✓ Usar app oficial');
    if (dados.comunicacaoEquipe) atividades.push('✓ Comunicação equipe');
    if (dados.relatorios) atividades.push('✓ Enviar relatórios');
    y2 = adicionarCampo(doc, '', atividades.length > 0 ? atividades.join('\n') : 'Nenhuma selecionada', y2, col2X, colWidth);
    y2 += 3;

    y2 = adicionarSecao(doc, '5. DISPONIBILIDADE', y2, col2X, colWidth);
    y2 = adicionarCampo(doc, 'Horário disponível', dados.disponibilidadeHorario, y2, col2X, colWidth);
    const dias = [];
    if (dados.segunda) dias.push('Seg');
    if (dados.terca) dias.push('Ter');
    if (dados.quarta) dias.push('Qua');
    if (dados.quinta) dias.push('Qui');
    if (dados.sexta) dias.push('Sex');
    if (dados.sabado) dias.push('Sáb');
    if (dados.domingo) dias.push('Dom');
    y2 = adicionarCampo(doc, 'Dias disponíveis', dias.length > 0 ? dias.join(', ') : 'Nenhum selecionado', y2, col2X, colWidth);
    y2 = adicionarCampo(doc, 'Disponibilidade para Início Imediato', dados.inicioImediato, y2, col2X, colWidth);
    y2 += 3;

    y2 = adicionarSecao(doc, '6. OUTRAS INFORMAÇÕES', y2, col2X, colWidth);
    y2 = adicionarCampo(doc, 'Pretensão Salarial', dados.pretensoSalarial, y2, col2X, colWidth);
    y2 = adicionarCampo(doc, 'Conhece os Produtos que irá promover?', dados.conheceProdutos, y2, col2X, colWidth);
    y2 = adicionarCampo(doc, 'Observações', dados.observacoes, y2, col2X, colWidth);
    y2 += 3;
    
    // SEÇÃO DA SELFIE (Coluna 2)
    y2 = adicionarSecao(doc, '7. SELFIE DE VERIFICAÇÃO', y2, col2X, colWidth);
    try {
        doc.addImage(selfieBase64, 'JPEG', 122.5, y2, 60, 45);
        y2 += 50;
    } catch (e) {
        y2 = adicionarCampo(doc, 'Erro', 'Não foi possível adicionar a selfie.', y2, col2X, colWidth);
    }

    // SEÇÃO DE FINALIZAÇÃO (Largura Total)
    let yFinal = Math.max(y1, y2) + 5;
    const larguraTotal = 180;
    
    yFinal = adicionarSecao(doc, '8. FINALIZAÇÃO DA CANDIDATURA', yFinal, col1X, larguraTotal);
    
    const declaracao = 'Declaro, que todas as informações e respostas fornecidas neste formulário são verdadeiras e foram preenchidas por mim, o(a) candidato(a).';
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    yFinal = adicionarCampo(doc, 'Declaração', declaracao, yFinal, col1X, larguraTotal);
    yFinal += 10;

    doc.setLineWidth(0.5);
    doc.line(col1X, yFinal, col1X + 120, yFinal);
    yFinal += 3; 

    doc.setFontSize(8);
    doc.text(`Candidato(a): ${dados.nomeCompleto.toUpperCase()}`, col1X, yFinal); 
    
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Data: ${dataAtual}`, col1X + 130, yFinal);
    
    
    // 4. Geração e Compartilhamento do PDF (Apenas Formulário) - MODIFICADO SEM MESCLAGEM
    try {
        // Obtém os bytes do PDF do formulário (sem mesclagem)
        const nomeArquivo = `Candidatura_${dados.nomeCompleto.split(' ')[0]}_${dataAtual.replace(/\//g, '-')}.pdf`;
        
        const pdfBlob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
        const pdfFile = new File([pdfBlob], nomeArquivo, { type: 'application/pdf' });
        const filesArray = [pdfFile];

        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            await navigator.share({
                files: filesArray,
                title: `Candidatura ${dados.nomeCompleto}`,
                text: `Formulário de candidatura de ${dados.nomeCompleto}.`
            });
        } else {
            alert('Seu navegador não suporta compartilhamento. O PDF será baixado.');
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = nomeArquivo;
            link.click();
        }

    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        alert('Ocorreu um erro ao processar o PDF.');
    }
}
