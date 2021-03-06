# -*- coding: utf-8 -*-
from __future__ import unicode_literals

app_name = "ceti"
app_title = "CETI"
app_publisher = "CETI"
app_description = "CETI"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@ceti.systems"
app_license = "MIT"

app_include_css = [
    "/assets/ceti/css/ceti.css",
    "/assets/ceti/css/num-pad.css",
]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_js = [
    "/assets/ceti/js/jshtml-class.js",
    "/assets/ceti/js/num-pad-class.js",
    "/assets/ceti/js/ceti-modal.js",
    "/assets/ceti/js/ceti-api.js",
    "/assets/ceti/js/ceti-form-class.js",
]

# include js, css files in header of web template
# web_include_css = "/assets/ceti/css/ceti.css"
# web_include_js = "/assets/ceti/js/ceti.js"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "ceti.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "ceti.install.before_install"
# after_install = "ceti.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "ceti.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"ceti.tasks.all"
# 	],
# 	"daily": [
# 		"ceti.tasks.daily"
# 	],
# 	"hourly": [
# 		"ceti.tasks.hourly"
# 	],
# 	"weekly": [
# 		"ceti.tasks.weekly"
# 	]
# 	"monthly": [
# 		"ceti.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "ceti.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "ceti.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "ceti.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]
