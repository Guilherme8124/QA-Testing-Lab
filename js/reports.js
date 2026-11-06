/* Indicadores e exportação CSV */
(() => {
  const Q=()=>window.QA;
  const cell=v=>{let s=String(v??"").replace(/\r?\n/g," / ");if(/^[=+\-@\t]/.test(s))s="'"+s;return `"${s.replace(/"/g,'""')}"`;};
  window.QA.renderReports=()=>{
    const s=Q().state,c=s.cases,b=s.bugs,done=c.filter(x=>["Aprovado","Reprovado"].includes(x.status)),passed=c.filter(x=>x.status==="Aprovado").length;
    const rate=done.length?Math.round(passed/done.length*100):0;
    const open=b.filter(x=>!Q().CLOSED.includes(x.status));
    Q().$("#report-pass-rate").textContent=rate+"%";
    Q().$("#report-bugs").textContent=b.length;
    Q().$("#report-sessions").textContent=s.sessions.length;
    Q().$("#report-blocked").textContent=c.filter(x=>x.status==="Bloqueado").length;
    Q().$("#report-summary").innerHTML=[
      ["Casos cadastrados",c.length],["Execuções concluídas",done.length],["Taxa de aprovação",rate+"%"],["Bugs em aberto",open.length],
      ["Execuções registradas no histórico",c.reduce((n,x)=>n+(x.history||[]).length,0)],["Bugs críticos em aberto",open.filter(x=>x.severity==="Crítica").length]
    ].map(([l,v])=>`<div class="summary-item"><span>${l}</span><strong>${v}</strong></div>`).join("");
  };
  Q().$("#download-report").addEventListener("click",()=>{
    const d=Q().formatDate,rows=[["Tipo","ID","Título","Categoria/Severidade","Prioridade","Status","Data","Passos","Esperado","Obtido/Atual","Extras"]];
    Q().state.cases.forEach(c=>rows.push(["Caso de teste",c.id,c.title,c.category,c.priority,c.status,d(c.updatedAt),c.steps,c.expected,c.actual,`Tipo: ${c.type||""} | Requisito: ${c.requirement||""} | Execuções: ${(c.history||[]).length}`]));
    Q().state.bugs.forEach(b=>rows.push(["Bug",b.id,b.title,b.severity,b.priority,b.status,d(b.createdAt),b.steps,b.expected,b.actual,`Ambiente: ${b.environment||""} | Versão: ${b.version||""} | Caso: ${b.caseId||""}`]));
    Q().state.sessions.forEach(x=>rows.push(["Exploratório",x.id,x.title,x.target,"","",d(x.createdAt),x.charter,"",x.notes,`Duração: ${x.duration||""} | Descobertas: ${x.findings||""}`]));
    const csv="\uFEFF"+rows.map(r=>r.map(cell).join(";")).join("\n");
    Q().downloadBlob(new Blob([csv],{type:"text/csv;charset=utf-8;"}),"qa-testing-lab-relatorio.csv");
    Q().toast("Relatório CSV exportado.");
  });
})();
