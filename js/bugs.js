/* Registro e acompanhamento de bugs */
(() => {
  const Q=()=>window.QA;
  window.QA.renderBugs=()=>{
    const search=(Q().$("#bug-search")?.value||"").toLowerCase(),filter=Q().$("#bug-filter")?.value||"all";
    const list=Q().state.bugs.filter(b=>(filter==="all"||b.status===filter)&&[b.id,b.title,b.description].join(" ").toLowerCase().includes(search));
    Q().$("#bugs-table").innerHTML=list.map(b=>`<tr><td>${Q().escapeHTML(b.id)}</td><td class="case-title">${Q().escapeHTML(b.title)}${b.caseId?` <small class="gold">${Q().escapeHTML(b.caseId)}</small>`:""}</td><td>${Q().badge(b.severity)}</td><td>${Q().badge(b.priority)}</td><td>${Q().badge(b.status)}</td><td>${Q().formatDate(b.createdAt)}</td><td><div class="table-actions"><button data-bug-edit="${Q().escapeHTML(b.id)}">Editar</button><button data-bug-delete="${Q().escapeHTML(b.id)}">Excluir</button></div></td></tr>`).join("");
    Q().$("#bugs-empty").classList.toggle("hidden",list.length>0);
    Q().$$("[data-bug-edit]",Q().$("#bugs-table")).forEach(btn=>btn.onclick=()=>Q().openBug(Q().state.bugs.find(b=>b.id===btn.dataset.bugEdit)));
    Q().$$("[data-bug-delete]",Q().$("#bugs-table")).forEach(btn=>btn.onclick=()=>{if(confirm("Excluir este bug?")){Q().state.bugs=Q().state.bugs.filter(b=>b.id!==btn.dataset.bugDelete);Q().refresh();Q().toast("Bug excluído.");}});
  };
  Q().$("#bug-search").addEventListener("input",()=>Q().renderBugs());
  Q().$("#bug-filter").addEventListener("change",()=>Q().renderBugs());
})();