class CETIForm{
	constructor(options) {
		Object.assign(this, options, {
			container: "form-" + Math.random().toString(36).substr(2, 9),
			modal: null,
			form: null,
		});
		this.options = options;
		this.construct();
		this.show();
	}

	construct(){
		let self = this;
		self.modal = new frappe.ui.Dialog({
			title: self.title,
			fields: [
				{fieldname: self.container, fieldtype: 'HTML'},
				{fieldname: 'ht', fieldtype: 'HTML'},
			],
			
			/*primary_action: function() {
				if(self.form) {
					self.form.save(self.has_payment);
				}
			},*/
			//primary_action_label: __("Save"),
			on_hide: function () {
				close_grid_and_dialog();
			}
		});


		function close_grid_and_dialog() {
			// close open grid row
			var open_row = $(".grid-row-open");
			if (open_row.length) {
				var grid_row = open_row.data("grid_row");
				grid_row.toggle_view(false);
				return false;
			}

			// close open dialog
			if (cur_dialog && !cur_dialog.no_cancel_flag) {
				cur_dialog.cancel();
				return false;
			}
		}

		if (!self.disabled_to_save){
			self.modal.set_primary_action(__("Save"), function() {
				if(self.form) {
					self.form.save(self.has_payment);
				}
			});

			/*self.modal["primary_action"] = function() {
				if(self.form) {
					self.form.save(self.has_payment);
				}
			}*/
			//self.modal.get_primary_btn().attr('disabled', true).addClass("hidden");
		}

		self.modal.fields_dict.ht.$wrapper.html(
			`<div class='loading-form' style='font-size: xx-large; text-align: center; color: #8D99A6'>${__("Loading")}...</div>`
		);

		if(self.close_only_button){
			self.modal.$wrapper.attr({"data-keyboard":"false", "data-backdrop": "static", "id": `${self.container}`})
		}

		self.modal.$wrapper.prepend(`
			<style>
				#${self.container} .form-grid .grid-body .data-row .col.col-xs-1 .btn-open-row{
					display: none;
				}
			</style>
		`)
		//

		setTimeout(function () {
			self.load();
		}, 200);
	}

	load(background=false){
		let self = this;
		if(typeof self.before_load != "undefined"){
			self.before_load()
		}
		self.form = new FrappeForm(self.options, self.container, background);
	}

	reload(){
		let self = this;
		$("div[data-fieldname=" + this.container + "]").empty();
		self.load();
	}

	background_reload(){
		let self = this;
		self.load(true);
	}

	show(){
		this.modal.show()
	}

	hide(){
		this.modal.hide()
	}
}

class FrappeForm {
	constructor(options, wrapper, background=false) {
		Object.assign(this, options, {
			wrapper: $("div[data-fieldname=" + wrapper + "]")
		});
		this.container = wrapper;
		this.ready = false;
		this.get_data(background);
	}

	get_data(background=false) {
		frappe.call({
			method: 'ceti.ceti.doctype.ceti_form.ceti_form.get_form_data',
			args: {
				doctype: this.doctype,
				docname: this.docname,
				form_name: this.form_name
			},
			freeze: background===false,
		}).then(r => {
			$("div[data-fieldname=" + this.container + "]").empty();
			const { doc, ceti_form, links } = r.message;
			ceti_form.ceti_form_fields.map(df => {
				if (df.fieldtype === 'Table') {

					df.get_data = () => {
						let data = [];
						if(doc) {
							data = doc[df.fieldname];
						}
						return data;
					};

					df.options = null;

					if (r.message.hasOwnProperty(df.fieldname)) {
						df.fields = r.message[df.fieldname];
					}
				}
			});

			this.render(doc, ceti_form, links);
		});
	}

	render(doc, ceti_form) {
		let self = this;
		const query_params = frappe.utils.get_query_params();

		ceti_form.ceti_form_fields.map(df => {

			if (df.fieldtype==='Attach') {
				df.is_private = true;
			}

			// Set defaults
			if (query_params && query_params["new"] == 1 && df.fieldname in query_params) {
				df.default = query_params[df.fieldname];
			}

			delete df.parent;
			delete df.parentfield;
			delete df.parenttype;
			delete df.doctype;

			return df;
		});

		this.field_group = new frappe.ui.FieldGroup({
			parent: this.wrapper,
			fields: ceti_form.ceti_form_fields
		});

		this.field_group.make();

		this.wrapper.find(".form-column").unwrap(".section-body");

		if(doc) {
			this.field_group.set_values(doc);
		}

		setTimeout(() => {
			this.field_group.fields_list.forEach((field_instance) => {
				let instance_value = field_instance.value;
				if (instance_value != null && field_instance.df.fieldtype === "Attach" && instance_value.match(".(?:jpg|gif|jpeg|png)") ){
					field_instance.$input_wrapper.append(`<img src=${field_instance.get_value()} width="auto" height=200>`);
				}
			});
			this.ready = true;
			$(".loading-form").remove();
		}, 0);

		this.set_initial_values(doc);

		if(typeof self.after_load != "undefined"){
			self.after_load();
		}
	}

	set_initial_values(doc){
		for(let field in this.initial_values) {
			if(this.initial_values.hasOwnProperty(field)){
				this.set_value(field, this.initial_values[field]);
			}
		}

		for (let field in this.field_properties){
			if(this.hasOwnProperty("field_properties")){
				if(this.field_properties.hasOwnProperty(field)){
					for ( let prop in this.field_properties[field]){
						if(this.field_properties[field].hasOwnProperty(prop)){
							this.set_field_property(field, prop, this.field_properties[field][prop])
						}
					}
				}
			}
		}

		setInterval(() => {
			this.wrapper.find("[data-fieldtype='Table']").find("div[data-fieldname='name']").hide();
			this.wrapper.find("[data-fieldtype='Table']").find("button[data-action='delete_all_rows']").hide();
			this.wrapper.find("[data-fieldtype='Table']").find(".grid-delete-row").hide();
		}, 100)
	}

	get_form(){
		return $("div[data-web-form='"+this.form_name+"']");
	}

	get_values() {
		let values = this.field_group.get_values(this.allow_incomplete);
		if (!values) return null;
		values.doctype = this.doctype;
		values.name = this.docname;
		values.form_name = this.form_name;
		return values;
	}

	get_field(fieldname) {
		const field = this.field_group.fields_dict[fieldname];
		if (!field) {
			throw `No field ${fieldname}`;
		}
		return field;
	}

	get_input(fieldname) {
		const $input = this.get_field(fieldname).$input;
		if (!$input) {
			throw `Cannot set trigger for ${fieldname}`;
		}
		return $input;
	}

	get_value(fieldname) {
		return this.field_group.get_value(fieldname);
	}

	set_value(fieldname, value) {
		return this.field_group.set_value(fieldname, value);
	}

	set_field_property(fieldname, property, value) {
		const field = this.get_field(fieldname);
		field.df[property] = value;
		field.refresh();
	}

	on(fieldname, fn) {
		const field = this.get_field(fieldname);
		const $input = this.get_input(fieldname);
		$input.on('change', (event) => {
			return fn(field, field.get_value(), event);
		});
	}

	validate() {
		return true;
	}

	save(for_payment, on_save=null) {
		if(!this.ready) return;

		let self = this;
		if (self.validate()===false) {
			return false;
		}

		let data = self.get_values();
		if (!data) {
			return false;
		}

		if (window.saving) {
			return false;
		}

		window.saving = true;
		frappe.form_dirty = false;
		var $form = self.get_form();

		frappe.call({
			type: "POST",
			method: 'ceti.ceti.doctype.ceti_form.ceti_form.accept',
			args: {
				data: data,
				ceti_form: self.form_name,
				docname: self.docname,
				for_payment: for_payment
			},
			freeze: true,
			btn: $form.find("[type='submit']"),
			callback: function(data) {
				if(!data.exc) {
					self.doc_name = data.message.name;
					if(!frappe.login_required) {
						show_success_message($form);
					}

					if(frappe.is_new && frappe.login_required) {
						// reload page (with ID)
						window.location.href = window.location.pathname + "?name=" + frappe.doc_name;
					}

					if(for_payment && data.message) {
						// redirect to payment
						window.location.href = data.message;
					}

					// refresh values
					if (self.ceti_form) {
						self.ceti_form.field_group.set_values(data.message);
					}

					if(typeof self.call_back != "undefined"){
						self.call_back();
					}

					if(on_save != null){
						on_save();
					}

				} else {
					frappe.msgprint(__('There were errors. Please report this.'));
				}
			},
			always: function(r) {
				window.saving = false;
			}
		});
		return true;
	}
}

function show_success_message($form) {
	$form.addClass("hide");
	$(".comments, .introduction, .page-head").addClass("hide");
	scroll(0, 0);
	set_message(frappe.success_link, true);
}

function set_message(msg, permanent) {
	$(".form-message")
		.html(msg)
		.removeClass("hide");

	if(!permanent) {
		setTimeout(function() {
			$(".form-message").addClass('hide');
		}, 5000);
	}
}