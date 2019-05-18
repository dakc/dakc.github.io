document.addEventListener("DOMContentLoaded", function (event) {
    var liElms = document.querySelectorAll(".sidebar .menu li");
    liElms.forEach(liElm => {
        liElm.addEventListener("click", e => {
            removeActiveMenu();
            if (e.target.nodeName.toLowerCase() == "li") {
                location.href = liElm.querySelector("a").hash;
                e.target.className = "active";
            } else {
                e.target.parentElement.className = "active";
            }
        });
    });
})

var removeActiveMenu = () => {
    document.querySelectorAll(".sidebar .menu li.active").forEach(itm => {
        itm.className = "";
    });
}