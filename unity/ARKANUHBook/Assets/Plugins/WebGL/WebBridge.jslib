mergeInto(LibraryManager.library, {
  SendReactEvent: function (jsonPtr) {
    var payload = UTF8ToString(jsonPtr);
    window.dispatchEvent(
      new CustomEvent("arkanuh:unity:event", {
        detail: payload
      })
    );
  }
});
