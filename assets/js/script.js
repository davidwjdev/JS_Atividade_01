function abrirMenu() {
    document.getElementById("header-menu-button-ul").style.width = "250px";
}

function fecharMenu() {
    document.getElementById("header-menu-button-ul").style.width = "0";
}

//formata campo de valor
function mascaraValor(param) {
    //     document.getElementById('form-input--valor').addEventListener('input',function(event) {
    //     if (this.value.length === 1) {
    //         this.value = '0'+this.value;
    //     }
    //     this.value = parseFloat(this.value.replace(/[^\d]/g,'').replace(/(\d\d?)$/,'.$1')).toFixed(2);

    // });


    param.preventDefault();
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(param.key) == -1) {
        //console.log("letra");
    } else {
        let valor = param.target.value.replace(/^0,/, "").replace(",", "").replace(/\./g, "") + param.key;
        //replace("0,", "").replace(",", "") 
        //console.log(valor);
        if (valor.length <= 2) {
            param.target.value = "0," + valor;
            //console.log("param " + param.target.value + "value " + valor);
            //console.log(typeof valor);
        } else {
            param.target.value = valor.slice(0, -2) + ',' + valor.slice(valor.length - 2, valor.length);
            //console.log("param " + param.target.value);
            //console.log(typeof valor);

        }
        lastIndex = -1;
        valor = param.target.value.replace(/^0,[0-9]+/, "").replace(/,[0-9]+$/, "").replace(/\./g, "");
        //console.log("valor " + valor);
        if (valor.length >= 4) {
            valorFinal = [];
            for (let i = valor.length; i >= 0; i--) {
                if ((valor.length - i) % 3 == 0 && valor.slice(i - 3, i)) {
                    valorFinal.push(valor.slice(i - 3, i));
                    lastIndex = i;
                }
            }
            valorString = valorFinal.reverse().join(".");
            param.target.value = valorString + "," + param.target.value.replace(/^[0-9.]+,/, "");
            if (valor.slice(0, lastIndex - 3)) {
                param.target.value = valor.slice(0, lastIndex - 3) + "." + param.target.value;
            }
        }
    }

}
//formata campo de valor


function validaCampos(param) {
    document.getElementById('form--mensagem-erro').innerHTML = '';
    if (
        document.getElementById('form-combobox--itens').value == '' ||
        document.getElementById('form-input--nome-mercadoria').value == '' ||
        document.getElementById('form-input--valor').value == ''
    ) {
        document.getElementById('form--mensagem-erro').innerHTML = 'Todos os campos devem ser preenchidos!';
        return false;
    }
    if (
        document.getElementById('form-input--valor').value == "00" ||
        document.getElementById('form-input--valor').value == "0" ||
        document.getElementById('form-input--valor').value == "0,0" ||
        document.getElementById('form-input--valor').value == "0,00"
    ) {
        document.getElementById('form--mensagem-erro').innerHTML = 'Valor deve ser maior que zero!';
        return false;
    }
    submitForm(param);
    return (true);




}

function submitForm(param) {
    let selecionar = document.getElementById('form-combobox--itens').value;
    let mercadoria = document.getElementById('form-input--nome-mercadoria').value;
    let valor = document.getElementById('form-input--valor').value;
    //console.log(selecionar + mercadoria + valor);
    //console.log(param);
    adicionaNaLista(selecionar, mercadoria, valor);
}

function adicionaNaLista(selecionar, mercadoria, valor) {
    let oldItens = JSON.parse(localStorage.getItem('itensLista')) || [];
    let newItem = {
        'selecionar': selecionar,
        'mercadoria': mercadoria,
        'valor': valor
    };
    oldItens.push(newItem);
    localStorage.setItem('itensLista', JSON.stringify(oldItens));
    //console.log(JSON.parse(localStorage.getItem('itensLista')));
}

function limpaLocalStorage() {
    let limpar = confirm('Deseja limpar todos os registros?');
    if (limpar == true) {
        window.localStorage.clear();
        window.location.reload();
        return true;
    } else {
        return false;
    }
}

//Inicio itens de salvar no servidor
//variavel pega itens do local storage
let listaCompleta = JSON.parse(localStorage.getItem('itensLista'));
//variavel com id do aluno
const aluno = '8980';

function salvarServidor() {
    let json = JSON.stringify(listaCompleta);
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    }).then(response => response.json())
        .then(responseJson => {
            const existe = responseJson.records.filter((record) => {
                if (aluno == record.fields.Aluno) {
                    return true;
                }
                return false;
            });
            if (existe.length == 0) {
                insereDados();
            } else {
                alteraDados(existe[0].id);
            }

        });
}

function insereDados() {
    let json = JSON.stringify(listaCompleta);
    let body = JSON.stringify({
        "records": [
            {
                "fields": {
                    "Aluno": aluno,
                    "Json": json
                }
            }
        ]
    }
    )
    alert("Salvo com sucesso no servidor!");
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "POST",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type": "application/json"
        },
        body: body
    });
}

function alteraDados(id) {
    let json = JSON.stringify(listaCompleta);
    let body = JSON.stringify({
        "records": [
            {
                "id": id,
                "fields": {
                    "Aluno": aluno,
                    "Json": json
                }
            }
        ]
    }
    );
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "PATCH",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type": "application/json"
        },
        body: body
    });
    alert("Salvo com sucesso no servidor!");

}
//Fim itens de salvar no servidor




window.addEventListener('load', (e) => {
    let listaCompleta = JSON.parse(localStorage.getItem('itensLista'));
    //console.log('listaCompleta', listaCompleta);
    let linhaHTML = '';
    let soma = 0.00;
    if (typeof listaCompleta === 'undefined' || listaCompleta === null) {
        linhaHTML += '<div class="list-insert"><div class="list-insert-div"><span class="list-insert--simbolo">' +
            '</span><span class="list-insert--mercadoria">Nenhuma transação cadastrada</span></div>' +
            '<div class="list-insert-div"><span class="list-insert--valor"></span></div></div>';
        document.getElementById("list-todas-divs").innerHTML = linhaHTML;
    } else {

        for (let key in listaCompleta) {
            //console.log('key ', key);
            //console.log('listaCompleta ', listaCompleta);
            //console.log(typeof (selecionar));
            let linha = listaCompleta[key];
            // console.log('linha ', linha);

            
            let valorString = linha['valor'].toString();
            //console.log('valorString ', valorString + typeof valorString);
            valorString = valorString.replace(/\./g, "");
            valorString = valorString.replace(/\,/g, ".");
            //console.log('valorString normalizacao', valorString + typeof valorString);
            let valorSemPonto = parseFloat(valorString).toFixed(2);
            if (linha['selecionar'] == 'Compra') {
                valorSemPonto = valorSemPonto * -1;
            }else{
                valorSemPonto = valorSemPonto * 1;
            }
            console.log('valorSemPonto ', valorSemPonto + typeof valorSemPonto);
            soma += valorSemPonto;
            //console.log("soma:  " + soma);
            let selecionar;
            if (linha['selecionar']  == 'Compra') {
                selecionar = '-';
            } else {
                selecionar = '+';
            }

            linhaHTML += '<div class="list-insert" id="list-insert"><div class="list-insert-div"><span class="list-insert--simbolo">' +
                selecionar+ '</span><span class="list-insert--mercadoria">' + linha['mercadoria'] +
                '</span></div><div class="list-insert-div"><span class="list-insert--valor"> R$ ' +
                (linha['valor']) + '</span></div></div>';

        }
        linhaHTML += '</div>';
        document.getElementById("list-todas-divs").innerHTML = linhaHTML;

        console.log(soma);
        const formatarValor = new Intl.NumberFormat({
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
          });


    document.getElementById("list-insert--valor").innerHTML = 'R$ ' + formatarValor.format(soma);
    if (soma > 0) {
        document.getElementById("list-insert--valor-label").innerHTML = '[Lucro]';
    } else if (soma == 0) {
        document.getElementById("list-insert--valor-label").innerHTML = '';
    } else {
        document.getElementById("list-insert--valor-label").innerHTML = '[Prejuízo]';
    }


}
})
    ;
