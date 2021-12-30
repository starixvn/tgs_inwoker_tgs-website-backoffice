export const goto = async ({ page, value = "" }) => {
  let selector = `#sidebar a[href="${value}"]`

  await Promise.all([
    page.click(selector),
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.waitForLoadState("domcontentloaded")
  ])
}
