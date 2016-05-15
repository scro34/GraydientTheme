/* ************************************************************************

   Copyright:
     2011-2015 Norbert Schröder

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
      "arrow-right-small": "decoration/arrows/right-small.gif",
      "arrow-left-small": "decoration/arrows/left-small.gif",
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
