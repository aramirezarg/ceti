class CETIModal{
	constructor(options) {
		Object.assign(this, options, {
			id: "ceti-" + Math.random().toString(36).substr(2, 15),
			modal: undefined
		});
		this.construct();
		this.show();
	}

	construct(){
		let self = this;
		self.modal = new frappe.ui.Dialog({
			title: self.title,
			/*fields: [
				{fieldname: self.id, fieldtype: 'HTML'},
				{fieldname: 'ht', fieldtype: 'HTML'},
			],*/
			/*primary_action: function() {
				if(window[self.container]) {
					window[self.container].save(self.has_payment);
				}
			},*/
			primary_action_label: __("Save"),
		});

		/*if (self.disabled_to_save){
			self.modal.get_primary_btn().attr('disabled', true).addClass("hidden");
		}*/
		
		if(self.full_page){
			self.modal.$wrapper.find('.modal-dialog').css({
				"width": "100%", "height": "100%", "left": "0", "top": "0", "margin": "0", "padding":"0", "border-style": "none"
			});

			self.modal.$wrapper.find('.modal-content').css({
				"width": "100%", "height": "100%", "left": "0", "top": "0", "border-style": "none"
			});
		}

		setTimeout(function () {
			self.render();
		}, 200);
	}

	_adjust_height(){
		return typeof this.adjust_height == "undefined" ? 0 : this.adjust_height;
	}

	render(){
		let self = this;
		self.set_title();

		if(typeof self.customize != "undefined"){
			self.modal.$wrapper.find(".modal-body").empty();
			self.modal.$wrapper.css({
				"color": "#73879C"
			})
			self.modal.$wrapper.find('.modal-header').css({
				"background-color": "#2A3F54",
				"padding": "5px",
				"height": "42px",
				"border-style": "none",
				"border-radius": "0",
			});
			self.modal.$wrapper.find('.modal-body').css({
				"background-color": "transparent",
				"padding": "0",
				"height": `calc(100% - ${42 + this._adjust_height()}px)`,
				"border-style": "none",
				"border-radius": "0",
				"overflow-y": "auto"
			});
			self.modal.$wrapper.find('.modal-title').css({
				"margin": "0"
			});
			self.modal.$wrapper.find(".text-right.buttons").prepend("<label class='btn-container'></label>")
		}

		if(typeof self.from_server == "undefined") {
			if(self.call_back){
				self.call_back();
			}
		}else{
			self.load_data();
		}
	}

	set_title(){

	}

	container(){return this.modal.$wrapper.find(".modal-body")}
	title_container(){return this.modal.$wrapper.find(".modal-title")}
	buttons_container(){return this.modal.$wrapper.find(".text-right.buttons .btn-container")}

	show(){
		this.modal.show()
	}

	hide(){
		this.modal.hide()
	}

	loading() {
		this.modal.fields_dict.ht.$wrapper.html(
			"<div class='loading-form' style='font-size: xx-large; text-align: center; color: #8D99A6'>" + __("Loading") + "...</div>"
		);
	}

	stop_loading() {
		//this.modal.fields_dict.ht.$wrapper.html("");
	}
	load_data(){
		let self = this;
		console.log(self.model, self.model_name, self.action);

		CETI.api.call({
			model: self.model,
			name: self.model_name,
			method: self.action,
			args:{},
			always: function (r) {
				self.container().empty().append(r.message);
				self.stop_loading();
				if(self.call_back){
					self.call_back();
				}
			},
		})
    }

    reload(){
		//this.call_back = call_back;
		this.load_data();
	}
}