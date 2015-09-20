/* ************************************************************************

   Copyright:
     2010-2015 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

/**
 * The GraydientTheme appearance theme.
 *
 * @asset(graydienttheme/*)
 * 
 * @asset(qx/icon/Oxygen/16/mimetypes/office-document.png)
 * @asset(qx/icon/Oxygen/16/places/folder.png)
 * @asset(qx/icon/Oxygen/16/places/folder-open.png)
 * @asset(qx/icon/Oxygen/22/mimetypes/office-document.png)
 * @asset(qx/icon/Oxygen/22/places/folder.png)
 * @asset(qx/icon/Oxygen/22/places/folder-open.png)
 * @asset(qx/icon/Oxygen/32/mimetypes/office-document.png)
 * @asset(qx/icon/Oxygen/32/places/folder.png)
 * @asset(qx/icon/Oxygen/32/places/folder-open.png)
 * 
 */
 
qx.Theme.define("graydienttheme.theme.Appearance",
{
  aliases: {
    decoration: "graydienttheme/decoration"
  },
  
  appearances:
  {
    /*
    ---------------------------------------------------------------------------
      APPLICATION
    ---------------------------------------------------------------------------
    */

    "app-header":
    {
      style: function(states)
      {
        return {
          font: "bold",
          textColor: "text-app-header",
          padding: [8, 12],
          decorator: "app-header"
        };
      }
    },

    "app-header-label": "label",

    "app-splitpane":
    {
      alias: "splitpane",
      
      style: function(states)
      {
        return {
          padding: 0
        };
      }
    },
    
    "app-logo":
    {
      include: "app-header",
      
      style: function(states)
      {
        return {
          font: "headline",
          decorator: "app-logo"
        }
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      BUTTON
    ---------------------------------------------------------------------------
    */

    "button-frame" :
    {
      alias: "atom",

      style: function(states)
      {
        var decorator = "button";
        var margin = 2;

        if (states.invalid && !states.disabled) {
          decorator += "-invalid";
        } else if ((states.hovered || states.focused) && !states.pressed && !states.checked) {
          decorator += "-hovered";
        } else if (states.pressed || states.checked) {
          decorator += "-pressed";
        }

        return {
          decorator: decorator,
          padding: states.pressed || states.checked || states.invalid ? [2, 6, 2, 8] : [3, 8, 3, 8],
          margin: margin,
          cursor: states.disabled ? undefined : "pointer",
          minWidth: 5,
          minHeight: 5
        };
      }
    },

    "button-frame/image":
    {
      style: function(states)
      {
        return {
          opacity: !states.replacement && states.disabled ? 0.5 : 1
        };
      }
    },
    
    "button-frame/label": 
    {
      alias: "atom/label",

      style: function(states)
      {
        return {
          textColor: states.disabled ? "text-disabled" : undefined
        };
      }
    },

    "button":
    {
      alias: "button-frame",
      include: "button-frame",

      style: function(states)
      {
        return {
		  cursor: states.disabled ? "default" : "pointer",
          center: true
        };
      }
    },
    
    "hover-button":
    {
      alias: "atom",
      include: "atom",

      style: function(states)
      {
        return {
          decorator: states.hovered ? "selected" : undefined,
          textColor: states.hovered ? "text-highlight" : undefined
        };
      }
    },

    "menubutton": 
    {
      include: "button",
      alias: "button",

      style: function(states)
      {
        return {
          icon: states.selected || states.hovered || states.focused ? 
            "decoration/arrows/down-selected.png" : "decoration/arrows/down-invert.png",
          iconPosition: "right"
        };
      }
    },
    
    "spinner-button":
    {
      alias: "atom",

      style: function(states)
      {
        return {
          padding: states.pressed || states.checked || (states.checked && states.disabled) ? 
                     [1, 5, 0, 5] : [0, 5, 1, 5],
          decorator: states.pressed || states.checked ?
                        "spinner-button-checked" :
                     states.hovered && !states.disabled ?
                        "spinner-button-hovered" : "spinner-button",
          textColor: "text-button"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      SPLITBUTTON
    ---------------------------------------------------------------------------
    */
    "splitbutton" : {},
    
    "splitbutton/button": 
    {
      alias: "atom",

      style: function(states)
      {
        return {
          padding: states.pressed || states.checked 
                   || (states.checked && states.disabled) ? [4, 3, 2, 3] : [3], 
          decorator: states.pressed || states.checked ? "splitbutton-checked" :
                     states.hovered ? "splitbutton-hovered" : "splitbutton",
          textColor: "text-button",
          cursor: states.hovered && !states.disabled ? "pointer" : "default",
          center: true
        };
      }
    },
    
    "splitbutton/arrow":
    {
      alias: "button",
      include: "button",

      style: function(states)
      {
        return {
          icon: "decoration/arrows/down-small.png",
          decorator: states.pressed || states.checked ? "combobox-button-checked" :
                     states.hovered ? "combobox-button-hovered" : "combobox-button",
          padding: 4
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      CHECK BOX
    ---------------------------------------------------------------------------
    */

    "checkbox":
    {
      alias: "atom",

      style: function(states)
      {
        // The "disabled" icon is set to an icon **without** the -disabled
        // suffix on purpose. This is because the Image widget handles this
        // already by replacing the current image with a disabled version
        // (if available). If no disabled image is found, the opacity style
        // is used.
        var icon;

        // Checked
        if (states.checked) {
          icon = graydienttheme.theme.Image.URLS["checkbox-checked"];
        // Undetermined
        } else if (states.undetermined) {
          icon = graydienttheme.theme.Image.URLS["checkbox-undetermined"];
        // Unchecked
        } else {
          // empty icon
          icon = graydienttheme.theme.Image.URLS["blank"];
        }

        return {
          icon: icon,
          gap: 6
        }
      }
    },

    "checkbox/icon": 
    {
      style: function(states)
      {
        var decorator = "checkbox";

        if (states.disabled) {
          decorator += "-disabled";
        } else if (states.invalid) {
          decorator += "-invalid";
        } else if (states.focused || states.hovered) {
          decorator += "-focused";
        }

        var padding;
        // Checked
        if (states.checked) {
          padding = 2;
        // Undetermined
        } else if (states.undetermined) {
          padding = [4, 2];
        }

        return {
          decorator: decorator,
          width: 12,
          height: 12,
          padding: padding
        }
      }
    },

    /*
    ---------------------------------------------------------------------------
      COLOR POPUP
    ---------------------------------------------------------------------------
    */

    "colorpopup":
    {
      alias: "popup",
      include: "popup",

      style: function(states)
      {
        return {
          padding: 5,
          backgroundColor: "background-application"
        };
      }
    },

    "colorpopup/field":
    {
      style: function(states)
      {
        return {
          decorator: "main",
          margin: 2,
          width: 14,
          height: 14,
          backgroundColor: "background-light"
        };
      }
    },

    "colorpopup/selector-button": "button",
    "colorpopup/auto-button": "button",
    "colorpopup/preview-pane": "groupbox",

    "colorpopup/current-preview":
    {
      style: function(state)
      {
        return {
          height: 20,
          padding: 4,
          marginLeft: 4,
          decorator: "main",
          allowGrowX: true
        };
      }
    },

    "colorpopup/selected-preview":
    {
      style: function(state)
      {
        return {
          height: 20,
          padding: 4,
          marginRight: 4,
          decorator: "main",
          allowGrowX: true
        };
      }
    },

    "colorpopup/colorselector-okbutton":
    {
      alias: "button",
      include: "button",

      style: function(states)
      {
        return {
          icon: "icon/16/actions/dialog-ok.png"
        };
      }
    },

    "colorpopup/colorselector-cancelbutton":
   {
      alias: "button",
      include: "button",

      style: function(states)
      {
        return {
          icon: "icon/16/actions/dialog-cancel.png"
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      COLOR SELECTOR
    ---------------------------------------------------------------------------
    */

    "colorselector": "widget",
    "colorselector/control-bar": "widget",
    "colorselector/control-pane": "widget",
    "colorselector/visual-pane": "groupbox",
    "colorselector/preset-grid": "widget",

    "colorselector/colorbucket":
    {
      style: function(states)
      {
        return {
          decorator: "main",
          width: 16,
          height: 16
        };
      }
    },

    "colorselector/preset-field-set": "groupbox",
    
    "colorselector/input-field-set": 
    {
      include: "groupbox",
      alias: "groupbox",
      style: function() {
        return {
          paddingTop: 20
        };
      }
    },

    "colorselector/preview-field-set": 
    {
      include: "groupbox",
      
      alias: "groupbox",
      style: function() {
        return {
          paddingTop: 20
        };
      }
    },


    "colorselector/hex-field-composite": "widget",
    "colorselector/hex-field": "textfield",

    "colorselector/rgb-spinner-composite": "widget",
    "colorselector/rgb-spinner-red": "spinner",
    "colorselector/rgb-spinner-green": "spinner",
    "colorselector/rgb-spinner-blue": "spinner",

    "colorselector/hsb-spinner-composite": "widget",
    "colorselector/hsb-spinner-hue": "spinner",
    "colorselector/hsb-spinner-saturation": "spinner",
    "colorselector/hsb-spinner-brightness": "spinner",

    "colorselector/preview-content-old":
    {
      style: function(states)
      {
        return {
          decorator: "main",
          width: 50,
          height: 10
        };
      }
    },

    "colorselector/preview-content-new":
    {
      style: function(states)
      {
        return {
          decorator: "main",
          backgroundColor: "background-light",
          width: 50,
          height: 10
        };
      }
    },


    "colorselector/hue-saturation-field":
    {
      style: function(states)
      {
        return {
          decorator: "main",
          margin: 5
        };
      }
    },

    "colorselector/brightness-field":
    {
      style: function(states)
      {
        return {
          decorator: "main",
          margin: [5, 7]
        };
      }
    },

    "colorselector/hue-saturation-pane": "widget",
    
    "colorselector/hue-saturation-handle":
     {
	  include: "widget",
	  
	  style: function(states)
	  {
		return {
		  cursor: states.disabled ? "default" : "pointer"
		};
	  }
	},

    "colorselector/brightness-pane": "widget",

    "colorselector/brightness-handle": 
    {
	  include: "widget",
	  
	  style: function(states)
	  {
		return {
		  cursor: states.disabled ? "default" : "pointer"
		};
	  }
	},

    /*
    ---------------------------------------------------------------------------
      COMBOBOX
    ---------------------------------------------------------------------------
    */

    "combobox": {},

    "combobox/button":
    {
      alias: "button-frame",
      include: "button-frame",

      style: function(states)
      {
        var decorator = "combobox-button";

        if (states.hovered && !states.pressed && !states.checked) {
          decorator += "-hovered";
        } else if (states.pressed || states.checked) {
          decorator += "-pressed";
        }

        return {
          icon: graydienttheme.theme.Image.URLS["arrow-down"],
          cursor: "pointer",
          decorator: decorator,
          margin: 0,
          padding: [0, 5],
          width: 19
        };
      }
    },

    "combobox/popup": "popup",
    
    "combobox/list":
    {
      alias: "list"
    },

    "combobox/textfield": "textfield",

    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */

    "atom": {},
    "atom/label": "label",
    "atom/icon": "image",

    "dragdrop-cursor":
    {
      style: function(states)
      {
        var icon = "nodrop";

        if (states.copy) {
          icon = "copy";
        } else if (states.move) {
          icon = "move";
        } else if (states.alias) {
          icon = "alias";
        }

        return {
          source: "decoration/cursors/" + icon + ".gif",
          position: "right-top",
          offset: [ 2, 16, 2, 6 ]
        };
      }
    },

    "image":
    {
      style: function(states)
      {
        return {
          opacity: !states.replacement && states.disabled ? 0.3 : 1
        };
      }
    },
    
    "label":
    {
      style: function(states)
      {
        return {
          textColor: states.disabled ? "text-disabled" : undefined
        };
      }
    },
    
    "move-frame":
    {
      style: function(states)
      {
        return {
          decorator: "main"
        };
      }
    },

    "popup":
    {
      style: function(states)
      {
        return {
          decorator: "popup",
          backgroundColor: "background-light"
        }
      }
    },

    "resize-frame": "move-frame",

    "root":
    {
      style: function(states)
      {
        return {
          //~ decorator: "app-background",
          textColor: "text-label",
          font: "default"
        };
      }
    },

    "widget": {},

    /*
    ---------------------------------------------------------------------------
      DATE CHOOSER
    ---------------------------------------------------------------------------
    */

    "datechooser":
    {
      style: function(states)
      {
        var decorator;

        var focused = !!states.focused;
        var invalid = !!states.invalid;
        var disabled = !!states.disabled;

        if (focused && invalid && !disabled) {
          decorator = "input-focused-invalid";
        } else if (focused && !invalid && !disabled) {
          decorator = "input-focused";
        } else if (disabled) {
          decorator = "input-disabled";
        } else if (!focused && invalid && !disabled) {
          decorator = "border-invalid";
        } else {
          decorator = "group";
        }

        return {
          padding: 2,
          decorator: decorator,
          backgroundColor: "background-datechooser",
          width: 220
        };
      }
    },
    
    "datechooser/navigation-bar": {},
    
    "datechooser/button":
    {
      include: "button-frame",
      alias: "button-frame",

      style: function(states)
      {
        var result = {
          padding: [1, 4, 3, 0],
          show: "icon",
          cursor: "pointer"
        };

        if (states.lastYear) {
          result.icon = "decoration/arrows/rewind.png";
          result.marginRight = 1;
        } else if (states.lastMonth) {
          result.icon = "decoration/arrows/left.png";
        } else if (states.nextYear) {
          result.icon = "decoration/arrows/forward.png";
          result.marginLeft = 1;
        } else if (states.nextMonth) {
          result.icon = "decoration/arrows/right.png";
        }

        return result;
      }
    },
    
    "datechooser/last-year-button-tooltip": "tooltip",
    "datechooser/last-month-button-tooltip": "tooltip",
    "datechooser/next-year-button-tooltip": "tooltip",
    "datechooser/next-month-button-tooltip": "tooltip",

    "datechooser/last-year-button": "datechooser/button",
    "datechooser/last-month-button": "datechooser/button",
    "datechooser/next-year-button": "datechooser/button",
    "datechooser/next-month-button": "datechooser/button",
    "datechooser/button/icon": {},
    
    "datechooser/month-year-label":
    {
      style: function(states)
      {
        return {
          font: "bold",
          textAlign: "center",
          textColor: states.disabled ? "text-disabled" : undefined,
          padding: [1, 0, 1, 0],
          decorator: "toolbar-blue"
        };
      }
    },
    
    "datechooser/date-pane":
    {
      style: function(states)
      {
        return {
          textColor: states.disabled ? "text-disabled" : undefined,
          marginTop: 2
        };
      }
    },
    
    "datechooser/day":
    {
      style: function(states)
      {
        return {
          textAlign: "center",
          decorator: states.disabled ? undefined : states.selected ? "selected" : undefined,
          textColor: states.disabled ? "text-disabled" : states.selected ? "text-selected" : states.otherMonth ? "text-light" : undefined,
          font: states.today ? "bold" : undefined,
          padding: [2, 4]
        };
      }
    },
    
    "datechooser/week":
    {
      style: function(states)
      {
        return {
          textAlign: "center",
          padding: [2, 4],
          backgroundColor: "background-medium"
        };
      }
    },
    
    "datechooser/weekday":
    {
      style: function(states)
      {
        return {
          textColor: states.disabled ? "text-disabled" : states.weekend ? "text-light" : undefined,
          textAlign: "center",
          paddingTop: 2,
          backgroundColor: "background-medium"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      DATE FIELD
    ---------------------------------------------------------------------------
    */

    "datefield": "combobox",

    "datefield/button":
    {
      alias: "combobox/button",
      include: "combobox/button",

      style: function(states)
      {
        return {
          icon: "graydienttheme/icon/16/office-calendar.png",
          padding: [3, 4, 4, 4]
        };
      }
    },

    "datefield/textfield": "combobox/textfield",

    "datefield/list":
    {
      alias: "datechooser",
      include: "datechooser",

      style: function(states)
      {
        return {
          decorator: undefined
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      FORM RENDERER
    ---------------------------------------------------------------------------
    */

    "form-renderer-label": 
    {
      include: "label",
      
      style: function() 
      {
        return {
          paddingTop: 4
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      GROUP BOX
    ---------------------------------------------------------------------------
    */

    "groupbox": 
    {
      style: function(states)
      {
        return {
          legendPosition: "top"
        };
      }
    },

    "groupbox/legend":
    {
      alias: "atom",

      style: function(states)
      {
        return {
          textColor: states.invalid ? "text-invalid" : undefined,
          padding: [1, 0, 1, 4],
          font: "bold"
        };
      }
    },

    "groupbox/frame":
    {
      style: function(states)
      {
        return {
          padding: 8,
          decorator: "group-box"
        };
      }
    },

    "check-groupbox": "groupbox",

    "check-groupbox/legend":
    {
      alias: "checkbox",
      include: "checkbox",

      style: function(states)
      {
        return {
          textColor: states.invalid ? "text-invalid" : undefined,
          padding: [1, 0, 2, 4],
          font: "bold"
        };
      }
    },

    "radio-groupbox": "groupbox",

    "radio-groupbox/legend":
    {
      alias: "radiobutton",
      include: "radiobutton",

      style: function(states)
      {
        return {
          textColor: states.invalid ? "text-invalid" : undefined,
          padding: [1, 0, 2, 4],
          font: "bold"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      HTMLAREA
    ---------------------------------------------------------------------------
    */

    "htmlarea":
    {
      include: "widget",

      style: function(states)
      {
        return {
          backgroundColor: "background-htmlarea",
          opacity: 0.5
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      IFRAME
    ---------------------------------------------------------------------------
    */

    "iframe":
    {
      style: function(states)
      {
        return {
	     decorator: "iframe"
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      LIST
    ---------------------------------------------------------------------------
    */

    "list":
    {
      alias: "scrollarea",
      
      style: function(states)
      {
        return {
          decorator: states.invalid ? "input-invalid" : 
                     states.focused ? "input-focused" : "input"
        };
      }
    },

    "listitem":
    {
      alias: "atom",

      style: function(states)
      {
        return {
          padding: states.dragover ? [4, 4, 2, 4] : [3, 3, 3, 5],
          textColor: states.selected ? "text-selected" : undefined,
          decorator: states.selected ? "list-item" : undefined
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      MENU
    ---------------------------------------------------------------------------
    */

   "menu":
    {
      style: function(states)
      {
        var result =
        {
          decorator: "menu",
          backgroundColor: "background-menu",
          spacingX: 6,
          spacingY: 1,
          iconColumnWidth: 16,
          arrowColumnWidth: 4,
          placementModeY: states.submenu || states.contextmenu ? "best-fit" : "keep-align"
        };

        if (states.submenu)
        {
          result.position = "right-top";
          result.offset = [-2, -3];
        }

        return result;
      }
    },

    "menu/slidebar": "menu-slidebar",

    "menu-slidebar": "widget",

    "menu-slidebar-button":
    {
      style: function(states)
      {
        return {
          decorator: states.hovered  ? "selected" : undefined,
          padding: 7,
          center: true
        };
      }
    },

    "menu-slidebar/button-backward":
    {
      include: "menu-slidebar-button",

      style: function(states)
      {
        return {
          icon: "decoration/arrows/up.png"
        };
      }
    },

    "menu-slidebar/button-forward":
    {
      include: "menu-slidebar-button",

      style: function(states)
      {
        return {
          icon: "decoration/arrows/down.png"
        };
      }
    },

    "menu-separator":
    {
      style: function(states)
      {
        return {
          height: 0,
          decorator: "menu-separator",
          margin: [ 4, 2 ]
        };
      }
    },

    "menu-button":
    {
      alias: "atom",

      style: function(states)
      {
        return {
          textColor: states.selected ? "text-selected" : "text-button",
          decorator: states.selected ? "menu-button-selected" : undefined,
          padding: [ 3, 5 ]
        };
      }
    },
    
    "menu-button/icon" :
    {
      include: "image",

      style: function(states)
      {
        return {
          alignY: "middle"
        };
      }
    },

    "menu-button/label" :
    {
      include: "label",

      style: function(states)
      {
        return {
          alignY: "middle",
          padding: 1
        };
      }
    },

    "menu-button/shortcut" :
    {
      include: "label",

      style: function(states)
      {
        return {
          alignY: "middle",
          marginLeft: 14,
          padding: 1
        };
      }
    },
    
    "menu-button/arrow" :
    {
      include: "image",

      style: function(states)
      {
        return {
          source: states.selected ? "decoration/arrows/right-invert.png" : "decoration/arrows/right.png",
          alignY: "middle"
        };
      }
    },
    
    "menu-checkbox":
    {
      alias: "menu-button",
      include: "menu-button",

      style: function(states)
      {
        return {
          icon: states.checked ? 
				  states.selected ? "decoration/menu/checkbox-invert.gif" : "decoration/menu/checkbox.gif" : undefined
        }
      }
    },
    
    "menu-radiobutton" :
    {
      alias: "menu-button",
      include: "menu-button",

      style: function(states)
      {
        return {
          icon: states.checked ? 
				  states.selected ? "decoration/menu/radiobutton-invert.gif" : "decoration/menu/radiobutton.gif" : undefined
        }
      }
    },

    /*
    ---------------------------------------------------------------------------
      MENU BAR
    ---------------------------------------------------------------------------
    */

    "menubar":
    {
      style: function(states)
      {
        return {
          decorator: "toolbar-silver"
        }
      }
    },

    "menubar-button":
    {
      alias: "atom",

      style: function(states)
      {
        return {
          decorator: (states.pressed || states.hovered) && !states.disabled ? "selected" : undefined,
          textColor: states.pressed || states.hovered ? "text-selected" : undefined,
          padding: [3, 8]
        };
      }
    },


    /*
    ---------------------------------------------------------------------------
      PROGRESSIVE
    ---------------------------------------------------------------------------
    */

    "progressive-table-header":
    {
      alias: "widget",

      style: function(states)
      {
        return {
          decorator: "progressive-table-header"
        };
      }
    },

    "progressive-table-header-cell":
    {
      alias: "atom",
      style: function(states)
      {
        return {
          minWidth: 40,
          minHeight: 25,
          paddingLeft: 6,
          decorator: "progressive-table-header-cell"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      PROGRESSBAR
    ---------------------------------------------------------------------------
    */
    
    "progressbar":
    {
      style: function(states) {
        return {
          decorator: "progressbar",
          height: 16,
          margin: 1
        }
      }
    },

    "progressbar/progress":
    {
      style: function(states) {
        return {
          decorator: states.disabled ? "progressbar-progress-disabled" : "progressbar-progress"
        }
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      RADIO BUTTON
    ---------------------------------------------------------------------------
    */

    "radiobutton":
    {
      style: function(states)
      {
        return {
          icon: graydienttheme.theme.Image.URLS["blank"]
        }
      }
    },
    
    "radiobutton/icon": 
    {
      style: function(states)
      {
        var decorator = "radiobutton";
        
        if (states.checked) {
          decorator += "-checked";
        }

        if (states.disabled) {
          decorator += "-disabled";
        } else if (states.invalid) {
          decorator += "-invalid";
        } else if (states.focused || states.hovered) {
          decorator += "-focused";
        }

        return {
          decorator: decorator,
          width: 12,
          height: 12
        }
      }
    },

    /*
    ---------------------------------------------------------------------------
      RESIZER
    ---------------------------------------------------------------------------
    */

    "resizer":
    {
      style: function(states)
      {
        return {
          decorator: "pane"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      SCROLL AREA
    ---------------------------------------------------------------------------
    */

    "scrollarea":
    {
      style: function(states)
      {
        return {
          // since the scroll container disregards the min size of the scrollbars
          // we have to set the min size of the scroll area to ensure that the
          // scrollbars always have a usable size.
          minWidth: 50,
          minHeight: 50
        };
      }
    },

    "scrollarea/corner":
    {
      style: function(states)
      {
        return {
          backgroundColor: "background-application"
        };
      }
    },

    "scrollarea/pane": "widget",
    "scrollarea/scrollbar-x": "scrollbar",
    "scrollarea/scrollbar-y": "scrollbar",

    /*
    ---------------------------------------------------------------------------
      SCROLL BAR
    ---------------------------------------------------------------------------
    */

    "scrollbar": {},
    
    "scrollbar/slider": 
    {
      style: function(states)
      {
        return {
          decorator: states.horizontal ? "scrollbar-slider-horizontal" : "scrollbar-slider-vertical"
        }
      }
    },

    "scrollbar/slider/knob":
    {
      style: function(states)
      {
        var decorator = states.horizontal ? "scroll-knob-horizontal" : "scroll-knob-vertical";

        if (!states.disabled) 
        {
          if (states.hovered || states.pressed) {
            decorator += "-pressed";
          }
        }

        return {
          height: states.horizontal ? 12 : undefined,
          width: states.vertical ? 12 : undefined,
          minHeight: states.horizontal ? undefined : 8,
          minWidth : states.vertical ? undefined: 8,
          cursor: "pointer",
          decorator: decorator
        };
      }
    },

    "scrollbar/button":
    {
      style: function(states)
      {
        var styles = {};
        
        styles.decorator = states.up || states.down ? "scroll-knob-vertical" : "scroll-knob-horizontal";
        if (states.hovered || states.pressed)
        {
          styles.decorator += "-pressed";
        }
        
        styles.padding = 3;

        var icon = "";
        if (states.left) {
          icon = "left";
          styles.marginRight = 1;
        } else if (states.right) {
          icon += "right";
          styles.marginLeft = 1;
        } else if (states.up) {
          icon += "up";
          styles.marginBottom = 1;
        } else {
          icon += "down";
          styles.marginTop = 1;
        }

        styles.icon = graydienttheme.theme.Image.URLS["arrow-" + icon];

        styles.cursor = "pointer";
        return styles;
      }
    },

    "scrollbar/button-begin": "scrollbar/button",
    "scrollbar/button-end": "scrollbar/button",

    /*
    ---------------------------------------------------------------------------
      SELECTBOX
    ---------------------------------------------------------------------------
    */

    "selectbox": "button-frame",
    "selectbox/atom": "atom",
    
    "selectbox/popup": 
    {
      style: function(states)
      {
        return {
          decorator: "menu"
        }
      }
    },
    
    "selectbox/list": 
    {
      alias: "list"
    },

    "selectbox/arrow":
    {
      include: "image",

      style: function(states)
      {
        return {
          source: graydienttheme.theme.Image.URLS["arrow-down"],
          paddingRight: 4,
          paddingLeft: 5
        };
      }
    },


    /*
    ---------------------------------------------------------------------------
      SLIDER
    ---------------------------------------------------------------------------
    */

    "slider":
    {
      style: function(states)
      {
        return {
          decorator: states.horizontal ? "slider-horizontal" : "slider-vertical",
          maxHeight: states.horizontal ? 16 : undefined,
          maxWidth: states.horizontal ? undefined : 16,
          minHeight: states.horizontal ? 14 : undefined,
          minWidth: states.horizontal ? undefined : 14,
          padding: states.horizontal ? [0, 1, 0, 1] : [1, 0, 1, 0]
        }
      }
    },

    "slider/knob":
    {
      style: function(states)
      {
        var decorator = "slider-knob";

        if (states.pressed)
        {
          decorator += "-pressed";
        } else if (states.hovered) {
          decorator += "-hovered";
        }

        return {
          decorator: decorator,
          maxHeight: 14,
          maxWidth: 14,
          cursor: states.disabled ? "default" : "pointer"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      SLIDE BAR
    ---------------------------------------------------------------------------
    */

    "slidebar": {},
    "slidebar/scrollpane": {},
    "slidebar/content": {},

    "slidebar/button-forward":
    {
      alias: "button",
      include: "button",

      style: function(states)
      {
        return {
          icon: graydienttheme.theme.Image.URLS["arrow-" + (states.vertical ? "down" : "right")]
        };
      }
    },

    "slidebar/button-backward":
    {
      alias: "button",
      include: "button",

      style: function(states)
      {
        return {
          icon: graydienttheme.theme.Image.URLS["arrow-" + (states.vertical ? "up" : "left")]
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      SPINNER
    ---------------------------------------------------------------------------
    */

    "spinner":
    {
      style: function(states)
      {
        var decorator;

        var focused = !!states.focused;
        var invalid = !!states.invalid;
        var disabled = !!states.disabled;

        if (focused && invalid && !disabled) {
          decorator = "input-focused-invalid";
        } else if (focused && !invalid && !disabled) {
          decorator = "input-focused";
        } else if (disabled) {
          decorator = "input-disabled";
        } else if (!focused && invalid) {
          decorator = "input-invalid";
        } else {
          decorator = "input";
        }

        return {
          decorator: decorator
        };
      }
    },

    "spinner/textfield":
    {
      style: function(states)
      {
        return {
          marginRight: 2,
          padding: [1, 4, 1],
          textColor: states.disabled ? "text-disabled" : "text-active"
        };
      }
    },

    "spinner/upbutton":
    {
      alias: "spinner-button",
      include: "spinner-button",

      style: function(states)
      {
        var icon = "decoration/arrows/up-small.png";
        
        return {
          icon: icon,
          padding: [1, 4],
          width: 13,
          margin: 0,
          cursor: states.hovered && !states.disabled ? "pointer" : "default"
        };
      }
    },

    "spinner/downbutton":
    {
      alias: "spinner-button",
      include: "spinner-button",

      style: function(states)
      {
        var icon = "decoration/arrows/down-small.png";
        
        return {
          icon: icon,
          padding: [1, 4],
          width: 13,
          margin: 0,
          cursor: states.hovered && !states.disabled ? "pointer" : "default"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      SPLITPANE
    ---------------------------------------------------------------------------
    */

    "splitpane":
    {
      style: function(states)
      {
        return {
          decorator: "splitpane"
        };
      }
    },

    "splitpane/splitter":
    {
      style: function(states)
      {
        return {
		  decorator: undefined
        };
      }
    },

    "splitpane/splitter/knob":
    {
      style: function(states)
      {
        return {
          source: states.horizontal ? "decoration/button/knob-horizontal.png" :
                                      "decoration/button/knob-vertical.png",
          cursor: states.disabled ? "default" : "pointer"
        };
      }
    },

    "splitpane/slider":
    {
      style: function(states)
      {
        return {
		  decorator: states.horizontal ? "splitter-horizontal" : "splitter-vertical"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */

    "table":
    {
      alias: "widget",

      style: function(states)
      {
        return {
          decorator: "table"
        };
      }
    },

    "table-header": {},

    "table/statusbar":
    {
      style: function(states)
      {
        return {
          decorator: "table-statusbar",
          padding: [0, 2]
        };
      }
    },

    "table/column-button":
    {
      alias: "button-frame",

      style: function(states)
      {
        return {
          decorator: "table-column-button",
          padding: 3,
          icon: "decoration/table/select-column-order.png",
          cursor: states.disabled ? "default" : "pointer"
        };
      }
    },

    "table-column-reset-button":
    {
      include: "menu-button",
      alias: "menu-button",

      style: function()
      {
        return {
          icon: "icon/16/actions/view-refresh.png"
        };
      }
    },

    "table-scroller": "widget",

    "table-scroller/scrollbar-x": "scrollbar",
    "table-scroller/scrollbar-y": "scrollbar",

    "table-scroller/header":
    {
      style: function(states)
      {
        return {
          decorator: "table-scroller-header"
        };
      }
    },

    "table-scroller/pane":
    {
      style: function(states)
      {
        return {
          backgroundColor: "table-pane"
        };
      }
    },

    "table-scroller/focus-indicator":
    {
      style: function(states)
      {
        return {
          decorator: "table-scroller-focus-indicator"
        };
      }
    },

    "table-scroller/resize-line":
    {
      style: function(states)
      {
        return {
          backgroundColor: "border-separator",
          width: 2
        };
      }
    },

    "table-header-cell":
    {
      alias: "atom",
      style: function(states)
      {
        return {
          minWidth: 13,
          minHeight: 25,
          padding: states.hovered ? [2, 4, 2, 4] : [2, 4],
          decorator: states.hovered ? "table-header-cell-hovered" : "table-header-cell",
          sortIcon: states.sorted ?
              (states.sortedAscending ? "decoration/table/ascending.png" : "decoration/table/descending.png")
              : undefined
        };
      }
    },

    "table-header-cell/label":
    {
      style: function(states)
      {
        return {
          minWidth: 0,
          alignY: "middle",
          paddingRight: 5,
          marginBottom: 3,
          marginTop: 0
        };
      }
    },

    "table-header-cell/sort-icon":
    {
      style: function(states)
      {
        return {
          alignY: "middle",
          alignX: "right"
        };
      }
    },

    "table-header-cell/icon":
    {
      style: function(states)
      {
        return {
          minWidth: 0,
          alignY: "middle",
          paddingRight: 5
        };
      }
    },

    "table-editor-textfield":
    {
      include: "textfield",

      style: function(states)
      {
        return {
          decorator: undefined,
          padding: [2, 2],
          backgroundColor: "background-light"
        };
      }
    },

    "table-editor-selectbox":
    {
      include: "selectbox",
      alias: "selectbox",

      style: function(states)
      {
        return {
          padding: [0, 2],
          backgroundColor: "background-light"
        };
      }
    },

    "table-editor-combobox":
    {
      include: "combobox",
      alias: "combobox",

      style: function(states)
      {
        return {
          decorator: undefined,
          backgroundColor: "background-light"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      TAB VIEW
    ---------------------------------------------------------------------------
    */

    "tabview": {},

    "tabview/bar" :
    {
      alias: "slidebar",

      style: function(states)
      {
        var marginTop=0, marginRight=0, marginBottom=0, marginLeft=0;

        if (states.barTop) {
          marginBottom -= 2;
        } else if (states.barBottom) {
          marginTop -= 2;
        } else if (states.barRight) {
          marginLeft -= 2;
        } else {
          marginRight -= 2;
        }

        return {
          marginBottom: marginBottom,
          marginTop: marginTop,
          marginLeft: marginLeft,
          marginRight: marginRight
        };
      }
    },


    "tabview/bar/button-forward":
    {
      include: "slidebar/button-forward",
      alias: "slidebar/button-forward",

      style: function(states)
      {
        var decorator = "tabview-bar-button";

        if (states.hovered && !states.pressed && !states.checked) {
          decorator += "-hovered";
        } else if (states.pressed || states.checked) {
          decorator += "-pressed";
        }

        if (states.barTop) {
          return {
            marginTop: 4,
            marginBottom: 2,
            decorator: decorator
          }
        } else if (states.barBottom) {
          return {
            marginTop: 2,
            marginBottom: 4,
            decorator: decorator
          }
        } else if (states.barLeft) {
          return {
            marginLeft: 4,
            marginRight: 2,
            decorator: decorator
          }
        } else {
          return {
            marginLeft: 2,
            marginRight: 4,
            decorator: decorator
          }
        }
      }
    },

    "tabview/bar/button-backward":
    {
      include: "slidebar/button-backward",
      alias: "slidebar/button-backward",

      style: function(states)
      {
        var decorator = "tabview-bar-button";

        if (states.hovered && !states.pressed && !states.checked) {
          decorator += "-hovered";
        } else if (states.pressed || states.checked) {
          decorator += "-pressed";
        }

        if (states.barTop) {
          return {
            marginTop: 4,
            marginBottom: 2,
            decorator: decorator
          }
        } else if (states.barBottom) {
          return {
            marginTop: 2,
            marginBottom: 4,
            decorator: decorator
          }
        } else if (states.barLeft) {
          return {
            marginLeft: 4,
            marginRight: 2,
            decorator: decorator
          }
        } else {
          return {
            marginLeft: 2,
            marginRight: 4,
            decorator: decorator
          }
        }
      }
    },

    "tabview/pane":
    {
      style: function(states)
      {
        return {
          decorator: "tabview-pane",
          padding: 10
        };
      }
    },

    "tabview-page": "widget",

    "tabview-page/button":
    {
      style: function(states)
      {
        var marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0;

        // default padding
        if (states.barTop || states.barBottom) {
          var paddingTop = 4, paddingBottom = 4, paddingLeft = 8, paddingRight = 8;
        } else {
          var paddingTop = 7, paddingBottom = 7, paddingLeft = 4, paddingRight = 4;
        }

        var decorator = states.checked ? "tabview-button-checked" :
                        states.hovered ? "tabview-button-hovered" :
                                         "tabview-button";
        if (states.barTop) {
          decorator += "-top";
        } else if (states.barBottom) {
          decorator += "-bottom";
        } else if (states.barLeft) {
          decorator += "-left";
        } else if (states.barRight) {
          decorator += "-right";
        }

        // checked padding / margin
        if (states.checked) {
          if (states.barTop) {
            marginBottom += 2;
          } else if (states.barBottom) {
            paddingTop += 2;
            marginTop += 2;
          } else if (states.barLeft) {
            marginRight += 2;
          } else if (states.barRight) {
            paddingLeft += 2;
            marginLeft += 2;
          }
        } else {
          if (states.barTop) {
            marginBottom += 2;
            marginTop += 3;
          } else if (states.barBottom) {
            marginBottom += 3;
            marginTop += 2;
          } else if (states.barLeft) {
            marginRight += 2;
            marginLeft += 4;
          } else if (states.barRight) {
            marginRight += 4;
            marginLeft += 2;
          }
        }

        return {
          zIndex: states.checked ? 10 : 5,
          decorator: decorator,
          backgroundColor: states.checked ? "background-selected" : "background-tabview-unselected",
          textColor: states.checked ?  "text-selected" : states.disabled ? "text-disabled" : "text-active",
          padding: [ paddingTop, paddingRight, paddingBottom, paddingLeft ],
          margin: [ marginTop, marginRight, marginBottom, marginLeft ],
          font: "bold"
        };
      }
    },

    "tabview-page/button/label":
    {
      alias: "label",

      style: function(states)
      {
        return {
          padding: [0, 1, 0, 1],
          margin: states.focused ? 0 : 1,
          decorator: states.focused ? "keyboard-focus" : undefined
        };
      }
    },

    "tabview-page/button/icon": "image",
    "tabview-page/button/close-button":
    {
      alias: "atom",
      style: function(states)
      {
        return {
          cursor: states.disabled ? undefined : "pointer",
          icon: states.hovered ? graydienttheme.theme.Image.URLS["tabview-close-hovered"] :
                                  graydienttheme.theme.Image.URLS["tabview-close"]
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      TEXT AREA
    ---------------------------------------------------------------------------
    */

    "textarea": "textfield",

    /*
    ---------------------------------------------------------------------------
      TEXT FIELD
    ---------------------------------------------------------------------------
    */

    "textfield":
    {
      style: function(states)
      {
        var textColor;
        if (states.disabled) {
          textColor = "text-disabled";
        } else if (states.showingPlaceholder) {
          textColor = "text-placeholder";
        } else {
          textColor = undefined;
        }

        var decorator;
        var padding;
        if (states.invalid) {
          decorator = "input-invalid";
        } else if (states.focused) {
          decorator = "input-focused";
        } else {
          decorator = "input";
        }

        return {
          decorator: decorator,
          padding: [1, 2],
          textColor: textColor
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      TOOLBAR
    ---------------------------------------------------------------------------
    */

    "toolbar":
    {
      style: function(states)
      {
        return {
          decorator: "toolbar-silver",
          spacing: 2
        };
      }
    },

    "toolbar/part":
    {
      style: function(states)
      {
        return {
          decorator: "toolbar-part",
          spacing: 2
        };
      }
    },

    "toolbar/part/container":
    {
      style: function(states)
      {
        return {
          paddingLeft: 2,
          paddingRight: 2
        };
      }
    },

    "toolbar/part/handle":
    {
      style: function(states)
      {
        return {
          source: "decoration/toolbar/toolbar-handle-knob.gif",
          marginLeft: 3,
          marginRight: 3
        };
      }
    },

    "toolbar-button":
    {
      alias: "atom",

      style: function(states)
      {
        return {
          margin: 1,
          padding: states.pressed || states.checked ? [4, 6, 3, 6] : [3, 6, 4, 6],
          decorator: states.pressed || states.checked ?
                        "toolbar-button-checked" :
                      states.hovered && !states.disabled ?
                        "toolbar-button-hovered" : "toolbar-button",
          textColor: states.pressed || states.checked ? "text-active" : "text-button",
          cursor: states.disabled ? "default" : "pointer"
        };
      }
    },

    "toolbar-menubutton":
    {
      alias: "toolbar-button",
      include: "toolbar-button",

      style: function(states)
      {
        return {
          showArrow: true
        };
      }
    },

    "toolbar-menubutton/arrow":
    {
      alias: "image",
      include: "image",

      style: function(states)
      {
        return {
          source: "decoration/arrows/down-small.png"
        };
      }
    },

    "toolbar-splitbutton":
    {
      style: function(states)
      {
        return {
          margin: 0
        };
      }
    },

    "toolbar-splitbutton/button": "toolbar-button",

    "toolbar-splitbutton/arrow":
    {
      alias: "toolbar-button",
      include: "toolbar-button",

      style: function(states)
      {
        return {
          icon: "decoration/arrows/down.png"
        };
      }
    },

    "toolbar-separator":
    {
      style: function(states)
      {
        return {
          decorator: "toolbar-separator",
          margin: [4, 5, 4, 5]
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      TOOL TIP
    ---------------------------------------------------------------------------
    */

    "tooltip":
    {
      include: "popup",

      style: function(states)
      {
        return {
          padding: [ 1, 4, 2, 4 ],
          offset: [ 15, 5, 5, 5 ]
        };
      }
    },

    "tooltip/atom": "atom",

    "tooltip-error": 
    {
      style: function(states)
      {
        return {
          placeMethod: "widget",
          offset: [-3, 1, 0, 0],
          arrowPosition: states.placementLeft ? "left" : "right",
          position: "right-top",
          showTimeout: 100,
          hideTimeout: 10000,
          padding: [0, 4, 4, 0]
        };
      }
    },

    "tooltip-error/arrow": 
    {
      include: "image",

      style: function(states)
      {
        return {
          source: states.placementLeft ?
            "decoration/form/tooltip-error-arrow-right.png" : "decoration/form/tooltip-error-arrow-left.png",
          padding: [6, 0, 0, 0],
          zIndex: 10000001
        };
      }
    },

    "tooltip-error/atom":
    {
      include: "popup",

      style: function(states)
      {
        return {
          textColor: "text-selected",
          backgroundColor: undefined,
          decorator: "tooltip-error",
          font: "bold",
          padding: [3, 4, 4, 4],
          margin: [1, 0, 0, 0],
          maxWidth: 333
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      TREE
    ---------------------------------------------------------------------------
    */

    "tree": "list",

    "tree-item":
    {
      style: function(states)
      {
        var decorator = states.selected ? "selected" : undefined;

        return {
          padding: [ 2, 6 ],
          textColor: states.selected ? "text-highlight" : states.disabled ? "red" : undefined,
          decorator: decorator,
          cursor: states.disabled ? "default" : "pointer"
        };
      }
    },

    "tree-item/icon":
    {
      include: "image",

      style: function(states)
      {
        return {
          paddingRight: 5
        };
      }
    },

    "tree-item/label": 
    {
	  include: "label",
	  
	  style: function(states)
      {
        return {
          textColor: states.disabled ? "text-disabled" : undefined
        };
      }
    },

    "tree-item/open":
    {
      include: "image",

      style: function(states)
      {
        var icon;
        if (states.selected && states.opened)
        {
          icon = "decoration/tree/open-selected.png";
        }
        else if (states.selected && !states.opened)
        {
          icon = "decoration/tree/closed-selected.png";
        }
        else if (states.opened)
        {
          icon = "decoration/tree/open.png";
        }
        else
        {
          icon = "decoration/tree/closed.png";
        }

        return {
          padding: [0, 5, 0, 2],
          source: icon
        };
      }
    },

    "tree-folder":
    {
      include: "tree-item",
      alias: "tree-item",

      style: function(states)
      {
        var icon, iconOpened;
        if (states.small) {
          icon = states.opened ? "icon/16/places/folder-open.png" : "icon/16/places/folder.png";
          iconOpened = "icon/16/places/folder-open.png";
        } else if (states.large) {
          icon = states.opened ? "icon/32/places/folder-open.png" : "icon/32/places/folder.png";
          iconOpened = "icon/32/places/folder-open.png";
        } else {
          icon = states.opened ? "icon/22/places/folder-open.png" : "icon/22/places/folder.png";
          iconOpened = "icon/22/places/folder-open.png";
        }

        return {
          icon: icon,
          iconOpened: iconOpened
        };
      }
    },

    "tree-file":
    {
      include: "tree-item",
      alias: "tree-item",

      style: function(states)
      {
        return {
          icon:
            states.small ? "icon/16/mimetypes/office-document.png" :
            states.large ? "icon/32/mimetypes/office-document.png" :
            "icon/22/mimetypes/office-document.png"
        };
      }
    },


    /*
    ---------------------------------------------------------------------------
      TREE VIRTUAL
    ---------------------------------------------------------------------------
    */

    "treevirtual": "table",

    "treevirtual-folder":
    {
      style: function(states)
      {
        return {
          icon: states.opened ?
            "icon/16/places/folder-open.png" : 
            "icon/16/places/folder.png"
        };
      }
    },

    "treevirtual-file":
    {
      include: "treevirtual-folder",
      alias: "treevirtual-folder",

      style: function(states)
      {
        return {
          icon: "icon/16/mimetypes/office-document.png"
        };
      }
    },

    "treevirtual-line":
    {
      style: function(states)
      {
        return {
          icon: "qx/static/blank.gif"
        };
      }
    },

    "treevirtual-contract":
    {
      style: function(states)
      {
        return {
          icon: "decoration/tree/open.png",
          paddingLeft: 5,
          paddingTop: 2
        };
      }
    },

    "treevirtual-expand":
    {
      style: function(states)
      {
        return {
          icon: "decoration/tree/closed.png",
          paddingLeft: 5,
          paddingTop: 2
        };
      }
    },

    "treevirtual-only-contract": "treevirtual-contract",
    "treevirtual-only-expand": "treevirtual-expand",
    "treevirtual-start-contract": "treevirtual-contract",
    "treevirtual-start-expand": "treevirtual-expand",
    "treevirtual-end-contract": "treevirtual-contract",
    "treevirtual-end-expand": "treevirtual-expand",
    "treevirtual-cross-contract": "treevirtual-contract",
    "treevirtual-cross-expand": "treevirtual-expand",

    "treevirtual-end":
    {
      style: function(states)
      {
        return {
          icon: "qx/static/blank.gif"
        };
      }
    },

    "treevirtual-cross":
    {
      style: function(states)
      {
        return {
          icon: "qx/static/blank.gif"
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      VIRTUAL WIDGETS
    ---------------------------------------------------------------------------
    */

    "virtual-list": "list",
    "virtual-list/row-layer": "row-layer",

    "row-layer": "widget",

    "group-item":
    {
      include: "label",
      alias: "label",

      style: function(states)
      {
        return {
          padding: 4,
          decorator: "group-item",
          textColor: "groupitem-text",
          font: "bold"
        };
      }
    },

    "virtual-selectbox": "selectbox",
    "virtual-selectbox/dropdown": "popup",
    "virtual-selectbox/dropdown/list": {
      alias: "virtual-list"
    },

    "virtual-combobox": "combobox",
    "virtual-combobox/dropdown": "popup",
    "virtual-combobox/dropdown/list": {
      alias: "virtual-list"
    },

    "virtual-tree":
    {
      include: "tree",
      alias: "tree",

      style: function(states)
      {
        return {
          itemHeight: 26
        };
      }
    },

    "virtual-tree-folder": "tree-folder",
    "virtual-tree-file": "tree-file",

    "column-layer": "widget",

    "cell":
    {
      style: function(states)
      {
        return {
          textColor: states.selected ? "text-selected" : "text-label",
          padding: [3, 6],
          font: "default"
        };
      }
    },

    "cell-string": "cell",
    
    "cell-number":
    {
      include: "cell",
      style: function(states)
      {
        return {
          textAlign: "right"
        };
      }
    },
    
    "cell-image": "cell",
    
    "cell-boolean":
    {
      include: "cell",
      
      style: function(states)
      {
        return {
          iconTrue: "decoration/table/boolean-true.png",
          iconFalse: "decoration/table/boolean-false.png"
        };
      }
    },
    
    "cell-atom": "cell",
    "cell-date": "cell",
    "cell-html": "cell",

    /*
    ---------------------------------------------------------------------------
      WINDOW
    ---------------------------------------------------------------------------
    */

    "window":
    {
      style: function(states)
      {
        return {
          decorator: states.active ? "window-active" : "window-inactive",
          contentPadding: 5,
          margin: states.maximized ? 0 : [0, 5, 5, 0]
        };
      }
    },

    "window/pane": 
    {
      style: function(states)
      {
        return {
          backgroundColor: states.active ? "background-window-active" : "background-window-inactive"
        };
      }
    },
    
    "window/captionbar":
    {
      style: function(states)
      {
        return {
          decorator: states.active ? "window-captionbar-active" : "window-captionbar-inactive",
          textColor: states.active && !states.disabled ? "text-active" : "text-disabled",
          //~ minHeight: 30,
          padding: 6,
          font: "bold"
        };
      }
    },
    
    "window/icon":
    {
      style: function(states)
      {
        return {
          //~ margin: [ 5, 0, 3, 6 ]
          marginRight: 4
        };
      }
    },
    
    "window/title":
    {
      style: function(states)
      {
        return {
          alignY: "middle",
          font: "bold",
          //~ marginLeft: 6,
          //~ marginRight: 12
          marginRight: 20
        };
      }
    },
    
    "window-button":
    {
      //~ alias: "atom",
      alias: "button",

      style: function(states)
      {
		return {
          //~ margin: [2, 3, 3, 1],
          padding: [ 1, 2 ],
          cursor: states.active && !states.disabled ? "pointer" : "default"
        };
      }
    },
		  
    "window/close-button":
    {
      alias: "window-button",
      include: "window-button",

      style: function(states)
      {
        return {
          marginLeft: 2,
          icon: states.hovered ? graydienttheme.theme.Image.URLS["window-close-hovered"] : 
                 states.active ? graydienttheme.theme.Image.URLS["window-close"] :
                                 graydienttheme.theme.Image.URLS["window-inactive"]
        };
      }
    },
    
    "window/maximize-button":
    {
      alias: "window-button",
      include: "window-button",

      style: function(states)
      {
        return {
          icon: states.hovered ? graydienttheme.theme.Image.URLS["window-maximize-hovered"] : 
                 states.active ? graydienttheme.theme.Image.URLS["window-maximize"] :
                                 graydienttheme.theme.Image.URLS["window-inactive"]
        };
      }
    },

    "window/minimize-button":
    {
      alias: "window-button",
      include: "window-button",
      
      style: function(states)
      {
        return {
          icon: states.hovered ? graydienttheme.theme.Image.URLS["window-minimize-hovered"] : 
                 states.active ? graydienttheme.theme.Image.URLS["window-minimize"] :
                                 graydienttheme.theme.Image.URLS["window-inactive"]
        };
      }
    },

    "window/restore-button":
    {
      alias: "window-button",
      include: "window-button",

      style: function(states)
      {
        return {
          icon: states.hovered ? graydienttheme.theme.Image.URLS["window-restore-hovered"] : 
                 states.active ? graydienttheme.theme.Image.URLS["window-restore"] :
                                 graydienttheme.theme.Image.URLS["window-inactive"]
        };
      }
    },
    
    "window/statusbar":
    {
      style: function(states)
      {
        return {
          padding: [ 2, 6 ],
          decorator: "window-statusbar",
          minHeight: 18
        };
      }
    },
    
    "window/statusbar-text": {},
    
    "window-resize-frame":
    {
      style: function(states)
      {
        return {
          decorator: "main"
        };
      }
    }
    
  }
});
/* ************************************************************************

   Copyright:
     2011 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

/**
 * Mapping class for all images used in the GraydientTheme.
 */
qx.Class.define("graydienttheme.theme.Image",
{
  extend: qx.core.Object,

  statics :
  {
    /**
     * Holds a map containig all the URL to the images.
     * @internal
     */
    URLS :
    {
      "blank": "decoration/blank.gif",

      // checkbox
      "checkbox-checked": "decoration/checkbox/checked.png",
      "checkbox-undetermined": "decoration/checkbox/undetermined.png",

      // window
      "window-minimize": "decoration/window/minimize.png",
      "window-minimize-hovered": "decoration/window/minimize-hovered.png",
      "window-maximize": "decoration/window/maximize.png",
      "window-maximize-hovered": "decoration/window/maximize-hovered.png",
      "window-restore": "decoration/window/restore.png",
      "window-restore-hovered": "decoration/window/restore-hovered.png",
      "window-close": "decoration/window/close.png",
      "window-close-hovered": "decoration/window/close-hovered.png",
      "window-inactive": "decoration/window/inactive.png",

      // cursor
      "cursor-copy": "decoration/cursors/copy.gif",
      "cursor-move": "decoration/cursors/move.gif",
      "cursor-alias": "decoration/cursors/alias.gif",
      "cursor-nodrop": "decoration/cursors/nodrop.gif",

      // arrows
      "arrow-right": "decoration/arrows/right.gif",
      "arrow-left": "decoration/arrows/left.gif",
      "arrow-up": "decoration/arrows/up.gif",
      "arrow-down": "decoration/arrows/down.gif",
      "arrow-forward": "decoration/arrows/forward.gif",
      "arrow-rewind": "decoration/arrows/rewind.gif",
      "arrow-down-small": "decoration/arrows/down-small.gif",
      "arrow-up-small": "decoration/arrows/up-small.gif",
      "arrow-up-invert": "decoration/arrows/up-invert.gif",
      "arrow-down-invert": "decoration/arrows/down-invert.gif",
      "arrow-right-invert": "decoration/arrows/right-invert.gif",

      // split pane
      "knob-horizontal": "decoration/splitpane/knob-horizontal.png",
      "knob-vertical": "decoration/splitpane/knob-vertical.png",

      // table
      "select-column-order": "decoration/table/select-column-order.png",
      "table-ascending": "decoration/table/ascending.png",
      "table-descending": "decoration/table/descending.png",

      // toolbar
      "toolbar-handle-knob": "decoration/toolbar/toolbar-handle-knob.png",
      
      // tree
      "tree-minus": "decoration/tree/minus.gif",
      "tree-plus": "decoration/tree/plus.gif",
      "tree-open": "decoration/tree/open.png",
      "tree-open-selected": "decoration/tree/open-selected.png",
      "tree-closed": "decoration/tree/closed.png",
      "tree-closed-selected": "decoration/tree/closed-selected.png",
      
      // tree virtual
      "treevirtual-line": "decoration/treevirtual/line.gif",
      "treevirtual-minus-only": "decoration/treevirtual/only_minus.gif",
      "treevirtual-plus-only": "decoration/treevirtual/only_plus.gif",
      "treevirtual-minus-start": "decoration/treevirtual/start_minus.gif",
      "treevirtual-plus-start": "decoration/treevirtual/start_plus.gif",
      "treevirtual-minus-end": "decoration/treevirtual/end_minus.gif",
      "treevirtual-plus-end": "decoration/treevirtual/end_plus.gif",
      "treevirtual-minus-cross": "decoration/treevirtual/cross_minus.gif",
      "treevirtual-plus-cross": "decoration/treevirtual/cross_plus.gif",
      "treevirtual-end": "decoration/treevirtual/end.gif",
      "treevirtual-cross": "decoration/treevirtual/cross.gif",

      // menu
      "menu-checkbox": "decoration/menu/checkbox.gif",
      "menu-checkbox-invert": "decoration/menu/checkbox-invert.gif",
      "menu-radiobutton-invert": "decoration/menu/radiobutton-invert.gif",
      "menu-radiobutton": "decoration/menu/radiobutton.gif",

      // tabview
      "tabview-close": "decoration/tabview/close.png",
      "tabview-close-hovered": "decoration/tabview/close-hovered.png"
    }
  }
});
