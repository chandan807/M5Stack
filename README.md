# FieldNode — M5Stack Prototype Lab

A fully interactive React/Vite client-demo for an M5Stack / ESP32 prototype engagement.

## Included
- 11 responsive React views
- M5Stack-style device visualizations
- Simulated live telemetry with CSV export
- Remote pump control and automation threshold
- Interactive phone app
- BLE/Wi-Fi pairing flow
- Editable ESPHome YAML with validate/compile/upload simulation
- LoRa RF link and packet test
- Hardware/BOM view
- Validation suite
- Delivery workflow

All device values are explicitly simulated demonstration data.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages
The Vite base path is configured for `/M5Stack/`. The included GitHub Actions workflow builds `dist/` and deploys it to Pages on pushes to `main`.
