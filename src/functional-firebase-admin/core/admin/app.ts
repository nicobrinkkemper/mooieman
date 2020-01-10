import { app } from "firebase-admin";
import App = app.App;
type ofApp<X extends keyof App> = (app: App) => App[X];
export interface MappedApp extends Omit<App, 'name'> {
    // Omits some private properties
}
export const firestore: ofApp<'firestore'> = (app) => () => app.firestore()
export const storage: ofApp<'storage'> = (app) => () => app.storage()
export const auth: ofApp<'auth'> = (app) => () => app.auth();
export const database: ofApp<'database'> = (app) => (url?: string) => app.database(url);
export const instanceId: ofApp<'instanceId'> = (app) => () => app.instanceId();
export const messaging: ofApp<'messaging'> = (app) => () => app.messaging();
export const projectManagement: ofApp<'projectManagement'> = (app) => () => app.projectManagement();
export const securityRules: ofApp<'securityRules'> = (app) => () => app.securityRules();
export const options: ofApp<'options'> = (app) => app.options;
const remove: ofApp<'delete'> = (app) => () => app.delete();
export { remove as delete }
export default firestore;