# Cadastro de Fornecedor/Produto

Este projeto é uma aplicação web para cadastro de fornecedores e seus produtos, com suporte para anexar arquivos relacionados. Ele inclui validações de campos obrigatórios, integração com API de CEP para preenchimento automático de endereço, e funcionalidades para adicionar, visualizar, baixar e remover arquivos anexados.

---

## Tecnologias Utilizadas

- HTML5 / CSS3
- JavaScript (ES6+)
- jQuery
- FLUIGC (para toasts, modais e estilo)
- API ViaCEP (para consulta de CEP)

---

## Funcionalidades Principais

- Formulário com validação dos campos obrigatórios
- Máscaras para CNPJ, telefone e validação de e-mail
- Busca automática de endereço via CEP
- Adição e remoção dinâmica de produtos
- Upload, visualização, download e remoção de arquivos anexados
- Exportação dos dados preenchidos em JSON para download
- Feedback visual por meio de toasts e modais (sucesso, erro, aviso e carregamento)

---

## Como Usar

1. Clone o repositório:

   ```bash
   git clone https://github.com/jean-cassio/suppliers-challenge.git
   ```

2. Abra o arquivo `index.html` no navegador.

3. Preencha os campos do formulário, adicione produtos e arquivos.

4. Clique no botão "Salvar Fornecedor" para validar os dados e gerar o JSON.

---

## Estrutura do Projeto

```
/
├── assets/               # Ícones, imagens, CSS e scripts JavaScript
│   ├── css/              # Arquivos CSS
│   ├── js/               # Scripts JavaScript
│   └── images/           # Ícones e imagens
├── components/           # Componentes de produtos, arquivos, fornecedor, etc
│   ├── files/
│   ├── products/
│   └── supplier/
├── index.html            # Página principal do projeto
└── README.md             # Documentação do projeto

```

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
