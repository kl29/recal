define(["require", "exports", '../../../library/DataStructures/Dictionary'], function(require, exports, Dictionary) {
    /**
    * The class responsible to actually storing the events locally.
    * TODO also responsible for editing?
    */
    var EventsStoreCoordinator = (function () {
        function EventsStoreCoordinator() {
            this._eventsRegistry = null;
            this._eventIdsSorted = null;
            this.clearLocalEvents();
        }
        Object.defineProperty(EventsStoreCoordinator.prototype, "eventsRegistry", {
            get: function () {
                return this._eventsRegistry;
            },
            set: function (value) {
                this._eventsRegistry = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsStoreCoordinator.prototype, "eventIdsSorted", {
            get: function () {
                var _this = this;
                if (this._eventIdsSorted === null || this._eventIdsSorted === undefined) {
                    this._eventIdsSorted = this.eventsRegistry.allKeys();
                    this._eventIdsSorted.sort(function (a, b) {
                        var eventA = _this.eventsRegistry.get(a);
                        var eventB = _this.eventsRegistry.get(b);
                        return eventA.startDate.unix - eventB.startDate.unix;
                    });
                }
                return this._eventIdsSorted;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add the specified events to the events store. If an existing event with
        * the same id exists, this replaces it.
        */
        EventsStoreCoordinator.prototype.addLocalEvents = function (eventsModels) {
            for (var i = 0; i < eventsModels.length; ++i) {
                this.eventsRegistry.set(eventsModels[i].eventId, eventsModels[i]);
            }
        };

        /**
        * Delete any events in the specified list of IDs. This function can safely
        * be called with event IDs that do not exist.
        */
        EventsStoreCoordinator.prototype.clearLocalEventsWithIds = function (eventIds) {
            for (var i = 0; i < eventIds.length; ++i) {
                if (this.eventsRegistry.contains(eventIds[i])) {
                    this.eventsRegistry.unset(eventIds[i]);
                }
            }
        };

        /**
        * Clear out the local event store.
        */
        EventsStoreCoordinator.prototype.clearLocalEvents = function () {
            this.eventsRegistry = new Dictionary();
            this._eventIdsSorted = null;
        };

        /**
        * Get event associated with the ID
        */
        EventsStoreCoordinator.prototype.getEventById = function (eventId) {
            return this.eventsRegistry.get(eventId);
        };

        EventsStoreCoordinator.prototype.getEventIdsWithFilter = function (filter) {
            var ret = new Array();
            for (var i = 0; i < this.eventIdsSorted.length; ++i) {
                var result = filter(this.eventIdsSorted[i]);
                if (result.keep) {
                    ret.push(this.eventIdsSorted[i]);
                }
                if (result.stop) {
                    break;
                }
            }
            return ret;
        };
        return EventsStoreCoordinator;
    })();

    
    return EventsStoreCoordinator;
});
