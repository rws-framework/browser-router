import { DefaultRWSPluginOptionsType, RWSPlugin, ConfigService, ConfigServiceInstance, RWSContainer } from '@rws-framework/client';
import { RouterComponent } from './components/router/component';
import RoutingService, { 
    RoutingServiceInstance, 
    renderRouteComponent, 
    _ROUTING_EVENT_NAME,
    IFrontRoutes,
    REGEX_MATCH_PARAM,  
} from './services/RoutingService';
import { RWSRouter } from './routing/_router';

interface BrowserRouterOpts extends DefaultRWSPluginOptionsType{
    disableHistory?: boolean;
}

class RWSBrowserRouter extends RWSPlugin<BrowserRouterOpts> {
    private routingService: RoutingServiceInstance;
    constructor(options: BrowserRouterOpts = { enabled: false }){
        super(options);
        this.routingService = RWSContainer().get<RoutingServiceInstance>(RoutingService);
    }
    
    addRoutes(routes: IFrontRoutes) {
        const config: ConfigServiceInstance = RWSContainer().get(ConfigService)
        config.set('routes', routes);
    }

    getRouterService(): RoutingServiceInstance
    {
        return this.routingService;
    }
}

export { 
    RWSBrowserRouter, 
    BrowserRouterOpts,

    RoutingService, 
    RoutingServiceInstance, 
    RouterComponent, 
    RWSRouter,    
    REGEX_MATCH_PARAM,
    renderRouteComponent,
    _ROUTING_EVENT_NAME
};

export type {
    IFrontRoutes,
    IRWSRouteResult,
    RouteReturn,
    IRoutingEvent
} from './types/router.types';