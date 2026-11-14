// Tudo o que é texto ou link da página fica aqui. Edite à vontade.

export const NOME = "Edna & Célia Salgados";

export const FRASE = "Salgados de festa feitos com carinho";

export const WHATSAPP_URL =
  "https://wa.me/5514997534514?text=" +
  encodeURIComponent("Olá! Gostaria de fazer um pedido 😊");

// Endereço do site de pedidos. Defina NEXT_PUBLIC_SITE_PEDIDOS_URL no .env.local
// (ou na Vercel). Se não estiver definido, o botão leva para o WhatsApp para
// nunca virar um link quebrado.
export const SITE_PEDIDOS =
  process.env.NEXT_PUBLIC_SITE_PEDIDOS_URL || WHATSAPP_URL;

// Quando cai no WhatsApp, abre em nova aba (como o botão do WhatsApp).
export const PEDIDOS_NOVA_ABA = !process.env.NEXT_PUBLIC_SITE_PEDIDOS_URL;

export const HORARIO =
  "Ter a sex 09:00–19:00 · Sáb 08:30–19:30 · Dom e seg fechado";

export const ENDERECO = "Rua Miguel de Moraes, 377 - Vila Kennedy, Ourinhos-SP";

export const MAPA_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(ENDERECO);

export const CARDAPIO_SRC = "/cardapio.jpg";
export const CARDAPIO_ARQUIVO = "cardapio-edna-e-celia-salgados.jpg";
