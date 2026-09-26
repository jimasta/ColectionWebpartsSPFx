declare interface IInteractiveMapWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  SubtitleFieldLabel: string;
  ColorsGroupName: string;
  BaseColorFieldLabel: string;
  HoverColorFieldLabel: string;
  ResetColorsButtonLabel: string;
  LinksPageDescription: string;
  NavigationGroupName: string;
  OpenInNewTabLabel: string;
  ToggleOnText: string;
  ToggleOffText: string;
  RegionNorth: string;
  RegionNortheast: string;
  RegionCentralWest: string;
  RegionSoutheast: string;
  RegionSouth: string;
  LinkPlaceholder: string;
  LinkRequiredError: string;
  LinkInvalidError: string;
  MissingLinksWarning: string;
  ConfigureLinksButton: string;
  MapAriaLabel: string;
}

declare module 'InteractiveMapWebPartStrings' {
  const strings: IInteractiveMapWebPartStrings;
  export = strings;
}
