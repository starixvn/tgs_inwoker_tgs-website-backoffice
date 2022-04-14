export let host =
  process.env.REPORT_AGGREGATE_API_HOST ||
  "http://report-aggregate-api.localhost" //"http://localhost:3020"

export default {
  host
}
