# Sanity CMS Migration Guide: From Hardcoded to Dynamic

This document summarizes the best practices and workflow for migrating existing hardcoded pages in the DoDoShark codebase to a **Sanity-first CMS architecture**.

---

## 1. Asset & Data Migration Strategy

Before changing any frontend code, the Sanity Studio must be populated with the existing production data.

### Image Asset Uploading
Images stored in `public/assets/...` should be uploaded to Sanity as assets. This ensures they can be managed, cropped, and optimized by the Sanity Image Pipeline.

**Key Pattern (Migration Script):**
```javascript
// Example: Uploading a local image to Sanity
const asset = await client.assets.upload('image', createReadStream(localPath), {
  filename: basename(localPath),
});

// Reference the asset in a document
await client.patch(DOC_ID).set({
  'images.heroBackground': {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id }
  }
}).commit();
```

### Text Data Mapping
Map hardcoded constants (arrays, objects) directly to the fields defined in the Sanity schema. Use a script to automate this for consistency.

---

## 2. GROQ Data Fetching Logic

Once the data is in Sanity, implement the fetch logic.

### Efficient Queries
Fetch only what is needed. Use the `fetchSanityData` (Live/Draft mode aware) helper.

### Mapping Data for the Frontend
Always handle potential nulls and empty arrays carefully.

> [!IMPORTANT]
> **Array Fallback Rule**: In JavaScript, `[]` is truthy. Do NOT use `?? []` if you want a fallback to trigger when Sanity returns an empty list. Instead, use:
> ```tsx
> const stats = (data?.stats && data.stats.length > 0) ? data.stats : fallbackStats
> ```

---

## 3. Frontend Rendering Refactor

### Component Integration
- **`CMSImage`**: Use this as the primary component for Sanity images. It handles Next.js optimization and alt text automatically.
- **`renderText()`**: Use for all string or PortableText fields from Sanity.
- **`toImageSrc()`**: Use for background images or when you need a raw URL for third-party components.

### Hero Section Styling
When implementing multi-line titles with specific styling (e.g., orange gradients), split the title into fields in Sanity (e.g., `titleLineOne`, `titleLineTwo`) rather than using complex regex on a single string. This gives the editor granular control over layout and style.

---

## 4. Deleting Hardcoded Parts

Only delete hardcoded constants and local assets once:
1.  The Sanity document is fully verified in the Studio.
2.  The frontend is correctly fetching and rendering the CMS data.
3.  Metadata (SEO) is verified to be dynamic.

> [!TIP]
> Keep a temporary `fallback` value in the code during the transition (e.g., `const title = cmsTitle || 'Hardcoded Title'`) until you are 100% confident in the CMS data integrity across all environments.

---

## 5. Verification Checklist

- [ ] **Studio**: Check that all images are uploaded and text is correct.
- [ ] **Live Preview**: Enable Sanity Draft Mode and verify real-time updates.
- [ ] **Performance**: Ensure no "Waterfall" fetches; use a single efficient GROQ query per page.
- [ ] **SEO**: Inspect the `<head>` to ensure metadata matches the CMS `seo` field.
