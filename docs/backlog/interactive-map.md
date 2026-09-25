# Backlog — InteractiveMap

## Resumo

A web part InteractiveMap será usada em uma intranet e exibe um mapa SVG do Brasil com os estados
clicáveis, cada um identificado por sua sigla. As cores do mapa e os links de destino de cada estado
são configuráveis pelo painel de propriedades (o link de cada estado é cadastrado em uma lista de
propriedades). O foco principal é ser responsiva, ajustando-se ao espaço onde for inserida, com boa
aparência visual, e apresentar uma animação de destaque (zoom no estado selecionado) antes de
redirecionar o usuário para o link configurado.

## Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|-----------------|-----------|------------|
| F1 | Mapa SVG do Brasil | Renderizar o mapa do Brasil em SVG com todos os 27 estados/UFs como elementos clicáveis. | Alta |
| F2 | Sigla visível por estado | Cada estado exibe sua sigla (UF) sobreposta ou vinculada à sua região no mapa. | Alta |
| F3 | Cores do mapa configuráveis | Cor base e cor de hover/destaque, globais (aplicadas a todos os estados), controladas via painel de propriedades. | A definir |
| F4 | Cadastro de links por estado (obrigatório) | Lista no painel de propriedades para cadastrar a URL de cada um dos 27 estados. O link é obrigatório para todos os estados; a configuração não deve ser considerada válida com algum estado sem link. | A definir |
| F5 | Layout responsivo | O mapa se ajusta ao espaço (largura/altura) do container onde a web part é inserida. | Alta |
| F6 | Animação de zoom antes do redirecionamento | Ao clicar num estado, uma animação de zoom/ampliação no estado selecionado acontece antes de navegar para o link configurado. | Alta |
| F7 | Acessibilidade por teclado | Foco visível nos estados, navegação via Tab entre estados, ativação via Enter/Espaço disparando o mesmo comportamento do clique (incluindo a animação de zoom em F6). | Alta |

## Dependências

- F2 depende de F1 (precisa dos estados já desenhados para sobrepor/vincular a sigla).
- F3 depende de F1 (precisa dos estados como elementos estilizáveis antes de expor cor via property pane).
- F4 depende de F1 (precisa da lista de estados/UFs definida para gerar os 27 campos do property pane).
- F3 e F4 não dependem entre si — são independentes (estilo vs. dado/navegação) e podem ser desenvolvidas em qualquer ordem ou em paralelo.
- F6 depende de F1 e F4 (a animação e o redirecionamento não fazem sentido sem o link de destino existir; como o link é obrigatório em F4, F6 só é testável de ponta a ponta depois que a validação de F4 estiver funcionando).
- F7 depende de F1 e F6 (a ativação por teclado deve reaproveitar a mesma lógica de disparo — animação + redirecionamento — já implementada em F6, evitando implementar o comportamento duas vezes).
- F5 depende de F1 (o SVG precisa existir para ter o que redimensionar); não depende de F3, F4, F6 ou F7 por ser transversal ao conteúdo interativo, mas faz mais sentido validar depois de F2, já que texto sobreposto (siglas) costuma ser o que mais quebra em telas pequenas.

## Ordem sugerida de desenvolvimento

1. F1 — base de tudo, nenhum outro item existe sem o mapa renderizado.
2. F2 — depende só de F1, fecha a identificação visual dos estados.
3. F3 — depende só de F1, independente de F4; pode ser feita aqui ou em paralelo com F4.
4. F4 — depende só de F1, independente de F3; pode ser feita aqui ou em paralelo com F3.
5. F5 — depende de F1, faz mais sentido validar com F2 (siglas) já implementado.
6. F6 — depende de F1 e F4 (link obrigatório precisa estar funcionando para testar o redirecionamento).
7. F7 — depende de F1 e F6 (reaproveita a lógica de disparo já criada em F6).

## Em aberto

Nenhuma pendência sem resposta — todos os pontos de ambiguidade levantados durante a entrevista foram
resolvidos com o usuário.
