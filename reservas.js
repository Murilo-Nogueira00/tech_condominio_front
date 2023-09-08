/*
  --------------------------------------------------------------------------------------
  Função para colocar uma reserva na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postReserva = async (inputApartamento, inputEspaco, inputData) => {
    const formData = new FormData();
    formData.append('morador', inputApartamento);
    formData.append('espaco', inputEspaco);
    formData.append('data', inputData);

    let url = 'http://127.0.0.1:5000/reserva';
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
  Função para enviar um email após reserva via requisição POST
  --------------------------------------------------------------------------------------
*/
const postMail = async (inputApartamento, inputEspaco, inputData, inputEmail) => {
    const formData = new FormData();
    formData.append('morador', inputApartamento);
    formData.append('espaco', inputEspaco);
    formData.append('data', inputData);
    formData.append('email', inputEmail);

    let url = 'http://127.0.0.1:8000/email/reserva';
    const response = await fetch(url, {
        method: 'post',
        body: formData
    });
    if (!response.ok) {
        return response.json().then((data) => {
            var message = data.message;
            alert("Não deu para enviar o email");
            return Promise.reject(new Error(message));
        });
    }
    return await response.json();
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova reserva informando apartamento, espaço e data 
  --------------------------------------------------------------------------------------
*/
const newReserva = () => {
    let inputApartamento = document.getElementById("apartamento").value;
    let inputEspaco = document.getElementById("espaco").value;
    let inputData = document.getElementById("data").value;
    let email;

    if (inputApartamento === '') {
        alert("Escreva o apartamento do morador!");
    } else if (inputEspaco === '') {
        alert("O espaço deve ser Churrasqueira ou Salão!");
    } else if (inputData === '') {
        alert("Informe a data da reserva!");
    } else {
        postReserva(inputApartamento, inputEspaco, inputData)
            .then((data) => {
                if (data && data.financeiro && data.financeiro.length > 0) {
                    const reserva = data.financeiro[0];
                    const mensagem = `Reserva do ${inputEspaco} realizada para o apartamento: ${reserva.apartamento}. 
                    \nValor da reserva: R$ ${reserva["valor da reserva"]}`;
                    alert(mensagem);
                }
                return getMorador(inputApartamento);
            })
            .then(data => {
                email = data.email;
                return postMail(inputApartamento, inputEspaco, inputData, email);
            })
            .catch((error) => {
                alert(error);
            });
    }
}


const updateTable = (reservas) => {
    // Limpar as linhas de dados da tabela
    const table = document.getElementById("reservaTable");
    const rows = table.querySelectorAll("tr:not(:first-child)");
    rows.forEach((row) => row.remove());

    // Preencher a tabela com os novos dados
    for (const reserva of reservas) {
        const row = table.insertRow();
        const apartamentoCell = row.insertCell();
        const espacoCell = row.insertCell();
        const dataCell = row.insertCell();

        apartamentoCell.textContent = reserva.apartamento;
        espacoCell.textContent = reserva.espaco;
        dataCell.textContent = reserva.data;
    }
}

const getReservas = () => {
    let url = `http://127.0.0.1:5000/reserva?morador`;
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
            if (data.reserva && data.reserva.length > 0) {
                const reservas = data.reserva;
                updateTable(reservas);
            } else {
                alert('Nenhuma reserva encontrada');
            }
        })
        .catch((error) => {
            alert(error);
            alert("Erro ao buscar reservas");
        });
}


const newSearch = () => {
    getReservas();
}

const insertRow = (table, apartamento, espaco, data) => {
    const row = table.insertRow();

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = apartamento;
    cell2.textContent = espaco;
    cell3.textContent = data;
}
