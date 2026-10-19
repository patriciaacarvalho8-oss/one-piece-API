
import { Router } from "express";
import personagensController from "./controllers/personagens";
import usuariosController from "./controllers/usuario";
import { authentication } from "./middlewares/authentication";

const routes = Router();

routes.post("/login", usuariosController.login);

routes.get("/personagens", personagensController.list);
routes.get("/personagens/:id", personagensController.getById); 
routes.post("/personagens", authentication, personagensController.create);
routes.put("/personagens/:id", authentication, personagensController.update);
routes.delete("/personagens/:id", authentication, personagensController.delete);

export default routes;
