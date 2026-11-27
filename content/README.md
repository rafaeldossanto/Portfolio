# Conteúdo do portfólio

Todo o texto dos projetos e da interface mora aqui. O `index.html` e o `assets/content.js` são gerados a partir destes arquivos: **não edite o texto dos projetos direto neles**, porque a próxima geração sobrescreve.

```sh
python scripts/build_site.py          # gera index.html e assets/content.js e exporta dist/
python scripts/build_site.py --check  # só confere se está tudo em dia (o CI roda isso)
```

## Arquivos

| Arquivo | O que guarda |
| --- | --- |
| `site.json` | Ordem dos projetos (`projects`) e textos da interface (`text`: menu, títulos, cartões da página inicial). |
| `projects/<rota>.json` | Um projeto. O nome do arquivo é a rota do site (`wallet.json` → `#/wallet`). |
| `previews/<rota>.svg` | Ilustração do cartão do projeto na listagem. |
| `icons/*.svg` | Ícones usados nos blocos (por exemplo, os pins da Trisha). |

## Português e inglês

Todo texto aceita duas formas:

```json
"title": "Wallet"
"lead": { "pt": "Carteira financeira…", "en": "A personal finance wallet…" }
```

Use a forma simples só quando o texto for igual nos dois idiomas. A geração falha se faltar um dos idiomas, então uma tradução não se perde em silêncio. Os textos aceitam marcação simples dentro da frase: `<b>`, `<i>`, `<code>` e links.

## Tipos de projeto

- `"page": "full"`: página completa (Trisha, Wallet, Storage…). Campos: `title`, `kicker`, `lead`, `links`, `sections`, e opcionalmente `card` (cartão na listagem) e `colophon` (rodapé).
- `"page": "case-study"`: estudo de caso aberto pelos cartões em destaque (NeuronsAI, MiniInfos). Campos: `title`, `summary`, `architecture`, `tags`, `repository`, `website` (opcional) e `sections`, com um bloco por seção.

## Seções e blocos

Cada seção tem `title` e uma lista de `blocks`. Os tipos de bloco são:

| `type` | Uso | Itens |
| --- | --- | --- |
| `note` | Destaque com fundo | `paragraphs`: lista de textos |
| `facts` | Lista de decisões ou fatos | `items`: `{ "title", "text" }` (`title` sai em negrito; opcional) |
| `grid` | Caixas em duas colunas | `items`: `{ "name", "meta", "text" }` (`meta` opcional) |
| `stats` | Números | `items`: `{ "value", "label" }` |
| `repos` | Links para pastas do repositório | `items`: `{ "href", "path", "text" }` (`text` opcional; nos estudos de caso o link sai de `repository`) |
| `muted` | Parágrafo discreto | `html`: texto |
| `package` | Pacote e suas partes | `root`, `meta`, `items`: `{ "name", "text" }` |
| `chips` | Etiquetas | `items`: lista de textos |
| `pins` | Ícone com legenda | `items`: `{ "icon", "label" }` (ícone em `icons/<icon>.svg`) |
| `paragraphs` | Parágrafos simples (estudos de caso) | `items`: `{ "text" }` |

Nos estudos de caso, só valem `paragraphs`, `grid`, `facts` e `repos`.

## Adicionar um projeto

1. Crie `projects/<rota>.json` copiando um projeto parecido.
2. Inclua a rota em `site.json` → `projects.pages` (e em `projects.cards` para aparecer na listagem, com `previews/<rota>.svg`).
3. Rode `python scripts/build_site.py` e `npm test`.

Os cartões em destaque (NeuronsAI, MiniInfos, Wallet) e a página inicial têm desenho próprio no `index.html`; o texto deles vem de `site.json` → `text`.
