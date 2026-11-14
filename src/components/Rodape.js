import { Fragment } from "react";
import { ENDERECO, HORARIO, MAPA_URL } from "@/lib/config";
import styles from "./Rodape.module.css";

// Quebra linha só entre os trechos (nunca no meio de "Sáb 08:30–19:30").
function Trechos({ texto, separador }) {
  return texto.split(separador).map((parte, i) => (
    <Fragment key={i}>
      {i > 0 && separador}
      <span className={styles.trecho}>{parte}</span>
    </Fragment>
  ));
}

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <p>
        <span className="sr-only">Horário de funcionamento: </span>
        <Trechos texto={HORARIO} separador=" · " />
      </p>
      <p>
        <span className="sr-only">Endereço: </span>
        <Trechos texto={ENDERECO} separador=", " />
        {" · "}
        <a
          href={MAPA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapa}
        >
          Ver no mapa<span className="sr-only"> (abre em nova aba)</span>
        </a>
      </p>
    </footer>
  );
}
