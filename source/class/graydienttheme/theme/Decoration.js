/* ************************************************************************

   Copyright:
     2011-2015 Norbert Schröder

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
        backgroundImage: "decoration/application/app-background.png",
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
        radius: 3,
        width: 1,
        color: "border-button",
        innerWidth: 1,
        innerColor: "transparent",
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
        color: "border-button-checked",
        inset: true,
        gradientStart: ["button-checked-start", 0],
        gradientEnd: ["button-checked-end", 100]
      }
    },
    
    "button-focused": 
    {
      include: "button-hovered",
      
      style: {
        color: "border-focused"
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
      include: "button-checked",
      
      style: {
        color: "border-focused"
      }
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
	
	"combobox-focused":
    {
	  include: "input-focused",
	  
	  style:
	  {
		radius: [2, 0, 0, 2],
		colorRight: "transparent"
	  }
	},
	
	"combobox-invalid":
    {
	  include: "input-invalid",
	  
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
        color: "border-button",
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
    
    "combobox-button-focused":
    {
      include: "combobox-button-hovered",

      style: 
      {
        color: "border-focused"
      }
    },
    
    "combobox-button-pressed":
    {
      include: "combobox-button",
      
      style:
      {
        gradientStart: ["button-checked-start", 0],
        gradientEnd: ["button-checked-end", 100]
      }
    },
    
    "combobox-button-invalid":
    {
      include: "combobox-button",
      
      style:
      {
        color: "border-invalid"
      }
    },
    
    "combobox-popup":
    {
      include: "list",
      
      style:
      {
        shadowLength: 0,
        shadowBlurRadius: 5,
        shadowColor: "shadow-menu"
      }
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
    
    "group-box" :
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
    
    "list":
    {
      style: {
        radius: 2,
        width: 1,
        color: "border-list"
      }
    },
    
    "list-focused":
    {
	  include: "list",
	  
      style: {
        color: "border-focused"
      }
    },
    
    "list-invalid":
    {
	  include: "list",
	  
      style: {
        color: "border-invalid"
      }
    },
    
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
        shadowLength: 0,
        shadowBlurRadius: 3,
        shadowColor: "shadow-inactive",
        gradientStart: ["background-menu", 0],
        gradientEnd: ["background-menu", 100]
      }
    },
    
    "menu-separator":
    {
      style:
      {
        widthTop: 1,
        colorTop: "border-menu-separator-top",

        widthBottom: 1,
        colorBottom: "border-menu-separator-bottom"
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
        gradientStart: ["button-hovered-start", 10],
        gradientEnd: ["button-hovered-end", 90]
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
	  include: "input",
	  
	  style:
      {
        color: "border-progressbar",
        colorTop: "border-progressbar-top"
      }
    },
    
    "progressbar-progress":
    {
	  include: "scroll-knob-horizontal",
	  
	  style:
      {
		radius: 0,
		color: "border-progressbar",
		gradientStart: ["progressbar-start", 0],
        gradientEnd: ["progressbar-end", 100]
      }
    },
    
    "progressbar-progress-disabled":
    {
	  include: "scroll-knob-horizontal-pressed",
	  
	  style:
      {
		radius: 0
	  }
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
      SPLITBUTTON
    ---------------------------------------------------------------------------
    */
    
    "splitbutton":
    {
      include: "button",
      
      style: 
      {
        radius: [2, 0, 0, 2]
      }
    },
    
    "splitbutton-hovered":
    {
      include: "button-hovered",
      
      style: 
      {
        radius: [2, 0, 0, 2]
      }
    },
    
    "splitbutton-pressed":
    {
      include: "button-pressed",
      
      style: 
      {
        radius: [2, 0, 0, 2]
      }
    },
    
    "splitbutton-focused":
    {
      include: "button-focused",
      
      style: 
      {
        radius: [2, 0, 0, 2]
      }
    },
    
    "splitbutton-arrow":
    {
      include: "button",
      
      style: 
      {
        radius: [0, 2, 2, 0]
      }
    },
    
    "splitbutton-arrow-hovered":
    {
      include: "button-hovered",
      
      style: 
      {
        radius: [0, 2, 2, 0]
      }
    },
    
    "splitbutton-arrow-pressed":
    {
      include: "button-pressed",
      
      style: 
      {
        radius: [0, 2, 2, 0]
      }
    },
    
    "splitbutton-arrow-focused":
    {
      include: "button-focused",
      
      style: 
      {
        radius: [0, 2, 2, 0]
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
        radius: 15,
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
        radius: 15,
        width: 1,
        color: "border-button",
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
      include: "scroll-knob-horizontal",
      
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
        backgroundImage: "decoration/slider/slider-horizontal.png",
        backgroundRepeat: "repeat-x"
      }
    },

    "slider-vertical":
    {
      style:
      {
        backgroundImage: "decoration/slider/slider-vertical.png",
        backgroundRepeat: "repeat-y"
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
    
    "slider-knob-horizontal-focused":
    {
	  include: "slider-knob-horizontal",
	  
      style: 
      {
        color: "border-focused"
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
    
    "slider-knob-horizontal-invalid":
    {
      include: "slider-knob-horizontal",

      style: 
      {
        color: "border-invalid"
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
    
     "slider-knob-vertical-focused":
    {
	  include: "slider-knob-vertical",
	  
      style: 
      {
        color: "border-focused"
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
      include: "scroll-knob-horizontal",
      
      style: 
      {
        radius: 1
      }
    },

    "spinner-button-hovered":
    {
      include: "scroll-knob-horizontal-pressed",
      
      style: 
      {
        radius: 1
      }
    },

    "spinner-button-checked":
    {
      include: "scroll-knob-horizontal-pressed",
      
      style: 
      {
        radius: 1
      }
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
        backgroundImage: "decoration/splitpane/splitter-vertical.png",
        backgroundRepeat: "repeat-y"
      }
    },
    
    "splitter-vertical":
    {
      style:
      {
        backgroundImage: "decoration/splitpane/splitter-horizontal.png",
        backgroundRepeat: "repeat-x"
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
      style:
      {
        gradientStart: ["table-header-start", 0],
        gradientEnd: ["table-header-end", 100]
      }
    },
    
    "table-header-cell":
    {
      style:
      {
        widthRight: 1,
        color: "border-header-cell"
      }
    },
    
    "table-header-cell-hovered":
    {
      include: "table-header-cell",

      style:
      {
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
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
        width: [1, 1, 0 , 0],
        color: "border-button",
        gradientStart: ["tabview-button-start", 10],
        gradientEnd: ["tabview-button-end", 90]
      }
    },
    
    "tabview-button-top-first": 
    {
	  include: "tabview-button-top",
	  
      style:
      {
        width: [1, 1, 0 , 1]
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
    
    "tabview-button-hovered-top-first": 
    {
      include: "tabview-button-hovered-top",

      style: {
        width: [1, 1, 0 , 1]
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
    
    "tabview-button-checked-top-first": 
    {
      include: "tabview-button-checked-top",

      style: {
        width: [1, 1, 0 , 1]
      }
    },
    
    "tabview-button-bottom": 
    {
      include: "tabview-button-top",
      
      style:
      {
        radius: [0, 0, 3, 3],
        width: [0, 1, 1 , 0]
      }
    },
    
    "tabview-button-bottom-first": 
    {
      include: "tabview-button-bottom",
      
      style:
      {
        width: [0, 1, 1 , 1]
      }
    },
    
    "tabview-button-hovered-bottom": 
    {
      include: "tabview-button-hovered-top",
      
      style:
      {
        radius: [0, 0, 3, 3],
        width: [0, 1, 1 , 0]
      }
    },
    
    "tabview-button-hovered-bottom-first": 
    {
      include: "tabview-button-hovered-bottom",
      
      style:
      {
        width: [0, 1, 1 , 1]
      }
    },
    
    "tabview-button-checked-bottom": 
    {
      include: "tabview-button-checked-top",
      
      style:
      {
        radius: [0, 0, 3, 3],
        width: [0, 1, 1 , 0]
      }
    },
    
    "tabview-button-checked-bottom-first": 
    {
      include: "tabview-button-checked-bottom",
      
      style:
      {
        width: [0, 1, 1 , 1]
      }
    },
    
    "tabview-button-left": 
    {
      include: "tabview-button-top",
      
      style:
      {
        radius: [3, 0, 0, 3],
        width: [0, 0, 1 , 1]
      }
    },
    
    "tabview-button-left-first": 
    {
      include: "tabview-button-left",
      
      style:
      {
        width: [1, 0, 1 , 1]
      }
    },
    
    "tabview-button-hovered-left": 
    {
      include: "tabview-button-hovered-top",
      
      style:
      {
        radius: [3, 0, 0, 3],
        width: [0, 0, 1 , 1]
      }
    },
    
    "tabview-button-hovered-left-first": 
    {
      include: "tabview-button-hovered-left",
      
      style:
      {
        width: [1, 0, 1 , 1]
      }
    },
    
    "tabview-button-checked-left": 
    {
      include: "tabview-button-checked-top",
      
      style:
      {
        radius: [3, 0, 0, 3],
        width: [0, 0, 1 , 1]
      }
    },
    
    "tabview-button-checked-left-first": 
    {
      include: "tabview-button-checked-top-first",
      
      style:
      {
        width: [1, 0, 1 , 1]
      }
    },
    
    "tabview-button-right": 
    {
      include: "tabview-button-top",
      
      style:
      {
        radius: [0, 3, 3, 0],
        width: [0, 1, 1, 0]
      }
    },
    
    "tabview-button-right-first": 
    {
      include: "tabview-button-right",
      
      style:
      {
        width: [1, 1, 1, 0]
      }
    },
    
    "tabview-button-hovered-right": 
    {
      include: "tabview-button-hovered-top",
      
      style:
      {
        radius: [0, 3, 3, 0],
        width: [0, 1, 1, 0]
      }
    },
    
    "tabview-button-hovered-right-first": 
    {
      include: "tabview-button-hovered-right",
      
      style:
      {
        width: [1, 1, 1, 0]
      }
    },
    
    "tabview-button-checked-right": 
    {
      include: "tabview-button-checked-top",
      
      style:
      {
        radius: [0, 3, 3, 0],
        width: [0, 1, 1, 0]
      }
    },
    
    "tabview-button-checked-right-first": 
    {
      include: "tabview-button-checked-right",
      
      style:
      {
        width: [1, 1, 1, 0]
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
        color: "border-input", 
        backgroundColor: "background-light",
        shadowLength: 0,
        shadowBlurRadius: 1,
        shadowColor: "transparent",
        inset: true
      }
    },
    
    "input-focused":
    {
	  include: "input",
	  
      style:
      {
        color: "border-focused",
        shadowColor: "shadow",
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
        width: 1,
        color: "transparent",
        gradientStart: ["transparent", 0],
        gradientEnd: ["transparent", 100]
      }
    },
    
    "toolbar-button-hovered":
    {
      include: "toolbar-button",
      
      style:
      {
        gradientStart: ["button-hovered-start", 0],
        gradientEnd: ["button-hovered-end", 100]
      }
    },
    
    "toolbar-button-pressed":
    {
      style:
      {
        radius: 2,
        width: 1,
        color: "border-button",
        gradientStart: ["button-checked-start", 0],
        gradientEnd: ["button-checked-end", 100]
      }
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
        shadowLength: 0,
        shadowBlurRadius: 10,
        shadowColor: "shadow"
      }
    },
    
    "window-inactive":
    {
      include: "window-active",
      
      style: 
      {
        shadowColor: "shadow-inactive",
        shadowBlurRadius: 5
      }
    },
    
    "window-captionbar-active":
    {
      style:
      {
        widthTop: 1,
        colorTop: "border-captionbar-active-top",
        gradientStart: ["window-caption-active-start", 10],
        gradientEnd: ["window-caption-active-end", 90]
      }
    },
	
	"window-captionbar-inactive":
    {
      style:
      {
        widthTop: 1,
        colorTop: "border-captionbar-inactive-top",
		gradientStart: ["window-caption-inactive-start", 10],
        gradientEnd: ["window-caption-inactive-end", 90]
      }
    },
	
	"window-statusbar":
    {
	  include: "toolbar",
	  
	  style:
      {
        widthTop: 1,
        colorTop: "border-window"
      }
    },
    
    "window-button":
    {
      style: {
        shadowColor: "shadow-window-button",
        shadowBlurRadius: 1,
        shadowLength: 0,
        width: 1,
        color: "border-window-button",
        innerWidth: 1,
        innerColorTop: "border-window-button-inner",
        
        radius: 15,
        startColor: "window-button-start",
        endColor: "window-button-end",
        startColorPosition: 0,
        endColorPosition: 100
      }
    },
    
    "window-button-hovered":
    {
      include: "window-button",
      
      style: {
        shadowBlurRadius: 5
      }
    },
    
    "window-button-inactive":
    {
      include: "window-button",
      
      style: {
        shadowBlurRadius: 0,
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
        endColor: "maximize-button"
      }
    },
    
    "restore-button-hovered":
    {
      include: "window-button-hovered",
      
      style: {
        shadowColor: "maximize-button-hovered",
        endColor: "maximize-button-hovered"
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
        shadowColor: "close-button",
        endColor: "close-button-hovered"
      }
    }
    
  }
});
