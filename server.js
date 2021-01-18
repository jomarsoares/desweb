/*#
 * Geração dinâmica de conteúdos segundo um layout prefefinido
 *
 * Neste exemplo, além do uso do EJS para construção de conteúdo
 * dinamicamente, usa-se um layout comum a um conjunto de páginas. 
 * 
 * O exemplo é bem rudimentar, mas auxilia à compreensão do uso 
 * destes recursos e permite abrir perspectivas para outras criações.
 *  
 * Além disso, é exemplificado neste código a geração e uso de cookies
 * a partir do cabeçalho set-cookies (servidor -> cliente) e cookies 
 * (cliente -> servidor) do HTTP. No exemplo, o cookie é usado para
 * guardar informações sobre a última visualização do usuário dentre
 * três diferentes "CVs" 
 * 
 * Para testar verificar a geração e o status do cookie, você pode usar 
 * a tecla F12 do seu navegador e procurar informações sobre o 
 * armazenamento local.  
 * 
 * 
 * IMPORTANTE! ==================================================

	Para executar o exemplo, é preciso ter o NodeJS 
	no computador (https://nodejs.org/en/download/). 

	Para instalar as dependências, configuradas em package.json, 
	execute o npm como no exemplo abaixo. 
	
			> npm i

	Será criada a pasta "node_modules" contendo as dependências. 

	Para executar o servidor, use 
	 
			 > node server.js
	
	Em seguida, no navegador, use a url
	
			http://localhost:8080/

	==============================================================
 * 
 */

const express = require('express'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// módulo que permite o uso de layouts padronizados
const expressLayouts = require('express-ejs-layouts'); 

const app = express() 
const fs = require("fs");
const path = require('path');

/*
 * Configurações do servidor HTTP do express para 
 * - definir o diretório home do seridor, em que os recursos podem 
 *   ser localizados
 * - aceitar o parsinh para url-encoded (notação para uso de dados
 *   normalmente criados por formulários html)
 * - uso de scrips EJS  
 */ 
app.use(express.static('public')); // define o home dos arquivos estáticos
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

/*
 * Configuracap do servidor para o uso do layouts na nossa aplicação
 * (ver layout.ejs no diretorio views)
 */
app.use(expressLayouts) 

/* 
 * Configuração do servidor para o uso de cookies
 */
app.use(cookieParser());

/*
 * Rota default (todas as demais são acionadas por interação com 
 * o layour formatado no navegador (cliques)
 * 
 * usar http://localhost:8080/
 * 
 * (mudar a porta, se necessário - ver último comentário deste fonte) 
 */
app.get('/', (req, res) => {

	// especificação da localização dos arquivos de dados
	var dirData = path.join(__dirname+'/public/data');
	fs.readdir(dirData, function(err, items) {
		// carrega os nomes dos subdiretórios de /public/data 
	    var disponiveisCV = items;
		
		// Carrega o valor do cabeçalho 'cookie' da requisição HTTP
		var lastCv = req.cookies.lastCv;

		// log conteudo do cookie lastCv no console
		if (lastCv != undefined) {
			console.log(`Cookie: ${lastCv}\n`);
		} else {
			console.log('Cookie: vazio!!!\n');
		}

		// renderização da página html para escolha do CV a ser exibido
		res.render('index', {disponiveisCV, lastCv});
	});
})	


app.get('/cv', function(req,res) {
// app.post('/cv', function(req,res) {  // Substituir para o caso de usar POST
	var arr1 = [], arr2 = [];
	/*
	* Alternativa de recuperação de dados com o POST 
	* (nesse caso, os dados do formulário devem ser recuperados no payload do HTTP)
	* O comentário abaixo deve ser removidos e a linha subsequente comentada
	* para recuperar o nome no corpo o nome do usuário     
	*/
	// var name = req.body.name; // recuperação com POST
	var name = req.query.name; // recuperação com GET
	
	var diret = path.join(__dirname+'/public/data/'+name);
	
	var dadosCV = 
	{ 
	  	userName : name,
	  	linesSec1 : [], 
      	linesSec2 : []
	}	

	// Leitura dos dados da 1a secao	// var name = req.params.usu //recuperação com /cv/:usu

	fs.readFile(diret+'/s1.txt', 
	    function (err, data) {
		if (err) {
			res.send('erro na leitura do aquivo s1.txt');
			return console.error(err);
		}
		dadosCV.linesSec1 = data.toString().split("\n")
	
		// Leitura dos dados da 2a secao
		fs.readFile(diret+'/s2.txt', 
	    function (err, data) {
			if (err) {
				res.send('erro na leitura do aquivo s1.txt');
				return console.error(err);
			}
			dadosCV.linesSec2 = data.toString().split("\n")
			
			// Salva cookie com nome de cv acessado
			res.cookie('lastCv', name);

			// renderiza cv2.ejs com dadosCV
			res.render('cv2',dadosCV);
		});
	});
})

// rota para a página contato (opção do nav)
app.get('/contato', (req, res) => {
    res.render('contato')
})

// rota para a página config (opção do nav)
app.get('/config', (req, res) => {
    res.render('config')
})

/*
	Inicia o servidor http na porta 8080
	Caso esta porta já esteja em uso, escolha 
	outro valor entre 1024 e 65535  
*/
const porta = 8080
app.listen(porta, function () {
  console.log('Server listening on port '+porta)
})

