var coll = document.getElementById("showAdvancedSearchFeaturesButton");
var content = document.getElementById("advancedSearchFeatures");

coll.addEventListener("click", function() {
    if (coll.textContent=== "Show Advanced Search Features") {
        coll.textContent="Hide Advanced Search Features";
        content.classList.remove("hidden");
    }
    else {
        coll.textContent="Show Advanced Search Features";
        content.classList.add("hidden");
    }
})
