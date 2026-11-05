# Portfólio de Rafael Santos

Portfólio pessoal com projetos, experiência profissional, perfil e stack. Site estático em HTML, CSS e JavaScript, com navegação por hash, português e inglês e temas claro e escuro.

## Estrutura

- `index.html`: apresentação, seções e conteúdo completo dos projetos existentes.
- `assets/style.css`: sistema visual editorial e layout responsivo.
- `assets/portfolio.js`: navegação, preferências e estudos de caso do MiniInfos e do NeuronsAI.
- `assets/rafael-santos.jpg`: retrato usado na apresentação.
- `404.html`: página para endereços não encontrados.
- `scripts/`: validação e exportação dos arquivos públicos.
- `tests/`: testes de navegação, conteúdo e responsividade no Chromium.

## Navegação

| Rota | Conteúdo |
| --- | --- |
| `#/` ou `#/projetos` | Apresentação e projetos |
| `#/experiencia` | Trajetória profissional |
| `#/perfil` | Como trabalho |
| `#/stack` | Tecnologias agrupadas por área |
| `#/neuronsai`, `#/miniinfos` | Estudos de caso dos projetos novos |
| `#/trisha`, `#/wallet`, `#/storage`, `#/tlt`, `#/newstech`, `#/faturamento` | Projetos e decisões técnicas |

Os links antigos `#/trilha` e `#/exp` continuam funcionando. O navegador permite voltar e avançar entre as páginas. Preferências de idioma e tema ficam salvas localmente; nenhum serviço do chat é necessário para o site funcionar.

## Executar e validar

Requer Node.js 24 e Python 3.10 ou posterior.

```sh
npm ci
npm run check
npx playwright install chromium
npm test
npm run build
python -m http.server 4173 --bind 127.0.0.1
```

A exportação fica em `dist/`, com HTML, CSS, JavaScript e imagens. O único recurso visual externo é a fonte Manrope, carregada pelo Google Fonts, com alternativa local do navegador.

## Entrega

O fluxo é `dev → hom → main`. A `hom` exige o check `ci` aprovado, sem revisão obrigatória. A configuração de hospedagem privada na AWS e do domínio no Cloudflare é manual. Consulte [o fluxo de entrega](docs/fluxo-de-entrega.md).
