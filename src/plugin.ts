import { RWSPlugin } from '@rws-framework/client';

class RWSBrowserRouter extends RWSPlugin {
    static componentsDir: string | null = './components';

    initPlugin(){
        this.onClientSetup(async () => {                    
            return this.client;
        });
    }
}

export { RWSBrowserRouter };