# QA Testing Lab

**Plataforma de gerenciamento, documentação e execução de testes de software.**

O QA Testing Lab é um projeto desenvolvido para praticar, organizar e demonstrar conhecimentos de Quality Assurance (QA), incluindo testes funcionais, gerenciamento de casos de teste, registro de defeitos, testes exploratórios, banco de dados e automação.

O objetivo é evoluir de um laboratório local de testes para uma plataforma web de QA, com persistência em banco de dados, autenticação e recursos profissionais de gerenciamento da qualidade de software.

## 1. Funcionalidades implementadas — v1.1

### Dashboard
- Indicadores de casos de teste.
- Resumo de resultados.
- Indicadores de bugs.
- Visualização de informações do laboratório.

### Casos de teste
- Cadastro de casos de teste.
- Edição e exclusão.
- Pesquisa e filtros.
- Histórico de execuções.
- Associação com tipos de teste e requisitos.
- Registro de resultados.
- Botão de criação de bug a partir de um caso reprovado.

### Gerenciamento de bugs
- Registro e acompanhamento de defeitos.
- Classificação por severidade e prioridade.
- Registro de ambiente.
- Passos para reprodução.
- Associação com casos de teste.
- Controle de status, incluindo Duplicado e Não reproduzível.
- Registro de versão/build.

### Testes exploratórios
- Registro de sessões exploratórias.
- Documentação das atividades.
- Histórico das sessões.

### Relatórios e backup
- Exportação de relatórios CSV.
- Backup dos dados em JSON.
- Restauração de backups com validação.

### Interface e acessibilidade
- Layout responsivo.
- Tema escuro.
- Modais acessíveis.
- Navegação por teclado.
- Melhorias de contraste e identificação dos campos.

## 2. Tecnologias

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Estilização e responsividade |
| JavaScript | Lógica e funcionalidades |
| LocalStorage | Persistência local |
| File API | Importação e exportação de arquivos |
| Playwright | Testes automatizados |
| Supabase | Banco de dados e autenticação em evolução |
| PostgreSQL | Banco de dados relacional |
| Netlify | Hospedagem |

## 3. Arquitetura e evolução

A versão 1.1 utiliza JavaScript puro e armazenamento local por meio do LocalStorage.

A arquitetura está sendo evoluída para utilizar Supabase como backend, permitindo:

- Persistência online.
- Sincronização de dados entre dispositivos.
- Autenticação de usuários.
- Controle de acesso.
- Armazenamento de evidências.
- Gerenciamento de projetos.

**Importante:** a integração com Supabase está em desenvolvimento. A leitura da tabela `test_cases` já foi validada, mas a gravação ainda depende da configuração correta das colunas e das políticas de segurança RLS.

## 4. Estrutura do projeto

```text
qa-testing-lab/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── dashboard.js
    ├── test-cases.js
    ├── bugs.js
    ├── exploratory.js
    └── reports.js
```

A estrutura poderá ser ampliada conforme a implementação dos novos módulos.

## 5. Como executar

### Execução local

1. Clone ou baixe o repositório.
2. Abra a pasta no VS Code.
3. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server.
4. Utilize as funcionalidades disponíveis.

A versão local não exige configuração de backend.

### Testes automatizados

Para executar os testes com Playwright:

```bash
npm install
npx playwright install chromium
npm test
```

A execução depende dos arquivos de configuração e testes existentes no repositório.

## 6. Banco de dados e segurança

A evolução para Supabase utiliza PostgreSQL como banco de dados.

A arquitetura prevê:

- Supabase Auth para autenticação.
- Row Level Security (RLS) para controle de acesso.
- Políticas específicas para operações de leitura e escrita.
- Supabase Storage para evidências.
- Relacionamentos entre projetos, casos de teste, execuções e bugs.

As políticas de segurança devem garantir que cada usuário acesse somente os dados autorizados.

Nenhuma chave privada ou `service_role` deve ser exposta no frontend.

## 7. Próximas funcionalidades planejadas

### Gerenciamento de projetos
- Cadastro e edição de projetos.
- Organização de suítes de teste.
- Associação de casos a projetos.
- Controle de versões.

### Autenticação e usuários
- Cadastro de usuários.
- Login e logout.
- Recuperação de senha.
- Perfil de usuário.
- Controle de permissões.

### Execução e documentação
- Histórico detalhado de execuções.
- Ciclos de teste.
- Registro de resultados.
- Evidências associadas às execuções.

### Evidências
- Upload de screenshots.
- Armazenamento de arquivos.
- Associação de evidências a bugs e casos de teste.

### Testes de API
- Requisições HTTP.
- Métodos GET, POST, PUT, PATCH e DELETE.
- Validação de status HTTP.
- Análise de respostas JSON.
- Organização de coleções.

### Relatórios
- Indicadores por projeto.
- Taxa de aprovação.
- Relatórios de defeitos.
- Exportação em PDF e XLSX.

### Automação
- Integração com Playwright.
- Testes automatizados de interface.
- Validação de fluxos críticos.
- Execução de testes de regressão.

### Assistente de QA
- Sugestão de cenários de teste.
- Geração assistida de casos de teste.
- Sugestão de cenários negativos.
- Apoio na documentação de defeitos.

Esses recursos são planejados e não devem ser considerados implementados até que estejam desenvolvidos e testados.

## 8. Publicação

A versão estática pode ser publicada na Netlify.

Opções:

- Netlify Drop.
- Integração com GitHub.
- Deploy automático a partir do repositório.

Site de demonstração:

https://kaleidoscopic-banoffee-295940.netlify.app/

Para a versão com Supabase, será necessário configurar as credenciais públicas, URLs de autenticação, políticas RLS e demais configurações do backend.

## 9. Limitações conhecidas

- A versão 1.1 utiliza armazenamento local.
- Os dados do LocalStorage não são sincronizados entre dispositivos.
- O upload persistente de evidências ainda está planejado.
- A autenticação ainda precisa ser implementada.
- A gravação no Supabase ainda está em fase de correção.
- O sistema documenta e organiza testes, mas não executa automaticamente testes na aplicação avaliada.
- Recursos planejados não representam funcionalidades já disponíveis.

Os dados fictícios de demonstração devem ser substituídos por resultados reais antes de serem utilizados como evidência de experiência profissional.

## 10. Objetivo de aprendizado

O projeto também funciona como laboratório prático para desenvolver conhecimentos em:

- Quality Assurance.
- Testes funcionais.
- Testes exploratórios.
- Planejamento e documentação de testes.
- Análise e registro de defeitos.
- SQL e PostgreSQL.
- Testes de API.
- JavaScript.
- Automação com Playwright.
- Controle de versão com Git e GitHub.
- Segurança e persistência de dados.

## 11. Autor

**Guilherme Lima Vieira**

Estudante de Técnico em Desenvolvimento de Sistemas — IFMA.

Projeto desenvolvido com foco em aprendizado prático, desenvolvimento de habilidades em QA e construção de portfólio profissional.

---

**QA Testing Lab — Qualidade se constrói com testes, evidências e melhoria contínua.**