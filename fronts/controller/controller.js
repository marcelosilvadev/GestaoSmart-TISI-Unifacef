var controller = angular.module('Controller', ['ngCookies','ngMaterial', 'ngMessages']);

controller.controller('Controller', function ($scope, $http, $cookies) {
    $scope.ordemServico = {
        'id_cliente' : '',
        'produto' : [],
        'servico' : [],
        'valor_os' : ''
    }

    var consultaUsuario = function () {
        $http.post('http://localhost:3000/logar', $scope.login)
            .then(function (response) {
                if (response.data > 0) {
                    //alert("Login feito com Sucesso!!!");
                    $cookies.put('email1', $scope.login.email, {'domain': 'localhost'}); 
                    window.location.href = "http://localhost:3000/menu";
                }
                else {
                    alert("Email ou Senha inválido, tente novamente!!!");
                }

            });
    };

    $scope.consultaClientes = function () {
        $http.get('http://localhost:3000/consultaClientes')
            .then(function (response) {
                $scope.lstCliente = response.data;
            });
    };

    var cadastarClienteFisica = function () {
        $http.post('http://localhost:3000/cadastroClienteFisico', $scope.cliente)
            .then(function (response) {
                alert("Cliente inserido com sucesso!!!");
            });
    };
    
    var consultaClienteFisica = function () {
        $http.get('http://localhost:3000/consultaClienteFisico')
            .then(function (response) {
                $scope.clienteFisica = response.data;
            });
    };

    var cadastarClienteJuridica = function () {
        $http.post('http://localhost:3000/cadastroClienteJuridico', $scope.clienteJ)
            .then(function (response) {
                alert("Cliente inserido com sucesso!!!");
            });
    };


    var consultaClienteJuridica = function () {
        $http.get('http://localhost:3000/consultaClienteJuridico')
            .then(function (response) {
                $scope.clienteJuridica = response.data;
            });
    };

    var cadastarEmpresa = function () {
        $http.post('http://localhost:3000/cadastroEmpresa', $scope.empresa)
            .then(function (response) {
                alert("Cadastro realizado com Sucesso !!!");
            });
    };

    var cadastarServico = function () {
        $http.post('http://localhost:3000/cadastrarServico', $scope.servico)
            .then(function (response) {
                alert("Cadastro realizado com Sucesso !!!");
            });
    };

    var consultarServico = function () {
        $http.get('http://localhost:3000/consultaServico')
            .then(function (response) {
                $scope.servico = response.data;
            });
    };

    var cadastrarProduto = function () {
        $http.post('http://localhost:3000/cadastrarProduto', $scope.produto)
            .then(function (response) {
                alert("Cadastro realizado com Sucesso !!!");
            });
    };

    var consultarProduto = function () {
        $http.get('http://localhost:3000/consultaProduto')
            .then(function (response) {
                $scope.produto = response.data;
            });
    };

    $scope.consultaOrdemServico = function(){
		$http.get('http://localhost:3000/consultaOS')
		.then(function (response){
            $scope.lst_ordem_servico = response.data;
            $scope.ordem_servico = angular.copy(response.data);
            $http.get('http://localhost:3000/consulta_produto_OS')
            .then(function(response){
                for(var i in $scope.lst_ordem_servico){
                    $scope.lst_ordem_servico[i].produto = [];
                    for(var j in response.data){
                        if ($scope.lst_ordem_servico[i].id_ordem_servico == response.data[j].id_ordem_servico)
                            $scope.lst_ordem_servico[i].produto.push(response.data[j].id_produto);
                    }
                    $scope.ordem_servico[i].produto = angular.copy($scope.lst_ordem_servico[i].produto);
                }
            });
            $http.get('http://localhost:3000/consulta_servico_OS')
            .then(function(response){
                for(var i in $scope.lst_ordem_servico){
                    $scope.lst_ordem_servico[i].servico = [];
                    for(var j in response.data){
                        if ($scope.lst_ordem_servico[i].id_ordem_servico == response.data[j].id_ordem_servico)
                            $scope.lst_ordem_servico[i].servico.push(response.data[j].id_servico);
                    }
                    $scope.ordem_servico[i].servico = angular.copy($scope.lst_ordem_servico[i].servico);
                }
            });
            
		});
    };
    
    $scope.restaurar = function(index){
        $scope.ordem_servico[index].produto = $scope.lst_ordem_servico[index].produto;
        $scope.ordem_servico[index].servico = $scope.lst_ordem_servico[index].servico;
        $scope.ordem_servico[index].valor_os = $scope.lst_ordem_servico[index].valor_os;
    }

    //==================================================================
    //====================== CADASTRAR O.S. ============================
    //==================================================================

    $scope.cadastrarOS = function(){
        if($scope.ordemServico.produto.length > 0 && $scope.ordemServico.servico.length > 0 && 
            $scope.ordemServico.id_cliente != '' && $scope.ordemServico.valor_os != ''){
            $http.post('http://localhost:3000/cadastraOS', $scope.ordemServico)
            .then(function (response){
                alert("Cadastrado com sucesso");
            });
        }
        else
            alert("Preencha todos os campos");
	}

    //==================================================================
    //====================== ATUALIZA O.S. =============================
    //==================================================================
    $scope.atualizaOS = function(index){
        if($scope.ordem_servico[index].produto != '' && $scope.ordem_servico[index].servico != ''){
            if(confirm('Realmente deseja atualizar a Ordem de Servico?')){
                $http.post('http://localhost:3000/atualizaOS', $scope.ordem_servico[index])
                .then(function (response){
                    alert("Atualização com sucesso");
                    $scope.consultaOrdemServico();
                });
            }
        }
        else
            alert("Selecione no mínimo um produto ou servico");        
    }
    
    /*
    $scope.preparaAtualizacaoOS = function(id_ordem_servico){
		var posicao = retornaIndiceOS(id_ordem_servico);
        $scope.ordemServico = $scope.listaOS[posicao];
    }
    
    function retornaIndiceOS(codigo){
		var i;
		for (i=0;i<$scope.listaOS.length;i++){
			if ($scope.listaOS[i].id_produto_servico == id_produto_servico){
				return i; // retorna posição do produto desejado
			}
		}
		return -1;
    }*/
    
    //==================================================================
    //====================== REMOVE O.S. ===============================
    //==================================================================

    $scope.removeOS = function(index){
		var resposta = confirm("Confirma a exclusão deste elemento?");
		if (resposta == true){
			$http.delete('http://localhost:3000/removeOS/' + $scope.ordem_servico[index].id_ordem_servico)
			.then(function (response){
				alert("Remoção com sucesso");
                $scope.consultaOrdemServico();
			});
		}
    }

    //==================================================================
    //================== CALCULAR VALOR O.S. ===========================
    //==================================================================

    $scope.calc_valorOS = function(index){
        var ordem_servico
        if (index >= 0)
            ordem_servico = $scope.ordem_servico[index];
        else 
            ordem_servico = $scope.ordemServico;

        ordem_servico.valor_os = parseFloat('0.00');
        var produtos = angular.copy($scope.produto);
        var i, j;
        if (ordem_servico.produto.length > 0){
            for (i in ordem_servico.produto){
                for (j in produtos){
                    if (ordem_servico.produto[i] == produtos[j].id_produto){
                        ordem_servico.valor_os = parseFloat(ordem_servico.valor_os) + parseFloat(produtos[j].valor);
                        break;
                    }
                }
            }
        }
        var servicos = angular.copy($scope.servico);
        i=0;
        if (ordem_servico.servico.length > 0){
            for (i in ordem_servico.servico){
                for (j in servicos){
                    if (ordem_servico.servico[i] ==  servicos[j].id_servico){
                        ordem_servico.valor_os = parseFloat(ordem_servico.valor_os) + parseFloat(servicos[j].valor);
                        break;
                    }
                }
            }
        }
        ordem_servico.valor_os = parseFloat(ordem_servico.valor_os).toFixed(2);
    }

    //==================================================================
    //==================================================================

    $scope.entrar = function () {
        consultaUsuario();
    };

    $scope.insereCliFisico = function () {
        cadastarClienteFisica();
    };

    $scope.insereCliJuridico = function () {
        cadastarClienteJuridica();
    };

    $scope.consultaClienteFisica = function () {
        consultaClienteFisica();
    };
    $scope.consultaClienteJuridica = function () {
        consultaClienteJuridica();
    };

    $scope.insereEmpresa = function () {
        cadastarEmpresa();
    };

    $scope.cadastroServico = function () {
        cadastarServico();
    };

    $scope.consultaServico = function () {
        consultarServico();
    };

    $scope.cadastroProduto = function(){
        cadastrarProduto();
    };

    $scope.consultaProduto = function () {
        consultarProduto();
    };

    $scope.receber = function () {
		if (angular.isDefined($cookies.get('email1'))){
			console.log('Bem vindo: ' + $cookies.get('email1'));
			$scope.usuario = $cookies.get('email1');
		}
	};
	
	$scope.logout = function () {
		$cookies.remove('email1')
		window.location.href = '/logout';
    };

    // md-select - search
    $scope.searchTerm = '';
    $scope.searchTerm2 = '';
    $scope.searchTerm3 = '';
    $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
        $scope.searchTerm2 = '';
        $scope.searchTerm3 = '';
    }; 
    $scope.pararPropagacao = function(ev){
        ev.stopPropagation();
    }
});




