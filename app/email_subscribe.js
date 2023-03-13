function submitEmail() {
  var form = document.getElementById("email-form");
  var is_valid = form.reportValidity();
  if (is_valid) {
    form.submit();
  }
}