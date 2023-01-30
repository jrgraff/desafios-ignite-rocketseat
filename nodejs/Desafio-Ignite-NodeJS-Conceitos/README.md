<h1 align="center">
  <img alt="" src=".github/cover-node.js.png">
  
  <br>

  Ignite Journey
</h1>

<p align="center">
  <img alt="Node.js Logo" src="https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js">&nbsp;&nbsp;
   <img alt="GitHub" src="https://img.shields.io/github/license/lemuelZara/concepts-nodejs.svg">
</p>

<br>

## Desafio 01 - Conceitos do Node.js

Nesse desafio, você deverá criar uma aplicação para treinar o que aprendeu até agora no Node.js!

Essa será uma aplicação para gerenciar tarefas (em inglês *todos*). Será permitida a criação de um usuário com `name` e `username`, bem como fazer o CRUD de *todos*:

- Criar um novo *todo*
- Listar todos os *todos*
- Alterar o `title` e `deadline` de um *todo* existente
- Marcar um *todo* como feito
- Excluir um *todo*

## Especificação dos testes

### Testes de usuário

- **Should be able to create a new user**

Para que esse teste passe, você deve permitir que um usuário seja criado e retorne um json com o usuário criado. Você pode ver o formato de um usuário abaixo:

```javascript
{ 
  id: 'uuid', // precisa ser um uuid
  name: 'Danilo Vieira', 
  username: 'danilo', 
  todos: []
}
```

Também é necessário que você retorne a resposta com o código `201`.

<br>

- **Should not be able to create a new user when username already exists**

Para que esse teste passe, antes de criar um usuário você deve validar se outro usuário com o mesmo `username` já existe. Caso exista, retorne uma resposta com status `400` e um json no seguinte formato:

```javascript
{
  error: 'Mensagem do erro'
}
```

A mensagem pode ser de sua escolha, desde que a propriedade seja `error`.

<br>

### Testes de TODO's

- **Should be able to list all user's todos**

Para que esse teste passe, na rota GET `/todos` é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount` e então retornar a lista `todos` que está no objeto do usuário conforme foi criado para satisfazer o [primeiro teste](#testes-de-usuário).

<br>

- **Should be able to create a new todo**

Para que esse teste passe, na rota POST `/todos` é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount`, pegar também o `title` e o `deadline` do corpo da requisição e adicionar um novo *todo* na lista `todos` que está no objeto do usuário.

Lembre-se de seguir a estrutura padrão de um *todo*:

```javascript
{ 
  id: 'uuid', // precisa ser um uuid
  title: 'Nome da tarefa',
  done: false, 
  deadline: new Date(deadline), 
  created_at: new Date()
}
```

<br>

- **Should be able to update a todo**

Para que esse teste passe, na rota PUT `/todos/:id` é necessário atualizar um *todo* existente, recebendo o `title` e o `deadline` pelo corpo da requisição e o `id` presente nos parâmetros da rota.

<br>

- **Should not be able to update a non existing todo**

Para que esse teste passe, você não deve permitir a atualização de um *todo* que não existe e retornar uma resposta contendo um status `404` e um json no seguinte formato: 

```javascript
{
  error: 'Mensagem do erro'
}
```

<br>

- **Should be able to mark a todo as done**

Para que esse teste passe, na rota PATCH `/todos/:id/done` você deve mudar a propriedade `done`de um *todo* de `false` para `true`, recebendo o `id` presente nos parâmetros da rota.

<br>

- **Should not be able to mark a non existing todo as done**

Para que esse teste passe, você não deve permitir a mudança da propriedade `done` de um *todo* que não existe e retornar uma resposta contendo um status `404` e um json no seguinte formato: 

```javascript
{
	error: 'Mensagem do erro'
}
```

<br>

- **Should be able to delete a todo**

Para que esse teste passe, DELETE `/todos/:id` você deve permitir que um *todo* seja excluído usando o `id` passado na rota. O retorno deve ser apenas um status `204` que representa uma resposta sem conteúdo.


<br>

- **Should not be able to delete a non existing todo**

Para que esse teste passe, você não deve permitir excluir um *todo* que não exista e retornar uma resposta contendo um status `404` e um json no seguinte formato:

```javascript
{
	error: 'Mensagem do erro'
}
```
