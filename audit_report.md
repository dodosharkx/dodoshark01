# DoDoShark 项目完整代码审计报告

审计时间：2026-04-02  
审计范围：`front/dodoshark` (Next.js 16 前端) + `studio-dodoshark` (Sanity Studio 5)

---

## 审计总览

| 类别 | 发现数 | 严重 | 重要 | 一般 | 建议 |
|:---|:---:|:---:|:---:|:---:|:---:|
| 🔴 安全问题 | 5 | 2 | 2 | 1 | — |
| 🟡 SEO / 可发现性 | 3 | — | 2 | 1 | — |
| 🔵 架构与代码质量 | 8 | — | 3 | 3 | 2 |
| 🟢 性能 | 4 | — | 1 | 2 | 1 |
| ⚪ 运维 / DX | 4 | — | 1 | 1 | 2 |
| **合计** | **24** | **2** | **9** | **8** | **5** |

---

## 🔴 安全问题

### SEC-1 ⚠️ 严重：Draft API 暴露 Debug 端点泄露环境变量

**文件**：[route.ts](file:///d:/new-website/final-3.9/front/dodoshark/app/api/draft/enable/route.ts#L9-L32)

```typescript
// 访问 /api/draft/enable?debug=1 即可获取所有环境变量键名、token 长度等信息
if (url.searchParams.get('debug') === '1') {
  const allKeys = Object.keys(process.env || {})
  // ... 返回 sanityRelatedKeys, hasReadToken, readTokenLength, sampleKeys 等
}
```

> [!CAUTION]
> 这是一个**生产环境信息泄露漏洞**。任何人都可以通过 `?debug=1` 查看服务器上所有环境变量的名称（包括敏感token的存在与长度），这可以帮助攻击者判断部署配置并进行后续攻击。

**修复建议**：立即删除整个 `debug` 代码块，或在其前面添加严格的 `NODE_ENV !== 'production'` 或认证检查。

---

### SEC-2 ⚠️ 严重：Sanity Read Token 同时传递给 `browserToken`

**文件**：[sanity.live.ts](file:///d:/new-website/final-3.9/front/dodoshark/lib/sanity.live.ts#L7-L11)

```typescript
export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: sanityReadToken,
  browserToken: sanityReadToken,  // ⚠️ 同一个 token 暴露给浏览器
})
```

> [!CAUTION]
> `browserToken` 会将 `SANITY_API_READ_TOKEN` 发送到客户端 JavaScript bundle 中。虽然这是一个只读 token，但它仍然：
> 1. 允许任何人读取 Sanity 项目中所有数据（包括草稿内容）
> 2. 可能被滥用导致 API 限流
> 3. 违反最小权限原则

**修复建议**：移除 `browserToken` 配置项，仅使用 `serverToken`。客户端实时预览应使用 Sanity 的 Viewer token 或公共 API。

---

### SEC-3 🟠 重要：HTML 模板系统的 XSS 防护有绕过风险

**文件**：[solution-template.ts](file:///d:/new-website/final-3.9/front/dodoshark/lib/solution-template.ts#L37-L48)

```typescript
const forbiddenHtmlPatterns = [
  /<script\b/i, /<iframe\b/i, /<object\b/i, /<embed\b/i,
  /<link\b/i, /<style\b/i, /\bon[a-z]+\s*=/i, /javascript\s*:/i,
]
```

当前使用正则黑名单过滤 CMS 提交的 HTML 模板。存在以下绕过风险：
- `<svg onload=...>` — `on` 事件处理器匹配依赖 `\bon[a-z]+\s*=`，但使用 tab 或换行符替代空格可绕过
- `<img src=x onerror=...>` — 同理
- `data:text/html;base64,...` URI — 不在黑名单内
- `<meta http-equiv="refresh" content="0;url=javascript:...">` — 不在黑名单内

**但**：模板通过 `<iframe srcdoc>` 渲染（沙箱），在实际运行环境中的危害有限。

**修复建议**：
1. 对 `<iframe>` 添加 `sandbox` 属性（确认当前是否已有）
2. 考虑使用白名单方式替代黑名单
3. 在 `forbiddenHtmlPatterns` 中补充 `<meta\b`, `<form\b`, `<base\b` 等标签

---

### SEC-4 🟠 重要：Lead 表单服务端验证不够严谨

**文件**：[lead-actions.ts](file:///d:/new-website/final-3.9/front/dodoshark/lib/lead-actions.ts#L85-L87)

```typescript
function hasValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
```

- 邮箱验证正则过于宽松，允许 `user@domain` 等无效格式
- Rate limit 使用内存中的 `Map` 存储（`globalThis.__dodosharkLeadRateLimit`），在多实例/Edge 部署场景下无效
- Bot trap 时间检查 `elapsedMs >= 0 && elapsedMs < MIN_FORM_COMPLETION_MS` 仅检查 >= 0，攻击者可提交未来时间戳绕过

**修复建议**：
1. 邮箱正则改为更严格的版本，至少要求 TLD 长度 >= 2
2. 在 Cloudflare Workers 环境下，考虑使用 KV/D1 替代内存 Map 做限流
3. 添加 `elapsedMs` 的上限检查（如 30min）

---

### SEC-5 🔵 一般：Env.ts 在服务端初始化时打印配置信息

**文件**：[env.ts](file:///d:/new-website/final-3.9/front/dodoshark/lib/env.ts#L57-L62)

```typescript
if (typeof window === 'undefined') {
  console.log('[ENV] Project ID:', SANITY_PROJECT_ID || 'MISSING')
  console.log('[ENV] Dataset:', SANITY_DATASET)
  console.log('[ENV] Studio URL:', SANITY_STUDIO_URL)
  console.log('[ENV] Read Token present:', !!SANITY_API_READ_TOKEN)
}
```

虽然不影响安全，但在生产环境日志中持续打印环境配置信息不是最佳实践。

**修复建议**：将这些日志限制在 `NODE_ENV !== 'production'` 条件下执行。

---

## 🟡 SEO / 可发现性问题

### SEO-1 🟠 重要：全站 `noindex` + `robots.txt` 全面禁止爬虫

**文件**：
- [layout.tsx](file:///d:/new-website/final-3.9/front/dodoshark/app/layout.tsx#L29-L37) — 全局默认 `index: false, follow: false`
- [robots.txt](file:///d:/new-website/final-3.9/front/dodoshark/app/robots.txt) — `Disallow: /` 对所有爬虫

> [!WARNING]
> 当前全站被完全屏蔽于搜索引擎之外。这意味着：
> - Google / Bing 等不会索引任何页面
> - OG 爬虫（Facebook/Twitter 可能尝试）也被阻止
> - 各页面的 `buildPageMetadata` 生成的 SEO metadata 完全无效
>
> **如果这是预发布/暂存站点行为，这是合理的**。但需要确认发布时这些限制会被移除。

**修复建议**：
1. 如果即将上线，需要在 `layout.tsx` 中移除全局 `robots: { index: false }` 默认值
2. 更新 `robots.txt` 允许合法搜索引擎爬取
3. 各动态页面（如 solution、product）中也硬编码了 `robots: {index: false}`，需要逐一移除

---

### SEO-2 🟠 重要：各动态页面硬编码 `noindex`

**相关文件**：
- [solutions/[slug]/page.tsx:699](file:///d:/new-website/final-3.9/front/dodoshark/app/solutions/%5Bslug%5D/page.tsx#L699) — `robots: {index: false, follow: false}`
- products/[slug]/page.tsx:512 — 同上
- cases/[slug]/page.tsx:267 — 同上
- cases/page.tsx:175 — 同上

即使全局 noindex 被移除，这些页面仍然单独强制 noindex，需要逐一清理。

---

### SEO-3 🔵 一般：`lang="en"` 硬编码

**文件**：[layout.tsx](file:///d:/new-website/final-3.9/front/dodoshark/app/layout.tsx#L66)

```html
<html lang="en" className="scroll-smooth">
```

网站内容包含中英文，考虑从 CMS 或 i18n 配置中动态设置 `lang` 属性。目前为企业英文官网属性，影响不大。

---

## 🔵 架构与代码质量

### ARCH-1 🟠 重要：`page.tsx` (Home) 过大 — 1036 行

**文件**：[page.tsx](file:///d:/new-website/final-3.9/front/dodoshark/app/page.tsx)

首页组件文件达 1036 行/38KB，包含：
- 18 个类型定义
- GROQ 查询（60+ 行）
- 数据转换逻辑（200+ 行）
- 多个内联子组件（`ProductCard`, `SolutionCard`, `ArrowRightIcon`）
- 完整 JSX 渲染（300+ 行）

**修复建议**：
1. 将类型拆分到 `lib/types/home.ts`
2. 将 GROQ 查询和数据获取逻辑拆分到 `lib/home-data.ts`
3. 将 `ProductCard`、`SolutionCard` 等子组件拆分到 `components/home/` 目录下
4. 首页 `page.tsx` 仅保留组装和渲染逻辑

---

### ARCH-2 🟠 重要：`solutions/[slug]/page.tsx` 同样过大 — 795 行

**文件**：[solutions/[slug]/page.tsx](file:///d:/new-website/final-3.9/front/dodoshark/app/solutions/%5Bslug%5D/page.tsx)

包含 14 个动态 import、复杂的 GROQ 查询（370+ 行）、块渲染逻辑、hero 渲染函数等。

**修复建议**：提取 GROQ 查询到 `lib/solution-queries.ts`，提取块渲染逻辑到独立的 `components/solutions/SolutionBlockRenderer.tsx`。

---

### ARCH-3 🟠 重要：`getSanityImageUrl` 本地重写与全局 `toImageSrc` 存在功能重复

**文件**：
- [page.tsx:345-359](file:///d:/new-website/final-3.9/front/dodoshark/app/page.tsx#L345-L359) — 首页本地版 `getSanityImageUrl`
- [sanity-utils.ts:110-128](file:///d:/new-website/final-3.9/front/dodoshark/lib/sanity-utils.ts#L110-L128) — 全局版 `toImageSrc`

首页定义了额外的 `HomeSanityImage` 类型（带 `imageUrl` 字段）并重写了 image URL 解析逻辑，但 `toImageSrc` 已经能处理大部分场景。这导致两套并行的图片 URL 解析逻辑。

**修复建议**：统一使用 `toImageSrc`，扩展其签名以支持 `quality` 和 `auto` 参数。

---

### ARCH-4 🔵 一般：`VisualEditing as any` 类型擦除

**文件**：[layout.tsx:63](file:///d:/new-website/final-3.9/front/dodoshark/app/layout.tsx#L63)

```typescript
const VisualEditingAny = VisualEditing as any;
```

这是由于 `next-sanity` 类型与 Next.js 16 React 19 之间的不兼容导致的。虽然不影响运行，但会掩盖类型变更导致的问题。

**修复建议**：找到具体类型不兼容点，使用更精确的类型断言或等待依赖更新。

---

### ARCH-5 🔵 一般：`compilerCache` 全局 Map 无大小限制

**文件**：[solution-template.ts:49](file:///d:/new-website/final-3.9/front/dodoshark/lib/solution-template.ts#L49)

```typescript
const compilerCache = new Map<string, Promise<string>>()
```

Tailwind 模板编译结果缓存没有任何清除机制或大小限制。在长期运行的 Node.js 进程中（非 Edge 函数），每个不同的 HTML+CSS 组合都会被永久缓存。

**修复建议**：实现 LRU 策略或设定最大缓存数量（如 50），超出后清除最早的条目。

---

### ARCH-6 🔵 一般：`lead-actions.ts` 中的 globalThis Rate Limit 在 Edge 环境不可靠

**文件**：[lead-actions.ts:36-38](file:///d:/new-website/final-3.9/front/dodoshark/lib/lead-actions.ts#L36-L38)

在 Cloudflare Workers / Edge Runtime 中，每个请求可能在不同的 isolate 中执行，`globalThis` 上的 `Map` 不会共享。Rate limit 在此环境下形同虚设。

**修复建议**：使用 Cloudflare KV、D1、或者 Rate Limiting API 做持久化限流。目前 `solutions/[slug]/page.tsx` 已声明 `runtime = 'nodejs'`，若整个应用运行在 Node.js 环境下则问题不大。

---

### ARCH-7 💡 建议：`cleanText` 函数命名可能引起混淆

`sanity-utils.ts` 中同时存在 `cleanText`（去 stega + 去零宽字符 + trim）和 `renderText`（仅判断非空字符串），两者职责差异不够直观。特别是 `renderText` 不执行任何 stega 清理但 `cleanText` 会，这可能导致开发者选错。

**修复建议**：在 JSDoc 中明确标注差异，或将 `renderText` 重命名为 `rawText` 以区分语义。

---

### ARCH-8 💡 建议：`mvp-data.tsx` 使用 `.tsx` 扩展名但仅导出数据

**文件**：[mvp-data.tsx](file:///d:/new-website/final-3.9/front/dodoshark/lib/mvp-data.tsx)

该文件主要导出产品数据常量、JSX 图标组件。由于包含 JSX，使用 `.tsx` 合理。但建议将图标组件拆到 `components/ui/Icon.tsx` 中统一管理，使 `mvp-data` 作为纯数据文件。

---

## 🟢 性能

### PERF-1 🟠 重要：首页大量 `dynamic(() => import(...))` 可能影响 Hydration

**文件**：[page.tsx:13-16](file:///d:/new-website/final-3.9/front/dodoshark/app/page.tsx#L13-L16)

```typescript
const DeferredHeroCarousel = dynamic(() => import('@/components/home/DeferredHeroCarousel'))
const DeferredHomeBlogCarousel = dynamic(() => import('@/components/home/DeferredHomeBlogCarousel'))
const DeferredProjectCasesCarousel = dynamic(() => import('@/components/home/DeferredProjectCasesCarousel'))
const VideoPreviewTrigger = dynamic(() => import('@/components/ui/VideoPreviewTrigger'))
```

首页 Server Component 中 4 个 `dynamic` import 客户端组件，每个都会产生额外的 chunk 和水合请求。对于首屏 LCP 关键路径（如 HeroCarousel），应考虑是否需要延迟加载。

**修复建议**：`DeferredHeroCarousel` 是首屏关键元素，不应该延迟加载，改为直接 import 以获得更好的 LCP。

---

### PERF-2 🔵 一般：`getGlobalSettings()` 在每次请求中都执行

**文件**：[layout.tsx:61](file:///d:/new-website/final-3.9/front/dodoshark/app/layout.tsx#L61)

```typescript
const globalSettings = await getGlobalSettings()
```

Root Layout 中的 `getGlobalSettings()` 在每次页面请求时都会调用 Sanity API。Next.js 16 的 `fetch` 有缓存机制（通过 `next-sanity` 的 `defineLive`），但需确认 Sanity Live 的缓存策略是否高效。

**修复建议**：确认 `sanityFetch` 底层是否利用了 Next.js Data Cache 和 ISR 机制。考虑在生产环境添加 revalidation 策略。

---

### PERF-3 🔵 一般：`solutions/[slug]` 页面 GROQ 查询过于庞大

**文件**：[solutions/[slug]/page.tsx:165-370](file:///d:/new-website/final-3.9/front/dodoshark/app/solutions/%5Bslug%5D/page.tsx#L165-L370)

单个解决方案详情页的 GROQ 查询达 205 行，深度展开所有 `contentBlocks` 及其嵌套的 `references`、`items`、`rows` 等。这会导致：
- Sanity API 响应体过大
- 包含大量可能不被实际渲染的数据

**修复建议**：让查询基于 `detailRenderMode` 条件化，减少 htmlTemplate 模式下的无效数据加载。

---

### PERF-4 💡 建议：考虑添加 `loading.tsx` 骨架屏

当前各路由段（`/products/[slug]`, `/solutions/[slug]` 等）无 `loading.tsx`，用户在页面导航时可能感知到白屏。

---

## ⚪ 运维 / DX

### OPS-1 🟠 重要：两个 `package.json` 中 `name` 字段相同

**文件**：
- [front/dodoshark/package.json:2](file:///d:/new-website/final-3.9/front/dodoshark/package.json) — `"name": "dodoshark"`
- [studio-dodoshark/package.json:2](file:///d:/new-website/final-3.9/studio-dodoshark/package.json) — `"name": "dodoshark"`

两个独立应用使用相同的包名，虽然不在同一 workspace 下运行，但可能导致包管理工具混淆、CI 日志不清晰。

**修复建议**：将 Studio 包名改为 `"dodoshark-studio"`。

---

### OPS-2 🔵 一般：根目录存在迁移遗留文件

**文件**：
- `migrate_cms.js` — CMS 数据迁移脚本
- `repair_cms_code_fields.js` — 代码字段修复脚本
- `solutions_list.json` — 解决方案列表数据文件
- `sanity_migration_guide.md` — 迁移指南
- `prop.png` — 未知用途图片
- `temp.html` — 临时 HTML 文件

这些文件不应进入版本控制的主分支。

**修复建议**：将迁移相关文件移入 `archive/` 或 `scripts/` 目录，更新 `.gitignore`。

---

### OPS-3 💡 建议：缺少统一的格式化配置

Frontend `front/dodoshark` 无 Prettier 配置（依赖 ESLint），Studio 有 Prettier 配置。两个项目的代码风格不统一（前者用 semicolons + double quotes，后者无 semicolons + single quotes）。

**修复建议**：在根目录添加统一的 `.prettierrc` 配置。

---

### OPS-4 💡 建议：`eslint-report.txt` 不应提交到版本控制

**文件**：[eslint-report.txt](file:///d:/new-website/final-3.9/front/dodoshark/eslint-report.txt) (11KB)

这是生成的报告文件，应添加到 `.gitignore`。

---

## 架构亮点（正面）

审计中也发现了以下值得肯定的良好实践：

| 亮点 | 说明 |
|:---|:---|
| ✅ **Stega 清理链** | `cleanText` / `sanitizeAltText` 完整覆盖了 Sanity Stega 编码清理，防止隐藏字符泄露到前端 |
| ✅ **安全 href 校验** | `safeHref.ts` 白名单式检查 URL 协议，有效防范 `javascript:` 注入 |
| ✅ **渐进式 CMS 降级** | 所有 CMS 数据消费点都有硬编码 fallback，保证 CMS 不可用时网站仍能渲染 |
| ✅ **HTML 转义** | `lead-actions.ts` 的 `escapeHtml` 函数正确转义了邮件模板中的用户输入 |
| ✅ **表单安全** | 蜜罐字段 + 时间检测 + IP Rate Limit 三重保护（尽管有优化空间） |
| ✅ **图片优化** | `CMSImage` 组件统一入口、自动 alt text 降级、合理的 sizes 属性 |
| ✅ **Type Safety** | 全项目仅 1 处 `as any`，无 `@ts-ignore`，`strict: true` 开启 |
| ✅ **零 `dangerouslySetInnerHTML`** | 整个前端无直接 innerHTML 注入，HTML 模板通过 iframe sandbox 隔离 |
| ✅ **Page Builder 合并逻辑** | `richFeatureMerge.ts` 实现了优雅的块合并算法，同时保持背景一致性检查 |

---

## 优先行动建议

> [!IMPORTANT]
> 以下是按优先级排列的推荐行动列表：

### 立即修复（部署前必须）
1. **删除 Draft API 的 debug 端点**（SEC-1）
2. **移除 `browserToken` 配置**（SEC-2）

### 短期优化（1-2 周内）
3. 清理所有硬编码的 `noindex` / `robots.txt`（SEO-1, SEO-2）— 如果准备上线
4. 拆分 `page.tsx` 首页超大组件（ARCH-1）
5. 统一图片 URL 解析函数（ARCH-3）
6. 添加 Tailwind 编译缓存大小限制（ARCH-5）

### 中期改善（1-2 个月内）
7. 增强 HTML 模板安全过滤（SEC-3）
8. 加固表单验证与限流（SEC-4）
9. 优化解决方案页 GROQ 查询（PERF-3）
10. 清理迁移遗留文件（OPS-2）
11. 统一代码格式化配置（OPS-3）
