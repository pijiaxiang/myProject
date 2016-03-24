;(function($, window, document,undefined) {

	var Tab = function(ele, opt) {
        this.$element = ele,
        this.defaults = {
            name: 'tab',
            isEdit: false,    // 是否可编辑
            max: 3,    // 控制最多选项卡的个数
            data: [],
            // 在添加新选项卡之前触发
            beforeAddTab: function() {
                // console.log("beforeAddTab");
                return true;
            },
            // 在添加新选项卡之后触发
            afterAddTab: function(name, $that) {
                // console.log("afterAddTab");
            }
        },
        this.options = $.extend({}, this.defaults, opt);
    };

    Tab.prototype = { 

    	init: function() {

            this.$element.attr("name", this.options.name);
            if (this.options.isEdit === true) {
                this.renderAddTab();
                this.addEditEvent();
            } 

            if (this.options.isEdit === false) {

                if (this.options.adding === true) {
                    this.renderTab();
                    return this;
                }

                if (this.options.data.length === 0) {
                    this.packageData();
                }
                this.renderTab();
                this.addEvent();
                this.renderSelectTab();
            }
    		return this;
    	},

    	tabConfig: {
    		name: "jqueryTab",
            num: 0
    	},

    	// 不可编辑的tab数据组装, 未写data的情况
        packageData: function() {

            var data = [],
                $contents = this.$element.children(".tab-content-wrapper").children();

            for (var i = 0, max = $contents.length; i < max; i++) {
                data.push(eval("(" + $($contents[i]).attr("data-tab-target") + ")"));
                $($contents[i]).attr("data-tab-content", data[i].name);
            };
            this.options.data = data;
        },

        // 如果为设置默认打开tab，则默认为第一个选项卡
        setDefaultTab: function() {

            if (this.options.data.length === 0) return false;
            for (var i = 0, max = this.options.data.length; i < max; i++) {
                if (this.options.data[i].selected === true) {
                    return true;
                }
            };
            this.options.data[0].selected = true;
        },

        // 给不可编辑的tab绑定事件
        addEvent: function() {

            var that = this;

            that.$element.children(".jquery-tab").children(".tab-ul").children(".tab-ul-li").on("click", function() {
                var $that = $(this),
                    name = $that.attr("name");
                if (!$that.hasClass("tab-select")) {
                    that.switchTab(name);
                }
            });
        },

        // 给可编辑的tab绑定事件
        addEditEvent: function() {

            var that = this;

            that.$element.children(".jquery-tab").children(".tab-ul").children("[name='addTab']").on("click", function() {
                that.addTab();
            });

            that.$element.on("click", ".tab-del", function() {
                var $that = $(this);
                that.delTab($that.parent().attr("name"));
            });

            that.$element.on("click", ".tab-edit-switch", function() {
                var $that = $(this),
                    name = $that.parent().attr("name");
                if (!$that.parent().hasClass("tab-select")) {
                    that.switchTab(name);
                }
            });
        },

        // 渲染tab
        renderTab: function() {

            var that = this,
                li = '',
                tab = '<div class="jquery-tab"><ul class="tab-ul clearfix">';

            // 解决未设置默认tab的情况
            that.setDefaultTab();  

            for (var i = 0, max = this.options.data.length; i < max; i++) {
                if (that.options.data[i].selected) {
                    li += '<li class="tab-ul-li tab-select" name=\"' + that.options.data[i].name + '\"><a href="javascript:;" onfocus="this.blur();">' + that.options.data[i].text + '</a></li>';
                } else {
                    li += '<li class="tab-ul-li" name=\"' + that.options.data[i].name + '\"><a href="javascript:;" onfocus="this.blur();">' + that.options.data[i].text + '</a></li>';
                }
            }
            if (that.$element.children().hasClass(".tab-content-wrapper")) {
                tab += li + '</ul></div>';
            } else {
                tab += li + '</ul></div><div class="tab-content-wrapper"></div>';
            }
            that.$element.prepend(tab);
        },

        // 渲染添加tab的那个选项卡
        renderAddTab: function() {

            var tab = "";

            tab = '<div class="jquery-tab jquery-tab-edit">'
                 +     '<ul class="tab-ul clearfix">' 
                 +          '<li class="tab-ul-add" name="addTab"><a href="javascript:;" onfocus="this.blur();">添加</a><i></i></li>'
                 +     '</ul>'
                 + '</div>'
                 + '<div class="tab-content-wrapper"></div>';
            this.$element.prepend(tab);
        },

        initNewHeader: function() {

            var tmpl = '<li class="tab-ul-li" name="' + this.tabConfig.name + this.tabConfig.num
                    + '"><a class="tab-edit-switch" href="javascript:;" onfocus="this.blur();">未知的表单</a><i class="tab-del"></i></li>';
            this.$element.children(".jquery-tab").children(".tab-ul").children("[name='addTab']").before(tmpl);
        },

        // 初始化Tab的内容
        initNewContent: function() {
            var tmpl = '',
                name = this.tabConfig.name + this.tabConfig.num;

            tmpl = '<div class="jquery-tab-item" data-tab-content="' + name + '"></div>';
            this.$element.children('.tab-content-wrapper').append(tmpl);
            //$(_this.element).children("[data-tab-content]").eq(_this._defaultConfig.num-1).siblings("[data-tab-content]").hide();
            this.switchTab(name);
        },

        // 渲染新Tab
        renderNewTab: function() {

            this.tabConfig.num ++;
            this.initNewHeader();
            this.initNewContent();
        },

        // 渲染默认选择的tab
        renderSelectTab: function() {

            for (var i = 0, max = this.options.data.length; i < max; i++) {
                if (this.options.data[i].selected) {
                    this.switchTab(this.options.data[i].name);
                    return;
                }
            }
        },

        // 切换tab
        switchTab: function(param) {

            if (typeof param === "number") {
                this.$element.children(".jquery-tab").children(".tab-ul").children().eq(param).addClass("tab-select").siblings(".tab-ul-li").removeClass("tab-select");
                this.$element.children(".tab-content-wrapper").children().eq(param).show().siblings('[data-tab-content]').hide();
            } else {
                this.$element.children(".jquery-tab").children(".tab-ul").children("[name='" + param + "']").addClass("tab-select").siblings(".tab-ul-li").removeClass("tab-select");
                this.$element.children(".tab-content-wrapper").children('[data-tab-content="' + param + '"]').show().siblings('[data-tab-content]').hide();
            }
        },

        // 增加tab
        addTab: function() {

            var name = "";

            if (this.addTabLimit() === false) {
                return false;
            }

            if (this.options.beforeAddTab && this.options.beforeAddTab() === false) {
                return false;
            }
            this.renderNewTab();
            name = this.tabConfig.name + this.tabConfig.num;
            this.options.afterAddTab && this.options.afterAddTab(name, this.$element.children(".tab-content-wrapper").children('[data-tab-content="' + name + '"]'));
        },

        addTabLimit: function() {

            if (this.$element.children(".jquery-tab").children(".tab-ul").children().length > this.options.max) {
                alert('添加不能超出' + this.options.max + '个选项卡!');
                return false;
            }
            return true;
        },

        addTabForm: function(obj, cb) {
            var tmpl = '',
                li = '',
                name = this.tabConfig.name + this.tabConfig.num;
            if (obj.hasOwnProperty("name")) {
                tmpl = '<div class="jquery-tab-item" data-tab-content="' + obj.name + '"></div>';
                li = '<li class="tab-ul-li" name=\"' + obj.name + '\"><a href="javascript:;" onfocus="this.blur();">' + obj.text + '</a></li>';
            } else {
                tmpl = '<div class="jquery-tab-item" data-tab-content="' + name + '"></div>';
                li = '<li class="tab-ul-li" name=\"' + name + '\"><a href="javascript:;" onfocus="this.blur();">' + obj.text + '</a></li>';
            }
            
            this.$element.children(".jquery-tab").children(".tab-ul").append(li);
            this.$element.children(".tab-content-wrapper").append(tmpl);
            this.addEvent();
            this.tabConfig.num ++;
            cb && cb(this.$element.children(".tab-content-wrapper").children('[data-tab-content="' + name + '"]'));
        },

        // 修改了选项卡的名称
        rename: function(name, rename) {

            this.$element.children(".jquery-tab").children(".tab-ul").children("[name='" + name + "']").children("a").html(rename);
        },

        // 根据name获取tab选项卡的名字
        getTabText: function(name) {
            var text = this.$element.children(".jquery-tab").children(".tab-ul").children("[name='" + name + "']").children("a").html();
            return text;
        },

        // 删除tab
        delTab: function(name) {

            var $delTab = this.$element.children(".jquery-tab").children(".tab-ul").children("[name='" + name + "']");

            if ($delTab.hasClass("tab-select")) {
                $delTab.remove();
                this.$element.children(".jquery-tab").children(".tab-ul").children(".tab-ul-li").children(".tab-edit-switch").click();
            } else {
                $delTab.remove();
            }
            this.$element.children(".tab-content-wrapper").children('[data-tab-content="' + name + '"]').remove();
        }
    };

	// 在插件中使用tab
    $.fn.tab = function(options) {

        // 创建tab的实体
    	var tab = new Tab(this, options); 

        // 调用其方法
        return tab.init();
    }
})(jQuery, window, document);
