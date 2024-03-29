(function () {
    'use strict';

    class NativeAd extends Laya.Script {
        constructor() {
            super(...arguments);
            this.defaultNode = null;
            this.nativetNode = null;
            this.icon = null;
            this.title = null;
            this.desc = null;
            this.contant = null;
            this.close = null;
            this.WatchAD1 = null;
            this.WatchAD2 = null;
        }
        onAwake() {
            this.defaultNode = this.owner.getChildByName("defaultNode");
            this.nativetNode = this.owner.getChildByName("nativeNode");
            this.icon = this.nativetNode.getChildByName("Icon");
            this.title = this.nativetNode.getChildByName("Title");
            this.desc = this.nativetNode.getChildByName("Des");
            this.contant = this.nativetNode.getChildByName('Contant');
            this.WatchAD2 = this.owner.getChildByName("WatchAD2");
            this.close = this.owner.getChildByName("Close");
            if (this.WatchAD2) {
                this.WatchAD2.on(Laya.Event.CLICK, this, this.Click);
            }
            else {
                this.WatchAD2 = this.nativetNode.getChildByName("WatchAD2");
                if (this.WatchAD2) {
                    this.WatchAD2.on(Laya.Event.CLICK, this, this.Click);
                }
            }
            this.WatchAD1 = this.owner.getChildByName("WatchAD1");
            if (this.WatchAD1) {
                this.WatchAD1.on(Laya.Event.CLICK, this, this.Click);
            }
            else {
                this.WatchAD1 = this.nativetNode.getChildByName("WatchAD1");
                if (this.WatchAD1) {
                    this.WatchAD1.on(Laya.Event.CLICK, this, this.Click);
                }
            }
            this.nativetNode.on(Laya.Event.CLICK, this, this.Click);
            this.owner.visible = false;
            this.close.on(Laya.Event.CLICK, this, () => {
                this.owner.removeSelf();
            });
            Laya.timer.once(100, this, () => {
                this.Show();
            });
        }
        Show() {
            let p = new TJ.API.AdService.Param();
            this.nativeAd = TJ.API.AdService.LoadNative(p);
            console.log("展示原生广告 =》", this.nativeAd);
            if (this.nativeAd != null) {
                console.log("展示原生广告 =》", this.nativeAd.iconUrl);
                console.log("展示原生广告 =》", this.nativeAd.title);
            }
            if (this.nativeAd != null) {
                this.owner.visible = true;
                if (this.nativeAd) {
                    console.log("this.nativeAd = ", this.nativeAd);
                    this.nativeAd.OnShow();
                    this.icon.skin = this.nativeAd.iconUrl;
                    this.title.text = this.nativeAd.title;
                    this.desc.text = this.nativeAd.desc;
                    this.contant.skin = this.nativeAd.imgUrl;
                }
            }
            else {
                this.owner.visible = false;
            }
        }
        Click() {
            if (this.nativeAd != null) {
                this.nativeAd.OnClick();
            }
        }
    }

    class ButtonScale extends Laya.Script {
        constructor() {
            super(...arguments);
            this.time = .1;
            this.ratio = 1.04;
            this.startScaleX = 1;
            this.startScaleY = 1;
            this.scaled = false;
        }
        onAwake() {
            this.owner.on(Laya.Event.MOUSE_DOWN, null, () => { this.ScaleBig(); });
            this.owner.on(Laya.Event.MOUSE_UP, null, () => { this.ScaleSmall(); });
            this.owner.on(Laya.Event.MOUSE_OUT, null, () => { this.ScaleSmall(); });
        }
        ScaleBig() {
            if (this.scaled)
                return;
            this.scaled = true;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX * this.ratio, scaleY: this.startScaleY * this.ratio }, this.time * 1000);
        }
        ScaleSmall() {
            if (!this.scaled)
                return;
            this.scaled = false;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX, scaleY: this.startScaleY }, this.time * 1000);
        }
    }

    class Behaviour extends Laya.Script {
        constructor() {
            super(...arguments);
            this.isAwake = false;
            this.isStart = false;
            this.isEnable = false;
            this.isDestroy = false;
        }
        OnAwake() { }
        OnStart() { }
        OnUpdate() { }
        OnEnable() { }
        OnDisable() { }
        OnDestroy() { }
        DoAwake() {
            if (!this.active)
                return;
            if (!this.isAwake) {
                this.isAwake = true;
                this.OnAwake();
            }
        }
        DoStart() {
            if (!this.active)
                return;
            if (!this.isStart) {
                this.isStart = true;
                this.OnStart();
            }
        }
        DoUpdate() {
            if (!this.active)
                return;
            if (this.isStart) {
                this.OnUpdate();
            }
        }
        DoEnable() {
            if (!this.active)
                return;
            if (!this.isEnable) {
                this.isEnable = true;
                this.OnEnable();
            }
        }
        DoDisable() {
            if (this.isEnable) {
                this.isEnable = false;
                this.OnDisable();
            }
        }
        DoDestroy() {
            if (!this.isDestroy) {
                this.isDestroy = true;
                this.OnDestroy();
            }
        }
        onAwake() {
            this.DoAwake();
        }
        onStart() {
            this.DoAwake();
            this.DoStart();
        }
        onUpdate() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
            this.DoUpdate();
        }
        onEnable() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
        }
        onDisable() {
            this.DoDisable();
        }
        onDestroy() {
            this.DoDestroy();
        }
        static SetActive(node, value) {
            if (node == null)
                return;
            node.active = value;
            if (node instanceof Laya.Box) {
                node.visible = value;
            }
        }
        static GetActive(node) {
            if (node == null)
                return false;
            if (!node.active)
                return false;
            if (node instanceof Laya.Box) {
                if (!node.visible)
                    return false;
            }
            return true;
        }
        get active() {
            return Behaviour.GetActive(this.owner);
        }
        set active(value) {
            Behaviour.SetActive(this.owner, value);
            if (value) {
                this.DoEnable();
            }
            else {
                this.DoDisable();
            }
        }
    }

    class PromoItem extends Behaviour {
        constructor() {
            super(...arguments);
            this.bgImage = null;
            this.iconImage = null;
            this.nameText = null;
            this.infoText = null;
            this.flag1 = null;
            this.flag2 = null;
            this.flag3 = null;
            this.nbg = null;
        }
        OnAwake() {
            this.bgImage = this.owner.getChildByName("bg");
            this.iconImage = this.owner.getChildByName("icon");
            if (this.iconImage != null) {
                this.flag1 = this.iconImage.getChildByName("flag1");
                this.flag2 = this.iconImage.getChildByName("flag2");
                this.flag3 = this.iconImage.getChildByName("flag3");
            }
            this.nameText = this.owner.getChildByName("name");
            this.infoText = this.owner.getChildByName("info");
            this.nbg = this.owner.getChildByName("nbg");
        }
        DoLoad() {
            if (this.data == null)
                return;
            if (this.iconImage != null)
                this.iconImage.skin = this.data.icon;
            if (this.nameText != null)
                this.nameText.text = this.data.title;
            if (this.nbg != null)
                this.nbg.skin = "TJ/Promo/image/互推icon底色/" + this.data.titleBG + ".png";
            this.SetFlag();
        }
        SetFlag() {
            if (this.flag1 != null)
                this.flag1.active = this.flag1.visible = false;
            if (this.flag2 != null)
                this.flag2.active = this.flag2.visible = false;
            if (this.flag3 != null)
                this.flag3.active = this.flag3.visible = false;
            switch (this.data.tag) {
                case 1:
                    if (this.flag1 != null)
                        this.flag1.active = this.flag1.visible = true;
                    break;
                case 2:
                    if (this.flag2 != null)
                        this.flag2.active = this.flag2.visible = true;
                    break;
                case 3:
                    if (this.flag3 != null)
                        this.flag3.active = this.flag3.visible = true;
                    break;
            }
        }
        OnShow() {
            this.data.ReportShow();
        }
        OnClick() {
            this.data.Click();
            if (this.onClick_ != null) {
                this.onClick_(this);
            }
        }
        onClick() {
            this.OnClick();
        }
    }

    var GO;
    (function (GO) {
        function Instantiate(node) {
            let comp = Node2Comp(node);
            let gobj = Laya.SceneUtils.createComp(comp);
            return gobj;
        }
        GO.Instantiate = Instantiate;
        function Node2Comp(node) {
            let comp = {};
            comp.type = node.constructor.name;
            comp.props = {};
            if (node.name != null)
                comp.props.name = node.name;
            if (node instanceof Laya.Sprite)
                Props_Sprite(node, comp.props);
            if (node instanceof Laya.Scene)
                Props_Scene(node, comp.props);
            if (node instanceof Laya.UIComponent)
                Props_UIComponent(node, comp.props);
            if (node instanceof Laya.Text) {
                if (node.parent instanceof Laya.Label && node.parent.textField == node) {
                    return null;
                }
                Props_Text(node, comp.props);
            }
            if (node instanceof Laya.Dialog)
                Props_Dialog(node, comp.props);
            if (node instanceof Laya.Clip)
                Props_Clip(node, comp.props);
            if (node instanceof Laya.FontClip)
                Props_FontClip(node, comp.props);
            if (node instanceof Laya.Image)
                Props_Image(node, comp.props);
            if (node instanceof Laya.Button)
                Props_Button(node, comp.props);
            if (node instanceof Laya.ComboBox)
                Props_ComboBox(node, comp.props);
            if (node instanceof Laya.Slider)
                Props_Slider(node, comp.props);
            if (node instanceof Laya.ScrollBar)
                Props_ScrollBar(node, comp.props);
            if (node instanceof Laya.ProgressBar)
                Props_ProgressBar(node, comp.props);
            if (node instanceof Laya.Label)
                Props_Label(node, comp.props);
            if (node instanceof Laya.TextInput)
                Props_TextInput(node, comp.props);
            if (node instanceof Laya.TextArea)
                Props_TextArea(node, comp.props);
            if (node instanceof Laya.ColorPicker)
                Props_ColorPicker(node, comp.props);
            if (node instanceof Laya.Box)
                Props_Box(node, comp.props);
            if (node instanceof Laya.LayoutBox)
                Props_LayoutBox(node, comp.props);
            if (node instanceof Laya.Panel)
                Props_Panel(node, comp.props);
            if (node instanceof Laya.List)
                Props_List(node, comp.props);
            if (node instanceof Laya.Tree)
                Props_Tree(node, comp.props);
            if (node instanceof Laya.ViewStack)
                Props_ViewStack(node, comp.props);
            if (node instanceof Laya.UIGroup)
                Props_UIGroup(node, comp.props);
            if (node instanceof Laya.Tab)
                Props_Tab(node, comp.props);
            comp.child = [];
            for (let i = 0; i < node.numChildren; i++) {
                let cc = Node2Comp(node.getChildAt(i));
                if (cc != null) {
                    comp.child.push(cc);
                }
            }
            if (node instanceof Laya.Sprite)
                Child_Mask(node, comp.child);
            Child_Script(node, comp.child);
            return comp;
        }
        function Child_Script(node, child) {
            let cs = node.getComponents(Laya.Script);
            if (cs != null) {
                for (let c of cs) {
                    child.push({ type: "Script", props: { runtime: c.runtime } });
                }
            }
        }
        function Child_Mask(node, child) {
            if (node.mask != null) {
                child.push(Node2Comp(node.mask));
            }
        }
        function Props_Sprite(node, props) {
            if (!isNaN(node.x))
                props.x = node.x;
            if (!isNaN(node.y))
                props.y = node.y;
            if (!isNaN(node.width))
                props.width = node.width;
            if (!isNaN(node.height))
                props.height = node.height;
            if (node.visible != null)
                props.visible = node.visible;
            if (node.texture != null)
                props.texture = node.texture.url;
            if (node["renderType"] != null)
                props.renderType = node["renderType"];
        }
        function Props_Scene(node, props) {
            if (node.autoDestroyAtClosed != null)
                props.autoDestroyAtClosed = node.autoDestroyAtClosed;
        }
        function Props_UIComponent(node, props) {
            if (!isNaN(node.anchorX))
                props.anchorX = node.anchorX;
            if (!isNaN(node.anchorY))
                props.anchorY = node.anchorY;
            if (!isNaN(node.centerX))
                props.centerX = node.centerX;
            if (!isNaN(node.centerY))
                props.centerY = node.centerY;
            if (!isNaN(node.top))
                props.top = node.top;
            if (!isNaN(node.bottom))
                props.bottom = node.bottom;
            if (!isNaN(node.left))
                props.left = node.left;
            if (!isNaN(node.right))
                props.right = node.right;
        }
        function Props_Text(node, props) {
            if (node.text != null)
                props.text = node.text;
            if (node["runtime"] != null)
                props.runtime = node["runtime"];
        }
        function Props_Dialog(node, props) {
            if (node.group != null)
                props.group = node.group;
            if (node.dragArea != null)
                props.dragArea = node.dragArea;
            if (node.isShowEffect != null)
                props.isShowEffect = node.isShowEffect;
            if (node.isPopupCenter != null)
                props.isPopupCenter = node.isPopupCenter;
            if (node.isModal != null)
                props.isModal = node.isModal;
        }
        function Props_Clip(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.group != null)
                props.group = node.group;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (node.autoPlay != null)
                props.autoPlay = node.autoPlay;
            if (!isNaN(node.index))
                props.index = node.index;
            if (!isNaN(node.clipX))
                props.clipX = node.clipX;
            if (!isNaN(node.clipY))
                props.clipY = node.clipY;
            if (!isNaN(node.clipWidth))
                props.clipWidth = node.clipWidth;
            if (!isNaN(node.clipHeight))
                props.clipHeight = node.clipHeight;
        }
        function Props_FontClip(node, props) {
            if (node.value != null)
                props.value = node.value;
            if (node.sheet != null)
                props.sheet = node.sheet;
            if (node.align != null)
                props.align = node.align;
            if (node.direction != null)
                props.direction = node.direction;
            if (!isNaN(node.spaceX))
                props.spaceX = node.spaceX;
            if (!isNaN(node.spaceY))
                props.spaceY = node.spaceY;
        }
        function Props_Image(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.group != null)
                props.group = node.group;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
        }
        function Props_Button(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.label != null)
                props.label = node.label;
            if (node.toggle != null)
                props.toggle = node.toggle;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (node.selected != null)
                props.selected = node.selected;
            if (node.strokeColors != null)
                props.strokeColors = node.strokeColors;
            if (node.labelStrokeColor != null)
                props.labelStrokeColor = node.labelStrokeColor;
            if (node.labelPadding != null)
                props.labelPadding = node.labelPadding;
            if (node.labelFont != null)
                props.labelFont = node.labelFont;
            if (node.labelColors != null)
                props.labelColors = node.labelColors;
            if (node.labelBold != null)
                props.labelBold = node.labelBold;
            if (node.labelAlign != null)
                props.labelAlign = node.labelAlign;
            if (!isNaN(node.stateNum))
                props.stateNum = node.stateNum;
            if (!isNaN(node.labelSize))
                props.labelSize = node.labelSize;
            if (!isNaN(node.labelStroke))
                props.labelStroke = node.labelStroke;
        }
        function Props_ComboBox(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (node.selectedLabel != null)
                props.selectedLabel = node.selectedLabel;
            if (node.scrollBarSkin != null)
                props.scrollBarSkin = node.scrollBarSkin;
            if (node.labels != null)
                props.labels = node.labels;
            if (node.labelFont != null)
                props.labelFont = node.labelFont;
            if (node.labelBold != null)
                props.labelBold = node.labelBold;
            if (node.labelColors != null)
                props.labelColors = node.labelColors;
            if (node.labelPadding != null)
                props.labelPadding = node.labelPadding;
            if (node.itemColors != null)
                props.itemColors = node.itemColors;
            if (!isNaN(node.itemSize))
                props.itemSize = node.itemSize;
            if (!isNaN(node.labelSize))
                props.labelSize = node.labelSize;
            if (!isNaN(node.stateNum))
                props.stateNum = node.stateNum;
            if (!isNaN(node.visibleNum))
                props.visibleNum = node.visibleNum;
            if (!isNaN(node.selectedIndex))
                props.selectedIndex = node.selectedIndex;
        }
        function Props_Slider(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (node.showLabel != null)
                props.showLabel = node.showLabel;
            if (node.allowClickBack != null)
                props.allowClickBack = node.allowClickBack;
            if (!isNaN(node.value))
                props.value = node.value;
            if (!isNaN(node.tick))
                props.tick = node.tick;
            if (!isNaN(node.min))
                props.min = node.min;
            if (!isNaN(node.max))
                props.max = node.max;
        }
        function Props_ScrollBar(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.hide != null)
                props.hide = node.hide;
            if (node.autoHide != null)
                props.autoHide = node.autoHide;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (node.showButtons != null)
                props.showButtons = node.showButtons;
            if (node.mouseWheelEnable != null)
                props.mouseWheelEnable = node.mouseWheelEnable;
            if (node.touchScrollEnable != null)
                props.touchScrollEnable = node.touchScrollEnable;
            if (!isNaN(node.value))
                props.value = node.value;
            if (!isNaN(node.min))
                props.min = node.min;
            if (!isNaN(node.max))
                props.max = node.max;
            if (!isNaN(node.rollRatio))
                props.rollRatio = node.rollRatio;
            if (!isNaN(node.scrollSize))
                props.scrollSize = node.scrollSize;
            if (!isNaN(node.elasticDistance))
                props.elasticDistance = node.elasticDistance;
            if (!isNaN(node.elasticBackTime))
                props.elasticBackTime = node.elasticBackTime;
        }
        function Props_ProgressBar(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (!isNaN(node.value))
                props.value = node.value;
        }
        function Props_Label(node, props) {
            if (node.text != null)
                props.text = node.text;
            if (node.font != null)
                props.font = node.font;
            if (node.color != null)
                props.color = node.color;
            if (node.align != null)
                props.align = node.align;
            if (node.valign != null)
                props.valign = node.valign;
            if (node.wordWrap != null)
                props.wordWrap = node.wordWrap;
            if (node.underline != null)
                props.underline = node.underline;
            if (node.underlineColor != null)
                props.underlineColor = node.underlineColor;
            if (node.padding != null)
                props.padding = node.padding;
            if (node.overflow != null)
                props.overflow = node.overflow;
            if (node.italic != null)
                props.italic = node.italic;
            if (node.strokeColor != null)
                props.strokeColor = node.strokeColor;
            if (node.borderColor != null)
                props.borderColor = node.borderColor;
            if (node.bold != null)
                props.bold = node.bold;
            if (node.bgColor != null)
                props.bgColor = node.bgColor;
            if (!isNaN(node.leading))
                props.leading = node.leading;
            if (!isNaN(node.fontSize))
                props.fontSize = node.fontSize;
            if (!isNaN(node.stroke))
                props.stroke = node.stroke;
        }
        function Props_TextInput(node, props) {
            if (node.text != null)
                props.text = node.text;
            if (node.skin != null)
                props.skin = node.skin;
            if (node.type != null)
                props.type = node.type;
            if (node.sizeGrid != null)
                props.sizeGrid = node.sizeGrid;
            if (node.restrict != null)
                props.restrict = node.restrict;
            if (node.prompt != null)
                props.prompt = node.prompt;
            if (node.promptColor != null)
                props.promptColor = node.promptColor;
            if (node.multiline != null)
                props.multiline = node.multiline;
            if (node.editable != null)
                props.editable = node.editable;
            if (!isNaN(node.maxChars))
                props.maxChars = node.maxChars;
        }
        function Props_TextArea(node, props) {
            if (node.vScrollBarSkin != null)
                props.vScrollBarSkin = node.vScrollBarSkin;
            if (node.hScrollBarSkin != null)
                props.hScrollBarSkin = node.hScrollBarSkin;
        }
        function Props_ColorPicker(node, props) {
            if (node.selectedColor != null)
                props.selectedColor = node.selectedColor;
            if (node.inputColor != null)
                props.inputColor = node.inputColor;
            if (node.inputBgColor != null)
                props.inputBgColor = node.inputBgColor;
            if (node.borderColor != null)
                props.borderColor = node.borderColor;
            if (node.bgColor != null)
                props.bgColor = node.bgColor;
        }
        function Props_Box(node, props) {
            if (node.bgColor != null)
                props.bgColor = node.bgColor;
        }
        function Props_LayoutBox(node, props) {
            if (node.align != null)
                props.align = node.align;
            if (!isNaN(node.space))
                props.space = node.space;
        }
        function Props_Panel(node, props) {
            if (node.elasticEnabled != null)
                props.elasticEnabled = node.elasticEnabled;
            if (node.hScrollBarSkin != null)
                props.hScrollBarSkin = node.hScrollBarSkin;
            if (node.vScrollBarSkin != null)
                props.vScrollBarSkin = node.vScrollBarSkin;
        }
        function Props_List(node, props) {
            if (!isNaN(node.width))
                props.width = node.width;
            if (!isNaN(node.height))
                props.height = node.height;
            if (!isNaN(node.spaceX))
                props.spaceX = node.spaceX;
            if (!isNaN(node.spaceY))
                props.spaceY = node.spaceY;
            if (!isNaN(node.repeatX))
                props.repeatX = node.repeatX;
            if (!isNaN(node.repeatY))
                props.repeatY = node.repeatY;
            if (!isNaN(node.selectedIndex))
                props.selectedIndex = node.selectedIndex;
            if (node.selectEnable != null)
                props.selectEnable = node.selectEnable;
            if (node.elasticEnabled != null)
                props.elasticEnabled = node.elasticEnabled;
            if (node.hScrollBarSkin != null)
                props.hScrollBarSkin = node.hScrollBarSkin;
            if (node.vScrollBarSkin != null)
                props.vScrollBarSkin = node.vScrollBarSkin;
        }
        function Props_Tree(node, props) {
            if (!isNaN(node.width))
                props.width = node.width;
            if (!isNaN(node.height))
                props.height = node.height;
            if (!isNaN(node.spaceLeft))
                props.spaceLeft = node.spaceLeft;
            if (!isNaN(node.spaceBottom))
                props.spaceBottom = node.spaceBottom;
            if (!isNaN(node.selectedIndex))
                props.selectedIndex = node.selectedIndex;
            if (node.scrollBarSkin != null)
                props.scrollBarSkin = node.scrollBarSkin;
            if (node.keepStatus != null)
                props.keepStatus = node.keepStatus;
        }
        function Props_ViewStack(node, props) {
            if (!isNaN(node.selectedIndex))
                props.selectedIndex = node.selectedIndex;
        }
        function Props_UIGroup(node, props) {
            if (node.skin != null)
                props.skin = node.skin;
            if (node.labels != null)
                props.labels = node.labels;
            if (node.labelStrokeColor != null)
                props.labelStrokeColor = node.labelStrokeColor;
            if (node.labelPadding != null)
                props.labelPadding = node.labelPadding;
            if (node.labelFont != null)
                props.labelFont = node.labelFont;
            if (node.labelColors != null)
                props.labelColors = node.labelColors;
            if (node.labelBold != null)
                props.labelBold = node.labelBold;
            if (node.strokeColors != null)
                props.strokeColors = node.strokeColors;
            if (node.direction != null)
                props.direction = node.direction;
            if (!isNaN(node.space))
                props.space = node.space;
            if (!isNaN(node.stateNum))
                props.stateNum = node.stateNum;
            if (!isNaN(node.selectedIndex))
                props.selectedIndex = node.selectedIndex;
            if (!isNaN(node.labelStroke))
                props.labelStroke = node.labelStroke;
            if (!isNaN(node.labelSize))
                props.labelSize = node.labelSize;
        }
        function Props_Tab(node, props) {
            if (node["labelAlign"] != null)
                props.labelAlign = node["labelAlign"];
        }
    })(GO || (GO = {}));

    class P405 extends Behaviour {
        constructor() {
            super(...arguments);
            this.scroll = null;
            this.layout = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.move = null;
            this.show = null;
            this.hide = null;
            this.maxX = 560;
            this.mouseDown = false;
            this.lastStageX = 0;
            this.lastStageY = 0;
            this.targetX = 0;
            this.showing = [];
        }
        async OnAwake() {
            this.shield = TJ.Develop.Yun.Location.shield;
            this.move = this.owner.getChildByName("move");
            let button = this.move.getChildByName("button");
            this.show = button.getChildByName("show");
            this.hide = button.getChildByName("hide");
            let board = this.move.getChildByName("board");
            this.scroll = board.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            TJ.Develop.Yun.Promo.Data.ReportAwake(P405.style);
            this.show.clickHandler = new Laya.Handler(null, () => { this.Show(); });
            this.hide.clickHandler = new Laya.Handler(null, () => { this.Hide(); });
            this.layoutS = this.layout.addComponent(P405Layout);
            if (this.show.parent.scaleX < 0)
                this.maxX = -this.maxX;
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                return;
            }
            this.active = false;
            let list = await TJ.Develop.Yun.Promo.List.Get();
            if (list.count > 0) {
                if (this.layoutS != null) {
                    if (this.shield) {
                        for (let i = 0; i < Math.min(list.count, 5); i++) {
                            this.layoutS.datas.push(list.Load());
                        }
                    }
                    else {
                        for (let i = 0; i < list.count; i++) {
                            this.layoutS.datas.push(list.Load());
                        }
                    }
                    this.layoutS.Init(this.scroll.width, this.scroll.height, this.shield);
                    this.active = true;
                    TJ.Develop.Yun.Promo.Data.ReportStart(P405.style);
                }
                else {
                }
            }
            else {
            }
        }
        OnStart() {
            if (this.shield)
                return;
            this.scroll.on(Laya.Event.MOUSE_DOWN, null, (event) => {
                this.mouseDown = true;
                this.lastStageX = event.stageX;
                this.lastStageY = event.stageY;
            });
            this.scroll.on(Laya.Event.MOUSE_OUT, null, (event) => {
                this.mouseDown = false;
            });
            this.scroll.on(Laya.Event.MOUSE_UP, null, (event) => {
                this.mouseDown = false;
            });
            this.scroll.on(Laya.Event.MOUSE_MOVE, null, (event) => {
                if (this.mouseDown) {
                    let dx = event.stageX - this.lastStageX;
                    let dy = event.stageY - this.lastStageY;
                    this.lastStageX = event.stageX;
                    this.lastStageY = event.stageY;
                    let ty = this.layoutS.node.y + dy;
                    this.layoutS.node.y = ty;
                }
            });
        }
        Show() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                let param = new TJ.API.Promo.Param();
                param.extraData = { "TJ_App": TJ.API.AppInfo.AppGuid() };
                TJ.API.Promo.Pop(param);
                return;
            }
            this.targetX = this.maxX;
            this.show.active = this.show.visible = false;
            this.hide.active = this.hide.visible = true;
            this.layout.y = 0;
        }
        Hide() {
            this.targetX = 0;
            this.showing = [];
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.move.centerX != this.targetX) {
                let d = this.targetX - this.move.centerX;
                let s = 3000 * deltaTime;
                if (d > 0) {
                    d = Math.min(this.move.centerX + s, this.targetX);
                }
                else {
                    d = Math.max(this.move.centerX - s, this.targetX);
                }
                this.move.centerX = d;
                if (this.move.centerX == 0) {
                    this.show.active = this.show.visible = true;
                    this.hide.active = this.hide.visible = false;
                    if (this.shield) {
                        window.setTimeout(async () => {
                            let list = await TJ.Develop.Yun.Promo.List.Get();
                            if (list != null && list.count > 0) {
                                this.layoutS.datas = [];
                                for (let i = 0; i < Math.min(list.count, 5); i++) {
                                    this.layoutS.datas.push(list.Load());
                                }
                                this.layoutS.Redata();
                            }
                        }, 0);
                    }
                }
            }
            else {
                if (this.shield)
                    return;
                if (this.move.centerX == this.maxX) {
                    this.layout.y -= 0.8;
                }
            }
            if (this.shield)
                return;
            this.layoutS.Repos(this.layout.y);
        }
    }
    P405.style = "P405";
    class P405Layout extends Behaviour {
        constructor() {
            super(...arguments);
            this.datas = [];
            this.items = [];
            this.prefab = null;
            this.line = 0;
            this.column = 0;
            this.spacingX = 12;
            this.spacingY = 12;
        }
        get node() {
            return this.owner;
        }
        OnAwake() {
            this.prefab = this.node.getChildAt(0);
            this.prefab.active = this.prefab.visible = false;
        }
        Init(width, height, shield) {
            while (width >= this.prefab.width) {
                width = width - this.prefab.width - this.spacingX;
                this.column++;
            }
            while (height >= this.prefab.height) {
                height = height - this.prefab.height - this.spacingY;
                this.line++;
            }
            if (shield) {
                let uw = this.prefab.width;
                let uh = this.prefab.height;
                let spaceX = uw + this.spacingX;
                let spaceY = uh + this.spacingY;
                for (let y = 0; y < this.line; y++) {
                    for (let x = 0; x < this.column; x++) {
                        if (this.items.length < this.datas.length) {
                            let item = GO.Instantiate(this.prefab).getComponent(PromoItem);
                            this.node.addChild(item.owner);
                            item.owner.active = item.owner.visible = true;
                            this.items.push(item);
                            item.owner.x = x * spaceX + uw / 2;
                            item.owner.y = spaceY * y + uh / 2;
                            item.onAwake();
                        }
                    }
                }
                this.Redata();
            }
            else {
                this.line += 2;
                for (let y = 0; y < this.line; y++) {
                    for (let x = 0; x < this.column; x++) {
                        let item = GO.Instantiate(this.prefab).getComponent(PromoItem);
                        this.node.addChild(item.owner);
                        item.owner.active = item.owner.visible = true;
                        this.items.push(item);
                        item.onAwake();
                    }
                }
            }
        }
        Redata() {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                item.data = this.datas[i];
                item.data.Load();
                item.DoLoad();
            }
        }
        Repos(posY) {
            let ic = this.items.length;
            let dc = this.datas.length;
            if (ic < 1)
                return;
            if (dc < 1)
                return;
            let uw = this.prefab.width;
            let uh = this.prefab.height;
            let spaceX = uw + this.spacingX;
            let spaceY = uh + this.spacingY;
            let k = -posY / spaceY;
            k = Math.floor(k);
            let k1 = Math.floor(k / this.line) * this.line, k2 = k < 0 ? (this.line + k % this.line) % this.line : (k % this.line);
            let checkPos = (item, b, l, c) => {
                let pid = b + l * this.column + c;
                if (item.posId != pid) {
                    item.posId = pid;
                    item.owner.x = spaceX * c + uw / 2;
                    item.owner.y = (b + l) * spaceY + uh / 2;
                    let did = pid < 0 ? (dc + pid % dc) % dc : (pid % dc);
                    if (item.dataId != did) {
                        item.dataId = did;
                        item.data = this.datas[did];
                        item.data.Load();
                        item.DoLoad();
                    }
                }
            };
            for (let l = 0; l < k2; l++) {
                for (let c = 0; c < this.column; c++) {
                    checkPos(this.items[l * this.column + c], k1 + this.line, l, c);
                }
            }
            for (let l = k2; l < this.line; l++) {
                for (let c = 0; c < this.column; c++) {
                    checkPos(this.items[l * this.column + c], k1, l, c);
                }
            }
        }
    }

    class P201 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoItem = null;
            this.shake = false;
            this.animTime = 0;
            this.refrTime = 0;
        }
        async OnAwake() {
            this.promoItem = this.owner.getComponent(PromoItem);
            TJ.Develop.Yun.Promo.Data.ReportAwake(P201.style);
            this.promoItem.style = P201.style;
            this.active = false;
            if (P201.promoList == null) {
                let list = await TJ.Develop.Yun.Promo.List.Get(P201.style);
                if (P201.promoList == null)
                    P201.promoList = list;
            }
            if (P201.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P201.style);
                this.active = true;
            }
            else {
            }
        }
        OnEnable() {
            this.LoadAndShowIcon();
        }
        OnDisable() {
            if (P201.promoList != null) {
                P201.promoList.Unload(this.promoItem.data);
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            this.refrTime += deltaTime;
            if (this.refrTime > 5) {
                this.refrTime -= 5;
                this.LoadAndShowIcon();
            }
            if (!this.shake)
                return;
            this.animTime += deltaTime;
            this.animTime %= 2.5;
            if (this.animTime <= .75) {
                this.promoItem.owner.rotation = Math.sin(this.animTime * 6 * Math.PI) * 25 * (1 - this.animTime / .75);
            }
            else {
                this.promoItem.owner.rotation = 0;
            }
        }
        LoadIcon() {
            let data = P201.promoList.Load();
            if (data != null) {
                P201.promoList.Unload(this.promoItem.data);
                this.promoItem.data = data;
                this.promoItem.onClick_ = () => { this.LoadAndShowIcon(); };
                this.promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon() {
            if (this.LoadIcon() != null) {
                this.promoItem.OnShow();
            }
            else {
                if (this.promoItem.data == null) {
                    this.owner.destroy();
                }
            }
        }
    }
    P201.style = "P201";
    P201.promoList = null;

    var Lwg;
    (function (Lwg) {
        let PlatformAdmin;
        (function (PlatformAdmin) {
            PlatformAdmin._Tpye = {
                Bytedance: 'Bytedance',
                WeChat: 'WeChat',
                OPPO: 'OPPO',
                OPPOTest: 'OPPOTest',
                VIVO: 'VIVO',
                General: 'General',
                Web: 'Web',
                WebTest: 'WebTest',
                Research: 'Research',
            };
            PlatformAdmin._Ues = {
                get value() {
                    return this['_platform/name'] ? this['_platform/name'] : null;
                },
                set value(val) {
                    this['_platform/name'] = val;
                    switch (val) {
                        case PlatformAdmin._Tpye.WebTest:
                            Laya.LocalStorage.clear();
                            GoldAdmin._num.value = 5000;
                            break;
                        case PlatformAdmin._Tpye.Research:
                            GoldAdmin._num.value = 50000000000000;
                            break;
                        default:
                            break;
                    }
                }
            };
        })(PlatformAdmin = Lwg.PlatformAdmin || (Lwg.PlatformAdmin = {}));
        let GameAdmin;
        (function (GameAdmin) {
            GameAdmin._switch = true;
            GameAdmin.pause = {
                get value() {
                    return GameAdmin._switch;
                },
                set value(bool) {
                    if (bool) {
                        GameAdmin._switch = false;
                        TimerAdmin._switch = false;
                        LwgClick._filter.value = LwgClick._filterType.all;
                    }
                    else {
                        GameAdmin._switch = true;
                        TimerAdmin._switch = true;
                        LwgClick._filter.value = LwgClick._filterType.none;
                    }
                }
            };
            GameAdmin.level = {
                get value() {
                    return Laya.LocalStorage.getItem('_Game/Level') ? Number(Laya.LocalStorage.getItem('_Game/Level')) : 1;
                },
                set value(val) {
                    let diff = val - this.level;
                    if (diff > 0) {
                        this.maxLevel += diff;
                    }
                    if (val > this.loopLevel && this.loopLevel != -1) {
                        Laya.LocalStorage.setItem('_Game/Level', (1).toString());
                    }
                    else {
                        Laya.LocalStorage.setItem('_Game/Level', (val).toString());
                    }
                }
            };
            GameAdmin.maxLevel = {
                get value() {
                    return Laya.LocalStorage.getItem('_Game/maxLevel') ? Number(Laya.LocalStorage.getItem('_Game/maxLevel')) : this.level;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('_Game/maxLevel', val.toString());
                }
            };
            GameAdmin.loopLevel = {
                get value() {
                    return this['_Game/loopLevel'] ? this['_Game/loopLevel'] : -1;
                },
                set value(val) {
                    this['_Game/loopLevel'] = val;
                }
            };
            function _createLevel(parent, x, y) {
                let sp;
                Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab) {
                    const _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    const level = sp.getChildByName('level');
                    this.LevelNode = sp;
                }));
            }
            GameAdmin._createLevel = _createLevel;
            ;
        })(GameAdmin = Lwg.GameAdmin || (Lwg.GameAdmin = {}));
        let SceneAdmin;
        (function (SceneAdmin) {
            SceneAdmin._SceneControl = {};
            SceneAdmin._SceneScript = {};
            class _BaseName {
            }
            _BaseName.LwgInit = 'LwgInit';
            _BaseName.PreLoad = 'PreLoad';
            _BaseName.PreLoadCutIn = 'PreLoadCutIn';
            _BaseName.Guide = 'Guide';
            _BaseName.Start = 'Start';
            _BaseName.SelectLevel = 'SelectLevel';
            _BaseName.Settle = 'Settle';
            _BaseName.Victory = 'Victory';
            _BaseName.Defeated = 'Defeated';
            _BaseName.Share = 'Share';
            _BaseName.CheckIn = 'CheckIn';
            _BaseName.Ranking = 'Ranking';
            _BaseName.Set = 'Set';
            _BaseName.Shop = 'Shop';
            _BaseName.Task = 'Task';
            SceneAdmin._BaseName = _BaseName;
            function _sceneZOderUp(upScene) {
                let num = 0;
                for (const key in SceneAdmin._SceneControl) {
                    if (Object.prototype.hasOwnProperty.call(SceneAdmin._SceneControl, key)) {
                        const Scene = SceneAdmin._SceneControl[key];
                        if (Scene.parent) {
                            Scene.zOrder = 0;
                            num++;
                        }
                    }
                }
                if (upScene) {
                    upScene.zOrder = num;
                }
            }
            SceneAdmin._sceneZOderUp = _sceneZOderUp;
            function _addToStage(_openScene, _openZOder) {
                if (_openScene) {
                    if (_openZOder) {
                        Laya.stage.addChildAt(_openScene, _openZOder);
                    }
                    else {
                        Laya.stage.addChild(_openScene);
                    }
                    if (SceneAdmin._SceneScript[_openScene.name]) {
                        if (!_openScene.getComponent(SceneAdmin._SceneScript[_openScene.name])) {
                            _openScene.addComponent(SceneAdmin._SceneScript[_openScene.name]);
                        }
                    }
                    else {
                        console.log(`${_openScene.name}场景没有同名脚本！,需在LwgInit脚本中导入该脚本！`);
                    }
                }
            }
            SceneAdmin._addToStage = _addToStage;
            ;
            function _aniFlow(_openScene, _closeScene, _openFunc, _closeFunc) {
                let closeAniTime = 0;
                let closeScript;
                if (_closeScene) {
                    _sceneZOderUp(_closeScene);
                    closeScript = _closeScene[_closeScene.name];
                    closeAniTime = closeScript.lwgCloseAni();
                    if (closeAniTime === null) {
                        if (SceneAniAdmin._closeSwitch.value) {
                            closeAniTime = SceneAniAdmin._commonCloseAni(_closeScene);
                        }
                    }
                }
                Laya.timer.once(closeAniTime, this, () => {
                    if (_closeScene) {
                        closeScript && closeScript.lwgBeforeCloseAni();
                        _closeScene.close();
                        _closeFunc && _closeFunc();
                    }
                    ClickAdmin._filter.value = ClickAdmin._filterType.all;
                    if (_openScene) {
                        ClickAdmin._filter.value = ClickAdmin._filterType.none;
                        _sceneZOderUp(_openScene);
                        const openScript = _openScene[_openScene.name];
                        let openAniTime = openScript.lwgOpenAni();
                        if (openAniTime === null) {
                            if (SceneAniAdmin._openSwitch.value) {
                                openAniTime = SceneAniAdmin._commonOpenAni(_openScene);
                            }
                            else {
                                openAniTime = 0;
                            }
                        }
                        Laya.timer.once(openAniTime, this, () => {
                            openScript.lwgOpenAniAfter();
                            openScript.lwgButton();
                            _openFunc && _openFunc();
                            ClickAdmin._filter.value = ClickAdmin._filterType.all;
                        });
                    }
                });
            }
            SceneAdmin._aniFlow = _aniFlow;
            SceneAdmin._PreLoadCutIn = {
                openName: null,
                closeName: null,
            };
            function _preLoadOpenScene(openName, closeName, func, zOrder) {
                SceneAdmin._PreLoadCutIn.openName = openName;
                SceneAdmin._PreLoadCutIn.closeName = closeName;
                _openScene(_BaseName.PreLoadCutIn, closeName, func, zOrder);
            }
            SceneAdmin._preLoadOpenScene = _preLoadOpenScene;
            function _openScene(openName, closeName, openfunc, zOrder) {
                LwgClick._filter.value = LwgClick._filterType.none;
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    let openScene = ToolsAdmin._Node.checkChildren(Laya.stage, openName);
                    if (openScene) {
                        openScene.close();
                        console.log(`场景${openName}重复出现！前一个场景被关闭！`);
                    }
                    openScene = SceneAdmin._SceneControl[scene.name = openName] = scene;
                    _addToStage(openScene, zOrder);
                    _aniFlow(openScene, SceneAdmin._SceneControl[closeName], openfunc, null);
                }));
            }
            SceneAdmin._openScene = _openScene;
            function _closeScene(closeName, closefunc) {
                const closeScene = SceneAdmin._SceneControl[closeName];
                if (!closeScene) {
                    console.log(`场景${closeName}关闭失败，可能不存在！`);
                    return;
                }
                _aniFlow(null, closeScene, null, closefunc);
            }
            SceneAdmin._closeScene = _closeScene;
            class _ScriptBase extends Laya.Script {
                constructor() {
                    super(...arguments);
                    this.ownerSceneName = '';
                }
                getFind(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        let Node = ToolsAdmin._Node.findChild2D(this.owner.scene, name);
                        if (Node) {
                            NodeAdmin._addProperty(Node);
                            return this[`_Scene${type}${name}`] = Node;
                        }
                        else {
                            console.log(`场景内不存在节点${name}`);
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _FindImg(name) {
                    return this.getFind(name, '_FindImg');
                }
                _FindSp(name) {
                    return this.getFind(name, '_FindSp');
                }
                _FindBox(name) {
                    return this.getFind(name, '_FindBox');
                }
                _FindTap(name) {
                    return this.getFind(name, '_FindTap');
                }
                _FindLabel(name) {
                    return this.getFind(name, '_FindLabel');
                }
                _FindList(name) {
                    return this.getFind(name, '_FindList');
                }
                _storeNum(name, _func, initial) {
                    return StorageAdmin._num(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeStr(name, _func, initial) {
                    return StorageAdmin._str(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeBool(name, _func, initial) {
                    return StorageAdmin._bool(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeArray(name, _func, initial) {
                    return StorageAdmin._array(`${this.owner.name}/${name}`, _func, initial);
                }
                lwgOnAwake() { }
                ;
                lwgAdaptive() { }
                ;
                lwgEvent() { }
                ;
                _evReg(name, func) {
                    EventAdmin._register(name, this, func);
                }
                _evRegOne(name, func) {
                    EventAdmin._registerOnce(name, this, func);
                }
                _evNotify(name, args) {
                    EventAdmin._notify(name, args);
                }
                lwgOnEnable() { }
                lwgOnStart() { }
                lwgButton() { }
                ;
                checkBtnClick(target, clickFunc, e) {
                    if (ClickAdmin._absolute) {
                        switch (ClickAdmin._filter.value) {
                            case ClickAdmin._filterType.all || ClickAdmin._filterType.button:
                                clickFunc && clickFunc(e);
                                break;
                            case ClickAdmin._filterType.someBtnIncludeStage || ClickAdmin._filterType.someBtnExcludeStage:
                                ClickAdmin._checkTarget(target.name) && clickFunc && clickFunc(e);
                                break;
                            default:
                                break;
                        }
                    }
                }
                _btnDown(target, down, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, (e) => {
                        this.checkBtnClick(target, down, e);
                    }, null, null, null);
                }
                _btnMove(target, move, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, null, (e) => {
                        this.checkBtnClick(target, move, e);
                    }, null, null);
                }
                _btnUp(target, up, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, null, null, (e) => {
                        this.checkBtnClick(target, up, e);
                    }, null);
                }
                _btnOut(target, out, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, null, null, null, (e) => {
                        this.checkBtnClick(target, out, e);
                    });
                }
                _btnFour(target, down, move, up, out, effect) {
                    LwgClick._on(effect == null ? effect : LwgClick._Use.value, target, this, (e) => {
                        this.checkBtnClick(target, down, e);
                    }, (e) => {
                        this.checkBtnClick(target, move, e);
                    }, (e) => {
                        this.checkBtnClick(target, up, e);
                    }, (e) => {
                        this.checkBtnClick(target, out, e);
                    });
                }
                _openScene(openName, closeSelf, preLoadCutIn, func, zOrder) {
                    let closeName;
                    if (closeSelf == undefined || closeSelf == true) {
                        closeName = this.ownerSceneName;
                    }
                    if (!preLoadCutIn) {
                        LwgScene._openScene(openName, closeName, func, zOrder);
                    }
                    else {
                        LwgScene._preLoadOpenScene(openName, closeName, func, zOrder);
                    }
                }
                _closeScene(sceneName = this.ownerSceneName, func) {
                    if (sceneName !== this.ownerSceneName) {
                        const scene = LwgScene._SceneControl[sceneName];
                        const scirpt = scene[sceneName];
                        const time = scirpt.lwgCloseAni();
                        Laya.timer.once(time ? time : 0, this, () => {
                            scene.close();
                        });
                    }
                    else {
                        LwgScene._closeScene(this.ownerSceneName, func);
                    }
                }
                lwgOnUpdate() { }
                ;
                lwgOnDisable() { }
                ;
                onStageMouseDown(e) { ClickAdmin._checkStage() && this.lwgOnStageDown(e); }
                ;
                onStageMouseMove(e) { ClickAdmin._checkStage() && this.lwgOnStageMove(e); }
                ;
                onStageMouseUp(e) { ClickAdmin._checkStage() && this.lwgOnStageUp(e); }
                ;
                lwgOnStageDown(e) { }
                ;
                lwgOnStageMove(e) { }
                ;
                lwgOnStageUp(e) { }
                ;
            }
            SceneAdmin._ScriptBase = _ScriptBase;
            class _SceneBase extends _ScriptBase {
                constructor() {
                    super();
                }
                get _Owner() {
                    return this.owner;
                }
                getVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Owner[name]) {
                            NodeAdmin._addProperty(this._Owner[name]);
                            return this[`_Scene${type}${name}`] = this._Owner[name];
                        }
                        else {
                            console.log('场景内不存在var节点：', name);
                            return undefined;
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _SpriteVar(name) {
                    return this.getVar(name, '_SpriteVar');
                }
                _AniVar(name) {
                    return this.getVar(name, '_AniVar');
                }
                _BtnVar(name) {
                    return this.getVar(name, '_BtnVar');
                }
                _BoxVar(name) {
                    return this.getVar(name, '_BoxVar');
                }
                _ImgVar(name) {
                    return this.getVar(name, '_ImgVar');
                }
                _LabelVar(name) {
                    return this.getVar(name, '_LabelVar');
                }
                _ListVar(name) {
                    return this.getVar(name, '_ListVar');
                }
                _TapVar(name) {
                    return this.getVar(name, '_TapVar');
                }
                _TextVar(name) {
                    return this.getVar(name, '_TextVar');
                }
                _TextInputVar(name) {
                    return this.getVar(name, '_TextInputVar');
                }
                _FontClipVar(name) {
                    return this.getVar(name, '_FontClipVar');
                }
                _FontBox(name) {
                    return this.getVar(name, '_FontBox');
                }
                _FontTextInput(name) {
                    return this.getVar(name, '_FontInput');
                }
                onAwake() {
                    this._Owner.width = Laya.stage.width;
                    this._Owner.height = Laya.stage.height;
                    if (this._Owner.getChildByName('Background')) {
                        this._Owner.getChildByName('Background')['width'] = Laya.stage.width;
                        this._Owner.getChildByName('Background')['height'] = Laya.stage.height;
                    }
                    if (!this._Owner.name) {
                        console.log('场景名称失效，脚本赋值失败');
                    }
                    else {
                        this.ownerSceneName = this._Owner.name;
                        this._Owner[this._Owner.name] = this;
                    }
                    this.moduleOnAwake();
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                moduleOnAwake() { }
                onEnable() {
                    this.moduleEvent();
                    this.lwgEvent();
                    this.moduleOnEnable();
                    this.lwgOnEnable();
                }
                moduleOnEnable() { }
                ;
                moduleEvent() { }
                ;
                onStart() {
                    this.moduleOnStart();
                    this.lwgOnStart();
                }
                moduleOnStart() { }
                ;
                lwgOpenAni() { return null; }
                ;
                lwgOpenAniAfter() { }
                ;
                _adaHeight(arr) {
                    LwgAdaptive._stageHeight(arr);
                }
                ;
                _adaWidth(arr) {
                    LwgAdaptive._stageWidth(arr);
                }
                ;
                _adaptiveCenter(arr) {
                    LwgAdaptive._center(arr, Laya.stage);
                }
                ;
                onUpdate() { this.lwgOnUpdate(); }
                ;
                lwgBeforeCloseAni() { }
                lwgCloseAni() { return null; }
                ;
                onDisable() {
                    Laya.Tween.clearAll(this);
                    Laya.Tween.clearAll(this._Owner);
                    Laya.timer.clearAll(this);
                    Laya.timer.clearAll(this._Owner);
                    EventAdmin._offCaller(this);
                    EventAdmin._offCaller(this._Owner);
                    this.lwgOnDisable();
                }
            }
            SceneAdmin._SceneBase = _SceneBase;
            class _ObjectBase extends _ScriptBase {
                constructor() {
                    super();
                }
                _ownerDestroy() {
                    this._Owner.destroy();
                    this.clear();
                }
                get _Owner() {
                    return this.owner;
                }
                get _point() {
                    return new Laya.Point(this._Owner.x, this._Owner.y);
                }
                get _Scene() {
                    return this.owner.scene;
                }
                get _Parent() {
                    if (this._Owner.parent) {
                        return this.owner.parent;
                    }
                }
                get _RigidBody() {
                    if (!this._Owner['_OwnerRigidBody']) {
                        this._Owner['_OwnerRigidBody'] = this._Owner.getComponent(Laya.RigidBody);
                    }
                    return this._Owner['_OwnerRigidBody'];
                }
                get _BoxCollier() {
                    if (!this._Owner['_OwnerBoxCollier']) {
                        this._Owner['_OwnerBoxCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerBoxCollier'];
                }
                get _CilrcleCollier() {
                    if (!this._Owner['_OwnerCilrcleCollier']) {
                        return this._Owner['_OwnerCilrcleCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerCilrcleCollier'];
                }
                get _PolygonCollier() {
                    if (!this._Owner['_OwnerPolygonCollier']) {
                        return this._Owner['_OwnerPolygonCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerPolygonCollier'];
                }
                getSceneVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Scene[name].parent) {
                            NodeAdmin._addProperty(this._Scene[name]);
                            return this[`_Scene${type}${name}`] = this._Scene[name];
                        }
                        else {
                            console.log(`场景内不存在var节点${name}`);
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _SceneSprite(name) {
                    return this.getSceneVar(name, '_SceneSprite');
                }
                _SceneAni(name) {
                    return this.getSceneVar(name, '_SceneAni');
                }
                _SceneImg(name) {
                    return this.getSceneVar(name, '_SceneImg');
                }
                _SceneLabel(name) {
                    return this.getSceneVar(name, '_SceneLabel');
                }
                _SceneList(name) {
                    return this.getSceneVar(name, '_SceneList');
                }
                _SceneTap(name) {
                    return this.getSceneVar(name, '_SceneTap');
                }
                _SceneText(name) {
                    return this.getSceneVar(name, '_SceneText');
                }
                _SceneFontClip(name) {
                    return this.getSceneVar(name, '_SceneFontClip');
                }
                _SceneBox(name) {
                    return this.getSceneVar(name, '_SceneBox');
                }
                getChild(name, type) {
                    if (!this[`${type}${name}`]) {
                        const child = this._Owner.getChildByName(name);
                        if (child) {
                            NodeAdmin._addProperty(child);
                            return this[`${type}${name}`] = child;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return this[`${type}${name}`];
                    }
                }
                _ImgChild(name) {
                    return this.getChild(name, '_ImgChild');
                }
                _BoxChild(name) {
                    return this.getChild(name, '_ImgBox');
                }
                _SpriteChild(name) {
                    return this.getChild(name, '_SpriteChild');
                }
                _LableChild(name) {
                    return this.getChild(name, '_LableChild');
                }
                _ListChild(name) {
                    return this.getChild(name, '_ListChild');
                }
                _TapChild(name) {
                    return this.getChild(name, '_TapChild');
                }
                _TapBox(name) {
                    return this.getChild(name, '_TapBox');
                }
                _TapFontClip(name) {
                    return this.getChild(name, '_TapFontClip');
                }
                onAwake() {
                    NodeAdmin._addProperty(this._Owner);
                    this._Owner[this._Owner.name] = this;
                    this.ownerSceneName = this._Scene.name;
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                onEnable() {
                    this.lwgButton();
                    this.lwgEvent();
                    this.lwgOnEnable();
                }
                onStart() {
                    this.lwgOnStart();
                }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                clear() {
                    Laya.Tween.clearAll(this);
                    Laya.Tween.clearAll(this._Owner);
                    Laya.timer.clearAll(this);
                    Laya.timer.clearAll(this._Owner);
                    EventAdmin._offCaller(this);
                    EventAdmin._offCaller(this._Owner);
                }
                onDisable() {
                    this.clear();
                    this.lwgOnDisable();
                }
            }
            SceneAdmin._ObjectBase = _ObjectBase;
        })(SceneAdmin = Lwg.SceneAdmin || (Lwg.SceneAdmin = {}));
        let NodeAdmin;
        (function (NodeAdmin) {
            class _Sprite extends Laya.Sprite {
            }
            NodeAdmin._Sprite = _Sprite;
            class _Image extends Laya.Image {
            }
            NodeAdmin._Image = _Image;
            class _Box extends Laya.Box {
            }
            NodeAdmin._Box = _Box;
            function _addProperty(node, nodeType) {
                if (!node)
                    return;
                let _proType;
                switch (nodeType) {
                    case 'Img':
                        _proType;
                        break;
                    case 'box':
                        _proType;
                        break;
                    default:
                        _proType;
                        break;
                }
                var getGPoint = () => {
                    if (node.parent) {
                        return node.parent.localToGlobal(new Laya.Point(node.x, node.y));
                    }
                    else {
                        return null;
                    }
                };
                const _fPoint = new Laya.Point(node.x, node.y);
                const _fGPoint = getGPoint();
                const _fRotation = node.rotation;
                _proType = {
                    get gPoint() {
                        return getGPoint();
                    },
                    fPoint: _fPoint,
                    fGPoint: _fGPoint,
                    fRotation: _fRotation,
                };
                node['_lwg'] = _proType;
            }
            NodeAdmin._addProperty = _addProperty;
        })(NodeAdmin = Lwg.NodeAdmin || (Lwg.NodeAdmin = {}));
        let Dialogue;
        (function (Dialogue) {
            let Skin;
            (function (Skin) {
                Skin["blackBord"] = "Lwg/UI/ui_orthogon_black_0.7.png";
            })(Skin || (Skin = {}));
            function _middleHint(describe) {
                const Hint_M = Laya.Pool.getItemByClass('Hint_M', Laya.Sprite);
                Hint_M.name = 'Hint_M';
                Laya.stage.addChild(Hint_M);
                Hint_M.width = Laya.stage.width;
                Hint_M.height = 100;
                Hint_M.pivotY = Hint_M.height / 2;
                Hint_M.pivotX = Laya.stage.width / 2;
                Hint_M.x = Laya.stage.width / 2;
                Hint_M.y = Laya.stage.height / 2;
                Hint_M.zOrder = 100;
                const Pic = new Laya.Image();
                Hint_M.addChild(Pic);
                Pic.skin = Skin.blackBord;
                Pic.width = Laya.stage.width;
                Pic.pivotX = Laya.stage.width / 2;
                Pic.height = 100;
                Pic.pivotY = Pic.height / 2;
                Pic.y = Hint_M.height / 2;
                Pic.x = Laya.stage.width / 2;
                Pic.alpha = 0.6;
                const Dec = new Laya.Label();
                Hint_M.addChild(Dec);
                Dec.width = Laya.stage.width;
                Dec.text = describe;
                Dec.pivotX = Laya.stage.width / 2;
                Dec.x = Laya.stage.width / 2;
                Dec.height = 100;
                Dec.pivotY = 50;
                Dec.y = Hint_M.height / 2;
                Dec.bold = true;
                Dec.fontSize = 35;
                Dec.color = '#ffffff';
                Dec.align = 'center';
                Dec.valign = 'middle';
                Dec.alpha = 0;
                Ani2DAdmin.scale_Alpha(Hint_M, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                    Ani2DAdmin.fadeOut(Dec, 0, 1, 150, 0, f => {
                        Ani2DAdmin.fadeOut(Dec, 1, 0, 200, 800, f => {
                            Ani2DAdmin.scale_Alpha(Hint_M, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                Hint_M.removeSelf();
                            });
                        });
                    });
                });
            }
            Dialogue._middleHint = _middleHint;
            Dialogue._dialogContent = {
                get Array() {
                    return Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] !== null ? Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] : [];
                },
            };
            function getDialogContent(useWhere, name) {
                let dia;
                for (let index = 0; index < Dialogue._dialogContent.Array.length; index++) {
                    const element = Dialogue._dialogContent.Array[index];
                    if (element['useWhere'] == useWhere && element['name'] == name) {
                        dia = element;
                        break;
                    }
                }
                const arr = [];
                for (const key in dia) {
                    if (dia.hasOwnProperty(key)) {
                        const value = dia[key];
                        if (key.substring(0, 7) == 'content' || value !== -1) {
                            arr.push(value);
                        }
                    }
                }
                return arr;
            }
            Dialogue.getDialogContent = getDialogContent;
            function getDialogContent_Random(useWhere) {
                let contentArr = [];
                let whereArr = getUseWhere(useWhere);
                let index = Math.floor(Math.random() * whereArr.length);
                for (const key in whereArr[index]) {
                    if (whereArr[index].hasOwnProperty(key)) {
                        const value = whereArr[index][key];
                        if (key.substring(0, 7) == 'content' && value !== "-1") {
                            contentArr.push(value);
                        }
                    }
                }
                return contentArr;
            }
            Dialogue.getDialogContent_Random = getDialogContent_Random;
            function getUseWhere(useWhere) {
                let arr = [];
                for (let index = 0; index < Dialogue._dialogContent.Array.length; index++) {
                    const element = Dialogue._dialogContent.Array[index];
                    if (element['useWhere'] == useWhere) {
                        arr.push(element);
                    }
                }
                return arr;
            }
            Dialogue.getUseWhere = getUseWhere;
            let UseWhere;
            (function (UseWhere) {
                UseWhere["scene1"] = "scene1";
                UseWhere["scene2"] = "scene2";
                UseWhere["scene3"] = "scene3";
            })(UseWhere = Dialogue.UseWhere || (Dialogue.UseWhere = {}));
            let DialogProperty;
            (function (DialogProperty) {
                DialogProperty["name"] = "name";
                DialogProperty["useWhere"] = "useWhere";
                DialogProperty["content"] = "content";
                DialogProperty["max"] = "max";
            })(DialogProperty = Dialogue.DialogProperty || (Dialogue.DialogProperty = {}));
            let PlayMode;
            (function (PlayMode) {
                PlayMode["voluntarily"] = "voluntarily";
                PlayMode["manual"] = "manual";
                PlayMode["clickContent"] = "clickContent";
            })(PlayMode = Dialogue.PlayMode || (Dialogue.PlayMode = {}));
            function createVoluntarilyDialogue(x, y, useWhere, startDelayed, delayed, parent, content) {
                if (startDelayed == undefined) {
                    startDelayed = 0;
                }
                Laya.timer.once(startDelayed, this, () => {
                    let Pre_Dialogue;
                    Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab) {
                        let _prefab = new Laya.Prefab();
                        _prefab.json = prefab;
                        Pre_Dialogue = Laya.Pool.getItemByCreateFun('Pre_Dialogue', _prefab.create, _prefab);
                        if (parent) {
                            parent.addChild(Pre_Dialogue);
                        }
                        else {
                            Laya.stage.addChild(Pre_Dialogue);
                        }
                        Pre_Dialogue.x = x;
                        Pre_Dialogue.y = y;
                        let ContentLabel = Pre_Dialogue.getChildByName('Content');
                        let contentArr;
                        if (content !== undefined) {
                            ContentLabel.text = content[0];
                        }
                        else {
                            contentArr = getDialogContent_Random(useWhere);
                            ContentLabel.text = contentArr[0];
                        }
                        Pre_Dialogue.zOrder = 100;
                        if (delayed == undefined) {
                            delayed = 1000;
                        }
                        Ani2DAdmin.scale_Alpha(Pre_Dialogue, 0, 0, 0, 1, 1, 1, 150, 1000, () => {
                            for (let index = 0; index < contentArr.length; index++) {
                                Laya.timer.once(index * delayed, this, () => {
                                    ContentLabel.text = contentArr[index];
                                    if (index == contentArr.length - 1) {
                                        Laya.timer.once(delayed, this, () => {
                                            Ani2DAdmin.scale_Alpha(Pre_Dialogue, 1, 1, 1, 0, 0, 0, 150, 1000, () => {
                                                Pre_Dialogue.removeSelf();
                                            });
                                        });
                                    }
                                });
                            }
                        });
                        Dialogue.DialogueNode = Pre_Dialogue;
                    }));
                });
            }
            Dialogue.createVoluntarilyDialogue = createVoluntarilyDialogue;
            function createCommonDialog(parent, x, y, content) {
                let Dialogue_Common;
                Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    Dialogue_Common = Laya.Pool.getItemByCreateFun('Dialogue_Common', _prefab.create, _prefab);
                    parent.addChild(Dialogue_Common);
                    Dialogue_Common.pos(x, y);
                    let Content = Dialogue_Common.getChildByName('Dialogue_Common');
                    Content.text = content;
                }));
            }
            Dialogue.createCommonDialog = createCommonDialog;
        })(Dialogue = Lwg.Dialogue || (Lwg.Dialogue = {}));
        let GoldAdmin;
        (function (GoldAdmin) {
            GoldAdmin._num = {
                get value() {
                    return Laya.LocalStorage.getItem('GoldNum') ? Number(Laya.LocalStorage.getItem('GoldNum')) : 0;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('GoldNum', val.toString());
                }
            };
            function _createGoldNode(x, y, parent) {
                if (!parent) {
                    parent = Laya.stage;
                }
                if (GoldAdmin.GoldNode) {
                    GoldAdmin.GoldNode.removeSelf();
                }
                let sp;
                Laya.loader.load('Prefab/LwgGold.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('gold', _prefab.create, _prefab);
                    let Num = sp.getChildByName('Num');
                    Num.text = ToolsAdmin._Format.formatNumber(GoldAdmin._num.value);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 100;
                    GoldAdmin.GoldNode = sp;
                }));
            }
            GoldAdmin._createGoldNode = _createGoldNode;
            function _add(number) {
                GoldAdmin._num.value += Number(number);
                let Num = GoldAdmin.GoldNode.getChildByName('Num');
                Num.text = ToolsAdmin._Format.formatNumber(GoldAdmin._num.value);
            }
            GoldAdmin._add = _add;
            function _addDisPlay(number) {
                let Num = GoldAdmin.GoldNode.getChildByName('Num');
                Num.value = (Number(Num.value) + Number(number)).toString();
            }
            GoldAdmin._addDisPlay = _addDisPlay;
            function _addNoDisPlay(number) {
                GoldAdmin._num.value += Number(number);
            }
            GoldAdmin._addNoDisPlay = _addNoDisPlay;
            function _nodeAppear(delayed, x, y) {
                if (!GoldAdmin.GoldNode) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(GoldAdmin.GoldNode, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        GoldAdmin.GoldNode.visible = true;
                    });
                }
                else {
                    GoldAdmin.GoldNode.visible = true;
                }
                if (x) {
                    GoldAdmin.GoldNode.x = x;
                }
                if (y) {
                    GoldAdmin.GoldNode.y = y;
                }
            }
            GoldAdmin._nodeAppear = _nodeAppear;
            function _nodeVinish(delayed) {
                if (!GoldAdmin.GoldNode) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(GoldAdmin.GoldNode, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        GoldAdmin.GoldNode.visible = false;
                    });
                }
                else {
                    GoldAdmin.GoldNode.visible = false;
                }
            }
            GoldAdmin._nodeVinish = _nodeVinish;
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Frame/Effects/iconGold.png"] = 0] = "Frame/Effects/iconGold.png";
            })(SkinUrl || (SkinUrl = {}));
            function _createOne(width, height, url) {
                const Gold = Laya.Pool.getItemByClass('addGold', Laya.Image);
                Gold.name = 'addGold';
                let num = Math.floor(Math.random() * 12);
                Gold.alpha = 1;
                Gold.zOrder = 60;
                Gold.width = width;
                Gold.height = height;
                Gold.pivotX = width / 2;
                Gold.pivotY = height / 2;
                if (!url) {
                    Gold.skin = SkinUrl[0];
                }
                else {
                    Gold.skin = url;
                }
                if (GoldAdmin.GoldNode) {
                    Gold.zOrder = GoldAdmin.GoldNode.zOrder + 10;
                }
                return Gold;
            }
            GoldAdmin._createOne = _createOne;
            function _getAni_Single(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    Laya.timer.once(index * 30, this, () => {
                        let Gold = _createOne(width, height, url);
                        parent.addChild(Gold);
                        Ani2DAdmin.move_Scale(Gold, 1, firstPoint.x, firstPoint.y, targetPoint.x, targetPoint.y, 1, 350, 0, null, () => {
                            AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
                            if (index === number - 1) {
                                Laya.timer.once(200, this, () => {
                                    if (func2) {
                                        func2();
                                    }
                                });
                            }
                            else {
                                if (func1) {
                                    func1();
                                }
                            }
                            Gold.removeSelf();
                        });
                    });
                }
            }
            GoldAdmin._getAni_Single = _getAni_Single;
            function _getAni_Heap(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    let Gold = _createOne(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                    parent = parent ? parent : Laya.stage;
                    parent.addChild(Gold);
                    firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                    targetPoint = targetPoint ? targetPoint : new Laya.Point(GoldAdmin.GoldNode.x, GoldAdmin.GoldNode.y);
                    let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                    let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                    Ani2DAdmin.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                        Ani2DAdmin.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                            AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
                            if (index === number - 1) {
                                Laya.timer.once(200, this, () => {
                                    if (func2) {
                                        func2();
                                    }
                                });
                            }
                            else {
                                if (func1) {
                                    func1();
                                }
                            }
                            Gold.removeSelf();
                        });
                    });
                }
            }
            GoldAdmin._getAni_Heap = _getAni_Heap;
        })(GoldAdmin = Lwg.GoldAdmin || (Lwg.GoldAdmin = {}));
        let EventAdmin;
        (function (EventAdmin) {
            EventAdmin.dispatcher = new Laya.EventDispatcher();
            function _register(type, caller, listener) {
                if (!caller) {
                    console.error("事件的执行域必须存在!");
                }
                EventAdmin.dispatcher.on(type.toString(), caller, listener);
            }
            EventAdmin._register = _register;
            function _registerOnce(type, caller, listener) {
                if (!caller) {
                    console.error("事件的执行域必须存在!");
                }
                EventAdmin.dispatcher.once(type.toString(), caller, listener);
            }
            EventAdmin._registerOnce = _registerOnce;
            function _notify(type, args) {
                EventAdmin.dispatcher.event(type.toString(), args);
            }
            EventAdmin._notify = _notify;
            function _off(type, caller, listener) {
                EventAdmin.dispatcher.off(type.toString(), caller, listener);
            }
            EventAdmin._off = _off;
            function _offAll(type) {
                EventAdmin.dispatcher.offAll(type.toString());
            }
            EventAdmin._offAll = _offAll;
            function _offCaller(caller) {
                EventAdmin.dispatcher.offAllCaller(caller);
            }
            EventAdmin._offCaller = _offCaller;
        })(EventAdmin = Lwg.EventAdmin || (Lwg.EventAdmin = {}));
        let DateAdmin;
        (function (DateAdmin) {
            DateAdmin._date = {
                get year() {
                    return (new Date()).getFullYear();
                },
                get month() {
                    return (new Date()).getMonth();
                },
                get date() {
                    return (new Date()).getDate();
                },
                get day() {
                    return (new Date()).getDay();
                },
                get hours() {
                    return (new Date()).getHours();
                },
                get minutes() {
                    return (new Date()).getMinutes();
                },
                get seconds() {
                    return (new Date()).getSeconds();
                },
                get milliseconds() {
                    return (new Date()).getMilliseconds();
                },
                get toLocaleDateString() {
                    return (new Date()).toLocaleDateString();
                },
                get toLocaleTimeString() {
                    return (new Date()).toLocaleTimeString();
                }
            };
            function _init() {
                const d = new Date;
                DateAdmin._loginInfo = StorageAdmin._arrayArr('DateAdmin/loginInfo');
                DateAdmin._loginInfo.value.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                let arr = [];
                if (DateAdmin._loginInfo.value.length > 0) {
                    for (let index = 0; index < DateAdmin._loginInfo.value.length; index++) {
                        arr.push(DateAdmin._loginInfo.value[index]);
                    }
                }
                arr.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                DateAdmin._loginInfo.value = arr;
                DateAdmin._loginCount = StorageAdmin._num('DateAdmin/_loginCount');
                DateAdmin._loginCount.value++;
                DateAdmin._loginToday.num++;
            }
            DateAdmin._init = _init;
            DateAdmin._loginToday = {
                get num() {
                    return Laya.LocalStorage.getItem('DateAdmin/loginToday') ? Number(Laya.LocalStorage.getItem('DateAdmin/loginToday')) : 0;
                },
                set num(val) {
                    if (DateAdmin._date.date == DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2]) {
                        Laya.LocalStorage.setItem('DateAdmin/loginToday', val.toString());
                    }
                }
            };
            DateAdmin._last = {
                get date() {
                    if (DateAdmin._loginInfo.value.length > 1) {
                        return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 2][2];
                    }
                    else {
                        return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2];
                    }
                },
            };
            DateAdmin._front = {
                get date() {
                    return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2];
                },
            };
        })(DateAdmin = Lwg.DateAdmin || (Lwg.DateAdmin = {}));
        let TimerAdmin;
        (function (TimerAdmin) {
            TimerAdmin._switch = true;
            function _frameLoop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                Laya.timer.frameLoop(delay, caller, () => {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._frameLoop = _frameLoop;
            function _frameRandomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            method();
                            func();
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameRandomLoop = _frameRandomLoop;
            function _frameNumLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                let num0 = 0;
                var func = () => {
                    if (TimerAdmin._switch) {
                        num0++;
                        if (num0 >= num) {
                            method();
                            if (compeletMethod) {
                                compeletMethod();
                            }
                            Laya.timer.clear(caller, func);
                        }
                        else {
                            method();
                        }
                    }
                };
                Laya.timer.frameLoop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._frameNumLoop = _frameNumLoop;
            function _numRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            num0++;
                            if (num0 >= num) {
                                method();
                                compeletMethod();
                            }
                            else {
                                method();
                                func();
                            }
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._numRandomLoop = _numRandomLoop;
            function _frameNumRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            num0++;
                            if (num0 >= num) {
                                method();
                                compeletMethod && compeletMethod();
                            }
                            else {
                                method();
                                func();
                            }
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameNumRandomLoop = _frameNumRandomLoop;
            function _frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                beforeMethod && beforeMethod();
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._frameOnce = _frameOnce;
            function _frameNumOnce(delay, num, caller, afterMethod, beforeMethod, args, coverBefore) {
                for (let index = 0; index < num; index++) {
                    if (beforeMethod) {
                        beforeMethod();
                    }
                    Laya.timer.frameOnce(delay, caller, () => {
                        afterMethod();
                    }, args, coverBefore);
                }
            }
            TimerAdmin._frameNumOnce = _frameNumOnce;
            function _loop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                Laya.timer.loop(delay, caller, () => {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._loop = _loop;
            function _randomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.once(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            method();
                            func();
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._randomLoop = _randomLoop;
            function _numLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                var func = () => {
                    if (TimerAdmin._switch) {
                        num0++;
                        if (num0 > num) {
                            method();
                            if (compeletMethod) {
                                compeletMethod();
                            }
                            Laya.timer.clear(caller, func);
                        }
                        else {
                            method();
                        }
                    }
                };
                Laya.timer.loop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._numLoop = _numLoop;
            function _once(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.once(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._once = _once;
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.timer.clearAll(arr[index]);
                }
            }
            TimerAdmin._clearAll = _clearAll;
            function _clear(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.timer.clear(arr[index][0], arr[index][1]);
                }
            }
            TimerAdmin._clear = _clear;
        })(TimerAdmin = Lwg.TimerAdmin || (Lwg.TimerAdmin = {}));
        let AdaptiveAdmin;
        (function (AdaptiveAdmin) {
            AdaptiveAdmin._Use = {
                get value() {
                    return this['Adaptive/value'] ? this['Adaptive/value'] : null;
                },
                set value(val) {
                    this['Adaptive/value'] = val;
                }
            };
            function _stageWidth(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotX == 0 && element.width) {
                        element.x = element.x / AdaptiveAdmin._Use.value[0] * Laya.stage.width + element.width / 2;
                    }
                    else {
                        element.x = element.x / AdaptiveAdmin._Use.value[0] * Laya.stage.width;
                    }
                }
            }
            AdaptiveAdmin._stageWidth = _stageWidth;
            function _stageHeight(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotY == 0 && element.height) {
                        element.y = element.y / AdaptiveAdmin._Use.value[1] * element.scaleX * Laya.stage.height + element.height / 2;
                    }
                    else {
                        element.y = element.y / AdaptiveAdmin._Use.value[1] * element.scaleX * Laya.stage.height;
                    }
                }
            }
            AdaptiveAdmin._stageHeight = _stageHeight;
            function _center(arr, target) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.width > 0) {
                        element.x = target.width / 2 - (element.width / 2 - element.pivotX) * element.scaleX;
                    }
                    else {
                        element.x = target.width / 2;
                    }
                    if (element.height > 0) {
                        element.y = target.height / 2 - (element.height / 2 - element.pivotY) * element.scaleY;
                    }
                    else {
                        element.y = target.height / 2;
                    }
                }
            }
            AdaptiveAdmin._center = _center;
        })(AdaptiveAdmin = Lwg.AdaptiveAdmin || (Lwg.AdaptiveAdmin = {}));
        let SceneAniAdmin;
        (function (SceneAniAdmin) {
            SceneAniAdmin._openSwitch = {
                get value() {
                    return this['openSwitch'] ? this['openSwitch'] : false;
                },
                set value(val) {
                    if (val) {
                        SceneAniAdmin._closeSwitch.value = false;
                    }
                    this['openSwitch'] = val;
                }
            };
            SceneAniAdmin._closeSwitch = {
                get value() {
                    return this['closeSwitch'] ? this['closeSwitch'] : false;
                },
                set value(val) {
                    if (val) {
                        SceneAniAdmin._openSwitch.value = false;
                    }
                    this['closeSwitch'] = val;
                }
            };
            SceneAniAdmin._Use = {
                get value() {
                    return this['SceneAnimation/use'] ? this['SceneAnimation/use'] : null;
                },
                set value(val) {
                    this['SceneAnimation/use'] = val;
                }
            };
            SceneAniAdmin._closeAniTime = 0;
            SceneAniAdmin._openAniTime = 0;
            function _commonOpenAni(Scene) {
                return SceneAniAdmin._Use.value.class['_paly'](SceneAniAdmin._Use.value.type, Scene);
            }
            SceneAniAdmin._commonOpenAni = _commonOpenAni;
            function _commonCloseAni(Scene) {
                return SceneAniAdmin._Use.value.class['_paly'](SceneAniAdmin._Use.value.type, Scene);
            }
            SceneAniAdmin._commonCloseAni = _commonCloseAni;
            let _fadeOut;
            (function (_fadeOut) {
                let _time = 700;
                let _delay = 150;
                class Close {
                    static _paly(type, Scene) {
                        _fadeOut_Close(Scene);
                        return _delay + _time;
                    }
                    ;
                }
                _fadeOut.Close = Close;
                class Open {
                    static _paly(type, Scene) {
                        _fadeOut_Open(Scene);
                        return SceneAniAdmin._closeAniTime = _time + _delay;
                    }
                    ;
                }
                _fadeOut.Open = Open;
                function _fadeOut_Open(Scene) {
                    let time = 400;
                    let delay = 300;
                    if (Scene['Background']) {
                        Ani2DAdmin.fadeOut(Scene, 0, 1, time / 2, delay);
                    }
                    Ani2DAdmin.fadeOut(Scene, 0, 1, time, 0);
                    return time + delay;
                }
                function _fadeOut_Close(Scene) {
                    let time = 150;
                    let delay = 50;
                    if (Scene['Background']) {
                        Ani2DAdmin.fadeOut(Scene, 1, 0, time / 2);
                    }
                    Ani2DAdmin.fadeOut(Scene, 1, 0, time, delay);
                    return time + delay;
                }
            })(_fadeOut = SceneAniAdmin._fadeOut || (SceneAniAdmin._fadeOut = {}));
            let _shutters;
            (function (_shutters) {
                let _num = 10;
                let _time = 700;
                let _delay = 150;
                function _moveClose(sp, tex, scaleX, scealeY) {
                    Ani2DAdmin.scale(sp, 1, 1, scaleX, scealeY, _time, 0, () => {
                        tex.disposeBitmap();
                        tex.destroy();
                        sp.destroy();
                    });
                }
                function _moveOpen(sp, tex, scaleX, scealeY) {
                    Ani2DAdmin.scale(sp, scaleX, scealeY, 1, 1, _time, 0, () => {
                        tex.disposeBitmap();
                        tex.destroy();
                        sp.destroy();
                    });
                }
                function _moveRule(sp, tex, scaleModul, open) {
                    if (open) {
                        if (scaleModul === 'x') {
                            _moveOpen(sp, tex, 0, 1);
                        }
                        else {
                            _moveOpen(sp, tex, 1, 0);
                        }
                    }
                    else {
                        if (scaleModul === 'x') {
                            _moveClose(sp, tex, 0, 1);
                        }
                        else {
                            _moveClose(sp, tex, 1, 0);
                        }
                    }
                }
                function _createNoMaskSp(x, y, width, height, tex, scaleModul, open) {
                    const sp = new Laya.Sprite;
                    Laya.stage.addChild(sp);
                    sp.name = 'shutters';
                    sp.zOrder = 1000;
                    sp.pos(x, y);
                    sp.size(width, height);
                    ToolsAdmin._Node.changePivot(sp, width / 2, height / 2);
                    sp.texture = tex;
                    _moveRule(sp, tex, scaleModul, open);
                    return sp;
                }
                function _createMaskSp(Scene, scaleModul, open) {
                    const sp = new Laya.Sprite;
                    Laya.stage.addChild(sp);
                    const _width = Laya.stage.width;
                    const _height = Laya.stage.height;
                    sp.size(_width, _height);
                    sp.pos(0, 0);
                    sp.zOrder = 1000;
                    sp.name = 'shutters';
                    const tex = Scene.drawToTexture(_width, _height, 0, 0);
                    sp.texture = tex;
                    _moveRule(sp, tex, scaleModul, open);
                    return sp;
                }
                function _createMask(sp) {
                    const Mask = new Laya.Image;
                    Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                    Mask.sizeGrid = '12,12,12,12';
                    sp.mask = Mask;
                    Mask.anchorX = Mask.anchorY = 0.5;
                    return Mask;
                }
                function _crosswise(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        const _width = Scene.width / _num;
                        const _height = Laya.stage.height;
                        const tex = Scene.drawToTexture(_width, _height, -_width * index, 0);
                        _createNoMaskSp(_width * index, 0, _width, _height, tex, 'x', open);
                    }
                }
                _shutters._crosswise = _crosswise;
                function _vertical(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        const _width = Scene.width;
                        const _height = Laya.stage.height / _num;
                        const tex = Scene.drawToTexture(_width, _height, 0, -_height * index);
                        _createNoMaskSp(0, _height * index, _width, _height, tex, 'y', false);
                    }
                }
                _shutters._vertical = _vertical;
                function _croAndVer(Scene, open) {
                    const num = _num - 2;
                    for (let index = 0; index < num; index++) {
                        const _width = Scene.width / num;
                        const _height = Laya.stage.height;
                        const tex = Scene.drawToTexture(_width, _height, -_width * index, 0);
                        _createNoMaskSp(_width * index, 0, _width, _height, tex, 'x', false);
                    }
                    for (let index = 0; index < num; index++) {
                        const _width = Scene.width;
                        const _height = Laya.stage.height / num;
                        const tex = Scene.drawToTexture(_width, _height, 0, -_height * index);
                        _createNoMaskSp(0, _height * index, _width, _height, tex, 'y', open);
                    }
                }
                _shutters._croAndVer = _croAndVer;
                function _rSideling(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        let addLen = 1000;
                        const sp = _createMaskSp(Scene, 'x', open);
                        const Mask = _createMask(sp);
                        Mask.size(Math.round(Laya.stage.width / _num), Math.round(Laya.stage.height + addLen));
                        Mask.pos(Math.round(Laya.stage.width / _num * index), Math.round(-addLen / 2));
                        ToolsAdmin._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        ToolsAdmin._Node.changePivot(sp, Math.round(index * sp.width / _num + sp.width / _num / 2), Math.round(sp.height / 2));
                        Mask.rotation = -10;
                    }
                }
                _shutters._rSideling = _rSideling;
                function _lSideling(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        const sp = _createMaskSp(Scene, 'x', open);
                        const Mask = _createMask(sp);
                        Mask.size(Math.round(Laya.stage.width / _num), Math.round(Laya.stage.height + 1000));
                        Mask.pos(Math.round(Laya.stage.width / _num * index), -1000 / 2);
                        ToolsAdmin._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        ToolsAdmin._Node.changePivot(sp, Math.round(index * sp.width / _num + sp.width / _num / 2), Math.round(sp.height / 2));
                        Mask.rotation = 10;
                    }
                }
                _shutters._lSideling = _lSideling;
                function _sidelingIntersection(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        let addLen = 1000;
                        const sp1 = _createMaskSp(Scene, 'x', open);
                        const Mask1 = _createMask(sp1);
                        Mask1.width = Math.round(Laya.stage.width / _num);
                        Mask1.height = Math.round(Laya.stage.height + addLen);
                        Mask1.pos(Math.round(Laya.stage.width / _num * index), Math.round(-addLen / 2));
                        ToolsAdmin._Node.changePivot(Mask1, Math.round(Mask1.width / 2), Math.round(Mask1.height / 2));
                        ToolsAdmin._Node.changePivot(sp1, Math.round(index * sp1.width / _num + sp1.width / _num / 2), Math.round(sp1.height / 2));
                        Mask1.rotation = -15;
                        const sp2 = _createMaskSp(Scene, 'x', open);
                        const Mask2 = _createMask(sp2);
                        Mask2.width = Laya.stage.width / _num;
                        Mask2.height = Laya.stage.height + addLen;
                        Mask2.pos(Laya.stage.width / _num * index, -addLen / 2);
                        ToolsAdmin._Node.changePivot(Mask2, Mask2.width / 2, Mask2.height / 2);
                        ToolsAdmin._Node.changePivot(sp2, index * sp2.width / _num + sp2.width / _num / 2, sp2.height / 2);
                        Mask2.rotation = 15;
                    }
                }
                _shutters._sidelingIntersection = _sidelingIntersection;
                function _randomCroAndVer(Scene, open) {
                    const index = ToolsAdmin._Array.randomGetOne([0, 1, 2]);
                    switch (index) {
                        case 0:
                            _crosswise(Scene, open);
                            break;
                        case 1:
                            _vertical(Scene, open);
                            break;
                        case 2:
                            _croAndVer(Scene, open);
                            break;
                        default:
                            _crosswise(Scene, open);
                            break;
                    }
                }
                _shutters._randomCroAndVer = _randomCroAndVer;
                function _random(Scene, open) {
                    const index = ToolsAdmin._Array.randomGetOne([0, 1, 2, 3, 4, 5]);
                    switch (index) {
                        case 0:
                            _crosswise(Scene, open);
                            break;
                        case 1:
                            _vertical(Scene, open);
                            break;
                        case 2:
                            _croAndVer(Scene, open);
                            break;
                        case 3:
                            _sidelingIntersection(Scene, open);
                            break;
                        case 4:
                            _lSideling(Scene, open);
                            break;
                        case 5:
                            _rSideling(Scene, open);
                            break;
                        default:
                            _crosswise(Scene, open);
                            break;
                    }
                }
                _shutters._random = _random;
                class Close {
                    static _paly(type, Scene) {
                        TimerAdmin._once(_delay, this, () => {
                            _shutters[`_${type}`](Scene, false);
                            Scene.visible = false;
                        });
                        return SceneAniAdmin._closeAniTime = _delay + _time;
                    }
                    ;
                }
                Close._type = {
                    crosswise: 'crosswise',
                    vertical: 'vertical',
                    croAndVer: 'croAndVer',
                    rSideling: 'rSideling',
                    sidelingIntersection: 'sidelingIntersection',
                    randomCroAndVer: 'randomCroAndVer',
                    random: 'random',
                };
                _shutters.Close = Close;
                class Open {
                    static _paly(type, Scene) {
                        TimerAdmin._once(_delay, this, () => {
                            _shutters[`_${type}`](Scene, true);
                            Scene.visible = false;
                            TimerAdmin._once(_time, this, () => {
                                Scene.visible = true;
                            });
                        });
                        return SceneAniAdmin._closeAniTime = _time + _delay;
                    }
                    ;
                }
                Open._type = {
                    crosswise: 'crosswise',
                    vertical: 'vertical',
                    croAndVer: 'croAndVer',
                    _sidelingIntersection: '_sidelingIntersection',
                    randomCroAndVer: 'randomCroAndVer',
                    random: 'random',
                };
                _shutters.Open = Open;
            })(_shutters = SceneAniAdmin._shutters || (SceneAniAdmin._shutters = {}));
            let _stickIn;
            (function (_stickIn_1) {
                function _stickIn(Scene, type) {
                    let sumDelay = 0;
                    let time = 700;
                    let delay = 100;
                    if (Scene.getChildByName('Background')) {
                        Ani2DAdmin.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
                    }
                    let stickInLeftArr = ToolsAdmin._Node.childZOrderByY(Scene, false);
                    for (let index = 0; index < stickInLeftArr.length; index++) {
                        const element = stickInLeftArr[index];
                        if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                            let originalPovitX = element.pivotX;
                            let originalPovitY = element.pivotY;
                            let originalX = element.x;
                            let originalY = element.y;
                            element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                            element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                            Ani2DAdmin.rotate(element, 0, time, delay * index);
                            Ani2DAdmin.move(element, originalX, originalY, time, () => {
                                ToolsAdmin._Node.changePivot(element, originalPovitX, originalPovitY);
                            }, delay * index);
                        }
                    }
                    sumDelay = Scene.numChildren * delay + time + 200;
                    return sumDelay;
                }
            })(_stickIn = SceneAniAdmin._stickIn || (SceneAniAdmin._stickIn = {}));
        })(SceneAniAdmin = Lwg.SceneAniAdmin || (Lwg.SceneAniAdmin = {}));
        let StorageAdmin;
        (function (StorageAdmin) {
            class admin {
                removeSelf() { }
                func() { }
            }
            class _NumVariable extends admin {
            }
            StorageAdmin._NumVariable = _NumVariable;
            class _StrVariable extends admin {
            }
            StorageAdmin._StrVariable = _StrVariable;
            class _BoolVariable extends admin {
            }
            StorageAdmin._BoolVariable = _BoolVariable;
            class _ArrayVariable extends admin {
            }
            StorageAdmin._ArrayVariable = _ArrayVariable;
            class _ArrayArrVariable extends admin {
            }
            StorageAdmin._ArrayArrVariable = _ArrayArrVariable;
            class _Object extends admin {
            }
            StorageAdmin._Object = _Object;
            function _num(name, _func, initial) {
                if (!this[`_num${name}`]) {
                    const obj = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                return Number(Laya.LocalStorage.getItem(name));
                            }
                            else {
                                initial = initial ? initial : 0;
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        },
                        set value(data) {
                            Laya.LocalStorage.setItem(name, data.toString());
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            this['_func'] && this['_func']();
                        }
                    };
                    this[`_num${name}`] = obj;
                }
                if (_func) {
                    this[`_num${name}`]['_func'] = _func;
                }
                return this[`_num${name}`];
            }
            StorageAdmin._num = _num;
            function _str(name, _func, initial) {
                if (!this[`_str${name}`]) {
                    this[`_str${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                return Laya.LocalStorage.getItem(name);
                            }
                            else {
                                initial = initial ? initial : null;
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        },
                        set value(data) {
                            Laya.LocalStorage.setItem(name, data.toString());
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            this['_func'] && this['_func']();
                        }
                    };
                }
                if (_func) {
                    this[`_str${name}`]['_func'] = _func;
                }
                return this[`_str${name}`];
            }
            StorageAdmin._str = _str;
            function _bool(name, _func, initial) {
                if (!this[`_bool${name}`]) {
                    this[`_bool${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                if (Laya.LocalStorage.getItem(name) === "false") {
                                    return false;
                                }
                                else if (Laya.LocalStorage.getItem(name) === "true") {
                                    return true;
                                }
                            }
                            else {
                                if (initial) {
                                    Laya.LocalStorage.setItem(name, "true");
                                }
                                else {
                                    Laya.LocalStorage.setItem(name, "false");
                                }
                                this['func']();
                                return initial;
                            }
                        },
                        set value(bool) {
                            bool = bool ? "true" : "false";
                            Laya.LocalStorage.setItem(name, bool.toString());
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_bool${name}`]['_func'] = _func;
                }
                return this[`_bool${name}`];
            }
            StorageAdmin._bool = _bool;
            function _array(name, _func, initial) {
                if (!this[`_array${name}`]) {
                    this[`_array${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setJSON(name, JSON.stringify(initial));
                                    this['func']();
                                    return initial;
                                }
                            }
                            catch (error) {
                                return [];
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_array${name}`]['_func'] = _func;
                }
                return this[`_array${name}`];
            }
            StorageAdmin._array = _array;
            function _obj(name, _func, initial) {
                if (!this[`_obj${name}`]) {
                    this[`_obj${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                }
                                else {
                                    initial = initial ? initial : {};
                                    Laya.LocalStorage.setJSON(name, JSON.stringify(initial));
                                    this['func']();
                                    return initial;
                                }
                            }
                            catch (error) {
                                return {};
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_obj${name}`]['_func'] = _func;
                }
                return this[`_obj${name}`];
            }
            StorageAdmin._obj = _obj;
            function _arrayArr(name, _func, initial) {
                if (!this[`_arrayArr${name}`]) {
                    this[`_arrayArr${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                    ;
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setItem(name, initial.toString());
                                    return initial;
                                }
                            }
                            catch (error) {
                                return [];
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_arrayArr${name}`]['_func'] = _func;
                }
                return this[`_arrayArr${name}`];
            }
            StorageAdmin._arrayArr = _arrayArr;
        })(StorageAdmin = Lwg.StorageAdmin || (Lwg.StorageAdmin = {}));
        let DataAdmin;
        (function (DataAdmin) {
            class _BaseProperty {
                constructor() {
                    this.name = 'name';
                    this.serial = 'serial';
                    this.sort = 'sort';
                    this.chName = 'chName';
                    this.classify = 'classify';
                    this.unlockWay = 'unlockWay';
                    this.otherUnlockWay = 'otherUnlockWay';
                    this.conditionNum = 'conditionNum';
                    this.otherConditionNum = 'otherConditionNum';
                    this.degreeNum = 'degreeNum';
                    this.otherDegreeNum = 'otherDegreeNum';
                    this.rewardType = 'otherGetAward';
                    this.otherRewardType = 'otherRewardType';
                    this.complete = 'complete';
                    this.otherComplete = 'otherComplete';
                    this.getAward = 'getAward';
                    this.otherGetAward = 'otherGetAward';
                    this.pitch = 'pitch';
                }
            }
            DataAdmin._BaseProperty = _BaseProperty;
            ;
            DataAdmin._unlockWayType = {
                ads: 'ads',
                gold: 'gold',
                diamond: 'diamond',
                customs: 'customs',
                check: 'check',
                free: 'free',
            };
            class _Item extends SceneAdmin._ObjectBase {
                constructor() {
                    super(...arguments);
                    this.$data = null;
                    this.$unlockWayType = DataAdmin._unlockWayType;
                }
                get $dataIndex() { return this['item/dataIndex']; }
                set $dataIndex(_dataIndex) { this['item/dataIndex'] = _dataIndex; }
                get $dataArrName() { return this['item/dataArrName']; }
                set $dataArrName(name) {
                    this['item/dataArrName'] = name;
                }
                $render() { }
                ;
                lwglistRender(data, index) {
                    this.$data = data;
                    this.$dataIndex = index;
                    if (!this.$data)
                        return;
                    this.$render();
                }
                $button() { }
                ;
                $awake() { }
                ;
                lwgOnAwake() {
                    this.$awake();
                    this.$button();
                }
            }
            DataAdmin._Item = _Item;
            class _Table {
                constructor(tableName, _tableArr, localStorage, lastVtableName, lastProArr) {
                    this._unlockWay = DataAdmin._unlockWayType;
                    this._tableName = 'name';
                    this._lastArr = [];
                    this._localStorage = false;
                    this._property = new _BaseProperty;
                    if (tableName) {
                        this._tableName = tableName;
                        if (localStorage) {
                            this._localStorage = localStorage;
                            this._arr = addCompare(_tableArr, tableName, this._property.name);
                            if (lastVtableName) {
                                if (lastProArr) {
                                    this._compareLastInforByPro(lastVtableName, lastProArr);
                                }
                                else {
                                    this._compareLastDefaultPro(lastVtableName);
                                }
                            }
                        }
                        else {
                            this._arr = _tableArr;
                        }
                    }
                }
                get _arr() {
                    return this[`_${this._tableName}arr`];
                }
                set _arr(arr) {
                    this[`_${this._tableName}arr`] = arr;
                    Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this[`_${this._tableName}arr`]));
                }
                get _List() {
                    return this[`${this._tableName}_List`];
                }
                set _List(list) {
                    this[`${this._tableName}_List`] = list;
                    list.array = this._arr;
                    list.selectEnable = false;
                    list.vScrollBarSkin = "";
                    list.renderHandler = new Laya.Handler(this, (cell, index) => {
                        if (this._listRenderScript) {
                            let _item = cell.getComponent(this._listRenderScript);
                            if (!_item) {
                                _item = cell.addComponent(this._listRenderScript);
                            }
                            _item.lwglistRender(this._listArray[index], index);
                        }
                    });
                    list.selectHandler = new Laya.Handler(this, (index) => {
                        this._listSelect && this._listSelect(index);
                    });
                }
                get _listArray() {
                    return this._List.array;
                }
                set _listArray(arr) {
                    this._List.array = arr;
                    this._List.scrollTo(0);
                    this._refreshAndStorage();
                }
                _refreshAndStorage() {
                    if (this._localStorage) {
                        Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this._arr));
                    }
                    if (this._List) {
                        this._List.refresh();
                    }
                }
                _compareLastInforByPro(lastVtableName, proArr) {
                    this._lastArr = this._getlastVersion(lastVtableName);
                    for (let index = 0; index < this._lastArr.length; index++) {
                        const elementLast = this._lastArr[index];
                        for (let index = 0; index < this._arr.length; index++) {
                            const element = this._arr[index];
                            if (elementLast.name === element.name) {
                                for (let index = 0; index < proArr.length; index++) {
                                    const proName = proArr[index];
                                    element[proName] = elementLast[proName];
                                }
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _compareLastDefaultPro(lastVtableName) {
                    this._lastArr = this._getlastVersion(lastVtableName);
                    if (this._lastArr.length > 0) {
                        for (let i = 0; i < this._lastArr.length; i++) {
                            const _lastelement = this._lastArr[i];
                            for (let j = 0; j < this._arr.length; j++) {
                                const element = this._arr[j];
                                if (_lastelement.complete) {
                                    element.complete = true;
                                }
                                if (_lastelement.getAward) {
                                    element.getAward = true;
                                }
                                if (_lastelement.degreeNum > element.degreeNum) {
                                    element.degreeNum = _lastelement.degreeNum;
                                }
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _getlastVersion(lastVtableName) {
                    let dataArr = [];
                    try {
                        if (Laya.LocalStorage.getJSON(lastVtableName)) {
                            dataArr = JSON.parse(Laya.LocalStorage.getJSON(lastVtableName));
                        }
                    }
                    catch (error) {
                        console.log(lastVtableName + '前版本不存在！');
                    }
                    return dataArr;
                }
                _getProperty(name, pro) {
                    let value;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name === name) {
                                value = element[pro];
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _geConditionNumByName(name, pro) {
                    let value;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name === name) {
                                value = element.conditionNum;
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _getPitchIndexInArr() {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name === this._pitchName) {
                            return index;
                        }
                    }
                }
                _getPitchIndexInListArr() {
                    if (this._List) {
                        for (let index = 0; index < this._List.array.length; index++) {
                            const element = this._List.array[index];
                            if (element.name === this._pitchName) {
                                return index;
                            }
                        }
                    }
                }
                _listTweenToPitch(time, func) {
                    const index = this._getPitchIndexInListArr();
                    index && this._List.tweenTo(index, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listTweenToDiffIndexByPitch(diffIndex, time, func) {
                    const index = this._getPitchIndexInListArr();
                    index && this._List.tweenTo(index + diffIndex, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listScrollToFirstByLast() {
                    const index = this._List.array.length - 1;
                    index && this._List.scrollTo(index);
                }
                _setProperty(name, pro, value) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name == name) {
                                element[pro] = value;
                                this._refreshAndStorage();
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _setCompleteByName(name) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name == name) {
                                element.complete = true;
                                this._refreshAndStorage();
                                return;
                            }
                        }
                    }
                }
                ;
                _setCompleteByNameArr(nameArr) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        for (let index = 0; index < nameArr.length; index++) {
                            const name = nameArr[index];
                            if (element.name === name) {
                                element.complete = true;
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                ;
                _getObjByName(name) {
                    let obj = null;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name == name) {
                                obj = element;
                                break;
                            }
                        }
                    }
                    return obj;
                }
                _setProSoleByClassify(name, pro, value) {
                    const obj = this._getObjByName(name);
                    const objArr = this._getArrByClassify(obj[this._property.classify]);
                    for (const key in objArr) {
                        if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                            const element = objArr[key];
                            if (element.name == name) {
                                element[pro] = value;
                            }
                            else {
                                element[pro] = !value;
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _setOneProForAll(pro, value) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] = value;
                    }
                    this._refreshAndStorage();
                }
                _setAllComplete() {
                    this._setOneProForAll(this._property.complete, true);
                    this._refreshAndStorage();
                }
                _setCompleteName(name) {
                    this._setProperty(name, this._property.complete, true);
                    this._refreshAndStorage();
                }
                _setOtherCompleteName(name) {
                    this._setProperty(name, this._property.otherComplete, true);
                    this._refreshAndStorage();
                }
                _setAllCompleteDelay(delay, eachFrontFunc, eachEndFunc, comFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        TimerAdmin._once(delay * index, this, () => {
                            const element = this._arr[index];
                            eachFrontFunc && eachFrontFunc(element.complete);
                            element.complete = true;
                            eachEndFunc && eachEndFunc();
                            if (index === this._arr.length - 1) {
                                comFunc && comFunc();
                            }
                            this._refreshAndStorage();
                        });
                    }
                }
                _setAllOtherComplete() {
                    this._setOneProForAll(this._property.otherComplete, true);
                    this._refreshAndStorage();
                }
                _setAllOtherCompleteDelay(delay, eachFrontFunc, eachEndFunc, comFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        TimerAdmin._once(delay * index, this, () => {
                            const element = this._arr[index];
                            eachFrontFunc && eachFrontFunc(element[this._property.otherComplete]);
                            element[this._property.otherComplete] = true;
                            eachEndFunc && eachEndFunc();
                            if (index === this._arr.length - 1) {
                                comFunc && comFunc();
                            }
                            this._refreshAndStorage();
                        });
                    }
                }
                _addProValueForAll(pro, valueFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] += valueFunc();
                    }
                    this._refreshAndStorage();
                }
                _setPitchProperty(pro, value) {
                    const obj = this._getPitchObj();
                    obj[pro] = value;
                    this._refreshAndStorage();
                    return value;
                }
                ;
                _getPitchProperty(pro) {
                    const obj = this._getPitchObj();
                    return obj[pro];
                }
                ;
                _randomOneObjByPro(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (value) {
                                if (element[proName] && element[proName] == value) {
                                    arr.push(element);
                                }
                            }
                            else {
                                if (element[proName]) {
                                    arr.push(element);
                                }
                            }
                        }
                    }
                    if (arr.length == 0) {
                        return null;
                    }
                    else {
                        let any = ToolsAdmin._Array.randomGetOne(arr);
                        return any;
                    }
                }
                _randomOneObj() {
                    const index = ToolsAdmin._Number.randomOneBySection(0, this._arr.length - 1, true);
                    return this._arr[index];
                }
                _randomCountObj(count) {
                    const indexArr = ToolsAdmin._Number.randomCountBySection(0, this._arr.length - 1, count, true);
                    const arr = [];
                    for (let i = 0; i < this._arr.length; i++) {
                        for (let j = 0; j < indexArr.length; j++) {
                            if (i === indexArr[j]) {
                                arr.push(this._arr[i]);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByClassify(classify) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.classify] == classify) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByUnlockWay(_unlockWay) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.unlockWay === _unlockWay) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByPitchClassify() {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.classify] == this._pitchClassify) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByProperty(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName] && element[proName] == value) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getPitchClassfiyName() {
                    const obj = this._getObjByName(this._pitchName);
                    return obj[this._property.classify];
                }
                _getArrByNoProperty(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName] && element[proName] !== value) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _setArrByPropertyName(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName]) {
                                element[proName] == value;
                                arr.push(element);
                            }
                        }
                    }
                    this._refreshAndStorage();
                    return arr;
                }
                _setPropertyByClassify(classify, pro, value) {
                    const arr = this._getArrByClassify(classify);
                    for (const key in arr) {
                        if (Object.prototype.hasOwnProperty.call(arr, key)) {
                            const element = arr[key];
                            element[pro] = value;
                        }
                    }
                    this._refreshAndStorage();
                    return arr;
                }
                _setCompleteByClassify(classify) {
                    let arr = this._getArrByClassify(classify);
                    for (const key in arr) {
                        if (Object.prototype.hasOwnProperty.call(arr, key)) {
                            const element = arr[key];
                            element.complete = true;
                        }
                    }
                    this._refreshAndStorage();
                    return arr;
                }
                _checkCondition(name, number, func) {
                    let com = null;
                    number = number == undefined ? 1 : number;
                    let degreeNum = this._getProperty(name, this._property.degreeNum);
                    let condition = this._getProperty(name, this._property.conditionNum);
                    let complete = this._getProperty(name, this._property.complete);
                    if (!complete) {
                        if (condition <= degreeNum + number) {
                            this._setProperty(name, this._property.degreeNum, condition);
                            this._setProperty(name, this._property.complete, true);
                            com = true;
                        }
                        else {
                            this._setProperty(name, this._property.degreeNum, degreeNum + number);
                            com = false;
                        }
                    }
                    else {
                        com = -1;
                    }
                    if (func) {
                        func();
                    }
                    return com;
                }
                _checkConditionUnlockWay(_unlockWay, num) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.unlockWay === _unlockWay) {
                                this._checkCondition(element.name, num ? num : 1);
                            }
                        }
                    }
                    return arr;
                }
                _checkAllCompelet() {
                    let bool = true;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (!element.complete) {
                            bool = false;
                            return bool;
                        }
                    }
                    return bool;
                }
                get _pitchClassify() {
                    if (!this[`${this._tableName}/pitchClassify`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) : null;
                        }
                        else {
                            return this[`${this._tableName}/pitchClassify`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/pitchClassify`];
                    }
                }
                ;
                set _pitchClassify(str) {
                    this._lastPitchClassify = this[`${this._tableName}/pitchClassify`] ? this[`${this._tableName}/pitchClassify`] : null;
                    this[`${this._tableName}/pitchClassify`] = str;
                    if (this._localStorage) {
                        Laya.LocalStorage.setItem(`${this._tableName}/pitchClassify`, str.toString());
                    }
                    this._refreshAndStorage();
                }
                ;
                get _pitchName() {
                    if (!this[`${this._tableName}/_pitchName`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_pitchName`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_pitchName`];
                    }
                }
                ;
                set _pitchName(str) {
                    this._lastPitchName = this[`${this._tableName}/_pitchName`];
                    this[`${this._tableName}/_pitchName`] = str;
                    if (this._localStorage) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_pitchName`, str.toString());
                    }
                    this._refreshAndStorage();
                }
                ;
                get _lastPitchClassify() {
                    if (!this[`${this._tableName}/_lastPitchClassify`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_lastPitchClassify`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_lastPitchClassify`];
                    }
                }
                ;
                set _lastPitchClassify(str) {
                    this[`${this._tableName}/_lastPitchClassify`] = str;
                    if (this._localStorage && str) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchClassify`, str.toString());
                    }
                }
                ;
                get _lastPitchName() {
                    if (!this[`${this._tableName}/_lastPitchName`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_lastPitchName`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_lastPitchName`];
                    }
                }
                set _lastPitchName(str) {
                    this[`${this._tableName}/_lastPitchName`] = str;
                    if (this._localStorage && str) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchName`, str.toString());
                    }
                }
                ;
                _setPitch(name) {
                    let _calssify;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name == name) {
                            element.pitch = true;
                            _calssify = element[this._property.classify];
                        }
                        else {
                            element.pitch = false;
                        }
                    }
                    this._pitchClassify = _calssify;
                    this._pitchName = name;
                    this._refreshAndStorage();
                }
                _getPitchObj() {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name === this._pitchName) {
                                return element;
                            }
                        }
                    }
                }
                _addObject(obj) {
                    let _obj = ToolsAdmin._ObjArray.objCopy(obj);
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name === _obj.name) {
                            this._arr[index] == _obj;
                        }
                    }
                    this._refreshAndStorage();
                }
                _addObjectArr(objArr) {
                    const _objArr = ToolsAdmin._ObjArray.arrCopy(objArr);
                    for (let i = 0; i < _objArr.length; i++) {
                        const obj = _objArr[i];
                        for (let j = 0; j < this._arr.length; j++) {
                            const element = this._arr[j];
                            if (obj && obj.name === element.name) {
                                this._arr[j] = obj;
                                _objArr.splice(i, 1);
                                i--;
                                continue;
                            }
                        }
                    }
                    for (let k = 0; k < _objArr.length; k++) {
                        const element = _objArr[k];
                        this._arr.push(element);
                    }
                    this._refreshAndStorage();
                }
                _deleteObjByName(name) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name === name) {
                            this._arr.splice(index, 1);
                            index--;
                        }
                    }
                    this._refreshAndStorage();
                }
                _sortByProperty(pro, indexPro, inverted) {
                    ToolsAdmin._ObjArray.sortByProperty(this._arr, pro);
                    if (inverted == undefined || inverted) {
                        for (let index = this._arr.length - 1; index >= 0; index--) {
                            const element = this._arr[index];
                            element[indexPro] = this._arr.length - index;
                        }
                        this._arr.reverse();
                    }
                    else {
                        for (let index = 0; index < this._arr.length; index++) {
                            const element = this._arr[index];
                            element[indexPro] = index + 1;
                        }
                    }
                    this._refreshAndStorage();
                }
            }
            DataAdmin._Table = _Table;
            function addCompare(tableArr, storageName, propertyName) {
                try {
                    Laya.LocalStorage.getJSON(storageName);
                }
                catch (error) {
                    Laya.LocalStorage.setJSON(storageName, JSON.stringify(tableArr));
                    return tableArr;
                }
                let storeArr;
                if (Laya.LocalStorage.getJSON(storageName)) {
                    storeArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                    let diffArray = ToolsAdmin._ObjArray.diffProByTwo(tableArr, storeArr, propertyName);
                    console.log(`${storageName}新添加对象`, diffArray);
                    ToolsAdmin._Array.addToarray(storeArr, diffArray);
                }
                else {
                    storeArr = tableArr;
                }
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(storeArr));
                return storeArr;
            }
            function _jsonCompare(url, storageName, propertyName) {
                let dataArr;
                try {
                    Laya.LocalStorage.getJSON(storageName);
                }
                catch (error) {
                    dataArr = Laya.loader.getRes(url)['RECORDS'];
                    Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                    return dataArr;
                }
                if (Laya.LocalStorage.getJSON(storageName)) {
                    dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                    console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                    try {
                        let dataArr_0 = Laya.loader.getRes(url)['RECORDS'];
                        if (dataArr_0.length >= dataArr.length) {
                            let diffArray = ToolsAdmin._ObjArray.diffProByTwo(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            ToolsAdmin._Array.addToarray(dataArr, diffArray);
                        }
                        else {
                            console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                        }
                    }
                    catch (error) {
                        console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                else {
                    try {
                        dataArr = Laya.loader.getRes(url)['RECORDS'];
                    }
                    catch (error) {
                        console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                return dataArr;
            }
        })(DataAdmin = Lwg.DataAdmin || (Lwg.DataAdmin = {}));
        let ColorAdmin;
        (function (ColorAdmin) {
            function RGBToHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            ColorAdmin.RGBToHexString = RGBToHexString;
            function HexStringToRGB(str) {
                let r, g, b;
                r = (0xff << 16 & str) >> 16;
                g = (0xff << 8 & str) >> 8;
                b = 0xff & str;
                return [r, g, b];
            }
            ColorAdmin.HexStringToRGB = HexStringToRGB;
            function _colour(node, RGBA, vanishtime) {
                let cf = new Laya.ColorFilter();
                node.blendMode = 'null';
                if (!RGBA) {
                    cf.color(ToolsAdmin._Number.randomOneBySection(255, 100, true), ToolsAdmin._Number.randomOneBySection(255, 100, true), ToolsAdmin._Number.randomOneBySection(255, 100, true), 1);
                }
                else {
                    cf.color(RGBA[0], RGBA[1], RGBA[2], RGBA[3]);
                }
                node.filters = [cf];
                if (vanishtime) {
                    Laya.timer.once(vanishtime, this, () => {
                        for (let index = 0; index < node.filters.length; index++) {
                            if (node.filters[index] == cf) {
                                node.filters = [];
                                break;
                            }
                        }
                    });
                }
                return cf;
            }
            ColorAdmin._colour = _colour;
            function _changeOnce(node, RGBA, time, func) {
                if (!node) {
                    return;
                }
                let cf = new Laya.ColorFilter();
                cf.color(0, 0, 0, 0);
                let speedR = RGBA[0] / time;
                let speedG = RGBA[1] / time;
                let speedB = RGBA[2] / time;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = RGBA[3] / time;
                }
                let caller = {
                    add: true,
                };
                let R = 0, G = 0, B = 0, A = 0;
                TimerAdmin._frameLoop(1, caller, () => {
                    if (R < RGBA[0] && caller.add) {
                        R += speedR;
                        G += speedG;
                        B += speedB;
                        if (speedA !== 0)
                            A += speedA;
                        if (R >= RGBA[0]) {
                            caller.add = false;
                        }
                    }
                    else {
                        R -= speedR;
                        G -= speedG;
                        B -= speedB;
                        if (speedA !== 0)
                            A -= speedA;
                        if (R <= 0) {
                            if (func) {
                                func();
                            }
                            Laya.timer.clearAll(caller);
                        }
                    }
                    cf.color(R, G, B, A);
                    node.filters = [cf];
                });
            }
            ColorAdmin._changeOnce = _changeOnce;
            function _changeConstant(node, RGBA1, RGBA2, frameTime) {
                let cf;
                let RGBA0 = [];
                if (!node.filters) {
                    cf = new Laya.ColorFilter();
                    cf.color(RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1);
                    RGBA0 = [RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1];
                    node.filters = [cf];
                }
                else {
                    cf = node.filters[0];
                    RGBA0 = [node.filters[0]['_alpha'][0], node.filters[0]['_alpha'][1], node.filters[0]['_alpha'][2], node.filters[0]['_alpha'][3] ? node.filters[0]['_alpha'][3] : 1];
                }
                let RGBA = [ToolsAdmin._Number.randomCountBySection(RGBA1[0], RGBA2[0])[0], ToolsAdmin._Number.randomCountBySection(RGBA1[1], RGBA2[1])[0], ToolsAdmin._Number.randomCountBySection(RGBA1[2], RGBA2[2])[0], ToolsAdmin._Number.randomCountBySection(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
                let speedR = (RGBA[0] - RGBA0[0]) / frameTime;
                let speedG = (RGBA[1] - RGBA0[1]) / frameTime;
                let speedB = (RGBA[2] - RGBA0[2]) / frameTime;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = (RGBA[3] - RGBA0[3]) / frameTime;
                }
                if (node['changeCaller']) {
                    Laya.timer.clearAll(node['changeCaller']);
                }
                let changeCaller = {};
                node['changeCaller'] = changeCaller;
                let _time = 0;
                TimerAdmin._frameLoop(1, changeCaller, () => {
                    _time++;
                    if (_time <= frameTime) {
                        RGBA0[0] += speedR;
                        RGBA0[1] += speedG;
                        RGBA0[2] += speedB;
                    }
                    else {
                        Laya.timer.clearAll(changeCaller);
                    }
                    cf.color(RGBA0[0], RGBA0[1], RGBA0[2], RGBA0[3]);
                    node.filters = [cf];
                });
            }
            ColorAdmin._changeConstant = _changeConstant;
        })(ColorAdmin = Lwg.ColorAdmin || (Lwg.ColorAdmin = {}));
        let Eff3DAdmin;
        (function (Eff3DAdmin) {
            Eff3DAdmin._tex2D = {
                爱心2: {
                    url: 'Lwg/Effects/3D/aixin2.png',
                    texture2D: null,
                    name: '爱心2',
                },
                星星8: {
                    url: 'Lwg/Effects/3D/star8.png',
                    texture2D: null,
                    name: '星星8',
                },
                星星5: {
                    url: 'Lwg/Effects/3D/star5.png',
                    texture2D: null,
                    name: '星星5',
                },
                圆形发光: {
                    url: 'Lwg/Effects/3D/yuanfaguang.png',
                    texture2D: null,
                    name: '圆形发光',
                }
            };
            let _Particle;
            (function (_Particle) {
                class _Caller {
                    constructor(_time, _appear, _move, _vinish, _frameFuncInterval, _frameFunc, _endFunc) {
                        this.time = 0;
                        this.appear = true;
                        this.move = false;
                        this.vinish = false;
                        this.frame = {
                            interval: 1,
                            func: null,
                        };
                        this.end = false;
                        this.stateType = {
                            appear: 'appear',
                            move: 'move',
                            vinish: 'vinish',
                            end: 'end',
                        };
                        this._positionByARY_FA = 0;
                        this._positionARXY_FR = 0;
                        this._positionByTimeRecord = 0;
                        this.frame.interval = _frameFuncInterval ? _frameFuncInterval : 1;
                        this.frame.func = _frameFunc ? _frameFunc : null;
                        this.endFunc = _endFunc ? _endFunc : null;
                        this.time = _time ? _time : 0;
                        this.appear = _appear ? _appear : true;
                        this.move = _move ? _move : false;
                        this.vinish = _vinish ? _vinish : false;
                        TimerAdmin._frameLoop(1, this, () => {
                            this.time++;
                            if (this.box) {
                                if (!this.box.parent) {
                                    this.clear();
                                    return;
                                }
                            }
                            this.time % this.frame.interval == 0 && this.frame.func && this.frame.func();
                            this.appear && this.appearFunc && this.appearFunc();
                            this.move && this.moveFunc && this.moveFunc();
                            this.vinish && this.vinishFunc && this.vinishFunc();
                            this.end && this.endFunc && this.endFunc();
                            this.everyFrameFunc && this.everyFrameFunc();
                            this.clear();
                        });
                    }
                    get box() {
                        if (!this['_box']) {
                            console.log('粒子没有初始化！');
                        }
                        return this['_box'];
                    }
                    set box(_box) {
                        this['_box'] = _box;
                    }
                    stateSwitch(str) {
                        if (str == 'a' || str == 'appear') {
                            this.appear = true;
                            this.move = false;
                            this.vinish = false;
                            this.end = false;
                        }
                        if (str == 'm' || str == 'move') {
                            this.appear = false;
                            this.move = true;
                        }
                        else if (str == 'v' || str == 'vinish') {
                            this.move = false;
                            this.vinish = true;
                        }
                        else if (str == 'e' || str == 'end') {
                            this.vinish = false;
                            this.end = true;
                        }
                    }
                    clear() {
                        if (this.end) {
                            this.mat.destroy();
                            this.box.meshFilter.destroy();
                            this.box.destroy();
                            Laya.timer.clearAll(this);
                        }
                    }
                    _boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA) {
                        const _scaleX = sectionSize ? ToolsAdmin._Number.randomOneBySection(sectionSize[0][0], sectionSize[1][0]) : ToolsAdmin._Number.randomOneBySection(0.06, 0.08);
                        const _scaleY = sectionSize ? ToolsAdmin._Number.randomOneBySection(sectionSize[0][1], sectionSize[1][1]) : ToolsAdmin._Number.randomOneBySection(0.06, 0.08);
                        const _scaleZ = sectionSize ? ToolsAdmin._Number.randomOneBySection(sectionSize[0][2], sectionSize[1][2]) : ToolsAdmin._Number.randomOneBySection(0.06, 0.08);
                        this.box = parent.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(_scaleX, _scaleY, _scaleZ)));
                        if (position) {
                            this.box.transform.position = new Laya.Vector3(position[0], position[1], position[2]);
                        }
                        else {
                            this.box.transform.position = new Laya.Vector3(0, 0, 0);
                        }
                        this.fPosition = new Laya.Vector3(this.box.transform.position.x, this.box.transform.position.y, this.box.transform.position.z);
                        this.box.transform.localRotationEulerX = sectionRotation ? ToolsAdmin._Number.randomOneBySection(sectionRotation[0][0], sectionRotation[1][0]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                        this.box.transform.localRotationEulerX = sectionRotation ? ToolsAdmin._Number.randomOneBySection(sectionRotation[0][1], sectionRotation[1][1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                        this.box.transform.localRotationEulerX = sectionRotation ? ToolsAdmin._Number.randomOneBySection(sectionRotation[0][2], sectionRotation[1][2]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                        this.fEuler = new Laya.Vector3(this.box.transform.localRotationEulerX, this.box.transform.localRotationEulerY, this.box.transform.localRotationEulerZ);
                        const mat = this.box.meshRenderer.material = new Laya.BlinnPhongMaterial();
                        mat.albedoTexture = texArr ? ToolsAdmin._Array.randomGetOne(texArr) : Eff3DAdmin._tex2D.圆形发光.texture2D;
                        mat.renderMode = 2;
                        const R = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(10, 25);
                        const G = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(5, 15);
                        const B = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(5, 10);
                        const A = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        mat.albedoColor = new Laya.Vector4(R, G, B, A);
                        this.mat = mat;
                    }
                    get fPosition() {
                        return this['_fPosition'];
                    }
                    ;
                    set fPosition(fP) {
                        this['_fPosition'] = fP;
                    }
                    get fEuler() {
                        return this['_fEuler'];
                    }
                    set fEuler(fE) {
                        this['_fEuler'] = fE;
                    }
                    get mat() {
                        return this.box.meshRenderer.material;
                    }
                    set mat(m) {
                        this.box.meshRenderer.material = m;
                    }
                    _positionByARY(angleSpeed, radius, speedY, distance, stateSwitch) {
                        const pXZ = ToolsAdmin._Point.getRoundPosOld(this._positionByARY_FA += angleSpeed, radius, new Laya.Point(this.fPosition.x, this.fPosition.z));
                        this.box.transform.position = new Laya.Vector3(pXZ.x, this.box.transform.position.y += speedY, pXZ.y);
                        if (this.box.transform.position.y - this.fPosition.y > distance) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _positionARXY_R(angle, speedR, distance, stateSwitch) {
                        this._positionARXY_FR += speedR;
                        const point = ToolsAdmin._Point.getRoundPosOld(angle, this._positionARXY_FR, new Laya.Point(0, 0));
                        this.box.transform.position = new Laya.Vector3(this.fPosition.x + point.x, this.fPosition.y + point.y, this.fPosition.z);
                        if (this._positionARXY_FR >= distance) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _fadeAway(albedoColorASpeed, endNum = 0, stateSwitch) {
                        this.mat.albedoColorA -= albedoColorASpeed;
                        if (this.mat.albedoColorA <= endNum) {
                            this.mat.albedoColorA = endNum;
                            stateSwitch && stateSwitch();
                        }
                    }
                    _fadeIn(albedoColorASpeed, endNum = 1, stateSwitch) {
                        this.mat.albedoColorA += albedoColorASpeed;
                        if (this.mat.albedoColorA >= endNum) {
                            this.mat.albedoColorA = endNum;
                            stateSwitch && stateSwitch();
                        }
                    }
                    _positionByTime(posSpeed, time, stateSwitch) {
                        this._positionByTimeRecord++;
                        this.box.transform.position = new Laya.Vector3(this.box.transform.position.x += posSpeed[0], this.box.transform.position.y += posSpeed[1], this.box.transform.position.z += posSpeed[2]);
                        if (time && this._positionByTimeRecord > time) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _scaleX(scaleSpeedX, endNum, stateSwitch) {
                        this.box.transform.localScaleX += scaleSpeedX;
                        if (endNum) {
                            if (scaleSpeedX >= 0) {
                                if (this.box.transform.localScaleX >= endNum) {
                                    this.box.transform.localScaleX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localScaleX <= endNum) {
                                    this.box.transform.localScaleX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _scaleY(scaleSpeedY, endNum, stateSwitch) {
                        this.box.transform.localScaleY += scaleSpeedY;
                        if (endNum) {
                            if (scaleSpeedY >= 0) {
                                if (this.box.transform.localScaleY >= endNum) {
                                    this.box.transform.localScaleY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localScaleY <= endNum) {
                                    this.box.transform.localScaleY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _scaleZ(scaleSpeedZ, endNum, stateSwitch) {
                        this.box.transform.localScaleZ += scaleSpeedZ;
                        if (endNum) {
                            if (scaleSpeedZ >= 0) {
                                if (this.box.transform.localScaleZ >= endNum) {
                                    this.box.transform.localScaleZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localScaleZ <= endNum) {
                                    this.box.transform.localScaleZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _rotateX(rotateSpeedX, endNum, stateSwitch) {
                        this.box.transform.localRotationEulerX += rotateSpeedX;
                        if (endNum) {
                            if (rotateSpeedX >= 0) {
                                if (this.box.transform.localRotationEulerX >= endNum) {
                                    this.box.transform.localRotationEulerX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localRotationEulerX <= endNum) {
                                    this.box.transform.localRotationEulerX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _rotateY(rotateSpeedY, endNum, stateSwitch) {
                        this.box.transform.localRotationEulerY += rotateSpeedY;
                        if (endNum) {
                            if (rotateSpeedY >= 0) {
                                if (this.box.transform.localRotationEulerY >= endNum) {
                                    this.box.transform.localRotationEulerY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localRotationEulerY <= endNum) {
                                    this.box.transform.localRotationEulerY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _rotateZ(rotateSpeedZ, endNum, stateSwitch) {
                        this.box.transform.localRotationEulerZ += rotateSpeedZ;
                        if (endNum) {
                            if (rotateSpeedZ >= 0) {
                                if (this.box.transform.localRotationEulerZ >= endNum) {
                                    this.box.transform.localRotationEulerZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localRotationEulerZ <= endNum) {
                                    this.box.transform.localRotationEulerZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _randomScopeByPosition(scopeSize) {
                        scopeSize = scopeSize ? scopeSize : [[0.1, 0.1, 0.1], [0.3, 0.3, 0.3]];
                        ToolsAdmin._3D.randomScopeByPosition(this.box, scopeSize);
                    }
                    _excludeZ() {
                        this.box.transform.localScaleZ = 0;
                    }
                    _rotateTheZero() {
                        this.box.transform.localRotationEulerZ = 0;
                        this.box.transform.localRotationEulerX = 0;
                        this.box.transform.localRotationEulerY = 0;
                    }
                    _scaleTheZero() {
                        this.box.transform.localRotationEulerZ = 0;
                        this.box.transform.localRotationEulerX = 0;
                        this.box.transform.localRotationEulerY = 0;
                    }
                }
                _Particle._Caller = _Caller;
                function _spiral(parent, position, sectionSize, sectionRotation, texArr, colorRGBA, distance, speedY, angleSpeed, radius) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    const _distance = ToolsAdmin._Number.randomNumerical(distance, [1.5, 1.5]);
                    const _speedY = ToolsAdmin._Number.randomNumerical(speedY, [0.02, 0.02]);
                    const _angleSpeed = ToolsAdmin._Number.randomNumerical(angleSpeed, [6, 6]);
                    const _radius = ToolsAdmin._Number.randomNumerical(radius, [0.5, 0.5]);
                    caller.mat.albedoColorA = 0;
                    caller.stateSwitch('m');
                    caller.moveFunc = () => {
                        caller._fadeIn(0.2);
                        caller._positionByARY(_angleSpeed, _radius, _speedY, _distance, () => {
                            caller.stateSwitch('v');
                        });
                    };
                    caller.vinishFunc = () => {
                        caller._fadeAway(0.15, 0, () => {
                            caller.stateSwitch('e');
                        });
                        caller._positionByTime([0, 0.002, 0]);
                    };
                    return caller;
                }
                _Particle._spiral = _spiral;
                function _explode(parent, position, sectionSize, sectionRotation, texArr, colorRGBA, distance, speedR) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    const _distance = ToolsAdmin._Number.randomNumerical(distance, [0.3, 0.6]);
                    const _speedR = ToolsAdmin._Number.randomNumerical(speedR, [0.008, 0.012]);
                    const _angle = ToolsAdmin._Number.randomNumerical([0, 360]);
                    caller.mat.albedoColorA = 0;
                    caller.stateSwitch('m');
                    caller.moveFunc = () => {
                        caller._fadeIn(0.15);
                        caller._positionARXY_R(_angle, _speedR, _distance, () => {
                            caller.stateSwitch('v');
                        });
                    };
                    caller.vinishFunc = () => {
                        caller._fadeAway(0.15, 0, () => {
                            caller.stateSwitch('e');
                        });
                    };
                    return;
                }
                _Particle._explode = _explode;
                function _fade(parent, position, sectionSize, staytime, vainshASpeed, vainshSSpeed, sectionRotation, texArr, colorRGBA) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, sectionSize ? sectionSize : [[0.04, 0.04, 0], [0.04, 0.04, 0]], sectionRotation, texArr, colorRGBA);
                    caller._excludeZ();
                    const _staytime = staytime ? staytime : 20;
                    const _vainshASpeed = vainshASpeed ? vainshASpeed : 0.02;
                    const _vainshSSpeed = vainshSSpeed ? vainshSSpeed : 0.02;
                    caller._rotateTheZero();
                    caller.stateSwitch('m');
                    caller.moveFunc = () => {
                        if (caller.time > _staytime) {
                            caller.stateSwitch('v');
                        }
                    };
                    caller.vinishFunc = () => {
                        caller._scaleX(_vainshSSpeed);
                        caller._fadeAway(_vainshASpeed, 0, () => {
                            caller.stateSwitch('e');
                        });
                    };
                    caller.everyFrameFunc = () => {
                        caller.box.transform.localScaleY = caller.box.transform.localScaleX;
                    };
                    return caller;
                }
                _Particle._fade = _fade;
                function _starsShine(parent, position, scopeSize, scaleSpeed, maxScale, angelspeed, ASpeed, texArr, colorRGBA) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, null, null, texArr ? texArr : [Eff3DAdmin._tex2D.星星5.texture2D], colorRGBA ? colorRGBA : [[15, 15, 15, 1], [30, 30, 30, 1]]);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    caller._scaleTheZero();
                    caller._randomScopeByPosition(scopeSize);
                    caller.mat.albedoColorA = 0;
                    const _maxScale = ToolsAdmin._Number.randomNumerical(maxScale, [1, 2]);
                    const _scaleSpeed = ToolsAdmin._Number.randomNumerical(scaleSpeed, [0.01, 0.05]);
                    const _angelspeed = ToolsAdmin._Number.randomNumerical(angelspeed, [2, 6], true);
                    const _ASpeed = ToolsAdmin._Number.randomNumerical(ASpeed, [0.01, 0.05]);
                    caller.appearFunc = () => {
                        caller._fadeIn(_ASpeed, 1, () => {
                            caller.stateSwitch('m');
                        });
                        caller._scaleX(_scaleSpeed, 1);
                        caller._rotateZ(_angelspeed);
                    };
                    caller.moveFunc = () => {
                        caller._scaleX(_scaleSpeed, _maxScale, () => {
                            caller.stateSwitch('v');
                        });
                        caller._rotateZ(_angelspeed);
                    };
                    caller.vinishFunc = () => {
                        caller._fadeAway(_ASpeed, 0, () => {
                            caller.stateSwitch('e');
                        });
                        caller._scaleX(-_scaleSpeed);
                        caller._rotateZ(-_angelspeed);
                    };
                    caller.everyFrameFunc = () => {
                        caller.box.transform.localScaleY = caller.box.transform.localScaleX;
                    };
                    return caller;
                }
                _Particle._starsShine = _starsShine;
            })(_Particle = Eff3DAdmin._Particle || (Eff3DAdmin._Particle = {}));
        })(Eff3DAdmin = Lwg.Eff3DAdmin || (Lwg.Eff3DAdmin = {}));
        let Eff2DAdmin;
        (function (Eff2DAdmin) {
            let _SkinUrl;
            (function (_SkinUrl) {
                _SkinUrl["\u7231\u5FC31"] = "Lwg/Effects/aixin1.png";
                _SkinUrl["\u7231\u5FC32"] = "Lwg/Effects/aixin2.png";
                _SkinUrl["\u7231\u5FC33"] = "Lwg/Effects/aixin3.png";
                _SkinUrl["\u82B11"] = "Lwg/Effects/hua1.png";
                _SkinUrl["\u82B12"] = "Lwg/Effects/hua2.png";
                _SkinUrl["\u82B13"] = "Lwg/Effects/hua3.png";
                _SkinUrl["\u82B14"] = "Lwg/Effects/hua4.png";
                _SkinUrl["\u661F\u661F1"] = "Lwg/Effects/star1.png";
                _SkinUrl["\u661F\u661F2"] = "Lwg/Effects/star2.png";
                _SkinUrl["\u661F\u661F3"] = "Lwg/Effects/star3.png";
                _SkinUrl["\u661F\u661F4"] = "Lwg/Effects/star4.png";
                _SkinUrl["\u661F\u661F5"] = "Lwg/Effects/star5.png";
                _SkinUrl["\u661F\u661F6"] = "Lwg/Effects/star6.png";
                _SkinUrl["\u661F\u661F7"] = "Lwg/Effects/star7.png";
                _SkinUrl["\u661F\u661F8"] = "Lwg/Effects/star8.png";
                _SkinUrl["\u83F1\u5F621"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u83F1\u5F622"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u83F1\u5F623"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u77E9\u5F621"] = "Lwg/Effects/rectangle1.png";
                _SkinUrl["\u77E9\u5F622"] = "Lwg/Effects/rectangle2.png";
                _SkinUrl["\u77E9\u5F623"] = "Lwg/Effects/rectangle3.png";
                _SkinUrl["\u96EA\u82B11"] = "Lwg/Effects/xuehua1.png";
                _SkinUrl["\u53F6\u5B501"] = "Lwg/Effects/yezi1.png";
                _SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Lwg/Effects/yuanfaguang.png";
                _SkinUrl["\u5706\u5F621"] = "Lwg/Effects/yuan1.png";
                _SkinUrl["\u65B9\u5F62\u5149\u57081"] = "Lwg/Effects/ui_square_guang1.png";
                _SkinUrl["\u65B9\u5F62\u5706\u89D2\u5149\u57081"] = "Lwg/Effects/ui_square_guang2.png";
                _SkinUrl["\u5706\u5F62\u5C0F\u5149\u73AF"] = "Lwg/Effects/xiaoguanghuan.png";
                _SkinUrl["\u5149\u57082"] = "Lwg/Effects/guangquan2.png";
                _SkinUrl["\u4E09\u89D2\u5F621"] = "Lwg/Effects/triangle1.png";
                _SkinUrl["\u4E09\u89D2\u5F622"] = "Lwg/Effects/triangle2.png";
            })(_SkinUrl = Eff2DAdmin._SkinUrl || (Eff2DAdmin._SkinUrl = {}));
            let _Aperture;
            (function (_Aperture) {
                class _ApertureImage extends Laya.Image {
                    constructor(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        centerPoint ? this.pos(centerPoint[0], centerPoint[1]) : this.pos(0, 0);
                        this.width = size ? size[0] : 100;
                        this.height = size ? size[1] : 100;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.rotation = rotation ? ToolsAdmin._Number.randomOneBySection(rotation[0], rotation[1]) : ToolsAdmin._Number.randomOneBySection(360);
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.花3;
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(180, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        ColorAdmin._colour(this, RGBA);
                    }
                }
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
                    const Img = new _ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    if (minScale) {
                        Img.scale(minScale[0], minScale[1]);
                    }
                    else {
                        Img.scale(0, 0);
                    }
                    const _maxScale = maxScale ? ToolsAdmin._Number.randomOneBySection(maxScale[0], maxScale[1]) : 2;
                    let moveCaller = {
                        alpha: true,
                        scale: false,
                        vanish: false
                    };
                    Img['moveCaller'] = moveCaller;
                    let acc = 0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            Img.alpha += 0.05;
                            acc = 0;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.scale = true;
                            }
                        }
                        if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX >= _maxScale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        if (moveCaller.vanish) {
                            Img.alpha -= 0.015;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        Img.scaleX = Img.scaleY += (_speed + acc);
                    });
                }
                _Aperture._continuous = _continuous;
                function _continuousByDs(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
                    const Img = new _ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    if (minScale) {
                        Img.scale(minScale[0], minScale[1]);
                    }
                    else {
                        Img.scale(0, 0);
                    }
                    const _maxScale = maxScale ? ToolsAdmin._Number.randomOneBySection(maxScale[0], maxScale[1]) : 2;
                    let moveCaller = {
                        alpha: true,
                        scale: false,
                        vanish: false
                    };
                    Img['moveCaller'] = moveCaller;
                    let acc = 0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            Img.alpha += 0.05;
                            acc = 0;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.scale = true;
                            }
                        }
                        if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX > _maxScale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        if (moveCaller.vanish) {
                            acc -= _accelerated;
                            if (acc <= 0) {
                                acc = 0;
                                Img.alpha -= 0.015;
                                if (Img.alpha <= 0) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                            }
                        }
                        Img.scaleX = Img.scaleY += (_speed + acc);
                    });
                }
                _Aperture._continuousByDs = _continuousByDs;
            })(_Aperture = Eff2DAdmin._Aperture || (Eff2DAdmin._Aperture = {}));
            let _Particle;
            (function (_Particle) {
                class _ParticleImgBase extends Laya.Image {
                    constructor(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        parent.addChild(this);
                        let sectionWidth = sectionWH ? ToolsAdmin._Number.randomOneBySection(sectionWH[0]) : ToolsAdmin._Number.randomOneBySection(200);
                        let sectionHeight = sectionWH ? ToolsAdmin._Number.randomOneBySection(sectionWH[1]) : ToolsAdmin._Number.randomOneBySection(50);
                        sectionWidth = ToolsAdmin._Number.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                        sectionHeight = ToolsAdmin._Number.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                        this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                        this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                        this.width = width ? ToolsAdmin._Number.randomOneBySection(width[0], width[1]) : ToolsAdmin._Number.randomOneBySection(20, 50);
                        this.height = height ? ToolsAdmin._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.圆形1;
                        this.rotation = rotation ? ToolsAdmin._Number.randomOneBySection(rotation[0], rotation[1]) : 0;
                        this.alpha = 0;
                        this.zOrder = zOrder ? zOrder : 1000;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(180, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        ColorAdmin._colour(this, RGBA);
                    }
                }
                _Particle._ParticleImgBase = _ParticleImgBase;
                function _snow(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, rotationSpeed, speed, windX) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _rotationSpeed = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 1);
                    _rotationSpeed = ToolsAdmin._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(1, 2.5);
                    let _windX = windX ? ToolsAdmin._Number.randomOneBySection(windX[0], windX[1]) : 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance0 = 0;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.x += _windX;
                        Img.rotation += _rotationSpeed;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.05;
                            distance0 = Img.y++;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 < distance1 && moveCaller.move) {
                            distance0 = Img.y += speed0;
                            if (distance0 >= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.03;
                            Img.y += speed0;
                            if (Img.alpha <= 0 || speed0 <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._snow = _snow;
                function _downwardSpray(parent, point, width, height, angle, urlArr, colorRGBA, vanishDistance, moveSpeed, gravity, accelerated, rotationSpeed, scaleRotationSpeed, skewSpeed, zOrder) {
                    const Img = new _ParticleImgBase(parent, point, [0, 0], width, height, null, urlArr, colorRGBA, zOrder);
                    const _angle = angle ? ToolsAdmin._Number.randomOneBySection(angle[0], angle[1]) : ToolsAdmin._Number.randomOneBySection(0, 90);
                    const p = ToolsAdmin._Point.angleByPoint(_angle);
                    const _vanishDistance = vanishDistance ? ToolsAdmin._Number.randomOneBySection(vanishDistance[0], vanishDistance[1]) : ToolsAdmin._Number.randomOneBySection(200, 800);
                    let _speed = moveSpeed ? ToolsAdmin._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : ToolsAdmin._Number.randomOneBySection(10, 30);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.3, 1.5);
                    const _gravity = gravity ? ToolsAdmin._Number.randomOneBySection(gravity[0], gravity[1]) : ToolsAdmin._Number.randomOneBySection(1, 5);
                    let acc = 0;
                    const moveCaller = {
                        appear: true,
                        move: false,
                        dropFp: null,
                        drop: false,
                        vinish: false,
                        scaleSub: true,
                        scaleAdd: false,
                        rotateFunc: null,
                    };
                    moveCaller.rotateFunc = rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed);
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        moveCaller.rotateFunc();
                        if (moveCaller.appear) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.move = true;
                            }
                            Img.x += p.x * _speed;
                            Img.y += p.y * _speed;
                        }
                        if (moveCaller.move) {
                            acc -= accelerated0;
                            const speed0 = _speed + acc;
                            Img.x += p.x * speed0;
                            Img.y += p.y * speed0;
                            if (speed0 <= 1) {
                                _speed = 1;
                                moveCaller.dropFp = new Laya.Point(Img.x, Img.y);
                                moveCaller.move = false;
                                moveCaller.drop = true;
                            }
                        }
                        if (moveCaller.drop) {
                            Img.x += p.x * _speed;
                            Img.y += p.y * _speed;
                            if (moveCaller.dropFp.distance(Img.x, Img.y) > _vanishDistance) {
                                moveCaller.drop = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0.3) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        Img.y += _gravity;
                    });
                    return Img;
                }
                _Particle._downwardSpray = _downwardSpray;
                function rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed) {
                    let _rotationSpeed = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 1);
                    _rotationSpeed = ToolsAdmin._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    const _scaleSpeed = scaleRotationSpeed ? ToolsAdmin._Number.randomOneBySection(scaleRotationSpeed[0], scaleRotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 0.25);
                    const _scaleDir = ToolsAdmin._Number.randomOneHalf();
                    let _skewSpeed = skewSpeed ? ToolsAdmin._Number.randomOneBySection(skewSpeed[0], skewSpeed[1]) : ToolsAdmin._Number.randomOneBySection(1, 10);
                    _skewSpeed = ToolsAdmin._Number.randomOneHalf() === 1 ? _skewSpeed : -_skewSpeed;
                    const _skewDir = ToolsAdmin._Number.randomOneHalf();
                    const _scaleOrSkew = ToolsAdmin._Number.randomOneHalf();
                    var rotateFunc = () => {
                        Img.rotation += _rotationSpeed;
                        if (_scaleOrSkew === 1) {
                            if (_skewDir === 1) {
                                Img.skewX += _skewSpeed;
                            }
                            else {
                                Img.skewY += _skewSpeed;
                            }
                        }
                        else {
                            if (_scaleDir === 1) {
                                if (Img['moveCaller']['scaleSub']) {
                                    Img.scaleX -= _scaleSpeed;
                                    if (Img.scaleX <= 0) {
                                        Img['moveCaller']['scaleSub'] = false;
                                    }
                                }
                                else {
                                    Img.scaleX += _scaleSpeed;
                                    if (Img.scaleX >= 1) {
                                        Img['moveCaller']['scaleSub'] = true;
                                    }
                                }
                            }
                            else {
                                if (Img['moveCaller']['scaleSub']) {
                                    Img.scaleY -= _scaleSpeed;
                                    if (Img.scaleY <= 0) {
                                        Img['moveCaller']['scaleSub'] = false;
                                    }
                                }
                                else {
                                    Img.scaleY += _scaleSpeed;
                                    if (Img.scaleY >= 1) {
                                        Img['moveCaller']['scaleSub'] = true;
                                    }
                                }
                            }
                        }
                    };
                    return rotateFunc;
                }
                function _fallingRotate(parent, centerPoint, sectionWH, width, height, urlArr, colorRGBA, distance, moveSpeed, scaleRotationSpeed, skewSpeed, rotationSpeed, zOrder) {
                    const Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, null, urlArr, colorRGBA, zOrder);
                    const _moveSpeed = moveSpeed ? ToolsAdmin._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : ToolsAdmin._Number.randomOneBySection(1, 2.5);
                    let _distance0 = 0;
                    const _distance = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    const moveCaller = {
                        appear: true,
                        move: false,
                        vinish: false,
                        scaleSub: true,
                        scaleAdd: false,
                        rotateFunc: null,
                    };
                    moveCaller.rotateFunc = rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed);
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        moveCaller.rotateFunc();
                        if (moveCaller.appear) {
                            Img.alpha += 0.05;
                            Img.y += _moveSpeed / 2;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.move = true;
                            }
                        }
                        if (moveCaller.move) {
                            Img.y += _moveSpeed;
                            _distance0 += _moveSpeed;
                            if (_distance0 >= _distance) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.01;
                            Img.y += _moveSpeed;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingRotate = _fallingRotate;
                function _fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(4, 8);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    let fY = Img.y;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.04;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (!moveCaller.alpha) {
                            acc += accelerated0;
                            Img.y += (speed0 + acc);
                        }
                        if (!moveCaller.alpha && moveCaller.move) {
                            if (Img.y - fY >= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.03;
                            if (Img.alpha <= 0) {
                                Laya.timer.clearAll(moveCaller);
                                Img.removeSelf();
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingVertical = _fallingVertical;
                function _fallingVertical_Reverse(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(4, 8);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    let fY = Img.y;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.04;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (!moveCaller.alpha) {
                            acc += accelerated0;
                            Img.y += (speed0 + acc);
                        }
                        if (!moveCaller.alpha && moveCaller.move) {
                            if (Img.y - fY <= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.03;
                            if (Img.alpha <= 0) {
                                Laya.timer.clearAll(moveCaller);
                                Img.removeSelf();
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingVertical_Reverse = _fallingVertical_Reverse;
                function _slowlyUp(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(1.5, 2);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.001, 0.005);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let fy = Img.y;
                    let distance0 = 0;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(-250, -600);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.03;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 > distance1 && moveCaller.move) {
                        }
                        else {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.02;
                            Img.scaleX -= 0.005;
                            Img.scaleY -= 0.005;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        acc += accelerated0;
                        Img.y -= (speed0 + acc);
                        distance0 = fy - Img.y;
                    });
                    return Img;
                }
                _Particle._slowlyUp = _slowlyUp;
                function _sprayRound(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, time, moveAngle, rotationSpeed, zOrder) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let radius = 0;
                    const _time = time ? ToolsAdmin._Number.randomOneBySection(time[0], time[1]) : ToolsAdmin._Number.randomOneBySection(30, 50);
                    const _distance = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    const _speed = _distance / _time;
                    const _angle = moveAngle ? ToolsAdmin._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                    let rotationSpeed0 = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    rotationSpeed0 = ToolsAdmin._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
                    const vinishTime = ToolsAdmin._Number.randomOneInt(60);
                    const subAlpha = 1 / vinishTime;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else {
                            if (!moveCaller.vinish) {
                                radius += _speed;
                                let point = ToolsAdmin._Point.getRoundPosOld(_angle, radius, centerPoint0);
                                Img.pos(point.x, point.y);
                                if (radius > _distance) {
                                    moveCaller.move = false;
                                    moveCaller.vinish = true;
                                }
                            }
                            else {
                                Img.alpha -= subAlpha;
                                if (Img.alpha <= 0) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                                radius += _speed / 2;
                                let point = ToolsAdmin._Point.getRoundPosOld(_angle, radius, centerPoint0);
                                Img.pos(point.x, point.y);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._sprayRound = _sprayRound;
                function _spray(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, moveAngle, rotationSpeed, speed, accelerated, zOrder) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(3, 10);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    let angle0 = moveAngle ? ToolsAdmin._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                    let rotationSpeed0 = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    rotationSpeed0 = ToolsAdmin._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else {
                            if (radius < distance1 && moveCaller.move) {
                            }
                            else {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                            if (moveCaller.vinish) {
                                Img.alpha -= 0.05;
                                if (Img.alpha <= 0.3) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                            }
                            acc += accelerated0;
                            radius += speed0 + acc;
                            let point = ToolsAdmin._Point.getRoundPosOld(angle0, radius, centerPoint0);
                            Img.pos(point.x, point.y);
                        }
                    });
                    return Img;
                }
                _Particle._spray = _spray;
                function _outsideBox(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, curtailAngle, distance, rotateSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _angle = 0;
                    sectionWH = sectionWH ? sectionWH : [100, 100];
                    let fixedXY = ToolsAdmin._Number.randomOneHalf() == 0 ? 'x' : 'y';
                    curtailAngle = curtailAngle ? curtailAngle : 60;
                    if (fixedXY == 'x') {
                        if (ToolsAdmin._Number.randomOneHalf() == 0) {
                            Img.x += sectionWH[0];
                            _angle = ToolsAdmin._Number.randomOneHalf() == 0 ? ToolsAdmin._Number.randomOneBySection(0, 90 - curtailAngle) : ToolsAdmin._Number.randomOneBySection(0, -90 + curtailAngle);
                        }
                        else {
                            Img.x -= sectionWH[0];
                            _angle = ToolsAdmin._Number.randomOneBySection(90 + curtailAngle, 270 - curtailAngle);
                        }
                        Img.y += ToolsAdmin._Number.randomOneBySection(-sectionWH[1], sectionWH[1]);
                    }
                    else {
                        if (ToolsAdmin._Number.randomOneHalf() == 0) {
                            Img.y -= sectionWH[1];
                            _angle = ToolsAdmin._Number.randomOneBySection(180 + curtailAngle, 360 - curtailAngle);
                        }
                        else {
                            Img.y += sectionWH[1];
                            _angle = ToolsAdmin._Number.randomOneBySection(0 + curtailAngle, 180 - curtailAngle);
                        }
                        Img.x += ToolsAdmin._Number.randomOneBySection(-sectionWH[0], sectionWH[0]);
                    }
                    let p = ToolsAdmin._Point.angleByPoint(_angle);
                    let _distance = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(20, 50);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(0.5, 1);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let rotationSpeed0 = rotateSpeed ? ToolsAdmin._Number.randomOneBySection(rotateSpeed[0], rotateSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    let firstP = new Laya.Point(Img.x, Img.y);
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else if (moveCaller.move) {
                            if (firstP.distance(Img.x, Img.y) >= _distance) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0.3) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        if (!moveCaller.alpha) {
                            acc += accelerated0;
                            Img.x += p.x * (speed0 + acc);
                            Img.y += p.y * (speed0 + acc);
                        }
                    });
                    return Img;
                }
                _Particle._outsideBox = _outsideBox;
                function _moveToTargetToMove(parent, centerPoint, width, height, rotation, angle, urlArr, colorRGBA, zOrder, distance1, distance2, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(5, 6);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move1: false,
                        stop: false,
                        move2: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let dis1 = distance1 ? ToolsAdmin._Number.randomOneBySection(distance1[0], distance1[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    let dis2 = distance2 ? ToolsAdmin._Number.randomOneBySection(distance2[0], distance2[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    let angle0 = angle ? ToolsAdmin._Number.randomOneBySection(angle[0], angle[1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                    Img.rotation = angle0 - 90;
                    let rotationSpeed0 = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move1 = true;
                            }
                        }
                        else if (moveCaller.move1) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            if (radius >= dis1) {
                                moveCaller.move1 = false;
                                moveCaller.stop = true;
                            }
                        }
                        else if (moveCaller.stop) {
                            acc -= 0.3;
                            radius += 0.1;
                            if (acc <= 0) {
                                moveCaller.stop = false;
                                moveCaller.move2 = true;
                            }
                        }
                        else if (moveCaller.move2) {
                            acc += accelerated0 / 2;
                            radius += speed0 + acc;
                            if (radius >= dis1 + dis2) {
                                moveCaller.move2 = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
                            radius += 0.5;
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        let point = ToolsAdmin._Point.getRoundPosOld(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    });
                    return Img;
                }
                _Particle._moveToTargetToMove = _moveToTargetToMove;
                function _AnnularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOrder) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    width = width ? width : [25, 50];
                    Img.width = ToolsAdmin._Number.randomCountBySection(width[0], width[1])[0];
                    Img.height = height ? ToolsAdmin._Number.randomCountBySection(height[0], height[1])[0] : Img.width;
                    Img.pivotX = Img.width / 2;
                    Img.pivotY = Img.height / 2;
                    Img.skin = urlArr ? ToolsAdmin._Array.randomGetOut(urlArr)[0] : _SkinUrl[ToolsAdmin._Number.randomCountBySection(0, 12)[0]];
                    let radius0 = ToolsAdmin._Number.randomCountBySection(radius[0], radius[1])[0];
                    Img.alpha = 0;
                    let speed0 = speed ? ToolsAdmin._Number.randomCountBySection(speed[0], speed[1])[0] : ToolsAdmin._Number.randomCountBySection(5, 10)[0];
                    let angle = rotation ? ToolsAdmin._Number.randomCountBySection(rotation[0], rotation[1])[0] : ToolsAdmin._Number.randomCountBySection(0, 360)[0];
                    let caller = {};
                    let acc = 0;
                    accelerated = accelerated ? accelerated : 0.35;
                    TimerAdmin._frameLoop(1, caller, () => {
                        if (Img.alpha < 1) {
                            Img.alpha += 0.05;
                            acc += (accelerated / 5);
                            radius0 -= (speed0 / 2 + acc);
                        }
                        else {
                            acc += accelerated;
                            radius0 -= (speed0 + acc);
                        }
                        let point = ToolsAdmin._Point.getRoundPosOld(angle, radius0, centerPoint);
                        Img.pos(point.x, point.y);
                        if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                            Img.removeSelf();
                            Laya.timer.clearAll(caller);
                        }
                    });
                    return Img;
                }
                _Particle._AnnularInhalation = _AnnularInhalation;
            })(_Particle = Eff2DAdmin._Particle || (Eff2DAdmin._Particle = {}));
            let _Glitter;
            (function (_Glitter) {
                class _GlitterImage extends Laya.Image {
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.星星1;
                        this.width = width ? ToolsAdmin._Number.randomOneBySection(width[0], width[1]) : 80;
                        this.height = height ? ToolsAdmin._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let p = radiusXY ? ToolsAdmin._Point.randomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : ToolsAdmin._Point.randomPointByCenter(centerPos, 100, 100, 1);
                        this.pos(p[0].x, p[0].y);
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(10, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(200, 255);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(10, 255);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        ColorAdmin._colour(this, RGBA);
                        this.alpha = 0;
                        this.zOrder = zOder ? zOder : 1000;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed, zOder) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder);
                    Img.scaleX = 0;
                    Img.scaleY = 0;
                    let _scale = scale ? ToolsAdmin._Number.randomOneBySection(scale[0], scale[1]) : ToolsAdmin._Number.randomOneBySection(0.8, 1.2);
                    let _speed = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(0.01, 0.02);
                    let _rotateSpeed = rotateSpeed ? ToolsAdmin._Number.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : ToolsAdmin._Number.randomOneInt(0, 5);
                    _rotateSpeed = ToolsAdmin._Number.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
                    let moveCaller = {
                        appear: true,
                        scale: false,
                        vanish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    var ani = () => {
                        if (moveCaller.appear) {
                            Img.alpha += 0.1;
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.scale = true;
                            }
                        }
                        else if (moveCaller.scale) {
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
                            Img.rotation -= _rotateSpeed;
                            Img.alpha -= 0.015;
                            Img.scaleX -= 0.01;
                            Img.scaleY -= 0.01;
                            if (Img.scaleX <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, moveCaller, ani);
                    return Img;
                }
                _Glitter._blinkStar = _blinkStar;
                function _simpleInfinite(parent, x, y, width, height, zOrder, url, speed) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    Img.width = width;
                    Img.height = height;
                    Img.pos(x, y);
                    Img.skin = url ? url : _SkinUrl.方形光圈1;
                    Img.alpha = 0;
                    Img.zOrder = zOrder ? zOrder : 0;
                    let add = true;
                    let caller = {};
                    let func = () => {
                        if (!add) {
                            Img.alpha -= speed ? speed : 0.01;
                            if (Img.alpha <= 0) {
                                if (caller['end']) {
                                    Laya.timer.clearAll(caller);
                                    Img.removeSelf();
                                }
                                else {
                                    add = true;
                                }
                            }
                        }
                        else {
                            Img.alpha += speed ? speed * 2 : 0.01 * 2;
                            if (Img.alpha >= 1) {
                                add = false;
                                caller['end'] = true;
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, caller, func);
                    return Img;
                }
                _Glitter._simpleInfinite = _simpleInfinite;
            })(_Glitter = Eff2DAdmin._Glitter || (Eff2DAdmin._Glitter = {}));
            let _circulation;
            (function (_circulation) {
                class _circulationImage extends Laya.Image {
                    constructor(parent, urlArr, colorRGBA, width, height, zOrder) {
                        super();
                        parent.addChild(this);
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.圆形发光1;
                        this.width = width ? ToolsAdmin._Number.randomOneBySection(width[0], width[1]) : 80;
                        this.height = height ? ToolsAdmin._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        ColorAdmin._colour(this, RGBA);
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        this.scaleX = 0;
                        this.scaleY = 0;
                    }
                }
                _circulation._circulationImage = _circulationImage;
                function _corner(parent, posArray, urlArr, colorRGBA, width, height, zOrder, parallel, speed) {
                    if (posArray.length <= 1) {
                        return;
                    }
                    let Img = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                    let Imgfootprint = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                    Imgfootprint.filters = Img.filters;
                    Img.pos(posArray[0][0], posArray[0][1]);
                    Img.alpha = 1;
                    let moveCaller = {
                        num: 0,
                        alpha: true,
                        move: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let _speed = speed ? speed : 3;
                    let index = 0;
                    Img.scale(1, 1);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        let Imgfootprint = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                        Imgfootprint.filters = Img.filters;
                        Imgfootprint.x = Img.x;
                        Imgfootprint.y = Img.y;
                        Imgfootprint.rotation = Img.rotation;
                        Imgfootprint.alpha = 1;
                        Imgfootprint.zOrder = -1;
                        Imgfootprint.scaleX = Img.scaleX;
                        Imgfootprint.scaleY = Img.scaleY;
                        Ani2DAdmin.fadeOut(Imgfootprint, 1, 0, 200, 0, () => {
                            Imgfootprint.removeSelf();
                        });
                        if (Img.parent == null) {
                            Laya.timer.clearAll(moveCaller);
                        }
                        moveCaller.num++;
                        if (urlArr) {
                            if (moveCaller.num > urlArr.length) {
                                moveCaller.num = 0;
                            }
                            else {
                                Img.skin = urlArr[moveCaller.num];
                            }
                        }
                    });
                    var func = () => {
                        let targetXY = [posArray[index][0], posArray[index][1]];
                        let distance = (new Laya.Point(Img.x, Img.y)).distance(targetXY[0], targetXY[1]);
                        if (parallel) {
                            Img.rotation = ToolsAdmin._Point.pointByAngleOld(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                        }
                        let time = speed * 100 + distance / 5;
                        if (index == posArray.length + 1) {
                            targetXY = [posArray[0][0], posArray[0][1]];
                        }
                        Ani2DAdmin.move(Img, targetXY[0], targetXY[1], time, () => {
                            index++;
                            if (index == posArray.length) {
                                index = 0;
                            }
                            func();
                        });
                    };
                    func();
                    return Img;
                }
                _circulation._corner = _corner;
            })(_circulation = Eff2DAdmin._circulation || (Eff2DAdmin._circulation = {}));
        })(Eff2DAdmin = Lwg.Eff2DAdmin || (Lwg.Eff2DAdmin = {}));
        let ClickAdmin;
        (function (ClickAdmin) {
            ClickAdmin._absolute = true;
            ClickAdmin._filterType = {
                all: 'all',
                none: 'none',
                stage: 'stage',
                button: 'button',
                someBtnIncludeStage: 'someBtnIncludeStage',
                someBtnExcludeStage: 'someBtnExcludeStage',
            };
            ClickAdmin._filter = {
                get value() {
                    return this['ClickAdmin/filter'] ? this['ClickAdmin/filter'] : ClickAdmin._filterType.all;
                },
                set value(val) {
                    this['ClickAdmin/filter'] = val;
                    switch (val) {
                        case ClickAdmin._filterType.all || ClickAdmin._filterType.none || ClickAdmin._filterType.stage:
                            ClickAdmin._filter._nodeSelection = [];
                            break;
                        default:
                            break;
                    }
                },
                get _nodeSelection() {
                    return this['ClickAdmin/_nodeSelection'];
                },
                set _nodeSelection(arr) {
                    this['ClickAdmin/_nodeSelection'] = arr;
                    switch (ClickAdmin._filter.value) {
                        case ClickAdmin._filterType.someBtnIncludeStage || ClickAdmin._filterType.someBtnExcludeStage:
                            ClickAdmin._filter.value = ClickAdmin._filterType.someBtnExcludeStage;
                            break;
                        default:
                            break;
                    }
                }
            };
            function _checkTarget(targetName) {
                let targetClick = false;
                if (ClickAdmin._absolute) {
                    if (ClickAdmin._filter._nodeSelection.length > 0) {
                        for (let index = 0; index < ClickAdmin._filter._nodeSelection.length; index++) {
                            const _name = ClickAdmin._filter._nodeSelection[index];
                            if (_name === targetName) {
                                targetClick = true;
                            }
                        }
                    }
                }
                return targetClick;
            }
            ClickAdmin._checkTarget = _checkTarget;
            function _checkStage() {
                let stageClick = false;
                if (LwgClick._absolute) {
                    if (ClickAdmin._filter.value === ClickAdmin._filterType.all || ClickAdmin._filter.value === ClickAdmin._filterType.stage || ClickAdmin._filter.value === ClickAdmin._filterType.someBtnIncludeStage) {
                        stageClick = true;
                    }
                }
                return stageClick;
            }
            ClickAdmin._checkStage = _checkStage;
            ClickAdmin._Type = {
                no: 'no',
                largen: 'largen',
                reduce: 'reduce',
            };
            ClickAdmin._Use = {
                get value() {
                    return this['Click/name'] ? this['Click/name'] : null;
                },
                set value(val) {
                    this['Click/name'] = val;
                }
            };
            function _effectSwitch(effectType) {
                let btnEffect;
                switch (effectType) {
                    case ClickAdmin._Type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case ClickAdmin._Type.largen:
                        btnEffect = new _Largen();
                        break;
                    case ClickAdmin._Type.reduce:
                        btnEffect = new _Reduce();
                        break;
                    default:
                        btnEffect = new _NoEffect();
                        break;
                }
                return btnEffect;
            }
            ClickAdmin._effectSwitch = _effectSwitch;
            function _on(effect, target, caller, down, move, up, out) {
                const btnEffect = _effectSwitch(effect);
                target.on(Laya.Event.MOUSE_DOWN, caller, down);
                target.on(Laya.Event.MOUSE_MOVE, caller, move);
                target.on(Laya.Event.MOUSE_UP, caller, up);
                target.on(Laya.Event.MOUSE_OUT, caller, out);
                target.on(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
                target.on(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
                target.on(Laya.Event.MOUSE_UP, caller, btnEffect.up);
                target.on(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
            }
            ClickAdmin._on = _on;
            function _off(effect, target, caller, down, move, up, out) {
                const btnEffect = _effectSwitch(effect);
                target._off(Laya.Event.MOUSE_DOWN, caller, down);
                target._off(Laya.Event.MOUSE_MOVE, caller, move);
                target._off(Laya.Event.MOUSE_UP, caller, up);
                target._off(Laya.Event.MOUSE_OUT, caller, out);
                target._off(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
                target._off(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
                target._off(Laya.Event.MOUSE_UP, caller, btnEffect.up);
                target._off(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
            }
            ClickAdmin._off = _off;
            class _NoEffect {
                down() { }
                ;
                move() { }
                ;
                up() { }
                ;
                out() { }
                ;
            }
            ClickAdmin._NoEffect = _NoEffect;
            class _Largen {
                down(event) {
                    event.currentTarget.scale(1.1, 1.1);
                    AudioAdmin._playSound(LwgClick._audioUrl);
                }
                move() { }
                ;
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            ClickAdmin._Largen = _Largen;
            class _Reduce {
                down(event) {
                    event.currentTarget.scale(0.9, 0.9);
                    AudioAdmin._playSound(LwgClick._audioUrl);
                }
                move() { }
                ;
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            ClickAdmin._Reduce = _Reduce;
        })(ClickAdmin = Lwg.ClickAdmin || (Lwg.ClickAdmin = {}));
        let Ani3DAdmin;
        (function (Ani3DAdmin) {
            Ani3DAdmin.tweenMap = {};
            Ani3DAdmin.frameRate = 1;
            function moveTo(target, toPos, duration, caller, ease, complete, delay = 0, coverBefore = true, update, frame) {
                let position = target.transform.position.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.position = toPos.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Ani3DAdmin.frameRate;
                }
                let updateRenderPos = function () {
                    if (target.transform) {
                        target.transform.position = position;
                    }
                    update && update();
                };
                Laya.timer.once(delay, target, function () {
                    Laya.timer.frameLoop(frame, target, updateRenderPos);
                });
                let endTween = function () {
                    if (target.transform) {
                        target.transform.position = toPos.clone();
                        Laya.timer.clear(target, updateRenderPos);
                    }
                    complete && complete.apply(caller);
                };
                let tween = Laya.Tween.to(position, { x: toPos.x, y: toPos.y, z: toPos.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Ani3DAdmin.tweenMap[target.id]) {
                    Ani3DAdmin.tweenMap[target.id] = [];
                }
                Ani3DAdmin.tweenMap[target.id].push(tween);
            }
            Ani3DAdmin.moveTo = moveTo;
            function rotateTo(target, toRotation, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let rotation = target.transform.localRotationEuler.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localRotationEuler = toRotation.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Ani3DAdmin.frameRate;
                }
                let updateRenderRotation = function () {
                    if (target.transform) {
                        target.transform.localRotationEuler = rotation;
                    }
                    update && update();
                };
                Laya.timer.once(delay, target, function () {
                    Laya.timer.frameLoop(frame, target, updateRenderRotation);
                });
                let endTween = function () {
                    if (target.transform) {
                        target.transform.localRotationEuler = toRotation.clone();
                        Laya.timer.clear(target, updateRenderRotation);
                    }
                    complete && complete.apply(caller);
                };
                let tween = Laya.Tween.to(rotation, { x: toRotation.x, y: toRotation.y, z: toRotation.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Ani3DAdmin.tweenMap[target.id]) {
                    Ani3DAdmin.tweenMap[target.id] = [];
                }
                Ani3DAdmin.tweenMap[target.id].push(tween);
            }
            Ani3DAdmin.rotateTo = rotateTo;
            function scaleTo(target, toScale, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let localScale = target.transform.localScale.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localScale = toScale.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Ani3DAdmin.frameRate;
                }
                let updateRenderPos = function () {
                    target.transform.localScale = localScale.clone();
                    update && update();
                };
                Laya.timer.once(delay, this, function () {
                    Laya.timer.frameLoop(frame, target, updateRenderPos);
                });
                let endTween = function () {
                    target.transform.localScale = toScale.clone();
                    Laya.timer.clear(target, updateRenderPos);
                    complete && complete.apply(caller);
                };
                let tween = Laya.Tween.to(localScale, { x: toScale.x, y: toScale.y, z: toScale.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Ani3DAdmin.tweenMap[target.id]) {
                    Ani3DAdmin.tweenMap[target.id] = [];
                }
                Ani3DAdmin.tweenMap[target.id].push(tween);
            }
            Ani3DAdmin.scaleTo = scaleTo;
            function ClearTween(target) {
                let tweens = Ani3DAdmin.tweenMap[target.id];
                if (tweens && tweens.length) {
                    while (tweens.length > 0) {
                        let tween = tweens.pop();
                        tween.clear();
                    }
                }
                Laya.timer.clearAll(target);
            }
            Ani3DAdmin.ClearTween = ClearTween;
            function rock(target, range, duration, caller, func, delayed, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                let v1 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);
                rotateTo(target, v1, duration / 2, caller, ease, () => {
                    let v2 = new Laya.Vector3(target.transform.localRotationEulerX - range.x * 2, target.transform.localRotationEulerY - range.y * 2, target.transform.localRotationEulerZ - range.z * 2);
                    rotateTo(target, v2, duration, caller, ease, () => {
                        let v3 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);
                        rotateTo(target, v3, duration / 2, caller, ease, () => {
                            if (func) {
                                func();
                            }
                        });
                    });
                }, delayed);
            }
            Ani3DAdmin.rock = rock;
            function moveRotateTo(Sp3d, Target, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                moveTo(Sp3d, Target.transform.position, duration, caller, ease, null, delay, coverBefore, update, frame);
                rotateTo(Sp3d, Target.transform.localRotationEuler, duration, caller, ease, complete, delay, coverBefore, null, frame);
            }
            Ani3DAdmin.moveRotateTo = moveRotateTo;
        })(Ani3DAdmin = Lwg.Ani3DAdmin || (Lwg.Ani3DAdmin = {}));
        let Ani2DAdmin;
        (function (Ani2DAdmin) {
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.Tween.clearAll(arr[index]);
                }
            }
            Ani2DAdmin._clearAll = _clearAll;
            function circulation_scale(node, range, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: 1 + range, scaleY: 1 + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 - range, scaleY: 1 - range }, time / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 1, scaleY: 1 }, time / 2, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.circulation_scale = circulation_scale;
            function leftRight_Shake(node, range, time, delayed, func) {
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Ani2DAdmin.leftRight_Shake = leftRight_Shake;
            function rotate(node, Erotate, time, delayed, func) {
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(node, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.rotate = rotate;
            function upDown_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null || func !== undefined) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.upDown_Overturn = upDown_Overturn;
            function leftRight_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                            }), 0);
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.leftRight_Overturn = leftRight_Overturn;
            function upDwon_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Ani2DAdmin.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func, stageClick) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.move_FadeOut = move_FadeOut;
            function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 1;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.move_Fade_Out = move_Fade_Out;
            function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
            function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed, ease, func) {
                node.scaleX = fScale;
                node.scaleY = fScale;
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: tX, y: tY, scaleX: eScale, scaleY: eScale }, time, ease ? null : ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.move_Scale = move_Scale;
            function move_rotate(Node, tRotate, tPoint, time, delayed, func) {
                Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node, () => {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.move_rotate = move_rotate;
            function rotate_Scale(target, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed, func) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                target.rotation = fRotate;
                Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, () => {
                    if (func) {
                        func();
                    }
                    target.rotation = 0;
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.rotate_Scale = rotate_Scale;
            function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
                node.y = fY;
                Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
                target.alpha = fAlpha;
                target.y = firstY;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    ToolsAdmin._Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            ToolsAdmin._Node.childrenVisible2D(node, true);
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    ToolsAdmin._Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                ToolsAdmin._Node.childrenVisible2D(node, true);
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2) {
                            func2();
                        }
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.move_changeRotate = move_changeRotate;
            function bomb_LeftRight(node, MaxScale, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: MaxScale }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0.85 }, time * 0.5, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: MaxScale * 0.9 }, time * 0.55, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 0.95 }, time * 0.6, null, Laya.Handler.create(this, function () {
                                Laya.Tween.to(node, { scaleX: 1 }, time * 0.65, null, Laya.Handler.create(this, function () {
                                    if (func)
                                        func();
                                }), 0);
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.bomb_LeftRight = bomb_LeftRight;
            function bombs_Appear(node, firstAlpha, endScale, maxScale, rotation, time, func, delayed) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: maxScale, scaleY: maxScale, alpha: 1, rotation: rotation }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale + (maxScale - endScale) / 3, scaleY: endScale + (maxScale - endScale) / 3, rotation: 0 }, time / 3, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 4, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.bombs_Appear = bombs_Appear;
            function bombs_AppearAllChild(node, firstAlpha, endScale, scale1, rotation1, time1, interval, func, audioType) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Child.alpha = 0;
                    Laya.timer.once(de1, this, () => {
                        Child.alpha = 1;
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, func);
                    });
                    de1 += interval;
                }
            }
            Ani2DAdmin.bombs_AppearAllChild = bombs_AppearAllChild;
            function bombs_VanishAllChild(node, endScale, alpha, rotation, time, interval, func) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Laya.timer.once(de1, this, () => {
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Vanish(node, endScale, alpha, rotation, time, func);
                    });
                    de1 += interval;
                }
            }
            Ani2DAdmin.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.swell_shrink = swell_shrink;
            function move(node, targetX, targetY, time, func, delayed, ease) {
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.move = move;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.blink_FadeOut_v = blink_FadeOut_v;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.blink_FadeOut = blink_FadeOut;
            function shookHead_Simple(target, rotate, time, delayed, func) {
                let firstR = target.rotation;
                Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.shookHead_Simple = shookHead_Simple;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.HintAni_01 = HintAni_01;
            function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!ease) {
                    ease = null;
                }
                target.alpha = fAlpha;
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.scale_Alpha = scale_Alpha;
            function scale(target, fScaleX, fScaleY, eScaleX, eScaleY, time, delayed, func, ease) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.scale = scale;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Ani2DAdmin.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Ani2DAdmin = Lwg.Ani2DAdmin || (Lwg.Ani2DAdmin = {}));
        let SetAdmin;
        (function (SetAdmin) {
            SetAdmin._sound = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting/sound') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting/sound', val.toString());
                }
            };
            SetAdmin._bgMusic = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting/bgMusic') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                        Laya.LocalStorage.setItem('Setting/bgMusic', val.toString());
                        AudioAdmin._playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting/bgMusic', val.toString());
                        AudioAdmin._stopMusic();
                    }
                }
            };
            SetAdmin._shake = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting/shake') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting/shake', val.toString());
                }
            };
            function _createBtnSet(x, y, width, height, skin, parent, ZOder) {
                let btn = new Laya.Image;
                btn.width = width ? width : 100;
                btn.height = width ? width : 100;
                btn.skin = skin ? skin : 'Frame/UI/icon_set.png';
                if (parent) {
                    parent.addChild(btn);
                }
                else {
                    Laya.stage.addChild(btn);
                }
                btn.pivotX = btn.width / 2;
                btn.pivotY = btn.height / 2;
                btn.x = x;
                btn.y = y;
                btn.zOrder = ZOder ? ZOder : 100;
                var btnSetUp = function (e) {
                    e.stopPropagation();
                    LwgScene._openScene(LwgScene._BaseName.Set);
                };
                LwgClick._on(LwgClick._Type.largen, btn, null, null, btnSetUp, null);
                SetAdmin._BtnSet = btn;
                SetAdmin._BtnSet.name = 'BtnSetNode';
                return btn;
            }
            SetAdmin._createBtnSet = _createBtnSet;
            function btnSetAppear(delayed, x, y) {
                if (!SetAdmin._BtnSet) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(SetAdmin._BtnSet, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        SetAdmin._BtnSet.visible = true;
                    });
                }
                else {
                    SetAdmin._BtnSet.visible = true;
                }
                if (x) {
                    SetAdmin._BtnSet.x = x;
                }
                if (y) {
                    SetAdmin._BtnSet.y = y;
                }
            }
            SetAdmin.btnSetAppear = btnSetAppear;
            function btnSetVinish(delayed) {
                if (!SetAdmin._BtnSet) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(SetAdmin._BtnSet, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        SetAdmin._BtnSet.visible = false;
                    });
                }
                else {
                    SetAdmin._BtnSet.visible = false;
                }
            }
            SetAdmin.btnSetVinish = btnSetVinish;
        })(SetAdmin = Lwg.SetAdmin || (Lwg.SetAdmin = {}));
        let AudioAdmin;
        (function (AudioAdmin) {
            let _voiceUrl;
            (function (_voiceUrl) {
                _voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
                _voiceUrl["btn"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/btn.wav";
                _voiceUrl["victory"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/guoguan.wav";
                _voiceUrl["defeated"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/wancheng.wav";
                _voiceUrl["huodejinbi"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/huodejinbi.wav";
            })(_voiceUrl = AudioAdmin._voiceUrl || (AudioAdmin._voiceUrl = {}));
            function _playSound(url, number, func) {
                if (!url) {
                    url = _voiceUrl.btn;
                }
                if (!number) {
                    number = 1;
                }
                if (SetAdmin._sound.switch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }));
                }
            }
            AudioAdmin._playSound = _playSound;
            function _playDefeatedSound(url, number, func, soundVolume) {
                if (SetAdmin._sound.switch) {
                    Laya.SoundManager.soundVolume = soundVolume ? soundVolume : 1;
                    Laya.SoundManager.playSound(url ? url : _voiceUrl.defeated, number ? number : 1, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                        Laya.SoundManager.soundVolume = 1;
                    }));
                }
            }
            AudioAdmin._playDefeatedSound = _playDefeatedSound;
            function _playVictorySound(url, number, func, soundVolume) {
                if (SetAdmin._sound.switch) {
                    Laya.SoundManager.soundVolume = soundVolume ? soundVolume : 1;
                    Laya.SoundManager.playSound(url ? url : _voiceUrl.victory, number ? number : 1, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                        Laya.SoundManager.soundVolume = 1;
                    }));
                }
            }
            AudioAdmin._playVictorySound = _playVictorySound;
            function _playMusic(url, number, delayed) {
                if (SetAdmin._bgMusic.switch) {
                    Laya.SoundManager.playMusic(url ? url : _voiceUrl.bgm, number ? number : 0, Laya.Handler.create(this, function () { }), delayed ? delayed : 0);
                }
            }
            AudioAdmin._playMusic = _playMusic;
            function _stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            AudioAdmin._stopMusic = _stopMusic;
        })(AudioAdmin = Lwg.AudioAdmin || (Lwg.AudioAdmin = {}));
        let ToolsAdmin;
        (function (ToolsAdmin) {
            function color_RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            ToolsAdmin.color_RGBtoHexString = color_RGBtoHexString;
            let _Format;
            (function (_Format) {
                function formatNumber(crc, fixNum = 0) {
                    let textTemp;
                    if (crc >= 1e27) {
                        textTemp = (crc / 1e27).toFixed(fixNum) + "ae";
                    }
                    else if (crc >= 1e24) {
                        textTemp = (crc / 1e24).toFixed(fixNum) + "ad";
                    }
                    else if (crc >= 1e21) {
                        textTemp = (crc / 1e21).toFixed(fixNum) + "ac";
                    }
                    else if (crc >= 1e18) {
                        textTemp = (crc / 1e18).toFixed(fixNum) + "ab";
                    }
                    else if (crc >= 1e15) {
                        textTemp = (crc / 1e15).toFixed(fixNum) + "aa";
                    }
                    else if (crc >= 1e12) {
                        textTemp = (crc / 1e12).toFixed(fixNum) + "t";
                    }
                    else if (crc >= 1e9) {
                        textTemp = (crc / 1e9).toFixed(fixNum) + "b";
                    }
                    else if (crc >= 1e6) {
                        textTemp = (crc / 1e6).toFixed(fixNum) + "m";
                    }
                    else if (crc >= 1e3) {
                        textTemp = (crc / 1e3).toFixed(fixNum) + "k";
                    }
                    else {
                        textTemp = Math.round(crc).toString();
                    }
                    return textTemp;
                }
                _Format.formatNumber = formatNumber;
                function strAddNum(str, num) {
                    return (Number(str) + num).toString();
                }
                _Format.strAddNum = strAddNum;
                function NumAddStr(num, str) {
                    return Number(str) + num;
                }
                _Format.NumAddStr = NumAddStr;
            })(_Format = ToolsAdmin._Format || (ToolsAdmin._Format = {}));
            let _Node;
            (function (_Node) {
                function tieByParent(Node) {
                    const Parent = Node.parent;
                    if (Node.x > Parent.width - Node.width / 2) {
                        Node.x = Parent.width - Node.width / 2;
                    }
                    if (Node.x < Node.width / 2) {
                        Node.x = Node.width / 2;
                    }
                    if (Node.y > Parent.height - Node.height / 2) {
                        Node.y = Parent.height - Node.height / 2;
                    }
                    if (Node.y < Node.height / 2) {
                        Node.y = Node.height / 2;
                    }
                }
                _Node.tieByParent = tieByParent;
                function tieByStage(Node, center) {
                    const Parent = Node.parent;
                    const gPoint = Parent.localToGlobal(new Laya.Point(Node.x, Node.y));
                    if (!center) {
                        if (gPoint.x > Laya.stage.width) {
                            gPoint.x = Laya.stage.width;
                        }
                    }
                    else {
                        if (gPoint.x > Laya.stage.width - Node.width / 2) {
                            gPoint.x = Laya.stage.width - Node.width / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.x < 0) {
                            gPoint.x = 0;
                        }
                    }
                    else {
                        if (gPoint.x < Node.width / 2) {
                            gPoint.x = Node.width / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.y > Laya.stage.height) {
                            gPoint.y = Laya.stage.height;
                        }
                    }
                    else {
                        if (gPoint.y > Laya.stage.height - Node.height / 2) {
                            gPoint.y = Laya.stage.height - Node.height / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.y < 0) {
                            gPoint.y = 0;
                        }
                    }
                    else {
                        if (gPoint.y < Node.height / 2) {
                            gPoint.y = Node.height / 2;
                        }
                    }
                    const lPoint = Parent.globalToLocal(gPoint);
                    Node.pos(lPoint.x, lPoint.y);
                }
                _Node.tieByStage = tieByStage;
                function simpleCopyImg(Target) {
                    let Img = new Laya.Image;
                    Img.skin = Target.skin;
                    Img.width = Target.width;
                    Img.height = Target.height;
                    Img.pivotX = Target.pivotX;
                    Img.pivotY = Target.pivotY;
                    Img.scaleX = Target.scaleX;
                    Img.scaleY = Target.scaleY;
                    Img.skewX = Target.skewX;
                    Img.skewY = Target.skewY;
                    Img.rotation = Target.rotation;
                    Img.x = Target.x;
                    Img.y = Target.y;
                    return Img;
                }
                _Node.simpleCopyImg = simpleCopyImg;
                function leaveStage(_Sprite, func) {
                    let Parent = _Sprite.parent;
                    if (!Parent) {
                        return false;
                    }
                    let gPoint = Parent.localToGlobal(new Laya.Point(_Sprite.x, _Sprite.y));
                    if (gPoint.x > Laya.stage.width + 10 || gPoint.x < -10) {
                        if (func) {
                            func();
                        }
                        return true;
                    }
                    if (gPoint.y > Laya.stage.height + 10 || gPoint.y < -10) {
                        if (func) {
                            func();
                        }
                        return true;
                    }
                }
                _Node.leaveStage = leaveStage;
                function getNodeGP(sp) {
                    if (!sp.parent) {
                        return;
                    }
                    return sp.parent.localToGlobal(new Laya.Point(sp.x, sp.y));
                }
                _Node.getNodeGP = getNodeGP;
                function checkTwoDistance(_Sprite1, _Sprite2, distance, func) {
                    if (!_Sprite1 || !_Sprite2) {
                        return;
                    }
                    let Parent1 = _Sprite1.parent;
                    let Parent2 = _Sprite2.parent;
                    if (!_Sprite1.parent || !_Sprite2.parent) {
                        return;
                    }
                    let gPoint1 = Parent1.localToGlobal(new Laya.Point(_Sprite1.x, _Sprite1.y));
                    let gPoint2 = Parent2.localToGlobal(new Laya.Point(_Sprite2.x, _Sprite2.y));
                    if (gPoint1.distance(gPoint2.x, gPoint2.y) <= distance) {
                        func && func();
                    }
                    return gPoint1.distance(gPoint2.x, gPoint2.y);
                }
                _Node.checkTwoDistance = checkTwoDistance;
                function childZOrderByY(sp, zOrder, along) {
                    let arr = [];
                    if (sp.numChildren == 0) {
                        return arr;
                    }
                    ;
                    for (let index = 0; index < sp.numChildren; index++) {
                        const element = sp.getChildAt(index);
                        arr.push(element);
                    }
                    _ObjArray.sortByProperty(arr, 'y');
                    if (zOrder) {
                        for (let index = 0; index < arr.length; index++) {
                            const element = arr[index];
                            element['zOrder'] = index;
                        }
                    }
                    if (along) {
                        let arr0 = [];
                        for (let index = arr.length - 1; index >= 0; index--) {
                            const element = arr[index];
                            console.log(element);
                            element['zOrder'] = arr.length - index;
                            arr0.push(element);
                        }
                        return arr0;
                    }
                    else {
                        return arr;
                    }
                }
                _Node.childZOrderByY = childZOrderByY;
                function changePivot(sp, _pivotX, _pivotY, int) {
                    let originalPovitX = sp.pivotX;
                    let originalPovitY = sp.pivotY;
                    if (int) {
                        _pivotX = Math.round(_pivotX);
                        _pivotY = Math.round(_pivotY);
                    }
                    if (sp.width) {
                        sp.pivot(_pivotX, _pivotY);
                        sp.x += (sp.pivotX - originalPovitX);
                        sp.y += (sp.pivotY - originalPovitY);
                    }
                }
                _Node.changePivot = changePivot;
                function changePivotCenter(sp, int) {
                    let originalPovitX = sp.pivotX;
                    let originalPovitY = sp.pivotY;
                    let _pivotX;
                    let _pivotY;
                    if (int) {
                        _pivotX = Math.round(sp.width / 2);
                        _pivotY = Math.round(sp.height / 2);
                    }
                    if (sp.width) {
                        sp.pivot(sp.width / 2, sp.height / 2);
                        sp.x += (sp.pivotX - originalPovitX);
                        sp.y += (sp.pivotY - originalPovitY);
                    }
                }
                _Node.changePivotCenter = changePivotCenter;
                function getChildArrByProperty(node, property, value) {
                    let childArr = [];
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element[property] == value) {
                            childArr.push(element);
                        }
                    }
                    return childArr;
                }
                _Node.getChildArrByProperty = getChildArrByProperty;
                function randomChildren(node, num) {
                    let childArr = [];
                    let indexArr = [];
                    for (let i = 0; i < node.numChildren; i++) {
                        indexArr.push(i);
                    }
                    let randomIndex = ToolsAdmin._Array.randomGetOut(indexArr, num);
                    for (let j = 0; j < randomIndex.length; j++) {
                        childArr.push(node.getChildAt(randomIndex[j]));
                    }
                    return childArr;
                }
                _Node.randomChildren = randomChildren;
                function destroyAllChildren(node) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        element.destroy();
                        index--;
                    }
                }
                _Node.destroyAllChildren = destroyAllChildren;
                function destroyOneChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            element.destroy();
                            index--;
                        }
                    }
                }
                _Node.destroyOneChildren = destroyOneChildren;
                function removeAllChildren(node) {
                    if (node.numChildren > 0) {
                        node.removeChildren(0, node.numChildren - 1);
                    }
                }
                _Node.removeAllChildren = removeAllChildren;
                function removeOneChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            element.removeSelf();
                            index--;
                        }
                    }
                }
                _Node.removeOneChildren = removeOneChildren;
                function checkChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            return element;
                        }
                    }
                }
                _Node.checkChildren = checkChildren;
                function showExcludedChild2D(node, childNameArr, bool) {
                    for (let i = 0; i < node.numChildren; i++) {
                        let Child = node.getChildAt(i);
                        for (let j = 0; j < childNameArr.length; j++) {
                            if (Child.name == childNameArr[j]) {
                                if (bool || bool == undefined) {
                                    Child.visible = true;
                                }
                                else {
                                    Child.visible = false;
                                }
                            }
                            else {
                                if (bool || bool == undefined) {
                                    Child.visible = false;
                                }
                                else {
                                    Child.visible = true;
                                }
                            }
                        }
                    }
                }
                _Node.showExcludedChild2D = showExcludedChild2D;
                function showExcludedChild3D(node, childNameArr, bool) {
                    for (let i = 0; i < node.numChildren; i++) {
                        let Child = node.getChildAt(i);
                        for (let j = 0; j < childNameArr.length; j++) {
                            if (Child.name == childNameArr[j]) {
                                if (bool || bool == undefined) {
                                    Child.active = true;
                                }
                                else {
                                    Child.active = false;
                                }
                            }
                            else {
                                if (bool || bool == undefined) {
                                    Child.active = false;
                                }
                                else {
                                    Child.active = true;
                                }
                            }
                        }
                    }
                }
                _Node.showExcludedChild3D = showExcludedChild3D;
                function createPrefab(prefab, Parent, point, script, zOrder, name) {
                    const Sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    Parent && Parent.addChild(Sp);
                    point && Sp.pos(point[0], point[1]);
                    script && Sp.addComponent(script);
                    NodeAdmin._addProperty(Sp);
                    if (zOrder)
                        Sp.zOrder = zOrder;
                    return Sp;
                }
                _Node.createPrefab = createPrefab;
                function childrenVisible2D(node, bool) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (bool) {
                            element.visible = true;
                        }
                        else {
                            element.visible = false;
                        }
                    }
                }
                _Node.childrenVisible2D = childrenVisible2D;
                function childrenVisible3D(node, bool) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (bool) {
                            element.active = true;
                        }
                        else {
                            element.active = false;
                        }
                    }
                }
                _Node.childrenVisible3D = childrenVisible3D;
                function findChild3D(parent, name) {
                    var item = null;
                    item = parent.getChildByName(name);
                    if (item != null)
                        return item;
                    var go = null;
                    for (var i = 0; i < parent.numChildren; i++) {
                        go = findChild3D(parent.getChildAt(i), name);
                        if (go != null)
                            return go;
                    }
                    return null;
                }
                _Node.findChild3D = findChild3D;
                function findChild2D(parent, name) {
                    var item = null;
                    item = parent.getChildByName(name);
                    if (item != null)
                        return item;
                    var go = null;
                    for (var i = 0; i < parent.numChildren; i++) {
                        go = findChild2D(parent.getChildAt(i), name);
                        if (go != null)
                            return go;
                    }
                    return null;
                }
                _Node.findChild2D = findChild2D;
                function findChildByName2D(parent, name) {
                    let arr = [];
                    return arr;
                }
                _Node.findChildByName2D = findChildByName2D;
            })(_Node = ToolsAdmin._Node || (ToolsAdmin._Node = {}));
            let _Number;
            (function (_Number) {
                function randomOneHalf() {
                    let number;
                    number = Math.floor(Math.random() * 2);
                    return number;
                }
                _Number.randomOneHalf = randomOneHalf;
                function randomNumerical(numSection, defaultNumSection, randomPlusOrMinus) {
                    let num = numSection ? ToolsAdmin._Number.randomOneBySection(numSection[0], numSection[1]) : ToolsAdmin._Number.randomOneBySection(defaultNumSection[0], defaultNumSection[1]);
                    if (randomPlusOrMinus) {
                        num = ToolsAdmin._Number.randomOneHalf() === 0 ? num : -num;
                    }
                    return num;
                }
                _Number.randomNumerical = randomNumerical;
                function randomOneInt(section1, section2) {
                    if (section2) {
                        return Math.round(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        return Math.round(Math.random() * section1);
                    }
                }
                _Number.randomOneInt = randomOneInt;
                function randomCountBySection(section1, section2, count, intSet) {
                    let arr = [];
                    if (!count) {
                        count = 1;
                    }
                    if (section2) {
                        while (count > arr.length) {
                            let num;
                            if (intSet || intSet == undefined) {
                                num = Math.round(Math.random() * (section2 - section1)) + section1;
                            }
                            else {
                                num = Math.random() * (section2 - section1) + section1;
                            }
                            arr.push(num);
                            _Array.unique01(arr);
                        }
                        ;
                        return arr;
                    }
                    else {
                        while (count > arr.length) {
                            let num;
                            if (intSet || intSet == undefined) {
                                num = Math.round(Math.random() * section1);
                            }
                            else {
                                num = Math.random() * section1;
                            }
                            arr.push(num);
                            _Array.unique01(arr);
                        }
                        return arr;
                    }
                }
                _Number.randomCountBySection = randomCountBySection;
                function randomOneBySection(section1, section2, intSet) {
                    let chage;
                    if (section1 > section2) {
                        chage = section1;
                        section1 = section2;
                        section2 = chage;
                    }
                    if (section2) {
                        let num;
                        if (intSet) {
                            num = Math.round(Math.random() * (section2 - section1)) + section1;
                        }
                        else {
                            num = Math.random() * (section2 - section1) + section1;
                        }
                        return num;
                    }
                    else {
                        let num;
                        if (intSet) {
                            num = Math.round(Math.random() * section1);
                        }
                        else {
                            num = Math.random() * section1;
                        }
                        return num;
                    }
                }
                _Number.randomOneBySection = randomOneBySection;
            })(_Number = ToolsAdmin._Number || (ToolsAdmin._Number = {}));
            let _Point;
            (function (_Point) {
                function getOtherLocal(element, Other) {
                    let Parent = element.parent;
                    let gPoint = Parent.localToGlobal(new Laya.Point(element.x, element.y));
                    return Other.globalToLocal(gPoint);
                }
                _Point.getOtherLocal = getOtherLocal;
                function angleByRadian(angle) {
                    return Math.PI / 180 * angle;
                }
                _Point.angleByRadian = angleByRadian;
                function pointByAngleOld(x, y) {
                    const radian = Math.atan2(x, y);
                    let angle = 90 - radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 270 + (90 + angle);
                    }
                    return angle - 90;
                }
                _Point.pointByAngleOld = pointByAngleOld;
                ;
                function pointByAngleNew(x, y) {
                    const radian = Math.atan2(y, x);
                    let angle = radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 360 + angle;
                    }
                    return angle;
                }
                _Point.pointByAngleNew = pointByAngleNew;
                ;
                function angleByPoint(angle) {
                    const radian = (90 - angle) / (180 / Math.PI);
                    const p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                    p.normalize();
                    return p;
                }
                _Point.angleByPoint = angleByPoint;
                ;
                function angleByPointNew(angle) {
                    const rad = angleByRadian(angle);
                    const p = new Laya.Point(Math.cos(rad), Math.sin(rad));
                    p.normalize();
                    return p;
                }
                _Point.angleByPointNew = angleByPointNew;
                ;
                function dotRotatePoint(x0, y0, x1, y1, angle) {
                    let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                    let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                    return new Laya.Point(x2, y2);
                }
                _Point.dotRotatePoint = dotRotatePoint;
                function angleAndLenByPoint(angle, len) {
                    const point = new Laya.Point();
                    point.x = len * Math.cos(angle * Math.PI / 180);
                    point.y = len * Math.sin(angle * Math.PI / 180);
                    return point;
                }
                _Point.angleAndLenByPoint = angleAndLenByPoint;
                function getRoundPosOld(angle, radius, centerPos) {
                    const radian = angleByRadian(angle);
                    const X = centerPos.x + Math.sin(radian) * radius;
                    const Y = centerPos.y - Math.cos(radian) * radius;
                    return new Laya.Point(X, Y);
                }
                _Point.getRoundPosOld = getRoundPosOld;
                function getRoundPosNew(angle, radius, centerPos) {
                    const radian = angleByRadian(angle);
                    if (centerPos) {
                        const x = centerPos.x + Math.cos(radian) * radius;
                        const y = centerPos.y + Math.sin(radian) * radius;
                        return new Laya.Point(x, y);
                    }
                    else {
                        return new Laya.Point(null, null);
                    }
                }
                _Point.getRoundPosNew = getRoundPosNew;
                function randomPointByCenter(centerPos, radiusX, radiusY, count) {
                    if (!count) {
                        count = 1;
                    }
                    let arr = [];
                    for (let index = 0; index < count; index++) {
                        let x0 = ToolsAdmin._Number.randomCountBySection(0, radiusX, 1, false);
                        let y0 = ToolsAdmin._Number.randomCountBySection(0, radiusY, 1, false);
                        let diffX = ToolsAdmin._Number.randomOneHalf() == 0 ? x0[0] : -x0[0];
                        let diffY = ToolsAdmin._Number.randomOneHalf() == 0 ? y0[0] : -y0[0];
                        let p = new Laya.Point(centerPos.x + diffX, centerPos.y + diffY);
                        arr.push(p);
                    }
                    return arr;
                }
                _Point.randomPointByCenter = randomPointByCenter;
                function getPArrBetweenTwoP(p1, p2, num) {
                    let arr = [];
                    let x0 = p2.x - p1.x;
                    let y0 = p2.y - p1.y;
                    for (let index = 0; index < num; index++) {
                        arr.push(new Laya.Point(p1.x + (x0 / num) * index, p1.y + (y0 / num) * index));
                    }
                    if (arr.length >= 1) {
                        arr.unshift();
                    }
                    if (arr.length >= 1) {
                        arr.pop();
                    }
                    return arr;
                }
                _Point.getPArrBetweenTwoP = getPArrBetweenTwoP;
                function reverseVector(Vecoter1, Vecoter2, normalizing) {
                    let p;
                    p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                    if (normalizing) {
                        p.normalize();
                    }
                    return p;
                }
                _Point.reverseVector = reverseVector;
            })(_Point = ToolsAdmin._Point || (ToolsAdmin._Point = {}));
            let _3D;
            (function (_3D) {
                function randomScopeByPosition(sp3D, scopeSize) {
                    let _pX = ToolsAdmin._Number.randomOneBySection(scopeSize[0][0], scopeSize[1][0]);
                    let _pY = ToolsAdmin._Number.randomOneBySection(scopeSize[0][1], scopeSize[1][1]);
                    let _pZ = ToolsAdmin._Number.randomOneBySection(scopeSize[0][2], scopeSize[1][2]);
                    _pX = ToolsAdmin._Number.randomOneHalf() == 0 ? _pX : -_pX;
                    _pY = ToolsAdmin._Number.randomOneHalf() == 0 ? _pY : -_pY;
                    _pZ = ToolsAdmin._Number.randomOneHalf() == 0 ? _pZ : -_pZ;
                    sp3D.transform.position = new Laya.Vector3(sp3D.transform.position.x + _pX, sp3D.transform.position.y + _pY, sp3D.transform.position.z + _pZ);
                }
                _3D.randomScopeByPosition = randomScopeByPosition;
                function getMeshSize(MSp3D) {
                    if (MSp3D.meshRenderer) {
                        let v3;
                        let extent = MSp3D.meshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getMeshSize = getMeshSize;
                function getSkinMeshSize(MSp3D) {
                    if (MSp3D.skinnedMeshRenderer) {
                        let v3;
                        let extent = MSp3D.skinnedMeshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getSkinMeshSize = getSkinMeshSize;
                function twoNodeDistance(obj1, obj2) {
                    let obj1V3 = obj1.transform.position;
                    let obj2V3 = obj2.transform.position;
                    let p = new Laya.Vector3();
                    Laya.Vector3.subtract(obj1V3, obj2V3, p);
                    let lenp = Laya.Vector3.scalarLength(p);
                    return lenp;
                }
                _3D.twoNodeDistance = twoNodeDistance;
                function twoPositionDistance(v1, v2) {
                    let p = twoSubV3(v1, v2);
                    let lenp = Laya.Vector3.scalarLength(p);
                    return lenp;
                }
                _3D.twoPositionDistance = twoPositionDistance;
                function twoSubV3(V31, V32, normalizing) {
                    let p = new Laya.Vector3();
                    Laya.Vector3.subtract(V31, V32, p);
                    if (normalizing) {
                        let p1 = new Laya.Vector3();
                        Laya.Vector3.normalize(p, p1);
                        return p1;
                    }
                    else {
                        return p;
                    }
                }
                _3D.twoSubV3 = twoSubV3;
                function maximumDistanceLimi(originV3, obj, length) {
                    let subP = new Laya.Vector3();
                    let objP = obj.transform.position;
                    Laya.Vector3.subtract(objP, originV3, subP);
                    let lenP = Laya.Vector3.scalarLength(subP);
                    if (lenP >= length) {
                        let normalizP = new Laya.Vector3();
                        Laya.Vector3.normalize(subP, normalizP);
                        let x = originV3.x + normalizP.x * length;
                        let y = originV3.y + normalizP.y * length;
                        let z = originV3.z + normalizP.z * length;
                        let p = new Laya.Vector3(x, y, z);
                        obj.transform.position = p;
                        return p;
                    }
                }
                _3D.maximumDistanceLimi = maximumDistanceLimi;
                function posToScreen(v3, camera) {
                    let ScreenV4 = new Laya.Vector4();
                    camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
                    let point = new Laya.Vector2();
                    point.x = ScreenV4.x / Laya.stage.clientScaleX;
                    point.y = ScreenV4.y / Laya.stage.clientScaleY;
                    return point;
                }
                _3D.posToScreen = posToScreen;
                function reverseVector(Vecoter1, Vecoter2, normalizing) {
                    let p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                    if (normalizing) {
                        let returnP = new Laya.Vector3();
                        Laya.Vector3.normalize(p, returnP);
                        return returnP;
                    }
                    else {
                        return p;
                    }
                }
                _3D.reverseVector = reverseVector;
                function rayScanning(camera, scene3D, vector2, filtrateName) {
                    let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                    let outs = new Array();
                    const _v2 = new Laya.Vector2(Laya.stage.clientScaleX * vector2.x, Laya.stage.clientScaleY * vector2.y);
                    camera.viewportPointToRay(_v2, _ray);
                    scene3D.physicsSimulation.rayCastAll(_ray, outs);
                    if (filtrateName) {
                        let chek;
                        for (let i = 0; i < outs.length; i++) {
                            let Sp3d = outs[i].collider.owner;
                            if (Sp3d.name == filtrateName) {
                                chek = outs[i];
                            }
                        }
                        return chek;
                    }
                    else {
                        return outs;
                    }
                }
                _3D.rayScanning = rayScanning;
                function rayScanningFirst(camera, scene3D, vector2) {
                    let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                    let out = new Laya.HitResult();
                    const _v2 = new Laya.Vector2(Laya.stage.clientScaleX * vector2.x, Laya.stage.clientScaleY * vector2.y);
                    camera.viewportPointToRay(_v2, _ray);
                    scene3D.physicsSimulation.rayCast(_ray, out);
                    return out;
                }
                _3D.rayScanningFirst = rayScanningFirst;
                function animatorPlay(Sp3D, aniName, normalizedTime, layerIndex) {
                    let sp3DAni = Sp3D.getComponent(Laya.Animator);
                    if (!sp3DAni) {
                        console.log(Sp3D.name, '没有动画组件');
                        return;
                    }
                    if (!layerIndex) {
                        layerIndex = 0;
                    }
                    sp3DAni.play(aniName, layerIndex, normalizedTime);
                    return sp3DAni;
                }
                _3D.animatorPlay = animatorPlay;
            })(_3D = ToolsAdmin._3D || (ToolsAdmin._3D = {}));
            let _Skeleton;
            (function (_Skeleton) {
                function sk_indexControl(sk, name) {
                    sk.play(name, true);
                    sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
                }
                _Skeleton.sk_indexControl = sk_indexControl;
            })(_Skeleton = ToolsAdmin._Skeleton || (ToolsAdmin._Skeleton = {}));
            let _Draw;
            (function (_Draw) {
                function drawPieMask(parent, startAngle, endAngle) {
                    parent.cacheAs = "bitmap";
                    let drawPieSpt = new Laya.Sprite();
                    drawPieSpt.blendMode = "destination-out";
                    parent.addChild(drawPieSpt);
                    let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                    return drawPie;
                }
                _Draw.drawPieMask = drawPieMask;
                function screenshot(Sp, quality) {
                    const htmlCanvas = Sp.drawToCanvas(Sp.width, Sp.height, Sp.x, Sp.y);
                    const base64 = htmlCanvas.toBase64("image/png", quality ? quality : 1);
                    return base64;
                }
                _Draw.screenshot = screenshot;
                _Draw._texArr = [];
                function cameraToSprite(camera, sprite) {
                    const _camera = camera.clone();
                    camera.scene.addChild(_camera);
                    _camera.transform.position = camera.transform.position;
                    _camera.transform.localRotationEuler = camera.transform.localRotationEuler;
                    _camera.renderTarget = new Laya.RenderTexture(sprite.width, sprite.height);
                    _camera.renderingOrder = -1;
                    _camera.clearFlag = Laya.CameraClearFlags.Sky;
                    const ptex = new Laya.Texture(_camera.renderTarget, Laya.Texture.DEF_UV);
                    sprite.graphics.drawTexture(ptex, sprite.x, sprite.y, sprite.width, sprite.height);
                    _Draw._texArr.push(ptex);
                    if (_Draw._texArr.length > 3) {
                        _Draw._texArr[0].destroy();
                        _Draw._texArr.shift();
                    }
                    TimerAdmin._frameOnce(5, this, () => {
                        _camera.destroy();
                    });
                }
                _Draw.cameraToSprite = cameraToSprite;
                function drawToTex(Sp, quality) {
                    let tex = Sp.drawToTexture(Sp.width, Sp.height, Sp.x, Sp.y);
                    return tex;
                }
                _Draw.drawToTex = drawToTex;
                function reverseCircleMask(sp, circleArr, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.destroyAllChildren(sp);
                    }
                    let interactionArea = sp.getChildByName('reverseRoundMask');
                    if (!interactionArea) {
                        interactionArea = new Laya.Sprite();
                        interactionArea.name = 'reverseRoundMask';
                        interactionArea.blendMode = "destination-out";
                        sp.addChild(interactionArea);
                    }
                    sp.cacheAs = "bitmap";
                    for (let index = 0; index < circleArr.length; index++) {
                        interactionArea.graphics.drawCircle(circleArr[index][0], circleArr[index][1], circleArr[index][2], "#000000");
                    }
                    interactionArea.pos(0, 0);
                    return interactionArea;
                }
                _Draw.reverseCircleMask = reverseCircleMask;
                function reverseRoundrectMask(sp, roundrectArr, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.removeAllChildren(sp);
                    }
                    let interactionArea = sp.getChildByName('reverseRoundrectMask');
                    if (!interactionArea) {
                        interactionArea = new Laya.Sprite();
                        interactionArea.name = 'reverseRoundrectMask';
                        interactionArea.blendMode = "destination-out";
                        sp.addChild(interactionArea);
                    }
                    if (sp.cacheAs !== "bitmap")
                        sp.cacheAs = "bitmap";
                    for (let index = 0; index < roundrectArr.length; index++) {
                        const element = roundrectArr[index];
                        element[0] = Math.round(element[0]);
                        element[1] = Math.round(element[1]);
                        element[2] = Math.round(element[2]);
                        element[3] = Math.round(element[3]);
                        element[4] = Math.round(element[4]);
                        interactionArea.graphics.drawPath(element[0], element[1], [["moveTo", element[4], 0], ["lineTo", element[2] - element[4], 0], ["arcTo", element[2], 0, element[2], element[4], element[4]], ["lineTo", element[2], element[3] - element[4]], ["arcTo", element[2], element[3], element[2] - element[4], element[3], element[4]], ["lineTo", element[3] - element[4], element[3]], ["arcTo", 0, element[3], 0, element[3] - element[4], element[4]], ["lineTo", 0, element[4]], ["arcTo", 0, 0, element[4], 0, element[4]], ["closePath"]], { fillStyle: "#000000" });
                        interactionArea.pivotX = element[2] / 2;
                        interactionArea.pivotY = element[3] / 2;
                        interactionArea.pos(0, 0);
                    }
                }
                _Draw.reverseRoundrectMask = reverseRoundrectMask;
            })(_Draw = ToolsAdmin._Draw || (ToolsAdmin._Draw = {}));
            let _ObjArray;
            (function (_ObjArray) {
                function sortByProperty(array, property) {
                    var compare = function (obj1, obj2) {
                        var val1 = obj1[property];
                        var val2 = obj2[property];
                        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                            val1 = Number(val1);
                            val2 = Number(val2);
                        }
                        if (val1 < val2) {
                            return -1;
                        }
                        else if (val1 > val2) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    };
                    array.sort(compare);
                    return array;
                }
                _ObjArray.sortByProperty = sortByProperty;
                function diffProByTwo(objArr1, objArr2, property) {
                    var result = [];
                    for (var i = 0; i < objArr1.length; i++) {
                        var obj1 = objArr1[i];
                        var obj1Name = obj1[property];
                        var isExist = false;
                        for (var j = 0; j < objArr2.length; j++) {
                            var obj2 = objArr2[j];
                            var obj2Name = obj2[property];
                            if (obj2Name == obj1Name) {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            let _obj1 = _ObjArray.objCopy(obj1);
                            result.push(_obj1);
                        }
                    }
                    return result;
                }
                _ObjArray.diffProByTwo = diffProByTwo;
                function identicalPropertyObjArr(data1, data2, property) {
                    var result = [];
                    for (var i = 0; i < data1.length; i++) {
                        var obj1 = data1[i];
                        var obj1Name = obj1[property];
                        var isExist = false;
                        for (var j = 0; j < data2.length; j++) {
                            var obj2 = data2[j];
                            var obj2Name = obj2[property];
                            if (obj2Name == obj1Name) {
                                isExist = true;
                                break;
                            }
                        }
                        if (isExist) {
                            result.push(obj1);
                        }
                    }
                    return result;
                }
                _ObjArray.identicalPropertyObjArr = identicalPropertyObjArr;
                function objArrUnique(arr, property) {
                    for (var i = 0, len = arr.length; i < len; i++) {
                        for (var j = i + 1, len = arr.length; j < len; j++) {
                            if (arr[i][property] === arr[j][property]) {
                                arr.splice(j, 1);
                                j--;
                                len--;
                            }
                        }
                    }
                    return arr;
                }
                _ObjArray.objArrUnique = objArrUnique;
                function getArrByValue(objArr, property) {
                    let arr = [];
                    for (let i = 0; i < objArr.length; i++) {
                        if (objArr[i][property]) {
                            arr.push(objArr[i][property]);
                        }
                    }
                    return arr;
                }
                _ObjArray.getArrByValue = getArrByValue;
                function arrCopy(ObjArray) {
                    var sourceCopy = ObjArray instanceof Array ? [] : {};
                    for (var item in ObjArray) {
                        sourceCopy[item] = typeof ObjArray[item] === 'object' ? objCopy(ObjArray[item]) : ObjArray[item];
                    }
                    return sourceCopy;
                }
                _ObjArray.arrCopy = arrCopy;
                function modifyProValue(objArr, pro, value) {
                    for (const key in objArr) {
                        if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                            const element = objArr[key];
                            if (element[pro]) {
                                element[pro] = value;
                            }
                        }
                    }
                    return objArr;
                }
                _ObjArray.modifyProValue = modifyProValue;
                function objCopy(obj) {
                    var _copyObj = {};
                    for (const item in obj) {
                        if (obj.hasOwnProperty(item)) {
                            const element = obj[item];
                            if (typeof element === 'object') {
                                if (Array.isArray(element)) {
                                    let arr1 = _Array.copy(element);
                                    _copyObj[item] = arr1;
                                }
                                else {
                                    objCopy(element);
                                }
                            }
                            else {
                                _copyObj[item] = element;
                            }
                        }
                    }
                    return _copyObj;
                }
                _ObjArray.objCopy = objCopy;
            })(_ObjArray = ToolsAdmin._ObjArray || (ToolsAdmin._ObjArray = {}));
            let _Array;
            (function (_Array) {
                function addToarray(array1, array2) {
                    for (let index = 0; index < array2.length; index++) {
                        const element = array2[index];
                        array1.push(element);
                    }
                    return array1;
                }
                _Array.addToarray = addToarray;
                function inverted(array) {
                    let arr = [];
                    for (let index = array.length - 1; index >= 0; index--) {
                        const element = array[index];
                        arr.push(element);
                    }
                    array = arr;
                    return array;
                }
                _Array.inverted = inverted;
                function randomGetOut(arr, num) {
                    if (!num) {
                        num = 1;
                    }
                    let arrCopy = _Array.copy(arr);
                    let arr0 = [];
                    if (num > arrCopy.length) {
                        return '数组长度小于取出的数！';
                    }
                    else {
                        for (let index = 0; index < num; index++) {
                            let ran = Math.round(Math.random() * (arrCopy.length - 1));
                            let a1 = arrCopy[ran];
                            arrCopy.splice(ran, 1);
                            arr0.push(a1);
                        }
                        return arr0;
                    }
                }
                _Array.randomGetOut = randomGetOut;
                function randomGetOne(arr) {
                    let arrCopy = copy(arr);
                    let ran = Math.round(Math.random() * (arrCopy.length - 1));
                    return arrCopy[ran];
                }
                _Array.randomGetOne = randomGetOne;
                function copy(arr1) {
                    var arr = [];
                    for (var i = 0; i < arr1.length; i++) {
                        arr.push(arr1[i]);
                    }
                    return arr;
                }
                _Array.copy = copy;
                function unique01(arr) {
                    for (var i = 0, len = arr.length; i < len; i++) {
                        for (var j = i + 1, len = arr.length; j < len; j++) {
                            if (arr[i] === arr[j]) {
                                arr.splice(j, 1);
                                j--;
                                len--;
                            }
                        }
                    }
                    return arr;
                }
                _Array.unique01 = unique01;
                function unique02(arr) {
                    arr = arr.sort();
                    var arr1 = [arr[0]];
                    for (var i = 1, len = arr.length; i < len; i++) {
                        if (arr[i] !== arr[i - 1]) {
                            arr1.push(arr[i]);
                        }
                    }
                    return arr1;
                }
                _Array.unique02 = unique02;
                function unique03(arr) {
                    return Array.from(new Set(arr));
                }
                _Array.unique03 = unique03;
                function oneExcludeOtherOne(arr1, arr2) {
                    let arr1Capy = _Array.copy(arr1);
                    let arr2Capy = _Array.copy(arr2);
                    for (let i = 0; i < arr1Capy.length; i++) {
                        for (let j = 0; j < arr2Capy.length; j++) {
                            if (arr1Capy[i] == arr2Capy[j]) {
                                arr1Capy.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    return arr1Capy;
                }
                _Array.oneExcludeOtherOne = oneExcludeOtherOne;
                function moreExclude(arrays, exclude) {
                    let arr0 = [];
                    for (let i = 0; i < arrays.length; i++) {
                        for (let j = 0; j < arrays[i].length; j++) {
                            arr0.push(arrays[i][j]);
                        }
                    }
                    let arr1 = copy(arr0);
                    let arr2 = copy(arr1);
                    let arrNum = [];
                    for (let k = 0; k < arr2.length; k++) {
                        arrNum.push({
                            name: arr2[k],
                            num: 0,
                        });
                    }
                    for (let l = 0; l < arr0.length; l++) {
                        for (let m = 0; m < arrNum.length; m++) {
                            if (arr0[l] == arrNum[m]['name']) {
                                arrNum[m]['num']++;
                            }
                        }
                    }
                    let arrAllHave = [];
                    let arrDiffHave = [];
                    for (let n = 0; n < arrNum.length; n++) {
                        const element = arrNum[n];
                        if (arrNum[n]['num'] == arrays.length) {
                            arrAllHave.push(arrNum[n]['name']);
                        }
                        else {
                            arrDiffHave.push(arrNum[n]['name']);
                        }
                    }
                    if (!exclude) {
                        return arrAllHave;
                    }
                    else {
                        return arrDiffHave;
                    }
                }
                _Array.moreExclude = moreExclude;
            })(_Array = ToolsAdmin._Array || (ToolsAdmin._Array = {}));
        })(ToolsAdmin = Lwg.ToolsAdmin || (Lwg.ToolsAdmin = {}));
        let PreLoadAdmin;
        (function (PreLoadAdmin) {
            class _PreLoadScene extends SceneAdmin._SceneBase {
                constructor() {
                    super(...arguments);
                    this.$pic2D = [];
                    this.$texture = [];
                    this.$prefab2D = [];
                    this.$scene2D = [];
                    this.$scene3D = [];
                    this.$prefab3D = [];
                    this.$texture2D = [];
                    this.$effectsTex2D = [];
                    this.$material = [];
                    this.$mesh3D = [];
                    this.$json = [];
                    this.$skeleton = [];
                    this._loadOrder = [this.$pic2D, this.$texture, this.$prefab2D, this.$scene2D, this.$prefab3D, this.$texture2D, this.$effectsTex2D, this.$material, this.$mesh3D, this.$scene3D, this.$json, this.$skeleton];
                    this._loadOrderIndex = 0;
                    this._sumProgress = 0;
                    this._currentProgress = 0;
                }
                lwgStartLoding(listObj) {
                    listObj['$effectsTex2D'] = Eff3DAdmin._tex2D;
                    for (const typeName in listObj) {
                        if (Object.prototype.hasOwnProperty.call(listObj, typeName)) {
                            for (const resObj in listObj[typeName]) {
                                if (Object.prototype.hasOwnProperty.call(listObj[typeName], resObj)) {
                                    const obj = listObj[typeName][resObj];
                                    this[typeName].push(obj);
                                }
                            }
                        }
                    }
                    for (let index = 0; index < this._loadOrder.length; index++) {
                        this._sumProgress += this._loadOrder[index].length;
                        if (this._loadOrder[index].length <= 0) {
                            this._loadOrder.splice(index, 1);
                            index--;
                        }
                    }
                    let time = this.lwgOpenAni();
                    Laya.timer.once(time ? time : 0, this, () => {
                        this.lode();
                    });
                }
                lwgStepComplete() { }
                lwgAllComplete() { return 0; }
                ;
                stepComplete() {
                    this._currentProgress++;
                    console.log('当前进度条进度:', this._currentProgress / this._sumProgress);
                    if (this._currentProgress >= this._sumProgress) {
                        if (this._sumProgress == 0) {
                            return;
                        }
                        console.log(`所有资源加载完成！此时所有资源可通过例如:Laya.loader.getRes("url")获取`);
                        this.allComplete();
                    }
                    else {
                        let number = 0;
                        for (let index = 0; index <= this._loadOrderIndex; index++) {
                            number += this._loadOrder[index].length;
                        }
                        if (this._currentProgress === number) {
                            this._loadOrderIndex++;
                        }
                        this.lode();
                        this.lwgStepComplete();
                    }
                }
                allComplete() {
                    Laya.timer.once(this.lwgAllComplete(), this, () => {
                        if (this._Owner.name == LwgScene._BaseName.PreLoadCutIn) {
                            this._openScene(LwgScene._PreLoadCutIn.openName);
                        }
                        else {
                            AudioAdmin._playMusic();
                            this._openScene(LwgScene._BaseName.Start);
                        }
                    });
                }
                lodeFunc(resArr, index, res, typeName, completeFunc) {
                    const url = resArr[index].url;
                    if (typeof url === 'object') {
                        console.log(typeName, url, `数组加载完成，为数组对象，只能从getRes（url）中逐个获取`);
                    }
                    else {
                        if (res == null) {
                            console.log(`XXXXXXXXXXX${typeName}:${url}加载失败！不会停止加载进程！, 数组下标为：${index}, 'XXXXXXXXXXX`);
                        }
                        else {
                            console.log(`${typeName}:${url}加载完成！, 数组下标为${index}`);
                            completeFunc && completeFunc();
                        }
                    }
                    this.stepComplete();
                }
                lode() {
                    if (this._loadOrder.length <= 0) {
                        console.log('没有加载项');
                        this.allComplete();
                        return;
                    }
                    let alreadyPro = 0;
                    for (let i = 0; i < this._loadOrderIndex; i++) {
                        alreadyPro += this._loadOrder[i].length;
                    }
                    let index = this._currentProgress - alreadyPro;
                    switch (this._loadOrder[this._loadOrderIndex]) {
                        case this.$pic2D:
                            Laya.loader.load(this.$pic2D[index].url, Laya.Handler.create(this, (res) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, res, '2D图片', null);
                            }));
                            break;
                        case this.$scene2D:
                            Laya.loader.load(this.$scene2D[index].url, Laya.Handler.create(this, (res) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, res, '2D场景', null);
                            }), null, Laya.Loader.JSON);
                            break;
                        case this.$scene3D:
                            Laya.Scene3D.load(this.$scene3D[index].url, Laya.Handler.create(this, (Scene3D) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Scene3D, '3D场景', () => {
                                    this.$scene3D[index].scene3D = Scene3D;
                                });
                            }));
                            break;
                        case this.$prefab3D:
                            Laya.Sprite3D.load(this.$prefab3D[index].url, Laya.Handler.create(this, (Sp3D) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Sp3D, '3D预制体', () => {
                                    this.$prefab3D[index].prefab3D = Sp3D;
                                });
                            }));
                            break;
                        case this.$mesh3D:
                            Laya.Mesh.load(this.$mesh3D[index].url, Laya.Handler.create(this, (Mesh3D) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Mesh3D, '3D网格', () => {
                                    this.$mesh3D[index].mesh3D = Mesh3D;
                                });
                            }));
                            break;
                        case this.$texture:
                            Laya.loader.load(this.$texture[index].url, Laya.Handler.create(this, (tex) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, tex, '纹理', () => {
                                    this.$texture[index].texture = tex;
                                });
                            }));
                            break;
                        case this.$texture2D:
                            Laya.Texture2D.load(this.$texture2D[index].url, Laya.Handler.create(this, (tex2D) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, tex2D, '3D纹理', () => {
                                    this.$texture2D[index].texture2D = tex2D;
                                });
                            }));
                            break;
                        case this.$effectsTex2D:
                            Laya.Texture2D.load(this.$effectsTex2D[index].url, Laya.Handler.create(this, (tex2D) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, tex2D, '3D纹理', () => {
                                    this.$effectsTex2D[index].texture2D = tex2D;
                                });
                            }));
                            break;
                        case this.$material:
                            Laya.Material.load(this.$material[index].url, Laya.Handler.create(this, (Material) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Material, '3D纹理', () => {
                                    this.$material[index].material = Material;
                                });
                            }));
                            break;
                        case this.$json:
                            Laya.loader.load(this.$json[index].url, Laya.Handler.create(this, (Json) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Json, '3D纹理', () => {
                                    this.$json[index].dataArr = Json["RECORDS"];
                                });
                            }), null, Laya.Loader.JSON);
                            break;
                        case this.$skeleton:
                            this.$skeleton[index].templet.on(Laya.Event.ERROR, this, () => {
                                console.log('XXXXXXXXXXX骨骼动画' + this.$skeleton[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                this.stepComplete();
                            });
                            this.$skeleton[index].templet.on(Laya.Event.COMPLETE, this, () => {
                                console.log('骨骼动画', this.$skeleton[index].templet.url, '加载完成！', '数组下标为：', index);
                                this.stepComplete();
                            });
                            this.$skeleton[index].templet.loadAni(this.$skeleton[index].url);
                            break;
                        case this.$prefab2D:
                            Laya.loader.load(this.$prefab2D[index].url, Laya.Handler.create(this, (prefab2d) => {
                                this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, prefab2d, '3D纹理', () => {
                                    let _prefab = new Laya.Prefab();
                                    _prefab.json = prefab2d;
                                    this.$prefab2D[index].prefab2D = _prefab;
                                });
                            }));
                            break;
                        default:
                            break;
                    }
                }
            }
            PreLoadAdmin._PreLoadScene = _PreLoadScene;
            class _PreLoadCutInScene extends _PreLoadScene {
                moduleOnAwake() {
                    this.$openName = SceneAdmin._PreLoadCutIn.openName;
                    this.$closeName = SceneAdmin._PreLoadCutIn.closeName;
                }
            }
            PreLoadAdmin._PreLoadCutInScene = _PreLoadCutInScene;
        })(PreLoadAdmin = Lwg.PreLoadAdmin || (Lwg.PreLoadAdmin = {}));
        let InitAdmin;
        (function (InitAdmin) {
            class _InitScene extends SceneAdmin._SceneBase {
                lwgOpenAni() {
                    return 100;
                }
                moduleOnStart() {
                    DateAdmin._init();
                }
                ;
            }
            InitAdmin._InitScene = _InitScene;
        })(InitAdmin = Lwg.InitAdmin || (Lwg.InitAdmin = {}));
        let ExecutionAdmin;
        (function (ExecutionAdmin) {
            let maxEx = 15;
            ExecutionAdmin._execution = {
                get value() {
                    if (!this['Execution/executionNum']) {
                        return Laya.LocalStorage.getItem('Execution/executionNum') ? Number(Laya.LocalStorage.getItem('Execution/executionNum')) : maxEx;
                    }
                    return this['Execution/executionNum'];
                },
                set value(val) {
                    console.log(val);
                    this['Execution/executionNum'] = val;
                    Laya.LocalStorage.setItem('Execution/executionNum', val.toString());
                }
            };
            ExecutionAdmin._addExDate = {
                get value() {
                    if (!this['Execution/addExDate']) {
                        return Laya.LocalStorage.getItem('Execution/addExDate') ? Number(Laya.LocalStorage.getItem('Execution/addExDate')) : (new Date()).getDay();
                    }
                    return this['Execution/addExDate'];
                },
                set value(val) {
                    this['Execution/addExDate'] = val;
                    Laya.LocalStorage.setItem('Execution/addExDate', val.toString());
                }
            };
            ExecutionAdmin._addExHours = {
                get value() {
                    if (!this['Execution/addExHours']) {
                        return Laya.LocalStorage.getItem('Execution/addExHours') ? Number(Laya.LocalStorage.getItem('Execution/addExHours')) : (new Date()).getHours();
                    }
                    return this['Execution/addExHours'];
                },
                set value(val) {
                    this['Execution/addExHours'] = val;
                    Laya.LocalStorage.setItem('Execution/addExHours', val.toString());
                }
            };
            ExecutionAdmin._addMinutes = {
                get value() {
                    if (!this['Execution/addMinutes']) {
                        return Laya.LocalStorage.getItem('Execution/addMinutes') ? Number(Laya.LocalStorage.getItem('Execution/addMinutes')) : (new Date()).getMinutes();
                    }
                    return this['Execution/addMinutes'];
                },
                set value(val) {
                    this['Execution/addMinutes'] = val;
                    Laya.LocalStorage.setItem('Execution/addMinutes', val.toString());
                }
            };
            function _createExecutionNode(parent) {
                let sp;
                Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    let num = sp.getChildByName('Num');
                    num.value = ExecutionAdmin._execution.value.toString();
                    sp.pos(297, 90);
                    sp.zOrder = 50;
                    ExecutionAdmin._ExecutionNode = sp;
                    ExecutionAdmin._ExecutionNode.name = '_ExecutionNode';
                }));
            }
            ExecutionAdmin._createExecutionNode = _createExecutionNode;
            function _addExecution(x, y, func) {
                let sp;
                Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.x = Laya.stage.width / 2;
                    sp.y = Laya.stage.height / 2;
                    sp.zOrder = 50;
                    if (ExecutionAdmin._ExecutionNode) {
                        Ani2DAdmin.move(sp, ExecutionAdmin._ExecutionNode.x, ExecutionAdmin._ExecutionNode.y, 800, () => {
                            Ani2DAdmin.fadeOut(sp, 1, 0, 200, 0, () => {
                                Ani2DAdmin.upDwon_Shake(ExecutionAdmin._ExecutionNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        }, 100);
                    }
                }));
            }
            ExecutionAdmin._addExecution = _addExecution;
            function createConsumeEx(subEx) {
                let label = Laya.Pool.getItemByClass('label', Laya.Label);
                label.name = 'label';
                Laya.stage.addChild(label);
                label.text = `${subEx}`;
                label.fontSize = 40;
                label.bold = true;
                label.color = '#59245c';
                label.x = ExecutionAdmin._ExecutionNode.x + 100;
                label.y = ExecutionAdmin._ExecutionNode.y - label.height / 2 + 4;
                label.zOrder = 100;
                Ani2DAdmin.fadeOut(label, 0, 1, 200, 150, () => {
                    Ani2DAdmin.leftRight_Shake(ExecutionAdmin._ExecutionNode, 15, 60, 0, null);
                    Ani2DAdmin.fadeOut(label, 1, 0, 600, 400, () => {
                    });
                });
            }
            ExecutionAdmin.createConsumeEx = createConsumeEx;
            class ExecutionNode extends SceneAdmin._ObjectBase {
                constructor() {
                    super(...arguments);
                    this.timeSwitch = true;
                    this.time = 0;
                    this.countNum = 59;
                }
                lwgOnAwake() {
                    this.Num = this._Owner.getChildByName('Num');
                    this.CountDown = this._Owner.getChildByName('CountDown');
                    this.CountDown_Board = this._Owner.getChildByName('CountDown_Board');
                    this.countNum = 59;
                    this.CountDown.text = '00:' + this.countNum;
                    this.CountDown_Board.text = this.CountDown.text;
                    let d = new Date;
                    if (d.getDate() !== ExecutionAdmin._addExDate.value) {
                        ExecutionAdmin._execution.value = maxEx;
                    }
                    else {
                        if (d.getHours() == ExecutionAdmin._addExHours.value) {
                            console.log(d.getMinutes(), ExecutionAdmin._addMinutes.value);
                            ExecutionAdmin._execution.value += (d.getMinutes() - ExecutionAdmin._addMinutes.value);
                            if (ExecutionAdmin._execution.value > maxEx) {
                                ExecutionAdmin._execution.value = maxEx;
                            }
                        }
                        else {
                            ExecutionAdmin._execution.value = maxEx;
                        }
                    }
                    this.Num.value = ExecutionAdmin._execution.value.toString();
                    ExecutionAdmin._addExDate.value = d.getDate();
                    ExecutionAdmin._addExHours.value = d.getHours();
                    ExecutionAdmin._addMinutes.value = d.getMinutes();
                }
                countDownAddEx() {
                    this.time++;
                    if (this.time % 60 == 0) {
                        this.countNum--;
                        if (this.countNum < 0) {
                            this.countNum = 59;
                            ExecutionAdmin._execution.value += 1;
                            this.Num.value = ExecutionAdmin._execution.value.toString();
                            let d = new Date;
                            ExecutionAdmin._addExHours.value = d.getHours();
                            ExecutionAdmin._addMinutes.value = d.getMinutes();
                        }
                        if (this.countNum >= 10 && this.countNum <= 59) {
                            this.CountDown.text = '00:' + this.countNum;
                            this.CountDown_Board.text = this.CountDown.text;
                        }
                        else if (this.countNum >= 0 && this.countNum < 10) {
                            this.CountDown.text = '00:0' + this.countNum;
                            this.CountDown_Board.text = this.CountDown.text;
                        }
                    }
                }
                lwgOnStart() {
                    TimerAdmin._frameLoop(1, this, () => {
                        if (Number(this.Num.value) >= maxEx) {
                            if (this.timeSwitch) {
                                ExecutionAdmin._execution.value = maxEx;
                                this.Num.value = ExecutionAdmin._execution.value.toString();
                                this.CountDown.text = '00:00';
                                this.CountDown_Board.text = this.CountDown.text;
                                this.countNum = 60;
                                this.timeSwitch = false;
                            }
                        }
                        else {
                            this.timeSwitch = true;
                            this.countDownAddEx();
                        }
                    });
                }
            }
            ExecutionAdmin.ExecutionNode = ExecutionNode;
        })(ExecutionAdmin = Lwg.ExecutionAdmin || (Lwg.ExecutionAdmin = {}));
    })(Lwg || (Lwg = {}));
    var Lwg$1 = Lwg;
    let LwgPlatform = Lwg.PlatformAdmin;
    let LwgGame = Lwg.GameAdmin;
    let LwgScene = Lwg.SceneAdmin;
    let LwgAdaptive = Lwg.AdaptiveAdmin;
    let LwgSceneAni = Lwg.SceneAniAdmin;
    let LwgNode = Lwg.NodeAdmin;
    let LwgDialogue = Lwg.Dialogue;
    let LwgEvent = Lwg.EventAdmin;
    let LwgTimer = Lwg.TimerAdmin;
    let LwgData = Lwg.DataAdmin;
    let LwgStorage = Lwg.StorageAdmin;
    let LwgDate = Lwg.DateAdmin;
    let LwgSet = Lwg.SetAdmin;
    let LwgAudio = Lwg.AudioAdmin;
    let LwgClick = Lwg.ClickAdmin;
    let LwgColor = Lwg.ColorAdmin;
    let LwgEff2D = Lwg.Eff2DAdmin;
    let LwgEff3D = Lwg.Eff3DAdmin;
    let LwgAni2D = Lwg.Ani2DAdmin;
    let LwgAni3D = Lwg.Ani3DAdmin;
    let LwgExecution = Lwg.ExecutionAdmin;
    let LwgGold = Lwg.GoldAdmin;
    let LwgTools = Lwg.ToolsAdmin;
    let LwgPreLoad = Lwg.PreLoadAdmin;
    let LwgAdmin = Lwg.InitAdmin;

    var _Res;
    (function (_Res) {
        class $scene3D {
        }
        $scene3D.MakeClothes = {
            url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/_Lwg3D/_Scene/LayaScene_3DDressUp/Conventional/3DDressUp.ls`,
            scene3D: null,
        };
        _Res.$scene3D = $scene3D;
        class $texture2D {
        }
        $texture2D.bgStart = {
            url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
            texture2D: null,
        };
        _Res.$texture2D = $texture2D;
        ;
        class $scene2D {
        }
        $scene2D.Start = { url: `Scene/${'Start'}.json` };
        $scene2D.Guide = { url: `Scene/${'Guide'}.json` };
        $scene2D.PreLoadStep = { url: `Scene/${'PreLoadCutIn'}.json` };
        $scene2D.MakePattern = { url: `Scene/${'MakePattern'}.json` };
        $scene2D.MakeTailor = { url: `Scene/${'MakeTailor'}.json` };
        _Res.$scene2D = $scene2D;
        ;
        class $prefab2D {
        }
        $prefab2D.NativeRoot = {
            url: 'Prefab/NativeRoot.json',
            prefab2D: null,
        };
        $prefab2D.BtnAgain = {
            url: 'Prefab/BtnAGainTow.json',
            prefab2D: null,
        };
        $prefab2D.BtnBack = {
            url: 'Prefab/BtnBack3.json',
            prefab2D: null,
        };
        $prefab2D.BtnRollback = {
            url: 'Prefab/BtnRollback.json',
            prefab2D: null,
        };
        $prefab2D.diy_bottom_002_final = {
            url: 'Prefab/diy_bottom_002_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_bottom_003_final = {
            url: 'Prefab/diy_bottom_003_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_bottom_004_final = {
            url: 'Prefab/diy_bottom_004_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_bottom_005_final = {
            url: 'Prefab/diy_bottom_005_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_bottom_006_final = {
            url: 'Prefab/diy_bottom_006_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_001_final = {
            url: 'Prefab/diy_dress_001_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_002_final = {
            url: 'Prefab/diy_dress_002_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_003_final = {
            url: 'Prefab/diy_dress_003_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_004_final = {
            url: 'Prefab/diy_dress_004_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_005_final = {
            url: 'Prefab/diy_dress_005_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_006_final = {
            url: 'Prefab/diy_dress_006_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_007_final = {
            url: 'Prefab/diy_dress_007_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_dress_008_final = {
            url: 'Prefab/diy_dress_008_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_top_003_final = {
            url: 'Prefab/diy_top_003_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_top_004_final = {
            url: 'Prefab/diy_top_004_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_top_005_final = {
            url: 'Prefab/diy_top_005_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_top_006_final = {
            url: 'Prefab/diy_top_006_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_top_007_final = {
            url: 'Prefab/diy_top_007_final.json',
            prefab2D: null,
        };
        $prefab2D.diy_top_008_final = {
            url: 'Prefab/diy_top_008_final.json',
            prefab2D: null,
        };
        _Res.$prefab2D = $prefab2D;
        ;
        class $json {
        }
        $json.GeneralClothes = {
            url: `_LwgData/_DressingRoom/GeneralClothes.json`,
            dataArr: null,
        };
        $json.DIYClothes = {
            url: `_LwgData/_MakeTailor/DIYClothes.json`,
            dataArr: null,
        };
        $json.DIYClothesDiff = {
            url: `_LwgData/_MakeTailor/DIYClothesDiff.json`,
            dataArr: null,
        };
        $json.MakePattern = {
            url: `_LwgData/_MakePattern/MakePattern.json`,
            dataArr: null,
        };
        $json.Ranking = {
            url: `_LwgData/_Ranking/Ranking.json`,
            dataArr: null,
        };
        $json.CheckIn = {
            url: `_LwgData/_CheckIn/CheckIn.json`,
            dataArr: null,
        };
        _Res.$json = $json;
        ;
        class $prefab3D {
        }
        _Res.$prefab3D = $prefab3D;
        ;
        class $mesh3D {
        }
        _Res.$mesh3D = $mesh3D;
        ;
        class $material {
        }
        _Res.$material = $material;
        ;
        class $texture {
        }
        _Res.$texture = $texture;
        ;
        class $pic2D {
        }
        _Res.$pic2D = $pic2D;
        ;
        class $skeleton {
        }
        _Res.$skeleton = $skeleton;
        ;
    })(_Res || (_Res = {}));
    var _CutInRes;
    (function (_CutInRes) {
        let Start;
        (function (Start) {
            class $texture2D {
            }
            $texture2D.bgStart = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
                texture2D: null,
            };
            Start.$texture2D = $texture2D;
            ;
        })(Start = _CutInRes.Start || (_CutInRes.Start = {}));
        let MakePattern;
        (function (MakePattern) {
            class $texture2D {
            }
            $texture2D.bgMakePattern = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgMakePattern.jpg`,
                texture2D: null,
            };
            $texture2D.bgPhoto = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgPhoto.png`,
                texture2D: null,
            };
            MakePattern.$texture2D = $texture2D;
            ;
        })(MakePattern = _CutInRes.MakePattern || (_CutInRes.MakePattern = {}));
        let DressingRoom;
        (function (DressingRoom) {
            class $texture2D {
            }
            $texture2D.bgDressingRoom = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgDressingRoom.jpg`,
                texture2D: null,
            };
            DressingRoom.$texture2D = $texture2D;
        })(DressingRoom = _CutInRes.DressingRoom || (_CutInRes.DressingRoom = {}));
    })(_CutInRes || (_CutInRes = {}));

    class _SceneName extends LwgScene._BaseName {
    }
    _SceneName.MakeTailor = 'MakeTailor';
    _SceneName.MakePattern = 'MakePattern';
    _SceneName.DressingRoom = 'DressingRoom';
    _SceneName.Tweeting_ChoosePhotos = 'Tweeting_ChoosePhotos';
    _SceneName.Tweeting_Dynamic = 'Tweeting_Dynamic';
    _SceneName.Tweeting_GetFans = 'Tweeting_GetFans';
    _SceneName.Tweeting_Main = 'Tweeting_Main';
    _SceneName.AdsHint = 'AdsHint';
    _SceneName.BackHint = 'BackHint';
    _SceneName.PersonalInfo = 'PersonalInfo';

    class _3DScene {
        constructor() {
            this.aniName = {
                Stand: 'Stand',
                Pose1: 'Pose1',
                Pose2: 'Pose2',
                DispalyCloth: 'DispalyCloth',
                Walk: 'Walk',
            };
        }
        static _ins() {
            if (!this.ins) {
                this.ins = new _3DScene();
                this.ins._Owner = _Res.$scene3D.MakeClothes.scene3D;
                Laya.stage.addChild(this.ins._Owner);
                this.ins._Role = this.ins._Owner.getChildByName('Role');
                this.ins._RoleFPos = new Laya.Vector3(this.ins._Role.transform.position.x, this.ins._Role.transform.position.y, this.ins._Role.transform.position.z);
                this.ins._Root = this.ins._Role.getChildByName('Root');
                this.ins._DIY = this.ins._Root.getChildByName('DIY');
                this.ins._General = this.ins._Root.getChildByName('General');
                this.ins._DBottoms = this.ins._DIY.getChildByName('Bottoms');
                this.ins._DTop = this.ins._DIY.getChildByName('Top');
                this.ins._DDress = this.ins._DIY.getChildByName('Dress');
                this.ins._GBottoms = this.ins._General.getChildByName('Bottoms');
                this.ins._GTop = this.ins._General.getChildByName('Top');
                this.ins._GDress = this.ins._General.getChildByName('Dress');
                this.ins._RoleAni = this.ins._Role.getComponent(Laya.Animator);
                this.ins._MainCamara = this.ins._Owner.getChildByName('Main Camera');
                this.ins._MirrorCamera = this.ins._Owner.getChildByName('MirrorCamera');
                this.ins._Mirror = this.ins._Owner.getChildByName('Mirror');
                this.ins._Bg1 = this.ins._Owner.getChildByName('Bg1');
                this.ins._bg1Mat = this.ins._Bg1.meshRenderer.material;
                this.ins._Bg2 = this.ins._Owner.getChildByName('Bg2');
                this.ins._BtnDress = this.ins._Owner.getChildByName('BtnDress');
                this.ins._BtnTop = this.ins._Owner.getChildByName('BtnTop');
                this.ins._BtnBottoms = this.ins._Owner.getChildByName('BtnBottoms');
                this.ins._BtnDressingRoom = this.ins._Owner.getChildByName('BtnDressingRoom');
                this.ins._DIYHanger = this.ins._Owner.getChildByName('DIYHanger');
                this.ins.fillLight_Right1 = this.ins._Owner.getChildByName('fillLight_Right1');
                this.ins.fillLight_Right2 = this.ins._Owner.getChildByName('fillLight_Right2');
                this.ins.fillLight_Left1 = this.ins._Owner.getChildByName('fillLight_Left1');
                this.ins.fillLight_Left2 = this.ins._Owner.getChildByName('fillLight_Left2');
                this.ins.fillLight_Back1 = this.ins._Owner.getChildByName('fillLight_Back1');
                this.ins.fillLight_Bottom1 = this.ins._Owner.getChildByName('fillLight_Bottom1');
                this.ins.fillLight_Bottom2 = this.ins._Owner.getChildByName('fillLight_Bottom2');
                this.ins.fillLight_Left1.intensity = 0.15;
                this.ins.fillLight_Right1.intensity = 0.15;
                this.ins.fillLight_Bottom2.active = false;
                this.ins.fillLight_Left2.intensity = 0.4;
                this.ins.fillLight_Right2.intensity = 0.4;
            }
            return this.ins;
        }
        playDispalyAni() {
            this._RoleAni.play(this.aniName.Stand);
            this._RoleAni.play(this.aniName.DispalyCloth);
            Laya.timer.clearAll(this._Role);
            LwgTimer._once(3200, this._Role, () => {
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            });
        }
        playPoss1Ani() {
            this._RoleAni.crossFade(this.aniName.Pose1, 0.3);
            Laya.timer.clearAll(this._Role);
            LwgTimer._once(3200, this._Role, () => {
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            });
        }
        playPoss2Ani() {
            this._RoleAni.crossFade(this.aniName.Pose2, 0.3);
            Laya.timer.clearAll(this._Role);
            LwgTimer._once(3200, this._Role, () => {
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            });
        }
        playStandAni() {
            Laya.timer.clearAll(this);
            Laya.timer.clearAll(this._Role);
            this._RoleAni.crossFade(this.aniName.Stand, 0.3);
        }
        playRandomPose() {
            LwgTimer._frameLoop(500, this, () => {
                LwgTools._Number.randomOneHalf() == 0 ? _3DScene._ins().playPoss1Ani() : _3DScene._ins().playPoss2Ani();
            }, true);
        }
        get btnDressPos() {
            return LwgTools._3D.posToScreen(this._BtnDress.transform.position, this._MainCamara);
        }
        get btnTopPos() {
            return LwgTools._3D.posToScreen(this._BtnTop.transform.position, this._MainCamara);
        }
        get btnBottomsPos() {
            return LwgTools._3D.posToScreen(this._BtnBottoms.transform.position, this._MainCamara);
        }
        get btnDressingRoomPos() {
            return LwgTools._3D.posToScreen(this._BtnDressingRoom.transform.position, this._MainCamara);
        }
        cameraToSprite(scene) {
            _3DScene._ins().mirrorSurface = false;
            const Sp = new Laya.Sprite;
            Sp.zOrder = -1;
            scene.addChild(Sp)['size'](Laya.stage.width, Laya.stage.height);
            LwgTools._Draw.cameraToSprite(this._MainCamara, Sp);
            return Sp;
        }
        openStartAni(func) {
            func();
            this.playRandomPose();
            this._DIYHanger.active = false;
            this._Role.active = true;
            this._MirrorCamera.active = false;
        }
        intoStart(whereFrom) {
            this.playStandAni();
            this._Owner.active = true;
            this._DIYHanger.active = false;
            this.fillLight_Left1.active = false;
            this.fillLight_Right1.active = false;
            this._MirrorCamera.active = false;
            if (whereFrom === _SceneName.PreLoad) {
                this._bg1Mat.albedoTexture = _Res.$texture2D.bgStart.texture2D;
            }
            else {
                this._bg1Mat.albedoTexture = _CutInRes.Start.$texture2D.bgStart.texture2D;
            }
        }
        intogeDressingRoom() {
            _3DScene._ins().playStandAni();
            this._MirrorCamera.active = true;
            this._bg1Mat.albedoTexture = _CutInRes.DressingRoom.$texture2D.bgDressingRoom.texture2D;
        }
        get mirrorSurface() {
            return this['_mirrorSurface'];
        }
        ;
        set mirrorSurface(bool) {
            this['_mirrorSurface'] = bool;
        }
        openMirror(_Sp) {
            this.mirrorSurface = true;
            LwgTimer._clearAll([this._Mirror]);
            LwgTimer._frameLoop(1, this._Mirror, () => {
                if (this.mirrorSurface) {
                    this._MirrorCamera.renderTarget = new Laya.RenderTexture(_Sp.width, _Sp.height);
                    this._MirrorCamera.renderingOrder = -1;
                    this._MirrorCamera.clearFlag = Laya.CameraClearFlags.Sky;
                    this.mirrortex && this.mirrortex.destroy();
                    this.mirrortex = new Laya.Texture(this._MirrorCamera.renderTarget, Laya.Texture.DEF_UV);
                    _Sp.graphics.drawTexture(this.mirrortex);
                }
            });
        }
        closeMirror() {
            this.mirrorSurface = false;
        }
        intoMakePattern() {
            this._Owner.active = true;
            this.fillLight_Left1.active = true;
            this.fillLight_Right1.active = true;
            this._bg1Mat.albedoTexture = _CutInRes.MakePattern.$texture2D.bgMakePattern.texture2D;
        }
        intoMakeTailor() {
            _3DScene._ins()._Owner.active = false;
        }
        photoBg() {
            this._bg1Mat.albedoTexture = _CutInRes.MakePattern.$texture2D.bgPhoto.texture2D;
        }
        displayDress() {
            this._GBottoms.active = this._GTop.active = this._DBottoms.active = this._DTop.active = false;
        }
        displayTopAndBotton() {
            this._GDress.active = this._DDress.active = false;
        }
    }
    class _3DDIYCloth {
        constructor() {
        }
        static _ins() {
            if (!this.ins) {
                this.ins = new _3DDIYCloth();
            }
            return this.ins;
        }
        remake(classify, pitchName) {
            this.name = pitchName;
            _3DScene._ins()._DIYHanger.active = true;
            _3DScene._ins()._Role.active = false;
            const Classify = _3DScene._ins()._DIYHanger.getChildByName(classify);
            LwgTools._Node.showExcludedChild3D(_3DScene._ins()._DIYHanger, [Classify.name]);
            this.Present = Classify.getChildByName(pitchName);
            LwgTools._Node.showExcludedChild3D(Classify, [this.Present.name]);
            this.Present.transform.localRotationEulerY = 180;
            this.Front = this.Present.getChildByName(`${this.Present.name}_0`);
            this.frontMat = this.Front.meshRenderer.material;
            this.Reverse = this.Present.getChildByName(`${this.Present.name}_1`);
            this.reverseMat = this.Reverse.meshRenderer.material;
            this.ModelTap = this.Present.getChildByName('ModelTap');
            this.ModelTap.transform.position = new Laya.Vector3(this.Present.transform.position.x, this.ModelTap.transform.position.y, this.Present.transform.position.z);
            this.hanger = this.Present.getChildByName('hanger');
            this.hanger.active = true;
            let center = this.Front.meshRenderer.bounds.getCenter();
            let extent = this.Front.meshRenderer.bounds.getExtent();
            let p1 = new Laya.Vector3(center.x, center.y + extent.y, center.z);
            let p2 = new Laya.Vector3(center.x, center.y - extent.y, center.z);
            let point1 = LwgTools._3D.posToScreen(p1, _3DScene._ins()._MainCamara);
            let point2 = LwgTools._3D.posToScreen(p2, _3DScene._ins()._MainCamara);
            this.texHeight = point2.y - point1.y;
        }
        addTexture2D(arr) {
            this.frontMat.albedoTexture && this.frontMat.albedoTexture.destroy();
            this.frontMat.albedoTexture = arr[0];
            this.reverseMat.albedoTexture && this.reverseMat.albedoTexture.destroy();
            this.reverseMat.albedoTexture = arr[1];
        }
        rotate(num) {
            if (num == 1) {
                this.Present.transform.localRotationEulerY++;
            }
            else {
                this.Present.transform.localRotationEulerY--;
            }
        }
    }

    var _Ranking;
    (function (_Ranking) {
        class _mergePro extends Lwg$1.DataAdmin._BaseProperty {
            constructor() {
                super(...arguments);
                this.rankNum = 'rankNum';
                this.fansNum = 'fansNum';
                this.iconSkin = 'iconSkin';
            }
        }
        _Ranking._mergePro = _mergePro;
        _Ranking._whereFrom = _SceneName.Start;
        class _Data extends LwgData._Table {
            constructor() {
                super(...arguments);
                this._classify = {
                    other: 'other',
                    self: 'self',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Data('RankingData', _Res.$json.Ranking.dataArr, true);
                    this.ins._mergePro = new _mergePro();
                    if (!this.ins._arr[0]['iconSkin']) {
                        for (let index = 0; index < this.ins._arr.length; index++) {
                            const element = this.ins._arr[index];
                            element['iconSkin'] = `Game/UI/Ranking/IconSkin/avatar_${element[this.ins._property.serial]}.png`;
                        }
                    }
                    this.ins._pitchName = '玩家';
                    this.ins._sortByProperty(this.ins._mergePro.fansNum, this.ins._mergePro.rankNum);
                }
                return this.ins;
            }
        }
        _Ranking._Data = _Data;
    })(_Ranking || (_Ranking = {}));
    var _Guide;
    (function (_Guide) {
        let Event;
        (function (Event) {
            Event["closeGuide"] = "Guide/closeGuide";
            Event["vanishGuide"] = "Guide/vanishGuide";
            Event["StartBtnDress"] = "Guide/StartBtnDress";
            Event["MakeTailorPulldown"] = "Guide/MakeTailorPulldown";
            Event["MakeTailorChangeCloth"] = "Guide/MakeTailorChangeCloth";
            Event["MakeTailorBtnCom"] = "Guide/MakeTailorBtnCom";
            Event["MakeTailorStartTailor"] = "Guide/MakeTailorStartTailor";
            Event["MakeTailorNewTailor"] = "Guide/MakeTailorNewTailor";
            Event["MakeTailorCloseTailor"] = "Guide/MakeTailorCloseTailor";
            Event["MakeTailorOpenTailor"] = "Guide/MakeTailorOpenTailor";
            Event["MakePatternChooseClassify"] = "Guide/MakePatternChooseClassify";
            Event["MakePatternPattern1"] = "Guide/MakePatternPattern1";
            Event["MakePatternFrame1"] = "Guide/MakePatternFrame1";
            Event["MakePatternTurnFace"] = "Guide/MakePatternTurnFace";
            Event["MakePatternFrame2"] = "Guide/MakePatternFrame2";
            Event["MakePatternPattern2"] = "Guide/MakePatternPattern2";
            Event["MakePatternBtnCom"] = "Guide/MakePatternBtnCom";
            Event["TweetingBtnChoosePhoto"] = "Guide/TweetingBtnChoosePhoto";
            Event["TweetingChoosePhoto"] = "Guide/TweetingChoosePhoto";
            Event["TweetingBtnSend"] = "Guide/TweetingBtnSend";
            Event["TweetingBtnDoubleFans"] = "Guide/TweetingBtnDoubleFans";
            Event["RankingCloseBtn"] = "Guide/RankingCloseBtn";
            Event["PersonalInfoBtn"] = "Guide/PersonalInfoBtn";
            Event["PersonalInfoWriteName"] = "Guide/PersonalInfoWriteName";
            Event["PersonalInfoCloseBtn"] = "Guide/PersonalInfoCloseBtn";
            Event["DelayBtnCheckIn"] = "Start/DelayBtnCheckIn";
            Event["BtnCheckIn"] = "Guide/BtnCheckIn";
            Event["CheckInGetReward"] = "Guide/CheckInGetReward";
            Event["CheckInCloseBtn"] = "Guide/CheckInBtnClose";
            Event["StartOtherBtnClick"] = "Guide/StartOtherBtnClick";
        })(Event = _Guide.Event || (_Guide.Event = {}));
        _Guide._complete = {
            get value() {
                return LwgStorage._bool('_Guide_complete').value;
            },
            set value(val) {
                LwgStorage._bool('_Guide_complete').value = val;
            }
        };
        _Guide.MmakeTailorPulldownSwicth = false;
        _Guide.MmakeTailorBtnComSwicth = false;
        _Guide.MakePatternState = 'ChooseClassify';
        _Guide.MakePatternStateType = {
            ChooseClassify: `ChooseClassify`,
            Pattern1: 'Pattern1',
            Frame1: 'Frame1',
            TurnFace: 'TurnFace',
            Frame2: 'Frame2',
            Pattern2: 'Pattern2',
            BtnCom: 'BtnCom',
            closeGuide: 'closeGuide',
        };
        _Guide.CheckInCloseBtn = false;
    })(_Guide || (_Guide = {}));
    var _PersonalInfo;
    (function (_PersonalInfo) {
        _PersonalInfo._name = {
            get value() {
                return LwgStorage._str('playerName', null, 'You').value;
            },
            set value(str) {
                LwgStorage._str('playerName').value = str;
            }
        };
    })(_PersonalInfo || (_PersonalInfo = {}));
    var _BackHint;
    (function (_BackHint) {
    })(_BackHint || (_BackHint = {}));
    var _PreLoadCutIn;
    (function (_PreLoadCutIn) {
        _PreLoadCutIn._fromBack = false;
    })(_PreLoadCutIn || (_PreLoadCutIn = {}));
    var _Start;
    (function (_Start) {
        let Event;
        (function (Event) {
            Event["photo"] = "Start/photo";
            Event["updateRanking"] = "Start/updateRanking";
            Event["BtnPersonalInfo"] = "Start/BtnPersonalInfo";
        })(Event = _Start.Event || (_Start.Event = {}));
    })(_Start || (_Start = {}));
    class _mergeProAllClothes extends Lwg$1.DataAdmin._BaseProperty {
        constructor() {
            super(...arguments);
            this.icon = 'icon';
            this.putOn = 'putOn';
            this.part = 'part';
        }
    }
    class _AllClothes extends LwgData._Table {
        constructor() {
            super(...arguments);
            this._classify = {
                DIY: 'DIY',
                General: 'General',
            };
            this._part = {
                Dress: 'Dress',
                Top: 'Top',
                Bottoms: 'Bottoms',
                FaceMask: 'FaceMask',
                Accessories: 'Accessories',
                Shoes: 'Shoes',
                Hair: 'Hair',
            };
        }
        static _ins() {
            if (!this.ins) {
                this.ins = new _AllClothes('ClothesGeneral', _Res.$json.GeneralClothes.dataArr, true);
                this.ins._mergePro = new _mergeProAllClothes();
                if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                    this.ins._deleteObjByName('ads');
                }
            }
            return this.ins;
        }
        getDIYTexBasicUrl(clothesName) {
            return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/DIYTexbasic/${clothesName.substr(0, clothesName.length - 5)}basic.png`;
        }
        getGeneralIcon(clothesName) {
            return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Icon/General/${clothesName}.png`;
        }
        ;
        collectDIY() {
            let DIYArr = _DIYClothes._ins()._getArrByNoProperty(_DIYClothes._ins()._otherPro.icon, "");
            const copyArr = LwgTools._ObjArray.arrCopy(DIYArr);
            LwgTools._ObjArray.modifyProValue(copyArr, this._property.classify, 'DIY');
            this._addObjectArr(copyArr);
            return copyArr;
        }
        changeAfterMaking() {
            this.collectDIY();
            this.accurateChange(_DIYClothes._ins()._getPitchProperty('part'), _DIYClothes._ins()._pitchName);
        }
        changeClass(classify, partArr, playAni, start) {
            const _classify = _3DScene._ins()._Root.getChildByName(classify);
            for (let i = 0; i < _classify.numChildren; i++) {
                const _classifySp = _classify.getChildAt(i);
                _classifySp.active = false;
                for (let j = 0; j < partArr.length; j++) {
                    const obj = partArr[j];
                    if (obj[this._mergePro.part] === _classifySp.name) {
                        _classifySp.active = true;
                        for (let k = 0; k < _classifySp.numChildren; k++) {
                            const cloth = _classifySp.getChildAt(k);
                            if (cloth.name === obj[this._property.name]) {
                                cloth.active = true;
                                const delay = start ? 40 : 15;
                                if (classify === 'DIY') {
                                    const url = this.getDIYTexBasicUrl(cloth.name);
                                    const fSp = new Laya.Sprite;
                                    fSp.visible = false;
                                    Laya.stage.addChild(fSp);
                                    fSp.zOrder = 1000;
                                    fSp.size(512, 512);
                                    fSp.scale(1, -1);
                                    fSp.pos(0, 512);
                                    const FImg = new Laya.Image;
                                    FImg.skin = url;
                                    fSp.addChild(FImg);
                                    FImg.size(512, 512);
                                    FImg.pos(0, 0);
                                    const ftexData = LwgStorage._array(`${cloth.name}/${_DIYClothes._ins()._otherPro.texF}`).value;
                                    for (let index = 0; index < ftexData.length; index++) {
                                        const data = ftexData[index];
                                        const Img = new Laya.Image;
                                        fSp.addChild(Img);
                                        Img.skin = `Pattern/${data['name']}.png`;
                                        Img.x = data['x'];
                                        Img.y = data['y'];
                                        Img.anchorX = data['anchorX'];
                                        Img.anchorY = data['anchorY'];
                                        Img.width = data['width'];
                                        Img.height = data['height'];
                                        Img.height = data['height'];
                                        Img.rotation = data['rotation'];
                                        Img.zOrder = data['zOrder'];
                                    }
                                    const front = cloth.getChildByName(`${cloth.name}_0`);
                                    const matF = front.skinnedMeshRenderer.material;
                                    LwgTimer._frameOnce(delay, this, () => {
                                        matF.albedoTexture && matF.albedoTexture.destroy();
                                        matF.albedoTexture = fSp.drawToTexture(fSp.width, fSp.height, fSp.x, fSp.y + fSp.height);
                                        fSp.removeSelf();
                                    });
                                    const rSp = new Laya.Sprite;
                                    rSp.visible = false;
                                    Laya.stage.addChild(rSp);
                                    rSp.zOrder = 1000;
                                    rSp.size(512, 512);
                                    rSp.scale(1, -1);
                                    const RImg = new Laya.Image;
                                    RImg.skin = url;
                                    rSp.addChild(RImg);
                                    RImg.size(512, 512);
                                    rSp.pos(512, 0);
                                    const rtexData = LwgStorage._array(`${cloth.name}/${_DIYClothes._ins()._otherPro.texR}`).value;
                                    for (let index = 0; index < rtexData.length; index++) {
                                        const data = rtexData[index];
                                        const Img = new Laya.Image;
                                        rSp.addChild(Img);
                                        Img.skin = `Pattern/${data['name']}.png`;
                                        Img.x = data['x'];
                                        Img.y = data['y'];
                                        Img.anchorX = data['anchorX'];
                                        Img.anchorY = data['anchorY'];
                                        Img.width = data['width'];
                                        Img.height = data['height'];
                                        Img.height = data['height'];
                                        Img.rotation = data['rotation'];
                                        Img.zOrder = data['zOrder'];
                                    }
                                    const reverse = cloth.getChildByName(`${cloth.name}_1`);
                                    const matR = reverse.skinnedMeshRenderer.material;
                                    LwgTimer._frameOnce(delay, this, () => {
                                        matR.albedoTexture && matR.albedoTexture.destroy();
                                        matR.albedoTexture = rSp.drawToTexture(rSp.width, rSp.height, rSp.x, rSp.y + rSp.height);
                                        rSp.removeSelf();
                                    });
                                }
                            }
                            else {
                                cloth.active = false;
                            }
                        }
                    }
                }
            }
            playAni && _3DScene._ins().playDispalyAni();
        }
        changeClothStart() {
            this.collectDIY();
            const arr = this._getArrByProperty(this._mergePro.putOn, true);
            this.changeClass(this._classify.DIY, arr, false, true);
            this.changeClass(this._classify.General, arr, false, true);
            this.startSpecialSet();
        }
        changeCloth() {
            const arr = this._getArrByProperty(this._mergePro.putOn, true);
            this.changeClass(this._classify.DIY, arr, true);
            this.changeClass(this._classify.General, arr, true);
        }
        startSpecialSet() {
            if (LwgStorage._bool('DressState').value) {
                _3DScene._ins()._GBottoms.active = _3DScene._ins()._GTop.active = _3DScene._ins()._DBottoms.active = _3DScene._ins()._DTop.active = false;
            }
            else {
                _3DScene._ins()._GDress.active = _3DScene._ins()._DDress.active = false;
            }
        }
        specialSet(part) {
            if (part === this._part.Dress) {
                LwgStorage._bool('DressState').value = true;
            }
            else if (part === this._part.Top || part === this._part.Bottoms) {
                LwgStorage._bool('DressState').value = false;
            }
            if (LwgStorage._bool('DressState').value) {
                _3DScene._ins().displayDress();
            }
            else {
                _3DScene._ins().displayTopAndBotton();
            }
        }
        accurateChange(partValue, name) {
            const arr = _AllClothes._ins()._getArrByProperty('part', partValue);
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (name === element['name']) {
                    element['putOn'] = true;
                }
                else {
                    element['putOn'] = false;
                }
            }
            _DIYClothes._ins()._setProperty(_DIYClothes._ins()._pitchName, 'putOn', true);
            _AllClothes._ins().changeCloth();
            _AllClothes._ins().specialSet(partValue);
            _AllClothes._ins()._refreshAndStorage();
        }
    }
    class _DIYClothes extends LwgData._Table {
        constructor() {
            super(...arguments);
            this._classify = {
                Dress: 'Dress',
                Top: 'Top',
                Bottoms: 'Bottoms',
                ads: 'ads',
            };
            this._otherPro = {
                color: 'color',
                icon: 'icon',
                diffX: 'diffX',
                diffY: 'diffY',
                texR: 'texR',
                texF: 'texF',
            };
        }
        static _ins() {
            if (!this.ins) {
                this.ins = new _DIYClothes('DIYClothes', _Res.$json.DIYClothes.dataArr, true);
                if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                    this.ins._deleteObjByName('ads');
                }
            }
            return this.ins;
        }
        ;
        getPitchTexBasicUrl() {
            return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/DIYTexbasic/${this._pitchName.substr(0, this._pitchName.length - 5)}basic.png`;
        }
        getDIYCutIcon(name) {
            return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Icon/DIY/${name.substr(0, name.length - 5)}cut.png`;
        }
        getColor() {
            let obj = this._getPitchObj();
            return [obj[`${this._otherPro.color}1`], obj[`${this._otherPro.color}2`]];
        }
        getClothesArr() {
            if (!this.ClothesArr) {
                this.ClothesArr = [];
                const dataArr = _DIYClothes._ins()._arr;
                for (let index = 0; index < dataArr.length; index++) {
                    if (`${dataArr[index]['name']}` !== 'ads') {
                        let CloBox = this.createClothes(`${dataArr[index]['name']}`);
                        this.ClothesArr.push(CloBox);
                    }
                    else {
                    }
                }
            }
            return this.ClothesArr;
        }
        createClothes(name, Scene) {
            const Cloth = LwgTools._Node.createPrefab(_Res.$prefab2D[name]['prefab2D']);
            const CloBox = new Laya.Sprite;
            CloBox.width = Laya.stage.width;
            CloBox.height = Laya.stage.height;
            CloBox.pivotX = CloBox.width / 2;
            CloBox.pivotY = CloBox.height / 2;
            CloBox.x = Laya.stage.width / 2;
            CloBox.y = Laya.stage.height / 2;
            CloBox.addChild(Cloth);
            CloBox.name = name;
            if (Scene) {
                Scene.addChild(CloBox);
                CloBox.zOrder = 20;
            }
            return CloBox;
        }
    }
    var _MakeTailor;
    (function (_MakeTailor) {
        let Event;
        (function (Event) {
            Event["scissorTrigger"] = "_MakeTailor_scissorTrigger";
            Event["completeEffcet"] = "_MakeTailor_completeAni";
            Event["changeClothes"] = "_MakeTailor_changeClothes";
            Event["scissorAppear"] = "_MakeTailor_scissorAppear";
            Event["scissorPlay"] = "_MakeTailor_scissorPlay";
            Event["scissorStop"] = "_MakeTailor_scissorStop";
            Event["scissorRotation"] = "_MakeTailor_scissorRotation";
            Event["scissorAgain"] = "_MakeTailor_scissorSitu";
            Event["scissorRemove"] = "_MakeTailor_scissorRemove";
        })(Event = _MakeTailor.Event || (_MakeTailor.Event = {}));
    })(_MakeTailor || (_MakeTailor = {}));
    var _MakePattern;
    (function (_MakePattern) {
        let Event;
        (function (Event) {
            Event["close"] = "_MakePattern/close";
            Event["createImg"] = "_MakePattern/createImg";
            Event["byteDanceBackStart"] = "_MakePattern/byteDanceBackStart";
        })(Event = _MakePattern.Event || (_MakePattern.Event = {}));
        class _Pattern extends LwgData._Table {
            constructor() {
                super(...arguments);
                this._classify = {
                    newYear: 'newYear',
                    basic: 'basic',
                    cat: 'cat',
                    pink: 'pink',
                    expression: 'expression',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Pattern('_Pattern', _Res.$json.MakePattern.dataArr, true);
                    this.ins._pitchClassify = this.ins._classify.newYear;
                    if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                        this.ins._deleteObjByName('ads');
                    }
                    this.ins.newYearArr = this.ins._getArrByClassify(this.ins._classify.newYear);
                    this.ins.newYearArr.push({}, {});
                    this.ins.basicArr = this.ins._getArrByClassify(this.ins._classify.basic);
                    this.ins.basicArr.push({}, {});
                    this.ins.catArr = this.ins._getArrByClassify(this.ins._classify.cat);
                    this.ins.catArr.push({}, {});
                    this.ins.pinkArr = this.ins._getArrByClassify(this.ins._classify.pink);
                    this.ins.pinkArr.push({}, {});
                    this.ins.expressionArr = this.ins._getArrByClassify(this.ins._classify.expression);
                    this.ins.expressionArr.push({}, {});
                }
                return this.ins;
            }
        }
        _MakePattern._Pattern = _Pattern;
        class _PatternDiff extends LwgData._Table {
            constructor() {
                super(...arguments);
                this._otherPro = {
                    fDiffX: 'fDiffX',
                    fDiffY: 'fDiffY',
                    rDiffX: 'rDiffX',
                    rDiffY: 'rDiffY',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _PatternDiff('_DIYClothesDiff', _Res.$json.DIYClothesDiff.dataArr, false);
                }
                return this.ins;
            }
            get fDiffX() {
                return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'fDiffX');
            }
            ;
            get fDiffY() {
                return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'fDiffY');
            }
            ;
            get rDiffX() {
                return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'rDiffX');
            }
            ;
            get rDiffY() {
                return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'rDiffY');
            }
            ;
        }
        _MakePattern._PatternDiff = _PatternDiff;
    })(_MakePattern || (_MakePattern = {}));
    var _DressingRoom;
    (function (_DressingRoom) {
        let Event;
        (function (Event) {
            Event["byteDanceBackStart"] = "_DressingRoom/byteDanceBackStart";
        })(Event = _DressingRoom.Event || (_DressingRoom.Event = {}));
    })(_DressingRoom || (_DressingRoom = {}));
    var _Tweeting;
    (function (_Tweeting) {
        _Tweeting._photo = {
            arr: [],
            take: (Scene, index) => {
                _Tweeting._photo.arr[index] && _Tweeting._photo.arr[index].destroy();
                _Tweeting._photo.arr[index] = Scene.drawToTexture(Laya.stage.width, Laya.stage.height, 0, 0);
            },
            clear: () => {
                for (let index = 0; index < _Tweeting._photo.arr.length; index++) {
                    const element = _Tweeting._photo.arr[index];
                    element && element.destroy();
                }
                _Tweeting._photo.arr = [];
                Laya.Resource.destroyUnusedResources();
            }
        };
        _Tweeting._attentionNum = {
            get value() {
                return LwgStorage._num('_MakePattern/attention', null, 180).value;
            },
            set value(val) {
                LwgStorage._num('_MakePattern/attention').value = val;
            }
        };
        _Tweeting._completeNum = {
            get value() {
                return LwgStorage._num('_MakePattern/completeNum').value;
            },
            set value(val) {
                LwgStorage._num('_MakePattern/completeNum').value = val;
            }
        };
        _Tweeting._forwardedNum = {
            get value() {
                return LwgStorage._num('Tweeting/forwarded', null, LwgTools._Number.randomOneBySection(75, 125, true)).value;
            },
            set value(val) {
                LwgStorage._num('Tweeting/forwarded').value = val;
            }
        };
        _Tweeting._commentNum = {
            get value() {
                return LwgStorage._num('Tweeting/Comment', null, LwgTools._Number.randomOneBySection(100, 150, true)).value;
            },
            set value(val) {
                LwgStorage._num('Tweeting/Comment').value = val;
            }
        };
        _Tweeting._likeNum = {
            get value() {
                return LwgStorage._num('Tweeting/like', null, LwgTools._Number.randomOneBySection(200, 250, true)).value;
            },
            set value(val) {
                LwgStorage._num('Tweeting/like').value = val;
            }
        };
        _Tweeting._brief = {
            getThree: () => {
                return LwgTools._Array.randomGetOut(_Tweeting._brief.all, 3);
            },
            getOne: () => {
                return LwgTools._Array.randomGetOut(_Tweeting._brief.all);
            },
            all: [
                '世界很烦，但我要很可爱',
                '生活就是见招拆招',
                '忠于自己，热爱生活',
                '我很有个性，但我不想签名',
                'T^T	',
                '你最怕什么',
                '宁缺毋滥',
                '围脖红人',
                '剪裁大师',
                '剪裁王',
            ]
        };
        _Tweeting._mainBody = {
            getOne: () => {
                _Tweeting._mainBody.present = LwgTools._Array.randomGetOne(_Tweeting._mainBody.all);
                return _Tweeting._mainBody.present;
            },
            present: null,
            all: [
                '不管几岁，反正少女心万岁≧▽≦',
                '此处可爱贩卖机  24小时正常营业	',
                '欢迎光临我的手工小店，我会制作更多大家喜欢的衣服哦',
                '现在一定有个很可爱的人，在看我的这句话',
                '辛辛苦苦做了好久，结果很满意，好喜欢哦',
                '大家觉得我这套衣服怎么样',
                '闲来无事，做了一套衣服，感觉还不错',
                '我觉得吧，这次发挥的一般，下次会更好，敬请期待',
                '浮游于这个世界所产生的热能 也比不过喜欢你的热忱	',
                '时间会把对你最好的人留在最后，毕竟喜欢是一阵风，而爱是细水长流',
                '人生难免遇上些许不如意，翻过这一页就会发现生活处处有美好',
                '也许，只有制作衣服的时候，才会让自己的心静下来',
                '讲道理，我觉得我的手艺还不错，我是不是可以考虑开一家店了？',
                '技术还不太行，需要多多磨炼，再努力做几件衣服吧~',
                '今天心情好，早早地起来做衣服了，我是可爱的小裁缝~啦啦啦~',
                '给妈妈做了件衣服，妈妈说好喜欢~',
                '还有什么可以比做自己喜欢的事更加让人开心的呢~',
                '一些些自己的小设计，就可以让一件衣服焕发生机',
                '也许只是一瞬间的灵感，我将会付之于行动来实现它',
                '对于剪裁和搭配的热情，我不会输给任何人的~',
                '加油，我会成为最好的设计师的，我会爆火！~',
                '坚持不懈，认真对待自己的，努力成为最好的设计师！~',
                '感谢大家的支持，我会努力的',
            ]
        };
        _Tweeting._reply = {
            getTow: () => {
                return LwgTools._Array.randomGetOut(_Tweeting._reply.all, 2);
            },
            all: [
                '加油，坚持，我看好你哦',
                '好好看，我也想要',
                '那么请问在哪里可以买到呢',
                '有一说一，真的还可以',
                '感觉，你做的越来越好了',
                '我也想和你一样拥有如此灵巧的双手',
                '真的好看，加油',
                '我的天，这也太美了吧',
                'OMG，买他买他！~',
                '沙发~~',
                '点赞这条回复，你会好运连连',
                '求翻牌，你这也太美了吧',
                '太适合仙女了吧',
                '我也想学学，能教教我吗',
                '感觉你能火，坚持，加油',
                '感觉没有什么可以难倒你',
                '我想和你一样心灵手巧',
                '我的天，这是真的太好看了',
                ' U1S1，是真漂亮~',
                '我觉得你还可以更优秀~',
                '不是我杠精，你这个真的，真可以，没的杠',
                '好看是真好看，难也是真的难',
                '感觉我学不会，咋办，好美',
                '仙女穿起来也太好看了吧',
                '花痴脸~这也太美了',
                '坚持，我看好你哦，感觉你能火',
                '天哪，这也太美了吧',
            ]
        };
        _Tweeting._photoIndex = 0;
    })(_Tweeting || (_Tweeting = {}));
    var _CheckIn;
    (function (_CheckIn) {
        class _Data extends LwgData._Table {
            constructor() {
                super(...arguments);
                this._otherPro = {
                    checkAddition: 'checkAddition',
                    otherRewardType: 'otherRewardType',
                    otherRewardNum: 'otherRewardNum',
                    otherCompelet: 'otherCompelet',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Data('CheckIn', _Res.$json.CheckIn.dataArr, true);
                }
                return this.ins;
            }
        }
        _CheckIn._Data = _Data;
        _CheckIn._immediately = {
            get value() {
                return LwgStorage._num('_CheckIn/immediately').value;
            },
            set value(val) {
                LwgStorage._num('_CheckIn/immediately').value = val;
            }
        };
        _CheckIn._checkInNum = {
            get value() {
                return LwgStorage._num('_CheckIn/checkInNum').value;
            },
            set value(val) {
                LwgStorage._num('_CheckIn/checkInNum').value = val;
            }
        };
        _CheckIn._lastCheckDate = {
            get value() {
                return LwgStorage._num('_CheckIn/lastCheckDate').value;
            },
            set value(val) {
                LwgStorage._num('_CheckIn/lastCheckDate').value = val;
            }
        };
        _CheckIn._todayCheckIn = {
            get value() {
                return _CheckIn._lastCheckDate.value == LwgDate._date.date ? true : false;
            },
        };
    })(_CheckIn || (_CheckIn = {}));
    var _Share;
    (function (_Share) {
        _Share._whereFrom = 'MakePattern';
    })(_Share || (_Share = {}));

    class PreLoadCutIn extends LwgPreLoad._PreLoadCutInScene {
        lwgOpenAniAfter() {
            let time = 0;
            LwgTimer._frameNumLoop(1, 30, this, () => {
                time++;
                this._LabelVar('Schedule').text = `${time}%`;
            }, () => {
                let obj = _CutInRes[this.$openName];
                obj = _CutInRes[this.$openName] ? obj : {};
                this.lwgStartLoding(obj);
            });
        }
        lwgAllComplete() {
            switch (this.$openName) {
                case _SceneName.MakePattern:
                    _3DDIYCloth._ins().remake(_DIYClothes._ins()._pitchClassify, _DIYClothes._ins()._pitchName);
                    _3DScene._ins().intoMakePattern();
                    console.log(_DIYClothes._ins().getPitchTexBasicUrl());
                    this._ImgVar('Front').loadImage(_DIYClothes._ins().getPitchTexBasicUrl(), Laya.Handler.create(this, () => {
                        var getTex = () => {
                            let ImgF = this._ImgVar('Front');
                            const tex = this._ImgVar('Front').drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height);
                            return [
                                tex,
                                tex
                            ];
                        };
                        _3DDIYCloth._ins().addTexture2D(getTex());
                    }));
                    break;
                case _SceneName.MakeTailor:
                    _DIYClothes._ins().ClothesArr = null;
                    _3DScene._ins().intoMakeTailor();
                    _DIYClothes._ins().getClothesArr();
                    break;
                case _SceneName.Start:
                    if (this.$closeName === _SceneName.MakePattern && !_PreLoadCutIn._fromBack) {
                        this.iconPhoto();
                    }
                    else {
                        _3DScene._ins().intoStart();
                    }
                    break;
                case _SceneName.DressingRoom:
                    _3DScene._ins().intogeDressingRoom();
                default:
                    break;
            }
            LwgTimer._frameOnce(30, this, () => {
                this._LabelVar('Schedule').text = `100%`;
            });
            return 1000;
        }
        iconPhoto() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                _3DScene._ins().intoStart();
                _DIYClothes._ins()._setPitchProperty(_DIYClothes._ins()._otherPro.icon, 'have');
                _AllClothes._ins().changeAfterMaking();
            }
            else {
                _3DScene._ins().photoBg();
                _3DDIYCloth._ins().hanger.active = false;
                _3DDIYCloth._ins().Present.transform.localRotationEulerY = 180;
                const sp = new Laya.Sprite;
                this._Owner.addChild(sp)['size'](126, 146);
                LwgTools._Draw.cameraToSprite(_3DScene._ins()._MainCamara, sp);
                LwgTimer._frameOnce(5, this, () => {
                    const base64Icon = LwgTools._Draw.screenshot(sp, 0.5);
                    Laya.LocalStorage.setItem(`${_DIYClothes._ins()._pitchName}/icon`, base64Icon);
                    _DIYClothes._ins()._setPitchProperty(_DIYClothes._ins()._otherPro.icon, 'have');
                    _AllClothes._ins().changeAfterMaking();
                    _3DScene._ins().intoStart();
                });
            }
        }
        lwgOnDisable() {
            _PreLoadCutIn._fromBack = false;
        }
    }

    class SubPkg {
        constructor() {
            this.pkgInfo = [
                { name: "Game", root: "Game/" },
                { name: "res", root: "res/" },
            ];
        }
        init() {
            console.log(`SubPkg  init`);
            console.log(`SubPkg  oppoGame`);
            this.pkgFlag = 0;
            this.loadPkg_OPPO();
        }
        loadPkg_wx() {
            if (this.pkgFlag == this.pkgInfo.length) {
                console.log("showLoading");
            }
            else {
                let info = this.pkgInfo[this.pkgFlag];
                let name = info.name;
                let root = info.root;
                Laya.Browser.window.wx.loadSubpackage({
                    name: name,
                    success: (res) => {
                        Laya.MiniAdpter.subNativeFiles[name] = root;
                        Laya.MiniAdpter.nativefiles.push(root);
                        this.pkgFlag++;
                        this.loadPkg_wx();
                    },
                    fail: (res) => {
                        console.error(`load ${name} err: `, res);
                    },
                });
            }
        }
        loadPkg_sq() {
            if (this.pkgFlag == this.pkgInfo.length) {
                console.log("GameInit");
            }
            else {
                let info = this.pkgInfo[this.pkgFlag];
                let name = info.name;
                let root = info.root;
                Laya.Browser.window.qq.loadSubpackage({
                    name: name,
                    success: (res) => {
                        this.pkgFlag++;
                        this.loadPkg_sq();
                    },
                    fail: (res) => {
                        console.error(`load ${name} err: `, res);
                    },
                });
            }
        }
        loadPkg_VIVO() {
            if (this.pkgFlag == this.pkgInfo.length) {
                console.log("GameInit");
            }
            else {
                let info = this.pkgInfo[this.pkgFlag];
                let name = info.name;
                let root = info.root;
                Laya.Browser.window.qg.loadSubpackage({
                    name: name,
                    success: (res) => {
                        this.pkgFlag++;
                        this.loadPkg_VIVO();
                    },
                    fail: (res) => {
                        console.error(`load ${name} err: `, res);
                    },
                });
            }
        }
        loadPkg_OPPO() {
            console.log("loadPkg_OPPOsssssssss");
            if (this.pkgFlag == this.pkgInfo.length) {
                LwgScene._openScene('PreLoad');
                console.log("GameInit");
            }
            else {
                let info = this.pkgInfo[this.pkgFlag];
                let name = info.name;
                let root = info.root;
                let subTask = Laya.Browser.window.qg.loadSubpackage({
                    name: name,
                    success: (res) => {
                        this.pkgFlag++;
                        this.loadPkg_OPPO();
                    },
                    fail: (res) => {
                        console.log("123123  " + JSON.stringify(res));
                        console.log(`load ${name} err: ` + JSON.stringify(res));
                    },
                });
            }
        }
    }

    class _GameAni {
        static _dialogOpenPopup(Content, Bg, func) {
            Content.scene.zOrder = Laya.stage.numChildren - 1;
            const time = 100;
            const delay = 100;
            Content.scale(0.5, 0.5);
            LwgAni2D.bombs_Appear(Content, 0, 1, 1.2, 0, time * 3, () => {
                func && func();
            });
            if (Bg) {
                Bg.alpha = 0;
                LwgAni2D.fadeOut(Bg, 0, 1, 200, delay * 2);
            }
            return time * 3;
        }
        static _dialogOpenFadeOut(Content, Bg, func) {
            Bg && LwgAni2D.fadeOut(Bg, 0, 1, 300, 0, () => {
                func && func();
            });
            LwgAni2D.fadeOut(Content, 0, 1, 250, 0, () => {
                !Bg && func && func();
            });
            return 300;
        }
        static _dialogCloseFadeOut(Content, Bg, func) {
            const time = 60;
            const delay = 100;
            LwgAni2D.fadeOut(Content, 1, 0, time * 3, delay * 1.5, () => {
                func && func();
            });
            Bg && LwgAni2D.fadeOut(Bg, 1, 0, time * 3);
            return time * 3 + delay * 1.5;
        }
        static _charactersEffect(label, bodyText, func) {
            for (let index = 0; index < bodyText.length; index++) {
                const char = bodyText.charAt(index);
                LwgTimer._frameOnce(10 * index, this, () => {
                    label.text += char;
                    if (index == bodyText.length - 1) {
                        func && func();
                    }
                });
            }
        }
        static _scaleHint(Node) {
            LwgTimer._loop(1000, this, () => {
                LwgAni2D.swell_shrink(Node, 1, 1.05, 300);
            });
        }
        static _fadeHint(Node) {
            LwgAni2D.fadeOut(Node, 0, 0.6, 1500, 0, () => {
                LwgAni2D.fadeOut(Node, 0.6, 0, 800, 0, () => {
                    LwgTimer._frameOnce(30, this, () => {
                        this._fadeHint(Node);
                    });
                });
            });
        }
    }

    class Guide extends LwgScene._SceneBase {
        constructor() {
            super(...arguments);
            this.btnComX = Laya.stage.width - 250;
            this.btnComY = 70;
            this.bgType = {
                present: 'present',
                vanish: 'vanish',
                appear: 'appear',
            };
            this._stepTailor = 0;
            this.posArr = [
                [Laya.stage.width / 2 + 110, 140],
                [Laya.stage.width / 2 - 110, Laya.stage.height / 2 - 220],
                [Laya.stage.width / 2 + 100, Laya.stage.height / 2 - 200],
                [Laya.stage.width / 2 + 200, Laya.stage.height - 150],
            ];
            this.nameArr = ['Line01', 'Line02', 'Line03', 'Line04'];
            this.presentName = null;
        }
        lwgOpenAni() {
            return 200;
        }
        lwgOnAwake() {
            this._ImgVar('Hand').scale(0, 0);
            this._ImgVar('Slide').scale(0, 0);
        }
        clickEffcet() {
            LwgEff2D._Aperture._continuous(this._Owner, [this._ImgVar('Hand').x, this._ImgVar('Hand').y + 28], [6, 6], null, null, [LwgEff2D._SkinUrl.圆形小光环], null, this._ImgVar('Hand').zOrder - 1, [1.2, 1.2], [0.6, 0.6], [0.01, 0.01]);
        }
        boreholeCircle(arr, handX, handY, func) {
            for (let index = 0; index < arr.length; index++) {
                const time = 80 / 8;
                let radiusBase = 15;
                const element = arr[index];
                const speed = (arr[index][2] - radiusBase) / time;
                LwgTimer._frameNumLoop(1, time, this, () => {
                    radiusBase += speed;
                    element[2] = radiusBase;
                    LwgTools._Draw.reverseCircleMask(this._ImgVar('Background'), arr, true);
                }, () => {
                    func && func();
                }, true);
            }
            handX && this._ImgVar('Hand').pos(handX, handY - 30);
        }
        boreholeRoundrect(arr, handX, handY, func) {
            handX && this._ImgVar('Hand').pos(handX, handY);
            for (let index = 0; index < arr.length; index++) {
                let widthBase = 0;
                let heightBase = 0;
                let radiuBase = 0;
                const element = arr[index];
                const time = 20;
                const speedX = (element[2] - widthBase) / time;
                const speedY = (element[3] - heightBase) / time;
                const speedR = (element[4] - radiuBase) / time;
                LwgTimer._frameNumLoop(1, time, this, () => {
                    widthBase += speedX;
                    heightBase += speedY;
                    radiuBase += speedR;
                    element[2] = widthBase;
                    element[3] = heightBase;
                    element[4] = radiuBase;
                    LwgTools._Draw.reverseRoundrectMask(this._ImgVar('Background'), arr, true);
                }, () => {
                    func && func();
                }, true);
            }
            handX && this._ImgVar('Hand').pos(handX, handY);
        }
        handAppear(delay, func) {
            const time = 200;
            LwgAni2D.scale(this._ImgVar('Hand'), 0, 0, 1, 1, time, delay ? delay : 0, () => {
                func && func();
            });
            this._ImgVar('HandPic').rotation = -17;
        }
        bgAppear(delay, func) {
            LwgTools._Node.destroyAllChildren(this._ImgVar('Background'));
            const time = 300;
            this._ImgVar('HandPic').rotation = -17;
            LwgAni2D.fadeOut(this._ImgVar('Background'), 0, 1, time, delay ? delay : 0, () => {
                func && func();
            });
        }
        handVanish(delay, func) {
            const time = 300;
            this._ImgVar('HandPic').rotation = -17;
            LwgAni2D.scale(this._ImgVar('Hand'), 1, 1, 0, 0, time, delay ? delay : 0, () => {
                func && func();
            });
        }
        bgVanish(delay, func) {
            const time = 300;
            LwgAni2D.fadeOut(this._ImgVar('Background'), 1, 0, time, delay ? delay : 0, () => {
                func && func();
            });
        }
        handMove(x, y, func, bgType) {
            this.handClear();
            const _y = y - 30;
            const point = new Laya.Point(this._ImgVar('Hand').x, this._ImgVar('Hand').y);
            const time = point.distance(x, _y);
            LwgAni2D.move(this._ImgVar('Hand'), x, _y, time, () => {
                func && func();
            });
            this._ImgVar('Hand').scale(1, 1);
            LwgAni2D.move(this._ImgVar('HandPic'), 75, 56, time);
            switch (bgType) {
                case this.bgType.vanish:
                    this.bgVanish();
                    break;
                case this.bgType.appear:
                    this.bgAppear();
                    break;
                default:
                    break;
            }
        }
        handClear() {
            this.lineStop();
            LwgTimer._clearAll([this._ImgVar('Hand')]);
            LwgAni2D._clearAll([this._ImgVar('Hand')]);
            this._AniVar('Frame').stop();
            this._AniVar('Click').stop();
            this._AniVar('ClickOne').stop();
            this._ImgVar('Hand').visible = true;
            this._ImgVar('HandPic').scale(1, 1);
            this._ImgVar('HandPic').rotation = -17;
            this._ImgVar('Hand').pos(this._ImgVar('HandPic')._lwg.gPoint.x - 75, this._ImgVar('HandPic')._lwg.gPoint.y - 56);
            this._ImgVar('HandPic').pos(75, 56);
        }
        slideUpAppear(x, y, width, height, radius, delay) {
            this.bgAppear(delay ? delay : 0, () => {
                this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
                    this._ImgVar('Hand').scale(0, 0);
                    this._ImgVar('Slide').scale(1, 1);
                    this._ImgVar('Slide').pos(x, y);
                    this._AniVar('SlideUp').play();
                });
            });
        }
        noMoveRoundrect(x, y, width, height, radius, delay, handX, handY) {
            this.bgAppear(delay ? delay : 0, () => {
                this.boreholeRoundrect([[x, y, width, height, radius]], handX ? handX : x, handY ? handY : y - 30, () => {
                    this.handAppear(null, () => {
                        this._AniVar('Click').play();
                    });
                });
            });
        }
        moveRoundrectNoBg(x, y, width, height, radius) {
            this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
                this.handMove(x, y, () => {
                    this._AniVar('Click').play();
                });
            });
        }
        noMoveCircle(x, y, radius) {
            this.bgAppear(0, () => {
                this.boreholeCircle([[x, y, radius]], x, y, () => {
                    this.handAppear(200, () => {
                        this._AniVar('Click').play();
                    });
                });
            });
        }
        moveCircleBg(x, y, radius) {
            this.bgAppear(0, () => {
                this.boreholeCircle([[x, y, radius]], null, null, () => {
                    this.handMove(x, y, () => {
                        this._AniVar('Click').play();
                    });
                });
            });
        }
        moveCircleNoBg(x, y, radius) {
            this.boreholeCircle([[x, y, radius]], null, null, () => {
                this.handMove(x, y, () => {
                    this._AniVar('Click').play();
                });
            });
        }
        getGuideScissorTime(x, y) {
            const point = LwgTools._Node.getNodeGP(this._Scissor);
            return point.distance(x, y);
        }
        scissorTailor(first) {
            if (!this._Scissor || this._closeLine)
                return;
            this._ImgVar('Hand').pos(this._Scissor.x, this._Scissor.y);
            const index = Number(this.presentName.substr(4));
            const pos = this.posArr[index - 1];
            var func = () => {
                this._AniVar('Click').play(0, false);
                LwgAni2D.move(this._ImgVar('Hand'), pos[0], pos[1], this.getGuideScissorTime(pos[0], pos[1]), () => {
                    this._AniVar(this.presentName).play(0, false);
                }, 1500);
            };
            if (first) {
                func();
            }
            else {
                LwgTimer._loop(6000, this._ImgVar('Hand'), () => {
                    this.handAppear(0, () => {
                        func();
                    });
                }, true);
            }
        }
        startScissorTailor(Scissor) {
            if (Scissor)
                this._Scissor = Scissor;
            this.presentName = 'Line01';
            this._ImgVar('Hand').scale(1, 1);
            LwgAni2D.move(this._ImgVar('Hand'), this._Scissor.x, this._Scissor.y, this.getGuideScissorTime(this._ImgVar('Hand').x, this._ImgVar('Hand').y), () => {
                this.scissorTailor(true);
                LwgTimer._once(5000, this._ImgVar('Hand'), () => {
                    this.scissorTailor();
                });
            });
        }
        lineStop() {
            this._AniVar('Line01').stop();
            this._AniVar('Line02').stop();
            this._AniVar('Line03').stop();
            this._AniVar('Line04').stop();
        }
        newScissorTailor(LineName) {
            this.handClear();
            if (this.nameArr.length > 1) {
                for (let index = 0; index < this.nameArr.length; index++) {
                    const element = this.nameArr[index];
                    if (LineName === element) {
                        this.nameArr.splice(index, 1);
                        break;
                    }
                }
                this.presentName = this.nameArr[0];
                this.scissorTailor();
            }
            else {
                this.presentName = null;
                this._ImgVar('Hand').visible = false;
                this._Owner.close();
            }
        }
        pattenAni(ftx, fty, tx, ty) {
            this.handMove(ftx, fty, () => {
                const time = 700;
                const delay = 1000;
                LwgTimer._loop(time * 3 + delay, this._ImgVar('Hand'), () => {
                    this._ImgVar('Hand').scale(1, 1);
                    LwgTimer._once(200, this._ImgVar('Hand'), () => {
                        this._AniVar('ClickOne').play(0, false);
                    });
                    LwgAni2D.move(this._ImgVar('Hand'), tx, ty, time, () => {
                        this.handVanish(300, () => {
                            this._ImgVar('Hand').pos(ftx, fty - 30);
                        });
                    }, delay);
                }, true);
            });
        }
        lwgEvent() {
            this._AniVar('Click').on(Laya.Event.LABEL, this, (e) => {
                if (e === 'effect') {
                    this.clickEffcet();
                }
            });
            this._AniVar('ClickOne').on(Laya.Event.LABEL, this, (e) => {
                if (e === 'effect') {
                    this.clickEffcet();
                }
            });
            this._AniVar('Frame').on(Laya.Event.LABEL, this, (e) => {
                if (e === 'effect') {
                    this.clickEffcet();
                }
            });
            for (let index = 0; index < 4; index++) {
                const element = this._AniVar(`Line0${index + 1}`);
                element.on(Laya.Event.LABEL, this, (e) => {
                    if (e === 'com') {
                        this._ImgVar('Hand').pos(this._Scissor.x, this._Scissor.y);
                        this._ImgVar('Hand').scale(0, 0);
                        this._ImgVar('HandPic').scale(1, 1);
                    }
                });
            }
            const radius = 80;
            this._evReg(_Guide.Event.StartBtnDress, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.MakeTailorPulldown, () => {
                const x = Laya.stage.width - 95;
                const y = Laya.stage.height / 2;
                this.slideUpAppear(x, y, 165, 450, 20);
            });
            this._evReg(_Guide.Event.MakeTailorChangeCloth, () => {
                this._ImgVar('Hand').pos(this._ImgVar('SlideHand')._lwg.gPoint.x, this._ImgVar('SlideHand')._lwg.gPoint.y);
                this._ImgVar('Hand').scale(1, 1);
                this._ImgVar('Slide').scale(0, 0);
                const x = Laya.stage.width - 95;
                const y = 370;
                this.moveCircleNoBg(x, y, radius);
            });
            this._evReg(_Guide.Event.MakeTailorBtnCom, (point) => {
                this._AniVar('Click').stop();
                this.boreholeCircle([[point.x, point.y, radius], [Laya.stage.width / 2, Laya.stage.height / 2, 350]], null, null, () => {
                    this.handMove(point.x, point.y, () => {
                        this._AniVar('Click').play();
                    });
                });
            });
            this._evReg(_Guide.Event.MakeTailorStartTailor, (Scissor) => {
                this.bgVanish();
                this.handClear();
                this.startScissorTailor(Scissor);
            });
            this._evReg(_Guide.Event.MakeTailorNewTailor, (LineName) => {
                this.newScissorTailor(LineName);
            });
            this._evReg(_Guide.Event.MakeTailorCloseTailor, () => {
                if (!this.presentName)
                    return;
                this._closeLine = true;
                this.handClear();
                this._ImgVar('Hand').scale(0, 0);
            });
            this._evReg(_Guide.Event.MakeTailorOpenTailor, () => {
                if (!this.presentName)
                    return;
                this._closeLine = false;
                this.handClear();
                this.scissorTailor();
            });
            this._evReg(_Guide.Event.MakePatternChooseClassify, () => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.ChooseClassify;
                const x = Laya.stage.width - 53;
                const y = 270;
                this.noMoveCircle(x, y, 60);
            });
            this._evReg(_Guide.Event.MakePatternPattern1, () => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.Pattern1;
                const x = Laya.stage.width - 152;
                const y = 310;
                this.pattenAni(x, y, Laya.stage.width / 2, y);
                this.bgVanish();
            });
            var frameFunc = () => {
                const WConversion = this._Wireframe.getChildByName('WConversion');
                const gP = this._Wireframe.localToGlobal(new Laya.Point(WConversion.x, WConversion.y));
                this.handMove(gP.x, gP.y, () => {
                    this._AniVar('Frame').play();
                });
            };
            this._AniVar('Frame').on(Laya.Event.LABEL, this, (label) => {
                if (label === 'com') {
                    if (this._Wireframe) {
                        frameFunc();
                    }
                }
            });
            this._evReg(_Guide.Event.MakePatternFrame1, (Wireframe) => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.Frame1;
                if (Wireframe)
                    this._Wireframe = Wireframe;
                frameFunc();
            });
            this._evReg(_Guide.Event.MakePatternTurnFace, (x, y) => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.TurnFace;
                this.handClear();
                this.moveCircleBg(x, y, radius);
            });
            this._evReg(_Guide.Event.MakePatternPattern2, () => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.Pattern2;
                const x = Laya.stage.width - 152;
                const y = 420;
                this.pattenAni(x, y, Laya.stage.width / 2, y);
                this.bgVanish();
            });
            this._evReg(_Guide.Event.MakePatternFrame2, (Wireframe) => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.Frame2;
                if (Wireframe)
                    this._Wireframe = Wireframe;
                frameFunc();
            });
            this._evReg(_Guide.Event.MakePatternBtnCom, (x, y) => {
                _Guide.MakePatternState = _Guide.MakePatternStateType.BtnCom;
                this.handClear();
                this.moveCircleBg(x, y, radius);
            });
            this._evReg(_Guide.Event.TweetingBtnChoosePhoto, (x, y, handX, handY) => {
                this.noMoveRoundrect(x, y, Laya.stage.width - 320 - 260, 290, 20, 500, handX, handY);
            });
            this._evReg(_Guide.Event.TweetingChoosePhoto, (x, y) => {
                this.noMoveRoundrect(x, y, 260, 260, 20);
            });
            this._evReg(_Guide.Event.TweetingBtnSend, (x, y) => {
                this.moveRoundrectNoBg(x, y, 220, 120, 20);
            });
            this._evReg(_Guide.Event.TweetingBtnDoubleFans, (x, y) => {
                this.noMoveRoundrect(x, y, 230, 120, 20);
            });
            this._evReg(_Guide.Event.RankingCloseBtn, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.PersonalInfoBtn, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.PersonalInfoWriteName, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.PersonalInfoCloseBtn, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.BtnCheckIn, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.CheckInGetReward, (x, y) => {
                this.noMoveCircle(x, y, radius);
            });
            this._evReg(_Guide.Event.CheckInCloseBtn, (x, y) => {
                this.moveCircleBg(x, y, radius);
            });
            this._evReg(_Guide.Event.vanishGuide, () => {
                this._AniVar('Click').stop();
                this.handVanish();
                this.bgVanish();
            });
            this._evReg(_Guide.Event.closeGuide, () => {
                this._closeScene();
            });
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Hand'), this._ImgVar('Background'));
        }
        lwgOnDisable() {
            this._ImgVar('Background').destroy();
        }
    }

    class ADManager {
        static ShowBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.ShowBanner(p);
        }
        static CloseBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.RemoveBanner(p);
        }
        static ShowNormal() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static showNormal2() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static ShowReward(rewardAction, CDTime = 500) {
            if (LwgPlatform._Ues.value == LwgPlatform._Tpye.WebTest || LwgPlatform._Ues.value == LwgPlatform._Tpye.OPPOTest || LwgPlatform._Ues.value == LwgPlatform._Tpye.Research) {
                rewardAction();
                return;
            }
            if (ADManager.CanShowCD) {
                LwgAudio._stopMusic();
                console.log("?????");
                let p = new TJ.ADS.Param();
                p.extraAd = true;
                let getReward = false;
                p.cbi.Add(TJ.Define.Event.Reward, () => {
                    getReward = true;
                    LwgAudio._playMusic(LwgAudio._voiceUrl.bgm, 0, 1000);
                    if (rewardAction != null) {
                        rewardAction();
                    }
                });
                p.cbi.Add(TJ.Define.Event.Close, () => {
                    if (!getReward) {
                        LwgAudio._playMusic(LwgAudio._voiceUrl.bgm, 0, 1000);
                        LwgDialogue._middleHint("观看完整广告才能获取奖励哦！");
                    }
                });
                p.cbi.Add(TJ.Define.Event.NoAds, () => {
                    LwgAudio._playMusic(LwgAudio._voiceUrl.bgm, 0, 1000);
                    LwgDialogue._middleHint("暂时没有广告，过会儿再试试吧！");
                });
                TJ.ADS.Api.ShowReward(p);
                ADManager.CanShowCD = false;
                setTimeout(() => {
                    ADManager.CanShowCD = true;
                }, CDTime);
            }
            else {
            }
        }
        static Event(param, value) {
            console.log("Param:>" + param + "Value:>" + value);
            let p = new TJ.GSA.Param();
            if (value == null) {
                p.id = param;
            }
            else {
                p.id = param + value;
            }
            console.log(p.id);
            TJ.GSA.Api.Event(p);
        }
        static initShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.onShareAppMessage(() => {
                    return {
                        title: this.shareContent,
                        imageUrl: this.shareImgUrl,
                        query: ""
                    };
                });
                this.wx.showShareMenu({
                    withShareTicket: true,
                    success: null,
                    fail: null,
                    complete: null
                });
            }
        }
        static lureShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.shareAppMessage({
                    title: this.shareContent,
                    imageUrl: this.shareImgUrl,
                    query: ""
                });
            }
        }
        static VibrateShort() {
            if (!LwgSet._shake.switch) {
                return;
            }
            TJ.API.Vibrate.Short();
        }
        static Vibratelong() {
            if (!LwgSet._shake.switch) {
                return;
            }
            TJ.API.Vibrate.Long();
        }
        static TAPoint(type, name) {
            let p = new TJ.API.TA.Param();
            p.id = name;
            switch (type) {
                case TaT.BtnShow:
                    TJ.API.TA.Event_Button_Show(p);
                    break;
                case TaT.BtnClick:
                    TJ.API.TA.Event_Button_Click(p);
                    break;
                case TaT.PageShow:
                    TJ.API.TA.Event_Page_Show(p);
                    break;
                case TaT.PageEnter:
                    TJ.API.TA.Event_Page_Enter(p);
                    break;
                case TaT.PageLeave:
                    TJ.API.TA.Event_Page_Leave(p);
                    break;
                case TaT.LevelStart:
                    TJ.API.TA.Event_Level_Start(p);
                    console.log('本关开始打点');
                    break;
                case TaT.LevelFail:
                    TJ.API.TA.Event_Level_Fail(p);
                    console.log('本关失败打点');
                    break;
                case TaT.LevelFinish:
                    TJ.API.TA.Event_Level_Finish(p);
                    console.log('本关胜利打点');
                    break;
            }
        }
    }
    ADManager.CanShowCD = true;
    ADManager.wx = Laya.Browser.window.wx;
    ADManager.shareImgUrl = "http://image.tomatojoy.cn/6847506204006681a5d5fa0cd91ce408";
    ADManager.shareContent = "涂鸦小画手";
    var TaT;
    (function (TaT) {
        TaT[TaT["BtnShow"] = 0] = "BtnShow";
        TaT[TaT["BtnClick"] = 1] = "BtnClick";
        TaT[TaT["PageShow"] = 2] = "PageShow";
        TaT[TaT["PageEnter"] = 3] = "PageEnter";
        TaT[TaT["PageLeave"] = 4] = "PageLeave";
        TaT[TaT["LevelStart"] = 5] = "LevelStart";
        TaT[TaT["LevelFinish"] = 6] = "LevelFinish";
        TaT[TaT["LevelFail"] = 7] = "LevelFail";
    })(TaT || (TaT = {}));

    class _GameEffects2D {
        static _interfacePointJet() {
            const diff = 100;
            LwgTimer._frameNumLoop(5, 15, this, () => {
                for (let index = 0; index < 5; index++) {
                    LwgEff2D._Particle._downwardSpray(Laya.stage, new Laya.Point(Laya.stage.width * 1 / 4, -diff), [10, 30], [10, 30], [0, 90], [LwgEff2D._SkinUrl.矩形1], null);
                    LwgEff2D._Particle._downwardSpray(Laya.stage, new Laya.Point(Laya.stage.width * 3 / 4, -diff), [10, 30], [10, 30], [90, 180], [LwgEff2D._SkinUrl.矩形1], null);
                    LwgEff2D._Particle._downwardSpray(Laya.stage, new Laya.Point(-diff, Laya.stage.height / 4), [10, 30], [10, 30], [0, 90], [LwgEff2D._SkinUrl.矩形1], null);
                    LwgEff2D._Particle._downwardSpray(Laya.stage, new Laya.Point(Laya.stage.width + diff, Laya.stage.height / 4), [10, 30], [10, 30], [90, 180], [LwgEff2D._SkinUrl.矩形1], null);
                }
            });
        }
        static _completeCross() {
            let num = 4;
            let spcaing = 20;
            for (let index = 0; index < num; index++) {
                let moveY = 7 * index + 5;
                let p1 = new Laya.Point(-200, Laya.stage.height);
                let _caller = {};
                let funcL = () => {
                    p1.x += spcaing;
                    if (p1.x > Laya.stage.width) {
                        Laya.timer.clearAll(_caller);
                    }
                    p1.y -= moveY;
                    LwgEff2D._Particle._fallingVertical(Laya.stage, new Laya.Point(p1.x, p1.y), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                };
                LwgTimer._frameLoop(1, _caller, () => {
                    funcL();
                });
                let p2 = new Laya.Point(Laya.stage.width + 200, Laya.stage.height);
                let _callerR = {};
                let funcR = () => {
                    p2.x -= spcaing;
                    if (p2.x < 0) {
                        Laya.timer.clearAll(_callerR);
                    }
                    p2.y -= moveY;
                    LwgEff2D._Particle._fallingVertical(Laya.stage, new Laya.Point(p2.x, p2.y), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                };
                LwgTimer._frameLoop(1, _callerR, () => {
                    funcR();
                });
            }
        }
        ;
        static _completeSidelingCross() {
            let len = Laya.stage.width;
            let _height = Laya.stage.height * 2.5;
            let Img = new Laya.Image;
            Img.width = 100;
            Img.height = _height;
            Img.rotation = 40;
            LwgTools._Node.changePivot(Img, 0, _height / 2);
            Img.pos(0, 0);
            Laya.stage.addChild(Img);
            Img.zOrder = 1000;
            let num = 20;
            let spcaing = 40;
            for (let index = 0; index < num; index++) {
                let p1 = new Laya.Point(0, Img.height / num * index);
                let p2 = new Laya.Point(Laya.stage.width, Img.height / num * index);
                let _caller = {};
                let func = () => {
                    p1.x += spcaing;
                    if (p1.x > len) {
                        Laya.timer.clearAll(_caller);
                    }
                    p2.x -= spcaing;
                    if (p2.x > len) {
                        Laya.timer.clearAll(_caller);
                    }
                    if (index % 2 == 0) {
                        LwgEff2D._Particle._fallingVertical(Img, new Laya.Point(p1.x, p1.y), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.星星8], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                    }
                    else {
                        LwgEff2D._Particle._fallingVertical_Reverse(Img, new Laya.Point(p2.x, p2.y), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.星星8], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [-100, -200], [-0.8, -1.5], [-0.05, -0.1]);
                    }
                };
                LwgTimer._frameNumLoop(2, 50, _caller, () => {
                    func();
                });
            }
        }
        static _fireworksCelebrate(func) {
            const centerP1 = new Laya.Point(Laya.stage.width / 2, 0);
            const num1 = 150;
            LwgTimer._frameNumRandomLoop(1, 3, num1, this, () => {
                LwgEff2D._Particle._fallingRotate(Laya.stage, centerP1, [Laya.stage.width, 0], [10, 30], [10, 30], [LwgEff2D._SkinUrl.矩形1, LwgEff2D._SkinUrl.矩形2, LwgEff2D._SkinUrl.矩形3], null, [300, Laya.stage.height], [1, 8]);
            });
            const num2 = 16;
            const centerP2 = new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2 - 50);
            LwgTimer._frameNumRandomLoop(10, 25, num2, this, () => {
                const count = LwgTools._Number.randomOneInt(10, 20);
                const time = 30;
                const dis = LwgTools._Number.randomOneInt(100, 300);
                const radomP = LwgTools._Point.randomPointByCenter(centerP2, 500, 150)[0];
                for (let index = 0; index < count * 2; index++) {
                    LwgEff2D._Particle._sprayRound(Laya.stage, radomP, null, [20, 40], null, [LwgEff2D._SkinUrl.花4], null, [dis, dis], [time, time]);
                }
                for (let index = 0; index < count * 2; index++) {
                    LwgEff2D._Particle._sprayRound(Laya.stage, radomP, null, [20, 40], null, [LwgEff2D._SkinUrl.花4], null, [50, dis - 20], [time, time]);
                }
            }, () => {
                func && func();
            });
        }
        static _oneFireworks(point) {
            const count = LwgTools._Number.randomOneInt(10, 20);
            const time = 30;
            const dis = LwgTools._Number.randomOneInt(100, 300);
            for (let index = 0; index < count * 2; index++) {
                LwgEff2D._Particle._sprayRound(Laya.stage, point, null, [20, 40], null, [LwgEff2D._SkinUrl.花4], null, [dis, dis], [time, time]);
            }
            for (let index = 0; index < count * 2; index++) {
                LwgEff2D._Particle._sprayRound(Laya.stage, point, null, [20, 40], null, [LwgEff2D._SkinUrl.花4], null, [50, dis - 20], [time, time]);
            }
        }
        static _circleFlowe(scene) {
            const count = 90;
            const time = 35;
            const dis = LwgTools._Number.randomOneInt(500, 500);
            const p = new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
            for (let index = 0; index < count; index++) {
                LwgEff2D._Particle._sprayRound(scene, p, null, [20, 40], null, [LwgEff2D._SkinUrl.花4], null, [dis, dis], [time, time], null, null, 5);
            }
            for (let index = 0; index < count * 2; index++) {
                LwgEff2D._Particle._sprayRound(scene, p, null, [20, 40], null, [LwgEff2D._SkinUrl.花4], null, [100, dis - 20], [time, time], null, null, 5);
            }
        }
        static _bothBlinkOnSprite(scene, sprite) {
            const caller = {};
            LwgTimer._frameRandomLoop(30, 50, caller, () => {
                LwgEff2D._Glitter._blinkStar(scene, new Laya.Point(sprite.x - 350, sprite.y), [150, 100], [LwgEff2D._SkinUrl.星星1], null, [80, 80]);
            }, true);
            LwgTimer._frameRandomLoop(30, 50, caller, () => {
                LwgEff2D._Glitter._blinkStar(scene, new Laya.Point(sprite.x + 350, sprite.y), [150, 100], [LwgEff2D._SkinUrl.星星1], null, [80, 80]);
            }, true);
            return caller;
        }
        static _circleExplode(Parent, p, delay) {
            LwgTimer._once(delay ? delay : 0, this, () => {
                const count = 40;
                const time = 5;
                const dis = LwgTools._Number.randomOneInt(30, 30);
                for (let index = 0; index < count; index++) {
                    LwgEff2D._Particle._sprayRound(Parent, p, null, [20, 40], null, [LwgEff2D._SkinUrl.星星8], null, [dis, dis], [time, time], null, null, 5);
                }
                LwgAudio._playSound();
            });
        }
    }

    class PreLoad extends LwgPreLoad._PreLoadScene {
        constructor() {
            super(...arguments);
            this.count = 0;
        }
        lwgOnAwake() {
            ADManager.TAPoint(TaT.PageShow, 'loadpage');
        }
        lwgOnStart() {
            const scale = 1.2;
            const time = 100;
            const delay = 100;
            this._ImgVar('LoGo').scale(0, 0);
            this._ImgVar('Progress').scale(0, 0);
            this._ImgVar('Anti').alpha = 0;
            this._LabelVar('TextTip1').alpha = 0;
            const startCoefficient = 6;
            LwgTimer._once(delay * startCoefficient, this, () => {
                _GameEffects2D._circleFlowe(this._Owner);
            });
            LwgTimer._once(delay * startCoefficient, this, () => {
                LwgColor._changeOnce(this._ImgVar('BG'), [100, 50, 0, 1], time / 3);
            });
            LwgTimer._frameLoop(time / 2 * 2, this, () => {
                LwgTimer._once(delay * 6, this, () => {
                    LwgColor._changeOnce(this._ImgVar('LoGo'), [5, 40, 10, 1], time / 2);
                });
            });
            LwgAni2D.bombs_Appear(this._ImgVar('LoGo'), 0, 1, scale, 0, time * 5, () => {
                _GameEffects2D._bothBlinkOnSprite(this._Owner, this._ImgVar('LoGo'));
                LwgAni2D.bombs_Appear(this._ImgVar('Progress'), 0, 1, scale, 0, time * 1.5, () => {
                    LwgTimer._frameNumLoop(2, 30, this, () => {
                        this.count++;
                        this.progressDisplay();
                    }, () => {
                        LwgAni2D.fadeOut(this._LabelVar('TextTip1'), 0, 1, time * 2, 0, () => {
                            LwgTimer._frameLoop(100, this, () => {
                                this._LabelVar('TextTip2').text = '';
                                LwgTimer._frameNumLoop(10, 6, this, () => {
                                    this._LabelVar('TextTip2').text += '.';
                                });
                            }, true);
                        });
                        this.lwgStartLoding(_Res);
                    }, true);
                    LwgAni2D.fadeOut(this._ImgVar('Anti'), 0, 1, time * 4, 200);
                }, delay * 4);
                LwgTimer._once(delay * 4, this, () => {
                    LwgAudio._playSound(LwgAudio._voiceUrl.btn);
                });
            }, delay * startCoefficient);
        }
        progressDisplay() {
            this._ImgVar('ProgressBar').mask.x = -this._ImgVar('ProgressBar').width + this._ImgVar('ProgressBar').width / 100 * this.count;
        }
        lwgStepComplete() {
            this._ImgVar('ProgressBar').mask.x += 5;
        }
        lwgAllComplete() {
            LwgTimer._frameLoop(5, this, () => {
                if (this._ImgVar('ProgressBar').mask.x < 0) {
                    this._ImgVar('ProgressBar').mask.x += 40;
                    if (this._ImgVar('ProgressBar').mask.x > 0) {
                        this._ImgVar('ProgressBar').mask.x = 0;
                    }
                }
            });
            _AllClothes._ins().changeClothStart();
            _3DScene._ins().intoStart(_SceneName.PreLoad);
            return 2000;
        }
        lwgCloseAni() {
            LwgSceneAni._shutters.Close._paly(LwgSceneAni._shutters.Close._type.randomCroAndVer, this._Owner);
            return 1500;
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'loadpage');
        }
    }

    class RecordManager {
        constructor() {
            this.GRV = null;
            this.isRecordVideoing = false;
            this.isVideoRecord = false;
            this.videoRecordTimer = 0;
            this.isHasVideoRecord = false;
        }
        static Init() {
            RecordManager.grv = new TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo();
        }
        static startAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.grv == null)
                RecordManager.Init();
            if (RecordManager.recording)
                return;
            RecordManager.autoRecording = true;
            console.log("******************开始录屏");
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (!RecordManager.autoRecording) {
                console.log("RecordManager.autoRecording", RecordManager.autoRecording);
                return false;
            }
            RecordManager.autoRecording = false;
            RecordManager._end(false);
            if (Date.now() - RecordManager.lastRecordTime > 6000) {
                return true;
            }
            if (Date.now() - RecordManager.lastRecordTime < 3000) {
                console.log("小于3秒");
                return false;
            }
            return true;
        }
        static startRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.autoRecording) {
                this.stopAutoRecord();
            }
            RecordManager.recording = true;
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("time:" + (Date.now() - RecordManager.lastRecordTime));
            if (Date.now() - RecordManager.lastRecordTime <= 3000) {
                return false;
            }
            RecordManager.recording = false;
            RecordManager._end(true);
            return true;
        }
        static _start() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180s  ？？？？？");
            RecordManager.grv.Start(180);
        }
        static _end(share) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180结束 ？？？？？");
            RecordManager.grv.Stop(share);
        }
        static _share(type, successedAc, completedAc = null, failAc = null) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************吊起分享 ？？？？？", RecordManager.grv, RecordManager.grv.videoPath);
            if (RecordManager.grv.videoPath) {
                let p = new TJ.Platform.AppRt.Extern.TT.ShareAppMessageParam();
                p.extra.videoTopics = ["女神修炼手册", "番茄小游戏", "抖音小游戏"];
                p.channel = "video";
                p.success = () => {
                    LwgDialogue._middleHint("分享成功!");
                    successedAc();
                };
                p.fail = () => {
                    if (type === 'noAward') {
                        LwgDialogue._middleHint("分享失败！");
                    }
                    else {
                        LwgDialogue._middleHint("分享成功后才能获取奖励！");
                    }
                    failAc();
                };
                RecordManager.grv.Share(p);
            }
            else {
                LwgDialogue._middleHint("暂无视频，玩一局游戏之后分享！");
            }
        }
    }
    RecordManager.recording = false;
    RecordManager.autoRecording = false;

    class _UI {
        constructor(_Scene) {
            this.time = 100;
            this.delay = 100;
            this.scale = 1.4;
            if (!_Scene) {
                return;
            }
            this.Scene = _Scene;
            this.Operation = _Scene['Operation'];
            this.BtnAgain = LwgTools._Node.createPrefab(_Res.$prefab2D.BtnAgain.prefab2D, _Scene, [200, 79]);
            LwgClick._on(LwgClick._Use.value, this.BtnAgain, this, null, null, () => {
                ADManager.TAPoint(TaT.BtnShow, 'next_lose');
                this.btnAgainClick && this.btnAgainClick();
            });
            this.BtnComplete = _Scene['BtnComplete'];
            LwgClick._on(LwgClick._Use.value, this.BtnComplete, this, null, null, (e) => {
                e.stopPropagation();
                this.btnCompleteClick && this.btnCompleteClick();
            });
            this.BtnBack = LwgTools._Node.createPrefab(_Res.$prefab2D.BtnBack.prefab2D, _Scene, [77, 79]);
            LwgClick._on(LwgClick._Use.value, this.BtnBack, this, null, null, () => {
                if (!_Guide._complete.value)
                    return;
                if (_3DScene._ins()._Owner.active) {
                    _BackHint._3dToSp = _3DScene._ins().cameraToSprite(this.Scene);
                }
                ADManager.TAPoint(TaT.BtnShow, 'back_main');
                if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                    _BackHint._whereScene = this.Scene;
                    LwgScene._openScene(_SceneName.BackHint);
                }
                else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                    _PreLoadCutIn._fromBack = true;
                    LwgTimer._frameOnce(10, this, () => {
                        this.Scene[this.Scene.name]._openScene(_SceneName.Start, true, true);
                    });
                }
            });
            this.BtnRollback = LwgTools._Node.createPrefab(_Res.$prefab2D.BtnRollback.prefab2D, _Scene, [200, 79]);
            LwgClick._on(LwgClick._Use.value, this.BtnRollback, this, null, null, () => {
                if (!_Guide._complete.value)
                    return;
                this.btnRollbackClick && this.btnRollbackClick();
            });
            this.Operation.pos(Laya.stage.width + 500, 20);
            this.BtnComplete.scale(0, 0);
            this.BtnBack.scale(0, 0);
            this.BtnAgain.scale(0, 0);
            this.BtnRollback.scale(0, 0);
            ADManager.TAPoint(TaT.BtnShow, 'back_main');
            ADManager.TAPoint(TaT.BtnShow, 'next_lose');
            this.BtnTurnFace = this.Scene['BtnTurnFace'];
            if (this.BtnTurnFace) {
                ADManager.TAPoint(TaT.BtnShow, 'Amian');
                ADManager.TAPoint(TaT.BtnShow, 'Bmian');
                this.BtnTurnFace.scale(0, 0);
            }
            this.BtnRollback.zOrder = this.BtnAgain.zOrder = this.BtnBack.zOrder = this.BtnComplete.zOrder = this.Operation.zOrder = 45;
            this.moveTargetX = Laya.stage.width - this.Operation.width + 50;
        }
        btnRollbackAppear(func, delay) {
            LwgAni2D.bombs_Appear(this.BtnRollback, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnRollbackVinish(func, delay) {
            LwgAni2D.bombs_Vanish(this.BtnRollback, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnAgainAppear(func, delay) {
            LwgAni2D.bombs_Appear(this.BtnAgain, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnAgainVinish(func, delay) {
            LwgAni2D.bombs_Vanish(this.BtnAgain, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnBackAppear(func, delay) {
            LwgAni2D.bombs_Appear(this.BtnBack, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnBackVinish(func, delay) {
            LwgAni2D.bombs_Vanish(this.BtnBack, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnCompleteAppear(func, delay) {
            _GameEffects2D._circleExplode(this.Operation, new Laya.Point(this.BtnComplete.x, this.BtnComplete.y), delay);
            LwgAni2D.bombs_Appear(this.BtnComplete, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        btnCompleteVinish(func, delay) {
            LwgAni2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnTurnFaceAppear(func, delay) {
            if (this.BtnTurnFace) {
                _GameEffects2D._circleExplode(this.Operation, new Laya.Point(this.BtnTurnFace.x, this.BtnTurnFace.y), delay);
                LwgAni2D.bombs_Appear(this.BtnTurnFace, 0, 1, this.scale, 0, this.time * 2, () => {
                    func && func();
                });
            }
        }
        btnTurnFaceVinish(func, delay) {
            if (this.BtnTurnFace) {
                LwgAni2D.bombs_Vanish(this.BtnTurnFace, 0, 0, 0, this.time * 4, () => {
                    func && func();
                }, delay ? delay : 0);
            }
        }
        operationAppear(func, delay) {
            if (this.Scene.name === 'MakeTailor') {
                LwgAni2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 1, 500);
            }
            LwgAni2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time * 4, () => {
                LwgAni2D.move(this.Operation, this.moveTargetX, this.Operation.y, this.time, () => {
                    func && func();
                });
            }, delay ? delay : 0);
        }
        ;
        operationVinish(func, delay) {
            if (this.Scene.name === 'MakeTailor') {
                LwgAni2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 0, 500);
            }
            LwgAni2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
                LwgAni2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time, () => {
                    LwgAni2D.move(this.Operation, Laya.stage.width + 500, this.Operation.y, this.time * 4, () => {
                        func && func();
                    });
                });
            }, delay ? delay : 0);
        }
    }

    class _TaskClothes extends LwgData._Table {
        constructor() {
            super(...arguments);
            this.moveTime = 600;
        }
        static _ins() {
            if (!this.ins) {
                this.ins = new _TaskClothes('DIY_Task');
            }
            return this.ins;
        }
        again(Scene) {
            const clothesArr = _DIYClothes._ins().getClothesArr();
            const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
            for (let index = 0; index < clothesArr.length; index++) {
                const element = clothesArr[index];
                if (element.name === name) {
                    this.LastClothes = element;
                    clothesArr[index] = this.Clothes = _DIYClothes._ins().createClothes(name, Scene);
                    this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent');
                    this.setData();
                }
            }
            this.clothesMove();
            LwgAni2D.move_rotate(this.LastClothes, 45, new Laya.Point(Laya.stage.width * 1.5, Laya.stage.height * 1.5), this.moveTime, 0, () => {
                this.LastClothes.removeSelf();
            });
        }
        clothesMove() {
            const time = 700;
            this.Clothes.pos(0, -Laya.stage.height * 1.5);
            this.Clothes.rotation = 45;
            LwgAni2D.move_rotate(this.Clothes, 0, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time);
        }
        changeClothes(Scene) {
            const clothesArr = _DIYClothes._ins().getClothesArr();
            const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
            const lastName = _DIYClothes._ins()._lastPitchName;
            for (let index = 0; index < clothesArr.length; index++) {
                const element = clothesArr[index];
                if (element.name == name) {
                    element.removeSelf();
                    this.Clothes = clothesArr[index] = _DIYClothes._ins().createClothes(name, Scene);
                    this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent');
                    this.setData();
                }
                else if (element.name == lastName) {
                    this.LastClothes = element;
                }
                else {
                    element.removeSelf();
                }
            }
            this.clothesMove();
            this.LastClothes && LwgAni2D.move_rotate(this.LastClothes, -45, new Laya.Point(Laya.stage.width * 1.5, -Laya.stage.height * 1.5), this.moveTime, 0, () => {
                this.LastClothes.removeSelf();
            });
        }
        setData() {
            this._arr = [];
            for (let index = 0; index < this.LineParent.numChildren; index++) {
                const Line = this.LineParent.getChildAt(index);
                if (Line.numChildren > 0) {
                    let data = {};
                    data['Line'] = Line;
                    data[this._property.name] = Line.name;
                    data[this._property.conditionNum] = Line.numChildren;
                    data[this._property.degreeNum] = 0;
                    this._arr.push(data);
                }
            }
        }
    }
    class _Scissor extends LwgScene._ObjectBase {
        constructor() {
            super(...arguments);
            this.Ani = {
                vanishP: new Laya.Point(Laya.stage.width + 500, 0),
                shearSpeed: 3,
                range: 40,
                dir: 'up',
                dirType: {
                    up: 'up',
                    down: 'down',
                },
                paly: () => {
                    LwgTimer._clearAll([this.Ani]);
                    LwgAni2D._clearAll([this.Ani]);
                    LwgTimer._frameLoop(1, this.Ani, () => {
                        if (this._SceneImg('S2').rotation > this.Ani.range) {
                            this.Ani.dir = 'up';
                        }
                        else if (this._SceneImg('S2').rotation <= 0) {
                            this.Ani.dir = 'down';
                        }
                        if (this.Ani.dir == 'up') {
                            this._SceneImg('S1').rotation += this.Ani.shearSpeed * 4;
                            this._SceneImg('S2').rotation -= this.Ani.shearSpeed * 4;
                        }
                        else if (this.Ani.dir == 'down') {
                            this._SceneImg('S1').rotation -= this.Ani.shearSpeed;
                            this._SceneImg('S2').rotation += this.Ani.shearSpeed;
                        }
                    });
                },
                stop: () => {
                    LwgTimer._frameOnce(30, this.Ani, () => {
                        let time = 100;
                        LwgTimer._clearAll([this.Ani]);
                        LwgAni2D._clearAll([this.Ani]);
                        LwgAni2D.rotate(this._SceneImg('S1'), -this.Ani.range / 3, time);
                        LwgAni2D.rotate(this._SceneImg('S2'), this.Ani.range / 3, time);
                    });
                },
                event: () => {
                    this._evReg(_MakeTailor.Event.scissorAppear, () => {
                        let time = 800;
                        LwgAni2D.move_rotate(this._Owner, this._Owner._lwg.fRotation + 360, this._Owner._lwg.fGPoint, time, 0, () => {
                            this._Owner.rotation = this._Owner._lwg.fRotation;
                            this.Move.switch = true;
                            if (!_Guide._complete.value)
                                this._evNotify(_Guide.Event.MakeTailorStartTailor, [this._Owner]);
                        });
                    });
                    this._evReg(_MakeTailor.Event.scissorPlay, () => {
                        this.Ani.paly();
                    });
                    this._evReg(_MakeTailor.Event.scissorStop, () => {
                        this.Ani.stop();
                    });
                    this._evReg(_MakeTailor.Event.scissorRemove, (func) => {
                        this.Move.switch = false;
                        let disX = 1500;
                        let disY = -600;
                        let time = 600;
                        let delay = 100;
                        LwgAni2D.move_rotate(this._Owner, this._Owner.rotation + 360, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time / 2, delay, () => {
                            this._Owner.rotation = 0;
                            LwgAni2D.move_rotate(this._Owner, -30, new Laya.Point(this._Owner.x - disX / 6, this._Owner.y - disY / 5), time / 2, delay * 1.5, () => {
                                LwgAni2D.move_rotate(this._Owner, LwgTools._Number.randomOneHalf() == 0 ? 720 : -720, new Laya.Point(this._Owner.x + disX, this._Owner.y + disY), time, delay, () => {
                                    func && func();
                                    this._Owner.rotation = 0;
                                    this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
                                });
                            });
                        });
                    });
                    this._evReg(_MakeTailor.Event.scissorAgain, () => {
                        LwgAni2D.move_rotate(this._Owner, this._Owner._lwg.fRotation, this._Owner._lwg.fGPoint, 600, 100, () => {
                            _TaskClothes._ins().again(this._Scene);
                        });
                    });
                    this._evReg(_MakeTailor.Event.scissorRotation, (rotate) => {
                        LwgTimer._clearAll([this._Owner]);
                        const time = 10;
                        let angle;
                        if (Math.abs(rotate - this._Owner.rotation) < 180) {
                            angle = rotate - this._Owner.rotation;
                        }
                        else {
                            angle = -(360 - (rotate - this._Owner.rotation));
                        }
                        let unit = angle / time;
                        LwgTimer._frameNumLoop(1, time, this._Owner, () => {
                            this._Owner.rotation += unit;
                        });
                    });
                },
                effcts: () => {
                    const num = LwgTools._Number.randomOneInt(3, 6);
                    const color1 = _DIYClothes._ins().getColor()[0];
                    const color2 = _DIYClothes._ins().getColor()[1];
                    for (let index = 0; index < num; index++) {
                        LwgEff2D._Particle._spray(this._Scene, this._point, [10, 30], null, [0, 360], [LwgEff2D._SkinUrl.三角形1], [color1, color2], [20, 90], null, null, [1, 3], [0.1, 0.2], this._Owner.zOrder - 1);
                    }
                }
            };
            this.Move = {
                switch: false,
                touchP: null,
                diffP: null,
            };
        }
        lwgOnAwake() {
            this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
        }
        lwgEvent() {
            this.Ani.event();
        }
        lwgButton() {
            this._btnFour(Laya.stage, (e) => {
                if (this.Move.switch) {
                    this._evNotify(_MakeTailor.Event.scissorPlay);
                    this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    if (!_Guide._complete.value)
                        this._evNotify(_Guide.Event.MakeTailorCloseTailor, [this._Owner]);
                }
            }, (e) => {
                if (this.Move.touchP && this.Move.switch) {
                    this.Move.diffP = new Laya.Point(e.stageX - this.Move.touchP.x, e.stageY - this.Move.touchP.y);
                    this._Owner.x += this.Move.diffP.x;
                    this._Owner.y += this.Move.diffP.y;
                    LwgTools._Node.tieByStage(this._Owner);
                    this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    this._evNotify(_MakeTailor.Event.scissorPlay);
                }
            }, () => {
                this._evNotify(_MakeTailor.Event.scissorStop);
                this.Move.touchP = null;
                if (!_Guide._complete.value) {
                    this._evNotify(_Guide.Event.MakeTailorOpenTailor, [this._Owner]);
                }
            });
        }
        onTriggerEnter(other, _Owner) {
            if (!other['cut'] && this.Move.switch) {
                other['cut'] = true;
                this._evNotify(_MakeTailor.Event.scissorPlay);
                this._evNotify(_MakeTailor.Event.scissorStop);
                LwgEvent._notify(_MakeTailor.Event.scissorTrigger, [other.owner]);
                this.Ani.effcts();
                ADManager.VibrateShort();
            }
        }
    }
    class _Item extends LwgData._Item {
        $awake() { }
        ;
        $button() {
            this._btnUp(this._Owner, () => {
                if (!_Guide._complete.value && this.$data.name !== 'diy_dress_002_final')
                    return;
                if (this.$data.name === 'ads') {
                    return;
                }
                if (this.$data.complete) {
                    if (this.$data.name !== _DIYClothes._ins()._pitchName) {
                        _DIYClothes._ins()._setPitch(this.$data.name);
                        this._evNotify(_MakeTailor.Event.changeClothes);
                    }
                }
                else {
                    switch (this.$data.unlockWay) {
                        case this.$unlockWayType.check:
                            LwgDialogue._middleHint('请前往签到页面获取');
                            break;
                        case this.$unlockWayType.customs:
                            LwgDialogue._middleHint(`制作${this.$data.conditionNum}件才能衣服获取哦！`);
                            break;
                        case this.$unlockWayType.ads:
                            ADManager.ShowReward(() => {
                                if (_DIYClothes._ins()._checkCondition(this.$data.name)) {
                                    LwgDialogue._middleHint('恭喜获得一件新服装！');
                                    _DIYClothes._ins()._setPitch(this.$data.name);
                                    this._evNotify(_MakeTailor.Event.changeClothes);
                                }
                            });
                            break;
                        case this.$unlockWayType.free:
                            LwgDialogue._middleHint(`免费获得`);
                            break;
                        default:
                            break;
                    }
                }
                if (!_Guide._complete.value && this.$data.name == 'diy_dress_002_final') {
                    _Guide.MmakeTailorBtnComSwicth = true;
                    this._evNotify(_Guide.Event.MakeTailorBtnCom, [this._SceneImg('BtnComplete')._lwg.gPoint]);
                }
                ;
            });
        }
        $render() {
            this._LableChild('UnlockWayNum').visible = false;
            if (this.$data.name == 'ads') {
                if (!this._BoxChild('NativeRoot')) {
                    LwgTools._Node.createPrefab(_Res.$prefab2D.NativeRoot.prefab2D, this._Owner);
                }
                this._ImgChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = this._ImgChild('Board').visible = false;
            }
            else {
                if (!this.$data.complete) {
                    if (this.$data.unlockWay === _DIYClothes._ins()._unlockWay.ads) {
                        this._ImgChild('AdsSign').visible = true;
                        this._LableChild('UnlockWay').visible = false;
                        this._ImgChild('Mask').visible = false;
                    }
                    else {
                        this._ImgChild('AdsSign').visible = false;
                        this._LableChild('UnlockWay').visible = true;
                        switch (this.$data.unlockWay) {
                            case _DIYClothes._ins()._unlockWay.check:
                                this._LableChild('UnlockWay').text = '签到';
                                this._LableChild('UnlockWay').fontSize = 30;
                                this._LableChild('UnlockWayNum').visible = false;
                                break;
                            case _DIYClothes._ins()._unlockWay.customs:
                                this._LableChild('UnlockWay').text = `制作衣服`;
                                this._LableChild('UnlockWay').fontSize = 25;
                                this._LableChild('UnlockWayNum').visible = true;
                                this._LableChild('UnlockWayNum').text = `(${_Tweeting._completeNum.value} /${this.$data.conditionNum})`;
                                break;
                            default:
                                break;
                        }
                    }
                    this._ImgChild('Mask').visible = true;
                }
                else {
                    this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = this._LableChild('UnlockWay').visible = false;
                }
                this._ImgChild('Icon').gray = !this.$data.complete;
                if (this._BoxChild('NativeRoot'))
                    this._BoxChild('NativeRoot').destroy();
                this._ImgChild('Icon').visible = this._ImgChild('Board').visible = true;
                this._ImgChild('Icon').skin = _DIYClothes._ins().getDIYCutIcon(this.$data.name);
                this._ImgChild('Board').skin = `Lwg/UI/ui_orthogon_green.png`;
                if (this.$data.pitch) {
                    this._ImgChild('Board').skin = `Game/UI/Common/xuanzhong.png`;
                }
                else {
                    this._ImgChild('Board').skin = null;
                }
            }
        }
    }
    class MakeTailor extends LwgScene._SceneBase {
        lwgOnAwake() {
            RecordManager.startAutoRecord();
            ADManager.TAPoint(TaT.PageShow, 'jiancaipage');
            this._ImgVar('BG1').skin = `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/MakeTailorBG1.png`;
            this._ImgVar('BG2').skin = `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/MakeTailorBG2.png`;
            this._ImgVar('Scissor').addComponent(_Scissor);
            _DIYClothes._ins()._listRenderScript = _Item;
            _DIYClothes._ins()._List = this._ListVar('List');
            const arr = _DIYClothes._ins()._getArrByPitchClassify();
            _DIYClothes._ins()._listArray = arr;
            _DIYClothes._ins()._setPitch(arr[0][_DIYClothes._ins()._property.name]);
            if (!_Guide._complete.value)
                _DIYClothes._ins()._List.scrollBar.touchScrollEnable = false;
            this.UI = new _UI(this._Owner);
        }
        lwgOnStart() {
            LwgTimer._frameOnce(40, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnAgainVinish(null, 200);
                    this.UI.btnCompleteAppear(null, 400);
                });
                this.UI.btnBackAppear(() => {
                    !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                        _Guide.MmakeTailorPulldownSwicth = true;
                        this._evNotify(_Guide.Event.MakeTailorPulldown);
                    });
                });
            });
            this.UI.BtnRollback.visible = false;
            LwgTimer._frameOnce(20, this, () => {
                _TaskClothes._ins().changeClothes(this._Owner);
            });
        }
        lwgAdaptive() {
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                this._ImgVar('BtnComplete').y += 80;
            }
        }
        lwgButton() {
            this.UI.btnCompleteClick = () => {
                if (!_Guide._complete.value) {
                    if (!_Guide.MmakeTailorBtnComSwicth) {
                        return;
                    }
                }
                this.UI.operationVinish(() => {
                    this.UI.btnAgainAppear();
                }, 200);
                LwgTimer._frameOnce(30, this, () => {
                    this._evNotify(_MakeTailor.Event.scissorAppear);
                });
            };
            if (!_Guide._complete.value) {
                this._btnFour(_DIYClothes._ins()._List, () => {
                    if (_Guide.MmakeTailorPulldownSwicth) {
                        if (!this['Pulldown']) {
                            this['Pulldown'] = 1;
                        }
                    }
                }, () => {
                    if (!this['Pulldown'])
                        this['Pulldown'] = 1;
                    this['Pulldown']++;
                }, () => {
                    if (_Guide.MmakeTailorPulldownSwicth && this['Pulldown'] && this['Pulldown'] >= 2) {
                        let index;
                        if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                            index = 3;
                        }
                        else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                            index = 4;
                        }
                        _DIYClothes._ins()._List.tweenTo(index, 200, Laya.Handler.create(this, () => {
                            _Guide.MmakeTailorPulldownSwicth = false;
                            this._evNotify(_Guide.Event.MakeTailorChangeCloth);
                        }));
                    }
                    this['Pulldown'] = 1;
                }, null);
                return;
            }
            this.UI.btnAgainClick = () => {
                this._evNotify(_MakeTailor.Event.scissorRemove, [() => {
                        _TaskClothes._ins().again(this._Owner);
                    }]);
                LwgClick._filter.value = LwgClick._filterType.none;
                LwgTimer._frameOnce(60, this, () => {
                    this.UI.operationAppear(() => {
                        this.UI.btnAgainVinish(null, 200);
                        this.UI.btnCompleteAppear();
                    });
                    LwgClick._filter.value = LwgClick._filterType.all;
                });
            };
        }
        lwgEvent() {
            this._evReg(_MakeTailor.Event.changeClothes, () => {
                _TaskClothes._ins().changeClothes(this._Owner);
            });
            this._evReg(_MakeTailor.Event.scissorTrigger, (Dotted) => {
                const Parent = Dotted.parent;
                const value = _TaskClothes._ins()._checkCondition(Parent.name);
                Dotted.visible = false;
                let Eraser = Parent.getChildByName('Eraser');
                if (!Eraser) {
                    Eraser = new Laya.Sprite;
                    Parent.addChild(Eraser);
                }
                if (Eraser.blendMode !== "destination-out")
                    Eraser.blendMode = "destination-out";
                if (Parent.cacheAs !== "bitmap")
                    Parent.cacheAs = "bitmap";
                Eraser.graphics.drawCircle(Dotted.x, Dotted.y, 15, '#000000');
                if (value) {
                    if (!_Guide._complete.value)
                        this._evNotify(_Guide.Event.MakeTailorNewTailor, [Parent.name]);
                    for (let index = 0; index < _TaskClothes._ins().Clothes.getChildAt(0).numChildren; index++) {
                        const element = _TaskClothes._ins().Clothes.getChildAt(0).getChildAt(index);
                        if (element.name.substr(5, 2) == Dotted.parent.name.substr(4, 2)) {
                            let time = 1500;
                            let disX = LwgTools._Number.randomOneInt(1000) + 1000;
                            let disY = LwgTools._Number.randomOneInt(1000) + 1000;
                            switch (element.name.substr(8)) {
                                case 'U':
                                    disX = 0;
                                    disY = -disY;
                                    break;
                                case 'LU':
                                    disX = -disX;
                                    disY = -disY;
                                    break;
                                case 'L':
                                    disX = -disX;
                                    disY = 0;
                                    break;
                                case 'R':
                                    disX = disX;
                                    disY = 0;
                                    break;
                                case 'RU':
                                    disY = -disY;
                                    break;
                                case 'D':
                                    disX = 0;
                                    break;
                                case 'RD':
                                    break;
                                case 'LD':
                                    disX = -disX;
                                    break;
                                default:
                                    break;
                            }
                            LwgAni2D.move_rotate(element, 0, new Laya.Point(element.x + disX / 30, element.y + disY / 30), time / 6, 0, () => {
                                let rotate1 = LwgTools._Number.randomOneBySection(180);
                                let rotate2 = LwgTools._Number.randomOneBySection(-180);
                                LwgAni2D.move_rotate(element, LwgTools._Number.randomOneHalf() == 0 ? rotate1 : rotate2, new Laya.Point(element.x + disX, element.y + disY), time, 0, () => {
                                    LwgAni2D.fadeOut(element, 1, 0, 200);
                                });
                            });
                        }
                    }
                    if (_TaskClothes._ins()._checkAllCompelet()) {
                        LwgTools._Node.removeAllChildren(_TaskClothes._ins().LineParent);
                        this._evNotify(_MakeTailor.Event.scissorRemove);
                        LwgTimer._frameOnce(80, this, () => {
                            this._evNotify(_MakeTailor.Event.completeEffcet);
                        });
                        LwgTimer._frameOnce(280, this, () => {
                            _Tweeting._photo.take(this._Owner, 0);
                            this._openScene(_SceneName.MakePattern, true, true);
                        });
                    }
                }
                const gPos = Dotted.parent.localToGlobal(new Laya.Point(Dotted.x, Dotted.y));
                if (Dotted.name == 'A') {
                    if (this._ImgVar('Scissor').x <= gPos.x) {
                        this._evNotify(_MakeTailor.Event.scissorRotation, [Dotted.rotation]);
                    }
                    else {
                        this._evNotify(_MakeTailor.Event.scissorRotation, [180 + Dotted.rotation]);
                    }
                }
                else {
                    if (this._ImgVar('Scissor').y >= gPos.y) {
                        this._evNotify(_MakeTailor.Event.scissorRotation, [Dotted.rotation]);
                    }
                    else {
                        this._evNotify(_MakeTailor.Event.scissorRotation, [180 + Dotted.rotation]);
                    }
                }
            });
            this._evReg(_MakeTailor.Event.completeEffcet, () => {
                this.UI.btnBackVinish();
                this.UI.btnAgainVinish();
                LwgAudio._playVictorySound(null, null, null, 0.5);
                const index = LwgTools._Array.randomGetOne([0, 1, 2]);
                switch (index) {
                    case 0:
                        this.heartShapedPathEffcet();
                        break;
                    case 1:
                        _GameEffects2D._completeCross();
                        break;
                    case 2:
                        _GameEffects2D._completeSidelingCross();
                        break;
                    default:
                        break;
                }
            });
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'jiancaipage');
        }
        heartShapedPathEffcet() {
            this._AniVar('complete').play(0, false);
            let _caller = {};
            LwgTimer._frameLoop(1, _caller, () => {
                let gP = this._ImgVar('EFlower').parent.localToGlobal(new Laya.Point(this._ImgVar('EFlower').x, this._ImgVar('EFlower').y));
                LwgEff2D._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y - 40), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 222, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                LwgEff2D._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
            });
            this._AniVar('complete').on(Laya.Event.COMPLETE, this, () => {
                LwgTimer._clearAll([_caller]);
            });
        }
    }

    class Start extends LwgScene._SceneBase {
        lwgOnAwake() {
            ADManager.TAPoint(TaT.PageShow, 'mainpage');
            ADManager.TAPoint(TaT.BtnShow, 'symaker');
            ADManager.TAPoint(TaT.BtnShow, 'lyqmaker');
            ADManager.TAPoint(TaT.BtnShow, 'xzmaker');
            ADManager.TAPoint(TaT.BtnShow, 'change');
            LwgTools._Node.childrenVisible2D(this._ImgVar('BtnParent'), false);
            _3DScene._ins().openStartAni(() => {
                this._ImgVar('BtnTop').pos(_3DScene._ins().btnTopPos.x, _3DScene._ins().btnTopPos.y);
                this._ImgVar('BtnDress').pos(_3DScene._ins().btnDressPos.x, _3DScene._ins().btnDressPos.y);
                this._ImgVar('BtnBottoms').pos(_3DScene._ins().btnBottomsPos.x, _3DScene._ins().btnBottomsPos.y);
                this._ImgVar('BtnDressingRoom').pos(_3DScene._ins().btnDressingRoomPos.x, _3DScene._ins().btnDressingRoomPos.y);
                for (let index = 0; index < this._ImgVar('BtnParent').numChildren; index++) {
                    const element = this._ImgVar('BtnParent').getChildAt(index);
                    element.visible = false;
                }
            });
        }
        lwgOpenAniAfter() {
            LwgClick._absolute = false;
            for (let index = 0; index < this._ImgVar('BtnParent').numChildren; index++) {
                const element = this._ImgVar('BtnParent').getChildAt(index);
                element.visible = true;
                const delay = 200 * index;
                LwgAni2D.bombs_Appear(element, 0, 1, 1.2, 0, 200, () => {
                    if (index === this._ImgVar('BtnParent').numChildren - 1) {
                        LwgTimer._once(500, this, () => {
                            LwgClick._absolute = true;
                            if (_Start._whereFrom === _SceneName.MakePattern) {
                                this._evNotify(_Start.Event.photo);
                                _Start._whereFrom = null;
                            }
                            else {
                                if (!_Guide._complete.value) {
                                    this._openScene('Guide', false, false, () => {
                                        this.BtnDressClick();
                                        this._evNotify(_Guide.Event.StartBtnDress, [this._ImgVar('BtnDress').x, this._ImgVar('BtnDress').y]);
                                    });
                                }
                                else {
                                    !_CheckIn._todayCheckIn.value && this._openScene(_SceneName.CheckIn, false);
                                }
                            }
                        });
                    }
                }, delay);
                _GameEffects2D._circleExplode(this._Owner, new Laya.Point(element.x, element.y), delay);
            }
        }
        lwgOnStart() {
            this._evNotify(_Start.Event.updateRanking);
        }
        lwgEvent() {
            this._evReg(_Guide.Event.DelayBtnCheckIn, () => {
                this.BtnCheckIn();
                this._evNotify(_Guide.Event.BtnCheckIn, [this._ImgVar('BtnCheckIn').x, this._ImgVar('BtnCheckIn').y]);
            });
            this._evReg(_Guide.Event.StartOtherBtnClick, () => {
                this.lwgButton();
            });
            this._evReg(_Start.Event.updateRanking, () => {
                let obj = _Ranking._Data._ins()._getPitchObj();
                this._LabelVar('RankNum').text = `${obj[_Ranking._Data._ins()._mergePro.rankNum]}/50`;
            });
            this._evReg(_Start.Event.photo, () => {
                LwgClick._absolute = false;
                const sp = _3DScene._ins().cameraToSprite(this._Owner);
                LwgTimer._frameOnce(10, this, () => {
                    _Tweeting._photo.take(this._Owner, 2);
                    sp.destroy();
                    LwgTimer._frameOnce(10, this, () => {
                        this._openScene(_SceneName.Tweeting_Main, false);
                    });
                });
            });
            this._evReg(_Start.Event.BtnPersonalInfo, () => {
                LwgTimer._once(1000, this, () => {
                    this._openScene(_SceneName.Guide, false, false, () => {
                        this.BtnPersonalInfoClick();
                        this._evNotify(_Guide.Event.PersonalInfoBtn, [this._ImgVar('BtnPersonalInfo').x, this._ImgVar('BtnPersonalInfo').y]);
                    });
                });
            });
        }
        BtnDressClick() {
            this._btnUp(this._ImgVar('BtnDress'), () => {
                this._evNotify(_Guide.Event.closeGuide);
                let time = 0;
                if (_Guide._complete.value) {
                    time = 300;
                }
                LwgTimer._once(time, this, () => {
                    this.openMakeTailor('Dress');
                });
                ADManager.TAPoint(TaT.BtnClick, 'lyqmaker');
            });
        }
        BtnPersonalInfoClick() {
            this._btnUp(this._ImgVar('BtnPersonalInfo'), () => {
                !_Guide._complete.value && this._evNotify(_Guide.Event.vanishGuide);
                this._openScene(_SceneName.PersonalInfo, false);
            });
        }
        BtnCheckIn() {
            this._btnUp(this._ImgVar('BtnCheckIn'), () => {
                !_Guide._complete.value && this._evNotify(_Guide.Event.vanishGuide);
                this._openScene(_SceneName.CheckIn, false);
            });
        }
        openMakeTailor(_classify) {
            _DIYClothes._ins()._pitchClassify = _classify;
            _3DScene._ins().cameraToSprite(this._Owner);
            this._openScene(_SceneName.MakeTailor, true, true);
        }
        lwgButton() {
            if (!_Guide._complete.value)
                return;
            this.BtnDressClick();
            const Clothes = _DIYClothes._ins();
            this._btnUp(this._ImgVar('BtnTop'), () => {
                Clothes._pitchClassify = Clothes._classify.Top;
                this.openMakeTailor('Top');
                ADManager.TAPoint(TaT.BtnClick, 'symaker');
            });
            this._btnUp(this._ImgVar('BtnBottoms'), () => {
                Clothes._pitchClassify = Clothes._classify.Bottoms;
                this.openMakeTailor('Bottoms');
                ADManager.TAPoint(TaT.BtnClick, 'xzmaker');
            });
            this.BtnPersonalInfoClick();
            this._btnUp(this._ImgVar('BtnRanking'), () => {
                _Ranking._whereFrom = _SceneName.Start;
                this._openScene(_SceneName.Ranking, false);
            });
            this._btnUp(this._ImgVar('BtnDressingRoom'), () => {
                ADManager.TAPoint(TaT.BtnClick, 'change');
                _3DScene._ins().cameraToSprite(this._Owner);
                this._openScene(_SceneName.DressingRoom, true, true);
            });
            this.BtnCheckIn();
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'mainpage');
        }
    }

    var LwgOPPO;
    (function (LwgOPPO) {
        function _screenShootByRatio(func, startXRatio, startYRatio, endXRatio, endYRatio, fileType, quality) {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                const _startXRatio = startXRatio ? startXRatio * window['__canvas'].width : 0;
                const _startYRatio = startYRatio ? startYRatio * window['__canvas'].height : 0;
                window['__canvas'].toTempFilePath({
                    x: _startXRatio,
                    y: _startYRatio,
                    width: endXRatio ? endXRatio * window['__canvas'].width - _startXRatio : window['__canvas'].width,
                    height: endYRatio ? endYRatio * window['__canvas'].height - _startYRatio : window['__canvas'].height,
                    fileType: fileType ? fileType : 'png',
                    quality: quality ? quality : 1,
                    success: (data) => {
                        func && func(data);
                        console.log('.............................截图成功', data['tempFilePath']);
                    },
                    fail: (data) => {
                        console.log('？？？？？？？？？？？？？？？？', data['number']);
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', data['errMsg']);
                    },
                    complete: () => { },
                });
            }
        }
        LwgOPPO._screenShootByRatio = _screenShootByRatio;
        function _screenShoot(func, x, y, width, height, fileType, quality) {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                const _x = x * Laya.stage.clientScaleX;
                const _y = y * Laya.stage.clientScaleY;
                const _width = width * Laya.stage.clientScaleX;
                const _height = height * Laya.stage.clientScaleY;
                window['__canvas'].toTempFilePath({
                    x: _x,
                    y: _y,
                    width: _width,
                    height: _height,
                    fileType: fileType ? fileType : 'png',
                    quality: quality ? quality : 1,
                    success: (data) => {
                        func && func(data);
                        console.log('.............................截图成功', data['tempFilePath']);
                    },
                    fail: (data) => {
                        console.log('？？？？？？？？？？？？？？？？', data['number']);
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', data['errMsg']);
                    },
                    complete: () => { },
                });
            }
        }
        LwgOPPO._screenShoot = _screenShoot;
        function _picSave(tempFilePath, name, func) {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                var FileSystemManager = Laya.Browser.window.qg.getFileSystemManager();
                let data = LwgStorage._array(name, null, [1, `${name}.png`]).value;
                let savedFilePath = Laya.Browser.window.qg.env.USER_DATA_PATH
                    + data[0] + data[1];
                let _savedFilePath = Laya.Browser.window.qg.env.USER_DATA_PATH
                    + (data[0] + 1) + data[1];
                var save = () => {
                    FileSystemManager.saveFile({
                        tempFilePath: tempFilePath,
                        filePath: _savedFilePath,
                        success: function (res) {
                            console.log('-------------------------图片保存成功', res['savedFilePath']);
                            LwgStorage._array(name).value = [data[0] + 1, data[1]];
                            func && func(res);
                        },
                        fail: function () {
                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxx保存图片失败');
                        },
                        complete: function () { }
                    });
                };
                FileSystemManager.access({
                    path: savedFilePath,
                    success: () => {
                        FileSystemManager.removeSavedFile({
                            filePath: savedFilePath,
                            success: () => {
                                console.log('---------------------------删除保存的图片成功！');
                                save();
                            },
                        });
                    },
                    fail: () => {
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx没有保存这个文件！');
                        save();
                    },
                    complete: () => { },
                });
            }
        }
        LwgOPPO._picSave = _picSave;
        function _getStoragePic(name) {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                let data = LwgStorage._array(name).value;
                if (data.length > 0) {
                    return Laya.Browser.window.qg.env.USER_DATA_PATH + data[0] + data[1];
                }
                ;
            }
        }
        LwgOPPO._getStoragePic = _getStoragePic;
    })(LwgOPPO || (LwgOPPO = {}));

    class _Item$1 extends LwgData._Item {
        constructor() {
            super(...arguments);
            this.diffX = 0;
            this.create = false;
        }
        $button() {
            this._btnFour(this._ImgChild('Icon'), (e) => {
                if (!this.$data.complete) {
                    switch (this.$data.unlockWay) {
                        case this.$unlockWayType.check:
                            LwgDialogue._middleHint('请前往签到页面获取');
                            break;
                        case this.$unlockWayType.customs:
                            LwgDialogue._middleHint(`制作${this.$data.conditionNum}件衣服才能获取！`);
                            break;
                        case this.$unlockWayType.ads:
                            ADManager.ShowReward(() => {
                                if (_MakePattern._Pattern._ins()._checkCondition(this.$data.name)) {
                                    LwgDialogue._middleHint('恭喜获得新贴图！');
                                    _MakePattern._Pattern._ins()._setProperty(this.$data.name, _MakePattern._Pattern._ins()._property.complete, true);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
                if (this.$data.name === 'ads' || !this.$data.name || !this.$data.complete) {
                    this['Cancal'] = true;
                    return;
                }
                else {
                    this['Cancal'] = false;
                }
                this.create = false;
                this.diffX = 0;
                this.fX = e.stageX;
                this._evNotify(_MakePattern.Event.close);
            }, (e) => {
                if (this['Cancal']) {
                    return;
                }
                if (!this.create) {
                    this.diffX = this.fX - e.stageX;
                    if (this.diffX >= 5) {
                        this._evNotify(_MakePattern.Event.createImg, [this.$data.name, this._Owner._lwg.gPoint]);
                        this.create = true;
                    }
                }
            }, () => {
                if (this['Cancal']) {
                    return;
                }
                this.create = true;
                this._evNotify(_MakePattern.Event.close);
            }, () => {
                if (this['Cancal']) {
                    return;
                }
                this.create = true;
            });
        }
        $render() {
            this._LableChild('UnlockWayNum').visible = false;
            if (this.$data.name === 'ads') {
                !this._BoxChild('NativeRoot') && LwgTools._Node.createPrefab(_Res.$prefab2D.NativeRoot.prefab2D, this._Owner);
                this._LableChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = false;
            }
            else {
                if (!this.$data.complete) {
                    if (this.$data.unlockWay === _MakePattern._Pattern._ins()._unlockWay.ads) {
                        this._ImgChild('AdsSign').visible = true;
                        this._LableChild('UnlockWay').visible = false;
                    }
                    else {
                        this._LableChild('AdsSign').visible = false;
                        this._LableChild('UnlockWay').visible = true;
                        switch (this.$data.unlockWay) {
                            case _DIYClothes._ins()._unlockWay.check:
                                this._LableChild('UnlockWay').text = '签到';
                                this._LableChild('UnlockWay').fontSize = 30;
                                this._LableChild('UnlockWayNum').visible = false;
                                break;
                            case _DIYClothes._ins()._unlockWay.customs:
                                this._LableChild('UnlockWay').text = `制作衣服`;
                                this._LableChild('UnlockWay').fontSize = 25;
                                this._LableChild('UnlockWayNum').visible = true;
                                this._LableChild('UnlockWayNum').text = `(${_Tweeting._completeNum.value} /${this.$data.conditionNum})`;
                                break;
                            default:
                                break;
                        }
                    }
                    this._LableChild('Mask').visible = true;
                }
                else {
                    this._LableChild('Mask').visible = this._ImgChild('AdsSign').visible = this._LableChild('UnlockWay').visible = false;
                }
                this._ImgChild('Icon').visible = true;
                this._ImgChild('Icon').gray = !this.$data.complete;
                if (this._BoxChild('NativeRoot'))
                    this._BoxChild('NativeRoot').destroy();
                if (this.$data.name) {
                    this._ImgChild('Icon').skin = `Pattern/${this.$data.name}.png`;
                }
                else {
                    this._LableChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = false;
                    this._ImgChild('Icon').skin = null;
                }
            }
        }
    }
    class MakePattern extends LwgScene._SceneBase {
        constructor() {
            super(...arguments);
            this.Tex = {
                Img: null,
                DisImg: null,
                imgSize: [128, 128],
                wireframeSize: [120, 150],
                touchP: null,
                diffP: null,
                dir: 'Front',
                dirType: {
                    Front: 'Front',
                    Reverse: 'Reverse',
                },
                state: 'none',
                stateType: {
                    none: 'none',
                    move: 'move',
                    scale: 'scale',
                    rotate: 'rotate',
                    addTex: 'addTex',
                },
                zOderindex: 0,
                createImg: (name, gPoint) => {
                    this.Tex.DisImg && this.Tex.DisImg.destroy();
                    this.Tex.DisImg = new Laya.Image;
                    this.Tex.Img = new Laya.Image;
                    let lPoint = this._SpriteVar('Ultimately').globalToLocal(gPoint);
                    this.Tex.Img.skin = this.Tex.DisImg.skin = `Pattern/${name}.png`;
                    this.Tex.Img.x = this.Tex.DisImg.x = lPoint.x;
                    this.Tex.Img.y = this.Tex.DisImg.y = lPoint.y;
                    this.Tex.Img.name = name;
                    this.Tex.Img.width = this.Tex.DisImg.width = this.Tex.imgSize[0];
                    this.Tex.Img.height = this.Tex.DisImg.height = this.Tex.imgSize[1];
                    this.Tex.Img.anchorX = this.Tex.Img.anchorY = this.Tex.DisImg.anchorX = this.Tex.DisImg.anchorY = 0.5;
                    this._SpriteVar('Dispaly').addChild(this.Tex.DisImg);
                    this._SpriteVar('Dispaly').visible = true;
                    this.Tex.zOderindex++;
                    this.Tex.Img.zOrder = this.Tex.zOderindex;
                },
                getTex: () => {
                    let ImgF = this._ImgVar(this.Tex.dirType.Front);
                    let ImgR = this._ImgVar(this.Tex.dirType.Reverse);
                    let arr = [
                        ImgF.drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height),
                        ImgR.drawToTexture(ImgR.width, ImgR.height, ImgR.x, ImgR.y + ImgR.height)
                    ];
                    return arr;
                },
                fDiffX: 0,
                fDiffY: 0,
                rDiffX: 0,
                rDiffY: 0,
                setImgPos: () => {
                    if (!this.Tex.Img) {
                        return;
                    }
                    let posArr = this.Tex.setPosArr();
                    let indexArr = [];
                    let outArr = [];
                    for (let index = 0; index < posArr.length; index++) {
                        const out = LwgTools._3D.rayScanning(_3DScene._ins()._MainCamara, _3DScene._ins()._Owner, new Laya.Vector2(posArr[index].x, posArr[index].y), 'model');
                        if (out) {
                            outArr.push(out);
                            indexArr.push(posArr[index]);
                        }
                    }
                    if (indexArr.length !== 0) {
                        const out = outArr[outArr.length - 1];
                        this._SpriteVar(this.Tex.dir).addChild(this.Tex.Img);
                        let _width = this._ImgVar(this.Tex.dir).width;
                        let _height = this._ImgVar(this.Tex.dir).height;
                        let angleXZ = LwgTools._Point.pointByAngleOld(_3DDIYCloth._ins().ModelTap.transform.position.x - out.point.x, _3DDIYCloth._ins().ModelTap.transform.position.z - out.point.z);
                        if (this.Tex.dir == this.Tex.dirType.Front) {
                            this.Tex.Img.x = _width - _width / 180 * (angleXZ + 90);
                        }
                        else {
                            this.Tex.Img.x = -_width / 180 * (angleXZ - 90);
                        }
                        let pH = out.point.y - _3DDIYCloth._ins().ModelTap.transform.position.y;
                        let _DirHeight = LwgTools._3D.getMeshSize(this.Tex.dir === this.Tex.dirType.Front ? _3DDIYCloth._ins().Front : _3DDIYCloth._ins().Reverse).y;
                        let ratio = 1 - pH / _DirHeight;
                        this.Tex.Img.y = ratio * _height;
                        if (this.Tex.dir === this.Tex.dirType.Front) {
                            this.Tex.Img.x += this.Tex.fDiffX;
                            this.Tex.Img.y += this.Tex.fDiffY;
                        }
                        else {
                            this.Tex.Img.x += this.Tex.rDiffX;
                            this.Tex.Img.y += this.Tex.rDiffY;
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                setPosArr: () => {
                    let x = this._ImgVar('Wireframe').x;
                    let y = this._ImgVar('Wireframe').y;
                    return [
                        new Laya.Point(x, y),
                    ];
                },
                checkInside: () => {
                    let posArr = this.Tex.setPosArr();
                    let bool = false;
                    for (let index = 0; index < posArr.length; index++) {
                        const _out = LwgTools._3D.rayScanning(_3DScene._ins()._MainCamara, _3DScene._ins()._Owner, new Laya.Vector2(posArr[index].x, posArr[index].y), 'model');
                        if (_out) {
                            bool = true;
                        }
                    }
                    return bool;
                },
                getDisGP: () => {
                    return this.Tex.DisImg ? this._SpriteVar('Dispaly').localToGlobal(new Laya.Point(this.Tex.DisImg.x, this.Tex.DisImg.y)) : null;
                },
                disMove: () => {
                    this.Tex.DisImg.x += this.Tex.diffP.x;
                    this.Tex.DisImg.y += this.Tex.diffP.y;
                    let gPoint = this.Tex.getDisGP();
                    this._ImgVar('Wireframe').pos(gPoint.x, gPoint.y);
                },
                move: () => {
                    this.Tex.disMove();
                    this._ImgVar('Wireframe').visible = false;
                    if (this.Tex.checkInside()) {
                        this.Tex.setImgPos();
                        this._ImgVar('Wireframe').visible = true;
                        this.Tex.state = this.Tex.stateType.addTex;
                        this._SpriteVar('Dispaly').visible = false;
                    }
                },
                addTex: () => {
                    if (!this.Tex.Img) {
                        return;
                    }
                    this.Tex.disMove();
                    let out = this.Tex.setImgPos();
                    if (!out) {
                        this._ImgVar('Wireframe').visible = false;
                        this.Tex.state = this.Tex.stateType.move;
                        this.Tex.Img.x = Laya.stage.width;
                        this._SpriteVar('Dispaly').visible = true;
                    }
                    _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
                },
                scale: (e) => {
                    if (!this.Tex.Img) {
                        return;
                    }
                    const lPoint = this._ImgVar('Wireframe').globalToLocal(new Laya.Point(e.stageX, e.stageY));
                    this._ImgVar('Wireframe').width = this._ImgVar('WConversion').x = lPoint.x;
                    this._ImgVar('Wireframe').height = this._ImgVar('WConversion').y = lPoint.y;
                    const gPoint = this._Owner.localToGlobal(new Laya.Point(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y));
                    this.Tex.Img.rotation = this.Tex.DisImg.rotation = this._ImgVar('Wireframe').rotation = LwgTools._Point.pointByAngleOld(e.stageX - gPoint.x, e.stageY - gPoint.y) + 45;
                    const scaleWidth = this._ImgVar('Wireframe').width - this.Tex.wireframeSize[0];
                    const scaleheight = this._ImgVar('Wireframe').height - this.Tex.wireframeSize[1];
                    this.Tex.DisImg.width = this.Tex.Img.width = this.Tex.imgSize[0] + scaleWidth;
                    this.Tex.DisImg.height = this.Tex.Img.height = this.Tex.imgSize[1] + scaleheight;
                    _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
                },
                rotate: () => {
                    if (!_Guide._complete.value)
                        return;
                    if (this.Tex.diffP.x > 0) {
                        _3DDIYCloth._ins().rotate(1);
                    }
                    else {
                        _3DDIYCloth._ins().rotate(0);
                    }
                },
                again: () => {
                    LwgTools._Node.removeAllChildren(this._SpriteVar('Front'));
                    LwgTools._Node.removeAllChildren(this._SpriteVar('Reverse'));
                    this.Tex.turnFace();
                    _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
                },
                none: () => {
                    return;
                },
                operation: (e) => {
                    if (this.Tex.touchP) {
                        this.Tex.diffP = new Laya.Point(e.stageX - this.Tex.touchP.x, e.stageY - this.Tex.touchP.y);
                        this.Tex[this.Tex.state](e);
                        this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
                    }
                },
                frameRestore: () => {
                    this._ImgVar('Wireframe').rotation = 0;
                    this._ImgVar('Wireframe').visible = false;
                    this._ImgVar('Wireframe').width = this.Tex.wireframeSize[0];
                    this._ImgVar('Wireframe').height = this.Tex.wireframeSize[1];
                    this._ImgVar('WConversion').x = this._ImgVar('Wireframe').width;
                    this._ImgVar('WConversion').y = this._ImgVar('Wireframe').height;
                    this.Tex.Img = null;
                },
                close: () => {
                    this.Tex.frameRestore();
                    this.Tex.DisImg && this.Tex.DisImg.destroy();
                    this.Tex.Img = null;
                    this.Tex.Img && this.Tex.Img.destroy();
                    this.Tex.Img = null;
                    this.Tex.state = this.Tex.stateType.none;
                    this.Tex.touchP = null;
                    _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
                },
                turnFace: (func) => {
                    let time;
                    let angle;
                    if (this.Tex.dir == this.Tex.dirType.Front) {
                        time = Math.abs(_3DDIYCloth._ins().Present.transform.localRotationEulerY - 180) * 2;
                        angle = 180;
                    }
                    else {
                        time = Math.abs(_3DDIYCloth._ins().Present.transform.localRotationEulerY) * 2;
                        angle = 0;
                    }
                    LwgAni3D.rotateTo(_3DDIYCloth._ins().Present, new Laya.Vector3(0, angle, 0), time, this, null, () => {
                        func && func();
                    });
                },
                btn: () => {
                    this._btnFour(this._ImgVar('WConversion'), (e) => {
                        e.stopPropagation();
                        this.Tex.state = this.Tex.stateType.scale;
                    }, null, (e) => {
                        e.stopPropagation();
                        this.Tex.state = this.Tex.stateType.addTex;
                        if (!_Guide._complete.value) {
                            if (_Guide.MakePatternState === _Guide.MakePatternStateType.Frame1) {
                                this._evNotify(_Guide.Event.MakePatternTurnFace, [this._ImgVar('BtnTurnFace')._lwg.gPoint.x, this._ImgVar('BtnTurnFace')._lwg.gPoint.y]);
                            }
                            else if (_Guide.MakePatternState === _Guide.MakePatternStateType.Frame2) {
                                this._evNotify(_Guide.Event.MakePatternBtnCom, [this._ImgVar('BtnComplete')._lwg.gPoint.x, this._ImgVar('BtnComplete')._lwg.gPoint.y]);
                            }
                        }
                    });
                    this._btnUp(this._ImgVar('BtnTurnFace'), (e) => {
                        if (!_Guide._complete.value) {
                            if (_Guide.MakePatternState === _Guide.MakePatternStateType.TurnFace) {
                                this._evNotify(_Guide.Event.MakePatternPattern2);
                            }
                            else {
                                return;
                            }
                        }
                        e.stopPropagation();
                        this.Tex.frameRestore();
                        if (this.Tex.dir === this.Tex.dirType.Front) {
                            this.Tex.dir = this.Tex.dirType.Reverse;
                            this._ImgVar('BtnTurnFace').skin = 'Game/UI/MakePattern/fan.png';
                            ADManager.TAPoint(TaT.BtnClick, 'Amian');
                        }
                        else {
                            this.Tex.dir = this.Tex.dirType.Front;
                            this._ImgVar('BtnTurnFace').skin = 'Game/UI/MakePattern/zheng.png';
                            ADManager.TAPoint(TaT.BtnClick, 'Bmian');
                        }
                        this.Tex.turnFace();
                        this._ImgVar('Wireframe').visible = false;
                        this.Tex.state = this.Tex.stateType.rotate;
                    });
                    if (!_Guide._complete.value)
                        return;
                    this._btnUp(this._ImgVar('WClose'), (e) => {
                        e.stopPropagation();
                        this.Tex.close();
                    });
                    this._btnFour(this._ImgVar('BtnL'), () => {
                        this.Tex.frameRestore();
                        this.Tex.state = this.Tex.stateType.rotate;
                        LwgTimer._frameLoop(1, this._ImgVar('BtnL'), () => {
                            _3DDIYCloth._ins().rotate(0);
                        });
                    }, null, () => {
                        Laya.timer.clearAll(this._ImgVar('BtnL'));
                    }, () => {
                        Laya.timer.clearAll(this._ImgVar('BtnL'));
                    });
                    this._btnFour(this._ImgVar('BtnR'), () => {
                        this.Tex.frameRestore();
                        this.Tex.state = this.Tex.stateType.rotate;
                        LwgTimer._frameLoop(1, this._ImgVar('BtnR'), () => {
                            _3DDIYCloth._ins().rotate(1);
                        });
                    }, null, () => {
                        Laya.timer.clearAll(this._ImgVar('BtnR'));
                    }, () => {
                        Laya.timer.clearAll(this._ImgVar('BtnR'));
                    });
                }
            };
        }
        lwgOnAwake() {
            ADManager.TAPoint(TaT.PageShow, 'tiehuapage');
            ADManager.TAPoint(TaT.LevelStart, `level_${_3DDIYCloth._ins().Present.name}`);
            _MakePattern._Pattern._ins()._List = this._ListVar('List');
            if (_MakePattern._Pattern._ins()._getProperty('newYear1', _MakePattern._Pattern._ins()._property.complete) || !_Guide._complete.value) {
                this.switchClassify('newYear');
                _MakePattern._Pattern._ins()._listArray = _MakePattern._Pattern._ins().newYearArr;
            }
            else {
                this.switchClassify('basic');
                _MakePattern._Pattern._ins()._listArray = _MakePattern._Pattern._ins().basicArr;
            }
            _MakePattern._Pattern._ins()._List.scrollBar.touchScrollEnable = false;
            _MakePattern._Pattern._ins()._listRenderScript = _Item$1;
            this.Tex.fDiffX = _MakePattern._PatternDiff._ins().fDiffX;
            this.Tex.fDiffY = _MakePattern._PatternDiff._ins().fDiffY;
            this.Tex.rDiffX = _MakePattern._PatternDiff._ins().rDiffX;
            this.Tex.rDiffY = _MakePattern._PatternDiff._ins().rDiffY;
        }
        lwgOpenAniAfter() {
            LwgTimer._frameOnce(60, this, () => {
                !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                    this._evNotify(_Guide.Event.MakePatternChooseClassify);
                });
            });
        }
        lwgAdaptive() {
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                this._ImgVar('BtnComplete').y += 80;
                this._ImgVar('BtnTurnFace').y += 80;
            }
            this._adaWidth([this._ImgVar('BtnR'), this._ImgVar('BtnL')]);
        }
        lwgOnStart() {
            const url = _DIYClothes._ins().getPitchTexBasicUrl();
            this._ImgVar('Front').loadImage(url, Laya.Handler.create(this, () => {
                this._ImgVar('Reverse').loadImage(url, Laya.Handler.create(this, () => {
                    _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
                }));
            }));
            LwgAni2D.fadeOut(this._ImgVar('BtnL'), 0, 1, 200, 200);
            LwgAni2D.fadeOut(this._ImgVar('BtnR'), 0, 1, 200, 200);
            this.UI = new _UI(this._Owner);
            this.UI.BtnAgain.pos(86, 630);
            LwgTimer._frameOnce(10, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnCompleteAppear(null, 400);
                    this.UI.btnTurnFaceAppear(null, 200);
                });
                this.UI.btnBackAppear(null, 200);
                this.UI.btnRollbackAppear(null, 600);
                this.UI.btnAgainAppear(null, 800);
            });
            this._SpriteVar('Front').y = this._ImgVar('Reverse').y = this._SpriteVar('Front').height = this._ImgVar('Reverse').height = _3DDIYCloth._ins().texHeight;
        }
        switchClassify(_name) {
            if (!_Guide._complete.value && _name !== 'basic') {
                return;
            }
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const element = this._ImgVar('Part').getChildAt(index);
                const name = element.getChildAt(0);
                if (_name === element.name) {
                    if (!_Guide._complete.value) {
                        if (_Guide.MakePatternState === _Guide.MakePatternStateType.ChooseClassify) {
                            this._evNotify(_Guide.Event.MakePatternPattern1);
                        }
                    }
                    element.scale(1.1, 1.1);
                    _MakePattern._Pattern._ins()._listArray = _MakePattern._Pattern._ins()[`${element.name}Arr`];
                    _MakePattern._Pattern._ins()._pitchClassify = element.name;
                    element.skin = `Game/UI/Common/kuang_fen.png`;
                    name.color = '#fdfff4';
                    name.stroke = 5;
                }
                else {
                    element.skin = `Game/UI/Common/kuang_bai.png`;
                    element.scale(1, 1);
                    name.color = '#a84f47';
                    name.stroke = 0;
                }
            }
        }
        lwgButton() {
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const _element = this._ImgVar('Part').getChildAt(index);
                this._btnUp(_element, () => {
                    this.switchClassify(_element.name);
                }, 'no');
            }
            this.Tex.btn();
            this.UI.btnCompleteClick = () => {
                if (!_Guide._complete.value) {
                    if (_Guide.MakePatternState === _Guide.MakePatternStateType.BtnCom) {
                        this._evNotify(_Guide.Event.closeGuide);
                    }
                    else {
                        return;
                    }
                }
                if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                    this.operationHidden(() => {
                        RecordManager.stopAutoRecord();
                        _Share._whereFrom = _SceneName.MakePattern;
                        this._openScene(_SceneName.Share, false);
                    });
                }
                else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                    this.operationHidden();
                    this.backStart();
                }
            };
            if (!_Guide._complete.value)
                return;
            this.UI.btnRollbackClick = () => {
                _3DScene._ins().cameraToSprite(this._Owner);
                this._openScene(_SceneName.MakeTailor, true, true);
            };
            this.UI.btnAgainClick = () => {
                this.Tex.again();
            };
        }
        operationHidden(func) {
            this.Tex.frameRestore();
            this.Tex.dir = this.Tex.dirType.Front;
            this.Tex.turnFace(() => {
                LwgAni2D.fadeOut(this._ImgVar('BtnL'), 1, 0, 200);
                LwgAni2D.fadeOut(this._ImgVar('BtnR'), 1, 0, 200, 0, () => {
                    func && func();
                });
            });
        }
        backStart() {
            _3DScene._ins().cameraToSprite(this._Owner);
            LwgTimer._frameOnce(5, this, () => {
                _Tweeting._photo.take(this._Owner, 1);
            });
            this.texStorage();
            this.UI.operationVinish(() => {
                this.UI.btnBackVinish(null, 200);
                this.UI.btnBackVinish();
                this.UI.btnRollbackVinish();
                this.UI.btnAgainVinish(() => {
                });
                var close = () => {
                    _3DScene._ins().cameraToSprite(this._Owner);
                    _Start._whereFrom = _SceneName.MakePattern;
                    this._openScene(_SceneName.Start, true, true);
                };
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                    LwgOPPO._screenShootByRatio((data) => {
                        LwgOPPO._picSave(data['tempFilePath'], _3DDIYCloth._ins().name);
                        close();
                    }, 0.28, null, 0.72, null, null, 0.1);
                }
                else {
                    close();
                }
            }, 200);
        }
        lwgEvent() {
            this._evReg(_MakePattern.Event.createImg, (name, gPoint) => {
                this.Tex.state = this.Tex.stateType.move;
                this.Tex.createImg(name, gPoint);
                this.Tex.turnFace();
            });
            this._evReg(_MakePattern.Event.close, () => {
                if (!_Guide._complete.value)
                    return;
                this.Tex.close();
                this.Tex.state = this.Tex.stateType.none;
            });
            this._evReg(_MakePattern.Event.byteDanceBackStart, () => {
                this.backStart();
            });
        }
        texStorage() {
            const fArr = [];
            var obj = (element) => {
                return {
                    name: element.name,
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height,
                    rotation: element.rotation,
                    anchorX: element.anchorX,
                    anchorY: element.anchorY,
                    zOrder: element.zOrder,
                };
            };
            for (let index = 0; index < this._SpriteVar('Front').numChildren; index++) {
                if (index > 20) {
                    break;
                }
                const element = this._SpriteVar('Front').getChildAt(index);
                fArr.push(obj(element));
            }
            const rArr = [];
            for (let index = 0; index < this._SpriteVar('Reverse').numChildren; index++) {
                if (index < 20) {
                    break;
                }
                const element = this._SpriteVar('Reverse').getChildAt(index);
                rArr.push(obj(element));
            }
            LwgStorage._array(`${_3DDIYCloth._ins().name}/${_DIYClothes._ins()._otherPro.texF}`).value = fArr;
            LwgStorage._array(`${_3DDIYCloth._ins().name}/${_DIYClothes._ins()._otherPro.texR}`).value = rArr;
            _Ranking._whereFrom = _SceneName.Tweeting_GetFans;
        }
        lwgOnStageDown(e) {
            this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                this['slideFY'] = e.stageY;
            }
            else {
                if (!_Guide._complete.value) {
                    return;
                }
                const point = new Laya.Point(e.stageX, e.stageY);
                if (point.distance(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y) > this._ImgVar('Wireframe').width / 2 + 50) {
                    this._ImgVar('Wireframe').visible = false;
                }
                else {
                    if (!this.Tex.Img) {
                        this._ImgVar('Wireframe').visible = false;
                    }
                    else {
                        this._ImgVar('Wireframe').visible = true;
                    }
                }
            }
        }
        lwgOnStageMove(e) {
            this.Tex.operation(e);
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                if (!_Guide._complete.value)
                    return;
                if (this['slideFY']) {
                    let diffY = this['slideFY'] - e.stageY;
                    let index = _MakePattern._Pattern._ins()._List.startIndex;
                    if (Math.abs(diffY) > 25) {
                        if (diffY > 0) {
                            _MakePattern._Pattern._ins()._List.tweenTo(index + 1, 100);
                        }
                        if (diffY < 0) {
                            _MakePattern._Pattern._ins()._List.tweenTo(index - 1, 100);
                        }
                        this['slideFY'] = null;
                    }
                }
            }
            else {
                this['slideFY'] = null;
            }
        }
        lwgOnStageUp(e) {
            this['slideFY'] = null;
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                this._evNotify(_MakePattern.Event.close);
            }
            else {
                if (!this.Tex.checkInside()) {
                    this.Tex.close();
                    console.log(_Guide._complete.value);
                    if (!_Guide._complete.value) {
                        if (_Guide.MakePatternState === _Guide.MakePatternStateType.Frame1) {
                            this._evNotify(_Guide.Event.MakePatternPattern1);
                        }
                        else if (_Guide.MakePatternState === _Guide.MakePatternStateType.Frame2) {
                            this._evNotify(_Guide.Event.MakePatternPattern2);
                        }
                    }
                    ;
                }
                else {
                    if (!_Guide._complete.value && this._ImgVar('Wireframe').visible) {
                        if (_Guide.MakePatternState === _Guide.MakePatternStateType.Pattern1) {
                            this._evNotify(_Guide.Event.MakePatternFrame1, [this._ImgVar('Wireframe')]);
                        }
                        else if (_Guide.MakePatternState === _Guide.MakePatternStateType.Pattern2) {
                            this._evNotify(_Guide.Event.MakePatternFrame2, [this._ImgVar('Wireframe')]);
                        }
                    }
                    ;
                }
            }
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'tiehuapage');
            ADManager.TAPoint(TaT.LevelFinish, `level_${_3DDIYCloth._ins().Present.name}`);
        }
    }

    class _GameEffects3D {
        static _showCloth(Scene3D) {
            const _changeEffectParent = this['_showClothParent'];
            if (_changeEffectParent) {
                _changeEffectParent.destroy();
            }
            var func = () => {
                let dis = 1.3;
                const interval = 5;
                const _position = [0, 0.1, 0.8];
                const _speedY = [0.015, 0.015];
                const _size = [[0.06, 0.06, 0], [0.06, 0.06, 0]];
                const _parent = new Laya.Sprite3D;
                let _angelspeed = 10;
                Scene3D.addChild(_parent);
                LwgTimer._frameNumLoop(interval, 1, this, () => {
                    for (let index = 0; index < 2; index++) {
                        let angelspeed = index === 1 ? _angelspeed : -_angelspeed;
                        const caller = LwgEff3D._Particle._spiral(_parent, _position, _size, null, null, null, [dis, dis], _speedY, [angelspeed, angelspeed]);
                        caller.frame.func = () => {
                            LwgEff3D._Particle._fade(_parent, [caller.box.transform.position.x, caller.box.transform.position.y, caller.box.transform.position.z], null, 10, 0.03, 0.03);
                        };
                    }
                });
                LwgTimer._frameNumLoop(1, 15, this, () => {
                    for (let index = 0; index < 1; index++) {
                        LwgEff3D._Particle._starsShine(_3DScene._ins()._Owner, [0, 0.5, 0.8], [[0, 0, 0], [0.4, 0.6, 0.4]]);
                    }
                });
                return _parent;
            };
            this['_showClothParent'] = func();
        }
    }

    class _Item$2 extends LwgData._Item {
        $button() {
            this._btnUp(this._Owner, (e) => {
                if (this.$data.name === 'ads') {
                    return;
                }
                if (this.$data.complete) {
                    _AllClothes._ins().accurateChange(this.$data.part, this.$data.name);
                    _GameEffects3D._showCloth(_3DScene._ins()._Owner);
                }
                else {
                    ADManager.ShowReward(() => {
                        if (_AllClothes._ins()._checkCondition(this.$data.name)) {
                            LwgDialogue._middleHint('恭喜获得新服装！');
                            _AllClothes._ins().accurateChange(this.$data.part, this.$data.name);
                        }
                    });
                }
            }, null);
        }
        $render() {
            if (!this.$data)
                return;
            if (this.$data.name === 'ads') {
                !this._BoxChild('NativeRoot') && LwgTools._Node.createPrefab(_Res.$prefab2D.NativeRoot.prefab2D, this._Owner);
                this._ImgChild('Mask').visible = this._ImgChild('Icon').visible = this._ImgChild('Board').visible = false;
            }
            else {
                this._BoxChild('NativeRoot') && this._BoxChild('NativeRoot').destroy();
                this._ImgChild('Icon').visible = this._ImgChild('Board').visible = true;
                if (this.$data.putOn) {
                    this._ImgChild('Board').skin = `Game/UI/Common/xuanzhong.png`;
                }
                else {
                    this._ImgChild('Board').skin = null;
                }
                if (this.$data.classify === _AllClothes._ins()._classify.DIY) {
                    if (TJ.API.AppInfo.Channel() === TJ.Define.Channel.AppRt.OPPO_AppRt) {
                        this._ImgChild('Icon').skin = LwgOPPO._getStoragePic(this.$data.name);
                        this._ImgChild('Icon').size(110, 130);
                        this._ImgChild('Icon').scale(1, 1);
                    }
                    else {
                        this._ImgChild('Icon').skin = Laya.LocalStorage.getItem(`${this.$data.name}/icon`);
                    }
                }
                else {
                    this._ImgChild('Icon').size(null, null);
                    this._ImgChild('Icon').scale(0.9, 0.9);
                    this._ImgChild('Icon').skin = _AllClothes._ins().getGeneralIcon(this.$data.name);
                }
            }
            if (this.$data.complete) {
                this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = false;
            }
            else {
                this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = true;
            }
        }
    }
    class DressingRoom extends LwgScene._SceneBase {
        lwgOnAwake() {
            RecordManager.startAutoRecord();
            ADManager.TAPoint(TaT.PageShow, 'changepage');
            _3DScene._ins().openMirror(this._ImgVar('MirrorSurface'));
            const copyDIYArr = _AllClothes._ins().collectDIY();
            _AllClothes._ins()._List = this._ListVar('List');
            _AllClothes._ins()._listRenderScript = _Item$2;
            _AllClothes._ins()._listArray = _AllClothes._ins()._getArrByClassify(_AllClothes._ins()._classify.DIY);
            if (copyDIYArr.length > 0) {
                this.switchClassify(this._ImgVar('DIY'));
            }
            else {
                this.switchClassify(this._ImgVar('Dress'));
            }
        }
        lwgAdaptive() {
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                this._ImgVar('BtnComplete').y += 80;
            }
            this._SpriteVar('Mirror').x = Laya.stage.width / 2 - 450;
        }
        lwgOnStart() {
            _AllClothes._ins()._List.refresh();
            this.UI = new _UI(this._Owner);
            LwgTimer._frameOnce(10, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnCompleteAppear(null, 400);
                });
                this.UI.btnBackAppear(null, 200);
            });
            this.UI.btnCompleteClick = () => {
                _3DScene._ins().closeMirror();
                _3DScene._ins().cameraToSprite(this._Owner);
                if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                    LwgTimer._frameOnce(10, this, () => {
                        RecordManager.stopAutoRecord();
                        _Tweeting._photo.take(this._Owner, 3);
                        _Share._whereFrom = _SceneName.DressingRoom;
                        this._openScene(_SceneName.Share, false);
                    });
                }
                else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                    this.backStart();
                }
            };
        }
        backStart() {
            this.UI.operationVinish(() => {
                Laya.Resource.destroyUnusedResources();
                this._openScene(_SceneName.Start, true, true);
                this.UI.btnBackVinish();
            }, 200);
        }
        switchClassify(_element) {
            let arr = [];
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const element = this._ImgVar('Part').getChildAt(index);
                const Icon = element.getChildAt(0);
                if (_element === element) {
                    element.skin = `Game/UI/Common/kuang_fen.png`;
                    Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}_s.png`;
                    if (_element.name === 'DIY') {
                        arr = _AllClothes._ins()._getArrByClassify(_element.name);
                    }
                    else {
                        let _arr = _AllClothes._ins()._getArrByClassify(_AllClothes._ins()._classify.General);
                        for (let index = 0; index < _arr.length; index++) {
                            const obj = _arr[index];
                            if (obj[_AllClothes._ins()._mergePro.part] === _element.name) {
                                arr.push(obj);
                            }
                        }
                    }
                }
                else {
                    element.skin = `Game/UI/Common/kuang_bai.png`;
                    Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}.png`;
                }
                _AllClothes._ins()._listArray = arr;
            }
        }
        lwgButton() {
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const _element = this._ImgVar('Part').getChildAt(index);
                this._btnUp(_element, () => {
                    this.switchClassify(_element);
                }, 'no');
            }
        }
        lwgEvent() {
            this._evReg(_DressingRoom.Event.byteDanceBackStart, () => {
                this.backStart();
            });
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'changepage');
        }
    }

    class PersonalInfo extends LwgScene._SceneBase {
        lwgOnAwake() {
            ADManager.TAPoint(TaT.BtnShow, 'changename');
            this._TextInputVar('NameValue').text = _PersonalInfo._name.value;
            const obj = _Ranking._Data._ins()._getPitchObj();
            this._LabelVar('RankValue').text = obj[_Ranking._Data._ins()._mergePro.rankNum];
            this._LabelVar('FansValue').text = obj[_Ranking._Data._ins()._mergePro.fansNum];
        }
        lwgOpenAni() {
            console.log('个人信息！');
            return _GameAni._dialogOpenFadeOut(this._ImgVar('Background'), this._ImgVar('Content'), () => {
                !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                    const gP = this._ImgVar('Name').localToGlobal(new Laya.Point(this._ImgVar('NameValue').x, this._ImgVar('NameValue').y));
                    this._evNotify(_Guide.Event.PersonalInfoWriteName, [gP.x, gP.y]);
                }, this._Owner.zOrder + 1);
                LwgTimer._frameLoop(200, this, () => {
                    this._AniVar('ani1').play(0, false);
                    this._AniVar('ani1').on(Laya.Event.LABEL, this, (e) => {
                        if (e === 'comp') {
                            LwgColor._changeOnce(this._ImgVar('Head'), [50, 10, 10, 1], 40);
                        }
                    });
                }, true);
            });
        }
        BtnCloseClick() {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                !_Guide._complete.value && this._evNotify(_Guide.Event.vanishGuide);
                this._closeScene();
            });
        }
        lwgButton() {
            this._btnFour(this._ImgVar('NameValue'), () => {
                this._ImgVar('BtnWrite').scale(0.85, 0.85);
            }, () => {
                this._ImgVar('BtnWrite').scale(0.85, 0.85);
            }, () => {
                this._ImgVar('BtnWrite').scale(1, 1);
            }, () => {
                this._ImgVar('BtnWrite').scale(1, 1);
            });
            this._TextInputVar('NameValue').on(Laya.Event.FOCUS, this, () => {
                !_Guide._complete.value && this._evNotify(_Guide.Event.vanishGuide);
            });
            this._TextInputVar('NameValue').on(Laya.Event.INPUT, this, () => {
            });
            this._TextInputVar('NameValue').on(Laya.Event.BLUR, this, () => {
                if (this._TextInputVar('NameValue').text.length <= 5) {
                    this._TextInputVar('NameValue').fontSize = 30;
                }
                else if (this._TextInputVar('NameValue').text.length === 6) {
                    this._TextInputVar('NameValue').fontSize = 27;
                }
                else {
                    this._TextInputVar('NameValue').fontSize = 24;
                }
                _PersonalInfo._name.value = this._TextInputVar('NameValue').text;
                if (!_Guide._complete.value) {
                    this.BtnCloseClick();
                    const gP = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnClose').x, this._ImgVar('BtnClose').y));
                    this._evNotify(_Guide.Event.PersonalInfoCloseBtn, [gP.x, gP.y]);
                }
            });
            if (!_Guide._complete.value)
                return;
            this.BtnCloseClick();
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                !_Guide._complete.value && this._evNotify(_Guide.Event.DelayBtnCheckIn);
            });
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.BtnClick, 'changename');
        }
    }

    class RankingItem extends LwgData._Item {
        $render() {
            if (this.$data.classify === _Ranking._Data._ins()._classify.self) {
                this._ImgChild('Board').skin = `Game/UI/Ranking/x_di.png`;
                this._LableChild('Name').text = _PersonalInfo._name.value;
            }
            else {
                this._ImgChild('Board').skin = `Game/UI/Ranking/w_di.png`;
                this._LableChild('Name').text = this.$data[_Ranking._Data._ins()._property.name];
            }
            this._LableChild('RankNum').text = String(this.$data.rankNum);
            this._LableChild('FansNum').text = String(this.$data.fansNum);
            const IconPic = this._LableChild('Icon').getChildAt(0);
            IconPic.skin = this.$data.iconSkin;
        }
    }
    class Ranking extends LwgScene._SceneBase {
        lwgOnAwake() {
            ADManager.TAPoint(TaT.PageShow, 'rankpage');
            _Ranking._Data._ins()._List = this._ListVar('List');
            if (_Ranking._whereFrom === _SceneName.Tweeting_GetFans) {
                _Ranking._Data._ins()._addProValueForAll(_Ranking._Data._ins()._mergePro.fansNum, () => {
                    return LwgTools._Number.randomOneInt(100, 150);
                });
            }
            this._evNotify(_Start.Event.updateRanking);
            _Ranking._Data._ins()._listRenderScript = RankingItem;
        }
        lwgOpenAni() {
            if (_Ranking._whereFrom === _SceneName.Tweeting_GetFans) {
                _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('Background'));
            }
            else {
                _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
            }
            return 1000;
        }
        lwgOpenAniAfter() {
            if (_Ranking._whereFrom === _SceneName.Tweeting_GetFans) {
                _GameEffects2D._fireworksCelebrate(() => {
                    !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                        this.BtnCloseClick();
                        const gP = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnClose').x, this._ImgVar('BtnClose').y));
                        this._evNotify(_Guide.Event.RankingCloseBtn, [gP.x, gP.y]);
                    }, this._Owner.zOrder + 1);
                });
                _Ranking._whereFrom = _SceneName.Start;
            }
        }
        lwgOnStart() {
            if (_Ranking._Data._ins()._getProperty(_Ranking._Data._ins()._pitchName, _Ranking._Data._ins()._mergePro.rankNum) === 1) {
                _Ranking._Data._ins()._List.scrollTo(0);
            }
            else {
                if (_Ranking._whereFrom === _SceneName.Tweeting_GetFans) {
                    _Ranking._Data._ins()._listScrollToFirstByLast();
                    _Ranking._Data._ins()._listTweenToDiffIndexByPitch(-1, 1500);
                }
                else {
                    _Ranking._Data._ins()._listScrollToFirstByLast();
                    _Ranking._Data._ins()._listTweenToDiffIndexByPitch(-1, 600);
                }
            }
        }
        BtnCloseClick() {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
                if (!_Guide._complete.value) {
                    this._evNotify(_Guide.Event.closeGuide);
                    this._evNotify(_Start.Event.BtnPersonalInfo);
                }
            });
        }
        lwgButton() {
            if (!_Guide._complete.value)
                return;
            this.BtnCloseClick();
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'rankpage');
        }
    }

    class Tweeting_Main extends LwgScene._SceneBase {
        lwgOnAwake() {
            ADManager.TAPoint(TaT.PageShow, 'weibopage');
            ADManager.TAPoint(TaT.BtnShow, 'photo_choose');
            this._LabelVar('BodyText').text = _Tweeting._mainBody.getOne();
            this._LabelVar('PlayerName').text = _PersonalInfo._name.value;
            this._ImgVar('IconPic').skin = `Game/UI/Ranking/IconSkin/Ava.png`;
            _Tweeting._attentionNum.value += LwgTools._Number.randomOneInt(50, 100);
            this._LabelVar('AttentionNum').text = _Tweeting._attentionNum.value.toString();
            this._LabelVar('FansNum').text = _Ranking._Data._ins()._getPitchProperty(_Ranking._Data._ins()._mergePro.fansNum);
            _Tweeting._completeNum.value++;
            _DIYClothes._ins()._checkConditionUnlockWay(_DIYClothes._ins()._unlockWay.customs, 1);
            this._LabelVar('CompleteNum').text = _Tweeting._completeNum.value.toString();
            const heatArr = LwgTools._Number.randomCountBySection(20, 50, 3);
            heatArr.sort();
            const briefArr = _Tweeting._brief.getThree();
            const iconArr = LwgTools._Number.randomCountBySection(1, 20, 3);
            for (let index = 0; index < 3; index++) {
                const Rank = this._ImgVar('Hot').getChildByName(`Rank${index + 1}`);
                const Name = Rank.getChildByName('Name');
                const Tag = Rank.getChildByName('Tag');
                const Brief = Rank.getChildByName('Brief');
                const Heat = Rank.getChildByName('Heat');
                const Icon = Rank.getChildByName('HeadIcon').getChildByName('Icon');
                const data = _Ranking._Data._ins()._arr[index];
                Name.text = data[_Ranking._Data._ins()._property.name];
                Tag.skin = `Game/UI/Tweeting/Main/${index + 1}.png`;
                Brief.text = briefArr[index];
                Heat.text = `本周热度 ${heatArr[index]}万`;
                Icon.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
            }
            for (let index = 0; index < 3; index++) {
                const element = this._ImgVar('BtnChoosePhotos').getChildByName(`Photo${index + 1}`).getChildAt(0);
                if (_Tweeting._photo.arr[index]) {
                    element.texture = _Tweeting._photo.arr[index];
                }
            }
            for (let index = 0; index < this._ImgVar('Content').numChildren; index++) {
                const element = this._ImgVar('Content').getChildAt(index);
                element.scale(0, 0);
            }
        }
        lwgAdaptive() {
            this._ImgVar('Head').pos(this._Owner.width - (this._ImgVar('Head').width + 57), this._ImgVar('Head').y);
            this._ImgVar('Hot').pos(this._Owner.width - (this._ImgVar('Hot').width + 41), this._ImgVar('Hot').y);
            this._ImgVar('BtnChoosePhotos').size(this._Owner.width - this._ImgVar('BtnChoosePhotos').x - (this._Owner.width - this._ImgVar('Hot').x) - 30, this._ImgVar('BtnChoosePhotos').height);
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                this._ImgVar('PhotoAds').destroy();
                this._ImgVar('Photo1').centerX = -(20 + this._ImgVar('Photo1').width);
                this._ImgVar('Photo2').centerX = 0;
                this._ImgVar('Photo3').centerX = 20 + this._ImgVar('Photo3').width;
            }
            else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                this._ImgVar('PhotoAds').x = this._ImgVar('BtnChoosePhotos').width / 2 - 130 * 2 - 30;
                this._ImgVar('Photo1').x = this._ImgVar('BtnChoosePhotos').width / 2 - 130 - 10;
                this._ImgVar('Photo2').x = this._ImgVar('BtnChoosePhotos').width / 2 + 10;
                this._ImgVar('Photo3').x = this._ImgVar('BtnChoosePhotos').width / 2 + 130 + 30;
            }
            this._ImgVar('Body').size(this._Owner.width - this._ImgVar('BtnChoosePhotos').x - (this._Owner.width - this._ImgVar('Hot').x) - 50, this._ImgVar('Body').height);
            this._ImgVar('BtnChoosePhotos').scale(0, 0);
            this._ImgVar('BtnSet').size(0, 0);
            this._ImgVar('Top').size(this._Owner.width - 100, this._ImgVar('Top').height);
        }
        lwgOpenAni() {
            const baseTime = 150;
            const baseDelay = 200;
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                LwgClick._filter.value = LwgClick._filterType.all;
                LwgAni2D.scale(this._ImgVar('Top'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 1);
                LwgAni2D.scale(this._ImgVar('BtnSet'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 2);
                LwgAni2D.scale(this._ImgVar('Body'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 3);
                LwgAni2D.scale(this._ImgVar('Head'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 4);
                LwgAni2D.scale(this._ImgVar('Hot'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 5);
                LwgTools._Node.changePivot(this._ImgVar('BtnChoosePhotos'), this._ImgVar('BtnChoosePhotos').width / 2, this._ImgVar('BtnChoosePhotos').height / 2);
                LwgAni2D.bombs_Appear(this._ImgVar('BtnChoosePhotos'), 0, 1, 1.08, 0, baseTime * 2, () => {
                    LwgTimer._once(300, this, () => {
                        this.BtnChoosePhotosClick();
                        LwgClick._absolute = true;
                        !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                            this._evNotify(_Guide.Event.TweetingBtnChoosePhoto, [this._ImgVar('BtnChoosePhotos')._lwg.gPoint.x, this._ImgVar('BtnChoosePhotos')._lwg.gPoint.y, this._ImgVar('Photo2')._lwg.gPoint.x + 65, this._ImgVar('Photo2')._lwg.gPoint.y + 65]);
                        });
                    });
                    _GameAni._fadeHint(this._ImgVar('BtnChoosePhotos').getChildByName('HintPic'));
                }, baseDelay * 7);
            });
            return baseDelay * 7 + baseTime * 1.5;
        }
        BtnChoosePhotosClick() {
            this._btnUp(this._ImgVar('BtnChoosePhotos'), () => {
                ADManager.TAPoint(TaT.BtnClick, 'photo_choose');
                this._openScene(_SceneName.Tweeting_ChoosePhotos, false);
            }, 'null');
        }
        lwgButton() {
        }
        lwgCloseAni() {
            return 10;
        }
        lwgOnDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'weibopage');
        }
    }

    class Tweeting_ChoosePhotos extends LwgScene._SceneBase {
        lwgOnAwake() {
            this.photoArr = [this._ImgVar('Photo1'), this._ImgVar('Photo2'), this._ImgVar('Photo3')];
            for (let index = 0; index < this.photoArr.length; index++) {
                const Pic = this.photoArr[index].getChildByName('Pic');
                if (_Tweeting._photo.arr[index]) {
                    Pic.texture = _Tweeting._photo.arr[index];
                }
            }
        }
        lwgOpenAni() {
            return _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
                !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                    this._evNotify(_Guide.Event.TweetingChoosePhoto, [this._ImgVar('Photo1')._lwg.gPoint.x, this._ImgVar('Photo1')._lwg.gPoint.y]);
                });
            });
        }
        lwgButton() {
            for (let index = 0; index < this.photoArr.length; index++) {
                const element = this.photoArr[index];
                this._btnUp(element, () => {
                    for (let index = 0; index < this.photoArr.length; index++) {
                        const _element = this.photoArr[index];
                        const Tick = _element.getChildByName('Tick');
                        if (element == _element) {
                            _element.scale(1.05, 1.05);
                            _Tweeting._photoIndex = index;
                            Tick.visible = true;
                            const gPBtnSend = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnSend').x, this._ImgVar('BtnSend').y));
                            !_Guide._complete.value && this._evNotify(_Guide.Event.TweetingBtnSend, [gPBtnSend.x, gPBtnSend.y]);
                        }
                        else {
                            _element.scale(1, 1);
                            Tick.visible = false;
                        }
                    }
                    this._ImgVar('BtnSend').skin = 'Game/UI/Tweeting/ChoosePhotos/anniu_fasong.png';
                }, 'null');
            }
            ;
            this._btnUp(this._ImgVar('BtnSend'), () => {
                if (this._ImgVar('BtnSend').skin == 'Game/UI/Tweeting/ChoosePhotos/anniu_fasong.png') {
                    !_Guide._complete.value && this._evNotify(_Guide.Event.closeGuide);
                    this._closeScene();
                }
                else {
                    LwgDialogue._middleHint('还未选择照片哦！');
                }
            });
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
                this._openScene(_SceneName.Tweeting_Dynamic, false);
            });
        }
        lwgOnDisable() {
        }
    }

    class Tweeting_Dynamic extends LwgScene._SceneBase {
        constructor() {
            super(...arguments);
            this.baseTime = 150;
            this.baseDelay = 200;
        }
        lwgOpenAni() {
            this._ImgVar('Photo').texture = _Tweeting._photo.arr[_Tweeting._photoIndex];
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), null, () => {
                LwgAni2D.scale(this._ImgVar('Head'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                    this._closeScene(_SceneName.Tweeting_Main);
                    this.bodyTextAppear(() => {
                        LwgAni2D.scale(this._ImgVar('Middle'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                            LwgAni2D.scale(this._ImgVar('Bottom'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                                this.replyAppear();
                            });
                        });
                    });
                });
            });
            return this.baseTime * 2 + this.baseDelay;
        }
        bodyTextAppear(func) {
            const Body = this._ImgVar('Head').getChildByName('Body');
            _GameAni._charactersEffect(Body, _Tweeting._mainBody.present, () => {
                func();
            });
        }
        ;
        replyAppear() {
            const twoReply = _Tweeting._reply.getTow();
            const time = 500;
            LwgAni2D.move(this._ImgVar('Reply1'), this._ImgVar('Reply1').x, this._ImgVar('Reply1').y - 500, time, () => {
                _GameAni._charactersEffect(this._LabelVar('Reply1Body'), twoReply[0], () => {
                    const LikeNum1 = this._ImgVar('Reply1').getChildByName('Like').getChildByName('Num');
                    const time1 = 80;
                    const unit1 = Math.round(LwgTools._Number.randomOneBySection(200, 5000, true) / time);
                    let textNum1 = 0;
                    LwgTimer._frameNumLoop(1, time1, this, () => {
                        textNum1 += unit1;
                        LikeNum1.text = textNum1.toString();
                    });
                    LwgAni2D.move(this._LabelVar('Reply2'), this._LabelVar('Reply2').x, this._LabelVar('Reply2').y - 500, time1, () => {
                        _GameAni._charactersEffect(this._LabelVar('Reply2Body'), twoReply[1], () => {
                            const LikeNum2 = this._LabelVar('Reply2').getChildByName('Like').getChildByName('Num');
                            const unit2 = Math.round(LwgTools._Number.randomOneBySection(200, 5000, true) / time1);
                            let textNum1 = 0;
                            LwgTimer._frameNumLoop(1, time1, this, () => {
                                textNum1 += unit2;
                                LikeNum2.text = textNum1.toString();
                            }, () => {
                                LwgTimer._frameOnce(60, this, () => {
                                    this._openScene(_SceneName.Tweeting_GetFans, false);
                                });
                            });
                        });
                    });
                });
            });
        }
        ;
        lwgOnAwake() {
            this._ImgVar('Head').width = this._Owner.width - 160;
            const Icon = this._ImgVar('Head').getChildByName('HeadIcon').getChildAt(0);
            Icon.skin = `Game/UI/Ranking/IconSkin/Ava.png`;
            this._LabelVar('Brief').text = _Tweeting._brief.getOne()[0].toString();
            this._LabelVar('PlayerName').text = _PersonalInfo._name.value;
            const left = 120;
            this._ImgVar('Middle').width = this._Owner.width - 160;
            this._ImgVar('Collect').x = (this._ImgVar('Middle').width - left * 2) * 0 / 4 + left;
            _Tweeting._forwardedNum.value += 50;
            this._ImgVar('Forwarded').getChildAt(0).text = _Tweeting._forwardedNum.value.toString();
            this._ImgVar('Forwarded').x = (this._ImgVar('Middle').width - left * 2) * 1 / 4 + left;
            _Tweeting._commentNum.value += 50;
            this._ImgVar('Comment').getChildAt(0).text = _Tweeting._commentNum.value.toString();
            this._ImgVar('Comment').x = (this._ImgVar('Middle').width - left * 2) * 2 / 4 + left;
            _Tweeting._likeNum.value += 100;
            this._ImgVar('Like').getChildAt(0).text = _Tweeting._likeNum.value.toString();
            this._ImgVar('Like').x = (this._ImgVar('Middle').width - left * 2) * 3 / 4 + left;
            this._ImgVar('Bottom').width = this._Owner.width - 160;
            const iconArr = LwgTools._Number.randomCountBySection(1, 20, 2);
            const twoObj = _Ranking._Data._ins()._randomCountObj(2);
            for (let index = 0; index < 2; index++) {
                const Reply = this._ImgVar(`Reply${index + 1}`);
                const Icon1 = Reply.getChildByName('HeadIcon').getChildAt(0);
                Icon1.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
                Reply.y += 500;
                const Body = this._LabelVar(`Reply${index + 1}Body`);
                const Time = Reply.getChildByName('Time');
                if (index == 0) {
                    Body.text = `${twoObj[0]['name']}: `;
                    Time.text = `${LwgDate._date.month}月${LwgDate._date.date}日    ${LwgDate._date.hours}:${LwgDate._date.minutes - 1 > 0 ? 0 : LwgDate._date.minutes - 1}`;
                }
                else {
                    Time.text = `${LwgDate._date.month}月${LwgDate._date.date}日    ${LwgDate._date.hours}:${LwgDate._date.minutes}`;
                    Body.text = `${twoObj[1]['name']}: `;
                }
            }
            this._ImgVar('Head').scale(0, 0);
            this._ImgVar('Middle').scale(0, 0);
            this._ImgVar('Bottom').scale(0, 0);
        }
        lwgButton() {
            this._btnUp(this._ImgVar('Content'), () => {
                console.log('防止穿透！');
            }, 'null');
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'));
        }
        lwgOnDisable() {
        }
    }

    class Tweeting_GetFans extends LwgScene._SceneBase {
        constructor() {
            super(...arguments);
            this.fansNum = 0;
        }
        lwgOnAwake() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrank');
            this.pitchObj = _Ranking._Data._ins()._getPitchObj();
            this.fansNum = LwgTools._Number.randomOneInt(115, 383);
            this.pitchObj['fansNum'] += this.fansNum;
            this._FontClipVar('FansNum').value = this.fansNum.toString();
        }
        lwgOpenAni() {
            _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
                _GameEffects2D._interfacePointJet();
                !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                    this._evNotify(_Guide.Event.TweetingBtnDoubleFans, [this._ImgVar('BtnOk')._lwg.gPoint.x, this._ImgVar('BtnOk')._lwg.gPoint.y]);
                });
                LwgTimer._loop(2000, this, () => {
                    LwgAni2D.bomb_LeftRight(this._ImgVar('BtnDouble'), 1.1, 250);
                }, true);
            });
            return 300;
        }
        lwgButton() {
            var closeBefore = () => {
                _Ranking._whereFrom = _SceneName.Tweeting_GetFans;
                _Tweeting._photo.clear();
                this._closeScene(_SceneName.Tweeting_Dynamic);
                this._closeScene();
                !_Guide._complete.value && this._evNotify(_Guide.Event.closeGuide);
            };
            this._btnUp(this._ImgVar('BtnOk'), () => {
                closeBefore();
            });
            this._btnUp(this._ImgVar('BtnDouble'), () => {
                if (!_Guide._complete.value)
                    return;
                ADManager.TAPoint(TaT.BtnClick, 'ADrank');
                ADManager.ShowReward(() => {
                    this.pitchObj['fansNum'] += this.fansNum;
                    LwgDialogue._middleHint('太厉害了，涨粉翻倍了！');
                    closeBefore();
                });
            });
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
                this._openScene(_SceneName.Ranking, false);
            });
        }
        lwgOnDisable() {
        }
    }

    class AdsHint extends LwgScene._SceneBase {
        setCallBack(_adAction) {
            this.adAction = _adAction;
        }
        lwgOpenAni() {
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
            return 200;
        }
        lwgButton() {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            });
            this._btnUp(this._ImgVar('BtnConfirm'), () => {
                ADManager.ShowReward(this.adAction, null);
                this._closeScene();
            });
        }
        lwgCloseAni() {
            _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
            return 200;
        }
    }

    class _Item$3 extends LwgData._Item {
        $button() {
            this._btnUp(this._ImgChild('Reward'), (e) => {
                if (!_CheckIn._todayCheckIn.value) {
                    if (_CheckIn._checkInNum.value + 1 === this.$data.serial) {
                        _CheckIn._lastCheckDate.value = LwgDate._date.date;
                        console.log(_CheckIn._lastCheckDate.value, _CheckIn._todayCheckIn.value);
                        _CheckIn._Data._ins()._setCompleteName(this.$data.name);
                        _CheckIn._checkInNum.value++;
                        if (this.$data.rewardType.substr(0, 3) === 'diy') {
                            _DIYClothes._ins()._setCompleteByName(this.$data.rewardType);
                            LwgDialogue._middleHint('恭喜获得新的裁剪服装');
                            _GameEffects2D._oneFireworks(new Laya.Point(e.stageX, e.stageY));
                        }
                        else if (this.$data.rewardType === 'cat') {
                            _MakePattern._Pattern._ins()._setCompleteByClassify(this.$data.rewardType);
                            LwgDialogue._middleHint('恭喜获得猫咪贴图一套');
                            _GameEffects2D._oneFireworks(new Laya.Point(e.stageX, e.stageY));
                        }
                        if (!_Guide._complete.value) {
                            _Guide.CheckInCloseBtn = true;
                            this._evNotify(_Guide.Event.CheckInCloseBtn, [this._SceneImg('BtnClose')._lwg.gPoint.x, this._SceneImg('BtnClose')._lwg.gPoint.y]);
                        }
                    }
                }
                else {
                    LwgDialogue._middleHint('日期不对哦！');
                }
            });
            var func = (e) => {
                ADManager.ShowReward(() => {
                    _CheckIn._Data._ins()._setOtherCompleteName(this.$data.name);
                    if (this.$data.otherRewardType.substr(0, 3) === 'diy') {
                        _DIYClothes._ins()._setCompleteByName(this.$data.otherRewardType);
                        LwgDialogue._middleHint('恭喜获得新的裁剪服装');
                    }
                    else if (this.$data.otherRewardType === 'newYear') {
                        _MakePattern._Pattern._ins()._setCompleteByClassify(this.$data.otherRewardType);
                        LwgDialogue._middleHint('恭喜获得新年贴图一套');
                    }
                    _GameEffects2D._oneFireworks(new Laya.Point(e.stageX, e.stageY));
                });
            };
            var adsClick = (e) => {
                if (!this.$data.otherComplete) {
                    if (!_CheckIn._todayCheckIn.value) {
                        if (_CheckIn._checkInNum.value + 1 >= this.$data.serial) {
                            func(e);
                        }
                    }
                    else {
                        if (_CheckIn._checkInNum.value >= this.$data.serial) {
                            func(e);
                        }
                    }
                }
                else {
                    LwgDialogue._middleHint('日期不对哦！');
                }
            };
            this._btnUp(this._ImgChild('AdsReward'), adsClick);
            this._btnUp(this._ImgChild('BtnAdsReward'), adsClick);
        }
        $render() {
            this._LableChild('DayNum').text = this.$data.name;
            const Already = this._ImgChild('Reward').getChildByName('Already');
            const Icon = this._ImgChild('Reward').getChildByName('Icon');
            if (this.$data.rewardType.substr(0, 3) === 'diy') {
                Icon.skin = _DIYClothes._ins().getDIYCutIcon(this.$data.rewardType);
                Icon.scale(0.55, 0.55);
            }
            else if (this.$data.rewardType === 'cat') {
                Icon.skin = `Pattern/${this.$data.rewardType}1.png`;
                Icon.scale(0.18, 0.18);
            }
            Already.visible = this.$data.complete;
            if (!this.$data.complete) {
                if (_CheckIn._checkInNum.value + 1 === this.$data.serial) {
                    if (_CheckIn._todayCheckIn.value) {
                        this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei.png';
                    }
                    else {
                        this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei1.png';
                    }
                }
                else {
                    this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei.png';
                }
            }
            else {
                this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei.png';
            }
            const AdsAlready = this._ImgChild('AdsReward').getChildByName('Already');
            const AdsIcon = this._ImgChild('AdsReward').getChildByName('Icon');
            if (this.$data.otherRewardType.substr(0, 3) === 'diy') {
                AdsIcon.skin = _DIYClothes._ins().getDIYCutIcon(this.$data.otherRewardType);
                AdsIcon.scale(0.55, 0.55);
            }
            else if (this.$data.otherRewardType === 'newYear') {
                AdsIcon.skin = `Pattern/${this.$data.otherRewardType}1.png`;
                AdsIcon.scale(0.16, 0.16);
            }
            AdsAlready.visible = this.$data.otherComplete;
            if (!this.$data.otherComplete) {
                if (!_CheckIn._todayCheckIn.value) {
                    if (_CheckIn._checkInNum.value + 1 >= this.$data.serial) {
                        this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei1.png';
                        this._ImgChild('BtnAdsReward').gray = false;
                    }
                    else {
                        this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei.png';
                        this._ImgChild('BtnAdsReward').gray = true;
                    }
                }
                else {
                    if (_CheckIn._checkInNum.value >= this.$data.serial) {
                        this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei1.png';
                        this._ImgChild('BtnAdsReward').gray = false;
                    }
                    else {
                        this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei.png';
                        this._ImgChild('BtnAdsReward').gray = true;
                    }
                }
            }
            else {
                this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei.png';
                this._ImgChild('BtnAdsReward').visible = false;
            }
        }
    }
    class CheckIn extends LwgScene._SceneBase {
        lwgOnAwake() {
            _CheckIn._Data._ins()._List = this._ListVar('List');
            _CheckIn._Data._ins()._listRenderScript = _Item$3;
            _CheckIn._Data._ins()._List.scrollBar.touchScrollEnable = false;
            this._LabelVar('ImmediatelyNum').text = `(${_CheckIn._immediately.value} / 4)`;
            if (_CheckIn._immediately.value >= 4 || _CheckIn._checkInNum.value >= 4) {
                this._ImgVar('BtnImmediately').visible = false;
                this._LabelVar('Tip').text = `奖励已经全部领取！`;
            }
        }
        lwgOpenAni() {
            return _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                this._openScene(_SceneName.Guide, false, false, () => {
                    this.BtnCloseClick();
                    !_Guide._complete.value && this._evNotify(_Guide.Event.CheckInGetReward, [this._ImgVar('GuideTab1')._lwg.gPoint.x, this._ImgVar('GuideTab1')._lwg.gPoint.y]);
                });
            });
        }
        BtnCloseClick() {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                if (!_Guide._complete.value && _Guide.CheckInCloseBtn) {
                    _Guide._complete.value = true;
                    LwgDialogue._middleHint('开启你的女神之路吧!');
                    this._evNotify(_Guide.Event.closeGuide);
                    this._evNotify(_Guide.Event.StartOtherBtnClick);
                }
                this._closeScene();
            });
        }
        lwgButton() {
            if (!_Guide._complete.value)
                return;
            this.BtnCloseClick();
            this._btnUp(this._ImgVar('BtnImmediately'), () => {
                if (_CheckIn._immediately.value < 4) {
                    ADManager.ShowReward(() => {
                        _CheckIn._immediately.value++;
                        this._LabelVar('ImmediatelyNum').text = `(${_CheckIn._immediately.value} / 4)`;
                        if (_CheckIn._immediately.value >= 4) {
                            this._ImgVar('BtnImmediately').visible = false;
                            const gP1 = this._ImgVar('GuideTab1')._lwg.gPoint;
                            _CheckIn._Data._ins()._setAllCompleteDelay(300, (com) => {
                                const copyP1 = new Laya.Point(gP1.x, gP1.y);
                                if (!com) {
                                    _GameEffects2D._oneFireworks(copyP1);
                                }
                                gP1.x += 165;
                            }, null, null);
                            const gP2 = this._ImgVar('GuideTab2')._lwg.gPoint;
                            _CheckIn._Data._ins()._setAllOtherCompleteDelay(300, (com) => {
                                const copyP2 = new Laya.Point(gP2.x, gP2.y);
                                if (!com) {
                                    _GameEffects2D._oneFireworks(copyP2);
                                }
                                gP2.x += 165;
                            }, null, () => {
                                LwgDialogue._middleHint('奖励已经全部获得，快去制作服装吧！');
                            });
                            _DIYClothes._ins()._setCompleteByNameArr(['diy_dress_003_final', 'diy_dress_007_final', 'diy_top_004_final', 'diy_bottom_005_final', 'diy_dress_006_final', 'diy_bottom_006_final']);
                            _MakePattern._Pattern._ins()._setCompleteByClassify('cat');
                            _MakePattern._Pattern._ins()._setCompleteByClassify('newYear');
                        }
                    });
                }
                else {
                    LwgDialogue._middleHint('奖励已经全部获得，无需在看广告o.o！');
                }
            });
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
        }
    }

    class Share extends LwgScene._SceneBase {
        lwgOnAwake() {
            LwgClick._filter.value = LwgClick._filterType.button;
            if (_Share._whereFrom === _SceneName.MakePattern) {
                this._SpriteVar('Photo').texture = _Tweeting._photo.arr[0];
            }
            else if (_Share._whereFrom === _SceneName.DressingRoom) {
                this._SpriteVar('Photo').texture = _Tweeting._photo.arr[3];
            }
        }
        lwgOpenAni() {
            this._ImgVar('BtnShare').visible = false;
            return _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                this._ImgVar('BtnShare').visible = true;
                _GameAni._dialogOpenPopup(this._ImgVar('BtnShare'));
            });
        }
        closeFunc() {
            if (_Share._whereFrom === _SceneName.MakePattern) {
                this._evNotify(_MakePattern.Event.byteDanceBackStart);
            }
            else if (_Share._whereFrom === _SceneName.DressingRoom) {
                this._evNotify(_DressingRoom.Event.byteDanceBackStart);
            }
        }
        lwgButton() {
            var func = () => {
                RecordManager._share('noAward', () => {
                    this._closeScene();
                });
            };
            this._btnUp(this._ImgVar('BtnShare'), () => {
                func();
            });
            this._btnUp(this._ImgVar('BtnBoard'), () => {
                func();
            }, 'null');
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            });
        }
        lwgCloseAni() {
            return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                this.closeFunc();
                LwgClick._filter.value = LwgClick._filterType.all;
            });
        }
    }

    class BackHint extends LwgScene._SceneBase {
        constructor() {
            super(...arguments);
            this.closeAniType = null;
        }
        lwgOpenAni() {
            return _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
        }
        lwgButton() {
            this._btnUp(this._ImgVar('BtnLeave'), () => {
                _PreLoadCutIn._fromBack = true;
                _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                    this._Owner.close();
                    _BackHint._whereScene[_BackHint._whereScene.name]._openScene(_SceneName.Start, true, true);
                });
            });
            var close = () => {
                this.closeAniType = 100;
                _BackHint._3dToSp && _BackHint._3dToSp.destroy();
                _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                    this._Owner.close();
                });
            };
            this._btnUp(this._ImgVar('BtnContinue'), () => {
                close();
            });
            this._btnUp(this._ImgVar('BtnClose'), () => {
                close();
            });
        }
        lwgCloseAni() {
            return this.closeAniType;
        }
    }

    class LwgInit extends LwgAdmin._InitScene {
        lwgOnAwake() {
            LwgPlatform._Ues.value = LwgPlatform._Tpye.Bytedance;
            Laya.MouseManager.multiTouchEnabled = false;
            LwgSceneAni._closeSwitch.value = true;
            LwgSceneAni._Use.value = {
                class: LwgSceneAni._shutters.Close,
                type: LwgSceneAni._shutters.Close._type.randomCroAndVer,
            };
            LwgClick._Use.value = LwgClick._Type.reduce;
            LwgAdaptive._Use.value = [1280, 720];
            LwgScene._SceneScript = {
                PreLoad: PreLoad,
                PreLoadCutIn: PreLoadCutIn,
                Guide: Guide,
                Start: Start,
                MakeTailor: MakeTailor,
                MakePattern: MakePattern,
                DressingRoom: DressingRoom,
                PersonalInfo: PersonalInfo,
                Ranking: Ranking,
                BackHint: BackHint,
                Tweeting_Main: Tweeting_Main,
                Tweeting_ChoosePhotos: Tweeting_ChoosePhotos,
                Tweeting_Dynamic: Tweeting_Dynamic,
                Tweeting_GetFans: Tweeting_GetFans,
                AdsHint: AdsHint,
                CheckIn: CheckIn,
                Share: Share,
            };
        }
        lwgOnStart() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                let subPkg = new SubPkg();
                subPkg.init();
                this._Owner.close();
            }
            else {
                this._openScene('PreLoad');
            }
        }
    }

    class P402 extends Behaviour {
        constructor() {
            super(...arguments);
            this.scroll = null;
            this.layout = null;
            this.mouseDown = false;
            this.lastStageX = 0;
            this.lastStageY = 0;
            this.targetX = 0;
            this.cd = 0;
        }
        get node() {
            return this.owner;
        }
        async OnAwake() {
            this.shield = TJ.Develop.Yun.Location.shield;
            this.scroll = this.owner.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            TJ.Develop.Yun.Promo.Data.ReportAwake(P402.style);
            this.layoutS = this.layout.addComponent(P402Layout);
            this.active = false;
            let list = await TJ.Develop.Yun.Promo.List.Get();
            if (list != null && list.count > 0) {
                if (this.layoutS != null) {
                    if (this.shield) {
                        for (let i = 0; i < Math.min(list.count, 9); i++) {
                            this.layoutS.datas.push(list.Load());
                        }
                    }
                    else {
                        for (let i = 0; i < list.count; i++) {
                            this.layoutS.datas.push(list.Load());
                        }
                    }
                    this.layoutS.Init(this.scroll.width, this.scroll.height, this.shield);
                    this.active = true;
                    TJ.Develop.Yun.Promo.Data.ReportStart(P402.style);
                    this.targetX = this.layout.x;
                }
                else {
                }
            }
            else {
            }
        }
        async OnDisable() {
            if (!this.shield)
                return;
            let list = await TJ.Develop.Yun.Promo.List.Get();
            if (list != null && list.count > 0) {
                this.layoutS.datas = [];
                for (let i = 0; i < Math.min(list.count, 9); i++) {
                    this.layoutS.datas.push(list.Load());
                }
                this.layoutS.Redata();
            }
        }
        OnStart() {
            if (this.shield)
                return;
            let checkPos = () => {
                let d = this.layout.x - this.targetX;
                if (d > 0 && d > this.layoutS.pageSpace / 2) {
                    this.targetX += this.layoutS.pageSpace;
                }
                else if (d < 0 && d < -this.layoutS.pageSpace / 2) {
                    this.targetX -= this.layoutS.pageSpace;
                }
            };
            this.scroll.on(Laya.Event.MOUSE_DOWN, null, (event) => {
                this.mouseDown = true;
                this.lastStageX = event.stageX;
                this.lastStageY = event.stageY;
            });
            this.scroll.on(Laya.Event.MOUSE_OUT, null, (event) => {
                this.mouseDown = false;
                checkPos();
            });
            this.scroll.on(Laya.Event.MOUSE_UP, null, (event) => {
                this.mouseDown = false;
                checkPos();
            });
            this.scroll.on(Laya.Event.MOUSE_MOVE, null, (event) => {
                if (this.mouseDown) {
                    let dx = event.stageX - this.lastStageX;
                    let dy = event.stageY - this.lastStageY;
                    this.lastStageX = event.stageX;
                    this.lastStageY = event.stageY;
                    let tx = this.layoutS.node.x + dx;
                    this.layoutS.node.x = tx;
                }
            });
        }
        OnUpdate() {
            if (this.shield)
                return;
            if (this.mouseDown) {
                this.cd = 0;
            }
            else {
                let dt = Laya.timer.delta / 1000;
                this.cd += dt;
                if (this.cd >= 3) {
                    this.cd -= 3;
                    this.targetX -= this.layoutS.pageSpace;
                }
                if (this.layout.x != this.targetX) {
                    let d = this.targetX - this.layout.x;
                    let s = 20;
                    if (d > 0) {
                        d = Math.min(this.layout.x + s, this.targetX);
                    }
                    else {
                        d = Math.max(this.layout.x - s, this.targetX);
                    }
                    this.layout.x = d;
                }
            }
            this.layoutS.Repos(this.layout.x);
        }
    }
    P402.style = "P402";
    class P402Layout extends Behaviour {
        constructor() {
            super(...arguments);
            this.datas = [];
            this.items = [];
            this.prefab = null;
            this.line = 0;
            this.column = 0;
            this.spacingX = 15;
            this.spacingY = 15;
            this.pageSpace = 0;
        }
        get node() {
            return this.owner;
        }
        OnAwake() {
            this.prefab = this.node.getChildAt(0);
            this.prefab.active = this.prefab.visible = false;
        }
        Init(width, height, shield) {
            this.node.x = this.prefab.width / 2;
            while (width >= this.prefab.width) {
                width = width - this.prefab.width - this.spacingX;
                this.column++;
            }
            while (height >= this.prefab.height) {
                height = height - this.prefab.height - this.spacingY;
                this.line++;
            }
            this.pageSpace = (this.prefab.width + this.spacingX) * this.column;
            if (shield) {
                let uw = this.prefab.width;
                let uh = this.prefab.height;
                let spaceX = uw + this.spacingX;
                let spaceY = uh + this.spacingY;
                for (let y = 0; y < this.line; y++) {
                    for (let x = 0; x < this.column; x++) {
                        if (this.items.length < this.datas.length) {
                            let item = GO.Instantiate(this.prefab).getComponent(PromoItem);
                            this.node.addChild(item.owner);
                            item.owner.active = item.owner.visible = true;
                            this.items.push(item);
                            item.owner.x = x * spaceX;
                            item.owner.y = spaceY * y + uh / 2;
                            item.onAwake();
                        }
                    }
                }
                this.Redata();
            }
            else {
                this.datas.sort((a, b) => b.weight - a.weight);
                this.column += 2;
                for (let x = 0; x < this.column; x++) {
                    for (let y = 0; y < this.line; y++) {
                        let item = GO.Instantiate(this.prefab).getComponent(PromoItem);
                        this.node.addChild(item.owner);
                        item.owner.active = item.owner.visible = true;
                        this.items.push(item);
                        item.onAwake();
                    }
                }
            }
        }
        Redata() {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                item.data = this.datas[i];
                item.data.Load();
                item.DoLoad();
            }
        }
        Repos(posX) {
            let ic = this.items.length;
            let dc = this.datas.length;
            if (ic < 1)
                return;
            if (dc < 1)
                return;
            let uw = this.prefab.width;
            let uh = this.prefab.height;
            let spaceX = uw + this.spacingX;
            let spaceY = uh + this.spacingY;
            let k = -posX / spaceX;
            k = Math.floor(k);
            let k1 = Math.floor(k / this.column) * this.column, k2 = k < 0 ? (this.column + k % this.column) % this.column : (k % this.column);
            let checkPos = (item, b, l, c) => {
                let pid = (b + c) * this.line + l;
                if (item.posId != pid) {
                    item.posId = pid;
                    item.owner.x = (b + c) * spaceX;
                    item.owner.y = spaceY * l + uh / 2;
                    let did = pid < 0 ? (dc + pid % dc) % dc : (pid % dc);
                    if (item.dataId != did) {
                        item.dataId = did;
                        item.data = this.datas[did];
                        item.data.Load();
                        item.DoLoad();
                    }
                }
            };
            for (let c = 0; c < k2; c++) {
                for (let l = 0; l < this.line; l++) {
                    checkPos(this.items[c * this.line + l], k1 + this.column, l, c);
                }
            }
            for (let c = k2; c < this.column; c++) {
                for (let l = 0; l < this.line; l++) {
                    checkPos(this.items[c * this.line + l], k1, l, c);
                }
            }
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("TJ/NativeAd.ts", NativeAd);
            reg("TJ/Promo/script/ButtonScale.ts", ButtonScale);
            reg("TJ/Promo/script/PromoItem.ts", PromoItem);
            reg("TJ/Promo/script/P405.ts", P405);
            reg("TJ/Promo/script/P201.ts", P201);
            reg("script/Lwg/LwgInit.ts", LwgInit);
            reg("TJ/Promo/script/P402.ts", P402);
        }
    }
    GameConfig.width = 1280;
    GameConfig.height = 720;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Scene/LwgInit.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
