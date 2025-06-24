import { observable  } from '@microsoft/fast-element';
import RoutingService, { RWSRouter, _ROUTING_EVENT_NAME, RouteReturn, RoutingServiceInstance } from '../../services/RoutingService';

import RWSViewComponent, { IRWSViewComponent } from '@rws-framework/client/src/components/_component';
import {RWSInject, RWSView} from '@rws-framework/client/src/components/_decorator';

@RWSView('rws-router', { ignorePackaging: true})
export class RouterComponent extends RWSViewComponent {    
    static autoLoadFastElement = false;
    private routing: RWSRouter;
    private currentComponent: HTMLElement;

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