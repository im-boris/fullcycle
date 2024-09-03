const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const PORT = process.env.NODE_APP_PORT || 3000;

const config = {
  host: 'database', // nome do SERVICO no docker-compose
  user: 'root',     // padrão é root por causa de como a imagem do MySQL foi configurada
  database: process.env.DATABASE_NAME, // arquivo .env
  password: process.env.DATABASE_ROOT_PASSWORD, // arquivo .env
  multipleStatements: process.env.ENABLE_MULTI_STATEMENTS  // arquivo .env, Habilitando multiplas querys no MySQL 
}

const createDatabaseTable = async () =>{

  const conecao = mysql.createConnection(config);

  const isTableCreated = await verifyIsTableCreated(conecao, 'people');

  if(!isTableCreated.length) {
    createTable(conecao);
  }

  conecao.end();

}

(async function init(){
  await createDatabaseTable()
})();


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// -------- Rotas
app.get('/people', async (req, res) => {

  const connection = mysql.createConnection(config);

  const peopleName = req.query.name;

  if(peopleName) {
    addNewPeople(connection, peopleName);
  }

  const peoples = await getAllPeoples(connection);

  connection.end();
  
  let html = createTitle();
  html += createHTMLTable(peoples);

  res.send(html);
})

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta : ${PORT}`)
})


// -------- Funções
async function verifyIsTableCreated(conecao, nomeTabela) {
  return new Promise((sucess, erro) => {

    conecao.query(`SHOW TABLES LIKE '${nomeTabela}';`, (err, result) => {
      if(err) {
        erro(err);
      } else {
        sucess(result);
      }
    })

  });
}

function createTable(conecao) {
  conecao.query("CREATE TABLE people (id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(255) NOT NULL, PRIMARY KEY (id))", (erro) => {
    if (erro) 
      throw erro;
    console.log("Tabela pessoa criada !");
  });
}

function addNewPeople(conecao, peopleName) {
  conecao.query(`INSERT INTO people (nome) VALUES ('${peopleName}');`);
}

async function getAllPeoples (conecao) {
  return new Promise((sucess, erro) => {

    conecao.query("SELECT * FROM people;", (err, result) => {
      if(err) {
        erro(err);
      } else {
        sucess(result);
      }
    })

  });
}

function createTitle() {
  return `
    <div style="display:flex; justify-content:center">
      <h1>Full Cycle Rocks!</h1>
    </div>`;
}

function createHTMLTable(peoples) {

  const style = `
    <style>
        .container {
            overflow: auto;
            display:flex;
            justify-content: center;
            width: 100%;
        }
        .container table {
            border: 1px solid #dededf;
            width: 55%;
            text-align: left;
        }
        .container th {
            border: 1px solid #dededf;
            background-color: #eceff1;
            color: #000000;
            padding: 5px;
        }
        .container td {
            border: 1px solid #dededf;
            background-color: #ffffff;
            color: #000000;
            padding: 5px;
        }
    </style>
  `;

  const table = `
    <div class="container">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
               ${createHTMLTableRow(peoples)}
            </tbody>
        </table>
    </div>
  `;

  return style + table;
}

function createHTMLTableRow(peoples) {
  const row = '';
  return peoples.reduce(
    (acumulador, current) => {
      return acumulador + `<tr><td>${current.id}</td><td>${current.nome}</td></tr>\n`;
    },
    row,
  );
}