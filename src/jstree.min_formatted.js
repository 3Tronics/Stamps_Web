/*! jsTree - v3.3.11 - 2020-12-18 - (MIT) */ ! function(a) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof module && module.exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a, b) {
	"use strict";
	if (!a.jstree) {
		var c = 0,
			d = !1,
			e = !1,
			f = !1,
			g = [],
			h = a("script:last").attr("src"),
			i = window.document,
			j = window.setImmediate,
			k = window.Promise;
		!j && k && (j = function(a, b) {
			k.resolve(b).then(a)
		}), a.jstree = {
			version: "3.3.11",
			defaults: {
				plugins: []
			},
			plugins: {},
			path: h && -1 !== h.indexOf("/") ? h.replace(/\/[^\/]+$/, "") : "",
			idregex: /[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%?`]/g,
			root: "#"
		}, a.jstree.create = function(b, d) {
			var e = new a.jstree.core(++c),
				f = d;
			return d = a.extend(!0, {}, a.jstree.defaults, d), f && f.plugins && (d.plugins = f.plugins), a.each(d.plugins, function(a, b) {
				"core" !== a && (e = e.plugin(b, d[b]))
			}), a(b).data("jstree", e), e.init(b, d), e
		}, a.jstree.destroy = function() {
			a(".jstree:jstree").jstree("destroy"), a(i).off(".jstree")
		}, a.jstree.core = function(a) {
			this._id = a, this._cnt = 0, this._wrk = null, this._data = {
				core: {
					themes: {
						name: !1,
						dots: !1,
						icons: !1,
						ellipsis: !1
					},
					selected: [],
					last_error: {},
					working: !1,
					worker_queue: [],
					focused: null
				}
			}
		}, a.jstree.reference = function(b) {
			var c = null,
				d = null;
			if (!b || !b.id || b.tagName && b.nodeType || (b = b.id), !d || !d.length) try {
				d = a(b)
			} catch (e) {}
			if (!d || !d.length) try {
				d = a("#" + b.replace(a.jstree.idregex, "\\$&"))
			} catch (e) {}
			return d && d.length && (d = d.closest(".jstree")).length && (d = d.data("jstree")) ? c = d : a(".jstree").each(function() {
				var d = a(this).data("jstree");
				return d && d._model.data[b] ? (c = d, !1) : void 0
			}), c
		}, a.fn.jstree = function(c) {
			var d = "string" == typeof c,
				e = Array.prototype.slice.call(arguments, 1),
				f = null;
			return c !== !0 || this.length ? (this.each(function() {
				var g = a.jstree.reference(this),
					h = d && g ? g[c] : null;
				return f = d && h ? h.apply(g, e) : null, g || d || c !== b && !a.isPlainObject(c) || a.jstree.create(this, c), (g && !d || c === !0) && (f = g || !1), null !== f && f !== b ? !1 : void 0
			}), null !== f && f !== b ? f : this) : !1
		}, a.expr.pseudos.jstree = a.expr.createPseudo(function(c) {
			return function(c) {
				return a(c).hasClass("jstree") && a(c).data("jstree") !== b
			}
		}), a.jstree.defaults.core = {
			data: !1,
			strings: !1,
			check_callback: !1,
			error: a.noop,
			animation: 200,
			multiple: !0,
			themes: {
				name: !1,
				url: !1,
				dir: !1,
				dots: !0,
				icons: !0,
				ellipsis: !1,
				stripes: !1,
				variant: !1,
				responsive: !1
			},
			expand_selected_onload: !0,
			worker: !0,
			force_text: !1,
			dblclick_toggle: !0,
			loaded_state: !1,
			restore_focus: !0,
			compute_elements_positions: !1,
			keyboard: {
				"ctrl-space": function(b) {
					b.type = "click", a(b.currentTarget).trigger(b)
				},
				enter: function(b) {
					b.type = "click", a(b.currentTarget).trigger(b)
				},
				left: function(b) {
					if (b.preventDefault(), this.is_open(b.currentTarget)) this.close_node(b.currentTarget);
					else {
						var c = this.get_parent(b.currentTarget);
						c && c.id !== a.jstree.root && this.get_node(c, !0).children(".jstree-anchor").focus()
					}
				},
				up: function(a) {
					a.preventDefault();
					var b = this.get_prev_dom(a.currentTarget);
					b && b.length && b.children(".jstree-anchor").focus()
				},
				right: function(b) {
					if (b.preventDefault(), this.is_closed(b.currentTarget)) this.open_node(b.currentTarget, function(a) {
						this.get_node(a, !0).children(".jstree-anchor").focus()
					});
					else if (this.is_open(b.currentTarget)) {
						var c = this.get_node(b.currentTarget, !0).children(".jstree-children")[0];
						c && a(this._firstChild(c)).children(".jstree-anchor").focus()
					}
				},
				down: function(a) {
					a.preventDefault();
					var b = this.get_next_dom(a.currentTarget);
					b && b.length && b.children(".jstree-anchor").focus()
				},
				"*": function(a) {
					this.open_all()
				},
				home: function(b) {
					b.preventDefault();
					var c = this._firstChild(this.get_container_ul()[0]);
					c && a(c).children(".jstree-anchor").filter(":visible").focus()
				},
				end: function(a) {
					a.preventDefault(), this.element.find(".jstree-anchor").filter(":visible").last().focus()
				},
				f2: function(a) {
					a.preventDefault(), this.edit(a.currentTarget)
				}
			}
		}, a.jstree.core.prototype = {
			plugin: function(b, c) {
				var d = a.jstree.plugins[b];
				return d ? (this._data[b] = {}, d.prototype = this, new d(c, this)) : this
			},
			init: function(b, c) {
				this._model = {
					data: {},
					changed: [],
					force_full_redraw: !1,
					redraw_timeout: !1,
					default_state: {
						loaded: !0,
						opened: !1,
						selected: !1,
						disabled: !1
					}
				}, this._model.data[a.jstree.root] = {
					id: a.jstree.root,
					parent: null,
					parents: [],
					children: [],
					children_d: [],
					state: {
						loaded: !1
					}
				}, this.element = a(b).addClass("jstree jstree-" + this._id), this.settings = c, this._data.core.ready = !1, this._data.core.loaded = !1, this._data.core.rtl = "rtl" === this.element.css("direction"), this.element[this._data.core.rtl ? "addClass" : "removeClass"]("jstree-rtl"), this.element.attr("role", "tree"), this.settings.core.multiple && this.element.attr("aria-multiselectable", !0), this.element.attr("tabindex") || this.element.attr("tabindex", "0"), this.bind(), this.trigger("init"), this._data.core.original_container_html = this.element.find(" > ul > li").clone(!0), this._data.core.original_container_html.find("li").addBack().contents().filter(function() {
					return 3 === this.nodeType && (!this.nodeValue || /^\s+$/.test(this.nodeValue))
				}).remove(), this.element.html("<ul class='jstree-container-ul jstree-children' role='group'><li id='j" + this._id + "_loading' class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='none'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' role='treeitem' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this.element.attr("aria-activedescendant", "j" + this._id + "_loading"), this._data.core.li_height = this.get_container_ul().children("li").first().outerHeight() || 24, this._data.core.node = this._create_prototype_node(), this.trigger("loading"), this.load_node(a.jstree.root)
			},
			destroy: function(a) {
				if (this.trigger("destroy"), this._wrk) try {
					window.URL.revokeObjectURL(this._wrk), this._wrk = null
				} catch (b) {}
				a || this.element.empty(), this.teardown()
			},
			_create_prototype_node: function() {
				var a = i.createElement("LI"),
					b, c;
				return a.setAttribute("role", "none"), b = i.createElement("I"), b.className = "jstree-icon jstree-ocl", b.setAttribute("role", "presentation"), a.appendChild(b), b = i.createElement("A"), b.className = "jstree-anchor", b.setAttribute("href", "#"), b.setAttribute("tabindex", "-1"), b.setAttribute("role", "treeitem"), c = i.createElement("I"), c.className = "jstree-icon jstree-themeicon", c.setAttribute("role", "presentation"), b.appendChild(c), a.appendChild(b), b = c = null, a
			},
			_kbevent_to_func: function(a) {
				var b = {
						8: "Backspace",
						9: "Tab",
						13: "Enter",
						19: "Pause",
						27: "Esc",
						32: "Space",
						33: "PageUp",
						34: "PageDown",
						35: "End",
						36: "Home",
						37: "Left",
						38: "Up",
						39: "Right",
						40: "Down",
						44: "Print",
						45: "Insert",
						46: "Delete",
						96: "Numpad0",
						97: "Numpad1",
						98: "Numpad2",
						99: "Numpad3",
						100: "Numpad4",
						101: "Numpad5",
						102: "Numpad6",
						103: "Numpad7",
						104: "Numpad8",
						105: "Numpad9",
						"-13": "NumpadEnter",
						112: "F1",
						113: "F2",
						114: "F3",
						115: "F4",
						116: "F5",
						117: "F6",
						118: "F7",
						119: "F8",
						120: "F9",
						121: "F10",
						122: "F11",
						123: "F12",
						144: "Numlock",
						145: "Scrolllock",
						16: "Shift",
						17: "Ctrl",
						18: "Alt",
						48: "0",
						49: "1",
						50: "2",
						51: "3",
						52: "4",
						53: "5",
						54: "6",
						55: "7",
						56: "8",
						57: "9",
						59: ";",
						61: "=",
						65: "a",
						66: "b",
						67: "c",
						68: "d",
						69: "e",
						70: "f",
						71: "g",
						72: "h",
						73: "i",
						74: "j",
						75: "k",
						76: "l",
						77: "m",
						78: "n",
						79: "o",
						80: "p",
						81: "q",
						82: "r",
						83: "s",
						84: "t",
						85: "u",
						86: "v",
						87: "w",
						88: "x",
						89: "y",
						90: "z",
						107: "+",
						109: "-",
						110: ".",
						186: ";",
						187: "=",
						188: ",",
						189: "-",
						190: ".",
						191: "/",
						192: "`",
						219: "[",
						220: "\\",
						221: "]",
						222: "'",
						111: "/",
						106: "*",
						173: "-"
					},
					c = [];
				if (a.ctrlKey && c.push("ctrl"), a.altKey && c.push("alt"), a.shiftKey && c.push("shift"), c.push(b[a.which] || a.which), c = c.sort().join("-").toLowerCase(), "shift-shift" === c || "ctrl-ctrl" === c || "alt-alt" === c) return null;
				var d = this.settings.core.keyboard,
					e, f;
				for (e in d)
					if (d.hasOwnProperty(e) && (f = e, "-" !== f && "+" !== f && (f = f.replace("--", "-MINUS").replace("+-", "-MINUS").replace("++", "-PLUS").replace("-+", "-PLUS"), f = f.split(/-|\+/).sort().join("-").replace("MINUS", "-").replace("PLUS", "+").toLowerCase()), f === c)) return d[e];
				return null
			},
			teardown: function() {
				this.unbind(), this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class", function() {
					return this.className.replace(/jstree[^ ]*|$/gi, "")
				}), this.element = null
			},
			bind: function() {
				var b = "",
					c = null,
					d = 0;
				this.element.on("dblclick.jstree", function(a) {
					if (a.target.tagName && "input" === a.target.tagName.toLowerCase()) return !0;
					if (i.selection && i.selection.empty) i.selection.empty();
					else if (window.getSelection) {
						var b = window.getSelection();
						try {
							b.removeAllRanges(), b.collapse()
						} catch (c) {}
					}
				}).on("mousedown.jstree", a.proxy(function(a) {
					a.target === this.element[0] && (a.preventDefault(), d = +new Date)
				}, this)).on("mousedown.jstree", ".jstree-ocl", function(a) {
					a.preventDefault()
				}).on("click.jstree", ".jstree-ocl", a.proxy(function(a) {
					this.toggle_node(a.target)
				}, this)).on("dblclick.jstree", ".jstree-anchor", a.proxy(function(a) {
					return a.target.tagName && "input" === a.target.tagName.toLowerCase() ? !0 : void(this.settings.core.dblclick_toggle && this.toggle_node(a.target))
				}, this)).on("click.jstree", ".jstree-anchor", a.proxy(function(b) {
					b.preventDefault(), b.currentTarget !== i.activeElement && a(b.currentTarget).focus(), this.activate_node(b.currentTarget, b)
				}, this)).on("keydown.jstree", ".jstree-anchor", a.proxy(function(a) {
					if (a.target.tagName && "input" === a.target.tagName.toLowerCase()) return !0;
					this._data.core.rtl && (37 === a.which ? a.which = 39 : 39 === a.which && (a.which = 37));
					var b = this._kbevent_to_func(a);
					if (b) {
						var c = b.call(this, a);
						if (c === !1 || c === !0) return c
					}
				}, this)).on("load_node.jstree", a.proxy(function(b, c) {
					c.status && (c.node.id !== a.jstree.root || this._data.core.loaded || (this._data.core.loaded = !0, this._firstChild(this.get_container_ul()[0]) && this.element.attr("aria-activedescendant", this._firstChild(this.get_container_ul()[0]).id), this.trigger("loaded")), this._data.core.ready || setTimeout(a.proxy(function() {
						if (this.element && !this.get_container_ul().find(".jstree-loading").length) {
							if (this._data.core.ready = !0, this._data.core.selected.length) {
								if (this.settings.core.expand_selected_onload) {
									var b = [],
										c, d;
									for (c = 0, d = this._data.core.selected.length; d > c; c++) b = b.concat(this._model.data[this._data.core.selected[c]].parents);
									for (b = a.vakata.array_unique(b), c = 0, d = b.length; d > c; c++) this.open_node(b[c], !1, 0)
								}
								this.trigger("changed", {
									action: "ready",
									selected: this._data.core.selected
								})
							}
							this.trigger("ready")
						}
					}, this), 0))
				}, this)).on("keypress.jstree", a.proxy(function(d) {
					if (d.target.tagName && "input" === d.target.tagName.toLowerCase()) return !0;
					c && clearTimeout(c), c = setTimeout(function() {
						b = ""
					}, 500);
					var e = String.fromCharCode(d.which).toLowerCase(),
						f = this.element.find(".jstree-anchor").filter(":visible"),
						g = f.index(i.activeElement) || 0,
						h = !1;
					if (b += e, b.length > 1) {
						if (f.slice(g).each(a.proxy(function(c, d) {
								return 0 === a(d).text().toLowerCase().indexOf(b) ? (a(d).focus(), h = !0, !1) : void 0
							}, this)), h) return;
						if (f.slice(0, g).each(a.proxy(function(c, d) {
								return 0 === a(d).text().toLowerCase().indexOf(b) ? (a(d).focus(), h = !0, !1) : void 0
							}, this)), h) return
					}
					if (new RegExp("^" + e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "+$").test(b)) {
						if (f.slice(g + 1).each(a.proxy(function(b, c) {
								return a(c).text().toLowerCase().charAt(0) === e ? (a(c).focus(), h = !0, !1) : void 0
							}, this)), h) return;
						if (f.slice(0, g + 1).each(a.proxy(function(b, c) {
								return a(c).text().toLowerCase().charAt(0) === e ? (a(c).focus(), h = !0, !1) : void 0
							}, this)), h) return
					}
				}, this)).on("init.jstree", a.proxy(function() {
					var a = this.settings.core.themes;
					this._data.core.themes.dots = a.dots, this._data.core.themes.stripes = a.stripes, this._data.core.themes.icons = a.icons, this._data.core.themes.ellipsis = a.ellipsis, this.set_theme(a.name || "default", a.url), this.set_theme_variant(a.variant)
				}, this)).on("loading.jstree", a.proxy(function() {
					this[this._data.core.themes.dots ? "show_dots" : "hide_dots"](), this[this._data.core.themes.icons ? "show_icons" : "hide_icons"](), this[this._data.core.themes.stripes ? "show_stripes" : "hide_stripes"](), this[this._data.core.themes.ellipsis ? "show_ellipsis" : "hide_ellipsis"]()
				}, this)).on("blur.jstree", ".jstree-anchor", a.proxy(function(b) {
					this._data.core.focused = null, a(b.currentTarget).filter(".jstree-hovered").trigger("mouseleave"), this.element.attr("tabindex", "0")
				}, this)).on("focus.jstree", ".jstree-anchor", a.proxy(function(b) {
					var c = this.get_node(b.currentTarget);
					c && c.id && (this._data.core.focused = c.id), this.element.find(".jstree-hovered").not(b.currentTarget).trigger("mouseleave"), a(b.currentTarget).trigger("mouseenter"), this.element.attr("tabindex", "-1")
				}, this)).on("focus.jstree", a.proxy(function() {
					if (+new Date - d > 500 && !this._data.core.focused && this.settings.core.restore_focus) {
						d = 0;
						var a = this.get_node(this.element.attr("aria-activedescendant"), !0);
						a && a.find("> .jstree-anchor").focus()
					}
				}, this)).on("mouseenter.jstree", ".jstree-anchor", a.proxy(function(a) {
					this.hover_node(a.currentTarget)
				}, this)).on("mouseleave.jstree", ".jstree-anchor", a.proxy(function(a) {
					this.dehover_node(a.currentTarget)
				}, this))
			},
			unbind: function() {
				this.element.off(".jstree"), a(i).off(".jstree-" + this._id)
			},
			trigger: function(a, b) {
				b || (b = {}), b.instance = this, this.element.triggerHandler(a.replace(".jstree", "") + ".jstree", b)
			},
			get_container: function() {
				return this.element
			},
			get_container_ul: function() {
				return this.element.children(".jstree-children").first()
			},
			get_string: function(b) {
				var c = this.settings.core.strings;
				return a.isFunction(c) ? c.call(this, b) : c && c[b] ? c[b] : b
			},
			_firstChild: function(a) {
				a = a ? a.firstChild : null;
				while (null !== a && 1 !== a.nodeType) a = a.nextSibling;
				return a
			},
			_nextSibling: function(a) {
				a = a ? a.nextSibling : null;
				while (null !== a && 1 !== a.nodeType) a = a.nextSibling;
				return a
			},
			_previousSibling: function(a) {
				a = a ? a.previousSibling : null;
				while (null !== a && 1 !== a.nodeType) a = a.previousSibling;
				return a
			},
			get_node: function(b, c) {
				b && b.id && (b = b.id), b instanceof a && b.length && b[0].id && (b = b[0].id);
				var d;
				try {
					if (this._model.data[b]) b = this._model.data[b];
					else if ("string" == typeof b && this._model.data[b.replace(/^#/, "")]) b = this._model.data[b.replace(/^#/, "")];
					else if ("string" == typeof b && (d = a("#" + b.replace(a.jstree.idregex, "\\$&"), this.element)).length && this._model.data[d.closest(".jstree-node").attr("id")]) b = this._model.data[d.closest(".jstree-node").attr("id")];
					else if ((d = this.element.find(b)).length && this._model.data[d.closest(".jstree-node").attr("id")]) b = this._model.data[d.closest(".jstree-node").attr("id")];
					else {
						if (!(d = this.element.find(b)).length || !d.hasClass("jstree")) return !1;
						b = this._model.data[a.jstree.root]
					}
					return c && (b = b.id === a.jstree.root ? this.element : a("#" + b.id.replace(a.jstree.idregex, "\\$&"), this.element)), b
				} catch (e) {
					return !1
				}
			},
			get_path: function(b, c, d) {
				if (b = b.parents ? b : this.get_node(b), !b || b.id === a.jstree.root || !b.parents) return !1;
				var e, f, g = [];
				for (g.push(d ? b.id : b.text), e = 0, f = b.parents.length; f > e; e++) g.push(d ? b.parents[e] : this.get_text(b.parents[e]));
				return g = g.reverse().slice(1), c ? g.join(c) : g
			},
			get_next_dom: function(b, c) {
				var d;
				if (b = this.get_node(b, !0), b[0] === this.element[0]) {
					d = this._firstChild(this.get_container_ul()[0]);
					while (d && 0 === d.offsetHeight) d = this._nextSibling(d);
					return d ? a(d) : !1
				}
				if (!b || !b.length) return !1;
				if (c) {
					d = b[0];
					do d = this._nextSibling(d); while (d && 0 === d.offsetHeight);
					return d ? a(d) : !1
				}
				if (b.hasClass("jstree-open")) {
					d = this._firstChild(b.children(".jstree-children")[0]);
					while (d && 0 === d.offsetHeight) d = this._nextSibling(d);
					if (null !== d) return a(d)
				}
				d = b[0];
				do d = this._nextSibling(d); while (d && 0 === d.offsetHeight);
				return null !== d ? a(d) : b.parentsUntil(".jstree", ".jstree-node").nextAll(".jstree-node:visible").first()
			},
			get_prev_dom: function(b, c) {
				var d;
				if (b = this.get_node(b, !0), b[0] === this.element[0]) {
					d = this.get_container_ul()[0].lastChild;
					while (d && 0 === d.offsetHeight) d = this._previousSibling(d);
					return d ? a(d) : !1
				}
				if (!b || !b.length) return !1;
				if (c) {
					d = b[0];
					do d = this._previousSibling(d); while (d && 0 === d.offsetHeight);
					return d ? a(d) : !1
				}
				d = b[0];
				do d = this._previousSibling(d); while (d && 0 === d.offsetHeight);
				if (null !== d) {
					b = a(d);
					while (b.hasClass("jstree-open")) b = b.children(".jstree-children").first().children(".jstree-node:visible:last");
					return b
				}
				return d = b[0].parentNode.parentNode, d && d.className && -1 !== d.className.indexOf("jstree-node") ? a(d) : !1
			},
			get_parent: function(b) {
				return b = this.get_node(b), b && b.id !== a.jstree.root ? b.parent : !1
			},
			get_children_dom: function(a) {
				return a = this.get_node(a, !0), a[0] === this.element[0] ? this.get_container_ul().children(".jstree-node") : a && a.length ? a.children(".jstree-children").children(".jstree-node") : !1
			},
			is_parent: function(a) {
				return a = this.get_node(a), a && (a.state.loaded === !1 || a.children.length > 0)
			},
			is_loaded: function(a) {
				return a = this.get_node(a), a && a.state.loaded
			},
			is_loading: function(a) {
				return a = this.get_node(a), a && a.state && a.state.loading
			},
			is_open: function(a) {
				return a = this.get_node(a), a && a.state.opened
			},
			is_closed: function(a) {
				return a = this.get_node(a), a && this.is_parent(a) && !a.state.opened
			},
			is_leaf: function(a) {
				return !this.is_parent(a)
			},
			load_node: function(b, c) {
				var d, e, f, g, h;
				if (a.isArray(b)) return this._load_nodes(b.slice(), c), !0;
				if (b = this.get_node(b), !b) return c && c.call(this, b, !1), !1;
				if (b.state.loaded) {
					for (b.state.loaded = !1, f = 0, g = b.parents.length; g > f; f++) this._model.data[b.parents[f]].children_d = a.vakata.array_filter(this._model.data[b.parents[f]].children_d, function(c) {
						return -1 === a.inArray(c, b.children_d)
					});
					for (d = 0, e = b.children_d.length; e > d; d++) this._model.data[b.children_d[d]].state.selected && (h = !0), delete this._model.data[b.children_d[d]];
					h && (this._data.core.selected = a.vakata.array_filter(this._data.core.selected, function(c) {
						return -1 === a.inArray(c, b.children_d)
					})), b.children = [], b.children_d = [], h && this.trigger("changed", {
						action: "load_node",
						node: b,
						selected: this._data.core.selected
					})
				}
				return b.state.failed = !1, b.state.loading = !0, this.get_node(b, !0).addClass("jstree-loading").attr("aria-busy", !0), this._load_node(b, a.proxy(function(a) {
					b = this._model.data[b.id], b.state.loading = !1, b.state.loaded = a, b.state.failed = !b.state.loaded;
					var d = this.get_node(b, !0),
						e = 0,
						f = 0,
						g = this._model.data,
						h = !1;
					for (e = 0, f = b.children.length; f > e; e++)
						if (g[b.children[e]] && !g[b.children[e]].state.hidden) {
							h = !0;
							break
						}
					b.state.loaded && d && d.length && (d.removeClass("jstree-closed jstree-open jstree-leaf"), h ? "#" !== b.id && d.addClass(b.state.opened ? "jstree-open" : "jstree-closed") : d.addClass("jstree-leaf")), d.removeClass("jstree-loading").attr("aria-busy", !1), this.trigger("load_node", {
						node: b,
						status: a
					}), c && c.call(this, b, a)
				}, this)), !0
			},
			_load_nodes: function(a, b, c, d) {
				var e = !0,
					f = function() {
						this._load_nodes(a, b, !0)
					},
					g = this._model.data,
					h, i, j = [];
				for (h = 0, i = a.length; i > h; h++) g[a[h]] && (!g[a[h]].state.loaded && !g[a[h]].state.failed || !c && d) && (this.is_loading(a[h]) || this.load_node(a[h], f), e = !1);
				if (e) {
					for (h = 0, i = a.length; i > h; h++) g[a[h]] && g[a[h]].state.loaded && j.push(a[h]);
					b && !b.done && (b.call(this, j), b.done = !0)
				}
			},
			load_all: function(b, c) {
				if (b || (b = a.jstree.root), b = this.get_node(b), !b) return !1;
				var d = [],
					e = this._model.data,
					f = e[b.id].children_d,
					g, h;
				for (b.state && !b.state.loaded && d.push(b.id), g = 0, h = f.length; h > g; g++) e[f[g]] && e[f[g]].state && !e[f[g]].state.loaded && d.push(f[g]);
				d.length ? this._load_nodes(d, function() {
					this.load_all(b, c)
				}) : (c && c.call(this, b), this.trigger("load_all", {
					node: b
				}))
			},
			_load_node: function(b, c) {
				var d = this.settings.core.data,
					e, f = function g() {
						return 3 !== this.nodeType && 8 !== this.nodeType
					};
				return d ? a.isFunction(d) ? d.call(this, b, a.proxy(function(d) {
					d === !1 ? c.call(this, !1) : this["string" == typeof d ? "_append_html_data" : "_append_json_data"](b, "string" == typeof d ? a(a.parseHTML(d)).filter(f) : d, function(a) {
						c.call(this, a)
					})
				}, this)) : "object" == typeof d ? d.url ? (d = a.extend(!0, {}, d), a.isFunction(d.url) && (d.url = d.url.call(this, b)), a.isFunction(d.data) && (d.data = d.data.call(this, b)), a.ajax(d).done(a.proxy(function(d, e, g) {
					var h = g.getResponseHeader("Content-Type");
					return h && -1 !== h.indexOf("json") || "object" == typeof d ? this._append_json_data(b, d, function(a) {
						c.call(this, a)
					}) : h && -1 !== h.indexOf("html") || "string" == typeof d ? this._append_html_data(b, a(a.parseHTML(d)).filter(f), function(a) {
						c.call(this, a)
					}) : (this._data.core.last_error = {
						error: "ajax",
						plugin: "core",
						id: "core_04",
						reason: "Could not load node",
						data: JSON.stringify({
							id: b.id,
							xhr: g
						})
					}, this.settings.core.error.call(this, this._data.core.last_error), c.call(this, !1))
				}, this)).fail(a.proxy(function(a) {
					this._data.core.last_error = {
						error: "ajax",
						plugin: "core",
						id: "core_04",
						reason: "Could not load node",
						data: JSON.stringify({
							id: b.id,
							xhr: a
						})
					}, c.call(this, !1), this.settings.core.error.call(this, this._data.core.last_error)
				}, this))) : (e = a.isArray(d) ? a.extend(!0, [], d) : a.isPlainObject(d) ? a.extend(!0, {}, d) : d, b.id === a.jstree.root ? this._append_json_data(b, e, function(a) {
					c.call(this, a)
				}) : (this._data.core.last_error = {
					error: "nodata",
					plugin: "core",
					id: "core_05",
					reason: "Could not load node",
					data: JSON.stringify({
						id: b.id
					})
				}, this.settings.core.error.call(this, this._data.core.last_error), c.call(this, !1))) : "string" == typeof d ? b.id === a.jstree.root ? this._append_html_data(b, a(a.parseHTML(d)).filter(f), function(a) {
					c.call(this, a)
				}) : (this._data.core.last_error = {
					error: "nodata",
					plugin: "core",
					id: "core_06",
					reason: "Could not load node",
					data: JSON.stringify({
						id: b.id
					})
				}, this.settings.core.error.call(this, this._data.core.last_error), c.call(this, !1)) : c.call(this, !1) : b.id === a.jstree.root ? this._append_html_data(b, this._data.core.original_container_html.clone(!0), function(a) {
					c.call(this, a)
				}) : c.call(this, !1)
			},
			_node_changed: function(b) {
				b = this.get_node(b), b && -1 === a.inArray(b.id, this._model.changed) && this._model.changed.push(b.id)
			},
			_append_html_data: function(b, c, d) {
				b = this.get_node(b), b.children = [], b.children_d = [];
				var e = c.is("ul") ? c.children() : c,
					f = b.id,
					g = [],
					h = [],
					i = this._model.data,
					j = i[f],
					k = this._data.core.selected.length,
					l, m, n;
				for (e.each(a.proxy(function(b, c) {
						l = this._parse_model_from_html(a(c), f, j.parents.concat()), l && (g.push(l), h.push(l), i[l].children_d.length && (h = h.concat(i[l].children_d)))
					}, this)), j.children = g, j.children_d = h, m = 0, n = j.parents.length; n > m; m++) i[j.parents[m]].children_d = i[j.parents[m]].children_d.concat(h);
				this.trigger("model", {
					nodes: h,
					parent: f
				}), f !== a.jstree.root ? (this._node_changed(f), this.redraw()) : (this.get_container_ul().children(".jstree-initial-node").remove(), this.redraw(!0)), this._data.core.selected.length !== k && this.trigger("changed", {
					action: "model",
					selected: this._data.core.selected
				}), d.call(this, !0)
			},
			_append_json_data: function(b, c, d, e) {
				if (null !== this.element) {
					b = this.get_node(b), b.children = [], b.children_d = [], c.d && (c = c.d, "string" == typeof c && (c = JSON.parse(c))), a.isArray(c) || (c = [c]);
					var f = null,
						g = {
							df: this._model.default_state,
							dat: c,
							par: b.id,
							m: this._model.data,
							t_id: this._id,
							t_cnt: this._cnt,
							sel: this._data.core.selected
						},
						h = this,
						i = function(a, b) {
							a.data && (a = a.data);
							var c = a.dat,
								d = a.par,
								e = [],
								f = [],
								g = [],
								i = a.df,
								j = a.t_id,
								k = a.t_cnt,
								l = a.m,
								m = l[d],
								n = a.sel,
								o, p, q, r, s = function(a, c, d) {
									d = d ? d.concat() : [], c && d.unshift(c);
									var e = a.id.toString(),
										f, h, j, k, m = {
											id: e,
											text: a.text || "",
											icon: a.icon !== b ? a.icon : !0,
											parent: c,
											parents: d,
											children: a.children || [],
											children_d: a.children_d || [],
											data: a.data,
											state: {},
											li_attr: {
												id: !1
											},
											a_attr: {
												href: "#"
											},
											original: !1
										};
									for (f in i) i.hasOwnProperty(f) && (m.state[f] = i[f]);
									if (a && a.data && a.data.jstree && a.data.jstree.icon && (m.icon = a.data.jstree.icon), (m.icon === b || null === m.icon || "" === m.icon) && (m.icon = !0), a && a.data && (m.data = a.data, a.data.jstree))
										for (f in a.data.jstree) a.data.jstree.hasOwnProperty(f) && (m.state[f] = a.data.jstree[f]);
									if (a && "object" == typeof a.state)
										for (f in a.state) a.state.hasOwnProperty(f) && (m.state[f] = a.state[f]);
									if (a && "object" == typeof a.li_attr)
										for (f in a.li_attr) a.li_attr.hasOwnProperty(f) && (m.li_attr[f] = a.li_attr[f]);
									if (m.li_attr.id || (m.li_attr.id = e), a && "object" == typeof a.a_attr)
										for (f in a.a_attr) a.a_attr.hasOwnProperty(f) && (m.a_attr[f] = a.a_attr[f]);
									for (a && a.children && a.children === !0 && (m.state.loaded = !1, m.children = [], m.children_d = []), l[m.id] = m, f = 0, h = m.children.length; h > f; f++) j = s(l[m.children[f]], m.id, d), k = l[j], m.children_d.push(j), k.children_d.length && (m.children_d = m.children_d.concat(k.children_d));
									return delete a.data, delete a.children, l[m.id].original = a, m.state.selected && g.push(m.id), m.id
								},
								t = function(a, c, d) {
									d = d ? d.concat() : [], c && d.unshift(c);
									var e = !1,
										f, h, m, n, o;
									do e = "j" + j + "_" + ++k; while (l[e]);
									o = {
										id: !1,
										text: "string" == typeof a ? a : "",
										icon: "object" == typeof a && a.icon !== b ? a.icon : !0,
										parent: c,
										parents: d,
										children: [],
										children_d: [],
										data: null,
										state: {},
										li_attr: {
											id: !1
										},
										a_attr: {
											href: "#"
										},
										original: !1
									};
									for (f in i) i.hasOwnProperty(f) && (o.state[f] = i[f]);
									if (a && a.id && (o.id = a.id.toString()), a && a.text && (o.text = a.text), a && a.data && a.data.jstree && a.data.jstree.icon && (o.icon = a.data.jstree.icon), (o.icon === b || null === o.icon || "" === o.icon) && (o.icon = !0), a && a.data && (o.data = a.data, a.data.jstree))
										for (f in a.data.jstree) a.data.jstree.hasOwnProperty(f) && (o.state[f] = a.data.jstree[f]);
									if (a && "object" == typeof a.state)
										for (f in a.state) a.state.hasOwnProperty(f) && (o.state[f] = a.state[f]);
									if (a && "object" == typeof a.li_attr)
										for (f in a.li_attr) a.li_attr.hasOwnProperty(f) && (o.li_attr[f] = a.li_attr[f]);
									if (o.li_attr.id && !o.id && (o.id = o.li_attr.id.toString()), o.id || (o.id = e), o.li_attr.id || (o.li_attr.id = o.id), a && "object" == typeof a.a_attr)
										for (f in a.a_attr) a.a_attr.hasOwnProperty(f) && (o.a_attr[f] = a.a_attr[f]);
									if (a && a.children && a.children.length) {
										for (f = 0, h = a.children.length; h > f; f++) m = t(a.children[f], o.id, d), n = l[m], o.children.push(m), n.children_d.length && (o.children_d = o.children_d.concat(n.children_d));
										o.children_d = o.children_d.concat(o.children)
									}
									return a && a.children && a.children === !0 && (o.state.loaded = !1, o.children = [], o.children_d = []), delete a.data, delete a.children, o.original = a, l[o.id] = o, o.state.selected && g.push(o.id), o.id
								};
							if (c.length && c[0].id !== b && c[0].parent !== b) {
								for (p = 0, q = c.length; q > p; p++) c[p].children || (c[p].children = []), c[p].state || (c[p].state = {}), l[c[p].id.toString()] = c[p];
								for (p = 0, q = c.length; q > p; p++) l[c[p].parent.toString()] ? (l[c[p].parent.toString()].children.push(c[p].id.toString()), m.children_d.push(c[p].id.toString())) : "undefined" != typeof h && (h._data.core.last_error = {
									error: "parse",
									plugin: "core",
									id: "core_07",
									reason: "Node with invalid parent",
									data: JSON.stringify({
										id: c[p].id.toString(),
										parent: c[p].parent.toString()
									})
								}, h.settings.core.error.call(h, h._data.core.last_error));
								for (p = 0, q = m.children.length; q > p; p++) o = s(l[m.children[p]], d, m.parents.concat()), f.push(o), l[o].children_d.length && (f = f.concat(l[o].children_d));
								for (p = 0, q = m.parents.length; q > p; p++) l[m.parents[p]].children_d = l[m.parents[p]].children_d.concat(f);
								r = {
									cnt: k,
									mod: l,
									sel: n,
									par: d,
									dpc: f,
									add: g
								}
							} else {
								for (p = 0, q = c.length; q > p; p++) o = t(c[p], d, m.parents.concat()), o && (e.push(o), f.push(o), l[o].children_d.length && (f = f.concat(l[o].children_d)));
								for (m.children = e, m.children_d = f, p = 0, q = m.parents.length; q > p; p++) l[m.parents[p]].children_d = l[m.parents[p]].children_d.concat(f);
								r = {
									cnt: k,
									mod: l,
									sel: n,
									par: d,
									dpc: f,
									add: g
								}
							}
							return "undefined" != typeof window && "undefined" != typeof window.document ? r : void postMessage(r)
						},
						k = function(b, c) {
							if (null !== this.element) {
								this._cnt = b.cnt;
								var e, f = this._model.data;
								for (e in f) f.hasOwnProperty(e) && f[e].state && f[e].state.loading && b.mod[e] && (b.mod[e].state.loading = !0);
								if (this._model.data = b.mod, c) {
									var g, i = b.add,
										k = b.sel,
										l = this._data.core.selected.slice();
									if (f = this._model.data, k.length !== l.length || a.vakata.array_unique(k.concat(l)).length !== k.length) {
										for (e = 0, g = k.length; g > e; e++) - 1 === a.inArray(k[e], i) && -1 === a.inArray(k[e], l) && (f[k[e]].state.selected = !1);
										for (e = 0, g = l.length; g > e; e++) - 1 === a.inArray(l[e], k) && (f[l[e]].state.selected = !0)
									}
								}
								b.add.length && (this._data.core.selected = this._data.core.selected.concat(b.add)), this.trigger("model", {
									nodes: b.dpc,
									parent: b.par
								}), b.par !== a.jstree.root ? (this._node_changed(b.par), this.redraw()) : this.redraw(!0), b.add.length && this.trigger("changed", {
									action: "model",
									selected: this._data.core.selected
								}), !c && j ? j(function() {
									d.call(h, !0)
								}) : d.call(h, !0)
							}
						};
					if (this.settings.core.worker && window.Blob && window.URL && window.Worker) try {
						null === this._wrk && (this._wrk = window.URL.createObjectURL(new window.Blob(["self.onmessage = " + i.toString()], {
							type: "text/javascript"
						}))), !this._data.core.working || e ? (this._data.core.working = !0, f = new window.Worker(this._wrk), f.onmessage = a.proxy(function(a) {
							k.call(this, a.data, !0);
							try {
								f.terminate(), f = null
							} catch (b) {}
							this._data.core.worker_queue.length ? this._append_json_data.apply(this, this._data.core.worker_queue.shift()) : this._data.core.working = !1
						}, this), g.par ? f.postMessage(g) : this._data.core.worker_queue.length ? this._append_json_data.apply(this, this._data.core.worker_queue.shift()) : this._data.core.working = !1) : this._data.core.worker_queue.push([b, c, d, !0])
					} catch (l) {
						k.call(this, i(g), !1), this._data.core.worker_queue.length ? this._append_json_data.apply(this, this._data.core.worker_queue.shift()) : this._data.core.working = !1
					} else k.call(this, i(g), !1)
				}
			},
			_parse_model_from_html: function(c, d, e) {
				e = e ? [].concat(e) : [], d && e.unshift(d);
				var f, g, h = this._model.data,
					i = {
						id: !1,
						text: !1,
						icon: !0,
						parent: d,
						parents: e,
						children: [],
						children_d: [],
						data: null,
						state: {},
						li_attr: {
							id: !1
						},
						a_attr: {
							href: "#"
						},
						original: !1
					},
					j, k, l;
				for (j in this._model.default_state) this._model.default_state.hasOwnProperty(j) && (i.state[j] = this._model.default_state[j]);
				if (k = a.vakata.attributes(c, !0), a.each(k, function(b, c) {
						return c = a.vakata.trim(c), c.length ? (i.li_attr[b] = c, void("id" === b && (i.id = c.toString()))) : !0
					}), k = c.children("a").first(), k.length && (k = a.vakata.attributes(k, !0), a.each(k, function(b, c) {
						c = a.vakata.trim(c), c.length && (i.a_attr[b] = c)
					})), k = c.children("a").first().length ? c.children("a").first().clone() : c.clone(), k.children("ins, i, ul").remove(), k = k.html(), k = a("<div></div>").html(k), i.text = this.settings.core.force_text ? k.text() : k.html(), k = c.data(), i.data = k ? a.extend(!0, {}, k) : null, i.state.opened = c.hasClass("jstree-open"), i.state.selected = c.children("a").hasClass("jstree-clicked"), i.state.disabled = c.children("a").hasClass("jstree-disabled"), i.data && i.data.jstree)
					for (j in i.data.jstree) i.data.jstree.hasOwnProperty(j) && (i.state[j] = i.data.jstree[j]);
				k = c.children("a").children(".jstree-themeicon"), k.length && (i.icon = k.hasClass("jstree-themeicon-hidden") ? !1 : k.attr("rel")), i.state.icon !== b && (i.icon = i.state.icon), (i.icon === b || null === i.icon || "" === i.icon) && (i.icon = !0), k = c.children("ul").children("li");
				do l = "j" + this._id + "_" + ++this._cnt; while (h[l]);
				return i.id = i.li_attr.id ? i.li_attr.id.toString() : l, k.length ? (k.each(a.proxy(function(b, c) {
					f = this._parse_model_from_html(a(c), i.id, e), g = this._model.data[f], i.children.push(f), g.children_d.length && (i.children_d = i.children_d.concat(g.children_d))
				}, this)), i.children_d = i.children_d.concat(i.children)) : c.hasClass("jstree-closed") && (i.state.loaded = !1), i.li_attr["class"] && (i.li_attr["class"] = i.li_attr["class"].replace("jstree-closed", "").replace("jstree-open", "")), i.a_attr["class"] && (i.a_attr["class"] = i.a_attr["class"].replace("jstree-clicked", "").replace("jstree-disabled", "")), h[i.id] = i, i.state.selected && this._data.core.selected.push(i.id), i.id
			},
			_parse_model_from_flat_json: function(a, c, d) {
				d = d ? d.concat() : [], c && d.unshift(c);
				var e = a.id.toString(),
					f = this._model.data,
					g = this._model.default_state,
					h, i, j, k, l = {
						id: e,
						text: a.text || "",
						icon: a.icon !== b ? a.icon : !0,
						parent: c,
						parents: d,
						children: a.children || [],
						children_d: a.children_d || [],
						data: a.data,
						state: {},
						li_attr: {
							id: !1
						},
						a_attr: {
							href: "#"
						},
						original: !1
					};
				for (h in g) g.hasOwnProperty(h) && (l.state[h] = g[h]);
				if (a && a.data && a.data.jstree && a.data.jstree.icon && (l.icon = a.data.jstree.icon), (l.icon === b || null === l.icon || "" === l.icon) && (l.icon = !0), a && a.data && (l.data = a.data, a.data.jstree))
					for (h in a.data.jstree) a.data.jstree.hasOwnProperty(h) && (l.state[h] = a.data.jstree[h]);
				if (a && "object" == typeof a.state)
					for (h in a.state) a.state.hasOwnProperty(h) && (l.state[h] = a.state[h]);
				if (a && "object" == typeof a.li_attr)
					for (h in a.li_attr) a.li_attr.hasOwnProperty(h) && (l.li_attr[h] = a.li_attr[h]);
				if (l.li_attr.id || (l.li_attr.id = e), a && "object" == typeof a.a_attr)
					for (h in a.a_attr) a.a_attr.hasOwnProperty(h) && (l.a_attr[h] = a.a_attr[h]);
				for (a && a.children && a.children === !0 && (l.state.loaded = !1, l.children = [], l.children_d = []), f[l.id] = l, h = 0, i = l.children.length; i > h; h++) j = this._parse_model_from_flat_json(f[l.children[h]], l.id, d), k = f[j], l.children_d.push(j), k.children_d.length && (l.children_d = l.children_d.concat(k.children_d));
				return delete a.data, delete a.children, f[l.id].original = a, l.state.selected && this._data.core.selected.push(l.id), l.id
			},
			_parse_model_from_json: function(a, c, d) {
				d = d ? d.concat() : [], c && d.unshift(c);
				var e = !1,
					f, g, h, i, j = this._model.data,
					k = this._model.default_state,
					l;
				do e = "j" + this._id + "_" + ++this._cnt; while (j[e]);
				l = {
					id: !1,
					text: "string" == typeof a ? a : "",
					icon: "object" == typeof a && a.icon !== b ? a.icon : !0,
					parent: c,
					parents: d,
					children: [],
					children_d: [],
					data: null,
					state: {},
					li_attr: {
						id: !1
					},
					a_attr: {
						href: "#"
					},
					original: !1
				};
				for (f in k) k.hasOwnProperty(f) && (l.state[f] = k[f]);
				if (a && a.id && (l.id = a.id.toString()), a && a.text && (l.text = a.text), a && a.data && a.data.jstree && a.data.jstree.icon && (l.icon = a.data.jstree.icon), (l.icon === b || null === l.icon || "" === l.icon) && (l.icon = !0), a && a.data && (l.data = a.data, a.data.jstree))
					for (f in a.data.jstree) a.data.jstree.hasOwnProperty(f) && (l.state[f] = a.data.jstree[f]);
				if (a && "object" == typeof a.state)
					for (f in a.state) a.state.hasOwnProperty(f) && (l.state[f] = a.state[f]);
				if (a && "object" == typeof a.li_attr)
					for (f in a.li_attr) a.li_attr.hasOwnProperty(f) && (l.li_attr[f] = a.li_attr[f]);
				if (l.li_attr.id && !l.id && (l.id = l.li_attr.id.toString()), l.id || (l.id = e), l.li_attr.id || (l.li_attr.id = l.id), a && "object" == typeof a.a_attr)
					for (f in a.a_attr) a.a_attr.hasOwnProperty(f) && (l.a_attr[f] = a.a_attr[f]);
				if (a && a.children && a.children.length) {
					for (f = 0, g = a.children.length; g > f; f++) h = this._parse_model_from_json(a.children[f], l.id, d), i = j[h], l.children.push(h), i.children_d.length && (l.children_d = l.children_d.concat(i.children_d));
					l.children_d = l.children.concat(l.children_d)
				}
				return a && a.children && a.children === !0 && (l.state.loaded = !1, l.children = [], l.children_d = []), delete a.data, delete a.children, l.original = a, j[l.id] = l, l.state.selected && this._data.core.selected.push(l.id), l.id
			},
			_redraw: function() {
				var b = this._model.force_full_redraw ? this._model.data[a.jstree.root].children.concat([]) : this._model.changed.concat([]),
					c = i.createElement("UL"),
					d, e, f, g = this._data.core.focused;
				for (e = 0, f = b.length; f > e; e++) d = this.redraw_node(b[e], !0, this._model.force_full_redraw), d && this._model.force_full_redraw && c.appendChild(d);
				this._model.force_full_redraw && (c.className = this.get_container_ul()[0].className, c.setAttribute("role", "group"), this.element.empty().append(c)), null !== g && this.settings.core.restore_focus && (d = this.get_node(g, !0), d && d.length && d.children(".jstree-anchor")[0] !== i.activeElement ? d.children(".jstree-anchor").focus() : this._data.core.focused = null), this._model.force_full_redraw = !1, this._model.changed = [], this.trigger("redraw", {
					nodes: b
				})
			},
			redraw: function(a) {
				a && (this._model.force_full_redraw = !0), this._redraw()
			},
			draw_children: function(b) {
				var c = this.get_node(b),
					d = !1,
					e = !1,
					f = !1,
					g = i;
				if (!c) return !1;
				if (c.id === a.jstree.root) return this.redraw(!0);
				if (b = this.get_node(b, !0), !b || !b.length) return !1;
				if (b.children(".jstree-children").remove(), b = b[0], c.children.length && c.state.loaded) {
					for (f = g.createElement("UL"), f.setAttribute("role", "group"), f.className = "jstree-children", d = 0, e = c.children.length; e > d; d++) f.appendChild(this.redraw_node(c.children[d], !0, !0));
					b.appendChild(f)
				}
			},
			redraw_node: function(b, c, d, e) {
				var f = this.get_node(b),
					g = !1,
					h = !1,
					j = !1,
					k = !1,
					l = !1,
					m = !1,
					n = "",
					o = i,
					p = this._model.data,
					q = !1,
					r = !1,
					s = null,
					t = 0,
					u = 0,
					v = !1,
					w = !1;
				if (!f) return !1;
				if (f.id === a.jstree.root) return this.redraw(!0);
				if (c = c || 0 === f.children.length, b = i.querySelector ? this.element[0].querySelector("#" + (-1 !== "0123456789".indexOf(f.id[0]) ? "\\3" + f.id[0] + " " + f.id.substr(1).replace(a.jstree.idregex, "\\$&") : f.id.replace(a.jstree.idregex, "\\$&"))) : i.getElementById(f.id)) b = a(b), d || (g = b.parent().parent()[0], g === this.element[0] && (g = null), h = b.index()), c || !f.children.length || b.children(".jstree-children").length || (c = !0), c || (j = b.children(".jstree-children")[0]), q = b.children(".jstree-anchor")[0] === i.activeElement, b.remove();
				else if (c = !0, !d) {
					if (g = f.parent !== a.jstree.root ? a("#" + f.parent.replace(a.jstree.idregex, "\\$&"), this.element)[0] : null, !(null === g || g && p[f.parent].state.opened)) return !1;
					h = a.inArray(f.id, null === g ? p[a.jstree.root].children : p[f.parent].children)
				}
				b = this._data.core.node.cloneNode(!0), n = "jstree-node ";
				for (k in f.li_attr)
					if (f.li_attr.hasOwnProperty(k)) {
						if ("id" === k) continue;
						"class" !== k ? b.setAttribute(k, f.li_attr[k]) : n += f.li_attr[k]
					}
				for (f.a_attr.id || (f.a_attr.id = f.id + "_anchor"), b.childNodes[1].setAttribute("aria-selected", !!f.state.selected), b.childNodes[1].setAttribute("aria-level", f.parents.length), this.settings.core.compute_elements_positions && (b.childNodes[1].setAttribute("aria-setsize", p[f.parent].children.length), b.childNodes[1].setAttribute("aria-posinset", p[f.parent].children.indexOf(f.id) + 1)), f.state.disabled && b.childNodes[1].setAttribute("aria-disabled", !0), k = 0, l = f.children.length; l > k; k++)
					if (!p[f.children[k]].state.hidden) {
						v = !0;
						break
					}
				if (null !== f.parent && p[f.parent] && !f.state.hidden && (k = a.inArray(f.id, p[f.parent].children), w = f.id, -1 !== k))
					for (k++, l = p[f.parent].children.length; l > k; k++)
						if (p[p[f.parent].children[k]].state.hidden || (w = p[f.parent].children[k]), w !== f.id) break;
				f.state.hidden && (n += " jstree-hidden"), f.state.loading && (n += " jstree-loading"), f.state.loaded && !v ? n += " jstree-leaf" : (n += f.state.opened && f.state.loaded ? " jstree-open" : " jstree-closed", b.childNodes[1].setAttribute("aria-expanded", f.state.opened && f.state.loaded)), w === f.id && (n += " jstree-last"), b.id = f.id, b.className = n, n = (f.state.selected ? " jstree-clicked" : "") + (f.state.disabled ? " jstree-disabled" : "");
				for (l in f.a_attr)
					if (f.a_attr.hasOwnProperty(l)) {
						if ("href" === l && "#" === f.a_attr[l]) continue;
						"class" !== l ? b.childNodes[1].setAttribute(l, f.a_attr[l]) : n += " " + f.a_attr[l]
					}
				if (n.length && (b.childNodes[1].className = "jstree-anchor " + n), (f.icon && f.icon !== !0 || f.icon === !1) && (f.icon === !1 ? b.childNodes[1].childNodes[0].className += " jstree-themeicon-hidden" : -1 === f.icon.indexOf("/") && -1 === f.icon.indexOf(".") ? b.childNodes[1].childNodes[0].className += " " + f.icon + " jstree-themeicon-custom" : (b.childNodes[1].childNodes[0].style.backgroundImage = 'url("' + f.icon + '")', b.childNodes[1].childNodes[0].style.backgroundPosition = "center center", b.childNodes[1].childNodes[0].style.backgroundSize = "auto", b.childNodes[1].childNodes[0].className += " jstree-themeicon-custom")), this.settings.core.force_text ? b.childNodes[1].appendChild(o.createTextNode(f.text)) : b.childNodes[1].innerHTML += f.text, c && f.children.length && (f.state.opened || e) && f.state.loaded) {
					for (m = o.createElement("UL"), m.setAttribute("role", "group"), m.className = "jstree-children", k = 0, l = f.children.length; l > k; k++) m.appendChild(this.redraw_node(f.children[k], c, !0));
					b.appendChild(m)
				}
				if (j && b.appendChild(j), !d) {
					for (g || (g = this.element[0]), k = 0, l = g.childNodes.length; l > k; k++)
						if (g.childNodes[k] && g.childNodes[k].className && -1 !== g.childNodes[k].className.indexOf("jstree-children")) {
							s = g.childNodes[k];
							break
						}
					s || (s = o.createElement("UL"), s.setAttribute("role", "group"), s.className = "jstree-children", g.appendChild(s)), g = s, h < g.childNodes.length ? g.insertBefore(b, g.childNodes[h]) : g.appendChild(b), q && (t = this.element[0].scrollTop, u = this.element[0].scrollLeft, b.childNodes[1].focus(), this.element[0].scrollTop = t, this.element[0].scrollLeft = u)
				}
				return f.state.opened && !f.state.loaded && (f.state.opened = !1, setTimeout(a.proxy(function() {
					this.open_node(f.id, !1, 0)
				}, this), 0)), b
			},
			open_node: function(c, d, e) {
				var f, g, h, i;
				if (a.isArray(c)) {
					for (c = c.slice(), f = 0, g = c.length; g > f; f++) this.open_node(c[f], d, e);
					return !0
				}
				return c = this.get_node(c), c && c.id !== a.jstree.root ? (e = e === b ? this.settings.core.animation : e, this.is_closed(c) ? this.is_loaded(c) ? (h = this.get_node(c, !0), i = this, h.length && (e && h.children(".jstree-children").length && h.children(".jstree-children").stop(!0, !0), c.children.length && !this._firstChild(h.children(".jstree-children")[0]) && this.draw_children(c), e ? (this.trigger("before_open", {
					node: c
				}), h.children(".jstree-children").css("display", "none").end().removeClass("jstree-closed").addClass("jstree-open").children(".jstree-anchor").attr("aria-expanded", !0).end().children(".jstree-children").stop(!0, !0).slideDown(e, function() {
					this.style.display = "", i.element && i.trigger("after_open", {
						node: c
					})
				})) : (this.trigger("before_open", {
					node: c
				}), h[0].className = h[0].className.replace("jstree-closed", "jstree-open"), h[0].childNodes[1].setAttribute("aria-expanded", !0))), c.state.opened = !0, d && d.call(this, c, !0), h.length || this.trigger("before_open", {
					node: c
				}), this.trigger("open_node", {
					node: c
				}), e && h.length || this.trigger("after_open", {
					node: c
				}), !0) : this.is_loading(c) ? setTimeout(a.proxy(function() {
					this.open_node(c, d, e)
				}, this), 500) : void this.load_node(c, function(a, b) {
					return b ? this.open_node(a, d, e) : d ? d.call(this, a, !1) : !1
				}) : (d && d.call(this, c, !1), !1)) : !1
			},
			_open_to: function(b) {
				if (b = this.get_node(b), !b || b.id === a.jstree.root) return !1;
				var c, d, e = b.parents;
				for (c = 0, d = e.length; d > c; c += 1) c !== a.jstree.root && this.open_node(e[c], !1, 0);
				return a("#" + b.id.replace(a.jstree.idregex, "\\$&"), this.element)
			},
			close_node: function(c, d) {
				var e, f, g, h;
				if (a.isArray(c)) {
					for (c = c.slice(), e = 0, f = c.length; f > e; e++) this.close_node(c[e], d);
					return !0
				}
				return c = this.get_node(c), c && c.id !== a.jstree.root ? this.is_closed(c) ? !1 : (d = d === b ? this.settings.core.animation : d, g = this, h = this.get_node(c, !0), c.state.opened = !1, this.trigger("close_node", {
					node: c
				}), void(h.length ? d ? h.children(".jstree-children").attr("style", "display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").children(".jstree-anchor").attr("aria-expanded", !1).end().children(".jstree-children").stop(!0, !0).slideUp(d, function() {
					this.style.display = "", h.children(".jstree-children").remove(), g.element && g.trigger("after_close", {
						node: c
					})
				}) : (h[0].className = h[0].className.replace("jstree-open", "jstree-closed"), h.children(".jstree-anchor").attr("aria-expanded", !1), h.children(".jstree-children").remove(), this.trigger("after_close", {
					node: c
				})) : this.trigger("after_close", {
					node: c
				}))) : !1
			},
			toggle_node: function(b) {
				var c, d;
				if (a.isArray(b)) {
					for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.toggle_node(b[c]);
					return !0
				}
				return this.is_closed(b) ? this.open_node(b) : this.is_open(b) ? this.close_node(b) : void 0
			},
			open_all: function(b, c, d) {
				if (b || (b = a.jstree.root), b = this.get_node(b), !b) return !1;
				var e = b.id === a.jstree.root ? this.get_container_ul() : this.get_node(b, !0),
					f, g, h;
				if (!e.length) {
					for (f = 0, g = b.children_d.length; g > f; f++) this.is_closed(this._model.data[b.children_d[f]]) && (this._model.data[b.children_d[f]].state.opened = !0);
					return this.trigger("open_all", {
						node: b
					})
				}
				d = d || e, h = this, e = this.is_closed(b) ? e.find(".jstree-closed").addBack() : e.find(".jstree-closed"), e.each(function() {
					h.open_node(this, function(a, b) {
						b && this.is_parent(a) && this.open_all(a, c, d)
					}, c || 0)
				}), 0 === d.find(".jstree-closed").length && this.trigger("open_all", {
					node: this.get_node(d)
				})
			},
			close_all: function(b, c) {
				if (b || (b = a.jstree.root), b = this.get_node(b), !b) return !1;
				var d = b.id === a.jstree.root ? this.get_container_ul() : this.get_node(b, !0),
					e = this,
					f, g;
				for (d.length && (d = this.is_open(b) ? d.find(".jstree-open").addBack() : d.find(".jstree-open"), a(d.get().reverse()).each(function() {
						e.close_node(this, c || 0)
					})), f = 0, g = b.children_d.length; g > f; f++) this._model.data[b.children_d[f]].state.opened = !1;
				this.trigger("close_all", {
					node: b
				})
			},
			is_disabled: function(a) {
				return a = this.get_node(a), a && a.state && a.state.disabled
			},
			enable_node: function(b) {
				var c, d;
				if (a.isArray(b)) {
					for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.enable_node(b[c]);
					return !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? (b.state.disabled = !1, this.get_node(b, !0).children(".jstree-anchor").removeClass("jstree-disabled").attr("aria-disabled", !1), void this.trigger("enable_node", {
					node: b
				})) : !1
			},
			disable_node: function(b) {
				var c, d;
				if (a.isArray(b)) {
					for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.disable_node(b[c]);
					return !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? (b.state.disabled = !0, this.get_node(b, !0).children(".jstree-anchor").addClass("jstree-disabled").attr("aria-disabled", !0), void this.trigger("disable_node", {
					node: b
				})) : !1
			},
			is_hidden: function(a) {
				return a = this.get_node(a), a.state.hidden === !0
			},
			hide_node: function(b, c) {
				var d, e;
				if (a.isArray(b)) {
					for (b = b.slice(), d = 0, e = b.length; e > d; d++) this.hide_node(b[d], !0);
					return c || this.redraw(), !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? void(b.state.hidden || (b.state.hidden = !0, this._node_changed(b.parent), c || this.redraw(), this.trigger("hide_node", {
					node: b
				}))) : !1
			},
			show_node: function(b, c) {
				var d, e;
				if (a.isArray(b)) {
					for (b = b.slice(), d = 0, e = b.length; e > d; d++) this.show_node(b[d], !0);
					return c || this.redraw(), !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? void(b.state.hidden && (b.state.hidden = !1, this._node_changed(b.parent), c || this.redraw(), this.trigger("show_node", {
					node: b
				}))) : !1
			},
			hide_all: function(b) {
				var c, d = this._model.data,
					e = [];
				for (c in d) d.hasOwnProperty(c) && c !== a.jstree.root && !d[c].state.hidden && (d[c].state.hidden = !0, e.push(c));
				return this._model.force_full_redraw = !0, b || this.redraw(), this.trigger("hide_all", {
					nodes: e
				}), e
			},
			show_all: function(b) {
				var c, d = this._model.data,
					e = [];
				for (c in d) d.hasOwnProperty(c) && c !== a.jstree.root && d[c].state.hidden && (d[c].state.hidden = !1, e.push(c));
				return this._model.force_full_redraw = !0, b || this.redraw(), this.trigger("show_all", {
					nodes: e
				}), e
			},
			activate_node: function(a, c) {
				if (this.is_disabled(a)) return !1;
				if (c && "object" == typeof c || (c = {}), this._data.core.last_clicked = this._data.core.last_clicked && this._data.core.last_clicked.id !== b ? this.get_node(this._data.core.last_clicked.id) : null, this._data.core.last_clicked && !this._data.core.last_clicked.state.selected && (this._data.core.last_clicked = null), !this._data.core.last_clicked && this._data.core.selected.length && (this._data.core.last_clicked = this.get_node(this._data.core.selected[this._data.core.selected.length - 1])), this.settings.core.multiple && (c.metaKey || c.ctrlKey || c.shiftKey) && (!c.shiftKey || this._data.core.last_clicked && this.get_parent(a) && this.get_parent(a) === this._data.core.last_clicked.parent))
					if (c.shiftKey) {
						var d = this.get_node(a).id,
							e = this._data.core.last_clicked.id,
							f = this.get_node(this._data.core.last_clicked.parent).children,
							g = !1,
							h, i;
						for (h = 0, i = f.length; i > h; h += 1) f[h] === d && (g = !g), f[h] === e && (g = !g), this.is_disabled(f[h]) || !g && f[h] !== d && f[h] !== e ? this.deselect_node(f[h], !0, c) : this.is_hidden(f[h]) || this.select_node(f[h], !0, !1, c);
						this.trigger("changed", {
							action: "select_node",
							node: this.get_node(a),
							selected: this._data.core.selected,
							event: c
						})
					} else this.is_selected(a) ? this.deselect_node(a, !1, c) : this.select_node(a, !1, !1, c);
				else !this.settings.core.multiple && (c.metaKey || c.ctrlKey || c.shiftKey) && this.is_selected(a) ? this.deselect_node(a, !1, c) : (this.deselect_all(!0), this.select_node(a, !1, !1, c), this._data.core.last_clicked = this.get_node(a));
				this.trigger("activate_node", {
					node: this.get_node(a),
					event: c
				})
			},
			hover_node: function(a) {
				if (a = this.get_node(a, !0), !a || !a.length || a.children(".jstree-hovered").length) return !1;
				var b = this.element.find(".jstree-hovered"),
					c = this.element;
				b && b.length && this.dehover_node(b), a.children(".jstree-anchor").addClass("jstree-hovered"), this.trigger("hover_node", {
					node: this.get_node(a)
				}), setTimeout(function() {
					c.attr("aria-activedescendant", a[0].id)
				}, 0)
			},
			dehover_node: function(a) {
				return a = this.get_node(a, !0), a && a.length && a.children(".jstree-hovered").length ? (a.children(".jstree-anchor").removeClass("jstree-hovered"), void this.trigger("dehover_node", {
					node: this.get_node(a)
				})) : !1
			},
			select_node: function(b, c, d, e) {
				var f, g, h, i;
				if (a.isArray(b)) {
					for (b = b.slice(), g = 0, h = b.length; h > g; g++) this.select_node(b[g], c, d, e);
					return !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? (f = this.get_node(b, !0), void(b.state.selected || (b.state.selected = !0, this._data.core.selected.push(b.id), d || (f = this._open_to(b)), f && f.length && f.children(".jstree-anchor").addClass("jstree-clicked").attr("aria-selected", !0), this.trigger("select_node", {
					node: b,
					selected: this._data.core.selected,
					event: e
				}), c || this.trigger("changed", {
					action: "select_node",
					node: b,
					selected: this._data.core.selected,
					event: e
				})))) : !1
			},
			deselect_node: function(b, c, d) {
				var e, f, g;
				if (a.isArray(b)) {
					for (b = b.slice(), e = 0, f = b.length; f > e; e++) this.deselect_node(b[e], c, d);
					return !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? (g = this.get_node(b, !0), void(b.state.selected && (b.state.selected = !1, this._data.core.selected = a.vakata.array_remove_item(this._data.core.selected, b.id), g.length && g.children(".jstree-anchor").removeClass("jstree-clicked").attr("aria-selected", !1), this.trigger("deselect_node", {
					node: b,
					selected: this._data.core.selected,
					event: d
				}), c || this.trigger("changed", {
					action: "deselect_node",
					node: b,
					selected: this._data.core.selected,
					event: d
				})))) : !1
			},
			select_all: function(b) {
				var c = this._data.core.selected.concat([]),
					d, e;
				for (this._data.core.selected = this._model.data[a.jstree.root].children_d.concat(), d = 0, e = this._data.core.selected.length; e > d; d++) this._model.data[this._data.core.selected[d]] && (this._model.data[this._data.core.selected[d]].state.selected = !0);
				this.redraw(!0), this.trigger("select_all", {
					selected: this._data.core.selected
				}), b || this.trigger("changed", {
					action: "select_all",
					selected: this._data.core.selected,
					old_selection: c
				})
			},
			deselect_all: function(a) {
				var b = this._data.core.selected.concat([]),
					c, d;
				for (c = 0, d = this._data.core.selected.length; d > c; c++) this._model.data[this._data.core.selected[c]] && (this._model.data[this._data.core.selected[c]].state.selected = !1);
				this._data.core.selected = [], this.element.find(".jstree-clicked").removeClass("jstree-clicked").attr("aria-selected", !1), this.trigger("deselect_all", {
					selected: this._data.core.selected,
					node: b
				}), a || this.trigger("changed", {
					action: "deselect_all",
					selected: this._data.core.selected,
					old_selection: b
				})
			},
			is_selected: function(b) {
				return b = this.get_node(b), b && b.id !== a.jstree.root ? b.state.selected : !1
			},
			get_selected: function(b) {
				return b ? a.map(this._data.core.selected, a.proxy(function(a) {
					return this.get_node(a)
				}, this)) : this._data.core.selected.slice()
			},
			get_top_selected: function(b) {
				var c = this.get_selected(!0),
					d = {},
					e, f, g, h;
				for (e = 0, f = c.length; f > e; e++) d[c[e].id] = c[e];
				for (e = 0, f = c.length; f > e; e++)
					for (g = 0, h = c[e].children_d.length; h > g; g++) d[c[e].children_d[g]] && delete d[c[e].children_d[g]];
				c = [];
				for (e in d) d.hasOwnProperty(e) && c.push(e);
				return b ? a.map(c, a.proxy(function(a) {
					return this.get_node(a)
				}, this)) : c
			},
			get_bottom_selected: function(b) {
				var c = this.get_selected(!0),
					d = [],
					e, f;
				for (e = 0, f = c.length; f > e; e++) c[e].children.length || d.push(c[e].id);
				return b ? a.map(d, a.proxy(function(a) {
					return this.get_node(a)
				}, this)) : d
			},
			get_state: function() {
				var b = {
						core: {
							open: [],
							loaded: [],
							scroll: {
								left: this.element.scrollLeft(),
								top: this.element.scrollTop()
							},
							selected: []
						}
					},
					c;
				for (c in this._model.data) this._model.data.hasOwnProperty(c) && c !== a.jstree.root && (this._model.data[c].state.loaded && this.settings.core.loaded_state && b.core.loaded.push(c), this._model.data[c].state.opened && b.core.open.push(c), this._model.data[c].state.selected && b.core.selected.push(c));
				return b
			},
			set_state: function(c, d) {
				if (c) {
					if (c.core && c.core.selected && c.core.initial_selection === b && (c.core.initial_selection = this._data.core.selected.concat([]).sort().join(",")), c.core) {
						var e, f, g, h, i;
						if (c.core.loaded) return this.settings.core.loaded_state && a.isArray(c.core.loaded) && c.core.loaded.length ? this._load_nodes(c.core.loaded, function(a) {
							delete c.core.loaded, this.set_state(c, d)
						}) : (delete c.core.loaded, this.set_state(c, d)), !1;
						if (c.core.open) return a.isArray(c.core.open) && c.core.open.length ? this._load_nodes(c.core.open, function(a) {
							this.open_node(a, !1, 0), delete c.core.open, this.set_state(c, d)
						}) : (delete c.core.open, this.set_state(c, d)), !1;
						if (c.core.scroll) return c.core.scroll && c.core.scroll.left !== b && this.element.scrollLeft(c.core.scroll.left), c.core.scroll && c.core.scroll.top !== b && this.element.scrollTop(c.core.scroll.top), delete c.core.scroll, this.set_state(c, d), !1;
						if (c.core.selected) return h = this, (c.core.initial_selection === b || c.core.initial_selection === this._data.core.selected.concat([]).sort().join(",")) && (this.deselect_all(), a.each(c.core.selected, function(a, b) {
							h.select_node(b, !1, !0)
						})), delete c.core.initial_selection, delete c.core.selected, this.set_state(c, d), !1;
						for (i in c) c.hasOwnProperty(i) && "core" !== i && -1 === a.inArray(i, this.settings.plugins) && delete c[i];
						if (a.isEmptyObject(c.core)) return delete c.core, this.set_state(c, d), !1
					}
					return a.isEmptyObject(c) ? (c = null, d && d.call(this), this.trigger("set_state"), !1) : !0
				}
				return !1
			},
			refresh: function(b, c) {
				this._data.core.state = c === !0 ? {} : this.get_state(), c && a.isFunction(c) && (this._data.core.state = c.call(this, this._data.core.state)), this._cnt = 0, this._model.data = {}, this._model.data[a.jstree.root] = {
					id: a.jstree.root,
					parent: null,
					parents: [],
					children: [],
					children_d: [],
					state: {
						loaded: !1
					}
				}, this._data.core.selected = [], this._data.core.last_clicked = null, this._data.core.focused = null;
				var d = this.get_container_ul()[0].className;
				b || (this.element.html("<ul class='" + d + "' role='group'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='none' id='j" + this._id + "_loading'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' role='treeitem' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this.element.attr("aria-activedescendant", "j" + this._id + "_loading")), this.load_node(a.jstree.root, function(b, c) {
					c && (this.get_container_ul()[0].className = d, this._firstChild(this.get_container_ul()[0]) && this.element.attr("aria-activedescendant", this._firstChild(this.get_container_ul()[0]).id), this.set_state(a.extend(!0, {}, this._data.core.state), function() {
						this.trigger("refresh")
					})), this._data.core.state = null
				})
			},
			refresh_node: function(b) {
				if (b = this.get_node(b), !b || b.id === a.jstree.root) return !1;
				var c = [],
					d = [],
					e = this._data.core.selected.concat([]);
				d.push(b.id), b.state.opened === !0 && c.push(b.id), this.get_node(b, !0).find(".jstree-open").each(function() {
					d.push(this.id), c.push(this.id)
				}), this._load_nodes(d, a.proxy(function(a) {
					this.open_node(c, !1, 0), this.select_node(e), this.trigger("refresh_node", {
						node: b,
						nodes: a
					})
				}, this), !1, !0)
			},
			set_id: function(b, c) {
				if (b = this.get_node(b), !b || b.id === a.jstree.root) return !1;
				var d, e, f = this._model.data,
					g = b.id;
				for (c = c.toString(), f[b.parent].children[a.inArray(b.id, f[b.parent].children)] = c, d = 0, e = b.parents.length; e > d; d++) f[b.parents[d]].children_d[a.inArray(b.id, f[b.parents[d]].children_d)] = c;
				for (d = 0, e = b.children.length; e > d; d++) f[b.children[d]].parent = c;
				for (d = 0, e = b.children_d.length; e > d; d++) f[b.children_d[d]].parents[a.inArray(b.id, f[b.children_d[d]].parents)] = c;
				return d = a.inArray(b.id, this._data.core.selected), -1 !== d && (this._data.core.selected[d] = c), d = this.get_node(b.id, !0), d && (d.attr("id", c), this.element.attr("aria-activedescendant") === b.id && this.element.attr("aria-activedescendant", c)), delete f[b.id], b.id = c, b.li_attr.id = c, f[c] = b, this.trigger("set_id", {
					node: b,
					"new": b.id,
					old: g
				}), !0
			},
			get_text: function(b) {
				return b = this.get_node(b), b && b.id !== a.jstree.root ? b.text : !1
			},
			set_text: function(b, c) {
				var d, e;
				if (a.isArray(b)) {
					for (b = b.slice(), d = 0, e = b.length; e > d; d++) this.set_text(b[d], c);
					return !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? (b.text = c, this.get_node(b, !0).length && this.redraw_node(b.id), this.trigger("set_text", {
					obj: b,
					text: c
				}), !0) : !1
			},
			get_json: function(b, c, d) {
				if (b = this.get_node(b || a.jstree.root), !b) return !1;
				c && c.flat && !d && (d = []);
				var e = {
						id: b.id,
						text: b.text,
						icon: this.get_icon(b),
						li_attr: a.extend(!0, {}, b.li_attr),
						a_attr: a.extend(!0, {}, b.a_attr),
						state: {},
						data: c && c.no_data ? !1 : a.extend(!0, a.isArray(b.data) ? [] : {}, b.data)
					},
					f, g;
				if (c && c.flat ? e.parent = b.parent : e.children = [], c && c.no_state) delete e.state;
				else
					for (f in b.state) b.state.hasOwnProperty(f) && (e.state[f] = b.state[f]);
				if (c && c.no_li_attr && delete e.li_attr, c && c.no_a_attr && delete e.a_attr, c && c.no_id && (delete e.id, e.li_attr && e.li_attr.id && delete e.li_attr.id, e.a_attr && e.a_attr.id && delete e.a_attr.id), c && c.flat && b.id !== a.jstree.root && d.push(e), !c || !c.no_children)
					for (f = 0, g = b.children.length; g > f; f++) c && c.flat ? this.get_json(b.children[f], c, d) : e.children.push(this.get_json(b.children[f], c));
				return c && c.flat ? d : b.id === a.jstree.root ? e.children : e
			},
			create_node: function(c, d, e, f, g) {
				if (null === c && (c = a.jstree.root), c = this.get_node(c), !c) return !1;
				if (e = e === b ? "last" : e, !e.toString().match(/^(before|after)$/) && !g && !this.is_loaded(c)) return this.load_node(c, function() {
					this.create_node(c, d, e, f, !0)
				});
				d || (d = {
					text: this.get_string("New node")
				}), d = "string" == typeof d ? {
					text: d
				} : a.extend(!0, {}, d), d.text === b && (d.text = this.get_string("New node"));
				var h, i, j, k;
				switch (c.id === a.jstree.root && ("before" === e && (e = "first"), "after" === e && (e = "last")), e) {
					case "before":
						h = this.get_node(c.parent), e = a.inArray(c.id, h.children), c = h;
						break;
					case "after":
						h = this.get_node(c.parent), e = a.inArray(c.id, h.children) + 1, c = h;
						break;
					case "inside":
					case "first":
						e = 0;
						break;
					case "last":
						e = c.children.length;
						break;
					default:
						e || (e = 0)
				}
				if (e > c.children.length && (e = c.children.length), d.id || (d.id = !0), !this.check("create_node", d, c, e)) return this.settings.core.error.call(this, this._data.core.last_error), !1;
				if (d.id === !0 && delete d.id, d = this._parse_model_from_json(d, c.id, c.parents.concat()), !d) return !1;
				for (h = this.get_node(d), i = [], i.push(d), i = i.concat(h.children_d), this.trigger("model", {
						nodes: i,
						parent: c.id
					}), c.children_d = c.children_d.concat(i), j = 0, k = c.parents.length; k > j; j++) this._model.data[c.parents[j]].children_d = this._model.data[c.parents[j]].children_d.concat(i);
				for (d = h, h = [], j = 0, k = c.children.length; k > j; j++) h[j >= e ? j + 1 : j] = c.children[j];
				return h[e] = d.id, c.children = h, this.redraw_node(c, !0), this.trigger("create_node", {
					node: this.get_node(d),
					parent: c.id,
					position: e
				}), f && f.call(this, this.get_node(d)), d.id
			},
			rename_node: function(b, c) {
				var d, e, f;
				if (a.isArray(b)) {
					for (b = b.slice(), d = 0, e = b.length; e > d; d++) this.rename_node(b[d], c);
					return !0
				}
				return b = this.get_node(b), b && b.id !== a.jstree.root ? (f = b.text, this.check("rename_node", b, this.get_parent(b), c) ? (this.set_text(b, c), this.trigger("rename_node", {
					node: b,
					text: c,
					old: f
				}), !0) : (this.settings.core.error.call(this, this._data.core.last_error), !1)) : !1
			},
			delete_node: function(b) {
				var c, d, e, f, g, h, i, j, k, l, m, n;
				if (a.isArray(b)) {
					for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.delete_node(b[c]);
					return !0
				}
				if (b = this.get_node(b), !b || b.id === a.jstree.root) return !1;
				if (e = this.get_node(b.parent), f = a.inArray(b.id, e.children), l = !1, !this.check("delete_node", b, e, f)) return this.settings.core.error.call(this, this._data.core.last_error), !1;
				for (-1 !== f && (e.children = a.vakata.array_remove(e.children, f)), g = b.children_d.concat([]), g.push(b.id), h = 0, i = b.parents.length; i > h; h++) this._model.data[b.parents[h]].children_d = a.vakata.array_filter(this._model.data[b.parents[h]].children_d, function(b) {
					return -1 === a.inArray(b, g)
				});
				for (j = 0, k = g.length; k > j; j++)
					if (this._model.data[g[j]].state.selected) {
						l = !0;
						break
					}
				for (l && (this._data.core.selected = a.vakata.array_filter(this._data.core.selected, function(b) {
						return -1 === a.inArray(b, g)
					})), this.trigger("delete_node", {
						node: b,
						parent: e.id
					}), l && this.trigger("changed", {
						action: "delete_node",
						node: b,
						selected: this._data.core.selected,
						parent: e.id
					}), j = 0, k = g.length; k > j; j++) delete this._model.data[g[j]];
				return -1 !== a.inArray(this._data.core.focused, g) && (this._data.core.focused = null, m = this.element[0].scrollTop, n = this.element[0].scrollLeft, e.id === a.jstree.root ? this._model.data[a.jstree.root].children[0] && this.get_node(this._model.data[a.jstree.root].children[0], !0).children(".jstree-anchor").focus() : this.get_node(e, !0).children(".jstree-anchor").focus(), this.element[0].scrollTop = m, this.element[0].scrollLeft = n), this.redraw_node(e, !0), !0
			},
			check: function(b, c, d, e, f) {
				c = c && c.id ? c : this.get_node(c), d = d && d.id ? d : this.get_node(d);
				var g = b.match(/^move_node|copy_node|create_node$/i) ? d : c,
					h = this.settings.core.check_callback;
				if ("move_node" === b || "copy_node" === b) {
					if (!(f && f.is_multi || "move_node" !== b || a.inArray(c.id, d.children) !== e)) return this._data.core.last_error = {
						error: "check",
						plugin: "core",
						id: "core_08",
						reason: "Moving node to its current position",
						data: JSON.stringify({
							chk: b,
							pos: e,
							obj: c && c.id ? c.id : !1,
							par: d && d.id ? d.id : !1
						})
					}, !1;
					if (!(f && f.is_multi || c.id !== d.id && ("move_node" !== b || a.inArray(c.id, d.children) !== e) && -1 === a.inArray(d.id, c.children_d))) return this._data.core.last_error = {
						error: "check",
						plugin: "core",
						id: "core_01",
						reason: "Moving parent inside child",
						data: JSON.stringify({
							chk: b,
							pos: e,
							obj: c && c.id ? c.id : !1,
							par: d && d.id ? d.id : !1
						})
					}, !1
				}
				return g && g.data && (g = g.data), g && g.functions && (g.functions[b] === !1 || g.functions[b] === !0) ? (g.functions[b] === !1 && (this._data.core.last_error = {
					error: "check",
					plugin: "core",
					id: "core_02",
					reason: "Node data prevents function: " + b,
					data: JSON.stringify({
						chk: b,
						pos: e,
						obj: c && c.id ? c.id : !1,
						par: d && d.id ? d.id : !1
					})
				}), g.functions[b]) : h === !1 || a.isFunction(h) && h.call(this, b, c, d, e, f) === !1 || h && h[b] === !1 ? (this._data.core.last_error = {
					error: "check",
					plugin: "core",
					id: "core_03",
					reason: "User config for core.check_callback prevents function: " + b,
					data: JSON.stringify({
						chk: b,
						pos: e,
						obj: c && c.id ? c.id : !1,
						par: d && d.id ? d.id : !1
					})
				}, !1) : !0
			},
			last_error: function() {
				return this._data.core.last_error
			},
			move_node: function(c, d, e, f, g, h, i) {
				var j, k, l, m, n, o, p, q, r, s, t, u, v, w;
				if (d = this.get_node(d), e = e === b ? 0 : e, !d) return !1;
				if (!e.toString().match(/^(before|after)$/) && !g && !this.is_loaded(d)) return this.load_node(d, function() {
					this.move_node(c, d, e, f, !0, !1, i)
				});
				if (a.isArray(c)) {
					if (1 !== c.length) {
						for (j = 0, k = c.length; k > j; j++)(r = this.move_node(c[j], d, e, f, g, !1, i)) && (d = r, e = "after");
						return this.redraw(), !0
					}
					c = c[0]
				}
				if (c = c && c.id ? c : this.get_node(c), !c || c.id === a.jstree.root) return !1;
				if (l = (c.parent || a.jstree.root).toString(), n = e.toString().match(/^(before|after)$/) && d.id !== a.jstree.root ? this.get_node(d.parent) : d, o = i ? i : this._model.data[c.id] ? this : a.jstree.reference(c.id), p = !o || !o._id || this._id !== o._id, m = o && o._id && l && o._model.data[l] && o._model.data[l].children ? a.inArray(c.id, o._model.data[l].children) : -1, o && o._id && (c = o._model.data[c.id]), p) return (r = this.copy_node(c, d, e, f, g, !1, i)) ? (o && o.delete_node(c), r) : !1;
				switch (d.id === a.jstree.root && ("before" === e && (e = "first"), "after" === e && (e = "last")), e) {
					case "before":
						e = a.inArray(d.id, n.children);
						break;
					case "after":
						e = a.inArray(d.id, n.children) + 1;
						break;
					case "inside":
					case "first":
						e = 0;
						break;
					case "last":
						e = n.children.length;
						break;
					default:
						e || (e = 0)
				}
				if (e > n.children.length && (e = n.children.length), !this.check("move_node", c, n, e, {
						core: !0,
						origin: i,
						is_multi: o && o._id && o._id !== this._id,
						is_foreign: !o || !o._id
					})) return this.settings.core.error.call(this, this._data.core.last_error), !1;
				if (c.parent === n.id) {
					for (q = n.children.concat(), r = a.inArray(c.id, q), -1 !== r && (q = a.vakata.array_remove(q, r), e > r && e--), r = [], s = 0, t = q.length; t > s; s++) r[s >= e ? s + 1 : s] = q[s];
					r[e] = c.id, n.children = r, this._node_changed(n.id), this.redraw(n.id === a.jstree.root)
				} else {
					for (r = c.children_d.concat(), r.push(c.id), s = 0, t = c.parents.length; t > s; s++) {
						for (q = [], w = o._model.data[c.parents[s]].children_d, u = 0, v = w.length; v > u; u++) - 1 === a.inArray(w[u], r) && q.push(w[u]);
						o._model.data[c.parents[s]].children_d = q
					}
					for (o._model.data[l].children = a.vakata.array_remove_item(o._model.data[l].children, c.id), s = 0, t = n.parents.length; t > s; s++) this._model.data[n.parents[s]].children_d = this._model.data[n.parents[s]].children_d.concat(r);
					for (q = [], s = 0, t = n.children.length; t > s; s++) q[s >= e ? s + 1 : s] = n.children[s];
					for (q[e] = c.id, n.children = q, n.children_d.push(c.id), n.children_d = n.children_d.concat(c.children_d), c.parent = n.id, r = n.parents.concat(), r.unshift(n.id), w = c.parents.length, c.parents = r, r = r.concat(), s = 0, t = c.children_d.length; t > s; s++) this._model.data[c.children_d[s]].parents = this._model.data[c.children_d[s]].parents.slice(0, -1 * w), Array.prototype.push.apply(this._model.data[c.children_d[s]].parents, r);
					(l === a.jstree.root || n.id === a.jstree.root) && (this._model.force_full_redraw = !0), this._model.force_full_redraw || (this._node_changed(l), this._node_changed(n.id)), h || this.redraw()
				}
				return f && f.call(this, c, n, e), this.trigger("move_node", {
					node: c,
					parent: n.id,
					position: e,
					old_parent: l,
					old_position: m,
					is_multi: o && o._id && o._id !== this._id,
					is_foreign: !o || !o._id,
					old_instance: o,
					new_instance: this
				}), c.id
			},
			copy_node: function(c, d, e, f, g, h, i) {
				var j, k, l, m, n, o, p, q, r, s, t;
				if (d = this.get_node(d), e = e === b ? 0 : e, !d) return !1;
				if (!e.toString().match(/^(before|after)$/) && !g && !this.is_loaded(d)) return this.load_node(d, function() {
					this.copy_node(c, d, e, f, !0, !1, i)
				});
				if (a.isArray(c)) {
					if (1 !== c.length) {
						for (j = 0, k = c.length; k > j; j++)(m = this.copy_node(c[j], d, e, f, g, !0, i)) && (d = m, e = "after");
						return this.redraw(), !0
					}
					c = c[0]
				}
				if (c = c && c.id ? c : this.get_node(c), !c || c.id === a.jstree.root) return !1;
				switch (q = (c.parent || a.jstree.root).toString(), r = e.toString().match(/^(before|after)$/) && d.id !== a.jstree.root ? this.get_node(d.parent) : d, s = i ? i : this._model.data[c.id] ? this : a.jstree.reference(c.id), t = !s || !s._id || this._id !== s._id, s && s._id && (c = s._model.data[c.id]), d.id === a.jstree.root && ("before" === e && (e = "first"), "after" === e && (e = "last")), e) {
					case "before":
						e = a.inArray(d.id, r.children);
						break;
					case "after":
						e = a.inArray(d.id, r.children) + 1;
						break;
					case "inside":
					case "first":
						e = 0;
						break;
					case "last":
						e = r.children.length;
						break;
					default:
						e || (e = 0)
				}
				if (e > r.children.length && (e = r.children.length), !this.check("copy_node", c, r, e, {
						core: !0,
						origin: i,
						is_multi: s && s._id && s._id !== this._id,
						is_foreign: !s || !s._id
					})) return this.settings.core.error.call(this, this._data.core.last_error), !1;
				if (p = s ? s.get_json(c, {
						no_id: !0,
						no_data: !0,
						no_state: !0
					}) : c, !p) return !1;
				if (p.id === !0 && delete p.id, p = this._parse_model_from_json(p, r.id, r.parents.concat()), !p) return !1;
				for (m = this.get_node(p), c && c.state && c.state.loaded === !1 && (m.state.loaded = !1), l = [], l.push(p), l = l.concat(m.children_d), this.trigger("model", {
						nodes: l,
						parent: r.id
					}), n = 0, o = r.parents.length; o > n; n++) this._model.data[r.parents[n]].children_d = this._model.data[r.parents[n]].children_d.concat(l);
				for (l = [], n = 0, o = r.children.length; o > n; n++) l[n >= e ? n + 1 : n] = r.children[n];
				return l[e] = m.id, r.children = l, r.children_d.push(m.id), r.children_d = r.children_d.concat(m.children_d), r.id === a.jstree.root && (this._model.force_full_redraw = !0), this._model.force_full_redraw || this._node_changed(r.id), h || this.redraw(r.id === a.jstree.root), f && f.call(this, m, r, e), this.trigger("copy_node", {
					node: m,
					original: c,
					parent: r.id,
					position: e,
					old_parent: q,
					old_position: s && s._id && q && s._model.data[q] && s._model.data[q].children ? a.inArray(c.id, s._model.data[q].children) : -1,
					is_multi: s && s._id && s._id !== this._id,
					is_foreign: !s || !s._id,
					old_instance: s,
					new_instance: this
				}), m.id
			},
			cut: function(b) {
				if (b || (b = this._data.core.selected.concat()), a.isArray(b) || (b = [b]), !b.length) return !1;
				var c = [],
					g, h, i;
				for (h = 0, i = b.length; i > h; h++) g = this.get_node(b[h]), g && g.id && g.id !== a.jstree.root && c.push(g);
				return c.length ? (d = c, f = this, e = "move_node", void this.trigger("cut", {
					node: b
				})) : !1
			},
			copy: function(b) {
				if (b || (b = this._data.core.selected.concat()), a.isArray(b) || (b = [b]), !b.length) return !1;
				var c = [],
					g, h, i;
				for (h = 0, i = b.length; i > h; h++) g = this.get_node(b[h]), g && g.id && g.id !== a.jstree.root && c.push(g);
				return c.length ? (d = c, f = this, e = "copy_node", void this.trigger("copy", {
					node: b
				})) : !1
			},
			get_buffer: function() {
				return {
					mode: e,
					node: d,
					inst: f
				}
			},
			can_paste: function() {
				return e !== !1 && d !== !1
			},
			paste: function(a, b) {
				return a = this.get_node(a), a && e && e.match(/^(copy_node|move_node)$/) && d ? (this[e](d, a, b, !1, !1, !1, f) && this.trigger("paste", {
					parent: a.id,
					node: d,
					mode: e
				}), d = !1, e = !1, void(f = !1)) : !1
			},
			clear_buffer: function() {
				d = !1, e = !1, f = !1, this.trigger("clear_buffer")
			},
			edit: function(b, c, d) {
				var e, f, g, h, j, k, l, m, n, o = !1;
				return (b = this.get_node(b)) ? this.check("edit", b, this.get_parent(b)) ? (n = b, c = "string" == typeof c ? c : b.text, this.set_text(b, ""), b = this._open_to(b), n.text = c, e = this._data.core.rtl, f = this.element.width(), this._data.core.focused = n.id, g = b.children(".jstree-anchor").focus(), h = a("<span></span>"), j = c, k = a("<div></div>", {
					css: {
						position: "absolute",
						top: "-200px",
						left: e ? "0px" : "-1000px",
						visibility: "hidden"
					}
				}).appendTo(i.body), l = a("<input />", {
					value: j,
					"class": "jstree-rename-input",
					css: {
						padding: "0",
						border: "1px solid silver",
						"box-sizing": "border-box",
						display: "inline-block",
						height: this._data.core.li_height + "px",
						lineHeight: this._data.core.li_height + "px",
						width: "150px"
					},
					blur: a.proxy(function(c) {
						c.stopImmediatePropagation(), c.preventDefault();
						var e = h.children(".jstree-rename-input"),
							f = e.val(),
							i = this.settings.core.force_text,
							m;
						"" === f && (f = j), k.remove(), h.replaceWith(g), h.remove(), j = i ? j : a("<div></div>").append(a.parseHTML(j)).html(), b = this.get_node(b), this.set_text(b, j), m = !!this.rename_node(b, i ? a("<div></div>").text(f).text() : a("<div></div>").append(a.parseHTML(f)).html()), m || this.set_text(b, j), this._data.core.focused = n.id, setTimeout(a.proxy(function() {
							var a = this.get_node(n.id, !0);
							a.length && (this._data.core.focused = n.id, a.children(".jstree-anchor").focus())
						}, this), 0), d && d.call(this, n, m, o, f), l = null
					}, this),
					keydown: function(a) {
						var b = a.which;
						27 === b && (o = !0, this.value = j), (27 === b || 13 === b || 37 === b || 38 === b || 39 === b || 40 === b || 32 === b) && a.stopImmediatePropagation(), (27 === b || 13 === b) && (a.preventDefault(), this.blur())
					},
					click: function(a) {
						a.stopImmediatePropagation()
					},
					mousedown: function(a) {
						a.stopImmediatePropagation()
					},
					keyup: function(a) {
						l.width(Math.min(k.text("pW" + this.value).width(), f))
					},
					keypress: function(a) {
						return 13 === a.which ? !1 : void 0
					}
				}), m = {
					fontFamily: g.css("fontFamily") || "",
					fontSize: g.css("fontSize") || "",
					fontWeight: g.css("fontWeight") || "",
					fontStyle: g.css("fontStyle") || "",
					fontStretch: g.css("fontStretch") || "",
					fontVariant: g.css("fontVariant") || "",
					letterSpacing: g.css("letterSpacing") || "",
					wordSpacing: g.css("wordSpacing") || ""
				}, h.attr("class", g.attr("class")).append(g.contents().clone()).append(l), g.replaceWith(h), k.css(m), l.css(m).width(Math.min(k.text("pW" + l[0].value).width(), f))[0].select(), void a(i).one("mousedown.jstree touchstart.jstree dnd_start.vakata", function(b) {
					l && b.target !== l && a(l).blur()
				})) : (this.settings.core.error.call(this, this._data.core.last_error), !1) : !1
			},
			set_theme: function(b, c) {
				if (!b) return !1;
				if (c === !0) {
					var d = this.settings.core.themes.dir;
					d || (d = a.jstree.path + "/themes"), c = d + "/" + b + "/style.css"
				}
				c && -1 === a.inArray(c, g) && (a("head").append('<link rel="stylesheet" href="' + c + '" type="text/css" />'), g.push(c)), this._data.core.themes.name && this.element.removeClass("jstree-" + this._data.core.themes.name), this._data.core.themes.name = b, this.element.addClass("jstree-" + b), this.element[this.settings.core.themes.responsive ? "addClass" : "removeClass"]("jstree-" + b + "-responsive"), this.trigger("set_theme", {
					theme: b
				})
			},
			get_theme: function() {
				return this._data.core.themes.name
			},
			set_theme_variant: function(a) {
				this._data.core.themes.variant && this.element.removeClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant), this._data.core.themes.variant = a, a && this.element.addClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant)
			},
			get_theme_variant: function() {
				return this._data.core.themes.variant
			},
			show_stripes: function() {
				this._data.core.themes.stripes = !0, this.get_container_ul().addClass("jstree-striped"), this.trigger("show_stripes")
			},
			hide_stripes: function() {
				this._data.core.themes.stripes = !1, this.get_container_ul().removeClass("jstree-striped"), this.trigger("hide_stripes")
			},
			toggle_stripes: function() {
				this._data.core.themes.stripes ? this.hide_stripes() : this.show_stripes()
			},
			show_dots: function() {
				this._data.core.themes.dots = !0, this.get_container_ul().removeClass("jstree-no-dots"), this.trigger("show_dots")
			},
			hide_dots: function() {
				this._data.core.themes.dots = !1, this.get_container_ul().addClass("jstree-no-dots"), this.trigger("hide_dots")
			},
			toggle_dots: function() {
				this._data.core.themes.dots ? this.hide_dots() : this.show_dots()
			},
			show_icons: function() {
				this._data.core.themes.icons = !0, this.get_container_ul().removeClass("jstree-no-icons"), this.trigger("show_icons")
			},
			hide_icons: function() {
				this._data.core.themes.icons = !1, this.get_container_ul().addClass("jstree-no-icons"), this.trigger("hide_icons")
			},
			toggle_icons: function() {
				this._data.core.themes.icons ? this.hide_icons() : this.show_icons()
			},
			show_ellipsis: function() {
				this._data.core.themes.ellipsis = !0, this.get_container_ul().addClass("jstree-ellipsis"), this.trigger("show_ellipsis")
			},
			hide_ellipsis: function() {
				this._data.core.themes.ellipsis = !1, this.get_container_ul().removeClass("jstree-ellipsis"), this.trigger("hide_ellipsis")
			},
			toggle_ellipsis: function() {
				this._data.core.themes.ellipsis ? this.hide_ellipsis() : this.show_ellipsis()
			},
			set_icon: function(c, d) {
				var e, f, g, h;
				if (a.isArray(c)) {
					for (c = c.slice(), e = 0, f = c.length; f > e; e++) this.set_icon(c[e], d);
					return !0
				}
				return c = this.get_node(c), c && c.id !== a.jstree.root ? (h = c.icon, c.icon = d === !0 || null === d || d === b || "" === d ? !0 : d, g = this.get_node(c, !0).children(".jstree-anchor").children(".jstree-themeicon"), d === !1 ? (g.removeClass("jstree-themeicon-custom " + h).css("background", "").removeAttr("rel"), this.hide_icon(c)) : d === !0 || null === d || d === b || "" === d ? (g.removeClass("jstree-themeicon-custom " + h).css("background", "").removeAttr("rel"), h === !1 && this.show_icon(c)) : -1 === d.indexOf("/") && -1 === d.indexOf(".") ? (g.removeClass(h).css("background", ""), g.addClass(d + " jstree-themeicon-custom").attr("rel", d), h === !1 && this.show_icon(c)) : (g.removeClass(h).css("background", ""), g.addClass("jstree-themeicon-custom").css("background", "url('" + d + "') center center no-repeat").attr("rel", d), h === !1 && this.show_icon(c)), !0) : !1
			},
			get_icon: function(b) {
				return b = this.get_node(b), b && b.id !== a.jstree.root ? b.icon : !1
			},
			hide_icon: function(b) {
				var c, d;
				if (a.isArray(b)) {
					for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.hide_icon(b[c]);
					return !0
				}
				return b = this.get_node(b), b && b !== a.jstree.root ? (b.icon = !1, this.get_node(b, !0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"), !0) : !1
			},
			show_icon: function(b) {
				var c, d, e;
				if (a.isArray(b)) {
					for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.show_icon(b[c]);
					return !0
				}
				return b = this.get_node(b), b && b !== a.jstree.root ? (e = this.get_node(b, !0), b.icon = e.length ? e.children(".jstree-anchor").children(".jstree-themeicon").attr("rel") : !0, b.icon || (b.icon = !0), e.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"), !0) : !1
			}
		}, a.vakata = {}, a.vakata.attributes = function(b, c) {
			b = a(b)[0];
			var d = c ? {} : [];
			return b && b.attributes && a.each(b.attributes, function(b, e) {
				-1 === a.inArray(e.name.toLowerCase(), ["style", "contenteditable", "hasfocus", "tabindex"]) && null !== e.value && "" !== a.vakata.trim(e.value) && (c ? d[e.name] = e.value : d.push(e.name))
			}), d
		}, a.vakata.array_unique = function(a) {
			var c = [],
				d, e, f, g = {};
			for (d = 0, f = a.length; f > d; d++) g[a[d]] === b && (c.push(a[d]), g[a[d]] = !0);
			return c
		}, a.vakata.array_remove = function(a, b) {
			return a.splice(b, 1), a
		}, a.vakata.array_remove_item = function(b, c) {
			var d = a.inArray(c, b);
			return -1 !== d ? a.vakata.array_remove(b, d) : b
		}, a.vakata.array_filter = function(a, b, c, d, e) {
			if (a.filter) return a.filter(b, c);
			d = [];
			for (e in a) ~~e + "" == e + "" && e >= 0 && b.call(c, a[e], +e, a) && d.push(a[e]);
			return d
		}, a.vakata.trim = function(a) {
			return String.prototype.trim ? String.prototype.trim.call(a.toString()) : a.toString().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
		}, a.jstree.plugins.changed = function(a, b) {
			var c = [];
			this.trigger = function(a, d) {
				var e, f;
				if (d || (d = {}), "changed" === a.replace(".jstree", "")) {
					d.changed = {
						selected: [],
						deselected: []
					};
					var g = {};
					for (e = 0, f = c.length; f > e; e++) g[c[e]] = 1;
					for (e = 0, f = d.selected.length; f > e; e++) g[d.selected[e]] ? g[d.selected[e]] = 2 : d.changed.selected.push(d.selected[e]);
					for (e = 0, f = c.length; f > e; e++) 1 === g[c[e]] && d.changed.deselected.push(c[e]);
					c = d.selected.slice()
				}
				b.trigger.call(this, a, d)
			}, this.refresh = function(a, d) {
				return c = [], b.refresh.apply(this, arguments)
			}
		};
		var l = i.createElement("I");
		l.className = "jstree-icon jstree-checkbox", l.setAttribute("role", "presentation"), a.jstree.defaults.checkbox = {
				visible: !0,
				three_state: !0,
				whole_node: !0,
				keep_selected_style: !0,
				cascade: "",
				tie_selection: !0,
				cascade_to_disabled: !0,
				cascade_to_hidden: !0
			}, a.jstree.plugins.checkbox = function(c, d) {
				this.bind = function() {
					d.bind.call(this), this._data.checkbox.uto = !1, this._data.checkbox.selected = [], this.settings.checkbox.three_state && (this.settings.checkbox.cascade = "up+down+undetermined"), this.element.on("init.jstree", a.proxy(function() {
						this._data.checkbox.visible = this.settings.checkbox.visible, this.settings.checkbox.keep_selected_style || this.element.addClass("jstree-checkbox-no-clicked"), this.settings.checkbox.tie_selection && this.element.addClass("jstree-checkbox-selection")
					}, this)).on("loading.jstree", a.proxy(function() {
						this[this._data.checkbox.visible ? "show_checkboxes" : "hide_checkboxes"]()
					}, this)), -1 !== this.settings.checkbox.cascade.indexOf("undetermined") && this.element.on("changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree", a.proxy(function() {
						this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(a.proxy(this._undetermined, this), 50)
					}, this)), this.settings.checkbox.tie_selection || this.element.on("model.jstree", a.proxy(function(a, b) {
						var c = this._model.data,
							d = c[b.parent],
							e = b.nodes,
							f, g;
						for (f = 0, g = e.length; g > f; f++) c[e[f]].state.checked = c[e[f]].state.checked || c[e[f]].original && c[e[f]].original.state && c[e[f]].original.state.checked, c[e[f]].state.checked && this._data.checkbox.selected.push(e[f])
					}, this)), (-1 !== this.settings.checkbox.cascade.indexOf("up") || -1 !== this.settings.checkbox.cascade.indexOf("down")) && this.element.on("model.jstree", a.proxy(function(b, c) {
						var d = this._model.data,
							e = d[c.parent],
							f = c.nodes,
							g = [],
							h, i, j, k, l, m, n = this.settings.checkbox.cascade,
							o = this.settings.checkbox.tie_selection;
						if (-1 !== n.indexOf("down"))
							if (e.state[o ? "selected" : "checked"]) {
								for (i = 0, j = f.length; j > i; i++) d[f[i]].state[o ? "selected" : "checked"] = !0;
								this._data[o ? "core" : "checkbox"].selected = this._data[o ? "core" : "checkbox"].selected.concat(f)
							} else
								for (i = 0, j = f.length; j > i; i++)
									if (d[f[i]].state[o ? "selected" : "checked"]) {
										for (k = 0, l = d[f[i]].children_d.length; l > k; k++) d[d[f[i]].children_d[k]].state[o ? "selected" : "checked"] = !0;
										this._data[o ? "core" : "checkbox"].selected = this._data[o ? "core" : "checkbox"].selected.concat(d[f[i]].children_d)
									}
						if (-1 !== n.indexOf("up")) {
							for (i = 0, j = e.children_d.length; j > i; i++) d[e.children_d[i]].children.length || g.push(d[e.children_d[i]].parent);
							for (g = a.vakata.array_unique(g), k = 0, l = g.length; l > k; k++) {
								e = d[g[k]];
								while (e && e.id !== a.jstree.root) {
									for (h = 0, i = 0, j = e.children.length; j > i; i++) h += d[e.children[i]].state[o ? "selected" : "checked"];
									if (h !== j) break;
									e.state[o ? "selected" : "checked"] = !0, this._data[o ? "core" : "checkbox"].selected.push(e.id), m = this.get_node(e, !0), m && m.length && m.attr("aria-selected", !0).children(".jstree-anchor").addClass(o ? "jstree-clicked" : "jstree-checked"), e = this.get_node(e.parent)
								}
							}
						}
						this._data[o ? "core" : "checkbox"].selected = a.vakata.array_unique(this._data[o ? "core" : "checkbox"].selected)
					}, this)).on(this.settings.checkbox.tie_selection ? "select_node.jstree" : "check_node.jstree", a.proxy(function(b, c) {
						var d = this,
							e = c.node,
							f = this._model.data,
							g = this.get_node(e.parent),
							h, i, j, k, l = this.settings.checkbox.cascade,
							m = this.settings.checkbox.tie_selection,
							n = {},
							o = this._data[m ? "core" : "checkbox"].selected;
						for (h = 0, i = o.length; i > h; h++) n[o[h]] = !0;
						if (-1 !== l.indexOf("down")) {
							var p = this._cascade_new_checked_state(e.id, !0),
								q = e.children_d.concat(e.id);
							for (h = 0, i = q.length; i > h; h++) p.indexOf(q[h]) > -1 ? n[q[h]] = !0 : delete n[q[h]]
						}
						if (-1 !== l.indexOf("up"))
							while (g && g.id !== a.jstree.root) {
								for (j = 0, h = 0, i = g.children.length; i > h; h++) j += f[g.children[h]].state[m ? "selected" : "checked"];
								if (j !== i) break;
								g.state[m ? "selected" : "checked"] = !0, n[g.id] = !0, k = this.get_node(g, !0), k && k.length && k.attr("aria-selected", !0).children(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked"), g = this.get_node(g.parent)
							}
						o = [];
						for (h in n) n.hasOwnProperty(h) && o.push(h);
						this._data[m ? "core" : "checkbox"].selected = o
					}, this)).on(this.settings.checkbox.tie_selection ? "deselect_all.jstree" : "uncheck_all.jstree", a.proxy(function(b, c) {
						var d = this.get_node(a.jstree.root),
							e = this._model.data,
							f, g, h;
						for (f = 0, g = d.children_d.length; g > f; f++) h = e[d.children_d[f]], h && h.original && h.original.state && h.original.state.undetermined && (h.original.state.undetermined = !1)
					}, this)).on(this.settings.checkbox.tie_selection ? "deselect_node.jstree" : "uncheck_node.jstree", a.proxy(function(b, c) {
						var d = this,
							e = c.node,
							f = this.get_node(e, !0),
							g, h, i, j = this.settings.checkbox.cascade,
							k = this.settings.checkbox.tie_selection,
							l = this._data[k ? "core" : "checkbox"].selected,
							m = {},
							n = [],
							o = e.children_d.concat(e.id);
						if (-1 !== j.indexOf("down")) {
							var p = this._cascade_new_checked_state(e.id, !1);
							l = a.vakata.array_filter(l, function(a) {
								return -1 === o.indexOf(a) || p.indexOf(a) > -1
							})
						}
						if (-1 !== j.indexOf("up") && -1 === l.indexOf(e.id)) {
							for (g = 0, h = e.parents.length; h > g; g++) i = this._model.data[e.parents[g]], i.state[k ? "selected" : "checked"] = !1, i && i.original && i.original.state && i.original.state.undetermined && (i.original.state.undetermined = !1), i = this.get_node(e.parents[g], !0), i && i.length && i.attr("aria-selected", !1).children(".jstree-anchor").removeClass(k ? "jstree-clicked" : "jstree-checked");
							l = a.vakata.array_filter(l, function(a) {
								return -1 === e.parents.indexOf(a)
							})
						}
						this._data[k ? "core" : "checkbox"].selected = l
					}, this)), -1 !== this.settings.checkbox.cascade.indexOf("up") && this.element.on("delete_node.jstree", a.proxy(function(b, c) {
						var d = this.get_node(c.parent),
							e = this._model.data,
							f, g, h, i, j = this.settings.checkbox.tie_selection;
						while (d && d.id !== a.jstree.root && !d.state[j ? "selected" : "checked"]) {
							for (h = 0, f = 0, g = d.children.length; g > f; f++) h += e[d.children[f]].state[j ? "selected" : "checked"];
							if (!(g > 0 && h === g)) break;
							d.state[j ? "selected" : "checked"] = !0, this._data[j ? "core" : "checkbox"].selected.push(d.id), i = this.get_node(d, !0), i && i.length && i.attr("aria-selected", !0).children(".jstree-anchor").addClass(j ? "jstree-clicked" : "jstree-checked"), d = this.get_node(d.parent)
						}
					}, this)).on("move_node.jstree", a.proxy(function(b, c) {
						var d = c.is_multi,
							e = c.old_parent,
							f = this.get_node(c.parent),
							g = this._model.data,
							h, i, j, k, l, m = this.settings.checkbox.tie_selection;
						if (!d) {
							h = this.get_node(e);
							while (h && h.id !== a.jstree.root && !h.state[m ? "selected" : "checked"]) {
								for (i = 0, j = 0, k = h.children.length; k > j; j++) i += g[h.children[j]].state[m ? "selected" : "checked"];
								if (!(k > 0 && i === k)) break;
								h.state[m ? "selected" : "checked"] = !0, this._data[m ? "core" : "checkbox"].selected.push(h.id), l = this.get_node(h, !0), l && l.length && l.attr("aria-selected", !0).children(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked"), h = this.get_node(h.parent)
							}
						}
						h = f;
						while (h && h.id !== a.jstree.root) {
							for (i = 0, j = 0, k = h.children.length; k > j; j++) i += g[h.children[j]].state[m ? "selected" : "checked"];
							if (i === k) h.state[m ? "selected" : "checked"] || (h.state[m ? "selected" : "checked"] = !0, this._data[m ? "core" : "checkbox"].selected.push(h.id), l = this.get_node(h, !0), l && l.length && l.attr("aria-selected", !0).children(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked"));
							else {
								if (!h.state[m ? "selected" : "checked"]) break;
								h.state[m ? "selected" : "checked"] = !1, this._data[m ? "core" : "checkbox"].selected = a.vakata.array_remove_item(this._data[m ? "core" : "checkbox"].selected, h.id), l = this.get_node(h, !0), l && l.length && l.attr("aria-selected", !1).children(".jstree-anchor").removeClass(m ? "jstree-clicked" : "jstree-checked")
							}
							h = this.get_node(h.parent)
						}
					}, this))
				}, this.get_undetermined = function(c) {
					if (-1 === this.settings.checkbox.cascade.indexOf("undetermined")) return [];
					var d, e, f, g, h = {},
						i = this._model.data,
						j = this.settings.checkbox.tie_selection,
						k = this._data[j ? "core" : "checkbox"].selected,
						l = [],
						m = this,
						n = [];
					for (d = 0, e = k.length; e > d; d++)
						if (i[k[d]] && i[k[d]].parents)
							for (f = 0, g = i[k[d]].parents.length; g > f; f++) {
								if (h[i[k[d]].parents[f]] !== b) break;
								i[k[d]].parents[f] !== a.jstree.root && (h[i[k[d]].parents[f]] = !0, l.push(i[k[d]].parents[f]))
							}
					for (this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function() {
							var c = m.get_node(this),
								j;
							if (c)
								if (c.state.loaded) {
									for (d = 0, e = c.children_d.length; e > d; d++)
										if (j = i[c.children_d[d]], !j.state.loaded && j.original && j.original.state && j.original.state.undetermined && j.original.state.undetermined === !0)
											for (h[j.id] === b && j.id !== a.jstree.root && (h[j.id] = !0, l.push(j.id)), f = 0, g = j.parents.length; g > f; f++) h[j.parents[f]] === b && j.parents[f] !== a.jstree.root && (h[j.parents[f]] = !0, l.push(j.parents[f]))
								} else if (c.original && c.original.state && c.original.state.undetermined && c.original.state.undetermined === !0)
								for (h[c.id] === b && c.id !== a.jstree.root && (h[c.id] = !0, l.push(c.id)), f = 0, g = c.parents.length; g > f; f++) h[c.parents[f]] === b && c.parents[f] !== a.jstree.root && (h[c.parents[f]] = !0, l.push(c.parents[f]))
						}), d = 0, e = l.length; e > d; d++) i[l[d]].state[j ? "selected" : "checked"] || n.push(c ? i[l[d]] : l[d]);
					return n
				}, this._undetermined = function() {
					if (null !== this.element) {
						var a = this.get_undetermined(!1),
							b, c, d;
						for (this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"), b = 0, c = a.length; c > b; b++) d = this.get_node(a[b], !0), d && d.length && d.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined")
					}
				}, this.redraw_node = function(b, c, e, f) {
					if (b = d.redraw_node.apply(this, arguments)) {
						var g, h, i = null,
							j = null;
						for (g = 0, h = b.childNodes.length; h > g; g++)
							if (b.childNodes[g] && b.childNodes[g].className && -1 !== b.childNodes[g].className.indexOf("jstree-anchor")) {
								i = b.childNodes[g];
								break
							}
						i && (!this.settings.checkbox.tie_selection && this._model.data[b.id].state.checked && (i.className += " jstree-checked"), j = l.cloneNode(!1), this._model.data[b.id].state.checkbox_disabled && (j.className += " jstree-checkbox-disabled"), i.insertBefore(j, i.childNodes[0]))
					}
					return e || -1 === this.settings.checkbox.cascade.indexOf("undetermined") || (this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(a.proxy(this._undetermined, this), 50)), b
				}, this.show_checkboxes = function() {
					this._data.core.themes.checkboxes = !0, this.get_container_ul().removeClass("jstree-no-checkboxes")
				}, this.hide_checkboxes = function() {
					this._data.core.themes.checkboxes = !1, this.get_container_ul().addClass("jstree-no-checkboxes")
				}, this.toggle_checkboxes = function() {
					this._data.core.themes.checkboxes ? this.hide_checkboxes() : this.show_checkboxes()
				}, this.is_undetermined = function(b) {
					b = this.get_node(b);
					var c = this.settings.checkbox.cascade,
						d, e, f = this.settings.checkbox.tie_selection,
						g = this._data[f ? "core" : "checkbox"].selected,
						h = this._model.data;
					if (!b || b.state[f ? "selected" : "checked"] === !0 || -1 === c.indexOf("undetermined") || -1 === c.indexOf("down") && -1 === c.indexOf("up")) return !1;
					if (!b.state.loaded && b.original.state.undetermined === !0) return !0;
					for (d = 0, e = b.children_d.length; e > d; d++)
						if (-1 !== a.inArray(b.children_d[d], g) || !h[b.children_d[d]].state.loaded && h[b.children_d[d]].original.state.undetermined) return !0;
					return !1
				}, this.disable_checkbox = function(b) {
					var c, d, e;
					if (a.isArray(b)) {
						for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.disable_checkbox(b[c]);
						return !0
					}
					return b = this.get_node(b), b && b.id !== a.jstree.root ? (e = this.get_node(b, !0), void(b.state.checkbox_disabled || (b.state.checkbox_disabled = !0, e && e.length && e.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-checkbox-disabled"), this.trigger("disable_checkbox", {
						node: b
					})))) : !1
				}, this.enable_checkbox = function(b) {
					var c, d, e;
					if (a.isArray(b)) {
						for (b = b.slice(), c = 0, d = b.length; d > c; c++) this.enable_checkbox(b[c]);
						return !0
					}
					return b = this.get_node(b), b && b.id !== a.jstree.root ? (e = this.get_node(b, !0), void(b.state.checkbox_disabled && (b.state.checkbox_disabled = !1, e && e.length && e.children(".jstree-anchor").children(".jstree-checkbox").removeClass("jstree-checkbox-disabled"), this.trigger("enable_checkbox", {
						node: b
					})))) : !1
				}, this.activate_node = function(b, c) {
					return a(c.target).hasClass("jstree-checkbox-disabled") ? !1 : (this.settings.checkbox.tie_selection && (this.settings.checkbox.whole_node || a(c.target).hasClass("jstree-checkbox")) && (c.ctrlKey = !0), this.settings.checkbox.tie_selection || !this.settings.checkbox.whole_node && !a(c.target).hasClass("jstree-checkbox") ? d.activate_node.call(this, b, c) : this.is_disabled(b) ? !1 : (this.is_checked(b) ? this.uncheck_node(b, c) : this.check_node(b, c), void this.trigger("activate_node", {
						node: this.get_node(b)
					})))
				}, this._cascade_new_checked_state = function(a, b) {
					var c = this,
						d = this.settings.checkbox.tie_selection,
						e = this._model.data[a],
						f = [],
						g = [],
						h, i, j;
					if (!this.settings.checkbox.cascade_to_disabled && e.state.disabled || !this.settings.checkbox.cascade_to_hidden && e.state.hidden) j = this.get_checked_descendants(a), e.state[d ? "selected" : "checked"] && j.push(e.id), f = f.concat(j);
					else {
						if (e.children)
							for (h = 0, i = e.children.length; i > h; h++) {
								var k = e.children[h];
								j = c._cascade_new_checked_state(k, b), f = f.concat(j), j.indexOf(k) > -1 && g.push(k)
							}
						var l = c.get_node(e, !0),
							m = g.length > 0 && g.length < e.children.length;
						e.original && e.original.state && e.original.state.undetermined && (e.original.state.undetermined = m), m ? (e.state[d ? "selected" : "checked"] = !1, l.attr("aria-selected", !1).children(".jstree-anchor").removeClass(d ? "jstree-clicked" : "jstree-checked")) : b && g.length === e.children.length ? (e.state[d ? "selected" : "checked"] = b, f.push(e.id), l.attr("aria-selected", !0).children(".jstree-anchor").addClass(d ? "jstree-clicked" : "jstree-checked")) : (e.state[d ? "selected" : "checked"] = !1, l.attr("aria-selected", !1).children(".jstree-anchor").removeClass(d ? "jstree-clicked" : "jstree-checked"))
					}
					return f
				}, this.get_checked_descendants = function(b) {
					var c = this,
						d = c.settings.checkbox.tie_selection,
						e = c._model.data[b];
					return a.vakata.array_filter(e.children_d, function(a) {
						return c._model.data[a].state[d ? "selected" : "checked"]
					})
				}, this.check_node = function(b, c) {
					if (this.settings.checkbox.tie_selection) return this.select_node(b, !1, !0, c);
					var d, e, f, g;
					if (a.isArray(b)) {
						for (b = b.slice(), e = 0, f = b.length; f > e; e++) this.check_node(b[e], c);
						return !0
					}
					return b = this.get_node(b), b && b.id !== a.jstree.root ? (d = this.get_node(b, !0), void(b.state.checked || (b.state.checked = !0, this._data.checkbox.selected.push(b.id), d && d.length && d.children(".jstree-anchor").addClass("jstree-checked"), this.trigger("check_node", {
						node: b,
						selected: this._data.checkbox.selected,
						event: c
					})))) : !1
				}, this.uncheck_node = function(b, c) {
					if (this.settings.checkbox.tie_selection) return this.deselect_node(b, !1, c);
					var d, e, f;
					if (a.isArray(b)) {
						for (b = b.slice(), d = 0, e = b.length; e > d; d++) this.uncheck_node(b[d], c);
						return !0
					}
					return b = this.get_node(b), b && b.id !== a.jstree.root ? (f = this.get_node(b, !0), void(b.state.checked && (b.state.checked = !1, this._data.checkbox.selected = a.vakata.array_remove_item(this._data.checkbox.selected, b.id), f.length && f.children(".jstree-anchor").removeClass("jstree-checked"), this.trigger("uncheck_node", {
						node: b,
						selected: this._data.checkbox.selected,
						event: c
					})))) : !1
				}, this.check_all = function() {
					if (this.settings.checkbox.tie_selection) return this.select_all();
					var b = this._data.checkbox.selected.concat([]),
						c, d;
					for (this._data.checkbox.selected = this._model.data[a.jstree.root].children_d.concat(), c = 0, d = this._data.checkbox.selected.length; d > c; c++) this._model.data[this._data.checkbox.selected[c]] && (this._model.data[this._data.checkbox.selected[c]].state.checked = !0);
					this.redraw(!0), this.trigger("check_all", {
						selected: this._data.checkbox.selected
					})
				}, this.uncheck_all = function() {
					if (this.settings.checkbox.tie_selection) return this.deselect_all();
					var a = this._data.checkbox.selected.concat([]),
						b, c;
					for (b = 0, c = this._data.checkbox.selected.length; c > b; b++) this._model.data[this._data.checkbox.selected[b]] && (this._model.data[this._data.checkbox.selected[b]].state.checked = !1);
					this._data.checkbox.selected = [], this.element.find(".jstree-checked").removeClass("jstree-checked"), this.trigger("uncheck_all", {
						selected: this._data.checkbox.selected,
						node: a
					})
				}, this.is_checked = function(b) {
					return this.settings.checkbox.tie_selection ? this.is_selected(b) : (b = this.get_node(b), b && b.id !== a.jstree.root ? b.state.checked : !1)
				}, this.get_checked = function(b) {
					return this.settings.checkbox.tie_selection ? this.get_selected(b) : b ? a.map(this._data.checkbox.selected, a.proxy(function(a) {
						return this.get_node(a)
					}, this)) : this._data.checkbox.selected.slice()
				}, this.get_top_checked = function(b) {
					if (this.settings.checkbox.tie_selection) return this.get_top_selected(b);
					var c = this.get_checked(!0),
						d = {},
						e, f, g, h;
					for (e = 0, f = c.length; f > e; e++) d[c[e].id] = c[e];
					for (e = 0, f = c.length; f > e; e++)
						for (g = 0, h = c[e].children_d.length; h > g; g++) d[c[e].children_d[g]] && delete d[c[e].children_d[g]];
					c = [];
					for (e in d) d.hasOwnProperty(e) && c.push(e);
					return b ? a.map(c, a.proxy(function(a) {
						return this.get_node(a)
					}, this)) : c
				}, this.get_bottom_checked = function(b) {
					if (this.settings.checkbox.tie_selection) return this.get_bottom_selected(b);
					var c = this.get_checked(!0),
						d = [],
						e, f;
					for (e = 0, f = c.length; f > e; e++) c[e].children.length || d.push(c[e].id);
					return b ? a.map(d, a.proxy(function(a) {
						return this.get_node(a)
					}, this)) : d
				}, this.load_node = function(b, c) {
					var e, f, g, h, i, j;
					if (!a.isArray(b) && !this.settings.checkbox.tie_selection && (j = this.get_node(b), j && j.state.loaded))
						for (e = 0, f = j.children_d.length; f > e; e++) this._model.data[j.children_d[e]].state.checked && (i = !0, this._data.checkbox.selected = a.vakata.array_remove_item(this._data.checkbox.selected, j.children_d[e]));
					return d.load_node.apply(this, arguments)
				}, this.get_state = function() {
					var a = d.get_state.apply(this, arguments);
					return this.settings.checkbox.tie_selection ? a : (a.checkbox = this._data.checkbox.selected.slice(), a)
				}, this.set_state = function(b, c) {
					var e = d.set_state.apply(this, arguments);
					if (e && b.checkbox) {
						if (!this.settings.checkbox.tie_selection) {
							this.uncheck_all();
							var f = this;
							a.each(b.checkbox, function(a, b) {
								f.check_node(b)
							})
						}
						return delete b.checkbox, this.set_state(b, c), !1
					}
					return e
				}, this.refresh = function(a, b) {
					return this.settings.checkbox.tie_selection && (this._data.checkbox.selected = []), d.refresh.apply(this, arguments)
				}
			}, a.jstree.defaults.conditionalselect = function() {
				return !0
			}, a.jstree.plugins.conditionalselect = function(a, b) {
				this.activate_node = function(a, c) {
					return this.settings.conditionalselect.call(this, this.get_node(a), c) ? b.activate_node.call(this, a, c) : void 0
				}
			}, a.jstree.defaults.contextmenu = {
				select_node: !0,
				show_at_node: !0,
				items: function(b, c) {
					return {
						create: {
							separator_before: !1,
							separator_after: !0,
							_disabled: !1,
							label: "Create",
							action: function(b) {
								var c = a.jstree.reference(b.reference),
									d = c.get_node(b.reference);
								c.create_node(d, {}, "last", function(a) {
									try {
										c.edit(a)
									} catch (b) {
										setTimeout(function() {
											c.edit(a)
										}, 0)
									}
								})
							}
						},
						rename: {
							separator_before: !1,
							separator_after: !1,
							_disabled: !1,
							label: "Rename",
							action: function(b) {
								var c = a.jstree.reference(b.reference),
									d = c.get_node(b.reference);
								c.edit(d)
							}
						},
						remove: {
							separator_before: !1,
							icon: !1,
							separator_after: !1,
							_disabled: !1,
							label: "Delete",
							action: function(b) {
								var c = a.jstree.reference(b.reference),
									d = c.get_node(b.reference);
								c.is_selected(d) ? c.delete_node(c.get_selected()) : c.delete_node(d)
							}
						},
						ccp: {
							separator_before: !0,
							icon: !1,
							separator_after: !1,
							label: "Edit",
							action: !1,
							submenu: {
								cut: {
									separator_before: !1,
									separator_after: !1,
									label: "Cut",
									action: function(b) {
										var c = a.jstree.reference(b.reference),
											d = c.get_node(b.reference);
										c.is_selected(d) ? c.cut(c.get_top_selected()) : c.cut(d)
									}
								},
								copy: {
									separator_before: !1,
									icon: !1,
									separator_after: !1,
									label: "Copy",
									action: function(b) {
										var c = a.jstree.reference(b.reference),
											d = c.get_node(b.reference);
										c.is_selected(d) ? c.copy(c.get_top_selected()) : c.copy(d)
									}
								},
								paste: {
									separator_before: !1,
									icon: !1,
									_disabled: function(b) {
										return !a.jstree.reference(b.reference).can_paste()
									},
									separator_after: !1,
									label: "Paste",
									action: function(b) {
										var c = a.jstree.reference(b.reference),
											d = c.get_node(b.reference);
										c.paste(d)
									}
								}
							}
						}
					}
				}
			}, a.jstree.plugins.contextmenu = function(c, d) {
				this.bind = function() {
					d.bind.call(this);
					var b = 0,
						c = null,
						e, f;
					this.element.on("init.jstree loading.jstree ready.jstree", a.proxy(function() {
						this.get_container_ul().addClass("jstree-contextmenu")
					}, this)).on("contextmenu.jstree", ".jstree-anchor", a.proxy(function(a, d) {
						"input" !== a.target.tagName.toLowerCase() && (a.preventDefault(), b = a.ctrlKey ? +new Date : 0, (d || c) && (b = +new Date + 1e4), c && clearTimeout(c), this.is_loading(a.currentTarget) || this.show_contextmenu(a.currentTarget, a.pageX, a.pageY, a))
					}, this)).on("click.jstree", ".jstree-anchor", a.proxy(function(c) {
						this._data.contextmenu.visible && (!b || +new Date - b > 250) && a.vakata.context.hide(), b = 0
					}, this)).on("touchstart.jstree", ".jstree-anchor", function(b) {
						b.originalEvent && b.originalEvent.changedTouches && b.originalEvent.changedTouches[0] && (e = b.originalEvent.changedTouches[0].clientX, f = b.originalEvent.changedTouches[0].clientY, c = setTimeout(function() {
							a(b.currentTarget).trigger("contextmenu", !0)
						}, 750))
					}).on("touchmove.vakata.jstree", function(b) {
						c && b.originalEvent && b.originalEvent.changedTouches && b.originalEvent.changedTouches[0] && (Math.abs(e - b.originalEvent.changedTouches[0].clientX) > 10 || Math.abs(f - b.originalEvent.changedTouches[0].clientY) > 10) && (clearTimeout(c), a.vakata.context.hide())
					}).on("touchend.vakata.jstree", function(a) {
						c && clearTimeout(c)
					}), a(i).on("context_hide.vakata.jstree", a.proxy(function(b, c) {
						this._data.contextmenu.visible = !1, a(c.reference).removeClass("jstree-context")
					}, this))
				}, this.teardown = function() {
					this._data.contextmenu.visible && a.vakata.context.hide(), d.teardown.call(this)
				}, this.show_contextmenu = function(c, d, e, f) {
					if (c = this.get_node(c), !c || c.id === a.jstree.root) return !1;
					var g = this.settings.contextmenu,
						h = this.get_node(c, !0),
						i = h.children(".jstree-anchor"),
						j = !1,
						k = !1;
					(g.show_at_node || d === b || e === b) && (j = i.offset(), d = j.left, e = j.top + this._data.core.li_height), this.settings.contextmenu.select_node && !this.is_selected(c) && this.activate_node(c, f), k = g.items, a.isFunction(k) && (k = k.call(this, c, a.proxy(function(a) {
						this._show_contextmenu(c, d, e, a)
					}, this))), a.isPlainObject(k) && this._show_contextmenu(c, d, e, k)
				}, this._show_contextmenu = function(b, c, d, e) {
					var f = this.get_node(b, !0),
						g = f.children(".jstree-anchor");
					a(i).one("context_show.vakata.jstree", a.proxy(function(b, c) {
						var d = "jstree-contextmenu jstree-" + this.get_theme() + "-contextmenu";
						a(c.element).addClass(d), g.addClass("jstree-context")
					}, this)), this._data.contextmenu.visible = !0, a.vakata.context.show(g, {
						x: c,
						y: d
					}, e), this.trigger("show_contextmenu", {
						node: b,
						x: c,
						y: d
					})
				}
			},
			function(a) {
				var b = !1,
					c = {
						element: !1,
						reference: !1,
						position_x: 0,
						position_y: 0,
						items: [],
						html: "",
						is_visible: !1
					};
				a.vakata.context = {
					settings: {
						hide_onmouseleave: 0,
						icons: !0
					},
					_trigger: function(b) {
						a(i).triggerHandler("context_" + b + ".vakata", {
							reference: c.reference,
							element: c.element,
							position: {
								x: c.position_x,
								y: c.position_y
							}
						})
					},
					_execute: function(b) {
						return b = c.items[b], b && (!b._disabled || a.isFunction(b._disabled) && !b._disabled({
							item: b,
							reference: c.reference,
							element: c.element
						})) && b.action ? b.action.call(null, {
							item: b,
							reference: c.reference,
							element: c.element,
							position: {
								x: c.position_x,
								y: c.position_y
							}
						}) : !1
					},
					_parse: function(b, d) {
						if (!b) return !1;
						d || (c.html = "", c.items = []);
						var e = "",
							f = !1,
							g;
						return d && (e += "<ul>"), a.each(b, function(b, d) {
							return d ? (c.items.push(d), !f && d.separator_before && (e += "<li class='vakata-context-separator'><a href='#' " + (a.vakata.context.settings.icons ? "" : 'style="margin-left:0px;"') + ">&#160;</a></li>"), f = !1, e += "<li class='" + (d._class || "") + (d._disabled === !0 || a.isFunction(d._disabled) && d._disabled({
								item: d,
								reference: c.reference,
								element: c.element
							}) ? " vakata-contextmenu-disabled " : "") + "' " + (d.shortcut ? " data-shortcut='" + d.shortcut + "' " : "") + ">", e += "<a href='#' rel='" + (c.items.length - 1) + "' " + (d.title ? "title='" + d.title + "'" : "") + ">", a.vakata.context.settings.icons && (e += "<i ", d.icon && (e += -1 !== d.icon.indexOf("/") || -1 !== d.icon.indexOf(".") ? " style='background:url(\"" + d.icon + "\") center center no-repeat' " : " class='" + d.icon + "' "), e += "></i><span class='vakata-contextmenu-sep'>&#160;</span>"), e += (a.isFunction(d.label) ? d.label({
								item: b,
								reference: c.reference,
								element: c.element
							}) : d.label) + (d.shortcut ? ' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-' + d.shortcut + '">' + (d.shortcut_label || "") + "</span>" : "") + "</a>", d.submenu && (g = a.vakata.context._parse(d.submenu, !0), g && (e += g)), e += "</li>", void(d.separator_after && (e += "<li class='vakata-context-separator'><a href='#' " + (a.vakata.context.settings.icons ? "" : 'style="margin-left:0px;"') + ">&#160;</a></li>", f = !0))) : !0
						}), e = e.replace(/<li class\='vakata-context-separator'\><\/li\>$/, ""), d && (e += "</ul>"), d || (c.html = e, a.vakata.context._trigger("parse")), e.length > 10 ? e : !1
					},
					_show_submenu: function(c) {
						if (c = a(c), c.length && c.children("ul").length) {
							var d = c.children("ul"),
								e = c.offset().left,
								f = e + c.outerWidth(),
								g = c.offset().top,
								h = d.width(),
								i = d.height(),
								j = a(window).width() + a(window).scrollLeft(),
								k = a(window).height() + a(window).scrollTop();
							b ? c[f - (h + 10 + c.outerWidth()) < 0 ? "addClass" : "removeClass"]("vakata-context-left") : c[f + h > j && e > j - f ? "addClass" : "removeClass"]("vakata-context-right"), g + i + 10 > k && d.css("bottom", "-1px"), c.hasClass("vakata-context-right") ? h > e && d.css("margin-right", e - h) : h > j - f && d.css("margin-left", j - f - h), d.show()
						}
					},
					show: function(d, e, f) {
						var g, h, j, k, l, m, n, o, p = !0;
						switch (c.element && c.element.length && c.element.width(""), p) {
							case !e && !d:
								return !1;
							case !!e && !!d:
								c.reference = d, c.position_x = e.x, c.position_y = e.y;
								break;
							case !e && !!d:
								c.reference = d, g = d.offset(), c.position_x = g.left + d.outerHeight(), c.position_y = g.top;
								break;
							case !!e && !d:
								c.position_x = e.x, c.position_y = e.y
						}
						d && !f && a(d).data("vakata_contextmenu") && (f = a(d).data("vakata_contextmenu")), a.vakata.context._parse(f) && c.element.html(c.html), c.items.length && (c.element.appendTo(i.body), h = c.element, j = c.position_x, k = c.position_y, l = h.width(), m = h.height(), n = a(window).width() + a(window).scrollLeft(), o = a(window).height() + a(window).scrollTop(), b && (j -= h.outerWidth() - a(d).outerWidth(), j < a(window).scrollLeft() + 20 && (j = a(window).scrollLeft() + 20)), j + l + 20 > n && (j = n - (l + 20)), k + m + 20 > o && (k = o - (m + 20)), c.element.css({
							left: j,
							top: k
						}).show().find("a").first().focus().parent().addClass("vakata-context-hover"), c.is_visible = !0, a.vakata.context._trigger("show"))
					},
					hide: function() {
						c.is_visible && (c.element.hide().find("ul").hide().end().find(":focus").blur().end().detach(), c.is_visible = !1, a.vakata.context._trigger("hide"))
					}
				}, a(function() {
					b = "rtl" === a(i.body).css("direction");
					var d = !1;
					c.element = a("<ul class='vakata-context'></ul>"), c.element.on("mouseenter", "li", function(b) {
						b.stopImmediatePropagation(), a.contains(this, b.relatedTarget) || (d && clearTimeout(d), c.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(), a(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context", "li").addBack().addClass("vakata-context-hover"), a.vakata.context._show_submenu(this))
					}).on("mouseleave", "li", function(b) {
						a.contains(this, b.relatedTarget) || a(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover")
					}).on("mouseleave", function(b) {
						a(this).find(".vakata-context-hover").removeClass("vakata-context-hover"), a.vakata.context.settings.hide_onmouseleave && (d = setTimeout(function(b) {
							return function() {
								a.vakata.context.hide()
							}
						}(this), a.vakata.context.settings.hide_onmouseleave))
					}).on("click", "a", function(b) {
						b.preventDefault(), a(this).blur().parent().hasClass("vakata-context-disabled") || a.vakata.context._execute(a(this).attr("rel")) === !1 || a.vakata.context.hide()
					}).on("keydown", "a", function(b) {
						var d = null;
						switch (b.which) {
							case 13:
							case 32:
								b.type = "click", b.preventDefault(), a(b.currentTarget).trigger(b);
								break;
							case 37:
								c.is_visible && (c.element.find(".vakata-context-hover").last().closest("li").first().find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
								break;
							case 38:
								c.is_visible && (d = c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(), d.length || (d = c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()), d.addClass("vakata-context-hover").children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
								break;
							case 39:
								c.is_visible && (c.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
								break;
							case 40:
								c.is_visible && (d = c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(), d.length || (d = c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()), d.addClass("vakata-context-hover").children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
								break;
							case 27:
								a.vakata.context.hide(), b.preventDefault()
						}
					}).on("keydown", function(a) {
						a.preventDefault();
						var b = c.element.find(".vakata-contextmenu-shortcut-" + a.which).parent();
						b.parent().not(".vakata-context-disabled") && b.click()
					}), a(i).on("mousedown.vakata.jstree", function(b) {
						c.is_visible && c.element[0] !== b.target && !a.contains(c.element[0], b.target) && a.vakata.context.hide()
					}).on("context_show.vakata.jstree", function(a, d) {
						c.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"), b && c.element.addClass("vakata-context-rtl").css("direction", "rtl"), c.element.find("ul").hide().end()
					})
				})
			}(a), a.jstree.defaults.dnd = {
				copy: !0,
				open_timeout: 500,
				is_draggable: !0,
				check_while_dragging: !0,
				always_copy: !1,
				inside_pos: 0,
				drag_selection: !0,
				touch: !0,
				large_drop_target: !1,
				large_drag_target: !1,
				use_html5: !1
			};
		var m, n;
		a.jstree.plugins.dnd = function(b, c) {
				this.init = function(a, b) {
					c.init.call(this, a, b), this.settings.dnd.use_html5 = this.settings.dnd.use_html5 && "draggable" in i.createElement("span")
				}, this.bind = function() {
					c.bind.call(this), this.element.on(this.settings.dnd.use_html5 ? "dragstart.jstree" : "mousedown.jstree touchstart.jstree", this.settings.dnd.large_drag_target ? ".jstree-node" : ".jstree-anchor", a.proxy(function(b) {
						if (this.settings.dnd.large_drag_target && a(b.target).closest(".jstree-node")[0] !== b.currentTarget) return !0;
						if ("touchstart" === b.type && (!this.settings.dnd.touch || "selected" === this.settings.dnd.touch && !a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").hasClass("jstree-clicked"))) return !0;
						var c = this.get_node(b.target),
							d = this.is_selected(c) && this.settings.dnd.drag_selection ? this.get_top_selected().length : 1,
							e = d > 1 ? d + " " + this.get_string("nodes") : this.get_text(b.currentTarget);
						if (this.settings.core.force_text && (e = a.vakata.html.escape(e)), c && c.id && c.id !== a.jstree.root && (1 === b.which || "touchstart" === b.type || "dragstart" === b.type) && (this.settings.dnd.is_draggable === !0 || a.isFunction(this.settings.dnd.is_draggable) && this.settings.dnd.is_draggable.call(this, d > 1 ? this.get_top_selected(!0) : [c], b))) {
							if (m = {
									jstree: !0,
									origin: this,
									obj: this.get_node(c, !0),
									nodes: d > 1 ? this.get_top_selected() : [c.id]
								}, n = b.currentTarget, !this.settings.dnd.use_html5) return this.element.trigger("mousedown.jstree"), a.vakata.dnd.start(b, m, '<div id="jstree-dnd" class="jstree-' + this.get_theme() + " jstree-" + this.get_theme() + "-" + this.get_theme_variant() + " " + (this.settings.core.themes.responsive ? " jstree-dnd-responsive" : "") + '"><i class="jstree-icon jstree-er"></i>' + e + '<ins class="jstree-copy" style="display:none;">+</ins></div>');
							a.vakata.dnd._trigger("start", b, {
								helper: a(),
								element: n,
								data: m
							})
						}
					}, this)), this.settings.dnd.use_html5 && this.element.on("dragover.jstree", function(b) {
						return b.preventDefault(), a.vakata.dnd._trigger("move", b, {
							helper: a(),
							element: n,
							data: m
						}), !1
					}).on("drop.jstree", a.proxy(function(b) {
						return b.preventDefault(), a.vakata.dnd._trigger("stop", b, {
							helper: a(),
							element: n,
							data: m
						}), !1
					}, this))
				}, this.redraw_node = function(a, b, d, e) {
					if (a = c.redraw_node.apply(this, arguments), a && this.settings.dnd.use_html5)
						if (this.settings.dnd.large_drag_target) a.setAttribute("draggable", !0);
						else {
							var f, g, h = null;
							for (f = 0, g = a.childNodes.length; g > f; f++)
								if (a.childNodes[f] && a.childNodes[f].className && -1 !== a.childNodes[f].className.indexOf("jstree-anchor")) {
									h = a.childNodes[f];
									break
								}
							h && h.setAttribute("draggable", !0)
						}
					return a
				}
			}, a(function() {
				var c = !1,
					d = !1,
					e = !1,
					f = !1,
					g = a('<div id="jstree-marker">&#160;</div>').hide();
				a(i).on("dragover.vakata.jstree", function(b) {
					n && a.vakata.dnd._trigger("move", b, {
						helper: a(),
						element: n,
						data: m
					})
				}).on("drop.vakata.jstree", function(b) {
					n && (a.vakata.dnd._trigger("stop", b, {
						helper: a(),
						element: n,
						data: m
					}), n = null, m = null)
				}).on("dnd_start.vakata.jstree", function(a, b) {
					c = !1, e = !1, b && b.data && b.data.jstree && g.appendTo(i.body)
				}).on("dnd_move.vakata.jstree", function(h, i) {
					var j = i.event.target !== e.target;
					if (f && (!i.event || "dragover" !== i.event.type || j) && clearTimeout(f), i && i.data && i.data.jstree && (!i.event.target.id || "jstree-marker" !== i.event.target.id)) {
						e = i.event;
						var k = a.jstree.reference(i.event.target),
							l = !1,
							m = !1,
							n = !1,
							o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F;
						if (k && k._data && k._data.dnd)
							if (g.attr("class", "jstree-" + k.get_theme() + (k.settings.core.themes.responsive ? " jstree-dnd-responsive" : "")), D = i.data.origin && (i.data.origin.settings.dnd.always_copy || i.data.origin.settings.dnd.copy && (i.event.metaKey || i.event.ctrlKey)), i.helper.children().attr("class", "jstree-" + k.get_theme() + " jstree-" + k.get_theme() + "-" + k.get_theme_variant() + " " + (k.settings.core.themes.responsive ? " jstree-dnd-responsive" : "")).find(".jstree-copy").first()[D ? "show" : "hide"](), i.event.target !== k.element[0] && i.event.target !== k.get_container_ul()[0] || 0 !== k.get_container_ul().children().length) {
								if (l = k.settings.dnd.large_drop_target ? a(i.event.target).closest(".jstree-node").children(".jstree-anchor") : a(i.event.target).closest(".jstree-anchor"), l && l.length && l.parent().is(".jstree-closed, .jstree-open, .jstree-leaf") && (m = l.offset(), n = (i.event.pageY !== b ? i.event.pageY : i.event.originalEvent.pageY) - m.top, r = l.outerHeight(), u = r / 3 > n ? ["b", "i", "a"] : n > r - r / 3 ? ["a", "i", "b"] : n > r / 2 ? ["i", "a", "b"] : ["i", "b", "a"], a.each(u, function(b, e) {
										switch (e) {
											case "b":
												p = m.left - 6, q = m.top, s = k.get_parent(l), t = l.parent().index(), F = "jstree-below";
												break;
											case "i":
												B = k.settings.dnd.inside_pos, C = k.get_node(l.parent()), p = m.left - 2, q = m.top + r / 2 + 1, s = C.id, t = "first" === B ? 0 : "last" === B ? C.children.length : Math.min(B, C.children.length), F = "jstree-inside";
												break;
											case "a":
												p = m.left - 6, q = m.top + r, s = k.get_parent(l), t = l.parent().index() + 1, F = "jstree-above"
										}
										for (v = !0, w = 0, x = i.data.nodes.length; x > w; w++)
											if (y = i.data.origin && (i.data.origin.settings.dnd.always_copy || i.data.origin.settings.dnd.copy && (i.event.metaKey || i.event.ctrlKey)) ? "copy_node" : "move_node", z = t, "move_node" === y && "a" === e && i.data.origin && i.data.origin === k && s === k.get_parent(i.data.nodes[w]) && (A = k.get_node(s), z > a.inArray(i.data.nodes[w], A.children) && (z -= 1)), v = v && (k && k.settings && k.settings.dnd && k.settings.dnd.check_while_dragging === !1 || k.check(y, i.data.origin && i.data.origin !== k ? i.data.origin.get_node(i.data.nodes[w]) : i.data.nodes[w], s, z, {
													dnd: !0,
													ref: k.get_node(l.parent()),
													pos: e,
													origin: i.data.origin,
													is_multi: i.data.origin && i.data.origin !== k,
													is_foreign: !i.data.origin
												})), !v) {
												k && k.last_error && (d = k.last_error());
												break
											}
										return "i" === e && l.parent().is(".jstree-closed") && k.settings.dnd.open_timeout && (!i.event || "dragover" !== i.event.type || j) && (f && clearTimeout(f), f = setTimeout(function(a, b) {
											return function() {
												a.open_node(b)
											}
										}(k, l), k.settings.dnd.open_timeout)), v ? (E = k.get_node(s, !0), E.hasClass(".jstree-dnd-parent") || (a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"), E.addClass("jstree-dnd-parent")), c = {
											ins: k,
											par: s,
											pos: "i" !== e || "last" !== B || 0 !== t || k.is_loaded(C) ? t : "last"
										}, g.css({
											left: p + "px",
											top: q + "px"
										}).show(), g.removeClass("jstree-above jstree-inside jstree-below").addClass(F), i.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"), i.event.originalEvent && i.event.originalEvent.dataTransfer && (i.event.originalEvent.dataTransfer.dropEffect = D ? "copy" : "move"), d = {}, u = !0, !1) : void 0
									}), u === !0)) return
							} else {
								for (v = !0, w = 0, x = i.data.nodes.length; x > w; w++)
									if (v = v && k.check(i.data.origin && (i.data.origin.settings.dnd.always_copy || i.data.origin.settings.dnd.copy && (i.event.metaKey || i.event.ctrlKey)) ? "copy_node" : "move_node", i.data.origin && i.data.origin !== k ? i.data.origin.get_node(i.data.nodes[w]) : i.data.nodes[w], a.jstree.root, "last", {
											dnd: !0,
											ref: k.get_node(a.jstree.root),
											pos: "i",
											origin: i.data.origin,
											is_multi: i.data.origin && i.data.origin !== k,
											is_foreign: !i.data.origin
										}), !v) break;
								if (v) return c = {
									ins: k,
									par: a.jstree.root,
									pos: "last"
								}, g.hide(), i.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"), void(i.event.originalEvent && i.event.originalEvent.dataTransfer && (i.event.originalEvent.dataTransfer.dropEffect = D ? "copy" : "move"))
							}
						a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"), c = !1, i.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"), i.event.originalEvent && i.event.originalEvent.dataTransfer, g.hide()
					}
				}).on("dnd_scroll.vakata.jstree", function(a, b) {
					b && b.data && b.data.jstree && (g.hide(), c = !1, e = !1, b.helper.find(".jstree-icon").first().removeClass("jstree-ok").addClass("jstree-er"))
				}).on("dnd_stop.vakata.jstree", function(b, h) {
					if (a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"), f && clearTimeout(f), h && h.data && h.data.jstree) {
						g.hide().detach();
						var i, j, k = [];
						if (c) {
							for (i = 0, j = h.data.nodes.length; j > i; i++) k[i] = h.data.origin ? h.data.origin.get_node(h.data.nodes[i]) : h.data.nodes[i];
							c.ins[h.data.origin && (h.data.origin.settings.dnd.always_copy || h.data.origin.settings.dnd.copy && (h.event.metaKey || h.event.ctrlKey)) ? "copy_node" : "move_node"](k, c.par, c.pos, !1, !1, !1, h.data.origin)
						} else i = a(h.event.target).closest(".jstree"), i.length && d && d.error && "check" === d.error && (i = i.jstree(!0), i && i.settings.core.error.call(this, d));
						e = !1, c = !1
					}
				}).on("keyup.jstree keydown.jstree", function(b, h) {
					h = a.vakata.dnd._get(), h && h.data && h.data.jstree && ("keyup" === b.type && 27 === b.which ? (f && clearTimeout(f), c = !1, d = !1, e = !1, f = !1, g.hide().detach(), a.vakata.dnd._clean()) : (h.helper.find(".jstree-copy").first()[h.data.origin && (h.data.origin.settings.dnd.always_copy || h.data.origin.settings.dnd.copy && (b.metaKey || b.ctrlKey)) ? "show" : "hide"](), e && (e.metaKey = b.metaKey, e.ctrlKey = b.ctrlKey, a.vakata.dnd._trigger("move", e))))
				})
			}),
			function(a) {
				a.vakata.html = {
					div: a("<div></div>"),
					escape: function(b) {
						return a.vakata.html.div.text(b).html()
					},
					strip: function(b) {
						return a.vakata.html.div.empty().append(a.parseHTML(b)).text()
					}
				};
				var c = {
					element: !1,
					target: !1,
					is_down: !1,
					is_drag: !1,
					helper: !1,
					helper_w: 0,
					data: !1,
					init_x: 0,
					init_y: 0,
					scroll_l: 0,
					scroll_t: 0,
					scroll_e: !1,
					scroll_i: !1,
					is_touch: !1
				};
				a.vakata.dnd = {
					settings: {
						scroll_speed: 10,
						scroll_proximity: 20,
						helper_left: 5,
						helper_top: 10,
						threshold: 5,
						threshold_touch: 10
					},
					_trigger: function(c, d, e) {
						e === b && (e = a.vakata.dnd._get()), e.event = d, a(i).triggerHandler("dnd_" + c + ".vakata", e)
					},
					_get: function() {
						return {
							data: c.data,
							element: c.element,
							helper: c.helper
						}
					},
					_clean: function() {
						c.helper && c.helper.remove(), c.scroll_i && (clearInterval(c.scroll_i), c.scroll_i = !1), c = {
							element: !1,
							target: !1,
							is_down: !1,
							is_drag: !1,
							helper: !1,
							helper_w: 0,
							data: !1,
							init_x: 0,
							init_y: 0,
							scroll_l: 0,
							scroll_t: 0,
							scroll_e: !1,
							scroll_i: !1,
							is_touch: !1
						}, n = null, a(i).off("mousemove.vakata.jstree touchmove.vakata.jstree", a.vakata.dnd.drag), a(i).off("mouseup.vakata.jstree touchend.vakata.jstree", a.vakata.dnd.stop)
					},
					_scroll: function(b) {
						if (!c.scroll_e || !c.scroll_l && !c.scroll_t) return c.scroll_i && (clearInterval(c.scroll_i), c.scroll_i = !1), !1;
						if (!c.scroll_i) return c.scroll_i = setInterval(a.vakata.dnd._scroll, 100), !1;
						if (b === !0) return !1;
						var d = c.scroll_e.scrollTop(),
							e = c.scroll_e.scrollLeft();
						c.scroll_e.scrollTop(d + c.scroll_t * a.vakata.dnd.settings.scroll_speed), c.scroll_e.scrollLeft(e + c.scroll_l * a.vakata.dnd.settings.scroll_speed), (d !== c.scroll_e.scrollTop() || e !== c.scroll_e.scrollLeft()) && a.vakata.dnd._trigger("scroll", c.scroll_e)
					},
					start: function(b, d, e) {
						"touchstart" === b.type && b.originalEvent && b.originalEvent.changedTouches && b.originalEvent.changedTouches[0] && (b.pageX = b.originalEvent.changedTouches[0].pageX, b.pageY = b.originalEvent.changedTouches[0].pageY, b.target = i.elementFromPoint(b.originalEvent.changedTouches[0].pageX - window.pageXOffset, b.originalEvent.changedTouches[0].pageY - window.pageYOffset)), c.is_drag && a.vakata.dnd.stop({});
						try {
							b.currentTarget.unselectable = "on", b.currentTarget.onselectstart = function() {
								return !1
							}, b.currentTarget.style && (b.currentTarget.style.touchAction = "none", b.currentTarget.style.msTouchAction = "none", b.currentTarget.style.MozUserSelect = "none")
						} catch (f) {}
						return c.init_x = b.pageX, c.init_y = b.pageY, c.data = d, c.is_down = !0, c.element = b.currentTarget, c.target = b.target, c.is_touch = "touchstart" === b.type, e !== !1 && (c.helper = a("<div id='vakata-dnd'></div>").html(e).css({
							display: "block",
							margin: "0",
							padding: "0",
							position: "absolute",
							top: "-2000px",
							lineHeight: "16px",
							zIndex: "10000"
						})), a(i).on("mousemove.vakata.jstree touchmove.vakata.jstree", a.vakata.dnd.drag), a(i).on("mouseup.vakata.jstree touchend.vakata.jstree", a.vakata.dnd.stop), !1
					},
					drag: function(b) {
						if ("touchmove" === b.type && b.originalEvent && b.originalEvent.changedTouches && b.originalEvent.changedTouches[0] && (b.pageX = b.originalEvent.changedTouches[0].pageX, b.pageY = b.originalEvent.changedTouches[0].pageY, b.target = i.elementFromPoint(b.originalEvent.changedTouches[0].pageX - window.pageXOffset, b.originalEvent.changedTouches[0].pageY - window.pageYOffset)), c.is_down) {
							if (!c.is_drag) {
								if (!(Math.abs(b.pageX - c.init_x) > (c.is_touch ? a.vakata.dnd.settings.threshold_touch : a.vakata.dnd.settings.threshold) || Math.abs(b.pageY - c.init_y) > (c.is_touch ? a.vakata.dnd.settings.threshold_touch : a.vakata.dnd.settings.threshold))) return;
								c.helper && (c.helper.appendTo(i.body), c.helper_w = c.helper.outerWidth()), c.is_drag = !0, a(c.target).one("click.vakata", !1), a.vakata.dnd._trigger("start", b)
							}
							var d = !1,
								e = !1,
								f = !1,
								g = !1,
								h = !1,
								j = !1,
								k = !1,
								l = !1,
								m = !1,
								n = !1;
							return c.scroll_t = 0, c.scroll_l = 0, c.scroll_e = !1, a(a(b.target).parentsUntil("body").addBack().get().reverse()).filter(function() {
								return /^auto|scroll$/.test(a(this).css("overflow")) && (this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth)
							}).each(function() {
								var d = a(this),
									e = d.offset();
								return this.scrollHeight > this.offsetHeight && (e.top + d.height() - b.pageY < a.vakata.dnd.settings.scroll_proximity && (c.scroll_t = 1), b.pageY - e.top < a.vakata.dnd.settings.scroll_proximity && (c.scroll_t = -1)), this.scrollWidth > this.offsetWidth && (e.left + d.width() - b.pageX < a.vakata.dnd.settings.scroll_proximity && (c.scroll_l = 1), b.pageX - e.left < a.vakata.dnd.settings.scroll_proximity && (c.scroll_l = -1)), c.scroll_t || c.scroll_l ? (c.scroll_e = a(this), !1) : void 0
							}), c.scroll_e || (d = a(i), e = a(window), f = d.height(), g = e.height(), h = d.width(), j = e.width(), k = d.scrollTop(), l = d.scrollLeft(), f > g && b.pageY - k < a.vakata.dnd.settings.scroll_proximity && (c.scroll_t = -1), f > g && g - (b.pageY - k) < a.vakata.dnd.settings.scroll_proximity && (c.scroll_t = 1), h > j && b.pageX - l < a.vakata.dnd.settings.scroll_proximity && (c.scroll_l = -1), h > j && j - (b.pageX - l) < a.vakata.dnd.settings.scroll_proximity && (c.scroll_l = 1), (c.scroll_t || c.scroll_l) && (c.scroll_e = d)), c.scroll_e && a.vakata.dnd._scroll(!0), c.helper && (m = parseInt(b.pageY + a.vakata.dnd.settings.helper_top, 10), n = parseInt(b.pageX + a.vakata.dnd.settings.helper_left, 10), f && m + 25 > f && (m = f - 50), h && n + c.helper_w > h && (n = h - (c.helper_w + 2)), c.helper.css({
								left: n + "px",
								top: m + "px"
							})), a.vakata.dnd._trigger("move", b), !1
						}
					},
					stop: function(b) {
						if ("touchend" === b.type && b.originalEvent && b.originalEvent.changedTouches && b.originalEvent.changedTouches[0] && (b.pageX = b.originalEvent.changedTouches[0].pageX, b.pageY = b.originalEvent.changedTouches[0].pageY, b.target = i.elementFromPoint(b.originalEvent.changedTouches[0].pageX - window.pageXOffset, b.originalEvent.changedTouches[0].pageY - window.pageYOffset)), c.is_drag) b.target !== c.target && a(c.target).off("click.vakata"), a.vakata.dnd._trigger("stop", b);
						else if ("touchend" === b.type && b.target === c.target) {
							var d = setTimeout(function() {
								a(b.target).click()
							}, 100);
							a(b.target).one("click", function() {
								d && clearTimeout(d)
							})
						}
						return a.vakata.dnd._clean(), !1
					}
				}
			}(a), a.jstree.defaults.massload = null, a.jstree.plugins.massload = function(b, c) {
				this.init = function(a, b) {
					this._data.massload = {}, c.init.call(this, a, b)
				}, this._load_nodes = function(b, d, e, f) {
					var g = this.settings.massload,
						h = [],
						i = this._model.data,
						j, k, l;
					if (!e) {
						for (j = 0, k = b.length; k > j; j++)(!i[b[j]] || !i[b[j]].state.loaded && !i[b[j]].state.failed || f) && (h.push(b[j]), l = this.get_node(b[j], !0), l && l.length && l.addClass("jstree-loading").attr("aria-busy", !0));
						if (this._data.massload = {}, h.length) {
							if (a.isFunction(g)) return g.call(this, h, a.proxy(function(a) {
								var g, h;
								if (a)
									for (g in a) a.hasOwnProperty(g) && (this._data.massload[g] = a[g]);
								for (g = 0, h = b.length; h > g; g++) l = this.get_node(b[g], !0), l && l.length && l.removeClass("jstree-loading").attr("aria-busy", !1);
								c._load_nodes.call(this, b, d, e, f)
							}, this));
							if ("object" == typeof g && g && g.url) return g = a.extend(!0, {}, g), a.isFunction(g.url) && (g.url = g.url.call(this, h)), a.isFunction(g.data) && (g.data = g.data.call(this, h)), a.ajax(g).done(a.proxy(function(a, g, h) {
								var i, j;
								if (a)
									for (i in a) a.hasOwnProperty(i) && (this._data.massload[i] = a[i]);
								for (i = 0, j = b.length; j > i; i++) l = this.get_node(b[i], !0), l && l.length && l.removeClass("jstree-loading").attr("aria-busy", !1);
								c._load_nodes.call(this, b, d, e, f)
							}, this)).fail(a.proxy(function(a) {
								c._load_nodes.call(this, b, d, e, f)
							}, this))
						}
					}
					return c._load_nodes.call(this, b, d, e, f)
				}, this._load_node = function(b, d) {
					var e = this._data.massload[b.id],
						f = null,
						g;
					return e ? (f = this["string" == typeof e ? "_append_html_data" : "_append_json_data"](b, "string" == typeof e ? a(a.parseHTML(e)).filter(function() {
						return 3 !== this.nodeType
					}) : e, function(a) {
						d.call(this, a)
					}), g = this.get_node(b.id, !0), g && g.length && g.removeClass("jstree-loading").attr("aria-busy", !1), delete this._data.massload[b.id], f) : c._load_node.call(this, b, d)
				}
			}, a.jstree.defaults.search = {
				ajax: !1,
				fuzzy: !1,
				case_sensitive: !1,
				show_only_matches: !1,
				show_only_matches_children: !1,
				close_opened_onclear: !0,
				search_leaves_only: !1,
				search_callback: !1
			}, a.jstree.plugins.search = function(c, d) {
				this.bind = function() {
					d.bind.call(this), this._data.search.str = "", this._data.search.dom = a(), this._data.search.res = [], this._data.search.opn = [], this._data.search.som = !1, this._data.search.smc = !1, this._data.search.hdn = [], this.element.on("search.jstree", a.proxy(function(b, c) {
						if (this._data.search.som && c.res.length) {
							var d = this._model.data,
								e, f, g = [],
								h, i;
							for (e = 0, f = c.res.length; f > e; e++)
								if (d[c.res[e]] && !d[c.res[e]].state.hidden && (g.push(c.res[e]), g = g.concat(d[c.res[e]].parents), this._data.search.smc))
									for (h = 0, i = d[c.res[e]].children_d.length; i > h; h++) d[d[c.res[e]].children_d[h]] && !d[d[c.res[e]].children_d[h]].state.hidden && g.push(d[c.res[e]].children_d[h]);
							g = a.vakata.array_remove_item(a.vakata.array_unique(g), a.jstree.root), this._data.search.hdn = this.hide_all(!0), this.show_node(g, !0), this.redraw(!0)
						}
					}, this)).on("clear_search.jstree", a.proxy(function(a, b) {
						this._data.search.som && b.res.length && (this.show_node(this._data.search.hdn, !0), this.redraw(!0))
					}, this))
				}, this.search = function(c, d, e, f, g, h) {
					if (c === !1 || "" === a.vakata.trim(c.toString())) return this.clear_search();
					f = this.get_node(f), f = f && f.id ? f.id : null, c = c.toString();
					var i = this.settings.search,
						j = i.ajax ? i.ajax : !1,
						k = this._model.data,
						l = null,
						m = [],
						n = [],
						o, p;
					if (this._data.search.res.length && !g && this.clear_search(), e === b && (e = i.show_only_matches), h === b && (h = i.show_only_matches_children), !d && j !== !1) return a.isFunction(j) ? j.call(this, c, a.proxy(function(b) {
						b && b.d && (b = b.d), this._load_nodes(a.isArray(b) ? a.vakata.array_unique(b) : [], function() {
							this.search(c, !0, e, f, g, h)
						})
					}, this), f) : (j = a.extend({}, j), j.data || (j.data = {}), j.data.str = c, f && (j.data.inside = f), this._data.search.lastRequest && this._data.search.lastRequest.abort(), this._data.search.lastRequest = a.ajax(j).fail(a.proxy(function() {
						this._data.core.last_error = {
							error: "ajax",
							plugin: "search",
							id: "search_01",
							reason: "Could not load search parents",
							data: JSON.stringify(j)
						}, this.settings.core.error.call(this, this._data.core.last_error)
					}, this)).done(a.proxy(function(b) {
						b && b.d && (b = b.d), this._load_nodes(a.isArray(b) ? a.vakata.array_unique(b) : [], function() {
							this.search(c, !0, e, f, g, h)
						})
					}, this)), this._data.search.lastRequest);
					if (g || (this._data.search.str = c, this._data.search.dom = a(), this._data.search.res = [], this._data.search.opn = [], this._data.search.som = e, this._data.search.smc = h), l = new a.vakata.search(c, !0, {
							caseSensitive: i.case_sensitive,
							fuzzy: i.fuzzy
						}), a.each(k[f ? f : a.jstree.root].children_d, function(a, b) {
							var d = k[b];
							d.text && !d.state.hidden && (!i.search_leaves_only || d.state.loaded && 0 === d.children.length) && (i.search_callback && i.search_callback.call(this, c, d) || !i.search_callback && l.search(d.text).isMatch) && (m.push(b), n = n.concat(d.parents))
						}), m.length) {
						for (n = a.vakata.array_unique(n), o = 0, p = n.length; p > o; o++) n[o] !== a.jstree.root && k[n[o]] && this.open_node(n[o], null, 0) === !0 && this._data.search.opn.push(n[o]);
						g ? (this._data.search.dom = this._data.search.dom.add(a(this.element[0].querySelectorAll("#" + a.map(m, function(b) {
							return -1 !== "0123456789".indexOf(b[0]) ? "\\3" + b[0] + " " + b.substr(1).replace(a.jstree.idregex, "\\$&") : b.replace(a.jstree.idregex, "\\$&")
						}).join(", #")))), this._data.search.res = a.vakata.array_unique(this._data.search.res.concat(m))) : (this._data.search.dom = a(this.element[0].querySelectorAll("#" + a.map(m, function(b) {
							return -1 !== "0123456789".indexOf(b[0]) ? "\\3" + b[0] + " " + b.substr(1).replace(a.jstree.idregex, "\\$&") : b.replace(a.jstree.idregex, "\\$&")
						}).join(", #"))), this._data.search.res = m), this._data.search.dom.children(".jstree-anchor").addClass("jstree-search")
					}
					this.trigger("search", {
						nodes: this._data.search.dom,
						str: c,
						res: this._data.search.res,
						show_only_matches: e
					})
				}, this.clear_search = function() {
					this.settings.search.close_opened_onclear && this.close_node(this._data.search.opn, 0), this.trigger("clear_search", {
						nodes: this._data.search.dom,
						str: this._data.search.str,
						res: this._data.search.res
					}), this._data.search.res.length && (this._data.search.dom = a(this.element[0].querySelectorAll("#" + a.map(this._data.search.res, function(b) {
						return -1 !== "0123456789".indexOf(b[0]) ? "\\3" + b[0] + " " + b.substr(1).replace(a.jstree.idregex, "\\$&") : b.replace(a.jstree.idregex, "\\$&")
					}).join(", #"))), this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search")), this._data.search.str = "", this._data.search.res = [], this._data.search.opn = [], this._data.search.dom = a()
				}, this.redraw_node = function(b, c, e, f) {
					if (b = d.redraw_node.apply(this, arguments), b && -1 !== a.inArray(b.id, this._data.search.res)) {
						var g, h, i = null;
						for (g = 0, h = b.childNodes.length; h > g; g++)
							if (b.childNodes[g] && b.childNodes[g].className && -1 !== b.childNodes[g].className.indexOf("jstree-anchor")) {
								i = b.childNodes[g];
								break
							}
						i && (i.className += " jstree-search")
					}
					return b
				}
			},
			function(a) {
				a.vakata.search = function(b, c, d) {
					d = d || {}, d = a.extend({}, a.vakata.search.defaults, d), d.fuzzy !== !1 && (d.fuzzy = !0), b = d.caseSensitive ? b : b.toLowerCase();
					var e = d.location,
						f = d.distance,
						g = d.threshold,
						h = b.length,
						i, j, k, l;
					return h > 32 && (d.fuzzy = !1), d.fuzzy && (i = 1 << h - 1, j = function() {
						var a = {},
							c = 0;
						for (c = 0; h > c; c++) a[b.charAt(c)] = 0;
						for (c = 0; h > c; c++) a[b.charAt(c)] |= 1 << h - c - 1;
						return a
					}(), k = function(a, b) {
						var c = a / h,
							d = Math.abs(e - b);
						return f ? c + d / f : d ? 1 : c
					}), l = function(a) {
						if (a = d.caseSensitive ? a : a.toLowerCase(), b === a || -1 !== a.indexOf(b)) return {
							isMatch: !0,
							score: 0
						};
						if (!d.fuzzy) return {
							isMatch: !1,
							score: 1
						};
						var c, f, l = a.length,
							m = g,
							n = a.indexOf(b, e),
							o, p, q = h + l,
							r, s, t, u, v, w = 1,
							x = [];
						for (-1 !== n && (m = Math.min(k(0, n), m), n = a.lastIndexOf(b, e + h), -1 !== n && (m = Math.min(k(0, n), m))), n = -1, c = 0; h > c; c++) {
							o = 0, p = q;
							while (p > o) k(c, e + p) <= m ? o = p : q = p, p = Math.floor((q - o) / 2 + o);
							for (q = p, s = Math.max(1, e - p + 1), t = Math.min(e + p, l) + h, u = new Array(t + 2), u[t + 1] = (1 << c) - 1, f = t; f >= s; f--)
								if (v = j[a.charAt(f - 1)], 0 === c ? u[f] = (u[f + 1] << 1 | 1) & v : u[f] = (u[f + 1] << 1 | 1) & v | ((r[f + 1] | r[f]) << 1 | 1) | r[f + 1], u[f] & i && (w = k(c, f - 1), m >= w)) {
									if (m = w, n = f - 1, x.push(n), !(n > e)) break;
									s = Math.max(1, 2 * e - n)
								}
							if (k(c + 1, e) > m) break;
							r = u
						}
						return {
							isMatch: n >= 0,
							score: w
						}
					}, c === !0 ? {
						search: l
					} : l(c)
				}, a.vakata.search.defaults = {
					location: 0,
					distance: 100,
					threshold: .6,
					fuzzy: !1,
					caseSensitive: !1
				}
			}(a), a.jstree.defaults.sort = function(a, b) {
				return this.get_text(a) > this.get_text(b) ? 1 : -1
			}, a.jstree.plugins.sort = function(b, c) {
				this.bind = function() {
					c.bind.call(this), this.element.on("model.jstree", a.proxy(function(a, b) {
						this.sort(b.parent, !0)
					}, this)).on("rename_node.jstree create_node.jstree", a.proxy(function(a, b) {
						this.sort(b.parent || b.node.parent, !1), this.redraw_node(b.parent || b.node.parent, !0)
					}, this)).on("move_node.jstree copy_node.jstree", a.proxy(function(a, b) {
						this.sort(b.parent, !1), this.redraw_node(b.parent, !0)
					}, this))
				}, this.sort = function(b, c) {
					var d, e;
					if (b = this.get_node(b), b && b.children && b.children.length && (b.children.sort(a.proxy(this.settings.sort, this)), c))
						for (d = 0, e = b.children_d.length; e > d; d++) this.sort(b.children_d[d], !1)
				}
			};
		var o = !1;
		a.jstree.defaults.state = {
				key: "jstree",
				events: "changed.jstree open_node.jstree close_node.jstree check_node.jstree uncheck_node.jstree",
				ttl: !1,
				filter: !1,
				preserve_loaded: !1
			}, a.jstree.plugins.state = function(b, c) {
				this.bind = function() {
					c.bind.call(this);
					var b = a.proxy(function() {
						this.element.on(this.settings.state.events, a.proxy(function() {
							o && clearTimeout(o), o = setTimeout(a.proxy(function() {
								this.save_state()
							}, this), 100)
						}, this)), this.trigger("state_ready")
					}, this);
					this.element.on("ready.jstree", a.proxy(function(a, c) {
						this.element.one("restore_state.jstree", b), this.restore_state() || b()
					}, this))
				}, this.save_state = function() {
					var b = this.get_state();
					this.settings.state.preserve_loaded || delete b.core.loaded;
					var c = {
						state: b,
						ttl: this.settings.state.ttl,
						sec: +new Date
					};
					a.vakata.storage.set(this.settings.state.key, JSON.stringify(c))
				}, this.restore_state = function() {
					var b = a.vakata.storage.get(this.settings.state.key);
					if (b) try {
						b = JSON.parse(b)
					} catch (c) {
						return !1
					}
					return b && b.ttl && b.sec && +new Date - b.sec > b.ttl ? !1 : (b && b.state && (b = b.state), b && a.isFunction(this.settings.state.filter) && (b = this.settings.state.filter.call(this, b)), b ? (this.settings.state.preserve_loaded || delete b.core.loaded, this.element.one("set_state.jstree", function(c, d) {
						d.instance.trigger("restore_state", {
							state: a.extend(!0, {}, b)
						})
					}), this.set_state(b), !0) : !1)
				}, this.clear_state = function() {
					return a.vakata.storage.del(this.settings.state.key)
				}
			},
			function(a, b) {
				a.vakata.storage = {
					set: function(a, b) {
						return window.localStorage.setItem(a, b)
					},
					get: function(a) {
						return window.localStorage.getItem(a)
					},
					del: function(a) {
						return window.localStorage.removeItem(a)
					}
				}
			}(a), a.jstree.defaults.types = {
				"default": {}
			}, a.jstree.defaults.types[a.jstree.root] = {}, a.jstree.plugins.types = function(c, d) {
				this.init = function(c, e) {
					var f, g;
					if (e && e.types && e.types["default"])
						for (f in e.types)
							if ("default" !== f && f !== a.jstree.root && e.types.hasOwnProperty(f))
								for (g in e.types["default"]) e.types["default"].hasOwnProperty(g) && e.types[f][g] === b && (e.types[f][g] = e.types["default"][g]);
					d.init.call(this, c, e), this._model.data[a.jstree.root].type = a.jstree.root
				}, this.refresh = function(b, c) {
					d.refresh.call(this, b, c), this._model.data[a.jstree.root].type = a.jstree.root
				}, this.bind = function() {
					this.element.on("model.jstree", a.proxy(function(c, d) {
						var e = this._model.data,
							f = d.nodes,
							g = this.settings.types,
							h, i, j = "default",
							k;
						for (h = 0, i = f.length; i > h; h++) {
							if (j = "default", e[f[h]].original && e[f[h]].original.type && g[e[f[h]].original.type] && (j = e[f[h]].original.type), e[f[h]].data && e[f[h]].data.jstree && e[f[h]].data.jstree.type && g[e[f[h]].data.jstree.type] && (j = e[f[h]].data.jstree.type), e[f[h]].type = j, e[f[h]].icon === !0 && g[j].icon !== b && (e[f[h]].icon = g[j].icon), g[j].li_attr !== b && "object" == typeof g[j].li_attr)
								for (k in g[j].li_attr)
									if (g[j].li_attr.hasOwnProperty(k)) {
										if ("id" === k) continue;
										e[f[h]].li_attr[k] === b ? e[f[h]].li_attr[k] = g[j].li_attr[k] : "class" === k && (e[f[h]].li_attr["class"] = g[j].li_attr["class"] + " " + e[f[h]].li_attr["class"])
									}
							if (g[j].a_attr !== b && "object" == typeof g[j].a_attr)
								for (k in g[j].a_attr)
									if (g[j].a_attr.hasOwnProperty(k)) {
										if ("id" === k) continue;
										e[f[h]].a_attr[k] === b ? e[f[h]].a_attr[k] = g[j].a_attr[k] : "href" === k && "#" === e[f[h]].a_attr[k] ? e[f[h]].a_attr.href = g[j].a_attr.href : "class" === k && (e[f[h]].a_attr["class"] = g[j].a_attr["class"] + " " + e[f[h]].a_attr["class"])
									}
						}
						e[a.jstree.root].type = a.jstree.root
					}, this)), d.bind.call(this)
				}, this.get_json = function(b, c, e) {
					var f, g, h = this._model.data,
						i = c ? a.extend(!0, {}, c, {
							no_id: !1
						}) : {},
						j = d.get_json.call(this, b, i, e);
					if (j === !1) return !1;
					if (a.isArray(j))
						for (f = 0, g = j.length; g > f; f++) j[f].type = j[f].id && h[j[f].id] && h[j[f].id].type ? h[j[f].id].type : "default", c && c.no_id && (delete j[f].id, j[f].li_attr && j[f].li_attr.id && delete j[f].li_attr.id, j[f].a_attr && j[f].a_attr.id && delete j[f].a_attr.id);
					else j.type = j.id && h[j.id] && h[j.id].type ? h[j.id].type : "default", c && c.no_id && (j = this._delete_ids(j));
					return j
				}, this._delete_ids = function(b) {
					if (a.isArray(b)) {
						for (var c = 0, d = b.length; d > c; c++) b[c] = this._delete_ids(b[c]);
						return b
					}
					return delete b.id, b.li_attr && b.li_attr.id && delete b.li_attr.id, b.a_attr && b.a_attr.id && delete b.a_attr.id, b.children && a.isArray(b.children) && (b.children = this._delete_ids(b.children)), b
				}, this.check = function(c, e, f, g, h) {
					if (d.check.call(this, c, e, f, g, h) === !1) return !1;
					e = e && e.id ? e : this.get_node(e), f = f && f.id ? f : this.get_node(f);
					var i = e && e.id ? h && h.origin ? h.origin : a.jstree.reference(e.id) : null,
						j, k, l, m;
					switch (i = i && i._model && i._model.data ? i._model.data : null, c) {
						case "create_node":
						case "move_node":
						case "copy_node":
							if ("move_node" !== c || -1 === a.inArray(e.id, f.children)) {
								if (j = this.get_rules(f), j.max_children !== b && -1 !== j.max_children && j.max_children === f.children.length) return this._data.core.last_error = {
									error: "check",
									plugin: "types",
									id: "types_01",
									reason: "max_children prevents function: " + c,
									data: JSON.stringify({
										chk: c,
										pos: g,
										obj: e && e.id ? e.id : !1,
										par: f && f.id ? f.id : !1
									})
								}, !1;
								if (j.valid_children !== b && -1 !== j.valid_children && -1 === a.inArray(e.type || "default", j.valid_children)) return this._data.core.last_error = {
									error: "check",
									plugin: "types",
									id: "types_02",
									reason: "valid_children prevents function: " + c,
									data: JSON.stringify({
										chk: c,
										pos: g,
										obj: e && e.id ? e.id : !1,
										par: f && f.id ? f.id : !1
									})
								}, !1;
								if (i && e.children_d && e.parents) {
									for (k = 0, l = 0, m = e.children_d.length; m > l; l++) k = Math.max(k, i[e.children_d[l]].parents.length);
									k = k - e.parents.length + 1
								}(0 >= k || k === b) && (k = 1);
								do {
									if (j.max_depth !== b && -1 !== j.max_depth && j.max_depth < k) return this._data.core.last_error = {
										error: "check",
										plugin: "types",
										id: "types_03",
										reason: "max_depth prevents function: " + c,
										data: JSON.stringify({
											chk: c,
											pos: g,
											obj: e && e.id ? e.id : !1,
											par: f && f.id ? f.id : !1
										})
									}, !1;
									f = this.get_node(f.parent), j = this.get_rules(f), k++
								} while (f)
							}
					}
					return !0
				}, this.get_rules = function(a) {
					if (a = this.get_node(a), !a) return !1;
					var c = this.get_type(a, !0);
					return c.max_depth === b && (c.max_depth = -1), c.max_children === b && (c.max_children = -1), c.valid_children === b && (c.valid_children = -1), c
				}, this.get_type = function(b, c) {
					return b = this.get_node(b), b ? c ? a.extend({
						type: b.type
					}, this.settings.types[b.type]) : b.type : !1
				}, this.set_type = function(c, d) {
					var e = this._model.data,
						f, g, h, i, j, k, l, m;
					if (a.isArray(c)) {
						for (c = c.slice(), g = 0, h = c.length; h > g; g++) this.set_type(c[g], d);
						return !0
					}
					if (f = this.settings.types, c = this.get_node(c), !f[d] || !c) return !1;
					if (l = this.get_node(c, !0), l && l.length && (m = l.children(".jstree-anchor")), i = c.type, j = this.get_icon(c), c.type = d, (j === !0 || !f[i] || f[i].icon !== b && j === f[i].icon) && this.set_icon(c, f[d].icon !== b ? f[d].icon : !0), f[i] && f[i].li_attr !== b && "object" == typeof f[i].li_attr)
						for (k in f[i].li_attr)
							if (f[i].li_attr.hasOwnProperty(k)) {
								if ("id" === k) continue;
								"class" === k ? (e[c.id].li_attr["class"] = (e[c.id].li_attr["class"] || "").replace(f[i].li_attr[k], ""), l && l.removeClass(f[i].li_attr[k])) : e[c.id].li_attr[k] === f[i].li_attr[k] && (e[c.id].li_attr[k] = null, l && l.removeAttr(k))
							}
					if (f[i] && f[i].a_attr !== b && "object" == typeof f[i].a_attr)
						for (k in f[i].a_attr)
							if (f[i].a_attr.hasOwnProperty(k)) {
								if ("id" === k) continue;
								"class" === k ? (e[c.id].a_attr["class"] = (e[c.id].a_attr["class"] || "").replace(f[i].a_attr[k], ""), m && m.removeClass(f[i].a_attr[k])) : e[c.id].a_attr[k] === f[i].a_attr[k] && ("href" === k ? (e[c.id].a_attr[k] = "#", m && m.attr("href", "#")) : (delete e[c.id].a_attr[k], m && m.removeAttr(k)))
							}
					if (f[d].li_attr !== b && "object" == typeof f[d].li_attr)
						for (k in f[d].li_attr)
							if (f[d].li_attr.hasOwnProperty(k)) {
								if ("id" === k) continue;
								e[c.id].li_attr[k] === b ? (e[c.id].li_attr[k] = f[d].li_attr[k], l && ("class" === k ? l.addClass(f[d].li_attr[k]) : l.attr(k, f[d].li_attr[k]))) : "class" === k && (e[c.id].li_attr["class"] = f[d].li_attr[k] + " " + e[c.id].li_attr["class"], l && l.addClass(f[d].li_attr[k]))
							}
					if (f[d].a_attr !== b && "object" == typeof f[d].a_attr)
						for (k in f[d].a_attr)
							if (f[d].a_attr.hasOwnProperty(k)) {
								if ("id" === k) continue;
								e[c.id].a_attr[k] === b ? (e[c.id].a_attr[k] = f[d].a_attr[k], m && ("class" === k ? m.addClass(f[d].a_attr[k]) : m.attr(k, f[d].a_attr[k]))) : "href" === k && "#" === e[c.id].a_attr[k] ? (e[c.id].a_attr.href = f[d].a_attr.href, m && m.attr("href", f[d].a_attr.href)) : "class" === k && (e[c.id].a_attr["class"] = f[d].a_attr["class"] + " " + e[c.id].a_attr["class"], m && m.addClass(f[d].a_attr[k]))
							}
					return !0
				}
			}, a.jstree.defaults.unique = {
				case_sensitive: !1,
				trim_whitespace: !1,
				duplicate: function(a, b) {
					return a + " (" + b + ")"
				}
			}, a.jstree.plugins.unique = function(c, d) {
				this.check = function(b, c, e, f, g) {
					if (d.check.call(this, b, c, e, f, g) === !1) return !1;
					if (c = c && c.id ? c : this.get_node(c), e = e && e.id ? e : this.get_node(e), !e || !e.children) return !0;
					var h = "rename_node" === b ? f : c.text,
						i = [],
						j = this.settings.unique.case_sensitive,
						k = this.settings.unique.trim_whitespace,
						l = this._model.data,
						m, n, o;
					for (m = 0, n = e.children.length; n > m; m++) o = l[e.children[m]].text, j || (o = o.toLowerCase()), k && (o = o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")), i.push(o);
					switch (j || (h = h.toLowerCase()), k && (h = h.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")), b) {
						case "delete_node":
							return !0;
						case "rename_node":
							return o = c.text || "", j || (o = o.toLowerCase()), k && (o = o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")), m = -1 === a.inArray(h, i) || c.text && o === h, m || (this._data.core.last_error = {
								error: "check",
								plugin: "unique",
								id: "unique_01",
								reason: "Child with name " + h + " already exists. Preventing: " + b,
								data: JSON.stringify({
									chk: b,
									pos: f,
									obj: c && c.id ? c.id : !1,
									par: e && e.id ? e.id : !1
								})
							}), m;
						case "create_node":
							return m = -1 === a.inArray(h, i), m || (this._data.core.last_error = {
								error: "check",
								plugin: "unique",
								id: "unique_04",
								reason: "Child with name " + h + " already exists. Preventing: " + b,
								data: JSON.stringify({
									chk: b,
									pos: f,
									obj: c && c.id ? c.id : !1,
									par: e && e.id ? e.id : !1
								})
							}), m;
						case "copy_node":
							return m = -1 === a.inArray(h, i), m || (this._data.core.last_error = {
								error: "check",
								plugin: "unique",
								id: "unique_02",
								reason: "Child with name " + h + " already exists. Preventing: " + b,
								data: JSON.stringify({
									chk: b,
									pos: f,
									obj: c && c.id ? c.id : !1,
									par: e && e.id ? e.id : !1
								})
							}), m;
						case "move_node":
							return m = c.parent === e.id && (!g || !g.is_multi) || -1 === a.inArray(h, i), m || (this._data.core.last_error = {
								error: "check",
								plugin: "unique",
								id: "unique_03",
								reason: "Child with name " + h + " already exists. Preventing: " + b,
								data: JSON.stringify({
									chk: b,
									pos: f,
									obj: c && c.id ? c.id : !1,
									par: e && e.id ? e.id : !1
								})
							}), m
					}
					return !0
				}, this.create_node = function(c, e, f, g, h) {
					if (!e || e.text === b) {
						if (null === c && (c = a.jstree.root), c = this.get_node(c), !c) return d.create_node.call(this, c, e, f, g, h);
						if (f = f === b ? "last" : f, !f.toString().match(/^(before|after)$/) && !h && !this.is_loaded(c)) return d.create_node.call(this, c, e, f, g, h);
						e || (e = {});
						var i, j, k, l, m, n = this._model.data,
							o = this.settings.unique.case_sensitive,
							p = this.settings.unique.trim_whitespace,
							q = this.settings.unique.duplicate,
							r;
						for (j = i = this.get_string("New node"), k = [], l = 0, m = c.children.length; m > l; l++) r = n[c.children[l]].text, o || (r = r.toLowerCase()), p && (r = r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")), k.push(r);
						l = 1, r = j, o || (r = r.toLowerCase()), p && (r = r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""));
						while (-1 !== a.inArray(r, k)) j = q.call(this, i, ++l).toString(), r = j, o || (r = r.toLowerCase()), p && (r = r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""));
						e.text = j
					}
					return d.create_node.call(this, c, e, f, g, h)
				}
			};
		var p = i.createElement("DIV");
		if (p.setAttribute("unselectable", "on"), p.setAttribute("role", "presentation"), p.className = "jstree-wholerow", p.innerHTML = "&#160;", a.jstree.plugins.wholerow = function(b, c) {
				this.bind = function() {
					c.bind.call(this), this.element.on("ready.jstree set_state.jstree", a.proxy(function() {
						this.hide_dots()
					}, this)).on("init.jstree loading.jstree ready.jstree", a.proxy(function() {
						this.get_container_ul().addClass("jstree-wholerow-ul")
					}, this)).on("deselect_all.jstree", a.proxy(function(a, b) {
						this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked")
					}, this)).on("changed.jstree", a.proxy(function(a, b) {
						this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");
						var c = !1,
							d, e;
						for (d = 0, e = b.selected.length; e > d; d++) c = this.get_node(b.selected[d], !0), c && c.length && c.children(".jstree-wholerow").addClass("jstree-wholerow-clicked")
					}, this)).on("open_node.jstree", a.proxy(function(a, b) {
						this.get_node(b.node, !0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked")
					}, this)).on("hover_node.jstree dehover_node.jstree", a.proxy(function(a, b) {
						"hover_node" === a.type && this.is_disabled(b.node) || this.get_node(b.node, !0).children(".jstree-wholerow")["hover_node" === a.type ? "addClass" : "removeClass"]("jstree-wholerow-hovered")
					}, this)).on("contextmenu.jstree", ".jstree-wholerow", a.proxy(function(b) {
						if (this._data.contextmenu) {
							b.preventDefault();
							var c = a.Event("contextmenu", {
								metaKey: b.metaKey,
								ctrlKey: b.ctrlKey,
								altKey: b.altKey,
								shiftKey: b.shiftKey,
								pageX: b.pageX,
								pageY: b.pageY
							});
							a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c)
						}
					}, this)).on("click.jstree", ".jstree-wholerow", function(b) {
						b.stopImmediatePropagation();
						var c = a.Event("click", {
							metaKey: b.metaKey,
							ctrlKey: b.ctrlKey,
							altKey: b.altKey,
							shiftKey: b.shiftKey
						});
						a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()
					}).on("dblclick.jstree", ".jstree-wholerow", function(b) {
						b.stopImmediatePropagation();
						var c = a.Event("dblclick", {
							metaKey: b.metaKey,
							ctrlKey: b.ctrlKey,
							altKey: b.altKey,
							shiftKey: b.shiftKey
						});
						a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()
					}).on("click.jstree", ".jstree-leaf > .jstree-ocl", a.proxy(function(b) {
						b.stopImmediatePropagation();
						var c = a.Event("click", {
							metaKey: b.metaKey,
							ctrlKey: b.ctrlKey,
							altKey: b.altKey,
							shiftKey: b.shiftKey
						});
						a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()
					}, this)).on("mouseover.jstree", ".jstree-wholerow, .jstree-icon", a.proxy(function(a) {
						return a.stopImmediatePropagation(), this.is_disabled(a.currentTarget) || this.hover_node(a.currentTarget), !1
					}, this)).on("mouseleave.jstree", ".jstree-node", a.proxy(function(a) {
						this.dehover_node(a.currentTarget)
					}, this))
				}, this.teardown = function() {
					this.settings.wholerow && this.element.find(".jstree-wholerow").remove(), c.teardown.call(this)
				}, this.redraw_node = function(b, d, e, f) {
					if (b = c.redraw_node.apply(this, arguments)) {
						var g = p.cloneNode(!0); - 1 !== a.inArray(b.id, this._data.core.selected) && (g.className += " jstree-wholerow-clicked"), this._data.core.focused && this._data.core.focused === b.id && (g.className += " jstree-wholerow-hovered"), b.insertBefore(g, b.childNodes[0])
					}
					return b
				}
			}, window.customElements && Object && Object.create) {
			var q = Object.create(HTMLElement.prototype);
			q.createdCallback = function() {
				var b = {
						core: {},
						plugins: []
					},
					c;
				for (c in a.jstree.plugins) a.jstree.plugins.hasOwnProperty(c) && this.attributes[c] && (b.plugins.push(c), this.getAttribute(c) && JSON.parse(this.getAttribute(c)) && (b[c] = JSON.parse(this.getAttribute(c))));
				for (c in a.jstree.defaults.core) a.jstree.defaults.core.hasOwnProperty(c) && this.attributes[c] && (b.core[c] = JSON.parse(this.getAttribute(c)) || this.getAttribute(c));
				a(this).jstree(b)
			};
			try {
				window.customElements.define("vakata-jstree", function() {}, {
					prototype: q
				})
			} catch (r) {}
		}
	}
});