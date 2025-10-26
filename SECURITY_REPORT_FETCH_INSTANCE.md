# Security Report: Fetch Instance Hardcoded Values

## 🔍 Analysis Date
**Date**: Current  
**File Analyzed**: `utils/fetchInstance.js`  
**Security Level**: ⚠️ Medium Risk

---

## 🚨 Current Security Issues

### Issue #1: Hardcoded IP Address (High Priority)
**Location**: Lines 23, 33  
**Value**: `http://5.75.203.252:3000`  
**Risk Level**: 🔴 **HIGH**

**Problems**:
1. **Exposure of Infrastructure**: The backend server IP is visible in client-side code
2. **Security Through Obscurity**: Anyone can inspect the code and see your backend server location
3. **Attack Surface**: Exposes the actual server IP, making it easier to target for attacks
4. **Difficult to Change**: Requires code changes and redeployment to update
5. **Version Control History**: The IP is permanently stored in Git history

**Impact**:
- Attackers can directly target your backend server
- Easier to perform DDoS attacks
- No flexibility to change servers without code deployment

---

### Issue #2: Hardcoded Production Domain (Medium Priority)
**Location**: Line 36  
**Value**: `https://back.mimmoacademy.com`  
**Risk Level**: 🟡 **MEDIUM**

**Problems**:
1. **Inflexibility**: Hard to change domains without code deployment
2. **Environment Confusion**: Difficult to test with staging/preview environments
3. **Best Practice Violation**: All environment-specific configs should be in env files

**Impact**:
- Cannot easily switch between staging and production domains
- Harder to maintain multiple environments

---

### Issue #3: Hardcoded Internal URL (Low Priority)
**Location**: Line 26  
**Value**: `http://127.0.0.1:3000`  
**Risk Level**: 🟢 **LOW**

**Problems**:
1. **Inflexibility**: Cannot customize internal port or protocol
2. **Best Practice**: Should still be configurable

**Impact**:
- Less critical as this is only used server-side
- Still limits flexibility

---

## ✅ Recommended Solution

### Environment Variables to Create

#### 1. For Client-Side URLs (Public - Exposed to Browser)

These use `NEXT_PUBLIC_` prefix so Next.js exposes them to the browser:

```env
# Development backend URL (visible in browser)
NEXT_PUBLIC_API_URL_DEV=http://5.75.203.252:3000

# Production backend URL (visible in browser)
NEXT_PUBLIC_API_URL_PROD=https://back.mimmoacademy.com
```

#### 2. For Server-Side URLs (Private - Server Only)

These are NOT prefixed with `NEXT_PUBLIC_` so they remain server-side only:

```env
# Development server-side URL
API_URL_SERVER_DEV=http://5.75.203.252:3000

# Production server-side internal URL
API_URL_SERVER_PROD=http://127.0.0.1:3000
```

---

## 📊 Benefits of Moving to Environment Variables

### Security Benefits
1. ✅ **IP Obfuscation**: IP address not visible in source code
2. ✅ **Git Security**: Sensitive values not in version control
3. ✅ **Flexible Infrastructure**: Easy to change servers without code changes
4. ✅ **Environment Isolation**: Different values for dev/staging/production
5. ✅ **Reduced Attack Surface**: Harder to discover backend infrastructure

### Development Benefits
1. ✅ **Easy Configuration**: Change values without touching code
2. ✅ **Multiple Environments**: Support dev/staging/production easily
3. ✅ **Team Flexibility**: Each developer can use their own backend
4. ✅ **CI/CD Friendly**: Different configs per deployment environment
5. ✅ **Best Practices**: Follows 12-factor app methodology

---

## 🎯 Implementation Plan

### Step 1: Create Environment Files

Create these files:
- `.env.local` - For local development (gitignored)
- `.env.example` - Template for other developers (committed)
- `.env.production` - Production values (optional, can use hosting platform vars)

### Step 2: Update `.gitignore`

Ensure these are ignored:
```
.env*.local
.env.development.local
.env.production.local
```

### Step 3: Update `fetchInstance.js`

Replace hardcoded values with `process.env.*` references.

### Step 4: Update Documentation

Update all documentation to reference environment variables.

---

## 📋 Files to Create/Modify

### Files to Create:
1. `.env.example` - Template with placeholder values
2. `.env.local` - Your actual local development values (gitignored)

### Files to Modify:
1. `utils/fetchInstance.js` - Read from environment variables
2. `.gitignore` - Ensure .env.local is ignored
3. `utils/FETCH_INSTANCE_GUIDE.md` - Update documentation
4. `utils/FETCH_CHEATSHEET.md` - Update quick reference

---

## 🔒 Security Best Practices

### ✅ DO:
- Use environment variables for all URLs
- Keep `.env.local` out of version control
- Use `NEXT_PUBLIC_` prefix only for values that MUST be in browser
- Document required environment variables in `.env.example`
- Use different values for dev/staging/production
- Rotate values if they're accidentally committed

### ❌ DON'T:
- Commit `.env.local` or `.env.production` to Git
- Use `NEXT_PUBLIC_` for server-side only values
- Hardcode any infrastructure details in code
- Share production values in public channels
- Use the same values across environments

---

## 🎨 Proposed Code Structure

### Current (Insecure):
```js
getBaseURL() {
  if (this.isServerSide) {
    if (this.isDev) {
      return 'http://5.75.203.252:3000'; // ❌ Hardcoded IP
    } else {
      return 'http://127.0.0.1:3000'; // ❌ Hardcoded
    }
  }
  // ...
}
```

### Proposed (Secure):
```js
getBaseURL() {
  if (this.isServerSide) {
    if (this.isDev) {
      return process.env.API_URL_SERVER_DEV; // ✅ From env
    } else {
      return process.env.API_URL_SERVER_PROD; // ✅ From env
    }
  }
  // ...
}
```

---

## 📈 Risk Assessment Summary

| Issue | Risk Level | Priority | Impact | Effort |
|-------|-----------|----------|--------|--------|
| Hardcoded IP Address | 🔴 HIGH | P0 | High | Low |
| Hardcoded Domain | 🟡 MEDIUM | P1 | Medium | Low |
| Hardcoded Internal URL | 🟢 LOW | P2 | Low | Low |

**Overall Risk**: 🔴 **HIGH** - Immediate action recommended

---

## 🚀 Recommendation

**Action**: ✅ **IMPLEMENT IMMEDIATELY**

**Reason**: The hardcoded IP address represents a significant security risk and violates industry best practices. The implementation is straightforward with minimal effort required.

**Timeline**: 
- Implementation: 15 minutes
- Testing: 5 minutes
- Total: 20 minutes

---

## ✅ Acceptance Criteria

Once implemented, the solution should have:
- ✅ No hardcoded URLs in source code
- ✅ All URLs read from environment variables
- ✅ `.env.example` file with all required variables documented
- ✅ `.env.local` created for development (gitignored)
- ✅ `.gitignore` updated to exclude environment files
- ✅ Fallback values for development to prevent crashes
- ✅ Clear error messages if required env vars are missing
- ✅ Updated documentation

---

## 📞 Questions?

Before proceeding, please confirm:

1. ✅ Do you approve moving all URLs to environment variables?
2. ✅ Should we add validation to ensure env vars are set?
3. ✅ Should we add fallback values for local development?
4. ✅ Any specific environment variable naming preferences?

**Reply with "APPROVED" to proceed with implementation.**

