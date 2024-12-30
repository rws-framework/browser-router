import { IRWSViewComponent } from '@rws-framework/client/src/types/IRWSViewComponent';

export interface IFrontRoutes {
    [key: string]: unknown;
}

export interface IRWSRouteResult {
    handler: () => RouteReturn;
    params: Record<string, string>;
}

export type RouteReturn = [string, IRWSViewComponent, Record<string, string>];

export interface IRoutingEvent {
    routeName: string;
    component: IRWSViewComponent;
}