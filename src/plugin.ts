import { DefaultRWSPluginOptionsType, RWSPlugin, ConfigService, ConfigServiceInstance, RWSContainer } from '@rws-framework/client';
import { RouterComponent } from './components/router/component';
import RoutingService, { 
    RoutingServiceInstance, 
    renderRouteComponent, 
    _ROUTING_EVENT_NAME,
    IFrontRoutes,
    IRWSRouteResult,
    RouteReturn,
    IRoutingEvent 
} from './services/RoutingService';
import { RWSRouter } from './routing/_router';

interface BrowserRouterOpts extends DefaultRWSPluginOptionsType{
    
}

class RWSBrowserRouter extends RWSPlugin<BrowserRouterOpts> {
    constructor(options: BrowserRouterOpts = { enabled: false }){
        super(options);
        RoutingService;
    }
    
    addRoutes(routes: IFrontRoutes) {
        const config: ConfigServiceInstance = RWSContainer().get(ConfigService)
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
    _ROUTING_EVENT_NAME
};

export type {
    IFrontRoutes,
    IRWSRouteResult,
    RouteReturn,
    IRoutingEvent
} from './types/router.types';