# Backbone Utilities (WIP)
Some generic Backbone utilities to ease development a bit.

# Layout
A layout displays several views, for example, a menu view, and a content view
could be inside a layout.

The layout acts as a **mediator** between all it's views, so they can subscribe
and publish events between each other.

    // Inside a view...
    this.layout.on('some-event', this.doSomething);

    // Inside ANOTHER view
    this.layout.trigger('some-event', param1, param2);

# LayoutManager (TODO)
Handles different layouts and is able to nicely swap between layouts.
