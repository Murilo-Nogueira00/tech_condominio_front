# Tech Condomínio Interface

Este projeto é a entrega do MVP da disciplina Arquitetura de Software do curso de pós-graduação de Engenharia de Software na PUC RIO

---

## Como executar

O Usuário deve clonar os arquivos do repositório e abrir um dos arquivos .html para visualizar a interface (Todas as páginas estão linkadas).

Será necessário o usuário possuir a API do link:

```
https://github.com/Murilo-Nogueira00/tech_condominio_api.git
```

A API deve estar em execução para o funcionamento da interface

> Mais informações de como executar a aplicação no link do repositório da API

Com a aplicação da API rodando, o usuário poderá utilizar todas as ferramentas da interface.

## Dockerização da aplicação

Faça o download e instale o Docker Desktop na versão mais recente e compatível com seu PC.

Crie uma imagem para essa aplicação rodando o seguinte comando, chamaremos esta imagem de componente-a:

```
docker build -t componente-a:latest .
```

Depois da imagem criada, iniciaremos o container com o seguinte comando:

```
docker run -d -p 8080:80 --name container-a componente-a:latest
```
