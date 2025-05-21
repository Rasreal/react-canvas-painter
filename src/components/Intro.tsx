import React from "react";
import { rootCertificates } from "tls";
import { CompletionTriggerKind } from "typescript";

interface Props {
  init?: any;
  isReady?: boolean;
}

export const Intro: React.FC<Props> = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div className="intro__content">
        <h1>Magic Painter</h1>
        <button onClick={init} className="blob-btn">
          <span className="blob-text">Start painting</span>
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button>
        <p>
          Created by <strong>Adrian Bece</strong>
        </p>
        <p>
          Supported by <strong>Yersultan Tursyn</strong>
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/uersultan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Linkedin
          </a>{" "}
          |
          <a
            href="https://www.buymeacoffee.com/ubnZ8GgDJ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support Author's work
          </a>
          |
          <a
            href="https://uers-portfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            My Personal website
          </a>
        </p>
      </div>
    </header>
  );
};
