class JSHtml{
	constructor(options) {
		Object.assign(this, options);
		this.properties = (typeof options.properties == "undefined" ? {} : options.properties);
		this.self = "";
		this.disabled = false;
		this.cursor_position = 0;
		this.double_click_attempts = 0;
		this.listeners = {};
		this.identifier = this.uuid();
		this.base_identifier = 'jstmlefddc6315a6e4cfc9cb7b8a85fbc7f85';
		this.fusion_props();
		this.make();

		this.set_self();
		this.default_listeners();

		return this;
	}

	set_self(){
	    let self = this;
	    setTimeout(function(){
	        self.self = document.querySelector(`${self.tag}[${self.identifier}='${self.identifier}']`);
	    }, 0)
	}

	fusion_props(){
		this.properties[this.identifier] = this.identifier;
	}

	type(){
		let types = ["input", "button", "select", "check", "radio"];

		if(types.includes(this.tag)){
			return types[this.tag]
		}
		return null
	}

	make(){
		this.make_dom();
		this.add_document_css();
	}

	add_document_css(){
		if(document.getElementById(this.base_identifier) == null) {
			$("body").append(`
				<div id="${this.base_identifier}">
					<style>
						.${this.base_identifier}{
							background-color: #ffffff !important;
							color: #818c9e !important;
							pointer-events: none !important;
							cursor: not-allowed !important;
							filter: alpha(opacity=65);
							-webkit-box-shadow: none;
							box-shadow: none;
							opacity: .65;
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
			)
		}
	}

	float(){
		let self = this;
		self.setInputFilter(function(value) {
  			return /^-?\d*[.,]?\d*$/.test(value);
		});
		return self;
	}

	on(listener, fn, method=null){
		let self = this;
		if(typeof listener == "object"){
			for (let listen in listener){
				if(!listener.hasOwnProperty(listen)) continue;
				self.set_listener(listener[listen], fn);
			}
		}else{
			self.set_listener(listener, fn, method);
		}
		return self
	}

	set_listener(listener, fn, method=null){
		let self = this;
		if(typeof self.listeners[listener] == "object"){
			self.listeners[listener].push(fn);
		}else{
			self.listeners[listener] = [fn];
		}

		setTimeout(function(){
			if(self.self == null) return;

			for(let f in self.listeners[listener]){
				if(self.listeners[listener].hasOwnProperty(f)){
					let _listener = self.listeners[listener][f];

					self.self.addEventListener(listener, (event) => {
						if(method != null){
							if(method === "double_click"){
								if(self.double_click_attempts === 0){
									let previous_text = self.text;
									self.val(__("Confirm"));
									self.double_click_attempts = 1;
									self.add_class(`${self.base_identifier}-confirm`).JQ().delay(2000).queue(function(next){
										self.val(self.text === __("Confirm") ? previous_text : self.text);
										self.double_click_attempts = 0;
										self.remove_class(`${self.base_identifier}-confirm`);
										next();
									})
								}else{
									self.remove_class(`${self.base_identifier}-confirm`);
									self.double_click_attempts = 0;
									_listener(self, self.self, event);
								}
							}else{
								_listener(self, self.self, event);
							}
						}else{
							_listener(self, self.self, event);
						}
					});
				}
			}
		}, 0)
	}

	make_dom(){
		let self = this;
		setTimeout(function () {
			if(typeof self.wrapper == "undefined"){
				return self.html();
			}else{
				$(self.wrapper).empty().append(self.html());
			}
		},0)
	}

	html(){
		let template = this.template();
		return template.replace("{{content_rendered}}", this.get_content_rendered());
	}

	refresh(){
		this.content = this.get_content_rendered()
		return this;
	}

	get_content_rendered(text = null){
		if(typeof this.content != "undefined"){
			if(typeof this.text != "undefined"){
				if(this.content.search("{{text}}") === -1){
					this.content = text;
					return this.content;
				}else{
					return this.content.replace("{{text}}", text == null ? this.text : text);
				}
			}else{
				if(text != null) this.content = text;
				return this.content;
			}
		}else{
			return "";
		}
	}

	template(){
		return `<${this.tag} ${this.props_by_json(this.properties)}>{{content_rendered}}</${this.tag}>`
	}

	set_selection(){
		this.cursor_position = this.self.selectionStart;
	}

	default_listeners() {
		let self = this;

		setTimeout(function () {
			if(self.tag === "input"){
				self.on(["click", "change"], function(){
					self.set_selection();
				})
			}
		}, 0)
	}

	name(){
		return this.get_attr("name");
	}

	get_attr(attr=""){
		return this.self.getAttribute(attr);
	}

	enable(on_enable=true){
		let self = this;
		self.disabled = false;
		setTimeout(function () {
			if(on_enable){
				self.prop("disabled", false);
			}
			self.remove_class(self.base_identifier);
		}, 0)


		return this;
	}

	disable(on_disable=true){
		let self = this;
		self.disabled = true;
		setTimeout(function () {
			if(on_disable){
				self.prop("disabled", true);
			}
			self.add_class(self.base_identifier);
		},0)

		return self;
	}

	css(prop="", val=""){
		let self = this;
		setTimeout(function () {
			if(typeof prop == "object"){
				for (let css in prop){
					if(prop.hasOwnProperty(css)){
						self.self.style[css] = prop[css];
					}
				}
			}else{
				self.self.style[prop] = val;
			}
		}, 0)
	}

	add_class(class_name) {
	  	/*let array_classes = this.self.className.split(" ");
	  	if (array_classes.indexOf(class_name) === -1) {
			this.self.className += " " + class_name;
	  	}*/
		this.JQ().addClass(class_name);
	  	return this;
	}

	JQ(){
		return $(this.self);
	}

	select(){
		let self = this;
		setTimeout(function () {
			self.self.select();
		}, 0)

		return self;
	}

	remove_class(class_name){
		//this.self.classList.remove(class_name);
		this.JQ().removeClass(class_name);
		return this;
	}

	is_disabled(){
		return this.disabled;
	}

	delete_selection(value, move_position=1){
		let self = this;
		let current_value = this.val();
		let current_selection = window.window.getSelection().toString();

		this.cursor_position = current_value.search(current_selection) + move_position;

		self.val(current_value.replace(current_selection, value));
	}

	has_selection(){
		return window.window.getSelection().toString().length;
	}

	write(value){
		let self = this;
		if(self.is_disabled()) return;

		let current_value = self.val();

		if(self.has_selection()){
			self.delete_selection(value);
			/*setTimeout(function () {
				self.trigger("change");
			}, 0)*/
			//self.trigger("change");
			//self.check_changes(current_value);
			return;
		}

		let left_value = current_value.substring(0, self.cursor_position);
		let right_value = current_value.substring(self.cursor_position, current_value.length);

		self.val(left_value + value + right_value);

		//self.check_changes(current_value);

		self.cursor_position ++;


		//self.trigger("change");
	}

	float_val(){
		return isNaN(parseFloat(this.val())) ? 0.0 : parseFloat(this.val());
	}

	int_val(){
		return parseInt(isNaN(this.val()) ? 0 : this.val());
	}

	plus(value=1){
		let self = this;
		self.val(self.float_val() + value);
		self.focus();

		return self;
	}

	minus(value=1){
		let self = this;
		self.val(self.float_val() - value);
		self.focus();

		return self;
	}

	val(val=null, change=true){
		let self = this;

		if(val == null){
			if(self.tag === "input"){
				return self.JQ().val();
			}else{
				return self.JQ().html()
			}
		}else{
			if(typeof self.text != "undefined") self.text = val;
			setTimeout(function () {
				if(self.tag === "input"){
					self.JQ().val(val);
					if(change) self.trigger("change");
				}else{
					self.empty().JQ().html(self.get_content_rendered(val));
				}
			}, 0)
		}

		return self;
	}

	prepend(content){
		this.JQ().prepend(content);
		return this;
	}

	append(content){
		this.JQ().append(content);
		return this;
	}

	empty(){
		this.JQ().empty();
		return this;
	}

	remove(){
		this.JQ().remove();
	}

	hide(){
		this.JQ().hide();
		return this;
	}

	show(){
		this.JQ().show();
		return this;
	}

	prop(prop, value=""){
		if(typeof prop == "object"){
			for(let p in prop){
				if(!prop.hasOwnProperty(p)) continue;

				if(p === "disabled"){
					if(prop[p]){
						this.disable(false)
					}else{
						this.enable(false);
					}
				}
				this.JQ().prop(p, prop[p]);
			}
		}else{
			if(prop === "disabled"){
				if(value){
					this.disable(false)
				}else{
					this.enable(false);
				}
			}

			this.JQ().prop(prop, value);
		}
		return this
	}

	check_changes(last_val){
		let self = this;

		setTimeout(function () {
			let save_cursor_position = self.cursor_position;
			if(self.val() !== last_val){
				self.trigger("change");
			}

			self.cursor_position = save_cursor_position;
			self.focus();
		}, 0)
	}

	delete_value(){
		let self = this;
		if(self.is_disabled()) return;

		let current_value = self.val();

		if(self.has_selection()){
			self.delete_selection("", 0);
			/*setTimeout(function () {
				self.trigger("change");
			}, 0)*/
			//self.trigger("change");
			//self.check_changes(current_value);
			return;
		}

		let left_value = current_value.substring(0, self.cursor_position);
		let right_value = current_value.substring(self.cursor_position, current_value.length);
		let new_value;

		if(self.cursor_position === self.val().length){
			new_value = left_value.substring(0, self.val().length - 1);
			self.cursor_position --;
		}else{
			new_value = left_value.substring(0, self.cursor_position - 1) + right_value;
			self.cursor_position --;
		}

		self.val(new_value);

		//self.check_changes(current_value);
		/*setTimeout(function () {
			self.trigger("change");
		}, 0)*/

		//self.focus();
	}

	trigger(event){
		if(typeof this.listeners[event] != "undefined"){
			for(let listen in this.listeners[event]){
				if(this.listeners[event].hasOwnProperty(listen)){
					this.listeners[event][listen]();
				}
			}
		}
		this.focus();
	}

	focus(){
		this.cursor_position = this.cursor_position < 0 ? 0 : this.cursor_position;

		this.JQ().focus();
		let pos = this.cursor_position;

		this.JQ().each(function (index, elem) {
			if (elem.setSelectionRange) {
				elem.setSelectionRange(pos, pos);
			} else if (elem.createTextRange) {
				let range = elem.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		});
	};

	setInputFilter(inputFilter) {
		let self = this;
		setTimeout(function () {
			["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
				self.self.addEventListener(event, function () {
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
		},0)
	}

	props_by_json(props= {}) {
		let _html = "";
		for (let prop in props) {
			if (!props.hasOwnProperty(prop)) continue;
			_html += `${prop}='${props[prop]}'`;
		}
		return _html;
	}

	uuid() {
		let id = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});

		return "jstml" + id;
	}
}