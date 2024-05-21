import { DefaultRWSPluginOptionsType, RWSPlugin, ConfigService, ConfigServiceInstance } from '@rws-framework/client';
import { RouterComponent } from './components/router/component';
import RoutingService, { RoutingServiceInstance, IFrontRoutes, RWSRouter, IRWSRouteResult, renderRouteComponent, RouteReturn, _ROUTING_EVENT_NAME, IRoutingEvent } from './services/RoutingService';

interface BrowserRouterOpts extends DefaultRWSPluginOptionsType{
    
}

class RWSBrowserRouter extends RWSPlugin<BrowserRouterOpts> {
    constructor(options: BrowserRouterOpts = { enabled: false }){
        super(options);
        RoutingService;
    }
    
    addRoutes(routes: IFrontRoutes) {
        const config: ConfigServiceInstance = this.container.get(ConfigService)
        config.set('routes', routes);
    }
}

export { 
    RWSBrowserRouter, 
    BrowserRouterOpts,

    RoutingService, 
    RoutingServiceInstance, 
    RouterComponent, 
    RWSRouter,    

    renderRouteComponent,

    IFrontRoutes, 
    IRWSRouteResult,
    RouteReturn,
    _ROUTING_EVENT_NAME, 
    IRoutingEvent 
};