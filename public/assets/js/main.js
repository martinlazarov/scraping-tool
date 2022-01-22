$(document).ready(function () {
  $('#scrape').on('click', () => {
    if (confirm("Do you want to refresh your scrape results?") === true) {
      $.ajax({
        method: "GET",
        url: "/scrape",
        dataType: "script"
      }).done(function () {
        window.location.reload();
      }).fail(function () {
        alert("Failed to scrape results")
      })
    }
  })
});