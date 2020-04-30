class NumPad{
    constructor(options) {
        Object.assign(this, options);
        this.input = undefined;
        this.html = "";
        this.make();
    }

    make(){
		let self = this;
		const default_class = `pad-col btn-default `;

		let num_pads = {
			1: {
				7: {props: {class: "sm pad-btn"}},
				8: {props: {class: "sm pad-btn"}},
				9: {props: {class: "sm pad-btn"}},
				Del: {props: {class: "md pad-btn"}, content: '<span class="fa fa-arrow-left pull-left" style="font-size: 16px; padding-top: 3px"/>', action: "delete"},
            },
			2: {
				4: {props: {class: "sm pad-btn"}},
				5: {props: {class: "sm pad-btn"}},
				6: {props: {class: "sm pad-btn"}},
				Enter: {props: {class: "md pad-btn", rowspan: "3"}, content: '<br><br><span class="fa fa-level-down" style="font-size: 25px; transform: rotate(90deg);"/>', action: "enter"},
            },
			3: {
				1: {props: {class: "sm pad-btn"}},
				2: {props: {class: "sm pad-btn"}},
				3: {props: {class: "sm pad-btn"}},
            },
			4: {
				0: {props: {class: "sm pad-btn", colspan: 2}},
				'.': {props: {class: "sm pad-btn"}, action: "key"},
			}
		}

		this.html = "<table class='pad-container'><tbody>";
		for (let row in num_pads){
			this.html += "<tr class='pad-row'>";
			if(!num_pads.hasOwnProperty(row)) continue;

			for(let _col in num_pads[row]) {
				if (!num_pads[row].hasOwnProperty(_col)) continue;

				let col = num_pads[row][_col];
				col.props.class += ` ${default_class}-${_col}`;
				this.html +=`${
					new JSHtml({
						tag: "td",
						properties: col.props,
						content: `{{text}} ${typeof col.content != "undefined" ? col.content : ""}`,
						text: __(_col),
					}).on("click", function (){
						if(col.action === "enter"){
							if(self.on_enter != null){
								self.on_enter();
							}
						}else if(typeof self.input != "undefined"){
							if(col.action === "delete"){
								self.input.delete_value();
							}else{
								self.input.write(_col);
							}
						}
					}, "").html()
				}`
			}
			this.html += "</tr>";
		}
		this.html += "</tbody></table>";

		if(typeof this.wrapper != "undefined"){
			$(this.wrapper).empty().append(this.html);
		}
	}
}