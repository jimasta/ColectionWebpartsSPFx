import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  type IPropertyPaneField,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'InteractiveMapWebPartStrings';
import InteractiveMap from './components/InteractiveMap';
import { IInteractiveMapProps } from './components/IInteractiveMapProps';

type ColorPickerModule = typeof import('@pnp/spfx-property-controls/lib/PropertyFieldColorPicker');

export interface IInteractiveMapWebPartProps {
  title?: string;
  subtitle?: string;
  /** F3: fill color of the states. Unset means "use the theme". */
  baseColor?: string;
  /** F3: fill color on hover and for the selected state. Unset means "use the theme". */
  hoverColor?: string;
  // F4 will add the per-state link properties here.
}

export default class InteractiveMapWebPart extends BaseClientSideWebPart<IInteractiveMapWebPartProps> {

  private _isDarkTheme: boolean = false;
  // Theme colors the map falls back to when no color is configured; shown as the initial value
  // of the color pickers so they reflect what the map actually looks like.
  private _themeBaseColor: string | undefined;
  private _themeHoverColor: string | undefined;
  // Loaded on demand in loadPropertyPaneResources, so the PnP controls stay out of the main bundle.
  private _colorPicker: ColorPickerModule | undefined;

  public render(): void {
    const element: React.ReactElement<IInteractiveMapProps> = React.createElement(
      InteractiveMap,
      {
        isDarkTheme: this._isDarkTheme,
        title: this.properties.title,
        subtitle: this.properties.subtitle,
        baseColor: this.properties.baseColor,
        hoverColor: this.properties.hoverColor
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--neutralSecondary', semanticColors.bodySubtext || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
      this.domElement.style.setProperty('--neutralTertiary', semanticColors.disabledText || null);
      this.domElement.style.setProperty('--themePrimary', semanticColors.link || null);
      this.domElement.style.setProperty('--white', semanticColors.bodyBackground || null);

      this._themeBaseColor = semanticColors.disabledText;
      this._themeHoverColor = semanticColors.link;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    this._colorPicker = await import(
      /* webpackChunkName: 'interactive-map-property-pane' */
      '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker'
    );
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('subtitle', {
                  label: strings.SubtitleFieldLabel
                })
              ]
            },
            {
              groupName: strings.ColorsGroupName,
              groupFields: this._getColorFields()
            }
          ]
        }
      ]
    };
  }

  private _getColorFields(): IPropertyPaneField<unknown>[] {
    const colorPicker = this._colorPicker;
    if (!colorPicker) {
      // SPFx awaits loadPropertyPaneResources before building the pane, so this only happens if
      // the chunk failed to load; the rest of the pane still works.
      return [];
    }

    const { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } = colorPicker;
    const onPropertyChange = (propertyPath: string, oldValue: unknown, newValue: unknown): void => {
      this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    };

    return [
      PropertyFieldColorPicker('baseColor', {
        key: 'baseColorField',
        label: strings.BaseColorFieldLabel,
        selectedColor: this.properties.baseColor ?? this._themeBaseColor,
        onPropertyChange,
        properties: this.properties,
        alphaSliderHidden: true,
        style: PropertyFieldColorPickerStyle.Inline
      }),
      PropertyFieldColorPicker('hoverColor', {
        key: 'hoverColorField',
        label: strings.HoverColorFieldLabel,
        selectedColor: this.properties.hoverColor ?? this._themeHoverColor,
        onPropertyChange,
        properties: this.properties,
        alphaSliderHidden: true,
        style: PropertyFieldColorPickerStyle.Inline
      }),
      PropertyPaneButton('resetColors', {
        text: strings.ResetColorsButtonLabel,
        buttonType: PropertyPaneButtonType.Normal,
        disabled: this.properties.baseColor === undefined && this.properties.hoverColor === undefined,
        onClick: (): undefined => {
          this.properties.baseColor = undefined;
          this.properties.hoverColor = undefined;
          this.context.propertyPane.refresh();
          this.render();
          // The button's return value is stored in its target property; undefined keeps
          // "resetColors" out of the serialized web part properties.
          return undefined;
        }
      })
    ];
  }
}
