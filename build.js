const {RWSPluginBuilder} = require('@rws-framework/client/src/plugins/_builder');
class BrowserRouterBuilder extends RWSPluginBuilder{
    constructor(buildConfigurator, baseBuildConfig){
        super(__dirname, buildConfigurator, baseBuildConfig);
    }

    async onComponentsLocated(partedComponentsLocations = []){       
        if(!partedComponentsLocations){
            partedComponentsLocations = [];
        } 
        return [...partedComponentsLocations,`${this.pluginPath}/src/components`];
    }

    async onServicesLocated(servicesLocations){        
        return [...servicesLocations,`${this.pluginPath}/src/services`];
    }
    
    async onBuild(buildOptions){     
        this.log('webpack build modified');       
        return buildOptions;
    }
}

module.exports = BrowserRouterBuilder;