﻿
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object', "../../../core/jsgui-data-structures", 'assert', '../../test-utils/test-utils'],
function (Data_Object, Data_Structures, assert, test_utils) {

    describe("z_core/data-object /Data_Object.spec.js ", function () {

        //#region Initialization

        // ======================================================
        //
        //	                Initialization
        //
        // ======================================================

        function base_check(data_object) {
            if (data_object._abstract) {
                assert.deepEqual(data_object.__type, undefined);
                assert.deepEqual(data_object._, undefined);
            } else {
                assert.deepEqual(data_object.__type, 'data_object');
                assert.deepEqual(data_object._, {});
            }
            //
            assert.deepEqual(data_object.fc, undefined); // !!!
        }

        // -----------------------------------------------------
        //	init()
        // -----------------------------------------------------

        it("should performs some basic initialization", function () {
            var data_object = null;
            //
            // default
            //
            data_object = new Data_Object();
            base_check(data_object);
            //
            assert.deepEqual(data_object.stringify(), "Data_Object({})");
            assert.deepEqual(data_object.toObject(), {});
            //
            // abstract: object
            //
            data_object = new Data_Object({ abstract: true });
            base_check(data_object);
            //
            //
            assert.deepEqual(data_object._abstract, true);
            assert.deepEqual(data_object._type_constructor, undefined);
            assert.deepEqual(data_object._spec, { abstract: true }); // ?
            //
            assert.deepEqual(data_object.stringify(), "Data_Object(undefined)");
            assert.deepEqual(data_object.toObject(), {});
            //
            // abstract: function
            //
            var type_constructor = function () { };
            type_constructor.abstract = true;
            data_object = new Data_Object(type_constructor);
            base_check(data_object);
            //
            assert.deepEqual(data_object._abstract, true);
            assert.deepEqual(data_object._type_constructor, type_constructor);
            assert.deepEqual(data_object._spec, undefined);
            //
            assert.deepEqual(data_object.stringify(), "Data_Object(undefined)");
            assert.deepEqual(data_object.toObject(), {});
            //
            // _context
            //
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            data_object = new Data_Object({ context: myContext });
            base_check(data_object);
            //
            assert.deepEqual(data_object._context, myContext);
            //
            // __id
            //
            data_object = new Data_Object({ _id: "008" });
            base_check(data_object);
            //
            assert.deepEqual(data_object.__id, "008");
            //
            // empty spec
            //
            data_object = new Data_Object({});
            base_check(data_object);
        });


        // -----------------------------------------------------
        //	__id
        // -----------------------------------------------------

        it("should assign an _id sometimes", function () {
            var data_object = null;
            //
            // default
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.__id, undefined);
            //
            // abstract: object
            //
            data_object = new Data_Object({ abstract: true });
            assert.deepEqual(data_object.__id, undefined);
            //
            // abstract: function
            //
            var type_constructor = function () { };
            type_constructor.abstract = true;
            data_object = new Data_Object(type_constructor);
            assert.deepEqual(data_object.__id, undefined);
            //
            // _context
            //
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            data_object = new Data_Object({ context: myContext });
            assert.deepEqual(data_object.__id, "data_object_007");
            //
            // _id
            //
            data_object = new Data_Object({ _id: "008" });
            assert.deepEqual(data_object.__id, "008");
            //
            // no context, no _id
            //
            data_object = new Data_Object({});
            assert.deepEqual(data_object.__id, undefined);
        });

        // -----------------------------------------------------
        //	spec: call a method
        // -----------------------------------------------------

        it("should call methods mentioned in the spec, passing parameter from the spec", function () {
            var myConstraints = { c1: 1 };
            var data_object = new Data_Object({ constraints: myConstraints }); // calls constraints(myConstraints)
            assert.deepEqual(data_object._field_constraints, myConstraints);
        });

        // -----------------------------------------------------
        //	spec: event_bindings
        // -----------------------------------------------------

        it("should prohibit the event_bindings parameter", function () {
            assert.throws(function () { new Data_Object({ event_bindings: [] }) });
        });

        // -----------------------------------------------------
        //	spec: constraint
        // -----------------------------------------------------

        it("should throw an error...", function () {
            assert.throws(function () { new Data_Object({ constraint: {} }) });
        });

        // -----------------------------------------------------
        //	spec: parent
        // -----------------------------------------------------

        xit("should ...", function () {
            // new Data_Object({ parent: ? });  - calls set('parent',..) instead of parent()
        });

        //#endregion

        //#region stringify(), toObject()

        // ======================================================
        //
        //	             stringify(), toObject()
        //
        // ======================================================

        // -----------------------------------------------------
        //	stringify()
        // -----------------------------------------------------

        it("should do stringify", function () {
            var data_object = new Data_Object();
            data_object._ = "123";
            assert.deepEqual(data_object.stringify(), 'Data_Object("123")');
        });

        // -----------------------------------------------------
        //	toObject()
        // -----------------------------------------------------

        it("should do toObject()", function () {
            var data_object = null;
            var obj = null;
            //
            obj = { a: 1, b: "2" };
            data_object = new Data_Object();
            data_object._ = obj
            assert.deepEqual(data_object.toObject(), obj);
            //
            obj = [1, 2, "3"];
            data_object = new Data_Object();
            data_object._ = obj
            assert.deepEqual(data_object.toObject(), obj);
            //
            obj = 7;
            data_object = new Data_Object();
            data_object._ = obj
            assert.deepEqual(data_object.toObject(), {});  // !!!
        });

        //#endregion

        //#region base properties

        // ======================================================
        //
        //	                 base properties
        //
        // ======================================================

        // -----------------------------------------------------
        //	parent(): just like Data_Value.parent()
        // -----------------------------------------------------

        it("should be able to have a parent", function () {
            var data_object = null;
            //
            // no parent:
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.parent(), undefined);
            //
            // set something as parent:
            //
            data_object.parent("123");
            assert.deepEqual(data_object.parent(), "123");
            assert.throws(function () { data_object._id(); });
            //
            // set something as parent (with index):
            //
            data_object.parent("777", 0);
            assert.deepEqual(data_object.parent(), "777");
            assert.throws(function () { data_object._id(); });
            //
            // set a parent with a context:
            //
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            var myParent = { _context: myContext };
            data_object.parent(myParent);
            assert.deepEqual(data_object.parent(), myParent);
            assert.deepEqual(data_object._id(), "data_object_007");
            //
            // set a parent with a context, with index:
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.parent(), undefined);
            //
            data_object.parent(myParent, 0);
            assert.deepEqual(data_object.parent(), myParent);
            assert.deepEqual(data_object._id(), "data_object_008");
        });

        // -----------------------------------------------------
        //	_id(): just like Data_Value._id()
        // -----------------------------------------------------

        it("should be able to provide an id", function () {
            var data_object = null;
            //
            data_object = new Data_Object();
            assert.throws(function () { data_object._id(); });
            //
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            data_object = new Data_Object({ context: context });
            assert.deepEqual(data_object._id(), "data_object_007");
            assert.deepEqual(data_object._id(), "data_object_007"); // the same as above, new_id() was not called
        });

        //#endregion base properties

        //#region get(), set(), has(), value(), load_from_spec()

        // ======================================================
        //
        //	   get(), set(), has(), value(), load_from_spec()
        //
        // ======================================================

        //
        // the main get() and set() algorithm is the following:
        //
        //function get(field_name) {
        //    if (fc.get(field_name)) {
        //        if (!_[field_name]) {
        //            _[field_name] = createValueBasedOnFieldDefinition(); // Data_Object or Data_Value usually
        //            return _[field_name];
        //        } else {
        //            return _[field_name];
        //        }
        //    } else {
        //        return ll_get(_, field_name);
        //    }
        //}
        //
        //function set(field_name, value) {
        //    if (!get(field_name)) {
        //        // nof field defined, and no value was set previously:
        //        if (typeof (value) in ['string', 'number', 'boolean', 'date']) {
        //            this._[field_name] = new Data_Value({ 'value': value });
        //        } else {
        //            this._[field_name] = value;
        //        }
        //    } else {
        //        this._[field_name] = value;
        //    }
        //}

        it("should works strangely", function () {
            var data_object = new Data_Object();
            //
            // with field definition: set any value directly
            //
            data_object.set_field("Field1", "int");
            data_object.set("Field1", "abc");
            assert.deepEqual(data_object.get("Field1"), "abc");
            //
            // with field definition but without set(): create Data_Value or Data_Object or something else:
            //
            data_object.set_field("Field2", "int");
            assert.deepEqual(data_object.get("Field2"), new Data_Object.Data_Value());
            //
            // without field definition: create Data_Value for 'string', 'number', 'boolean', 'date':
            //
            data_object.set("Field3", "abc");
            assert.deepEqual(data_object.get("Field3"), new Data_Object.Data_Value({ value: "abc" }));
            //
            // without field definition: assign just value for other types:
            //
            data_object.set("Field4", ["abc"]);
            assert.deepEqual(data_object.get("Field4"), ["abc"]);
        });

        // -----------------------------------------------------
        //	initial state
        // -----------------------------------------------------

        it("initial state: empty Data_Object", function () {
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object.fields(), []);
            //
            assert.deepEqual(data_object._, {}); // implementation details, remove it from real test !!!
            assert.deepEqual(data_object.get(), {});
        });

        // -----------------------------------------------------
        //	without the field(s) definition:
        // -----------------------------------------------------

        //#region without the field(s) definition

        it("internal ll_get() and ll_set()", function () {
            var data_object = new Data_Object();
            //
            // Data_Object allows to set and get values directly, without the internal Data_Value creation
            // it does not works for the following types: 'string', 'number', 'boolean', 'date'
            // so, test it using arrays and object:
            //
            // BTW ll_set() found to be not used 
            //
            data_object.set("Field1", [123]);
            assert.deepEqual(data_object.get("Field1"), [123]);
            //
            data_object.set("Field2", ["45"]);
            assert.deepEqual(data_object.get("Field2"), ["45"]);
            //
            var value = { x: 100 };
            data_object.set("Field1", value);
            assert.deepEqual(data_object.get("Field1"), value);
        });

        it("native types", function () {
            var data_object = new Data_Object();
            //
            // Data_Object creates an internal Data_Value for native types ('string', 'number', 'boolean', 'date')
            // notice the additional .get() call:
            //
            data_object.set("Field1", "45");
            assert.deepEqual(data_object.get("Field1").get(), "45");
            //
            data_object.set("Field2", 123);
            assert.deepEqual(data_object.get("Field2").get(), 123);
            //
            data_object.set("Field3", false);
            assert.deepEqual(data_object.get("Field3").get(), false);
            //
            // probably error
            // "date" is listed in the hard-coded types inside the set() method code, 
            // but typeof returns "object" instead of "date". So, it does not create 
            // the internal Data_Value for Date (notice no additional .get() call):
            //
            var date_value = new Date(10000);
            data_object.set("Field4", date_value);
            assert.deepEqual(data_object.get("Field4"), date_value); // !!!
        });

        it("allows to set anything if the field exists", function () {
            var data_object = new Data_Object();
            //
            // if the field was set previously, then Data_Object allows to set anything without the internal Data_Object creation
            // bug?
            //
            data_object.set("Field1", [123]);
            assert.deepEqual(data_object.get("Field1"), [123]);
            //
            data_object.set("Field1", 123);
            assert.deepEqual(data_object.get("Field1"), 123); // !!!
        });

        it("should prevent read-only fields from setting", function () {
            var data_object = new Data_Object();
            //
            data_object.read_only("Field1");
            assert.throws(function () { data_object.set("Field1", [123]); });
            assert.deepEqual(data_object.get("Field1"), undefined);
            //
            data_object.read_only("Field1", false);
            data_object.set("Field1", [123]);
            assert.deepEqual(data_object.get("Field1"), [123]);
        });

        it("get() should return an object with all values", function () {
            var data_object = new Data_Object();
            // 
            var data_value1 = new Data_Object.Data_Value({ value: 100 });
            var data_value2 = new Data_Object.Data_Value({ value: "200" });
            //
            data_object.set("Field1", 100);
            data_object.set("Field2", "200");
            assert.deepEqual(data_object.get("Field1"), data_value1);
            assert.deepEqual(data_object.get("Field2"), data_value2);
            //
            assert.deepEqual(data_object.get(), { Field1: data_value1, Field2: data_value2 });
        });

        it("set() should raise change event", function () {
            var data_object = new Data_Object();
            //
            var change_eventArgs = null;
            data_object.on("change", function (eventArgs) {
                change_eventArgs = eventArgs;
            });
            //
            data_object.set("Field1", [123]);
            assert.deepEqual(change_eventArgs, { name: "Field1", value: [123] });
            //
            var value = { x: 100 };
            data_object.set("Field1", value);
            assert.deepEqual(change_eventArgs, { name: "Field1", value: value });
            //
            // silent mode:
            //
            change_eventArgs = null;
            data_object.set("Field1", [123], true);
            assert.deepEqual(change_eventArgs, null);
            //
            change_eventArgs = null;
            data_object.set("Field1", [123], "false"); // !!!
            assert.deepEqual(change_eventArgs, null); // !!!
            //
            change_eventArgs = null;
            data_object.set("Field1", [123], ""); // ???
            assert.deepEqual(change_eventArgs, { name: "Field1", value: [123] });
        });

        xit("set() should include a source property to the change event when a control is passed", function () {
            //
            // something like data_object.set("Field1", [123], control);
            //
            // TODO: complete the test when controls code will be processed
        });

        it("set() using object instead of name/value pairs", function () {
            var data_object = new Data_Object();
            //
            data_object.set({ Field1: [123], Field2: ["45"] });
            //
            assert.deepEqual(data_object.get("Field1"), [123]);
            assert.deepEqual(data_object.get("Field2"), ["45"]);
        });

        it("set() using Data_Object instead of name/value pairs", function () {
            var data_object = new Data_Object();
            //
            var data_object_as_value = new Data_Object();
            //
            data_object.set(data_object_as_value);
            assert.deepEqual(data_object.get(), { undefined: undefined }); // !!!
        });

        xit("set() using control instead of name/value pairs", function () {
            //
            // TODO: complete the test when controls code will be processed
            // maybe James means "Collection"? but "c" sig is "control"...
            // anyway it must not works
            //
            //var data_object = null;
            ////
            //data_object = new Data_Object();
            ////
            //var control_as_value = ...
            ////
            //data_object.set(control_as_value);
            //assert.deepEqual(data_object.get(), { undefined: undefined }); // !!!
        });

        //#endregion

        // -----------------------------------------------------
        //	with the field(s) definition: get() before set():
        // -----------------------------------------------------

        //#region with the field(s) definition: get() before set():

        // this function is related to the get() implementation details, and used to check code coverage purposes
        // this check should be removed from the final (production) tests version
        function assert_field_sig(data_object, fieldName, fieldSig) {
            var jsgui = data_object.mod_link();
            var sig = jsgui.get_item_sig(data_object.fc.get(fieldName), 20);
            assert.deepEqual(sig, fieldSig);
        }

        // get() before set(): [s,s,f]

        it("get() before set(): [s,s,f]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_String", String); assert_field_sig(data_object, "Field_String", "[s,s,f]");
            var value_String = new Data_Object.Data_Value();
            assert.deepEqual(data_object.get("Field_String"), value_String);
            //
            data_object.set_field("Field_Number", Number); assert_field_sig(data_object, "Field_Number", "[s,s,f]");
            var value_Number = new Data_Object.Data_Value();
            assert.deepEqual(data_object.get("Field_Number"), value_Number);
            //
            var MyBook = function () { this.book = "Secret City"; };
            //
            data_object.set_field("Field_MyBook", MyBook); assert_field_sig(data_object, "Field_MyBook", "[s,s,f]");
            var value_MyBook = new MyBook();
            assert.deepEqual(data_object.get("Field_MyBook"), value_MyBook);
        });

        // get() before set(): [s,[s,u]] - I see no way to create such field

        // get() before set(): [s,s,o]:

        it("get() before set(): [s,s,o]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_collection", "collection"); assert_field_sig(data_object, "Field_collection", "[s,s,o]");
            assert.throws(function () { data_object.get("Field_collection") });  // it's unable to create this field (line 4172 jsgui.Collection undefined) !!!
            //
            data_object.set_field("Field_data_object", "data_object"); assert_field_sig(data_object, "Field_data_object", "[s,s,o]");
            var value_data_object = new Data_Object();
            value_data_object._parent = data_object;                                    // !!!
            assert.deepEqual(data_object.get("Field_data_object"), value_data_object);
            //
            data_object.set_field("Field_ordered_string_list", "ordered_string_list"); assert_field_sig(data_object, "Field_ordered_string_list", "[s,s,o]");
            var value_ordered_string_list = new Data_Structures.Ordered_String_List();
            var v1_ordered_string_list = test_utils.functionsToStrings(data_object.get("Field_ordered_string_list"));
            var v2_ordered_string_list = test_utils.functionsToStrings(value_ordered_string_list);
            assert.deepEqual(v1_ordered_string_list, v2_ordered_string_list);
            //
            data_object.set_field("Field_string", "string"); assert_field_sig(data_object, "Field_string", "[s,s,o]");
            var value_string = new Data_Object.Data_Value();
            value_string._parent = data_object; // !!!
            assert.deepEqual(data_object.get("Field_string"), value_string);
            //
            data_object.set_field("Field_text", "text", { data_type: ["text", 10] }); assert_field_sig(data_object, "Field_text", "[s,s,o]");
            var value_text = new Data_Object.Data_Value();
            assert.deepEqual(data_object.get("Field_text"), value_text);
            //
            data_object.set_field("Field_text2", "text"); assert_field_sig(data_object, "Field_text2", "[s,s,o]");
            assert.deepEqual(data_object.get("Field_text2"), undefined); // !!!
            //
            data_object.set_field("Field_int", "int"); assert_field_sig(data_object, "Field_int", "[s,s,o]");
            var value_int = new Data_Object.Data_Value();
            assert.deepEqual(data_object.get("Field_int"), value_int);
            //
            data_object.set_field("Field_wrong", "wrong"); assert_field_sig(data_object, "Field_wrong", "[s,s,o]");
            assert.deepEqual(data_object.get("Field_wrong"), undefined);
        });

        // get() before set(): [s,s]:

        it("get() before set(): [s,s]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field(0, ["Field_collection", "collection"]); assert_field_sig(data_object, "Field_collection", "[s,s]");
            assert.throws(function () { data_object.get("Field_collection") });
            //
            data_object.set_field(0, ["Field_data_object", "data_object"]); assert_field_sig(data_object, "Field_data_object", "[s,s]");
            assert.throws(function () { data_object.get("Field_data_object") }); // "new jsgui.Data_Object(...)" data-object.js line 4347
        });

        // get() before set(): [s,s] using jsgui.data_types_info:

        xit("get() before set(): [s,s] using jsgui.data_types_info", function () {
            /*
            // TODO: complete after Data_Object.extend understanding

            var data_object = new Data_Object();
            //
            var jsgui = data_object.mod_link();
            //
            var old_data_types_info = jsgui.data_types_info;

            jsgui.data_types_info = { MyType: [["Field1", "int", { data_type: "int" }]] };

            data_object.set_field(0, ["F_MyType", "MyType"]); assert_field_sig(data_object, "F_MyType", "[s,s]");
            //assert.deepEqual(data_object.get("F_MyType"), undefined);

            var v_MyType = new Data_Object();
            v_MyType._parent = data_object;                                    // !!!
            v_MyType.set_field("Field1", "int", { data_type: "int" });

            console.log("///////");
            console.log(data_object.get("F_MyType"));
            console.log("|||||||");
            console.log(v_MyType);

            //assert.deepEqual(data_object.get("F_MyType"), v_MyType);

            jsgui.data_types_info = old_data_types_info;

            console.log(jsgui.data_types_info);
            */
        });

        // get() before set(): [s,[s,s]]:

        it("get() before set(): [s,[s,s]]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_collection", ["collection", "int"]); assert_field_sig(data_object, "Field_collection", "[s,[s,s]]");
            assert.deepEqual(data_object.get("Field_collection"), undefined);
            //
            data_object.set_field("Field_dictionary", ["dictionary", "int"]); assert_field_sig(data_object, "Field_dictionary", "u"); // !!!
        });

        // get() before set(): [s,[s,o]]:

        it("get() before set(): [s,[s,o]]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_collection", [{}]); assert_field_sig(data_object, "Field_collection", "[s,[s,o]]");            
            assert.deepEqual(data_object.fc.get("Field_collection"), ["Field_collection", ["collection", {}]]);
            assert.throws(function () { data_object.get("Field_collection") });
            //
            data_object.set_field("Field_data_object", {}); assert_field_sig(data_object, "Field_data_object", "[s,[s,o]]");
            assert.deepEqual(data_object.fc.get("Field_data_object"), ["Field_data_object", ["data_object", {}]]);
            assert.deepEqual(data_object.get("Field_data_object"), undefined);
        });

        //#endregion

        // -----------------------------------------------------
        //	set(), then get()
        // -----------------------------------------------------

        //#region set(), then get()

        //
        // There is a get() call inside the set() code. So, probably, "set() then get()" scenario is unreal?
        //

        it("should set and get values", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_int", "int");
            data_object.set("Field_int", "abc");
            assert.deepEqual(data_object.get("Field_int"), "abc"); // !!!
            //
            // how it's probably intended:
            //
            var data_value = new Data_Object.Data_Value({ value: 31 });
            data_object.set("Field_int", data_value);
            assert.deepEqual(data_object.get("Field_int"), data_value); // ???
        });

        it("should not allow an asyncronous access for get()", function () {
            var data_object = new Data_Object();
            //
            data_object.set("Field1", ["abc"]);
            assert.deepEqual(data_object.get("Field1"), ["abc"]);
            //
            var callback = function () { };
            assert.throws(function () { data_object.get("Field1", callback); });
        });

        // -----------------------------------------------------
        //	get, set() for qualified property names
        // -----------------------------------------------------

        it("should set and get values", function () {
            var data_object = new Data_Object();
            //
            // set() allows to set a field named ".", but get() is unable to get this field:
            //
            data_object.set(".", ["dot"]);
            assert.deepEqual(data_object.get(), { '.': ["dot"] });
            assert.deepEqual(data_object.get("."), undefined);
            //
            // Data_Object allows to set values using qualified names,
            // if all the nested data objects are created:
            //
            var data_object_b = new Data_Object();
            data_object_b.set("c", ["abc"]);
            //
            var data_object_a = new Data_Object();
            data_object_a.set("b", data_object_b);
            //
            data_object.set("a", data_object_a);
            assert.deepEqual(data_object.get("a.b.c"), ["abc"]);
            //
            data_object.set("a.b.c", [123]);
            assert.deepEqual(data_object.get("a.b.c"), [123]);
            //
            // Data_Object is unable to create the nested data objects itself:
            //
            assert.throws(function () { data_object.set("x.y", ["xy"]); }); // 'No data object at this level.'
            //
            // Data_Object provides the change event for the qualified names as well:
            //
            var change_eventArgs = null;
            data_object.on("change", function (eventArgs) {
                change_eventArgs = eventArgs;
            });
            //
            data_object.set("a.b.c", [45]);
            assert.deepEqual(data_object.get("a.b.c"), [45]);
            assert.deepEqual(change_eventArgs, { name: "a.b.c", value: [45] });
        });

        xit("should use input_processors and output_processors", function () {
            //
            //  TODO !!!
            //
        });

        //#endregion

        // -----------------------------------------------------
        //	has()
        // -----------------------------------------------------

        it("should return if a value has set", function () {
            var data_object = new Data_Object();
            //
            // with field definition:
            //
            assert.deepEqual(data_object.has("Field1"), false);
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.has("Field1"), true); // value created automatically
            //
            data_object.set("Field1", "abc");
            assert.deepEqual(data_object.has("Field1"), true);
            //
            // without field definition:
            //
            assert.deepEqual(data_object.has("Field2"), false);
            data_object.set("Field2", ["abc"]);
            assert.deepEqual(data_object.has("Field2"), true);
        });

        // -----------------------------------------------------
        //	value()
        // -----------------------------------------------------

        it("should return values object", function () {
            var data_object = new Data_Object();
            //
            // internal direct value:
            //
            data_object.set("Field1", ["abc"]);
            assert.deepEqual(data_object.get("Field1"), ["abc"]);
            assert.deepEqual(data_object.value(), { Field1: ["abc"] });
            //
            // internal Data_Value:
            //
            data_object.set("Field2", new Data_Object.Data_Value({ value: 123 }));
            assert.deepEqual(data_object.get("Field2"), new Data_Object.Data_Value({ value: 123 }));
            assert.deepEqual(data_object.value(), { Field1: ["abc"], Field2: 123 }); // because Data_Value have value() method
        });

        // -----------------------------------------------------
        //	load_from_spec()
        // -----------------------------------------------------

        it("should set values for the items present in both 'spec' and 'arr_item_names' parameters", function () {
            var data_object = new Data_Object();
            //
            // btw it calls set() internally, so use arrays as values for simplicity
            //
            data_object.load_from_spec({ Field1: [111], Field2: [222], Field3: [333] }, ["Field1", "Field3", "Field4"]);
            assert.deepEqual(data_object.get(), { Field1: [111], Field3: [333] });
        });

        //#endregion get(), set(), etc.

        //#region Fields

        // ======================================================
        //
        //	                 Fields
        //
        // ======================================================

        // -----------------------------------------------------
        //	data_def()
        // -----------------------------------------------------

        it("does nothing", function () {
            var data_object = null;
            //
            data_object = new Data_Object();
            data_object.data_def({ Field1: "int" });
            base_check(data_object); // nothing changed !!!
            assert.deepEqual(data_object.data_def(), undefined); // !!!
        });

        // -----------------------------------------------------
        //	fields(), set_field()
        // -----------------------------------------------------

        it("should be able to get/set fields", function () {
            var data_object = null;
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.fields(), []);
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.fields(), [["Field1", "int", { data_type: "int" }]]);
            //
            data_object.fields({ Field2: "string", Field3: "bool" });
            assert.deepEqual(data_object.fields(), [["Field1", "int", { data_type: "int" }], ["Field2", "string", { data_type: "string" }], ["Field3", "bool", { data_type: "bool" }]]);
            //
            assert.deepEqual(data_object.fields("Field2"), ["Field2", "string", { data_type: "string" }]);
            //
            // setting the same field again adds a field with the same name !!!
            //
            data_object = new Data_Object();
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.fields(), [["Field1", "int", { data_type: "int" }]]);
            //
            data_object.set_field("Field1", "bool");
            assert.deepEqual(data_object.fields(), [["Field1", "int", { data_type: "int" }], ["Field1", "bool", { data_type: "bool" }]]);
        });

        // -----------------------------------------------------
        //	read_only()
        // -----------------------------------------------------

        it("should get/set read_only for fields", function () {
            var data_object = null;
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object._map_read_only, undefined);
            assert.deepEqual(data_object.read_only(), undefined);
            assert.deepEqual(data_object._map_read_only, {});
            //
            data_object.read_only('f1');
            assert.deepEqual(data_object._map_read_only, { f1: true });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
            //
            data_object.read_only('f1', false);
            assert.deepEqual(data_object._map_read_only, { f1: null });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
            //
            data_object.read_only('f1', true);
            assert.deepEqual(data_object._map_read_only, { f1: true });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
            //
            data_object.read_only(['f1', 'f2']);
            assert.deepEqual(data_object._map_read_only, { f1: true, f2: true });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
        });

        //#endregion Fields

        //#region Constraints

        // ======================================================
        //
        //	                 Constraints
        //
        // ======================================================

        // -----------------------------------------------------
        //	constraints()
        // -----------------------------------------------------

        it("should be able to get/set constraints", function () {
            var data_object = null;
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.constraints(), undefined);
            //
            var myConstraints = { a: 1 };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            assert.deepEqual(data_object.constraints(), undefined); // !!!
        });

        // -----------------------------------------------------
        //	matches_field_constraint()
        // -----------------------------------------------------

        it("should check field value for the constraint", function () {
            var data_object = null;
            //
            // data_object.set() creates an internal Data_Value, it does not matches the constraints:
            //
            data_object = new Data_Object();
            data_object.set("Field1", 12.5);
            assert.deepEqual(data_object.get("Field1"), new Data_Object.Data_Value({ value: 12.5 }));
            //
            assert.deepEqual(data_object.matches_field_constraint("Field1", "int"), false);
            assert.deepEqual(data_object.matches_field_constraint("Field1", "number"), false); // !!!
            //
            // repeated data_object.set() sets value directly, it matches the constraints:
            //
            data_object.set("Field1", 12.5);
            assert.deepEqual(data_object.get("Field1"), 12.5);
            //
            assert.deepEqual(data_object.matches_field_constraint("Field1", "int"), false);
            assert.deepEqual(data_object.matches_field_constraint("Field1", "number"), true);
        });

        // -----------------------------------------------------
        //	obj_matches_field_constraints()
        // -----------------------------------------------------

        it("should call matches_field_constraint() method of the passed object, passing its own constraints", function () {
            var data_object = new Data_Object();
            //
            // it seems that the constraints should be an object with key/value pairs, probably field_name/field_constraint:
            //
            var myConstraints = { Field1: "int", Field2: "number" };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            //
            // obj_matches_field_constraints() will calls a matches_field_constraint() method of the passed object
            // we will use a fake method logging the passed arguments:
            //
            var args = [];
            var obj = { matches_field_constraint: function (a, b) { args.push([a, b]); return true; } };
            //
            // so, test it:
            //
            assert.deepEqual(data_object.obj_matches_field_constraints(obj), true);
            assert.deepEqual(args, [["Field1", "int"], ["Field2", "number"]]);
        });


        //#endregion  Constraints

        //#region xxxxxxxxxxx

        // ======================================================
        //
        //	                 xxxxxxxxxxxxx
        //
        // ======================================================


        //#endregion

        /*
            //data_object.set_field("Field_test", String);
            //console.log(data_object.fc.get("Field_test"));
            //console.log(jsgui.get_item_sig(data_object.fc.get("Field_test"), 20));


            //

            //console.log(data_object.fc.get("Field1") + " : " + jsgui.get_item_sig(data_object.fc.get("Field1"), 20));
            //console.log(data_object.fc.get("Field2"));


            //var f2 = data_object.get("Field1");
            //console.log("----------------");
            //console.log(data_value2);
            //console.log("----------------");
            //console.log(f2);
            ////console.log(jsgui.stringify(f2));

            ////assert.deepEqual(data_object._, {});
        */


    });


});


