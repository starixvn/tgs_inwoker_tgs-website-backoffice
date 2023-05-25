import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider
} from "@opentelemetry/sdk-trace-web"
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
import { ZoneContextManager } from "@opentelemetry/context-zone"
import { registerInstrumentations } from "@opentelemetry/instrumentation"

const provider = new WebTracerProvider()

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))

provider.register({
  contextManager: new ZoneContextManager()
})

registerInstrumentations({
  instrumentations: [new FetchInstrumentation()]
})
