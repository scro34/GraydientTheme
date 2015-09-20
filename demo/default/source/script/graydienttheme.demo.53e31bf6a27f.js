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
        //~ backgroundImage: "decoration/application/app-background.png",
        //~ backgroundRepeat: "repeat"
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
        shadowLength: 1,
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
    
    "combobox-button":
    {
      style: 
      {
        radius: 2,
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
        shadowLength: 2,
        shadowBlurRadius: 5,
        shadowColor: "shadow",
        backgroundColor: "red"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      PROGRESSBAR
    ---------------------------------------------------------------------------
    */

    "progressbar":
    {
	  include: "scrollbar-horizontal",
	  
      style: {
        width: 1,
        color: "border-frame"
      }
    },
    
    "progressbar-progress":
    {
	  include: "scrollbar-slider-horizontal-hovered"
    },
    
    "progressbar-progress-disabled":
    {
	  include: "scrollbar-slider-horizontal"
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
      style: {
        backgroundImage: "decoration/form/slider-horizontal.png",
        backgroundRepeat: "repeat-x"
      }
    },
    
    "slider-vertical":
    {
      style: {
        backgroundImage: "decoration/form/slider-vertical.png",
        backgroundRepeat: "repeat-y"
      }
    },
    
    "slider-knob":
    {
      style: {
        backgroundImage: "decoration/form/slider-knob.png"
      }
    },
    
    "slider-knob-hovered":
    {
      style: {
        backgroundImage: "decoration/form/slider-knob-hovered.png"
      }
    },
    
    "slider-knob-pressed":
    {
      style: {
        backgroundImage: "decoration/form/slider-knob-hovered.png"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SPINNER
    ---------------------------------------------------------------------------
    */
    
    "spinner-button":
    {
      style:
      {
        backgroundImage: "decoration/button/spinner-button.png",
      
        widthLeft: 1,
        colorLeft: "border-frame",
        styleLeft: "solid"
      }
    },

    "spinner-button-hovered":
    {
	  include: "spinner-button",
	  
      style:
      {
        backgroundImage: "decoration/button/spinner-button-hovered.png"
      }
    },

    "spinner-button-checked":
    {
	  include: "spinner-button",
	  
      style:
      {
        backgroundImage: "decoration/button/spinner-button-hovered.png"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      SPLITPANE
    ---------------------------------------------------------------------------
    */

    "splitpane":
    {
      style:
      {
        backgroundColor: "background-pane",

        width: 1,
        color: "background-splitpane"
      }
    },

    "splitter-horizontal":
    {
      style:
      {
        borderImage: "decoration/form/slider-vertical.png",
        slice: [2, 6]
      }
    },

    "splitter-vertical":
    {
      style:
      {
        borderImage: "decoration/form/slider-horizontal.png",
        slice: [6, 2]
      }
    },
    
    "splitpane-knob":
    {
	  style:
	  {
		backgroundImage: "decoration/button/knob-vertical.png",
		backgroundRepeat: "no-repeat"
	  }
	},
	
    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */
    
    "table":
    {
      style:
      {
        width: 1,
        color: "border-main"
      }
    },

    "table-statusbar":
    {
      style:
      {
        widthTop: 1,
        colorTop: "border-table-statusbar-top"
      }
    },

    "table-scroller-header":
    {
      style:
      {
        backgroundImage: "decoration/table/header-cell.png",
        backgroundRepeat: "scale",

        widthBottom: 1,
        colorBottom: "border-main"
      }
    },

    "table-scroller-header-hovered":
    {
      style:
      {
        backgroundImage: "decoration/table/header-cell-hovered.png",
        backgroundRepeat: "scale",

        widthBottom: 1,
        colorBottom: "border-main"
      }
    },

    "table-header-cell":
    {
      style:
      {
        widthRight: 1,
        colorRight: "border-separator",

        widthBottom: 1,
        colorBottom: "border-separator"
      }
    },

    "table-header-cell-hovered":
    {
      style:
      {
        backgroundImage: "decoration/table/header-cell-hovered.png",
        backgroundRepeat: "scale",

        widthRight: 1,
        colorRight: "border-separator",

        widthBottom: 1,
        colorBottom: "border-separator"
      }
    },

    "table-column-button":
    {
      style:
      {
        backgroundImage: "decoration/table/header-cell.png",
        backgroundRepeat: "scale",

        widthBottom: 1,
        colorBottom: "border-main"
      }
    },

    "table-scroller-focus-indicator":
    {
      style:
      {
        width: 2,
        color: "table-focus-indicator"
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
      style:
      {
		widthTop: 1,
		colorTop: "border-toolbar-top",

		widthBottom: 1,
		colorBottom: "border-toolbar-bottom",
		
		backgroundRepeat: "scale"
      }
    },
    
    "toolbar-silver":
    {
	  include: "toolbar",
	  
      style:
      {
		backgroundImage: "decoration/toolbar/toolbar-gradient.png"
      }
    },

    "toolbar-blue":
    {
	  include: "toolbar",
	  
      style:
      {
		backgroundImage: "decoration/toolbar/toolbar-blue.png"
      }
    },

	"toolbar-black":
    {
	  include: "toolbar",
	  
      style:
      {
		backgroundImage: "decoration/toolbar/toolbar-black.png"
      }
    },

	"toolbar-button":
    {
      style:
      {
		width: [5, 2, 1, 2],
		color: "transparent"
      }
    },

	"toolbar-button-hovered":
    {
      style:
      {
		borderImage: "decoration/toolbar/toolbar-button-hovered.png",
		slice: [5, 2, 1, 2]
      }
    },

	"toolbar-button-checked":
    {
      style:
      {
		borderImage: "decoration/toolbar/toolbar-button-checked.png",
		slice: [5, 2, 1, 2]
      }
    },

	"toolbar-separator":
    {
      style :
      {
        widthLeft : 1,
		colorLeft: "#727272",

        widthRight : 1,
		colorRight: "#F5F5F5"
      }
	},

	"toolbar-part" :
    {
      style :
      {
        backgroundImage  : "decoration/toolbar/toolbar-part.gif",
        backgroundRepeat : "repeat-y"
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
        backgroundColor: "tooltip-error",
        radius: 4,
        shadowColor: "shadow",
        shadowBlurRadius: 2,
        shadowLength: 1
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
        shadowBlurRadius: 5,
        shadowColor: "shadow"
      }
    },
    
    "window-inactive":
    {
      include: "window-active",
      
      style: 
      {
        shadowBlurRadius: 3
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
    }
    
  }
});
