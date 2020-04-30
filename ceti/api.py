# -*- coding: utf-8 -*-
# Copyright (c) 2020, CETI Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import json


@frappe.whitelist()
def call(model, name, method, args=None):
    doc = frappe.get_doc(model, name)
    if args is not None:
        _args = json.loads(args)
        #args = [_args[arg] for arg in _args]
        kwargs = {arg: _args[arg] for arg in _args}
        return getattr(doc, method)(**kwargs)
        #return doc.run_method(method, **kwargs)
    else:
        return getattr(doc, method)
