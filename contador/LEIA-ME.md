# Contador de corações (Cloudflare)

O site é estático, então o total de corações de todo mundo fica num pequeno servidor grátis no Cloudflare. Ele guarda só o número total: nada de quem tocou. Para barrar robôs, ele lembra por 2 minutos um código embaralhado do endereço de cada pessoa e aceita no máximo 120 toques por minuto de cada uma.

Enquanto o endereço do contador não estiver no site (`HEARTS_API` em `index.html`), cada aparelho conta só os próprios toques, como antes.

## Montar pelo celular (uns 10 minutos)

1. **Conta:** entre em https://dash.cloudflare.com/sign-up, crie a conta grátis e confirme o e-mail.
2. **Banco:** no menu, abra **Storage & Databases → D1 SQL Database → Create**, dê o nome `morgan-coracoes` e crie.
   Não precisa criar tabela: o contador cria sozinho.
3. **Servidor:** no menu, abra **Compute (Workers) → Workers & Pages → Create → Start with Hello World**, dê o nome `morgan-coracoes` e toque em **Deploy**.
4. **Código:** no worker criado, toque em **Edit code**, apague tudo e cole o conteúdo de `contador/worker.js`. Para copiar pelo celular, abra o link "raw" do arquivo no GitHub, segure o dedo no texto e use **Selecionar tudo → Copiar**. Depois toque em **Deploy**.
5. **Ligar o banco:** volte ao worker e abra **Settings → Bindings → Add → D1 database**.
   - Em **Variable name**, escreva `DB`, em maiúsculas.
   - Escolha o banco `morgan-coracoes` e salve.
6. **Conferir:** abra o endereço do worker, algo como `https://morgan-coracoes.SEU-NOME.workers.dev`. Tem que aparecer `{"total":0}`.
7. Mande esse endereço. Ele vai para `HEARTS_API` no `index.html`, e o total passa a valer para todos os visitantes.

Os nomes dos menus podem mudar um pouco no Cloudflare. O que importa é ter um worker com esse código e um banco D1 ligado com o nome `DB`.

## Plano grátis

O plano grátis aguenta 100 mil acessos por dia ao servidor. O site junta os toques de cada pessoa e manda de uma vez, então isso dá para muitos visitantes.
