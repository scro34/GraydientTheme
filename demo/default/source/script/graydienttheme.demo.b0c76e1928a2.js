/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */
/**
 * KDE Oxygen icons
 */
qx.Theme.define("qx.theme.icon.Oxygen",
{
  title : "Oxygen",
  aliases : {
    "icon" : "qx/icon/Oxygen"
  }
});
/* ************************************************************************

   Copyright:
     2010-2015 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

qx.Theme.define("graydienttheme.theme.Color",
{
  colors:
  {
    "app-header-start": "#1E1E1E",
    "app-header-end": "#151515",
    "background-application": "#626262",
    "background-datechooser": "#F5F5F5",
    "background-group": "#171717",
    "background-htmlarea": "#F0F0F0",
    "background-light": "#F5F5F5",
    "background-medium": "#D7D7D7",
    "background-menu": "#E5E5E5",
    "background-pane": "transparent",
    "background-selected": "#424242",
    "background-splitpane": "#333333",
    "background-tabview-unselected": "#1866B5",
    "background-week": "#151515",
    "background-weekday": "#151515",
    "background-window-active": "#B2B2B2",
    "background-window-inactive": "#C2C2C2",
    "border-button": "#828282",
    "border-button-disabled": "#151515",
    "border-button-hovered": "#222222",
    "border-button-inner": "#E2C894",
    "border-button-inner-pressed": "#525252",
    "border-button-inner-hovered": "#494949",
    "border-captionbar-active-bottom": "#E4E4E4",
    "border-captionbar-active-bottom-inner": "#404040",
    "border-captionbar-active-top": "#BACCD4",
    "border-captionbar-inactive-bottom-inner": "#404040",
    "border-captionbar-inactive-bottom": "#E4E4E4",
    "border-captionbar-inactive-top": "#DCDCDC",
    "border-checkbox": "#525252",
    "border-disabled": "#828282",
    "border-dragover": "#33508D",
    "border-focused": "#2D468F",
    "border-frame": "#727272",
    "border-group": "#FFE2AE",
    "border-group-inner": "#D4BF99",
    "border-header-cell": "#090909",
    "border-input": "#101010",
    "border-input-disabled": "transparent",
    "border-invalid": "#C12B2B",
    "border-light": "#929292",
    "border-main": "#CECECE",
    "border-menu": "#757575",
    "border-menu-separator-bottom": "#FAFAFA",
    "border-menu-separator-top": "#959595",
    "border-menu-bar": "#613F2B",
    "border-popup": "#525252",
    "border-progressbar": "#101010",
    "border-separator": "#808080",
    "border-statusbar-top": "#202020",
    "border-statusbar-top-inner": "#808080",
    "border-table": "#070707",
    "border-table-statusbar-top": "#F5F5F5",
    "border-tabview-button-active": "black",
    "border-tabview-button-inactive": "#323232",
    "border-tabview-pane": "#828282",
    "border-toolbar-top": "#DADEE1",
    "border-toolbar-bottom": "#878C92",
    "border-window": "#828282",
    "border-window-top": "#E4E4E4",
    "button-start": "#EBEBEB",
    "button-end": "#A1A1A1",
    "button-end-checked": "#442A00",
    "button-end-checked-hovered": "#5E3A00",
    "button-disabled-start": "#454545",
    "button-disabled-end": "#353535",
    "button-hovered-start": "#FFFFFF",
    "button-hovered-end": "#BEBEBE",
    "button-pressed-start": "#151515",
    "button-pressed-end": "#383838",
    "captionbar-active-start": "#525252",
    "captionbar-active-end": "#212121",
    "captionbar-inactive-start": "#909090",
    "captionbar-inactive-end": "#535353",
    "checkbox-start": "#FBFBFB",
    "checkbox-end": "#B1B1B1",
    "checkbox-focused-start": "#FFFFFF",
    "checkbox-focused-end": "#CECECE",
    "checkbox-disabled-start": "#E2E2E2",
    "checkbox-disabled-end": "#C2C2C2",
    "close-button": "#7A1225",
    "close-button-hovered": "#B51316",
    "groupitem-start": "#A7A7A7",
    "groupitem-end": "#949494",
    "groupitem-text": "white",
    "header-cell-hovered-start": "#454545",
    "header-cell-hovered-end": "#252525",
    "inactive-button": "#525252",
    "input-disabled": "#2C2C2C",
    "input-start": "#050505",
    "input-end": "#303030",
    "input-focused-start": "#F6F8FE",
    "input-focused-end": "#FAFBFE",
    "input-hovered-start": "#191919",
    "input-hovered-end": "#444444",
    "invalid": "#990000",
    "keyboard-focus": "black",
    "menu-bar-button-hovered-start": "transparent",
    "menu-bar-button-hovered-end": "#101010",
    "menu-button-start": "#8699B8",
    "menu-button-end": "#50638A",
    "menu-separator-top": "black",
    "menu-separator-bottom": "gray",
    "minimize-button-hovered": "#33A533",
    "minimize-button": "#297A11",
    "maximize-button": "#876311",
    "maximize-button-hovered": "#B7AD2B",
    "progressbar-start": "#191919",
    "progressbar-end": "#292929",
    "progressive-table-header-border-right": "#F2F2F2",
    "radiobutton-hovered-invalid": "#F7EAEA",
    "restore-button": "#876311",
    "restore-button-hovered": "#B7AD2B",
    "scrollbar-slider-start": "#B2B2B2",
    "scrollbar-slider-end": "#DBDBDB",
    "scroll-knob-start": "#DBDBDB",
    "scroll-knob-end": "#A1A1A1",
    "scroll-knob-pressed-start": "#EFEFEF",
    "scroll-knob-pressed-end": "#BEBEBE",
    "slider-knob-start": "#FBFBFB",
    "slider-knob-end": "#D2D2D2",
    "slider-knob-pressed-start": "#FFFFFF",
    "slider-knob-pressed-end": "#FEFEFE",
    "shadow": "#666666",
    "shadow-button": "#525252",
    "shadow-input": "#101010",
    "shadow-menu": "#0C0C0C",
    "shadow-popup": "#090909",
    "shadow-scrollbar": "#5E5E5E",
    "shadow-table": "#080808",
    "shadow-window": "#070707",
    "slider-start": "#121212",
    "slider-end": "#050505",
    "table-column-line": "#CCCCCC",
    "table-focus-indicator": "#80B4EF",
    "table-pane": "#F3F3F3",
    "table-row-background-even": "#F3F3F3",
    "table-row-background-focused": "#BACCD4",
    "table-row-background-focused-selected": "#385A8D",
    "table-row-background-odd": "#E4E4E4",
    "table-row-background-selected": "#385A8D",
    "table-row": "#1A1A1A",
    "table-row-line": "#CCCCCC",
    "table-row-selected": "#FFFEFE",
    "tabview-button-start": "#E2E2E2",
    "tabview-button-end": "#B2B2B2",
    "tabview-button-checked-start": "#828282",
    "tabview-button-checked-end": "#424242",
    "tabview-button-hovered-start": "#D2D2D2",
    "tabview-button-hovered-end": "#828282",
    "tabview-pane-start": "#CBCBCB",
    "tabview-pane-end": "#B1B1B1",
    "text-active": "black",
    "text-app-header": "#FFFFFF",
    "text-button": "#101010",
    "text-caption": "white",
    "text-disabled": "#A7A6AA",
    "text-gray": "#4A4A4A",
    "text-highlight": "white",
    "text-inactive": "#828282",
    "text-invalid": "#990000",
    "text-hovered": "#101010",
    "text-label": "#101010",
    "text-label-disabled": "silver",
    "text-light": "#808080",
    "text-placeholder": "#CBC8CD",
    "text-selected": "#F2F2F2",
    "text-textfield": "#050505",
    "text-title": "#101010",
    "text-window": "white",
    "toolbar-start": "#2D2D2D",
    "toolbar-end": "#1D1D1D",
    "toolbar-separator-left": "#131313",
    "toolbar-separator-right": "#373737",
    "tooltip-error": "#C82C2C",
    "window-button-start": "transparent",
    "window-button-end": "black",
    "window-caption-active-start": "#828282",
    "window-caption-active-end": "#424242",
    "window-caption-inactive-start": "#A2A2A2",
    "window-caption-inactive-end": "#626262",
    "window-statusbar-background": "#101010"
  }
});
