class IconMarkupExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        this._icons = options.icons || [];
    }

    load() {
        const updateIconsCallback = () => {
            if (this._enabled) {
                this.updateIcons();
            }
        };
        this.viewer.addEventListener(
            Autodesk.Viewing.CAMERA_CHANGE_EVENT,
            updateIconsCallback
        );
        this.viewer.addEventListener(
            Autodesk.Viewing.ISOLATE_EVENT,
            updateIconsCallback
        );
        this.viewer.addEventListener(
            Autodesk.Viewing.HIDE_EVENT,
            updateIconsCallback
        );
        this.viewer.addEventListener(
            Autodesk.Viewing.SHOW_EVENT,
            updateIconsCallback
        );
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }

        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl("customExtensions");
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup("customExtensions");
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button("IconExtension");
        this._button.onClick = (ev) => {
            // console.log(ev);
            this._enabled = !this._enabled;
            this.showIcons(this._enabled);
            this._button.setState(this._enabled ? 0 : 1);
        };
        this._button.setToolTip(this.options.button.tooltip);
        this._button.container.children[0].classList.add(
            "fas",
            this.options.button.icon
        );
        this._group.addControl(this._button);
    }

    showIcons(show) {
        const $viewer = $(
            "#" + this.viewer.clientContainer.id + " div.adsk-viewing-viewer"
        );

        // remove previous...
        $(
            "#" +
            this.viewer.clientContainer.id +
            " div.adsk-viewing-viewer label.markup"
        ).remove();
        if (!show) return;

        // do we have anything to show?
        if (this._icons === undefined || this.icons === null) return;

        // do we have access to the instance tree?
        const tree = this.viewer.model.getInstanceTree();
        if (tree === undefined) {
            console.log("Loading tree...");
            return;
        }

        const onClick = (e) => {
            if (this.options.onClick)
                this.options.onClick($(e.currentTarget).data("id"));
        };

        this._frags = {};
        for (var i = 0; i < this._icons.length; i++) {
            // we need to collect all the fragIds for a given dbId
            const icon = this._icons[i];
            this._frags["dbId" + icon.dbId] = [];

            // create the label for the dbId
            const $label = $(`
              <label class="markup update" data-id="${icon.dbId}">
                  <span class="${icon.css}"> ${icon.label || ""}</span>
              </label>
              `);
            $label.css(
                "display",
                this.viewer.isNodeVisible(icon.dbId) ? "block" : "none"
            );
            // console.log($label);
            $label.on("click", onClick);
            $viewer.append($label);
            // console.log($viewer);

            // now collect the fragIds
            const _this = this;
            tree.enumNodeFragments(icon.dbId, function(fragId) {
                _this._frags["dbId" + icon.dbId].push(fragId);
                _this.updateIcons(); // re-position of each fragId found
            });
            // console.log("done");
        }
    }

    getModifiedWorldBoundingBox(dbId) {
        var fragList = this.viewer.model.getFragmentList();
        const nodebBox = new THREE.Box3();

        // for each fragId on the list, get the bounding box
        for (const fragId of this._frags["dbId" + dbId]) {
            const fragbBox = new THREE.Box3();
            fragList.getWorldBounds(fragId, fragbBox);
            nodebBox.union(fragbBox); // create a unifed bounding box
        }

        return nodebBox;
    }

    updateIcons() {
        for (const label of $(
                "#" + this.viewer.clientContainer.id + " div.adsk-viewing-viewer .update"
            )) {
            const $label = $(label);
            const id = $label.data("id");

            // get the center of the dbId (based on its fragIds bounding boxes)
            const pos = this.viewer.worldToClient(
                this.getModifiedWorldBoundingBox(id).center()
            );

            // position the label center to it
            $label.css("left", Math.floor(pos.x - $label[0].offsetWidth / 2) + "px");
            $label.css("top", Math.floor(pos.y - $label[0].offsetHeight / 2) + "px");
            $label.css("background", "red");
            $label.css("position", "absolute");
            $label.css("z-index", 1234567);
            $label.css("display", this.viewer.isNodeVisible(id) ? "block" : "none");
        }
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
    "IconMarkupExtension",
    IconMarkupExtension
);