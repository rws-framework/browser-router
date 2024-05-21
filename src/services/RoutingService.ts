
import TheService from '@rws-framework/client/src/services/_service';
import Router from 'url-router';
import { RWSRouter, IRWSRouteResult, RouteReturn } from '../routing/_router';
import UtilsService, {UtilsServiceInstance} from '@rws-framework/client/src/services/UtilsService';
import { IRWSViewComponent } from '@rws-framework/client/src/interfaces/IRWSViewComponent';
import ConfigService, { ConfigServiceInstance } from '@rws-framework/client/src/services/ConfigService';

type IFrontRoutes = Record<string, unknown>; 

class RoutingService extends TheService {
    static _DEFAULT: boolean = true;
    private router: Router<any>;
    private routes: IFrontRoutes;

    constructor(@UtilsService private utilsService: UtilsServiceInstance, @ConfigService private config: ConfigServiceInstance){
        super();        
    }

    public apply(comp: IRWSViewComponent): RWSRouter
    {                    
        this.routes = this.config.get('routes');
        this.router = new Router(this.routes);
   
        return new RWSRouter(comp, this.router, this.utilsService);
    }

    public routeHandler = <T>(comp:  T) => () => {
        return comp;
    };  

    public getRoutes(): IFrontRoutes
    {
        return this.routes;
    }
}

const renderRouteComponent = <T>(routeName: string, cmp: T, defaultRouteParams: any = {}) => (): [string, T, any] => [routeName, cmp, defaultRouteParams];

const _ROUTING_EVENT_NAME = 'routing.route.change';
interface IRoutingEvent {
  routeName: string,
  component: IRWSViewComponent
}

export default RoutingService.getSingleton();
export { RoutingService as RoutingServiceInstance, IFrontRoutes, RWSRouter, IRWSRouteResult, renderRouteComponent, RouteReturn, _ROUTING_EVENT_NAME, IRoutingEvent};