# ColectionWebpartsSPFx

## Resumo

Solução SharePoint Framework (SPFx) com web parts em React e TypeScript.

## Web parts

| Web part | Descrição | Documentação |
| --- | --- | --- |
| InteractiveMap | Mapa interativo do Brasil (SVG), com os 27 estados como regiões clicáveis | [README](src/webparts/interactiveMap/README.md) |

## Versão do SharePoint Framework

![version](https://img.shields.io/badge/version-1.23.2-green.svg)

## Aplica-se a

- [SharePoint Framework](https://aka.ms/spfx)
- [Tenant Microsoft 365](https://learn.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Pré-requisitos

- Node.js 22 LTS (`>=22.14 <23`)
- `heft trust-dev-cert` executado uma vez na máquina de desenvolvimento
- Variável de ambiente `SPFX_SERVE_TENANT_DOMAIN` apontando para o site de testes (ex.: `<tenant>.sharepoint.com/sites/<site>`)

## Solução

| Solução               | Autor(es)          |
| ---------------------- | ------------------ |
| ColectionWebpartsSPFx  | jorgeilya@gmail.com |

## Histórico de versões

| Versão | Data       | Comentário                                                     |
| ------ | ---------- | --------------------------------------------------------------- |
| 0.1.0  | 2026-09-25 | Scaffold inicial da solução e da web part InteractiveMap (placeholder, sem funcionalidade própria ainda) |
| 0.1.0  | 2026-09-25 | InteractiveMap: primeiras funcionalidades entregues — ver [histórico da web part](src/webparts/interactiveMap/README.md#histórico-de-versões) |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clonar o repositório
- Na raiz da solução, no terminal:
  - `npm install`
  - `heft trust-dev-cert` (uma vez por máquina)
  - `npm run start`
- Abrir uma página real do site de dev com:
  ```
  ?debugManifestsFile=https://localhost:4321/temp/build/manifests.js&debug=true&noredir=true
  ```
  (o workbench hospedado `/_layouts/workbench.aspx` está descontinuado)

## Referências

- [Como começar com o SharePoint Framework](https://learn.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Compatibilidade de versões do SPFx](https://learn.microsoft.com/sharepoint/dev/spfx/compatibility)
- [Toolchain Heft](https://learn.microsoft.com/sharepoint/dev/spfx/toolchain/sharepoint-framework-toolchain-rushstack-heft)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp)
