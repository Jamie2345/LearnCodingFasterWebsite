function toggleBlurBackground() {
  var blur = document.getElementById("blur");
  blur.classList.toggle("active")
}

function toggleEmailPopup() {
  toggleBlurBackground()
  var popup = document.getElementById("email-popup");
  popup.classList.toggle("active")
}

setTimeout(function() {
  toggleEmailPopup();
}, 7000);
  
