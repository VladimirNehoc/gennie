import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & CORS
  app.use(helmet());
  const corsOriginEnv = process.env.CORS_ORIGIN;
  const origins = corsOriginEnv ? corsOriginEnv.split(",").map((s) => s.trim()) : true;
  app.enableCors({ origin: origins, credentials: true });

  // Глобальные настройки
  app.use(cookieParser());
  app.setGlobalPrefix("api"); // опционально
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("AI Platform API")
    .setDescription("Prompts / Generations / Users")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`🚀 API:   http://localhost:${port}/api`);
  console.log(`📘 Docs:  http://localhost:${port}/docs`);
}
bootstrap();
