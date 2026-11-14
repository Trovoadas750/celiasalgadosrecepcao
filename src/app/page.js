import Image from "next/image";
import BotaoLink from "@/components/BotaoLink";
import Rodape from "@/components/Rodape";
import VisualizadorCardapio from "@/components/VisualizadorCardapio";
import { IconeSacola, IconeWhatsApp } from "@/components/icones";
import {
  FRASE,
  NOME,
  PEDIDOS_NOVA_ABA,
  SITE_PEDIDOS,
  WHATSAPP_URL,
} from "@/lib/config";
import styles from "./page.module.css";

export default function Pagina() {
  return (
    <main className={styles.pagina}>
      <div className={styles.cartao}>
        <header className={styles.topo}>
          <Image
            src="/logo.png"
            alt={NOME}
            width={500}
            height={500}
            preload
            sizes="(min-width: 768px) 180px, 150px"
            className={styles.logo}
          />
          <h1 className={styles.nome}>{NOME}</h1>
          <p className={styles.frase}>{FRASE}</p>
        </header>

        <nav className={styles.botoes} aria-label="Links principais">
          <BotaoLink
            href={SITE_PEDIDOS}
            variante="principal"
            icone={<IconeSacola />}
            novaAba={PEDIDOS_NOVA_ABA}
          >
            Fazer pedido pelo site
          </BotaoLink>

          <VisualizadorCardapio />

          <BotaoLink
            href={WHATSAPP_URL}
            variante="contorno"
            icone={<IconeWhatsApp />}
            novaAba
          >
            Falar no WhatsApp
          </BotaoLink>
        </nav>

        <Rodape />
      </div>
    </main>
  );
}
