# prettier-plugin-html-inline-force-semi

Should work in HTML and Angular HTML parsers

## Installation
Run: `npm install prettier-plugin-html-inline-force-semi --save-dev`

Add to plugins in prettier options, e.g: `{ "plugins": ["prettier-plugin-html-inline-force-semi"] }`

## Prettier options:

### Values
htmlForceSemiOn = "style" | "all" | "angularEvent" | "never"

* default = "style"

### Example config
```json
{
  ...,
  "plugins": ["prettier-plugin-html-inline-force-semi"],
  "htmlForceSemiOn": "style"
}
```


## Examples

### style (including all)
**Before**
```html
<div style="text-align: right; margin: 6px 0">Hello World</div>
```
**After**
```html
<div style="text-align: right; margin: 6px 0;">Hello World</div>
```

### angularEvent (including all)
**Before**
```html
<button (click)="myFunction()">Hello World</button>
```
**After**
```html
<button (click)="myFunction();">Hello World</button>
```