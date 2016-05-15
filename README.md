# About the «GraydientTheme»

The «GraydientTheme» mainly relies on CSS techniques in order to create the appearances of widgets. 
This makes it rather lightweight and the rendering of GUI elements shows almost no delays.

In the current version of «Graydient» a lot of items have changed compared to the earlier version of 2011. 
Some people might even say that it's not the same theme anymore. Nevertheless, I hope a few people like it 
and consider using it in one of their applications.

## How to use «GraydientTheme»

1. Download the theme files and unzip the contents into an appropriate folder named "GraydientTheme" on your local machine. 
(Recommendation: Put the theme outside of the qooxdoo SDK folder, but on the same directory level.)

2. Modify the contrib.json file of your application by adding «GraydientTheme» as a library, e.g.
  ```
  [...]
  "jobs" :
  {
    "libraries" :
    {
      "library" :
      [
        {
          "manifest" : "../GraydientTheme/Manifest.json"
        }
      ]
    }
  }
  [...]
  ```
3. Change the `QXTHEME` key in `config.json` to `"graydienttheme.theme.Theme"`. This way the theme of your application is 
**replaced** by «GraydientTheme». The downside to this approach: If you want to modify and/or extend the "graydient" appearance 
of your application you have to do this directly in the «GraydientTheme» theme files which may later lead to subtle bugs or
strange side effects.
You might, therefore, want to invest a few more minutes, leave the `QXTHEME` key in `config.json` untouched and let
your predefined application theme **inherit** from «GraydientTheme» instead of being replaced by it. To do this, go to the 
theme folder of your application and modify Appearance.js, Color.js, Decoration.js and Font.js as shown in this 
example:
  ```
  qx.Theme.define("myapp.theme.Appearance",
  {
    //extend : qx.theme.modern.Appearance,
    extend : graydienttheme.theme.Appearance,

    appearances :
    {
    }
  });
  ```
Now you can safely add new appearances, decorators, colors and fonts, or overwrite existing ones.

4. Generate your application and your are done.
