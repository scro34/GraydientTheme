/* ************************************************************************

   Copyright:
     2010-2015 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

qx.Theme.define("graydienttheme.theme.Decoration",
{
  aliases: {
    decoration: "graydienttheme/decoration"
  },

  decorations :
  {
    /*
    ---------------------------------------------------------------------------
      APPLICATION
    ---------------------------------------------------------------------------
    */

    "app-header":
    {
      style: {
        startColor: "app-header-start",
        endColor: "app-header-end",
        startColorPosition: 20,
        endColorPosition: 80,
        backgroundImage: "decoration/application/app-header.png"
      }
    },
    
    "app-logo":
    {
      include: "button",
      
      style: {
        radius: 45,
        shadowLength: 0,
        shadowBlurRadius: 10,
        shadowColor: "shadow"
      }
    },
    
    "app-background":
    {
      style: {
        backgroundImage: "decoration/application/noise_lines.png",
        backgroundRepeat: "repeat"
      }
        
    },
    
    /*
    ---------------------------------------------------------------------------
      BUTTON
    ---------------------------------------------------------------------------
    */
    
    "button":
    {
      style: {
		radius: 2,
		//~ width: 1,
		//~ color: "transparent",
        shadowLength: 0,
        shadowBlurRadius: 1,
        shadowColor: "shadow-button",
        gradientStart: ["button-start", 0],
        gradientEnd: ["button-end", 100]
      }
    },
    
    "button-disabled":
    {
      include: "button",
      
      style: {
        borderImage: "decoration/button/button-disabled.png",
        shadowBlurRadius: 0
      }
    },

    "button-hovered":
    {
      include: "button",
      
      style: {
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
      }
    },

    "button-checked":
    {
      include: "button",
      
      style: {
        width: 1,
        color: "border-button",
        shadowColor: "transparent",
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
      }
    },
    
    "button-focused": 
    {
      include: "button",
      
      style: {
        color: "text-hovered"
      }
    },
    
    "button-pressed":
    {
      include: "button-checked"
    },
    
    "button-checked-hovered":
    {
      include: "button-checked"
    },
    
    "button-checked-focused": 
    {
      include: "button-checked"
    },
    
    "button-checked-disabled": 
    {
      include: "button-pressed",
      
      style: {
        borderImage: "decoration/button/button-pressed-disabled.png"
      }
    },

    "button-invalid": 
    {
      include: "button",
      
      style: {
        innerColor: "border-invalid"
      }
    },

    "button-disabled-invalid":
    {
      include: "button-disabled",
      
      style: {
        innerColor: "border-invalid"
      }
    },

    "button-hovered-invalid":
    {
      include: "button-hovered",
      
      style: {
        innerColor: "border-invalid"
      }
    },

    "button-checked-invalid":
    {
      include: "button-checked",
      
      style: {
        innerColor: "border-invalid"
      }
    },

    "button-pressed-invalid":
    {
      include: "button-pressed",
      
      style: {
        innerColor: "border-invalid"
      }
    },

    "button-focused-invalid": 
    {
      include: "button-focused",
      
      style: {
        innerColor: "border-invalid"
      }
    },

    "button-checked-focused-invalid": 
    {
      include: "button-checked-focused",
      
      style: {
        innerColor: "border-invalid"
      }
    },
    
    "splitbutton":
    {
      style:
      {
        borderImage: "decoration/button/splitbutton.png",
        slice: 2
      }
    },
    
    "splitbutton-checked":
    {
      style:
      {
        borderImage: "decoration/button/splitbutton-checked.png",
        slice: 2
      }
    },
    
    "splitbutton-hovered":
    {
      style:
      {
        borderImage: "decoration/button/splitbutton-hovered.png",
        slice: 2
      }
    },
    
    "splitbutton-disabled":
    {
      style:
      {
        borderImage: "decoration/button/split-button-disabled.png",
        slice: 5
      }
    },
    
    "splitbutton-right":
    {
      style:
      {
        borderImage: "decoration/button/split-button-right.png",
        slice: 5
      }
    },
    
    "splitbutton-right-checked":
    {
      style:
      {
        borderImage: "decoration/button/split-button-right-pressed.png",
        slice: 5
      }
    },
    
    "splitbutton-right-hovered":
    {
      style:
      {
        borderImage: "decoration/button/split-button-right-hovered.png",
        slice: 5
      }
    },
    
    "splitbutton-right-disabled":
    {
      style:
      {
        borderImage: "decoration/button/split-button-right-disabled.png",
        slice: 5
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      CHECK BOX
    ---------------------------------------------------------------------------
    */

    "checkbox":
    {
      style:
      {
        radius: 2,
        width: 1,
        color: "border-checkbox",
        gradientStart: ["checkbox-start", 0],
        gradientEnd: ["checkbox-end", 100]
      }
    },

    "checkbox-focused":
    {
      include: "checkbox",
      
      style:
      {
        color: "border-focused",
        gradientStart: ["checkbox-focused-start", 0],
        gradientEnd: ["checkbox-focused-end", 100]
      }
    },
    
    "checkbox-disabled":
    {
      include: "checkbox",
      
      style:
      {
        color: "border-disabled",
        gradientStart: ["checkbox-disabled-start", 0],
        gradientEnd: ["checkbox-disabled-end", 100]
      }
    },

    "checkbox-invalid":
    {
      include: "checkbox",
      
      style:
      {
        color: "border-invalid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      COMBOBOX
    ---------------------------------------------------------------------------
    */
    
    "combobox":
    {
	  include: "input",
	  
	  style:
	  {
		radius: [2, 0, 0, 2],
		colorRight: "transparent"
	  }
	},
		
    "combobox-button":
    {
      style: 
      {
        radius: [0, 2, 2, 0],
        width: [1, 1, 1, 0],
        color: "border-light",
        gradientStart: ["button-start", 0],
        gradientEnd: ["button-end", 100]
      }
    },
    
    "combobox-button-hovered":
    {
      include: "combobox-button",

      style: 
      {
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
      }
    },
    
    "combobox-button-pressed":
    {
      include: "button-pressed"
    },
    
    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */

    "border-invalid": 
    {
      include: "input",
      
      style: {
        color: "border-invalid"
      }
    },
    
    "dragover":
    {
      style: {
        bottom: [2, "solid", "border-dragover"]
      }
    },

    "keyboard-focus":
    {
      style: {
        width: 1,
        color: "keyboard-focus",
        style: "dotted"
      }
    },
    
    "main":
    {
      style: {
        radius: 3,
        width: 1,
        color: "border-window"
      }
    },
    
    "pane": 
    {
      include: "input"
    },

    "selected":
    {
      style: {
        backgroundColor: "background-selected"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      DATE CHOOSER
    ---------------------------------------------------------------------------
    */

    "datechooser-date-pane":
    {
      style:
      {
        widthTop: 1,
        colorTop: "gray"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      GROUPBOX
    ---------------------------------------------------------------------------
    */
    
    "group" :
    {
      style:
      {
        radius: 3,
        width: 1,
        color: "background-selected-light",
        backgroundColor: "background-medium"
      }
    },

    /*
    ---------------------------------------------------------------------------
      IFRAME
    ---------------------------------------------------------------------------
    */

    "iframe":
    {
      include: "input"
    },
    
    /*
    ---------------------------------------------------------------------------
      LIST
    ---------------------------------------------------------------------------
    */
    
    "list-item":
    {
      style:
      {
        gradientStart: ["menu-button-start", 10],
        gradientEnd: ["menu-button-end", 90]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      MENU
    ---------------------------------------------------------------------------
    */

    "menu":
    {
      style: {
        radius: 2,
        width: 1,
        color: "border-menu",
        shadowLength: 1,
        shadowBlurRadius: 1,
        shadowColor: "shadow-button",
        gradientStart: ["menu-start", 0],
        gradientEnd: ["menu-end", 100]
      }
    },
    
    "menu-separator":
    {
      style:
      {
        widthTop: 1,
        colorTop: "gray",

        widthBottom: 1,
        colorBottom: "white"
      }
    },

    /*
    ---------------------------------------------------------------------------
      MENU BAR
    ---------------------------------------------------------------------------
    */

    "menubar":
    {
      include: "toolbar"
    },
    
    "menubar-button-hovered":
    {
      style: {
        gradientStart: ["button-start", 10],
        gradientEnd: ["button-end", 90]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      MENU-BUTTON
    ---------------------------------------------------------------------------
    */

    "menu-button":
    {
      style: {
        gradientStart: ["menu-button-start", 0],
        gradientEnd: ["menu-button-end", 100]
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      POPUP
    ---------------------------------------------------------------------------
    */

    "popup":
    {
      style:
      {
        radius: 3,
        width: 1,
        color: "border-popup",
        shadowLength: 0,
        shadowBlurRadius: 3,
        shadowColor: "shadow",
        backgroundColor: "transparent"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      PROGRESSBAR
    ---------------------------------------------------------------------------
    */

    "progressbar":
    {
	  include: "input"
    },
    
    "progressbar-progress":
    {
	  include: "scroll-knob-horizontal"
    },
    
    "progressbar-progress-disabled":
    {
	  include: "scroll-knob-horizontal-pressed"
    },
    
    /*
    ---------------------------------------------------------------------------
      PROGRESSIVE
    ---------------------------------------------------------------------------
    */

    "progressive-table-header":
    {
       style: {
         width: 1,
         color: "border-main",
         style: "solid"
       }
    },

    "progressive-table-header-cell":
    {
      style: {
        gradientStart: ["table-header-start", 10],
        gradientEnd: ["table-header-end", 90],

        widthRight: 1,
        colorRight: "progressive-table-header-border-right"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      RADIO BUTTON
    ---------------------------------------------------------------------------
    */
    
    "radiobutton":
    {
      style:
      {
        radius: 10,
        width: 1,
        color: "border-checkbox",
        gradientStart: ["checkbox-start", 0],
        gradientEnd: ["checkbox-end", 100]
      }
    },
    
    "radiobutton-checked":
    {
      style:
      {
        radius : 10,
        width: 1,
        color: "border-checkbox",
        innerWidth: 2,
        innerColor: "background-medium",
        gradientStart: ["menu-button-start", 0],
        gradientEnd: ["menu-button-end", 100]
      }
    },

    "radiobutton-focused":
    {
      include: "radiobutton",
      
      style:
      {
        color: "border-focused",
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
      }
    },
    
    "radiobutton-checked-focused":
    {
      include: "radiobutton-checked",

      style:
      {
        color: "border-focused",
        innerColor: "background-light"
      }
    },

    "radiobutton-disabled":
    {
      include: "radiobutton",
      
      style:
      {
        color: "border-disabled"
      }
    },
    
    "radiobutton-checked-disabled":
    {
      include: "radiobutton-checked",

      style:
      {
        color: "border-disabled"
      }
    },

    "radiobutton-invalid":
    {
      include: "radiobutton",
      
      style:
      {
        color: "border-invalid"
      }
    },
    
    "radiobutton-checked-invalid":
    {
      include: "radiobutton-checked",

      style:
      {
        color: "border-invalid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SCROLLBAR
    ---------------------------------------------------------------------------
    */
    
    "scrollbar-slider-horizontal":
    {
      style: 
      {
        gradientStart: ["scrollbar-slider-start", 0],
        gradientEnd: ["scrollbar-slider-end", 100]
      }
    },
    
    "scrollbar-slider-vertical":
    {
      include: "scrollbar-slider-horizontal",

      style: 
      {
        orientation: "horizontal"
      }
    },
    
    "scroll-knob-horizontal":
    {
      style: {
        gradientStart: ["scroll-knob-start", 0],
        gradientEnd: ["scroll-knob-end", 100]
      }
    },
    
    "scroll-knob-vertical":
    {
      include: "scroll-knob-horizontal",

      style:
      {
        orientation: "horizontal"
      }
    },
    
    "scroll-knob-horizontal-pressed":
    {
      style: {
        gradientStart: ["scroll-knob-pressed-start", 0],
        gradientEnd: ["scroll-knob-pressed-end", 100]
      }
    },

    "scroll-knob-vertical-pressed":
    {
      include: "scroll-knob-horizontal-pressed",

      style:
      {
        orientation: "horizontal"
      }
    },

    /*
    ---------------------------------------------------------------------------
      SEPARATOR
    ---------------------------------------------------------------------------
    */

    "separator":
    {
      include: "slider-knob-hovered"
    },

    /*
    ---------------------------------------------------------------------------
      SLIDER
    ---------------------------------------------------------------------------
    */

    "slider-horizontal":
    {
      style:
      {
        borderImage: "decoration/slider/slider-horizontal.png",
        slice: [5, 2]
      }
    },

    "slider-vertical":
    {
      style:
      {
        borderImage: "decoration/slider/slider-vertical.png",
        slice: [5, 2]
      }
    },
    
    "slider-knob-horizontal":
    {
      style: 
      {
        radius: 10,
        width: 1,
        color: "border-button",
        gradientStart: ["slider-knob-start", 0],
        gradientEnd: ["slider-knob-end", 100]
      }
    },
    
    "slider-knob-vertical":
    {
      include: "slider-knob-horizontal",
      
      style: 
      {
        orientation: "horizontal"
      }
    },
    
    "slider-knob-horizontal-pressed":
    {
      include: "slider-knob-horizontal",

      style: 
      {
        gradientStart: ["slider-knob-pressed-start", 0],
        gradientEnd: ["slider-knob-pressed-end", 100]
      }
    },
    
    "slider-knob-vertical-pressed":
    {
      include: "slider-knob-horizontal-pressed",

      style: 
      {
        orientation: "horizontal"
      }
    },
    
    "slider-knob-horizontal-invalid":
    {
      include: "slider-knob-horizontal",

      style: 
      {
        color: "border-invalid"
      }
    },
    
    "slider-knob-vertical-invalid":
    {
      include: "slider-knob-vertical",

      style: 
      {
        color: "border-invalid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SPINNER
    ---------------------------------------------------------------------------
    */
    
    "spinner-button":
    {
      include: "scroll-knob-horizontal"
    },

    "spinner-button-hovered":
    {
      include: "scroll-knob-horizontal-pressed"
    },

    "spinner-button-checked":
    {
      include: "scroll-knob-horizontal-pressed"
    },
    
    /*
    ---------------------------------------------------------------------------
      SPLITPANE
    ---------------------------------------------------------------------------
    */

    "splitter-horizontal":
    {
      style:
      {
        borderImage: "decoration/slider/slider-vertical.png",
        slice: [5, 2]
      }
    },
    
    "splitter-vertical":
    {
      style:
      {
        borderImage: "decoration/slider/slider-horizontal.png",
        slice: [5, 2]
      }
    },
	
    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */
    
    "table-statusbar":
    {
      include: "toolbar"
    },

    "table-scroller-focus-indicator":
    {
      style:
      {
        width: 2,
        color: "table-focus-indicator"
      }
    },

    "table-header":
    {
      include: "button",

      style:
      {
        radius: 0
      }
    },
    
    "table-header-cell-hovered":
    {
      include: "button-hovered",

      style:
      {
        radius: 0,
        shadowLength: 0
      }
    },

    "table-header-column-button": 
    {
      include: "table-header"
    },
    
    "table-header-column-button-hovered": 
    {
      include: "table-header-cell-hovered"
    },

    "table-header-cell":
    {
      style:
      {
        widthRight: 1,
        color: "border-header-cell"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TABVIEW
    ---------------------------------------------------------------------------
    */

	"tabview-pane":
    {
      style: 
      {
        radius: 3,
        width: 1,
        color: "border-tabview-pane",
        gradientStart: ["tabview-pane-start", 0],
        gradientEnd: ["tabview-pane-end", 100]
      }
    },

    "tabview-button-top": 
    {
      style:
      {
        radius: [3, 3, 0, 0],
        width: [0, 1, 0 , 0],
        color: "border-button",
        gradientStart: ["tabview-button-start", 10],
        gradientEnd: ["tabview-button-end", 90]
      }
    },
    
    "tabview-button-hovered-top": 
    {
      include: "tabview-button-top",
      
      style:
      {
        gradientStart: ["tabview-button-hovered-start", 10],
        gradientEnd: ["tabview-button-hovered-end", 90]
      }
    },
    
    "tabview-button-checked-top": 
    {
      include: "tabview-button-top",

      style: {
        gradientStart: ["tabview-button-checked-start", 10],
        gradientEnd: ["tabview-button-checked-end", 90]
      }
    },
    
    "tabview-button-bottom": 
    {
      include: "tabview-button-top",
      
      style:
      {
        radius: [0, 0, 3, 3]
      }
    },
    
    "tabview-button-hovered-bottom": 
    {
      include: "tabview-button-hovered-top",
      
      style:
      {
        radius: [0, 0, 3, 3]
      }
    },
    
    "tabview-button-checked-bottom": 
    {
      include: "tabview-button-checked-top",
      
      style:
      {
        radius: [0, 0, 3, 3]
      }
    },
    
    "tabview-button-left": 
    {
      include: "tabview-button-top",
      
      style:
      {
        radius: [3, 0, 0, 3],
        width: [0, 0, 1 , 0]
      }
    },
    
    "tabview-button-hovered-left": 
    {
      include: "tabview-button-hovered-top",
      
      style:
      {
        radius: [3, 0, 0, 3],
        width: [0, 0, 1 , 0]
      }
    },
    
    "tabview-button-checked-left": 
    {
      include: "tabview-button-checked-top",
      
      style:
      {
        radius: [3, 0, 0, 3],
        width: [0, 0, 1 , 0]
      }
    },
    
    "tabview-button-right": 
    {
      include: "tabview-button-top",
      
      style:
      {
        radius: [0, 3, 3, 0],
        width: [0, 0, 1 , 0]
      }
    },
    
    "tabview-button-hovered-right": 
    {
      include: "tabview-button-hovered-top",
      
      style:
      {
        radius: [0, 3, 3, 0],
        width: [0, 0, 1 , 0]
      }
    },
    
    "tabview-button-checked-right": 
    {
      include: "tabview-button-checked-top",
      
      style:
      {
        radius: [0, 3, 3, 0],
        width: [0, 0, 1 , 0]
      }
    },
    
    "tabview-bar-button":
    {
      include: "button",
      
      style:
      {
        shadowLength: 0
      }
    },
    
    "tabview-bar-button-hovered":
    {
      include: "button-hovered",
      
      style:
      {
        shadowLength: 0
      }
    },
    
    "tabview-bar-button-pressed":
    {
      include: "button-pressed"
    },

	
    /*
    ---------------------------------------------------------------------------
      TEXT FIELD
    ---------------------------------------------------------------------------
    */

    "input":
    {
      style:
      {
        radius: 3,
        width: 1,
        color: "border-light", 
        backgroundColor: "background-light"
      }
    },
    
    "input-focused":
    {
	  include: "input",
	  
      style:
      {
        color: "border-focused",
        gradientStart: ["input-focused-start", 0],
        gradientEnd: ["input-focused-end", 100]
      }
    },
    
    "input-invalid":
    {
	  include: "input",
	  
      style:
      {
        color: "border-invalid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TOOLBAR
    ---------------------------------------------------------------------------
    */

    "toolbar":
    {
      style: {
        widthBottom: 1,
        colorBottom: "border-toolbar",
        gradientStart: ["toolbar-start", 10],
        gradientEnd: ["toolbar-end", 90]
      }
    },
    
    "toolbar-button":
    {
      style:
      {
        radius: 2,
        gradientStart: ["transparent", 0],
        gradientEnd: ["transparent", 100]
      }
    },
    
    "toolbar-button-hovered":
    {
      style:
      {
        radius: 2,
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
      }
    },
    
    "toolbar-button-pressed":
    {
      include: "button-pressed"
    },
    
    "toolbar-splitbutton-left":
    {
      include: "toolbar-button"
    },
    
    "toolbar-splitbutton-left-hovered":
    {
      include: "toolbar-button-hovered",
      
      style:
      {
        radius: [2, 0, 2, 0]
      }
    },
    
    "toolbar-splitbutton-left-pressed":
    {
      include: "toolbar-button-pressed",
      
      style:
      {
        radius: [2, 0, 2, 0]
      }
    },
    
    "toolbar-splitbutton-right":
    {
      include: "toolbar-button"
    },
    
    "toolbar-splitbutton-right-hovered":
    {
      include: "toolbar-button-hovered",
      
      style:
      {
        radius: [0, 2, 0, 2]
      }
    },
    
    "toolbar-splitbutton-right-pressed":
    {
      include: "toolbar-button-pressed",
      
      style:
      {
        radius: [0, 2, 0, 2]
      }
    },
    
    "toolbar-separator":
    {
      style:
      {
        widthLeft: 1,
        widthRight: 1,

        colorLeft: "border-toolbar-separator-left",
        colorRight: "border-toolbar-separator-right"
      }
    },
    
    "toolbar-part":
    {
      style:
      {
        backgroundImage: "decoration/toolbar/toolbar-part.png",
        backgroundRepeat: "repeat-y"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TOOLTIP
    ---------------------------------------------------------------------------
    */
    
    "tooltip-error":
    {
      style: {
        radius: 5,
        backgroundColor: "text-invalid"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      VIRTUAL WIDGETS
    ---------------------------------------------------------------------------
    */

    "group-item":
    {
      style: {
        startColor: "groupitem-start",
        endColor: "groupitem-end",
        startColorPosition: 0,
        endColorPosition: 100
        
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      WINDOW
    ---------------------------------------------------------------------------
    */
    
    "window-active":
    {
      style: {
        radius: 4,
        width: 1,
        color: "border-window",
        shadowLength: 1,
        shadowBlurRadius: 10,
        shadowColor: "shadow"
      }
    },
    
    "window-inactive":
    {
      include: "window-active",
      
      style: 
      {
        shadowBlurRadius: 5
      }
    },
    
    "window-captionbar-active":
    {
      style:
      {
		gradientStart: ["window-caption-active-start", 10],
        gradientEnd: ["window-caption-active-end", 90]
      }
    },
	
	"window-captionbar-inactive":
    {
      style:
      {
		gradientStart: ["window-caption-inactive-start", 10],
        gradientEnd: ["window-caption-inactive-end", 90]
      }
    },
	
	"window-statusbar":
    {
	  include: "toolbar"
    },
    
    "window-button":
    {
      // include: "button",
      
      style: {
        shadowColor: "shadow",
        shadowBlurRadius: 1,
        shadowLength: 0,
        width: 1,
        // color: "border-button",
        color: "#323232",
        innerWidth: 1,
        // innerColorTop: "border-button-inner",
        innerColorTop: "#525252",
        
        radius: 15,
        startColor: "transparent",
        // endColor: "black",
        endColor: "#FFFFFF",
        startColorPosition: 0,
        endColorPosition: 100
      }
    },
    
    "window-button-hovered":
    {
      include: "window-button",
      
      style: {
        // color: "transparent",
        shadowBlurRadius: 3
      }
    },
    
    "window-button-inactive":
    {
      include: "window-button",
      
      style: {
        endColor: "inactive-button"
      }
    },
    
    "minimize-button":
    {
      include: "window-button",
      
      style: {
        endColor: "minimize-button"
      }
    },
    
    "minimize-button-hovered":
    {
      include: "window-button-hovered",
      
      style: {
        shadowColor: "minimize-button-hovered",
        endColor: "minimize-button-hovered"
      }
    },
    
    "maximize-button":
    {
      include: "window-button",
      
      style: {
        endColor: "maximize-button"
      }
    },
    
    "maximize-button-hovered":
    {
      include: "window-button-hovered",
      
      style: {
        shadowColor: "maximize-button-hovered",
        endColor: "maximize-button-hovered"
      }
    },
    
    "restore-button":
    {
      include: "window-button",
      
      style: {
        endColor: "restore-button"
      }
    },
    
    "restore-button-hovered":
    {
      include: "window-button-hovered",
      
      style: {
        shadowColor: "restore-button-hovered",
        endColor: "restore-button-hovered"
      }
    },
    
    "close-button":
    {
      include: "window-button",
      
      style: {
        endColor: "close-button"
      }
    },
    
    "close-button-hovered":
    {
      include: "window-button-hovered",
      
      style: {
        // shadowColor: "close-button-hovered",
        shadowColor: "close-button",
        // endColor: "close-button-hovered"
        endColor: "close-button"
      }
    }
    
  }
});
