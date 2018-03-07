CREATE DATABASE "TISI"
TEMPLATE = TEMPLATE0
ENCODING 'WIN1252'
CONNECTION LIMIT -1;

----------------------------------- TB_EMPRESA -----------------------------------
CREATE TABLE TB_EMPRESA(
	ID_EMPRESA SERIAL,
	RAZAO_SOCIAL VARCHAR(60),
	NOME_FANTASIA VARCHAR(60),
	CNPJ VARCHAR(18),
	EMAIL VARCHAR(40),
	SENHA VARCHAR(50),
	TELEFONE VARCHAR(20),
	RUA VARCHAR(40),
	NUMERO INTEGER,
	BAIRRO VARCHAR(40),
	CEP VARCHAR(15),
	CIDADE VARCHAR(60),
	ESTADO VARCHAR(40),
	FG_ATIVO INTEGER,
	CONSTRAINT PK_TB_EMPRESA_ID_EMPRESA PRIMARY KEY(ID_EMPRESA)
);
--

----------------------------------- TB_CLIENTE_FISICO -----------------------------------
CREATE TABLE TB_CLIENTE_FISICO(
	ID_CLIENTE integer DEFAULT nextval('tb_cliente_id_cliente_seq'),
	NOME VARCHAR(60),
	SOBRENOME VARCHAR(60),
	CPF VARCHAR(15),
	DT_NASCIMENTO DATE,
	EMAIL VARCHAR(40),
	TELEFONE VARCHAR(20),
	RUA VARCHAR(40),
	NUMERO INTEGER,
	BAIRRO VARCHAR(40),
	CEP VARCHAR(15),
	CIDADE VARCHAR(60),
	ESTADO VARCHAR(40),
	ID_EMPRESA INTEGER,
	CONSTRAINT PK_TB_CLIENTE_FISICO_ID_CLIENTE PRIMARY KEY(ID_CLIENTE)
);	
--	

----------------------------------- TB_CLIENTE_JURIDICO -----------------------------------
CREATE TABLE TB_CLIENTE_JURIDICO(
	ID_CLIENTE integer DEFAULT nextval('tb_cliente_id_cliente_seq'),
	NOME_FANTASIA VARCHAR(60),
	RAZAO_SOCIAL VARCHAR(30),
	CNPJ VARCHAR(20),
	EMAIL VARCHAR(30),
	TELEFONE VARCHAR(20),
	RUA VARCHAR(40),
	NUMERO INTEGER,
	BAIRRO VARCHAR(40),
	CEP VARCHAR(15),
	CIDADE VARCHAR(60),
	ESTADO VARCHAR(40),
	ID_EMPRESA INTEGER,
	CONSTRAINT PK_TB_CLIENTE_JURIDICO_ID_CLIENTE PRIMARY KEY(ID_CLIENTE)
);
--

----------------------------------------- PRODUTO -----------------------------------------
CREATE TABLE TB_PRODUTO(
	 id_produto	SERIAL,
	 nome_produto	VARCHAR(60),
	 quantidade 	INTEGER,
	 valor_produto	NUMERIC(7,2),
	 FG_ATIVO 	INTEGER,
	CONSTRAINT pk_tb_produtos_id_produto PRIMARY KEY(id_produto)
);
--

----------------------------------------- SERVICO -----------------------------------------
CREATE TABLE TB_SERVICO(
	ID_SERVICO	SERIAL,
	nome_servico	VARCHAR(40),
	valor_servico		NUMERIC(7,2),
	FG_ATIVO	INTEGER,
	CONSTRAINT TB_SERVICO_ID_SERVICO PRIMARY KEY (ID_SERVICO)
);
--

-------------------------------------- ORDEM SERVICO --------------------------------------
CREATE TABLE TB_ORDEM_SERVICO(
		id_ordem_servico SERIAL,
		id_cliente 	 INTEGER,
		valor_os 	 NUMERIC(7,2),
	CONSTRAINT pk_tb_os_id_ordem_servico PRIMARY KEY(id_ordem_servico)
);
--

-- RELAÇÃO ORDEM SERVICO COM PRODUTO (N,N)
CREATE TABLE TB_OS_PRODUTO(
		id_ordem_servico	INTEGER,
		id_produto		INTEGER,
	CONSTRAINT pk_tb_os_produto_composto PRIMARY KEY (id_ordem_servico, id_produto),
	CONSTRAINT fk_tb_os_produto_id_os FOREIGN KEY (id_ordem_servico)
		REFERENCES TB_ORDEM_SERVICO(id_ordem_servico),
	CONSTRAINT fk_tb_os_produto_id_produto FOREIGN KEY (id_produto)
		REFERENCES TB_PRODUTO(id_produto)
);
--

-- RELAÇÃO ORDEM SERVICO COM SERVICO (N,N)
CREATE TABLE TB_OS_SERVICO(
		id_ordem_servico	INTEGER,
		id_servico		INTEGER,
	CONSTRAINT pk_tb_os_servico_composto PRIMARY KEY (id_ordem_servico, ID_SERVICO),
	CONSTRAINT fk_tb_os_servico_id_os FOREIGN KEY (id_ordem_servico)
		REFERENCES TB_ORDEM_SERVICO(id_ordem_servico),
	CONSTRAINT fk_tb_os_servico_id_servico FOREIGN KEY (ID_SERVICO)
		REFERENCES TB_SERVICO(ID_SERVICO)
);
--

--	select * from tb_produto

--	select * from TB_ORDEM_SERVICO

--	select * from TB_SERVICO

select * from tb_empresa

--	select * from TB_CLIENTE_FISICO

--	select * from TB_CLIENTE_JURIDICO


-------------------------------------------------------------------------------------------------------------
-- SIMULAÇÂO INSERT TB_OS

-- DADOS PRONTOS INSERT SERVICO, PRODUTO e OS

--INSERT INTO TB_CLIENTE_FISICO (ID_CLIENTE, NOME, SOBRENOME, CPF, DT_NASCIMENTO, EMAIL, TELEFONE, RUA, NUMERO, BAIRRO, CEP, CIDADE, ESTADO, ID_EMPRESA) 
--VALUES
--(default, 'teste1', 'teste', '222.222.222-22', '01/02/2018', 'teste1@teste1.com', '2222222222222222', 'teste1', 222 , 'teste1', '22222-222', 'franca', 'sp', 1);

INSERT INTO TB_PRODUTO(ID_PRODUTO, NOME_PRODUTO, QUANTIDADE, VALOR_PRODUTO, FG_ATIVO) 
VALUES
(default, 'Prod1', 4, 20, 1),
(default, 'Prod2', 5, 23, 1);

INSERT INTO TB_SERVICO(ID_SERVICO, NOME_SERVICO, VALOR_SERVICO, FG_ATIVO) 
VALUES
(default, 'Serv1', 10, 1),
(default, 'Serv1', 15, 1),
(default, 'Serv1', 20, 1);
	

INSERT INTO TB_ORDEM_SERVICO (id_ordem_servico, id_cliente, valor_os)
VALUES
(1,1,1000);

INSERT INTO TB_OS_PRODUTO (id_ordem_servico, id_produto)
VALUES
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 1),
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 2),
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 3);

INSERT INTO TB_OS_SERVICO (id_ordem_servico, id_servico)
VALUES
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 1),
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 2),
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 3),
((SELECT MAX(id_ordem_servico) as id_ordem_servico FROM TB_ORDEM_SERVICO), 4);

--	SELECT * FROM TB_ORDEM_SERVICO;
--	SELECT * FROM TB_OS_PRODUTO;
--	SELECT * FROM TB_OS_SERVICO;

BEGIN 
	CREATE TEMPORARY TABLE TB_TEMP_OS_PRODUTO(
			id_ordem_servico	INTEGER,
			id_produto		INTEGER
	);

	INSERT INTO TB_TEMP_OS_PRODUTO (id_ordem_servico,id_produto)
	VALUES
	(3,1),
	(3,2);

	INSERT INTO TB_OS_PRODUTO (id_ordem_servico,id_produto)
	SELECT id_ordem_servico,id_produto
	FROM TB_TEMP_OS_PRODUTO
	WHERE id_produto NOT IN(SELECT id_produto FROM TB_OS_PRODUTO WHERE id_ordem_servico = 3)
	AND id_ordem_servico = 3;

	CREATE TEMPORARY TABLE TB_TEMP_OS_SERVICO(
			id_ordem_servico	INTEGER,
			id_produto		INTEGER
	);

	INSERT INTO TB_TEMP_OS_PRODUTO (id_ordem_servico,id_produto)
	VALUES
	(3,1),
	(3,2);

	INSERT INTO TB_OS_PRODUTO (id_ordem_servico,id_produto)
	SELECT id_ordem_servico,id_produto
	FROM TB_TEMP_OS_PRODUTO
	WHERE id_produto NOT IN(SELECT id_produto FROM TB_OS_PRODUTO WHERE id_ordem_servico = 3)
	AND id_ordem_servico = 3;

ROLLBACK;

UPDATE TB_ORDEM_SERVICO 
  SET valor_os = 125
WHERE id_ordem_servico = 2;

DELETE FROM TB_OS_PRODUTO
WHERE id_ordem_servico = 2
  AND id_produto NOT IN (0,1,2);
DELETE FROM TB_OS_SERVICO
WHERE id_ordem_servico = 2
  AND id_servico NOT IN (0,1,2,3);

CREATE TEMPORARY TABLE TB_TEMP_OS_PRODUTO(
        id_ordem_servico        INTEGER,
        id_produto              INTEGER
);
INSERT INTO TB_TEMP_OS_PRODUTO (id_ordem_servico,id_produto)
VALUES
(3,0),
(3,1),
(3,2);
INSERT INTO TB_OS_PRODUTO (id_ordem_servico,id_produto)
SELECT id_ordem_servico,id_produto
FROM TB_TEMP_OS_PRODUTO
WHERE id_produto NOT IN
(
        SELECT id_produto
        FROM TB_OS_PRODUTO
        WHERE id_ordem_servico = 2
)
AND id_ordem_servico = 2;

CREATE TEMPORARY TABLE TB_TEMP_OS_SERVICO(
        id_ordem_servico        INTEGER,
        id_servico              INTEGER
);
INSERT INTO TB_TEMP_OS_SERVICO (id_ordem_servico,id_servico)
VALUES
(3,0),
(3,1),
(3,2);
INSERT INTO TB_OS_SERVICO (id_ordem_servico,id_servico)
SELECT id_ordem_servico,id_servico
FROM TB_TEMP_OS_SERVICO
WHERE id_servico NOT IN
(
        SELECT id_servico
        FROM TB_OS_SERVICO
        WHERE id_ordem_servico = 2
)
AND id_ordem_servico = 2;

DROP TABLE TB_TEMP_OS_PRODUTO; 
DROP TABLE TB_TEMP_OS_SERVICO;