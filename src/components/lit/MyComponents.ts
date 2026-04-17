import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * c-rainbow 这个标签只能单个字使用。
 */
@customElement("c-rainbow")
export class RainbowElement extends LitElement {
    static styles = css`
        @keyframes rainbow {
            0% {
                color: red;
            }
            14.29% {
                color: orange;
            }
            28.57% {
                color: yellow;
            }
            42.86% {
                color: green;
            }
            57.14% {
                color: cyan;
            }
            71.43% {
                color: blue;
            }
            85.71% {
                color: purple;
            }
            100% {
                color: red;
            }
        }
        .rainbow {
            animation: rainbow 5s infinite !important;
        }
        .rainbow * {
            animation: rainbow 5s infinite !important;
        }
    `

    render() {
        return html`<span class="rainbow"><slot /></span>`
    }
}
