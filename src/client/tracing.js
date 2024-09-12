import { isDev } from "../env"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
  WebTracerProvider
} from "@opentelemetry/sdk-trace-web"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
import { ZoneContextManager } from "@opentelemetry/context-zone"
import { registerInstrumentations } from "@opentelemetry/instrumentation"

let tracer

if (isDev()) {
  const provider = new WebTracerProvider()

  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new ConsoleSpanExporter()

      /*
      new OTLPTraceExporter({
        url: "/trace-api"
      })
      */
    )
  )

  provider.register({
    contextManager: new ZoneContextManager()
  })

  registerInstrumentations({
    instrumentations: [new FetchInstrumentation()]
  })

  tracer = provider.getTracer("bo-client")
}

export const getTracer = () => tracer
