/* QA Testing Lab — estado, navegação, persistência e formulários */
(() => {
  const STORAGE_KEY = "qa-testing-lab-v1";
  const demoData = {
    cases: [
      {id:"TC-001",title:"Login com credenciais válidas",category:"Autenticação",priority:"Alta",status:"Aprovado",preconditions:"Usuário cadastrado e ativo.",steps:"1. Acessar a tela de login.\n2. Informar e-mail e senha válidos.\n3. Clicar em Entrar.",expected:"O usuário deve acessar a área autenticada.",actual:"O usuário acessou a área autenticada.",updatedAt:new Date().toISOString()},
      {id:"TC-002",title:"Login com senha incorreta",category:"Autenticação",priority:"Alta",status:"Reprovado",preconditions:"Usuário cadastrado.",steps:"1. Acessar a tela de login.\n2. Informar e-mail válido e senha incorreta.\n3. Clicar em Entrar.",expected:"O sistema deve informar que as credenciais são inválidas.",actual:"A tela ficou carregando sem apresentar mensagem.",updatedAt:new Date().toISOString()},
      {id:"TC-003",title:"Validar campos obrigatórios do cadastro",category:"Cadastro",priority:"Média",status:"Não executado",preconditions:"Página de cadastro disponível.",steps:"1. Abrir o formulário.\n2. Deixar os campos vazios.\n3. Clicar em Cadastrar.",expected:"O sistema deve indicar os campos obrigatórios.",actual:"",updatedAt:new Date().toISOString()},
      {id:"TC-004",title:"Recuperação de senha com e-mail cadastrado",category:"Autenticação",priority:"Média",status:"Bloqueado",preconditions:"Serviço de e-mail de teste indisponível.",steps:"1. Abrir Recuperar senha.\n2. Informar e-mail cadastrado.\n3. Solicitar recuperação.",expected:"O sistema deve confirmar o envio das instruções.",actual:"Execução bloqueada pela indisponibilidade do serviço de e-mail.",updatedAt:new Date().toISOString()}
    ],
    bugs: [
      {id:"BUG-001",title:"Tela permanece carregando após login inválido",severity:"Alta",priority:"Alta",status:"Aberto",environment:"Chrome / Windows 11",description:"Ao informar uma senha incorreta, a interface permanece no estado de carregamento.",steps:"1. Abrir a tela de login.\n2. Informar e-mail válido e senha incorreta.\n3. Clicar em Entrar.",expected:"Exibir mensagem de credenciais inválidas e encerrar o carregamento.",actual:"Indicador de carregamento permanece ativo.",createdAt:new Date().toISOString(),caseId:"TC-002"}
    ],
    sessions: [
      {id:"EXP-001",title:"Exploração do fluxo de autenticação",target:"Tela de login e recuperação de senha",charter:"Investigar o comportamento da autenticação com entradas válidas, inválidas e campos vazios.",duration:"30 minutos",notes:"Login válido funcionou. Login inválido deixou o indicador de carregamento ativo. Recuperação de senha não foi concluída porque o serviço de e-mail de teste estava indisponível.",findings:"Possível defeito no estado de carregamento após falha de autenticação.",createdAt:new Date().toISOString()}
    ]
  };
  const CLOSED=["Resolvido","Fechado","Duplicado","Não reproduzível"];
  const clone = value => JSON.parse(JSON.stringify(value));
  let state,lastFocus;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    state = saved && Array.isArray(saved.cases) && Array.isArray(saved.bugs) && Array.isArray(saved.sessions) ? saved : clone(demoData);
  } catch { state = clone(demoData); }
  const persist = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { if(!persist.warned){persist.warned=true;setTimeout(()=>toast("Não foi possível salvar neste navegador. Exporte um backup."),0);} } };
  const $ = (selector, parent=document) => parent.querySelector(selector);
  const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const formatDate = value => value ? new Date(value).toLocaleDateString("pt-BR") : "—";
  const nextId = (prefix, list) => `${prefix}-${String(Math.max(0,...list.map(x=>Number((String(x.id||"").match(/\d+$/)||[0])[0])))+1).padStart(3,"0")}`;
  const toast = message => {
    const node=document.createElement("div"); node.className="toast"; node.textContent=message;
    $("#toast-region").append(node); setTimeout(()=>node.remove(),3000);
  };
  const badge = value => {
    const map={"Aprovado":"passed","Reprovado":"failed","Bloqueado":"blocked","Não executado":"notrun","Aberto":"aberto","Em andamento":"andamento","Resolvido":"resolvido","Fechado":"fechado","Alta":"high","Crítica":"critica","Média":"medium","Baixa":"low"};
    return `<span class="badge badge-${map[value]||"notrun"}">${escapeHTML(value)}</span>`;
  };
  const navigate = view => {
    $$(".view").forEach(el=>el.classList.toggle("active",el.id===`view-${view}`));
    $$(".nav-item[data-view]").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
    const labels={dashboard:"Dashboard",cases:"Casos de teste",bugs:"Bugs",exploratory:"Testes exploratórios",reports:"Relatórios"};
    $("#breadcrumb-current").textContent=labels[view]||"Dashboard";
    $("#sidebar").classList.remove("open");
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const refresh = () => {
    persist();
    window.QA.renderDashboard();
    window.QA.renderCases();
    window.QA.renderBugs();
    window.QA.renderSessions();
    window.QA.renderReports();
    $("#nav-case-count").textContent=state.cases.length;
    $("#nav-bug-count").textContent=state.bugs.filter(b=>!CLOSED.includes(b.status)).length;
  };

  const openModal = (title, fields, onSave, submitLabel="Salvar registro") => {
    lastFocus=document.activeElement;
    $("#modal-title").textContent=title;
    $("#save-modal").textContent=submitLabel;
    $("#modal-fields").innerHTML=fields.map(f=>{
      const value=f.value??"";
      let control;
      if(f.type==="textarea") control=`<textarea id="${f.name}" ${f.required?"required":""} placeholder="${escapeHTML(f.placeholder||"")}">${escapeHTML(value)}</textarea>`;
      else if(f.type==="select") control=`<select id="${f.name}" ${f.required?"required":""}>${f.options.map(o=>`<option ${o===value?"selected":""} value="${escapeHTML(o)}">${escapeHTML(o)}</option>`).join("")}</select>`;
      else control=`<input id="${f.name}" type="${f.type||"text"}" value="${escapeHTML(value)}" ${f.required?"required":""} placeholder="${escapeHTML(f.placeholder||"")}">`;
      return `<div class="field ${f.full?"full":""}"><label for="${f.name}">${escapeHTML(f.label)}${f.required?" *":""}</label>${control}${f.help?`<small>${escapeHTML(f.help)}</small>`:""}</div>`;
    }).join("");
    $("#modal-backdrop").classList.remove("hidden");
    $("#modal-form").onsubmit=e=>{
      e.preventDefault();
      const data={}; fields.forEach(f=>data[f.name]=$("#"+f.name).value.trim());
      onSave(data);
      closeModal();
    };
    setTimeout(()=>$("#modal-fields input, #modal-fields textarea, #modal-fields select")?.focus(),50);
  };
  const closeModal = () => {$("#modal-backdrop").classList.add("hidden");$("#modal-form").onsubmit=null;lastFocus?.focus?.();};
  const caseFields = item => [
    {name:"title",label:"Nome do caso de teste",value:item?.title,required:true,full:true},
    {name:"category",label:"Funcionalidade / categoria",value:item?.category||"Geral",required:true},
    {name:"priority",label:"Prioridade",type:"select",options:["Baixa","Média","Alta"],value:item?.priority||"Média"},
    {name:"type",label:"Tipo de teste",type:"select",options:["Funcional","Smoke","Regressão","Usabilidade","Exploratório"],value:item?.type||"Funcional"},
    {name:"requirement",label:"Requisito relacionado",value:item?.requirement,placeholder:"Ex.: RF-01"},
    {name:"preconditions",label:"Pré-condições",type:"textarea",value:item?.preconditions,full:true},
    {name:"steps",label:"Passos para execução",type:"textarea",value:item?.steps,required:true,full:true,help:"Descreva uma ação por linha."},
    {name:"expected",label:"Resultado esperado",type:"textarea",value:item?.expected,required:true,full:true},
    {name:"actual",label:"Resultado obtido",type:"textarea",value:item?.actual,full:true},
    {name:"status",label:"Resultado da execução",type:"select",options:["Não executado","Aprovado","Reprovado","Bloqueado"],value:item?.status||"Não executado"}
  ];
  const saveCase = (data,item) => {
    const now=new Date().toISOString();
    const run=(c,prev)=>{ if(c.status!=="Não executado"&&prev!==c.status)(c.history=c.history||[]).push({date:now,status:c.status,actual:c.actual}); };
    if(item){const prev=item.status;Object.assign(item,data,{updatedAt:now});run(item,prev);}
    else{const c={id:nextId("TC",state.cases),...data,updatedAt:now,history:[]};run(c,"Não executado");state.cases.unshift(c);}
    refresh();toast(item?"Caso de teste atualizado.":"Caso de teste criado.");
  };
  const openCase = item => openModal(item?"Editar caso de teste":"Novo caso de teste",caseFields(item),data=>saveCase(data,item));
  const bugFields = item => [
    {name:"title",label:"Título do defeito",value:item?.title,required:true,full:true},
    {name:"severity",label:"Severidade",type:"select",options:["Baixa","Média","Alta","Crítica"],value:item?.severity||"Média"},
    {name:"priority",label:"Prioridade",type:"select",options:["Baixa","Média","Alta"],value:item?.priority||"Média"},
    {name:"environment",label:"Ambiente",value:item?.environment||"Chrome / Windows",full:true},
    {name:"caseId",label:"Caso relacionado (opcional)",value:item?.caseId,placeholder:"Ex.: TC-001"},
    {name:"status",label:"Status",type:"select",options:["Aberto","Em andamento","Resolvido","Fechado","Duplicado","Não reproduzível"],value:item?.status||"Aberto"},
    {name:"version",label:"Versão / build",value:item?.version,placeholder:"Ex.: 1.4.2"},
    {name:"description",label:"Descrição",type:"textarea",value:item?.description,required:true,full:true},
    {name:"steps",label:"Passos para reprodução",type:"textarea",value:item?.steps,required:true,full:true},
    {name:"expected",label:"Resultado esperado",type:"textarea",value:item?.expected,required:true,full:true},
    {name:"actual",label:"Resultado atual",type:"textarea",value:item?.actual,required:true,full:true}
  ];
  const saveBug = (data,item) => {
    data.caseId=(data.caseId||"").toUpperCase();
    if(data.caseId&&!state.cases.some(c=>c.id===data.caseId)) toast("Atenção: o caso "+data.caseId+" não existe.");
    const now=new Date().toISOString();
    if(item) Object.assign(item,data,{updatedAt:now});
    else state.bugs.unshift({id:nextId("BUG",state.bugs),...data,createdAt:now,updatedAt:now});
    refresh();toast(item?"Bug atualizado.":"Bug registrado.");
  };
  const openBug = (item,prefill) => openModal(item?"Editar bug":"Registrar bug",bugFields(item||prefill),data=>saveBug(data,item));
  const sessionFields = item => [
    {name:"title",label:"Nome da sessão",value:item?.title,required:true,full:true},
    {name:"target",label:"Área / funcionalidade explorada",value:item?.target,required:true,full:true},
    {name:"charter",label:"Missão / objetivo",type:"textarea",value:item?.charter,required:true,full:true},
    {name:"duration",label:"Duração",value:item?.duration||"30 minutos"},
    {name:"notes",label:"Anotações e ações realizadas",type:"textarea",value:item?.notes,required:true,full:true},
    {name:"findings",label:"Descobertas / dúvidas / possíveis bugs",type:"textarea",value:item?.findings,full:true}
  ];
  const saveSession = (data,item) => {
    if(item) Object.assign(item,data);
    else state.sessions.unshift({id:nextId("EXP",state.sessions),...data,createdAt:new Date().toISOString()});
    refresh();toast(item?"Sessão atualizada.":"Sessão exploratória registrada.");
  };
  const openSession = item => openModal(item?"Editar sessão":"Nova sessão exploratória",sessionFields(item),data=>saveSession(data,item));
  const exportJSON = () => {
    const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
    downloadBlob(blob,"qa-testing-lab-backup.json");
    toast("Backup JSON exportado.");
  };
  const downloadBlob = (blob,name) => {
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
  };
  const importJSON = file => {
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const data=JSON.parse(reader.result);
        if(!Array.isArray(data.cases)||!Array.isArray(data.bugs)||!Array.isArray(data.sessions)) throw new Error();
        const ok=l=>l.every(x=>x&&typeof x.id==="string"&&typeof x.title==="string");
        if(!ok(data.cases)||!ok(data.bugs)||!ok(data.sessions)) throw new Error();
        if(!confirm("Importar este backup? Os dados atuais serão substituídos.")) return;
        state={cases:data.cases,bugs:data.bugs,sessions:data.sessions};refresh();toast("Backup importado com sucesso.");
      }catch{toast("Arquivo inválido. Use um backup JSON do QA Testing Lab.");}
    };
    reader.readAsText(file);
  };

  window.QA={CLOSED,get state(){return state;},$, $$, escapeHTML,formatDate,badge,toast,navigate,refresh,openModal,closeModal,openCase,openBug,openSession,downloadBlob};
  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view]");if(nav){navigate(nav.dataset.view);return;}
    const action=e.target.closest("[data-action]")?.dataset.action;
    if(action==="new-case")openCase();if(action==="new-bug")openBug();if(action==="new-session")openSession();
    const jump=e.target.closest("[data-navigate]");if(jump)navigate(jump.dataset.navigate);
  });
  document.addEventListener("keydown",e=>{
    if($("#modal-backdrop").classList.contains("hidden"))return;
    if(e.key==="Escape"){closeModal();return;}
    if(e.key!=="Tab")return;
    const f=$$("#modal-form input,#modal-form select,#modal-form textarea,#modal-form button,#close-modal");
    const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  });
  $("#close-modal").addEventListener("click",closeModal);$("#cancel-modal").addEventListener("click",closeModal);
  $("#modal-backdrop").addEventListener("click",e=>{if(e.target.id==="modal-backdrop")closeModal();});
  $("#mobile-menu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $("#export-data").addEventListener("click",exportJSON);
  $("#import-data").addEventListener("click",()=>$("#import-file").click());
  $("#import-file").addEventListener("change",e=>{if(e.target.files[0])importJSON(e.target.files[0]);e.target.value="";});
  $("#reset-demo").addEventListener("click",()=>{if(confirm("Restaurar os dados de demonstração? Os dados atuais serão substituídos.")){state=clone(demoData);refresh();toast("Dados de demonstração restaurados.");}});
  $$(".nav-item>span,.stat-icon,.empty-state>span,.search-box>span,.brand-mark").forEach(n=>n.setAttribute("aria-hidden","true"));
})();