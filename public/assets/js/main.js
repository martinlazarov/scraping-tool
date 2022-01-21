// for functions and vars used in this script, please refer to ./common.js

jQuery(window).on('load', () => {

    $('#scrape').on('click', () => {
        if (confirm("Do you want to refresh your scrape results?") == true) {
            $.ajax({
                method: "GET",
                url: "/scrape",
                dataType: "script"
            })
            setTimeout(function () {
                window.location.reload();
            }, 15000);
        }
    })
});
