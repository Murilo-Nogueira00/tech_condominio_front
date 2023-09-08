/*
  --------------------------------------------------------------------------------------
  Função para colocar uma ocorrência na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputMorador, inputMotivo, inputData) => {
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
const newItem = () => {
    let inputMorador = document.getElementById("apartamento").value;
    let inputMotivo = document.getElementById("motivo").value;
    let inputData = document.getElementById("data").value;

    if (inputMorador === '') {
        showToast("Informe o número do apartamento!", 'error');
    } else if (inputMotivo === '') {
        showToast("O motivo da advertência deve ser informado!", 'error');
    } else if (inputData === '') {
        showToast("Informe a data da ocorrência!", 'error');
    } else {
        postItem(inputMorador, inputMotivo, inputData)
            .then((data) => {
                if (data && data.ocorrência && data.ocorrência.length > 0) {
                    const ocorrencia = data.ocorrência[0];
                    const mensagem = `${ocorrencia.tipo} registrada para o morador do apartamento: ${ocorrencia.morador}. 
                    \nMotivo: ${ocorrencia.motivo}`;
                    showToast(mensagem);
                }

                if(data.ocorrência[1]) {
                    const multa = data.ocorrência[1];
                    const mensagem = `${multa.tipo} registrada para o morador do apartamento: ${multa.morador}. 
                    \nMotivo: ${multa.motivo}`;
                    showToast(mensagem);                    
                }
            })
            .catch((error) => {
                showToast(error, 'error');
            });
    }
}

const updateTable = (ocorrencias) => {
    // Limpar as linhas de dados da tabela
    const table = document.getElementById("myTable");
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
                updateTable(ocorrencias);
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
