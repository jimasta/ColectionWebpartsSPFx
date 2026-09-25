# InteractiveMap

Web part de mapa interativo do Brasil (SVG), com os 27 estados como regiões clicáveis. Pensada para uso em intranet: cada estado tem sua sigla, cor configurável e um link de destino cadastrado no painel de propriedades. Ao clicar em um estado, uma animação de zoom antecede o redirecionamento.

## Status

| Item | Funcionalidade | Status |
|----|-----------------|--------|
| F1 | Mapa SVG do Brasil | ✅ Feito |
| — | Título e subtítulo opcionais acima do mapa (fora do backlog original, incluído junto ao F1) | ✅ Feito |
| F2 | Sigla visível por estado | ⬜ Não iniciado |
| F3 | Cores do mapa configuráveis | ⬜ Não iniciado |
| F4 | Cadastro de link obrigatório por estado | ⬜ Não iniciado |
| F5 | Layout responsivo | ⬜ Não iniciado |
| F6 | Animação de zoom antes do redirecionamento | ⬜ Não iniciado |
| F7 | Acessibilidade por teclado | ⬜ Não iniciado |

## Backlog

### Resumo

A web part InteractiveMap será usada em uma intranet e exibe um mapa SVG do Brasil com os estados
clicáveis, cada um identificado por sua sigla. As cores do mapa e os links de destino de cada estado
são configuráveis pelo painel de propriedades (o link de cada estado é cadastrado em uma lista de
propriedades). O foco principal é ser responsiva, ajustando-se ao espaço onde for inserida, com boa
aparência visual, e apresentar uma animação de destaque (zoom no estado selecionado) antes de
redirecionar o usuário para o link configurado.

### Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|-----------------|-----------|------------|
| F1 | Mapa SVG do Brasil | Renderizar o mapa do Brasil em SVG com todos os 27 estados/UFs como elementos clicáveis. | Alta |
| F2 | Sigla visível por estado | Cada estado exibe sua sigla (UF) sobreposta ou vinculada à sua região no mapa. | Alta |
| F3 | Cores do mapa configuráveis | Cor base e cor de hover/destaque, globais (aplicadas a todos os estados), controladas via painel de propriedades. | A definir |
| F4 | Cadastro de links por estado (obrigatório) | Lista no painel de propriedades para cadastrar a URL de cada um dos 27 estados. O link é obrigatório para todos os estados; a configuração não deve ser considerada válida com algum estado sem link. | A definir |
| F5 | Layout responsivo | O mapa se ajusta ao espaço (largura/altura) do container onde a web part é inserida. | Alta |
| F6 | Animação de zoom antes do redirecionamento | Ao clicar num estado, uma animação de zoom/ampliação no estado selecionado acontece antes de navegar para o link configurado. | Alta |
| F7 | Acessibilidade por teclado | Foco visível nos estados, navegação via Tab entre estados, ativação via Enter/Espaço disparando o mesmo comportamento do clique (incluindo a animação de zoom em F6). | Alta |

### Dependências

- F2 depende de F1 (precisa dos estados já desenhados para sobrepor/vincular a sigla).
- F3 depende de F1 (precisa dos estados como elementos estilizáveis antes de expor cor via property pane).
- F4 depende de F1 (precisa da lista de estados/UFs definida para gerar os 27 campos do property pane).
- F3 e F4 não dependem entre si — são independentes (estilo vs. dado/navegação) e podem ser desenvolvidas em qualquer ordem ou em paralelo.
- F6 depende de F1 e F4 (a animação e o redirecionamento não fazem sentido sem o link de destino existir; como o link é obrigatório em F4, F6 só é testável de ponta a ponta depois que a validação de F4 estiver funcionando).
- F7 depende de F1 e F6 (a ativação por teclado deve reaproveitar a mesma lógica de disparo — animação + redirecionamento — já implementada em F6, evitando implementar o comportamento duas vezes).
- F5 depende de F1 (o SVG precisa existir para ter o que redimensionar); não depende de F3, F4, F6 ou F7 por ser transversal ao conteúdo interativo, mas faz mais sentido validar depois de F2, já que texto sobreposto (siglas) costuma ser o que mais quebra em telas pequenas.

### Ordem sugerida de desenvolvimento

1. F1 — base de tudo, nenhum outro item existe sem o mapa renderizado.
2. F2 — depende só de F1, fecha a identificação visual dos estados.
3. F3 — depende só de F1, independente de F4; pode ser feita aqui ou em paralelo com F4.
4. F4 — depende só de F1, independente de F3; pode ser feita aqui ou em paralelo com F3.
5. F5 — depende de F1, faz mais sentido validar com F2 (siglas) já implementado.
6. F6 — depende de F1 e F4 (link obrigatório precisa estar funcionando para testar o redirecionamento).
7. F7 — depende de F1 e F6 (reaproveita a lógica de disparo já criada em F6).

## Propriedades (painel de propriedades)

| Propriedade | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| Título | Texto | Não | Exibido acima do mapa. Fica oculto se vazio. |
| Subtítulo | Texto | Não | Exibido abaixo do título. Fica oculto se vazio. |

Propriedades de F3 (cores) e F4 (links por estado) serão adicionadas aqui quando implementadas.

## Estrutura de código

```
InteractiveMapWebPart.ts        # classe da web part, property pane
components/
  InteractiveMap.tsx            # componente React que renderiza o mapa
  InteractiveMap.module.scss    # estilos (cores do tema)
  IInteractiveMapProps.ts       # props do componente
  data/BrazilMapData.ts         # geometria dos 27 estados (extraída de um SVG MapSVG)
loc/                             # textos de interface (en-us, pt-br)
```

O modelo `IBrazilState` (uf, name, path) fica em `src/models/`, fora da pasta da web part, para poder ser reaproveitado por serviços/hooks futuros (ex.: opções do property pane em F4).

## Como usar

1. Adicionar a web part InteractiveMap a uma página.
2. No painel de propriedades, preencher Título/Subtítulo (opcional).
3. Demais configurações (cores, links por estado) ficarão disponíveis conforme F3/F4 forem implementados.

## Histórico de versões

| Versão | Data       | Comentário |
| ------ | ---------- | --------- |
| 0.1.0  | 2026-09-25 | Scaffold inicial (placeholder do Yeoman, sem funcionalidade própria) |
| 0.1.0  | 2026-09-25 | F1: mapa SVG do Brasil renderizado com os 27 estados como regiões clicáveis |
| 0.1.0  | 2026-09-25 | Título e subtítulo opcionais acima do mapa, configuráveis via property pane |

## Referências

- Backlog original (entrevista de descoberta): `docs/backlog/interactive-map.md` — arquivo local, de uso pessoal, não versionado (a seção "Backlog" acima é a cópia mantida no repositório).
- [MapSVG — formato do mapa SVG de origem](http://mapsvg.com)
