import { attr, observable  } from '@microsoft/fast-element';
import RoutingService, { RWSRouter, _ROUTING_EVENT_NAME, RouteReturn, RoutingServiceInstance } from '../../services/RoutingService';

import RWSViewComponent, { IRWSViewComponent } from '@rws-framework/client/src/components/_component';
import {RWSInject, RWSView} from '@rws-framework/client/src/components/_decorator';

/**
 * Generic props to forward to every routed component. Keys are property
 * names on the routed component; values are the values to assign.
 *
 * This is the dynamic injection mechanism — bundles like the gate can pass
 * any context (phoneNumbers, apiKey, etc.) without the router needing to
 * know about it ahead of time.
 *
 * `injectProps` is a normal `@observable` object so it can be bound directly
 * from a template without JSON stringification. Example:
 *
 *   <rws-router
 *       :injectProps="${ x => ({ phoneNumbers: x.phoneNumbersList }) }"
 *   />
 */
@RWSView('rws-router', { ignorePackaging: true})
export class RouterComponent extends RWSViewComponent {
    static autoLoadFastElement = false;
    private routing: RWSRouter;
    private currentComponent: HTMLElement;

    @attr({mode: 'boolean'}) disableHistory: boolean = false;

    /**
     * Plain object of props to forward to every routed component.
     * Merged on top of any plugin-level `injectProps` defaults.
     */
    @observable injectProps: Record<string, unknown> = {};

    @observable currentUrl: string;
    @observable childComponents: HTMLElement[] = [];
    slotEl: HTMLElement = null;

    constructor(@RWSInject(RoutingService) protected routingService: RoutingServiceInstance){
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.routing = this.routingService.apply(this);

        if(this.currentUrl){
            this.handleRoute(this.routing.handleRoute(this.currentUrl));
        }
    }

    currentUrlChanged(oldValue: string, newValue: string){
        if(newValue){
            if(!this.routingService){
                return;
            }

            if(!this.routing){
                this.routing = this.routingService.apply(this);

            }
            this.handleRoute(this.routing.handleRoute(newValue));
        }
    }

    private handleRoute(route: RouteReturn){
        if(route === null){
            return;
        }

        const [routeName, childComponent, routeParams] = route;

        this.$emit(_ROUTING_EVENT_NAME, {
            routeName,
            component: childComponent
        });

        const newComponent = document.createElement((childComponent as any).definition.name);
        if(Object.keys(routeParams).length){
            newComponent.routeParams = routeParams;
        }

        // Forward injectProps to the rendered component. Plugin-level defaults
        // are merged first, then per-instance injectProps override them.
        // This is the dynamic injection mechanism — the router doesn't need to
        // know which props exist; it just forwards whatever was configured.
        const pluginDefaults = (this.routing && (this.routing as any).routerOpts && (this.routing as any).routerOpts.injectProps) || {};
        const instanceProps = (this.injectProps && typeof this.injectProps === 'object' && !Array.isArray(this.injectProps))
            ? this.injectProps
            : {};
        const mergedProps = { ...pluginDefaults, ...instanceProps };

        for (const [key, value] of Object.entries(mergedProps)) {
            // Skip undefined / null values to avoid clobbering component defaults.
            if (value === undefined || value === null) continue;
            (newComponent as any)[key] = value;
        }

        if(this.currentComponent){
            this.getShadowRoot().removeChild(this.currentComponent);

        }

        this.currentComponent = newComponent;

        this.getShadowRoot().appendChild(newComponent);
    }

    addComponent(component: any) {

        this.slotEl = component;
    }
}

RouterComponent.defineComponent();
