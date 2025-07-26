import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';

import { PropertyPaneVersionField } from './PropertyPaneVersionField';
import { PropertyPaneUrlField } from './PropertyPaneUrlField';
import { PropertyPaneSizeField } from './PropertyPaneSizeField';
import { WebPartDefaults } from '../services/WebPartDefaults';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { PropertyPaneColorField } from './PropertyPaneColorField';
import { DefaultColors } from 'svgpublish';
import { PropertyPaneNumberField } from './PropertyPaneNumberField';

export class Configuration {

  public static get(context: WebPartContext, properties: IWebPartProps): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.PropertyPaneLabelDrawingDisplay, // Drawing Display
              groupFields: [
                PropertyPaneUrlField('url', {
                  url: properties.url,
                  context: context,
                  getDefaultFolder: () => WebPartDefaults.getDefaultFolder(context),
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAppearance,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enablePan', {
                  label: "Enable Pan",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableZoom', {
                  label: "Enable Zoom",
                  inlineLabel: true,
                }),
                PropertyPaneSizeField('width', {
                  label: strings.FieldWidth,
                  description: strings.FieldWidthDescription,
                  value: properties.width,
                  screenUnits: 'w',
                  getDefaultValue: () => WebPartDefaults.getDefaultWidth(context)
                }),
                PropertyPaneSizeField('height', {
                  label: strings.FieldHeight,
                  description: strings.FieldHeightDescription,
                  value: properties.height,
                  screenUnits: 'h',
                  getDefaultValue: () => WebPartDefaults.getDefaultHeight(context)
                }),
              ]
            },
            {
              groupName: "Header",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableHeader', {
                  label: "Enable Header",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableBreadcrumb', {
                  label: "Breadcrumb",
                  disabled: !properties.enableHeader,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableCopyHashLink', {
                  label: "Copy Link Button",
                  disabled: !properties.enableHeader,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableFeedback', {
                  label: "Feedback Button",
                  disabled: !properties.enableHeader,
                  inlineLabel: true,
                }),
                PropertyPaneTextField('feedbackButtonText', {
                  disabled: !properties.enableFeedback || !properties.enableHeader,
                  label: "Button Text",
                  placeholder: "Feedback",
                  description: "Label for the feedback button.",
                }),
                PropertyPaneTextField('feedbackUrl', {
                  disabled: !properties.enableFeedback || !properties.enableHeader,
                  label: "Feedback URL",
                  placeholder: "ex: https://some.site/?src={{URL}}",
                  description: "URL to send feedback to. Use {{URL}} as a placeholder for the current page URL.",
                }),
              ]
            },
            {
              groupName: "Selection",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableSelection', {
                  label: "Enable Selection",
                  inlineLabel: true,
                }),
                PropertyPaneColorField('selectionColor', {
                  disabled: !properties.enableSelection,
                  defaultValue: DefaultColors.selectionColor,
                  value: properties.selectionColor,
                }),
                PropertyPaneToggle('enableBoxSelection', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Use box selection",
                }),
                PropertyPaneDropdown('selectionMode', {
                  label: "Selection Mode",
                  disabled: !properties.enableSelection,
                  options: [
                    { key: 'normal', text: "normal" },
                    { key: 'lighten', text: "lighten" },
                    { key: 'darken', text: "darken" },
                  ],
                }),
                PropertyPaneToggle('enableDilate', {
                  label: "Enable Dilate",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('dilate', {
                  disabled: !(properties.enableSelection && properties.enableDilate),
                  value: properties.dilate,
                }),

                PropertyPaneToggle('enableBlur', {
                  label: "Enable Blur",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('blur', {
                  disabled: !(properties.enableSelection && properties.enableBlur),
                  value: properties.blur,
                }),
              ]
            },
            {
              groupName: "Highlight",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableHover', {
                  label: "Enable Highlight",
                }),
                PropertyPaneColorField('hoverColor', {
                  label: "Hover Color",
                  disabled: !properties.enableHover,
                  defaultValue: DefaultColors.hoverColor,
                  value: properties.hoverColor,
                }),
                PropertyPaneColorField('hyperlinkColor', {
                  label: "Hyperlink Hover Color",
                  disabled: !properties.enableHover,
                  defaultValue: DefaultColors.hyperlinkColor,
                  value: properties.hyperlinkColor,
                }),
              ]
            },
            {
              groupName: "Prev/Next Highlight",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enablePrevShapeColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Previous Shape",
                }),
                PropertyPaneColorField('prevShapeColor', {
                  disabled: !(properties.enableSelection && properties.enablePrevShapeColor),
                  defaultValue: DefaultColors.prevShapeColor,
                  value: properties.prevShapeColor,
                }),

                PropertyPaneToggle('enableNextShapeColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Next Shape",
                }),
                PropertyPaneColorField('nextShapeColor', {
                  disabled: !(properties.enableSelection && properties.enableNextShapeColor),
                  defaultValue: DefaultColors.nextShapeColor,
                  value: properties.nextShapeColor,
                }),

                PropertyPaneToggle('enablePrevConnColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Previous Connection",
                }),
                PropertyPaneColorField('prevConnColor', {
                  disabled: !(properties.enableSelection && properties.enablePrevConnColor),
                  defaultValue: DefaultColors.prevConnColor,
                  value: properties.prevConnColor,
                }),

                PropertyPaneToggle('enableNextConnColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Next Connection",
                }),
                PropertyPaneColorField('nextConnColor', {
                  disabled: !(properties.enableSelection && properties.enableNextConnColor),
                  defaultValue: DefaultColors.nextConnColor,
                  value: properties.nextConnColor,
                }),

                PropertyPaneToggle('enableConnDilate', {
                  label: "Enable Connection Dilate",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('connDilate', {
                  disabled: !(properties.enableSelection && properties.enableConnDilate),
                  value: properties.connDilate,
                }),
              ]
            },
            {
              groupName: "Hyperlinks",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableFollowHyperlinks', {
                  label: "Enable Links",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('openHyperlinksInNewWindow', {
                  label: "Open Hyperlinks in New Window",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('forceOpeningOfficeFilesOnline', {
                  label: "Force Open Office Files",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('rewriteVsdxHyperlinks', {
                  label: "Rewrite VSDX Hyperlinks as SVG",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('rewriteDocxHyperlinks', {
                  label: "Rewrite DOCX Hyperlinks as PDF",
                  inlineLabel: true,
                }),
              ]
            },
            {
              groupName: "Tooltips",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableTooltips', {
                  inlineLabel: true,
                  label: "Enable Tooltips",
                }),
                PropertyPaneToggle('tooltipUseMousePosition', {
                  label: "Use Mouse Position",
                  inlineLabel: true,
                  disabled: !properties.enableTooltips,
                }),
                PropertyPaneToggle('tooltipInteractive', {
                  label: "Interactive",
                  inlineLabel: true,
                  disabled: !properties.enableTooltips,
                }),
                PropertyPaneDropdown('tooltipTheme', {
                  label: "Tooltip Theme",
                  disabled: !properties.enableTooltips,
                  options: [
                    { key: 'dark', text: "dark" },
                    { key: 'light', text: "light" },
                    { key: 'light-border', text: "light-border" },
                    { key: 'translucent', text: "translucent" },
                  ],
                }),
                PropertyPaneDropdown('tooltipTrigger', {
                  label: "Tooltip Trigger",
                  disabled: !properties.enableTooltips,
                  options: [
                    { key: 'mouseenter', text: "mouseenter" },
                    { key: 'click', text: "click" },
                    { key: 'mouseenter click', text: "mouseenter click" },
                  ],
                }),
                PropertyPaneDropdown('tooltipPlacement', {
                  label: "Tooltip Placement",
                  disabled: !properties.enableTooltips,
                  options: [
                    { key: 'auto', text: "auto" },
                    { key: 'top', text: "top" },
                    { key: 'bottom', text: "bottom" },
                    { key: 'left', text: "left" },
                    { key: 'right', text: "right" },
                  ],
                }),
                PropertyPaneToggle('tooltipDelay', {
                  label: "Enable Delay",
                  inlineLabel: true,
                  disabled: !properties.enableTooltips,
                }),
                PropertyPaneNumberField('tooltipDelayShow', {
                  label: "Show Delay",
                  disabled: !(properties.enableTooltips && properties.tooltipDelay),
                  value: properties.tooltipDelayShow,
                }),
                PropertyPaneNumberField('tooltipDelayHide', {
                  label: "Hide Delay",
                  disabled: !(properties.enableTooltips && properties.tooltipDelay),
                  value: properties.tooltipDelayHide,
                }),
              ]
            },
            {
              groupName: "Sidebar",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableSidebar', {
                  label: "Enable Sidebar",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('rightSidebar', {
                  label: "Position Sidebar on Right",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('alwaysHideSidebar', {
                  label: "Always Hide Sidebar by Default",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('showSidebarOnSelection', {
                  label: "Show Sidebar Only on Selection",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableSidebarTitle', {
                  label: "Show Sidebar Title",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneTextField('sidebarDefaultWidth', {
                  label: "Default Sidebar Width",
                  disabled: !properties.enableSidebar,
                  value: properties.sidebarDefaultWidth,
                  placeholder: "ex: 300px, 25%",
                  description: "Specify width with units (px, %, em, etc.)",
                }),
                PropertyPaneToggle('enableSidebarMarkdown', {
                  label: "Enable Custom Sidebar Content",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneTextField('sidebarMarkdown', {
                  label: "Custom Sidebar Content",
                  disabled: !(properties.enableSidebar && properties.enableSidebarMarkdown),
                  value: properties.sidebarMarkdown,
                  placeholder: "Enter HTML or Markdown content...",
                  description: "Custom content to display in the sidebar",
                  multiline: true,
                  rows: 4,
                }),
              ]
            },
            {
              groupName: "Logging",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableUsageLog', {
                  label: "Enable Usage Logging",
                }),
                PropertyPaneTextField('usageLogListTitle', {
                  value: properties.usageLogListTitle,
                  disabled: !properties.enableUsageLog,
                  label: "Usage Log List Title",
                  placeholder: "ex: UsageLog",
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAbout,
              isCollapsed: true,
              groupFields: [
                PropertyPaneVersionField(context.manifest.version)
              ]
            }
          ]
        }
      ]
    };
  }

}
