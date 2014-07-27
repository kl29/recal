/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../DataStructures/Dictionary', '../Core/IndexPath', '../Core/InvalidActionException', '../DataStructures/Set', './TableViewCommon', '../CoreUI/View'], function(require, exports, $, BrowserEvents, Dictionary, IndexPath, InvalidActionException, Set, TableViewCommon, View) {
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView($element) {
            var _this = this;
            _super.call(this, $element);
            this._cellDict = new Dictionary();
            this._dataSource = null;
            this._delegate = null;
            this._busy = false;
            this.attachEventHandler(BrowserEvents.click, TableViewCommon.cellAllDescendentsSelector, function (ev) {
                var cell = TableViewCommon.findCellFromChild($(ev.target));

                // TODO(naphatkrit) find a way to make sure that cell is not a header cell
                if (cell === null) {
                    return;
                }
                ev.stopPropagation();

                // TODO(naphatkrit) handle single selection. multiple selection supported by default
                if (cell.selected) {
                    _this.deselectCell(cell);
                    if (_this.delegate !== null) {
                        _this.delegate.didDeselectCell(cell);
                    }
                } else {
                    _this.selectCell(cell);
                    if (_this.delegate !== null) {
                        _this.delegate.didSelectCell(cell);
                    }
                }
            });
        }
        Object.defineProperty(TableView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            set: function (value) {
                if (value != this._dataSource) {
                    this._dataSource = value;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TableView.prototype, "delegate", {
            get: function () {
                return this._delegate;
            },
            set: function (value) {
                this._delegate = value;
            },
            enumerable: true,
            configurable: true
        });

        TableView.prototype.refresh = function () {
            var _this = this;
            if (this.dataSource === null) {
                return;
            }
            if (this._busy) {
                return;
            }
            this._busy = true;

            // delete old cells
            var toBeDeleted = new Set(this._cellDict.allKeys());
            for (var section = 0; section < this.dataSource.numberOfSections(); section++) {
                toBeDeleted.remove(new IndexPath(section, -1));
                for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++) {
                    toBeDeleted.remove(new IndexPath(section, item));
                }
            }
            $.each(toBeDeleted.toArray(), function (index, indexPath) {
                var cell = _this._cellDict.unset(indexPath);
                cell.removeFromParent();
                // TODO recycle cell
            });

            // render cells on screen
            var prevCell = null;
            for (var section = 0; section < this.dataSource.numberOfSections(); section++) {
                var headerCell = this._getOrCreateHeaderCellForSection(section);
                if (headerCell !== null) {
                    headerCell = this.dataSource.decorateHeaderCell(headerCell);
                    if (headerCell.parentView === null) {
                        if (prevCell !== null) {
                            headerCell.insertAfter(prevCell);
                        } else {
                            this.append(headerCell);
                        }
                    }
                    prevCell = headerCell;
                }

                for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++) {
                    var indexPath = new IndexPath(section, item);
                    var cell = this._getOrCreateCellForIndexPath(indexPath);
                    cell = this.dataSource.decorateCell(cell);
                    if (cell.parentView === null) {
                        if (prevCell !== null) {
                            cell.insertAfter(prevCell);
                        } else {
                            this.append(cell);
                        }
                    }
                    prevCell = cell;
                }
            }
            this._busy = false;
        };

        /**
        * Does not append to table view
        */
        TableView.prototype._getOrCreateCellForIndexPath = function (indexPath) {
            var cell = this._cellDict.get(indexPath);
            if (cell !== null && cell !== undefined) {
                return cell;
            }
            var identifier = this.dataSource.identifierForCellAtIndexPath(indexPath);
            cell = this.dataSource.createCell(identifier);
            cell.indexPath = indexPath;
            this._cellDict.set(indexPath, cell);

            return cell;
        };

        /**
        * Does not append to table view
        */
        TableView.prototype._getOrCreateHeaderCellForSection = function (section) {
            var indexPath = new IndexPath(section, -1);
            var cell = this._cellDict.get(indexPath);
            if (cell !== null && cell !== undefined) {
                return cell;
            }
            var identifier = this.dataSource.identifierForHeaderCellAtIndexPath(indexPath);
            cell = this.dataSource.createHeaderCell(identifier);
            if (cell === null || cell === undefined) {
                return null;
            }
            cell.indexPath = indexPath;
            this._cellDict.set(indexPath, cell);

            return cell;
        };

        TableView.prototype.cellForIndexPath = function (indexPath) {
            return this._cellDict.get(indexPath);
        };

        TableView.prototype.selectCellAtIndexPath = function (indexPath) {
            var cell = this._cellDict.get(indexPath);
            if (cell === null) {
                throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
            }
            this.selectCell(cell);
        };

        TableView.prototype.selectCell = function (cell) {
            cell.selected = true;
        };

        TableView.prototype.deselectCellAtIndexPath = function (indexPath) {
            var cell = this._cellDict.get(indexPath);
            if (cell === null) {
                throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
            }
            this.deselectCell(cell);
        };

        TableView.prototype.deselectCell = function (cell) {
            cell.selected = false;
        };
        return TableView;
    })(View);

    
    return TableView;
});
