/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
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
        alert("Informe o número do apartamento!");
    } else if (inputMotivo === '') {
        alert("O motivo da advertência deve ser informado!");
    } else if (inputData === '') {
        alert("Informe a data da ocorrência!");
    } else {
        postItem(inputMorador, inputMotivo, inputData)
            .then((data) => {
                if (data && data.ocorrência && data.ocorrência.length > 0) {
                    const ocorrencia = data.ocorrência[0];
                    const mensagem = `${ocorrencia.tipo} registrada para o morador do apartamento: ${ocorrencia.morador}. 
                    \nMotivo: ${ocorrencia.motivo}`;
                    alert(mensagem);
                }
            })
            .catch((error) => {
                alert(error);
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
                alert('Nenhuma ocorrência encontrada');
            }
        })
        .catch((error) => {
            alert(error);
            alert("Erro ao buscar ocorrências");
        });
}

const newSearch = () => {
    getOcorrencias();
}

