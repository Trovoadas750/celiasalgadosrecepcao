import { IconeExterno, IconeSeta } from "./icones";
import styles from "./BotaoLink.module.css";

/**
 * Link com cara de botão: ícone à esquerda, texto e seta à direita.
 * variante: "principal" (ferrugem) | "destaque" (laranja) | "contorno"
 */
export default function BotaoLink({
  href,
  icone,
  variante = "principal",
  novaAba = false,
  children,
  ...resto
}) {
  const extras = novaAba ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a
      href={href}
      className={`${styles.botao} ${styles[variante]}`}
      {...extras}
      {...resto}
    >
      <span className={styles.icone}>{icone}</span>
      <span className={styles.texto}>
        {children}
        {novaAba && <span className="sr-only"> (abre em nova aba)</span>}
      </span>
      <span className={styles.seta}>
        {novaAba ? <IconeExterno /> : <IconeSeta />}
      </span>
    </a>
  );
}
