/*
  --------------------------------------------------------------------------------------
  Função para colocar uma ocorrência na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postSancao = async (inputMorador, inputMotivo, inputData) => {
    const formData = new FormData();
    formData.append('morador', inputMorador);
    formData.append('motivo', inputMotivo);
    formData.append('data', inputData);

    let url = 'http://127.0.0.1:5000/ocorrencia';
    const response = await fetch(url, {
        method: 'post',
        body: formData
    });
    if (!response.ok) {
        return response.json().then((data) => {
            var message = data.message;
            return Promise.reject(new Error(message));
        });
    }
    return await response.json();
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova ocorrência informando morador, motivo e data 
  --------------------------------------------------------------------------------------
*/
const newSancao = () => {
    let inputMorador = document.getElementById("apartamento").value;
    let inputMotivo = document.getElementById("motivo").value;
    let inputData = document.getElementById("data").value;
    let ocorrencia;
    let email;

    if (inputMorador === '') {
        showToast("Informe o número do apartamento!", 'error');
    } else if (inputMotivo === '') {
        showToast("O motivo da advertência deve ser informado!", 'error');
    } else if (inputData === '') {
        showToast("Informe a data da ocorrência!", 'error');
    } else {
        postSancao(inputMorador, inputMotivo, inputData)
            .then((data) => {
                if (data && data.ocorrência && data.ocorrência.length > 0) {
                    ocorrencia = data.ocorrência;
                    const mensagem = `${ocorrencia[0].tipo} registrada para o morador do apartamento: ${ocorrencia[0].morador}. 
                    \nMotivo: ${ocorrencia[0].motivo}`;
                    showToast(mensagem);
                }

                if (ocorrencia[1]) {
                    const mensagem = `${ocorrencia[1].tipo} registrada para o morador do apartamento: ${ocorrencia[1].morador}. 
                    \nMotivo: ${ocorrencia[1].motivo}`;
                    showToast(mensagem);                    
                }
                return getMorador(inputMorador);
            })
            .then(data => {
                email = data.email;
                postMailSancao(inputMorador, ocorrencia[0].tipo, inputMotivo, inputData, email);
                if (ocorrencia[1]) {
                    postMailSancao(inputMorador, ocorrencia[1].tipo, inputMotivo, inputData, email);
                }
            })
            .catch((error) => {
                showToast(error.message || error, 'error');
            });
    }
}

const updateTable = (ocorrencias) => {
    // Limpar as linhas de dados da tabela
    const table = document.getElementById("sancaoTable");
    const rows = table.querySelectorAll("tr:not(:first-child)");
    rows.forEach((row) => row.remove());

    // Preencher a tabela com os novos dados
    for (const ocorrencia of ocorrencias) {
        const row = table.insertRow();
        const motivoCell = row.insertCell();
        const tipoCell = row.insertCell();
        const apartamentoCell = row.insertCell();
        const dataCell = row.insertCell();

        motivoCell.textContent = ocorrencia.motivo;
        apartamentoCell.textContent = ocorrencia.morador;
        tipoCell.textContent = ocorrencia.tipo;
        dataCell.textContent = ocorrencia.data;
    }
}

const getOcorrencias = () => {
    let url = 'http://127.0.0.1:5000/ocorrencia';
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    var message = data.message;
                    throw new Error(message);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.ocorrência && data.ocorrência.length > 0) {
                const ocorrencias = data.ocorrência;
                ocorrencias.forEach(ocorrencia => {
                    insertSancaoList(ocorrencia.motivo, ocorrencia.tipo, ocorrencia.morador, ocorrencia.data);
                });
            } else {
                showToast('Nenhuma ocorrência encontrada');
            }
        })
        .catch((error) => {
            showToast(error, 'error');
        });
}


const newSearch = () => {
    getOcorrencias();
}

/*
  --------------------------------------------------------------------------------------
  Função para enviar um email após ocorrência via requisição POST
  --------------------------------------------------------------------------------------
*/
const postMailSancao = async (inputApartamento, inputTipo, inputMotivo, inputData, inputEmail) => {
    const formData = new FormData();
    formData.append('morador', inputApartamento);
    formData.append('tipo', inputTipo);
    formData.append('motivo', inputMotivo);
    formData.append('data', inputData);
    formData.append('email', inputEmail);

    let url = 'http://127.0.0.1:8000/email/sancao';
    const response = await fetch(url, {
        method: 'post',
        body: formData
    });
    if (!response.ok) {
        return response.json().then((data) => {
            var message = data.message;
            showToast(message, 'error');
            return Promise.reject(new Error(message));
        });
    }
    return await response.json();
}

/*
  --------------------------------------------------------------------------------------
  Função para mostrar notificações estilizadas
  --------------------------------------------------------------------------------------
*/
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir dados de Sanções na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertSancaoList = (motivo, tipo, morador, data) => {
    let item = [motivo, tipo, morador, data];
    var table = document.getElementById('sancaoTable');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];
    }
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getOcorrencias()

/*
  --------------------------------------------------------------------------------------
  Função para mostrar status da API de emails
  --------------------------------------------------------------------------------------
*/
updateAPIIndicator();