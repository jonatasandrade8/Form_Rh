// ⚠️ IMPORTANTE: Substitua esta string pela string Base64 real da sua logomarca
const LOGO_BASE64 = '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...';

let videoStream = null;
let selfieImageBase64 = null; // Variável para armazenar a selfie em Base64

/* --- Funções de Formatação/Máscara --- */

// Aplica máscara de dd/mm/aaaa
function maskData(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    event.target.value = value;
}

// Aplica máscara de CEP 00000-000
function maskCEP(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    event.target.value = value;
}

// Aplica máscara de CPF 000.000.000-00
function maskCPF(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    if (value.length > 14) {
        value = value.substring(0, 14);
    }
    event.target.value = value;
}

// Aplica máscara de RG
function maskRG(event) {
    let value = event.target.value.replace(/\D/g, '');
    // Assume um formato simples de 9 dígitos (00.000.000-0)
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d{1})/, '$1.$2.$3-$4');
    if (value.length > 12) {
        value = value.substring(0, 12);
    }
    event.target.value = value;
}

// Aplica máscara de Telefone (00) 00000-0000 ou (00) 0000-0000
function maskTelefone(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    if (value.length > 15) { // (00) 99999-9999
        value = value.substring(0, 15);
    }
    event.target.value = value;
}

/* --- Lógica de CEP (ViaCEP) --- */
function preencherEndereco(data) {
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    // Limpa campos para nova busca
    enderecoInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';

    if (data.erro) {
        alert('CEP não encontrado. Por favor, preencha o endereço manualmente. Os campos Cidade e Estado foram liberados.');
        cidadeInput.removeAttribute('readonly');
        estadoInput.removeAttribute('readonly');
        cidadeInput.focus();
        return;
    }

    if (data.logradouro) {
        // Se a API retornar o logradouro, preenche e foca no número, senão, apenas preenche cidade/estado.
        enderecoInput.value = `${data.logradouro}, ${data.bairro || ''}`;
        enderecoInput.focus();
    } else {
         enderecoInput.focus();
    }

    cidadeInput.value = data.localidade;
    estadoInput.value = data.uf;

    // Garante que o usuário possa corrigir o preenchimento manual
    cidadeInput.removeAttribute('readonly');
    estadoInput.removeAttribute('readonly');
}

async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    maskCEP({ target: cepInput }); // Garante formatação antes de buscar
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        return; // Não faz nada se o CEP estiver incompleto
    }

    // Bloqueia campos e informa busca (melhora UX)
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    cidadeInput.value = 'Buscando...';
    estadoInput.value = '...';

    // ViaCEP é uma API pública e gratuita com alta disponibilidade para CEPs brasileiros.
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        preencherEndereco(data);
    } catch (error) {
        console.error('Erro na busca de CEP:', error);
        alert('Erro ao buscar o CEP. Por favor, preencha o endereço manualmente. Os campos Cidade e Estado foram liberados.');
        // Remove readonly para permitir preenchimento manual em caso de erro
        cidadeInput.removeAttribute('readonly');
        estadoInput.removeAttribute('readonly');
        cidadeInput.value = '';
        estadoInput.value = '';
    }
}

// --- Funções Auxiliares para PDF ---
function adicionarSecao(doc, titulo, y, x, larguraTotal) {
    if (y > 280) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(titulo, x, y);
    doc.line(x, y + 1, x + larguraTotal, y + 1);
    y += 5;
    return y;
}

function adicionarCampo(doc, label, valor, y, x, colWidth) {
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
    const { PDFDocument } = PDFLib;
    const { jsPDF } = window.jspdf;
    const doc = new new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' for size
    const col1X = 15;
    const col2X = 110;
    const colWidth = 90;
    const larguraTotal = 180;
    let y1 = 20;
    let y2 = 20;

    try {
        // 1. Coletar dados
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
            genero: document.getElementById('genero').value,
            statusCivil: document.getElementById('statusCivil').value,

            experienciaPromocao: document.getElementById('experienciaPromocao').value,
            tempoExperiencia: document.getElementById('tempoExperiencia').value, // Agora um número
            empresasAnteriores: document.getElementById('empresasAnteriores').value,
            motivoSaida: document.getElementById('motivoSaida').value,

            temCelularProprio: document.getElementById('temCelularProprio').value,
            temMoto: document.getElementById('temMoto').value,
            cnh: document.getElementById('cnh').value,
            conhecimentoPromocao: document.getElementById('conhecimentoPromocao').value,
            facilidadeTecnologia: document.getElementById('facilidadeTecnologia').value,
            
            turnoDisponivel: document.getElementById('turnoDisponivel').value,
            
            expectativaSalarial: document.getElementById('expectativaSalarial').value,
            comoConheceu: document.getElementById('comoConheceu').value,
            observacoes: document.getElementById('observacoes').value,
        };

        // Disponibilidade: Alterado para a nova estrutura de uma única opção
        const dispCheckbox = document.getElementById('dispSegundaASabado');
        dados.disponibilidade = dispCheckbox && dispCheckbox.checked ? dispCheckbox.value : 'Não disponível Segunda a Sábado';

        const aceitoTermos = document.getElementById('aceitoTermos').checked;
        const declaracao = aceitoTermos ? 'Li e aceito o termo de responsabilidade.' : 'Não aceitou o termo de responsabilidade.';

        // Validação básica (pode ser mais robusta)
        if (!dados.nomeCompleto || !dados.dataNascimento || !dados.cpf || !dados.telefone || !dados.email || !dados.cep || !dados.endereco || !dados.cidade || !dados.estado || !dados.experienciaPromocao || !dados.tempoExperiencia || !dados.expectativaSalarial || !dados.comoConheceu || !dados.temCelularProprio || !dados.turnoDisponivel || !selfieImageBase64 || !aceitoTermos) {
            alert('Por favor, preencha todos os campos obrigatórios (*) e tire a selfie antes de gerar a candidatura.');
            return;
        }

        // 2. Adicionar o cabeçalho no PDF
        doc.addImage(LOGO_BASE64, 'PNG', col1X, y1, 30, 10);
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Formulário de Candidatura - Promotor de Vendas', col1X + 35, y1 + 7);
        y1 += 15;
        
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Data de Geração: ${dataAtual}`, col1X + 180 - doc.getTextWidth(`Data de Geração: ${dataAtual}`), 15);


        // 3. Estruturar o conteúdo do PDF
        // Seção 1: Dados Pessoais
        y1 = adicionarSecao(doc, '1. DADOS PESSOAIS', y1, col1X, larguraTotal);
        y1 = adicionarCampo(doc, 'Nome Completo', dados.nomeCompleto, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Data de Nascimento', dados.dataNascimento, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'CPF', dados.cpf, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'RG', dados.rg, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'Telefone', dados.telefone, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'E-mail', dados.email, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'CEP', dados.cep, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Gênero', dados.genero, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'Estado Civil', dados.statusCivil, y1, col1X, colWidth);
        y1 = adicionarCampo(doc, 'Endereço', dados.endereco, Math.max(y1, y2) + 5, col1X, larguraTotal);
        y2 = adicionarCampo(doc, 'Cidade/Estado', `${dados.cidade} / ${dados.estado}`, y1, col1X, colWidth);
        y1 = Math.max(y1, y2) + 3;


        // Seção 2: Experiência Profissional
        y1 = adicionarSecao(doc, '2. EXPERIÊNCIA', y1, col1X, larguraTotal);
        y1 = adicionarCampo(doc, 'Experiência em Promoção', dados.experienciaPromocao, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Tempo (Anos em Média)', dados.tempoExperiencia + (dados.tempoExperiencia == 1 ? ' ano' : ' anos'), y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'Empresas Anteriores', dados.empresasAnteriores, y1, col1X, larguraTotal);
        y1 = adicionarCampo(doc, 'Motivo Saída', dados.motivoSaida, y1, col1X, larguraTotal);
        y1 += 3;


        // Seção 3: Conhecimentos
        y1 = adicionarSecao(doc, '3. CONHECIMENTOS', y1, col1X, larguraTotal);
        y1 = adicionarCampo(doc, 'Celular Próprio', dados.temCelularProprio, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Veículo', dados.temMoto, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'CNH', dados.cnh, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Conhecimento em Promoção', dados.conhecimentoPromocao, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'Facilidade com Tecnologia (0-10)', dados.facilidadeTecnologia, y1, col1X, colWidth);
        y1 += 3;


        // Seção 4: Disponibilidade
        y1 = adicionarSecao(doc, '4. DISPONIBILIDADE', y1, col1X, larguraTotal);
        y1 = adicionarCampo(doc, 'Disponibilidade Semanal', dados.disponibilidade, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Turno', dados.turnoDisponivel, y2, col2X, colWidth);
        y1 = Math.max(y1, y2) + 3;

        // Seção 5: Informações Adicionais
        y1 = adicionarSecao(doc, '5. INFORMAÇÕES ADICIONAIS', y1, col1X, larguraTotal);
        y1 = adicionarCampo(doc, 'Expectativa Salarial', dados.expectativaSalarial, y1, col1X, colWidth);
        y2 = adicionarCampo(doc, 'Como Conheceu a Vaga', dados.comoConheceu, y2, col2X, colWidth);
        y1 = adicionarCampo(doc, 'Observações', dados.observacoes, y1, col1X, larguraTotal);
        y1 += 3;

        // Selfie
        if (selfieImageBase64) {
            y1 = adicionarSecao(doc, '6. SELFIE DE IDENTIFICAÇÃO', y1, col1X, larguraTotal);
            // Redimensiona para caber na coluna
            doc.addImage(selfieImageBase64, 'JPEG', col1X, y1, 80, 60); 
            y1 += 65;
        }

        // Termo de Responsabilidade
        const yFinal = adicionarSecao(doc, '7. TERMO DE RESPONSABILIDADE', y1, col1X, larguraTotal);
        adicionarCampo(doc, 'Declaração', declaracao, yFinal, col1X, larguraTotal);
        // Não é mais necessário o código de mesclagem de PDF
        
        const pdfBytes = doc.output('arraybuffer'); // Salva o PDF gerado
        
        // 5. Compartilhamento do PDF
        const nomeArquivo = `Candidatura_${dados.nomeCompleto.split(' ')[0]}_${dataAtual.replace(/\//g, '-')}.pdf`;

        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
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
        alert('Ocorreu um erro ao processar o PDF. Verifique os dados preenchidos.');
    }
}

// --- Funções de Inicialização e Câmera/Selfie (Não alteradas, exceto a remoção do CV) ---
function inicializarFormulario() {
    // Adiciona as novas máscaras e lógica de CEP
    document.getElementById('dataNascimento').addEventListener('input', maskData);
    document.getElementById('cpf').addEventListener('input', maskCPF);
    document.getElementById('rg').addEventListener('input', maskRG);
    document.getElementById('telefone').addEventListener('input', maskTelefone);
    document.getElementById('cep').addEventListener('input', maskCEP);
    document.getElementById('cep').addEventListener('blur', buscarCEP); // Busca no blur (ao sair do campo)
}

// Inicia o formulário quando o script é carregado
inicializarFormulario();

// --- Funções de Câmera/Selfie ---
// ... (código original da câmera e selfie mantido) ...
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
        video.style.display = 'block';
        startBtn.style.display = 'none';
        captureBtn.style.display = 'block';
    } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
}

function capturarSelfie() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const previewImage = document.getElementById('preview-image');
    const selfiePreview = document.getElementById('selfie-preview');
    const context = canvas.getContext('2d');

    // Desenha o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, 480, 360);

    // Converte o canvas para Base64 (formato JPEG)
    selfieImageBase64 = canvas.toDataURL('image/jpeg', 0.9);

    // Exibe a pré-visualização
    previewImage.src = selfieImageBase64;
    selfiePreview.style.display = 'block';

    // Para a câmera
    videoStream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    video.style.display = 'none';
    document.getElementById('capture-selfie-btn').style.display = 'none';
    document.getElementById('start-camera-btn').style.display = 'none';
}