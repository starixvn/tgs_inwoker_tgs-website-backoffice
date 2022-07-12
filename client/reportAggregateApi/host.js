export let host =
  process.env.REPORT_AGGREGATE_API_HOST || "http://localhost:3020"
  // local k8s -> "http://report-aggregate-api.localhost"

export default {
  host
}
