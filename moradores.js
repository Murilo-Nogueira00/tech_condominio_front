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
      data.morador.forEach(item => insertList(item.nome, item.apartamento))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputMorador, inputApartamento) => {
  const formData = new FormData();
  formData.append('nome', inputMorador);
  formData.append('apartamento', inputApartamento);

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
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[1].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
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
  Função para adicionar um novo morador, com nome e apartamento 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputMorador = document.getElementById("novoMorador").value;
  let inputApartamento = document.getElementById("novoApartamento").value;

  if (inputMorador === '' || inputApartamento === '') {
    alert("Escreva o nome e o apartamento do morador!");
  } else {
    postItem(inputMorador, inputApartamento)
      .then(() => {
        insertList(inputMorador, inputApartamento);
        alert("Morador adicionado!");
      })
      .catch((error) => {
        alert(error);
        alert("Erro ao adicionar morador");
      });
  }
}



/*
  --------------------------------------------------------------------------------------
  Função para inserir dados de Moradores na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameMorador, apartamento) => {
  item = [nameMorador, apartamento]
  var table = document.getElementById('myTable');
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