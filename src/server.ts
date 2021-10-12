import { serverHttp } from "./http";
import "reflect-metadata"
import "./websocket";
import "./database"

serverHttp.listen(3000, () => console.log("Server is running on PORT 3000, WebSockets"));