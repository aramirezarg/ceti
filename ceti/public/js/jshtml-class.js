class JSHtml {
    constructor(options) {
        Object.assign(this, options);
        this.properties = (typeof options.properties == "undefined" ? {} : options.properties);
        this.obj = null;
        this.disabled = false;
        this.cursor_position = 0;
        this.double_click_attempts = 0;
        this.listeners = {};
        this.identifier = this.uuid();
        this.base_identifier = 'jstmlefc65a6efc9cb8afbc85';
        this.$ = null;
        this.fusion_props();
        this.make();

        this.set_obj();
        this.default_listeners();

        return this;
    }

    set_obj() {
        setTimeout(() => {
            this.obj = document.querySelector(`${this.tag}[${this.identifier}='${this.identifier}']`);
            this.$ = this.JQ();
        }, 0);
    }

    fusion_props() {
        this.properties[this.identifier] = this.identifier;
    }

    type() {
        let types = ["input", "button", "select", "check", "radio"];

        if (types.includes(this.tag)) {
            return types[this.tag];
        }
        return null;
    }

    make() {
        this.make_dom();
        this.add_document_css();
    }

    add_document_css() {
        if (document.getElementById(this.base_identifier) == null) {
            $("body").append(`
				<div id="${this.base_identifier}">
					<style>
						.${this.base_identifier}{
							opacity: 0.4;
							pointer-events: none !important;
							cursor: not-allowed !important;
							filter: alpha(opacity=65);
							-webkit-box-shadow: none;
							box-shadow: none;
							-moz-user-select: none; 
						   	-webkit-user-select: none;
						   	-ms-user-select: none;
						   	user-select: none;
						}
						
						.${this.base_identifier}-confirm{
							background-color: darkorange !important;
							color: #ffffff !important;
						}
					</style>
				</div>`
            );
        }
    }

    toggle_common(base_class, toggle_class) {
        this.add_class(toggle_class).JQ().siblings('.' + base_class + '.' + toggle_class).removeClass(toggle_class);
    }

    float() {
        this.setInputFilter((value) => {
            return /^-?\d*[.,]?\d*$/.test(value);
        });
        return this;
    }

    on(listener, fn, method = null, callBack = null) {
        if (typeof listener == "object") {
            for (let listen in listener) {
                if (!listener.hasOwnProperty(listen)) continue;
                this.set_listener(listener[listen], fn);
            }
        } else {
            this.set_listener(listener, fn, method, callBack);
        }
        return this;
    }

    on_listener(fn, listener) {
        Object.keys(this.listeners[listener]).forEach((f) => {
            fn(this.listeners[listener][f]);
        });
    }

    set_listener(listener, fn, method = null, callBack = null) {
        if (typeof this.listeners[listener] == "object") {
            this.listeners[listener].push(fn);
        } else {
            this.listeners[listener] = [fn];
        }

        setTimeout(() => {
            if (this.obj == null) return;

            this.on_listener((listen) => {
                this.obj.addEventListener(listener, (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.is_disabled()) return;
                    if (method != null && method === "double_click") {
                        if (this.double_click_attempts === 0) {
                            let previous_text = this.text;
                            if (typeof this.text != "undefined" && this.text.length > 0) {
                                this.val(__("Confirm"));
                            }
                            this.double_click_attempts = 1;
                            this.add_class(`${this.base_identifier}-confirm`).JQ().delay(2000).queue((next) => {
                                this.val(this.text === __("Confirm") ? previous_text : this.text);
                                this.double_click_attempts = 0;
                                this.remove_class(`${this.base_identifier}-confirm`);
                                next();
                            });
                        } else {
                            this.remove_class(`${this.base_identifier}-confirm`);
                            this.double_click_attempts = 0;
                            listen(this, this.obj, event, callBack);
                        }
                    } else {
                        listen(this, this.obj, event, callBack);
                    }
                });
            }, listener, fn);
        }, 0);
    }

    set_content(content) {
        this.content = content;
        this.val("");
        return this;
    }

    make_dom() {
        setTimeout(() => {
            if (typeof this.wrapper == "undefined" || this.wrapper == null) {
                return this.html();
            } else {
                $(this.wrapper).append(this.html());
            }
        }, 0);
    }

    html() {
        let template = this.template();
        this.set_obj();
        return template.replace("{{content_rendered}}", this.get_content_rendered());
    }

    refresh() {
        this.content = this.get_content_rendered();
        return this;
    }

    get_content_rendered(text = null) {
        if (typeof this.content != "undefined") {
            if (typeof this.text != "undefined") {
                if (this.content.search("{{text}}") === -1) {
                    this.content = text;
                    return this.content;
                } else {
                    return this.content.replace("{{text}}", text == null ? this.text : text);
                }
            } else {
                if (text != null) this.content = text;
                return this.content;
            }
        } else {
            return "";
        }
    }

    template() {
        return `<${this.tag} ${this.props_by_json(this.properties)}>{{content_rendered}}</${this.tag}>`
    }

    set_selection() {
        this.cursor_position = this.obj.selectionStart;
    }

    default_listeners() {
        setTimeout(() => {
            if (this.tag === "input") {
                this.on(["click", "onkeydown", "onkeypress"], () => {
                    this.set_selection();
                });
            }
        }, 0);
    }

    name() {
        return this.get_attr("name");
    }

    get_attr(attr = "") {
        return this.obj.getAttribute(attr);
    }

    enable(on_enable = true) {
        this.disabled = false;
        setTimeout(() => {
            if (on_enable) {
                this.prop("disabled", false);
            }
            this.remove_class(this.base_identifier);
        }, 0)

        return this;
    }

    disable(on_disable = true) {
        this.disabled = true;
        setTimeout(() => {
            if (on_disable) {
                this.prop("disabled", true);
            }
            this.add_class(this.base_identifier);
        }, 0);

        return this;
    }

    css(prop = "", val = "") {
        setTimeout(() => {
            if (typeof prop == "object") {
                prop.forEach((row) => {
                    this.obj.style[row.prop] = row.value;
                });
            } else {
                this.obj.style[prop] = val;
            }
        }, 0);

        return this;
    }

    add_class(class_name) {
        if (typeof class_name == "object") {
            for (let c in class_name) {
                if (!class_name.hasOwnProperty(c)) continue;
                this.JQ().addClass(c);
            }
        } else {
            this.JQ().addClass(class_name);
        }

        return this;
    }

    has_class(class_name) {
        return this.obj.classList.contains(class_name);
    }

    has_classes(classes) {
        let has_class = false;
        for (let c in classes) {

            if (!classes.hasOwnProperty(c)) continue;
            if (this.has_class(classes[c])) has_class = true;
        }
        return has_class;
    }

    JQ() {
        return $(this.obj);
    }

    select() {
        setTimeout(() => {
            this.obj.select();
        }, 0)

        return this;
    }

    remove_class(class_name) {
        if (typeof class_name == "object") {
            for (let c in class_name) {
                if (!class_name.hasOwnProperty(c)) continue;
                this.JQ().removeClass(c);
            }
        } else {
            this.JQ().removeClass(class_name);
        }
        return this;
    }

    is_disabled() {
        return this.disabled;
    }

    delete_selection(value, move_position = 1) {
        let current_value = this.val();
        let current_selection = window.getSelection().toString();

        this.cursor_position = current_value.search(current_selection) + move_position;

        this.val(current_value.replace(current_selection, value));
    }

    has_selection() {
        return window.window.getSelection().toString().length;
    }

    write(value) {
        if (this.is_disabled()) return;

        let current_value = this.val();

        if (this.has_selection()) {
            this.delete_selection(value);
            return;
        }

        let left_value = current_value.substring(0, this.cursor_position);
        let right_value = current_value.substring(this.cursor_position, current_value.length);

        this.val(left_value + value + right_value);

        this.cursor_position++;
        this.trigger("change");
    }

    float_val() {
        return isNaN(parseFloat(this.val())) ? 0.0 : parseFloat(this.val());
    }

    int_val() {
        return parseInt(isNaN(this.val()) ? 0 : this.val());
    }

    plus(value = 1) {
        this.val(this.float_val() + value);
        this.focus();

        return this;
    }

    minus(value = 1) {
        this.val(this.float_val() - value);
        this.focus();

        return this;
    }

    val(val = null, change = true) {
        if (val == null) {
            if (this.tag === "input") {
                return this.JQ().val();
            } else {
                return this.JQ().html();
            }
        } else {
            if (typeof this.text != "undefined") this.text = val;
            setTimeout(() => {
                if (this.tag === "input") {
                    this.JQ().val(val);
                    if (change) this.trigger("change");
                } else {
                    this.empty().JQ().html(this.get_content_rendered(val));
                }
            }, 0);

            return this;
        }
    }

    prepend(content) {
        this.JQ().prepend(content);
        return this;
    }

    append(content) {
        this.JQ().append(content);
        return this;
    }

    empty() {
        this.JQ().empty();
        return this;
    }

    remove() {
        this.JQ().remove();
    }

    hide() {
        this.add_class("hide");
        this.css("display", 'none !important');
        return this;
    }

    show() {
        this.remove_class("hide");
        this.css("display", '');
        return this;
    }

    prop(prop, value = "") {
        if (typeof prop == "object") {
            for (let p in prop) {
                if (!prop.hasOwnProperty(p)) continue;

                if (p === "disabled") {
                    if (prop[p]) {
                        this.disable(false)
                    } else {
                        this.enable(false);
                    }
                }
                this.JQ().prop(p, prop[p]);
            }
        } else {
            if (prop === "disabled") {
                if (value) {
                    this.disable(false)
                } else {
                    this.enable(false);
                }
            }

            this.JQ().prop(prop, value);
        }
        return this
    }

    check_changes(last_val) {
        setTimeout(() => {
            let save_cursor_position = this.cursor_position;
            if (this.val() !== last_val) {
                this.trigger("change");
            }

            this.cursor_position = save_cursor_position;
            this.focus();
        }, 0);
    }

    delete_value() {
        if (this.is_disabled()) return;
        let current_value = this.val();

        if (this.has_selection()) {
            this.delete_selection("", 0);
            return;
        }

        let left_value = current_value.substring(0, this.cursor_position);
        let right_value = current_value.substring(this.cursor_position, current_value.length);
        let new_value;

        if (this.cursor_position === this.val().length) {
            new_value = left_value.substring(0, this.val().length - 1);
            this.cursor_position--;
        } else {
            new_value = left_value.substring(0, this.cursor_position - 1) + right_value;
            this.cursor_position--;
        }

        this.val(new_value);
    }

    trigger(event) {
        if (typeof this.listeners[event] != "undefined") {
            for (let listen in this.listeners[event]) {
                if (this.listeners[event].hasOwnProperty(listen)) {
                    this.listeners[event][listen]();
                }
            }
        }
        this.focus();
    }

    focus() {
        this.cursor_position = this.cursor_position < 0 ? 0 : this.cursor_position;
        this.JQ().focus();
        let pos = this.cursor_position;

        this.JQ().each(function (index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
    };

    setInputFilter(inputFilter) {
        setTimeout(() => {
            ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach((event) => {
                this.obj.addEventListener(event, function () {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    } else {
                        this.value = "";
                    }
                });
            });
        }, 0);
    }

    props_by_json(props = {}) {
        let _html = "";
        for (let prop in props) {
            if (!props.hasOwnProperty(prop)) continue;
            _html += `${prop}='${props[prop]}'`;
        }
        return _html;
    }

    uuid() {
        let id = 'xxxxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        return "jshtml" + id;
    }
}