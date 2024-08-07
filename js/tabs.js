
function switchTab(name) {
  $("#tabs > div").addClass("hidden");
  $("#" + name).removeClass("hidden");
}