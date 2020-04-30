class CETIApi{
    constructor() {
        this.api = this;
    }
    /**option{model, name, method}**/
    call(options={}){
        frappe.call({
            method: "ceti.api.call",
            args: {model: options.model, name: options.name, method: options.method, args: options.args},
            always: function (r) {
                if(typeof options.always != "undefined") options.always(r);
            },
            callback: function (r) {
                if(typeof options.callback != "undefined") options.callback(r);
            },
            freeze: (typeof options.freeze !== "undefined" ? false : options.freeze)
        });
    }
}
let CETI = new CETIApi();