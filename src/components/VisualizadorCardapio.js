"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BotaoLink from "./BotaoLink";
import { IconeBaixar, IconeCardapio, IconeFechar } from "./icones";
import {
  CARDAPIO_ARQUIVO,
  CARDAPIO_SRC,
  NOME,
  PEDIDOS_NOVA_ABA,
  SITE_PEDIDOS,
} from "@/lib/config";
import styles from "./VisualizadorCardapio.module.css";

const HASH = "#cardapio";

/**
 * Botão "Ver cardápio" + modal com a imagem.
 * Sem JavaScript, o botão é só um link para /cardapio.jpg.
 */
export default function VisualizadorCardapio() {
  const [aberto, setAberto] = useState(false);
  const gatilhoRef = useRef(null);

  useEffect(() => {
    // Recarregou com #cardapio na URL? Limpa, para o "voltar" não ficar confuso.
    if (window.location.hash === HASH) {
      const { pathname, search } = window.location;
      window.history.replaceState({ ...window.history.state, cardapio: false }, "", pathname + search);
    }
    // Botão VOLTAR do celular/navegador: fecha (ou reabre, se avançar).
    const aoNavegar = () => setAberto(window.location.hash === HASH);
    window.addEventListener("popstate", aoNavegar);
    return () => window.removeEventListener("popstate", aoNavegar);
  }, []);

  function abrir(e) {
    // Ctrl/Cmd+clique, botão do meio etc. continuam abrindo a imagem em nova aba.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.location.hash !== HASH) {
      window.history.pushState({ cardapio: true }, "", HASH);
    }
    setAberto(true);
  }

  const fechar = useCallback(() => {
    if (window.history.state?.cardapio) {
      window.history.back(); // o popstate fecha o modal
    } else {
      setAberto(false);
    }
  }, []);

  return (
    <>
      <BotaoLink
        ref={gatilhoRef}
        href={CARDAPIO_SRC}
        variante="destaque"
        icone={<IconeCardapio />}
        onClick={abrir}
        aria-haspopup="dialog"
      >
        Ver cardápio
      </BotaoLink>

      {aberto &&
        createPortal(
          <Modal aoFechar={fechar} gatilhoRef={gatilhoRef} />,
          document.body,
        )}
    </>
  );
}

function Modal({ aoFechar, gatilhoRef }) {
  const dialogoRef = useRef(null);
  const fecharRef = useRef(null);
  const palcoRef = useRef(null);
  const imgRef = useRef(null);
  const focoZoom = useRef(null);
  const ultimoToque = useRef({ t: -1e9, x: 0, y: 0 });

  const [status, setStatus] = useState("carregando"); // carregando | pronto | erro
  const [larguraZoom, setLarguraZoom] = useState(null); // null = ajustado à tela

  // Abrir: trava a rolagem de trás, "desliga" a página, foca o Fechar,
  // prende o Tab e escuta o Esc. Fechar: desfaz tudo e devolve o foco.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const gatilho = gatilhoRef.current;
    const dialogo = dialogoRef.current;
    const fundo = document.querySelector("main");
    const antes = { html: html.style.overflow, body: body.style.overflow };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    fundo?.setAttribute("inert", "");
    fecharRef.current?.focus();

    function aoTeclar(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        aoFechar();
        return;
      }
      if (e.key !== "Tab" || !dialogo) return;
      const focaveis = dialogo.querySelectorAll("a[href], button:not([disabled])");
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const atual = document.activeElement;
      const fora = !dialogo.contains(atual);
      if (e.shiftKey && (atual === primeiro || fora)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (atual === ultimo || fora)) {
        e.preventDefault();
        primeiro.focus();
      }
    }
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      html.style.overflow = antes.html;
      body.style.overflow = antes.body;
      fundo?.removeAttribute("inert");
      gatilho?.focus();
    };
  }, [aoFechar, gatilhoRef]);

  // Depois de ampliar, rola para manter sob o dedo/cursor o ponto tocado.
  useLayoutEffect(() => {
    const foco = focoZoom.current;
    const img = imgRef.current;
    const palco = palcoRef.current;
    if (!larguraZoom || !foco || !img || !palco) return;
    const r = img.getBoundingClientRect();
    palco.scrollLeft += r.left + foco.fx * r.width - foco.x;
    palco.scrollTop += r.top + foco.fy * r.height - foco.y;
    focoZoom.current = null;
  }, [larguraZoom]);

  function alternarZoom(x, y) {
    const img = imgRef.current;
    const palco = palcoRef.current;
    if (!img || !palco || status !== "pronto") return;

    if (larguraZoom) {
      setLarguraZoom(null);
      return;
    }

    const r = img.getBoundingClientRect();
    const css = getComputedStyle(palco);
    const util =
      palco.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    // Tamanho real da imagem, mas pelo menos a largura da tela e no máximo 3x.
    let largura = Math.min(Math.max(img.naturalWidth, util), util * 3);
    if (largura < r.width * 1.5) largura = r.width * 2;

    focoZoom.current = {
      fx: (x - r.left) / r.width,
      fy: (y - r.top) / r.height,
      x,
      y,
    };
    setLarguraZoom(Math.round(largura));
  }

  // Mouse: um clique amplia/reduz. Toque: duplo toque amplia/reduz.
  function aoSoltar(e) {
    if (!e.isPrimary) return;
    if (e.pointerType === "mouse") {
      if (e.button === 0) alternarZoom(e.clientX, e.clientY);
      return;
    }
    const u = ultimoToque.current;
    const rapido = e.timeStamp - u.t < 320;
    const perto = Math.hypot(e.clientX - u.x, e.clientY - u.y) < 40;
    if (rapido && perto) {
      ultimoToque.current = { t: -1e9, x: 0, y: 0 };
      alternarZoom(e.clientX, e.clientY);
    } else {
      ultimoToque.current = { t: e.timeStamp, x: e.clientX, y: e.clientY };
    }
  }

  const pedidoExtras = PEDIDOS_NOVA_ABA
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div
      ref={dialogoRef}
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label="Cardápio"
    >
      <button
        ref={fecharRef}
        type="button"
        className={styles.fechar}
        onClick={aoFechar}
        aria-label="Fechar cardápio"
      >
        <IconeFechar />
      </button>

      <div
        ref={palcoRef}
        className={styles.palco}
        onClick={(e) => {
          // Clique no fundo (fora da imagem) fecha.
          if (e.target === e.currentTarget) aoFechar();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- imagem original, sem otimização, para o zoom ficar nítido */}
        <img
          ref={imgRef}
          src={CARDAPIO_SRC}
          alt={`Cardápio da ${NOME}`}
          decoding="async"
          draggable={false}
          className={`${styles.imagem} ${larguraZoom ? styles.ampliada : ""} ${
            status === "pronto" ? styles.visivel : ""
          }`}
          style={larguraZoom ? { width: larguraZoom } : undefined}
          onLoad={() => setStatus("pronto")}
          onError={() => setStatus("erro")}
          onPointerUp={aoSoltar}
        />

        {status === "carregando" && (
          <div className={styles.aviso} role="status">
            <span className={styles.girando} aria-hidden="true" />
            Carregando cardápio…
          </div>
        )}
        {status === "erro" && (
          <div className={styles.aviso} role="alert">
            Não foi possível carregar o cardápio.
          </div>
        )}
      </div>

      <div className={styles.acoes}>
        <a
          href={CARDAPIO_SRC}
          download={CARDAPIO_ARQUIVO}
          className={`${styles.acao} ${styles.baixar}`}
        >
          <IconeBaixar />
          Baixar cardápio
        </a>
        <a
          href={SITE_PEDIDOS}
          className={`${styles.acao} ${styles.pedir}`}
          {...pedidoExtras}
        >
          Fazer pedido pelo site
          {PEDIDOS_NOVA_ABA && <span className="sr-only"> (abre em nova aba)</span>}
        </a>
      </div>
    </div>
  );
}
