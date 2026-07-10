# O que aprendi hoje

## O que é o React Router?

É uma biblioteca que permite ter "páginas" diferentes dentro de um app React, mesmo o app sendo só uma página só (SPA - Single Page Application). Ela troca o que aparece na tela conforme o endereço (URL) muda, sem precisar recarregar o navegador. No nosso caso, é o que vai permitir sair da tela "lista de listas" e entrar na tela de uma lista específica.

## O que é o Dexie?

É uma biblioteca que deixa o IndexedDB mais fácil de usar. Sem ela, mexer com IndexedDB é bem verboso e cheio de código repetitivo. O Dexie dá uma "camada em cima" que parece mais com mexer em arrays e objetos normais do JavaScript.

## O que é o IndexedDB?

É um banco de dados que já vem embutido no navegador, feito pra guardar informação direto no dispositivo do usuário, sem precisar de internet ou de um servidor. É diferente do localStorage: aguenta muito mais dado e é melhor pra guardar informação organizada (no nosso caso, listas e produtos).

## O que é o Vaul?

É uma biblioteca React pra criar "Bottom Sheets" - aquele painel que desliza de baixo pra cima na tela, comum em apps de celular (por exemplo, quando você aperta "adicionar produto" e surge um painel de baixo). Ele já vem com os gestos de arrastar pra fechar e cuidados de acessibilidade prontos.

## O que é uma PWA (Progressive Web App)?

É um site que se comporta como um aplicativo de verdade: pode ser "instalado" na tela inicial do celular, funciona offline e abre em tela cheia, sem a barra de endereço do navegador aparecendo.

## O que é um Service Worker?

É um script que fica rodando em segundo plano no navegador, separado da página em si. É ele quem permite o app funcionar offline: guarda os arquivos do app em cache pra que continuem funcionando mesmo sem internet.
