# iFrameResponsive

A PowerApps Custom Control for embedding responsive iframes in your PowerApps solutions.

## Overview

**iFrameResponsive** is a PowerApps PCF (PowerApps Component Framework) control that allows you to embed external web content via an iframe, with full responsiveness and configuration options. This control is ideal for scenarios where you need to display web pages, dashboards, or other web-based resources within your PowerApps applications, and want the iframe to adapt to different screen sizes.

## Features

- Embed any external URL via iframe
- Responsive resizing to fit parent container
- Configurable properties for URL, width, height, and more
- Easy integration into PowerApps forms and views

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- PowerApps CLI (`pac`)
- A Power Platform environment

### Installation

Follow this video to learn how to install the PowerApps CLI: https://www.youtube.com/watch?v=9TIhD9NKZ3k

1. Clone or download this repository.
2. Install dependencies (if any):
   ```bash
   npm install
   ```
3. Build the control:
   ```bash
   npm run build
   ```
4. Test locally using the PCF test harness:
   ```bash
   npm start
   ```
5. Upload the solution to your Power Platform environment:
  - Go to https://make.powerapps.com
  - Select the environment you want to upload the solution to
  - Select "Solutions" from the left-hand menu
  - Click "Upload" and select the `solution.zip` file from the `solution` folder in this repository

### Usage

1. Add the control to your PowerApps solution.
2. Configure the control properties (such as the iframe URL) in the PowerApps designer.
3. Publish and use your app!

## File Structure

- `index.ts` - Main TypeScript file implementing the PCF control logic.
- `ControlManifest.Input.xml` - Manifest file defining control properties and metadata.
- `generated/` - Auto-generated files (do not edit manually).
- `solution/` - Solution packaging files.

## Customization

You can customize the control by editing `index.ts` to add more properties or change the iframe behavior. Update `ControlManifest.Input.xml` to expose new properties to PowerApps.

## License

MIT License

---

*Created by Santiago Olivos*
