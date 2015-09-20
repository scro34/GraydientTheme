/* ************************************************************************

   Copyright:
      2015 Norbert Schröder

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php

   Authors:
     * Norbert Schröder (scro34)

************************************************************************ */

qx.Theme.define("graydienttheme.demo.theme.Font",
{
  extend: graydienttheme.theme.Font,

  fonts:
  {
    "title":
    {
      size: 36,
      family: ["serif"],
      sources: 
      [
        {
          family: "JosefinSlab",
          source: ["graydienttheme/demo/fonts/JosefinSlab-Regular.ttf"]
        }
      ]
    },
    
    "qooxdoo":
    {
      size: 19,
      family: ["serif"],
      sources: 
      [
        {
          family: "JosefinSlabBold",
          source: ["graydienttheme/demo/fonts/JosefinSlab-Bold.ttf"]
        }
      ]
    }
  }
});
