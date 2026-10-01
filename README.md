# 200 Casos Clínicos Resolvidos para o Enamed

Página de venda dos 200 casos clínicos resolvidos para o Enamed. Next.js (App Router), TypeScript e Tailwind CSS.

Textos, preço, autores, amostra, entrega e suporte ficam em [`config/site.ts`](config/site.ts). A URL de pagamento fica só na variável de ambiente.

## Rodar

```bash
npm install
npm run dev
```

Copie [`.env.example`](.env.example) para `.env.local` antes de ligar o checkout. Depois de alterar variáveis `NEXT_PUBLIC_`, reinicie o servidor. Em produção, gere o build de novo.

Enquanto `NEXT_PUBLIC_CHECKOUT_URL` não for uma URL `https`, os botões da oferta não navegam. A página pública não lista o que ainda falta configurar.

## Rastreamento

Não há pixel instalado. Se `gtag` ou `dataLayer` já existirem na página, o clique no checkout registra apenas `InitiateCheckout`. Não dispare `Purchase` aqui. `Purchase` depende da confirmação real da venda.

## Checklist antes de publicar

- [ ] `NEXT_PUBLIC_CHECKOUT_URL`: URL HTTPS do checkout, com o mesmo preço e os mesmos itens desta página.
- [ ] `NEXT_PUBLIC_SITE_URL`: domínio público da página.
- [ ] `delivery.supportEmail`: e-mail real de suporte.
- [ ] `seller.legalName`: responsável pela venda. `seller.document` se quiser exibir CPF ou CNPJ.
- [ ] `delivery.platformName` e `delivery.accessArea`: ajuste os dois se a entrega não for na área do produto da Hotmart.
- [ ] `authors`: nome, CRM, especialidade, atuação e contribuição, com autorização. Não invente perfil, foto ou depoimento.
- [ ] `editorial.commentsReviewedByIdentifiedPhysicians`: `true` somente depois que os comentários forem produzidos ou revisados pelos médicos identificados. A frase “Material original, com comentários exclusivos de médicos experientes.” só aparece com essa flag e com autores preenchidos.
- [ ] `clinicalSample`: uma questão real do produto, aprovada por médico. Marque `validated` como `true` só depois disso. Sem amostra válida, a página não exibe caso clínico.
- [ ] Arquivos finais do produto no pacote vendido: 10 volumes em PDF, casos 001 a 200, com resolução na página seguinte, gabarito com a regra, ficha e fontes.
- [ ] `bonuses.errorNotebook.ready` e `bonuses.reviewGuide.ready`: `true` somente quando o caderno de erros e o roteiro de 21 dias estiverem prontos para entrega. Antes disso, eles não entram na oferta.
- [ ] `pricing.referenceVerified`: `true` somente se o preço de R$ 197 tiver referência comercial comprovável. Sem isso, a página mostra “Preço de lançamento: R$ 97”, sem valor riscado. Não acrescente prazo, contador ou vagas limitadas.
- [ ] `legal.privacy` e `legal.terms`: substitua o texto pendente e marque `ready` como `true`. Os links só aparecem no rodapé quando o texto está pronto.
- [ ] Confira no checkout o preço de R$ 97, a lista do que está incluído, a ausência de parcelamento ou prazo de acesso que esta página não anuncia, e a garantia de 7 dias para cancelamento e reembolso da compra online.
- [ ] Não publique depoimentos até existirem relatos autênticos e autorizados.

O que ainda falta para publicar fica neste checklist e em `getDeveloperStatus`, em `lib/publication.ts`. A página de venda não exibe esses avisos.
