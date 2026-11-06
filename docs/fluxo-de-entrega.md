# Fluxo de entrega

`dev → hom → main`

- `dev`: desenvolvimento e integração das mudanças.
- `hom`: versão para validação visual em um ambiente privado na AWS.
- `main`: versão pública, atualmente publicada pelo GitHub Pages.

## Promover para homologação

Abra um pull request com origem em `dev` e destino em `hom`. O check obrigatório `ci` agrega validação do HTML e JavaScript, testes de navegação e layout no Chromium e geração do site estático. Todos precisam terminar com sucesso. Não há aprovação de revisão obrigatória.

Passar nos checks libera o merge; não faz merge automático. Depois que a integração com a AWS for configurada, a atualização de `hom` deverá publicar o ambiente de homologação.

## Promover para produção

Após conferir a homologação, abra um pull request de `hom` para `main`. A decisão de publicar continua sendo do responsável pelo portfólio. O GitHub Pages acompanha `main`.

## AWS e Cloudflare

A conta AWS, a hospedagem privada de `hom`, seu controle de acesso e o DNS no Cloudflare serão configurados manualmente pelo proprietário. A criação das branches não cria recursos na AWS nem configura o domínio.

O ambiente de homologação deve exigir autenticação antes de exibir o site. Para um site estático no Amplify Hosting, o controle de acesso por branch permite definir usuário e senha exclusivos para `hom`.

## Executar as verificações

Requer Node.js 24 e Python 3.10 ou posterior.

```sh
npm ci
npm run check
npx playwright install chromium
npm test
npm run build
```

A pasta `dist/` contém o site estático para hospedagem. Os testes não dependem de credenciais nem fazem consultas aos links externos.
