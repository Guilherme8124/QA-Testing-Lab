/* Casos de teste: busca, filtro, edição, execução e exclusão */
(() => {
  const Q=()=>window.QA;
  window.QA.renderCases=()=>{
    const search=(Q().$("#case-search")?.value||"").toLowerCase();
    const filter=Q().$("#case-filter")?.value||"all";
    const list=Q().state.cases.filter(c=>(filter==="all"||c.status===filter)&&[c.id,c.title,c.category].join(" ").toLowerCase().includes(search));
    Q().$("#cases-table").innerHTML=list.map(c=>`<tr><td>${Q().escapeHTML(c.id)}</td><td class="case-title">${Q().escapeHTML(c.title)}</td><td>${Q().escapeHTML(c.category)}</td><td>${Q().badge(c.priority)}</td><td>${Q().badge(c.status)}</td><td>${(c.history||[]).length}</td><td>${Q().formatDate(c.updatedAt)}</td><td><div class="table-actions">${c.status==="Reprovado"?`<button data-newbug="${Q().escapeHTML(c.id)}">+ Bug</button>`:""}<button data-edit="${Q().escapeHTML(c.id)}">Editar</button><button data-delete="${Q().escapeHTML(c.id)}">Excluir</button></div></td></tr>`).join("");
    Q().$("#cases-empty").classList.toggle("hidden",list.length>0);
    Q().$$("[data-edit]",Q().$("#cases-table")).forEach(b=>b.onclick=()=>Q().openCase(Q().state.cases.find(c=>c.id===b.dataset.edit)));
    Q().$$("[data-newbug]",Q().$("#cases-table")).forEach(b=>b.onclick=()=>{const c=Q().state.cases.find(x=>x.id===b.dataset.newbug);Q().openBug(null,{title:"Falha em "+c.id+": "+c.title,caseId:c.id,description:c.title,steps:c.steps,expected:c.expected,actual:c.actual});});
    Q().$$("[data-delete]",Q().$("#cases-table")).forEach(b=>b.onclick=()=>{const n=Q().state.bugs.filter(x=>x.caseId===b.dataset.delete).length;if(confirm(n?`Excluir este caso? ${n} bug(s) vinculado(s) ficarão sem caso relacionado.`:"Excluir este caso de teste?")){Q().state.bugs.forEach(x=>{if(x.caseId===b.dataset.delete)x.caseId="";});Q().state.cases=Q().state.cases.filter(c=>c.id!==b.dataset.delete);Q().refresh();Q().toast("Caso excluído.");}});
  };
  Q().$("#case-search").addEventListener("input",()=>Q().renderCases());
  Q().$("#case-filter").addEventListener("change",()=>Q().renderCases());
})();