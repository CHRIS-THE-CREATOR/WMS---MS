const API = '/api/planos';

const form = document.getElementById('plano-form');
const listaEl = document.getElementById('planos-lista');
const idInput = document.getElementById('plano-id');
const cancelarBtn = document.getElementById('cancelar-btn');
const formTitulo = document.getElementById('form-titulo');

const campos = ['o_que', 'por_que', 'onde', 'quando', 'quem', 'como', 'status'];

const statusLabel = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído'
};

async function carregarPlanos() {
  const res = await fetch(API);
  const planos = await res.json();
  renderizarPlanos(planos);
}

function renderizarPlanos(planos) {
  if (planos.length === 0) {
    listaEl.innerHTML = '<p class="vazio">Nenhum plano cadastrado ainda.</p>';
    return;
  }

  listaEl.innerHTML = planos.map(p => `
    <div class="card" data-id="${p.id}">
      <span class="badge ${p.status}">${statusLabel[p.status] || p.status}</span>
      <h3>${escapeHtml(p.o_que)}</h3>
      ${p.por_que ? `<div class="linha"><b>Por quê:</b> ${escapeHtml(p.por_que)}</div>` : ''}
      <div class="linha"><b>Onde:</b> ${escapeHtml(p.onde || '-')} &nbsp; <b>Quando:</b> ${escapeHtml(p.quando || '-')}</div>
      <div class="linha"><b>Quem:</b> ${escapeHtml(p.quem || '-')}</div>
      ${p.como ? `<div class="linha"><b>Como:</b> ${escapeHtml(p.como)}</div>` : ''}
      <div class="card-acoes">
        <button class="editar">Editar</button>
        <button class="excluir">Excluir</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {};
  campos.forEach(c => dados[c] = document.getElementById(c).value);

  const id = idInput.value;
  const url = id ? `${API}/${id}` : API;
  const metodo = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  if (!res.ok) {
    const erro = await res.json();
    alert(erro.erro || 'Erro ao salvar o plano.');
    return;
  }

  resetarForm();
  carregarPlanos();
});

listaEl.addEventListener('click', async (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.dataset.id;

  if (e.target.classList.contains('excluir')) {
    if (!confirm('Excluir este plano?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    carregarPlanos();
  }

  if (e.target.classList.contains('editar')) {
    const res = await fetch(`${API}/${id}`);
    const plano = await res.json();
    campos.forEach(c => document.getElementById(c).value = plano[c] || '');
    idInput.value = plano.id;
    formTitulo.textContent = 'Editar plano';
    cancelarBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

cancelarBtn.addEventListener('click', resetarForm);

function resetarForm() {
  form.reset();
  idInput.value = '';
  formTitulo.textContent = 'Novo plano';
  cancelarBtn.hidden = true;
}

carregarPlanos();
