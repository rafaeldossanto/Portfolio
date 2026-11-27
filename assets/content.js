// Gerado por scripts/build_site.py a partir de content/. Edite os arquivos em content/.
export const projects = {
  "neurons": {
    "title": "NeuronsAI",
    "tags": [
      "TypeScript",
      "NestJS",
      "React",
      "Electron",
      "PostgreSQL",
      "MCP"
    ],
    "pt": [
      "Orquestrador visual de agentes de IA. O projeto organiza agentes e contexto em grafos e acompanha a execução dos fluxos.",
      "TypeScript de ponta a ponta, com NestJS no servidor e React na interface. Pacotes compartilhados cuidam dos esquemas do grafo, provedores de modelos, protocolo dos runners e servidor MCP."
    ],
    "en": [
      "A visual AI agent orchestrator. The project organizes agents and context in graphs and follows workflow execution.",
      "TypeScript end to end, with NestJS on the server and React on the web. Shared packages cover graph schemas, model providers, the runner protocol and an MCP server."
    ]
  },
  "miniinfos": {
    "title": "MiniInfos",
    "tags": [
      "C#",
      ".NET 10",
      "WPF",
      "Avalonia",
      "xUnit"
    ],
    "pt": [
      "Um painel flutuante para acompanhar ferramentas de IA sem sair do trabalho. Reúne informações de Claude, Codex, Gemini, Kimi e Antigravity, conforme as fontes disponíveis.",
      "Lê registros locais e apresenta consumo, limites e conversas conforme o que cada ferramenta informa. As funções disponíveis variam entre Windows, Linux e macOS."
    ],
    "en": [
      "A floating panel for monitoring AI tools while you work. It brings together information from Claude, Codex, Gemini, Kimi and Antigravity, according to available sources.",
      "It reads local records and presents usage, limits and conversations according to the data each tool provides. Available features vary between Windows, Linux and macOS."
    ]
  }
};

export const caseStudies = {
  "neurons": {
    "repository": "https://github.com/rafaeldossanto/NeuronsAI",
    "pt": [
      {
        "title": "A proposta",
        "kind": "paragraphs",
        "items": [
          [
            "",
            "O NeuronsAI permite desenhar quem pode conversar com quem em uma equipe de agentes. O grafo representa agentes vivos e suas permissões de comunicação, com contexto, papel e acompanhamento da execução."
          ],
          [
            "",
            "A ideia central é dar visibilidade ao trabalho: mensagens, estados, ferramentas e histórico de uma execução ficam ligados ao grafo. A implementação segue em desenvolvimento, com o caminho de agentes de terminal documentado e funcionando."
          ]
        ]
      },
      {
        "title": "Arquitetura",
        "kind": "grid",
        "items": [
          [
            "Modelador em React",
            "A interface usa React, React Flow e xterm.js para o canvas, as conversas e os terminais. O mesmo front é aberto no aplicativo desktop."
          ],
          [
            "Servidor NestJS",
            "NestJS com Fastify expõe REST e WebSocket. O Hub de mensagens, o supervisor de agentes e as guardas mantêm responsabilidades separadas."
          ],
          [
            "Persistência e versões",
            "Drizzle organiza schema e migrations sobre PostgreSQL ou PGlite. A definição do grafo é versionada e cada execução fica vinculada à sua versão."
          ],
          [
            "Runners",
            "Os agentes rodam em um runner embutido no modo local ou em um processo separado no modo híbrido. O servidor usa a mesma interface para os dois caminhos."
          ],
          [
            "Comunicação por MCP",
            "As ferramentas send_message, ask, reply, list_peers e finish conectam a sessão do agente ao Hub. A integração não depende de interpretar visualmente o texto do terminal."
          ],
          [
            "Aplicativo Electron",
            "Servidor e banco PGlite rodam no aplicativo local. O renderer é isolado, sem acesso direto ao Node, e recebe uma ponte de IPC restrita."
          ]
        ]
      },
      {
        "title": "Decisões de engenharia",
        "kind": "list",
        "items": [
          [
            "Uma seta é uma permissão.",
            "O Hub confere se um agente pode iniciar conversa com outro. A mensagem é persistida antes da entrega e o histórico permite acompanhar o que aconteceu."
          ],
          [
            "Agentes continuam vivos.",
            "Uma mensagem recebida durante um turno fica na caixa de entrada. O modelo é de sessões com comunicação, em vez de uma sequência em que cada bloco termina para o próximo começar."
          ],
          [
            "Reconectar sem repetir efeitos.",
            "Pedidos e mensagens têm identificadores. O protocolo reenvia o que não foi confirmado e trata repetições de forma idempotente, sem executar a mesma ação duas vezes."
          ],
          [
            "Um contrato para memória e rede.",
            "O protocolo de runner é versionado e validado com Zod. O canal em memória e o WebSocket passam pelo mesmo codec; versões desconhecidas são recusadas explicitamente."
          ],
          [
            "Limitar conversas que não terminam.",
            "As guardas cobrem quantidade de mensagens, repetição entre agentes, orçamento e tempo de execução. Também existe parada explícita."
          ],
          [
            "Login do agente fica no runner.",
            "O servidor não guarda a autenticação de assinatura da CLI. Runners separados usam tokens próprios, revogáveis, armazenados como hash no servidor."
          ]
        ]
      },
      {
        "title": "Desktop, dados e segurança",
        "kind": "list",
        "items": [
          [
            "Banco embutido sem uma segunda instalação.",
            "PGlite permite usar o mesmo modelo PostgreSQL no aplicativo. O modo com PostgreSQL externo continua disponível para desenvolvimento e integração."
          ],
          [
            "Isolamento da janela.",
            "O Electron usa contextIsolation e sandbox, sem nodeIntegration no renderer. Navegação e pedidos fora da origem local são controlados."
          ],
          [
            "Segredos protegidos pelo sistema.",
            "O aplicativo usa safeStorage para proteger a chave mestra local e desabilita esse armazenamento quando o sistema não oferece a proteção esperada."
          ],
          [
            "Estado do projeto explícito.",
            "O runtime de agentes por API, contas multiusuário e a infraestrutura na AWS aparecem como etapas do plano. Não são apresentados aqui como funcionalidades já entregues."
          ]
        ]
      },
      {
        "title": "Qualidade e distribuição",
        "kind": "list",
        "items": [
          [
            "Cliente e contratos tipados.",
            "O monorepo compartilha esquemas em Zod. O cliente da API é gerado a partir do OpenAPI, reduzindo divergências entre servidor e interface."
          ],
          [
            "Teste de aceitação do aplicativo.",
            "O smoke abre o app real com dados isolados, verifica a ponte da janela, publica um projeto com agentes, grava uma nota pela integração e confere a liberação da trava ao encerrar."
          ],
          [
            "Builds para os três sistemas.",
            "O pipeline gera instaladores Windows, macOS e Linux, com checksums e release em rascunho. Assinatura e notarização têm uma etapa própria no plano."
          ],
          [
            "Atualização com diferenças por plataforma.",
            "Windows e AppImage têm o caminho de atualização automática documentado. macOS sem assinatura e pacotes deb direcionam para baixar a nova versão."
          ]
        ]
      },
      {
        "title": "Dentro do código",
        "kind": "paths",
        "items": [
          [
            "apps/server/",
            "API, Hub, supervisor, persistência e integração com runners."
          ],
          [
            "apps/web/",
            "Modelador, conversas e terminais."
          ],
          [
            "apps/desktop/",
            "Aplicativo Electron, isolamento, build e atualização."
          ],
          [
            "packages/runner-protocol/",
            "Frames, validação, versionamento e canais de comunicação."
          ],
          [
            "packages/runner/",
            "Hospedagem dos agentes e conexão do runner ao servidor."
          ],
          [
            "packages/mcp-neurons/",
            "Servidor MCP de comunicação dos agentes."
          ]
        ]
      }
    ],
    "en": [
      {
        "title": "The idea",
        "kind": "paragraphs",
        "items": [
          [
            "",
            "NeuronsAI lets you draw who can talk to whom in a team of agents. The graph represents live agents and their communication permissions, with context, roles and execution tracking."
          ],
          [
            "",
            "The central goal is visibility: messages, states, tools and execution history stay connected to the graph. Development is ongoing, with the terminal agent path documented and working."
          ]
        ]
      },
      {
        "title": "Architecture",
        "kind": "grid",
        "items": [
          [
            "React modeler",
            "The interface uses React, React Flow and xterm.js for the canvas, conversations and terminals. The same front end opens inside the desktop app."
          ],
          [
            "NestJS server",
            "NestJS with Fastify exposes REST and WebSocket. The message Hub, agent supervisor and execution guards have separate responsibilities."
          ],
          [
            "Persistence and versions",
            "Drizzle manages schemas and migrations on PostgreSQL or PGlite. Graph definitions are versioned and each execution stays tied to its version."
          ],
          [
            "Runners",
            "Agents run inside an embedded local runner or a separate hybrid process. The server uses the same interface for both paths."
          ],
          [
            "MCP communication",
            "The send_message, ask, reply, list_peers and finish tools connect an agent session to the Hub without visually scraping terminal text."
          ],
          [
            "Electron application",
            "The local application hosts the server and PGlite database. Its renderer is isolated, without direct Node access, and receives a restricted IPC bridge."
          ]
        ]
      },
      {
        "title": "Engineering decisions",
        "kind": "list",
        "items": [
          [
            "An edge is a permission.",
            "The Hub checks whether an agent may initiate a conversation. Messages are persisted before delivery and remain available in execution history."
          ],
          [
            "Agents stay alive.",
            "Messages arriving during a turn wait in an inbox. This is a session communication model rather than a sequence in which each block exits before the next starts."
          ],
          [
            "Reconnect without repeating effects.",
            "Requests and messages have identifiers. The protocol resends unconfirmed work and handles repeats idempotently."
          ],
          [
            "One contract for memory and network.",
            "The runner protocol is versioned and validated with Zod. In-memory and WebSocket channels share a codec; unsupported versions are explicitly rejected."
          ],
          [
            "Bound conversations.",
            "Guards cover message counts, repeated exchanges, budget and execution time. Explicit stop is also available."
          ],
          [
            "Agent login stays on the runner.",
            "The server does not store CLI subscription credentials. Separate runners use revocable tokens stored as hashes on the server."
          ]
        ]
      },
      {
        "title": "Desktop, data and security",
        "kind": "list",
        "items": [
          [
            "Embedded storage without another installation.",
            "PGlite supports the PostgreSQL model inside the app. External PostgreSQL remains available for development and integration."
          ],
          [
            "Window isolation.",
            "Electron uses contextIsolation and sandboxing without renderer nodeIntegration. Requests and navigation beyond the local origin are controlled."
          ],
          [
            "System protected secrets.",
            "The app uses safeStorage to protect its local master key and disables this storage when the system cannot provide the expected protection."
          ],
          [
            "An explicit project stage.",
            "API agent runtimes, multiuser accounts and AWS infrastructure appear as planned stages, rather than being presented here as completed features."
          ]
        ]
      },
      {
        "title": "Quality and distribution",
        "kind": "list",
        "items": [
          [
            "Typed clients and contracts.",
            "The monorepo shares Zod schemas. The API client is generated from OpenAPI to reduce interface and server drift."
          ],
          [
            "Application acceptance test.",
            "The smoke test opens the real app with isolated data, checks the window bridge, publishes an agent project, writes a note through the integration and checks lock release on exit."
          ],
          [
            "Builds for three operating systems.",
            "The pipeline generates Windows, macOS and Linux installers with checksums and a draft release. Signing and notarization have a dedicated planned stage."
          ],
          [
            "Platform aware updates.",
            "Windows and AppImage have documented automatic updates. Unsigned macOS builds and deb packages direct users to download the next version."
          ]
        ]
      },
      {
        "title": "Inside the code",
        "kind": "paths",
        "items": [
          [
            "apps/server/",
            "API, Hub, supervisor, persistence and runner integration."
          ],
          [
            "apps/web/",
            "Modeler, conversations and terminals."
          ],
          [
            "apps/desktop/",
            "Electron app, isolation, builds and updates."
          ],
          [
            "packages/runner-protocol/",
            "Frames, validation, versioning and communication channels."
          ],
          [
            "packages/runner/",
            "Agent hosting and runner connections."
          ],
          [
            "packages/mcp-neurons/",
            "Agent communication MCP server."
          ]
        ]
      }
    ]
  },
  "miniinfos": {
    "repository": "https://github.com/rafaeldossanto/MiniInfos",
    "website": "https://miniinfos.com",
    "pt": [
      {
        "title": "O que o aplicativo resolve",
        "kind": "paragraphs",
        "items": [
          [
            "",
            "Quem alterna entre ferramentas de IA acaba com limites, sessões e contagens espalhados em vários aplicativos. O MiniInfos reúne essas informações em um painel flutuante que acompanha o trabalho, com páginas para Claude, Codex, Gemini, Kimi e Antigravity."
          ],
          [
            "",
            "A interface permite uma ferramenta por vez, visualização dividida ou cartões em janelas separadas. Posição, tamanho, seleção de páginas, tema e idioma são preservados. O cartão de conversas do Windows organiza as sessões recentes por ferramenta e projeto."
          ]
        ]
      },
      {
        "title": "Arquitetura",
        "kind": "grid",
        "items": [
          [
            "Windows: WPF e .NET 10",
            "O aplicativo em widget/ cuida da interface, integração com a bandeja, acompanhamento de janelas e ciclo de vida dos cartões."
          ],
          [
            "Linux e macOS: Avalonia",
            "A interface nativa compila os mesmos leitores, ledgers, preferências e regras do Windows. As integrações específicas ficam separadas por sistema."
          ],
          [
            "Provedores intercambiáveis",
            "Cada ferramenta implementa IUsageProvider e devolve uma UsagePage. O PageView apresenta o resultado sem depender do formato original de cada histórico."
          ],
          [
            "Descoberta de fontes",
            "Sources/ mantém um catálogo de pastas. A descoberta considera instalações, variáveis de ambiente e caminhos reconhecidos, com limites de profundidade e tempo."
          ],
          [
            "Persistência incremental",
            "JsonlTail lê apenas os trechos acrescentados aos registros. LedgerStore persiste o livro de contagens e ResponseLedger compartilha a deduplicação entre provedores."
          ],
          [
            "Integração com as ferramentas",
            "O mod do Claude publica limites e contexto disponíveis. O Codex consulta o app-server local; o Antigravity combina metadados locais com a leitura das cotas do próprio agente."
          ]
        ]
      },
      {
        "title": "Decisões de engenharia",
        "kind": "list",
        "items": [
          [
            "Contar cada resposta uma vez.",
            "A deduplicação evita somar cópias da mesma resposta, inclusive na leitura do Claude. Os acumulados do Codex têm um ledger próprio, adequado ao formato por sessão."
          ],
          [
            "Preservar o que já foi lido.",
            "O ledger mantém as contagens mesmo quando históricos antigos são removidos. Arquivos apagados antes da primeira leitura não podem ser reconstruídos."
          ],
          [
            "Separar tokens de limites da conta.",
            "Um percentual de plano não vira um custo fictício. Cada página mostra somente as medidas que a fonte realmente disponibiliza."
          ],
          [
            "Ler Windows e WSL sem duplicar.",
            "O Claude pode ser acompanhado nas distribuições WSL em execução, usando o mesmo ledger e a mesma deduplicação. Uma falha no WSL não interrompe a leitura do Windows."
          ],
          [
            "Compartilhar domínio entre interfaces.",
            "WPF e Avalonia usam as mesmas fontes dos domínios portáveis. A leitura de arquivos, validação de pacotes e persistência não são reimplementadas em cada interface."
          ]
        ]
      },
      {
        "title": "Privacidade e comunidade",
        "kind": "list",
        "items": [
          [
            "Metadados em vez do texto dos chats.",
            "O app extrai contagens, horários, contexto e identificação de projeto; não armazena nem apresenta o conteúdo das conversas. Não pede um novo login para acompanhar os registros locais."
          ],
          [
            "Consultas de conta separadas da leitura local.",
            "Limites do Codex vêm do app-server autenticado que já existe na máquina. As cotas do Antigravity são consultadas no serviço local do agente."
          ],
          [
            "Pacotes declarativos.",
            "Temas e mascotes usam contratos versionados com JSON e PNG. O aplicativo não executa scripts nem XAML fornecidos por pacotes da comunidade."
          ],
          [
            "Catálogo sem servidor próprio.",
            "O índice fica em uma release específica do GitHub. Prévias são baixadas sob demanda; pacotes completos só chegam quando o usuário escolhe instalar ou atualizar, com verificação de SHA-256."
          ]
        ]
      },
      {
        "title": "Qualidade e distribuição",
        "kind": "list",
        "items": [
          [
            "Testes por domínio.",
            "A lógica usa xUnit. O executor seleciona os domínios afetados e os consumidores reais; cenários visuais focados conferem a interface com dados simulados."
          ],
          [
            "Interfaces nativas verificadas separadamente.",
            "O projeto Avalonia tem testes próprios, smoke de interface e validações de empacotamento para Linux e macOS. Compilação cruzada não é tratada como prova de execução nativa."
          ],
          [
            "Atualizações verificadas.",
            "O atualizador consulta releases, baixa o instalador e confere o hash antes de executar a atualização. O catálogo da comunidade tem um ciclo de publicação separado do aplicativo."
          ],
          [
            "Personalização sem chamadas de IA.",
            "Temas, fontes, idioma e mascotes são configurações locais. As animações dos mascotes usam as leituras já coletadas pelo aplicativo."
          ]
        ]
      },
      {
        "title": "Dentro do código",
        "kind": "paths",
        "items": [
          [
            "widget/Providers/",
            "Contratos, modelos e implementações de cada ferramenta."
          ],
          [
            "widget/Infrastructure/Storage/",
            "Leitura incremental, ledgers e acesso defensivo aos arquivos."
          ],
          [
            "widget/Community/",
            "Contratos, biblioteca e catálogo de temas e mascotes."
          ],
          [
            "widget/Mascot/",
            "Estados, anatomia, gestos, animação e coordenação dos mascotes."
          ],
          [
            "desktop/",
            "Interface Avalonia, integração nativa e empacotamento."
          ],
          [
            "tests/",
            "Testes de domínio, verificações visuais e suporte compartilhado."
          ]
        ]
      }
    ],
    "en": [
      {
        "title": "The problem it solves",
        "kind": "paragraphs",
        "items": [
          [
            "",
            "Switching between AI tools leaves limits, sessions and usage figures spread across several apps. MiniInfos brings them together in a floating panel with pages for Claude, Codex, Gemini, Kimi and Antigravity."
          ],
          [
            "",
            "The interface supports one tool at a time, a split view or separate card windows. Position, size, selected pages, theme and language are saved. The Windows conversations panel groups recent sessions by tool and project."
          ]
        ]
      },
      {
        "title": "Architecture",
        "kind": "grid",
        "items": [
          [
            "Windows: WPF and .NET 10",
            "The widget/ application owns the interface, tray integration, window tracking and card lifecycle."
          ],
          [
            "Linux and macOS: Avalonia",
            "The native interface compiles the same readers, ledgers, preferences and rules as Windows. Platform integrations are kept separate."
          ],
          [
            "Interchangeable providers",
            "Each tool implements IUsageProvider and returns a UsagePage. PageView displays the result without depending on the source log format."
          ],
          [
            "Source discovery",
            "Sources/ maintains a directory catalog. Discovery considers installations, environment variables and recognized paths, with depth and time limits."
          ],
          [
            "Incremental persistence",
            "JsonlTail reads only newly appended records. LedgerStore persists counts and ResponseLedger shares deduplication across providers."
          ],
          [
            "Tool integrations",
            "The Claude mod publishes available limits and context. Codex uses its local app-server; Antigravity combines local metadata with quota readings from the agent itself."
          ]
        ]
      },
      {
        "title": "Engineering decisions",
        "kind": "list",
        "items": [
          [
            "Count each response once.",
            "Deduplication prevents copies of the same response from being added twice, including Claude records. Codex has a separate ledger for session totals."
          ],
          [
            "Keep previously read usage.",
            "The ledger preserves counts after old histories are removed. Files deleted before their first reading cannot be reconstructed."
          ],
          [
            "Separate tokens from account limits.",
            "A plan percentage does not become an invented cost. Each page shows only measurements available from its source."
          ],
          [
            "Read Windows and WSL without duplicates.",
            "Claude histories from running WSL distributions use the same ledger and deduplication. A WSL failure does not interrupt Windows readings."
          ],
          [
            "Share domain code across interfaces.",
            "WPF and Avalonia compile the same portable domains. File reading, package validation and persistence are not reimplemented per interface."
          ]
        ]
      },
      {
        "title": "Privacy and community",
        "kind": "list",
        "items": [
          [
            "Metadata rather than chat text.",
            "The app extracts counts, timestamps, context and project identification. It does not store or display conversation content or require a new login to read local histories."
          ],
          [
            "Account queries stay separate.",
            "Codex limits come from the already authenticated app-server on the machine. Antigravity quotas come from the local agent service."
          ],
          [
            "Declarative packages.",
            "Themes and pets use versioned JSON and PNG contracts. The app does not execute scripts or XAML from community packages."
          ],
          [
            "A catalog without a dedicated server.",
            "Its index lives in a specific GitHub release. Previews load on demand; full packages download only after an install or update action and are checked with SHA-256."
          ]
        ]
      },
      {
        "title": "Quality and distribution",
        "kind": "list",
        "items": [
          [
            "Tests by domain.",
            "Domain logic uses xUnit. The runner selects affected domains and their real consumers; focused visual scenarios check the interface with simulated data."
          ],
          [
            "Separate native verification.",
            "The Avalonia project has its own tests, UI smoke checks and packaging checks for Linux and macOS. Cross compilation is not treated as proof of native execution."
          ],
          [
            "Verified updates.",
            "The updater checks releases, downloads the installer and verifies its hash before running an update. The community catalog has a separate publication cycle."
          ],
          [
            "Customization without AI calls.",
            "Themes, fonts, language and pets are local settings. Pet animations use readings the app already collects."
          ]
        ]
      },
      {
        "title": "Inside the code",
        "kind": "paths",
        "items": [
          [
            "widget/Providers/",
            "Contracts, models and tool implementations."
          ],
          [
            "widget/Infrastructure/Storage/",
            "Incremental reads, ledgers and defensive file access."
          ],
          [
            "widget/Community/",
            "Package contracts, library and community catalog."
          ],
          [
            "widget/Mascot/",
            "States, anatomy, gestures, animation and pet coordination."
          ],
          [
            "desktop/",
            "Avalonia interface, native integrations and packaging."
          ],
          [
            "tests/",
            "Domain tests, visual checks and shared test support."
          ]
        ]
      }
    ]
  }
};

export const projectRoutes = {
  "neurons": "neuronsai",
  "miniinfos": "miniinfos",
  "trisha": "trisha",
  "wallet": "wallet",
  "storage": "storage",
  "tlt": "tlt",
  "newstech": "newstech",
  "faturamento": "faturamento"
};

export const text = {
  "pt": {
    "experience": "Experiência",
    "projects": "Projetos",
    "profile": "Perfil",
    "contact": "Contato",
    "contactNav": "Contato ↗",
    "personalPortfolio": "Portfólio pessoal",
    "role": "Desenvolvedor backend",
    "viewProjects": "Ver projetos ↘",
    "homeRole": "Desenvolvedor backend · Engenheiro de IA",
    "homeIntro": "Desenvolvo sistemas, APIs e aplicações com IA. Aqui compartilho os projetos que construo, minha experiência e as decisões por trás do código.",
    "homeExpertise": "Java · Spring Boot · Sistemas distribuídos · Agentes de IA",
    "exploreProjects": "Explorar projetos ↗",
    "aboutMe": "Sobre mim",
    "workingOn": "No que estou trabalhando",
    "allProjects": "Ver todos os projetos ↗",
    "homeNeurons": "Orquestração visual de agentes de IA.",
    "homeMiniinfos": "Suas ferramentas de IA em um painel desktop.",
    "previewGraph": "Grafo de exemplo",
    "previewApi": "AGENTE · API",
    "previewPlanner": "Planejador",
    "previewContext": "Contexto compartilhado",
    "previewTerminal": "TERMINAL",
    "previewExecutor": "Executor",
    "previewTool": "FERRAMENTA",
    "previewMemory": "Memória",
    "previewWindow": "Janela 5h",
    "previewWeek": "Semanal",
    "previewToday": "Tokens hoje",
    "previewDemo": "Demonstração",
    "shortcutProjects": "01 Projetos ↗",
    "shortcutProjectsCopy": "Arquitetura, decisões e código",
    "shortcutExperience": "02 Experiência ↗",
    "shortcutExperienceCopy": "Minha trajetória profissional",
    "shortcutProfile": "03 Perfil ↗",
    "shortcutProfileCopy": "Como trabalho e o que estudo",
    "location": "Engenheiro de IA",
    "expertise": "Java · Spring Boot · Sistemas distribuídos",
    "projectsTitle": "Projetos",
    "projectsSubtitle": "O que construí e o que estou desenvolvendo.",
    "projectsHint": "Abra um projeto para ver arquitetura, decisões técnicas e código.",
    "profileTitle": "Como trabalho",
    "back": "← Todos os projetos",
    "inside": "Por dentro do projeto",
    "neuronCopy": "Um espaço visual para conectar agentes de IA, organizar o contexto e orquestrar sua execução.",
    "miniCopy": "Consumo, limites e conversas das suas ferramentas de IA em um painel flutuante.",
    "walletCopy": "Contas, cartões e investimentos de diferentes bancos reunidos no mesmo app.",
    "neuronsCategory": "01 / Inteligência artificial",
    "miniCategory": "02 / Aplicativo desktop",
    "walletCategory": "03 / Open Finance",
    "inDevelopment": "Em desenvolvimento",
    "neuronTagline": "Cada agente tem um papel. Você vê o todo.",
    "miniTagline": "Suas IAs, mais perto.",
    "walletTagline": "Uma visão das suas finanças.",
    "aiTools": "Ferramentas de IA",
    "input": "Entrada",
    "context": "Contexto",
    "orchestration": "Orquestração",
    "agents": "Agentes",
    "output": "Saída",
    "execution": "Execução",
    "theme": "Alternar tema",
    "language": "Switch to English",
    "openMenu": "Abrir menu",
    "closeMenu": "Fechar menu",
    "skip": "Pular para o conteúdo"
  },
  "en": {
    "experience": "Experience",
    "projects": "Projects",
    "profile": "Profile",
    "contact": "Contact",
    "contactNav": "Contact ↗",
    "personalPortfolio": "Personal portfolio",
    "role": "Backend developer",
    "viewProjects": "View projects ↘",
    "homeRole": "Backend developer · AI Engineer",
    "homeIntro": "I build systems, APIs and AI applications. Here I share the projects I work on, my experience and the decisions behind the code.",
    "homeExpertise": "Java · Spring Boot · Distributed systems · AI agents",
    "exploreProjects": "Explore projects ↗",
    "aboutMe": "About me",
    "workingOn": "What I am working on",
    "allProjects": "View all projects ↗",
    "homeNeurons": "Visual orchestration of AI agents.",
    "homeMiniinfos": "Your AI tools in a desktop panel.",
    "previewGraph": "Example graph",
    "previewApi": "AGENT · API",
    "previewPlanner": "Planner",
    "previewContext": "Shared context",
    "previewTerminal": "TERMINAL",
    "previewExecutor": "Executor",
    "previewTool": "TOOL",
    "previewMemory": "Memory",
    "previewWindow": "5h window",
    "previewWeek": "Weekly",
    "previewToday": "Tokens today",
    "previewDemo": "Demo",
    "shortcutProjects": "01 Projects ↗",
    "shortcutProjectsCopy": "Architecture, decisions and code",
    "shortcutExperience": "02 Experience ↗",
    "shortcutExperienceCopy": "My professional background",
    "shortcutProfile": "03 Profile ↗",
    "shortcutProfileCopy": "How I work and what I study",
    "location": "AI Engineer",
    "expertise": "Java · Spring Boot · Distributed systems",
    "projectsTitle": "Projects",
    "projectsSubtitle": "What I have built and what I am working on.",
    "projectsHint": "Open a project for its architecture, technical decisions and code.",
    "profileTitle": "How I work",
    "back": "← All projects",
    "inside": "Inside the project",
    "neuronCopy": "A visual space to connect AI agents, organize context and orchestrate execution.",
    "miniCopy": "Usage, limits and conversations from your AI tools in a floating panel.",
    "walletCopy": "Accounts, cards and investments from different banks together in one app.",
    "neuronsCategory": "01 / Artificial intelligence",
    "miniCategory": "02 / Desktop application",
    "walletCategory": "03 / Open Finance",
    "inDevelopment": "In development",
    "neuronTagline": "Every agent has a role. You see the whole picture.",
    "miniTagline": "Your AI tools, closer.",
    "walletTagline": "A view of your finances.",
    "aiTools": "AI tools",
    "input": "Input",
    "context": "Context",
    "orchestration": "Orchestration",
    "agents": "Agents",
    "output": "Output",
    "execution": "Execution",
    "theme": "Change theme",
    "language": "Mudar para português",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "skip": "Skip to content"
  }
};
