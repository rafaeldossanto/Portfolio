# Portfolio

Fonte do meu portfólio pessoal — Rafael Santos, desenvolvedor back-end Java.

Publicado em: https://claude.ai/code/artifact/c52002cf-76d0-4ef4-951d-8053f3d714bd

## O que é

Uma página só, sem dependência externa nenhuma: HTML, CSS e um pouco de JavaScript, tudo dentro de
`index.html`. A foto do topo está embutida como data URI, então o arquivo não depende de nenhum host
para renderizar — basta abrir no navegador.

- Navegação por hash: `#/` (experiência), `#/projetos`, `#/perfil`, `#/stack`
- Vistas de projeto: `#/trisha`, `#/newstech`, `#/faturamento`
- `#/trilha` continua funcionando como apelido de `#/trisha` (nome antigo do projeto)
- Tema claro e escuro por `prefers-color-scheme`, com override via `data-theme`

## Estrutura da página

| rota | conteúdo |
|---|---|
| `#/` | trajetória: Agibank, projetos próprios, transição de carreira |
| `#/projetos` | cards clicáveis, cada um abre a vista detalhada do projeto |
| `#/perfil` | como trabalho, descrito por quem revisa meu código comigo |
| `#/stack` | ferramentas agrupadas por tema |

## Publicando uma atualização

O arquivo é o fonte do artifact: não tem `<!doctype>`, `<html>` nem `<head>`, porque a plataforma
envolve o conteúdo nesse esqueleto na hora de publicar. Abrir direto no navegador funciona mesmo
assim — o browser cria os elementos implícitos.
