/*
  --------------------------------------------------------------------------------------
  Função para buscar as informações financeiras de um morador e preencher a tabela
  --------------------------------------------------------------------------------------
*/
const getFinanceiro = () => {
  let moradorId = document.getElementById("apartamento").value;

  if (moradorId === '') {
    showToast("Informe o número do apartamento!", 'error');
    return;
  }

  let url = `http://127.0.0.1:5000/financeiro?morador=${moradorId}`;
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
      const apartamento = data.apartamento;
      const valorCondominio = data['Valor do condomínio'];
      updateRow(apartamento, valorCondominio);
    })
    .catch((error) => {
      showToast(error, 'error');
    });
}

const newItem = () => {
  getFinanceiro();
}

const updateRow = (apartamento, valorCondominio) => {
  const row = document.getElementById("tabelaFinanceiroRow");

  if (row) {
    row.cells[0].textContent = apartamento;
    row.cells[1].textContent = valorCondominio;
  } else {
    const table = document.getElementById("tabelaFinanceiro");
    const newRow = table.insertRow();
    newRow.id = "tabelaFinanceiroRow";

    const cell1 = newRow.insertCell();
    cell1.textContent = apartamento;

    const cell2 = newRow.insertCell();
    cell2.textContent = valorCondominio;
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova linha na tabela com as informações financeiras
  --------------------------------------------------------------------------------------
*/
const insertRow = (apartamento, valorCondominio) => {
  const table = document.getElementById("myTable");
  const row = table.insertRow(-1);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);

  cell1.innerHTML = apartamento;
  cell2.innerHTML = valorCondominio;
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
  Função para mostrar status da API de emails
  --------------------------------------------------------------------------------------
*/
updateAPIIndicator();