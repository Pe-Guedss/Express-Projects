# Desafio #01

Sua tarefa nessa semana é implementar as rotas padrão vistas acima (GET, POST, PUT e DELETE) utilizando tudo que você aprendeu até aqui.  



Para simular um banco de dados, utilize o objeto de objetos abaixo, acessando os elementos do objeto através da chave.  



> Nota: as alterações que você fizer no array só persistirá enquanto o servidor rodar, diferentemente de um banco de dados. Portanto, toda vez que você reiniciar o servidor ele voltará ao estado inicial.



```javascript
// Ex: lojaDeJogos['The Witcher'] retorna o objeto referente ao The Witcher

const lojaDeJogos = {
  'The Witcher': {
    nome: 'The Witcher 3: Wild Hunt',
    ano: 2015,
    preco: 60.0,
    genero: 'RPG',
  },
  'FIFA 22': {
    nome: 'FIFA 22',
    ano: 2021,
    preco: 200.0,
    genero: 'Esporte',
  },
  'The Last of Us Part II': {
    nome: 'The Last of Us Part II',
    ano: 2020,
    preco: 120.0,
    genero: 'Ação-Aventura'
  },
  'The Elder Scrolls V: Skyrim': {
    nome: 'The Elder Scrolls V: Skyrim',
    ano: 2011,
    preco: 60.0,
    genero: 'RPG'
  },
  'Just Dance 2022': {
    nome: 'Just Dance 2022',
    ano: 2021,
    preco: 190.0,
    genero: 'Música'
  },
}
```

