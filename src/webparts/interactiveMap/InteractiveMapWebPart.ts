import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  type IPropertyPaneField,
  type IPropertyPaneGroup,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'InteractiveMapWebPartStrings';
import InteractiveMap from './components/InteractiveMap';
import { IInteractiveMapProps } from './components/IInteractiveMapProps';
import { brazilStates } from './components/data/BrazilMapData';
import { type BrazilRegionKey, brazilRegions } from './components/data/brazilRegions';
import { getStateLinkError, type IStateLinkMessages } from './components/stateLinks';
import type { IStateLinks } from '../../models/IStateLinks';

type ColorPickerModule = typeof import('@pnp/spfx-property-controls/lib/PropertyFieldColorPicker');

export interface IInteractiveMapWebPartProps {
  title?: string;
  subtitle?: string;
  /** F3: fill color of the states. Unset means "use the theme". */
  baseColor?: string;
  /** F3: fill color on hover and for the selected state. Unset means "use the theme". */
  hoverColor?: string;
  /** F4: destination link of each state, keyed by UF. Edited in the property pane through the
   *  nested paths "stateLinks.AC", "stateLinks.AL", ... */
  stateLinks?: IStateLinks;
  /** F4: open the state links in a new tab. Unset means the current tab. */
  openLinksInNewTab?: boolean;
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
        isEditMode: this.displayMode === DisplayMode.Edit,
        title: this.properties.title,
        subtitle: this.properties.subtitle,
        baseColor: this.properties.baseColor,
        hoverColor: this.properties.hoverColor,
        stateLinks: this.properties.stateLinks,
        openLinksInNewTab: this.properties.openLinksInNewTab,
        onConfigureLinks: (): void => this.context.propertyPane.open()
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
        },
        {
          header: {
            description: strings.LinksPageDescription
          },
          groups: [
            {
              groupName: strings.NavigationGroupName,
              groupFields: [
                PropertyPaneToggle('openLinksInNewTab', {
                  label: strings.OpenInNewTabLabel,
                  onText: strings.ToggleOnText,
                  offText: strings.ToggleOffText
                })
              ]
            },
            ...this._getLinkGroups()
          ]
        }
      ]
    };
  }

  /** F4: one group per region, one link field per state (all mandatory). */
  private _getLinkGroups(): IPropertyPaneGroup[] {
    const regionNames: Record<BrazilRegionKey, string> = {
      north: strings.RegionNorth,
      northeast: strings.RegionNortheast,
      centralWest: strings.RegionCentralWest,
      southeast: strings.RegionSoutheast,
      south: strings.RegionSouth
    };
    const stateNames = new Map(brazilStates.map((state) => [state.uf, state.name] as [string, string]));
    const messages: IStateLinkMessages = {
      required: strings.LinkRequiredError,
      invalid: strings.LinkInvalidError
    };

    return brazilRegions.map((region) => ({
      groupName: regionNames[region.key],
      groupFields: region.ufs.map((uf) =>
        PropertyPaneTextField(`stateLinks.${uf}`, {
          label: `${stateNames.get(uf)} (${uf})`,
          placeholder: strings.LinkPlaceholder,
          // An invalid value is not saved by SPFx, so stored links are always valid (the map
          // still re-validates them before navigating).
          onGetErrorMessage: (value: string): string => getStateLinkError(value, messages),
          deferredValidationTime: 500
        })
      )
    }));
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
