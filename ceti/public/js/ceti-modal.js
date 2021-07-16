class CETIModal{
	constructor(options) {
		Object.assign(this, options);
		this.id = "ceti-" + Math.random().toString(36).substr(2, 15);
		this.modal = null;
		this.construct();
	}

	construct(){
		this.modal = new frappe.ui.Dialog({
			title: this.title,
			primary_action_label: __("Save"),
		});

		this.show();
		
		if(this.full_page){
			this.modal.$wrapper.find('.modal-dialog').css({
				"width": "100%", "height": "100%", "left": "0", "top": "0", "margin": "0", "padding":"0", "border-style": "none",
				"max-width": "unset", "max-height": "unset"
			});

			this.modal.$wrapper.find('.modal-content').css({
				"width": "100%", "height": "100%", "left": "0", "top": "0", "border-style": "none", "border-radius": "0",
				"max-width": "unset", "max-height": "unset"
			});
		}

		setTimeout(() => {
			this.render();
		}, 200);
	}

	_adjust_height(){
		return typeof this.adjust_height == "undefined" ? 0 : this.adjust_height;
	}

	render(){
		this.set_title();

		if(typeof this.customize != "undefined"){
			this.modal.$wrapper.find(".modal-body").empty();

			this.modal.$wrapper.css({
				"height": `calc(100% - ${this._adjust_height()}px)`,
				"border-bottom": "var(--default-line)",
			});

			this.modal.$wrapper.find('.modal-header').css({
				"padding": "5px",
				"border-bottom": "var(--default-line)",
				"border-radius": "0",
			});

			this.modal.$wrapper.find('.modal-body').css({
				"background-color": "transparent",
				"padding": "0",
				"border-style": "none",
				"border-radius": "0",
				"overflow-y": "auto"
			});

			this.modal.$wrapper.find('.modal-title').css({
				"margin": "0"
			});

			this.modal.$wrapper.find(".modal-actions").prepend("<span class='btn-container'></span>").css({
				"top": "5px"
			});
		}

		if(typeof this.from_server == "undefined") {
			if(this.call_back){
				this.call_back();
			}
		}else{
			this.load_data();
		}
	}

	set_title(){

	}

	container(){return this.modal.$wrapper.find(".modal-body")}
	title_container(){return this.modal.$wrapper.find(".modal-title")}
	buttons_container(){return this.modal.$wrapper.find(".modal-actions .btn-container")}

	show(){
		this.modal.show();
	}

	hide(){
		this.modal.hide();
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
		CETI.api.call({
			model: this.model,
			name: this.model_name,
			method: this.action,
			args:{},
			always: (r) => {
				this.container().empty().append(r.message);
				this.stop_loading();
				if(this.call_back){
					this.call_back();
				}
			},
		})
    }

    reload(){
		this.load_data();
	}
}