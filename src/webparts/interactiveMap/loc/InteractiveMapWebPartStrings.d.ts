declare interface IInteractiveMapWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  SubtitleFieldLabel: string;
  ColorsGroupName: string;
  BaseColorFieldLabel: string;
  HoverColorFieldLabel: string;
  ResetColorsButtonLabel: string;
  MapAriaLabel: string;
}

declare module 'InteractiveMapWebPartStrings' {
  const strings: IInteractiveMapWebPartStrings;
  export = strings;
}
