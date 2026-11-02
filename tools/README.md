# Key to QR

One HTML file that turns an API key into a QR code. Nothing is uploaded or stored; it runs entirely in the page.

## Run it

**Laptop:** double-click `qr-key.html` (opens in your browser). Works offline.

**iPhone/iPad:** host `qr-key.html` at a web address and open that in Safari. Opening the file from the Files app uses a preview that does not run scripts, so no QR code appears.

## Use it

- **One key:** paste it in the box. The QR code appears with the key printed underneath so you can compare it with what your phone scans.
- **Many keys:** paste a whole CSV into the box (or click **Load CSV…** on a laptop). Columns: `index, key name, secret key`. A header row is optional; extra columns are ignored. Use the arrow buttons (or left/right arrow keys on a laptop) to step through the keys one at a time.
- **Check the paste:** the green line under the box shows how many keys were read and the last one. Make sure it matches the last row you copied.

Try it with `test-keys.csv` (20 dummy keys, none are real).

## Keep real keys out of git

`.gitignore` blocks every `.csv` except `test-keys.csv`. Keep real key files outside this repository.

## Technical notes (optional)

- QR encoding: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 2.0.4 (MIT), inlined in the HTML; its license header is kept in the file.
- Error correction level M. A key too long for one QR code shows an error instead of a code.
- Pasted text with more than one line is read as a CSV; a single line is read as one key. Comma, semicolon and tab separators are detected automatically.
