class NumPad {
    constructor(options) {
        Object.assign(this, options);
        this.input = null;
        this.html = "";
        this.make();
    }

    make() {
        const default_class = `pad-col button btn-default`;

        let num_pads = [
            {
                7: {props: {class: "sm pad-btn"}},
                8: {props: {class: "sm pad-btn"}},
                9: {props: {class: "sm pad-btn"}},
                Del: {
                    props: {class: "md pad-btn"},
                    content: '<span class="fa fa-arrow-left pull-left" style="font-size: 16px; padding-top: 3px"/>',
                    action: "delete"
                },
            },
            {
                4: {props: {class: "sm pad-btn"}},
                5: {props: {class: "sm pad-btn"}},
                6: {props: {class: "sm pad-btn"}},
                Enter: {
                    props: {class: "md pad-btn", rowspan: "3"},
                    content: '<br><br><span class="fa fa-level-down" style="font-size: 25px; transform: rotate(90deg);"/>',
                    action: "enter"
                },
            },
            {
                1: {props: {class: "sm pad-btn"}},
                2: {props: {class: "sm pad-btn"}},
                3: {props: {class: "sm pad-btn"}},
            },
            {
                0: {props: {class: "sm pad-btn", colspan: 2}},
                '.': {props: {class: "sm pad-btn"}, action: "key"},
            }
        ];

        this.html = "<table class='pad-container'><tbody>";
        num_pads.map(row => {
            this.html += "<tr class='pad-row'>";

            Object.keys(row).map((key) => {
                let col = row[key];
                col.props.class += ` ${default_class}-${key}`;
                this.html += `${
                    new JSHtml({
                        tag: "td",
                        properties: col.props,
                        content: `{{text}} ${typeof col.content != "undefined" ? col.content : ""}`,
                        text: __(key),
                    }).on("click", () => {
                        if (col.action === "enter") {
                            if (this.on_enter != null) {
                                this.on_enter();
                            }
                        } else if (typeof this.input != "undefined") {
                            if (col.action === "delete") {
                                this.input.delete_value();
                            } else {
                                this.input.write(key);
                            }
                        }
                    }, "").html()
                }`
            });
            this.html += "</tr>";
        });
        this.html += "</tbody></table>";

        if (typeof this.wrapper != "undefined") {
            $(this.wrapper).empty().append(this.html);
        }
    }
}