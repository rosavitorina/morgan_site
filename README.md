# morgan tattoo

Site oficial da Morgan Tattoo — Portfólio, Flashes e Agendamento.

## Pastas

- `index.html`: o site inteiro (precisa ficar na raiz para o GitHub Pages). Inclui a página **Provador** (`#provador`): a pessoa envia uma foto com um cartão comum (8,56 × 5,40 cm) encostado na pele, marca as pontas do cartão para calibrar a escala e posiciona o flash em tamanho real (a medida vale para o traço, sem a margem vazia; desenhos com fundo de papel têm o fundo tirado). Uma malha de 9 pontos curva o desenho para encaixar no corpo, e "Levar pro orçamento" manda a prévia e a medida para a ficha. Tudo roda no navegador: a foto não é enviada nem guardada.
- `assets/css/`: declaração das fontes (os ícones são SVG dentro do `index.html`)
- `assets/fonts/`: arquivos das fontes, hospedados aqui para o visitante não ser enviado ao Google
- `assets/js/`: Tailwind
- `assets/img/`: logo, `portfolio/`, `flashes/` e `fundos/` (artes da Morgan usadas como fundo das seções, em WebP)
- `data/items.js`: flashes, portfólio, depoimentos e a tabela de preços do orçamento publicados (o site lê este arquivo; o botão "Salvar no site" do painel grava nele e copia as imagens). O painel "Gerenciar conteúdo" só aparece quando o `index.html` é aberto do PC (arquivo local ou localhost); no site publicado ele não existe, nem com `?admin` na URL. Depoimentos só entram pelo painel (com a autorização da pessoa); visitantes mandam o relato pelo Instagram.
