let elements = {
    "Home": {icon: "home", color: "gray"},
    "Buying": {icon: "cart-arrow-down", color: "red"},
    "Accounting": {icon: "bar-chart", color: "orange"},
    "Assets": {icon: "desktop", color: "#b0afaf"},
    "CRM": "user-plus",
    "Fiscal Module": {icon: "calendar", color: "red"},
    "HR": "vcard-o",
    "Loan": "credit-card-alt",
    "Payroll": "list-ol",
    "Projects": "bars",
    "Quality": "check",
    "Restaurant": "cutlery",
    "Selling": {icon: "cart-plus", color: "green"},
    "Stock": "barcode",
    "Support": "commenting-o",
    "Website": {icon: "globe", color: "#4f4fff"},
    "Settings": "gear",
    "Education": {icon: "graduation-cap", color: "gray"},
    "Healthcare": {icon: "heart", color: "red"},
    "Customization": "magic",
    "Integrations": "arrows",
    "Tools": {icon: "wrench", color: "#b0afaf"},
    "Users": "user"
}

let timer = 0;

let set_icons = function () {
    let element = document.getElementsByClassName("item-Home");
    if (typeof element[0] == "undefined" || element[0] == null) {
        timer = 0;
        set_icons1();
    } else {
        timer = 2000;
    }

    setTimeout(() => {
        set_icons();
    }, timer)
}

var set_icons1 = function () {
    let sidebars = document.getElementsByClassName('desk-sidebar');

    let variance_color = true;

    for (let i = 0; i < sidebars.length; i++) {
        sidebars[i].childNodes.forEach((item) => {
            let element = item.getAttribute("href");
            if (typeof element == "undefined" || element == null) return;

            element = element.split("/").pop();

            let color = variance_color ? typeof elements[element].color != "undefined" ? elements[element].color : "orange" : "#829dab";
            let icon = typeof elements[element].icon != "undefined" ? elements[element].icon : elements[element];
            let icon_direction = `<span class="fa fa-angle-right" style="color: slategray !important; right: 20px; position: absolute; font-size: 20px !important;"/>`;
            $(item).prepend(`
                    <span style="padding-right: 10px; width: 35px; font-size: 18px !important; color: ${color} !important;" class="item-${element} fa fa-${icon}"/>
                `);

            $(item).append(icon_direction);
        })
    }
}

if (window.requestIdleCallback) {
    requestIdleCallback(set_icons);
} else {
   setTimeout(set_icons, 0);
}