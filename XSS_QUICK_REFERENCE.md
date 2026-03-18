# XSS Prevention - Quick Reference Guide

## 🚨 P0 Critical Security Fix

### What Changed?
All `innerHTML` usage now uses **DOMPurify** sanitization to prevent XSS attacks.

## 📝 Quick Reference

### ✅ Correct Usage

```javascript
// 1. HTML with dynamic content
element.innerHTML = sanitizeHTML(`<div>${userInput}</div>`);

// 2. Combined with escHtml() for text
element.innerHTML = sanitizeHTML(`<span>${escHtml(userText)}</span>`);

// 3. Static HTML (no user input)
element.innerHTML = sanitizeHTML('<div class="safe">Static content</div>');

// 4. SVG elements
svg.innerHTML = sanitizeHTML(`<path d="${pathData}" fill="${color}"/>`);
```

### ❌ Wrong Usage (DO NOT DO THIS)

```javascript
// NEVER use innerHTML with untrusted data directly
element.innerHTML = userInput; // ❌ DANGEROUS!

// NEVER trust API responses without sanitization
element.innerHTML = apiResponse.html; // ❌ DANGEROUS!

// NEVER use without escHtml() for text content
element.innerHTML = `<div>${userName}</div>`; // ❌ DANGEROUS!
```

## 🛡️ Security Functions

### sanitizeHTML(dirty, options)
Main sanitization function using DOMPurify.

**When to use:**
- Any HTML with dynamic content
- User/API data in HTML context
- SVG elements
- Style attributes

**Example:**
```javascript
const safeHTML = sanitizeHTML(userContent);
element.innerHTML = safeHTML;
```

### escHtml(text)
Basic HTML escaping for text-only content.

**When to use:**
- Text content (no HTML tags)
- Attribute values
- Combined with sanitizeHTML()

**Example:**
```javascript
const safeText = escHtml(userInput);
element.textContent = safeText;
```

## 🔒 What Gets Sanitized?

### ✅ Safe Elements (Preserved)
- Layout: `div`, `span`, `p`, `br`, `hr`
- Text: `strong`, `em`, `i`, `b`
- Lists: `ul`, `ol`, `li`
- Tables: `table`, `tr`, `td`, `th`
- SVG: `svg`, `path`, `line`, `circle`, `rect`, `defs`

### ❌ Dangerous Elements (Removed)
- `script`, `iframe`, `form`, `input`, `button`
- `object`, `embed`
- Event handlers: `onclick`, `onerror`, `onload`, etc.
- `javascript:` protocol in href

## 📋 Common Patterns

### Pattern 1: Dynamic List Items
```javascript
items.forEach(item => {
  const div = document.createElement('div');
  div.innerHTML = sanitizeHTML(`
    <div class="item">
      <span class="name">${escHtml(item.name)}</span>
      <span class="value">${escHtml(item.value)}</span>
    </div>
  `);
  container.appendChild(div);
});
```

### Pattern 2: Tooltip Content
```javascript
function showTooltip(e, content) {
  const tip = getTooltip();
  tip.innerHTML = sanitizeHTML(escHtml(content));
  tip.style.display = 'block';
}
```

### Pattern 3: Chart SVG
```javascript
svg.innerHTML = sanitizeHTML(`
  <path d="${escHtml(pathData)}" fill="${escHtml(color)}"/>
  <circle cx="${x}" cy="${y}" r="5"/>
`);
```

### Pattern 4: Error Messages
```javascript
errorDiv.innerHTML = sanitizeHTML(`
  <div class="error">
    ${ICONS.error}
    ${escHtml(errorMessage)}
  </div>
`);
```

## 🧪 Testing Checklist

- [ ] Script injection blocked: `<script>alert(1)</script>`
- [ ] Event handlers removed: `<div onclick="evil()">`
- [ ] JavaScript protocol removed: `<a href="javascript:evil()">`
- [ ] Iframe removed: `<iframe src="evil.com">`
- [ ] Safe HTML preserved: `<div class="test">Content</div>`
- [ ] SVG works: `<svg><rect fill="red"/></svg>`

## 🚨 Emergency Procedures

### If XSS Suspected
1. **Immediate**: Disable affected feature
2. **Investigate**: Check user input paths
3. **Fix**: Add additional escHtml() calls
4. **Test**: Verify with XSS test cases
5. **Deploy**: Push hotfix to production

### If DOMPurify Fails to Load
1. **Fallback**: Automatically uses escHtml()
2. **Warning**: Console message displayed
3. **Impact**: Reduced functionality but still safe
4. **Fix**: Check CDN availability

## 📚 Additional Resources

- **DOMPurify Docs**: https://github.com/cure53/DOMPurify
- **OWASP XSS**: https://owasp.org/www-community/attacks/xss/
- **Implementation Report**: See `XSS_PREVENTION_IMPLEMENTATION_REPORT.md`

## 🎯 Golden Rules

1. **NEVER** trust user input
2. **ALWAYS** use sanitizeHTML() for innerHTML
3. **ALWAYS** use escHtml() for text content
4. **NEVER** bypass sanitization
5. **ALWAYS** test with XSS payloads

---

**Remember**: Security is everyone's responsibility. When in doubt, sanitize!
