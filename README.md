# PetMatch Data Contract and Mock Storage

Este repositório inclui agora:

- `api/petmatch-swagger.json`: contrato OpenAPI 3.0 para a API de animais.
- `data/animals.json`: mock persistente com 50 animais variados.
- `scripts/generate_animals.ps1`: script PowerShell para gerar o mock de animais.

## Uso

- `data/animals.json` deve servir como armazenamento duradouro de mock para a aplicação.
- `api/petmatch-swagger.json` define as rotas e o contrato de `Animal` e `Contact`.

## Modelo de dados

Cada animal contém campos necessários para as telas de início, detalhes e match:

- `id`, `name`, `category`, `species`, `breed`, `age`, `sex`, `size`
- `matchScore`, `isFavorite`, `badges`
- `environment`, `behaviors`, `compatibilities`
- `health`, `description`, `story`, `images`
- `contact` com `caretakerName`, `phone` e `email`

## Como regenerar o mock

Execute o script PowerShell abaixo a partir da raiz do projeto:

```powershell
cd scripts
powershell -NoProfile -ExecutionPolicy Bypass -File generate_animals.ps1
```

## Observação

O contrato foi desenhado para suportar armazenamento flexível estilo NoSQL e permitir variação de atributos entre animais.
