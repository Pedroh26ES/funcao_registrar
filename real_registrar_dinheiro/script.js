const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const xData = document.querySelector('#data');
const xCategoria = document.querySelector('#categoria');
const xSaldo = document.querySelector('#saldo');
const btnSalvar = document.querySelector('#btnSalvar');

let itens;
let id;
let itemToDeleteIndex = -1;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        xData.value = itens[index].data;
        xCategoria.value = itens[index].categoria;
        xSaldo.value = itens[index].saldo;
        id = index;
    } else {
        xData.value = '';
        xCategoria.value = '';
        xSaldo.value = '';
    }
}

function editItem(index) {
    openModal(true, index);
}

function showConfirmModal(index) {
    itemToDeleteIndex = index;
    document.querySelector('.confirm-modal-container').classList.add('active');
}

function hideConfirmModal() {
    document.querySelector('.confirm-modal-container').classList.remove('active');
}

function confirmDelete() {
    if (itemToDeleteIndex !== -1) {
        itens.splice(itemToDeleteIndex, 1);
        setItensBD();
        loadItens();
        itemToDeleteIndex = -1;
    }
    hideConfirmModal();
}

function insertItem(item, index) {
    let tr = document.createElement('tr');
    const saldoClass = item.saldo < 0 ? 'saldo-retirado' : 'saldo-adicionado';

    tr.innerHTML = `
        <td>${item.data}</td>
        <td>${item.categoria}</td>
        <td class="${saldoClass}">R$ ${parseFloat(item.saldo).toFixed(2)}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
        </td>
        <td class="acao">
            <button onclick="showConfirmModal(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

function updateTotals() {
    const totalPositivo = itens.filter(item => parseFloat(item.saldo) > 0)
        .reduce((acc, item) => acc + parseFloat(item.saldo), 0);
    const totalNegativo = itens.filter(item => parseFloat(item.saldo) < 0)
        .reduce((acc, item) => acc + parseFloat(item.saldo), 0);
    const saldoTotal = totalPositivo + totalNegativo;

    document.getElementById('totalPositivo').innerText = `R$ ${totalPositivo.toFixed(2)}`;
    document.getElementById('totalNegativo').innerText = `R$ ${totalNegativo.toFixed(2)}`;
    document.getElementById('saldoTotal').innerText = `R$ ${saldoTotal.toFixed(2)}`;
}

btnSalvar.onclick = e => {
    if (xData.value == '' || xCategoria.value == '' || xSaldo.value == '') {
        return;
    }

    e.preventDefault();

    if (id !== undefined) {
        itens[id].data = xData.value;
        itens[id].categoria = xCategoria.value;
        itens[id].saldo = xSaldo.value;
    } else {
        itens.push({ 'data': xData.value, 'categoria': xCategoria.value, 'saldo': xSaldo.value });
    }

    setItensBD();
    modal.classList.remove('active');
    loadItens();
    id = undefined;
}

function loadItens() {
    itens = getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
    updateTotals(); // Atualiza os totais após carregar os itens
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

// Registro inicial
if (getItensBD().length === 0) {
    const novoRegistro1 = {
        data: "2001-01-20",
        categoria: "Automóvel",
        saldo: "275.98",
    };
    const novoRegistro2 = {
        data: "2001-02-15",
        categoria: "Alimentação",
        saldo: "-150.00",
    };
    const novoRegistro3 = {
        data: "2001-03-10",
        categoria: "Transporte",
        saldo: "100.00",
    };
    itens = [novoRegistro1, novoRegistro2, novoRegistro3];
    setItensBD();
}

loadItens();

document.getElementById('confirmYes').addEventListener('click', confirmDelete);
document.getElementById('confirmNo').addEventListener('click', hideConfirmModal);
