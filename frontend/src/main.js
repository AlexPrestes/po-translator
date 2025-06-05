import * as PO from 'pofile'; // <<< ESSA LINHA PRECISA ESTAR AQUI NO TOPO

// TODO O CÓDIGO DO SEU ANTIGO app.js VAI AQUI ABAIXO, SUBSTITUINDO O CONTEÚDO PADRÃO DO VITE

let poFile = null;
let poItems = [];

// Adiciona event listeners aos elementos da UI
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('downloadBtn').addEventListener('click', downloadPoFile);
document.getElementById('translateAllBtn').addEventListener('click', translateAll);
document.getElementById('searchInput').addEventListener('input', renderTable);

/**
 * Lida com o upload de um arquivo .po ou .pot.
 * Lê o arquivo, faz o parsing com PO.parse e renderiza a tabela.
 * @param {Event} event - O evento de mudança do input de arquivo.
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  console.log('p1: Início de handleFileUpload');
  reader.onload = (e) => {
    console.log('p2: FileReader carregado');
    const content = e.target.result;

    console.log('p3: Conteúdo lido, chamando PO.parse');
    console.log("Valor de PO:", PO);
    console.log("Tipo de PO.parse:", typeof PO.parse);

    try {
        // *** MUDANÇA CRÍTICA AQUI: PO.parse é SÍNCRONO e não tem callback para erro/sucesso ***
        const parsed = PO.parse(content); // Chame PO.parse de forma síncrona
        
        console.log('p4: PO.parse executado com sucesso (síncrono)');
        
        poFile = parsed;
        poItems = parsed.items;

        console.log('p5: poFile e poItems definidos');
        // *** NOVOS CONSOLE.LOGS DETALHADOS AQUI (mantidos para debug adicional) ***
        console.log("Objeto parsed (poFile):", poFile); 
        console.log("Itens parseados (poItems):", poItems); 

        if (poItems && poItems.length > 0) {
            console.log("Primeiro item (poItems[0]):", poItems[0]); 
            console.log("Primeiro item msgid:", poItems[0].msgid); 
            console.log("Primeiro item msgstr:", poItems[0].msgstr); 
            console.log("Primeiro item msgstr[0]:", poItems[0].msgstr[0]); 
            console.log("Primeiro item msgctxt:", poItems[0].msgctxt); 
        } else {
            console.log("poItems está vazio ou não é um array após o parsing. O arquivo .po pode estar vazio ou mal formatado.");
        }
        // *** FIM DOS CONSOLE.LOGS DETALHADOS ***

        renderTable();
        console.log('p6: renderTable chamada');

    } catch (parseError) {
        // Trate erros que podem ser lançados por PO.parse diretamente
        alert('Erro ao ler o arquivo .po: ' + parseError.message);
        console.error('Erro ao fazer parsing do arquivo .po (síncrono):', parseError);
        return;
    }
  };
  reader.readAsText(file);
}

/**
 * Renderiza a tabela de itens .po, aplicando filtros de busca.
 */
function renderTable() {
  const tbody = document.querySelector('#poTable tbody');
  const search = document.getElementById('searchInput').value.toLowerCase();

  tbody.innerHTML = '';

  poItems
    .filter(entry =>
      (entry.msgid || '').toLowerCase().includes(search) ||
      (entry.msgstr[0] || '').toLowerCase().includes(search) ||
      (entry.msgctxt || '').toLowerCase().includes(search)
    )
    .forEach((entry, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${entry.msgctxt || ''}</td>
        <td>${entry.msgid}</td>
        <td><input type="text" value="${entry.msgstr[0] || ''}" data-index="${index}" /></td>
        <td><button class="translate-btn" data-index="${index}">Traduzir</button></td>
      `;

      tr.querySelector('input').addEventListener('input', (e) => {
        entry.msgstr[0] = e.target.value;
      });

      // Adiciona listener ao botão, sem usar onclick inline
      tr.querySelector('button.translate-btn').addEventListener('click', () => {
        translateLine(index);
      });

      tbody.appendChild(tr);
    });
}

/**
 * Envia uma linha de tradução para o model-service para tradução.
 * @param {number} index - O índice do item na array poItems a ser traduzido.
 */
async function translateLine(index) {
  const item = poItems[index];
  console.log(item);

  if (!item.msgid) {
    alert('Não há texto original (msgid) para traduzir nesta linha.');
    return;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_text: item.msgid,
        source_lang: 'en',
        target_lang: 'pt'
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    item.msgstr[0] = data.translated_text;
    console.log('Tradução:', data.translated_text);

    renderTable();
  } catch (error) {
    alert('Erro na tradução via API: ' + error.message);
    console.error('Erro na requisição de tradução:', error);
  }
}

/**
 * Traduz todas as linhas que ainda não possuem tradução.
 */
async function translateAll() {
  for (let index = 0; index < poItems.length; index++) {
    const item = poItems[index];
    if (!item.msgstr[0]) {
      await translateLine(index);
    }
  }
}

async function loadModels() {
  try {
    const response = await fetch('/api/models');
    const models = await response.json();

    const select = document.getElementById('modelSelect');
    select.innerHTML = '';

    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar modelos:', error);
  }
}

/**
 * Gera e baixa um arquivo .po com as traduções atuais.
 */
function downloadPoFile() {
  if (!poFile) {
    alert('Nenhum arquivo .po carregado para baixar.');
    return;
  }

  const content = poFile.toString();
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'translated.po';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
