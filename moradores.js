

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/moradores';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.morador.forEach(item => insertMoradoresList(item.nome, item.apartamento, item.email))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
window.getMorador = async (apartamento) => {
  let url = `http://127.0.0.1:5000/morador?apartamento=${apartamento}`;

  try {
    const response = await fetch(url, { method: 'get' });

    if (!response.ok) {
      throw new Error('Erro na resposta da rede');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um morador na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postMorador = async (inputMorador, inputApartamento, inputEmail) => {
  const formData = new FormData();
  formData.append('nome', inputMorador);
  formData.append('apartamento', inputApartamento);
  formData.append('email', inputEmail);

  let url = 'http://127.0.0.1:5000/morador';
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
  Função para criar um botão close para cada morador da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let btn = document.createElement("button");
  btn.className = "close";

  let img = document.createElement("img");
  img.src = "https://i.imgur.com/BW7apf6.png"; // URL da imagem da lixeira
  img.alt = "Deletar";
  img.className = "lixeira-img";

  btn.appendChild(img);
  parent.appendChild(btn);
}



/*
  --------------------------------------------------------------------------------------
  Função para remover um morador da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[1].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        showToast("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um morador da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/morador?apartamento=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo morador, com nome, apartamento e email 
  --------------------------------------------------------------------------------------
*/
const newMorador = () => {
  let inputMorador = document.getElementById("novoMorador").value;
  let inputApartamento = document.getElementById("novoApartamento").value;
  let inputEmail = document.getElementById("novoEmail").value;

  if (inputMorador === '' || inputApartamento === '' || inputEmail === '') {
    showToast("Preencha todos os campos!", 'error');
  } else {
    postMorador(inputMorador, inputApartamento, inputEmail)
      .then(() => {
        insertMoradoresList(inputMorador, inputApartamento, inputEmail);
        showToast("Morador adicionado!");
      })
      .catch((error) => {
        showToast(error, 'error');
      });
  }
}




/*
  --------------------------------------------------------------------------------------
  Função para inserir dados de Moradores na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertMoradoresList = (nameMorador, apartamento, email) => {
  item = [nameMorador, apartamento, email];
  var table = document.getElementById('moradoresTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("novoMorador").value = "";
  document.getElementById("novoApartamento").value = "";

  removeElement()
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