/**
 * Copyright 2025 daa5767
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";

/**
 * `github-rpg-contributors`
 *
 * @demo index.html
 * @element github-rpg-contributors
 */
export class GithubRpgContributors extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "github-rpg-contributors";
  }

  constructor() {
    super();
    this.title = "Github Contributors";
    this.organization = "haxtheweb";
    this.repo = "webcomponents";
    this.limit = 25;
    this.items = [];
    this.loading = false;

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/github-rpg-contributors.ar.json", import.meta.url)
          .href + "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      organization: { type: String, reflect: true },
      repo: { type: String, reflect: true },
      limit: { type: Number },
      items: { type: Array, reflect: true },
      loading: { type: Boolean },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        h3 span {
          font-size: var(
            --github-rpg-contributors-label-font-size,
            var(--ddd-font-size-s)
          );
        }
        details {
          display: block;
        }
        .results {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .rpg-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px;
          border: 1px solid var(--ddd-theme-primary);
          border-radius: 10px;
          background-color: var(--ddd-theme-accent);
        }
        .contributor p {
          margin: 5px 0;
          font-size: 14px;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <h2>${this.title}</h2>

      <label>Organization:</label>
      <input id="org" type="text" />
      <label>Repo:</label>
      <input id="repo" type="text" />
      <button @click="${this.handleClick}">Submit</button>

      <details open>
        <summary>
          Github Contributors:
          <a href="https://github.com/${this.organization}/${this.repo}"
            >https://github.com/${this.organization}/${this.repo}</a
          >
        </summary>
        <div></div>
      </details>
      ${this.loading ? html`<div class="loading">Loading...</div>` : ""}
      <div class="results">
        ${this.items.map(
          (item) => html`
            <div class="rpg-wrapper">
              <a href="${item.html_url}?tab=repositories"
                ><rpg-character seed=${item.login}></rpg-character
              ></a>
              <div class="contributor">
                <p>Username: ${item.login}</p>
                <p>Contributions: ${item.contributions}</p>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  handleClick() {
    this.organization = this.shadowRoot.querySelector("#org").value;
    this.repo = this.shadowRoot.querySelector("#repo").value;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (
      changedProperties.has("organization") ||
      changedProperties.has("repo")
    ) {
      if (this.organization && this.repo) {
        this.fetchContributors();
      }
    }
  }
  fetchContributors() {
    this.loading = true;
    console.log(
      `https://api.github.com/repos/${this.organization}/${this.repo}/contributors?per_page=${this.limit}`
    );
    fetch(
      `https://api.github.com/repos/${this.organization}/${this.repo}/contributors?per_page=${this.limit}`
    )
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (data.length > 0) {
          this.items = [];
          this.items = data;
          this.loading = false;
        }
      });
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(
  GithubRpgContributors.tag,
  GithubRpgContributors
);
