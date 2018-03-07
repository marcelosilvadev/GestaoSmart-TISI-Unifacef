var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var core_use = require('cors');
var pg = require('pg');
var session = require('express-session');

var sess;
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/fronts/views');
app.set('view engine', 'html');
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/fronts', express.static(__dirname + '/fronts'));
app.use('/image', express.static(__dirname + '/image'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));

app.use(core_use());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var config = {
	user: "postgres",
	database: "TISI",
	password: "12345",
	port: 5432,
	max: 10,
    idleTimeoutMills: 30000
}

var canal = new pg.Pool(config);

//===================================
//-------------- TELAS --------------
//===================================

// encerra sessão
app.get('/logout',function(req,res){		
	req.session.destroy(function(err){		
		if (err) {			
			console.log(err);		
		}	
	});
	res.redirect('/login');
});


// telas quer precisam de login
app.get('/index',function(req,res){
	res.render('index.html');
});

app.get('/cadastro_site',function(req,res){
	res.render('cadastro_site.html');
});

app.get('/login',function(req,res){
	res.render('login.html');
});

app.get('/menu',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Menu.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/cadastro_juridica',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('cadastro_juridica.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/cadastro_fisica',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('cadastro_fisica.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/Produtos',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Produtos.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/Servicos',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Servicos.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/Ordem_servico',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Ordem_servico.html');
    } 
    else {
    	res.render('login.html');
    } 
});
app.get('/Atualizar_Ordem_Servico',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Atualizar.html');
    } 
    else {
    	res.render('login.html');
    } 
});
app.get('/Remover_Ordem_Servico',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Remover.html');
    } 
    else {
    	res.render('login.html');
    } 
});
app.get('/Visualizar_Ordem_Servico',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('Visualizar.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/gerar_relatorio',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('gerar_relatorio.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/relatorio',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('relatorio.html');
    } 
    else {
    	res.render('login.html');
    } 
});


//Método para Login
app.post('/logar', function (req, res) {
	var sess = req.session;
	canal.connect(function (erro, conexao, finalizado) {
		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}
		var sql = 'SELECT COUNT(*) as valor '
			+ 'FROM TB_EMPRESA '
			+ 'WHERE EMAIL = \'' + req.body.email + '\' '
			+ 'AND SENHA = MD5(\'' + req.body.senha + '\'); ';
		
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro na consulta da tabela', erro);
			}
			var valor = resultado.rows[0].valor;
			if( valor == 1){
				sess.email = req.body.email;
			}
			res.json(valor);
		});
	});
});
//=============================================================

//Método para inserir Pessoa Fisica
app.post('/cadastroClienteFisico', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}
		
		var sql = 'INSERT INTO TB_CLIENTE_FISICO (ID_CLIENTE, NOME, SOBRENOME, CPF, DT_NASCIMENTO, EMAIL, TELEFONE, RUA, NUMERO, BAIRRO, CEP, CIDADE, ESTADO, ID_EMPRESA)'
			+ ' VALUES'
			+ '(default, \'' +
			req.body.nome + '\', \'' +
			req.body.sobrenome + '\', \'' +
			req.body.cpf + '\', \'' +
			req.body.dt_nascimento + '\', \'' +
			req.body.email + '\', \'' +
			req.body.telefone + '\', \'' +
			req.body.rua + '\', ' +
			req.body.numero + ' , \'' +
			req.body.bairro + '\', \'' +
			req.body.cep + '\', \'' +
			req.body.cidade + '\', \'' +
			req.body.estado + '\', ' +
			req.body.id_empresa + ');';
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao inserir cliente !', erro);
			}
			res.sendStatus(200);
		});
	});
});
//=============================================================

//Método para consutal Cliente Fisico
app.get('/consultaClienteFisico', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}

		var sql = '\nSELECT ID_CLIENTE, NOME, SOBRENOME, CPF, DT_NASCIMENTO, EMAIL, TELEFONE, RUA, NUMERO, BAIRRO, CEP, CIDADE, ESTADO, ID_EMPRESA '
				+ '\nFROM TB_CLIENTE_FISICO '
				+ '\nORDER BY ID_CLIENTE;';

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao atualizar cliente !', erro);
			}
			res.json(resultado.rows);
		});
	});
});
//=============================================================

//Método para inserir Pessoa Juridica
app.post('/cadastroClienteJuridico', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}

		var sql = 'INSERT INTO TB_CLIENTE_JURIDICO (ID_CLIENTE, NOME_FANTASIA, RAZAO_SOCIAL, CNPJ, EMAIL, TELEFONE, RUA, NUMERO, BAIRRO, CEP, CIDADE, ESTADO, ID_EMPRESA)'
			+ ' VALUES'
			+ '(default, \'' +
			req.body.nomeFantasia + '\', \'' +
			req.body.razaoSocial + '\', \'' +
			req.body.cnpj + '\', \'' +
			req.body.email + '\', \'' +
			req.body.telefone + '\', \'' +
			req.body.rua + '\', ' +
			req.body.numero + ' , \'' +
			req.body.bairro + '\', \'' +
			req.body.cep + '\', \'' +
			req.body.cidade + '\', \'' +
			req.body.estado + '\', ' +
			req.body.id_empresa + ');';
		console.log(sql);

		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao inserir cliente !', erro);
			}
			res.sendStatus(200);
		});
	});
});
//=============================================================

//Método para consutal Cliente Juridico
app.get('/consultaClienteJuridico', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}

		var sql = '\nSELECT ID_CLIENTE, NOME_FANTASIA AS NOME, RAZAO_SOCIAL, CNPJ, EMAIL, TELEFONE, NUMERO, BAIRRO, CEP, CIDADE, ESTADO, ID_EMPRESA '
				+ '\nFROM TB_CLIENTE_JURIDICO '
				+ '\nWHERE ID_CLIENTE >= 1 '
				+ '\nORDER BY ID_CLIENTE;';

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao atualizar cliente !', erro);
			}
			res.json(resultado.rows);
		});
	});                                                        ;;
});
//=============================================================

app.get('/consultaClientes', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}

		var sql = '\nSELECT ID_CLIENTE, NOME '
				+ '\nFROM TB_CLIENTE_FISICO '
				+ '\n UNION'
				+' \nSELECT ID_CLIENTE, NOME_FANTASIA AS NOME '
				+ '\nFROM TB_CLIENTE_JURIDICO '
				+ '\nWHERE ID_CLIENTE >= 1 '
				+ '\nORDER BY ID_CLIENTE;';

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao atualizar cliente !', erro);
			}
			res.json(resultado.rows);
		});
	});
});
//=============================================================

//Método para inserir Empresa
app.post('/cadastroEmpresa', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {
		if (erro) {
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}
		var sql = 'INSERT INTO TB_EMPRESA (ID_EMPRESA, RAZAO_SOCIAL, NOME_FANTASIA, CNPJ, EMAIL, SENHA, TELEFONE, RUA, NUMERO, BAIRRO, CEP, CIDADE, ESTADO, FG_ATIVO)'
			+ ' VALUES'
			+ '(default, \'' +
			req.body.razaoSocial + '\', \'' +
			req.body.nomeFantasia + '\', \'' +
			req.body.cnpj + '\', \'' +
			req.body.email + '\', md5(\'' +
			req.body.senha + '\'), \'' +
			req.body.telefone + '\', \'' +
			req.body.rua + '\', ' +
			req.body.numero + ' , \'' +
			req.body.bairro + '\', \'' +
			req.body.cep + '\', \'' +
			req.body.cidade + '\', \'' +
			req.body.estado + '\', 1);';
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao inserir cliente !', erro);
			}
			res.sendStatus(200);
		});
	});
});
//=============================================================
//Método para cadastrar Serviço
app.post('/cadastrarServico', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {
		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}
		var sql = 'INSERT INTO TB_SERVICO(ID_SERVICO, NOME_SERVICO, VALOR_SERVICO, FG_ATIVO)'
			+ ' VALUES'
			+ '(default, \'' +
			req.body.nome_servico + '\', ' +
			req.body.valor_servico + '\, 1);';
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao cadastrar serviço !', erro);
			}
			res.sendStatus(200);
		});
	});
});//=============================================================

//Método para consultar Servico
app.get('/consultaServico', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}

		var sql = '\nSELECT ID_SERVICO, NOME_SERVICO, VALOR_SERVICO as VALOR, FG_ATIVO '
				+ '\nFROM TB_SERVICO '
				+ '\nWHERE FG_ATIVO = 1 '
				+ '\nORDER BY ID_SERVICO;';

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao atualizar cliente !', erro);
			}
			res.json(resultado.rows);
		});
	});
});
//=============================================================

//Método para cadastrar Produto
app.post('/cadastrarProduto', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			finalizado();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}
		var sql = 'INSERT INTO TB_PRODUTO(ID_PRODUTO, NOME_PRODUTO, QUANTIDADE, VALOR_PRODUTO, FG_ATIVO)'
			+ ' VALUES'
			+ '(default, \'' +
			req.body.nome_produto + '\', ' +
			req.body.quantidade + '\, ' +
			req.body.valor_produto + '\, 1);';
		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao cadastrar serviço !', erro);
			}
			res.sendStatus(200);
		});
	});
});
//=============================================================

//Método para consultar Produto
app.get('/consultaProduto', function (req, res) {
	canal.connect(function (erro, conexao, finalizado) {

		if (erro) {
			feito();
			return console.error('Erro ao conectar ao Banco de Dados', erro);
		}

		var sql = '\nSELECT ID_PRODUTO, NOME_PRODUTO, QUANTIDADE, VALOR_PRODUTO as VALOR, FG_ATIVO '
				+ '\nFROM TB_PRODUTO '
				+ '\nWHERE FG_ATIVO = 1 '
				+ '\nORDER BY ID_PRODUTO;';

		console.log(sql);
		conexao.query(sql, function (erro, resultado) {
			finalizado();
			if (erro) {
				res.sendStatus(400);
				return console.error('Erro ao atualizar cliente !', erro);
			}
			res.json(resultado.rows);
		});
	});
});
//=============================================================

// RECUPERAR TODAS 'OS'
app.post('/cadastraOS', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			feito();
			return console.error('erro ao conectar no banco', erro);
		}
		var i;

		var sql = '\nINSERT INTO TB_ORDEM_SERVICO (id_ordem_servico, id_cliente, valor_os)'
				+ '\nVALUES '
				+ '\n(DEFAULT,' + req.body.id_cliente + ',' +  req.body.valor_os + ');'

		//  Produtos
				+ '\n'
				+ '\nINSERT INTO TB_OS_PRODUTO (id_ordem_servico, id_produto)'
				+ '\nVALUES ';

		var sql_aux = '(SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO)';
		for(i in req.body.produto){
			sql += '\n(' + sql_aux + ', ' + req.body.produto[i] + '),';
		}
		sql = sql.substring(0, sql.length-1) + ';';
		//
		// 	Servicos
		sql += '\n';
		sql += '\nINSERT INTO TB_OS_SERVICO (id_ordem_servico, id_servico)'
			+  '\nVALUES ';

		sql_aux = '(SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO)';
		for(i in req.body.servico){
			sql += '\n(' + sql_aux + ', ' + req.body.servico[i] + '),';
		}
		sql = sql.substring(0, sql.length-1) + ';';
		//

		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				res.sendStatus(400);
				return console.error('Erro na consulta da tabela', erro);
			}
			res.sendStatus(200);
		});
	});
});

app.get('/consultaOS', function (req, res){
	canal.connect(function(err, client, done){
		if (err){ // ocorreu um erro
			done();
			return console.error('Erro ao conectar no banco', erro);
		}
		
		var sql = '\nSELECT OS.id_ordem_servico, OS.id_cliente, CF.nome, OS.valor_os '
				+ '\nFROM TB_ORDEM_SERVICO OS '
				+ '\nINNER JOIN TB_CLIENTE_FISICO CF ON CF.id_cliente = OS.id_cliente '
				+ '\n UNION '
				+ '\nSELECT OS.id_ordem_servico, OS.id_cliente, CJ.nome_fantasia AS nome, OS.valor_os '
				+ '\nFROM TB_ORDEM_SERVICO OS  '
				+ '\nINNER JOIN TB_CLIENTE_JURIDICO CJ ON CJ.id_cliente = OS.id_cliente '
				+ '\nORDER BY id_ordem_servico';
				
		console.log(sql);
						
		client.query(sql, function(erro, resultado){
			done(); // libera a conexão
			if (erro){
				res.sendStatus(400);
				return console.error('Erro na consulta TB_ORDEM_SERVICO', erro);
			}
			res.json(resultado.rows);
		})		
	});
});
app.get('/consulta_produto_OS', function (req, res){
	canal.connect(function(err, client, done){
		if (err){ // ocorreu um erro
			done();
			return console.error('Erro ao conectar no banco', erro);
		}

		var sql = '\nSELECT OSP.id_ordem_servico, OSP.id_produto'
				+ '\nFROM TB_OS_PRODUTO OSP '
				+ '\nORDER BY OSP.id_ordem_servico;';
				
		console.log(sql);
						
		client.query(sql, function(erro, resultado){
			done(); // libera a conexão
			if (erro){
				res.sendStatus(400);
				return console.error('Erro na consulta TB_ORDEM_SERVICO', erro);
			}
			res.json(resultado.rows);
		})		
	});
});
app.get('/consulta_servico_OS', function (req, res){
	res.ordem_servico;
	canal.connect(function(err, client, done){
		if (err){ // ocorreu um erro
			done();
			return console.error('Erro ao conectar no banco', erro);
		}

		var sql = '\nSELECT OSS.id_ordem_servico, OSS.id_servico'
				+ '\nFROM TB_OS_SERVICO OSS '
				+ '\nORDER BY OSS.id_ordem_servico;';
				
		console.log(sql);
						
		client.query(sql, function(erro, resultado){
			done(); // libera a conexão
			if (erro){
				res.sendStatus(400);
				return console.error('Erro na consulta TB_ORDEM_SERVICO', erro);
			}
			res.json(resultado.rows);
		})		
	});
});


app.post('/atualizaOS', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			feito();
			return console.error('erro ao conectar no banco', erro);
		}
		var produtos = '', servicos = '';
		for (var produto in req.body.produto)
			produtos += req.body.produto[produto].toString() + ',';
		produtos = produtos.substring(0, produtos.length-1);
		for (var servico in req.body.servico)
			servicos += req.body.servico[servico].toString() + ',';
		servicos = servicos.substring(0, servicos.length-1);

		// remove relações que o usuario não deseja mais
			//PRODUTOS
		var sql = '\nUPDATE TB_ORDEM_SERVICO '
				+ '\n  SET valor_os = ' + req.body.valor_os
				+ '\nWHERE id_ordem_servico = ' + req.body.id_ordem_servico + ';'
				+ '\n'
				+ '\nDELETE FROM TB_OS_PRODUTO '
				+ '\nWHERE id_ordem_servico = ' + req.body.id_ordem_servico
				+ '\n  AND id_produto NOT IN (' + produtos + ');'
			// SERVICOS
				+ '\nDELETE FROM TB_OS_SERVICO '
				+ '\nWHERE id_ordem_servico = ' + req.body.id_ordem_servico
				+ '\n  AND id_servico NOT IN (' + servicos + ');'

		// insere relações que não existentem
			// PRODUTOS
				+ '\n'
				+ '\nCREATE TEMPORARY TABLE TB_TEMP_OS_PRODUTO( '
				+ '\n	id_ordem_servico	INTEGER,'
				+ '\n	id_produto		INTEGER'
				+ '\n);'
				+ '\n'
				+ '\nINSERT INTO TB_TEMP_OS_PRODUTO (id_ordem_servico,id_produto)'
				+ '\nVALUES';
			for (produto in req.body.produto)
				sql += ' (' + req.body.id_ordem_servico + ',' + req.body.produto[produto] + '),';
			sql = sql.substring(0,sql.length-1) + ';';
			sql += '\n'
				+ '\nINSERT INTO TB_OS_PRODUTO (id_ordem_servico,id_produto) '
				+ '\nSELECT id_ordem_servico,id_produto '
				+ '\nFROM TB_TEMP_OS_PRODUTO '
				+ '\nWHERE id_produto NOT IN '
				+ '\n('		
				+ '\n	SELECT id_produto '
				+ '\n	FROM TB_OS_PRODUTO '
				+ '\n	WHERE id_ordem_servico = ' + req.body.id_ordem_servico
				+ '\n) '
				+ '\nAND id_ordem_servico = ' + req.body.id_ordem_servico + ';'
			// SERVICOS
				+ '\n'
				+ '\nCREATE TEMPORARY TABLE TB_TEMP_OS_SERVICO( '
				+ '\n	id_ordem_servico	INTEGER,'
				+ '\n	id_servico		INTEGER'
				+ '\n);'
				+ '\n'
				+ '\nINSERT INTO TB_TEMP_OS_SERVICO (id_ordem_servico,id_servico)'
				+ '\nVALUES';
			for (servico in req.body.servico)
				sql += ' (' + req.body.id_ordem_servico + ',' + req.body.servico[servico] + '),';
			sql = sql.substring(0,sql.length-1) + ';';
			sql += '\n'
				+ '\nINSERT INTO TB_OS_SERVICO (id_ordem_servico,id_servico) '
				+ '\nSELECT id_ordem_servico,id_servico '
				+ '\nFROM TB_TEMP_OS_SERVICO '
				+ '\nWHERE id_servico NOT IN '
				+ '\n('		
				+ '\n	SELECT id_servico '
				+ '\n	FROM TB_OS_SERVICO '
				+ '\n	WHERE id_ordem_servico = ' + req.body.id_ordem_servico
				+ '\n) '
				+ '\nAND id_ordem_servico = ' + req.body.id_ordem_servico + ';'

				+ '\n\nDROP TABLE TB_TEMP_OS_PRODUTO; DROP TABLE TB_TEMP_OS_SERVICO;';
		// FIM INSERÇÃO
		console.log(sql);		

		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				res.sendStatus(400);
				return console.error('Erro na atualização dos dados', erro);
			}
			res.sendStatus(200);
		})
	})
});
app.delete('/removeOS/:id_ordem_servico', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			feito();
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = '\nDELETE FROM TB_OS_PRODUTO '
				+ '\nWHERE id_ordem_servico =  ' + req.params.id_ordem_servico + ';'

				+ '\nDELETE FROM TB_OS_SERVICO '
				+ '\nWHERE id_ordem_servico =  ' + req.params.id_ordem_servico + ';'

				+ '\nDELETE FROM TB_ORDEM_SERVICO '
				+ '\nWHERE id_ordem_servico =  ' + req.params.id_ordem_servico + ';';

		console.log(sql);

		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				res.sendStatus(400);
				return console.error('Erro na remoção dos dados', erro);
			}
			res.sendStatus(200);// retorna ao cliente o resultado da remoção
		});
	});
});
//=============================================================
app.listen(3000, function () {
	console.log("SERVIDOR ON");
})