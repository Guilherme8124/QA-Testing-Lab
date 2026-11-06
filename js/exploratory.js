/* Sessões de teste exploratório */
(() => {
  const Q=()=>window.QA;
  window.QA.renderSessions=()=>{
    const list=Q().state.sessions;
    Q().$("#sessions-list").innerHTML=list.map(s=>`<article class="session-card"><div class="panel-heading"><span class="subtle-tag">${Q().escapeHTML(s.id)}</span><div class="table-actions"><button data-session-edit="${Q().escapeHTML(s.id)}">Editar</button><button data-session-delete="${Q().escapeHTML(s.id)}">Excluir</button></div></div><h3>${Q().escapeHTML(s.title)}</h3><p>${Q().escapeHTML(s.charter)}</p><div class="session-meta"><span>⌕ ${Q().escapeHTML(s.target)}</span><span>◷ ${Q().escapeHTML(s.duration)}</span><span>${Q().formatDate(s.createdAt)}</span></div><div class="session-observations"><strong>Anotações</strong><p>${Q().escapeHTML(s.notes).replace(/\n/g,"<br>")}</p><strong>Descobertas</strong><p>${Q().escapeHTML(s.findings||"Nenhuma descoberta registrada.").replace(/\n/g,"<br>")}</p></div></article>`).join("");
    Q().$("#sessions-empty").classList.toggle("hidden",list.length>0);
    Q().$$("[data-session-edit]").forEach(b=>b.onclick=()=>Q().openSession(Q().state.sessions.find(s=>s.id===b.dataset.sessionEdit)));
    Q().$$("[data-session-delete]").forEach(b=>b.onclick=()=>{if(confirm("Excluir esta sessão?")){Q().state.sessions=Q().state.sessions.filter(s=>s.id!==b.dataset.sessionDelete);Q().refresh();Q().toast("Sessão excluída.");}});
  };
})();