import { isDev } from "../env"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
  WebTracerProvider
} from "@opentelemetry/sdk-trace-web"
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
import { ZoneContextManager } from "@opentelemetry/context-zone"
import { registerInstrumentations } from "@opentelemetry/instrumentation"

if (isDev()) {
  const provider = new WebTracerProvider()

  provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()))

  provider.register({
    contextManager: new ZoneContextManager()
  })

  registerInstrumentations({
    instrumentations: [new FetchInstrumentation()]
  })
}
