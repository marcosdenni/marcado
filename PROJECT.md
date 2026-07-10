# Marcado

## Objetivo

Criar um Progressive Web App moderno para gerenciamento de listas de compras.

O aplicativo deve funcionar perfeitamente em celulares Android e iPhone.

Será instalado como PWA.

Deve funcionar offline.

Toda informação será salva localmente.

## Público

Qualquer pessoa que faz compras.

## Filosofia

Extremamente simples.

Poucos toques.

Pouca digitação.

Interface limpa.

## Tecnologias

React
TypeScript
Vite
Tailwind CSS

Roteamento:
React Router (navegação entre lista de listas e conteúdo de uma lista).

Bottom Sheet:
Vaul.

Persistência:
IndexedDB utilizando Dexie.

## Alcance

Foco 100% mobile. Sem breakpoints dedicados para tablet/desktop; em telas largas o conteúdo apenas fica centralizado com largura máxima.

## Fora do escopo

Login

Backend

Sincronização

Compartilhamento

## Primeira versão

Criar listas.

Editar listas.

Excluir listas (com confirmação).

Adicionar produtos (apenas nome).

Editar produtos.

Excluir produtos (sem confirmação).

Marcar produtos comprados.

Salvar automaticamente.

## Modelo de dados

Lista: id, nome, criadaEm.

Produto: id, listId, nome, comprado (boolean), criadoEm.

Sem quantidade, unidade, preço ou categoria na v1.

## Regras de comportamento

Produtos aparecem em ordem de inserção.

Produto marcado como comprado ganha risco (strikethrough) e move para uma seção "Comprados" no fim da lista.

Excluir produto é imediato, sem confirmação.

Excluir lista exige confirmação (ação maior, sem backup automático).

## Backup

Sem sincronização automática. Exportar/Importar um arquivo JSON com todas as listas fica como funcionalidade futura (ver TASKS.md), para o usuário não perder tudo ao trocar de aparelho.
