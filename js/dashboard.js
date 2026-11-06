/* Renderização do dashboard */
(() => {
  const Q=()=>window.QA;
  window.QA.renderDashboard=()=>{
    const s=Q().state,cases=s.cases,bugs=s.bugs;
    const counts={"Aprovado":0,"Reprovado":0,"Bloqueado":0,"Não executado":0};
    cases.forEach(c=>counts[c.status]=(counts[c.status]||0)+1);
    const openBugs=bugs.filter(b=>!Q().CLOSED.includes(b.status));
    Q().$("#stat-total").textContent=cases.length;
    Q().$("#stat-passed").textContent=counts.Aprovado;
    Q().$("#stat-failed").textContent=counts.Reprovado;
    Q().$("#stat-open-bugs").textContent=openBugs.length;
    const total=cases.length,passed=counts.Aprovado,failed=counts.Reprovado,blocked=counts.Bloqueado;
    Q().$("#donut-total").textContent=total;
    Q().$("#legend-passed").textContent=passed;Q().$("#legend-failed").textContent=failed;
    Q().$("#legend-blocked").textContent=blocked;Q().$("#legend-notrun").textContent=counts["Não executado"];
    const deg=n=>total?`${n/total*360}deg`:"0deg";
    const a=passed/Math.max(total,1)*360,b=(passed+failed)/Math.max(total,1)*360,c=(passed+failed+blocked)/Math.max(total,1)*360;
    Q().$("#execution-donut").style.background=total?`conic-gradient(var(--green) 0deg ${a}deg,var(--red) ${a}deg ${b}deg,var(--amber) ${b}deg ${c}deg,#59616d ${c}deg 360deg)`:"conic-gradient(#303640 0deg 360deg)";
    const priorities=["Crítica","Alta","Média","Baixa"];
    Q().$("#priority-summary").innerHTML=priorities.map(p=>{
      const n=openBugs.filter(b=>b.severity===p).length;
      const max=Math.max(1,...priorities.map(x=>openBugs.filter(b=>b.severity===x).length));
      return `<div class="priority-row"><span>${p}</span><div class="priority-track"><div class="priority-fill ${p==="Crítica"?"critical":p==="Alta"?"high":p==="Média"?"medium":"low"}" style="width:${n/max*100}%"></div></div><strong>${n}</strong></div>`;
    }).join("");
    const recent=[...cases].sort((x,y)=>new Date(y.updatedAt)-new Date(x.updatedAt)).slice(0,5);
    Q().$("#recent-cases").innerHTML=recent.length?recent.map(c=>`<tr><td>${Q().escapeHTML(c.id)}</td><td class="case-title">${Q().escapeHTML(c.title)}</td><td>${Q().escapeHTML(c.category)}</td><td>${Q().badge(c.status)}</td><td><button class="text-button" data-edit-case="${Q().escapeHTML(c.id)}">Abrir</button></td></tr>`).join(""):`<tr><td colspan="5">Nenhum caso cadastrado.</td></tr>`;
    Q().$$("[data-edit-case]").forEach(btn=>btn.addEventListener("click",()=>{const item=Q().state.cases.find(x=>x.id===btn.dataset.editCase);Q().openCase(item);}));
  };
})();