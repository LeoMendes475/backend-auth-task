import Koa from "koa";
import bodyParser from "koa-bodyparser";
import userRoutes from "./infrastructure/routes/userRoutes";

const app = new Koa();

app.use(bodyParser());
app.use(userRoutes.routes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
