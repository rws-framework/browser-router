import TheService from '@rws-framework/client/src/services/_service';
import Router from 'url-router';
import { RWSRouter } from '../routing/_router';
import UtilsService, { UtilsServiceInstance } from '@rws-framework/client/src/services/UtilsService';
import { IRWSViewComponent } from '@rws-framework/client/src/types/IRWSViewComponent';
import ConfigService, { ConfigServiceInstance } from '@rws-framework/client/src/services/ConfigService';
import { IFrontRoutes } from '../types/router.types';
import { BrowserRouterOpts } from '../plugin';

export const REGEX_MATCH_PARAM = /\/:([a-zA-Z0-9]*)\/?/;

class RoutingService extends TheService {
    static _DEFAULT: boolean = true;
    private router: Router<any>;
    private routes: IFrontRoutes;

    constructor(@UtilsService private utilsService: UtilsServiceInstance, @ConfigService private config: ConfigServiceInstance) {
        super();
    }

    public apply(comp: IRWSViewComponent, routerOpts?: BrowserRouterOpts): RWSRouter {
        this.routes = this.config.get('routes');
        this.router = new Router(this.routes);

        return new RWSRouter(comp, this.router, this.utilsService, routerOpts);
    }

    compareMatchingPath(compareUrl: string, routePath: string): boolean {
        let routeParams: { [key: string]: string[] } = {};        

        if(compareUrl === routePath) {
            return true;
        }

        const match = routePath.match(REGEX_MATCH_PARAM);
        
        if (match) {
            if (!routeParams[routePath]) {
                routeParams[routePath] = [match[1]];
            } else {
                routeParams[routePath].push(match[1]);
            }
        }else{
            return false;
        }

        for (const path in routeParams) {
            const params = routeParams[path];

            let regexStr = path;

            for (const param of params) {
                regexStr = path.replace(':' + param, '([a-zA-Z0-9-]+)')
                const regex = new RegExp(`^${regexStr}$`);

                if (regex.test(compareUrl)) {
                    return true;
                }
            };
        }

        return false;
    }

    public routeHandler = <T>(comp: T) => () => {
        return comp;
    };

    public getRoutes(): IFrontRoutes {
        return this.routes;
    }
}

const renderRouteComponent = <T>(routeName: string, cmp: T, defaultRouteParams: any = {}) => (): [string, T, any] => [routeName, cmp, defaultRouteParams];

const _ROUTING_EVENT_NAME = 'routing.route.change';

export default RoutingService.getSingleton();
export {
    RoutingService as RoutingServiceInstance,
    RWSRouter,
    renderRouteComponent,
    _ROUTING_EVENT_NAME,
};


export type {
    IFrontRoutes,
    IRWSRouteResult,
    RouteReturn,
    IRoutingEvent
} from '../types/router.types';