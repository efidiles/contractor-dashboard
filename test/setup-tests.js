(function () {
  var CONFIG = {
    COMPONENT_ID: 'component',
    COMPONENT_WRAPPER: undefined
  };

  window.CONFIG = CONFIG;

  CONFIG.COMPONENT_WRAPPER = addInvisibleElementToFullyRenderComponents();

  function addInvisibleElementToFullyRenderComponents() {
    var div = document.createElement("div");
    div.id = CONFIG.COMPONENT_ID;
    div.style = 'position: absolute; opacity: 0.01;'
    document.body.appendChild(div);

    return div;
  }
}());
