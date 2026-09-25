import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'InteractiveMapWebPartStrings';
import InteractiveMap from './components/InteractiveMap';
import { IInteractiveMapProps } from './components/IInteractiveMapProps';

export interface IInteractiveMapWebPartProps {
  title?: string;
  subtitle?: string;
  // F3/F4 will add the map color and per-state link properties here.
}

export default class InteractiveMapWebPart extends BaseClientSideWebPart<IInteractiveMapWebPartProps> {

  private _isDarkTheme: boolean = false;

  public render(): void {
    const element: React.ReactElement<IInteractiveMapProps> = React.createElement(
      InteractiveMap,
      {
        isDarkTheme: this._isDarkTheme,
        title: this.properties.title,
        subtitle: this.properties.subtitle
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
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
            }
          ]
        }
      ]
    };
  }
}
