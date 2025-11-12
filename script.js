// A logomarca deve ser convertida para Base64.
// POR FAVOR, SUBSTITUA ESTA STRING DE EXEMPLO PELA STRING BASE64 REAL DA SUA LOGOMARCA.
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACrCAYAA....(SUBSTITUA PELA SUA STRING BASE64)';

// Lista de UFs (Estados) para preenchimento do dropdown
const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// --- Lógica de Endereçamento Assíncrono (ViaCEP) ---

/**
 * Busca o endereço completo (logradouro, estado, cidade) pelo CEP.
 */
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
            alert('CEP não encontrado. Por favor, preencha o endereço manualmente.');
            limparCamposEndereco(true);
            return;
        }

        // Preenchimento dos campos
        document.getElementById('endereco').value = data.logradouro || '';
        
        // Seleciona o Estado (UF)
        const estadoSelect = document.getElementById('estado');
        estadoSelect.value = data.uf || '';
        
        // Seleciona a cidade
        carregarCidades(data.uf, data.localidade);

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro de comunicação. Por favor, preencha o endereço manualmente.');
        limparCamposEndereco(true);
    }
}

/**
 * Limpa os campos de endereço após um erro de CEP ou CEP incompleto.
 * @param {boolean} limparTudo - Se true, limpa o campo 'endereco'.
 */
function limparCamposEndereco(limparTudo) {
    if (limparTudo) {
        document.getElementById('endereco').value = '';
    }
    
    // Reseta o Estado
    const estadoSelect = document.getElementById('estado');
    estadoSelect.value = '';

    // Reseta o Dropdown de Cidade
    const cidadeSelect = document.getElementById('cidade');
    cidadeSelect.innerHTML = '<option value="">Selecione o Estado primeiro</option>';
}

/**
 * Carrega a cidade no dropdown.
 * @param {string} uf - A sigla do Estado.
 * @param {string} cidadePreencher - O nome da cidade a ser selecionada (se vier do CEP).
 */
function carregarCidades(uf, cidadePreencher = '') {
    const cidadeSelect = document.getElementById('cidade');
    cidadeSelect.innerHTML = ''; 

    if (!uf) {
        cidadeSelect.innerHTML = '<option value="">Selecione o Estado primeiro</option>';
        return;
    }

    cidadeSelect.disabled = false;
    
    if (cidadePreencher) {
        // Se a cidade veio do CEP (ViaCEP fornece o nome), adicionamos ela como opção
        const optPreenchida = document.createElement('option');
        optPreenchida.value = cidadePreencher;
        optPreenchida.textContent = cidadePreencher;
        cidadeSelect.appendChild(optPreenchida);
        cidadeSelect.value = cidadePreencher;
        
    } else {
        // Se o usuário mudou o UF manualmente, apenas adicionamos uma opção básica.
        cidadeSelect.innerHTML = `<option value="">Selecione a cidade</option>`;
        // **NOTA:** Em um projeto real, aqui você faria uma chamada a uma API de cidades por UF.
        const optManual = document.createElement('option');
        optManual.value = 'Cidade Manual';
        optManual.textContent = 'Cidade Manual (Preencher)';
        cidadeSelect.appendChild(optManual);
    }
}

/**
 * Inicializa os campos do formulário (preenche a lista de UFs).
 */
function inicializarFormulario() {
    // 1. Preenche o Dropdown de Estado (UF)
    const estadoSelect = document.getElementById('estado');
    UFS.forEach(uf => {
        const option = document.createElement('option');
        option.value = uf;
        option.textContent = uf;
        estadoSelect.appendChild(option);
    });
    
    // 2. Garante que o input CEP só aceite números
    document.getElementById('cep').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
    });
}

// Inicia o formulário quando o script é carregado
inicializarFormulario();


// --- Funções Auxiliares de Geração de PDF ---

function adicionarCabecalho(doc, margemEsquerda) {
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    
    try {
        // Logomarca (Canto Superior Esquerdo - Base64)
        doc.addImage(LOGO_BASE64, 'PNG', margemEsquerda, 5, 30, 30);
    } catch (e) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('LOGO AQUI', margemEsquerda, 15);
    }

    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('FORMULÁRIO DE CANDIDATURA', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Promotor de Vendas', 105, 30, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    return 50; 
}

function adicionarSecao(doc, titulo, yPos, margemEsquerda, larguraPagina) {
    const alturaMaxima = 280;
    if (yPos > alturaMaxima - 15) { 
        doc.addPage();
        return 20;
    }
    doc.setFillColor(37, 99, 235);
    doc.rect(margemEsquerda, yPos, larguraPagina, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(titulo, margemEsquerda + 2, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    return yPos + 12;
}

function adicionarCampo(doc, label, valor, yPos, margemEsquerda, larguraPagina) {
    const alturaMaxima = 280;
    if (yPos > alturaMaxima - 15) { 
        doc.addPage();
        yPos = 20;
    }
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    // Verifica se é um campo de continuação sem label
    if (label) {
        doc.text(label + ':', margemEsquerda, yPos);
    } else {
        yPos -= 4; // Ajusta para não criar espaço extra
    }
    doc.setFont(undefined, 'normal');
    const texto = valor || 'Não informado';
    
    const linhas = doc.splitTextToSize(texto, larguraPagina - 10);
    doc.text(linhas, margemEsquerda, yPos + 4);
    
    return yPos + 4 + (linhas.length * 4);
}


// --- Função principal para gerar o PDF ---
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // 1. Coletar dados do formulário
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
    
    // 2. Validação de campos obrigatórios
    const camposObrigatorios = ['nomeCompleto', 'cpf', 'dataNascimento', 'rg', 'telefone', 'email', 'cep', 'endereco', 'cidade', 'estado', 'experienciaPromocao', 'temCelularProprio', 'conheceAppEstoque', 'facilidadeTecnologia', 'disponibilidadeHorario', 'inicioImediato', 'pretensoSalarial'];
    
    for (const campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo] === '') {
            alert(`O campo "${document.querySelector(`label[for='${campo}']`)?.textContent?.replace(' *', '') || campo}" é obrigatório e precisa ser preenchido.`);
            return; 
        }
    }

    // 3. Configuração do PDF
    let y = 20;
    const margemEsquerda = 20;
    const larguraPagina = 170;

    // 4. Início da Geração do Conteúdo
    y = adicionarCabecalho(doc, margemEsquerda);

    // 1. DADOS PESSOAIS
    y = adicionarSecao(doc, '1. DADOS PESSOAIS', y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Nome Completo', dados.nomeCompleto, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Data de Nascimento', dados.dataNascimento, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'CPF', dados.cpf, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'RG', dados.rg, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Telefone/WhatsApp', dados.telefone, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'E-mail', dados.email, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'CEP', dados.cep, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Endereço', dados.endereco, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Cidade', dados.cidade, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Estado', dados.estado, y, margemEsquerda, larguraPagina);
    y += 5;

    // 2. EXPERIÊNCIA PROFISSIONAL
    y = adicionarSecao(doc, '2. EXPERIÊNCIA PROFISSIONAL', y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Experiência como Promotor', dados.experienciaPromocao, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Tempo de Experiência', dados.tempoExperiencia, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Empresas Anteriores', dados.empresasAnteriores, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Motivo da Saída', dados.motivoSaida, y, margemEsquerda, larguraPagina);
    y += 5;

    // 3. CONHECIMENTOS TÉCNICOS
    y = adicionarSecao(doc, '3. CONHECIMENTOS TÉCNICOS', y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Possui Celular Próprio', dados.temCelularProprio, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Conhece App de Estoque', dados.conheceAppEstoque, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Facilidade com Tecnologia', dados.facilidadeTecnologia, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Possui Veículo', dados.possuiVeiculo, y, margemEsquerda, larguraPagina);
    y += 5;

    // 4. USO DO CELULAR
    y = adicionarSecao(doc, '4. ATIVIDADES COM CELULAR', y, margemEsquerda, larguraPagina);
    const atividades = [];
    if (dados.baterPonto) atividades.push('✓ Bater ponto');
    if (dados.passarEstoque) atividades.push('✓ Passar estoque');
    if (dados.tirarFotos) atividades.push('✓ Tirar fotos das bancadas');
    if (dados.usarAppOficial) atividades.push('✓ Usar app oficial');
    if (dados.comunicacaoEquipe) atividades.push('✓ Comunicação com equipe');
    if (dados.relatorios) atividades.push('✓ Enviar relatórios');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    y = adicionarCampo(doc, 'Atividades Confirmadas', '', y, margemEsquerda, larguraPagina);
    doc.setFont(undefined, 'normal');
    atividades.forEach(ativ => {
        y = adicionarCampo(doc, '', ativ, y, margemEsquerda, larguraPagina);
    });
    y += 5;

    // 5. DISPONIBILIDADE
    y = adicionarSecao(doc, '5. DISPONIBILIDADE', y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Disponibilidade de Horário', dados.disponibilidadeHorario, y, margemEsquerda, larguraPagina);
    
    const diasDisponiveis = [];
    if (dados.segunda) diasDisponiveis.push('Segunda');
    if (dados.terca) diasDisponiveis.push('Terça');
    if (dados.quarta) diasDisponiveis.push('Quarta');
    if (dados.quinta) diasDisponiveis.push('Quinta');
    if (dados.sexta) diasDisponiveis.push('Sexta');
    if (dados.sabado) diasDisponiveis.push('Sábado');
    if (dados.domingo) diasDisponiveis.push('Domingo');

    y = adicionarCampo(doc, 'Dias da Semana Disponíveis', diasDisponiveis.join(', ') || 'Nenhum dia selecionado', y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Início Imediato', dados.inicioImediato, y, margemEsquerda, larguraPagina);
    y += 5;

    // 6. OUTRAS INFORMAÇÕES
    y = adicionarSecao(doc, '6. OUTRAS INFORMAÇÕES', y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Pretensão Salarial', dados.pretensoSalarial, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Conhece os Produtos', dados.conheceProdutos, y, margemEsquerda, larguraPagina);
    y = adicionarCampo(doc, 'Observações Adicionais', dados.observacoes, y, margemEsquerda, larguraPagina);
    y += 5;
    
    // 7. FINALIZAÇÃO DA CANDIDATURA (Apenas no PDF, para assinatura manual)
    y = adicionarSecao(doc, '7. FINALIZAÇÃO DA CANDIDATURA', y, margemEsquerda, larguraPagina);
    
    // Texto da Declaração
    const declaracao = 'Declaro, sob as penas da lei, que todas as informações e respostas fornecidas neste formulário são verdadeiras e foram preenchidas por mim, o(a) candidato(a).';
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    y = adicionarCampo(doc, 'Declaração', declaracao, y, margemEsquerda, larguraPagina);
    y += 15; // Espaço extra para assinatura manual

    // Linha para Assinatura Manual
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, y, margemEsquerda + 150, y); 
    y += 3; 

    // Nome Completo do Candidato (referência)
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Candidato(a): ${dados.nomeCompleto.toUpperCase()}`, margemEsquerda, y); 
    y += 5;
    
    // Data de Preenchimento
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Data de Preenchimento: ${dataAtual}`, margemEsquerda + 105, y);
    
    // 5. Salvamento do PDF
    doc.save(`Candidatura_${dados.nomeCompleto.split(' ')[0]}_${dataAtual.replace(/\//g, '-')}.pdf`);
}