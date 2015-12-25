﻿
describe("z_core/data-object /Mini_Context.spec.js ", function () {

    var assert;
    var jsgui;
    var Data_Object;

    // -----------------------------------------------------
    //	Mini_Context
    // -----------------------------------------------------

    //var save_jsgui__data_id_method = null;

    before(function () {
        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        var data_object_module_name = require.resolve('../../../core/data-object');
        delete require.cache[data_object_module_name];
        //
        assert = require('assert');
        jsgui = require('../../../core/jsgui-lang-essentials');
        Data_Object = require('../../../core/data-object');
        // runs before all tests in this block
        //save_jsgui__data_id_method = jsgui.__data_id_method;
    });

    after(function () {
        // runs after all tests in this block
        //jsgui.__data_id_method = save_jsgui__data_id_method;
    });

    // =========================================
    //                  the test:
    // =========================================

    it("!!! new_id() should throw", function () {
        //
        var mini_context = new Data_Object.Mini_Context();
        //
        //mini_context.new_id();
        //
        assert.throws(function () { mini_context.new_id(); }, function (err) { return err === "stop Mini_Context typed id"; });
    });

    it("make() should not works", function () {
        //
        // ------------------------------
        jsgui.__data_id_method = "init";
        // ------------------------------
        //
        var mini_context = new Data_Object.Mini_Context();
        //
        assert.throws(function () { mini_context.make({}); }, function (err) { return err === "Object must be abstract, having ._abstract == true"; });
        //
        var data_object = new Data_Object({ abstract: true });
        //
        // !!!! exception!
        assert.throws(function () { mini_context.make(data_object); }, function (err) { return err === "stop Mini_Context typed id"; });
        //
        //
        // ------------------------------
        jsgui.__data_id_method = "lazy";
        // ------------------------------
        //
        assert.throws(function () { mini_context.make({}); }, function (err) { return err === "Object must be abstract, having ._abstract == true"; });
        //
        var data_object2 = new Data_Object({ abstract: true });
        //
        assert.throws(function () { mini_context.make(data_object2); }, "Reference error: r is not defined");

    });


});
