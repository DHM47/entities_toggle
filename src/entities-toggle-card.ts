/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  customElement,
  property,
  CSSResultGroup,
  TemplateResult,
  css,
  PropertyValues,
  internalProperty,
} from 'lit-element';
import {
  HomeAssistant,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types

import './editor';

import type { EntitiesToggleCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';


/* eslint no-console: 0 */
console.info(
  `%c  ENTITIES-TOGGLE \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'entities-toggle-card',
  name: 'Entities Toggle Card',
  description: 'A header with a toggle for a list of entities (entities are not shown)',
});

// TODO Name your custom element
@customElement('entities-toggle-card')
export class EntitiesToggleCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('entities-toggle-card-editor');
  }
  
  public static getStubConfig(): object {
    return {};
  }
  // TODO Add any properities that should cause your element to re-render here
  // https://lit-element.polymer-project.org/guide/properties
  @property({ attribute: false }) public hass!: HomeAssistant;
  @internalProperty() private config!: EntitiesToggleCardConfig;

  // https://lit-element.polymer-project.org/guide/properties#accessors-custom
  public setConfig(config: EntitiesToggleCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }
    
    this.config = config;
   
  }

  // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
	
      return false;
    }

    return this.hasConfigOrEntityChanged(this, changedProps, false);	
  }

  // https://lit-element.polymer-project.org/guide/templates
  protected render(): TemplateResult | void {
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning'));
    }

    if (this.config.show_error) {
      return this._showError(localize('common.show_error'));
    }

    return html`
	${this.config.show_as_card? html`<ha-card>
	   <h1 class="card-header">
          <div class="name">
            ${this.config.title}
          </div>
          <ha-switch
			aria-label= ${this.config.title}
       		.checked=${this?.config?.entities!.some((entity) => {
		           const stateObj = this.hass!.states[entity.entity];
          			return stateObj && stateObj.state === "on";
        		})}
			@change="${ev => this._callService(ev.target.checked)}">
	     </ha-switch>
        </h1>
	</ha-card>
` : html`
	   <h1 class="card-header-plain">
          <div class="name">
            ${this.config.title}
          </div>
          <ha-switch class="ha-switch-plain"
			aria-label= ${this.config.title}
			.checked=${this?.config?.entities!.some((entity) => {
		           const stateObj = this.hass!.states[entity.entity];
          			return stateObj && stateObj.state === "on";
        		})}
       		@change="${ev => this._callService(ev.target.checked)}">
	     </ha-switch>
        </h1>`}
    `;
  }
 
  private _showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }
  private _callService(ev: boolean): void {
    	/* eslint-disable  @typescript-eslint/camelcase */
	if(ev){
		this.hass.callService("homeassistant", "turn_on", { entity_id: this?.config?.entities?.map((conf) => conf.entity) })
	}else {
		this.hass.callService("homeassistant", "turn_off", { entity_id: this?.config?.entities?.map((conf) => conf.entity) })
	}
	/* eslint-enable  @typescript-eslint/camelcase */			
  }


  // https://lit-element.polymer-project.org/guide/styles
  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
      }

      .card-header .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
	ha-switch {
        padding: 13px 5px;
        margin: 4px -8px;
      }
	.ha-switch-plain {
        padding: 13px 5px;
        margin: -4px -8px;
      }
	.card-header-plain {
        color: var(--ha-card-header-color, --primary-text-color);
        font-family: var(--ha-card-header-font-family, inherit);
        font-size: var(--ha-card-header-font-size, 24px);
        font-weight: normal;
        margin-block-start: 0px;
        margin-block-end: 0px;
        letter-spacing: -0.012em;
        line-height: 32px;
        display: flex;
        padding: 24px 16px 16px;
        justify-content: space-between;
      }
	:host {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }



      #states {
        flex: 1;
      }

      #states > * {
        margin: 8px 0;
      }

      #states > *:first-child {
        margin-top: 0;
      }

      #states > *:last-child {
        margin-bottom: 0;
      }

      #states > div > * {
        overflow: hidden;
      }

      #states > div {
        position: relative;
      }

      .icon {
        padding: 0px 18px 0px 8px;
      }

      .header {
        border-top-left-radius: var(--ha-card-border-radius, 2px);
        border-top-right-radius: var(--ha-card-border-radius, 2px);
        margin-bottom: 16px;
        overflow: hidden;
      }

      .footer {
        border-bottom-left-radius: var(--ha-card-border-radius, 2px);
        border-bottom-right-radius: var(--ha-card-border-radius, 2px);
        margin-top: -16px;
        overflow: hidden;
      }
    `;
  }
private hasConfigOrEntityChanged(
  element: any,
  changedProps: PropertyValues,
  forceUpdate: boolean,
): boolean {
  if (changedProps.has('config') || forceUpdate) {
    return true;
  }

  if (element.config!.entities) {
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
	return (	
      		this?.config?.entities!.some((entity) => {
          			return oldHass.states[entity.entity] !== this.hass!.states[entity.entity];
        		}) as boolean
      );
    }
    return true;
  } else {
    return false;
  }
}


}

