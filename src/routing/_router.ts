import Router from 'url-router';
import { UtilsServiceInstance } from '@rws-framework/client/src/services/UtilsService';
import { IRWSViewComponent } from '@rws-framework/client/src/types/IRWSViewComponent';
import { IRWSRouteResult, RouteReturn } from '../types/router.types';
import { BrowserRouterOpts } from '../plugin';

class RWSRouter {
    private baseComponent: IRWSViewComponent;
    private urlRouter: Router<any>;
    private utilsService: UtilsServiceInstance;
    private routerOpts?: BrowserRouterOpts;

    constructor(routerComponent: IRWSViewComponent, urlRouter: Router<any>, utilsService: UtilsServiceInstance, routerOpts?: BrowserRouterOpts) {
        this.baseComponent = routerComponent;
        this.urlRouter = urlRouter;
        this.utilsService = utilsService;

        this.routerOpts = routerOpts;

        window.addEventListener('popstate', (event: Event) => {
            // console.log('pop', event);
        });
    }

    public fireHandler(route: IRWSRouteResult): RouteReturn {
        const handler = route.handler();
        return [handler[0], handler[1], this.utilsService.mergeDeep(route.params, handler[2])];
    }

    public handleRoute(url: string): RouteReturn | null {
        const currentRoute = this.find(url);  

        if(currentRoute === null){
            return null;
        }

        // Only push to window.history when disableHistory is NOT true.
        // Default behaviour (disableHistory undefined / false) keeps history in sync.
        // Honour both the plugin-level option AND the per-component attribute so
        // bundles like the gate can opt out of history changes without affecting
        // the rest of the app.
        const pluginDisable = !!(this.routerOpts && this.routerOpts.disableHistory);
        const componentDisable = !!(this.baseComponent && (this.baseComponent as any).disableHistory);
        const disableHistory = pluginDisable || componentDisable;
        if (!disableHistory && history.pushState) {
            window.history.pushState({ path: url }, '', url);
        }

        return this.fireHandler(currentRoute);
    }

    public handleCurrentRoute(): RouteReturn {
        const currentRoute = this.find(window.location.pathname);

        return this.fireHandler(currentRoute);
    }

    public find(url: string): IRWSRouteResult {
        return this.urlRouter.find(url);
    }
}

export { RWSRouter };
