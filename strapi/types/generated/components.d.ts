import type { Schema, Attribute } from '@strapi/strapi';

export interface CardsInformationCardVariant1 extends Schema.Component {
  collectionName: 'components_cards_information_card_variant1s';
  info: {
    displayName: 'InformationCardVariant1';
    icon: '';
    description: '';
  };
  attributes: {
    imgSrc: Attribute.String;
    imgAlt: Attribute.String;
    title: Attribute.String;
    description: Attribute.Text;
    button: Attribute.Component<'generic.button'>;
  };
}

export interface ConfigLayersWms extends Schema.Component {
  collectionName: 'components_config_layers_wms';
  info: {
    displayName: 'WMS';
    icon: 'cog';
  };
  attributes: {
    title: Attribute.String;
    wmsUrl: Attribute.String;
  };
}

export interface GenericButton extends Schema.Component {
  collectionName: 'components_generic_buttons';
  info: {
    displayName: 'Button';
    icon: 'cursor';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    url: Attribute.String;
    newTab: Attribute.Boolean;
  };
}

export interface GenericContact extends Schema.Component {
  collectionName: 'components_generic_contacts';
  info: {
    displayName: 'Contact';
  };
  attributes: {
    address: Attribute.String;
    email: Attribute.Email;
    phone: Attribute.String;
    fax: Attribute.String;
  };
}

export interface GenericLabelledValue extends Schema.Component {
  collectionName: 'components_generic_labelled_values';
  info: {
    displayName: 'LabelledValue';
  };
  attributes: {
    label: Attribute.String;
    value: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'cards.information-card-variant1': CardsInformationCardVariant1;
      'config-layers.wms': ConfigLayersWms;
      'generic.button': GenericButton;
      'generic.contact': GenericContact;
      'generic.labelled-value': GenericLabelledValue;
    }
  }
}
