#!/usr/bin/env node

import puppeteer from "puppeteer"

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  try {
    await page.goto("http://localhost:8080")
  } catch (e) {
    console.error("Could not connect to http://localhost:8080. Is the dev server running?")
    await browser.close()
    process.exit(2)
    return
  }

  const results = await page.evaluate(() => testOutput.innerText)
  await browser.close()
  console.log(results)
  if (/fail|debug/i.test(results)) process.exit(1)
})();
