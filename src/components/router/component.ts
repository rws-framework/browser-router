import { RWSRouter, _ROUTING_EVENT_NAME, RouteReturn } from '../../services/RoutingService';
import RWSViewComponent from '@rws-framework/client/src/components/_component';
import { applyConstructor } from '@rws-framework/client/src/components/_decorator';

import {
    RWSView, observable, RWSInject,
    ConfigService, ConfigServiceInstance, 
    DOMService, DOMServiceInstance,
    UtilsService, UtilsServiceInstance,
    ApiService, ApiServiceInstance,
    NotifyService, NotifyServiceInstance
} from '@rws-framework/client';
import RoutingService, { RoutingServiceInstance } from '../../services/RoutingService';

@RWSView('rws-router', { ignorePackaging: true })
export class RouterComponent extends RWSViewComponent {    
    static autoLoadFastElement = false;
    private routing: RWSRouter;
    private currentComponent: RWSViewComponent;

    @observable currentUrl: string;
    @observable childComponents: HTMLElement[] = [];    
    slotEl: HTMLElement = null;

    constructor(
        @RWSInject(RoutingService) protected routingService: RoutingServiceInstance,        
        @RWSInject(ConfigService) protected config: ConfigServiceInstance,        
        @RWSInject(DOMService) protected domService: DOMServiceInstance,
        @RWSInject(UtilsService) protected utilsService: UtilsServiceInstance,
        @RWSInject(ApiService) protected apiService: ApiServiceInstance,        
        @RWSInject(NotifyService) protected notifyService: NotifyServiceInstance
    ) {
        super(config, domService, utilsService, apiService, notifyService);       
        applyConstructor(this);
    }

    connectedCallback() {
        super.connectedCallback();   
        this.routing = this.routingService.apply(this);   
            
        if(this.currentUrl){
            this.handleRoute(this.routing.handleRoute(this.currentUrl));      
        }           
    }

    currentUrlChanged(oldValue: string, newValue: string){  
        if(!this.routing){
            this.routing = this.routingService.apply(this);       

        }     
        this.handleRoute(this.routing.handleRoute(newValue));
    }

    private handleRoute(route: RouteReturn){
        const [routeName, childComponent, routeParams] = route;

        this.$emit(_ROUTING_EVENT_NAME, {
            routeName,
            component: childComponent
        });

        console.log('handleroute',{
            routeName,
            component: childComponent
        });
        
        const newComponent = document.createElement((childComponent as any).definition.name);        
        newComponent.routeParams = routeParams;

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