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
		innerWidth: 2,
		innerColor: "transparent",
		
        borderImage: "decoration/button/button.png",
        slice: 2
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
        borderImage: "decoration/button/button-hovered.png"
      }
    },

    "button-checked":
    {
      include: "button",
      
      style: {
        borderImage: "decoration/button/button-checked.png"
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
      COMBOBOX
    ---------------------------------------------------------------------------
    */
    
    "combobox":
    {
      style: {
        borderImage: "decoration/form/combobox.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "combobox-focused":
    {
      style: {
        borderImage: "decoration/form/combobox-focused.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "combobox-disabled":
    {
      style: {
        borderImage: "decoration/form/combobox-disabled.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "combobox-invalid":
    {
      style: {
        borderImage: "decoration/form/combobox-invalid.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "combobox-button":
    {
      style: {
        borderImage: "decoration/form/combobox-button.png",
        slice: 2
      }
    },
    
    "combobox-button-hovered":
    {
      style: {
        borderImage: "decoration/form/combobox-button-hovered.png",
        slice: 2
      }
    },

	"combobox-button-checked":
    {
      style: {
        borderImage: "decoration/form/combobox-button-checked.png",
        slice: [3, 2, 2, 2]
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
      GROUPBOX
    ---------------------------------------------------------------------------
    */
    
    "group":
    {
      style:
      {
        borderImage: "decoration/boxes/box-silver.png",
        slice: 4
      }
    },
    
    "group-focused":
    {
      style:
      {
        borderImage: "decoration/form/groupbox-focused.png",
        slice: 4
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
      style : {
		shadowColor: "shadow",
		shadowBlurRadius: 6,
		shadowLength: 0,
		
        borderImage : "decoration/form/list.png",
        slice: 2
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      MENU
    ---------------------------------------------------------------------------
    */

    "menu" :
    {
      style:
      {
		radius: 3,
		width: 1,
		color: "border-menu",
		shadowColor: "shadow",
		shadowBlurRadius: 5,
		shadowLength: 0
      }
    },
    
    "menu-button-selected" :
    {
      style:
      {
        backgroundImage: "decoration/menu/button-selected.png",
        backgroundRepeat: "scale"
      }
    },
    
    "menu-button-red" :
    {
      style:
      {
        backgroundImage: "decoration/menu/button-red.png",
        backgroundRepeat: "scale"
      }
    },
    
    "menu-separator" :
    {
      style:
      {
        widthTop    : 1,
        colorTop    : "border-menu-separator-top",

        widthBottom : 1,
        colorBottom : "border-menu-separator-bottom"
      }
    },

    /*
    ---------------------------------------------------------------------------
      MENU BAR
    ---------------------------------------------------------------------------
    */

    "menubar":
    {
      style: {
        backgroundImage: "decoration/bar/background.png",
		backgroundRepeat: "scale"
      }
    },
    
    "menubar-selected":
    {
      style:
      {
	    backgroundImage: "decoration/bar/background-selected.png",
		backgroundRepeat: "scale"
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      POPUP
    ---------------------------------------------------------------------------
    */

    "popup":
    {
	  include: "input"
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
      SCROLLBAR
    ---------------------------------------------------------------------------
    */
    
    "scrollbar-horizontal" :
    {
	  style:
	  {
		backgroundImage: "decoration/scrollbar/scrollbar-bg-horizontal.png"
	  }
    },

    "scrollbar-vertical" :
    {
	  style:
	  {
		backgroundImage: "decoration/scrollbar/scrollbar-bg-vertical.png"
	  }
    },

    "scrollbar-button-horizontal":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-horizontal.png"
      }
    },

    "scrollbar-button-horizontal-hovered":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-horizontal-hovered.png"
      }
    },

    "scrollbar-button-vertical":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-vertical.png"
      }
    },

    "scrollbar-button-vertical-hovered":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-vertical-hovered.png"
      }
    },

    "scrollbar-slider-horizontal":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-horizontal.png"
      }
    },

    "scrollbar-slider-horizontal-hovered":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-horizontal-hovered.png"
      }
    },

    "scrollbar-slider-vertical":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-vertical.png"
      }
    },

    "scrollbar-slider-vertical-hovered":
    {
      style:
      {
        backgroundImage: "decoration/scrollbar/scrollbar-button-vertical-hovered.png"
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
      SLIDEBAR
    ---------------------------------------------------------------------------
    */
    
    "slidebar-button":
    {
      include: "tabview-page-button-inactive"
    },
    
    "slidebar-button-hovered":
    {
      include: "tabview-page-button-hovered"
    },
    
    "slidebar-button-pressed":
    {
      include: "button-checked"
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
        borderImage: "decoration/boxes/box-gradient.png",
        slice: 4
      }
    },

	"tabview-page-button-horizontal":
    {
      style:
      {
		widthRight: 1,
		colorRight: "silver"
      }
    },

	"tabview-page-button-vertical":
    {
      style:
      {
		widthBottom: 1,
		colorBottom: "silver"
      }
    },

	"tabview-page-button-horizontal-hovered":
    {
	  include: "tabview-page-button-horizontal",
	  
      style:
      {
		backgroundImage: "decoration/menu/selected.png",
		backgroundRepeat: "scale"
      }
    },

	"tabview-page-button-vertical-hovered":
    {
	  include: "tabview-page-button-vertical",
	  
      style:
      {
		backgroundImage: "decoration/menu/selected.png",
		backgroundRepeat: "scale"
      }
    },

	"tabview-page-button-checked":
    {
      style:
      {
		backgroundImage: "decoration/menu/selected.png",
		backgroundRepeat: "scale",

		width: 1,
		colorTop: "#323232",
		colorLeft: "#323232",
		colorBottom: "#929292",
		colorRight: "#929292"
      }
    },

	"tabview-page-button-top-active":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-top-active.png",
        slice: 3
      }
    },

    "tabview-page-button-top-inactive":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-top-inactive.png",
        slice: 3
      }
    },

	"tabview-page-button-top-hovered":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-top-hovered.png",
        slice: 3
      }
    },

    "tabview-page-button-bottom-active":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-bottom-active.png",
        slice: 3
      }
    },

    "tabview-page-button-bottom-inactive":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-bottom-inactive.png",
        slice: 3
      }
    },

	"tabview-page-button-bottom-hovered":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-bottom-hovered.png",
        slice: 3
      }
    },

    "tabview-page-button-left-active":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-left-active.png",
        slice: 3
      }
    },

    "tabview-page-button-left-inactive":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-left-inactive.png",
        slice: 3
      }
    },

	"tabview-page-button-left-hovered":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-left-hovered.png",
        slice: 3
      }
    },

    "tabview-page-button-right-active":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-right-active.png",
        slice: 3
      }
    },

    "tabview-page-button-right-inactive":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-right-inactive.png",
        slice: 3
      }
    },

	"tabview-page-button-right-hovered":
    {
      style: {
        borderImage: "decoration/tabview/tab-button-right-hovered.png",
        slice: 3
      }
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
        borderImage: "decoration/boxes/box-white.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "input-focused":
    {
      style:
      {
        borderImage: "decoration/boxes/box-blue.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "input-disabled":
    {
      style:
      {
        borderImage: "decoration/boxes/box-disabled.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "input-error":
    {
      style:
      {
        borderImage: "decoration/boxes/box-red.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "input-invalid":
    {
      style:
      {
        borderImage: "decoration/boxes/box-red.png",
        slice: [4, 2, 2, 2]
      }
    },
    
    "input-focused-invalid":
    {
      style:
      {
        borderImage: "decoration/boxes/box-red.png",
        slice: [4, 2, 2, 2]
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
        radius: 5,
        width: 1,
        color: "border-window",
        shadowBlurRadius: 10,
        shadowLength: 0,
        shadowColor: "shadow-window",
        backgroundImage: "decoration/window/window-pane.png",
        backgroundRepeat: "scale"
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
		backgroundImage: "decoration/window/captionbar-active.png",
        backgroundRepeat: "scale",
        
        widthTop: 1,
        colorTop: "border-captionbar-active-top",
        
        widthBottom: 1,
        colorBottom: "border-captionbar-active-bottom",
        
        innerWidthBottom: 1,
        innerColorBottom: "border-captionbar-active-bottom-inner"
      }
    },
	
	"window-captionbar-inactive":
    {
      style:
      {
		backgroundImage: "decoration/window/captionbar-inactive.png",
        backgroundRepeat: "scale",
        
        widthTop: 1,
        colorTop: "border-captionbar-inactive-top",
        
        widthBottom: 1,
        colorBottom: "border-captionbar-inactive-bottom",
        
        innerWidthBottom: 1,
        innerColorBottom: "border-captionbar-inactive-bottom-inner"
      }
    },
	
	"window-statusbar" :
    {
      style: {
        backgroundImage : "decoration/window/statusbar.png",
        backgroundRepeat: "scale",
        
        widthTop: 1,
        colorTop: "border-statusbar-top",
        innerWidthTop: 1,
        innerColorTop: "border-statusbar-top-inner"
      }
    }
    
  }
});
