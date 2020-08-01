var hasConsole = typeof console !== "undefined"

var fingerprintReport = function () {
  var d1 = new Date()
  Fingerprint2.get(function(components) {
	var murmur = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join(), 31)
	var d2 = new Date()
	var time = d2 - d1
	var details = ""
	if(hasConsole) {
	  console.log("fingerprint hash", murmur)
	}
	for (var index in components) {
	  var obj = components[index]
	  var line = obj.key + " = " + String(obj.value).substr(0, 100)
	  if (hasConsole) {
		//console.log(line)
	  }
	  details += line + "\n"
	}
	//document.querySelector("#details").textContent = details
  })
}

let elements = {
    "Home": {icon: "home", color: "gray"},
    "Buying": {icon: "cart-arrow-down", color: "red"},
    "Accounting": {icon: "bar-chart", color: "orange"},
    "Assets": "desktop",
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
    "Website": "globe",
    "Settings": "wrench",
    "Education": {icon: "graduation-cap", color: "gray"},
    "Healthcare": {icon: "heart", color: "red"},
    "Customization": "magic",
    "Integrations": "arrows",
    "Tools": "file",
    "Users": "user"
}

var set_icons = function (){
    setInterval(() => {
        if(typeof document.getElementsByClassName("item-Home")[0] == "undefined"){
            set_icons1();
        }
    },100)
}

var set_icons1 = function (){
    let div = document.getElementsByClassName('desk-sidebar')[0];
    let variance_color = true;

    div.childNodes.forEach((item) => {
        setTimeout(() => {
            let element = item.getAttribute("href");
            if(typeof element == "undefined" || element == null) return;

            element = element.split("/").pop();

            let color = variance_color ? typeof elements[element].color != "undefined" ? elements[element].color : "orange" : "#829dab";
            let icon = typeof elements[element].icon != "undefined" ? elements[element].icon : elements[element];
            let icon_direction = `<span class="fa fa-angle-right" style="color: slategray !important; right: 20px; position: absolute; font-size: 20px !important;"/>`;
            $(item).prepend(`
                <span style="padding-right: 10px; width: 35px; font-size: 18px !important; color: ${color} !important;" class="item-${element} fa fa-${icon}"/>
            `);

            $(item).append(icon_direction);
        }, 0)

    })
}


var cancelId1
var cancelFunction1
// see usage note in the README
if (window.requestIdleCallback) {
  cancelId1 = requestIdleCallback(set_icons)
  cancelFunction1 = cancelIdleCallback
} else {
  cancelId1 = setTimeout(set_icons, 0)
  cancelFunction1 = clearTimeout
}