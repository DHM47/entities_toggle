import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'entities-toggle-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface EntitiesToggleCardConfig extends LovelaceCardConfig {
  type: string;
  title: string;
  show_warning?: boolean;
  show_error?: boolean;
  entities?: Array<LovelaceRowConfig | string>;
  test_gui?: boolean;
  show_as_card: boolean;
}
