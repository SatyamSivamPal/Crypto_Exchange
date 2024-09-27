import { WebSocket } from "ws"; 


export class UserManager {
    private static instance: UserManager;
    private users: Map<string, User> = new Map();

    private constructor () {

    }

    public static getInstance () {
        if(!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    public addUser() {
        
    }
}